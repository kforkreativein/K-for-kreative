import { useEffect } from 'react'

const PILL_PAD = 20
const BRAND_REST_LEFT = 20
const CTA_REST_RIGHT = 20
const LERP = 0.09

function smoothstep(value) {
  return value * value * (3 - 2 * value)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

export function useNavbarShrink() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = 0
    let target = 0
    let frame = null

    const getTarget = () => {
      const aboutSection = document.querySelector('#about')
      const distance = Math.max(
        320,
        (aboutSection?.offsetTop || window.innerHeight) - 120,
      )
      const raw = Math.min(Math.max(window.scrollY / distance, 0), 1)
      return reduced ? (raw > 0.5 ? 1 : 0) : smoothstep(raw)
    }

    const applyFrame = () => {
      frame = null

      current = reduced ? target : lerp(current, target, LERP)
      if (Math.abs(current - target) < 0.0004) current = target

      const shrink = current
      document.documentElement.style.setProperty('--nav-shrink', shrink.toFixed(4))

      if (window.innerWidth <= 767) {
        document.documentElement.style.setProperty('--brand-shift', '0px')
        document.documentElement.style.setProperty('--cta-shift', '0px')
        document.documentElement.style.setProperty('--pill-left', '0px')
        document.documentElement.style.setProperty('--pill-right', '0px')
        if (current !== target) frame = window.requestAnimationFrame(applyFrame)
        return
      }

      const navbar = document.querySelector('.navbar')
      const nav = document.querySelector('.navbar-menu')
      const brand = document.querySelector('.navbar .brand')
      const cta = document.querySelector('.navbar .nav-cta')

      if (!navbar || !nav || !brand || !cta) {
        if (current !== target) frame = window.requestAnimationFrame(applyFrame)
        return
      }

      const navbarRect = navbar.getBoundingClientRect()
      const navRect = nav.getBoundingClientRect()
      const brandWidth = brand.offsetWidth
      const ctaHidden = window.getComputedStyle(cta).display === 'none'
      const navGap = window.innerWidth <= 900 ? 18 : 52

      const brandTargetLeft = navRect.left - navGap - brandWidth - navbarRect.left
      const brandShift = (brandTargetLeft - BRAND_REST_LEFT) * shrink

      let ctaShift = 0
      let ctaWidth = 0

      if (!ctaHidden) {
        ctaWidth = cta.offsetWidth
        const ctaRestLeft = navbarRect.width - CTA_REST_RIGHT - ctaWidth
        const ctaTargetLeft = navRect.right + navGap - navbarRect.left
        ctaShift = (ctaTargetLeft - ctaRestLeft) * shrink
      }

      const pillTargetLeft = Math.max(0, brandTargetLeft - PILL_PAD)
      const pillLeft = pillTargetLeft * shrink

      let pillRight = 0
      if (!ctaHidden) {
        const ctaTargetLeft = navRect.right + navGap - navbarRect.left
        const ctaTargetRight = ctaTargetLeft + ctaWidth
        const pillTargetRight = Math.max(0, navbarRect.width - ctaTargetRight - PILL_PAD)
        pillRight = pillTargetRight * shrink
      }

      document.documentElement.style.setProperty('--brand-shift', `${brandShift.toFixed(2)}px`)
      document.documentElement.style.setProperty('--cta-shift', `${ctaShift.toFixed(2)}px`)
      document.documentElement.style.setProperty('--pill-left', `${pillLeft.toFixed(2)}px`)
      document.documentElement.style.setProperty('--pill-right', `${pillRight.toFixed(2)}px`)

      if (current !== target) frame = window.requestAnimationFrame(applyFrame)
    }

    const onScroll = () => {
      target = getTarget()
      if (!frame) frame = window.requestAnimationFrame(applyFrame)
    }

    target = getTarget()
    current = target
    applyFrame()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      ;['--nav-shrink', '--brand-shift', '--cta-shift', '--pill-left', '--pill-right'].forEach(
        (prop) => document.documentElement.style.removeProperty(prop),
      )
    }
  }, [])
}
