import { useEffect, useState } from 'react'
import {
  Navbar,
  ContactFormModal,
  ThemeToggle,
  FloatingCTA,
  useScrollProgress,
  useTheme,
  useSiteContent,
} from '../App.jsx'
import { useNavbarShrink } from '../useNavbarShrink.js'
import SiteFooter from './SiteFooter.jsx'

export default function LegalPage({ title, updated, description, children }) {
  const content = useSiteContent()
  const progress = useScrollProgress()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()

  useNavbarShrink()

  const logoSrc =
    theme === 'dark'
      ? content.assets?.logoWhite || '/assets/logos/color-white-crop.png'
      : content.assets?.logoBlack || '/assets/logos/color-black-crop.png'

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | K For Kreative`
    const meta = document.querySelector('meta[name="description"]')
    const previousDesc = meta?.getAttribute('content')
    if (meta && description) meta.setAttribute('content', description)
    window.scrollTo(0, 0)
    return () => {
      document.title = previousTitle
      if (meta && previousDesc != null) meta.setAttribute('content', previousDesc)
    }
  }, [title, description])

  return (
    <>
    <div className="legal-grid-overlay" aria-hidden="true" />
    <div className="paper-grain" aria-hidden="true" />
    <div className="legal-page">
      <Navbar
        active=""
        progress={progress}
        onOpenContact={() => setIsFormOpen(true)}
        navItems={content.nav}
        logoSrc={logoSrc}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="legal-main">
        <article className="legal-article">
          <p className="legal-eyebrow">Legal</p>
          <h1>{title}</h1>
          {updated && <p className="legal-updated">Last updated: {updated}</p>}
          {children}
        </article>
      </main>

      <footer className="legal-footer-wrap">
        <SiteFooter content={content} />
      </footer>

      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <FloatingCTA onOpen={() => setIsFormOpen(true)} showFromTop />
      {isFormOpen && <ContactFormModal onClose={() => setIsFormOpen(false)} content={content} />}
    </div>
    </>
  )
}
