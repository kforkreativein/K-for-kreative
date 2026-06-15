import { useEffect, useMemo, useRef, useState } from 'react'
import { normalizeContent } from '../../lib/contentUtils.js'
import { defaultContent } from '../siteData.js'

const BRACKET_HEADLINE_OBJECTS = new Set([
  'hero',
  'about',
  'work',
  'process',
  'proof',
  'contact',
  'form',
  'videoEditing',
  'socialMedia',
  'metaAds',
  'websiteDev',
])
import Login from './Login.jsx'
import SectionEditor from './SectionEditor.jsx'

const SECTION_LABELS = {
  meta: 'SEO / Meta',
  assets: 'Brand Assets',
  nav: 'Navigation',
  hero: 'Hero + Stats',
  about: 'About',
  services: 'Services (Intro + Items)',
  work: 'Work',
  process: 'Process',
  proof: 'Proof',
  stories: 'Stories',
  faq: 'FAQ',
  contact: 'Contact',
  footer: 'Footer',
  form: 'Lead Form',
  sections: 'Section Images & Social Icons',
  videoEditing: 'Page: Video Editing',
  socialMedia: 'Page: Social Media',
  metaAds: 'Page: Meta Ads',
  websiteDev: 'Page: Website Development',
}

// Map service page keys to their routes for live preview
const SECTION_TO_ROUTE = {
  videoEditing: '/services/video-editing',
  socialMedia: '/services/social-media-management',
  metaAds: '/services/meta-ads',
  websiteDev: '/services/website',
}

function updateContent(content, key, value) {
  return {
    ...content,
    [key]: value,
  }
}

export default function AdminApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem('kfk_admin_token') || '')
  const [content, setContent] = useState(defaultContent)
  const [activeKey, setActiveKey] = useState('hero')
  const [status, setStatus] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [previewKey, setPreviewKey] = useState(Date.now())
  const previewTimerRef = useRef(null)

  useEffect(
    () => () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
    },
    [],
  )

  const sectionKeys = useMemo(
    () => Object.keys(SECTION_LABELS).filter((key) => Object.prototype.hasOwnProperty.call(content, key)),
    [content],
  )

  useEffect(() => {
    if (!token) return

    async function loadContent() {
      setStatus('Loading latest content...')
      try {
        const response = await fetch('/api/content', { cache: 'no-store' })
        if (!response.ok) throw new Error('Could not load website content')
        const body = await response.json()
        setContent(normalizeContent(body))
        setStatus('')
      } catch (error) {
        setStatus(error.message)
      }
    }

    loadContent()
  }, [token])

  function handleLogout() {
    sessionStorage.removeItem('kfk_admin_token')
    setToken('')
  }

  function refreshPreview(delay = 350) {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
    previewTimerRef.current = setTimeout(() => setPreviewKey(Date.now()), delay)
  }

  function handleSectionChange(nextValue) {
    const nextContent = updateContent(content, activeKey, nextValue)
    setContent(nextContent)
    setIsDirty(true)
    sessionStorage.setItem('kfk_preview_content', JSON.stringify(nextContent))
    refreshPreview()
  }

  async function handleSave() {
    setStatus('Saving...')

    const payload = normalizeContent(content)

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Save failed')

      const saved = normalizeContent(body.content)
      setContent(saved)
      setIsDirty(false)
      sessionStorage.setItem('kfk_preview_content', JSON.stringify(saved))
      setPreviewKey(Date.now())
      setStatus('Saved and published.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  if (!token) return <Login onLogin={setToken} />

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/">
          <img src="/assets/logos/color-black-crop.png" alt="K For Kreative" />
        </a>
        <p>Website Editor</p>

        <nav aria-label="Admin sections">
          {sectionKeys.map((key) => (
            <button
              className={key === activeKey ? 'active' : ''}
              key={key}
              type="button"
              onClick={() => setActiveKey(key)}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>{isDirty ? 'Unsaved changes' : 'All changes saved'}</span>
            <h1>{SECTION_LABELS[activeKey]}</h1>
          </div>
          <div className="admin-topbar-actions">
            {status && <p className="admin-status">{status}</p>}
            <button className="admin-secondary" type="button" onClick={handleLogout}>
              Logout
            </button>
            <button type="button" onClick={handleSave} disabled={!isDirty}>
              Save & Publish
            </button>
          </div>
        </header>

        <div className="admin-workspace">
          <section className="admin-editor-card">
            <SectionEditor
              value={content[activeKey]}
              onChange={handleSectionChange}
              showBracketHeadline={BRACKET_HEADLINE_OBJECTS.has(activeKey)}
              authToken={token}
              sectionKey={activeKey}
            />
            <div className="admin-editor-actions">
              <button type="button" onClick={handleSave} disabled={!isDirty}>
                Save section changes
              </button>
            </div>
          </section>

          <section className="admin-preview">
            <div className="admin-preview-header">
              <span>Live Preview</span>
              <a href={`/?preview=1&t=${previewKey}&route=${encodeURIComponent(SECTION_TO_ROUTE[activeKey] || '/')}`} target="_blank" rel="noreferrer">
                Open preview
              </a>
            </div>
            <iframe
              key={`${previewKey}-${activeKey}`}
              title="K For Kreative preview"
              src={`/?preview=1&t=${previewKey}&route=${encodeURIComponent(SECTION_TO_ROUTE[activeKey] || '/')}`}
            />
          </section>
        </div>
      </section>
    </main>
  )
}
