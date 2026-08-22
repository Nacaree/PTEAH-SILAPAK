# Pteah Silapak Character Quiz

A frontend-only bilingual (English/Khmer) React personality quiz with 15 questions,
five themed sections, and five possible character matches.

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

The deployable site is generated in `dist/`, including `dist/index.html`.

## Vercel

Import the repository and use these settings:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: the directory containing this `package.json`

`vercel.json` provides the SPA fallback needed for direct and shared-result URLs.
The site does not require environment variables, a backend, or a database.

## Project structure

- `src/main.jsx` starts the React application.
- `app/page.jsx` contains the quiz interface and navigation.
- `app/data/quizData.js` contains questions, answer mappings, and character profiles.
- `app/lib/scoring.js` contains deterministic scoring and tie-breaking.
- `tests/` contains the requested test code. Tests are not part of the Vercel build.
