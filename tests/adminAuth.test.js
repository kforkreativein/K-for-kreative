import assert from 'node:assert/strict'
import test from 'node:test'

import { createAdminToken, getJwtSecret, verifyAdminToken } from '../lib/adminAuth.js'

test('createAdminToken signs a token that verifyAdminToken can read', () => {
  const token = createAdminToken({ username: 'admin', secret: 'test-secret' })
  const payload = verifyAdminToken(token, 'test-secret')

  assert.equal(payload.username, 'admin')
  assert.equal(payload.role, 'admin')
})

test('verifyAdminToken rejects invalid tokens', () => {
  assert.equal(verifyAdminToken('not-a-token', 'test-secret'), null)
})

test('getJwtSecret uses a local fallback in development', () => {
  assert.equal(getJwtSecret({ NODE_ENV: 'development' }), 'kfk-local-dev-secret')
})

test('getJwtSecret fails closed in production when JWT_SECRET is missing', () => {
  assert.throws(() => getJwtSecret({ NODE_ENV: 'production' }), /JWT_SECRET is not configured/)
})
