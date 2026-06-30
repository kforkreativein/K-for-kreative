import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './roadmap.css'

const STAGE_LABELS = { starting: 'Starting', some_sales: 'Some Sales', scaling: 'Scaling' }

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function RoadmapDashboard() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = sessionStorage.getItem('kfk_roadmap_token')
    if (!token) { navigate('/roadmap-dashboard/login'); return }

    fetch('/api/roadmap/submissions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.status === 401) { navigate('/roadmap-dashboard/login'); return null }
        return r.json()
      })
      .then(d => { if (d) setRows(d); setLoading(false) })
      .catch(() => { setError('Failed to load submissions.'); setLoading(false) })
  }, [navigate])

  function handleLogout() {
    sessionStorage.removeItem('kfk_roadmap_token')
    navigate('/roadmap-dashboard/login')
  }

  if (loading) return (
    <div className="rm-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="rm-spinner" style={{ borderColor: 'rgba(17,16,14,0.12)', borderTopColor: '#11100e', width: 36, height: 36, borderWidth: 3 }} />
    </div>
  )

  return (
    <div className="rm-page">
      <header className="rm-header">
        <img src="/assets/logos/color-black-crop.png" alt="K For Kreative" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/roadmap" className="rm-header-right">Intake Form ↗</Link>
          <button onClick={handleLogout} className="rm-header-right" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
            Log out
          </button>
        </div>
      </header>

      <div className="rm-dash">
        <div className="rm-dash-hero">
          <div>
            <div className="rm-chip" style={{ marginBottom: 20 }}>
              <span className="rm-chip-dot">✦</span> Dashboard
            </div>
            <h1 className="rm-display" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', lineHeight: 0.92, textTransform: 'uppercase' }}>
              Client<br /><span className="rm-highlight">Roadmaps.</span>
            </h1>
          </div>
          <span className="rm-count">{String(rows.length).padStart(2, '0')}</span>
        </div>

        {error && <p className="rm-error" style={{ paddingTop: 24 }}>{error}</p>}

        {rows.length === 0 && !error ? (
          <div style={{ padding: '64px 0', textAlign: 'center', borderTop: '1px solid rgba(17,16,14,0.1)' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#11100e', marginBottom: 8 }}>No submissions yet</p>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Share the intake form with your clients to get started.</p>
            <Link to="/roadmap" className="rm-btn rm-btn-coral" style={{ fontSize: 13 }}>Open Intake Form →</Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="rm-table-wrap">
              <table className="rm-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Brand / Niche</th>
                    <th>Stage</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td>
                        <div className="rm-client-name">{row.name}</div>
                        <div className="rm-client-email">{row.email}</div>
                      </td>
                      <td>
                        <div className="rm-brand">{row.brand_name}</div>
                        <div className="rm-niche">{row.niche}</div>
                      </td>
                      <td><span className="rm-badge">{STAGE_LABELS[row.stage] || row.stage}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{fmt(row.created_at)}</td>
                      <td>
                        <span className="rm-ready">
                          <span className="rm-ready-dot" style={{ background: row.roadmap ? '#22c55e' : 'rgba(17,16,14,0.15)' }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: row.roadmap ? '#15803d' : 'var(--muted)' }}>
                            {row.roadmap ? 'Ready' : 'Pending'}
                          </span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <Link to={`/roadmap/${row.id}`} target="_blank" className="rm-btn rm-btn-coral">Roadmap ↗</Link>
                          <Link to={`/roadmap-dashboard/${row.id}`} className="rm-btn rm-btn-outline">Details</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="rm-cards">
              {rows.map(row => (
                <div key={row.id} className="rm-card">
                  <div className="rm-card-top">
                    <div>
                      <div className="rm-client-name">{row.name}</div>
                      <div className="rm-client-email">{row.email}</div>
                    </div>
                    <span className="rm-ready">
                      <span className="rm-ready-dot" style={{ background: row.roadmap ? '#22c55e' : 'rgba(17,16,14,0.15)' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: row.roadmap ? '#15803d' : 'var(--muted)' }}>
                        {row.roadmap ? 'Ready' : 'Pending'}
                      </span>
                    </span>
                  </div>
                  <div className="rm-brand" style={{ marginBottom: 2 }}>{row.brand_name}</div>
                  <div className="rm-niche" style={{ marginBottom: 10 }}>{row.niche}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span className="rm-badge">{STAGE_LABELS[row.stage]}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{fmt(row.created_at)}</span>
                  </div>
                  <div className="rm-card-actions">
                    <Link to={`/roadmap/${row.id}`} target="_blank" className="rm-btn rm-btn-coral" style={{ flex: 1, textAlign: 'center' }}>Roadmap ↗</Link>
                    <Link to={`/roadmap-dashboard/${row.id}`} className="rm-btn rm-btn-outline">Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="rm-footer">© {new Date().getFullYear()} Kforkreative · info@kforkreative.in</footer>
    </div>
  )
}
