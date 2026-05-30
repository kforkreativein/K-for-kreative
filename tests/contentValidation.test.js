import assert from 'node:assert/strict'
import test from 'node:test'

import { validateContent } from '../lib/validateContent.js'
import { defaultContent } from '../src/contentFallback.js'

test('validateContent accepts the default website content schema', () => {
  assert.deepEqual(validateContent(defaultContent), { ok: true })
})

test('validateContent rejects missing required content keys', () => {
  const invalid = structuredClone(defaultContent)
  delete invalid.hero.headline

  assert.deepEqual(validateContent(invalid), {
    ok: false,
    error: 'Missing required field: hero.headline',
  })
})

test('validateContent rejects unsafe social link protocols', () => {
  const invalid = structuredClone(defaultContent)
  invalid.footer.socials[0].href = 'javascript:alert(1)'

  assert.deepEqual(validateContent(invalid), {
    ok: false,
    error: 'Unsafe URL protocol at footer.socials[0].href',
  })
})
