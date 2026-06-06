import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

function withEnv(values, callback) {
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]))

  Object.assign(process.env, values)

  return Promise.resolve(callback()).finally(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
  })
}

test('vercel config routes api requests before the spa fallback', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))

  assert.deepEqual(config.rewrites, [
    { source: '/api/:path*', destination: '/api/index.js' },
    { source: '/(.*)', destination: '/index.html' },
  ])
})

test('vercel api function handles admin login', async () => {
  await withEnv(
    {
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'password',
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'production',
    },
    async () => {
      const { default: app } = await import(`../api/index.js?cacheBust=${Date.now()}`)
      const server = app.listen(0)

      try {
        const { port } = server.address()
        const response = await fetch(`http://127.0.0.1:${port}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'admin', password: 'password' }),
        })
        const body = await response.json()

        assert.equal(response.status, 200)
        assert.equal(typeof body.token, 'string')
      } finally {
        await new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()))
        })
      }
    },
  )
})
