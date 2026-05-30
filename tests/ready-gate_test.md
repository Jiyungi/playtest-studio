---
mode: testing
headless: true
max_steps: 12
timeout: 75
---

# Feature: a started game waits for the first move (ready-gate)

## Open a freshly started, not-yet-moved game
Open http://localhost:5173/play.html?scenario=started.

## Verify it is in the Playing state but frozen at score 0
Read the value of the "data-status" attribute on the element with data-testid "status" and store it as 'game_status'.
Assert the value stored as 'game_status' equals "playing".
Read the value of the "data-score" attribute on the element with data-testid "score" and store it as 'start_score'.
Assert the value stored as 'start_score' equals "0".
