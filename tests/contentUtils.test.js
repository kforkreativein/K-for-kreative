import assert from 'node:assert/strict'
import test from 'node:test'

import { hasBracketMarkup, normalizeContent, stripBrackets, toBracketFormat } from '../lib/contentUtils.js'

test('normalizeContent converts numeric-key objects back to arrays', () => {
  const broken = {
    stats: {
      0: { value: '25+', label: 'Clients' },
      1: { value: '100+', label: 'Reels Edited' },
    },
  }

  const normalized = normalizeContent(broken)
  assert.ok(Array.isArray(normalized.stats))
  assert.equal(normalized.stats.length, 2)
})

test('stripBrackets removes all bracket markup', () => {
  const text = 'Creative systems for brands that need [attention], [consistency], and [trust].'
  assert.equal(
    stripBrackets(text),
    'Creative systems for brands that need attention, consistency, and trust.',
  )
  assert.equal(hasBracketMarkup(text), true)
})

test('toBracketFormat wraps emphasis with punctuation outside brackets', () => {
  const formatted = toBracketFormat('Premium Creative That Performs.', 'Performs.')
  assert.equal(formatted, 'Premium Creative That [Performs].')
})
