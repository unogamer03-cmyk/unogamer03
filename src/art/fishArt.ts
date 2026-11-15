import Phaser from 'phaser';
import { canvasSheet, Ctx, rgba, shade } from './canvas';

/**
 * Hand-built procedural fish illustrations. Every fish is drawn with layered
 * canvas gradients (body volume, counter-shading, rim light, scales, fins with
 * rays, glossy cartoon eyes, teeth) and rendered into a 6-frame swim cycle.
 */

export const SWIM_FRAMES = 6;

interface Stripe { x: number; w: number; color: string; edge?: string; lean?: number }

export interface FishArtSpec {
  key: string;
  w: number;
  h: number;
  len: number;
  top: number;
  bot: number;
  ped: number;
  tailLen: number;
  tailSpread: number;
  tailFork: number;
  colors: { top: string; mid: string; belly: string; fin: string; finTip: string; outline: string; iris: string };
  stripes?: Stripe[];
  spots?: { color: string; count: number; size: number; glow?: boolean };
  dorsal?: { h: number; spiky?: number; from?: number; to?: number };
  anal?: { h: number };
  teeth?: boolean;
  angry?: boolean;
  eye: number;
  lure?: boolean;
  shine?: boolean;
}

export const FISH_ART: FishArtSpec[] = [
  {
    key: 'fish_bumble', w: 170, h: 120, len: 92, top: 34, bot: 31, ped: 9, tailLen: 36, tailSpread: 27, tailFork: 0.45,
    colors: { top: '#f5b800', mid: '#ffd93b', belly: '#fff4b0', fin: '#ffcf33', finTip: '#ff9d00', outline: '#3d2600', iris: '#2b1b00' },
    stripes: [
      { x: 0.42, w: 0.17, color: '#1c1408', lean: 0.1 },
      { x: 0.0, w: 0.2, color: '#1c1408', lean: 0.05 },
      { x: -0.45, w: 0.16, color: '#1c1408' },
    ],
    dorsal: { h: 20, from: 0.3, to: -0.6 }, anal: { h: 12 }, eye: 12,
  },
  {
    key: 'fish_bluestripe', w: 200, h: 130, len: 112, top: 38, bot: 33, ped: 10, tailLen: 42, tailSpread: 31, tailFork: 0.5,
    colors: { top: '#1546b8', mid: '#2f7bf0', belly: '#e9f3ff', fin: '#ffb020', finTip: '#ff6a00', outline: '#06173f', iris: '#3a2400' },
    stripes: [
      { x: 0.32, w: 0.13, color: '#ffffff', edge: '#08205e', lean: 0.1 },
      { x: -0.08, w: 0.14, color: '#ffffff', edge: '#08205e', lean: 0.05 },
      { x: -0.5, w: 0.11, color: '#ffffff', edge: '#08205e' },
    ],
    dorsal: { h: 24, spiky: 6, from: 0.35, to: -0.6 }, anal: { h: 14 }, eye: 13,
  },
  {
    key: 'fish_piranha', w: 210, h: 160, len: 122, top: 42, bot: 52, ped: 11, tailLen: 42, tailSpread: 32, tailFork: 0.35,
    colors: { top: '#1d7a1f', mid: '#46c43a', belly: '#d8f27a', fin: '#2f9e2a', finTip: '#8ce04a', outline: '#062a07', iris: '#ffcf1f' },
    spots: { color: '#0f4f12', count: 14, size: 4 },
    dorsal: { h: 22, spiky: 5, from: 0.2, to: -0.55 }, anal: { h: 18 }, teeth: true, angry: true, eye: 14,
  },
  {
    key: 'fish_fang', w: 240, h: 175, len: 142, top: 52, bot: 50, ped: 12, tailLen: 52, tailSpread: 40, tailFork: 0.45,
    colors: { top: '#4a1a9c', mid: '#8a3fe0', belly: '#e2c4ff', fin: '#6c2fd0', finTip: '#ff7a3d', outline: '#1b0640', iris: '#ff3b2f' },
    stripes: [
      { x: 0.18, w: 0.1, color: '#ff8a3d', edge: '#2a0a5c', lean: 0.12 },
      { x: -0.18, w: 0.1, color: '#ff8a3d', edge: '#2a0a5c', lean: 0.08 },
      { x: -0.52, w: 0.08, color: '#ff8a3d', edge: '#2a0a5c' },
    ],
    dorsal: { h: 34, spiky: 7, from: 0.35, to: -0.65 }, anal: { h: 20 }, teeth: true, angry: true, eye: 17,
  },
  // puffer is drawn by its own routine but keeps the spec for sizes/colours
  {
    key: 'fish_puffer', w: 200, h: 180, len: 120, top: 60, bot: 60, ped: 10, tailLen: 30, tailSpread: 24, tailFork: 0.2,
    colors: { top: '#c98a0c', mid: '#f7c63c', belly: '#fff7d6', fin: '#f0a81a', finTip: '#ffde6a', outline: '#3d2400', iris: '#1e1200' },
    spots: { color: '#8a5200', count: 22, size: 5 }, eye: 19,
  },
  {
    key: 'fish_clown', w: 240, h: 170, len: 142, top: 48, bot: 46, ped: 12, tailLen: 48, tailSpread: 38, tailFork: 0.25,
    colors: { top: '#c4144f', mid: '#ff4f8b', belly: '#ffd0e0', fin: '#ff3d7a', finTip: '#ffffff', outline: '#3d0016', iris: '#2a0010' },
    stripes: [
      { x: 0.36, w: 0.12, color: '#ffffff', edge: '#1a0008', lean: 0.12 },
      { x: -0.08, w: 0.14, color: '#ffffff', edge: '#1a0008' },
      { x: -0.55, w: 0.08, color: '#ffffff', edge: '#1a0008' },
    ],
    dorsal: { h: 30, spiky: 0, from: 0.25, to: -0.65 }, anal: { h: 20 }, teeth: true, angry: true, eye: 16,
  },
  {
    key: 'fish_angler', w: 250, h: 200, len: 140, top: 56, bot: 52, ped: 12, tailLen: 44, tailSpread: 34, tailFork: 0.15,
    colors: { top: '#1b2a6b', mid: '#3550b8', belly: '#9fb3ff', fin: '#2a3f99', finTip: '#47e6ff', outline: '#050b2a', iris: '#00e5ff' },
    spots: { color: '#7ff3ff', count: 16, size: 3, glow: true },
    dorsal: { h: 16, spiky: 4, from: 0.0, to: -0.6 }, anal: { h: 16 }, teeth: true, angry: true, eye: 15, lure: true,
  },
  {
    key: 'fish_king', w: 290, h: 220, len: 176, top: 62, bot: 56, ped: 14, tailLen: 62, tailSpread: 50, tailFork: 0.5,
    colors: { top: '#d43d00', mid: '#ff7a1a', belly: '#ffe0b0', fin: '#ff5a1a', finTip: '#ffe24a', outline: '#3a0f00', iris: '#2a0d00' },
    stripes: [
      { x: 0.3, w: 0.09, color: '#fff2d6', edge: '#4a1200', lean: 0.12 },
      { x: -0.05, w: 0.1, color: '#fff2d6', edge: '#4a1200', lean: 0.06 },
      { x: -0.42, w: 0.08, color: '#fff2d6', edge: '#4a1200' },
    ],
    dorsal: { h: 44, spiky: 8, from: 0.4, to: -0.6 }, anal: { h: 26 }, eye: 19, shine: true,
  },
];

function bodyPath(ctx: Ctx, a: number, top: number, bot: number, ped: number): void {
  ctx.beginPath();
  ctx.moveTo(a, 0);
  ctx.bezierCurveTo(a, -top * 0.64, a * 0.48, -top, 0, -top);
  ctx.bezierCurveTo(-a * 0.52, -top, -a * 0.86, -ped * 1.9, -a, -ped);
  ctx.lineTo(-a, ped);
  ctx.bezierCurveTo(-a * 0.86, ped * 1.9, -a * 0.52, bot, 0, bot);
  ctx.bezierCurveTo(a * 0.48, bot, a, bot * 0.64, a, 0);
  ctx.closePath();
}

function finRays(ctx: Ctx, ox: number, oy: number, pts: [number, number][], color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  for (const [x, y] of pts) {
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + (x - ox) * 0.92, oy + (y - oy) * 0.92);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTail(ctx: Ctx, s: FishArtSpec, a: number, ang: number): void {
  const tl = s.tailLen, ts = s.tailSpread, f = s.tailFork, p = s.ped;
  ctx.save();
  ctx.translate(-a + 5, 0);
  ctx.rotate(ang);
  ctx.beginPath();
  ctx.moveTo(4, -p * 1.1);
  ctx.quadraticCurveTo(-tl * 0.45, -p * 1.3, -tl, -ts);
  ctx.quadraticCurveTo(-tl * (1 - f * 0.4), -ts * 0.35, -tl * (1 - f), 0);
  ctx.quadraticCurveTo(-tl * (1 - f * 0.4), ts * 0.35, -tl, ts);
  ctx.quadraticCurveTo(-tl * 0.45, p * 1.3, 4, p * 1.1);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, -tl, 0);
  g.addColorStop(0, shade(s.colors.fin, -0.15));
  g.addColorStop(0.55, s.colors.fin);
  g.addColorStop(1, s.colors.finTip);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const rays: [number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    rays.push([-tl * (0.95 - Math.sin(t * Math.PI) * f * 0.5), -ts + t * ts * 2]);
  }
  finRays(ctx, 0, 0, rays, rgba('#000000', 0.22));
  ctx.restore();
  ctx.lineWidth = 3;
  ctx.strokeStyle = s.colors.outline;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

function drawDorsal(ctx: Ctx, s: FishArtSpec, a: number, wave: number): void {
  if (!s.dorsal) return;
  const d = s.dorsal;
  const x1 = a * (d.from ?? 0.3), x2 = a * (d.to ?? -0.6);
  const yb = -s.top * 0.75;
  ctx.beginPath();
  ctx.moveTo(x1, yb + 6);
  if (d.spiky) {
    const n = d.spiky;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = x1 + (x2 - x1) * t;
      const hh = d.h * (1 - Math.abs(t - 0.35) * 0.9) + wave * 3 * t;
      const ybase = -s.top * (0.95 - Math.pow(t, 2) * 0.55);
      ctx.lineTo(x - 4, ybase - hh);
      if (i < n) ctx.lineTo(x + (x2 - x1) / n * 0.55, ybase - hh * 0.45);
    }
  } else {
    ctx.quadraticCurveTo(x1 - (x1 - x2) * 0.1, -s.top - d.h * 1.1, (x1 + x2) / 2, -s.top - d.h + wave * 3);
    ctx.quadraticCurveTo(x2 + (x1 - x2) * 0.15, -s.top - d.h * 0.6, x2, -s.top * 0.4);
  }
  ctx.lineTo(x2, -s.top * 0.35);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, -s.top, 0, -s.top - d.h);
  g.addColorStop(0, shade(s.colors.fin, -0.2));
  g.addColorStop(1, s.colors.finTip);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = s.colors.outline;
  ctx.stroke();
}

function drawAnal(ctx: Ctx, s: FishArtSpec, a: number, wave: number): void {
  if (!s.anal) return;
  const h = s.anal.h;
  ctx.beginPath();
  ctx.moveTo(-a * 0.05, s.bot * 0.8);
  ctx.quadraticCurveTo(-a * 0.3, s.bot + h * 1.2, -a * 0.55 + wave * 2, s.bot * 0.75 + h);
  ctx.quadraticCurveTo(-a * 0.6, s.bot * 0.7, -a * 0.7, s.bot * 0.35);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, s.bot * 0.7, 0, s.bot + h);
  g.addColorStop(0, shade(s.colors.fin, -0.2));
  g.addColorStop(1, s.colors.finTip);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = s.colors.outline;
  ctx.stroke();
}

function drawStripes(ctx: Ctx, s: FishArtSpec, a: number): void {
  if (!s.stripes) return;
  const H = Math.max(s.top, s.bot) + 4;
  for (const st of s.stripes) {
    const cx = a * st.x, half = a * st.w * 0.9, lean = (st.lean ?? 0) * a;
    const band = (extra: number) => {
      ctx.beginPath();
      ctx.moveTo(cx - half - extra + lean, -H);
      ctx.bezierCurveTo(cx - half - extra - lean * 0.5, -H * 0.3, cx - half - extra - lean * 0.5, H * 0.3, cx - half - extra + lean * 0.3, H);
      ctx.lineTo(cx + half + extra + lean * 0.3, H);
      ctx.bezierCurveTo(cx + half + extra - lean * 0.5, H * 0.3, cx + half + extra - lean * 0.5, -H * 0.3, cx + half + extra + lean, -H);
      ctx.closePath();
    };
    if (st.edge) {
      band(3.5);
      ctx.fillStyle = st.edge;
      ctx.fill();
    }
    band(0);
    const g = ctx.createLinearGradient(0, -H, 0, H);
    g.addColorStop(0, shade(st.color, -0.12));
    g.addColorStop(0.5, st.color);
    g.addColorStop(1, shade(st.color, -0.2));
    ctx.fillStyle = g;
    ctx.fill();
  }
}

function drawSpots(ctx: Ctx, s: FishArtSpec, a: number, seed: number): void {
  if (!s.spots) return;
  let r = seed;
  const rand = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  for (let i = 0; i < s.spots.count; i++) {
    const x = (rand() * 1.5 - 0.85) * a;
    const y = (rand() * 1.3 - 0.85) * s.top * 0.8;
    const sz = s.spots.size * (0.6 + rand() * 0.8);
    if (s.spots.glow) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, sz * 3);
      g.addColorStop(0, rgba(s.spots.color.replace('#', '#'), 0.95));
      g.addColorStop(0.35, rgba(s.spots.color, 0.5));
      g.addColorStop(1, rgba(s.spots.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, sz * 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = rgba(s.spots.color.length === 7 ? s.spots.color : '#000000', 0.75);
      ctx.beginPath();
      ctx.ellipse(x, y, sz, sz * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawScales(ctx: Ctx, a: number, top: number, bot: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.055)';
  ctx.lineWidth = 1.1;
  const step = 9;
  for (let y = -top; y < bot; y += step * 0.8) {
    const off = (Math.round((y + top) / (step * 0.8)) % 2) * step * 0.5;
    for (let x = -a; x < a * 0.35; x += step) {
      ctx.beginPath();
      ctx.arc(x + off, y, step * 0.55, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawEye(ctx: Ctx, x: number, y: number, r: number, iris: string, angry: boolean, lid: string, outline: string): void {
  // socket shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.arc(x + 1, y + 2, r + 3, 0, Math.PI * 2);
  ctx.fill();
  // sclera
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.75, '#f1f4f8');
  g.addColorStop(1, '#b9c3cf');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  // iris looking forward
  const ix = x + r * 0.28, iy = y + r * 0.05, ir = r * 0.62;
  const ig = ctx.createRadialGradient(ix, iy, ir * 0.15, ix, iy, ir);
  ig.addColorStop(0, shade(iris.startsWith('#') ? iris : '#333333', 0.35));
  ig.addColorStop(0.7, iris);
  ig.addColorStop(1, shade(iris, -0.5));
  ctx.fillStyle = ig;
  ctx.beginPath();
  ctx.arc(ix, iy, ir, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#05070a';
  ctx.beginPath();
  ctx.arc(ix + ir * 0.12, iy, ir * 0.52, 0, Math.PI * 2);
  ctx.fill();
  // angry lid
  if (angry) {
    ctx.fillStyle = lid;
    ctx.beginPath();
    ctx.moveTo(x - r * 1.3, y - r * 1.4);
    ctx.lineTo(x + r * 1.4, y - r * 1.4);
    ctx.lineTo(x + r * 1.4, y - r * 0.05);
    ctx.lineTo(x - r * 1.3, y - r * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - r * 1.3, y - r * 0.75);
    ctx.lineTo(x + r * 1.4, y - r * 0.05);
    ctx.stroke();
  }
  ctx.restore();
  // specular
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.arc(x + r * 0.05, y - r * (angry ? 0.05 : 0.3), r * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + r * 0.45, y + r * 0.3, r * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = outline;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  if (angry) {
    // brow
    ctx.fillStyle = outline;
    ctx.beginPath();
    ctx.moveTo(x - r * 1.25, y - r * 1.05);
    ctx.lineTo(x + r * 1.35, y - r * 0.2);
    ctx.lineTo(x + r * 1.25, y + r * 0.12);
    ctx.lineTo(x - r * 1.2, y - r * 0.65);
    ctx.closePath();
    ctx.fill();
  }
}

/** Gaping toothy mouth. fx = front x, bx = back corner x. */
export function drawMouth(ctx: Ctx, fx: number, bx: number, uy: number, ly: number, teeth: number, outline: string, toothScale = 1): void {
  const my = (uy + ly) / 2 + (ly - uy) * 0.08;
  ctx.beginPath();
  ctx.moveTo(fx, uy);
  ctx.quadraticCurveTo(bx + (fx - bx) * 0.35, uy + (my - uy) * 0.15, bx, my);
  ctx.quadraticCurveTo(bx + (fx - bx) * 0.35, ly - (ly - my) * 0.1, fx - 2, ly);
  ctx.quadraticCurveTo(fx + 6, (uy + ly) / 2, fx, uy);
  ctx.closePath();
  const g = ctx.createRadialGradient(bx + (fx - bx) * 0.3, my, 2, bx + (fx - bx) * 0.3, my, Math.abs(fx - bx));
  g.addColorStop(0, '#2a0006');
  g.addColorStop(0.6, '#7a0d1c');
  g.addColorStop(1, '#c42a3a');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.save();
  ctx.clip();
  // tongue
  ctx.fillStyle = '#e0566a';
  ctx.beginPath();
  ctx.ellipse(bx + (fx - bx) * 0.45, ly - 2, (fx - bx) * 0.4, (ly - my) * 0.45, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // teeth
  const tooth = (x: number, y: number, dir: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x - size * 0.45, y);
    ctx.lineTo(x, y + dir * size * 1.35);
    ctx.lineTo(x + size * 0.45, y);
    ctx.closePath();
    const tg = ctx.createLinearGradient(x, y, x, y + dir * size * 1.3);
    tg.addColorStop(0, '#ffffff');
    tg.addColorStop(1, '#d8dde4');
    ctx.fillStyle = tg;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(40,20,20,0.7)';
    ctx.stroke();
  };
  const span = fx - bx;
  for (let i = 0; i < teeth; i++) {
    const t = (i + 0.5) / teeth;
    const x = fx - span * t * 0.9;
    const yU = uy + (my - uy) * Math.pow(t, 1.6) * 0.85;
    const yL = ly - (ly - my) * Math.pow(t, 1.6) * 0.85;
    const sz = (span / teeth) * 1.05 * toothScale * (1 - t * 0.35);
    tooth(x, yU, 1, sz);
    tooth(x + span / teeth * 0.5, yL, -1, sz * 0.9);
  }
  ctx.beginPath();
  ctx.moveTo(fx, uy);
  ctx.quadraticCurveTo(bx + (fx - bx) * 0.35, uy + (my - uy) * 0.15, bx, my);
  ctx.quadraticCurveTo(bx + (fx - bx) * 0.35, ly - (ly - my) * 0.1, fx - 2, ly);
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = outline;
  ctx.stroke();
}

function drawPectoral(ctx: Ctx, s: FishArtSpec, a: number, flap: number): void {
  const px = a * 0.12, py = s.bot * 0.3;
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(0.5 + flap * 0.35);
  const L = s.len * 0.2;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.quadraticCurveTo(-L * 0.6, -L * 0.45, -L, -2);
  ctx.quadraticCurveTo(-L * 0.6, L * 0.3, 0, 5);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, -L, 0);
  g.addColorStop(0, shade(s.colors.fin, -0.1));
  g.addColorStop(1, s.colors.finTip);
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = g;
  ctx.fill();
  ctx.globalAlpha = 1;
  finRays(ctx, 0, 0, [[-L, -6], [-L * 0.9, 0], [-L * 0.75, 6]], 'rgba(0,0,0,0.2)');
  ctx.lineWidth = 2;
  ctx.strokeStyle = s.colors.outline;
  ctx.stroke();
  ctx.restore();
}

function drawLure(ctx: Ctx, a: number, top: number, phase: number): void {
  const bx = a * 1.15 + Math.sin(phase) * 4, by = -top - 28 + Math.cos(phase) * 3;
  ctx.beginPath();
  ctx.moveTo(a * 0.2, -top * 0.9);
  ctx.quadraticCurveTo(a * 0.5, -top - 46, bx, by);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#0a1240';
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#3550b8';
  ctx.stroke();
  const g = ctx.createRadialGradient(bx, by, 0, bx, by, 26);
  g.addColorStop(0, 'rgba(255,255,220,1)');
  g.addColorStop(0.25, 'rgba(120,255,255,0.9)');
  g.addColorStop(0.6, 'rgba(0,200,255,0.25)');
  g.addColorStop(1, 'rgba(0,160,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(bx, by, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eaffff';
  ctx.beginPath();
  ctx.arc(bx, by, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0a1240';
  ctx.stroke();
}

function drawGenericFish(ctx: Ctx, s: FishArtSpec, frame: number, fw: number, fh: number): void {
  const phase = (frame / SWIM_FRAMES) * Math.PI * 2;
  const tailAng = Math.sin(phase) * 0.28;
  const a = s.len / 2;
  const cx = fw / 2 + s.tailLen * 0.42 - (s.lure ? 10 : 0);
  const cy = fh / 2 + (s.dorsal ? s.dorsal.h * 0.25 : 0) + (s.lure ? 14 : 0);
  ctx.translate(cx, cy);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // glow aura for premium fish
  if (s.shine) {
    const g = ctx.createRadialGradient(0, 0, a * 0.5, 0, 0, Math.min(a * 1.25, fh / 2 - 2));
    g.addColorStop(0, 'rgba(255,200,60,0.35)');
    g.addColorStop(1, 'rgba(255,160,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-fw, -fh, fw * 2, fh * 2);
  }

  drawTail(ctx, s, a, tailAng);
  drawDorsal(ctx, s, a, Math.sin(phase + 1));
  drawAnal(ctx, s, a, Math.sin(phase + 2));
  if (s.lure) drawLure(ctx, a, s.top, phase);

  // body base fill (vertical counter-shading)
  bodyPath(ctx, a, s.top, s.bot, s.ped);
  const bg = ctx.createLinearGradient(0, -s.top, 0, s.bot);
  bg.addColorStop(0, s.colors.top);
  bg.addColorStop(0.45, s.colors.mid);
  bg.addColorStop(0.72, s.colors.mid);
  bg.addColorStop(1, s.colors.belly);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.save();
  bodyPath(ctx, a, s.top, s.bot, s.ped);
  ctx.clip();
  // belly patch
  ctx.fillStyle = rgba('#ffffff', 0.0);
  const belly = ctx.createRadialGradient(a * 0.15, s.bot * 0.95, 2, a * 0.15, s.bot * 0.9, s.bot * 1.1);
  belly.addColorStop(0, s.colors.belly);
  belly.addColorStop(1, rgba('#ffffff', 0));
  ctx.fillStyle = belly;
  ctx.fillRect(-a, 0, a * 2, s.bot);
  drawSpots(ctx, s, a, s.key.length * 977);
  drawStripes(ctx, s, a);
  drawScales(ctx, a, s.top, s.bot);
  // volume shading
  const vs = ctx.createLinearGradient(0, -s.top, 0, s.bot);
  vs.addColorStop(0, 'rgba(255,255,255,0.0)');
  vs.addColorStop(0.6, 'rgba(0,0,0,0.0)');
  vs.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = vs;
  ctx.fillRect(-a - 5, -s.top - 5, a * 2 + 10, s.top + s.bot + 10);
  const back = ctx.createLinearGradient(-a, 0, a, 0);
  back.addColorStop(0, 'rgba(0,0,0,0.3)');
  back.addColorStop(0.35, 'rgba(0,0,0,0)');
  ctx.fillStyle = back;
  ctx.fillRect(-a - 5, -s.top - 5, a * 2 + 10, s.top + s.bot + 10);
  const hl = ctx.createRadialGradient(a * 0.15, -s.top * 0.55, 2, a * 0.15, -s.top * 0.5, a * 0.9);
  hl.addColorStop(0, 'rgba(255,255,255,0.55)');
  hl.addColorStop(0.35, 'rgba(255,255,255,0.15)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl;
  ctx.fillRect(-a - 5, -s.top - 5, a * 2 + 10, s.top + s.bot + 10);
  // gill
  ctx.strokeStyle = rgba('#000000', 0.3);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(a * 0.38, -s.top * 0.55);
  ctx.quadraticCurveTo(a * 0.2, s.bot * 0.05, a * 0.36, s.bot * 0.6);
  ctx.stroke();
  ctx.strokeStyle = rgba('#ffffff', 0.25);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(a * 0.42, -s.top * 0.5);
  ctx.quadraticCurveTo(a * 0.25, s.bot * 0.05, a * 0.4, s.bot * 0.55);
  ctx.stroke();
  ctx.restore();

  // rim + outline
  bodyPath(ctx, a, s.top, s.bot, s.ped);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = s.colors.outline;
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.rect(-a, -s.top - 2, a * 2, s.top * 0.6);
  ctx.clip();
  bodyPath(ctx, a * 0.97, s.top * 0.93, s.bot * 0.93, s.ped);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.stroke();
  ctx.restore();

  if (s.teeth) {
    drawMouth(ctx, a + 3, a * 0.5, -s.top * 0.02, s.bot * 0.62, 5, s.colors.outline);
  } else {
    // little smile with lips
    ctx.strokeStyle = s.colors.outline;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(a - 1, s.bot * 0.12);
    ctx.quadraticCurveTo(a * 0.86, s.bot * 0.3, a * 0.74, s.bot * 0.18);
    ctx.stroke();
    ctx.fillStyle = shade(s.colors.mid, 0.25);
    ctx.beginPath();
    ctx.ellipse(a - 1, s.bot * 0.12, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawPectoral(ctx, s, a, Math.sin(phase * 1 + 0.5));
  drawEye(ctx, a * 0.58, -s.top * 0.28, s.eye, s.colors.iris, !!s.angry, s.colors.top, s.colors.outline);
}

function drawPuffer(ctx: Ctx, s: FishArtSpec, frame: number, fw: number, fh: number): void {
  const phase = (frame / SWIM_FRAMES) * Math.PI * 2;
  const R = s.top;
  ctx.translate(fw / 2 + 8, fh / 2);
  ctx.lineJoin = 'round';
  // tail
  const tailS: FishArtSpec = { ...s, ped: 12 };
  drawTail(ctx, tailS, R * 0.92, Math.sin(phase) * 0.3);
  // spikes
  const spikes = 26;
  for (let i = 0; i < spikes; i++) {
    const ang = (i / spikes) * Math.PI * 2 + 0.05;
    if (Math.cos(ang) < -0.85) continue;
    const bx = Math.cos(ang) * R * 0.9, by = Math.sin(ang) * R * 0.9;
    const tx = Math.cos(ang) * (R + 15), ty = Math.sin(ang) * (R + 15);
    const nx = -Math.sin(ang) * 6, ny = Math.cos(ang) * 6;
    ctx.beginPath();
    ctx.moveTo(bx + nx, by + ny);
    ctx.lineTo(tx, ty);
    ctx.lineTo(bx - nx, by - ny);
    ctx.closePath();
    ctx.fillStyle = '#fff3c4';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = s.colors.outline;
    ctx.stroke();
  }
  // body
  const body = () => { ctx.beginPath(); ctx.ellipse(0, 0, R * 1.04, R * 0.98, 0, 0, Math.PI * 2); };
  body();
  const g = ctx.createLinearGradient(0, -R, 0, R);
  g.addColorStop(0, s.colors.top);
  g.addColorStop(0.45, s.colors.mid);
  g.addColorStop(0.7, s.colors.belly);
  g.addColorStop(1, '#f3e3b0');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.save();
  body();
  ctx.clip();
  let r = 1234;
  const rand = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  for (let i = 0; i < 26; i++) {
    const ang = rand() * Math.PI * 2, d = Math.sqrt(rand()) * R * 0.95;
    const x = Math.cos(ang) * d, y = Math.sin(ang) * d * 0.9 - R * 0.15;
    if (y > R * 0.25) continue;
    ctx.fillStyle = 'rgba(120,70,0,0.55)';
    ctx.beginPath();
    ctx.arc(x, y, 3 + rand() * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  // belly dots (pores)
  for (let i = 0; i < 18; i++) {
    const x = (rand() * 1.6 - 0.8) * R, y = R * (0.35 + rand() * 0.55);
    ctx.fillStyle = 'rgba(200,150,60,0.6)';
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  const hl = ctx.createRadialGradient(-R * 0.25, -R * 0.45, 2, -R * 0.2, -R * 0.4, R);
  hl.addColorStop(0, 'rgba(255,255,255,0.65)');
  hl.addColorStop(0.4, 'rgba(255,255,255,0.12)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl;
  ctx.fillRect(-R * 1.2, -R * 1.2, R * 2.4, R * 2.4);
  const sh = ctx.createRadialGradient(0, 0, R * 0.6, 0, 0, R * 1.05);
  sh.addColorStop(0, 'rgba(0,0,0,0)');
  sh.addColorStop(1, 'rgba(60,30,0,0.35)');
  ctx.fillStyle = sh;
  ctx.fillRect(-R * 1.2, -R * 1.2, R * 2.4, R * 2.4);
  ctx.restore();
  body();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = s.colors.outline;
  ctx.stroke();
  // pectoral fin flapping
  ctx.save();
  ctx.translate(-R * 0.05, R * 0.25);
  ctx.rotate(0.3 + Math.sin(phase * 2) * 0.35);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-22, -22, -34, -4);
  ctx.quadraticCurveTo(-24, 14, 0, 6);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,190,60,0.92)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = s.colors.outline;
  ctx.stroke();
  ctx.restore();
  // pursed lips
  ctx.fillStyle = '#ff9a7a';
  ctx.beginPath();
  ctx.ellipse(R * 1.02, R * 0.18, 8, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = s.colors.outline;
  ctx.stroke();
  ctx.fillStyle = '#5a1010';
  ctx.beginPath();
  ctx.ellipse(R * 1.04, R * 0.18, 3.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // two eyes (one peeking) for the cartoon puffer
  drawEye(ctx, R * 0.62, -R * 0.3, s.eye * 0.82, s.colors.iris, false, s.colors.top, s.colors.outline);
  drawEye(ctx, R * 0.25, -R * 0.36, s.eye, s.colors.iris, false, s.colors.top, s.colors.outline);
  // worried brows
  ctx.strokeStyle = s.colors.outline;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(R * 0.08, -R * 0.78);
  ctx.quadraticCurveTo(R * 0.25, -R * 0.9, R * 0.42, -R * 0.74);
  ctx.stroke();
}

export const SHARK_ART = { key: 'shark', w: 470, h: 250 };

function drawShark(ctx: Ctx, frame: number, fw: number, fh: number): void {
  const phase = (frame / SWIM_FRAMES) * Math.PI * 2;
  const a = 160, top = 62, bot = 58, ped = 13;
  const outline = '#031235';
  ctx.translate(fw / 2 + 40, fh / 2 + 18);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // tail (crescent)
  ctx.save();
  ctx.translate(-a + 6, -4);
  ctx.rotate(Math.sin(phase) * 0.22);
  ctx.beginPath();
  ctx.moveTo(6, -ped);
  ctx.quadraticCurveTo(-30, -30, -74, -92);
  ctx.quadraticCurveTo(-58, -20, -40, 0);
  ctx.quadraticCurveTo(-52, 22, -62, 52);
  ctx.quadraticCurveTo(-24, 24, 6, ped);
  ctx.closePath();
  const tg = ctx.createLinearGradient(0, -90, 0, 50);
  tg.addColorStop(0, '#0f3d9c');
  tg.addColorStop(1, '#2d7be6');
  ctx.fillStyle = tg;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = outline;
  ctx.stroke();
  ctx.restore();

  // far pectoral (behind body)
  ctx.save();
  ctx.translate(a * 0.18, bot * 0.55);
  ctx.rotate(0.7 + Math.sin(phase + 1) * 0.08);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-10, 40, -26, 64);
  ctx.quadraticCurveTo(-24, 20, -46, 2);
  ctx.closePath();
  ctx.fillStyle = '#123f99';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = outline;
  ctx.stroke();
  ctx.restore();

  // dorsal fin
  ctx.beginPath();
  ctx.moveTo(a * 0.15, -top * 0.85);
  ctx.quadraticCurveTo(-a * 0.05, -top - 40, -a * 0.25, -top - 66);
  ctx.quadraticCurveTo(-a * 0.25, -top - 20, -a * 0.45, -top * 0.8);
  ctx.closePath();
  const dg = ctx.createLinearGradient(0, -top - 60, 0, -top);
  dg.addColorStop(0, '#0d2f80');
  dg.addColorStop(1, '#2366d6');
  ctx.fillStyle = dg;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = outline;
  ctx.stroke();
  // small rear fins
  ctx.beginPath();
  ctx.moveTo(-a * 0.62, -top * 0.42);
  ctx.lineTo(-a * 0.76, -top * 0.78);
  ctx.lineTo(-a * 0.8, -top * 0.3);
  ctx.closePath();
  ctx.fillStyle = '#1a4fb8';
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-a * 0.5, bot * 0.55);
  ctx.lineTo(-a * 0.7, bot * 0.95);
  ctx.lineTo(-a * 0.74, bot * 0.3);
  ctx.closePath();
  ctx.fillStyle = '#7aa7e8';
  ctx.fill();
  ctx.stroke();

  const body = () => {
    ctx.beginPath();
    ctx.moveTo(a + 34, -6); // snout tip
    ctx.bezierCurveTo(a + 18, -top * 0.75, a * 0.45, -top, 0, -top);
    ctx.bezierCurveTo(-a * 0.5, -top * 0.95, -a * 0.88, -ped * 2, -a, -ped);
    ctx.lineTo(-a, ped);
    ctx.bezierCurveTo(-a * 0.85, ped * 2, -a * 0.45, bot, 0, bot);
    ctx.bezierCurveTo(a * 0.45, bot, a * 0.82, bot * 0.8, a + 6, bot * 0.42);
    ctx.quadraticCurveTo(a + 30, 10, a + 34, -6);
    ctx.closePath();
  };
  body();
  const bg = ctx.createLinearGradient(0, -top, 0, bot);
  bg.addColorStop(0, '#0c3a9e');
  bg.addColorStop(0.4, '#2a74e2');
  bg.addColorStop(0.55, '#4a95f2');
  bg.addColorStop(0.62, '#f2f7ff');
  bg.addColorStop(1, '#c9d8ec');
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.save();
  body();
  ctx.clip();
  // wavy counter-shade line
  ctx.beginPath();
  ctx.moveTo(a + 40, 2);
  for (let x = a + 40; x > -a - 10; x -= 14) {
    ctx.lineTo(x, 8 + Math.sin(x * 0.09) * 5 + (x < 0 ? x * 0.04 : 0));
  }
  ctx.lineTo(-a - 10, bot + 10);
  ctx.lineTo(a + 40, bot + 10);
  ctx.closePath();
  const wb = ctx.createLinearGradient(0, 0, 0, bot);
  wb.addColorStop(0, '#ffffff');
  wb.addColorStop(1, '#bdd0ea');
  ctx.fillStyle = wb;
  ctx.fill();
  // tiger stripes
  ctx.fillStyle = 'rgba(4,22,80,0.75)';
  const stripes = [0.45, 0.22, -0.02, -0.25, -0.46, -0.66];
  stripes.forEach((sx, i) => {
    const x = a * sx;
    const len = top * (0.75 - i * 0.05);
    ctx.beginPath();
    ctx.moveTo(x + 10, -top - 4);
    ctx.quadraticCurveTo(x - 4, -top + len * 0.5, x - 12, -top + len);
    ctx.quadraticCurveTo(x + 4, -top + len * 0.45, x + 26, -top - 4);
    ctx.closePath();
    ctx.fill();
  });
  // shading + highlight
  const hl = ctx.createRadialGradient(a * 0.3, -top * 0.6, 5, a * 0.3, -top * 0.6, a);
  hl.addColorStop(0, 'rgba(255,255,255,0.45)');
  hl.addColorStop(0.4, 'rgba(255,255,255,0.08)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl;
  ctx.fillRect(-a - 20, -top - 10, a * 2 + 80, top + bot + 20);
  const back = ctx.createLinearGradient(-a, 0, a, 0);
  back.addColorStop(0, 'rgba(0,10,40,0.35)');
  back.addColorStop(0.4, 'rgba(0,0,0,0)');
  ctx.fillStyle = back;
  ctx.fillRect(-a - 20, -top - 10, a * 2 + 80, top + bot + 20);
  // gills
  ctx.strokeStyle = 'rgba(3,18,53,0.7)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const gx = a * 0.42 - i * 11;
    ctx.beginPath();
    ctx.moveTo(gx, -top * 0.15);
    ctx.quadraticCurveTo(gx - 8, top * 0.15, gx - 2, bot * 0.42);
    ctx.stroke();
  }
  ctx.restore();
  body();
  ctx.lineWidth = 4;
  ctx.strokeStyle = outline;
  ctx.stroke();

  // gaping jaws
  drawMouth(ctx, a + 30, a * 0.52, 2, bot * 0.75, 7, outline, 1.15);

  // near pectoral fin
  ctx.save();
  ctx.translate(a * 0.3, bot * 0.5);
  ctx.rotate(0.55 + Math.sin(phase) * 0.1);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-8, 46, -30, 78);
  ctx.quadraticCurveTo(-26, 24, -56, 4);
  ctx.closePath();
  const pg = ctx.createLinearGradient(0, 0, -20, 70);
  pg.addColorStop(0, '#2a74e2');
  pg.addColorStop(1, '#0c3a9e');
  ctx.fillStyle = pg;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = outline;
  ctx.stroke();
  ctx.restore();

  // eye + nostril
  drawEye(ctx, a * 0.78, -top * 0.38, 15, '#ffcc00', true, '#0c3a9e', outline);
  ctx.fillStyle = outline;
  ctx.beginPath();
  ctx.ellipse(a + 18, -top * 0.28, 4, 2.2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // scars
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(a * 0.05, -top * 0.5);
  ctx.lineTo(a * 0.18, -top * 0.25);
  ctx.moveTo(a * 0.1, -top * 0.52);
  ctx.lineTo(a * 0.06, -top * 0.38);
  ctx.stroke();
}

export function buildFishTextures(scene: Phaser.Scene): void {
  for (const spec of FISH_ART) {
    canvasSheet(scene, spec.key, spec.w, spec.h, SWIM_FRAMES, (ctx, f, fw, fh) => {
      if (spec.key === 'fish_puffer') drawPuffer(ctx, spec, f, fw, fh);
      else drawGenericFish(ctx, spec, f, fw, fh);
    });
    scene.anims.create({
      key: `${spec.key}_swim`,
      frames: scene.anims.generateFrameNumbers(spec.key, { start: 0, end: SWIM_FRAMES - 1 }),
      frameRate: 10,
      repeat: -1,
    });
  }
  canvasSheet(scene, SHARK_ART.key, SHARK_ART.w, SHARK_ART.h, SWIM_FRAMES, (ctx, f, fw, fh) => drawShark(ctx, f, fw, fh));
  scene.anims.create({
    key: 'shark_swim',
    frames: scene.anims.generateFrameNumbers('shark', { start: 0, end: SWIM_FRAMES - 1 }),
    frameRate: 8,
    repeat: -1,
  });
}
