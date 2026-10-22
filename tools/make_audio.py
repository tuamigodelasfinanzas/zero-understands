"""Original sound effects and music beds for ZERO (no copyright, made from scratch with numpy).
Usage: python3 tools/make_audio.py   -> assets/sfx/*.wav (extra effects) and assets/music/*.wav
The brand sounds (ping, pix-ting, zero-boop, idea, error, dato) come from zero-design/sonidos and are not touched."""
import os, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
T = lambda d: np.arange(int(d * SR)) / SR


def save(path, x, sr=SR):
    x = np.asarray(x, dtype=np.float64)
    p = np.max(np.abs(x)) or 1
    x = x / p * 0.9
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def env(n, a, r):
    e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e


def lp(x, k):  # crude low-pass
    return np.convolve(x, np.ones(k) / k, mode='same')


def sfx():
    out = {}
    t = T(0.12); out['pop'] = np.sin(2 * np.pi * (300 + 900 * np.exp(-30 * t)) * t) * np.exp(-28 * t)
    t = T(0.5); n = rng.standard_normal(len(t)); out['whoosh'] = lp(n, 40) * np.sin(np.pi * t / 0.5) ** 2
    t = T(0.45); out['buzz'] = np.sign(np.sin(2 * np.pi * 150 * t)) * 0.4 * (np.sin(2 * np.pi * 9 * t) > -0.3) * env(len(t), 0.01, 0.05)
    t = T(0.25); out['thud'] = np.sin(2 * np.pi * (60 + 80 * np.exp(-20 * t)) * t) * np.exp(-14 * t)
    t = T(0.05); out['tick'] = rng.standard_normal(len(t)) * np.exp(-90 * t)
    t = T(0.35); out['coin'] = (np.sin(2 * np.pi * hz(88) * t) * (t < 0.08) + np.sin(2 * np.pi * hz(93) * t) * (t >= 0.08)) * np.exp(-6 * t)
    t = T(0.9); out['roll'] = np.concatenate([rng.standard_normal(int(0.02 * SR)) * np.exp(-60 * T(0.02)) * 0.6 if i % 2 == 0 else np.zeros(int(0.02 * SR)) for i in range(int(0.9 / 0.02))])
    t = T(0.35); out['gulp'] = np.sin(2 * np.pi * (500 - 380 * t / 0.35) * t) * env(len(t), 0.02, 0.1) * (np.sin(2 * np.pi * 20 * t) > 0)
    t = T(0.6); out['boing'] = np.sin(2 * np.pi * (180 + 60 * np.sin(2 * np.pi * 12 * t)) * t) * np.exp(-5 * t)
    t = T(0.3); out['swipe'] = lp(rng.standard_normal(len(t)), 8) * np.sin(np.pi * t / 0.3) * 0.6
    t = T(0.18); out['click'] = np.sin(2 * np.pi * 1800 * t) * np.exp(-60 * t)
    t = T(0.8); out['fall'] = np.sin(2 * np.pi * np.cumsum(900 - 800 * t / 0.8) / SR) * env(len(t), 0.02, 0.2)
    t = T(1.2); out['jackpot'] = sum(np.sin(2 * np.pi * hz(m) * t) * (t > i * 0.1) * np.exp(-3 * (t - i * 0.1).clip(0)) for i, m in enumerate([72, 76, 79, 84, 88]))
    t = T(0.5); out['dun'] = (np.sin(2 * np.pi * hz(50) * t) + 0.5 * np.sin(2 * np.pi * hz(57) * t)) * np.exp(-4 * t)
    t = T(0.25); out['type'] = sum(rng.standard_normal(len(t)) * np.exp(-200 * (t - k).clip(0)) * (t >= k) for k in [0, 0.07, 0.13, 0.2]) * 0.5
    t = T(0.6); out['cheer'] = sum(np.sin(2 * np.pi * hz(m) * t) for m in [72, 76, 79]) * env(len(t), 0.01, 0.3)
    t = T(0.4); out['peck'] = sum(np.sin(2 * np.pi * 1200 * (t - k)) * np.exp(-120 * (t - k).clip(0)) * (t >= k) for k in [0, 0.13, 0.26])
    t = T(1.0); out['tension'] = np.sin(2 * np.pi * 55 * t) * np.sin(np.pi * t) * 0.8 + 0.2 * np.sin(2 * np.pi * 58 * t)
    os.makedirs('assets/sfx', exist_ok=True)
    for k, v in out.items():
        save(f'assets/sfx/{k}.wav', v)


def music(name, bpm, prog, seed, bars=16):
    r = np.random.default_rng(seed)
    beat = 60 / bpm; N = int(SR * beat * 4 * bars)
    mix = np.zeros(N)

    def add(sig, start, g=1.0):
        i = int(start * SR); idx = (np.arange(len(sig)) + i) % N; mix[idx] += sig * g

    def pluck(m, d=0.35, g=0.12):
        t = T(d); return (np.sin(2 * np.pi * hz(m) * t) + 0.3 * np.sin(4 * np.pi * hz(m) * t)) * np.exp(-9 * t) * g

    def marimba(m, g=0.1):
        t = T(0.5); return (np.sin(2 * np.pi * hz(m) * t) + 0.15 * np.sin(2 * np.pi * hz(m) * 4 * t)) * np.exp(-7 * t) * g

    def bass(m, d):
        t = T(d); return np.sin(2 * np.pi * hz(m) * t) * env(len(t), 0.01, 0.1) * 0.2

    def shaker(g=0.025):
        t = T(0.06); return rng.standard_normal(len(t)) * np.exp(-60 * t) * g

    for b in range(bars):
        root, kind = prog[b % len(prog)]
        chord = [root, root + (3 if kind == 'm' else 4), root + 7]
        t0 = b * 4 * beat
        add(bass(root - 12, beat * 0.9), t0); add(bass(root - 12, beat * 0.9), t0 + 2 * beat)
        for s in range(8):  # pizzicato arpeggio, sometimes resting (curious, light)
            if r.random() < 0.78:
                add(pluck(chord[(s + b) % 3] + (12 if s % 4 == 3 else 0)), t0 + s * beat / 2)
        if b % 2 == 1:
            add(marimba(chord[2] + 12), t0 + 3.5 * beat)
        for s in range(8):
            add(shaker(0.02 if s % 2 else 0.03), t0 + s * beat / 2)
    os.makedirs('assets/music', exist_ok=True)
    save(f'assets/music/{name}.wav', mix)


if __name__ == '__main__':
    sfx()
    music('curious', 104, [(60, 'M'), (57, 'm'), (65, 'M'), (67, 'M')], 1)
    music('curious-2', 98, [(62, 'm'), (65, 'M'), (60, 'M'), (67, 'M')], 2)
    music('tense', 84, [(57, 'm'), (57, 'm'), (53, 'M'), (52, 'M')], 3)
    print('ok')
