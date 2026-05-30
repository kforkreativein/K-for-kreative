import { hasBracketMarkup } from '../../lib/contentUtils.js'

function capitalizeEmphasis(matched) {
  if (!matched) return matched
  return matched.charAt(0).toUpperCase() + matched.slice(1)
}

function renderLegacyEmphasis(text, emphasis) {
  if (!text || !emphasis) return text

  const index = text.toLowerCase().indexOf(emphasis.toLowerCase())
  if (index === -1) return text

  const before = text.slice(0, index)
  const matched = text.slice(index, index + emphasis.length)
  const after = text.slice(index + emphasis.length)

  return (
    <>
      {before}
      <em>{capitalizeEmphasis(matched)}</em>
      {after}
    </>
  )
}

export default function BracketText({ text = '', emphasis = '' }) {
  if (!text) return null

  if (hasBracketMarkup(text)) {
    const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean)

    return parts.map((part, index) => {
      const match = part.match(/^\[(.+)\]$/)
      if (!match) return <span key={index}>{part}</span>

      return <em key={index}>{match[1]}</em>
    })
  }

  return renderLegacyEmphasis(text, emphasis)
}
