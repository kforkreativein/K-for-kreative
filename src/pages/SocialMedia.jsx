import { useEffect, useRef, useState } from 'react'
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
  const [playingId, setPlayingId] = useState(null)
  const [mutedIds, setMutedIds] = useState(() => new Set())
  const [pausedIds, setPausedIds] = useState(() => new Set())
  const iframeRefs = useRef({})
  const [selectedClient, setSelectedClient] = useState(() => (content.socialMedia?.accounts?.[0]?.name || 'Devi Bar'))
  const reelsRef = useRef(null)
  const [reelsMask, setReelsMask] = useState('right-only')
  const pageImages = pageContent.images || {}
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

  const accounts = pageContent.accounts || [
    {
      name: 'Mehul Chhatrala',
      handle: '@mehulchhatrala',
      niche: 'Health Consulting & Wellness',
      stat: '10.5K+ Active Followers'
    },
    {
      name: 'Raj Patel',
      handle: '@rajpatel_official',
      niche: 'Business Strategy & Scaling',
      stat: '28K+ Monthly Reach'
    },
    {
      name: 'Hemali Kevalia',
      handle: '@hemalikevalia_wellness',
      niche: 'Personal Growth & Coaching',
      stat: '12% Engagement Lift'
    },
    {
      name: 'Devi Bar',
      handle: '@devibar_official',
      niche: 'Fashion & Apparel',
      stat: '50K+ Monthly Reach'
    },
    {
      name: 'Pushti Shah',
      handle: '@pushtishah_art',
      niche: 'Creative & Art',
      stat: '15% Engagement Lift'
    }
  ]

  const clientReels = pageContent.clientReels || [
    // Mehul Chhatrala
    {
      id: 'mehul-1',
      title: 'Morning Wellness Habits',
      category: '@mehulchhatrala',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-women-checking-phone-at-cafe-41710-large.mp4',
      duration: '0:22',
      views: '48.2K',
      comments: '218',
      engagement: '4.5%'
    },
    {
      id: 'mehul-2',
      title: 'Superfood Plate Setup',
      category: '@mehulchhatrala',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-healthy-meal-preparation-41846-large.mp4',
      duration: '0:45',
      views: '31.7K',
      comments: '142',
      engagement: '3.8%'
    },
    {
      id: 'mehul-3',
      title: 'Post-Workout Hydration',
      category: '@mehulchhatrala',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-breakfast-dishes-42202-large.mp4',
      duration: '0:15',
      views: '62.9K',
      comments: '310',
      engagement: '5.2%'
    },
    // Raj Patel
    {
      id: 'raj-1',
      title: 'CEO Scaling Framework',
      category: '@rajpatel_official',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-coffeeshop-41617-large.mp4',
      duration: '0:35',
      views: '94.3K',
      comments: '512',
      engagement: '6.1%'
    },
    {
      id: 'raj-2',
      title: 'Time Management Rules',
      category: '@rajpatel_official',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-hands-typing-on-laptop-keyboard-41612-large.mp4',
      duration: '0:28',
      views: '77.1K',
      comments: '388',
      engagement: '5.4%'
    },
    {
      id: 'raj-3',
      title: 'Focus Strategy Sessions',
      category: '@rajpatel_official',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-laptop-42316-large.mp4',
      duration: '0:40',
      views: '55.6K',
      comments: '267',
      engagement: '4.9%'
    },
    // Hemali Kevalia
    {
      id: 'hemali-1',
      title: 'Mindset Shift for Growth',
      category: '@hemalikevalia_wellness',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-smiling-41619-large.mp4',
      duration: '0:30',
      views: '38.4K',
      comments: '174',
      engagement: '4.2%'
    },
    {
      id: 'hemali-2',
      title: 'Daily Reflection Habit',
      category: '@hemalikevalia_wellness',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-laptop-in-living-room-41697-large.mp4',
      duration: '0:32',
      views: '29.8K',
      comments: '121',
      engagement: '3.9%'
    },
    {
      id: 'hemali-3',
      title: 'Goal Setting Masterclass',
      category: '@hemalikevalia_wellness',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-smartphone-close-up-41584-large.mp4',
      duration: '0:19',
      views: '51.2K',
      comments: '296',
      engagement: '5.8%'
    },
    // Devi Bar
    {
      id: 'devi-1',
      title: 'Summer Collection Drop',
      category: '@devibar_official',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-smiling-41619-large.mp4',
      duration: '0:25',
      views: '80.5K',
      comments: '441',
      engagement: '6.5%'
    },
    {
      id: 'devi-2',
      title: 'Behind The Scenes',
      category: '@devibar_official',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-laptop-in-living-room-41697-large.mp4',
      duration: '0:45',
      views: '45.2K',
      comments: '203',
      engagement: '5.1%'
    },
    {
      id: 'devi-3',
      title: 'Styling Tips',
      category: '@devibar_official',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-laptop-42316-large.mp4',
      duration: '0:30',
      views: '65.8K',
      comments: '318',
      engagement: '5.9%'
    },
    // Pushti Shah
    {
      id: 'pushti-1',
      title: 'Studio Tour',
      category: '@pushtishah_art',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-coffeeshop-41617-large.mp4',
      duration: '0:50',
      views: '22.1K',
      comments: '158',
      engagement: '7.2%'
    },
    {
      id: 'pushti-2',
      title: 'Painting Process',
      category: '@pushtishah_art',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-hands-typing-on-laptop-keyboard-41612-large.mp4',
      duration: '0:60',
      views: '35.4K',
      comments: '287',
      engagement: '8.1%'
    },
    {
      id: 'pushti-3',
      title: 'Art Exhibition',
      category: '@pushtishah_art',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-women-checking-phone-at-cafe-41710-large.mp4',
      duration: '0:40',
      views: '18.9K',
      comments: '134',
      engagement: '6.8%'
    }
  ]

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

  // Pause all playing videos when changing the selected client
  useEffect(() => {
    clientReels.forEach((reel) => {
      const video = document.getElementById(`video-${reel.id}`)
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })
    setPlayingId(null)
  }, [selectedClient])

  const getYtId = (url) => url.split('/embed/')[1]?.split('?')[0] ?? ''

  const sendYTCmd = (reelId, func) => {
    const iframe = iframeRefs.current[reelId]
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: '' }), '*')
    }
  }

  const toggleMute = (e, reelId) => {
    e.stopPropagation()
    const isMuted = mutedIds.has(reelId)
    sendYTCmd(reelId, isMuted ? 'unMute' : 'mute')
    setMutedIds(prev => { const next = new Set(prev); isMuted ? next.delete(reelId) : next.add(reelId); return next })
  }

  const toggleYTPause = (e, reelId) => {
    e.stopPropagation()
    const isPaused = pausedIds.has(reelId)
    sendYTCmd(reelId, isPaused ? 'playVideo' : 'pauseVideo')
    setPausedIds(prev => { const next = new Set(prev); isPaused ? next.delete(reelId) : next.add(reelId); return next })
  }

  const selectedAccount = accounts.find((acc) => acc.name === selectedClient)
  const selectedHandle = selectedAccount ? selectedAccount.handle : (accounts[0]?.handle || '@devi_lifestyle_coach')
  const filteredReels = clientReels.filter((reel) => reel.category === selectedHandle)

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

            <div className="reels-container" ref={reelsRef} data-mask={reelsMask}>
              {filteredReels.map((reel) => {
                const isYt = reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be')
                const isPlaying = playingId === reel.id
                const isMuted = mutedIds.has(reel.id)
                const isPaused = pausedIds.has(reel.id)
                const ytId = isYt ? getYtId(reel.videoUrl) : ''
                return (
                  <div
                    key={reel.id}
                    className={`reel-showcase-card ${isPlaying ? 'is-playing' : ''}`}
                    onClick={() => {
                      if (isYt) return
                      const video = document.getElementById(`video-${reel.id}`)
                      if (!video) return
                      if (isPlaying) { video.pause(); setPlayingId(null) }
                      else {
                        filteredReels.forEach((r) => { if (r.id !== reel.id) document.getElementById(`video-${r.id}`)?.pause() })
                        video.play(); setPlayingId(reel.id)
                      }
                    }}
                  >
                    <div className="reel-video-wrapper">
                      {isYt ? (
                        <iframe
                          key={reel.id}
                          ref={el => { iframeRefs.current[reel.id] = el }}
                          src={`${reel.videoUrl}?autoplay=1&mute=1&loop=1&controls=0&enablejsapi=1&playlist=${ytId}`}
                          frameBorder="0"
                          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                          allowFullScreen
                          className="reel-html5-video"
                          title={reel.title}
                        />
                      ) : (
                        <video
                          id={`video-${reel.id}`}
                          src={reel.videoUrl}
                          loop playsInline muted
                          className="reel-html5-video"
                        />
                      )}
                      {isYt ? (
                        <div className="reel-yt-controls">
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
                          <div className="reel-control-progress" aria-hidden="true"><span /></div>
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
                          <button className="reel-play-indicator" aria-label="Play video">
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
            <h2 className="section-center-title">{pageContent.pillarsHeadline || 'Our Growth Execution Pillars'}</h2>
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
    </>
  )
}
