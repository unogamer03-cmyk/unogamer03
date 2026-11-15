export const GAME_W = 1600;
export const GAME_H = 900;

export interface FishType {
  id: string;
  texture: string;
  name: string;
  points: number;
  hp: number;
  speed: [number, number];
  scale: number;
  weight: number;
  /** hit ellipse relative to frame center (unflipped, facing right) */
  hit: { x: number; y: number; rx: number; ry: number };
  school?: [number, number];
  minLevel: number;
  /** particle tint for death burst */
  color: number;
  dropsAmmo?: boolean;
}

export const FISH_TYPES: FishType[] = [
  { id: 'bumble', texture: 'fish_bumble', name: 'Bumble Tang', points: 80, hp: 1, speed: [120, 170], scale: 0.95, weight: 22, hit: { x: 10, y: 0, rx: 50, ry: 32 }, school: [3, 5], minLevel: 1, color: 0xffd23f },
  { id: 'bluestripe', texture: 'fish_bluestripe', name: 'Blue Racer', points: 100, hp: 1, speed: [150, 210], scale: 1, weight: 20, hit: { x: 14, y: 0, rx: 58, ry: 34 }, school: [2, 4], minLevel: 1, color: 0x3b8cff },
  { id: 'piranha', texture: 'fish_piranha', name: 'Green Biter', points: 120, hp: 2, speed: [110, 150], scale: 1, weight: 16, hit: { x: 14, y: 4, rx: 62, ry: 46 }, minLevel: 1, color: 0x52d147 },
  { id: 'fang', texture: 'fish_fang', name: 'Purple Fang', points: 150, hp: 2, speed: [100, 140], scale: 1, weight: 14, hit: { x: 14, y: 0, rx: 72, ry: 50 }, minLevel: 1, color: 0xa155ff },
  { id: 'puffer', texture: 'fish_puffer', name: 'Spike Puffer', points: 200, hp: 3, speed: [60, 90], scale: 0.95, weight: 11, hit: { x: 8, y: 0, rx: 66, ry: 62 }, minLevel: 1, color: 0xffc93c },
  { id: 'clown', texture: 'fish_clown', name: 'Rage Clown', points: 250, hp: 3, speed: [110, 150], scale: 1, weight: 9, hit: { x: 14, y: 0, rx: 72, ry: 48 }, minLevel: 1, color: 0xff4f8b },
  { id: 'angler', texture: 'fish_angler', name: 'Deep Lantern', points: 300, hp: 4, speed: [70, 100], scale: 1, weight: 6, hit: { x: 6, y: 10, rx: 70, ry: 54 }, minLevel: 1, color: 0x47e6ff, dropsAmmo: true },
  { id: 'king', texture: 'fish_king', name: 'Ember King', points: 500, hp: 5, speed: [80, 110], scale: 1, weight: 5, hit: { x: 16, y: 6, rx: 88, ry: 60 }, minLevel: 1, color: 0xff7a1a },
];

export const SHARK = {
  texture: 'shark',
  points: 1000,
  hp: 26,
  speed: 95,
  hit: { x: 40, y: 14, rx: 185, ry: 60 },
};

export const RULES = {
  targetPerLevel: 15,
  startAmmo: 40,
  levelAmmo: 40,
  fireInterval: 150,
  bulletSpeed: 1500,
  reloadCost: 100,
  reloadAmount: 15,
  startCoins: 150,
  ammoPackAmount: 10,
  comboWindow: 1600,
};

export type PowerId = 'power' | 'freeze' | 'lightning';

export const POWERS: Record<PowerId, { cooldown: number; label: string; key: string }> = {
  power: { cooldown: 16000, label: 'POWER', key: '1' },
  freeze: { cooldown: 20000, label: 'FREEZE', key: '2' },
  lightning: { cooldown: 14000, label: 'BOLT', key: '3' },
};

export const FONT_TITLE = '"Luckiest Guy", "Arial Black", sans-serif';
export const FONT_UI = '"Russo One", "Arial Black", sans-serif';
