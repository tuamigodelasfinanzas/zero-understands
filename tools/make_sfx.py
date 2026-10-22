# Synthesized ambiences and foley for "Zero Understands" (no samples, no licences). Usage: python3 tools/make_sfx.py assets/sfx
import numpy as np, wave, sys
SR = 48000
out = sys.argv[1]
rng = np.random.default_rng(7)
def save(name, x):
    x = x / max(1e-6, np.abs(x).max()) * 0.8
    with wave.open(f'{out}/{name}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def lp(x, a):  # one-pole low-pass, a in 0..1 (smaller = darker)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def lpf(x, a):  # fast vectorised version via scipy-free IIR approximation (repeated moving average)
    k = max(1, int(1 / a))
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(k - 1)])
def fade(x, a=0.3, b=0.6):
    n = len(x); e = np.ones(n); ia, ib = int(a * SR), int(b * SR)
    e[:ia] = np.linspace(0, 1, ia); e[-ib:] = np.linspace(1, 0, ib); return x * e
t = lambda d: np.arange(int(d * SR)) / SR
# rain: filtered noise + random droplet ticks
d = 14; n = rng.standard_normal(int(d * SR)); r = lpf(n, 1 / 6) - lpf(n, 1 / 60) * 0.8
ticks = np.zeros_like(n); idx = rng.integers(0, len(n) - 400, 900)
for i in idx: ticks[i:i + 300] += rng.uniform(0.2, 1) * np.exp(-np.arange(300) / 40) * rng.standard_normal(300)
save('rain', fade(r * 1.0 + ticks * 0.25, 0.5, 1))
# fridge hum: 60 Hz + harmonics, slow wobble
x = t(6); h = sum(np.sin(2 * np.pi * 60 * k * x) / k ** 1.5 for k in range(1, 6)) * (1 + 0.1 * np.sin(2 * np.pi * 0.3 * x))
save('hum', fade(h + 0.05 * lpf(rng.standard_normal(len(x)), 1 / 30), 0.8, 1))
# belt: rumble + periodic roller clack
x = t(24); rum = lpf(rng.standard_normal(len(x)), 1 / 80) * 3
cl = np.zeros_like(x)
for k in np.arange(0, 24, 0.42): i = int(k * SR); cl[i:i + 900] += np.exp(-np.arange(900) / 120) * np.sin(2 * np.pi * 900 * np.arange(900) / SR)
save('belt', fade(rum + 0.25 * cl + 0.3 * np.sin(2 * np.pi * 110 * x), 0.5, 1))
# tunnel: low wind + rhythmic lamp whooshes
x = t(17); wind = lpf(rng.standard_normal(len(x)), 1 / 40) * 2
wh = np.zeros_like(x)
for k in np.arange(0.2, 17, 0.72):
    i = int(k * SR); m = int(0.5 * SR); env = np.sin(np.linspace(0, np.pi, m)) ** 2
    if i + m < len(x): wh[i:i + m] += env * lpf(rng.standard_normal(m), 1 / 12)
save('tunnel', fade(wind + 0.8 * wh + 0.2 * np.sin(2 * np.pi * 55 * x), 0.6, 1.2))
# engine: low harmonic drone with tyre noise
x = t(12); f0 = 38 + 2 * np.sin(2 * np.pi * 0.2 * x); ph = 2 * np.pi * np.cumsum(f0) / SR
eng = sum(np.sin(k * ph) / k for k in range(1, 8)) + 0.4 * lpf(rng.standard_normal(len(x)), 1 / 25)
save('engine', fade(eng, 0.5, 1))
# scan: two short beeps
x = t(0.32); b = np.sin(2 * np.pi * 2200 * x) * ((x < 0.09) | ((x > 0.15) & (x < 0.24)))
save('scan', b * np.exp(-x * 2))
# drop: water plink (pitch drop + decay)
x = t(0.5); f = 1400 * np.exp(-x * 9) + 500; ph = 2 * np.pi * np.cumsum(f) / SR
save('drop', np.sin(ph) * np.exp(-x * 14))
# tape: noisy rip with rising roughness
x = t(0.55); n = rng.standard_normal(len(x)); am = (np.sin(2 * np.pi * 60 * x) > 0) * 0.6 + 0.4
save('tape', n * am * np.exp(-((x - 0.25) / 0.2) ** 2) - lpf(n, 1 / 4) * 0.3)
# door: thump + short rattle
x = t(0.8); th = np.sin(2 * np.pi * 70 * x) * np.exp(-x * 12) * 2 + lpf(rng.standard_normal(len(x)), 1 / 10) * np.exp(-x * 25) * 3
ra = rng.standard_normal(len(x)) * (np.sin(2 * np.pi * 30 * x) > 0.7) * np.exp(-x * 6) * 0.3
save('door', th + ra)
