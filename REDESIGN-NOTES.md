# UNFLECT Frontend Redesign — refinement pass

This version keeps the existing backend boundary and refines the frontend into a clearer multi-page experience inspired by the supplied references: editorial black canvas, oversized typography, centered pill navigation, quiet borders, compact controls, and deliberate motion.

## Backend boundary preserved

- `src/app/api/enquiries/route.ts` was not changed.
- `src/lib/enquiry.ts` and `src/lib/enquiry-delivery.ts` were not changed.
- The contact form still POSTs to `/api/enquiries` using the existing payload and validation.
- Existing service/work data models and detail routes remain available.

## Information architecture

- `/` — focused home: hero, services preview, process preview, CTA.
- `/services` — service overview; individual disciplines remain on `/services/[slug]`.
- `/process` — the complete five-stage delivery model.
- `/work` — case-study index, publishing notice, and delivery principles; detail lives on `/work/[slug]`.
- `/about` — company philosophy, operating principles, AI approach, engagement model, and handover expectations.
- `/contact` — dedicated enquiry experience; existing backend submission logic retained.

## Navigation

Desktop uses a centered pill nav with an animated active-state indicator and a dedicated conversion CTA. Mobile uses a 44px+ menu trigger and a full-width navigation panel.

## Components

- `src/components/ui/animated-hero.tsx` — reusable animated hero with Unflect-specific content passed as props.
- `src/components/ui/testimonials-columns-1.tsx` — retained as a motion column primitive, but the Work page now uses it for attributed-to-UNFLECT delivery principles rather than invented customer endorsements.
- `src/components/ui/page-header.tsx` — shared editorial interior-page header.
- `src/components/layout/page-transition.tsx` — subtle route continuity animation with reduced-motion support.
- `src/components/layout/site-header.tsx` — refined desktop/mobile navbar.

## Favicon

`src/app/icon.svg` now uses the same UNFLECT mark geometry and accent relationship as the site logo.

## Frontend stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn-style UI primitives under `src/components/ui`
- Framer Motion for route/hero interaction
- Motion for the scrolling columns
- Lucide React for icons

## Verification

A parser-only TypeScript pass completed with zero syntax errors across the 63 TypeScript/TSX source files. Full `npm install` could not be completed in the build environment because the registry request timed out / the required package was not cached offline, so browser/build verification still needs to be run locally.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Refinement pass — 2026-10-04

- Rebuilt the desktop navbar into a balanced three-zone floating navigation: wordmark / centered route pill / blue conversion action.
- Added a restrained availability indicator and improved mobile navigation states and touch targets.
- Changed the rotating hero word to the primary UNFLECT blue accent and added blur/slide transitions with reduced-motion support.
- Removed the violet/purple cast from structural rules and remapped the site's secondary accent to blue so the visual system is consistently black / white / blue.
- Unified the favicon SVG with the exact same UNFLECT mark geometry and colors used by the header/footer logo.
- Reworked the homepage rhythm: stronger hierarchy, asymmetrical service presentation, process rail, and higher-impact CTA.
- Refined interior page headers and footer to share the same blue accent language.
- Backend/API files were not modified in this pass.

## Premium motion pass — 2026-10-05

- **Fixed:** `--font-sans` pointed at an unloaded `--font-instrument`, so the whole site rendered in Georgia. Now Instrument Serif (display) + Inter (body) + JetBrains Mono (labels). Faux-bold removed from display type.
- **New `src/components/fx/`:** `smooth-scroll` (Lenis), `scroll-progress`, `custom-cursor` (supports `data-cursor="View"` labels), `split-text` (masked word rise), `scroll-words` (scroll-lit manifesto), `marquee`, `spotlight` (pointer-tracked card light), `parallax`, `hero-visual` (animated system diagram), `generative-art`.
- **Hero:** aurora background, split-text headline, magnetic CTAs, animated system diagram, capability ticker, scroll cue.
- **Home:** scroll-lit manifesto, spotlight work cards, hover-sweep services, scroll-linked process rail, aurora closing CTA.
- **Shell:** header hides on scroll-down; giant outlined footer wordmark; film grain; interior page headers use split-text and aurora.
- All motion respects `prefers-reduced-motion`. Backend/API files untouched. No invented claims, clients or metrics added.
- New dependency: `lenis` — run `npm install`.

## Calm pass — 2026-10-05 (follow-up)

- Display font is now Inter Tight (medium, upright). The italic serif and the italic accent words are gone; labels use Inter in sentence case instead of wide-tracked mono caps.
- Removed the blue dots beside labels (header section, hero chip, page headers, footer, enquiry confirmation, hero ticker glyph). Process timeline nodes are now neutral.
- Less glare and motion: aurora glows dimmed and slowed to near-static, film grain halved and no longer animated, shimmer removed, spotlight edge softened, hover fills toned down, scroll-progress bar thinned.
- Hero diagram replaced by an open laptop (`src/components/fx/laptop-visual.tsx`): UNFLECT mark and name on screen, small badge on the lid chin, gentle pointer tilt only.

## Final polish — 2026-10-05

- **Fixed:** the footer wordmark clipped to "UNFLEC". It is now SVG text with a fixed text length (`fx/giant-wordmark.tsx`), so the full word fits at any width; hover reveals a soft pointer-following fill inside the outline.
- Buttons and the header CTA roll their label on hover (`fx/roll-text.tsx`).
- Route changes fade in with a light blur.
- Contrast: very faint grey-on-black text on interior pages raised to readable levels.
- Work list and about principle cards got quieter hover states with a clear arrow affordance.
