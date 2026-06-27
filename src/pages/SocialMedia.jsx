import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Navbar,
  ContactFormModal,
  ArrowIcon,
  ServicePager,
  useSiteContent,
  useScrollProgress,
  useReveals,
  useTheme,
  FloatingCTA,
  ThemeToggle,
  ContactSection,
  upsertMeta,
  upsertCanonical
} from '../App.jsx'
import BracketText from '../components/BracketText.jsx'
import { ServiceArtBand } from '../components/ServiceArt.jsx'
import { buildYtEmbedSrc, isYoutubeUrl, useReelPlayer } from '../hooks/useReelPlayer.js'

// Premium Mobile Phone Screenshot Mockup
function PhoneScreenshotMockup({ account }) {
  return (
    <div className="phone-screenshot-mockup">
      <div className="phone-frame-hardware">
        <div className="phone-notch"></div>
        <div className="phone-screen">
          <div className="profile-screen-mock" aria-label={`${account.name} profile preview`}>
            <div className="profile-screen-header">
              <span />
              <strong>{account.handle}</strong>
              <span />
            </div>
            <div className="profile-screen-identity">
              <div className="profile-screen-avatar" />
              <div>
                <strong>{account.name}</strong>
                <small>{account.niche}</small>
              </div>
            </div>
            <div className="profile-screen-stats">
              <span><strong>{account.stat.split(' ')[0]}</strong><small>{account.stat.replace(account.stat.split(' ')[0], '').trim() || 'Growth'}</small></span>
              <span><strong>3x</strong><small>Content</small></span>
              <span><strong>90d</strong><small>System</small></span>
            </div>
            <div className="profile-screen-grid">
              {Array.from({ length: 9 }).map((_, index) => <span key={index} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SocialMedia() {
  const content = useSiteContent()
  const pageContent = content.socialMedia || {}
  const progress = useScrollProgress()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const [selectedClient, setSelectedClient] = useState(() => (content.socialMedia?.accounts?.[0]?.name || 'Devi Bar'))
  const reelsRef = useRef(null)
  const [reelsMask, setReelsMask] = useState('right-only')
  const pageImages = pageContent.images || {}
  const ytOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://kforkreative.in'
  const ctaContent = {
    eyebrow: 'Start page growth',
    headline: 'Ready for a social media system that [shows up consistently]?',
    emphasis: 'shows up consistently',
    body: 'Bring us your brand, offers, and content goals. We will build the calendar, creative direction, captions, and posting rhythm for steady community growth.',
    ctaPrimary: pageContent.ctaPrimary || 'Start Social Media Growth',
    ctaSecondary: 'Email Us',
    email: content.contact.email
  }

  useEffect(() => {
    const el = reelsRef.current
    if (!el) return
    const update = () => {
      const atStart = el.scrollLeft <= 8
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8
      if (atStart && atEnd) setReelsMask('none')
      else if (atStart) setReelsMask('right-only')
      else if (atEnd) setReelsMask('left-only')
      else setReelsMask('both')
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [selectedClient])

  useReveals()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const title = 'Social Media Management | K For Kreative'
    const description = 'Monthly social media management for small businesses and personal brands. Content creation, scheduling, and Instagram and LinkedIn account management by K For Kreative.'
    const canonical = 'https://kforkreative.in/services/social-media-management'
    document.title = title
    upsertMeta('meta[name="description"]', 'name', 'description', description)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    upsertCanonical(canonical)
    const schema = document.createElement('script')
    schema.type = 'application/ld+json'
    schema.id = 'service-schema'
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Social Media Management',
      provider: { '@type': 'Organization', name: 'K For Kreative', url: 'https://kforkreative.in' },
      description: description,
      url: canonical,
      areaServed: 'IN',
      serviceType: 'Social Media Management'
    })
    document.head.appendChild(schema)
    return () => { document.getElementById('service-schema')?.remove() }
  }, [])

  const accounts = useMemo(() => pageContent.accounts || [], [pageContent.accounts])
  const clientReels = useMemo(() => pageContent.clientReels || [], [pageContent.clientReels])

  const selectedAccount = accounts.find((acc) => acc.name === selectedClient)
  const selectedHandle = selectedAccount?.handle || accounts[0]?.handle || '@devi_lifestyle_coach'
  const filteredReels = useMemo(
    () => clientReels.filter((reel) => reel.category === selectedHandle),
    [clientReels, selectedHandle],
  )

  useEffect(() => {
    reelsRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }, [selectedHandle])

  const {
    mutedIds,
    pausedIds,
    progressById,
    iframeRefs,
    startYtPlayback,
    toggleMute,
    toggleYTPause,
    toggleHtml5Pause,
  } = useReelPlayer(filteredReels, {
    observerSelector: '.social-page .reel-showcase-card[data-reel-id]',
    resetKey: selectedHandle,
  })

  const processSteps = pageContent.processSteps || [
    {
      step: '01',
      title: 'Audit & Strategy',
      desc: 'We analyze your current profile performance, identify target content pillars, and define your unique visual style guide and brand tone.'
    },
    {
      step: '02',
      title: 'Curation & Scripting',
      desc: 'We map out your posting calendar, write high-engagement hooks and scripts for Reels, and select trending audio aligned with your niche.'
    },
    {
      step: '03',
      title: 'Design & Publishing',
      desc: 'We build eye-catching cover templates, write optimized captions and hashtags, and schedule posts for peak engagement hours.'
    },
    {
      step: '04',
      title: 'Community & Analysis',
      desc: 'We monitor viewer feedback, respond strategically to comments, and analyze performance metrics to continuously scale organic reach.'
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
        logoSrc={theme === 'dark' ? (content.assets?.logoWhite || '/assets/logos/color-white-crop.png') : (content.assets?.logoBlack || '/assets/logos/color-black-crop.png')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="service-subpage social-page" style={{ '--hero-accent-rgb': '45, 125, 246', '--step-accent-rgb': '45, 125, 246', '--section-accent-rgb': '45, 125, 246', '--reel-accent-rgb': '45, 125, 246', '--benefit-accent-rgb': '45, 125, 246' }}>
        {/* Hero Section */}
        <section className="service-hero centered" style={{ '--hero-accent-rgb': '45, 125, 246' }}>
          <div className="service-hero-inner centered">
            <span className="service-badge-glow">{pageContent.badge || 'Social Media Management'}</span>
            <h1 className="service-title-h1">
              <BracketText text={pageContent.headline || 'Social Media Management Tailored for [Community Growth].'} emphasis={pageContent.emphasis} />
            </h1>
            <p className="service-lead-p">
              {pageContent.lead || 'We own your content engine from organic strategy and calendar curation to profile consistency, caption writing, and aesthetic direction.'}
            </p>
            <div className="service-hero-actions">
              <button className="button primary" onClick={() => setIsFormOpen(true)}>
                {pageContent.ctaPrimary || 'Start Social Media Growth'} <ArrowIcon />
              </button>
              <a href="#accounts" className="button ghost">
                {pageContent.ctaSecondary || 'View Managed Accounts'} <ArrowIcon />
              </a>
            </div>
          </div>
          <ServiceArtBand
            src={pageImages.hero}
            variant="hero"
            className="social-service-art"
            alt="Social media management for startups and small businesses by K For Kreative"
            width={1619}
            height={972}
          />
          <div className="service-hero-accent-glow" style={{ background: 'radial-gradient(circle, rgba(45, 125, 246, 0.2), transparent 68%)' }} />
        </section>

        {/* Managed Accounts List with Profile Mockup */}
        <section id="accounts" className="accounts-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.accountsEyebrow || 'Client Profiles'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.accountsHeadline || 'Client Profiles We [Direct & Scale]'} />
              </h2>
              <p>{pageContent.accountsBody || 'We craft the visual direction and schedule timelines for brands across wellness, startup, and coaching niches. Select a profile to view their reels.'}</p>
            </div>
            {/* Profile Mockup + Client Selector */}
            <div className="profile-selector-layout">
              <div className="accounts-list">
                {accounts.map((acc, index) => {
                  const isSelected = selectedClient === acc.name
                  return (
                    <div
                      key={index}
                      className={`account-profile-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedClient(acc.name)}
                    >
                      <div className="profile-badge">{isSelected ? '✓ Selected' : 'Active'}</div>
                      <h3>{acc.name}</h3>
                      <span className="profile-handle">{acc.handle}</span>
                      <p>{acc.niche}</p>
                      <div className="profile-footer-stat">{acc.stat}</div>
                    </div>
                  )
                })}
              </div>

              {/* Live profile mockup below selector */}
              <div className="ig-mockup-wrapper" data-reveal>
                <PhoneScreenshotMockup account={selectedAccount || accounts[0]} />
              </div>
            </div>
          </div>
        </section>

        {/* Client Reels Grid (3-Column Filtered) */}
        <section className="client-reels-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.reelsEyebrow || 'Reels Portfolio'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.reelsHeadline || 'Client Reels Showcase'} />
              </h2>
              <p>{pageContent.reelsBody || 'Select a client below to view pacing and formatting designed for page growth.'}</p>
            </div>
            {/* Separate Client Selector for Reels */}
            <div className="reels-client-tabs">
              {accounts.map((acc, index) => (
                <button
                  key={index}
                  className={`reel-tab-btn ${selectedClient === acc.name ? 'active' : ''}`}
                  onClick={() => setSelectedClient(acc.name)}
                >
                  {acc.name}
                </button>
              ))}
            </div>

            <div key={selectedHandle} className="reels-container" ref={reelsRef} data-mask={reelsMask}>
              {filteredReels.map((reel) => {
                const isYt = isYoutubeUrl(reel.videoUrl)
                const isPaused = pausedIds.has(reel.id)
                const isMuted = mutedIds.has(reel.id)
                const isPlaying = !isPaused
                const progress = progressById[reel.id] ?? 0
                return (
                  <div
                    key={reel.id}
                    data-reel-id={reel.id}
                    className={`reel-showcase-card ${isPlaying ? 'is-playing' : ''}`}
                  >
                    <div className="reel-video-wrapper">
                      {isYt ? (
                        <div className={`yt-player-container ${isPlaying ? 'is-playing' : ''}`}>
                          <iframe
                            key={reel.id}
                            ref={(el) => { iframeRefs.current[reel.id] = el }}
                            src={buildYtEmbedSrc(reel.videoUrl, ytOrigin)}
                            frameBorder="0"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            className="yt-player-iframe"
                            title={reel.title}
                            onLoad={() => startYtPlayback(reel.id)}
                          />
                        </div>
                      ) : (
                        <video
                          id={`video-${reel.id}`}
                          src={reel.videoUrl}
                          loop
                          playsInline
                          muted
                          autoPlay
                          className="reel-html5-video"
                        />
                      )}
                      {isYt ? (
                        <div className="reel-yt-controls" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="reel-yt-btn"
                            onClick={(e) => toggleYTPause(e, reel.id)}
                            aria-label={isPaused ? 'Play' : 'Pause'}
                          >
                            {isPaused
                              ? <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                              : <svg viewBox="0 0 24 24" width="14" height="14"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>
                            }
                          </button>
                          <button
                            className={`reel-yt-btn reel-mute-btn ${isMuted ? 'mute-glow' : ''}`}
                            onClick={(e) => toggleMute(e, reel.id)}
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted
                              ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                              : <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                            }
                          </button>
                          <div className="reel-control-progress" aria-hidden="true">
                            <span style={{ width: `${progress}%` }} />
                          </div>
                          <a
                            className="reel-open-post"
                            href={reel.videoUrl.replace('/embed/', '/watch?v=')}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <ArrowIcon /> Open Post
                          </a>
                        </div>
                      ) : (
                        <div className="reel-play-overlay">
                          <button className="reel-play-indicator" aria-label={isPaused ? 'Play video' : 'Pause video'} onClick={(e) => toggleHtml5Pause(e, reel)}>
                            {isPlaying
                              ? <svg className="pause-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>
                              : <svg className="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                            }
                          </button>
                        </div>
                      )}
                      <span className="reel-duration-tag">{reel.duration}</span>
                    </div>

                    <div className="reel-details">
                      <span className="reel-category">{reel.category}</span>
                      <h3>{reel.title}</h3>
                      <div className="reel-stats-row">
                        <div className="reel-stat-pill">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          <span>{reel.views}</span>
                        </div>
                        <div className="reel-stat-pill">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M20.243 4.757A10 10 0 0 0 3.757 19.243L2 22l2.757-1.757A10 10 0 1 0 20.243 4.757z"/></svg>
                          <span>{reel.comments}</span>
                        </div>
                        <div className="reel-stat-pill">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M18 20V10M12 20V4M6 20v-6"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
                          <span>{reel.engagement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </section>

        {/* SMM Process Section */}
        <section className="smm-process-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.processEyebrow || 'The Workflow'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.processHeadline || 'Our [SMM Growth] Pipeline'} />
              </h2>
              <p>{pageContent.processBody || 'A structured, end-to-end execution system engineered to build authority and grow your community consistently.'}</p>
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
            <h2 className="section-center-title" style={{ textAlign: 'center' }}>{pageContent.pillarsHeadline || 'Our Growth Execution Pillars'}</h2>
            <div className="benefits-layout-grid">
              {(pageContent.pillars || []).map((pillar, index) => (
                <div className="benefit-card" key={index}>
                  <h3>
                    <span className="benefit-num">{pillar.num}</span>
                    {pillar.title}
                  </h3>
                  <p>{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="results-metrics-section" data-reveal>
          <div className="section-inner">
            <div className="results-dashboard-box social-theme">
              <span className="results-badge">{pageContent.metricsBadge || 'Live Social Performance'}</span>
              <h2>{pageContent.metricsHeadline || 'Organic Growth Metrics'}</h2>
              <p>{pageContent.metricsBody || 'Live performance signals from managed social profiles, tracking audience growth, reach, engagement, and profile intent.'}</p>
              <div className="results-grid-four">
                {(pageContent.metrics || []).map((metric, index) => (
                  <div className={`result-metric-card ${index === 0 || index === 3 ? 'highlight-accent' : ''}`} key={index}>
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

        <ServicePager current="social-media-management" />

        <ContactSection content={content} onOpenContact={() => setIsFormOpen(true)} artSrc={pageImages.cta} ctaContent={ctaContent} />
      </main>

      {isFormOpen && <ContactFormModal onClose={() => setIsFormOpen(false)} content={content} />}
      <FloatingCTA onOpen={() => setIsFormOpen(true)} />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
    </>
  )
}
