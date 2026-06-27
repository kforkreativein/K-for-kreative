import { Link, useLocation } from 'react-router-dom'
import FooterSocialIcon from './FooterSocialIcon.jsx'

// Shared site footer used by the home page (inside the contact section),
// the service subpages, and the legal pages so every page closes with the
// same chrome and width.
export default function SiteFooter({ content }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  // On any non-home route, in-page anchors must point back to the home page.
  const hash = (target) => (isHome ? target : `/${target}`)
  const year = new Date().getFullYear()

  const socials = content?.footer?.socials || []
  const tagline =
    content?.footer?.tagline ||
    'Premium creative marketing that performs — video editing, social media, Meta ads, and conversion-built websites.'
  const copyright = content?.footer?.copyright || 'K For Kreative. All rights reserved.'

  return (
    <footer className="footer site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand" aria-label="K For Kreative home">
              <img
                src={content?.assets?.logoWhite || '/assets/logos/color-white-crop.png'}
                alt="K For Kreative"
                width={701}
                height={265}
              />
            </Link>
            <p className="footer-tagline">{tagline}</p>
            <div className="footer-contact">
              <a href="mailto:info@kforkreative.in">info@kforkreative.in</a>
              <a href="tel:+919724690118">+91 97246 90118</a>
            </div>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <div className="footer-nav-group">
              <span className="footer-nav-title">Services</span>
              <Link to="/services/video-editing">Video Editing</Link>
              <Link to="/services/social-media-management">Social Media</Link>
              <Link to="/services/meta-ads">Meta Ads</Link>
              <Link to="/services/website">Website Development</Link>
            </div>
            <div className="footer-nav-group">
              <span className="footer-nav-title">Explore</span>
              <a href={hash('#about')}>About</a>
              <a href={hash('#work')}>Work</a>
              <a href={hash('#process')}>Process</a>
              <a href={hash('#contact')}>Contact</a>
            </div>
            <div className="footer-nav-group footer-legal">
              <span className="footer-nav-title">Legal</span>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/accessibility">Accessibility</Link>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {copyright}
          </p>
          <nav className="footer-socials" aria-label="Social links">
            {socials.map((item) => {
              const isExternal = item.href.startsWith('http')

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={`${item.label}${isExternal ? ' (opens in new tab)' : ''}`}
                  {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                >
                  <FooterSocialIcon name={item.icon} sections={content?.sections} />
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
