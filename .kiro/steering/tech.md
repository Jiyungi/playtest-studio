# Tech — Playtest Studio

## Stack
- **Frontend:** TypeScript + Vite, HTML5 Canvas. No game framework.
- **Backend:** Node's built-in `http` (no Express). ES modules (`.mjs`).
- **Verification:** Kane CLI (`@testmuai/kane-cli`) via `kane-cli testmd run`.

## Commands
- `npm run dev` — Vite dev server (game + studio UI) on :5173.
- `npm run studio` — dev server **and** the Kane API (:8787) together.
- `npm run studio:api` — Kane API only.
- `npm run kane:verify [gameId]` — run all rules headless, write the report,
  exit non-zero on failure (used by the hook / CI).
- `npm run typecheck` / `npm run build` — must stay green.

## Conventions
- **Always run Kane with `--agent --headless`** and parse the terminal
  `run_end` event; never act on partial progress events.
- **Never read canvas pixels for assertions.** Read `data-testid` DOM nodes.
- **Keep simulations deterministic** (seeded RNG). New verifiable behavior gets
  a scenario URL that drives to a known, frozen end state.
- **Rules are data**, defined in `games.json`. Don't hardcode rule lists in TS
  or in the server — load the manifest.
- Kane tests live in `tests/*_test.md`; commit the `output-*/` replay caches so
  later runs replay instead of re-authoring.

## Don't
- Don't add a heavy backend framework or a DB; this is a single-machine studio.
- Don't bypass Kane with Playwright/Puppeteer directly — Kane manages Chrome,
  auth, and the agent.
