import { laneCenterX } from "./engine.ts";
import type { Car, Entity, GameState } from "./types.ts";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private lanes: number;
  private dash = 0;

  constructor(canvas: HTMLCanvasElement, lanes: number) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
    this.lanes = lanes;
  }

  setLanes(lanes: number): void {
    this.lanes = lanes;
  }

  /** Overlay shown while a started game waits for the player's first move. */
  drawReadyHint(): void {
    const { ctx } = this;
    ctx.fillStyle = "rgba(10,12,18,0.55)";
    ctx.fillRect(0, this.height / 2 - 40, this.width, 80);
    ctx.fillStyle = "#f4efe6";
    ctx.font = "bold 22px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Ready — press ← or → to start", this.width / 2, this.height / 2);
  }

  draw(state: GameState, dt: number): void {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = "#2a2f3a";
    ctx.fillRect(0, 0, this.width, this.height);

    this.dash = (this.dash + state.speed * dt) % 48;
    ctx.strokeStyle = "rgba(244,239,230,0.35)";
    ctx.lineWidth = 3;
    ctx.setLineDash([24, 24]);
    ctx.lineDashOffset = -this.dash;
    for (let l = 1; l < this.lanes; l++) {
      const x = (this.width / this.lanes) * l;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const e of state.entities) {
      if (e.spent && e.kind === "coin") continue;
      this.drawEntity(e);
    }

    if (state.rival) this.drawCar(state.rival, "#5b8def", "🤖");
    this.drawCar(state.player, "#e06a3f", "🚗");
  }

  private drawEntity(e: Entity): void {
    const { ctx } = this;
    const x = laneCenterX(e.lane, this.width, this.lanes);
    if (e.kind === "coin") {
      ctx.fillStyle = "#f4c542";
      ctx.beginPath();
      ctx.arc(x, e.y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8a6d12";
      ctx.font = "bold 22px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", x, e.y + 1);
    } else {
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(x - e.w / 2, e.y - e.h / 2, e.w, e.h);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(x - e.w / 2, e.y - e.h / 2, e.w, 8);
    }
  }

  private drawCar(car: Car, color: string, glyph: string): void {
    const { ctx } = this;
    ctx.fillStyle = color;
    const r = 8;
    const x = car.x - car.w / 2;
    const y = car.y - car.h / 2;
    ctx.beginPath();
    ctx.roundRect(x, y, car.w, car.h, r);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(x + 6, y + 12, car.w - 12, 16);
    ctx.fillRect(x + 6, y + car.h - 28, car.w - 12, 16);
    ctx.font = "20px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, car.x, car.y);
  }
}
