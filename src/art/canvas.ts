import Phaser from 'phaser';

export type Ctx = CanvasRenderingContext2D;

/** Create a Phaser texture from a 2D canvas drawing function. */
export function canvasTexture(
  scene: Phaser.Scene,
  key: string,
  w: number,
  h: number,
  draw: (ctx: Ctx, w: number, h: number) => void,
): void {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, Math.ceil(w), Math.ceil(h));
  if (!tex) throw new Error(`Cannot create texture ${key}`);
  const ctx = tex.getContext();
  ctx.save();
  draw(ctx, w, h);
  ctx.restore();
  tex.refresh();
}

/** Spritesheet made of `frames` cells laid out horizontally; frames are named 0..n-1. */
export function canvasSheet(
  scene: Phaser.Scene,
  key: string,
  fw: number,
  fh: number,
  frames: number,
  draw: (ctx: Ctx, frame: number, fw: number, fh: number) => void,
): void {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, fw * frames, fh);
  if (!tex) throw new Error(`Cannot create sheet ${key}`);
  const ctx = tex.getContext();
  for (let i = 0; i < frames; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(i * fw, 0, fw, fh);
    ctx.clip();
    ctx.translate(i * fw, 0);
    draw(ctx, i, fw, fh);
    ctx.restore();
    tex.add(i, 0, i * fw, 0, fw, fh);
  }
  tex.refresh();
}

export function shade(hex: string, amt: number): string {
  // amt -1..1 : darken (<0) or lighten (>0)
  const n = parseInt(hex.replace('#', ''), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (amt < 0) {
    r = Math.round(r * (1 + amt)); g = Math.round(g * (1 + amt)); b = Math.round(b * (1 + amt));
  } else {
    r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt);
  }
  return `rgb(${r},${g},${b})`;
}

export function rgba(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Deterministic PRNG so generated art is stable between runs. */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
