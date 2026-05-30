# Design — Playtest Studio

## Overview

Playtest Studio has three parts that map directly onto the hackathon loop:

```
┌─────────────┐   build    ┌──────────────┐  verify   ┌────────────┐
│   Studio    │ ─────────▶ │  Game (play) │ ◀──────── │  Kane CLI  │
│  (index)    │            │  + scenarios │           │ (headless) │
└─────────────┘            └──────────────┘           └────────────┘
       ▲                                                     │
       │ results / report                                    │ NDJSON
       └──────────── .kiro/kane-report.json ◀────────────────┘
                              │
                              ▼  (fileEdited hook)
                       Kiro fixes & re-verifies
```

## Components

### Game runtime (`play.html` + `src/`)
- `engine.ts` — deterministic simulation (seeded RNG, `tuning`-driven). No DOM.
- `renderer.ts` — canvas drawing, including a "ready" overlay.
- `main.ts` — RAF loop, input, **ready-gate** (world is frozen at "Playing"
  until first input), DOM state mirror, and deterministic **scenario** runner.
- `tuning.ts` / `types.ts` — tunable rules + URL encode/decode.

**Why deterministic:** scenario URLs (`?scenario=collect|crash|gameover|menu`)
fast-forward a seeded sim to a known end state and freeze it. This makes Kane's
assertions reproducible instead of racing a real-time game.

**DOM contract:** all live state mirrors to `data-testid` nodes (`score`,
`lives`, `rival-score`, `status`, panels, buttons) so Kane reads values, never
pixels.

### Studio UI (`index.html` + `studio.ts`)
- Loads the active game + rules from `games.json` at runtime.
- Renders tuning controls, a live preview iframe, the rule list, and the
  "Run Playtest" panel.
- Calls `POST /api/playtest` and renders per-rule results.

### Kane runner (`scripts/`)
- `kane.mjs` — spawns `kane-cli testmd run … --agent --headless --retry`,
  parses NDJSON, waits for the process to exit (acts on `run_end` only),
  summarizes to pass/fail + detail.
- `manifest.mjs` — loads `games.json` (single source of truth for rules).
- `studio-server.mjs` — HTTP API; runs all rules, writes `kane-report.json`.
- `kane-verify.mjs` — CLI version for the hook / CI.
- `studio.mjs` — one-command launcher (Vite + API).

### The loop artifact (`.kiro/kane-report.json`)
Written after every playtest. On failure it carries a `followUp` block naming
the broken rules and the engine file to fix. A Kiro `fileEdited` hook watches
this file and prompts the agent to act.

## Data model

`games.json`:
```json
{
  "activeGame": "driving",
  "games": {
    "driving": {
      "id", "name", "description", "playUrl", "engine",
      "rules": [ { "id", "statement", "scenario", "test" } ]
    }
  }
}
```

A rule is the unit of verification: a plain-English `statement`, the `scenario`
that exercises it, and the committable Kane `test` that proves it.

## Error handling
- Kane exit codes map to status: `0`→passed, `1`→failed, `3`→timeout(error),
  `2`→error (auth/Chrome/parse).
- The studio surfaces a friendly message if the API is unreachable.
- `--retry` recovers transient replay failures without a full re-author.

## Testing strategy
- Each rule has a committable `_test.md`; first run authors, later runs replay.
- The flagship driving game ships four rules: menu, collect, crash, gameover.
- Verification is the product, so the tests *are* the spec's acceptance checks.
