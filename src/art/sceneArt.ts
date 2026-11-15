import Phaser from 'phaser';
import { canvasTexture, Ctx, rgba, rng, shade } from './canvas';

export const W = 1600;
export const H = 900;

/* ------------------------------------------------------------------ */
/* Background: deep reef with god-rays, layered rock silhouettes,       */
/* corals, sponges, sand and plankton. Drawn once into a 1600x900 map. */
/* ------------------------------------------------------------------ */

function rockLayer(ctx: Ctx, rand: () => number, baseY: number, amp: number, color: string, top: string, seg = 26): void {
  ctx.beginPath();
  ctx.moveTo(-20, H + 20);
  let y = baseY;
  for (let i = 0; i <= seg; i++) {
    const x = (i / seg) * (W + 40) - 20;
    y = baseY - Math.abs(Math.sin(i * 0.7 + rand() * 2)) * amp - rand() * amp * 0.4;
    const cx = x - (W / seg) * 0.5;
    ctx.quadraticCurveTo(cx, y - amp * 0.3 * rand(), x, y);
  }
  ctx.lineTo(W + 20, H + 20);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, baseY - amp * 1.4, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, color);
  ctx.fillStyle = g;
  ctx.fill();
}

function branchCoral(ctx: Ctx, x: number, y: number, len: number, ang: number, width: number, depth: number, color: string, rand: () => number): void {
  if (depth <= 0 || len < 4) {
    ctx.fillStyle = shade(color.startsWith('#') ? color : '#ff5050', 0.35);
    ctx.beginPath();
    ctx.arc(x, y, width * 0.9, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
  const cx = x + Math.cos(ang + (rand() - 0.5) * 0.8) * len * 0.5;
  const cy = y + Math.sin(ang + (rand() - 0.5) * 0.8) * len * 0.5;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  ctx.stroke();
  // highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = Math.max(1, width * 0.3);
  ctx.beginPath();
  ctx.moveTo(x - width * 0.2, y);
  ctx.quadraticCurveTo(cx - width * 0.2, cy, x2 - width * 0.2, y2);
  ctx.stroke();
  const n = rand() < 0.4 ? 3 : 2;
  for (let i = 0; i < n; i++) {
    const na = ang + (i - (n - 1) / 2) * (0.5 + rand() * 0.3);
    branchCoral(ctx, x2, y2, len * (0.66 + rand() * 0.15), na, width * 0.72, depth - 1, color, rand);
  }
}

function fanCoral(ctx: Ctx, x: number, y: number, r: number, color: string, rand: () => number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, Math.PI * 1.08, Math.PI * 1.92);
  ctx.closePath();
  const g = ctx.createRadialGradient(0, 0, r * 0.1, 0, -r * 0.4, r);
  g.addColorStop(0, rgba(color, 0.9));
  g.addColorStop(1, rgba(color, 0.55));
  ctx.fillStyle = g;
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = shade(color, -0.45);
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 26; i++) {
    const a = Math.PI * (1.08 + (i / 25) * 0.84);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(Math.cos(a) * r * 0.5 + (rand() - 0.5) * 10, Math.sin(a) * r * 0.5, Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  for (let k = 1; k < 7; k++) {
    ctx.beginPath();
    ctx.arc(0, 0, (r * k) / 7 + (rand() - 0.5) * 4, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  }
  ctx.restore();
}

function brainCoral(ctx: Ctx, x: number, y: number, r: number, color: string, rand: () => number): void {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.68, 0, Math.PI, 0);
  ctx.closePath();
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.5, 2, x, y, r);
  g.addColorStop(0, shade(color, 0.35));
  g.addColorStop(1, shade(color, -0.35));
  ctx.fillStyle = g;
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = shade(color, -0.5);
  ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    let px = x - r + rand() * r * 2, py = y - rand() * r * 0.6;
    ctx.moveTo(px, py);
    for (let k = 0; k < 6; k++) {
      px += (rand() - 0.5) * 22;
      py += (rand() - 0.5) * 12;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function tubeSponge(ctx: Ctx, x: number, y: number, h: number, color: string): void {
  const tubes = [[-14, 1], [0, 1.25], [15, 0.85]];
  for (const [dx, k] of tubes) {
    const th = h * k, tx = x + dx, w = 12;
    const g = ctx.createLinearGradient(tx - w, 0, tx + w, 0);
    g.addColorStop(0, shade(color, -0.4));
    g.addColorStop(0.45, shade(color, 0.15));
    g.addColorStop(1, shade(color, -0.5));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(tx - w * 0.8, y);
    ctx.lineTo(tx - w, y - th);
    ctx.lineTo(tx + w, y - th);
    ctx.lineTo(tx + w * 0.8, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = shade(color, -0.65);
    ctx.beginPath();
    ctx.ellipse(tx, y - th, w, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = shade(color, 0.3);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function rock(ctx: Ctx, x: number, y: number, w: number, h: number, rand: () => number): void {
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = x - w / 2 + t * w;
    const py = y - Math.sin(t * Math.PI) * h * (0.75 + rand() * 0.35);
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  const g = ctx.createLinearGradient(x - w * 0.3, y - h, x + w * 0.2, y);
  g.addColorStop(0, '#3d5f7a');
  g.addColorStop(0.5, '#1d3550');
  g.addColorStop(1, '#0a1828');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(140,200,255,0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();
  // moss
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = rgba(rand() < 0.5 ? '#2f8f5a' : '#4fb070', 0.5);
    ctx.beginPath();
    ctx.arc(x - w * 0.4 + rand() * w * 0.8, y - h * (0.6 + rand() * 0.35), 3 + rand() * 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function starfish(ctx: Ctx, x: number, y: number, r: number, rot: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.6);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
  g.addColorStop(0, '#ffb067');
  g.addColorStop(1, '#e0452a');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = '#7a1a08';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

export function drawBackground(ctx: Ctx): void {
  const rand = rng(7);
  // water column
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#1a8ad0');
  g.addColorStop(0.18, '#0d5fa6');
  g.addColorStop(0.55, '#063b78');
  g.addColorStop(1, '#021834');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // surface glow
  const sg = ctx.createRadialGradient(W * 0.5, -260, 50, W * 0.5, -200, 900);
  sg.addColorStop(0, 'rgba(180,240,255,0.55)');
  sg.addColorStop(1, 'rgba(180,240,255,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, W, H);
  // static god rays
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const x = 120 + i * 170 + rand() * 80;
    const w = 40 + rand() * 90;
    const lg = ctx.createLinearGradient(0, 0, 0, H * 0.85);
    lg.addColorStop(0, 'rgba(160,230,255,0.13)');
    lg.addColorStop(1, 'rgba(160,230,255,0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(x, -10);
    ctx.lineTo(x + w, -10);
    ctx.lineTo(x + w * 2.4 - 160, H * 0.85);
    ctx.lineTo(x - 160, H * 0.85);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // far silhouettes of fish
  for (let i = 0; i < 26; i++) {
    const x = rand() * W, y = 120 + rand() * 420, s = 4 + rand() * 7;
    ctx.fillStyle = 'rgba(8,40,90,0.45)';
    ctx.beginPath();
    ctx.ellipse(x, y, s * 1.8, s * 0.7, 0, 0, Math.PI * 2);
    ctx.moveTo(x - s * 1.6, y);
    ctx.lineTo(x - s * 2.8, y - s * 0.8);
    ctx.lineTo(x - s * 2.8, y + s * 0.8);
    ctx.fill();
  }
  // distant reef layers
  rockLayer(ctx, rand, 600, 120, '#05244d', 'rgba(20,80,140,0.55)', 18);
  rockLayer(ctx, rand, 690, 110, '#031a38', '#0c3b6e', 22);
  // haze between layers
  const hz = ctx.createLinearGradient(0, 520, 0, 760);
  hz.addColorStop(0, 'rgba(40,120,200,0)');
  hz.addColorStop(1, 'rgba(40,120,200,0.18)');
  ctx.fillStyle = hz;
  ctx.fillRect(0, 520, W, 240);
  // near reef bed
  rockLayer(ctx, rand, 790, 70, '#020f22', '#0a2a50', 30);
  // sand
  const sand = ctx.createLinearGradient(0, 820, 0, H);
  sand.addColorStop(0, '#3a6a8c');
  sand.addColorStop(1, '#14324c');
  ctx.fillStyle = sand;
  ctx.beginPath();
  ctx.moveTo(0, 845);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 838 + Math.sin(x * 0.012) * 10 + rand() * 4);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(160,220,255,0.12)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 30; i++) {
    const x = rand() * W, y = 855 + rand() * 40;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 20, y - 5, x + 40, y);
    ctx.stroke();
  }
  // rocks
  rock(ctx, 120, 860, 220, 120, rand);
  rock(ctx, 1480, 860, 260, 150, rand);
  rock(ctx, 760, 870, 160, 60, rand);
  // corals left
  fanCoral(ctx, 230, 850, 120, '#a03cff', rand);
  branchCoral(ctx, 60, 860, 70, -Math.PI / 2, 12, 5, '#ff4a5a', rand);
  branchCoral(ctx, 330, 865, 60, -Math.PI / 2 - 0.2, 10, 5, '#ff8a3d', rand);
  brainCoral(ctx, 430, 872, 60, '#e2a13a', rand);
  tubeSponge(ctx, 520, 870, 70, '#d23cff');
  // corals right
  fanCoral(ctx, 1330, 845, 140, '#ff4f8b', rand);
  branchCoral(ctx, 1560, 870, 80, -Math.PI / 2 + 0.1, 13, 5, '#ff4a5a', rand);
  branchCoral(ctx, 1200, 870, 62, -Math.PI / 2, 10, 5, '#ffb03a', rand);
  brainCoral(ctx, 1100, 875, 55, '#5bc06a', rand);
  tubeSponge(ctx, 1450, 880, 80, '#ff7b2d');
  starfish(ctx, 640, 878, 18, 0.3);
  starfish(ctx, 990, 885, 14, -0.4);
  // plankton
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = `rgba(200,240,255,${0.1 + rand() * 0.35})`;
    ctx.beginPath();
    ctx.arc(rand() * W, rand() * H * 0.9, rand() * 1.8 + 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // vignette
  const vg = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.35, W / 2, H * 0.5, W * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,6,20,0.65)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

function seaweed(ctx: Ctx, w: number, h: number, color: string, seed: number): void {
  const rand = rng(seed);
  const blades = 4;
  for (let b = 0; b < blades; b++) {
    const x0 = w * 0.3 + rand() * w * 0.4;
    const bh = h * (0.6 + rand() * 0.4);
    const bend = (rand() - 0.5) * 40;
    ctx.beginPath();
    ctx.moveTo(x0 - 6, h);
    const steps = 10;
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push([x0 + Math.sin(t * 5 + b) * 10 * t + bend * t * t, h - t * bh]);
    }
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const [px, py] = pts[i];
      ctx.lineTo(px - (1 - t) * 9 - 2, py);
    }
    for (let i = steps; i >= 0; i--) {
      const t = i / steps;
      const [px, py] = pts[i];
      ctx.lineTo(px + (1 - t) * 9 + 2, py);
    }
    ctx.closePath();
    const g = ctx.createLinearGradient(0, h, 0, h - bh);
    g.addColorStop(0, shade(color, -0.6));
    g.addColorStop(0.6, color);
    g.addColorStop(1, shade(color, 0.35));
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = shade(color, -0.55);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // midrib
    ctx.strokeStyle = rgba('#ffffff', 0.18);
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.stroke();
  }
}

export function buildSceneTextures(scene: Phaser.Scene): void {
  canvasTexture(scene, 'bg', W, H, (ctx) => drawBackground(ctx));
  canvasTexture(scene, 'weed_green', 90, 260, (ctx, w, h) => seaweed(ctx, w, h, '#36c05a', 11));
  canvasTexture(scene, 'weed_teal', 90, 220, (ctx, w, h) => seaweed(ctx, w, h, '#1fb3a0', 23));
  canvasTexture(scene, 'weed_olive', 90, 300, (ctx, w, h) => seaweed(ctx, w, h, '#7bbf2a', 37));
  canvasTexture(scene, 'ray', 220, 900, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(190,240,255,0.35)');
    g.addColorStop(1, 'rgba(190,240,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, 0);
    ctx.lineTo(w * 0.65, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
  });
  canvasTexture(scene, 'tinyfish', 40, 18, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 18);
    g.addColorStop(0, '#ffd23f');
    g.addColorStop(1, '#ff8a00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(24, 9, 13, 6.5, 0, 0, Math.PI * 2);
    ctx.moveTo(13, 9);
    ctx.lineTo(2, 2);
    ctx.lineTo(2, 16);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4a2a00';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(32, 7.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
}
