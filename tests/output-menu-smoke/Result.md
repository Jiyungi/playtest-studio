---
test: ../menu-smoke_test.md
status: passed
started: 2026-05-30T21:46:46.205Z
duration_s: 187
session_id: be2ecf7b-e51f-44c9-a268-311277df8600
---

# Menu smoke — the app loads, shows a menu, and a started game is in play — Result

## Open the game and verify the menu ✓ passed (78.7s)
md5: 56b3fd40387404a57a9c35a14d24ebcc
Open http://localhost:5173/play.html.
Verify a heading containing "VS" and "Traffic" is visible.
Verify buttons labeled "Solo" and "2 Players" are present.

## Verify a started solo game is in the Playing state ✓ passed (105.4s)
md5: 7a6af8d21254151dfc84098bb21668c7
Open http://localhost:5173/play.html?scenario=started.
Read the value of the "data-status" attribute on the element with data-testid "status" and store it as 'game_status'.
Assert the value stored as 'game_status' equals "playing".
