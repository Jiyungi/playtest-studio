---
mode: testing
headless: true
max_steps: 16
timeout: 90
---

# Feature: hitting an obstacle costs a life

## Open the crash scenario
Open http://localhost:5173/play.html?scenario=crash.

## Verify a life was lost
Store the value of the data-lives attribute on the element with data-testid "lives" as 'lives_left'.
Assert the value stored as 'lives_left' is less than 3.
