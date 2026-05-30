# Structure — Playtest Studio

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
├── tests/
│   ├── *_test.md           # committable Kane tests, one per rule
│   └── output-*/           # replay caches (commit these)
│
└── .kiro/
    ├── specs/playtest-studio/   # requirements, design, tasks
    ├── steering/                # product, tech, structure
    ├── hooks/                   # kane-loop hook
    └── kane-report.json         # loop artifact (written by playtests)
```

## Where things go
- **New game** → add an entry to `games.json` + its `tests/*_test.md` files.
- **New rule for the active game** → add to that game's `rules[]` in
  `games.json` and create the matching `_test.md`.
- **New tunable parameter** → add to `GameTuning` (types.ts), `TUNING_FIELDS`
  (tuning.ts), and read it in `engine.ts`.
- **Loop behavior** → `.kiro/kane-report.json` (`followUp`) + the kane-loop hook.
