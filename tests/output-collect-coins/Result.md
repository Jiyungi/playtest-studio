---
test: ../collect-coins_test.md
status: passed
started: 2026-05-30T20:26:02.986Z
duration_s: 107
session_id: b4e62d4d-3943-4991-a35a-9070934d1936
---

# Feature: collecting coins / surviving increases score — Result

## Open the collect scenario ✓ passed (26.1s)
md5: 89ea54c96a7aed412e34c8364ce40e04
Open http://localhost:5173/play.html?scenario=collect.

## Verify score increased ✓ passed (77.2s)
md5: d3143903c6c272a1513c3a9a6289223c
Read the value of the "data-score" attribute on the element with data-testid "score" and store it as 'player_score'.
Assert the value stored as 'player_score' is greater than 0.
