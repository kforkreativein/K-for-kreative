import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

function isYoutubeUrl(url) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function getYtId(url) {
  if (url.includes('/embed/')) return url.split('/embed/')[1]?.split('?')[0] ?? ''
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/)
  return match?.[1] ?? ''
}

function buildYtEmbedSrc(videoUrl, origin) {
  const ytId = getYtId(videoUrl)
  const base = videoUrl.includes('/embed/') ? videoUrl.split('?')[0] : `https://www.youtube.com/embed/${ytId}`
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    enablejsapi: '1',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
    disablekb: '1',
    fs: '0',
    playsinline: '1',
    loop: '1',
    playlist: ytId,
    origin,
  })
  return `${base}?${params.toString()}`
}

export default function VideoEditing() {
  const content = useSiteContent()
  const pageContent = content.videoEditing || {}
  const progress = useScrollProgress()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const [mutedIds, setMutedIds] = useState(() => new Set())
  const [pausedIds, setPausedIds] = useState(() => new Set())
  const [progressById, setProgressById] = useState({})
  const iframeRefs = useRef({})
  const pausedIdsRef = useRef(pausedIds)
  const reelsRef = useRef(null)
  const showcaseRef = useRef(null)
  const [reelsMask, setReelsMask] = useState('right-only')
  const pageImages = pageContent.images || {}
  const ytOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://kforkreative.in'
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

  useEffect(() => {
    const title = 'Video Editing for Brands | K For Kreative'
    const description = 'Short-form video editing for Instagram Reels, YouTube Shorts, and podcast clips. Hook optimisation, captions, pacing, and repeatable monthly output for small businesses and personal brands.'
    const canonical = 'https://kforkreative.in/services/video-editing'
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
      name: 'Video Editing',
      provider: { '@type': 'Organization', name: 'K For Kreative', url: 'https://kforkreative.in' },
      description: description,
      url: canonical,
      areaServed: 'IN',
      serviceType: 'Video Editing'
    })
    document.head.appendChild(schema)
    return () => { document.getElementById('service-schema')?.remove() }
  }, [])

  const sendYTCmd = useCallback((reelId, func, args = '') => {
    const iframe = iframeRefs.current[reelId]
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
    }
  }, [])

  const startYtPlayback = useCallback((reelId) => {
    ;[120, 500, 1200, 2500].forEach((delay) => {
      window.setTimeout(() => {
        if (pausedIdsRef.current.has(reelId)) return
        sendYTCmd(reelId, 'mute')
        sendYTCmd(reelId, 'playVideo')
      }, delay)
    })
  }, [sendYTCmd])

  useEffect(() => {
    pausedIdsRef.current = pausedIds
  }, [pausedIds])

  const reels = useMemo(() => pageContent.reels || [
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
  ], [pageContent.reels])

  const reelIdsKey = useMemo(() => reels.map((reel) => reel.id).join(','), [reels])

  useEffect(() => {
    const ytIds = reels.filter((reel) => isYoutubeUrl(reel.videoUrl)).map((reel) => reel.id)
    setMutedIds(new Set(ytIds))
    setPausedIds(new Set())
    setProgressById({})
  }, [reelIdsKey, reels])

  useEffect(() => {
    reels.forEach((reel) => {
      if (isYoutubeUrl(reel.videoUrl)) return
      const video = document.getElementById(`video-${reel.id}`)
      video?.play()?.catch(() => {})
    })
  }, [reelIdsKey, reels])

  useEffect(() => {
    const onMessage = (event) => {
      if (!event.origin.endsWith('youtube.com')) return
      let data
      try {
        data = JSON.parse(event.data)
      } catch {
        return
      }

      let reelId = null
      for (const [id, iframe] of Object.entries(iframeRefs.current)) {
        if (iframe?.contentWindow === event.source) {
          reelId = id
          break
        }
      }
      if (!reelId) return

      if (data.event === 'infoDelivery' && data.info) {
        const { currentTime, duration, playerState } = data.info
        if (typeof duration === 'number' && duration > 0 && typeof currentTime === 'number') {
          setProgressById((prev) => ({
            ...prev,
            [reelId]: Math.min(100, (currentTime / duration) * 100),
          }))
        }
        if (playerState === 2) {
          setPausedIds((prev) => new Set(prev).add(reelId))
        }
      }

      if (data.event === 'onStateChange') {
        if (data.info === 1) {
          setPausedIds((prev) => {
            if (!prev.has(reelId)) return prev
            const next = new Set(prev)
            next.delete(reelId)
            return next
          })
        } else if (data.info === 2) {
          setPausedIds((prev) => new Set(prev).add(reelId))
        }
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      reels.forEach((reel) => {
        if (!isYoutubeUrl(reel.videoUrl) || pausedIdsRef.current.has(reel.id)) return
        sendYTCmd(reel.id, 'getCurrentTime')
        sendYTCmd(reel.id, 'getDuration')
      })
    }, 450)
    return () => window.clearInterval(interval)
  }, [reels, sendYTCmd])

  useEffect(() => {
    const cards = document.querySelectorAll('.video-page .reel-showcase-card[data-reel-id]')
    if (!cards.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const reelId = entry.target.getAttribute('data-reel-id')
          if (!reelId || pausedIdsRef.current.has(reelId)) return
          startYtPlayback(reelId)
        })
      },
      { threshold: 0.35 },
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [reelIdsKey, reels, startYtPlayback])

  useEffect(() => {
    const container = reelsRef.current
    const showcase = showcaseRef.current
    if (!container || !showcase || reels.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let paused = false
    let inViewport = false
    let resumeTimer = null

    const pauseAutoScroll = () => {
      paused = true
      if (resumeTimer) window.clearTimeout(resumeTimer)
    }

    const resumeAutoScroll = () => {
      if (inViewport) paused = false
    }

    const resumeAutoScrollLater = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(resumeAutoScroll, 4000)
    }

    const scrollNextReel = () => {
      if (paused || !inViewport) return

      const cards = Array.from(container.querySelectorAll('.reel-showcase-card'))
      if (!cards.length) return

      const scrollLeft = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      const atEnd = scrollLeft >= maxScroll - 8

      if (atEnd) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }

      let currentIndex = 0
      let minDistance = Infinity
      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - scrollLeft)
        if (distance < minDistance) {
          minDistance = distance
          currentIndex = index
        }
      })

      const nextCard = cards[Math.min(currentIndex + 1, cards.length - 1)]
      if (nextCard) {
        container.scrollTo({ left: nextCard.offsetLeft, behavior: 'smooth' })
      }
    }

    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting
        if (!inViewport) paused = true
        else if (!resumeTimer) paused = false
      },
      { threshold: 0.2 },
    )
    viewportObserver.observe(showcase)

    container.addEventListener('mouseenter', pauseAutoScroll)
    container.addEventListener('mouseleave', resumeAutoScroll)
    container.addEventListener('touchstart', pauseAutoScroll, { passive: true })
    container.addEventListener('touchend', resumeAutoScrollLater, { passive: true })
    container.addEventListener('wheel', pauseAutoScroll, { passive: true })
    container.addEventListener('wheel', resumeAutoScrollLater, { passive: true })

    const intervalId = window.setInterval(scrollNextReel, 4000)
    return () => {
      window.clearInterval(intervalId)
      if (resumeTimer) window.clearTimeout(resumeTimer)
      viewportObserver.disconnect()
      container.removeEventListener('mouseenter', pauseAutoScroll)
      container.removeEventListener('mouseleave', resumeAutoScroll)
      container.removeEventListener('touchstart', pauseAutoScroll)
      container.removeEventListener('touchend', resumeAutoScrollLater)
      container.removeEventListener('wheel', pauseAutoScroll)
      container.removeEventListener('wheel', resumeAutoScrollLater)
    }
  }, [reelIdsKey, reels.length])

  const toggleMute = (e, reelId) => {
    e.stopPropagation()
    const isMuted = mutedIds.has(reelId)
    sendYTCmd(reelId, isMuted ? 'unMute' : 'mute')
    setMutedIds((prev) => {
      const next = new Set(prev)
      if (isMuted) next.delete(reelId)
      else next.add(reelId)
      return next
    })
  }

  const toggleYTPause = (e, reelId) => {
    e.stopPropagation()
    const isPaused = pausedIds.has(reelId)
    sendYTCmd(reelId, isPaused ? 'playVideo' : 'pauseVideo')
    setPausedIds((prev) => {
      const next = new Set(prev)
      if (isPaused) next.delete(reelId)
      else next.add(reelId)
      return next
    })
    if (isPaused) startYtPlayback(reelId)
  }

  const toggleHtml5Pause = (e, reel) => {
    e.stopPropagation()
    const video = document.getElementById(`video-${reel.id}`)
    if (!video) return
    if (!pausedIds.has(reel.id) && !video.paused) {
      video.pause()
      setPausedIds((prev) => new Set(prev).add(reel.id))
      return
    }
    video.play()?.catch(() => {})
    setPausedIds((prev) => {
      const next = new Set(prev)
      next.delete(reel.id)
      return next
    })
  }

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
        logoSrc={theme === 'dark' ? (content.assets?.logoWhite || '/assets/logos/color-white-crop.png') : (content.assets?.logoBlack || '/assets/logos/color-black-crop.png')}
        theme={theme}
        onToggleTheme={toggleTheme}
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
            alt="Video editing for Instagram Reels, YouTube Shorts and podcasts by K For Kreative"
            width={1619}
            height={972}
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
        <section id="showcase" ref={showcaseRef} className="reels-grid-section" data-reveal>
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
      <FloatingCTA onOpen={() => setIsFormOpen(true)} />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
    </>
  )
}
