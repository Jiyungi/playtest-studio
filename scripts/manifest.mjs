// Shared loader for games.json — the single source of truth for which game
// is active and what rules Kane should prove. Used by the studio server and
// the kane:verify CLI so rules are never duplicated in code.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(ROOT, "games.json");

export async function loadManifest() {
  const raw = await readFile(MANIFEST_PATH, "utf8");
  return JSON.parse(raw);
}

/** Return the active game (or a named one), throwing if missing. */
export async function loadGame(gameId) {
  const manifest = await loadManifest();
  const id = gameId || manifest.activeGame;
  const game = manifest.games[id];
  if (!game) throw new Error(`Game "${id}" not found in games.json`);
  return game;
}
