import { Engine } from "./engine.ts";
import { Renderer } from "./renderer.ts";
import { decodeTuning } from "./tuning.ts";
import { loadActiveGame, defaultTuningFor } from "./rules.ts";
import type { GameState, GameTuning, Mode } from "./types.ts";

const FIXED_SEED = 1337;

const params = new URLSearchParams(location.search);

const canvas = document.getElementById("game") as HTMLCanvasElement;
const overlay = document.getElementById("overlay")!;
const menu = document.getElementById("menu")!;
const gameoverPanel = document.getElementById("gameover")!;

const el = {
  score: document.getElementById("score")!,
  lives: document.getElementById("lives")!,
  rivalScore: document.getElementById("rival-score")!,
  status: document.getElementById("status")!,
  finalScore: document.getElementById("final-score")!,
  resultLine: document.getElementById("result-line")!,
};

// Assigned during async init() once the game's tuning defaults are loaded
// from games.json (the manifest is the single source of truth for defaults).
let engine: Engine;
let renderer: Renderer;
let tuning: GameTuning;

let last = performance.now();
let rafId = 0;
// The world doesn't advance until the player makes their first move.
// This "ready" gate makes the start state stable (good UX, and it means a
// just-started game reads "Playing" deterministically instead of racing to
// Game Over while no one is at the keyboard).
let armed = false;

function heartString(lives: number): string {
  return lives > 0 ? "♥".repeat(lives) : "—";
}

function statusLabel(phase: GameState["phase"]): string {
  switch (phase) {
    case "menu": return "Menu";
    case "playing": return "Playing";
    case "paused": return "Paused";
    case "gameover": return "Game Over";
  }
}

/** Mirror engine state into the DOM so Kane can read it without pixels. */
function syncDom(s: GameState): void {
  el.score.textContent = String(s.score);
  el.score.setAttribute("data-score", String(s.score));

  el.lives.textContent = heartString(s.lives);
  el.lives.setAttribute("data-lives", String(s.lives));

  el.rivalScore.textContent = String(s.rivalScore);
  el.rivalScore.setAttribute("data-rival-score", String(s.rivalScore));

  el.status.textContent = statusLabel(s.phase);
  el.status.setAttribute("data-status", s.phase);

  if (s.phase === "menu") {
    overlay.classList.remove("hidden");
    menu.classList.remove("hidden");
    gameoverPanel.classList.add("hidden");
  } else if (s.phase === "gameover") {
    overlay.classList.remove("hidden");
    menu.classList.add("hidden");
    gameoverPanel.classList.remove("hidden");
    el.finalScore.textContent = String(s.score);
    el.finalScore.setAttribute("data-final-score", String(s.score));
    el.resultLine.textContent = s.result;
  } else {
    overlay.classList.add("hidden");
  }
}

function loop(now: number): void {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  // Only advance the simulation once the player has armed it with a move.
  if (armed) engine.step(dt);
  renderer.draw(engine.state, dt);
  if (!armed && engine.state.phase === "playing") {
    renderer.drawReadyHint();
  }
  syncDom(engine.state);
  rafId = requestAnimationFrame(loop);
}

function startGame(mode: Mode): void {
  engine.reset(mode, tuning);
  renderer.setLanes(tuning.lanes);
  armed = false; // wait for first input before the world moves
  syncDom(engine.state);
}

function showMenu(): void {
  armed = false;
  engine.state.phase = "menu";
  syncDom(engine.state);
}

// --- input ---------------------------------------------------------------
window.addEventListener("keydown", (e) => {
  if (!engine) return; // ignore input until the game has finished loading
  switch (e.key) {
    case "ArrowLeft": armed = true; engine.movePlayer(-1); break;
    case "ArrowRight": armed = true; engine.movePlayer(1); break;
    case "a": case "A": armed = true; engine.moveRival(-1); break;
    case "d": case "D": armed = true; engine.moveRival(1); break;
    case "p": case "P": engine.pause(); syncDom(engine.state); break;
  }
});

document.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((btn) => {
  btn.addEventListener("click", () => startGame(btn.dataset.mode as Mode));
});
document
  .querySelector<HTMLButtonElement>('[data-action="restart"]')!
  .addEventListener("click", showMenu);

// --- deterministic scenarios for Kane ------------------------------------
type Scenario = "collect" | "crash" | "gameover" | "started";

function runScenario(name: Scenario): void {
  cancelAnimationFrame(rafId);
  engine.reset("solo", tuning);
  renderer.setLanes(tuning.lanes);

  // "started" proves the menu→play transition deterministically: the game is
  // started and left frozen in the ready "playing" state, so Kane can assert
  // on data-status without having to click-then-read in a single step.
  if (name === "started") {
    armed = false;
    syncDom(engine.state);
    renderer.draw(engine.state, 1 / 60);
    renderer.drawReadyHint();
    return;
  }

  const TICK = 1 / 60;
  const maxTicks = 60 * 90;
  let ticks = 0;

  function advanceUntil(pred: (s: GameState) => boolean): void {
    while (ticks < maxTicks && !pred(engine.state)) {
      engine.step(TICK);
      ticks++;
    }
  }

  if (name === "collect") {
    advanceUntil((s) => s.score >= engine.tuning.coinPoints || s.phase === "gameover");
  } else if (name === "crash") {
    advanceUntil((s) => s.lives < engine.tuning.lives || s.phase === "gameover");
  } else if (name === "gameover") {
    advanceUntil((s) => s.phase === "gameover");
  }

  renderer.draw(engine.state, TICK);
  syncDom(engine.state);
}

// --- test hook surface ----------------------------------------------------
interface VsTrafficApi {
  state: () => GameState;
  start: (mode: Mode) => void;
  scenario: (name: Scenario) => void;
  step: (dt: number) => void;
}
const api: VsTrafficApi = {
  state: () => engine.state,
  start: startGame,
  scenario: runScenario,
  step: (dt) => engine.step(dt),
};
(window as unknown as { vsTraffic: VsTrafficApi }).vsTraffic = api;

// --- boot ----------------------------------------------------------------
// Defaults now live in games.json, so boot is async: load the active game's
// tuning defaults, layer any URL override on top, then build the engine.
async function init(): Promise<void> {
  const defaults = defaultTuningFor(await loadActiveGame());
  tuning = decodeTuning(params.get("t"), defaults);

  engine = new Engine({
    mode: "solo",
    width: canvas.width,
    height: canvas.height,
    seed: FIXED_SEED,
    tuning,
  });
  renderer = new Renderer(canvas, tuning.lanes);

  const scenario = params.get("scenario") as Scenario | null;
  if (scenario && ["collect", "crash", "gameover", "started"].includes(scenario)) {
    syncDom(engine.state);
    runScenario(scenario);
  } else {
    const auto = params.get("mode") as Mode | null;
    if (auto && ["solo", "2p"].includes(auto)) {
      startGame(auto);
    } else {
      showMenu();
    }
    rafId = requestAnimationFrame(loop);
  }
}

void init();
