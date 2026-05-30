import { useState } from 'react'
import { hasBracketMarkup, toBracketFormat } from '../../lib/contentUtils.js'
import { BRACKET_TEXT_KEYS, HIDDEN_FIELDS, ICON_OPTIONS, isAssetPathKey } from './contentFields.js'
import ArrayEditor from './ArrayEditor.jsx'

const LONG_TEXT_KEYS = new Set([
  'body',
  'description',
  'headline',
  'lead',
  'quote',
  'subhead',
  'supportBody',
  'panelBody',
  'briefPlaceholder',
])

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())
}

function updateObject(value, key, nextValue) {
  if (Array.isArray(value)) {
    const next = [...value]
    next[Number(key)] = nextValue
    return next
  }

  return {
    ...value,
    [key]: nextValue,
  }
}

function BracketHeadlineField({ headline, emphasis, onChange }) {
  const displayValue = hasBracketMarkup(headline) ? headline : toBracketFormat(headline, emphasis)

  return (
    <label className="admin-field">
      <span>Headline (wrap italic words in [brackets])</span>
      <textarea
        rows={3}
        value={displayValue}
        onChange={(event) => {
          const value = event.target.value
          const firstMatch = value.match(/\[(.+?)\]/)
          onChange({
            headline: value,
            emphasis: firstMatch?.[1] || '',
          })
        }}
      />
      <small className="admin-field-hint">
        Example: Creative systems for brands that need [attention], [consistency], and [trust].
      </small>
    </label>
  )
}

function BracketTextField({ label, value, onChange }) {
  return (
    <label className="admin-field">
      <span>{label} (wrap italic words in [brackets])</span>
      <textarea rows={4} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
      <small className="admin-field-hint">Example: [K For Kreative] gave our brand a sharper visual presence.</small>
    </label>
  )
}

function AssetPathField({ label, value, onChange, authToken }) {
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError('')
    setIsUploading(true)

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Could not read file'))
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      })

      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Upload failed')

      onChange(body.path)
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <label className="admin-field">
      <span>{label}</span>
      <input value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder="/assets/logos/color-black-crop.png" />
      <input type="file" accept="image/*,.ico" onChange={handleUpload} disabled={isUploading} />
      <small className="admin-field-hint">
        {isUploading ? 'Uploading...' : 'Paste a path or upload a logo / favicon image.'}
      </small>
      {uploadError && <small className="admin-error">{uploadError}</small>}
    </label>
  )
}

export default function SectionEditor({ value, onChange, showBracketHeadline = false, authToken = '', sectionKey = '' }) {
  if (Array.isArray(value)) {
    return <ArrayEditor label="Items" value={value} onChange={onChange} />
  }

  if (!value || typeof value !== 'object') {
    return null
  }

  const hasHeadlinePair = showBracketHeadline && 'headline' in value && 'emphasis' in value

  return (
    <div className="admin-section-editor">
      {hasHeadlinePair && (
        <BracketHeadlineField
          headline={value.headline}
          emphasis={value.emphasis}
          onChange={(parsed) => onChange({ ...value, ...parsed })}
        />
      )}

      {Object.entries(value).map(([key, fieldValue]) => {
        if (HIDDEN_FIELDS.has(key)) return null
        if (hasHeadlinePair && key === 'headline') return null

        const label = formatLabel(key)

        if (key === 'icon') {
          return (
            <label className="admin-field" key={key}>
              <span>Icon</span>
              <select value={fieldValue ?? ICON_OPTIONS[0]} onChange={(event) => onChange(updateObject(value, key, event.target.value))}>
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <small className="admin-field-hint">Icon must match the platform: portfolio, instagram, linkedin, whatsapp, email.</small>
            </label>
          )
        }

        if (Array.isArray(fieldValue)) {
          return (
            <ArrayEditor
              key={key}
              label={label}
              value={fieldValue}
              onChange={(nextValue) => onChange(updateObject(value, key, nextValue))}
            />
          )
        }

        if (fieldValue && typeof fieldValue === 'object') {
          return (
            <fieldset className="admin-fieldset" key={key}>
              <legend>{label}</legend>
              <SectionEditor
                value={fieldValue}
                onChange={(nextValue) => onChange(updateObject(value, key, nextValue))}
                showBracketHeadline={key === 'intro' || key === 'hero' || key === 'about' || key === 'work' || key === 'process' || key === 'proof' || key === 'contact' || key === 'form' || key === 'videoEditing' || key === 'socialMedia' || key === 'metaAds' || key === 'websiteDev'}
                authToken={authToken}
                sectionKey={key}
              />
            </fieldset>
          )
        }

        if (BRACKET_TEXT_KEYS.has(key)) {
          return (
            <BracketTextField
              key={key}
              label={label}
              value={fieldValue}
              onChange={(nextValue) => onChange(updateObject(value, key, nextValue))}
            />
          )
        }

        if (isAssetPathKey(key)) {
          return (
            <AssetPathField
              key={key}
              label={label}
              value={fieldValue}
              authToken={authToken}
              onChange={(nextValue) => onChange(updateObject(value, key, nextValue))}
            />
          )
        }

        const Field = LONG_TEXT_KEYS.has(key) || String(fieldValue ?? '').length > 95 ? 'textarea' : 'input'

        return (
          <label className="admin-field" key={key}>
            <span>{label}</span>
            <Field
              rows={Field === 'textarea' ? 4 : undefined}
              value={fieldValue ?? ''}
              onChange={(event) => onChange(updateObject(value, key, event.target.value))}
            />
          </label>
        )
      })}
    </div>
  )
}
