# Tasks — Playtest Studio

- [x] 1. Deterministic game engine
  - Seeded RNG, tuning-driven simulation, no DOM coupling.
  - _Requirements: 3.4_

- [x] 2. Game runtime with DOM state mirror
  - Canvas renderer, input, RAF loop, `data-testid` state mirror.
  - _Requirements: 3.3_

- [x] 3. Deterministic scenario URLs
  - `?scenario=collect|crash|gameover|menu` fast-forward + freeze.
  - _Requirements: 3.4_

- [x] 4. Ready-gate fix (caught by Kane)
  - World stays frozen at "Playing" until first input.
  - _Requirements: 3.2, 4.3_

- [x] 5. Studio UI
  - Tuning controls, live preview, rule list, run-playtest panel.
  - _Requirements: 1.1, 1.2, 1.3, 2.1_

- [x] 6. Data-driven rules (`games.json`)
  - Manifest is the single source of truth for UI + backend.
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 7. Kane runner + NDJSON parsing
  - Spawn Kane headless, parse `run_end`, summarize pass/fail.
  - _Requirements: 3.1, 3.2_

- [x] 8. Studio API + report artifact
  - `POST /api/playtest` runs rules, writes `.kiro/kane-report.json`.
  - _Requirements: 4.1, 4.2_

- [x] 9. Committable Kane tests for the driving game
  - menu, collect, crash, gameover `_test.md` files (replay-cached).
  - _Requirements: 3.1, 5.3_

- [x] 10. Kiro hook closes the loop
  - `fileEdited` hook on `.kiro/kane-report.json` prompts the agent to fix.
  - _Requirements: 4.3_

- [x] 11. One-command run
  - `npm run studio` starts UI + API together.
  - _Requirements: 5.1_

- [x] 12. End-to-end live verification
  - Run the full playtest live, confirm report + loop behavior.
  - _Requirements: 5.2, 5.3_
