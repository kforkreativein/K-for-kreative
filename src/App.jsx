import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { normalizeContent } from '../lib/contentUtils.js'
import AdminApp from './admin/AdminApp.jsx'
import BracketText from './components/BracketText.jsx'
import FooterSocialIcon from './components/FooterSocialIcon.jsx'
import { defaultContent } from './siteData.js'
import { useAdvancedScroll } from './scrollMotion.js'
import { useNavbarShrink } from './useNavbarShrink.js'
import VideoEditing from './pages/VideoEditing.jsx'
import SocialMedia from './pages/SocialMedia.jsx'
import MetaAds from './pages/MetaAds.jsx'
import WebsiteDev from './pages/WebsiteDev.jsx'
import ServicesPage from './pages/Services.jsx'

export const serviceSlugs = [
  'video-editing',
  'social-media-management',
  'meta-ads',
  'website'
]

export function getServicePath(categoryOrTitle) {
  const normalized = categoryOrTitle?.toLowerCase() || ''
  if (normalized.includes('video') || normalized.includes('reel')) return '/services/video-editing'
  if (normalized.includes('social') || normalized.includes('management')) return '/services/social-media-management'
  if (normalized.includes('meta') || normalized.includes('ad')) return '/services/meta-ads'
  if (normalized.includes('web') || normalized.includes('page')) return '/services/website'
  return '/'
}

const hamburgerIcon = '/assets/icons/hamburger.png'
const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || ''
const processVisualImages = {
  research: '/assets/process/process-01.png',
  planning: '/assets/process/process-02.png',
  produce: '/assets/process/process-03.png',
  refine: '/assets/process/process-04.png'
}

function upsertMeta(selector, attributeName, attributeValue, content) {
  let tag = document.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attributeName, attributeValue)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content || '')
}

function upsertCanonical(url) {
  let tag = document.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }

  tag.setAttribute('href', url || window.location.origin)
}

export function useSiteContent() {
  const [content, setContent] = useState(defaultContent)

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams(window.location.search)

    async function loadContent() {
      if (params.get('preview') === '1') {
        const draft = sessionStorage.getItem('kfk_preview_content')
        if (draft && !cancelled) {
          setContent(normalizeContent(JSON.parse(draft)))
          return
        }
      }

      try {
        const response = await fetch('/api/content', {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        })
        if (!response.ok) return

        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) return

        const remoteContent = await response.json()
        if (!cancelled && remoteContent && typeof remoteContent === 'object') {
          setContent(normalizeContent(remoteContent))
        }
      } catch {
        // Keep bundled fallback when the API is unavailable.
      }
    }

    loadContent()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.title = content.meta.title
    upsertMeta('meta[name="description"]', 'name', 'description', content.meta.description)
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', content.meta.keywords)
    upsertCanonical(content.meta.canonicalUrl)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', content.meta.title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', content.meta.description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', content.meta.canonicalUrl)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', content.meta.image)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', content.meta.title)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', content.meta.description)

    let favicon = document.querySelector('link[rel="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.setAttribute('rel', 'icon')
      document.head.appendChild(favicon)
    }
    if (content.assets?.favicon) {
      favicon.setAttribute('href', content.assets.favicon)
    }
  }, [content.meta, content.assets?.favicon])

  return content
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? window.scrollY / total : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}

function useActiveSection() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const targets = [...document.querySelectorAll('[data-section-id]')]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) setActive(visible[0].target.dataset.sectionId)
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: [0.12, 0.28, 0.45, 0.7] },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return active
}

export function useReveals() {
  useEffect(() => {
    const targets = [...document.querySelectorAll('[data-reveal]')]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])
}

function getNavScrollOffset() {
  if (window.innerWidth <= 820) return 68
  if (window.innerWidth <= 1180) return 72
  return 96
}

function useHashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return

      const target = document.querySelector(hash)
      if (!target) return

      const scroll = () => {
        const top = target.getBoundingClientRect().top + window.scrollY - getNavScrollOffset()
        window.scrollTo({ top: Math.max(top, 0), behavior: 'auto' })
      }

      window.requestAnimationFrame(scroll)
      window.setTimeout(scroll, 220)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    window.addEventListener('resize', scrollToHash)
    return () => {
      window.removeEventListener('hashchange', scrollToHash)
      window.removeEventListener('resize', scrollToHash)
    }
  }, [])
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

function ServicePagerArrow({ direction }) {
  return (
    <svg className="service-pager-arrow" viewBox="0 0 24 24" aria-hidden="true">
      {direction === 'left' ? <path d="M19 12H5M11 6l-6 6 6 6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  )
}

function ServiceIcon({ type }) {
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

export function Navbar({ active, progress, onOpenContact, navItems, logoSrc }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const drawerRef = useRef(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const closeMenu = useCallback(() => {
    setMenuOpen((wasOpen) => {
      if (wasOpen) {
        queueMicrotask(() => toggleRef.current?.focus())
      }
      return false
    })
  }, [])

  const handleOpenContact = useCallback(() => {
    closeMenu()
    onOpenContact()
  }, [closeMenu, onOpenContact])

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
    return () => document.body.classList.remove('nav-open')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined

    const drawer = drawerRef.current
    const focusable = drawer?.querySelector('button, a[href]')
    focusable?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return

      const items = [...drawerRef.current.querySelectorAll('button, a[href]')]
      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  useEffect(() => {
    window.addEventListener('hashchange', closeMenu)
    return () => window.removeEventListener('hashchange', closeMenu)
  }, [closeMenu])

  const getLinkHref = (href) => (isHome ? href : `/${href}`)

  return (
    <>
      <header className="navbar">
        <div className="navbar-pill">
          <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <a className="brand" href={getLinkHref('#hero')} aria-label="K For Kreative home">
          <img src={logoSrc} alt="K For Kreative" />
        </a>
        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="nav-drawer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <img src={hamburgerIcon} alt="" className="nav-toggle-icon" aria-hidden="true" />
        </button>
        <nav className="navbar-menu" aria-label="Primary navigation">
          {navItems.map((item) => {
            const id = item.href.replace('#', '')
            return (
              <a key={item.href} className={active === id ? 'active' : ''} href={getLinkHref(item.href)}>
                {item.label}
              </a>
            )
          })}
        </nav>
        <button className="nav-cta" type="button" onClick={onOpenContact}>
          Start a project
        </button>
      </header>
      <div
        className={`nav-drawer-backdrop${menuOpen ? ' is-open' : ''}`}
        role="presentation"
        onMouseDown={closeMenu}
        aria-hidden={!menuOpen}
      />
      <aside
        ref={drawerRef}
        id="nav-drawer"
        className={`nav-drawer${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen || undefined}
      >
        <button className="nav-drawer-close" type="button" aria-label="Close menu" onClick={closeMenu}>
          ×
        </button>
        <nav className="nav-drawer-links" aria-label="Primary navigation">
          {navItems.map((item) => {
            const id = item.href.replace('#', '')
            return (
              <a
                key={item.href}
                className={active === id ? 'active' : ''}
                href={getLinkHref(item.href)}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
        <button className="nav-drawer-cta button primary" type="button" onClick={handleOpenContact}>
          Start a project <ArrowIcon />
        </button>
      </aside>
    </>
  )
}

function SectionLabel({ eyebrow }) {
  return (
    <div className="section-label" data-reveal>
      <span>{eyebrow}</span>
    </div>
  )
}

export function ArtPanel({ src, className = '', caption, children, parallax = 0.08, parallaxMax }) {
  return (
    <figure className={`art-panel ${className}`} data-reveal data-parallax={parallax} data-parallax-max={parallaxMax}>
      <img src={src} alt="" loading="lazy" />
      <div className="art-glass" aria-hidden="true" />
      {caption && <figcaption>{caption}</figcaption>}
      {children}
    </figure>
  )
}

function ProcessVisual({ type, title }) {
  const imageSrc = processVisualImages[type]

  return (
    <div className={`process-step-visual process-step-image process-visual-${type}`} role="img" aria-label={`${title} process visual`}>
      {imageSrc && <img src={imageSrc} alt="" loading="lazy" />}
    </div>
  )
}

function HeroSection({ content, onOpenContact }) {
  return (
    <section className="section hero-section" id="hero" data-section-id="hero" data-scroll-section>
      <div className="section-inner hero-grid">
        <div className="hero-copy">
          <SectionLabel eyebrow={content.hero.eyebrow} />
          <h1 data-reveal><BracketText text={content.hero.headline} emphasis={content.hero.emphasis} /></h1>
          <p className="lead" data-reveal>{content.hero.subhead}</p>
          <div className="actions" data-reveal>
            <button className="button primary" type="button" onClick={onOpenContact}>{content.hero.ctaPrimary} <ArrowIcon /></button>
            <a className="button ghost" href="#work">{content.hero.ctaSecondary} <ArrowIcon /></a>
          </div>
          <div className="stats-grid" data-reveal>
            {(content.hero?.stats || []).map((item) => <div className="stat" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
          </div>
        </div>
        <ArtPanel src={content.sections.hero} className="hero-art focus-right tall" caption={content.hero.artCaption} />
      </div>
    </section>
  )
}

function AboutSection({ content }) {
  return (
    <section className="section about-section" id="about" data-section-id="about" data-scroll-section style={{ paddingBottom: '0' }}>
      <div className="section-inner split-grid">
        <div className="editorial-copy">
          <SectionLabel eyebrow={content.about.eyebrow} />
          <h2 data-reveal><BracketText text={content.about.headline} emphasis={content.about.emphasis} /></h2>
          <p data-reveal>{content.about.body}</p>
          <a className="text-link" href="#work" data-reveal>{content.about.linkLabel} <ArrowIcon /></a>
        </div>
        <ArtPanel src={content.sections.about} className="focus-right sculpture about-growth-art" caption={content.about.artCaption} />
      </div>
    </section>
  )
}



export function ServicesSection({ content, onOpenContact }) {
  const [hoveredIndex, setHoveredIndex] = useState(0)

  return (
    <section className="section services-section" id="services" data-section-id="services" data-scroll-section>
      <div className="section-inner">
        <div className="services-top-row">
          <div className="services-intro">
            <SectionLabel eyebrow={content.services?.intro?.eyebrow} />
            <h2 data-reveal><BracketText text={content.services?.intro?.headline} emphasis={content.services?.intro?.emphasis} /></h2>
            <p data-reveal>{content.services?.intro?.body}</p>
            <button className="button primary" type="button" onClick={onOpenContact} data-reveal>Start your project <ArrowIcon /></button>
          </div>
          <ArtPanel src={content.sections.services} className="services-art services-art-showcase focus-center" parallax={0.018} parallaxMax={12} />
        </div>
        <div className="service-list service-list-four" data-reveal>
          {(content.services?.items || content.services || []).map((service, index) => (
            <Link
              key={`${service.title}-${index}`}
              to={`/services/${serviceSlugs[index] || ''}`}
              className={`service-card service-tone-${index + 1} interactive-card ${hoveredIndex === index ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <ServiceIcon type={service.icon} />
              <span>{service.badge}</span>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <span className="service-card-arrow" aria-hidden="true"><ArrowIcon /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkSection({ content }) {
  return (
    <section className="section work-section" id="work" data-section-id="work" data-scroll-section>
      <div className="section-inner">
        <div className="work-header">
          <div className="work-copy">
            <SectionLabel eyebrow={content.work.eyebrow} />
            <h2 data-reveal><BracketText text={content.work.headline} emphasis={content.work.emphasis} /></h2>
            <p className="section-subtext" data-reveal>
              A focused portfolio across video editing, social media management, Meta ads, and conversion websites.
            </p>
          </div>
          <div className="work-controls" data-reveal>
            <div className="work-panel">
              <div className="work-note"><span>{content.work.panelTitle}</span><strong>{content.work.panelMetric}</strong><p>{content.work.panelBody}</p></div>
              <div className="work-note"><span>{content.work.supportTitle}</span><strong>{content.work.supportMetric}</strong><p>{content.work.supportBody}</p></div>
            </div>
          </div>
        </div>
        <div className="project-rail" data-reveal>
          {content.work.items.map((item, index) => (
            <Link
              key={`${item.title}-${index}`}
              to={getServicePath(item.category)}
              className="project-card interactive-card"
              style={{ '--delay': `${index * 70}ms` }}
            >
              <div className="project-thumb"><img src={item.image} alt="" loading="lazy" /></div>
              <div className="project-meta"><span>{item.category}</span><h3>{item.title}</h3><p>{item.body}</p></div>
              <span className="project-card-arrow" aria-hidden="true"><ArrowIcon /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection({ content, onOpenContact }) {
  return (
    <section className="section process-section" id="process" data-section-id="process" data-scroll-section>
      <div className="section-inner">
        <div className="process-header-row">
          <div className="process-header-copy">
            <SectionLabel eyebrow={content.process.eyebrow} />
            <h2 data-reveal><BracketText text={content.process.headline} emphasis={content.process.emphasis} /></h2>
            <p className="section-subtext" data-reveal>{content.process.subhead}</p>
            <button className="button primary" type="button" onClick={onOpenContact} data-reveal>
              Start your project <ArrowIcon />
            </button>
          </div>
          <ArtPanel src={content.sections.process} className="process-art focus-right" parallax={0.018} parallaxMax={12} />
        </div>
        <div className="process-board"><div className="process-steps" data-reveal>
          {content.process.steps.map((step, index) => (
            <article className="process-step" key={`${step.title}-${index}`}>
              <div className="process-step-copy"><span className="process-step-tag">{step.tag}</span><h3>{step.title}</h3><p>{step.body}</p>{index < content.process.steps.length - 1 && <ArrowIcon />}</div>
              <ProcessVisual type={step.visual} title={step.title} />
            </article>
          ))}
        </div></div>
      </div>
    </section>
  )
}

function ProofSection({ content, onOpenContact }) {
  return (
    <section className="section proof-section" id="proof" data-section-id="proof" data-scroll-section>
      <div className="section-inner proof-grid">
        <div className="proof-copy">
          <SectionLabel eyebrow={content.proof.eyebrow} />
          <h2 data-reveal><BracketText text={content.proof.headline} emphasis={content.proof.emphasis} /></h2>
          <p data-reveal>{content.proof.body}</p>
          <button className="button primary proof-cta" type="button" onClick={onOpenContact} data-reveal>
            Start your project <ArrowIcon />
          </button>
          <div className="proof-list" data-reveal>
            {content.proof.points.map((point, index) => <article key={`${point.title}-${index}`}><span /><small>{point.tag}</small><strong>{point.title}</strong><p>{point.body}</p></article>)}
          </div>
        </div>
        <div className="proof-visual" data-reveal>
          <div className="metric-stack">{content.proof.metrics.map((metric, index) => <div key={`${metric.label}-${index}`}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
          <ArtPanel src={content.sections.proof} className="proof-art proof-art-cropped" parallax={0} />
        </div>
      </div>
    </section>
  )
}

function StoriesSection({ content, onOpenContact }) {
  return (
    <section className="section stories-section" id="stories" data-section-id="stories" data-scroll-section>
      <div className="section-inner stories-grid">
        <div className="quote-block">
          <SectionLabel eyebrow={content.stories.eyebrow} />
          <blockquote data-reveal>&ldquo;<BracketText text={content.stories.quote} />&rdquo;</blockquote>
          <div className="author" data-reveal><span>{content.stories.author}</span><span>{content.stories.role}</span></div>
          <p data-reveal>{content.stories.body}</p>
          <div className="testimonial-grid" data-reveal>
            {content.stories.testimonials.map((item, index) => (
              <article className="testimonial-card" key={`${item.name}-${index}`}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}><BracketText text={item.quote} /></p>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </article>
            ))}
          </div>
          <button className="button primary" type="button" onClick={onOpenContact} data-reveal>{content.stories.linkLabel} <ArrowIcon /></button>
        </div>
        <div className="stories-art-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ArtPanel src={content.sections.stories} className="focus-right story-art" />
          <div className="client-row" data-reveal>{content.stories.clients.map((client) => <span key={client}>{client}</span>)}</div>
        </div>
      </div>
    </section>
  )
}

export function ContactFormModal({ onClose, content }) {
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('submitting')

    try {
      const formData = new FormData(form)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok || result.success === false) {
        console.warn('Web3Forms submission was not accepted.', result)
      }
    } catch {
      console.warn('Web3Forms submission could not be completed from the browser.')
    } finally {
      form.reset()
      setStatus('success')
    }
  }

  const whatsappHref = content.contact?.whatsapp || content.footer?.socials?.find((item) => item.icon === 'whatsapp' || item.label === 'WhatsApp')?.href || '#'

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-form-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-surface">
          <button className="modal-close" type="button" aria-label="Close form" onClick={onClose}>x</button>
          {status === 'success' ? (
            <div className="form-success-panel">
              <div className="success-logo-mark" aria-hidden="true">
                <img src={content.assets?.logoBlack || '/assets/logos/color-black-crop.png'} alt="" />
              </div>
              <div className="modal-label">Inquiry received</div>
              <h2 id="project-form-title">Thank you for reaching out.</h2>
              <p className="modal-lead">We have your project details. For the fastest response, message us on WhatsApp and we will continue the conversation there.</p>
              <div className="success-actions">
                <a className="button primary wide" href={whatsappHref} target="_blank" rel="noopener noreferrer">Contact on WhatsApp <ArrowIcon /></a>
                <button className="button ghost wide" type="button" onClick={onClose}>Back to website</button>
              </div>
            </div>
          ) : (
            <>
              <div className="modal-label">{content.form.label}</div>
              <h2 id="project-form-title"><BracketText text={content.form.title} emphasis={content.form.emphasis} /></h2>
              <p className="modal-lead">{content.form.lead}</p>
              <form className="modal-form" onSubmit={handleSubmit}>
                <input type="hidden" name="access_key" value={web3FormsAccessKey} />
                <input type="hidden" name="subject" value={content.form.subject} />
                <input type="hidden" name="from_name" value={content.form.fromName} />
                <label>{content.form.nameLabel}<input name="name" required /></label>
                <label>{content.form.emailLabel}<input name="email" type="email" required /></label>
                <label>{content.form.projectLabel}<select name="project_type" defaultValue={content.form.projectOptions[0]}>{content.form.projectOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label>{content.form.briefLabel}<textarea name="message" rows="4" placeholder={content.form.briefPlaceholder} /></label>
                <button className="button primary wide" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending...' : content.form.submitLabel} <ArrowIcon /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function ContactSection({ content, onOpenContact, artSrc, ctaContent }) {
  const contact = ctaContent || content.contact

  return (
    <section className="section contact-section" id="contact" data-section-id="contact" data-scroll-section>
      <div className="section-inner contact-grid">
        <div className="contact-copy">
          <SectionLabel eyebrow={contact.eyebrow} />
          <h2 data-reveal><BracketText text={contact.headline} emphasis={contact.emphasis} /></h2>
          <p data-reveal>{contact.body}</p>
          <div className="actions" data-reveal>
            <button className="button primary" type="button" onClick={onOpenContact}>{contact.ctaPrimary} <ArrowIcon /></button>
            <a className="button ghost" href={`mailto:${contact.email || content.contact.email}`}>{contact.ctaSecondary}</a>
          </div>
        </div>
        <ArtPanel src={artSrc || content.sections.contact} className="focus-right contact-art" />
      </div>
      <footer className="footer">
        <a className="footer-brand" href="#hero" aria-label="K For Kreative home">
          <img src={content.assets?.logoWhite || '/assets/logos/color-white-crop.png'} alt="K For Kreative" />
        </a>
        <nav className="footer-socials" aria-label="Social links">
          {content.footer.socials.map((item) => {
            const isExternal = item.href.startsWith('http')

            return (
              <a
                key={item.label}
                href={item.href}
                aria-label={`${item.label}${isExternal ? ' (opens in new tab)' : ''}`}
                {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              >
                <FooterSocialIcon name={item.icon} sections={content.sections} />
              </a>
            )
          })}
        </nav>
        <p className="footer-copy">
          © {new Date().getFullYear()} {content.footer.copyright}
        </p>
      </footer>
    </section>
  )
}

const servicePagerItems = [
  { slug: 'video-editing', label: 'Video Editing', href: '/services/video-editing' },
  { slug: 'social-media-management', label: 'Social Media', href: '/services/social-media-management' },
  { slug: 'meta-ads', label: 'Meta Ads', href: '/services/meta-ads' },
  { slug: 'website', label: 'Website Development', href: '/services/website' }
]

export function ServicePager({ current }) {
  const currentIndex = servicePagerItems.findIndex((item) => item.slug === current)
  if (currentIndex === -1) return null

  const previous = servicePagerItems[currentIndex - 1]
  const next = servicePagerItems[currentIndex + 1]

  return (
    <section className="service-pager-section" aria-label="Service navigation" data-reveal>
      <div className="section-inner service-pager-inner">
        {previous ? (
          <Link className="button ghost service-pager-button previous" to={previous.href}>
            <ServicePagerArrow direction="left" />
            {previous.label}
          </Link>
        ) : <div />}
        {next && (
          <Link className="button primary service-pager-button next" to={next.href}>
            {next.label}
            <ServicePagerArrow direction="right" />
          </Link>
        )}
      </div>
    </section>
  )
}

function MarketingSite() {
  const content = useSiteContent()
  const progress = useScrollProgress()
  const active = useActiveSection()
  const [isFormOpen, setIsFormOpen] = useState(false)

  useReveals()
  useHashScroll()
  useNavbarShrink()

  return (
    <>
      <div className="paper-grain" aria-hidden="true" />
      <Navbar
        active={active}
        progress={progress}
        onOpenContact={() => setIsFormOpen(true)}
        navItems={content.nav}
        logoSrc={content.assets?.logoBlack || '/assets/logos/color-black-crop.png'}
      />
      <main>
        <HeroSection content={content} onOpenContact={() => setIsFormOpen(true)} />
        <AboutSection content={content} />
        <ServicesSection content={content} onOpenContact={() => setIsFormOpen(true)} />
        <WorkSection content={content} />
        <ProcessSection content={content} onOpenContact={() => setIsFormOpen(true)} />
        <ProofSection content={content} onOpenContact={() => setIsFormOpen(true)} />
        <StoriesSection content={content} onOpenContact={() => setIsFormOpen(true)} />
        <ContactSection content={content} onOpenContact={() => setIsFormOpen(true)} />
      </main>
      {isFormOpen && <ContactFormModal onClose={() => setIsFormOpen(false)} content={content} />}
    </>
  )
}

// Component to handle preview route parameter
function PreviewRouteHandler() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const previewRoute = params.get('route')

  // If preview mode with a route param, navigate to that route (keeping preview params)
  if (previewRoute && previewRoute !== location.pathname) {
    return <Navigate to={`${previewRoute}${location.search}`} replace />
  }

  return <MarketingSite />
}

function ScrollRuntime() {
  const location = useLocation()
  useAdvancedScroll(location.pathname)
  return null
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1050)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      {isLoading && <AppLoader />}
      <ScrollRuntime />
      <Routes>
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/video-editing" element={<VideoEditing />} />
        <Route path="/services/social-media-management" element={<SocialMedia />} />
        <Route path="/services/meta-ads" element={<MetaAds />} />
        <Route path="/services/website" element={<WebsiteDev />} />
        <Route path="*" element={<PreviewRouteHandler />} />
      </Routes>
    </BrowserRouter>
  )
}

function AppLoader() {
  return (
    <div className="site-loader" role="status" aria-label="Loading K For Kreative">
      <div className="loader-logo-wrap">
        <img src="/assets/logos/color-white-crop.png" alt="K For Kreative" />
      </div>
      <div className="loader-track"><span /></div>
    </div>
  )
}
