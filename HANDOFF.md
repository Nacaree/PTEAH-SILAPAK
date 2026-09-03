# Pteah Silapak Character Quiz — Handoff

## Project

React/Vite personality quiz for Pteah Silapak. The main UI is in `app/page.jsx`, with quiz data in `app/data/quizData.js` and translations in `app/data/content.js`.

## Run locally

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
```

The latest production build was verified with `npm run build`. The test suite exists under `tests/`, but has not been run in this handoff.

## Preview result pages (development only)

Preview parameters are gated behind `import.meta.env.DEV`, so they work with `npm run dev` and are ignored in production builds.

```text
http://localhost:5173/?preview=anita
http://localhost:5173/?preview=kimly
http://localhost:5173/?preview=tohla
http://localhost:5173/?preview=vitou
http://localhost:5173/?preview=mc
```

Force a specific runner-up with `runnerup`:

```text
http://localhost:5173/?preview=anita&runnerup=kimly
http://localhost:5173/?preview=anita&runnerup=tohla
http://localhost:5173/?preview=anita&runnerup=vitou
http://localhost:5173/?preview=anita&runnerup=mc
```

Regular shared result links use `?result=<character-id>` and are unaffected by the preview guard.

## Current UI behavior

- Result pages use character-specific palettes and contrast-aware breakdown tracks.
- Kimly’s progress bar uses red-orange `#ff582e`.
- Vitou’s progress bar uses golden `#d99f16`.
- Runner-up inner panel colors are configured in `runnerUpInnerBackgrounds` in `app/page.jsx`.
- Results include Instagram and Facebook links beneath both normal and shared results. TikTok is intentionally omitted.
- Social links use `react-icons` Simple Icons (`SiInstagram` and `SiFacebook`). The dependency is listed in `package.json`.
- Screen-to-screen navigation uses horizontal transitions, with reduced-motion support in `app/globals.css`.
- Selected quiz answers use color changes only; no checkmark is shown.

## Assets and fonts

- Fonts are in `public/PS Fonts/`.
- English headings use Poppins; English body text uses Arial.
- Khmer headings use Kantumruy; Khmer body text uses MiSans Khmer.
- The landing page preloads the primary logo/key immediately, then preloads optimized cover assets and every PNG in `public/assets` during browser idle time.
- Result portraits are defined in `app/data/quizData.js` and are included in the PNG preload list.

## Important files

- `app/page.jsx` — screens, result palettes, preview URLs, image preloading, social links, transitions.
- `app/globals.css` — fonts, layout, patterns, transitions, responsive styling.
- `app/data/quizData.js` — questions, character data, portrait paths.
- `app/data/content.js` — English/Khmer UI copy.
- `app/lib/scoring.js` — ranking, preview answers, and forced runner-up preview ordering.
- `tests/scoring.test.js` — scoring and preview behavior tests.

## Social URLs

- Instagram: https://www.instagram.com/pteahsilapak?igsi=MTdsYWQydGY3Z3hxbQ==
- Facebook: https://www.facebook.com/share/19bXDDxrB1/?mibextid=wwXIfr

## Before deployment

1. Run `npm install` on the new computer.
2. Run `npm run build`.
3. Confirm regular `?result=` links still work in production.
4. Keep preview URLs for local design QA only; production ignores `preview` and `runnerup` parameters.

Git commits and pushes are intentionally left to the project owner.
