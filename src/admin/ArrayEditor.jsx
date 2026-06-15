import SectionEditor from './SectionEditor.jsx'

function cloneTemplate(value) {
  if (Array.isArray(value)) return []
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneTemplate(item)]))
  }
  return ''
}

export default function ArrayEditor({ label, value = [], onChange, authToken = '', sectionKey = '' }) {
  const addItem = () => {
    const template = value[0] ? cloneTemplate(value[0]) : ''
    onChange([...value, template])
  }

  const updateItem = (index, nextValue) => {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? nextValue : item)))
  }

  const removeItem = (index) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index))
  }

  const moveItem = (index, direction) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= value.length) return

    const next = [...value]
    const [item] = next.splice(index, 1)
    next.splice(nextIndex, 0, item)
    onChange(next)
  }

  return (
    <div className="admin-array">
      <div className="admin-array-header">
        <span>{label}</span>
        <button type="button" onClick={addItem}>Add</button>
      </div>

      {value.map((item, index) => (
        <div className="admin-array-item" key={index}>
          <div className="admin-array-actions">
            <strong>{label} #{index + 1}</strong>
            <div>
              <button type="button" onClick={() => moveItem(index, -1)}>Up</button>
              <button type="button" onClick={() => moveItem(index, 1)}>Down</button>
              <button type="button" onClick={() => removeItem(index)}>Remove</button>
            </div>
          </div>

          {item && typeof item === 'object' && !Array.isArray(item) ? (
            <SectionEditor
              value={item}
              onChange={(nextValue) => updateItem(index, nextValue)}
              authToken={authToken}
              sectionKey={sectionKey}
            />
          ) : (
            <input value={item ?? ''} onChange={(event) => updateItem(index, event.target.value)} />
          )}
        </div>
      ))}
    </div>
  )
}
