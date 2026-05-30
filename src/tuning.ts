import type { GameTuning } from "./types.ts";

/** Encode tuning into a compact URL-safe string. */
export function encodeTuning(t: GameTuning): string {
  return btoa(JSON.stringify(t));
}

/**
 * Decode tuning from a URL param, layered over a game's declared defaults.
 * Defaults now come from games.json (per game), not a hardcoded constant, so
 * the manifest stays the single source of truth.
 */
export function decodeTuning(raw: string | null, defaults: GameTuning): GameTuning {
  if (!raw) return { ...defaults };
  try {
    const parsed = JSON.parse(atob(raw)) as Partial<GameTuning>;
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}
