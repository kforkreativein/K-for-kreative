import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './roadmap.css'

const STAGE_LABELS = { starting: 'Just Starting Out', some_sales: 'Making Some Sales', scaling: 'Scaling Up' }
const TICKER = ['PERSONALIZED PLAN', '30 · 60 · 90 DAYS', '3 QUICK WINS', 'NO GENERIC ADVICE', 'BUILT FOR YOUR NICHE', 'READY BEFORE YOUR CALL']

function Ticker() {
  const strip = TICKER.map((t, i) => (
    <span key={i} className="rm-ticker-item">{t}<span className="rm-ticker-sep">✦</span></span>
  ))
  return (
    <div className="rm-ticker">
      <div className="rm-ticker-track">{strip}{strip}</div>
    </div>
  )
}

function StepList({ steps }) {
  return (
    <ul className="rm-steps">
      {steps.map((s, i) => (
        <li key={i} className="rm-step">
          <span className="rm-step-dot"><span className="rm-step-inner" /></span>
          <span className="rm-step-text">{s}</span>
        </li>
      ))}
    </ul>
  )
}

export default function RoadmapView() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/roadmap/submission/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadPdf() { window.print() }

  if (loading) return (
    <div className="rm-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="rm-spinner" style={{ borderColor: 'rgba(17,16,14,0.15)', borderTopColor: 'var(--ink)', width: 32, height: 32 }} />
    </div>
  )

  if (!data) return (
    <div className="rm-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 18, color: 'var(--muted)' }}>Roadmap not found.</p>
      <Link to="/roadmap" style={{ color: 'var(--coral)', fontWeight: 700 }}>← Back to form</Link>
    </div>
  )

  const { roadmap } = data

  return (
    <div className="rm-page">
      {/* Header */}
      <header className="rm-header">
        <img src="/assets/logos/color-black-crop.png" alt="K For Kreative" />
        <span className="rm-header-right">Custom Roadmap</span>
      </header>

      <div className="rm-view">
        {/* Client hero */}
        <div className="rm-view-hero">
          <div className="rm-chip"><span className="rm-chip-dot">✦</span> Built for {data.name}</div>
          <h1 className="rm-display rm-headline" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}>
            Your 90-day<br />
            <span className="rm-highlight">growth</span><br />
            roadmap.
          </h1>
          <div className="rm-tags">
            <span className="rm-tag">{data.brand_name}</span>
            <span className="rm-tag">{data.niche}</span>
            <span className="rm-tag">{STAGE_LABELS[data.stage] || data.stage}</span>
          </div>
        </div>

        {/* Action bar — copy link + PDF */}
        <div className="rm-actions">
          <button className={`rm-action-btn${copied ? ' copied' : ''}`} onClick={copyLink}>
            {copied ? '✓ Link Copied!' : '⎘ Copy Shareable Link'}
          </button>
          <button className="rm-action-btn" onClick={downloadPdf}>
            ↓ Download PDF
          </button>
        </div>

        {!roadmap ? (
          <div className="rm-section">
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>Your roadmap is being generated. Refresh in a moment.</p>
          </div>
        ) : (
          <>
            {/* Where you are now */}
            <div className="rm-section">
              <p className="rm-section-label">Where you are now</p>
              <p className="rm-body">{roadmap.summary}</p>
              <div className="rm-gap">
                <p className="rm-gap-label">Main Gap</p>
                <p className="rm-body">{roadmap.gap}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Ticker divider */}
      {roadmap && <Ticker />}

      {roadmap && (
        <div className="rm-view">
          {/* Quick wins */}
          <div className="rm-section">
            <p className="rm-section-label">3 quick wins — start today</p>
            <div className="rm-wins">
              {roadmap.quick_wins.map((w, i) => (
                <div key={i} className="rm-win">
                  <span className="rm-win-num">{i + 1}</span>
                  <span className="rm-win-text">{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 30-day */}
          <div className="rm-section">
            <p className="rm-section-label">Days 1–30 · Foundation</p>
            <h2 className="rm-display rm-section-title">Build the base.</h2>
            <StepList steps={roadmap.day30} />
          </div>

          {/* 60-day */}
          <div className="rm-section">
            <p className="rm-section-label">Days 31–60 · Growth</p>
            <h2 className="rm-display rm-section-title">Pick up speed.</h2>
            <StepList steps={roadmap.day60} />
          </div>

          {/* 90-day */}
          <div className="rm-section">
            <p className="rm-section-label">Days 61–90 · Scale</p>
            <h2 className="rm-display rm-section-title">Hit the goal.</h2>
            <StepList steps={roadmap.day90} />
          </div>

          {/* Book a call CTA */}
          <div className="rm-cta">
            <p className="rm-cta-label">Ready to move?</p>
            <a href="https://calendly.com/kforkreativein/ai-avatar-video" target="_blank" rel="noopener noreferrer" className="rm-cta-btn">
              Book Your Strategy Call →
            </a>
            <p className="rm-cta-sub">We'll walk through this roadmap together, step by step.</p>
          </div>
        </div>
      )}

      <footer className="rm-footer">© {new Date().getFullYear()} Kforkreative · info@kforkreative.in</footer>
    </div>
  )
}
