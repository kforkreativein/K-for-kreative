import fs from 'node:fs/promises'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createAdminToken, getJwtSecret, verifyAdminToken } from '../lib/adminAuth.js'
import { loadContent, saveContent } from '../lib/contentStore.js'
import { normalizeContent } from '../lib/contentUtils.js'
import { validateContent } from '../lib/validateContent.js'
import { defaultContent } from '../src/contentFallback.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const contentPath = path.join(rootDir, 'data', 'content.json')

const app = express()

function requireAdmin(req, res, next) {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  let secret

  try {
    secret = getJwtSecret()
  } catch {
    return res.status(500).json({ error: 'Admin authentication is not configured' })
  }

  const payload = token ? verifyAdminToken(token, secret) : null

  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  req.admin = payload
  return next()
}

app.use(express.json({ limit: '12mb' }))

app.get(['/api/content', '/content'], async (_req, res, next) => {
  try {
    res.json(await loadContent(contentPath, defaultContent))
  } catch (error) {
    next(error)
  }
})

app.put(['/api/content', '/content'], requireAdmin, async (req, res, next) => {
  try {
    const normalized = normalizeContent(req.body)
    const validation = validateContent(normalized)
    if (!validation.ok) {
      return res.status(400).json({ error: validation.error })
    }

    await saveContent(contentPath, normalized)
    res.json({ ok: true, content: normalized })
  } catch (error) {
    next(error)
  }
})

app.post(['/api/admin/login', '/admin/login'], (req, res) => {
  const { username, password } = req.body || {}
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    return res.status(500).json({ error: 'Admin credentials are not configured' })
  }

  let secret
  try {
    secret = getJwtSecret()
  } catch {
    return res.status(500).json({ error: 'Admin authentication is not configured' })
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  res.json({ token: createAdminToken({ username, secret }) })
})

app.post(['/api/admin/logout', '/admin/logout'], (_req, res) => {
  res.json({ ok: true })
})

app.post(['/api/admin/upload', '/admin/upload'], requireAdmin, async (req, res, next) => {
  try {
    const { filename, dataUrl } = req.body || {}
    if (!filename || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ error: 'Invalid upload payload' })
    }

    const match = dataUrl.match(/^data:image\/([\w+.-]+);base64,(.+)$/)
    if (!match) {
      return res.status(400).json({ error: 'Only image uploads are supported' })
    }

    const extension = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase()
    const safeBase = String(filename)
      .replace(/[^a-zA-Z0-9.-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/\.[^.]+$/, '')
    const storedName = `${Date.now()}-${safeBase || 'asset'}.${extension}`
    const uploadDir = path.join(rootDir, 'public', 'assets', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, storedName), Buffer.from(match[2], 'base64'))

    res.json({ path: `/assets/uploads/${storedName}` })
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
