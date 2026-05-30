import React from 'react'
import { ArrowIcon } from '../App.jsx'

export default function PremiumCTA({ content, onOpenContact }) {
  return (
    <section className="premium-cta-section" data-reveal>
      <div className="premium-cta-inner">
        <div className="premium-cta-grid">
          
          <div className="premium-cta-copy">
            <span className="premium-cta-eyebrow">START A CONVERSATION</span>
            <h2 className="premium-cta-headline">
              Ready to make your<br />
              brand look <em className="coral-italic">Premium</em><br />
              and show up<br />
              <em className="coral-italic">Consistently?</em>
            </h2>
            <p className="premium-cta-body">
              Tell us what you are building. We will reply with the clearest next step for video editing, social media management, Meta ads, or website development.
            </p>
            <div className="premium-cta-actions">
              <button className="button primary" onClick={onOpenContact}>
                Let's Talk <ArrowIcon />
              </button>
              <a className="button ghost" href={`mailto:${content?.contact?.email || 'hello@kforkreative.com'}`}>
                Email Us
              </a>
            </div>
          </div>

          <div className="premium-cta-visual">
            <div className="premium-cta-art-card">
              {/* Using a placeholder aesthetic image that matches the vibe since we don't have the original asset */}
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
                alt="Premium Creative Aesthetics" 
                className="premium-cta-img"
              />
              <div className="premium-cta-overlay-grain" />
            </div>
          </div>

        </div>
      </div>
      
      <footer className="footer" style={{ marginTop: '0', paddingTop: '80px' }}>
        <a className="footer-brand" href="#hero" aria-label="K For Kreative home">
          <img src={content?.assets?.logoWhite || '/assets/logos/color-white-crop.png'} alt="K For Kreative" />
        </a>
        <nav className="footer-socials" aria-label="Social links">
          {content?.footer?.socials?.map((item) => {
            const isExternal = item.href.startsWith('http')
            return (
              <a
                key={item.label}
                href={item.href}
                aria-label={`${item.label}${isExternal ? ' (opens in new tab)' : ''}`}
                {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
        <p className="footer-copy">
          © {new Date().getFullYear()} {content?.footer?.copyright || 'K For Kreative. All rights reserved.'}
        </p>
      </footer>
    </section>
  )
}
