"""Procedural, frame-synced score for the reel. 120 BPM, D minor. Usage: python3 score.py out.wav"""
import numpy as np, sys, wave
SR = 48000; DUR = 15.0; N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rs = np.random.default_rng(1)
def T(d): return np.arange(int(d * SR)) / SR
def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N or j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.414; R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.414
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
def note(n): return 440 * 2 ** ((n - 69) / 12)

# ---------- instruments ----------
def kick(g=1.0):
    t = T(0.45); f = 45 + 110 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 7) + 0.3 * band(rs.standard_normal(len(t)), 2000, 6000) * np.exp(-t * 120)) * g
def clap():
    t = T(0.3); n = band(rs.standard_normal(len(t)), 900, 5000)
    env = np.exp(-t * 18) + sum(np.exp(-np.maximum(0, t - d) * 90) * (t >= d) for d in (0, .012, .024)) * .6
    return n * env * 0.6
def hat(open_=False):
    t = T(0.25 if open_ else 0.06); return band(rs.standard_normal(len(t)), 7000, 16000) * np.exp(-t * (14 if open_ else 70)) * 0.35
def boom(g=1.0):
    t = T(2.2); f = 30 + 60 * np.exp(-t * 6); ph = 2 * np.pi * np.cumsum(f) / SR
    n = band(rs.standard_normal(len(t)), 40, 900) * np.exp(-t * 5)
    return (np.sin(ph) * np.exp(-t * 2.2) + n * 0.8 + band(rs.standard_normal(len(t)), 1500, 9000) * np.exp(-t * 30) * .5) * g
def boing(f0, d=0.28):
    t = T(d); f = f0 * (1 + 0.8 * np.exp(-t * 30)); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) + .3 * np.sin(2 * ph)) * np.exp(-t * 12) * 0.5
def whoosh(d, rev=False, lo=300, hi=6000):
    t = T(d); n = band(rs.standard_normal(len(t)), lo, hi)
    env = np.sin(np.pi * t / d) ** 2 if not rev else (t / d) ** 3
    return n * env * 0.5
def riser(d, f0=200, f1=2400):
    t = T(d); f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    return (0.25 * saw + 0.6 * band(rs.standard_normal(len(t)), 2000, 12000)) * (t / d) ** 2 * 0.5
def zip_(d):
    t = T(d); f = 300 * 12 ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-((t - d * .4) / (d * .5)) ** 2) * 0.35
def bell(fr, d=0.9):
    t = T(d); return sum(np.sin(2 * np.pi * fr * m * t) * a for m, a in ((1, 1), (2.76, .4), (5.4, .2))) * np.exp(-t * 6) * 0.22
def pad(notes, d, bright=2500):
    t = T(d); s = np.zeros(len(t))
    for n in notes:
        for det in (-0.12, 0, 0.12):
            ph = 2 * np.pi * note(n + det) * t + rs.random() * 6; s += 2 * ((ph / (2 * np.pi)) % 1) - 1
    s = band(s, 60, bright); a = np.minimum(1, t / 0.08) * np.minimum(1, (d - t) / 0.3)
    return s / (len(notes) * 3) * a * 0.5
def bass(n, d):
    t = T(d); ph = 2 * np.pi * note(n) * t
    s = np.tanh(2.5 * (np.sin(ph) + .5 * np.sin(2 * ph)))
    return s * np.minimum(1, t / 0.01) * np.exp(-t * 1.2) * 0.32
def glitch(d):
    t = T(d); s = np.sign(np.sin(2 * np.pi * 180 * t * (1 + 3 * (np.floor(t * 40) % 3)))) * 0.2
    return s * (np.floor(t * 60) % 2) 

# ---------- arrangement (all times = visual event times) ----------
# 01 squash & stretch
place(boing(520), 0.5, .9); place(boing(620), 1.0, .9)
place(zip_(0.5), 1.0, 1.0); place(whoosh(0.5, lo=200, hi=4000), 1.48, .9)
# drums 2.0 -> 13.0
for b in np.arange(2.0, 13.0, 0.5):
    if 9.5 <= b < 10.0: continue
    if 10.0 <= b < 11.5 and b not in (10.0, 11.0): continue
    place(kick(), b, .95)
for b in np.arange(2.5, 13.0, 1.0):
    if 9.5 <= b < 11.5: continue
    place(clap(), b, .7, .1)
for b in np.arange(4.0, 9.5, 0.25): place(hat((b * 4) % 2 == 1), b, .6 if (b * 2) % 1 else .35, .35)
for b in np.arange(11.5, 13.0, 0.125): place(hat(), b, .5, -.3)
# bass + pads (Dm  Bb  F  C | Dm | Gm-A | Dm)
prog_ = [(2.0, 38, [62, 65, 69]), (4.0, 34, [62, 65, 70]), (6.0, 41, [60, 65, 69]), (8.0, 36, [60, 64, 67]), (10.0, 38, [62, 65, 69, 72]), (11.5, 43, [62, 67, 70]), (12.25, 45, [61, 64, 69])]
for i, (t0, bn, ch) in enumerate(prog_):
    t1 = prog_[i + 1][0] if i + 1 < len(prog_) else 13.0
    for b in np.arange(t0, t1, 0.25): place(bass(bn + (12 if (b * 4) % 4 == 3 else 0), 0.24), b, .8)
    place(pad(ch, t1 - t0, 1800 if t0 != 10.0 else 3500), t0, .55)
# 02 type
place(boom(.5), 2.0, .6); place(kick(1.2), 2.97, 1); place(boom(.4), 2.97, .5)
place(whoosh(0.5, rev=True, lo=500, hi=9000), 3.5, 1.1)
# 03 grid
for i, t0 in enumerate((4.0, 4.5, 5.0, 5.25)): place(bell(note(74 + 5 * i)), t0, .9, (-1) ** i * .4)
place(riser(0.5, 150, 3000), 5.5, 1.1)
# 04 particles
place(boom(1.3), 6.0, 1)
for k in range(22): place(bell(note(86 + int(rs.integers(0, 10))), .4), 6.9 + k * 0.025, .25, rs.uniform(-.8, .8))
place(whoosh(0.5, lo=800, hi=10000), 7.55, .9)
# 05 tunnel
place(whoosh(2.0, lo=80, hi=1200), 8.0, .7); place(boom(.6), 8.0, .6)
place(riser(0.7, 120, 4000), 9.3, 1.2)
# 06 arabic
place(boom(1.0), 10.0, .8)
for i, n in enumerate((74, 77, 81, 86)): place(bell(note(n), 1.2), 10.3 + i * .12, .8, .5 - i * .3)
place(boing(700, .35), 10.85, .7)
# 07 cuts: accent each cut
for i, t0 in enumerate(np.arange(11.5, 13.0, 0.25)): place(kick(.6), t0, .5); place(hat(True), t0, .4, (-1) ** i * .6)
place(glitch(0.25), 12.0, .6); place(riser(0.5, 300, 6000), 12.5, 1)
# 08 end card
place(boom(1.4), 13.0, 1.1)
place(pad([50, 57, 62, 65, 69, 74], 2.0, 3000), 13.0, .9)
for t0, f in ((13.5, 560), (13.75, 640), (13.9, 720)): place(boing(f, .22), t0, .8)
place(bell(note(81), 1.5), 13.5, .5)

# sidechain duck everything except kicks — approximate by envelope on beat grid
duck = np.ones(N); tt = np.arange(N) / SR
for b in np.arange(2.0, 13.0, 0.5):
    m = tt >= b; duck[m] *= 1 - 0.45 * np.exp(-(tt[m] - b) * 9)
# reverb (FFT convolution)
irn = int(1.8 * SR); ir = rs.standard_normal(irn) * np.exp(-np.arange(irn) / SR * 3.2); ir[:200] *= np.linspace(0, 1, 200)
def verb(x):
    n = len(x) + irn; F = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:len(x)] * 0.012
L2 = L * (0.75 + 0.25 * duck) + verb(L); R2 = R * (0.75 + 0.25 * duck) + verb(R)
# master: fade tail, soft clip, normalize -1 dBFS
fade = np.clip((15.0 - tt) / 0.5, 0, 1) ** 1.5
st = np.stack([L2, R2], 1) * fade[:, None]
st = np.tanh(st / np.max(np.abs(st)) * 1.6); st *= 10 ** (-1 / 20) / np.max(np.abs(st))
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok', st.shape)
