import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { loadContent, saveContent } from '../lib/contentStore.js'

test('saveContent writes valid JSON and loadContent reads it back', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'kfk-content-'))
  const filePath = path.join(dir, 'content.json')

  const content = {
    meta: {
      title: 'K For Kreative | Premium Creative That Performs',
      description: 'SEO optimized social media marketing and video editing copy.',
    },
    hero: {
      headline: 'Premium Creative That Performs.',
      subhead: 'Social media marketing and video editing for growing brands.',
    },
  }

  try {
    await saveContent(filePath, content)

    const raw = await readFile(filePath, 'utf8')
    assert.match(raw, /Premium Creative That Performs/)
    assert.deepEqual(await loadContent(filePath), content)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('loadContent returns fallback content when the file is missing', async () => {
  const fallback = { hero: { headline: 'Fallback headline' } }
  const dir = await mkdtemp(path.join(tmpdir(), 'kfk-content-'))

  try {
    assert.deepEqual(await loadContent(path.join(dir, 'missing.json'), fallback), fallback)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
