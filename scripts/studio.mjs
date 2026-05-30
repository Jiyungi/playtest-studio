// One-command launcher: starts the Vite dev server (the game + studio UI)
// and the studio API (which runs Kane) together. `npm run studio`.
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function start(name, cmd, args) {
  const p = spawn(cmd, args, { cwd: ROOT, env: process.env });
  p.stdout.on("data", (d) => process.stdout.write(`[${name}] ${d}`));
  p.stderr.on("data", (d) => process.stderr.write(`[${name}] ${d}`));
  p.on("exit", (code) => {
    console.log(`[${name}] exited with ${code}`);
    process.exit(code ?? 0);
  });
  return p;
}

console.log("Starting Playtest Studio…");
console.log("  · UI + game:  http://localhost:5173/");
console.log("  · Kane API:   http://localhost:8787/\n");

const api = start("api", "node", ["scripts/studio-server.mjs"]);
const vite = start("web", "npx", ["vite", "--port", "5173", "--strictPort"]);

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    api.kill();
    vite.kill();
    process.exit(0);
  });
}
