import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

export async function loadContent(filePath, fallback = {}) {
  try {
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return fallback
    }

    throw error
  }
}

export async function saveContent(filePath, content) {
  const directory = path.dirname(filePath)
  const tempPath = path.join(directory, `.content-${Date.now()}.tmp`)
  const body = `${JSON.stringify(content, null, 2)}\n`

  await mkdir(directory, { recursive: true })
  await writeFile(tempPath, body, 'utf8')
  await rename(tempPath, filePath)
}
