# Codex — K For Kreative Website

Quick reference for the K For Kreative website codebase. Keep this file open alongside your work.

---

## Operating Principles (Karpathy-Inspired)

These four principles guide all development work on this codebase:

### 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

- **State assumptions explicitly** — If uncertain about content structure or routing, ask rather than guess
- **Present multiple interpretations** — Don't pick silently when ambiguity exists (e.g., nested vs flat content structure)
- **Push back when warranted** — If a simpler approach exists for bracket-headline parsing or content normalization, say so
- **Stop when confused** — Name what's unclear (e.g., "Should this be a new top-level key or nested under services?")

### 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

- **No features beyond what was asked** — Don't add extra field types to SectionEditor unless requested
- **No abstractions for single-use code** — Keep content editing straightforward, no plugin architecture
- **No "flexibility" that wasn't requested** — Don't make bracket parsing handle markdown when brackets suffice
- **No error handling for impossible scenarios** — Don't validate fields that don't exist yet
- **If 200 lines could be 50, rewrite it** — The test: Would a senior engineer say this is overcomplicated?

### 3. Surgical Changes
Touch only what you must. Clean up only your own mess.

- **Don't "improve" adjacent code** — When editing VideoEditing.jsx, don't refactor SocialMedia.jsx
- **Don't refactor things that aren't broken** — Match existing style in AdminApp.jsx even if you'd do it differently
- **Match existing style** — Use the same patterns for service pages, even if repetitive
- **If you notice unrelated dead code, mention it — don't delete it** — Leave pre-existing dead code unless asked
- **Remove imports/variables/functions that YOUR changes made unused** — Clean up pageImages imports if you remove ServiceArtBand

### 4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

```
1. Update content.json structure       → verify: Schema loads without errors
2. Update AdminApp sidebar             → verify: New section appears and is clickable  
3. Update service page component       → verify: Page renders with new content
4. Test preview routing                → verify: Admin preview navigates to correct page
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Project

**K For Kreative** — Premium creative marketing agency website
- **Stack:** React 19 + Vite + Express + JSON CMS
- **Live:** https://kforkreative.in/
- **Admin:** https://kforkreative.in/admin

---

## Quick Commands

```bash
cd /Users/krish/Documents/Ai/Web-Projects/Kforkreative-v2

# Development (runs both Vite + Express)
npm run dev

# Build for production
npm run build

# Test
npm test

# Just Express server
npm run dev:server
```

---

## File Map

```
src/
├── App.jsx                    # Router, MarketingSite, ContactSection
├── siteData.js                # defaultContent, exports, normalization
├── scrollMotion.js            # Scroll reveal animations
├── useNavbarShrink.js         # Navbar shrink on scroll
├── components/
│   ├── BracketText.jsx        # Parses [bracket] emphasis
│   ├── FooterSocialIcon.jsx   # Social icons
│   ├── PremiumCTA.jsx         # CTA component
│   └── ServiceArt.jsx         # Service page art bands
├── pages/
│   ├── VideoEditing.jsx       # /services/video-editing
│   ├── SocialMedia.jsx        # /services/social-media-management
│   ├── MetaAds.jsx            # /services/meta-ads
│   ├── WebsiteDev.jsx         # /services/website
│   └── Services.jsx           # /services
└── admin/
    ├── AdminApp.jsx           # Main admin, sidebar, preview iframe
    ├── SectionEditor.jsx      # Dynamic JSON form editor
    ├── ArrayEditor.jsx        # Array item editing UI
    ├── Login.jsx              # Admin login
    └── contentFields.js       # HIDDEN_FIELDS, ICON_OPTIONS constants

data/
└── content.json               # All website content (single source of truth)

lib/
├── adminAuth.js               # JWT sign/verify
├── contentStore.js            # Read/write content.json
├── contentUtils.js            # normalizeContent(), updateObject()
└── validateContent.js         # Schema validation

tests/
├── adminAuth.test.js
├── contentStore.test.js
├── contentUtils.test.js
└── contentValidation.test.js
```

---

## Content.json Quick Reference

### Top-Level Keys
```json
{
  "meta": {},           // SEO: title, description, keywords
  "nav": [],            // Navigation items
  "assets": {},         // logoBlack, logoWhite, favicon
  "sections": {},       // Art/image paths for each section
  "hero": {},           // + nested "stats" array
  "about": {},
  "services": {},       // + nested "intro" + "items" array
  "work": {},           // filters + items
  "process": {},        // steps array
  "proof": {},          // points + metrics arrays
  "stories": {},        // clients array
  "contact": {},
  "footer": {},         // socials array
  "form": {},           // lead form fields
  "videoEditing": {},   // Full service page content
  "socialMedia": {},
  "metaAds": {},
  "websiteDev": {}
}
```

### Common Patterns

**Bracket Headline:**
```json
{
  "headline": "Video Editing Spliced for [High Retention].",
  "emphasis": "High Retention"
}
```

**Service Images:**
```json
{
  "images": {
    "hero": "/assets/service-images/video-editing/hero.png",
    "cta": "/assets/service-images/video-editing/cta.png"
  }
}
```

**Metrics Array:**
```json
{
  "metrics": [
    { "label": "Hook Retention", "value": "68%", "trend": "+24% vs baseline" }
  ]
}
```

---

## Routes

| URL | Component | Admin Section Key |
|-----|-----------|-------------------|
| `/` | MarketingSite | (default) |
| `/services` | ServicesPage | — |
| `/services/video-editing` | VideoEditing | `videoEditing` |
| `/services/social-media-management` | SocialMedia | `socialMedia` |
| `/services/meta-ads` | MetaAds | `metaAds` |
| `/services/website` | WebsiteDev | `websiteDev` |
| `/admin` | AdminApp | — |

---

## Admin Section Keys

```javascript
const SECTION_LABELS = {
  meta: 'SEO / Meta',
  assets: 'Brand Assets',
  nav: 'Navigation',
  hero: 'Hero + Stats',
  about: 'About',
  services: 'Services (Intro + Items)',
  work: 'Work',
  process: 'Process',
  proof: 'Proof',
  stories: 'Stories',
  contact: 'Contact',
  footer: 'Footer',
  form: 'Lead Form',
  sections: 'Section Images & Social Icons',
  videoEditing: 'Page: Video Editing',
  socialMedia: 'Page: Social Media',
  metaAds: 'Page: Meta Ads',
  websiteDev: 'Page: Website Development',
}
```

---

## Preview Route Mapping

```javascript
const SECTION_TO_ROUTE = {
  videoEditing: '/services/video-editing',
  socialMedia: '/services/social-media-management',
  metaAds: '/services/meta-ads',
  websiteDev: '/services/website',
}
```

---

## Bracket Text Component

```jsx
import BracketText from './components/BracketText.jsx'

// Parses [bracket] syntax and emphasizes those words
<BracketText 
  text="Video Editing Spliced for [High Retention]."
  emphasis="High Retention"  // Optional explicit emphasis
/>
```

---

## Service Art Band

```jsx
import { ServiceArtBand } from './components/ServiceArt.jsx'

<ServiceArtBand
  src={pageImages.hero}           // Image path from content.json
  variant="hero"                  // hero | split | process | compact
  className="video-service-art"
  label="Video editing visual system"      // Optional caption label
  title="Cuts, captions, pacing..."        // Optional caption title
  body="Additional description text"        // Optional caption body
/>
```

**Variants:**
- `hero` — Large hero art (16:6 aspect)
- `split` — Wide split layout (21:8 aspect)
- `process` — Medium process illustration (16:8 aspect)
- `compact` — Small inline art (16:5 aspect)

---

## Contact Section

```jsx
import { ContactSection } from './App.jsx'

<ContactSection 
  content={content}
  onOpenContact={() => setIsFormOpen(true)}
  artSrc={pageImages.cta}  // Optional: override art image
/>
```

---

## Content Editing Patterns

### Read Content in Component
```jsx
export default function VideoEditing() {
  const content = useSiteContent()
  const pageContent = content.videoEditing || {}
  const pageImages = pageContent.images || {}
  
  // Use with fallbacks
  const headline = pageContent.headline || 'Default Headline'
}
```

### Array Mapping with Index Check
```jsx
{(pageContent.formats || []).map((format, index) => (
  <div key={index} className={`card ${index === 2 ? 'highlight' : ''}`}>
    <span>{format.num}</span>
    <h3>{format.title}</h3>
    <p>{format.body}</p>
  </div>
))}
```

### Nested Content Access
```jsx
// Hero stats (nested under hero)
const stats = content.hero?.stats || []

// Services intro (nested under services)
const intro = content.services?.intro || {}

// Service items array
const items = content.services?.items || []
```

---

## Environment Variables

```bash
# .env.local
VITE_WEB3FORMS_ACCESS_KEY=...     # Contact form API key
ADMIN_USERNAME=adminkrish         # Admin login
ADMIN_PASSWORD=Krish1108k         # Admin password
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | JWT auth `{username, password}` |
| GET | `/api/content` | Get full content.json |
| POST | `/api/content` | Save content `{token, content}` |
| POST | `/api/upload` | File upload `{file}` |

---

## Content Utilities

```javascript
import { normalizeContent, updateObject } from '../lib/contentUtils.js'

// Merge defaults with saved content
const content = normalizeContent(savedContent)

// Immutable object update
const updated = updateObject(obj, key, newValue)
```

---

## Validation

```javascript
import { validateContent } from '../lib/validateContent.js'

const { ok, error } = validateContent(content)
if (!ok) console.error('Invalid:', error)
```

---

## Testing

```javascript
// Run specific test
node --test tests/contentUtils.test.js

// Run all
npm test
```

---

## Style Quick Reference

### CSS Variables
```css
:root {
  --font-display: "DM Serif Display", serif;
  --font-body: "Inter", sans-serif;
  --color-coral: #f36f21;      /* Video Editing */
  --color-green: #5da77a;      /* Website Dev */
  --color-blue: #2d7df6;       /* Social Media */
  --color-yellow: #e8ad21;     /* Meta Ads */
  --color-dark: #1b1712;
  --color-cream: #fffaf1;
  --color-beige: #e9e2d6;
}
```

### Responsive
```css
/* Desktop */
@media (min-width: 1440px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Mobile */
@media (max-width: 768px) { }
```

---

## Common Tasks

### Add New Section to Admin
1. `src/siteData.js` — Add to `defaultContent`
2. `src/admin/AdminApp.jsx` — Add to `SECTION_LABELS`
3. `src/admin/SectionEditor.jsx` — Add to bracket headline check if needed

### Add New Service Page
1. Create `src/pages/NewService.jsx`
2. `src/App.jsx` — Add route
3. `src/siteData.js` — Add default content
4. `src/admin/AdminApp.jsx` — Add `SECTION_LABELS` + `SECTION_TO_ROUTE`

### Update Bracket Headline Objects
In `AdminApp.jsx`:
```javascript
const BRACKET_HEADLINE_OBJECTS = new Set([
  'hero', 'about', /* ... */ 'newSection'
])
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Content not showing | Check `normalizeContent`, verify JSON syntax |
| Preview not updating | Check `sessionStorage`, verify `previewKey` change |
| Route not navigating | Verify `SECTION_TO_ROUTE` mapping |
| Bracket text not parsing | Check `emphasis` field matches bracket text |
| Upload failing | Check `public/assets/uploads/` exists and is writable |

---

## Last Updated

2026-05-28 — After admin panel route-aware preview implementation
