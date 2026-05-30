const DEFAULT_ICON_PATHS = {
  portfolio: '/assets/icons/social/website.png',
  instagram: '/assets/icons/social/instagram.png',
  linkedin: '/assets/icons/social/linkedin.png',
  whatsapp: '/assets/icons/social/whatsapp.png',
  email: '/assets/icons/social/mail.png',
  x: '/assets/icons/social/x.png',
}

const SECTION_ICON_KEYS = {
  portfolio: 'socialPortfolio',
  instagram: 'socialInstagram',
  linkedin: 'socialLinkedin',
  whatsapp: 'socialWhatsapp',
  email: 'socialEmail',
  x: 'socialX',
}

export default function FooterSocialIcon({ name, sections = {} }) {
  const sectionKey = SECTION_ICON_KEYS[name]
  const src = (sectionKey && sections[sectionKey]) || DEFAULT_ICON_PATHS[name] || DEFAULT_ICON_PATHS.portfolio

  return (
    <img
      src={src}
      alt=""
      className="footer-social-icon"
      width={20}
      height={20}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  )
}
