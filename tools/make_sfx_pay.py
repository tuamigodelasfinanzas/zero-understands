# Synthesized foley for video 002 (the card payment): café, frozen time, the fibre. No samples, no licences.
# Usage: python3 tools/make_sfx_pay.py assets/sfx
import numpy as np, wave, sys
SR = 48000
out = sys.argv[1]
rng = np.random.default_rng(20931)
def save(name, x):
    x = x / max(1e-6, np.abs(x).max()) * 0.8
    with wave.open(f'{out}/{name}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def lpf(x, a):  # repeated moving average low-pass, a in 0..1 (smaller = darker)
    k = max(1, int(1 / a))
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(k - 1)])
def bp(x, lo, hi): return lpf(x, 1 / lo) - lpf(x, 1 / hi)
def fade(x, a=0.3, b=0.6):
    n = len(x); e = np.ones(n); ia, ib = int(a * SR), int(b * SR)
    e[:ia] = np.linspace(0, 1, ia); e[-ib:] = np.linspace(1, 0, ib); return x * e
t = lambda d: np.arange(int(d * SR)) / SR
noise = lambda d: rng.standard_normal(int(d * SR))
# espresso: steam-wand hiss swelling in and out over a low pump buzz and the gurgle of the pour
x = t(8); n = noise(8)
hiss = bp(n, 2, 6) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.18 * x - 1.2)) ** 2
pump = sum(np.sin(2 * np.pi * 50 * k * x) / k ** 2 for k in range(1, 6)) * 0.25
gur = np.zeros_like(x)
for i in rng.integers(0, len(x) - 3000, 120): m = np.arange(2400); gur[i:i + 2400] += np.sin(2 * np.pi * (300 + 400 * np.exp(-m / 500)) * m / SR) * np.exp(-m / 600) * rng.uniform(0.2, 0.6)
save('espresso', fade(hiss * 0.9 + pump + gur * 0.25, 0.4, 0.8))
# chatter: a café murmur (formant-shaped noise syllables from many far voices) plus cup and spoon clinks
x = t(12); ch = np.zeros_like(x)
for v in range(14):
    f0 = rng.uniform(110, 230); ph = 2 * np.pi * np.cumsum(f0 * (1 + 0.08 * np.sin(2 * np.pi * rng.uniform(0.2, 0.6) * x))) / SR
    syl = (np.sin(2 * np.pi * rng.uniform(3, 5) * x + rng.uniform(0, 6)) > rng.uniform(-0.2, 0.4)).astype(float)
    syl = lpf(syl, 1 / 1200) * (np.sin(2 * np.pi * rng.uniform(0.05, 0.15) * x + rng.uniform(0, 6)) > -0.3)
    ch += lpf(np.sign(np.sin(ph)) * 0.6 + rng.standard_normal(len(x)) * 0.3, 1 / 14) * syl
cl = np.zeros_like(x)
for k in rng.uniform(0.3, 11.5, 9): i = int(k * SR); m = np.arange(6000); cl[i:i + 6000] += sum(np.sin(2 * np.pi * f * m / SR) for f in (2900, 4170, 5230)) * np.exp(-m / 900) * 0.15
save('chatter', fade(ch / 14 + cl, 0.6, 1))
# peel: the ACTIVATE sticker coming off, a sticky crackle that rises then lets go
x = t(0.7); n = rng.standard_normal(len(x))
cr = n * (rng.random(len(x)) < 0.02 + 0.2 * x) * np.exp(-((x - 0.42) / 0.22) ** 2)
save('peel', lpf(cr, 1 / 2) * 3 + bp(n, 3, 20) * np.exp(-((x - 0.52) / 0.05) ** 2) * 0.8)
# freeze: the room sound sucked in (reversed rush) and cut dead, then a glassy high ring that hangs in the silence
x = t(2.2); n = rng.standard_normal(len(x)); cut = 0.75
rush = bp(n, 3, 40) * np.where(x < cut, (x / cut) ** 3, 0)
ring = sum(np.sin(2 * np.pi * f * x) / i for i, f in enumerate((1760, 2637, 3520, 4186), 1)) * np.where(x >= cut, np.exp(-(x - cut) * 2.2), 0)
thump = np.sin(2 * np.pi * 48 * x) * np.where(x >= cut, np.exp(-(x - cut) * 18), 0)
save('freeze', rush * 1.2 + ring * 0.35 + thump * 0.9)
# roomtone: frozen time, almost silence: a soft low air and a faint high tone
x = t(12)
save('roomtone', fade(lpf(noise(12), 1 / 120) * 6 + 0.04 * np.sin(2 * np.pi * 7040 * x) * (1 + 0.3 * np.sin(2 * np.pi * 0.1 * x)), 1, 1.5))
# fiber: riding light down a cable, a bright airy rush, a low pulse and light markers zipping past
x = t(14); n = noise(14)
air = bp(n, 2, 10) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.25 * x))
pul = np.sin(2 * np.pi * 41 * x) * (0.6 + 0.4 * np.sin(2 * np.pi * 2 * x)) * 0.5
zip_ = np.zeros_like(x)
for k in np.arange(0.1, 14, 0.37):
    i = int(k * SR); m = int(0.12 * SR); mm = np.arange(m)
    if i + m < len(x): zip_[i:i + m] += np.sin(2 * np.pi * np.cumsum(5200 - 3400 * mm / m) / SR) * np.sin(np.pi * mm / m) * 0.25
save('fiber', fade(air * 0.8 + pul + zip_, 0.5, 1))
