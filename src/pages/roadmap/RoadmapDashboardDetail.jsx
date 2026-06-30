import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './roadmap.css'

const STAGE_LABELS = { starting: 'Just Starting Out', some_sales: 'Making Some Sales', scaling: 'Scaling Up' }

function InfoRow({ num, label, value }) {
  return (
    <div className="rm-info-row">
      <p className="rm-info-label">{num} — {label}</p>
      <p className="rm-info-val">{value}</p>
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

export default function RoadmapDashboardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('kfk_roadmap_token')
    if (!token) { navigate('/roadmap-dashboard/login'); return }

    // Fetch using admin token for the protected endpoint, fall back to public endpoint
    fetch(`/api/roadmap/submission/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id, navigate])

  if (loading) return (
    <div className="rm-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="rm-spinner" style={{ borderColor: 'rgba(17,16,14,0.15)', borderTopColor: 'var(--ink)', width: 32, height: 32 }} />
    </div>
  )

  if (!data) return (
    <div className="rm-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--muted)' }}>Client not found. <Link to="/roadmap-dashboard" style={{ color: 'var(--coral)' }}>← Back</Link></p>
    </div>
  )

  const { roadmap } = data

  return (
    <div className="rm-page">
      <header className="rm-header">
        <img src="/assets/logos/color-black-crop.png" alt="K For Kreative" />
        <Link to="/roadmap-dashboard" className="rm-header-right">← All clients</Link>
      </header>

      <div className="rm-detail">
        {/* Client hero */}
        <div className="rm-view-hero">
          <div className="rm-chip"><span className="rm-chip-dot">✦</span> Client Detail</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <h1 className="rm-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', textTransform: 'uppercase', lineHeight: 0.92 }}>
              {data.name}
            </h1>
            <span className="rm-badge" style={{ marginTop: 8, flexShrink: 0 }}>{STAGE_LABELS[data.stage] || data.stage}</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>{data.email}</p>
        </div>

        {/* Open roadmap button */}
        <div style={{ padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
          <Link to={`/roadmap/${data.id}`} target="_blank" className="rm-btn rm-btn-coral" style={{ fontSize: 13 }}>
            Open Full Roadmap ↗
          </Link>
        </div>

        {/* Client answers */}
        <InfoRow num="01" label="Brand Name"        value={data.brand_name} />
        <InfoRow num="02" label="Niche"              value={data.niche} />
        <InfoRow num="03" label="Currently Sells"    value={data.current_offers} />
        <InfoRow num="04" label="Biggest Challenge"  value={data.challenge} />
        <InfoRow num="05" label="90-Day Goal"        value={data.goal_90} />

        {/* Roadmap preview */}
        {roadmap ? (
          <div>
            <div className="rm-section">
              <p className="rm-section-label">Summary</p>
              <p className="rm-body">{roadmap.summary}</p>
              <div className="rm-gap" style={{ marginTop: 16 }}>
                <p className="rm-gap-label">Main Gap</p>
                <p className="rm-body">{roadmap.gap}</p>
              </div>
            </div>

            <div className="rm-section">
              <p className="rm-section-label">3 Quick Wins</p>
              <div className="rm-wins">
                {roadmap.quick_wins.map((w, i) => (
                  <div key={i} className="rm-win">
                    <span className="rm-win-num">{i + 1}</span>
                    <span className="rm-win-text">{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { label: 'Days 1–30 · Foundation', steps: roadmap.day30 },
              { label: 'Days 31–60 · Growth',    steps: roadmap.day60 },
              { label: 'Days 61–90 · Scale',      steps: roadmap.day90 },
            ].map(({ label, steps }) => (
              <div key={label} className="rm-section">
                <p className="rm-section-label">{label}</p>
                <StepList steps={steps} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rm-section">
            <p style={{ color: 'var(--muted)' }}>Roadmap not yet generated for this client.</p>
          </div>
        )}
      </div>

      <footer className="rm-footer">© {new Date().getFullYear()} Kforkreative · info@kforkreative.in</footer>
    </div>
  )
}
