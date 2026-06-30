import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './roadmap.css'

export default function RoadmapDashboardLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/roadmap/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Incorrect password.')
        setLoading(false)
        return
      }
      sessionStorage.setItem('kfk_roadmap_token', data.token)
      navigate('/roadmap-dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="rm-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="rm-header">
        <img src="/assets/logos/color-black-crop.png" alt="K For Kreative" />
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Chip */}
          <div className="rm-chip" style={{ marginBottom: 28 }}>
            <span className="rm-chip-dot">✦</span> Dashboard Access
          </div>

          {/* Headline */}
          <h1 className="rm-display rm-headline" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', marginBottom: 40 }}>
            Admin<br />
            <span className="rm-highlight">Login.</span>
          </h1>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="rm-field" style={{ borderTop: '1px solid rgba(17,16,14,0.1)', paddingTop: 28 }}>
              <label className="rm-field-label">01 — Password</label>
              <input
                type="password"
                className="rm-input"
                placeholder="Enter your dashboard password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                required
              />
              {error && (
                <p className="rm-error" style={{ marginTop: 12 }}>{error}</p>
              )}
            </div>

            <div className="rm-submit-wrap">
              <button type="submit" className="rm-submit" disabled={loading}>
                {loading
                  ? <><div className="rm-spinner" /> Checking…</>
                  : 'Access Dashboard →'}
              </button>
            </div>
          </form>

          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
            Set <code style={{ background: 'rgba(17,16,14,0.06)', padding: '1px 6px', borderRadius: 4 }}>ROADMAP_PASSWORD</code> in your <code style={{ background: 'rgba(17,16,14,0.06)', padding: '1px 6px', borderRadius: 4 }}>.env.local</code> file.
          </p>
        </div>
      </div>

      <footer className="rm-footer">© {new Date().getFullYear()} Kforkreative · info@kforkreative.in</footer>
    </div>
  )
}
