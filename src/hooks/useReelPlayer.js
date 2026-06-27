import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function isYoutubeUrl(url) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export function getYtId(url) {
  if (url.includes('/embed/')) return url.split('/embed/')[1]?.split('?')[0] ?? ''
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/)
  return match?.[1] ?? ''
}

export function buildYtEmbedSrc(videoUrl, origin) {
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

export function useReelPlayer(reels, { observerSelector = '.reel-showcase-card[data-reel-id]', resetKey } = {}) {
  const [mutedIds, setMutedIds] = useState(() => new Set())
  const [pausedIds, setPausedIds] = useState(() => new Set())
  const [progressById, setProgressById] = useState({})
  const iframeRefs = useRef({})
  const pausedIdsRef = useRef(pausedIds)

  const reelIdsKey = useMemo(() => reels.map((reel) => reel.id).join(','), [reels])

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

  useEffect(() => {
    const activeIds = new Set(reels.map((reel) => reel.id))
    Object.keys(iframeRefs.current).forEach((id) => {
      if (!activeIds.has(id)) delete iframeRefs.current[id]
    })

    reels.forEach((reel) => {
      if (isYoutubeUrl(reel.videoUrl)) {
        sendYTCmd(reel.id, 'pauseVideo')
      } else {
        const video = document.getElementById(`video-${reel.id}`)
        if (video) {
          video.pause()
          video.currentTime = 0
        }
      }
    })

    const ytIds = reels.filter((reel) => isYoutubeUrl(reel.videoUrl)).map((reel) => reel.id)
    setMutedIds(new Set(ytIds))
    setPausedIds(new Set())
    setProgressById({})
  }, [reelIdsKey, reels, resetKey, sendYTCmd])

  useEffect(() => {
    const timers = reels
      .filter((reel) => isYoutubeUrl(reel.videoUrl))
      .flatMap((reel) => [250, 700, 1400].map((delay) => window.setTimeout(() => {
        if (!pausedIdsRef.current.has(reel.id)) {
          startYtPlayback(reel.id)
        }
      }, delay)))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [reelIdsKey, reels, resetKey, startYtPlayback])

  useEffect(() => {
    reels.forEach((reel) => {
      if (isYoutubeUrl(reel.videoUrl)) return
      const video = document.getElementById(`video-${reel.id}`)
      video?.play()?.catch(() => {})
    })
  }, [reelIdsKey, reels, resetKey])

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
    const cards = document.querySelectorAll(observerSelector)
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

    window.requestAnimationFrame(() => {
      cards.forEach((card) => {
        const reelId = card.getAttribute('data-reel-id')
        if (!reelId || pausedIdsRef.current.has(reelId)) return
        const rect = card.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        if (inView) startYtPlayback(reelId)
      })
    })

    return () => observer.disconnect()
  }, [reelIdsKey, reels, startYtPlayback, observerSelector, resetKey])

  const toggleMute = useCallback((e, reelId) => {
    e.stopPropagation()
    const isMuted = mutedIds.has(reelId)
    sendYTCmd(reelId, isMuted ? 'unMute' : 'mute')
    setMutedIds((prev) => {
      const next = new Set(prev)
      if (isMuted) next.delete(reelId)
      else next.add(reelId)
      return next
    })
  }, [mutedIds, sendYTCmd])

  const toggleYTPause = useCallback((e, reelId) => {
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
  }, [pausedIds, sendYTCmd, startYtPlayback])

  const toggleHtml5Pause = useCallback((e, reel) => {
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
  }, [pausedIds])

  return {
    mutedIds,
    pausedIds,
    progressById,
    iframeRefs,
    startYtPlayback,
    toggleMute,
    toggleYTPause,
    toggleHtml5Pause,
  }
}
