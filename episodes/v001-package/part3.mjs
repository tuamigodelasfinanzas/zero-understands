// Video 001 "Where Your Package Goes While You Sleep", part 3 (script scenes s27-s48): why the hub, who pays, the
// night as the product, the wet label, the storm, the networks of the world, the delivery, the recap.
// Direction: docs/mundo-vivo.md. ZERO rides what we follow: he holds the end of the direct route, gets squeezed
// in the hold, drops his coin into the plane, chases the box onto the exceptions belt, dives into the last
// container, rides the van's roof and is found asleep inside the box.
import { G, N, zero, pix, sfx, cam, walk, lookCam, stepBack, leanIn, tilt, shrug } from '../../src/kit.mjs';
import { BOX, P, vig, sysOn, ui, ZB, VEST, rampSet, hubSet, usView, HX, HY } from './common.mjs';
import { ironyBeat, endMark } from '../../src/story.mjs';

const NET = '#081326';                      // the deep blue of SYSTEM VIEW
const FIX = { ...ZB, wet: 0.7 };            // the label as it is now: the rain got into the ZIP

// the night road from part 1 (truck cut open, rain), for the one-second flashback
const road = () => [
  P('road', { x: 960, y: 900, speed: 900 }, 'road', -20),
  P('rain', { x: 960, y: 500, w: 2600, h: 1300, n: 140, ang: -14, op: 0.55, ground: 380 }, 'rain', -15),
];

// the storm over the ramp: clouds, bolts and a coral cast over everything below the vignette
const storm = (coral = 0.3, k = []) => [
  P('lightning', [{ x: 960, y: 900, coral }, ...k], 'storm', -1),
  P('rain', { x: 960, y: 540, w: 2600, h: 1300, n: 120, ang: -18, op: 0.45, ground: 420 }, 'rain', 29),
];

// the netdiagram sits in the middle of the frame: ZERO's dot at screen (260, 580), mom's heart at (1660, 480)
const NETD = (k) => P('netdiagram', [{ x: 960, y: 540, dots: 0, direct: 0, mesh: 0, star: 0, ...k[0] }, ...k.slice(1)], 'net', 0);

// the world at night (equirectangular, s 1.9 fills the frame); Louisville at screen (508, 338), Memphis (485, 355),
// Leipzig (1025, 336)
const WORLD = (k) => P('worldmap', [{ x: 960, y: 540, s: 1.9, lou: 1, mem: 0, lei: 0, ...k[0] }, ...k.slice(1)], 'wm', 0);

// a recap photo crossing the frame right to left during line l, pausing in front of ZERO
const recap = (l, k, txt, tilt0, id) => P('photo', [{ x: 2300, y: 470, s: 1.2, k, txt, tilt: tilt0 }, { l, x: 2300 }, { l, t: 0.5, x: 1160, tilt: tilt0 * 0.5, e: 'out' }, { l: l + 1, x: 1160 }, { l: l + 1, t: 0.4, x: -400, tilt: -tilt0, e: 'in' }], id, 2);

export default {
  id: 'v001-part3',
  format: 'long',
  title: 'Where Your Package Goes While You Sleep (animatic, part 3)',
  description: 'Animatic of video 001, from why the hub exists to the delivery.',
  tags: ['how it works', 'logistics', 'packages', 'air cargo', 'hub and spoke'],
  music: 'curious', musicGain: 0.06,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.38,
  beats: [
    // ===== s27: SYSTEM VIEW. Two dots. ZERO draws the straight line to mom himself, then shrugs =====
    {
      lines: [N('So why fly everything to Kentucky first?', { at: 0.4 }), N("Wouldn't it be faster to fly straight to mom?", { gap: 0.3 })], min: 6, bg: NET,
      tin: { type: 'iris', x: 960, y: 540, dur: 0.6, color: '#05060D' },
      cam: cam({ z: 1, x: 960, y: 540 }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: NET }, 'bg', -20), sysOn({ t: -1 }),
        NETD([{}, { l: 1, direct: 0 }, { l: 1, t: 1.6, direct: 1, e: 'io' }]),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 0, flip: true, look: [-8, -6] }, { l: 1, pose: 'neutral' }, { l: 1, t: 0.3, pose: 'point', face: 2, e: 'out' }, ...shrug({ l: 1, t: 2.0 }, { from: 'point', face: 1, hold: 0.8 }).map(k => ({ ...k, flip: true }))], { z: 48 }))],
      sfx: [sfx('whoosh', 0.2, { g: 0.3 }), sfx('swipe', 0.4, { l: 1, g: 0.3 })],
    },
    // ===== s28: fifty cities. Every one to every other: a coral tangle. Through one hub: a yellow star =====
    {
      lines: [N('Picture fifty cities.'), N('To connect every city directly to every other city, you need one thousand two hundred and twenty-five routes.', { gap: 0.3 }), N('Send everything through one hub, and you need fifty.', { gap: 0.4 })], min: 14, hold: 0.8, bg: NET,
      cam: cam({ z: 1, x: 960, y: 540 }, { l: 1, z: 1 }, { l: 1, t: 3, z: 1.06, e: 'lin' }, { l: 2, z: 1.06 }, { l: 2, t: 0.6, z: 1, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: NET }, 'bg', -20), sysOn({ t: -1 }),
        NETD([{ direct: 1 }, { t: 0.2, dots: 0, direct: 1 }, { t: 1.0, dots: 1, direct: 0, e: 'out' }, { l: 1, mesh: 0 }, { l: 1, t: 4.4, mesh: 1, e: 'in' }, { l: 2, mesh: 1, mop: 1, star: 0 }, { l: 2, t: 0.6, mop: 0, e: 'io' }, { l: 2, t: 2.8, star: 1, e: 'io' }]),
        ui(P('holo', [{ x: 960, y: 980, w: 520, h: 110, txt: '1,225 ROUTES', size: 40, tc: '#FF8A7A', color: '#FF8A7A', on: 0 }, { l: 1, t: 3.8, on: 0 }, { l: 1, t: 4.2, on: 1, e: 'out' }, { l: 2, on: 1 }, { l: 2, t: 0.4, on: 0 }], 'hm', 46)),
        ui(P('holo', [{ x: 960, y: 980, w: 520, h: 110, txt: '50 ROUTES', size: 40, on: 0 }, { l: 2, t: 2.6, on: 0 }, { l: 2, t: 3.0, on: 1, e: 'out' }], 'hs', 46)),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 0, flip: true, look: [-8, -6] }, { l: 1, t: 2.4, face: 3, look: [-8, -8] }, { l: 1, t: 4.4, face: 9, headR: 8 }, { l: 2, t: 2.8, face: 2, headR: 0 }, { l: 2, t: 3.4, face: 1, look: [0, 1] }], { z: 48 }))],
      sfx: [...[0.3, 0.5, 0.7, 0.9].map(t => sfx('click', t, { g: 0.15 })), sfx('tension', 2.0, { l: 1, g: 0.35 }), sfx('whoosh', 0.3, { l: 2, g: 0.35 }), sfx('ping', 2.9, { l: 2, g: 0.45 })],
    },
    // ===== s29a: an imagined plane flying one box: the hold empty but for ZERO and his box =====
    {
      lines: [N('Fewer routes means fuller planes.'), N("The plane to mom's city doesn't carry one box.", { gap: 0.3 })], min: 5.4, bg: '#22263C',
      cam: cam({ z: 1.35, x: 1100, y: 780, shake: 1 }, { end: 0, z: 1.4, x: 1100, y: 790, e: 'lin' }),
      actors: [P('hold', { x: 960, y: 1000, red: 0.3 }, 'hold', -20),
        P('giftbox', { x: 1040, y: 1000, s: BOX * 0.62, ...FIX }, 'box', -3),
        zero([{ x: 1180, y: 1000, s: 1.6, face: 0, look: [-8, -2], flip: true }, { l: 1, look: [-8, -4] }, { l: 1, t: 0.5, look: [8, -6], headR: 8, face: 4 }, { l: 1, t: 1.6, look: [-8, 0], headR: -6 }]), vig(0.8)],
      sfx: [sfx('engine', 0, { g: 0.35, bed: true })],
    },
    // ===== s29b: containers from every city slide in until ZERO has to make room =====
    {
      lines: [N("It carries every box, from every city, that's going there tonight.")], min: 4.8, hold: 0.8, bg: '#22263C',
      cam: cam({ z: 1.4, x: 1100, y: 790, shake: 1 }, { t: 0.3, z: 1.4, x: 1100, y: 790 }, { t: 2.2, z: 0.92, x: 960, y: 700, e: 'io' }),
      actors: [P('hold', { x: 960, y: 1000, red: 0.3 }, 'hold', -20),
        ...[['LAX', 1], ['SEA', 2], ['ORD', 3], ['DFW', 4], ['ATL', 5]].map(([dest, seed], i) => P('uld', [{ x: -900, y: 990, s: 1.2, fill: 0.85, seed, door: 0, dest }, { t: 0.2 + i * 0.4, x: -900 }, { t: 0.75 + i * 0.4, x: 100 + i * 360, e: 'out' }], 'u' + i, -6)),
        P('giftbox', [{ x: 1040, y: 1000, s: BOX * 0.62, ...FIX }, { t: 1.6, x: 1040 }, { t: 2.0, x: 1730, e: 'out' }], 'box', -3),
        zero([{ x: 1180, y: 1000, s: 1.6, face: 0, look: [-8, -2], flip: true }, { t: 1.2, face: 3 }, { t: 1.7, x: 1600, pose: 'back', e: 'out' }, { t: 2.4, x: 1880, squash: 0.85, pose: 'crossed', face: 9, e: 'out' }, { t: 3.4, face: 1, look: [0, 1] }], { z: 6 }), vig(0.8)],
      sfx: [sfx('engine', 0, { g: 0.35, bed: true }), ...[0, 1, 2, 3, 4].map(i => sfx('roll', 0.3 + i * 0.4, { g: 0.25 })), sfx('thud', 2.4, { g: 0.4 })],
    },
    // ===== s30a: who pays. ZERO opens his hand: one coin. A little =====
    {
      lines: [N('And who pays for all of it?', { at: 0.3 }), N('ZERO did.', { gap: 0.4 }), N('A little.', { gap: 0.3 })], min: 5, bg: '#14172A',
      cam: cam({ z: 1.3, x: 960, y: 640 }, { l: 1, z: 1.3 }, { l: 1, t: 0.4, z: 1.6, x: 960, y: 600, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#14172A' }, 'bg', -20), P('pool', { x: 960, y: 640, rx: 600, ry: 520, kind: 'warm', op: 0.55 }, 'pl', -10),
        P('coin', [{ x: 1040, y: 780, s: 0.5, o: 0 }, { l: 1, t: 0.3, o: 1, e: 'step' }, { l: 2, roll: 0 }, { l: 2, t: 0.6, roll: 360, e: 'io' }], 'coin', 7),
        zero([{ x: 960, y: G + 40, s: 2.6, face: 0, look: [0, -2] }, { l: 1, hr: [140, 140] }, { l: 1, t: 0.3, hr: [150, 104], face: 0, look: [6, 2], e: 'out' }, ...lookCam({ l: 2, t: 0.1 }, { face: 1 })]), vig(0.75)],
      sfx: [sfx('coin', 0.3, { l: 1, g: 0.5 })],
    },
    // ===== s30b: the menu board from the store: the faster the promise, the higher the row =====
    {
      lines: [N('The faster the promise, the more the sender pays.')], min: 3.6, bg: '#2A2638',
      cam: cam({ z: 1.6, x: 1040, y: 260 }, { end: 0, z: 1.7, x: 1040, y: 260, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#2A2638' }, 'bg', -20),
        P('menuboard', [{ x: 1040, y: 230, hl: -1 }, { t: 0.4, hl: 0, e: 'step' }, { t: 1.2, hl: 1, e: 'step' }, { t: 2.0, hl: 2, e: 'step' }], 'menu', 0), vig(0.75)],
      sfx: [sfx('click', 0.4, { g: 0.3 }), sfx('click', 1.2, { g: 0.3 }), sfx('ping', 2.0, { g: 0.4 })],
    },
    // ===== s30c: ZERO's coin goes into the plane; everyone else's coins fill it; then the other planes =====
    {
      lines: [N("His few dollars rent a tiny piece of a very large plane, filled with everyone else's few dollars."), N("That's the business.", { gap: 0.4 }), N('Thousands of small payments, filling big planes, every single night.', { gap: 0.4 })], min: 12, hold: 1, bg: '#081326',
      cam: cam({ z: 1, x: 960, y: 520 }, { l: 2, z: 1 }, { l: 2, t: 1.6, z: 0.55, x: 960, y: 520, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 5000, h: 3000, fill: '#081326' }, 'bg', -20),
        P('coinplane', [{ x: 960, y: 460, s: 0.95, fill: 0.004, rise: 0 }, { t: 1.6, fill: 0.004, rise: 0 }, { t: 1.7, rise: 1, e: 'step' }, { l: 1, fill: 1, e: 'io' }], 'cp', 0),
        P('coinplane', [{ x: -900, y: 1300, s: 0.6, fill: 1, rise: 1, o: 0 }, { l: 2, t: 1.2, o: 0 }, { l: 2, t: 1.6, o: 1, e: 'step' }], 'cp2', -1),
        P('coinplane', [{ x: 2820, y: 1260, s: 0.6, fill: 0.7, rise: 1, o: 0 }, { l: 2, t: 1.4, o: 0 }, { l: 2, t: 1.8, o: 1, e: 'step' }], 'cp3', -1),
        P('coinplane', [{ x: 2700, y: -260, s: 0.5, fill: 0.9, rise: 1, o: 0 }, { l: 2, t: 1.6, o: 0 }, { l: 2, t: 2.0, o: 1, e: 'step' }], 'cp4', -1),
        P('coin', [{ x: 930, y: 900, s: 0.45 }, { t: 0.9, x: 930, y: 900 }, { t: 1.3, x: 700, y: 640, roll: 200, e: 'out' }, { t: 1.6, x: 680, y: 520, s: 0.35, roll: 360, e: 'in' }, { t: 1.62, o: 0, e: 'step' }], 'zc', 6),
        zero([{ x: 860, y: 1130, s: 1.9, face: 0, look: [-4, -8], hr: [150, 104] }, { t: 0.9, hr: [150, 104] }, { t: 1.2, hr: [120, 30], pose: 'neutral', e: 'out' }, { t: 1.7, face: 2, look: [-4, -8] }, ...lookCam({ l: 1, t: 0.2 }, { face: 0 })], { z: 5 }), vig(0.7)],
      sfx: [sfx('coin', 1.2, { g: 0.5 }), sfx('coin', 1.65, { g: 0.6 }), ...[2.4, 3.0, 3.5, 4.0, 4.4].map(t => sfx('coin', t, { g: 0.25 })), sfx('whoosh', 1.2, { l: 2, g: 0.4 })],
    },
    // ===== s31: the building grows block by block; coins pour like concrete. ZERO holds a hard hat, looking up =====
    {
      lines: [N("That's also why a company would pour concrete on this scale."), N('The expansion that UPS finished here in 2002 cost more than a billion dollars.', { gap: 0.3 }), N("At the time, it was the biggest project in the company's history.", { gap: 0.3 }),
        N('A billion dollars, to save a few hours.', { gap: 0.4 }), N('Because those few hours are exactly what people pay for.', { gap: 0.3 })], min: 18, hold: 1, bg: '#2A2F4A',
      cam: cam({ z: 0.9, x: 960, y: 520 }, { l: 3, z: 0.9, x: 960, y: 520 }, { l: 3, t: 0.8, z: 1.5, x: 1500, y: 700, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 4000, h: 3000, fill: '#2A2F4A' }, 'sky', -25),
        P('buildgrow', [{ x: 940, y: 960, s: 0.8, grow: 0.05, year: null }, { l: 2, t: 2, grow: 1, e: 'lin' }, { l: 1, t: 1.6, year: '2002', e: 'step' }], 'build', -10),
        P('holo', [{ x: 1500, y: 160, w: 500, h: 120, txt: '$1 BILLION+', size: 44, on: 0, ui: true }, { l: 1, t: 3.2, on: 0 }, { l: 1, t: 3.6, on: 1, e: 'out' }, { l: 3, on: 1 }, { l: 3, t: 0.6, on: 0 }], 'hb', 46),
        P('hardhat', [{ x: 1730, y: 950, s: 0.42, tilt: 10 }, { l: 3, t: 0.8, tilt: 4 }], 'hat', 6),
        zero([{ x: 1680, y: 1040, s: 1.6, face: 0, look: [-6, -8], headR: -10, hr: [150, 150] }, { l: 1, t: 3.4, face: 3, look: [-4, -8] }, { l: 3, face: 0, look: [-6, -8] }, { l: 3, t: 1.0, look: [0, -2], headR: 0 }, ...lookCam({ l: 4, t: 0.6 }, { face: 1 })], { z: 5 }), vig(0.7)],
      sfx: [...[0.6, 1.8, 3.0, 4.2, 5.4, 6.6, 7.8].map(t => sfx('clunk', t, { g: 0.25 })), sfx('ping', 3.6, { l: 1, g: 0.4 })],
    },
    // ===== s32: the night is the product. The sky turns, the clock hand sweeps evening to morning =====
    {
      lines: [N('And it all happens at night for a simple reason.'), N('Boxes are picked up in the evening,', { gap: 0.3 }), N('sorted while the country sleeps,', { gap: 0.15 }), N('and delivered in the morning.', { gap: 0.15 }), N('The night is the product.', { gap: 0.6 })], min: 12, hold: 1.4, bg: '#141729',
      cam: cam({ z: 0.92, x: 960, y: 520 }, { l: 4, z: 0.92 }, { l: 4, t: 1.2, z: 1.15, x: 960, y: 420, e: 'io' }),
      actors: [P('skyclock', [{ x: 960, y: 1020, prog: 0 }, { l: 1, prog: 0.02 }, { l: 1, t: 1.2, prog: 0.2, e: 'io' }, { l: 2, t: 1.4, prog: 0.55, e: 'io' }, { l: 3, t: 1.3, prog: 0.88, e: 'io' }, { l: 4, prog: 0.88 }, { l: 4, t: 1, prog: 0.95, e: 'out' }], 'sky', -20),
        P('pricetag', [{ x: 960, y: -400, s: 1.6, seed: 2 }, { l: 4, t: 0.4, y: -400 }, { l: 4, t: 1.1, y: 290, e: 'back' }], 'tag', 4),
        zero([{ x: 300, y: 1060, s: 1.6, face: 0, look: [6, -8], headR: -8 }, { l: 2, look: [8, -6] }, { l: 3, look: [4, -8] }, { l: 4, t: 1.2, face: 1, look: [0, 1], headR: 0 }], { z: 5 }), vig(0.6)],
      sfx: [sfx('tick', 0.4, { l: 1, g: 0.3 }), sfx('tick', 0.4, { l: 2, g: 0.3 }), sfx('tick', 0.4, { l: 3, g: 0.3 }), sfx('ping', 1.1, { l: 4, g: 0.45 })],
    },
    // ===== s33: the light turns coral. Distant thunder. ZERO freezes on the ramp =====
    {
      lines: [N("But tonight, there's a problem.", { at: 1.0 })], min: 3.6, bg: '#0B0F26',
      cam: cam({ z: 1.0, x: 960, y: 560 }, { end: 0, z: 1.08, x: 900, y: 600, e: 'lin' }),
      actors: [...rampSet(), ...storm(0, [{ t: 0.4, coral: 0, flash: 0 }, { t: 0.5, flash: 1, e: 'step' }, { t: 0.9, flash: 0, coral: 0.32 }]),
        zero([{ x: 380, y: 1010, s: 1.4, face: 0, look: [6, -6] }, { t: 0.55, face: 3, squash: 0.92, look: [4, -8], e: 'step' }, { t: 0.8, squash: 1 }]), vig(0.75)],
      sfx: [sfx('ramp', 0, { g: 0.4, bed: true }), sfx('rain', 0.5, { g: 0.4, bed: true }), sfx('thunder', 0.5, { g: 0.9 })],
    },
    // ===== s34a: flashback, grey: the drop on the label in the truck =====
    {
      lines: [N('Remember the rain?', { at: 0.2 })], min: 2.2, bg: '#0B0F26',
      cam: cam({ z: 2.2, x: 770, y: 660, gray: 1, shake: 1 }),
      actors: [...road(), P('truck', { x: 900, y: 830, s: 0.95 }, 'truck', 0),
        P('giftbox', [{ x: 760, y: 802, s: 0.55, label: true, stamp: 1, wet: 0.2 }, { u: 1, wet: 0.5 }], 'box', 2),
        P('drip', { x: 742, y: 330, len: 455, period: 1.6, ph: 0 }, 'drip', 4),
        zero([{ x: 760, y: 772, s: 1.1, face: 9, fl: [120, 196], fr: [134, 200], look: [0, -6], hr: [104, 100] }], { z: 3 }), vig(0.85)],
      sfx: [sfx('rain', 0, { g: 0.5, bed: true }), sfx('drop', 0.6, { g: 0.7 })],
    },
    // ===== s34b: the label now: the ZIP has run =====
    {
      lines: [N("ZERO's label got wet.")], min: 2.2, bg: '#2A2638',
      cam: cam({ z: 1, x: 960, y: 540 }, { end: 0, z: 1.12, x: 1080, y: 640, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#2A2638' }, 'bg', -20),
        P('biglabel', { x: 960, y: 560, s: 1.1, wet: 0.7, tilt: -3, hl: 5 }, 'label', 0), vig(0.85)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true })],
    },
    // ===== s34c: the camera tunnel fires, and comes back red: NO READ =====
    {
      lines: [N("And the cameras can't read it.", { at: 0.3 })], min: 3.4, hold: 0.4, bg: '#1B1F33',
      cam: cam({ z: 1.15, x: 960, y: 520 }),
      actors: [...hubSet({ fg: false, dim: 0.4 }),
        P('conveyor', { x: 960, y: 760, w: 4000, speed: 120, legs: 175 }, 'belt', -8),
        P('camtunnel', [{ x: 960, y: 728, flash: 0, lx: 0, ty: -70 }, { t: 0.9, flash: 1, red: true, e: 'step' }, { t: 1.2, flash: 0.4 }, { t: 1.3, flash: 1, e: 'step' }, { t: 1.7, flash: 0.3 }], 'tun', -4),
        P('giftbox', [{ x: 860, y: 730, s: BOX, ...FIX }, { u: 1, x: 1240, e: 'lin' }], 'box', -3.5),
        P('monitor', [{ x: 1380, y: 240, l1: 'READING…', size: 30 }, { t: 1.0, l1: 'NO READ', c1: '#FF6B5B', e: 'step' }], 'mon', -6),
        zero([{ x: 500, y: G + 40, s: 2.6, face: 0, look: [8, -4] }, { t: 1.0, face: 3, squash: 0.92, e: 'step' }, { t: 1.2, squash: 1, pose: 'scared' }]), vig(0.75)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('shutter', 0.9, { g: 0.7 }), sfx('error', 1.0, { g: 0.6 })],
    },
    // ===== s35: the box is pushed off onto the coral exceptions belt; ZERO runs after it =====
    {
      lines: [N('The box is pulled out of the flow.'), N('Now what?', { gap: 0.5 })], min: 4.4, hold: 0.6, bg: '#1B1F33',
      cam: cam({ z: 1.0, x: 960, y: 600 }, { l: 1, z: 1.0, x: 960, y: 600 }, { end: 0, z: 1.0, x: 1500, y: 680, e: 'io' }),
      actors: [...hubSet({ fg: false, dim: 0.4, clockX: 2400 }),
        P('conveyor', { x: 960, y: 600, w: 4000, speed: 160, legs: 335 }, 'main', -8),
        P('conveyor', { x: 2100, y: 940, w: 2200, speed: 120, legs: 0 }, 'exc', -7),
        P('rect', { x: 2100, y: 960, w: 2200, h: 12, fill: '#FF6B5B' }, 'excline', -6.5),
        P('plate', { x: 1500, y: 820, txt: 'EXCEPTIONS', w: 320, size: 30, color: '#FF8A7A' }, 'pe', -6),
        P('paddle', [{ x: 900, y: 600, s: 1.4, ang: -90 }, { t: 0.5, ang: -90 }, { t: 0.7, ang: -150, e: 'in' }, { t: 1.6, ang: -90, e: 'io' }], 'pad', -5),
        P('giftbox', [{ x: 600, y: 570, s: BOX, ...FIX }, { t: 0.65, x: 880, e: 'lin' }, { t: 1.1, x: 1080, y: 908, tilt: 18, e: 'in' }, { t: 1.25, tilt: 0 }, { u: 1, x: 2400, e: 'lin' }], 'box', -6),
        zero([{ x: 400, y: G + 60, s: 2.4, face: 0, look: [8, -6] }, { t: 0.7, face: 3, look: [8, 0] }, { l: 1, t: 0.4, pose: 'run', face: 8 }, { u: 1, x: 1900, pose: 'run', e: 'in' }], { z: 5 }), vig(0.75)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('clunk', 0.7, { g: 0.6 }), sfx('thud', 1.1, { g: 0.5 }), sfx('whoosh', 0.4, { l: 1, g: 0.35 })],
    },
    // ===== s36: the photo of the label goes to a person at a screen; ten seconds start =====
    {
      lines: [N('Now, a photo of the label goes to a person.'), N('A real one.', { gap: 0.3 }), N('When UPS showed how this works, that person had about ten seconds to figure out the ZIP code.', { gap: 0.4 }), N('If even that fails, someone checks the box by hand.', { gap: 0.3 })], min: 14, bg: '#1A1C2E',
      cam: cam({ z: 1.0, x: 960, y: 520 }, { l: 1, z: 1.0 }, { l: 1, t: 0.6, z: 1.3, x: 800, y: 640, e: 'io' }, { l: 2, z: 1.3 }, { l: 2, t: 0.8, z: 1.05, x: 1000, y: 520, e: 'io' }),
      actors: [P('telecode', [{ x: 960, y: 1000, cd: 1, n: 10, zip: '', wet: 0.7 }, { l: 2, t: 2.0, cd: 1, n: 10 }, ...[9, 8, 7, 6, 5, 4].map((n, i) => ({ l: 2, t: 2.8 + i * 0.85, n, e: 'step' })), { l: 2, t: 2.0 + 6 * 0.85, cd: 0.4, e: 'lin' }], 'tc', -10),
        zero([{ x: 1690, y: G + 60, s: 2.0, face: 0, look: [-8, -6], flip: true }, { l: 2, t: 2.8, face: 3, hl: [60, 120], hr: [150, 104] }, { l: 3, face: 9, look: [-8, -4] }], { z: 5 }), vig(0.7)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('swipe', 0.3, { g: 0.3 }), ...[9, 8, 7, 6, 5, 4].map((n, i) => sfx('tick', 2.8 + i * 0.85, { l: 2, g: 0.35 }))],
    },
    // ===== s37: three seconds left: the ZIP typed, green. ZERO breathes out =====
    {
      lines: [N('Three seconds left.', { at: 0.3 }), N('Got it.', { gap: 0.5 })], min: 4, hold: 0.8, bg: '#1A1C2E',
      cam: cam({ z: 1.05, x: 1000, y: 520 }, { l: 1, z: 1.05 }, { l: 1, t: 0.3, z: 1.4, x: 1240, y: 600, e: 'io' }),
      actors: [P('telecode', [{ x: 960, y: 1000, cd: 0.3, n: 3, zip: '0', wet: 0.7 }, { t: 0.5, zip: '04', e: 'step' }, { t: 0.8, zip: '041', e: 'step' }, { t: 1.1, zip: '0410', e: 'step' }, { l: 1, zip: '04101', e: 'step' }, { l: 1, ok: 1, e: 'step' }], 'tc', -10),
        zero([{ x: 1690, y: G + 60, s: 2.0, face: 3, look: [-8, -6], flip: true, hl: [60, 120], hr: [150, 104] }, { l: 1, t: 0.2, face: 1, hl: null, hr: null, squash: 0.94, e: 'out' }, { l: 1, t: 0.7, squash: 1, pose: 'point', face: 2 }], { z: 5 }), vig(0.7)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('tick', 0.3, { g: 0.35 }), ...[0.5, 0.8, 1.1].map(t => sfx('type', t, { g: 0.3 })), sfx('chime', 0, { l: 1, g: 0.55 })],
    },
    // ===== s38a: sometimes it's the whole night. The ramp under the storm =====
    {
      lines: [N("And sometimes the problem isn't one label.", { at: 0.3 })], min: 3.4, bg: '#0B0F26',
      cam: cam({ z: 0.95, x: 960, y: 540, shake: 2 }, { end: 0, z: 1.0, x: 960, y: 560, e: 'lin' }),
      actors: [...rampSet({ w1: { x: 1400, pose: 'stand', hold: null }, w1K: [] }), ...storm(0.4, [{ t: 1.0, flash: 1, e: 'step' }, { t: 1.4, flash: 0 }]),
        zero([{ x: 380, y: 1010, s: 1.4, face: 3, look: [6, -8], headR: -10 }]), vig(0.8)],
      sfx: [sfx('rain', 0, { g: 0.55, bed: true }), sfx('thunder', 1.0, { g: 1 })],
    },
    // ===== s38b: April 2, 2025: SYSTEM VIEW. The planes stop in their cities; the hub goes coral =====
    {
      lines: [N('On the night of April second, 2025, with severe storms on the way, UPS suspended its Next Day Air sort in Louisville and canceled incoming domestic flights.'), N('When the center of the network stops, the whole network feels it.', { gap: 0.5 })], min: 13, hold: 0.8, bg: '#06070F',
      cam: cam({ z: 1, x: 960, y: 540 }, { l: 1, z: 1 }, { l: 1, t: 2, z: 1.2, x: HX, y: HY, e: 'io' }),
      actors: [...usView([{ hub: true, hubLabel: 'LOUISVILLE, KY', arcs: 1 }, { t: 2.4, frozen: false }, { t: 2.5, frozen: true, arcColor: '#FF6B5B', hubColor: '#FF6B5B', e: 'step' }]),
        ui(P('holo', [{ x: 520, y: 990, w: 760, h: 120, txt: 'APR 2, 2025 · SORT SUSPENDED', size: 34, tc: '#FF8A7A', color: '#FF8A7A', on: 0 }, { t: 1.2, on: 0 }, { t: 1.6, on: 1, e: 'out' }], 'hd', 46)),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 3, flip: true, look: [-6, -6] }, { t: 2.6, face: 9 }], { z: 48 }))],
      sfx: [sfx('ping', 1.6, { g: 0.4 }), sfx('error', 2.5, { g: 0.5 }), sfx('tension', 0.4, { l: 1, g: 0.4 })],
    },
    // ===== s39a: the storm passes. The PWM container waits with its curtain up; ZERO dives in at the last second =====
    {
      lines: [N('Tonight, the storm passes.', { at: 0.4 })], min: 3.4, bg: '#0B0F26',
      cam: cam({ z: 1.6, x: 820, y: 680 }, { end: 0, z: 1.7, x: 800, y: 700, e: 'lin' }),
      actors: [...rampSet({ uldK: [null, [{ fill: 0.6, door: 1, yellow: true, dest: 'PWM', dc: '#FFC93C' }]], w1: { x: 1000, pose: 'stand', look: -0.4, hold: null }, w1K: [] }),
        ...storm(0.3, [{ u: 1, coral: 0, e: 'io' }]),
        zero([{ x: 1250, y: 975, s: 1.4, face: 0, look: [-6, -4], flip: true }, { t: 1.4, look: [-8, -6], face: 2 }]), vig(0.7)],
      sfx: [sfx('ramp', 0, { g: 0.45, bed: true }), sfx('rain', 0, { g: 0.4, bed: true, fade: 2 })],
    },
    {
      lines: [N("ZERO's box makes its plane.")], min: 3.6, hold: 0.6, bg: '#0B0F26',
      cam: cam({ z: 1.7, x: 800, y: 700 }),
      actors: [...rampSet({ uldK: [null, [{ fill: 0.6, door: 1, yellow: true, dest: 'PWM', dc: '#FFC93C' }]], w1: { x: 1000, pose: 'stand', look: -0.4, hold: null }, w1K: [] }),
        zero([{ x: 1250, y: 975, s: 1.4, face: 2, look: [-8, -6], flip: true }, { t: 0.4, pose: 'run', face: 8, flip: true }, { t: 1.1, x: 1000, y: 975, pose: 'run', flip: true, e: 'lin' }, { t: 1.5, x: 820, y: 760, s: 1.25, squash: 0.62, pose: 'crossed', face: 2, flip: true, e: 'out' }, { end: 0, face: 1, look: [0, 1] }], { z: 2 }),
        P('rect', [{ x: 760, y: 584, w: 312, h: 0, fill: '#9FC4D8', op: 0.42 }, { t: 1.8, y: 584, h: 0 }, { t: 2.3, y: 734, h: 300, e: 'io' }], 'curtain', 3),
        P('rect', [{ x: 760, y: 580, w: 320, h: 18, rx: 9, fill: '#8FB1C4' }, { t: 1.8, y: 580 }, { t: 2.3, y: 880, e: 'io' }], 'roll', 4), vig(0.7)],
      sfx: [sfx('ramp', 0, { g: 0.45, bed: true }), sfx('whoosh', 1.1, { g: 0.45 }), sfx('swipe', 1.8, { g: 0.35 }), sfx('clunk', 2.4, { g: 0.6 })],
    },
    // ===== s40: pull out: the jet, the airport, the city, until Worldport is a light among lights =====
    {
      lines: [N("And this isn't one building.", { at: 1.0 })], min: 4.4, bg: '#141729',
      cam: cam({ z: 1.5, x: 960, y: 560 }, { end: 0, z: 0.5, x: 960, y: 540, e: 'io' }),
      actors: [P('hubaerial', { x: 960, y: 540, city: true }, 'air', -20), vig(0.9)],
      tout: { type: 'iris', x: 960, y: 540, dur: 0.6, color: '#05060D' },
      sfx: [sfx('whoosh', 0.4, { g: 0.4 }), sfx('ramp', 0, { g: 0.3, bed: true })],
    },
    // ===== s41: the world at night. Memphis lights up with its own arcs; then Leipzig =====
    {
      lines: [N("In Memphis, FedEx's hub can handle about four hundred and eighty-four thousand packages an hour."), N("In Leipzig, Germany, DHL's hub sorts more than a hundred and fifty thousand shipments an hour.", { gap: 0.5 })], min: 13, bg: '#060B1A',
      tin: { type: 'iris', x: 508, y: 338, dur: 0.7, color: '#05060D' },
      cam: cam({ z: 2.2, x: 520, y: 360 }, { l: 1, z: 2.2, x: 520, y: 360 }, { l: 1, t: 1.0, z: 1.6, x: 770, y: 390, e: 'io' }),
      actors: [WORLD([{}, { t: 1.0, mem: 0 }, { t: 2.2, mem: 1, e: 'io' }, { l: 1, t: 1.2, lei: 0 }, { l: 1, t: 2.4, lei: 1, e: 'io' }]),
        ui(P('holo', [{ x: 520, y: 860, w: 640, h: 110, txt: 'MEMPHIS · ~484,000 / HOUR', size: 32, tc: '#C9B0FF', on: 0 }, { t: 2.0, on: 0 }, { t: 2.4, on: 1, e: 'out' }], 'hmem', 46)),
        ui(P('holo', [{ x: 1300, y: 860, w: 640, h: 110, txt: 'LEIPZIG · 150,000+ / HOUR', size: 32, tc: '#FFB877', on: 0 }, { l: 1, t: 2.2, on: 0 }, { l: 1, t: 2.6, on: 1, e: 'out' }], 'hlei', 46)), vig(0.5)],
      sfx: [sfx('ping', 2.2, { g: 0.4 }), sfx('ping', 2.4, { l: 1, g: 0.4 })],
    },
    // ===== s42: a normal night. In December, double the arcs, and snow. ZERO steps back =====
    {
      lines: [N('And this is a normal night.'), N('In December, the number of packages on a single day at Worldport can roughly double.', { gap: 0.4 })], min: 8, bg: '#060B1A',
      cam: cam({ z: 1.6, x: 770, y: 390 }),
      actors: [WORLD([{ mem: 1, lei: 1, dens: 1, snow: 0 }, { l: 1, t: 1.0, dens: 1, snow: 0 }, { l: 1, t: 2.6, dens: 2, snow: 1, e: 'io' }]),
        ui(P('holo', [{ x: 960, y: 980, w: 520, h: 110, txt: 'DECEMBER: ≈ ×2', size: 40, on: 0 }, { l: 1, t: 2.6, on: 0 }, { l: 1, t: 3.0, on: 1, e: 'out' }], 'hdec', 46)),
        ui(zero([{ x: 1760, y: 1060, s: 1.6, face: 0, flip: true, look: [-6, -6] }, ...stepBack({ l: 1, t: 2.8 }, 1760, { dx: 50, face: 3 }).map(k => ({ ...k, flip: true }))], { z: 48 }))],
      sfx: [sfx('whoosh', 2.6, { l: 1, g: 0.35 }), sfx('ping', 3.0, { l: 1, g: 0.35 })],
    },
    // ===== s43: the networks breathe in (every plane to its hub), and out (to the cities) =====
    {
      lines: [N('Every night, these networks breathe in.'), N('Every morning, they breathe out.', { gap: 0.5 })], min: 6, hold: 1, bg: '#060B1A',
      cam: cam({ z: 1.6, x: 770, y: 390 }, { l: 1, z: 1.6, x: 770, y: 390 }, { end: 0, z: 1.7, x: 770, y: 390, e: 'lin' }),
      actors: [WORLD([{ mem: 1, lei: 1, breath: -1 }, { l: 0, t: 0.2, breath: -1 }, { l: 0, t: 2.2, breath: -0.001, e: 'io' }, { l: 1, breath: 0.001, e: 'step' }, { l: 1, t: 2.2, breath: 1, e: 'io' }]),
        P('rect', [{ x: 960, y: 540, w: 1920, h: 1080, fill: '#F0A86A', op: 0, ui: true }, { l: 1, op: 0 }, { l: 1, t: 2.4, op: 0.12, e: 'io' }], 'dawn', 40)],
      sfx: [sfx('whoosh', 0.3, { g: 0.3 }), sfx('whoosh', 0.3, { l: 1, g: 0.3 })],
    },
    // ===== s44a: dawn. A different plane, a different truck. ZERO asleep on his box =====
    {
      lines: [N('A different plane.', { at: 0.4 }), N('A different truck.', { gap: 0.5 })], min: 4, bg: '#3A2E5C',
      cam: cam({ z: 0.92, x: 960, y: 520 }),
      actors: [P('rect', { x: 960, y: 300, w: 4000, h: 1400, fill: '#C9876A' }, 'sky', -26), P('rect', { x: 960, y: 1000, w: 4000, h: 400, fill: '#E9A878' }, 'low', -25),
        P('pool', { x: 1500, y: 980, rx: 1200, ry: 500, kind: 'warm', op: 0.8 }, 'sun', -24), P('rect', { x: 960, y: 1100, w: 4000, h: 200, fill: '#2A2F4A' }, 'ground', -12),
        P('cargojet', [{ x: 2600, y: 420, s: 0.4, tilt: -4, land: true, door: 0 }, { l: 0, t: 0, x: 2600 }, { l: 1, x: -800, y: 620, e: 'lin' }], 'jet', -10),
        P('rect', [{ x: 960, y: 540, w: 1920, h: 1080, fill: '#0B0F26', op: 0, ui: true }, { l: 1, op: 0 }, { l: 1, t: 0.15, op: 1, e: 'step' }], 'cut', 39),
        P('road', [{ x: 960, y: 900, speed: 900, o: 0, ui: true }, { l: 1, t: 0.15, o: 1, e: 'step' }], 'road', 39.5),
        P('truck', [{ x: 900, y: 830, s: 0.95, o: 0, ui: true }, { l: 1, t: 0.15, o: 1, e: 'step' }], 'truck', 40),
        P('giftbox', [{ x: 760, y: 802, s: 0.55, label: true, stamp: 1, wet: 0.7, o: 0, ui: true }, { l: 1, t: 0.15, o: 1, e: 'step' }], 'box', 41),
        ui(zero([{ x: 760, y: 772, s: 1.1, face: 11, fl: [120, 196], fr: [134, 200], headR: 14, o: 0 }, { l: 1, t: 0.15, o: 1, e: 'step' }], { z: 42 }))],
      sfx: [sfx('birds', 0, { g: 0.35, bed: true }), sfx('jet', 0, { g: 0.5 }), sfx('engine', 0, { l: 1, g: 0.4, bed: true })],
    },
    // ===== s44b: from above: the van, ZERO on its roof, right turn after right turn =====
    {
      lines: [N('And a van whose route was planned by software that famously avoids left turns.'), N('Turning left means waiting across traffic.', { gap: 0.3 }), N('UPS says skipping those turns saves up to ten million gallons of fuel a year.', { gap: 0.4 })], min: 15, hold: 1, bg: '#3A3F5C',
      cam: cam({ z: 1.0, x: 960, y: 540 }),
      actors: [P('neighborhood', [{ x: 1300, y: 300, s: 0.9, prog: 0, rider: true, look: 0 }, { t: 0.4, prog: 0 }, { u: 0.92, prog: 1, e: 'lin' }, { l: 2, t: 2.6, look: 1, e: 'step' }], 'nb', -10),
        ui(P('holo', [{ x: 520, y: 980, w: 860, h: 120, txt: 'UP TO 10M GALLONS OF FUEL / YEAR', size: 34, on: 0 }, { l: 2, t: 2.6, on: 0 }, { l: 2, t: 3.0, on: 1, e: 'out' }], 'hf', 46)), vig(0.5)],
      sfx: [sfx('birds', 0, { g: 0.3, bed: true }), sfx('engine', 0, { g: 0.25, bed: true }), sfx('ping', 3.0, { l: 2, g: 0.4 })],
    },
    // ===== s45: mom's door. The box, the card. 10:14 AM. The doorbell; the door opens on warm light only =====
    {
      lines: [N('Ten fourteen AM.', { at: 0.5 }), N('Delivered.', { gap: 0.5 }), N('Before the party.', { gap: 0.4 })], min: 6, hold: 1, bg: '#7A8CA8',
      cam: cam({ z: 1.0, x: 960, y: 520 }, { end: 0, z: 1.08, x: 960, y: 560, e: 'lin' }),
      actors: [P('doorstep', [{ x: 960, y: 1000, open: 0 }, { l: 2, t: 0.2, open: 0 }, { l: 2, t: 1.4, open: 0.25, e: 'io' }], 'door', -20),
        P('giftbox', { x: 960, y: 1010, s: BOX * 1.1, ...FIX }, 'box', -3),
        P('bdaycard', { x: 1110, y: 960, s: 0.9, tilt: 10 }, 'card', -2),
        ui(P('plate', [{ x: 1640, y: 120, txt: '10:14 AM', w: 280, size: 40, o: 0 }, { t: 0.5, o: 1, e: 'step' }], 'time', 46))],
      sfx: [sfx('birds', 0, { g: 0.3, bed: true }), sfx('doorbell', 0.2, { l: 1, g: 0.6 }), sfx('door', 0.2, { l: 2, g: 0.4 })],
    },
    // ===== s46: the box opens. ZERO asleep inside. He opens his eyes and looks at you =====
    {
      lines: [N('ZERO made it too.', { at: 0.8 }), N("He's still not sure how.", { gap: 0.4 }), N('You are.', { gap: 0.6 })], min: 6, hold: 1.4, bg: '#7A8CA8',
      cam: cam({ z: 1.8, x: 960, y: 820 }, { end: 0, z: 1.9, x: 960, y: 800, e: 'lin' }),
      actors: [P('doorstep', { x: 960, y: 1000, open: 0.25 }, 'door', -20),
        zero([{ x: 960, y: 950, s: 1.3, face: 11, look: [0, 0], headR: 12 }, { l: 1, t: 0.2, headR: 0, face: 0, e: 'io' }, { l: 1, t: 0.8, look: [4, -2] }, ...lookCam({ l: 2, t: 0.1 }, { face: 1 })], { z: -3.5 }),
        P('giftbox', [{ x: 960, y: 1010, s: BOX * 1.1, ...FIX, open: 0 }, { t: 0.2, open: 0 }, { t: 0.8, open: 1, e: 'out' }], 'box', -3),
        P('bdaycard', { x: 1110, y: 960, s: 0.9, tilt: 10 }, 'card', -2)],
      sfx: [sfx('birds', 0, { g: 0.3, bed: true }), sfx('swipe', 0.2, { g: 0.3 }), sfx('zero-boop', 0.2, { l: 1, g: 0.4 })],
    },
    // ===== s47: the recap. The night passes in front of ZERO as photos =====
    {
      lines: [N('So how did a box cross a country overnight?'), N('A label that turns it into data.', { gap: 0.4 }), N('A trail of scans.', { gap: 0.2 }), N('One giant building in the middle of the night.', { gap: 0.2 }),
        N("A lot of people awake so the rest of us don't have to be.", { gap: 0.2 }), N('And when something went wrong, one person, with about ten seconds.', { gap: 0.3 })], min: 18, hold: 0.6, bg: '#2A2638',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#2A2638' }, 'bg', -20), P('pool', { x: 1000, y: 560, rx: 900, ry: 560, kind: 'warm', op: 0.45 }, 'pl', -10),
        recap(1, 'label', 'THE LABEL', -6, 'r1'), recap(2, 'trail', 'THE SCANS', 5, 'r2'), recap(3, 'hub', 'THE HUB', -4, 'r3'), recap(4, 'people', 'THE NIGHT SHIFT', 6, 'r4'),
        P('photo', [{ x: 2300, y: 470, s: 1.2, k: 'ten', txt: '10 SECONDS', tilt: -5 }, { l: 5, x: 2300 }, { l: 5, t: 0.5, x: 1160, tilt: -2, e: 'out' }], 'r5', 2),
        zero([{ x: 480, y: G + 60, s: 2.6, face: 0, look: [8, -2] }, ...[1, 2, 3, 4, 5].flatMap(l => [{ l, t: 0.6, headR: 8, face: 1 }, { l, t: 0.9, headR: 0 }])], { z: 5 }), vig(0.7)],
      sfx: [...[1, 2, 3, 4, 5].map(l => sfx('swipe', 0, { l, g: 0.3 }))],
    },
    // ===== ZeroEnding, irony: ZERO climbs out on the step. His phone buzzes: the reminder he never set comes now =====
    ironyBeat({ at: { x: 700, y: 1005 }, s: 2.0, phone: ['', "Reminder: Mom's birthday is TODAY"],
      set: [P('doorstep', { x: 960, y: 1000, open: 0.25 }, 'door', -20), P('giftbox', { x: 960, y: 1010, s: BOX * 1.1, ...FIX, open: 1 }, 'box', -3), P('bdaycard', { x: 1110, y: 960, s: 0.9, tilt: 10 }, 'card', -2)],
      camK: cam({ z: 1.35, x: 860, y: 660 }, { end: 0, z: 1.45, x: 840, y: 650, e: 'lin' }) }),
    // ===== s48: back on the box. The question for next time; ZERO's look =====
    {
      act: 'understands', lines: [N("And if she doesn't like the gift?", { at: 0.4 }), N('Sending it back is an even stranger system.', { gap: 0.3 })], min: 5.2, hold: 1.0, bg: '#7A8CA8',
      cam: cam({ z: 1.4, x: 960, y: 700 }, { end: 0, z: 1.48, x: 960, y: 700, e: 'lin' }),
      actors: [P('doorstep', { x: 960, y: 1000, open: 0.25 }, 'door', -20),
        P('giftbox', { x: 960, y: 1010, s: BOX * 1.1, ...FIX }, 'box', -3),
        zero([{ x: 960, y: 876, s: 1.6, fl: [120, 196], fr: [134, 200], face: 0, look: [-6, -4] }, { l: 1, t: 0.3, look: [6, -2] }, ...lookCam({ l: 1, t: 1.4 }, { face: 4, tilt: 10 })], { z: 2 })],
      sfx: [sfx('birds', 0, { g: 0.25, bed: true })],
    },
    // ===== CLICK · ZERO UNDERSTANDS, on black. The end =====
    endMark(),
  ],
};
