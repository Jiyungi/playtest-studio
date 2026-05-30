# Product — Playtest Studio

Playtest Studio is a browser **game-building app where Kane CLI is the
automated playtester**. The builder composes a game, declares its rules in
plain English, and the studio proves those rules hold by having Kane play the
real game in a browser — no human testers.

The point of the product is the **closed loop**:

> Kiro builds → Kane verifies → the result feeds back into Kiro.

When Kane finds a broken rule, the studio writes `.kiro/kane-report.json` with a
`followUp` instruction. A Kiro hook reads it and fixes the game, then re-runs
the playtest.

## Principles
- **Verification is the product.** A feature isn't done until a Kane rule proves
  it. Favor closing the loop over polish.
- **Game-agnostic by data.** Rules live in `games.json`, not in code. Adding a
  game means adding a manifest entry + its `_test.md` files.
- **Deterministic for the agent.** Games expose scenario URLs and a DOM state
  mirror so Kane verifies reproducibly, never by reading canvas pixels.

The driving game ("VS Traffic") is the flagship example, not the whole product.
