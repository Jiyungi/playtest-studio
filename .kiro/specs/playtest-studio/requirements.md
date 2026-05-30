# Requirements — Playtest Studio

## Introduction

Playtest Studio is a browser app for building games where **Kane CLI is the
automated playtester**. A builder composes a game, declares its rules in plain
English, and the studio runs Kane against the real game in a browser to prove
those rules hold — without recruiting human testers. When Kane finds a broken
rule, the result feeds back into Kiro, which fixes the game and re-verifies.
This closes the loop the hackathon rewards: **Kiro builds → Kane verifies →
result feeds back into Kiro.**

The driving game ("VS Traffic") ships as the flagship example, but rules are
data-driven per game (`games.json`), so the studio generalizes to other games.

## Requirements

### Requirement 1 — Build a game in the studio
**User story:** As a builder, I want to tune a game's parameters and see a live
preview, so I can shape the game without leaving the studio.

#### Acceptance Criteria
1. WHEN the studio loads THEN it SHALL display the active game's tunable
   parameters as controls.
2. WHEN a control value changes THEN the live preview SHALL reload with the new
   tuning encoded in the game URL.
3. WHEN the builder opens the game in a new tab THEN it SHALL run standalone
   with the same tuning.

### Requirement 2 — Declare rules in plain English
**User story:** As a builder, I want to declare game rules in plain English, so
the studio knows what "working" means for my game.

#### Acceptance Criteria
1. WHEN the studio loads THEN it SHALL list the active game's rules from
   `games.json`.
2. Each rule SHALL map to exactly one committable Kane test (`*_test.md`).
3. WHEN a new game is added to `games.json` THEN the studio SHALL surface its
   rules with no code change.

### Requirement 3 — Prove rules with Kane (no human testers)
**User story:** As a builder, I want Kane to actually play my game and prove the
rules, so I don't have to click through a browser myself or recruit testers.

#### Acceptance Criteria
1. WHEN the builder clicks "Run Playtest" THEN the studio SHALL run each rule's
   Kane test headless against the running game.
2. WHEN a Kane run finishes THEN the studio SHALL show per-rule pass/fail with a
   plain-language detail line.
3. The game SHALL expose its live state in the DOM via `data-testid` attributes
   so Kane verifies values rather than canvas pixels.
4. The game SHALL provide deterministic scenario URLs that drive a seeded
   simulation to a known end state, so Kane runs are reproducible.

### Requirement 4 — Close the loop back into Kiro
**User story:** As a builder, I want a failed playtest to trigger Kiro to fix
the game, so the loop closes automatically.

#### Acceptance Criteria
1. WHEN a playtest completes THEN the studio SHALL write `.kiro/kane-report.json`
   with per-rule results.
2. WHEN at least one rule fails THEN the report SHALL include a `followUp`
   instruction naming the broken rules and the engine file to fix.
3. WHEN `.kiro/kane-report.json` changes THEN a Kiro hook SHALL prompt the agent
   to read it and, if rules failed, fix the game logic and re-run the playtest.

### Requirement 5 — Runs and ships
**User story:** As a judge, I want the app to run with one command and demo
without breaking.

#### Acceptance Criteria
1. WHEN `npm run studio` is run THEN both the game/UI server and the Kane API
   SHALL start together.
2. The project SHALL typecheck and build with no errors.
3. Kane tests SHALL be committable and replay from cache on subsequent runs.
