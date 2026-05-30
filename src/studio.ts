import { loadActiveGame, defaultTuningFor, type GameDef, type GameRule } from "./rules.ts";
import { encodeTuning } from "./tuning.ts";
import type { GameTuning, TuningField } from "./types.ts";

let tuning: GameTuning = {} as GameTuning;
let tuningFields: TuningField[] = [];
let game: GameDef | null = null;
let rules: GameRule[] = [];

const controlsEl = document.getElementById("controls")!;
const rulesEl = document.getElementById("rules")!;
const resultsEl = document.getElementById("results")!;
const previewEl = document.getElementById("preview") as HTMLIFrameElement;
const statusEl = document.getElementById("playtest-status")!;
const loopNoteEl = document.getElementById("loop-note")!;
const runBtn = document.getElementById("run-playtest") as HTMLButtonElement;

function gameUrl(extra: Record<string, string> = {}): string {
  const base = game?.playUrl ?? "play.html";
  const p = new URLSearchParams({ t: encodeTuning(tuning), ...extra });
  return `${base}?${p.toString()}`;
}

function refreshPreview(): void {
  previewEl.src = gameUrl();
}

function buildControls(): void {
  controlsEl.innerHTML = "";
  for (const f of tuningFields) {
    const wrap = document.createElement("label");
    wrap.className = "control";
    wrap.innerHTML = `
      <span class="control-label">${f.label}</span>
      <span class="control-row">
        <input type="range" min="${f.min}" max="${f.max}" step="${f.step}"
               value="${tuning[f.key]}" data-key="${f.key}"
               data-testid="ctl-${f.key}" />
        <output data-out="${f.key}">${tuning[f.key]}</output>
      </span>`;
    const input = wrap.querySelector("input")!;
    const out = wrap.querySelector("output")!;
    input.addEventListener("input", () => {
      const v = Number(input.value);
      (tuning[f.key] as number) = v;
      out.textContent = String(v);
    });
    input.addEventListener("change", refreshPreview);
    controlsEl.appendChild(wrap);
  }
}

function buildRules(): void {
  rulesEl.innerHTML = "";
  for (const r of rules) {
    const li = document.createElement("li");
    li.className = "rule";
    li.dataset.ruleId = r.id;
    li.setAttribute("data-testid", `rule-${r.id}`);
    li.innerHTML = `
      <span class="rule-dot" data-state="pending"></span>
      <span class="rule-text">${r.statement}</span>`;
    rulesEl.appendChild(li);
  }
}

function setRuleState(id: string, state: "pending" | "pass" | "fail"): void {
  const dot = rulesEl.querySelector(`[data-rule-id="${id}"] .rule-dot`);
  if (dot) dot.setAttribute("data-state", state);
}

function setStatus(state: string, text: string): void {
  statusEl.setAttribute("data-state", state);
  statusEl.textContent = text;
}

interface RuleResult {
  id: string;
  statement: string;
  status: "passed" | "failed" | "error";
  detail: string;
}
interface PlaytestResponse {
  ok: boolean;
  passed: number;
  total: number;
  results: RuleResult[];
  loopMessage?: string;
  error?: string;
}

function renderResults(data: PlaytestResponse): void {
  resultsEl.innerHTML = "";
  for (const r of data.results) {
    setRuleState(r.id, r.status === "passed" ? "pass" : "fail");
    const li = document.createElement("li");
    li.className = `result ${r.status}`;
    li.setAttribute("data-testid", `result-${r.id}`);
    const icon = r.status === "passed" ? "🟢" : r.status === "failed" ? "🔴" : "⚠️";
    li.innerHTML = `<span>${icon}</span><span><strong>${r.statement}</strong><br><small>${r.detail}</small></span>`;
    resultsEl.appendChild(li);
  }
}

async function runPlaytest(): Promise<void> {
  runBtn.disabled = true;
  loopNoteEl.classList.add("hidden");
  resultsEl.innerHTML = "";
  rules.forEach((r) => setRuleState(r.id, "pending"));
  setStatus("running", "Kane is playing your game in a real browser…");

  try {
    const res = await fetch("/api/playtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: game?.id, tuning }),
    });
    const data = (await res.json()) as PlaytestResponse;

    if (data.error) {
      setStatus("error", data.error);
      runBtn.disabled = false;
      return;
    }

    renderResults(data);
    const allPass = data.passed === data.total;
    setStatus(
      allPass ? "pass" : "fail",
      `Kane proved ${data.passed}/${data.total} rules${allPass ? " — all green." : " — found a problem."}`,
    );

    if (data.loopMessage) {
      loopNoteEl.classList.remove("hidden");
      loopNoteEl.textContent = data.loopMessage;
    }
  } catch (err) {
    setStatus(
      "error",
      "Could not reach the playtest server. Start it with: npm run studio",
    );
    void err;
  } finally {
    runBtn.disabled = false;
  }
}

document.getElementById("open-game")!.addEventListener("click", () => {
  window.open(gameUrl(), "_blank");
});
document.getElementById("reset-tuning")!.addEventListener("click", () => {
  tuning = game ? defaultTuningFor(game) : ({} as GameTuning);
  buildControls();
  refreshPreview();
});
runBtn.addEventListener("click", runPlaytest);

async function boot(): Promise<void> {
  try {
    game = await loadActiveGame();
    rules = game.rules;
    tuningFields = game.tuning.fields;
    tuning = defaultTuningFor(game);
  } catch (err) {
    setStatus("error", `Could not load games.json: ${String(err)}`);
    return;
  }
  buildControls();
  buildRules();
  refreshPreview();
}

void boot();
