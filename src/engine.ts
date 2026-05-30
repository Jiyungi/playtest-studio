import { createRng, randInt } from "./rng.ts";
import type { Car, Entity, GameConfig, GameState, GameTuning, Mode } from "./types.ts";

const CAR_W = 46;
const CAR_H = 76;
const ENTITY_SIZE = 40;

export function laneCenterX(lane: number, width: number, lanes: number): number {
  const laneWidth = width / lanes;
  return laneWidth * lane + laneWidth / 2;
}

function makeCar(lane: number, width: number, height: number, lanes: number): Car {
  return {
    lane,
    x: laneCenterX(lane, width, lanes),
    y: height - CAR_H - 16,
    w: CAR_W,
    h: CAR_H,
  };
}

export function createInitialState(config: GameConfig): GameState {
  const { mode, width, height, tuning } = config;
  const lanes = tuning.lanes;
  const player = makeCar(Math.min(1, lanes - 1), width, height, lanes);
  const rival =
    mode === "solo" ? null : makeCar(Math.max(0, lanes - 2), width, height, lanes);
  if (rival) rival.y = height - CAR_H - 120;

  return {
    phase: "playing",
    mode,
    score: 0,
    rivalScore: 0,
    lives: tuning.lives,
    player,
    rival,
    entities: [],
    speed: tuning.baseSpeed,
    elapsed: 0,
    spawnTimer: 0,
    result: "",
  };
}

/** Engine carries its own RNG instance keyed off the config seed. */
export class Engine {
  state: GameState;
  private rand: () => number;
  private config: GameConfig;
  private t: GameTuning;

  constructor(config: GameConfig) {
    this.config = config;
    this.t = config.tuning;
    this.rand = createRng(config.seed);
    this.state = createInitialState(config);
  }

  get tuning(): GameTuning {
    return this.t;
  }

  reset(mode: Mode, tuning?: GameTuning): void {
    if (tuning) this.t = tuning;
    this.config = { ...this.config, mode, tuning: this.t };
    this.rand = createRng(this.config.seed);
    this.state = createInitialState(this.config);
  }

  movePlayer(dir: -1 | 1): void {
    if (this.state.phase !== "playing") return;
    const next = this.state.player.lane + dir;
    if (next >= 0 && next < this.t.lanes) {
      this.state.player.lane = next;
    }
  }

  moveRival(dir: -1 | 1): void {
    const rival = this.state.rival;
    if (!rival || this.state.phase !== "playing") return;
    const next = rival.lane + dir;
    if (next >= 0 && next < this.t.lanes) {
      rival.lane = next;
    }
  }

  private spawn(): void {
    const lane = randInt(this.rand, 0, this.t.lanes - 1);
    const kind = this.rand() < this.t.obstacleRatio ? "obstacle" : "coin";
    this.state.entities.push({
      kind,
      lane,
      y: -ENTITY_SIZE,
      w: ENTITY_SIZE,
      h: ENTITY_SIZE,
      spent: false,
    });
  }

  private collide(a: Car, e: Entity): boolean {
    const ex = laneCenterX(e.lane, this.config.width, this.t.lanes);
    return (
      Math.abs(a.x - ex) < (a.w + e.w) / 2 &&
      Math.abs(a.y - e.y) < (a.h + e.h) / 2
    );
  }

  /** Advance the simulation by dt seconds. */
  step(dt: number): void {
    const s = this.state;
    const t = this.t;
    if (s.phase !== "playing") return;

    s.elapsed += dt;
    s.speed = Math.min(t.maxSpeed, t.baseSpeed + t.speedRamp * s.elapsed);

    const targetX = laneCenterX(s.player.lane, this.config.width, t.lanes);
    s.player.x += (targetX - s.player.x) * Math.min(1, dt * 12);

    if (s.rival) {
      const rTargetX = laneCenterX(s.rival.lane, this.config.width, t.lanes);
      s.rival.x += (rTargetX - s.rival.x) * Math.min(1, dt * 10);
    }

    s.spawnTimer += dt;
    if (s.spawnTimer >= t.spawnInterval) {
      s.spawnTimer -= t.spawnInterval;
      this.spawn();
    }

    for (const e of s.entities) {
      e.y += s.speed * dt;

      if (!e.spent && this.collide(s.player, e)) {
        e.spent = true;
        if (e.kind === "coin") {
          s.score += t.coinPoints;
        } else {
          s.lives -= 1;
          if (s.lives <= 0) {
            s.lives = 0;
            this.endGame();
            return;
          }
        }
      }

      if (!e.spent && s.rival && this.collide(s.rival, e)) {
        if (e.kind === "coin") {
          e.spent = true;
          s.rivalScore += t.coinPoints;
        }
      }
    }

    const before = Math.floor((s.elapsed - dt) * t.passPoints);
    const after = Math.floor(s.elapsed * t.passPoints);
    if (after > before) s.score += after - before;

    s.entities = s.entities.filter((e) => e.y < this.config.height + 80);
  }

  private endGame(): void {
    const s = this.state;
    s.phase = "gameover";
    if (s.mode === "solo") {
      s.result = `You scored ${s.score}.`;
    } else if (s.score > s.rivalScore) {
      s.result = `You win! ${s.score} vs ${s.rivalScore}.`;
    } else if (s.score < s.rivalScore) {
      s.result = `Rival wins. ${s.rivalScore} vs ${s.score}.`;
    } else {
      s.result = `Tie at ${s.score}.`;
    }
  }

  pause(): void {
    if (this.state.phase === "playing") this.state.phase = "paused";
    else if (this.state.phase === "paused") this.state.phase = "playing";
  }
}
