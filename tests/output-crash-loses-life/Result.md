---
test: ../crash-loses-life_test.md
status: passed
started: 2026-05-30T21:35:09.890Z
duration_s: 88
session_id: a4e9218b-7d9e-40b6-9b31-35082c275a42
---

# Feature: hitting an obstacle costs a life — Result

## Open the crash scenario ✓ passed (20.5s)
md5: 00c29a5096c5fecb2a814484e1abc2b3
Open http://localhost:5173/play.html?scenario=crash.

## Verify a life was lost ✓ passed (64.2s)
md5: c95c521154efba193bbb730cb84908c8
Store the value of the data-lives attribute on the element with data-testid "lives" as 'lives_left'.
Assert the value stored as 'lives_left' is less than 3.
