# Playtest Studio

A browser game-building studio where **Kane CLI is the automated playtester**. Build a game, declare its rules in plain English, and the studio proves those rules hold by having Kane play the real game in a browser — no human testers.

Built in [Kiro](https://kiro.dev).

## The closed loop

> Kiro builds → Kane verifies → the result feeds back into Kiro.

When Kane finds a broken rule, the studio writes `.kiro/kane-report.json` with a `followUp` instruction. A Kiro hook reads it, fixes the game, and re-runs the playtest.

## Principles

- **Verification is the product.** A feature isn't done until a Kane rule proves it.
- **Game-agnostic by data.** Rules live in `games.json`, not in code. Adding a game means adding a manifest entry plus its `_test.md` files.
- **Deterministic for the agent.** Games expose scenario URLs and a DOM state mirror so Kane verifies reproducibly, never by reading canvas pixels.

The flagship example game is **VS Traffic**, a top-down driving game: dodge obstacles, collect coins, beat a rival. Three lives; losing all of them ends the game.

## Stack

- **Frontend:** TypeScript + Vite, HTML5 Canvas. No game framework.
- **Backend:** Node's built-in `http` (no Express). ES modules (`.mjs`).
- **Verification:** Kane CLI (`@testmuai/kane-cli`) via `kane-cli testmd run`.

## Getting started

```bash
npm install
npm run dev        # Vite dev server (game + studio UI) on :5173
```

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server (game + studio UI) on `:5173`. |
| `npm run studio` | Dev server **and** the Kane API (`:8787`) together. |
| `npm run studio:api` | Kane API only. |
| `npm run kane:verify [gameId]` | Run all rules headless, write the report, exit non-zero on failure. |
| `npm run typecheck` | Type-check with `tsc --noEmit`. |
| `npm run build` | `tsc && vite build`. |

## Project structure

```
.
├── index.html              # Studio UI (build + declare + prove)
├── play.html               # The runnable game
├── games.json              # SINGLE SOURCE OF TRUTH: active game + rules
│
├── src/
│   ├── studio.ts / .css    # Studio UI logic + styling
│   ├── rules.ts            # loads games.json (frontend)
│   ├── main.ts             # game runtime: loop, input, ready-gate, scenarios
│   ├── engine.ts           # deterministic simulation (seeded, tuning-driven)
│   ├── renderer.ts         # canvas drawing
│   ├── tuning.ts           # tunable params + URL encode/decode
│   ├── types.ts            # shared types + DEFAULT_TUNING
│   ├── rng.ts              # mulberry32 seeded PRNG
│   └── style.css           # game styling
│
├── scripts/
│   ├── manifest.mjs        # loads games.json (backend)
│   ├── kane.mjs            # spawn Kane, parse NDJSON, summarize
│   ├── studio-server.mjs   # POST /api/playtest → runs Kane → writes report
│   ├── kane-verify.mjs     # CLI: verify all rules, write report (hook/CI)
│   └── studio.mjs          # one-command launcher (Vite + API)
│
└── tests/
    ├── *_test.md           # committable Kane tests, one per rule
    └── output-*/           # replay caches
```

## License

MIT
