import Phaser from 'phaser';
import { canvasSheet, canvasTexture, Ctx, roundRect } from './canvas';

/* ------------------------------- weapon ------------------------------- */

function metal(ctx: Ctx, y0: number, y1: number, base = 0): CanvasGradient {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  const l = (v: number) => Math.max(0, Math.min(255, v + base));
  g.addColorStop(0, `rgb(${l(150)},${l(165)},${l(185)})`);
  g.addColorStop(0.2, `rgb(${l(80)},${l(92)},${l(110)})`);
  g.addColorStop(0.55, `rgb(${l(38)},${l(44)},${l(56)})`);
  g.addColorStop(0.85, `rgb(${l(22)},${l(26)},${l(34)})`);
  g.addColorStop(1, `rgb(${l(60)},${l(70)},${l(86)})`);
  return g;
}

function armor(ctx: Ctx, y0: number, y1: number): CanvasGradient {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, '#ffe680');
  g.addColorStop(0.3, '#ffc61a');
  g.addColorStop(0.7, '#d99400');
  g.addColorStop(1, '#8a5a00');
  return g;
}

function bolt(ctx: Ctx, x: number, y: number, r = 3): void {
  const g = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, r);
  g.addColorStop(0, '#e8eef5');
  g.addColorStop(1, '#3a4250');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Gatling plasma cannon, pointing right. Pivot at (70, 60). */
function drawCannon(ctx: Ctx, w: number, h: number, spin: number): void {
  const cy = h / 2;
  ctx.lineJoin = 'round';
  const O = '#05080d';
  // barrels (3 visible, rotating offset)
  const offs = [-15, 0, 15].map((o, i) => o + Math.sin(spin + i * 2.1) * 2);
  offs.forEach((o, i) => {
    const y = cy + o;
    const bw = i === 1 ? 13 : 10;
    ctx.fillStyle = metal(ctx, y - bw / 2, y + bw / 2, i === 1 ? 20 : -10);
    roundRect(ctx, 150, y - bw / 2, 140, bw, 4);
    ctx.fill();
    ctx.strokeStyle = O;
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  // barrel clamps
  for (const x of [178, 232]) {
    ctx.fillStyle = metal(ctx, cy - 28, cy + 28, 10);
    roundRect(ctx, x, cy - 27, 16, 54, 4);
    ctx.fill();
    ctx.strokeStyle = O;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#ffc61a';
    ctx.fillRect(x + 3, cy - 24, 10, 4);
    ctx.fillRect(x + 3, cy + 20, 10, 4);
  }
  // muzzle
  ctx.fillStyle = metal(ctx, cy - 26, cy + 26, 30);
  roundRect(ctx, 284, cy - 25, 22, 50, 6);
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 3;
  ctx.stroke();
  const mg = ctx.createRadialGradient(306, cy, 2, 306, cy, 20);
  mg.addColorStop(0, 'rgba(255,240,170,1)');
  mg.addColorStop(0.4, 'rgba(255,150,30,0.7)');
  mg.addColorStop(1, 'rgba(255,90,0,0)');
  ctx.fillStyle = mg;
  ctx.beginPath();
  ctx.arc(304, cy, 20, 0, Math.PI * 2);
  ctx.fill();

  // main housing
  ctx.beginPath();
  ctx.moveTo(30, cy - 34);
  ctx.lineTo(150, cy - 40);
  ctx.lineTo(170, cy - 26);
  ctx.lineTo(170, cy + 26);
  ctx.lineTo(150, cy + 40);
  ctx.lineTo(30, cy + 36);
  ctx.quadraticCurveTo(10, cy, 30, cy - 34);
  ctx.closePath();
  ctx.fillStyle = metal(ctx, cy - 40, cy + 40);
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = O;
  ctx.stroke();
  // armour plate top
  ctx.beginPath();
  ctx.moveTo(52, cy - 36);
  ctx.lineTo(146, cy - 41);
  ctx.lineTo(160, cy - 28);
  ctx.lineTo(160, cy - 8);
  ctx.lineTo(70, cy - 6);
  ctx.lineTo(52, cy - 20);
  ctx.closePath();
  ctx.fillStyle = armor(ctx, cy - 40, cy - 6);
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 3;
  ctx.stroke();
  // hazard stripes on plate
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(20,16,8,0.85)';
  for (let x = 100; x < 170; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, cy - 44);
    ctx.lineTo(x + 8, cy - 44);
    ctx.lineTo(x - 8, cy);
    ctx.lineTo(x - 16, cy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // armour plate bottom
  ctx.beginPath();
  ctx.moveTo(52, cy + 22);
  ctx.lineTo(70, cy + 8);
  ctx.lineTo(160, cy + 10);
  ctx.lineTo(160, cy + 28);
  ctx.lineTo(146, cy + 41);
  ctx.lineTo(52, cy + 36);
  ctx.closePath();
  ctx.fillStyle = armor(ctx, cy + 8, cy + 40);
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.stroke();
  // energy cell
  const eg = ctx.createLinearGradient(0, cy - 6, 0, cy + 6);
  eg.addColorStop(0, '#d8ffff');
  eg.addColorStop(0.5, '#29e3ff');
  eg.addColorStop(1, '#0077b3');
  ctx.fillStyle = eg;
  roundRect(ctx, 66, cy - 5, 90, 12, 5);
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = 'rgba(0,40,70,0.6)';
    ctx.fillRect(74 + i * 13, cy - 4, 2, 10);
  }
  // scope
  ctx.fillStyle = metal(ctx, cy - 54, cy - 38, 15);
  roundRect(ctx, 86, cy - 54, 56, 14, 5);
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  const lens = ctx.createRadialGradient(142, cy - 47, 1, 142, cy - 47, 7);
  lens.addColorStop(0, '#ffb0b0');
  lens.addColorStop(1, '#c4001a');
  ctx.fillStyle = lens;
  ctx.beginPath();
  ctx.arc(142, cy - 47, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // vents + bolts
  ctx.fillStyle = '#0b0f16';
  for (let i = 0; i < 4; i++) roundRect(ctx, 34 + i * 7, cy - 14, 4, 28, 2), ctx.fill();
  [[60, cy - 28], [140, cy - 33], [60, cy + 29], [140, cy + 33]].forEach(([x, y]) => bolt(ctx, x, y, 3));
  // rear grip ring
  ctx.fillStyle = metal(ctx, cy - 30, cy + 30, -10);
  ctx.beginPath();
  ctx.arc(34, cy, 28, Math.PI * 0.5, Math.PI * 1.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#ffc61a';
  ctx.beginPath();
  ctx.arc(34, cy, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawTurretBase(ctx: Ctx, w: number, h: number): void {
  const cx = w / 2, by = h;
  const O = '#05080d';
  // outer glow ring
  const gl = ctx.createRadialGradient(cx, by, 60, cx, by, w / 2);
  gl.addColorStop(0, 'rgba(0,220,255,0.0)');
  gl.addColorStop(0.75, 'rgba(0,220,255,0.35)');
  gl.addColorStop(1, 'rgba(0,220,255,0)');
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, w, h);
  // skirt
  ctx.beginPath();
  ctx.moveTo(cx - 140, by);
  ctx.lineTo(cx - 118, by - 46);
  ctx.lineTo(cx + 118, by - 46);
  ctx.lineTo(cx + 140, by);
  ctx.closePath();
  ctx.fillStyle = metal(ctx, by - 46, by, -10);
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#ffc61a';
  for (let x = cx - 150; x < cx + 150; x += 26) {
    ctx.beginPath();
    ctx.moveTo(x, by);
    ctx.lineTo(x + 13, by);
    ctx.lineTo(x + 26, by - 14);
    ctx.lineTo(x + 13, by - 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // dome
  ctx.beginPath();
  ctx.ellipse(cx, by - 40, 96, 74, 0, Math.PI, 0);
  ctx.closePath();
  const dg = ctx.createRadialGradient(cx - 30, by - 100, 5, cx, by - 40, 110);
  dg.addColorStop(0, '#9aa8bb');
  dg.addColorStop(0.35, '#4a5568');
  dg.addColorStop(1, '#141922');
  ctx.fillStyle = dg;
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 3.5;
  ctx.stroke();
  // panel seams
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.lineWidth = 2;
  for (const a of [-0.6, 0, 0.6]) {
    ctx.beginPath();
    ctx.moveTo(cx, by - 40);
    ctx.lineTo(cx + Math.sin(a) * 96, by - 40 - Math.cos(a) * 74);
    ctx.stroke();
  }
  // glowing ring
  ctx.beginPath();
  ctx.ellipse(cx, by - 40, 70, 54, 0, Math.PI, 0);
  ctx.strokeStyle = '#2ee6ff';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#2ee6ff';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;
  // hub
  const hg = ctx.createRadialGradient(cx - 8, by - 70, 2, cx, by - 60, 34);
  hg.addColorStop(0, '#ffffff');
  hg.addColorStop(0.3, '#c9d2de');
  hg.addColorStop(1, '#3a4250');
  ctx.fillStyle = hg;
  ctx.beginPath();
  ctx.arc(cx, by - 58, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = O;
  ctx.lineWidth = 3;
  ctx.stroke();
}

/* ------------------------------- fx ------------------------------- */

function glow(ctx: Ctx, w: number, h: number, stops: [number, string][]): void {
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) / 2);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function starburst(ctx: Ctx, w: number, h: number, points: number, inner: number, colors: [string, string, string]): void {
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2;
  glow(ctx, w, h, [[0, colors[0]], [0.3, colors[1]], [1, 'rgba(0,0,0,0)']]);
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? R * (0.75 + ((i * 37) % 10) / 40) : R * inner;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.25, colors[1]);
  g.addColorStop(1, colors[2]);
  ctx.fillStyle = g;
  ctx.fill();
}

function snowflake(ctx: Ctx, cx: number, cy: number, r: number, color: string, lw: number): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const ex = cx + Math.cos(a) * r, ey = cy + Math.sin(a) * r;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    for (const k of [0.45, 0.72]) {
      const bx = cx + Math.cos(a) * r * k, by = cy + Math.sin(a) * r * k;
      for (const s of [-1, 1]) {
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(a + s * 0.8) * r * 0.28, by + Math.sin(a + s * 0.8) * r * 0.28);
      }
    }
    ctx.stroke();
  }
}

function lightningIcon(ctx: Ctx, w: number, h: number, fill: string | CanvasGradient): void {
  ctx.beginPath();
  ctx.moveTo(w * 0.58, h * 0.06);
  ctx.lineTo(w * 0.22, h * 0.56);
  ctx.lineTo(w * 0.46, h * 0.56);
  ctx.lineTo(w * 0.36, h * 0.94);
  ctx.lineTo(w * 0.8, h * 0.4);
  ctx.lineTo(w * 0.54, h * 0.4);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1a0636';
  ctx.stroke();
}

function crosshair(ctx: Ctx, w: number, h: number, color: string): void {
  const cx = w / 2, cy = h / 2, r = w * 0.36;
  ctx.lineCap = 'round';
  const ring = (lw: number, c: string) => {
    ctx.strokeStyle = c;
    ctx.lineWidth = lw;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, i * Math.PI / 2 + 0.22, (i + 1) * Math.PI / 2 - 0.22);
      ctx.stroke();
    }
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.moveTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5);
      ctx.lineTo(cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r * 1.3);
    }
    ctx.stroke();
  };
  ring(9, 'rgba(0,0,0,0.55)');
  ring(4.5, color);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
  ctx.stroke();
}

function coin(ctx: Ctx, w: number, h: number, sx: number): void {
  const cx = w / 2, cy = h / 2, r = w / 2 - 3;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(Math.max(0.08, Math.abs(sx)), 1);
  // edge
  ctx.fillStyle = '#9a5c00';
  ctx.beginPath();
  ctx.arc(0, 1.5, r, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, 1, 0, 0, r);
  g.addColorStop(0, '#fff6b0');
  g.addColorStop(0.45, '#ffcf2e');
  g.addColorStop(1, '#d48a00');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7a4500';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(160,90,0,0.8)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.74, 0, Math.PI * 2);
  ctx.stroke();
  // star
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r * 0.55 : r * 0.23;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = '#e09400';
  ctx.fill();
  ctx.strokeStyle = '#8a5000';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

/* ---------------------------- HUD panels ---------------------------- */

export function drawPanel(ctx: Ctx, w: number, h: number, accent: string, cut = 14): void {
  const path = (inset: number) => {
    const c = cut - inset * 0.4;
    ctx.beginPath();
    ctx.moveTo(inset + c, inset);
    ctx.lineTo(w - inset, inset);
    ctx.lineTo(w - inset, h - inset - c);
    ctx.lineTo(w - inset - c, h - inset);
    ctx.lineTo(inset, h - inset);
    ctx.lineTo(inset, inset + c);
    ctx.closePath();
  };
  // outer shadow + bright frame
  path(2);
  const fg = ctx.createLinearGradient(0, 0, w, h);
  fg.addColorStop(0, '#6fd6ff');
  fg.addColorStop(0.5, '#1c5fae');
  fg.addColorStop(1, accent);
  ctx.fillStyle = fg;
  ctx.fill();
  path(5);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#16305a');
  bg.addColorStop(0.5, '#0b1a36');
  bg.addColorStop(1, '#050d1f');
  ctx.fillStyle = bg;
  ctx.fill();
  // glossy top
  ctx.save();
  path(5);
  ctx.clip();
  const gl = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  gl.addColorStop(0, 'rgba(255,255,255,0.16)');
  gl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, w, h * 0.5);
  ctx.restore();
  path(7);
  ctx.strokeStyle = 'rgba(120,200,255,0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // accent notch
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(w - 5, h * 0.25);
  ctx.lineTo(w - 1, h * 0.25 + 4);
  ctx.lineTo(w - 1, h * 0.75 - 4);
  ctx.lineTo(w - 5, h * 0.75);
  ctx.closePath();
  ctx.fill();
}

/** Ragged brush-stroke splash used behind the logo and callouts. */
export function drawSplash(ctx: Ctx, w: number, h: number, color: string, seed = 3): void {
  let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  ctx.fillStyle = color;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    const n = 60;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = w * 0.04 + t * w * 0.92;
      const y = h * 0.12 + r() * h * 0.08 + k * 3;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    for (let i = n; i >= 0; i--) {
      const t = i / n;
      const x = w * 0.04 + t * w * 0.92 + (r() - 0.5) * 30;
      const y = h * 0.88 - r() * h * 0.08 - k * 3;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
  // flying shards
  for (let i = 0; i < 40; i++) {
    const side = r() < 0.5 ? 0 : 1;
    const x = side ? w * (0.9 + r() * 0.1) : w * r() * 0.1;
    const y = h * (0.15 + r() * 0.7);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (side ? 1 : -1) * (10 + r() * 30), y + (r() - 0.5) * 6);
    ctx.lineTo(x, y + 3 + r() * 5);
    ctx.closePath();
    ctx.fill();
  }
}

/* ------------------------------ builder ------------------------------ */

export function buildFxTextures(scene: Phaser.Scene): void {
  canvasSheet(scene, 'cannon', 320, 120, 3, (ctx, f, w, h) => drawCannon(ctx, w, h, f * 2.1));
  canvasTexture(scene, 'turret', 300, 150, drawTurretBase);

  canvasTexture(scene, 'bullet', 70, 22, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(255,120,0,0)');
    g.addColorStop(0.6, 'rgba(255,170,30,0.8)');
    g.addColorStop(1, 'rgba(255,240,180,1)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(w * 0.55, h / 2, w * 0.45, h * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(w * 0.78, h / 2, w * 0.18, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  canvasTexture(scene, 'bullet_power', 110, 44, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(255,0,80,0)');
    g.addColorStop(0.5, 'rgba(255,40,90,0.85)');
    g.addColorStop(1, 'rgba(255,220,240,1)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(w * 0.55, h / 2, w * 0.45, h * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();
    const c = ctx.createRadialGradient(w * 0.78, h / 2, 0, w * 0.78, h / 2, h * 0.45);
    c.addColorStop(0, '#ffffff');
    c.addColorStop(0.4, '#ffd0e8');
    c.addColorStop(1, 'rgba(255,60,140,0)');
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(w * 0.78, h / 2, h * 0.45, 0, Math.PI * 2);
    ctx.fill();
  });
  canvasTexture(scene, 'flash', 140, 140, (ctx, w, h) => starburst(ctx, w, h, 9, 0.28, ['rgba(255,255,220,1)', 'rgba(255,200,60,0.9)', 'rgba(255,90,0,0)']));
  canvasTexture(scene, 'boom', 200, 200, (ctx, w, h) => starburst(ctx, w, h, 14, 0.42, ['rgba(255,255,230,1)', 'rgba(255,170,40,0.9)', 'rgba(255,60,0,0)']));
  canvasTexture(scene, 'glow', 64, 64, (ctx, w, h) => glow(ctx, w, h, [[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(255,255,255,0.7)'], [1, 'rgba(255,255,255,0)']]));
  canvasTexture(scene, 'spark', 24, 24, (ctx, w, h) => glow(ctx, w, h, [[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,0.8)'], [1, 'rgba(255,255,255,0)']]));
  canvasTexture(scene, 'shard', 18, 8, (ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w * 0.6, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w * 0.6, h);
    ctx.closePath();
    ctx.fill();
  });
  canvasTexture(scene, 'ring', 160, 160, (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 12, 0, Math.PI * 2);
    ctx.stroke();
  });
  canvasTexture(scene, 'bubble', 40, 40, (ctx, w, h) => {
    const cx = w / 2, cy = h / 2, r = w / 2 - 2;
    const g = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r);
    g.addColorStop(0, 'rgba(180,240,255,0.05)');
    g.addColorStop(1, 'rgba(200,245,255,0.55)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(230,250,255,0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - r * 0.4, r * 0.22, r * 0.13, -0.6, 0, Math.PI * 2);
    ctx.fill();
  });
  canvasTexture(scene, 'crosshair', 120, 120, (ctx, w, h) => crosshair(ctx, w, h, '#ff2a2a'));
  canvasTexture(scene, 'lockon', 160, 160, (ctx, w, h) => crosshair(ctx, w, h, '#ffffff'));
  canvasSheet(scene, 'coin', 44, 44, 8, (ctx, f, w, h) => coin(ctx, w, h, Math.cos((f / 8) * Math.PI)));
  scene.anims.create({ key: 'coin_spin', frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }), frameRate: 16, repeat: -1 });
  canvasTexture(scene, 'snow', 64, 64, (ctx, w, h) => snowflake(ctx, w / 2, h / 2, w * 0.42, '#e8fbff', 4));
  canvasTexture(scene, 'ammo_pack', 64, 52, (ctx, w, h) => {
    ctx.fillStyle = '#2d4a1e';
    roundRect(ctx, 4, 10, w - 8, h - 14, 6);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 10, 0, h);
    g.addColorStop(0, '#7fae4a');
    g.addColorStop(1, '#2f4f18');
    ctx.fillStyle = g;
    roundRect(ctx, 6, 12, w - 12, h - 18, 5);
    ctx.fill();
    ctx.strokeStyle = '#0f1a06';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffc61a';
    ctx.fillRect(10, 22, w - 20, 12);
    ctx.fillStyle = '#1a1206';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AMMO', w / 2, 32);
    for (let i = 0; i < 4; i++) bullIcon(ctx, 12 + i * 11, 0, 9, 18);
  });

  // icons (96x96)
  const S = 96;
  canvasTexture(scene, 'icon_target', S, S, (ctx, w, h) => crosshair(ctx, w, h, '#ff3b3b'));
  canvasTexture(scene, 'icon_bullet', S, S, (ctx) => bullIcon(ctx, 30, 6, 36, 84));
  canvasTexture(scene, 'icon_trophy', S, S, (ctx) => trophy(ctx, S));
  canvasTexture(scene, 'icon_coins', S, S, (ctx) => {
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(14 + (i % 2) * 6, 50 - i * 11);
      ctx.scale(1, 0.45);
      coin(ctx, 60, 60, 1);
      ctx.restore();
    }
    ctx.save();
    ctx.translate(46, 30);
    coin(ctx, 46, 46, 1);
    ctx.restore();
  });
  canvasTexture(scene, 'icon_freeze', S, S, (ctx, w, h) => {
    glow(ctx, w, h, [[0, 'rgba(120,230,255,0.9)'], [0.6, 'rgba(40,140,255,0.3)'], [1, 'rgba(0,0,0,0)']]);
    snowflake(ctx, w / 2, h / 2, w * 0.36, '#063a7a', 9);
    snowflake(ctx, w / 2, h / 2, w * 0.36, '#ffffff', 4.5);
  });
  canvasTexture(scene, 'icon_lightning', S, S, (ctx, w, h) => {
    glow(ctx, w, h, [[0, 'rgba(230,180,255,0.9)'], [0.6, 'rgba(150,60,255,0.35)'], [1, 'rgba(0,0,0,0)']]);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.5, '#f0d4ff');
    g.addColorStop(1, '#b45cff');
    lightningIcon(ctx, w, h, g);
  });
  canvasTexture(scene, 'icon_power', S, S, (ctx, w, h) => {
    starburst(ctx, w, h, 10, 0.35, ['rgba(255,255,200,1)', 'rgba(255,120,40,0.95)', 'rgba(220,20,20,0.15)']);
  });
  canvasTexture(scene, 'icon_skull', S, S, (ctx) => skull(ctx, S));
  canvasTexture(scene, 'icon_sound', 64, 64, (ctx) => speaker(ctx, true));
  canvasTexture(scene, 'icon_mute', 64, 64, (ctx) => speaker(ctx, false));
  canvasTexture(scene, 'icon_pause', 64, 64, (ctx) => {
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 18, 14, 10, 36, 3);
    ctx.fill();
    roundRect(ctx, 36, 14, 10, 36, 3);
    ctx.fill();
  });
}

function bullIcon(ctx: Ctx, x: number, y: number, w: number, h: number): void {
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, '#a86a00');
  g.addColorStop(0.35, '#ffe27a');
  g.addColorStop(1, '#b07400');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + h * 0.4);
  ctx.quadraticCurveTo(x, y, x + w / 2, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + h * 0.4);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3d2400';
  ctx.lineWidth = Math.max(1.5, w * 0.08);
  ctx.stroke();
  ctx.fillStyle = '#7a4a00';
  ctx.fillRect(x, y + h * 0.72, w, h * 0.08);
}

function trophy(ctx: Ctx, S: number): void {
  const g = ctx.createLinearGradient(0, 0, S, 0);
  g.addColorStop(0, '#b87800');
  g.addColorStop(0.35, '#ffe680');
  g.addColorStop(0.6, '#ffc61a');
  g.addColorStop(1, '#a86400');
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#d99400';
  ctx.beginPath();
  ctx.arc(22, 30, 12, Math.PI * 0.5, Math.PI * 1.5);
  ctx.moveTo(74, 18);
  ctx.arc(74, 30, 12, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(22, 12);
  ctx.lineTo(74, 12);
  ctx.quadraticCurveTo(74, 56, 48, 60);
  ctx.quadraticCurveTo(22, 56, 22, 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5a3500';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = g;
  ctx.fillRect(42, 58, 12, 14);
  roundRect(ctx, 28, 72, 40, 14, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillRect(32, 18, 5, 26);
}

function skull(ctx: Ctx, S: number): void {
  const cx = S / 2;
  ctx.fillStyle = '#f2f2f2';
  ctx.beginPath();
  ctx.arc(cx, 40, 30, Math.PI, 0);
  ctx.lineTo(cx + 30, 52);
  ctx.quadraticCurveTo(cx + 22, 62, cx + 20, 72);
  ctx.lineTo(cx - 20, 72);
  ctx.quadraticCurveTo(cx - 22, 62, cx - 30, 52);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.fillStyle = '#1a0000';
  ctx.beginPath();
  ctx.ellipse(cx - 12, 46, 9, 10, 0.2, 0, Math.PI * 2);
  ctx.ellipse(cx + 12, 46, 9, 10, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff2020';
  ctx.beginPath();
  ctx.arc(cx - 12, 47, 3.5, 0, Math.PI * 2);
  ctx.arc(cx + 12, 47, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0000';
  ctx.beginPath();
  ctx.moveTo(cx, 56);
  ctx.lineTo(cx - 4, 63);
  ctx.lineTo(cx + 4, 63);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * 7, 66);
    ctx.lineTo(cx + i * 7, 74);
    ctx.stroke();
  }
  // crossbones
  ctx.strokeStyle = '#f2f2f2';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 30, 76);
  ctx.lineTo(cx + 30, 90);
  ctx.moveTo(cx + 30, 76);
  ctx.lineTo(cx - 30, 90);
  ctx.stroke();
}

function speaker(ctx: Ctx, on: boolean): void {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(12, 24);
  ctx.lineTo(22, 24);
  ctx.lineTo(34, 13);
  ctx.lineTo(34, 51);
  ctx.lineTo(22, 40);
  ctx.lineTo(12, 40);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  if (on) {
    ctx.beginPath();
    ctx.arc(34, 32, 10, -0.8, 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(34, 32, 18, -0.8, 0.8);
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#ff4a4a';
    ctx.beginPath();
    ctx.moveTo(42, 24);
    ctx.lineTo(56, 40);
    ctx.moveTo(56, 24);
    ctx.lineTo(42, 40);
    ctx.stroke();
  }
}
