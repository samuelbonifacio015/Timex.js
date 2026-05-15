# Timex.js — Agent instructions

## Stack
React 18 + Vite 5 + TypeScript + Tailwind CSS 3. Single-page app (no routing).

## Commands
| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | `tsc && vite build` (typecheck first, then bundle) |
| `npm run lint` | `eslint . --ext ts,tsx --max-warnings 0` |
| `npm run preview` | Serve production build locally |

**No test setup exists** — no test runner, no test scripts, no test dependencies. Do not add tests without asking.

## Project structure
- `src/App.tsx` — real root component (wrapper with Config + Achievements + tab management).
- `src/components/App.tsx` — stale/older version of App; do not edit or import.
- `src/main.tsx` — entrypoint, mounts `<ConfigProvider>` > `<AchievementsProvider>` > `<App>`.
- `src/contexts/ConfigContext.tsx` — all app config + stopwatch history, persisted to `localStorage`.
- `src/contexts/AchievementsContext.tsx` — achievement system, persisted to `localStorage`.
- `src/utils/sessionExport.ts` — ZIP export via JSZip.

## Architecture notes
- **UI is entirely in Spanish** — tab IDs use `reloj`, `pomodoro`, `cronometro`. All labels, comments, and user-facing strings are Spanish.
- **No ESLint config file exists** — the `lint` script references eslint v8 plugins via `package.json` devDependencies but no `.eslintrc.*` or `eslintConfig` field is present. Running `npm run lint` will likely fail or use defaults. An ESLint config must be created before `lint` can work.
- **State persistence** — config and achievements save to `localStorage` on every change (keys: `timex-config`, `timex-achievements`, `timex-stopwatch-history`, `timex-visited`).
- **Google Fonts** — Roboto Mono + Inter loaded via `<link>` in `index.html`. Tailwind font families configured as `roboto-mono` and `inter`.
- **Custom Tailwind breakpoint** — `xs: 475px` added.
- **Dependencies** — `html2canvas` (screenshot export on clock tab), `jszip` (ZIP export of stopwatch sessions). Do not remove without checking all call sites.

## Duplicate file warning
`src/components/App.tsx` is **dead code** — the real entrypoint is `src/App.tsx`. Do not edit `src/components/App.tsx`.
