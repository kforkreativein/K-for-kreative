import { defaultContent } from '../src/contentFallback.js'

const URL_KEY_PATTERN = /(^href$|^image$|^src$|Url$|URL$)/
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function validateUrl(value, path) {
  if (typeof value !== 'string' || value.startsWith('#') || value.startsWith('/')) {
    return null
  }

  try {
    const parsed = new URL(value)
    if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
      return `Unsafe URL protocol at ${path}`
    }
  } catch {
    return `Invalid URL at ${path}`
  }

  return null
}

function validateShape(schema, value, path = '') {
  if (Array.isArray(schema)) {
    if (!Array.isArray(value)) return `Expected array at ${path || 'content'}`
    if (!schema[0]) return null

    for (let index = 0; index < value.length; index += 1) {
      const error = validateShape(schema[0], value[index], `${path}[${index}]`)
      if (error) return error
    }

    return null
  }

  if (isPlainObject(schema)) {
    if (!isPlainObject(value)) return `Expected object at ${path || 'content'}`

    for (const key of Object.keys(schema)) {
      const nextPath = path ? `${path}.${key}` : key
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        return `Missing required field: ${nextPath}`
      }

      const error = validateShape(schema[key], value[key], nextPath)
      if (error) return error
    }

    return null
  }

  if (typeof value !== 'string') return `Expected text at ${path}`

  const lastKey = path.split('.').pop()?.replace(/\[\d+\]/g, '') || ''
  if (URL_KEY_PATTERN.test(lastKey)) {
    return validateUrl(value, path)
  }

  return null
}

export function validateContent(content) {
  const error = validateShape(defaultContent, content)
  return error ? { ok: false, error } : { ok: true }
}
