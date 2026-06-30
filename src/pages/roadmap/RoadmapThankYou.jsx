import { Link } from 'react-router-dom'
import './roadmap.css'

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

export default function RoadmapThankYou() {
  return (
    <div className="rm-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="rm-header">
        <img src="/assets/logos/color-black-crop.png" alt="K For Kreative" />
      </header>

      <div className="rm-hero" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="rm-chip"><span className="rm-chip-dot">✦</span> Roadmap Ready</div>
        <h1 className="rm-display rm-headline">
          Your custom<br />
          <span className="rm-highlight">roadmap</span>is<br />
          ready.
        </h1>
        <p className="rm-sub" style={{ marginBottom: 36 }}>
          We'll walk through it together, step by step, on your call. See you soon.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="https://calendly.com/kforkreativein/ai-avatar-video" target="_blank" rel="noopener noreferrer"
            className="rm-submit" style={{ width: 'auto', textDecoration: 'none' }}>
            Book Your Call →
          </a>
          <Link to="/roadmap"
            style={{ padding: '18px 24px', border: '1.5px solid var(--line)', fontSize: 14, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--ink)' }}>
            Submit Another Form
          </Link>
        </div>
      </div>

      <Ticker />
      <footer className="rm-footer">© {new Date().getFullYear()} Kforkreative · info@kforkreative.in</footer>
    </div>
  )
}
