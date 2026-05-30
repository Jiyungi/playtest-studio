// Playtest Studio backend.
//
// One endpoint: POST /api/playtest
//   1. loads the active game's rules from games.json
//   2. runs each rule's Kane test against the running game
//   3. aggregates pass/fail
//   4. writes .kiro/kane-report.json (the artifact the Kiro hook watches)
//   5. returns results to the Studio UI
//
// This is the "Kane verifies → result feeds back into Kiro" hinge.
import { createServer } from "node:http";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { runKaneTest, summarize } from "./kane.mjs";
import { loadGame, ROOT } from "./manifest.mjs";

const PORT = 8787;
const REPORT_PATH = join(ROOT, ".kiro", "kane-report.json");

function json(res, code, body) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(body));
}

async function writeReport(report) {
  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2));
}

async function runPlaytest(gameId) {
  const game = await loadGame(gameId);
  const results = [];

  for (const rule of game.rules) {
    const raw = await runKaneTest(join(ROOT, rule.test), { timeout: 75 });
    const { status, detail } = summarize(raw);
    results.push({ id: rule.id, statement: rule.statement, status, detail, test: rule.test });
  }

  const passed = results.filter((r) => r.status === "passed").length;
  const total = results.length;
  const failures = results.filter((r) => r.status !== "passed");

  const report = {
    game: game.id,
    generatedAt: new Date().toISOString(),
    passed,
    total,
    allGreen: passed === total,
    results,
    followUp:
      failures.length > 0
        ? {
            action: "fix",
            message:
              `Kane playtest of "${game.name}" found ${failures.length} broken rule(s). ` +
              `Fix the game logic in ${game.engine} so these hold, then re-run the playtest:\n` +
              failures.map((f) => `- [${f.id}] ${f.statement} → ${f.detail}`).join("\n"),
            brokenRules: failures.map((f) => f.id),
          }
        : null,
  };

  await writeReport(report);

  return {
    ok: report.allGreen,
    game: game.id,
    passed,
    total,
    results,
    loopMessage: report.followUp
      ? "Kane found a problem and wrote .kiro/kane-report.json — the Kiro hook picks this up, fixes the game, then re-verifies."
      : "All rules green. Report written to .kiro/kane-report.json.",
  };
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});

  if (req.method === "POST" && req.url === "/api/playtest") {
    try {
      const body = await readBody(req);
      const result = await runPlaytest(body.game);
      return json(res, 200, result);
    } catch (err) {
      return json(res, 500, { ok: false, error: `Playtest failed: ${String(err)}` });
    }
  }

  if (req.method === "GET" && req.url === "/api/health") {
    return json(res, 200, { ok: true });
  }

  json(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Playtest Studio API listening on http://localhost:${PORT}`);
});
