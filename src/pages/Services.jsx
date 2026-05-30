import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar,
  ContactSection,
  ContactFormModal,
  ArrowIcon,
  useSiteContent,
  useScrollProgress,
  useReveals
} from '../App.jsx'
import BracketText from '../components/BracketText.jsx'
import { ArtPanel, serviceSlugs } from '../App.jsx'

// Custom SVGs inside Services.jsx for consistency with ServiceIcon
function ServiceIconLocal({ type }) {
  return (
    <div className="service-icon" aria-hidden="true">
      {type === 'video' && (
        <svg viewBox="0 0 24 24">
          <rect x="4" y="3" width="11" height="18" rx="2.5" />
          <path d="M15 9.5l6-3.5v12l-6-3.5V9.5z" />
          <path className="service-icon-detail" d="M7 8h5M7 12h5" />
        </svg>
      )}
      {type === 'social' && (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="8.5" cy="9" r="1.5" />
          <circle cx="15.5" cy="8" r="1.2" />
          <circle cx="12" cy="14" r="1.4" />
          <path className="service-icon-detail" d="M5 17c2-2 4-2.5 7-2.5s5 .5 7 2.5" />
        </svg>
      )}
      {type === 'ai' && (
        <svg viewBox="0 0 24 24">
          <path d="M12 3l1.6 4.9L18 9.4l-4.4 1.6L12 16l-1.6-4.9L6 9.4l4.4-1.5L12 3z" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path className="service-icon-detail" d="M7 18h10M12 16v4" />
        </svg>
      )}
      {type === 'web' && (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 8h18" />
          <circle cx="6" cy="6" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy="6" r="0.8" fill="currentColor" stroke="none" />
          <rect className="service-icon-detail" x="6" y="11" width="8" height="2" rx="0.5" />
          <rect className="service-icon-detail" x="6" y="14.5" width="12" height="1.5" rx="0.5" />
        </svg>
      )}
    </div>
  )
}

export default function Services() {
  const content = useSiteContent()
  const progress = useScrollProgress()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(0)

  useReveals()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="paper-grain" aria-hidden="true" />
      <Navbar
        active=""
        progress={progress}
        onOpenContact={() => setIsFormOpen(true)}
        navItems={content.nav}
        logoSrc={content.assets?.logoBlack || '/assets/logos/color-black-crop.png'}
      />

      <main className="service-subpage services-catalog-page">
        {/* Services Hero Section */}
        <section className="service-hero">
          <div className="service-hero-inner">
            <span className="service-badge-glow">Services Catalog</span>
            <h1 className="service-title-h1">
              <BracketText text="Creative Growth Systems Engineered to [Convert & Scale]." />
            </h1>
            <p className="service-lead-p">
              We design and execute custom short-form video strategies, build structured content systems, run highly optimized paid acquisition campaigns, and code high-speed conversion-focused websites.
            </p>
            <div className="service-hero-actions">
              <button className="button primary" onClick={() => setIsFormOpen(true)}>
                Start a project <ArrowIcon />
              </button>
              <a href="#services-list-detail" className="button ghost">
                Explore Services <ArrowIcon />
              </a>
            </div>
          </div>
          <div className="service-hero-accent-glow" />
        </section>

        {/* Services Showcase Section */}
        <section id="services-list-detail" className="section services-section" style={{ borderTop: 'none' }}>
          <div className="section-inner services-layout">
            <div className="services-intro">
              <span className="service-badge-glow" style={{ marginBottom: '16px' }}>Solutions</span>
              <h2>
                <BracketText text="Growth tools built for modern [Founders & Brands]." />
              </h2>
              <p>
                Hover over each services capability block to preview the backend interactive pipeline. Select any service to explore individual project metrics and samples.
              </p>
              <button className="button primary" style={{ marginTop: '30px' }} onClick={() => setIsFormOpen(true)}>
                Book growth call <ArrowIcon />
              </button>
            </div>
            
            <ArtPanel src={content.sections.services} className="services-art focus-center" />

            <div className="service-list">
              {content.services.map((service, index) => (
                <Link
                  key={`${service.title}-${index}`}
                  to={`/services/${serviceSlugs[index] || ''}`}
                  className={`service-card service-tone-${index + 1} interactive-card ${hoveredIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <ServiceIconLocal type={service.icon} />
                  <span>{service.badge}</span>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                  <span className="service-card-arrow" aria-hidden="true"><ArrowIcon /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ContactSection content={content} onOpenContact={() => setIsFormOpen(true)} />
      </main>

      {isFormOpen && <ContactFormModal onClose={() => setIsFormOpen(false)} content={content} />}
    </>
  )
}
