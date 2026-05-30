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

export default function VideoEditing() {
  const content = useSiteContent()
  const pageContent = content.videoEditing || {}
  const progress = useScrollProgress()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [playingId, setPlayingId] = useState(null)
  const [mutedIds, setMutedIds] = useState(() => new Set())
  const [pausedIds, setPausedIds] = useState(() => new Set())
  const iframeRefs = useRef({})
  const reelsRef = useRef(null)
  const [reelsMask, setReelsMask] = useState('right-only')
  const pageImages = pageContent.images || {}
  const ctaContent = {
    eyebrow: 'Start a video project',
    headline: 'Ready to turn raw footage into [high-retention edits]?',
    emphasis: 'high-retention edits',
    body: 'Send us your footage, goals, and posting plan. We will shape it into polished short-form videos built for hooks, pacing, captions, and repeatable output.',
    ctaPrimary: pageContent.ctaPrimary || 'Start a video project',
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
  }, [])

  useReveals()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getYtId = (url) => url.split('/embed/')[1]?.split('?')[0] ?? ''

  const sendYTCmd = (reelId, func) => {
    const iframe = iframeRefs.current[reelId]
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args: '' }), '*'
      )
    }
  }

  const toggleMute = (e, reelId) => {
    e.stopPropagation()
    const isMuted = mutedIds.has(reelId)
    sendYTCmd(reelId, isMuted ? 'unMute' : 'mute')
    setMutedIds(prev => {
      const next = new Set(prev)
      isMuted ? next.delete(reelId) : next.add(reelId)
      return next
    })
  }

  const toggleYTPause = (e, reelId) => {
    e.stopPropagation()
    const isPaused = pausedIds.has(reelId)
    sendYTCmd(reelId, isPaused ? 'playVideo' : 'pauseVideo')
    setPausedIds(prev => {
      const next = new Set(prev)
      isPaused ? next.delete(reelId) : next.add(reelId)
      return next
    })
  }

  const reels = pageContent.reels || [
    {
      id: 'ozempic',
      title: 'Ozempic ka Sach',
      category: 'Health & Science',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-smiling-41619-large.mp4',
      duration: '0:30',
      views: '284K'
    },
    {
      id: 'nutrition',
      title: 'Nutrition Labels',
      category: 'Wellness & Food',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-healthy-meal-preparation-41846-large.mp4',
      duration: '0:45',
      views: '198K'
    },
    {
      id: 'cereal',
      title: 'Breakfast Cereal Truth',
      category: 'Daily Nutrition',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-breakfast-dishes-42202-large.mp4',
      duration: '0:15',
      views: '512K'
    },
    {
      id: 'gut-health',
      title: 'Gut Health Myths',
      category: 'Wellness & Food',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '0:50',
      views: '400K'
    },
    {
      id: 'fasting',
      title: 'Intermittent Fasting Guide',
      category: 'Health & Science',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-smiling-41619-large.mp4',
      duration: '0:40',
      views: '350K'
    },
    {
      id: 'protein',
      title: 'How Much Protein?',
      category: 'Daily Nutrition',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-healthy-meal-preparation-41846-large.mp4',
      duration: '0:35',
      views: '800K'
    },
    {
      id: 'vitamins',
      title: 'Essential Vitamins',
      category: 'Health & Science',
      videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
      duration: '0:45',
      views: '250K'
    },
    {
      id: 'hydration',
      title: 'The Truth About Water',
      category: 'Daily Nutrition',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-breakfast-dishes-42202-large.mp4',
      duration: '0:20',
      views: '150K'
    },
    {
      id: 'sleep',
      title: 'Sleep Optimization',
      category: 'Wellness & Food',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-smiling-41619-large.mp4',
      duration: '0:55',
      views: '600K'
    },
    {
      id: 'sugar',
      title: 'Hidden Sugars',
      category: 'Daily Nutrition',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-healthy-meal-preparation-41846-large.mp4',
      duration: '0:30',
      views: '420K'
    }
  ]

  const processSteps = pageContent.processSteps || [
    {
      step: '01',
      title: 'Footage & Brief',
      desc: 'Send us your raw recordings and brief. We analyze the concept, identify content hooks, and lock in the creative direction.'
    },
    {
      step: '02',
      title: 'Splicing & Pacing',
      desc: 'We trim dead space, frame visual pattern interrupts, and construct a high-retention timeline built to maximize watch time.'
    },
    {
      step: '03',
      title: 'Captions & Sound FX',
      desc: 'We layer animated kinetic captions, synced sound effects, background tracks, and clean color grading to fit your brand identity.'
    },
    {
      step: '04',
      title: 'Feedback & Delivery',
      desc: 'You review the draft in our workflow, request any minor edits, and receive the finalized high-retention video ready to publish.'
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

      <main className="service-subpage video-page" style={{ '--hero-accent-rgb': '243, 111, 33', '--step-accent-rgb': '243, 111, 33', '--section-accent-rgb': '243, 111, 33', '--reel-accent-rgb': '243, 111, 33', '--benefit-accent-rgb': '243, 111, 33' }}>
        {/* Hero Section */}
        <section className="service-hero centered">
          <div className="service-hero-inner centered">
            <span className="service-badge-glow">{pageContent.badge || 'Video Editing Services'}</span>
            <h1 className="service-title-h1">
              <BracketText text={pageContent.headline || 'Video Editing Spliced for [High Retention].'} emphasis={pageContent.emphasis} />
            </h1>
            <p className="service-lead-p">
              {pageContent.lead || 'From scroll-stopping Instagram Reels to conversion-driven ads, we turn your raw clips into premium, high-retention video content that hooks your audience and drives results.'}
            </p>
            <div className="service-hero-actions">
              <button className="button primary" onClick={() => setIsFormOpen(true)}>
                {pageContent.ctaPrimary || 'Start a video project'} <ArrowIcon />
              </button>
              <a href="#showcase" className="button ghost">
                {pageContent.ctaSecondary || 'Browse Selected Reels'} <ArrowIcon />
              </a>
            </div>
          </div>
          <ServiceArtBand
            src={pageImages.hero}
            variant="hero"
            className="video-service-art"
          />
          <div className="service-hero-accent-glow" />
        </section>

        {/* Video Formats Section */}
        <section className="smm-process-section" data-reveal style={{ paddingTop: '60px' }}>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.formatsEyebrow || 'Video Architecture'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.formatsHeadline || 'Video Formats We [Master & Scale]'} />
              </h2>
              <p>{pageContent.formatsBody || 'We edit across multiple short-form variants, adapting pacing and style to the specific platform algorithms.'}</p>
            </div>
            <div className="benefits-layout-grid">
              {(pageContent.formats || []).map((format, index) => (
                <div className="benefit-card" key={index}>
                  <h3>
                    <span className="benefit-num">{format.num}</span>
                    {format.title}
                  </h3>
                  <p>{format.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Reels Grid Section */}
        <section id="showcase" className="reels-grid-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row">
              <div className="label-block">
                <span>{pageContent.showcaseEyebrow || 'Selected Reels'}</span>
              </div>
              <h2>{pageContent.showcaseHeadline || 'Client Video Showcase'}</h2>
              <p>{pageContent.showcaseBody || 'Hover or click on the reels below to play and see our high-retention pacing, caption styling, and grading.'}</p>
            </div>
            <div className="reels-fade-wrapper" data-show-left={reelsMask === 'both' || reelsMask === 'left-only'} data-show-right={reelsMask === 'both' || reelsMask === 'right-only'}>
              <div className="reels-container" ref={reelsRef}>
              {reels.map((reel) => {
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
                        reels.forEach((r) => { if (r.id !== reel.id) document.getElementById(`video-${r.id}`)?.pause() })
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
                            className={`reel-yt-btn ${isPaused ? '' : ''}`}
                            onClick={(e) => toggleYTPause(e, reel.id)}
                            aria-label={isPaused ? 'Play' : 'Pause'}
                          >
                            {isPaused ? (
                              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                            ) : (
                              <svg viewBox="0 0 24 24" width="14" height="14"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>
                            )}
                          </button>
                          <button
                            className={`reel-yt-btn reel-mute-btn ${isMuted ? 'mute-glow' : ''}`}
                            onClick={(e) => toggleMute(e, reel.id)}
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted ? (
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                            ) : (
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                            )}
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
                            {isPlaying ? (
                              <svg className="pause-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>
                            ) : (
                              <svg className="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                            )}
                          </button>
                        </div>
                      )}
                      <span className="reel-duration-tag">{reel.duration}</span>
                      {reel.views !== '—' && (
                        <div className="reel-views-tag">
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" width="10" height="10"><path d="M2 10s3-7 8-7 8 7 8 7-3 7-8 7-8-7-8-7z" /><circle cx="10" cy="10" r="2.5" /></svg>
                          {reel.views}
                        </div>
                      )}
                    </div>
                    <div className="reel-details">
                      <span className="reel-category">{reel.category}</span>
                      <h3>{reel.title}</h3>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          </div>
        </section>

        {/* Video Process Section */}
        <section className="video-process-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.processEyebrow || 'The Workflow'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.processHeadline || 'How We Craft [High-Retention] Edits'} />
              </h2>
              <p>{pageContent.processBody || 'Our four-step production pipeline is engineered for speed, collaboration, and performance quality.'}</p>
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

        {/* Performance Results */}
        <section className="results-metrics-section" data-reveal>
          <div className="section-inner">
            <div className="results-dashboard-box">
              <span className="results-badge">{pageContent.metricsBadge || 'Editing Impact'}</span>
              <h2>{pageContent.metricsHeadline || 'Video Performance Metrics'}</h2>
              <p>{pageContent.metricsBody || 'Aggregated statistics comparing our edited short-form videos against baseline organic uploads.'}</p>
              <div className="results-grid-four">
                {(pageContent.metrics || []).map((metric, index) => (
                  <div className={`result-metric-card ${index === 2 ? 'highlight-accent' : ''}`} key={index}>
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

        <ServicePager current="video-editing" />

        <ContactSection content={content} onOpenContact={() => setIsFormOpen(true)} artSrc={pageImages.cta} ctaContent={ctaContent} />
      </main>

      {isFormOpen && <ContactFormModal onClose={() => setIsFormOpen(false)} content={content} />}
    </>
  )
}
