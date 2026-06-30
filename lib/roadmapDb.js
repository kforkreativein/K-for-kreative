import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

let _db = null

export function getDb(dataDir) {
  if (_db) return _db
  fs.mkdirSync(dataDir, { recursive: true })
  const db = new Database(path.join(dataDir, 'submissions.db'))
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id             TEXT PRIMARY KEY,
      created_at     TEXT NOT NULL,
      name           TEXT NOT NULL,
      email          TEXT NOT NULL,
      brand_name     TEXT NOT NULL,
      niche          TEXT NOT NULL,
      current_offers TEXT NOT NULL,
      stage          TEXT NOT NULL,
      challenge      TEXT NOT NULL,
      goal_90        TEXT NOT NULL,
      roadmap        TEXT,
      roadmap_at     TEXT
    )
  `)
  _db = db
  return db
}

export function insertSubmission(db, data) {
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO submissions (id, created_at, name, email, brand_name, niche, current_offers, stage, challenge, goal_90)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, now, data.name, data.email, data.brand_name, data.niche, data.current_offers, data.stage, data.challenge, data.goal_90)
  return id
}

export function updateRoadmap(db, id, roadmap) {
  db.prepare('UPDATE submissions SET roadmap = ?, roadmap_at = ? WHERE id = ?')
    .run(JSON.stringify(roadmap), new Date().toISOString(), id)
}

export function getSubmission(db, id) {
  const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(id)
  if (!row) return null
  return { ...row, roadmap: row.roadmap ? JSON.parse(row.roadmap) : null }
}

export function getAllSubmissions(db) {
  return db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all()
    .map(row => ({ ...row, roadmap: row.roadmap ? JSON.parse(row.roadmap) : null }))
}
