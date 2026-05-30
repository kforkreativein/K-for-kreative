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

test('getJwtSecret fails closed when JWT_SECRET is missing', () => {
  assert.throws(() => getJwtSecret({}), /JWT_SECRET is not configured/)
})
