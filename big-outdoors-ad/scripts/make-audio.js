// Synthesises the 15s cinematic score + sound design into public/soundtrack.wav.
// No external samples: everything is generated procedurally so the repo stays license-clean.
// Cues are aligned to the scene timeline in src/theme.ts.
const fs = require('fs');
const path = require('path');

const SR = 44100;
const DUR = 15;
const N = SR * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);

const BPM = 120;
const BEAT = 60 / BPM;
let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const add = (t, v, pan = 0) => {
  const i = Math.floor(t * SR);
  if (i < 0 || i >= N) return;
  L[i] += v * (1 - Math.max(0, pan));
  R[i] += v * (1 + Math.min(0, pan));
};

// one-pole low-pass helper over a generator
const lp = (alpha) => {
  let y = 0;
  return (x) => (y += alpha * (x - y));
};

function kick(t0, gain = 1) {
  const len = 0.5;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const f = 45 + 110 * Math.exp(-t * 28);
    const ph = 2 * Math.PI * (45 * t + (110 / 28) * (1 - Math.exp(-t * 28)));
    const v = Math.sin(ph) * Math.exp(-t * 7) * gain * 0.9 + (i < 200 ? rnd() * 0.3 * gain : 0);
    add(t0 + t, v);
    void f;
  }
}

function hat(t0, gain = 0.25, open = false) {
  const len = open ? 0.25 : 0.05;
  let prev = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const n = rnd();
    const hp = n - prev; // crude high-pass
    prev = n;
    add(t0 + t, hp * Math.exp(-t * (open ? 18 : 80)) * gain, 0.3);
  }
}

function tick(t0, gain = 0.35) {
  // clock tick: short filtered click
  for (let i = 0; i < 0.03 * SR; i++) {
    const t = i / SR;
    add(t0 + t, Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t * 300) * gain, -0.2);
  }
}

function impact(t0, gain = 1) {
  const len = 2.2;
  const f = lp(0.05);
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const sub = Math.sin(2 * Math.PI * (38 + 40 * Math.exp(-t * 6)) * t) * Math.exp(-t * 2.2);
    const noise = f(rnd()) * 3 * Math.exp(-t * 4);
    const v = (sub * 0.9 + noise * 0.6) * gain;
    add(t0 + t, v, 0);
  }
}

function whoosh(t0, len = 0.7, gain = 0.5, pan = 0) {
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const env = Math.sin(Math.PI * (t / len)) ** 2;
    const a = 0.02 + 0.25 * (t / len);
    // swept low-pass noise
    const n = rnd();
    whoosh.y = (whoosh.y || 0) + a * (n - (whoosh.y || 0));
    add(t0 + t, whoosh.y * env * gain * 2.2, pan * (t / len - 0.5) * 2);
  }
}

function riser(t0, len, gain = 0.4) {
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const p = t / len;
    const f = 200 + 1400 * p * p;
    const v = (Math.sin(2 * Math.PI * f * t) * 0.3 + rnd() * 0.5 * p) * p * p * gain;
    add(t0 + t, v);
  }
}

function horn(t0, len = 0.9, gain = 0.32) {
  // classic air horn: two detuned sawtooth tones with a slight pitch sag
  const fl = lp(0.18);
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.03) * Math.min(1, (len - t) / 0.12);
    const sag = 1 - 0.02 * Math.min(1, t / 0.2);
    const saw = (f) => 2 * ((f * t * sag) % 1) - 1;
    const v = fl(saw(155) + saw(196) + 0.6 * saw(233));
    add(t0 + t, v * env * gain);
  }
}

function engine(t0, t1, gain = 0.22, rpmStart = 30, rpmEnd = 55) {
  const f = lp(0.03);
  let ph = 0;
  for (let i = Math.floor(t0 * SR); i < Math.floor(t1 * SR) && i < N; i++) {
    const t = i / SR;
    const p = (t - t0) / (t1 - t0);
    const env = Math.min(1, (t - t0) / 0.3) * Math.min(1, (t1 - t) / 0.3);
    const rpm = rpmStart + (rpmEnd - rpmStart) * p;
    ph += (2 * Math.PI * rpm) / SR;
    const v = (Math.sin(ph) + 0.5 * Math.sin(ph * 2) + 0.3 * Math.sign(Math.sin(ph * 0.5))) * 0.4 + f(rnd()) * 4;
    add(t, v * env * gain);
  }
}

function airBrake(t0, gain = 0.3) {
  let prev = 0;
  for (let i = 0; i < 0.6 * SR; i++) {
    const t = i / SR;
    const n = rnd();
    const hp = n - prev * 0.6;
    prev = n;
    add(t0 + t, hp * Math.exp(-t * 5) * gain, 0.2);
  }
}

// Pad: dark minor chords (D minor → Bb → F → C), slowly evolving
const CHORDS = [
  [73.42, 146.83, 174.61, 220.0],
  [58.27, 116.54, 146.83, 174.61],
  [87.31, 130.81, 174.61, 220.0],
  [65.41, 130.81, 164.81, 196.0],
];
function pad(t0, t1, gain = 0.06) {
  for (let i = Math.floor(t0 * SR); i < Math.floor(t1 * SR); i++) {
    const t = i / SR;
    const ci = Math.floor((t / (BEAT * 8)) % 4);
    const ch = CHORDS[ci];
    let v = 0;
    ch.forEach((f, k) => {
      v += Math.sin(2 * Math.PI * f * t + k) + 0.5 * Math.sin(2 * Math.PI * f * 1.003 * t);
    });
    const env = Math.min(1, (t - t0) / 1.0) * Math.min(1, (t1 - t) / 1.2);
    add(t, v * env * gain, Math.sin(t * 0.7) * 0.4);
  }
}

// Pulsing bass ostinato (8ths) once the truck is moving
function bass(t0, t1, gain = 0.25) {
  for (let t = t0; t < t1; t += BEAT / 2) {
    const ci = Math.floor((t / (BEAT * 8)) % 4);
    const f = CHORDS[ci][0];
    for (let i = 0; i < 0.22 * SR; i++) {
      const tt = i / SR;
      const v = Math.tanh(2.5 * Math.sin(2 * Math.PI * f * tt)) * Math.exp(-tt * 9);
      add(t + tt, v * gain);
    }
  }
}

// Brass-like stab for the logo hit
function stab(t0, gain = 0.18) {
  const notes = [146.83, 220.0, 293.66, 349.23, 440.0];
  const f = lp(0.12);
  for (let i = 0; i < 2.5 * SR; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.02) * Math.exp(-t * 1.3);
    let v = 0;
    notes.forEach((n) => (v += 2 * ((n * t) % 1) - 1));
    add(t0 + t, f(v) * env * gain);
  }
}

// ---------------- Timeline ----------------
// Scene 1 (0–3s): tension — clock ticks, pad, heartbeat kicks, riser into 3s
pad(0, 15, 0.05);
for (let t = 0; t < 3; t += BEAT) tick(t, t % 1 < 0.01 ? 0.45 : 0.3);
[0.5, 0.75, 1.5, 1.75, 2.5, 2.75].forEach((t) => kick(t, 0.45));
riser(2.0, 1.0, 0.35);

// Scene 2 (3–6s): impact, truck backs in, air brake, horn, engine pulling out
impact(3.0, 0.9);
whoosh(2.75, 0.5, 0.5, 1);
engine(3.0, 6.3, 0.18, 26, 34);
airBrake(4.0, 0.3);
horn(5.0, 0.8, 0.28);
engine(5.1, 6.2, 0.2, 34, 60);

// Groove from 3s to 11s
for (let t = 3; t < 11; t += BEAT) {
  kick(t, 0.8);
  hat(t + BEAT / 2, 0.18);
  if (Math.round((t - 3) / BEAT) % 2 === 1) hat(t, 0.22, true);
}
bass(3, 11, 0.22);

// Scene 3 (6–11s): map whoosh, route draw shimmer, highway rush
whoosh(5.75, 0.6, 0.55, -1);
for (let k = 0; k < 24; k++) {
  const t = 6.5 + k * 0.11;
  for (let i = 0; i < 0.08 * SR; i++) {
    const tt = i / SR;
    add(t + tt, Math.sin(2 * Math.PI * (1200 + k * 40) * tt) * Math.exp(-tt * 50) * 0.05, (k % 2) * 0.6 - 0.3);
  }
}
whoosh(9.1, 0.6, 0.6, 1);
engine(9.3, 11.2, 0.24, 55, 75);
riser(10.0, 1.0, 0.35);

// Scene 4 (11–15s): arrival brake, impact, logo stab, tail
impact(11.0, 0.8);
airBrake(11.8, 0.32);
whoosh(12.2, 0.6, 0.5, 0);
impact(12.45, 1.0);
stab(12.45, 0.16);
kick(13.45, 0.6);

// ---------------- Master ----------------
// gentle master low-pass to tame synthetic harshness + soft clip + fade
const mlL = lp(0.6);
const mlR = lp(0.6);
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh(mlL(L[i]) * 1.1);
  R[i] = Math.tanh(mlR(R[i]) * 1.1);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;
const fadeStart = (DUR - 0.6) * SR;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const g = i > fadeStart ? 1 - (i - fadeStart) / (N - fadeStart) : 1;
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm * g)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm * g)) * 32767), 46 + i * 4);
}
const out = path.join(__dirname, '..', 'public', 'soundtrack.wav');
fs.writeFileSync(out, buf);
console.log('wrote', out);
