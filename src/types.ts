export type Mode = "solo" | "2p";

export type Phase = "menu" | "playing" | "paused" | "gameover";

export type EntityKind = "obstacle" | "coin";

export interface Entity {
  kind: EntityKind;
  lane: number;
  y: number;
  /** width/height in canvas px */
  w: number;
  h: number;
  /** marks entities already scored/consumed so we don't double-count */
  spent: boolean;
}

export interface Car {
  /** lane index the car is currently in (target) */
  lane: number;
  /** smoothed x position in px for rendering */
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Tunable rules of a game definition. These are what the Studio lets a
 * builder change, and what Kane then verifies hold true.
 */
export interface GameTuning {
  lives: number;
  lanes: number;
  coinPoints: number;
  /** probability that a spawned entity is an obstacle (0..1) */
  obstacleRatio: number;
  baseSpeed: number;
  speedRamp: number;
  maxSpeed: number;
  spawnInterval: number;
  /** points awarded per second survived */
  passPoints: number;
}

/** A single tunable parameter, declared per-game in games.json. */
export interface TuningField {
  key: keyof GameTuning;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface GameConfig {
  mode: Mode;
  width: number;
  height: number;
  /** fixed seed so scenarios are reproducible for Kane */
  seed: number;
  tuning: GameTuning;
}

export interface GameState {
  phase: Phase;
  mode: Mode;
  score: number;
  rivalScore: number;
  lives: number;
  player: Car;
  rival: Car | null;
  entities: Entity[];
  /** scrolling speed in px/sec, ramps up over time */
  speed: number;
  /** elapsed seconds */
  elapsed: number;
  /** seconds since last spawn */
  spawnTimer: number;
  /** outcome line shown on game over */
  result: string;
}
