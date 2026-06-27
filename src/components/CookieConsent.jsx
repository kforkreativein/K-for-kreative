import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'kfk-cookie-consent'

// Lightweight, accessible cookie/privacy notice. The Site uses only functional
// browser storage (theme + this consent flag) and no third-party tracking, so
// the banner is an informational notice that links to the Privacy Policy.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage unavailable (e.g. privacy mode) — show the notice anyway
      setVisible(true)
    }
  }, [])

  const dismiss = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // ignore write failures
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie notice">
      <p className="cookie-consent-text">
        We use only essential cookies and local storage to remember your preferences. We do not track you or
        run advertising cookies. See our <Link to="/privacy">Privacy Policy</Link> for details.
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="cookie-consent-btn ghost" onClick={() => dismiss('declined')}>
          Decline
        </button>
        <button type="button" className="cookie-consent-btn primary" onClick={() => dismiss('accepted')}>
          Accept
        </button>
      </div>
    </div>
  )
}
