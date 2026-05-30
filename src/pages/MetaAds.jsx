import { useEffect, useState } from 'react'
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

export default function MetaAds() {
  const content = useSiteContent()
  const pageContent = content.metaAds || {}
  const progress = useScrollProgress()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const pageImages = pageContent.images || {}
  const ctaContent = {
    eyebrow: 'Start scaling ads',
    headline: 'Ready to scale Meta campaigns with [cleaner creative testing]?',
    emphasis: 'cleaner creative testing',
    body: 'Tell us your offer, audience, funnel, and current ad performance. We will map the campaign structure, creative angles, and optimization plan for profitable scaling.',
    ctaPrimary: pageContent.ctaPrimary || 'Start scaling ads',
    ctaSecondary: 'Email Us',
    email: content.contact.email
  }

  useReveals()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const campaigns = pageContent.campaigns || [
    {
      title: 'High-Intent Wellness Lead Generation',
      objective: 'Lead Generation',
      audience: 'Wellness & Preventive Health interests (Ages 28–54, India)',
      creatives: 'Dynamic UGC Hook Videos + Carousel testimonial cards',
      desc: 'Focused on acquiring high-quality consultations. We structured the hook copy to address back-pain and stress concerns directly.',
      results: { leads: '1,240', cpl: '₹2.80', roas: '3.8x' }
    },
    {
      title: 'Scale E-commerce Fitness Subscriptions',
      objective: 'Sales / Direct Purchase',
      audience: 'Active gym-goers, workout gear buyers (Lookalikes 2%-5%)',
      creatives: 'Product closeups, high-contrast text overlays, fast-cut B-roll',
      desc: 'Focused on direct checkouts. We tested 5 creative hooks in parallel to identify the most cost-efficient scaling avenue.',
      results: { leads: '1,240', cpl: '₹3.52', roas: '5.4x' }
    }
  ]

  const processSteps = pageContent.processSteps || [
    {
      step: '01',
      title: 'Campaign Strategy & Setup',
      desc: 'We research your audience, define conversion objectives, and build the campaign architecture — campaigns, ad sets, and targeting layers.'
    },
    {
      step: '02',
      title: 'Creative Production',
      desc: 'We design scroll-stopping static and video creatives with direct response copy built to address objections and trigger immediate action.'
    },
    {
      step: '03',
      title: 'Launch & A/B Testing',
      desc: 'We split-test multiple creative angles and audiences simultaneously to identify the highest-performing hooks within the first 72 hours.'
    },
    {
      step: '04',
      title: 'Scale & Optimize',
      desc: 'We scale winning ad sets, kill underperformers, and continuously refine targeting, copy, and bid strategies to improve ROAS over time.'
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

      <main className="service-subpage ads-page" style={{ '--hero-accent-rgb': '204, 148, 8', '--step-accent-rgb': '204, 148, 8', '--section-accent-rgb': '204, 148, 8', '--benefit-accent-rgb': '204, 148, 8', '--dashboard-accent-rgb': '204, 148, 8' }}>
        {/* Hero Section */}
        <section className="service-hero centered" style={{ '--hero-accent-rgb': '204, 148, 8' }}>
          <div className="service-hero-inner centered">
            <span className="service-badge-glow">{pageContent.badge || 'Performance Marketing'}</span>
            <h1 className="service-title-h1">
              <BracketText text={pageContent.headline || 'High-ROI Meta Ads Engineered for [Customer Acquisition].'} emphasis={pageContent.emphasis} />
            </h1>
            <p className="service-lead-p">
              {pageContent.lead || 'We design, build, and optimize Facebook and Instagram ad campaigns. Through creative variance testing and customer psychology copy, we scale return on ad spend.'}
            </p>
            <div className="service-hero-actions">
              <button className="button primary" onClick={() => setIsFormOpen(true)}>
                {pageContent.ctaPrimary || 'Start scaling ads'} <ArrowIcon />
              </button>
              <a href="#campaigns" className="button ghost">
                {pageContent.ctaSecondary || 'Explore Campaigns'} <ArrowIcon />
              </a>
            </div>
          </div>
          <ServiceArtBand
            src={pageImages.hero}
            variant="hero"
            className="ads-service-art"
          />
          <div className="service-hero-accent-glow" style={{ background: 'radial-gradient(circle, rgba(204, 148, 8, 0.22), transparent 68%)' }} />
        </section>

        {/* Live Performance Results */}
        <section className="results-metrics-section" data-reveal>
          <div className="section-inner">
            <div className="results-dashboard-box">
              <span className="results-badge">{pageContent.liveBadge || 'Live Performance'}</span>
              <h2>{pageContent.liveHeadline || 'Our Active Campaign Dashboard'}</h2>
              <p>{pageContent.liveBody || 'Real numbers from our active ad accounts, updated in real-time across client funnels.'}</p>
              <div className="results-grid-four">
                {(pageContent.liveMetrics || []).map((metric, index) => (
                  <div className={`result-metric-card ${index === 0 ? 'highlight-accent' : ''}`} key={index}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <small className={metric.trend?.includes('-') ? 'trend-down' : 'trend-up'}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }}><path d="M5 15l7-7 7 7"/></svg>
                      {metric.trend}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Details Section */}
        <section id="campaigns" className="campaigns-details-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
              <div className="label-block">
                <span>{pageContent.campaignsEyebrow || 'Campaign Logs'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.campaignsHeadline || 'Strategic [Meta Ad Campaigns]'} />
              </h2>
              <p>{pageContent.campaignsBody || 'An inside look at the campaigns we run, showing target audiences, direct objectives, and creative formats.'}</p>
            </div>
            <div className="campaigns-list-container">
              {campaigns.map((camp, index) => (
                <div key={index} className="campaign-detail-card">
                  <div className="campaign-card-header">
                    <h3>{camp.title}</h3>
                    <span className="objective-tag">{camp.objective}</span>
                  </div>
                  <p className="campaign-desc">{camp.desc}</p>
                  
                  <div className="campaign-meta-bullets">
                    <div>
                      <strong>Target Audience:</strong>
                      <span>{camp.audience}</span>
                    </div>
                    <div>
                      <strong>Creative Structure:</strong>
                      <span>{camp.creatives}</span>
                    </div>
                  </div>

                  <div className="campaign-results-row">
                    <div className="camp-result-chip">
                      <span>Leads</span>
                      <strong>{camp.leads}</strong>
                    </div>
                    <div className="camp-result-chip">
                      <span>CPL</span>
                      <strong>{camp.cpl}</strong>
                    </div>
                    <div className="camp-result-chip winner">
                      <span>ROAS</span>
                      <strong>{camp.roas}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="smm-process-section" data-reveal>
          <div className="section-inner">
            <div className="section-header-row centered">
               <div className="label-block">
                <span>{pageContent.processEyebrow || 'Our Workflow'}</span>
              </div>
              <h2>
                <BracketText text={pageContent.processHeadline || 'Our [Meta Ads] Execution Framework'} />
              </h2>
              <p>{pageContent.processBody || 'A proven 4-step system for launching, testing, and scaling high-performance paid campaigns.'}</p>
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
            <h2 className="section-center-title">{pageContent.pillarsHeadline || 'The Performance Ad System'}</h2>
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

        {/* Paid Ads Results Dashboard */}
        <section className="results-metrics-section" data-reveal>
          <div className="section-inner">
            <div className="results-dashboard-box ads-theme">
              <span className="results-badge">{pageContent.resultsBadge || 'Campaign Performance Metrics'}</span>
              <h2>{pageContent.resultsHeadline || 'Leads & ROAS Achievements'}</h2>
              <p>{pageContent.resultsBody || 'Direct advertising results captured from scaling performance spends across active client funnels.'}</p>
              <div className="results-grid-four">
                {(pageContent.results || []).map((result, index) => (
                  <div className={`result-metric-card ${index === 1 || index === 3 ? 'highlight-accent' : ''}`} key={index}>
                    <span>{result.label}</span>
                    <strong>{result.value}</strong>
                    <small className={result.trend?.includes('-') ? 'trend-down' : 'trend-up'}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }}><path d="M5 15l7-7 7 7"/></svg>
                      {result.trend}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ServicePager current="meta-ads" />

        <ContactSection content={content} onOpenContact={() => setIsFormOpen(true)} artSrc={pageImages.cta} ctaContent={ctaContent} />
      </main>

      {isFormOpen && <ContactFormModal onClose={() => setIsFormOpen(false)} content={content} />}
    </>
  )
}
