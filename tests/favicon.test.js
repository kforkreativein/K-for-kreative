import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

test('html favicon points at an existing png asset', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  const faviconMatch = html.match(/<link\s+rel="icon"\s+type="image\/png"\s+href="([^"]+)"/)

  assert.ok(faviconMatch, 'missing png favicon link')

  const faviconPath = path.join(
    new URL('../public', import.meta.url).pathname,
    faviconMatch[1].replace(/^\//, ''),
  )

  await access(faviconPath)
})
