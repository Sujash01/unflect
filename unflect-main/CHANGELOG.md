# Changelog

All notable changes to the UNFLECT marketing site codebase are documented here.

## [Unreleased] - 2026-10-09

### Copy-Reduction Pass (Marketing Site)
- **Content Consolidation (`src/content/services.ts`)**:
  - Reduced section intros to single concise sentences (~13 words).
  - Streamlined service capabilities, problems, outcomes, and scenarios to 3–4 items with single-line descriptions.
  - Shortened comparative guidance across Web, Systems, and Integrations services.
- **Process Sequence Streamlining (`src/content/process.ts`, `src/app/process/process-view.tsx`)**:
  - Reduced process stage intros to 1 sentence.
  - Condensed `whatHappens`, `whatClientDoes`, and `whatYouReceive` to 3–4 punchy items each.
  - Shortened client expectations, scope change steps, and operating principles to single-line cards.
- **Company & About Streamlining (`src/content/company.ts`, `src/app/about/page.tsx`)**:
  - Condensed `aboutIntro.body` from 3 long paragraphs to 1 punchy 2-sentence paragraph.
  - Reduced co-founder bios to single lines (~11 words).
  - Reduced studio location statement to 1 sentence.
  - Shortened all 8 operating principles to single-line commitments (~12 words), preserving all titles verbatim.
  - Streamlined engagement models, handover deliverables, and client-owned infrastructure cards.
- **Contact Copy Reduction (`src/content/company-extra.ts`, `src/app/contact/page.tsx`)**:
  - Shortened contact intro body to 2 short sentences.
  - Condensed "what happens next" expectations and "make the enquiry useful" guidance to 1 short line per item.
- **Site Config & Footer (`src/config/site.ts`, `src/components/layout/site-footer.tsx`, `src/components/home/home-sections.tsx`)**:
  - Reduced typical engagement descriptions and FAQ answers to 1 concise sentence each.
  - Shortened studio facts strip items to 1 short line each.
  - Shortened work integrity commitment and principles intro on `/work`.
- **Quality & Verification**:
  - Lint: Passed with 0 errors (`npm run lint`).
  - Typecheck: Passed with 0 errors (`npm run typecheck`).
  - Build: Passed with 50/50 static/prerendered pages (`npm run build`).
  - Production Audit: 100% passed (`node scripts/audit-production.mjs`).
