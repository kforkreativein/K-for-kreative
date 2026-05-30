import { useEffect, useState } from 'react'
import {
  Navbar,
  ContactFormModal,
  ArrowIcon,
  ServicePager,
  useSiteContent,
  useScrollProgress,
  useReveals,
  ContactSection
} from '../App.jsx'
import BracketText from '../components/BracketText.jsx'
import { ServiceArtBand } from '../components/ServiceArt.jsx'

export default function WebsiteDev() {
  const content = useSiteContent()
  const pageContent = content.websiteDev || {}
  const progress = useScrollProgress()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeSiteIndex, setActiveSiteIndex] = useState(0)
  const pageImages = pageContent.images || {}
  const ctaContent = {
    eyebrow: 'Start website project',
    headline: 'Ready for a website built to [convert traffic]?',
    emphasis: 'convert traffic',
    body: 'Share your offer, pages, references, and conversion goal. We will shape the structure, design direction, and build plan for a fast, premium website.',
    ctaPrimary: pageContent.ctaPrimary || 'Start website project',
    ctaSecondary: 'Email Us',
    email: content.contact.email
  }

  useReveals()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const showcaseSites = (pageContent.sites || [
    {
      title: 'Krish Live',
      role: 'Portfolio',
      url: 'https://www.krishchhatrala.live/',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
      desc: 'A premium, high-speed personal brand portfolio website featuring smooth scroll effects and minimal aesthetics.'
    },
    {
      title: 'KFK Hub',
      role: 'Agency Site',
      url: 'https://krishchhatrala.live/',
      img: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2000&auto=format&fit=crop',
      desc: 'Conversion-focused agency landing page built with custom layouts, asset loaders, and intake forms.'
    },
    {
      title: 'Wellness',
      role: 'Sales Page',
      url: 'https://krishchhatrala.live/',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop',
      desc: 'Optimized checkouts and landing grids tailored to drive wellness products subscriptions and conversions.'
    }
  ]).map((site) => ({
    ...site,
    img: site.img || site.image,
    url: site.url || '#'
  }))

  const processSteps = pageContent.processSteps || [
    {
      step: '01',
      title: 'Discovery & Architecture',
      desc: 'We research your brand, map the user journey, and architect a site structure optimized for conversions and search discovery.'
    },
    {
      step: '02',
      title: 'Design System Build',
      desc: 'We craft a premium visual design system with typography, color tokens, and component patterns that elevate brand perception.'
    },
    {
      step: '03',
      title: 'Development & Performance',
      desc: 'We build with clean React or vanilla code, optimize every asset, and engineer for sub-second load times and 99+ Lighthouse scores.'
    },
    {
      step: '04',
      title: 'Launch & Handover',
      desc: 'We handle DNS, deployment, and final QA across devices. Then we hand over full ownership with documentation and ongoing support.'
    }
  ]

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

      <main className="service-subpage web-page" style={{ '--hero-accent-rgb': '93, 167, 122', '--step-accent-rgb': '93, 167, 122', '--section-accent-rgb': '93, 167, 122', '--benefit-accent-rgb': '93, 167, 122' }}>
        {/* Hero Section */}
        <section className="service-hero centered" style={{ '--hero-accent-rgb': '93, 167, 122' }}>
          <div className="service-hero-inner centered">
            <span className="service-badge-glow">{pageContent.badge || 'Web Engineering'}</span>
            <h1 className="service-title-h1">
              <BracketText text={pageContent.headline || 'Conversion-Focused Websites Built to [Convert Traffic].'} emphasis={pageContent.emphasis} />
            </h1>
            <p className="service-lead-p">
              {pageContent.lead || 'We design and build custom desktop and mobile websites optimized for page load speed, search engine discoverability, and turning active traffic into inquiries.'}
            </p>
            <div className="service-hero-actions">
              <button className="button primary" onClick={() => setIsFormOpen(true)}>
                {pageContent.ctaPrimary || 'Build a website'} <ArrowIcon />
              </button>
              <a href="#showcase" className="button ghost">
                {pageContent.ctaSecondary || 'Try Live Website Mockups'} <ArrowIcon />
              </a>
            </div>
          </div>
          <ServiceArtBand
            src={pageImages.hero}
            variant="hero"
            className="web-service-art"
          />
          <div className="service-hero-accent-glow" style={{ background: 'radial-gradient(circle, rgba(93, 167, 122, 0.18), transparent 68%)' }} />
        </section>

        {/* Live Website Mockups Showcase Section */}
        <section id="showcase" className="web-showcase-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.sitesEyebrow || 'Live Sites'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.sitesHeadline || 'Live Website Showcase'} />
              </h2>
              <p>{pageContent.sitesBody || 'A selection of high-performance websites we have designed, developed, and launched for clients.'}</p>
            </div>
            {/* Site switcher tabs */}
            <div className="showcase-tabs-row">
              {showcaseSites.map((site, index) => (
                <button
                  key={index}
                  className={`tab-switch-btn ${activeSiteIndex === index ? 'selected' : ''}`}
                  onClick={() => setActiveSiteIndex(index)}
                >
                  <strong>{site.title}</strong>
                  <span>{site.role}</span>
                </button>
              ))}
            </div>

            {/* Styled Browser Frame Wrapper */}
            <div className="desktop-browser-box">
              <div className="browser-header-bar">
                <div className="browser-window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="browser-address-field">
                  <svg className="lock-icon" viewBox="0 0 24 24" width="12" height="12">
                    <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/>
                    <path d="M12 4a4 4 0 00-4 4v3h8V8a4 4 0 00-4-4z" fill="none" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{showcaseSites[activeSiteIndex].url}</span>
                </div>
                <div className="browser-refresh-indicator">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l.57.57"/>
                  </svg>
                </div>
              </div>

              {/* Site preview */}
              <div className="browser-viewport">
                <div className="browser-site-mock" key={activeSiteIndex} aria-label={`${showcaseSites[activeSiteIndex].title} website preview`}>
                  <div className="browser-site-hero">
                    <span>{showcaseSites[activeSiteIndex].role}</span>
                    <strong>{showcaseSites[activeSiteIndex].title}</strong>
                    <p>{showcaseSites[activeSiteIndex].desc}</p>
                  </div>
                  <div className="browser-site-grid">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="browser-site-rows">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <a
                  href={showcaseSites[activeSiteIndex].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="browser-live-link"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M11 3h6v6M17 3l-8 8M9 5H5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-4" /></svg>
                  Visit Live Site
                </a>
              </div>

              <div className="browser-footer-banner">
                <p>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="10" cy="10" r="8" /><path d="M10 6v4l3 3" strokeLinecap="round" /></svg>
                  <strong>Live Preview:</strong> Click “Visit Live Site” to explore the full website in a new tab.
                </p>
              </div>
            </div>

            <div className="active-site-info-box">
              <h3>{showcaseSites[activeSiteIndex].title}</h3>
              <p>{showcaseSites[activeSiteIndex].desc}</p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="smm-process-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.processEyebrow || 'The Workflow'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.processHeadline || 'Our [Web Development] Process'} />
              </h2>
              <p>{pageContent.processBody || 'From wireframes to launch, we build sites that balance brand aesthetics with conversion mechanics.'}</p>
            </div>
            <div className="vertical-process-steps">
              {processSteps.map((step, index) => (
                <div key={index} className="process-step-row">
                  <div className="step-num-col">
                    <span className="step-num-circle">{step.step}</span>
                  </div>
                  <div className="step-content-col">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="service-benefits" data-reveal>
          <div className="section-inner">
            <h2 className="section-center-title">{pageContent.featuresHeadline || 'Conversion-First Development Stack'}</h2>
            <div className="benefits-layout-grid">
              {(pageContent.features || []).map((feature, index) => (
                <div className="benefit-card" key={index}>
                  <h3>
                    <span className="benefit-num">{feature.num}</span>
                    {feature.title}
                  </h3>
                  <p>{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Website Performance Vitals Metrics */}
        <section className="results-metrics-section" data-reveal>
          <div className="section-inner">
            <div className="results-dashboard-box web-theme">
              <span className="results-badge">{pageContent.metricsBadge || 'Performance Snapshot'}</span>
              <h2>{pageContent.metricsHeadline || 'Live Website Metrics'}</h2>
              <p>{pageContent.metricsBody || 'Real performance data from websites we have built and currently maintain.'}</p>
              <div className="results-grid-four">
                {(pageContent.metrics || []).map((metric, index) => (
                  <div className={`result-metric-card ${index === 1 || index === 3 ? 'highlight-accent' : ''}`} key={index}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <small className="trend-up">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }}><path d="M5 15l7-7 7 7"/></svg>
                      {metric.trend}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ServicePager current="website" />

        <ContactSection content={content} onOpenContact={() => setIsFormOpen(true)} artSrc={pageImages.cta} ctaContent={ctaContent} />
      </main>

      {isFormOpen && <ContactFormModal onClose={() => setIsFormOpen(false)} content={content} />}
    </>
  )
}
