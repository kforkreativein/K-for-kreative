import fs from 'node:fs/promises'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createAdminToken, getJwtSecret, verifyAdminToken } from '../lib/adminAuth.js'
import { loadContent, saveContent } from '../lib/contentStore.js'
import { normalizeContent } from '../lib/contentUtils.js'
import { validateContent } from '../lib/validateContent.js'
import { defaultContent } from '../src/contentFallback.js'
import { getDb, insertSubmission, updateRoadmap, getSubmission, getAllSubmissions } from '../lib/roadmapDb.js'
import { generateRoadmap } from '../lib/generateRoadmap.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const contentPath = path.join(rootDir, 'data', 'content.json')
const db = getDb(path.join(rootDir, 'data'))

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

// ── Roadmap Builder ──────────────────────────────────────────────────────────

function requireRoadmapAuth(req, res, next) {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const pwd = process.env.ROADMAP_PASSWORD
  if (pwd && token === pwd) return next()
  try {
    const secret = getJwtSecret()
    const payload = token ? verifyAdminToken(token, secret) : null
    if (payload?.role === 'admin') return next()
  } catch {}
  return res.status(401).json({ error: 'Unauthorized' })
}

app.post(['/api/roadmap/auth', '/roadmap/auth'], (req, res) => {
  const { password } = req.body || {}
  const expected = process.env.ROADMAP_PASSWORD
  if (!expected) return res.status(500).json({ error: 'ROADMAP_PASSWORD not set in .env.local' })
  if (password !== expected) return res.status(401).json({ error: 'Incorrect password.' })
  res.json({ token: expected })
})

app.post(['/api/roadmap/submit', '/roadmap/submit'], async (req, res, next) => {
  try {
    const { name, email, brand_name, niche, current_offers, stage, challenge, goal_90 } = req.body || {}
    if (!name || !email || !brand_name || !niche || !current_offers || !stage || !challenge || !goal_90) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    const id = insertSubmission(db, { name, email, brand_name, niche, current_offers, stage, challenge, goal_90 })
    const roadmap = await generateRoadmap({ name, email, brand_name, niche, current_offers, stage, challenge, goal_90 })
    if (roadmap) updateRoadmap(db, id, roadmap)
    res.json({ id })
  } catch (error) {
    next(error)
  }
})

app.get(['/api/roadmap/submission/:id', '/roadmap/submission/:id'], (req, res) => {
  const row = getSubmission(db, req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found.' })
  res.json(row)
})

app.get(['/api/roadmap/submissions', '/roadmap/submissions'], requireRoadmapAuth, (_req, res) => {
  res.json(getAllSubmissions(db))
})

// ─────────────────────────────────────────────────────────────────────────────

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
