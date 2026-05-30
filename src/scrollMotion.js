import { useEffect } from 'react'

export function useAdvancedScroll(dependencyKey = '') {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.documentElement.classList.add('reduce-motion')
      return undefined
    }

    let frame = 0

    const update = () => {
      frame = 0
      const scrollY = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrollY / total : 0

      document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`)
      document.documentElement.style.setProperty('--scroll-progress', String(progress))

      document.querySelectorAll('[data-parallax]').forEach((element) => {
        const depth = Number(element.dataset.parallax || 0.08)
        const maxOffset = Number(element.dataset.parallaxMax || 0)
        const rect = element.getBoundingClientRect()
        const viewportCenter = window.innerHeight * 0.5
        const elementCenter = rect.top + rect.height * 0.5
        const rawOffset = (elementCenter - viewportCenter) * depth
        const offset = maxOffset > 0
          ? Math.max(-maxOffset, Math.min(maxOffset, rawOffset))
          : rawOffset
        element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
      })

      document.querySelectorAll('[data-scroll-section], .service-subpage > section').forEach((section) => {
        const rect = section.getBoundingClientRect()
        const visible = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1)
        section.style.setProperty('--section-progress', visible.toFixed(3))
      })
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [dependencyKey])
}
