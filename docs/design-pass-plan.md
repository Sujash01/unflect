# Unflect — Design Pass Plan (Phase 0 Audit)

**Reading this as:** premium software studio site for technical buyers, editorial + liquid-glass language.

**v2 direction:** "Less, but better." One focal object per screen, huge calm type, generous black space, soft blue light, very little else. Count animated things on any screen on one hand. Subtractive pass: no mono metadata labels, no constellation nodes/lines, no readouts, no arrows except the single primary CTA, no numbers on Services, no "N" indicator (disabled via `devIndicators: false`).

Dials: DESIGN_VARIANCE 8, MOTION_INTENSITY 7, VISUAL_DENSITY 3.

## Audit summary

- Next.js 16 App Router, Tailwind v4 (`@theme` in globals.css), TypeScript.
- `framer-motion` is the active motion library; `motion` package present but now unused after earlier cleanup — kept untouched, won't add a second system.
- Tokens live in `src/app/globals.css`: navy ramp (#060607…#131316), bone (#f4f2ec), muted, single accent indigo (#168CFF), hairlines.
- Navigation: Magnetic Dock (`src/components/ui/magnetic-dock.tsx`) bottom-center via `SiteDock`; slim top header (wordmark + section label + one CTA). Old "N" control: not present anywhere in source (verified by search — no component, CSS, or asset).
- Routes: `/`, `/services`, `/services/[slug]`, `/work`, `/work/[slug]`, `/process`, `/about`, `/contact`, `/api/enquiries`.
- Motion today: PageTransition (keyed fade/slide), Reveal (data-attribute IO), dock spring magnification, header scroll state. No pointer/scroll-driven ambient system. Reduced-motion handled globally in CSS + `useReducedMotion` in dock/hero.
- Hero: `components/ui/animated-hero.tsx` — left-weighted, headline, copy, CTAs, honest "UNFLECT / METHOD" stage list panel.
- Sections home: services rows, work rows, process list, about statement, final CTA (`home-sections.tsx`).
- Work page has a principles grid; no testimonials. Case studies are honest placeholders by design.
- No `useScroll` usage yet; one `pointermove`-style listener exists only in dock (local mouse tracking). No ambient cursor layer.

## Plan review (honest pass)

Initial instincts rejected: centered hero over a blue glow, 3-up feature cards, testimonial marquee, fake product dashboard. Current site already avoids most of that, so the pass focuses on identity + one signature (The Thread), glass as a rare material, single pointer/ambient system, and choreographed scroll.

Colors (from existing tokens): #060607 (canvas), #0C0C0E (surface), #F4F2EC (ink), #8B8A85 (muted), #168CFF (accent), rgba(244,242,236,.09) (hairline).

Type roles: Archivo for display/ headings, Inter body, JetBrains Mono for metadata (kept).

Layout concepts: hero = left-weighted editorial over abstract system map; services = two-col list + sticky glass diagram; process = sticky diagram + scroll-driven stages; work = asymmetric editorial rows with tonal placeholder frames; about = one large statement; contact = closing CTA composition.

Principles: one signature (Thread), restrained motion only where motivated, glass budget ≤4 visible surfaces, no fake data, motion values only outside React state.
