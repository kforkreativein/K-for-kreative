import { defaultContent } from './contentFallback.js'

export { defaultContent }

export const navItems = defaultContent.nav
export const stats = defaultContent.hero?.stats || []
export const sections = defaultContent.sections
export const services = defaultContent.services?.items || defaultContent.services || []
export const servicesIntro = defaultContent.services?.intro || {}
export const workFilters = defaultContent.work?.filters || []
export const workItems = defaultContent.work?.items || []
export const processSteps = defaultContent.process?.steps || []
export const proofPoints = defaultContent.proof?.points || []
export const proofMetrics = defaultContent.proof?.metrics || []
export const clients = defaultContent.stories?.clients || []
export const footerSocials = defaultContent.footer?.socials || []

// Service page content
export const videoEditingContent = defaultContent.videoEditing || {}
export const socialMediaContent = defaultContent.socialMedia || {}
export const metaAdsContent = defaultContent.metaAds || {}
export const websiteDevContent = defaultContent.websiteDev || {}
