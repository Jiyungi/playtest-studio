---
mode: testing
headless: true
max_steps: 12
timeout: 75
---

# Menu smoke — the app loads, shows a menu, and a started game is in play

## Open the game and verify the menu
Open http://localhost:5173/play.html.
Verify a heading containing "VS" and "Traffic" is visible.
Verify buttons labeled "Solo" and "2 Players" are present.

## Verify a started solo game is in the Playing state
Open http://localhost:5173/play.html?scenario=started.
Read the value of the "data-status" attribute on the element with data-testid "status" and store it as 'game_status'.
Assert the value stored as 'game_status' equals "playing".
