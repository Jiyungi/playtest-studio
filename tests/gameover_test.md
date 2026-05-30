---
mode: testing
headless: true
max_steps: 14
timeout: 90
---

# Feature: running out of lives ends the game

## Open the gameover scenario
Open http://localhost:5173/play.html?scenario=gameover.

## Verify the game is over
Read the value of the "data-status" attribute on the element with data-testid "status" and store it as 'status'.
Assert the value stored as 'status' equals "gameover".

## Verify a final score is shown
Read the value of the "data-final-score" attribute on the element with data-testid "final-score" and store it as 'final_score'.
Assert the value stored as 'final_score' is greater than 0.
