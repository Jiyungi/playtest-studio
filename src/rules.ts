/**
 * Game + rule catalog, loaded at runtime from /games.json.
 *
 * This is the single source of truth shared by the Studio UI and the backend
 * Kane runner. A builder adds a new game (and its rules) by adding an entry to
 * games.json — no code change required. The driving game ships as the flagship
 * example, but the schema is game-agnostic: each rule is a plain-English
 * statement plus the Kane test that proves it.
 */
import type { GameTuning, TuningField } from "./types.ts";

export interface GameRule {
  id: string;
  /** plain-English statement shown to the builder */
  statement: string;
  /** scenario name the game must be loaded with to exercise this rule */
  scenario: string;
  /** committable Kane test that proves it */
  test: string;
}

export interface GameDef {
  id: string;
  name: string;
  description: string;
  playUrl: string;
  engine: string;
  /** tunable parameters, declared as data so a new game needs no code change */
  tuning: { fields: TuningField[] };
  rules: GameRule[];
}

export interface GameManifest {
  activeGame: string;
  games: Record<string, GameDef>;
}

/** Fetch the manifest and return the currently active game definition. */
export async function loadActiveGame(): Promise<GameDef> {
  // BASE_URL is "/" locally and "/playtest-studio/" on the GitHub Pages build,
  // so the manifest resolves correctly under a subpath deploy.
  const res = await fetch(`${import.meta.env.BASE_URL}games.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not load games.json (${res.status})`);
  const manifest = (await res.json()) as GameManifest;
  const game = manifest.games[manifest.activeGame];
  if (!game) throw new Error(`Active game "${manifest.activeGame}" not found`);
  return game;
}

/** Build a tuning object from a game's declared field defaults. */
export function defaultTuningFor(game: GameDef): GameTuning {
  const t = {} as Record<string, number>;
  for (const f of game.tuning.fields) t[f.key] = f.default;
  return t as unknown as GameTuning;
}
