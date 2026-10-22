// Video 001 "Where Your Package Goes While You Sleep": the first ~2 minutes (script scenes s01-s11) as an animatic.
// Direction: docs/mundo-vivo.md. Simple character, rich world: every shot has a foreground, a middle ground with
// action and a background with its own life; something changes every 3-6 s; ZERO acts, the world corrects him.
import { G, N, zero, pix, prop, sfx, cam, walk, lookCam, stepBack, leanIn } from '../../src/kit.mjs';

const BOX = 1.15;                // the yellow box's scale next to ZERO (s 2.6): a shoebox he can sit on
const P = (type, k, id, z = 0, o = {}) => prop(type, k, { id, z, ...o });
const vig = (op = 0.75) => P('vignette', { x: 0, y: 0, ui: true, op }, 'vig', 50);
// a point on the route drawn on the US map (quadratic from ZERO's dot to mom's heart), for the trail of scans
const route = t => [
  Math.round(((1 - t) ** 2 * 48 + 2 * (1 - t) * t * 210 + t * t * 366) * 10) / 10,
  Math.round(((1 - t) ** 2 * 112 + 2 * (1 - t) * t * 40 + t * t * 80) * 10) / 10];

// ---------- sets ----------
// ZERO's kitchen at night: window onto the city (a train, lights switching on and off), the cat on the sill, the
// counter with a steaming kettle, the humming fridge with the US map magnet, the calendar under the pendant lamp,
// the clock, the keys, the door. o.fg adds the foreground table with a steaming mug (wide shots).
const kitchen = (o = {}) => [
  P('interior', { x: 0, y: G, wall: '#2E3458', floor: '#3B3149', vx: 1400, paper: true }, 'int', -20),
  P('nightWindow', { x: 330, y: 430, w: 380, h: 320, seed: 2 }, 'win', -15),
  P('pool', { x: 330, y: 430, rx: 420, ry: 320, kind: 'cool', op: 0.35 }, 'winglow', -16),
  P('cat', [{ x: 440, y: 590, s: 0.85, mode: 'sit', ...(o.cat || {}) }, ...(o.catKeys || [])], 'cat', -14),
  P('kitchen', { x: 1000, y: G, w: 760 }, 'kit', -12),
  P('fridge', o.fridgeKeys || { x: 1560, y: G }, 'fridge', -11),
  P('calendar', [{ x: 1890, y: 470, s: 1, circ: 1 }, ...(o.calKeys || [])], 'cal', -12),
  P('wallclock', { x: 2140, y: 250, s: 0.8, h: 6, m: 21, s0: 30 }, 'clock', -12),
  P('keyhook', [{ x: 2260, y: 560, swing: 0 }, ...(o.keyKeys || [])], 'keys', -12),
  P('doorway', [{ x: 2470, y: G, open: 0 }, ...(o.doorKeys || [])], 'door', -12),
  P('mat', { x: 2470, y: G + 20, w: 300, color: '#3E2F3A' }, 'mat', -11),
  P('mat', { x: 1250, y: G + 60, w: 900, color: '#45354F' }, 'rug', -11),
  P('pendant', { x: 1880, y: 70, cord: 400, len: 860, spread: 1000 }, 'lamp', -10),
  P('pool', { x: 1880, y: 930, rx: 520, ry: 120, kind: 'warm', op: 0.8 }, 'lamppool', -10),
  P('pool', { x: 1000, y: 560, rx: 520, ry: 380, kind: 'warm', op: 0.25 }, 'kitpool', -13),
  P('potplant', { x: 2700, y: G, s: 1.2, seed: 1 }, 'plant', -9),
  ...(o.fg ? [P('fgtable', { x: 360, y: G + 330, s: 1.1 }, 'table', 30, { depth: 1.3 })] : []),
];

// the shipping store at 6:47 PM: rainy street through the window (cars, umbrellas), a bench, queue posts, shelves of
// parcels, the lit menu, the counter with scale and card terminal, a sleepy clerk, the belt into the system's mouth
const shop = (o = {}) => [
  P('shopwall', { x: 0, y: G }, 'wall', -20),
  P('interior', { x: 0, y: G, wall: '#2F5260', floor: '#2C3340', vx: 1200 }, 'floor', -21),
  P('storefront', { x: 300, y: 470, w: 640, h: 440, txt: 'OPEN LATE' }, 'street', -16),
  P('bench', { x: 300, y: G - 10, s: 0.9 }, 'bench', -9),
  P('menuboard', [{ x: 1040, y: 230, hl: -1 }, ...(o.menuKeys || [])], 'menu', -15),
  P('wallclock', { x: 1420, y: 200, s: 0.75, h: 6, m: o.min ?? 47, s0: 5 }, 'clock', -15),
  P('pool', { x: 1040, y: 330, rx: 520, ry: 300, kind: 'cool', op: 0.4 }, 'menuglow', -16),
  P('pendant', { x: 820, y: 60, cord: 300, len: 620, spread: 640, color: '#2D6E7E' }, 'lamp1', -10),
  P('pendant', { x: 1220, y: 60, cord: 300, len: 620, spread: 640, color: '#2D6E7E' }, 'lamp2', -10),
  P('mouth', [{ x: 2480, y: 700, w: 360, h: 520, push: 0, light: 'red' }, ...(o.mouthKeys || [])], 'mouth', -14),
  P('plate', { x: 2480, y: 110, txt: 'OUTBOUND', w: 300, size: 30 }, 'plate', -14),
  P('conveyor', { x: 1940, y: 700, w: 1000, speed: 40, legs: 230, lamp: true }, 'belt', -6),
  P('person', [{ x: 1250, y: G - 30, s: 2.3, pose: 'yawn', shirt: '#2D6E7E', skin: '#B9876A', cap: '#1F4F5C', seed: 2, look: -0.6, ...(o.clerk || {}) }, ...(o.clerkKeys || [])], 'clerk', -8),
  P('counter', [{ x: 1000, y: G, w: 700, kg: o.kg ?? '0.00 kg', paid: false }, ...(o.counterKeys || [])], 'counter', -4),
  P('mat', { x: 520, y: G + 30, w: 420, color: '#3A2E36', txt: 'WELCOME' }, 'mat', -3),
  P('potplant', { x: 2860, y: G, s: 1.1, seed: 3, color: '#356B55' }, 'plant', -3),
  P('stanchion', { x: -60, y: G + 150, s: 1, n: 3, gap: 280 }, 'queue', 20, { depth: 1.15 }),
];

// inside the system: the tunnel rushing past and the light of each lamp washing over ZERO
const tunnel = (o = {}) => [
  P('tunnel', [{ x: 0, y: 0, speed: o.speed ?? 520, flick: 0 }, ...(o.tunKeys || [])], 'tun', -20),
  P('tunwash', [{ x: 0, y: 0, speed: o.speed ?? 520, flick: 0 }, ...(o.tunKeys || [])], 'wash', 7),
];

// the night road to the airport: skyline layers, streetlights, rain; the truck stays in frame and the world moves.
// close: no rain in front of the truck (we are inside it)
const road = (o = {}) => [
  P('road', { x: 960, y: 900, speed: 900 }, 'road', -20),
  P('rain', { x: 960, y: 500, w: 2600, h: 1300, n: 140, ang: -14, op: 0.55, ground: 380 }, 'rain', -15),
  ...(o.close ? [] : [P('rain', { x: 960, y: 500, w: 2600, h: 1300, n: 40, ang: -14, op: 0.18 }, 'rainfg', 20)]),
];

const sysOn = (at, id = 'sys') => P('sysview', [{ x: 0, y: 0, ui: true, op: 0 }, { ...at, op: 0, e: 'step' }, { ...at, t: (at.t ?? 0) + 0.5, op: 1, e: 'out' }], id, 40);
const ui = a => ({ ...a, k: a.k.map(k => ({ ...k, ui: true })) });

export default {
  id: 'v001-part1',
  format: 'long',
  title: 'Where Your Package Goes While You Sleep (animatic, part 1)',
  description: 'Animatic of the first two minutes of video 001.',
  tags: ['how it works', 'logistics', 'packages'],
  music: 'curious', musicGain: 0.06,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  // a softer rim (ZERO belongs to the scene instead of looking cut out) and a real contact shadow on dark floors
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.38,
  beats: [
    // ===== s01: wide establishing shot of the kitchen; ZERO walks past the calendar, stops, comes back =====
    {
      lines: [N("ZERO forgot his mom's birthday.", { at: 1.0 })], min: 4.6, bg: '#151833',
      cam: cam({ z: 0.64, x: 1420, y: 470 }, { t: 2.3, z: 0.68, x: 1520, y: 480 }, { t: 3.3, z: 1.35, x: 1900, y: 520, e: 'io' }, { end: 0, z: 1.45, x: 1900, y: 500 }),
      actors: [...kitchen({ fg: true }), zero([{ x: 700, face: 0, look: [4, 0] }, ...walk(700, 2160, 0, 2.2), { t: 2.35, look: [0, -2], headR: -6 }, { t: 2.55, flip: true, look: [3, -3] }, ...walk(2160, 1980, 2.6, 0.55).map(k => ({ ...k, flip: true })),
        { t: 3.3, look: [2, -6], headR: -10, face: 3, pose: 'back', e: 'out' }, { t: 4.2, face: 3, pose: 'neutral', look: [2, -7] }]), vig(0.7)],
      sfx: [sfx('hum', 0, { g: 0.3, bed: true }), sfx('zero-boop', 3.3, { g: 0.6 })],
    },
    // ===== s02a: close: the day he circled weeks ago, and his face =====
    {
      lines: [N("It's tomorrow.")], min: 2.4, bg: '#151833',
      cam: cam({ z: 2.0, x: 1990, y: 470 }, { end: 0, z: 2.15, x: 2000, y: 480, e: 'lin' }),
      actors: [...kitchen({ calKeys: [{ t: 0.2, circ: 0.3 }, { t: 1.0, circ: 1, e: 'io' }] }),
        zero([{ x: 2150, flip: true, face: 3, look: [6, -5], headR: -8 }, { l: 0, t: 1.1, face: 9, look: [3, -2], headR: -3, e: 'io' }]), vig(0.7)],
      sfx: [sfx('swipe', 0.2, { g: 0.3 })],
    },
    // ===== s02b: insert on the fridge magnet. His finger follows the distance, and keeps going =====
    {
      lines: [N('And she lives on the other side of the country.')], min: 3.6, bg: '#151833',
      cam: cam({ z: 3.1, x: 1572, y: 728 }, { end: 0, z: 3.25, x: 1580, y: 726, e: 'lin' }),
      actors: [...kitchen({ fridgeKeys: [{ x: 1560, y: G, mapProg: 0 }, { l: 0, t: 0.5, mapProg: 0 }, { l: 0, t: 2.3, mapProg: 1, e: 'io' }] }),
        P('arm', [{ x: 0, y: 0, x0: 1230, y0: 900, x1: 1504, y1: 732, w: 23 }, { l: 0, t: 0.5, x0: 1230, x1: 1504, y1: 732 },
          ...[0.2, 0.4, 0.6, 0.8, 1].map(t => { const [rx, ry] = route(t); return { l: 0, t: 0.5 + 1.8 * t, x0: 1230 + 160 * t, x1: 1570 + (rx - 206) * 0.42, y1: 735 + (ry - 122) * 0.42 - 4, e: 'lin' }; })], 'zarm', 5), vig(0.6)],
      sfx: [sfx('roll', 0.9, { g: 0.2 })],
    },
    // ===== s02c: the pause. He looks at us =====
    {
      lines: [], min: 1.5, bg: '#151833',
      cam: cam({ z: 1.7, x: 1460, y: 600 }),
      actors: [...kitchen({ fridgeKeys: { x: 1560, y: G, mapProg: 1 } }),
        zero([{ x: 1360, face: 0, pose: 'point', hr: [146, 132], look: [8, 0] }, { t: 0.25, pose: 'neutral', hr: null }, ...lookCam(0.35, { face: 1 })]), vig(0.7)],
    },
    // ===== s03: the only fast montage. Tape (top-down), bow + heart, keys, door slam, the cat =====
    {
      lines: [], min: 0.8, bg: '#6B4A35',
      actors: [P('rect', { x: 960, y: 540, w: 2400, h: 1400, fill: '#6B4A35' }, 'table', -10), P('pool', { x: 960, y: 540, rx: 900, ry: 700, kind: 'warm', op: 0.5 }, 'tp', -9),
        P('topbox', [{ x: 960, y: 560, s: 2.2, tape: 0 }, { t: 0.1, tape: 0 }, { t: 0.65, tape: 1, e: 'out' }], 'tb', 0),
        P('tapegun', [{ x: 520, y: 560, s: 1.6, tilt: 0 }, { t: 0.1, x: 520 }, { t: 0.65, x: 1450, e: 'out' }], 'tg', 2),
        P('arm', [{ x: 0, y: 0, x0: 380, y0: 1300, x1: 520, y1: 660, w: 34 }, { t: 0.1, x1: 520 }, { t: 0.65, x0: 1200, x1: 1450, e: 'out' }], 'a1', 1), vig(0.6)],
      sfx: [sfx('tape', 0.1, { g: 0.9 })],
    },
    {
      lines: [], min: 0.7, bg: '#6B4A35',
      actors: [P('rect', { x: 960, y: 540, w: 2400, h: 1400, fill: '#6B4A35' }, 'table', -10), P('pool', { x: 960, y: 540, rx: 900, ry: 700, kind: 'warm', op: 0.5 }, 'tp', -9),
        P('topbox', [{ x: 960, y: 560, s: 2.2, tape: 1, bow: false, heart: false }, { t: 0.15, bow: true, e: 'step' }, { t: 0.4, heart: true, e: 'step' }], 'tb', 0),
        P('arm', [{ x: 0, y: 0, x0: 1500, y0: 1300, x1: 1300, y1: 900, w: 34 }, { t: 0.3, x1: 760, y1: 820, e: 'out' }, { t: 0.6, x1: 840, y1: 860 }], 'a1', 1), vig(0.6)],
      sfx: [sfx('pop', 0.15, { g: 0.7 })],
    },
    {
      lines: [], min: 0.6, bg: '#151833',
      cam: cam({ z: 1.5, x: 2300, y: 600 }),
      actors: [...kitchen({ keyKeys: [{ t: 0.15, swing: 1, since: 0, keys: false, e: 'step' }] }),
        zero([{ x: 2000, pose: 'run', face: 3 }, { t: 0.55, x: 2440, pose: 'run', e: 'lin' }]), vig(0.7)],
      sfx: [sfx('click', 0.15, { g: 0.7 })],
    },
    {
      lines: [], min: 0.55, bg: '#151833',
      cam: cam({ z: 1.3, x: 2470, y: 640, shake: 0 }, { t: 0.18, shake: 9, e: 'step' }, { t: 0.45, shake: 0 }),
      actors: [...kitchen({ doorKeys: [{ t: 0, open: 0.9 }, { t: 0.17, open: 0, e: 'in' }] }), vig(0.7)],
      sfx: [sfx('door', 0.17, { g: 1 })],
    },
    {
      lines: [], min: 0.9, bg: '#151833',
      cam: cam({ z: 2.4, x: 440, y: 520 }),
      actors: [...kitchen({ cat: { mode: 'jump', y: 560 }, catKeys: [{ t: 0.5, mode: 'sit', y: 590 }] }), vig(0.7)],
      sfx: [sfx('boing', 0.0, { g: 0.3 })],
    },
    // ===== s04a: insert on the clock, then pull back to reveal the store; ZERO comes in from the rain =====
    {
      lines: [N('Six forty-seven PM.', { at: 0.6 })], min: 3.6, bg: '#10131F',
      cam: cam({ z: 3.2, x: 1420, y: 200 }, { t: 1.5, z: 3.0, x: 1420, y: 210 }, { t: 2.8, z: 0.8, x: 1300, y: 500, e: 'io' }),
      actors: [...shop(), zero([{ x: 120, face: 0, pose: 'neutral', hl: [126, 150], hr: [140, 150], holdR: { type: 'giftbox', s: BOX / 2.6, w: 150, h: 120 } }, ...walk(120, 600, 1.8, 1.6).map(k => ({ ...k, hl: [126, 150], hr: [140, 150] }))]),
        P('person', [{ x: 860, y: G + 40, s: 2.3, pose: 'walk', flip: true, shirt: '#6B5A8A', skin: '#D2A07E', hair: '#5A3A2A', seed: 5, hold: { type: 'parcel', v: 3, s: 0.5 } }, { u: 1, x: -200, e: 'lin' }], 'cust', 8), vig(0.65)],
      sfx: [sfx('tick', 0.3, { g: 0.5 }), sfx('tick', 1.3, { g: 0.5 }), sfx('rain', 0, { g: 0.25, bed: true }), sfx('whoosh', 1.6, { g: 0.3 })],
    },
    // ===== s04b: he points at the most expensive row; the clerk wakes up; the card terminal goes green =====
    {
      lines: [N('ZERO pays for the fastest thing on the menu.')], min: 3.6, bg: '#10131F',
      cam: cam({ z: 1.1, x: 1000, y: 470 }, { end: 0, z: 1.16, x: 1020, y: 460, e: 'lin' }),
      actors: [...shop({ menuKeys: [{ l: 0, t: 1.4, hl: 2, e: 'step' }], clerkKeys: [{ l: 0, t: 1.0, pose: 'stand', look: -1 }, { l: 0, t: 2.0, pose: 'type' }], counterKeys: [{ l: 0, t: 2.6, paid: true, e: 'step' }] }),
        P('giftbox', { x: 820, y: 609, s: BOX, label: false }, 'box', -3),
        zero([{ x: 600, face: 0, look: [3, -2] }, { l: 0, t: 1.0, pose: 'point', hr: [150, 96], look: [6, -7], headR: -8, face: 0, e: 'back' }, { l: 0, t: 2.4, pose: 'neutral', look: [8, 0], headR: 0, face: 6 }]), vig(0.65)],
      sfx: [sfx('ping', 1.75, { g: 0.4 }), sfx('coin', 2.95, { g: 0.6 })],
    },
    // ===== s04c: close on the box: the stamp falls, then the clerk slaps the label on =====
    {
      lines: [N('Next day.'), N('By morning.', { gap: 0.2 })], min: 2.8, bg: '#10131F',
      cam: cam({ z: 2.4, x: 860, y: 470 }, { l: 0, t: 0.32, shake: 7, e: 'step' }, { l: 0, t: 0.6, shake: 0 }),
      actors: [...shop({ counterKeys: [{ paid: true }] }),
        P('giftbox', [{ x: 820, y: 609, s: BOX, label: false, stamp: 0 }, { l: 0, t: 0.3, stamp: 1, e: 'step' }, { l: 1, label: true, e: 'step' }], 'box', -3),
        P('stamp', [{ x: 880, y: -200, s: 1.2 }, { l: 0, t: 0, y: -200 }, { l: 0, t: 0.3, y: 560, e: 'in' }, { l: 0, t: 0.55, y: 540 }, { l: 0, t: 1.0, y: -260, e: 'in' }], 'stamp', 6),
        P('arm', [{ x: 0, y: 0, x0: 1300, y0: 200, x1: 1300, y1: 200, w: 30, color: '#2D6E7E', hand: '#B9876A', o: 0 }, { l: 1, t: -0.3, o: 1, e: 'step' }, { l: 1, x1: 790, y1: 540, e: 'out' }, { l: 1, t: 0.5, x1: 1300, y1: 200, e: 'in' }], 'clerkarm', 7),
        zero([{ x: 600, face: 0, look: [8, 2] }, { l: 0, t: 0.3, face: 3, squash: 0.92 }, { l: 0, t: 0.6, squash: 1, face: 2 }]), vig(0.65)],
      sfx: [sfx('thud', 0.62, { g: 0.9 }), sfx('peck', 0, { l: 1, g: 0.5 })],
    },
    // ===== s05a: the clerk puts the box on the belt. PIX comes out of the mouth, scans it and projects the night ahead =====
    {
      lines: [N('Tonight, this box will ride a truck, catch a plane, and land in a building that sorts more than four hundred thousand packages an hour.')], min: 8, bg: '#10131F',
      cam: cam({ z: 0.84, x: 1500, y: 500 }, { end: 0, z: 0.88, x: 1580, y: 490, e: 'lin' }),
      actors: [...shop({ clerkKeys: [{ t: 0, pose: 'carry', hold: { type: 'giftbox', s: BOX / 2.3, label: true, stamp: 1 }, look: 1 }, { t: 0.9, x: 1400, e: 'io' }, { t: 1.2, pose: 'stand', hold: null, e: 'step' }, { t: 2.5, x: 1250, flip: true, e: 'io' }, { t: 3.2, flip: false, pose: 'type' }],
        mouthKeys: [{ t: 1.4, push: 0 }, { t: 1.8, push: 1, e: 'out' }, { t: 2.6, push: 0, e: 'io' }] }),
        P('giftbox', [{ x: 1500, y: 668, s: BOX, label: true, stamp: 1, o: 0 }, { t: 1.2, o: 1, e: 'step' }, { u: 1, x: 1500 + 40 * 6.6, e: 'lin' }], 'box', -5),
        pix([{ x: 2480, y: 500, s: 1.1, face: 0, o: 0 }, { t: 1.6, o: 1, e: 'step' }, { t: 2.3, x: 2080, y: 360, s: 1.6, face: 2, e: 'back' }, { t: 3.0, face: 3 }, { l: 0, t: 6, face: 1 }]),
        P('scanbeam', [{ x: 2080, y: 360, dx: -380, dy: 300, w: 200, o: 0 }, { t: 2.5, o: 1, e: 'step' }, { t: 3.6, o: 0, e: 'step' }], 'beam', 9),
        P('holo', [{ x: 1640, y: 250, w: 260, h: 210, icon: 'truck', txt: 'TRUCK', size: 30, on: 0 }, { l: 0, t: 1.4, on: 0 }, { l: 0, t: 1.8, on: 1, e: 'out' }], 'h1', 9),
        P('holo', [{ x: 1940, y: 250, w: 260, h: 210, icon: 'plane', txt: 'PLANE', size: 30, on: 0 }, { l: 0, t: 2.6, on: 0 }, { l: 0, t: 3.0, on: 1, e: 'out' }], 'h2', 9),
        P('holo', [{ x: 2280, y: 250, w: 340, h: 210, icon: 'hub', txt: '400,000+ / HOUR', size: 30, on: 0 }, { l: 0, t: 4.4, on: 0 }, { l: 0, t: 4.8, on: 1, e: 'out' }], 'h3', 9),
        zero([{ x: 600, face: 0, look: [8, 0] }, ...stepBack({ t: 1.9 }, 600, { face: 3 }), { t: 3.4, face: 4, headR: 10, look: [8, -4] }, ...leanIn({ l: 0, t: 4.6 }, 530, { face: 6, look: [8, -6] })]), vig(0.6)],
      sfx: [sfx('belt', 0, { g: 0.35, bed: true }), sfx('rain', 0, { g: 0.18, bed: true }), sfx('pix-ting', 1.8, { g: 0.6 }), sfx('scan', 2.6, { g: 0.5 })],
    },
    // ===== s05b-c: everybody's boxes join; nobody opens it, nobody carries it: the belt does =====
    {
      lines: [N('Nobody will open it.'), N('Nobody will carry it across the country.')], min: 4.4, bg: '#10131F', pre: 0.2,
      cam: cam({ z: 1.25, x: 1880, y: 540 }, { l: 1, t: 0.2, z: 1.0, x: 1800, y: 470, e: 'io' }),
      actors: [...shop({ clerkKeys: [{ pose: 'sit', y: G - 10, look: -0.3 }, { l: 1, pose: 'yawn' }] }),
        P('giftbox', [{ x: 1764, y: 668, s: BOX, label: true, stamp: 1 }, { u: 1, x: 1764 + 40 * 4.6, e: 'lin' }], 'box', -5),
        ...[0, 1, 2].map(i => P('parcel', [{ x: 1540 - i * 150, y: 300, s: 1.1, v: i + 1, o: 0 }, { t: 0.3 + i * 0.5, o: 1, e: 'step' }, { t: 0.55 + i * 0.5, y: 668, e: 'in' }, { u: 1, x: 1540 - i * 150 + 40 * (4.6 - 0.55 - i * 0.5), e: 'lin' }], 'p' + i, -5)),
        pix([{ x: 2080, y: 360, s: 1.6, face: 1 }, { l: 1, t: 0.2, x: 2160, y: 300 }]),
        P('holo', [{ x: 1940, y: 260, w: 520, h: 300, icon: null, on: 0 }, { l: 1, t: 0.2, on: 1, e: 'out' }], 'hmap', 9),
        P('usmap', [{ x: 1940, y: 250, s: 1.1, tone: 'holo', prog: 0, a: 1, o: 0 }, { l: 1, t: 0.2, o: 1, e: 'step' }, { l: 1, t: 0.4, prog: 0 }, { l: 1, t: 1.6, prog: 1, e: 'io' }], 'map', 10),
        zero([{ x: 1300, face: 0, look: [8, -3] }, { l: 1, t: 0.6, face: 4, headR: 8, look: [6, -8] }]), vig(0.6)],
      sfx: [sfx('belt', 0, { g: 0.35, bed: true }), sfx('thud', 0.55, { g: 0.35 }), sfx('thud', 1.05, { g: 0.35 }), sfx('thud', 1.55, { g: 0.35 }), sfx('swipe', 0.4, { l: 1, g: 0.3 })],
    },
    // ===== s05d: before breakfast. He checks the clock; PIX shows a house and a coffee =====
    {
      lines: [N("And somehow, it's supposed to be at her door before breakfast.")], min: 3.8, bg: '#10131F',
      cam: cam({ z: 0.95, x: 1650, y: 480 }, { end: 0, z: 1.0, x: 1700, y: 470, e: 'lin' }),
      actors: [...shop({ min: 49, clerkKeys: [{ pose: 'type', look: -0.3 }] }),
        P('giftbox', [{ x: 1948, y: 668, s: BOX, label: true, stamp: 1 }, { u: 1, x: 1948 + 40 * 4, e: 'lin' }], 'box', -5),
        ...[0, 1, 2].map(i => P('parcel', [{ x: 1720 - i * 150, y: 668, s: 1.1, v: i + 1 }, { u: 1, x: 1720 - i * 150 + 160, e: 'lin' }], 'p' + i, -5)),
        pix([{ x: 2160, y: 300, s: 1.6, face: 3 }, { t: 1.2, x: 2320, y: 330, face: 0 }]),
        P('holo', [{ x: 2060, y: 250, w: 380, h: 190, on: 0 }, { t: 0.6, on: 1, e: 'out' }], 'hb', 9),
        P('icon', [{ x: 1960, y: 240, k: 'house', color: '#7CC2FF', o: 0 }, { t: 0.9, o: 1, e: 'step' }], 'i1', 10),
        P('icon', [{ x: 2160, y: 250, k: 'cup', color: '#FFC93C', o: 0 }, { t: 1.4, o: 1, e: 'step' }], 'i2', 10),
        zero([{ x: 1300, face: 4, look: [8, -6] }, ...walk(1300, 1420, 0.2, 0.7), { t: 1.2, look: [-3, -8], headR: -12, face: 9 }, { t: 2.4, look: [8, -2], headR: 0, face: 9 }]), vig(0.6)],
      sfx: [sfx('belt', 0, { g: 0.35, bed: true }), sfx('tick', 1.2, { g: 0.5 }), sfx('tick', 2.2, { g: 0.5 })],
    },
    // ===== s06: ZERO is going with it. Anticipation, jump, landing, sprint, onto the box, into the dark =====
    {
      lines: [N('ZERO is going with it.', { at: 0.3 })], min: 3.6, bg: '#10131F',
      cam: cam({ z: 1.0, x: 1700, y: 470 }, { t: 1.0, z: 1.0, x: 1760, y: 470 }, { t: 2.6, z: 1.25, x: 2300, y: 520, e: 'io' }),
      tout: { type: 'zoom', x: 2480, y: 470, dur: 0.75, color: '#05060D' },
      actors: [...shop({ min: 49, clerkKeys: [{ pose: 'type', look: -0.3 }, { t: 1.6, pose: 'stand', look: 1, headR: 10 }, { t: 2.0, pose: 'shrug' }],
        mouthKeys: [{ t: 2.6, push: 0 }, { t: 3.0, push: 1, e: 'out' }] }),
        P('giftbox', [{ x: 2108, y: 668, s: BOX, label: true, stamp: 1 }, { t: 2.6, x: 2210, e: 'lin' }, { u: 1, x: 2440, e: 'in' }], 'box', -5),
        ...[0, 1, 2].map(i => P('parcel', [{ x: 1880 - i * 150, y: 668, s: 1.1, v: i + 1 }, { u: 1, x: 1880 - i * 150 + 150, e: 'lin' }], 'p' + i, -5)),
        pix([{ x: 2320, y: 330, s: 1.6, face: 4 }, { t: 2.2, x: 2480, y: 420, s: 1.2, e: 'in' }, { t: 2.8, o: 0, e: 'step' }]),
        zero([{ x: 1420, face: 9, look: [8, -1] }, { t: 0.5, look: [-2, -8], headR: -10 }, { t: 0.9, look: [8, 0], headR: 0, face: 8, squash: 1 },
          { t: 1.15, squash: 0.82, y: G + 8, pose: 'back', e: 'out' }, { t: 1.35, squash: 1.1, y: 520, x: 1640, pose: 'celebrate', e: 'out' }, { t: 1.65, y: 690, x: 1820, squash: 0.88, pose: 'neutral', e: 'in' },
          { t: 1.8, squash: 1, y: 675, pose: 'run' }, { t: 2.4, x: 2150, y: 675, pose: 'run', e: 'lin' }, { t: 2.6, x: 2200, y: 575, pose: 'neutral', fl: [118, 196], fr: [132, 200], hl: [86, 160], hr: [124, 150], face: 2, e: 'out' }, { u: 1, x: 2430, e: 'in' }]), vig(0.6)],
      sfx: [sfx('whoosh', 1.3, { g: 0.6 }), sfx('thud', 1.65, { g: 0.6 }), sfx('belt', 0, { g: 0.35, bed: true }), sfx('whoosh', 2.9, { g: 0.6 })],
    },
    // ===== s07: the tunnel. ZERO sits on his box; PIX is the only warm light. Three questions, three projections =====
    {
      lines: [N('Three questions.'), N('How does the system know where this box is going?'), N('Who pays for a plane to fly through the night?'), N('And what happens when something goes wrong?'), N('Because tonight, something will.', { gap: 0.5 })],
      min: 14, hold: 1.4, bg: '#06070F', tin: { type: 'iris', x: 960, y: 640, dur: 0.6, color: '#05060D' },
      cam: cam({ z: 1.0, x: 960, y: 540, shake: 1.2 }, { l: 4, z: 1.05, x: 960, y: 560 }, { end: 0, z: 1.25, x: 990, y: 620, e: 'io' }),
      actors: [...tunnel({ tunKeys: [{ l: 4, t: 0.9, flick: 1, e: 'step' }, { l: 4, t: 1.6, flick: 0, e: 'step' }] }),
        P('pool', { x: 700, y: 560, rx: 520, ry: 420, kind: 'pix', op: 0.7 }, 'pixlight', 1),
        P('giftbox', { x: 1000, y: 930, s: BOX * 1.3, label: true, stamp: 1 }, 'box', 2),
        P('drip', [{ x: 1040, y: 160, len: 610, period: 1.3, o: 0 }, { l: 4, t: 0.6, o: 1, e: 'step' }], 'drip', 3),
        zero([{ x: 1000, y: 930 - 120 * BOX * 1.3 + 125, face: 0, fl: [120, 196], fr: [134, 200], hl: [84, 166], hr: [118, 166], look: [-4, -2] },
          { l: 1, look: [-6, -6], headR: -6 }, { l: 2, look: [0, -7], headR: 4 }, { l: 3, look: [5, -6], headR: 8, face: 4 }, { l: 4, t: 0.8, look: [2, -9], headR: -4, face: 9 }, { l: 4, t: 1.5, squash: 0.94, e: 'out' }, { l: 4, t: 1.8, squash: 1 }], { z: 4 }),
        pix([{ x: 640, y: 520, s: 1.5, face: 0 }, { l: 1, face: 3 }, { l: 2, x: 700, y: 480 }, { l: 3, face: 5 }, { l: 4, t: 0.8, face: 6, x: 660, y: 540 }]),
        P('holo', [{ x: 620, y: 230, w: 260, h: 210, icon: 'label', txt: 'WHERE?', size: 30, on: 0 }, { l: 1, on: 0 }, { l: 1, t: 0.35, on: 1, e: 'out' }, { l: 4, on: 1 }, { l: 4, t: 0.4, on: 0 }], 'q1', 8),
        P('holo', [{ x: 960, y: 200, w: 260, h: 210, icon: 'coin', txt: 'WHO PAYS?', size: 30, on: 0 }, { l: 2, on: 0 }, { l: 2, t: 0.35, on: 1, e: 'out' }, { l: 4, on: 1 }, { l: 4, t: 0.4, on: 0 }], 'q2', 8),
        P('holo', [{ x: 1300, y: 230, w: 260, h: 210, icon: 'warn', txt: 'WHAT FAILS?', size: 30, color: '#FF8A7A', on: 0 }, { l: 3, on: 0 }, { l: 3, t: 0.35, on: 1, e: 'out' }, { l: 4, t: 0.4, on: 1 }, { l: 4, t: 1.2, on: 0.6 }], 'q3', 8),
        vig(0.85)],
      sfx: [sfx('tunnel', 0, { g: 0.4, bed: true }), sfx('ping', 0.35, { l: 1, g: 0.3 }), sfx('ping', 0.35, { l: 2, g: 0.3 }), sfx('ping', 0.35, { l: 3, g: 0.3 }), sfx('drop', 1.25, { l: 4, g: 0.6 }), sfx('tension', 0.9, { l: 4, g: 0.6 })],
    },
    // ===== s08a: what ZERO sees: a present =====
    {
      lines: [N("To ZERO, it's a gift.")], min: 2.2, bg: '#06070F',
      cam: cam({ z: 2.0, x: 1020, y: 740 }, { end: 0, z: 2.1, x: 1020, y: 750, e: 'lin' }),
      actors: [...tunnel({ speed: 300 }), P('pool', { x: 860, y: 700, rx: 520, ry: 420, kind: 'pix', op: 0.7 }, 'pixlight', 1),
        P('giftbox', { x: 1000, y: 930, s: BOX * 1.3, label: true, stamp: 1, heart: true }, 'box', 2),
        zero([{ x: 1150, y: 930 - 120 * BOX * 1.3 + 125, face: 10, fl: [120, 196], fr: [134, 200], hl: [70, 186], hr: [118, 166], look: [-6, 4], headR: 8 }], { z: 4 }), vig(0.85)],
    },
    // ===== s08b: SYSTEM VIEW. PIX switches the world to what the machine reads; ZERO's heart doesn't count =====
    {
      lines: [N("To the system, it's this.", { at: 0.3 }), N('A barcode.', { gap: 0.15 }), N('An address,', { gap: 0.1 }), N('a service level,', { gap: 0.1 }), N('a deadline.')], min: 6, bg: '#06070F',
      actors: [...tunnel({ speed: 300 }), sysOn({ t: 0.2 }),
        P('biglabel', [{ x: 900, y: 560, s: 0.2, sys: 1, hl: 0, o: 0, ui: true }, { t: 0.4, o: 1, e: 'step' }, { t: 1.1, s: 1.15, e: 'back' }, { l: 1, hl: 1, e: 'step' }, { l: 2, hl: 2, e: 'step' }, { l: 3, hl: 3, e: 'step' }, { l: 4, hl: 4, e: 'step' }], 'label', 45),
        P('holo', [{ x: 330, y: 930, w: 330, h: 110, txt: 'NOT SCANNED', size: 24, color: '#FF8A9A', on: 0, ui: true }, { l: 2, on: 0 }, { l: 2, t: 0.3, on: 1, e: 'out' }], 'joke', 46),
        P('icon', [{ x: 330, y: 820, k: 'heart', s: 0.9, o: 0, ui: true, color: '#FF8A9A' }, { l: 2, t: 0.3, o: 1, e: 'step' }], 'jk', 47),
        ui(pix([{ x: 1650, y: 280, s: 1.4, face: 3 }, { l: 2, t: 0.5, face: 1 }])),
        ui(zero([{ x: 1640, y: 1010, s: 2.0, face: 4, look: [-8, -4], o: 0, flip: true }, { t: 1.0, o: 1, e: 'step' }, { l: 1, pose: 'point', look: [8, -2] }, { l: 4, t: 0.4, face: 6 }], { z: 48 })),
      ],
      sfx: [sfx('whoosh', 0.2, { g: 0.6 }), sfx('scan', 0.3, { g: 0.6 }), sfx('ping', 0, { l: 1, g: 0.25 }), sfx('ping', 0, { l: 2, g: 0.25 }), sfx('ping', 0, { l: 3, g: 0.25 }), sfx('ping', 0, { l: 4, g: 0.25 })],
    },
    // ===== s09a: top-down. Three belts, workers walking the aisle; ZERO's box rides under a scanner: beep =====
    {
      lines: [N('Every time the box passes a scanner, the system learns where it is.')], min: 4.6, bg: '#1A1D2E',
      cam: cam({ z: 1, x: 960, y: 540 }, { end: 0, z: 1.08, x: 1000, y: 540, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#14172A' }, 'floor', -20),
        P('rect', { x: 960, y: 330, w: 3000, h: 60, fill: '#2A2E40' }, 'aisle', -19),
        P('topbelt', { x: 960, y: 110, speed: 90, w: 3000 }, 'tb0', -10), P('topbelt', { x: 960, y: 560, speed: 160, w: 3000 }, 'tb', -10), P('topbelt', { x: 960, y: 1010, speed: 120, w: 3000 }, 'tb2', -10),
        ...[0, 1, 2, 3, 4].map(i => P('topparcel', [{ x: -200 + i * 480, y: 110, s: 1, v: i, tilt: (i % 3) * 4 }, { u: 1, x: -200 + i * 480 + 90 * 4.6, e: 'lin' }], 'tp0' + i, -5)),
        ...[0, 1, 2, 3, 4].map(i => P('topparcel', [{ x: -100 + i * 450, y: 1010, s: 1, v: i + 2, tilt: -(i % 2) * 5 }, { u: 1, x: -100 + i * 450 + 120 * 4.6, e: 'lin' }], 'tp2' + i, -5)),
        P('persontop', [{ x: 300, y: 330, s: 1.2, r: 0 }, { u: 1, x: 760, e: 'lin' }], 'w1', 3),
        P('persontop', [{ x: 1700, y: 340, s: 1.2, r: 180, hat: '#FF8A3C', seed: 2 }, { u: 1, x: 1300, e: 'lin' }], 'w2', 3),
        P('rect', { x: 1060, y: 560, w: 34, h: 420, fill: '#5C6684' }, 'archbar', 5),
        P('rect', [{ x: 1060, y: 560, w: 8, h: 380, fill: '#FF5A4E' }, { u: 0.52, fill: '#FFE7A0', e: 'step' }, { u: 0.6, fill: '#FF5A4E', e: 'step' }], 'laser', 6),
        P('pool', [{ x: 1060, y: 560, rx: 160, ry: 260, kind: 'sodium', op: 0.4 }, { u: 0.52, kind: 'pix', op: 1, e: 'step' }, { u: 0.62, kind: 'sodium', op: 0.4, e: 'step' }], 'lp', 4),
        P('topbox', [{ x: 300, y: 560, s: 1.2, tape: 1, bow: true, label: true }, { u: 1, x: 1560, e: 'lin' }], 'box', 0),
        P('zerotop', [{ x: 290, y: 560, s: 0.9, r: -90, look: 0 }, { u: 0.5, x: 290 + 1260 * 0.5, look: 0, e: 'lin' }, { u: 0.56, x: 290 + 1260 * 0.56, look: 1, e: 'lin' }, { u: 1, x: 1550, e: 'lin' }], 'zt', 1),
        ...[0, 1].map(i => P('topparcel', [{ x: -300 - i * 300, y: 560, s: 1, v: i + 1 }, { u: 1, x: 960 - i * 300, e: 'lin' }], 'pp' + i, 0)),
        P('holo', [{ x: 1250, y: 330, w: 380, h: 110, txt: 'SCAN 1 · 6:58 PM', size: 28, on: 0 }, { u: 0.53, on: 0 }, { u: 0.6, on: 1, e: 'out' }], 'scan1', 9),
        vig(0.7)],
      sfx: [sfx('belt', 0, { g: 0.4, bed: true }), sfx('scan', 0, { u: 0.52, g: 0.8 })],
    },
    // ===== s09b: the map: each scan is a dot =====
    {
      lines: [N("That's what tracking really is.")], min: 2.6, bg: '#06070F',
      cam: cam({ z: 1.2, x: 700, y: 560 }, { end: 0, z: 1.0, x: 960, y: 540, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#081326' }, 'bg', -20), sysOn({ t: -1 }),
        P('usmap', [{ x: 960, y: 560, s: 3.3, tone: 'holo', dots: [route(0)], prog: 0 }, { t: 1.0, dots: [route(0), route(0.06)], e: 'step' }], 'map', 0),
        pix([{ x: 1700, y: 300, s: 1.4, face: 3 }])],
      sfx: [sfx('scan', 1.0, { g: 0.6 })],
    },
    // ===== s09c: ZERO's theory: there must be a GPS in there. PIX shakes its head =====
    {
      lines: [N('Not a GPS inside your box.')], min: 2.8, bg: '#06070F',
      cam: cam({ z: 1.6, x: 1000, y: 720 }),
      actors: [...tunnel({ speed: 300 }), P('pool', { x: 760, y: 640, rx: 520, ry: 420, kind: 'pix', op: 0.7 }, 'pixlight', 1),
        P('giftbox', [{ x: 1000, y: 930, s: BOX * 1.3, label: true, stamp: 1, tilt: 0 }, { t: 0.4, tilt: -14, e: 'out' }, { t: 2.0, tilt: -14 }, { t: 2.3, tilt: 0, e: 'in' }], 'box', 2),
        zero([{ x: 1250, face: 4, pose: 'reach', hr: [40, 190], hl: [52, 200], lean: -10, flip: true, look: [-8, 6], headR: 12 }, { t: 1.4, face: 1, look: [-4, -6], headR: 0, lean: 0, pose: 'neutral', hr: null, hl: null }], { z: 4 }),
        P('holo', [{ x: 760, y: 460, w: 260, h: 210, icon: 'gps', txt: 'GPS?', size: 30, on: 0 }, { t: 0.5, on: 1, e: 'out' }], 'hg', 8),
        P('text', [{ x: 760, y: 440, txt: '✕', size: 260, color: '#FF5A4E', o: 0 }, { t: 1.2, o: 1, e: 'step' }], 'x', 9),
        pix([{ x: 600, y: 330, s: 1.3, face: 5 }, { t: 1.2, face: 1, spin: -20 }, { t: 1.4, spin: 20 }, { t: 1.6, spin: -20 }, { t: 1.8, spin: 0 }]), vig(0.85)],
      sfx: [sfx('roll', 0.3, { g: 0.3 }), sfx('error', 1.2, { g: 0.5 })],
    },
    // ===== s09d: the trail: dots appear along the route; beyond the last one, a question mark =====
    {
      lines: [N('A trail of scans.')], min: 2.6, hold: 0.9, bg: '#06070F',
      cam: cam({ z: 1.3, x: 760, y: 600 }, { end: 0, z: 0.95, x: 960, y: 540, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#081326' }, 'bg', -20), sysOn({ t: -1 }),
        P('usmap', [{ x: 960, y: 560, s: 3.3, tone: 'holo', dots: [0, 0.06].map(route), prog: 0 },
          { t: 0.3, dots: [0, 0.06, 0.12].map(route), e: 'step' }, { t: 0.6, dots: [0, 0.06, 0.12, 0.18].map(route), e: 'step' }, { t: 0.9, dots: [0, 0.06, 0.12, 0.18, 0.24].map(route), prog: 0.24, e: 'step' }, { end: 0.2, prog: 0.24 }], 'map', 0),
        P('text', [{ x: 960 + (route(0.42)[0] - 206) * 3.3, y: 560 + (route(0.42)[1] - 122) * 3.3, txt: '?', size: 120, color: '#FFC93C', o: 0 }, { t: 1.1, o: 1, e: 'step' }], 'q', 2),
        pix([{ x: 1700, y: 300, s: 1.4, face: 0 }])],
      sfx: [sfx('scan', 0.3, { g: 0.5 }), sfx('scan', 0.6, { g: 0.5 }), sfx('scan', 0.9, { g: 0.5 })],
    },
    // ===== s10a: the road to the airport, in the rain. The truck is cut open so we can see inside =====
    {
      lines: [N('From the counter, the box goes to a truck heading for the airport.')], min: 4.4, bg: '#0B0F26',
      cam: cam({ z: 0.85, x: 960, y: 520 }, { end: 0, z: 0.9, x: 940, y: 520, e: 'lin' }),
      actors: [...road(), P('roadsign', [{ x: 2500, y: 520, txt: 'AIRPORT →' }, { u: 1, x: -600, e: 'lin' }], 'sign', -12),
        P('truck', { x: 900, y: 830, s: 0.95 }, 'truck', 0),
        P('giftbox', { x: 760, y: 802, s: 0.55, label: true, stamp: 1 }, 'box', 2),
        zero([{ x: 760, y: 772, s: 1.1, face: 0, fl: [120, 196], fr: [134, 200], look: [6, -2] }], { z: 3 }),
        vig(0.7)],
      sfx: [sfx('rain', 0, { g: 0.5, bed: true }), sfx('engine', 0, { g: 0.45, bed: true })],
    },
    // ===== s10b-d: close. It's raining; a drop finds ZERO's head; then the label, which he never looks at =====
    {
      lines: [N("It's raining."), N("The box doesn't care.", { gap: 0.4 }), N('ZERO does.')], min: 5, hold: 0.9, bg: '#0B0F26',
      cam: cam({ z: 2.4, x: 760, y: 640, shake: 1 }, { l: 1, z: 2.4, x: 760, y: 700 }, { l: 2, z: 2.1, x: 770, y: 640, e: 'io' }),
      actors: [...road({ close: true }), P('truck', { x: 900, y: 830, s: 0.95 }, 'truck', 0),
        P('giftbox', [{ x: 760, y: 802, s: 0.55, label: true, stamp: 1, wet: 0 }, { l: 1, wet: 0 }, { l: 2, wet: 0.5, e: 'lin' }], 'box', 2),
        P('drip', [{ x: 772, y: 330, len: 330, period: 1.6, ph: 0.4 }, { l: 1, x: 742, len: 455, ph: 0 }], 'drip', 4),
        zero([{ x: 760, y: 772, s: 1.1, face: 0, fl: [120, 196], fr: [134, 200], look: [6, -2] }, { l: 0, t: 0.55, squash: 0.9, face: 3, look: [0, -8], e: 'step' }, { l: 0, t: 0.8, squash: 1 },
          { l: 2, face: 9, hr: [104, 100], look: [0, -6] }, { l: 2, t: 0.25, x: 763 }, { l: 2, t: 0.33, x: 757 }, { l: 2, t: 0.41, x: 763 }, { l: 2, t: 0.49, x: 757 }, { l: 2, t: 0.57, x: 760 }], { z: 3 }),
        vig(0.75)],
      sfx: [sfx('rain', 0, { g: 0.55, bed: true }), sfx('engine', 0, { g: 0.35, bed: true }), sfx('drop', 0.75, { g: 0.7 })],
    },
    // ===== s11a: who pays. Tags swing onto the truck, the driver, the fuel =====
    {
      lines: [N('Somebody is paying for this truck,'), N('this driver,', { gap: 0.15 }), N('and this fuel.')], min: 4.2, bg: '#0B0F26',
      cam: cam({ z: 0.85, x: 960, y: 520 }, { end: 0, z: 0.9, x: 1000, y: 520, e: 'lin' }),
      actors: [...road(), P('truck', { x: 900, y: 830, s: 0.95, fuel: true }, 'truck', 0),
        P('giftbox', { x: 760, y: 802, s: 0.55, label: true, stamp: 1, wet: 0.5 }, 'box', 2),
        zero([{ x: 760, y: 772, s: 1.1, face: 9, fl: [120, 196], fr: [134, 200], look: [6, -4] }], { z: 3 }),
        P('pricetag', [{ x: 400, y: 260, s: 1.4, o: 0, seed: 1 }, { l: 0, t: 0.9, o: 1, e: 'step' }], 't1', 6),
        P('pricetag', [{ x: 1300, y: 420, s: 1.2, o: 0, seed: 2 }, { l: 1, o: 1, e: 'step' }], 't2', 6),
        P('pricetag', [{ x: 1090, y: 790, s: 1.2, o: 0, seed: 3 }, { l: 2, t: 0.4, o: 1, e: 'step' }], 't3', 6),
        vig(0.7)],
      sfx: [sfx('rain', 0, { g: 0.45, bed: true }), sfx('engine', 0, { g: 0.35, bed: true }), sfx('coin', 0.9, { g: 0.5 }), sfx('coin', 0, { l: 1, g: 0.5 }), sfx('coin', 0.4, { l: 2, g: 0.5 })],
    },
    // ===== s11b: insert. Nobody is looking at the label. The ink starts to run =====
    {
      lines: [N('Keep that in mind.', { at: 0.4 })], min: 3.6, hold: 1.6, bg: '#0B0F26',
      cam: cam({ z: 1, x: 960, y: 540 }, { end: 1.2, z: 1.08, x: 1000, y: 600, e: 'lin' }, { end: 0, black: 1, z: 1.1, e: 'in' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#2A2638' }, 'bg', -20), P('pool', { x: 900, y: 500, rx: 900, ry: 600, kind: 'warm', op: 0.5 }, 'pl', -19),
        P('biglabel', [{ x: 960, y: 560, s: 1.1, wet: 0.15, tilt: -3 }, { u: 0.45, wet: 0.15 }, { u: 0.5, wet: 0.55, e: 'out' }, { u: 1, wet: 0.7 }], 'label', 0),
        P('drip', { x: 1060, y: -40, len: 690, period: 2.2, ph: 0.5 }, 'drip', 2),
        P('rain', { x: 960, y: 540, w: 2200, h: 1300, n: 40, ang: -10, op: 0.25 }, 'rn', 3), vig(0.9)],
      sfx: [sfx('rain', 0, { g: 0.4, bed: true }), sfx('drop', 1.0, { g: 0.8 }), sfx('tension', 1.4, { g: 0.7 })],
    },
  ],
};
