const ARRAY_KEYS = new Set([
  'nav',
  'stats',
  'services',
  'clients',
  'testimonials',
  'filters',
  'items',
  'steps',
  'points',
  'metrics',
  'socials',
  'projectOptions',
])

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function objectToArray(value) {
  if (Array.isArray(value)) return value.map(normalizeValue)
  if (!isPlainObject(value)) return value

  const numericKeys = Object.keys(value).filter((key) => /^\d+$/.test(key))
  if (numericKeys.length === 0) return value

  return numericKeys
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => normalizeValue(value[key]))
}

function normalizeValue(value, key = '') {
  if (ARRAY_KEYS.has(key)) {
    return objectToArray(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item))
  }

  if (!isPlainObject(value)) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, entryValue]) => [entryKey, normalizeValue(entryValue, entryKey)]),
  )
}

export function hasBracketMarkup(text = '') {
  return typeof text === 'string' && /\[[^\]]+\]/.test(text)
}

export function stripBrackets(text = '') {
  if (typeof text !== 'string') return text
  return text.replace(/\[(.+?)\]/g, '$1')
}

export function normalizeContent(content) {
  if (!content || typeof content !== 'object') return content
  return normalizeValue(structuredClone(content))
}

export function toBracketFormat(headline = '', emphasis = '') {
  if (!emphasis || !headline) return headline

  const trailingMatch = emphasis.match(/^(.*?)([.,!?;:]+)$/)
  if (trailingMatch) {
    const [, core, punctuation] = trailingMatch
    const coreIndex = headline.toLowerCase().indexOf(core.toLowerCase())
    if (coreIndex !== -1) {
      const afterCore = headline.slice(coreIndex + core.length, coreIndex + core.length + punctuation.length)
      if (afterCore === punctuation) {
        const before = headline.slice(0, coreIndex)
        const matched = headline.slice(coreIndex, coreIndex + core.length)
        const after = headline.slice(coreIndex + core.length)
        return `${before}[${matched}]${after}`
      }
    }
  }

  const directIndex = headline.toLowerCase().indexOf(emphasis.toLowerCase())
  if (directIndex !== -1) {
    const before = headline.slice(0, directIndex)
    const matched = headline.slice(directIndex, directIndex + emphasis.length)
    const after = headline.slice(directIndex + emphasis.length)
    return `${before}[${matched}]${after}`
  }

  const core = emphasis.replace(/[.,!?;:]+$/, '')
  const coreIndex = headline.toLowerCase().indexOf(core.toLowerCase())
  if (coreIndex === -1) return `${headline} [${emphasis}]`

  const before = headline.slice(0, coreIndex)
  const matched = headline.slice(coreIndex, coreIndex + core.length)
  const after = headline.slice(coreIndex + core.length)
  return `${before}[${matched}]${after}`
}

export function fromBracketFormat(text = '') {
  const match = text.match(/\[(.+?)\]/)
  if (!match) {
    return { headline: text, emphasis: '' }
  }

  const emphasisCore = match[1]
  const headline = text.replace(`[${emphasisCore}]`, emphasisCore)
  const bracketEnd = text.indexOf(']') + 1
  const trailing = text.slice(bracketEnd).match(/^[.,!?;:]*/)?.[0] || ''
  const emphasis = `${emphasisCore}${trailing}`

  return { headline, emphasis }
}
