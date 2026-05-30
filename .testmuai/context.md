# VS Traffic — agent context for Kane CLI

VS Traffic is a top-down driving game. The player dodges obstacles and collects
coins for score. Three lives; losing all of them ends the game.

## How to verify this app without playing it in real time

The app exposes **deterministic scenario URLs**. Loading a scenario URL fast-forwards
a seeded simulation to a known end state and freezes it, then mirrors the result into
the DOM. Always prefer scenario URLs over trying to play the game live.

Base URL while developing: http://localhost:5173/

| URL | What it guarantees on load |
|---|---|
| `/?scenario=collect`  | Player score has increased (coins/distance banked). |
| `/?scenario=crash`    | Player has lost at least one life (lives < 3). |
| `/?scenario=gameover` | Game has ended; Status reads "Game Over"; final score shown. |

## DOM contract (read these, do not inspect canvas pixels)

All live state is mirrored to elements carrying `data-testid`:

- `data-testid="score"` — current player score (also `data-score`).
- `data-testid="lives"` — hearts string (also `data-lives` = integer count).
- `data-testid="rival-score"` — rival score (also `data-rival-score`).
- `data-testid="status"` — one of Menu / Playing / Paused / Game Over (also `data-status`).
- `data-testid="menu-panel"` — mode-select panel; buttons `mode-solo`, `mode-2p`.
- `data-testid="gameover-panel"` — shown after game over; contains `final-score` and `result-line`.
- `data-testid="restart"` — returns to the menu.

## Notes for the agent

- The menu appears on a normal load (no scenario param). Click a `mode-*` button to start.
- Scenario URLs do NOT require interaction — just load the URL and assert on the DOM.
- Numbers live in both the visible text and a `data-*` attribute; either is fine to read.
