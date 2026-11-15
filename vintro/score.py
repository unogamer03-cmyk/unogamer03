"""Audio for the Vintro reveal + end card (film 17.5–30.0s, local 0–12.5s). 96 BPM, D minor. Usage: python3 score.py out.wav"""
import numpy as np, sys, wave
SR = 48000; DUR = 12.5; N = int(SR * DUR); BEAT = 60 / 96
L = np.zeros(N); R = np.zeros(N); rs = np.random.default_rng(4)
T = lambda d: np.arange(int(d * SR)) / SR
note = lambda n: 440 * 2 ** ((n - 69) / 12)
def place(sig, t, g=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if j <= i: return
    s = sig[: j - i] * g; L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.414; R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.414
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
def saw(f, t, det=(-0.08, 0, 0.08)):
    return sum(2 * ((f * 2 ** (d / 12) * t + rs.random()) % 1) - 1 for d in det) / len(det)
def pad(ns, d, lo=60, hi=2200, att=0.4, rel=0.8):
    t = T(d); s = sum(saw(note(n), t) for n in ns) / len(ns); s = band(s, lo, hi)
    return s * np.minimum(1, t / att) * np.minimum(1, np.maximum(0, d - t) / rel) * 0.45
def sub_boom(d=2.5):
    t = T(d); f = 34 + 70 * np.exp(-t * 7); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 1.8) + 0.35 * np.sin(2 * ph) * np.exp(-t * 3)      # + harmonic for phones
def metal(d=2.0, f0=420):
    t = T(d); parts = [(1, 1), (2.32, .6), (3.17, .45), (4.86, .3), (6.4, .2), (8.9, .12)]
    s = sum(a * np.sin(2 * np.pi * f0 * m * t + rs.random() * 6) * np.exp(-t * (2.2 + m * 0.9)) for m, a in parts)
    return s * 0.35 + band(rs.standard_normal(len(t)), 2500, 12000) * np.exp(-t * 40) * 0.4
def celesta(n, d=1.6):
    t = T(d); f = note(n); return (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 9)) * np.exp(-t * 3.2) * 0.22
def kick(g=1.0):
    t = T(0.4); f = 42 + 80 * np.exp(-t * 30); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) * g
def shimmer(d, lo=4000, hi=14000):
    t = T(d); return band(rs.standard_normal(len(t)), lo, hi) * np.sin(np.pi * t / d) ** 2 * 0.28
def riser(d):
    t = T(d); f = 180 * (16 ** (t / d)); ph = 2 * np.pi * np.cumsum(f) / SR
    return (0.18 * saw(f.mean() * 0 + 1, t) * 0 + 0.2 * np.sin(ph) + 0.5 * band(rs.standard_normal(len(t)), 1500, 13000)) * (t / d) ** 2.5
def rev_cymbal(d):
    t = T(d); return band(rs.standard_normal(len(t)), 5000, 16000) * (t / d) ** 4 * 0.6
def crackle(d):
    t = T(d); s = np.zeros(len(t)); idx = rs.integers(0, len(t), 900); s[idx] = rs.uniform(-1, 1, 900)
    return band(s, 2000, 14000) * 1.5 * np.minimum(1, t / 0.3)

# --- 0–2.5: convergence (film 17.5–20.0) ---
place(pad([50, 57, 62], 2.0, 60, 900, 0.05, 0.25), 0.0, 0.7)                  # tail of the score from 3C, drops out
place(crackle(2.4), 0.0, 0.45, -0.3); place(crackle(2.4), 0.05, 0.45, 0.3)
place(riser(2.45), 0.05, 1.1); place(rev_cymbal(1.2), 1.3, 1.0)
# --- 2.5: climax hit (film 20.0) ---
H = 2.5
place(sub_boom(), H, 1.25); place(metal(2.4, 210), H, 0.9, -0.15); place(metal(1.8, 640), H, 0.45, 0.2)
place(pad([38, 50, 57, 62, 65, 69, 74], 4.9, 50, 5200, 0.012, 1.4), H, 1.15)      # full Dm chord stab, decays under
place(shimmer(0.5, 7000, 16000), H, 0.6)
# --- 2.5–7.5: restrained theme ---
for i in range(8):
    b = H + i * BEAT
    if b < 7.4: place(kick(0.55 if i % 2 else 0.7), b, 0.8)
place(pad([46, 53, 58, 62], 2.6, 60, 1800, 0.6, 0.8), 5.0, 0.8)                  # Bb
for k, n in enumerate([74, 77, 81, 79, 74, 77, 81, 84]):                         # celesta motif
    place(celesta(n), H + 0.3 + k * BEAT, 0.9, (-1) ** k * 0.35)
# --- 7.5–12.5: sign-off ---
place(pad([50, 57, 62, 65], 5.0, 60, 1600, 0.5, 1.2), 7.5, 0.7)
place(shimmer(1.2), 8.0, 0.9, -0.4); place(shimmer(1.2, 2500, 9000), 8.15, 0.5, 0.4)  # light sweep 8.1–9.1
for k, n in enumerate([81, 86, 89, 93]): place(celesta(n, 1.0), 8.1 + k * 0.22, 0.45, -0.6 + k * 0.4)
place(celesta(74, 2.5), 8.7, 0.5)                                                 # slogan in
# signature logo sound (film 28.6): metallic strike + celesta + airy shimmer, ~1.5s
S0 = 11.1
place(metal(1.4, 560), S0, 0.7); place(celesta(81, 1.4), S0, 1.1); place(celesta(93, 1.4), S0 + 0.01, 0.35); place(shimmer(1.3, 6000, 15000), S0, 0.6)
place(pad([50, 57, 62, 69], 1.4, 60, 2400, 0.02, 1.0), S0, 0.7)
place(shimmer(0.25, 9000, 18000), 11.7, 0.5, 0.3)                                 # glint on the V

# reverb + master
irn = int(2.2 * SR); ir = rs.standard_normal(irn) * np.exp(-np.arange(irn) / SR * 2.6); ir[:240] *= np.linspace(0, 1, 240)
def verb(x):
    n = len(x) + irn; F = 1 << (n - 1).bit_length(); return np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:len(x)] * 0.014
tt = np.arange(N) / SR
st = np.stack([L + verb(L), R + verb(R)], 1)
st *= np.clip((12.4 - tt) / 1.0, 0, 1)[:, None] ** 1.6                          # tail ends by 12.4s
st = np.tanh(st / np.max(np.abs(st)) * 1.5); st *= 10 ** (-1 / 20) / np.max(np.abs(st))
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok')
