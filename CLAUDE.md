# CLAUDE.md — K For Kreative Website

This file provides guidance to Claude Code when working with the K For Kreative website codebase.

---

## Our Motive

**K For Kreative** is a premium creative marketing agency website for small businesses and personal brands. The site showcases services (video editing, social media management, Meta ads, website development) with a focus on:

- **Premium aesthetics** — Clean, minimal design with paper-grain texture and warm neutrals
- **Performance proof** — Live metrics, campaign dashboards, client showcases
- **Editable content** — Full CMS-like experience via JSON-based admin panel
- **Conversion-focused** — Strategic CTAs, contact forms, service-specific landing pages

---

## Core Principles (Karpathy-Inspired)

### 1. Think Before Coding
- State assumptions explicitly about content structure
- Present tradeoffs when editing nested JSON vs component props
- Surface ambiguity in bracket-headline parsing or content normalization
- Ask when service page routing or admin preview routing is unclear

### 2. Simplicity First
- Minimum viable changes to achieve the goal
- No speculative abstractions — keep content editing straightforward
- Match existing React patterns (no new state libraries)
- Bracket-headline emphasis is simple text parsing, not a full markdown engine

### 3. Surgical Changes
- Touch only the section being edited in `content.json`
- Match existing code style in `AdminApp.jsx` and `SectionEditor.jsx`
- Don't refactor adjacent service pages when editing one
- Clean up only imports/variables made unused by YOUR changes

### 4. Goal-Driven Execution
Define success criteria for edits:
```
1. Update content.json structure → verify: Schema loads without errors
2. Update AdminApp sidebar → verify: New section appears and is clickable
3. Update service page component → verify: Page renders with new content
4. Test preview routing → verify: Admin preview navigates to correct page
```

---

## Project Architecture

### Tech Stack
- **Frontend:** React 19 + Vite + React Router DOM
- **Backend:** Express.js (content API + auth)
- **Build:** Vite (port 3002), Express server (port 3003)
- **Content:** JSON-based CMS in `data/content.json`
- **Auth:** JWT-based admin authentication

### Directory Structure
```
/Users/krish/Documents/Ai/Web-Projects/Kforkreative-v2/
├── data/
│   └── content.json              # Single source of truth for all content
├── src/
│   ├── App.jsx                   # Main app, router, MarketingSite
│   ├── main.jsx                  # Entry point
│   ├── siteData.js               # Content exports, normalization
│   ├── scrollMotion.js           # Scroll reveal animations
│   ├── useNavbarShrink.js        # Navbar scroll behavior
│   ├── components/
│   │   ├── BracketText.jsx       # [Bracket] headline emphasis parser
│   │   ├── FooterSocialIcon.jsx  # Social icon component
│   │   ├── PremiumCTA.jsx        # Premium CTA component
│   │   └── ServiceArt.jsx        # Service page art band component
│   ├── pages/
│   │   ├── VideoEditing.jsx      # Video editing service page
│   │   ├── SocialMedia.jsx       # Social media service page
│   │   ├── MetaAds.jsx           # Meta ads service page
│   │   ├── WebsiteDev.jsx        # Website development service page
│   │   └── Services.jsx          # Services listing page
│   └── admin/
│       ├── AdminApp.jsx          # Main admin panel, sidebar, preview
│       ├── SectionEditor.jsx     # Dynamic form editor for JSON sections
│       ├── ArrayEditor.jsx       # Array editing UI
│       ├── Login.jsx             # Admin login form
│       └── contentFields.js      # Field configuration constants
├── lib/
│   ├── adminAuth.js              # JWT auth helpers
│   ├── contentStore.js           # Content persistence
│   ├── contentUtils.js           # Content normalization
│   └── validateContent.js        # Content schema validation
├── tests/                        # Unit tests for lib modules
├── public/assets/                # Static assets (logos, images)
└── server.js                     # Express server (API + static)
```

---

## Content Editing System

### How We Edit Content

**Primary Method:** JSON-based Admin Panel at `/admin`

1. **Login** with credentials (stored in `.env.local`)
2. **Sidebar Navigation** — Click any section to edit:
   - `Hero + Stats` — Hero headline, subhead, CTAs, stats
   - `Services (Intro + Items)` — Services intro + 4 service cards
   - `Page: Video Editing` — Full video editing page content
   - `Page: Social Media` — Full social media page content
   - `Page: Meta Ads` — Full Meta ads page content
   - `Page: Website Development` — Full website dev page content
   - Plus: About, Work, Process, Proof, Stories, Contact, Footer, Lead Form

3. **Live Preview** — Right panel shows real-time preview
   - Service pages auto-navigate in preview when selected
   - Changes save to `sessionStorage` first, then to `content.json`

4. **Save** — Click "Save section changes" to persist to disk

### Content.json Structure

```json
{
  "meta": { "title", "description", "canonicalUrl", "image", "keywords" },
  "nav": [{ "label", "href" }],
  "assets": { "logoBlack", "logoWhite", "favicon" },
  "sections": { "hero", "about", "services", "work", "process", "proof", "stories", "contact", "socialPortfolio", "socialInstagram", ... },
  "hero": {
    "eyebrow", "headline", "emphasis", "subhead",
    "ctaPrimary", "ctaSecondary", "artCaption",
    "stats": [{ "value", "label" }]  // ← Nested under hero
  },
  "about": { "eyebrow", "headline", "emphasis", "body", "signature", "linkLabel" },
  "services": {
    "intro": { "eyebrow", "headline", "emphasis", "body", "linkLabel" },  // ← Nested intro
    "items": [{ "badge", "icon", "title", "body" }]  // ← Service cards
  },
  "work": { "eyebrow", "headline", "filters": [...], "items": [...] },
  "process": { "eyebrow", "headline", "steps": [...] },
  "proof": { "eyebrow", "headline", "points": [...], "metrics": [...] },
  "stories": { "eyebrow", "headline", "clients": [...] },
  "contact": { "eyebrow", "headline", "body", "ctaPrimary", "ctaSecondary", "email" },
  "footer": { "brandName", "legalName", "copyright", "socials": [...] },
  "form": { "title", "fields": [...], "submitLabel", "successTitle", "successBody" },
  
  // Service Page Content (fully editable)
  "videoEditing": {
    "badge", "headline", "emphasis", "lead", "ctaPrimary", "ctaSecondary",
    "images": { "hero", "cta" },
    "formatsEyebrow", "formatsHeadline", "formatsBody",
    "formats": [{ "num", "title", "body" }],
    "showcaseEyebrow", "showcaseHeadline", "showcaseBody",
    "reels": [{ "id", "title", "category", "videoUrl", "duration", "views" }],
    "processEyebrow", "processHeadline", "processBody",
    "processSteps": [{ "step", "title", "desc" }],
    "metricsBadge", "metricsHeadline", "metricsBody",
    "metrics": [{ "label", "value", "trend" }]
  },
  "socialMedia": { ...similar structure... },
  "metaAds": { ...similar structure... },
  "websiteDev": { ...similar structure... }
}
```

### Bracket Headlines

Headlines use `[bracket syntax]` for emphasis:
```json
"headline": "Video Editing Spliced for [High Retention].",
"emphasis": "High Retention"
```

The `BracketText` component parses brackets and applies special styling to emphasized words.

---

## Main Pages Created

### 1. Home Page (`/`) — MarketingSite
**Sections (in order):**
- **Hero** — Eyebrow, bracket headline, subhead, CTAs, stats grid (15+ Clients, 300+ Reels, 10+ Accounts), art panel
- **About** — Left text (bracket headline, body, signature), right art panel
- **Services** — Intro text + 4 service cards (Video Editing, Social Media, Meta Ads, Website Development)
- **Work** — Portfolio gallery with filters (All, Video Editing, Social Media, Meta Ads, Website)
- **Process** — 4-step workflow with art panel
- **Proof** — Trust signals (points + metrics)
- **Stories** — Client testimonials
- **Contact** — Contact info + footer

### 2. Video Editing (`/services/video-editing`)
- Hero with art band
- Video Formats section (UGC Ads, Talking Heads, Podcast Clips)
- Selected Reels showcase (click-to-play grid)
- Process steps (Footage → Splicing → Captions → Delivery)
- Performance metrics dashboard
- Contact section with service-specific CTA art

### 3. Social Media (`/services/social-media-management`)
- Hero with art band
- Client profiles selector (Mehul Chhatrala, Raj Patel, Hemali Kevalia, Pushti Shah)
- Phone mockup showing selected client's profile
- Client reels grid (filtered by selected client)
- SMM Process (Audit → Curation → Publishing → Analysis)
- Growth execution pillars
- Organic growth metrics
- Contact section with service-specific CTA art

### 4. Meta Ads (`/services/meta-ads`)
- Hero with art band (yellow accent)
- Live performance dashboard (ROAS, Leads, CPL, Spend)
- Campaign showcase (Wellness Lead Gen, E-commerce Fitness)
- Ads workflow (Strategy → Creative → Testing → Scale)
- Performance ad system pillars
- Leads & ROAS achievements
- Contact section with service-specific CTA art

### 5. Website Development (`/services/website`)
- Hero with art band (green accent)
- Live website mockups (browser frames with tabs)
- Showcase sites: Krish Live, KFK Hub, Wellness
- Web development process
- Development stack features
- Core Web Vitals metrics
- Contact section with service-specific CTA art

### 6. Admin Panel (`/admin`)
- JWT login form
- Sidebar with all editable sections
- Dynamic form editor (text inputs, textareas, arrays, file uploads)
- Live preview iframe with auto-navigation
- Save to disk functionality

---

## Routing & Preview System

### Route Mapping (Admin → Preview)
```javascript
const SECTION_TO_ROUTE = {
  videoEditing: '/services/video-editing',
  socialMedia: '/services/social-media-management',
  metaAds: '/services/meta-ads',
  websiteDev: '/services/website',
}
```

When admin clicks a service page, the preview iframe navigates to that route via `?preview=1&route=/services/...` parameter.

### Content Flow
1. **Edit** in admin → saved to `sessionStorage` (real-time preview)
2. **Save** → POST to `/api/content` → written to `data/content.json`
3. **Public Site** → Reads `content.json` at build time or via API
4. **Preview Mode** → `?preview=1` loads from `sessionStorage` draft

---

## Key Implementation Details

### Content Normalization
- `normalizeContent()` merges defaults with saved content
- Ensures new fields don't break existing content
- Handled in `contentUtils.js`

### Admin Authentication
- JWT token stored in `sessionStorage`
- Credentials in `.env.local` (ADMIN_USERNAME, ADMIN_PASSWORD)
- Token expires after 24 hours

### File Uploads
- Images upload to `/public/assets/uploads/`
- Filename: `timestamp-originalname`
- Referenced in content.json by path

### Validation
- `validateContent.js` checks shape against defaults
- Runs before save to prevent malformed JSON

### Responsive Breakpoints
- Desktop: 1440px+ (full layout)
- Tablet: 768px–1439px (adjusted grids)
- Mobile: < 768px (stacked layouts, hidden decorative elements)

---

## Development Workflow

### Running Locally
```bash
npm run dev      # Vite (3002) + Express server (3003)
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Run unit tests
```

### Adding New Editable Sections
1. Add default content to `defaultContent` in `siteData.js`
2. Add to `SECTION_LABELS` in `AdminApp.jsx`
3. Update `BRACKET_HEADLINE_OBJECTS` if using bracket headlines
4. If service page, add to `SECTION_TO_ROUTE` for preview routing
5. Update component to read from `content.newSection`

### Adding New Service Pages
1. Create page component in `src/pages/`
2. Add route in `App.jsx` router
3. Add default content to `content.json` and `siteData.js`
4. Add `SECTION_LABELS` entry in `AdminApp.jsx`
5. Add to `SECTION_TO_ROUTE` for preview navigation
6. Update `SectionEditor.jsx` if nested editing needed

---

## Critical Files Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `data/content.json` | All website content | Never directly — use admin panel |
| `src/siteData.js` | Content exports, defaults | Adding new sections |
| `src/App.jsx` | Router, main layout | New routes, page components |
| `src/admin/AdminApp.jsx` | Admin panel, sidebar | New admin sections, preview routing |
| `src/admin/SectionEditor.jsx` | Form editor | New field types, nested editing |
| `lib/validateContent.js` | Schema validation | New content structure |
| `lib/contentUtils.js` | Normalization | Content transformation logic |
| `server.js` | API endpoints | New backend functionality |

---

## Design System

### Colors
- **Primary:** `#f36f21` (coral/orange) — CTAs, accents, Video Editing theme
- **Secondary:** `#5da77a` (sage green) — Website Dev theme
- **Tertiary:** `#2d7df6` (blue) — Social Media theme
- **Accent:** `#e8ad21` (yellow) — Meta Ads theme
- **Neutral:** `#fffaf1` (warm white), `#e9e2d6` (beige), `#1b1712` (dark)

### Typography
- **Display:** `"DM Serif Display", serif` — Headlines, bracket text
- **Body:** `"Inter", sans-serif` — UI, body text

### Spacing
- Section padding: `clamp(60px, 6vw, 120px)`
- Content max-width: `1280px`
- Grid gaps: `20px`–`40px`

---

## Testing

Run tests with:
```bash
npm test
```

Test files:
- `tests/adminAuth.test.js` — JWT auth
- `tests/contentStore.test.js` — Content persistence
- `tests/contentUtils.test.js` — Normalization
- `tests/contentValidation.test.js` — Schema validation

---

## Notes for Claude

- **Always** use `pageContent.images?.hero` pattern with fallbacks
- **Always** update `SECTION_TO_ROUTE` when adding service pages
- **Always** add defaults to `siteData.js` before using in components
- **Never** directly edit `content.json` — use admin panel or provide migration scripts
- **Prefer** minimal edits — this is a live production website
- **Verify** JSON syntax after any content.json changes
- **Test** preview routing after admin changes
