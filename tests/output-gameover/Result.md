---
test: ../gameover_test.md
status: passed
started: 2026-05-30T21:38:14.429Z
duration_s: 165
session_id: 1dbe546e-bf78-4e2c-91b4-af08e2ded74c
---

# Feature: running out of lives ends the game — Result

## Open the gameover scenario ✓ passed (25.6s)
md5: 0ea6894a21681115733c9681e377d14d
Open http://localhost:5173/play.html?scenario=gameover.

## Verify the game is over ✓ passed (60.2s)
md5: d6515452a37fae6f40fdf0838c923239
Read the value of the "data-status" attribute on the element with data-testid "status" and store it as 'status'.
Assert the value stored as 'status' equals "gameover".

## Verify a final score is shown ✓ passed (75.2s)
md5: 13af032a4464604e7d00f5bccc1f23d6
Read the value of the "data-final-score" attribute on the element with data-testid "final-score" and store it as 'final_score'.
Assert the value stored as 'final_score' is greater than 0.
