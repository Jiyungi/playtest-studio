# Kane CLI Hack Day — Hackathon Guide & Scoring Standard

> **Build it with AWS Kiro. Verify it with Kane CLI. Ship by dinner.**

| | |
|---|---|
| **Event** | Kane CLI Hack Day — San Francisco |
| **Date** | Saturday, May 30th, 2026 |
| **Time** | 09:30 am – 08:00 pm PDT |
| **Location** | San Francisco |
| **Prize Pool** | $5,000 USD |
| **Hosts** | TestMu AI (formerly LambdaTest) + AWS |

---

## About the Tools

### Kane CLI
Plain-English browser automation from your terminal. One command, no selectors, no framework. Opens a real browser, runs the flow you describe, and returns pass/fail with a video trace. It's a dev utility — and a tool any AI agent can call.

> An AI CLI that runs browser tasks from your terminal in plain English. Describe what should happen. Kane CLI executes it, verifies it, returns a result.

### AWS Kiro
The agentic IDE built around spec-driven development. You describe what the app should do; Kiro generates tasks and code with full traceability back to the spec.

### Why this matters
AI coding agents changed how software gets written — features ship from prompts and bugs get fixed in seconds. But when the agent ships something, someone still has to open a browser and click through to see if it actually works. That part of the loop never closed.

**Specs describe intended behavior. Kane proves whether the behavior matches.**

---

## The Challenge

That's the whole brief. Your web app can be anything — a tool, a dashboard, a side project, a game, a weird experiment.

1. **AWS Kiro is the IDE** — Spec mode or vibe mode, your call. Use specs, hooks, steering. The build happens inside Kiro.
2. **Kane CLI verifies it** — At minimum at demo time. Strongest builds wire Kane in: a hook on save, an agent reading NDJSON, a spec that compiles to flows.
3. **It runs. It ships.** — Deployed or runnable with one command, and you can demo it live at the end of the day.

---

## Need an Idea?

You don't have to pick a lane — anything that hits the brief works. But if you're staring at a blank screen at 10:05, start here.

### 01 — Apps that verify themselves
*Kiro ships the feature, Kane proves it works without you opening a browser.*
- A todo app where every feature ships with auto-generated Kane flows
- A self-healing checkout — Kane catches a regression, the agent fixes it, Kane re-verifies
- A prompt-to-feature playground: type "add dark mode," watch the loop close live
- A GitHub bot that drops into any AI-generated repo and adds Kane verification

### 02 — Verification in your workflow
*The tool you wish existed. Set it up once, it works while you do something else.*
- A file watcher that re-verifies behavior on every save
- A GitHub CLI extension that runs Kane on a PR preview and posts results in comments
- A Cursor / Claude Code MCP server giving the agent a `verify_with_kane` tool
- A doc-vs-product drift detector that runs your README and files an issue when it breaks

### 03 — Browser agents in the wild
*Kane as an agent's hands on the web — the actual work, not testing.*
- A job-application autopilot that submits forms, pausing on essay questions
- A subscription killer that navigates each company's cancellation flow
- Live "prompt my app" — the room tweets a feature, the agent ships it, Kane verifies on screen
- A browser-game bot playing with no API access — pure vision and clicks

> **The strongest builds close the loop: Kiro builds → Kane verifies → the result feeds back into Kiro.**

---

## What Scores Highest

**Polish loses to a tighter loop.**

| | |
|---|---|
| **LOSES** | A polished todo app with one Kane flow tacked on at the end. *Valid submission. Just not the one we're hoping for.* |
| **WINS** | A scrappier thing where a Kiro hook fires Kane, Kane finds a problem, and Kiro re-prompts itself based on what Kane found. *This is the one we're really hoping to see.* |

---

## What "Ready to Ship" Means

Clear these three bars, or judges can't score the rest.

1. **The app works end-to-end** — A user can load it, complete the primary flow, and get a result. The real thing: deployed or runnable locally with one command. Not a screenshot, not a mock.
2. **Kane caught or proved something** — Show "Kane caught this bug — here's the failed run," or "Kane verifies these flows — here's the green run." Either counts. Kane installed-but-never-run does not.
3. **Kiro and Kane talked** — Kiro's output triggered a Kane run, or a Kane result triggered Kiro to act. The tighter the loop, the higher the score. Show us that moment.

---

## Scoring Rubric

| Parameter | Weight | What it measures |
|---|---|---|
| **Kane CLI usage** | 30 | Depth of integration |
| **Built with AWS Kiro** | 25 | Genuine use of Kiro's workflow |
| **Works live & ships** | 20 | Runs and demos without breaking |
| **Idea & usefulness** | 15 | Originality and real-world value |
| **Craft & polish** | 10 | UX, design, completeness |

---

## Run of Show

> Note: The deck contains two slightly different schedules. Both are included below.

### Schedule A (Run of Show slide)
| Time | Agenda |
|---|---|
| 9:30 | Welcome to Kane CLI Hack Day. Get your access to Kiro and Kane CLI |
| 10:15–10:30 | Hacking starts. TestMu AI engineers on the floor for help. |
| 12:30 | Lunch (30 minutes). |
| 3:00 | Mid-day check-in. Every team gives a 30-second status update. |
| 5:00 | Hard stop. Submissions lock. |
| 5:15 | Demos. 3 minutes + 2 minutes Q&A per team. |
| 6:45 | Judges deliberate. Drinks & networking food open. |
| 7:15 | Winners announced. |

### Schedule B (detailed agenda slide)
| Time | Agenda |
|---|---|
| 9:30 AM | Welcome to Kane CLI Hackathon |
| 9:45 AM | About AWS Kiro IDE and Kane CLI |
| 10:00 AM | Register your team and your idea |
| 10:15 AM | Hackathon begins |
| 12:30 PM | Lunch (30 minutes, served in) |
| 3:00 PM | Mid-day check-in. Every team gives a 30-second status update. |
| 5:00 PM | Hackathon ends. Submit your app. |
| 5:15 PM | Demos. 3 minutes plus 2 minutes of Q&A per team (~50 min for 10 teams). |
| 6:15–6:45 PM | Judges deliberate. Drinks and networking food open. |
| 7:15 PM | Winners announcement and closing note. |

---

## Prizes

**$5,000 in cash. Plus the perks stack.**

| Place | Cash |
|---|---|
| 1st | $2,500 |
| 2nd | $1,500 |
| 3rd | $1,000 |

**Every winning team also gets:**
- A 1:1 with the TestMu AI founders
- 3 months of Kane CLI Pro
- TestMu AI team support to take your idea further:
  - A featured interview post on the TestMu blog and social media
  - A showcase feature on testmuai.com/kane-cli/showcase
  - Amplification across TestMu and dev.to channels

---

## Demo Round — What to Add to Your Slide

- **Question 1: What are you building?** — web app name (short answer, required).
  - A working title is fine — it can change as the day goes on.
- **Question 2: Tell us more about your web app.**
  - Give the gist in a few lines: what it does, who the users are, what problem or gap it solves. Keep it loose — it can evolve as you build.
- **Question 3: What is the tech stack that you are using?**

You'll find the demo template in your handbook document.

---

## Share Your Insights

Had fun? Share your insights/learnings on LinkedIn & X and get Kane CLI credit.
- **X:** https://x.com/testmuai
- **LinkedIn:** https://www.linkedin.com/company/testmu-ai/

---

*Happy Building! — TestMu AI*
