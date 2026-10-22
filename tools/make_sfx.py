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
# ---- video 001 part 2: the air network ----
# ramp: open night air, distant jet idle whine and a far-off reversing beeper
x = t(16); air = lpf(rng.standard_normal(len(x)), 1 / 50) * 2
whine = np.sin(2 * np.pi * (1850 + 20 * np.sin(2 * np.pi * 0.1 * x)) * x) * 0.03 + np.sin(2 * np.pi * 92 * x) * 0.15
bp = np.sin(2 * np.pi * 1300 * x) * ((x % 1.2) < 0.35) * (x > 3) * (x < 11) * 0.04
save('ramp', fade(air + whine + bp, 0.8, 1.2))
# jet: take-off roar swelling from a whine to a deep rumble
x = t(4.5); k = np.clip(x / 3.0, 0, 1); n = rng.standard_normal(len(x))
roar = lpf(n, 1 / 6) * (0.3 + k) + lpf(n, 1 / 40) * 2.5 * k
wh = np.sin(2 * np.pi * np.cumsum(1500 + 1500 * k) / SR) * 0.08 * (1 - 0.5 * k)
save('jet', fade(roar + wh, 0.2, 1.0))
# beep: ground vehicle reversing alarm (two beeps)
x = t(1.3); save('beep', np.sin(2 * np.pi * 1250 * x) * (((x % 0.6) < 0.32)) * np.exp(-x * 0.6) * (x < 1.0))
# clunk: heavy metal lock
x = t(0.7); cl = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, d in [(180, 14), (420, 22), (1130, 35), (2450, 50)]) + lpf(rng.standard_normal(len(x)), 1 / 6) * np.exp(-x * 60) * 2
save('clunk', cl)
# shutter: a burst of camera clicks (the camera tunnel)
x = t(0.8); sh = np.zeros_like(x)
for k in [0.0, 0.06, 0.1, 0.17, 0.21, 0.3, 0.36]:
    i = int(k * SR); m = 700; sh[i:i + m] += rng.standard_normal(m) * np.exp(-np.arange(m) / 90) * (0.6 + 0.4 * rng.random())
save('shutter', sh + np.sin(2 * np.pi * 3200 * x) * np.exp(-x * 10) * 0.05)
# chime: shift-change bell, two soft tones
x = t(2.4); ch = (np.sin(2 * np.pi * 784 * x) * np.exp(-x * 2.2) + np.sin(2 * np.pi * 588 * np.clip(x - 0.45, 0, None)) * np.exp(-np.clip(x - 0.45, 0, None) * 2.2) * (x > 0.45))
save('chime', ch * 0.7 + 0.15 * np.sin(2 * np.pi * 1568 * x) * np.exp(-x * 4))
# slide: cardboard sliding down a metal chute
x = t(1.1); n = rng.standard_normal(len(x)); save('slide', (lpf(n, 1 / 5) - lpf(n, 1 / 30)) * np.sin(np.pi * x / 1.1) ** 0.7)
# hub: a huge hall at night: deep rumble, rollers everywhere, far beeps, a PA hum
x = t(20); rum = lpf(rng.standard_normal(len(x)), 1 / 90) * 3
rl = np.zeros_like(x)
for k in np.sort(rng.uniform(0, 19.8, 160)): i = int(k * SR); m = 1200; rl[i:i + m] += np.exp(-np.arange(m) / 200) * np.sin(2 * np.pi * rng.uniform(500, 1100) * np.arange(m) / SR) * rng.uniform(0.1, 0.5)
far = np.sin(2 * np.pi * 2100 * x) * ((x % 5.3) < 0.08) * 0.05
save('hub', fade(rum + 0.35 * rl + far + 0.08 * np.sin(2 * np.pi * 120 * x), 0.8, 1.2))
# ---- video 001 part 3 ----
# thunder: a crack then a long low roll
x = t(4.0); n = rng.standard_normal(len(x))
th = lpf(n, 1 / 8) * np.exp(-x * 9) * 3 + lpf(n, 1 / 120) * 6 * np.exp(-((x - 1.0) / 1.2) ** 2) + lpf(n, 1 / 60) * 3 * np.exp(-x * 0.9)
save('thunder', fade(th, 0.01, 1.2))
# doorbell: ding-dong
x = t(1.8); d1 = np.sin(2 * np.pi * 659 * x) * np.exp(-x * 2.5); x2 = np.clip(x - 0.5, 0, None); d2 = np.sin(2 * np.pi * 523 * x2) * np.exp(-x2 * 2.2) * (x > 0.5)
save('doorbell', d1 + d2 + 0.2 * np.sin(2 * np.pi * 1318 * x) * np.exp(-x * 5))
# birds: morning chirps over a soft air bed
x = t(10); bed = lpf(rng.standard_normal(len(x)), 1 / 60) * 0.6; ch = np.zeros_like(x)
for k in np.sort(rng.uniform(0.2, 9.5, 26)):
    i = int(k * SR); m = int(0.12 * SR); tt = np.arange(m) / SR; f0 = rng.uniform(2800, 4200)
    ch[i:i + m] += np.sin(2 * np.pi * (f0 + 1800 * tt / 0.12) * tt) * np.sin(np.pi * tt / 0.12) * rng.uniform(0.2, 0.6)
save('birds', fade(bed + ch, 0.8, 1.2))
# zu-signature: the ZeroOpen micro brand signature (~1.1 s). PIX wakes (two quick rising chirps), a dry mechanical/
# digital CLICK with a soft low thump, then a short clean sting: a rising fifth that lands on the octave, plucked,
# with a little air. No epic hits, no reverb tail longer than the shot.
def pluck(f0, d, bright=1.0):
    x = t(d); env = np.exp(-x * 5.5) * (1 - np.exp(-x * 900))
    return env * (np.sin(2 * np.pi * f0 * x) + 0.35 * bright * np.sin(2 * np.pi * 2 * f0 * x) * np.exp(-x * 9) + 0.12 * np.sin(2 * np.pi * 3 * f0 * x) * np.exp(-x * 14))
rs = np.random.default_rng(11)   # its own seed: the signature never changes when other sounds are added
sig = np.zeros(int(1.15 * SR))
def put(x, at, g=1.0):
    i = int(at * SR); n = min(len(x), len(sig) - i); sig[i:i + n] += g * x[:n]
for at, (fa, fb) in [(0.0, (1400, 2300)), (0.075, (1900, 3100))]:   # PIX chirps
    x = t(0.06); fq = np.linspace(fa, fb, len(x)); put(np.sin(2 * np.pi * np.cumsum(fq) / SR) * np.sin(np.linspace(0, np.pi, len(x))) ** 2, at, 0.35)
x = t(0.14); put(lpf(rs.standard_normal(len(x)), 1 / 3) * np.exp(-x * 60) * np.linspace(0, 1, len(x)) ** 2, 0.08, 0.25)   # air rush into the click
x = t(0.03); put(rs.standard_normal(len(x)) * np.exp(-x * 400) + np.sin(2 * np.pi * 4200 * x) * np.exp(-x * 300), 0.22, 0.9)   # CLICK
x = t(0.12); put(np.sin(2 * np.pi * 85 * x) * np.exp(-x * 40), 0.22, 0.6)   # thump under the click
put(pluck(659.25, 0.9), 0.27, 0.55); put(pluck(987.77, 0.85), 0.36, 0.5); put(pluck(1318.5, 0.8, 0.6), 0.45, 0.45)   # E5 B5 E6
x = t(0.7); put(lpf(rs.standard_normal(len(x)), 1 / 2) * np.exp(-x * 7) * 0.05, 0.45)   # shimmer
sig[-int(0.15 * SR):] *= np.linspace(1, 0, int(0.15 * SR))
save('zu-signature', sig)
