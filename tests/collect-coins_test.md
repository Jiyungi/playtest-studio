---
mode: testing
headless: true
max_steps: 12
timeout: 75
---

# Feature: collecting coins / surviving increases score

## Open the collect scenario
Open http://localhost:5173/play.html?scenario=collect.

## Verify score increased
Read the value of the "data-score" attribute on the element with data-testid "score" and store it as 'player_score'.
Assert the value stored as 'player_score' is greater than 0.
