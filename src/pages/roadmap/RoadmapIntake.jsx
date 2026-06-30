import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './roadmap.css'

const FIELDS = [
  { num: '01', label: 'Your name',             key: 'name',           type: 'text',  ph: 'Jane Doe' },
  { num: '02', label: 'Email address',          key: 'email',          type: 'email', ph: 'you@example.com' },
  { num: '03', label: 'Business / brand name',  key: 'brand_name',     type: 'text',  ph: 'Your brand name' },
  { num: '04', label: 'Your niche',             key: 'niche',          type: 'text',  ph: 'e.g. Fitness coaching, Branding for restaurants…' },
  { num: '05', label: 'What do you sell',       key: 'current_offers', type: 'text',  ph: 'e.g. 1:1 coaching, digital products, done-for-you services…' },
]

const STAGES = [
  { value: 'starting',   label: 'Just starting out',   desc: 'Building the foundation' },
  { value: 'some_sales', label: 'Making some sales',   desc: 'Need consistency' },
  { value: 'scaling',    label: 'Scaling up',          desc: 'Ready to grow fast' },
]

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

export default function RoadmapIntake() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', brand_name: '', niche: '', current_offers: '', stage: '', challenge: '', goal_90: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.stage) { setError('Please select your business stage (question 06).'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/roadmap/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      navigate('/roadmap/thank-you')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="rm-page">
      {/* Header */}
      <header className="rm-header">
        <img src="/assets/logos/color-black-crop.png" alt="K For Kreative" />
      </header>

      {/* Hero */}
      <div className="rm-hero">
        <div className="rm-chip"><span className="rm-chip-dot">✦</span> Kforkreative Roadmap Builder</div>
        <h1 className="rm-display rm-headline">
          Before we talk,<br />
          <span className="rm-highlight">build</span>your<br />
          roadmap.
        </h1>
        <p className="rm-sub">
          Answer eight questions. We'll generate a custom 30/60/90 day plan tailored
          to your business, your stage, and your goal — ready before our call.
        </p>
      </div>

      <Ticker />

      {/* Form */}
      <form className="rm-form" onSubmit={handleSubmit}>
        {FIELDS.map(({ num, label, key, type, ph }) => (
          <div key={key} className="rm-field">
            <label className="rm-field-label">{num} — {label}</label>
            <input className="rm-input" type={type} placeholder={ph} value={form[key]}
              onChange={e => set(key, e.target.value)} required />
          </div>
        ))}

        {/* Stage */}
        <div className="rm-field">
          <label className="rm-field-label">06 — Where are you right now?</label>
          <div className="rm-stages">
            {STAGES.map(s => (
              <button type="button" key={s.value} onClick={() => set('stage', s.value)}
                className={`rm-stage-btn${form.stage === s.value ? ' active' : ''}`}>
                {s.label}
                <span className="rm-stage-desc">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Challenge */}
        <div className="rm-field">
          <label className="rm-field-label">07 — Biggest challenge right now</label>
          <textarea className="rm-input rm-textarea" placeholder="Be specific — the more detail, the better your roadmap…"
            value={form.challenge} onChange={e => set('challenge', e.target.value)} required />
        </div>

        {/* Goal */}
        <div className="rm-field">
          <label className="rm-field-label">08 — Your #1 goal for the next 90 days</label>
          <textarea className="rm-input rm-textarea" placeholder="What does success look like 90 days from now?"
            value={form.goal_90} onChange={e => set('goal_90', e.target.value)} required />
        </div>

        {/* Submit */}
        <div className="rm-submit-wrap">
          {error && <p className="rm-error">{error}</p>}
          <button type="submit" className="rm-submit" disabled={loading}>
            {loading ? <><div className="rm-spinner" />Building your roadmap…</> : 'Get My Custom Roadmap →'}
          </button>
          <p className="rm-submit-note">Takes ~15 seconds to personalise · Your info is private</p>
        </div>
      </form>

      <footer className="rm-footer">© {new Date().getFullYear()} Kforkreative · info@kforkreative.in</footer>
    </div>
  )
}
