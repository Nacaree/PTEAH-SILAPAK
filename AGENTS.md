# Repository Guidelines

## Project Structure & Module Organization

This repository contains a frontend-only React 19 personality quiz built with Vite. `src/main.jsx` mounts the application, while `app/page.jsx` owns the quiz screens, navigation, transitions, and result presentation. Keep English and Khmer interface copy in `app/data/content.js`, quiz questions and character profiles in `app/data/quizData.js`, and deterministic business logic in `app/lib/` (`scoring.js` and `sharing.js`). Global styles live in `app/globals.css`. Static artwork and bundled fonts belong under `public/assets/` and `public/PS Fonts/`; prefer the optimized WebP assets where available. Tests are colocated by concern in `tests/`.

## Build, Test, and Development Commands

Use Node.js 22.13 or newer and install from the committed lockfile:

```bash
npm ci                 # Install exact dependencies
npm run dev            # Start the Vite development server
npm run build          # Create the production bundle in dist/
npm run start          # Preview the production bundle locally
npm test               # Run the Vitest suite once
npm run test:watch     # Re-run tests during development
npm run lint           # Run ESLint, including React and accessibility rules
```

## Coding Style & Naming Conventions

Follow the existing ES module and JSX style: two-space indentation, double quotes, semicolons, and trailing commas in multiline structures. Use `PascalCase` for React components, `camelCase` for functions and variables, and descriptive lowercase filenames for data and utilities. Keep scoring and sharing logic pure when possible. Any user-facing copy change should preserve equivalent English and Khmer content. Run `npm run lint` before submitting changes.

## Testing Guidelines

Tests use Vitest, jsdom, React Testing Library, and `@testing-library/jest-dom`. Name files `*.test.js` or `*.test.jsx` under `tests/`. Add focused coverage for scoring, persistence, navigation, share URLs, transitions, and asset constraints when those areas change. Prefer accessible queries such as `getByRole` over implementation-specific selectors. Run both `npm test` and `npm run build` before opening a pull request; no numeric coverage threshold is currently enforced.

## Commit & Pull Request Guidelines

Recent commits favor concise Conventional Commit prefixes such as `feat:` and `fix:`. Use an imperative summary, for example `fix: preserve Khmer quiz progress`. Keep commits focused. Pull requests should explain the user-visible change, list verification commands, link relevant issues, and include screenshots or recordings for layout, animation, responsive, or bilingual UI changes. Call out new assets and any bundle-size impact.
