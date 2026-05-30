// CLI entry: run every declared rule's Kane test for the active game, print a
// summary, write .kiro/kane-report.json, and exit non-zero if any rule failed.
//
// Used by the Kiro verify hook and for CI. Assumes the game is being served at
// http://localhost:5173 (run `npm run dev`, or `npm run studio` for UI + API).
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { runKaneTest, summarize } from "./kane.mjs";
import { loadGame, ROOT } from "./manifest.mjs";

const REPORT_PATH = join(ROOT, ".kiro", "kane-report.json");
const ICON = { passed: "🟢", failed: "🔴", error: "⚠️" };

async function main() {
  const gameId = process.argv[2]; // optional: override active game
  const game = await loadGame(gameId);

  console.log(`\n▶ Kane playtest — proving "${game.name}" rules in a real browser\n`);
  const results = [];

  for (const rule of game.rules) {
    process.stdout.write(`  ${rule.id.padEnd(10)} … `);
    const raw = await runKaneTest(join(ROOT, rule.test), { timeout: 75 });
    const { status, detail } = summarize(raw);
    console.log(`${ICON[status]} ${status} — ${detail}`);
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
              `Fix the game logic in ${game.engine} so these hold, then re-run \`npm run kane:verify\`:\n` +
              failures.map((f) => `- [${f.id}] ${f.statement} → ${f.detail}`).join("\n"),
            brokenRules: failures.map((f) => f.id),
          }
        : null,
  };

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`\n  ${passed}/${total} rules proven. Report: .kiro/kane-report.json\n`);
  process.exit(report.allGreen ? 0 : 1);
}

main().catch((err) => {
  console.error("kane-verify crashed:", err);
  process.exit(2);
});
