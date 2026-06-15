import { useEffect } from 'react'

export function useAdvancedScroll(dependencyKey = '') {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.documentElement.classList.add('reduce-motion')
      return undefined
    }

    let frame = 0
    let parallaxElements = []
    let serviceSections = []

    const cacheElements = () => {
      parallaxElements = [...document.querySelectorAll('[data-parallax]')]
      serviceSections = [...document.querySelectorAll('.service-subpage > section')]
    }

    const update = () => {
      frame = 0
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? window.scrollY / total : 0

      document.documentElement.style.setProperty('--scroll-progress', String(progress))

      parallaxElements.forEach((element) => {
        const depth = Number(element.dataset.parallax || 0.08)
        if (depth === 0) return

        const maxOffset = Number(element.dataset.parallaxMax || 0)
        const rect = element.getBoundingClientRect()
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return

        const viewportCenter = window.innerHeight * 0.5
        const elementCenter = rect.top + rect.height * 0.5
        const rawOffset = (elementCenter - viewportCenter) * depth
        const offset = maxOffset > 0
          ? Math.max(-maxOffset, Math.min(maxOffset, rawOffset))
          : rawOffset
        element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
      })

      serviceSections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return

        const visible = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1)
        section.style.setProperty('--section-progress', visible.toFixed(3))
      })
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const onResize = () => {
      cacheElements()
      onScroll()
    }

    cacheElements()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [dependencyKey])
}
