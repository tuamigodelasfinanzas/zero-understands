// Video 002 "What Happens in the 2 Seconds After You Tap Your Card": part 3 (script scenes s32-s48). The night: the
// day's promises leave in one batch, the network adds up who owes whom, and at dawn the money finally moves between
// banks. The slices. Who pays for them (the man in the grey cap, paying cash). ZERO's bill. Next morning, same café,
// same tap: the nickel of cash back goes to the man behind him. CLICK.
import { G, N, zero, pix, sfx, cam, lookCam, tilt } from '../../src/kit.mjs';
import { endMark } from '../../src/story.mjs';
import { P, vig, ui, sysOn, FREEZE, TERM, ZX, hand, cafe, fiber, ride } from './common.mjs';

const TAP = [935, 545];
const STOOL = 150, ZSIT = G - 115;                                    // ZERO at his table by the window (part 2, s31)
const zSit = (k = [], o = {}) => zero([{ x: STOOL, y: ZSIT, s: 2.2, face: 2, pose: 'neutral', fl: [112, 200], fr: [128, 200], hl: [118, 126], hr: [140, 118], look: [8, 2] }, ...k], { z: 5, ...o });
const cupAt = (hr, o = {}) => { const [x, y] = hand(STOOL, ZSIT, hr, 2.2); return { x: x + 10, y: y + 30, s: 0.55, ...o }; };
const table = () => [P('cafetable', { x: 330, y: G + 30, s: 1.0 }, 'table', 1), P('stool', { x: STOOL, y: G + 40, s: 1.0 }, 'stool', 2)];
const night = (k) => P('rect', [{ x: 960, y: 540, w: 3000, h: 2000, fill: '#0A1030', op: 0 }, ...k], 'night', 20);
const warm = (k) => P('rect', [{ x: 960, y: 540, w: 3000, h: 2000, fill: '#FF9E45', op: 0 }, ...k], 'warm', 19);
const walker = (id, x0, x1, t0, dur, o = {}) => P('person', [{ x: x0, y: G + 20, s: 2.3, pose: 'walk', seed: o.seed ?? 5, shirt: o.shirt ?? '#5C6E8C', skin: o.skin ?? '#D8B08C', hair: o.hair ?? '#3A2A22', flip: x1 < x0, o: 0 }, { ...o.at, t: t0, o: 1, e: 'step' }, { ...o.at, t: t0 + dur, x: x1, e: 'lin' }, { ...o.at, t: t0 + dur + 0.05, o: 0, e: 'step' }], id, 4);

export default {
  id: 'v002-part3',
  format: 'long',
  title: 'What Happens in the 2 Seconds After You Tap Your Card (animatic, part 3)',
  description: 'Animatic of the third part of video 002.',
  tags: ['how it works', 'credit cards', 'payments'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // ===== s32: TIME-LAPSE. The day goes by at the café: people in and out, the terminal beeps, the green yeses pile
    // up in a tray; the wall clock races to 9 PM; ZERO dozes off and wakes up. 312 promises =====
    {
      lines: [N('ZERO decides to wait and see.', { at: 0.4 }), N('Coffee after coffee, the terminal collects every yes of the day.', { gap: 0.4 }), N('By nine PM, this one little machine is holding three hundred and twelve promises.', { gap: 0.6 })],
      min: 13, hold: 1.2, bg: '#2A1E18',
      cam: cam({ z: 1.0, x: 900, y: 520 }, { end: 0, z: 1.06, x: 900, y: 520, e: 'lin' }),
      actors: [...cafe({ term: { l2: 'APPROVED', ok: 1, timer: 1.92 }, esp: { pour: 0, cupFill: 0 }, man: { x: -600, o: 0 }, woman: { x: -600, o: 0 },
          termK: [...[1, 2, 3, 4, 5, 6, 7].flatMap(i => [{ l: 1, t: i * 0.6, l2: 'TAP CARD', ok: 0, timer: null, e: 'step' }, { l: 1, t: i * 0.6 + 0.25, l2: 'APPROVED', ok: 1, timer: 1.4 + (i % 3) * 0.2, e: 'step' }]), { l: 2, l2: 'CLOSED', ok: 0, timer: null, e: 'step' }],
          baristaK: [{ l: 1, pose: 'reach' }, { l: 1, t: 1.2, pose: 'stand' }, { l: 1, t: 2.4, pose: 'reach' }, { l: 1, t: 3.6, pose: 'stand' }, { l: 2, pose: 'stand', look: -0.4 }] }),
        P('wallclock', [{ x: 1760, y: 170, s: 0.75, h: 8.25, m: 0, sec: false }, { l: 0, t: 1.5, h: 8.25 }, { l: 2, t: 1.6, h: 21, e: 'io' }], 'clock', -14),
        P('capstack', [{ x: 1080, y: 611, s: 0.8, n: 1 }, { l: 1, n: 1 }, { l: 2, t: 2.5, n: 312, e: 'in' }], 'stack', -4),
        ...table(),
        walker('w1', -200, 2100, 0, 2.2, { at: { l: 1 }, seed: 11, shirt: '#8A5A4E' }), walker('w2', 2100, -200, 1.0, 2.0, { at: { l: 1 }, seed: 12, shirt: '#4E6B5A', skin: '#8E6450' }),
        walker('w3', -200, 2100, 2.4, 1.8, { at: { l: 1 }, seed: 13, shirt: '#6D5C7E' }), walker('w4', 2100, -200, 0.2, 1.8, { at: { l: 2 }, seed: 14, shirt: '#9C7A4E', skin: '#B9876A' }),
        zSit([{ l: 0, t: 0.6, face: 1, look: [8, -2] }, { l: 1, t: 1.0, face: 11, look: [0, 3], headR: 10 }, { l: 2, face: 3, headR: 0, look: [8, -2] }, { l: 2, t: 1.2, face: 0 }]),
        P('cup', [cupAt([140, 118], { steam: 0 })], 'cup', 6),
        warm([{ l: 1, t: 0.8, op: 0 }, { l: 1, t: 2.4, op: 0.16, e: 'io' }, { l: 2, op: 0, e: 'io' }]),
        night([{ l: 1, t: 2.4, op: 0 }, { l: 2, t: 1.2, op: 0.55, e: 'io' }]),
        P('statustag', [{ x: 1080, y: 470, s: 0.9, w: 400, txt: '312 PROMISES', color: '#58E08A', on: 0, ui: true }, { l: 2, t: 3.0, on: 0 }, { l: 2, t: 3.3, on: 1, e: 'out' }], 'n312', 46),
        vig(0.6)],
      sfx: [sfx('chatter', 0, { g: 0.3, bed: true, dur: 9 }), ...[1, 2, 3, 4, 5, 6, 7].map(i => sfx('beep', i * 0.6 + 0.25, { l: 1, g: 0.25 })), sfx('tape', 0.2, { l: 1, g: 0.2 }), sfx('roomtone', 0, { l: 2, g: 0.25, bed: true })],
    },
    // ===== s33: closing time. The barista presses CLOSE BATCH: the yeses tie up into one bale that slides into the
    // terminal. ZERO runs over and jumps on it =====
    {
      lines: [N('At closing time, it sends them all at once,', { at: 0.3 }), N('in one bundle.', { gap: 0.2 })], min: 5.4, hold: 0.4, bg: '#0A1030',
      cam: cam({ z: 1.3, x: 1000, y: 560 }, { t: 1.4, z: 1.3, x: 1000, y: 560 }, { end: 0, z: 2.2, x: TERM[0], y: 450, e: 'in' }),
      tout: { type: 'zoom', x: TERM[0], y: 440, dur: 0.6, color: '#0A0618' },
      actors: [...cafe({ term: { l2: 'CLOSE BATCH', ok: 0, s2: 13 }, esp: { pour: 0, cupFill: 0 }, man: { x: -600, o: 0 }, woman: { x: -600, o: 0 }, fg: false,
          baristaK: [{ pose: 'stand', look: -0.4 }, { t: 0.4, pose: 'reach', look: -0.8 }, { t: 1.0, pose: 'stand' }], termK: [{ t: 0.7, l2: 'SENDING…', e: 'step' }] }),
        P('wallclock', { x: 1760, y: 170, s: 0.75, h: 21, m: 2, sec: false }, 'clock', -14),
        P('capstack', [{ x: 1080, y: 611, s: 0.8, n: 312, o: 1 }, { t: 0.9, o: 0, e: 'step' }], 'stack', -4),
        P('bundle', [{ x: 1080, y: 560, s: 0.05, o: 0 }, { t: 0.85, o: 1, e: 'step' }, { t: 1.3, s: 0.42, e: 'back' }, { l: 1, t: 0.2, x: 1080, y: 560 }, { end: 0.3, x: TERM[0], y: 440, s: 0.05, e: 'in' }], 'bundle', 6),
        ...table(),
        zero([{ x: STOOL, y: ZSIT, s: 2.2, face: 3, fl: [112, 200], fr: [128, 200], look: [8, -2] }, { t: 1.2, x: 600, y: G, s: 2.0, pose: 'run', fl: null, fr: null, face: 8, e: 'io' }, { t: 1.9, x: 940, y: 470, s: 1.2, pose: 'celebrate', face: 2, e: 'out' },
          { l: 1, t: 0.2, x: 1070, y: 470, s: 1.0, pose: 'neutral', fl: [120, 196], fr: [134, 200], face: 2, e: 'in' }, { end: 0.3, x: TERM[0], y: 400, s: 0.05, e: 'in' }], { z: 7 }),
        night([{ op: 0.5 }]), vig(0.65)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('click', 0.4, { g: 0.6 }), sfx('tape', 0.9, { g: 0.4 }), sfx('pop', 1.3, { g: 0.4 }), sfx('whoosh', 1.4, { g: 0.5 }), sfx('whoosh', 0, { end: 0.6, g: 0.7 })],
    },
    // ===== s34: the network at night. The great hall is calm and dark; bundles from the whole country pile up; on the
    // big board each bank's long list folds into one number =====
    {
      lines: [N('Tonight, the network does something completely different.', { at: 0.4 }), N('It adds up who owes whom.', { gap: 0.4 }), N("Every bank's millions of coffees, groceries and plane tickets become one number.", { gap: 0.3 }), N('And each number is settled with one transfer,', { gap: 0.5 }), N('once a business day.', { gap: 0.1 })],
      min: 15, bg: '#070A1E',
      cam: cam({ z: 0.75, x: 960, y: 380 }, { l: 1, z: 1.0, x: 960, y: 470, e: 'io' }, { end: 0, z: 1.08, x: 960, y: 470, e: 'lin' }),
      actors: [P('nethall', { x: 960, y: G, speed: 0.2 }, 'net', -20), P('rect', { x: 960, y: 540, w: 4000, h: 3000, fill: '#05071A', op: 0.55 }, 'dark', -15),
        ...[[180, 860, -8], [330, 880, 6], [250, 790, 2], [1660, 870, -4], [1790, 860, 8], [1720, 790, -2]].map(([x, y, tl], i) => P('bundle', [{ x, y: y - 400, s: 0.32, tilt: tl, o: 0 }, { t: 0.3 + i * 0.35, o: 1, e: 'step' }, { t: 0.6 + i * 0.35, y, e: 'in' }], 'b' + i, 2)),
        P('settleboard', [{ x: 960, y: 420, s: 0.75, k: 0, hl: -1 }, { l: 2, t: 0.6, k: 0 }, { l: 2, t: 3.4, k: 1, e: 'io' }, { l: 3, hl: 2, e: 'step' }], 'board', 0),
        ...ride(560, 880, 0.55, { trail: 0, look: [6, -8], face: 0, cap: { o: 0 }, zK: [{ l: 2, t: 3.4, face: 3 }, { l: 3, face: 2, look: [8, -6] }] }),
        P('bundle', { x: 560, y: 900, s: 0.36, tilt: -4 }, 'zb', 3),
        pix([{ x: 720, y: 700, s: 0.7, face: 2 }, { l: 3, face: 1 }]), vig(0.75)],
      sfx: [sfx('hub', 0, { g: 0.2, bed: true }), sfx('thud', 0.6, { g: 0.3 }), sfx('thud', 1.3, { g: 0.3 }), sfx('thud', 2.0, { g: 0.3 }), sfx('tick', 0.6, { l: 2, g: 0.25 }), sfx('tick', 1.6, { l: 2, g: 0.25 }), sfx('tick', 2.6, { l: 2, g: 0.25 }), sfx('dato', 3.4, { l: 2, g: 0.5 })],
    },
    // ===== s35: dawn. Pipes between the banks; blocks of money finally slide through them; the café's bank lights up =====
    {
      lines: [N('And then, finally, the money moves.', { at: 0.4 }), N('Not four seventy-five at a time.', { gap: 0.4 }), N('In huge lumps, between banks.', { gap: 0.2 }), N("Within a day or two, the coffee shop's money lands in its account.", { gap: 0.5 })],
      min: 13, bg: '#0A0E26',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 520, e: 'lin' }),
      actors: [P('bankpipes', [{ x: 960, y: G, s: 0.7, dawn: 0, flow: 0 }, { l: 0, t: 0.8, flow: 0 }, { l: 0, t: 1.0, flow: 1, e: 'step' }, { end: 0, dawn: 1, e: 'io' }, { l: 3, t: 2.0, lit: 2, e: 'step' }], 'banks', -20),
        P('holo', [{ x: 960, y: 330, w: 380, h: 120, txt: 'NOT $4.75 AT A TIME', size: 28, color: '#FF9A8A', on: 0 }, { l: 1, t: 0.2, on: 1, e: 'out' }, { l: 2, on: 0, e: 'step' }], 'n475', 6),
        P('statustag', [{ x: 960 + 650 * 0.7, y: G - 700, s: 0.85, w: 380, txt: 'CAFÉ: PAID', color: '#58E08A', on: 0 }, { l: 3, t: 2.0, on: 0 }, { l: 3, t: 2.3, on: 1, e: 'out' }], 'paid', 7),
        zero([{ x: 960 - 300 * 0.7, y: G - 402 * 0.7, s: 1.1, face: 0, look: [8, -2], fl: [120, 196], fr: [134, 200] }, { l: 0, t: 1.2, face: 3 }, { l: 2, face: 2, look: [6, -4] }, { l: 3, t: 2.3, face: 2, look: [10, -2] }], { z: 5 }),
        vig(0.6)],
      sfx: [sfx('engine', 0.9, { g: 0.2, bed: true }), sfx('clunk', 1.0, { g: 0.5 }), sfx('birds', 0, { l: 3, g: 0.3, bed: true }), sfx('chime', 2.2, { l: 3, g: 0.4 })],
    },
    // ===== s36: pull-out to the whole country: by day a dust of blinking promises; by night a few thick lines =====
    {
      lines: [N('Every card payment in America works like this.', { at: 0.4 }), N('A two-second promise in the day.', { gap: 0.5 }), N('A giant settling of accounts at night.', { gap: 0.3 })], min: 9.5, hold: 1.2, bg: '#050817',
      cam: cam({ z: 1.15, x: 960, y: 540 }, { end: 0, z: 1.0, x: 960, y: 540, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#050817' }, 'bg', -20), P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: 'url(#wGrid)', op: 0.15 }, 'grid', -19),
        P('usnight', [{ x: 960, y: 500, s: 3.2, day: 0, night: 0 }, { l: 1, day: 0 }, { l: 1, t: 0.6, day: 1, e: 'out' }, { l: 2, day: 1 }, { l: 2, t: 1.2, day: 0.12, night: 1, e: 'io' }], 'us', 0),
        P('text', [{ x: 960, y: 1000, txt: 'DAY: PROMISES', size: 30, color: '#FFE7A0', o: 0 }, { l: 1, t: 0.6, o: 1, e: 'step' }, { l: 2, t: 0.6, txt: 'NIGHT: SETTLEMENT', color: '#E2B54E', e: 'step' }], 'cap', 4),
        zero([{ x: 1700, y: 1000, s: 0.7, face: 0, look: [-8, -8], flip: true }], { z: 5 }), vig(0.7)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('chime', 0.6, { l: 1, g: 0.3 }), sfx('dun', 0.4, { l: 2, g: 0.3 })],
    },
    // ===== s37: the $4.75 as one big coin. The coffee shop doesn't get all of it =====
    {
      lines: [N('And every one of them leaves a little behind on the way.', { at: 0.3 }), N("The coffee shop doesn't get four seventy-five.", { gap: 0.4 })], min: 6.5, bg: '#120E1E',
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#120E1E' }, 'bg', -20), P('pool', { x: 960, y: 500, rx: 800, ry: 520, kind: 'warm', op: 0.35 }, 'pl', -10),
        P('coinpie', [{ x: 640, y: 480, s: 0.2, o: 0 }, { t: 0.2, o: 1, e: 'step' }, { t: 0.8, s: 1.0, e: 'back' }], 'pie', 2),
        zero([{ x: 1600, y: G + 40, s: 2.2, face: 2, look: [-8, -6], flip: true }, { l: 1, pose: 'point', hr: [150, 100], face: 0 }, { l: 1, t: 1.6, pose: 'neutral', hr: null, face: 4 }], { z: 5 }), vig(0.6)],
      sfx: [sfx('coin', 0.8, { g: 0.5 })],
    },
    // ===== s38: the slices come out of the coin, one per company, each with its tag =====
    {
      lines: [N("The biggest slice goes to ZERO's bank:", { at: 0.2 }), N('on average, around two percent of every credit card purchase.', { gap: 0.1 }), N('The network takes a slice.', { gap: 0.4 }), N("The shop's card company takes a slice.", { gap: 0.2 }), N("On ZERO's coffee, that's maybe ten or fifteen cents.", { gap: 0.5 })],
      min: 15, hold: 1.0, bg: '#120E1E',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 940, y: 530, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#120E1E' }, 'bg', -20), P('pool', { x: 960, y: 500, rx: 800, ry: 520, kind: 'warm', op: 0.35 }, 'pl', -10),
        P('coinpie', [{ x: 640, y: 480, s: 1.0, out: [0, 0, 0], note: '' }, { t: 0.4, out: [0, 0, 0] }, { t: 1.2, out: [1, 0, 0], e: 'back' }, { l: 2, t: 0.2, out: [1, 1, 0], e: 'back' }, { l: 3, t: 0.4, out: [1, 1, 1], e: 'back' }, { l: 4, cap: '≈ 10–15¢ OF $4.75 (ESTIMATE)', note: 'SLICES DRAWN BIGGER THAN LIFE', e: 'step' }], 'pie', 2),
        P('holo', [{ x: 1500, y: 160, w: 300, h: 150, txt: '≈ 2%', size: 60, color: '#FFD98A', on: 0 }, { l: 1, t: 0.6, on: 1, e: 'out' }, { l: 2, on: 0, e: 'step' }], 'h2', 6),
        P('text', [{ x: 1500, y: 270, txt: 'AVERAGE · NBER, 2026', size: 20, color: '#E6CFC0', o: 0 }, { l: 1, t: 0.8, o: 1, e: 'step' }, { l: 2, o: 0, e: 'step' }], 'h2s', 6),
        zero([{ x: 1700, y: G + 40, s: 2.0, face: 4, look: [-8, -6], flip: true }, { l: 0, t: 1.2, face: 7 }, { l: 2, pose: 'point', hr: [150, 100], face: 0 }, { l: 3, pose: 'neutral', hr: null, face: 9 }, { l: 4, face: 1, look: [0, 1] }], { z: 5 }), vig(0.6)],
      sfx: [sfx('slide', 1.0, { g: 0.5 }), sfx('slide', 0.2, { l: 2, g: 0.5 }), sfx('slide', 0.4, { l: 3, g: 0.5 }), sfx('coin', 0.3, { l: 4, g: 0.4 })],
    },
    // ===== s39: pull-out: every shop's slices make a mountain =====
    {
      lines: [N('Across the country, shops paid more than 187 billion dollars in card fees in 2024.', { at: 0.3 })], min: 7, hold: 1.2, bg: '#120E1E',
      cam: cam({ z: 1.4, x: 960, y: 700 }, { end: 0, z: 0.9, x: 960, y: 470, e: 'io' }),
      actors: [P('rect', { x: 960, y: 540, w: 4000, h: 3000, fill: '#120E1E' }, 'bg', -20), P('pool', { x: 960, y: 700, rx: 1300, ry: 700, kind: 'warm', op: 0.35 }, 'pl', -10),
        P('coinmountain', [{ x: 960, y: 980, s: 0.9, k: 0.05 }, { t: 0.3, k: 0.05 }, { end: 1.0, k: 1, e: 'out' }], 'mtn', 0),
        P('counterwall', [{ x: 960, y: 140, s: 0.85, cap: 'CARD FEES PAID BY U.S. SHOPS · 2024', n: 187.2, k: 1, pre: '$', unit: ' BILLION', size: 84, color: '#FFD98A', sub: 'NILSON REPORT', o: 0 }, { end: 3.0, o: 0 }, { end: 2.7, o: 1, e: 'step' }], 'n187', 4),
        zero([{ x: 1500, y: 1000, s: 1.2, face: 3, look: [-8, -8], flip: true }, { t: 2.5, x: 1600, pose: 'back', e: 'out' }, { t: 3.4, pose: 'neutral' }], { z: 5 }), vig(0.6)],
      sfx: [sfx('roll', 0.3, { g: 0.4 }), sfx('coin', 1.2, { g: 0.3 }), sfx('coin', 2.0, { g: 0.3 }), sfx('dato', 0, { end: 2.7, g: 0.5 })],
    },
    // ===== s40: debit vs credit. Debit's slice has a lock (capped by federal law); credit's grows as the card gets
    // fancier (gold, metal) =====
    {
      lines: [N("Pay with a debit card from a big bank, and the bank's slice is capped by federal law.", { at: 0.3 }), N('Credit cards have no cap.', { gap: 0.4 }), N('And the fancier the card, the bigger the slice.', { gap: 0.4 })], min: 12, hold: 1.0, bg: '#120E1E',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 530, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#120E1E' }, 'bg', -20), P('pool', { x: 960, y: 600, rx: 900, ry: 520, kind: 'warm', op: 0.3 }, 'pl', -10),
        P('cardcompare', [{ x: 900, y: 760, s: 1.0, tier: 0, lock: 0, nocap: 0 }, { l: 0, t: 2.2, lock: 0 }, { l: 0, t: 2.8, lock: 1, e: 'back' }, { l: 1, t: 0.4, nocap: 0 }, { l: 1, t: 0.7, nocap: 1, e: 'step' }, { l: 2, t: 0.8, tier: 0 }, { l: 2, t: 2.6, tier: 2, e: 'io' }], 'cmp', 2),
        P('text', [{ x: 500, y: 1010, txt: 'REGULATION II (FEDERAL RESERVE)', size: 20, color: '#8FF0B0', o: 0 }, { l: 0, t: 2.8, o: 1, e: 'step' }], 'reg', 3),
        zero([{ x: 1640, y: G + 40, s: 2.0, face: 0, look: [-8, -4], flip: true }, { l: 1, face: 3 }, { l: 2, t: 2.0, face: 9 }], { z: 5 }), vig(0.6)],
      sfx: [sfx('click', 2.8, { g: 0.6 }), sfx('error', 0.6, { l: 1, g: 0.3 }), sfx('coin', 1.2, { l: 2, g: 0.3 }), sfx('coin', 1.8, { l: 2, g: 0.3 }), sfx('jackpot', 2.4, { l: 2, g: 0.3 })],
    },
    // ===== s41: who pays it? The café's prices. Everyone, including the man in the grey cap, counting coins for tea =====
    {
      lines: [N('So who really pays that?', { at: 0.3 }), N('The coffee shop builds it into its prices.', { gap: 0.4 }), N('For everyone.', { gap: 0.3 }), N('Including people who pay in cash.', { gap: 0.4 })], min: 9.5, hold: 0.8, bg: '#2A1E18',
      cam: cam({ z: 1.9, x: 1210, y: 250 }, { l: 2, t: 0.2, z: 2.0, x: 1210, y: 250, e: 'lin' }, { l: 3, z: 1.6, x: 520, y: 560, e: 'step' }, { end: 0, z: 1.7, x: 540, y: 560, e: 'lin' }),
      actors: [...cafe({ hlPrice: true, man: { x: 560, pose: 'reach', look: 0.9 }, woman: { x: 150 } }),
        P('statustag', [{ x: 1210, y: 400, s: 0.7, w: 520, txt: 'CARD FEES INCLUDED', color: '#F2C14E', on: 0 }, { l: 1, t: 1.0, on: 0 }, { l: 1, t: 1.3, on: 1, e: 'out' }], 'incl', 8),
        ...[0, 1, 2].map(i => P('coin', [{ x: 690 + i * 22, y: 684 - i * 5, s: 0.32, txt: '', color: i === 1 ? '#C9CED8' : '#C08A3E' }], 'mc' + i, 1)),
        P('cup', { x: 1180, y: 600, s: 0.5, steam: 1 }, 'tea', -4), vig(0.55)],
      sfx: [sfx('chatter', 0, { g: 0.25, bed: true }), sfx('coin', 0.4, { l: 3, g: 0.4 }), sfx('coin', 0.9, { l: 3, g: 0.4 })],
    },
    // ===== s42: PIX's hologram: a thread of coins from the cash wallet to a shiny rewards card. ZERO looks at his own card =====
    {
      lines: [N('Economists estimate that cash and debit card users hand about thirty billion dollars a year to credit card users.', { at: 0.3 }), N("That's what pays for the points, the miles and the cash back.", { gap: 0.5 })],
      min: 11, hold: 1.0, bg: '#2A1E18',
      actors: [...cafe({ man: { x: 560, pose: 'reach', look: 0.9 }, woman: { x: 150 } }), sysOn({ t: 0.2 }), P('rect', [{ x: 960, y: 540, w: 2400, h: 1400, fill: '#05070F', op: 0, ui: true }, { t: 0.2, op: 0 }, { t: 0.6, op: 0.78, e: 'out' }], 'dim', 44),
        P('cointhread', [{ x: 960, y: 520, s: 1.0, on: 0, ui: true }, { t: 0.6, on: 0 }, { t: 1.2, on: 1, e: 'out' }], 'thread', 45),
        P('text', [{ x: 960, y: 260, txt: '≈ $30 BILLION A YEAR', size: 56, color: '#FFD98A', o: 0, ui: true }, { t: 3.2, o: 1, e: 'step' }], 't30', 46),
        P('text', [{ x: 960, y: 320, txt: 'ESTIMATE · NBER, 2026', size: 22, color: '#C9D3E6', o: 0, ui: true }, { t: 3.4, o: 1, e: 'step' }], 't30s', 46),
        ui(zero([{ x: 1640, y: 1010, s: 1.7, face: 0, look: [-8, -2], flip: true, hl: [118, 126], hr: [128, 128] }, { l: 1, face: 9, look: [2, 6] }, { l: 1, t: 2.0, face: 7, look: [0, 1] }], { z: 48 })),
        P('zcard', [{ x: hand(1640, 1010, [128, 128], 1.7)[0] - 60, y: hand(1640, 1010, [128, 128], 1.7)[1], s: 0.4, tilt: 8, ui: true, o: 0 }, { l: 1, o: 1, e: 'step' }], 'zc', 49),
        ui(pix([{ x: 300, y: 300, s: 1.0, face: 1 }])),
      ],
      sfx: [sfx('pix-ting', 0.4, { g: 0.4 }), sfx('coin', 1.4, { g: 0.3 }), sfx('coin', 2.2, { g: 0.3 }), sfx('coin', 3.0, { g: 0.3 }), sfx('dato', 3.2, { g: 0.4 })],
    },
    // ===== s43a: and ZERO? The calendar flips; three weeks later his phone buzzes: the statement =====
    {
      lines: [N('And ZERO?', { at: 0.3 }), N('In a few weeks, he gets a bill.', { gap: 0.4 })], min: 5, hold: 0.8, bg: '#2A1E18',
      cam: cam({ z: 1.4, x: 520, y: 600 }, { end: 0, z: 1.5, x: 520, y: 600, e: 'lin' }),
      actors: [...cafe({ man: { x: -600, o: 0 }, woman: { x: -600, o: 0 } }), ...table(),
        P('calendar', [{ x: 710, y: 360, s: 0.8, month: 'OCTOBER', today: 22, circ: 0 }, { l: 1, t: 0.3, month: 'NOVEMBER', today: 1, e: 'step' }, { l: 1, t: 0.8, today: 12, e: 'step' }], 'cal', 8),
        zSit([{ face: 0, look: [8, -4] }, { l: 1, t: 1.2, hr: [140, 104], face: 0, look: [6, 6] }]),
        P('phone', [{ ...((([x, y]) => ({ x: x + 10, y: y - 30 }))(hand(STOOL, ZSIT, [140, 104], 2.2))), s: 0.42, screen: 'STATEMENT|$4.75|DUE IN 21 DAYS', fs: 16, dot: 1, buzz: 0, o: 0 }, { l: 1, t: 1.1, o: 1, buzz: 1, e: 'step' }, { l: 1, t: 1.5, buzz: 0 }], 'ph', 7)],
      sfx: [sfx('chatter', 0, { g: 0.2, bed: true }), sfx('slide', 0.3, { l: 1, g: 0.4 }), sfx('slide', 0.8, { l: 1, g: 0.4 }), sfx('buzz', 1.1, { l: 1, g: 0.5 })],
    },
    // ===== s43b: two roads: paid in full (free) or carried over (22% a year, a snowball). And the whole country's tab =====
    {
      lines: [N('If he pays it in full, the loan was free.', { at: 0.3 }), N("If he doesn't, the average rate on cards that charge interest is about twenty-two percent a year.", { gap: 0.5 }), N("That's the other way the bank gets paid.", { gap: 0.5 }), N('Right now, Americans owe one point two six trillion dollars on their cards.', { gap: 0.6 })],
      min: 19, hold: 1.2, bg: '#120E1E',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 960, y: 540, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#120E1E' }, 'bg', -20), P('pool', { x: 900, y: 500, rx: 900, ry: 520, kind: 'warm', op: 0.25 }, 'pl', -10),
        P('twopaths', [{ x: 820, y: 470, s: 1.0, g: 0, c: 0, snow: 0 }, { t: 0.4, g: 0 }, { t: 1.4, g: 1, e: 'io' }, { l: 1, t: 0.3, c: 0 }, { l: 1, t: 1.3, c: 1, e: 'io' }, { l: 1, t: 2.0, snow: 0 }, { l: 2, t: 1.6, snow: 1, e: 'in' }, { l: 3, o: 1 }, { l: 3, t: 0.3, o: 0.25, e: 'out' }], 'paths', 2),
        P('text', [{ x: 1230, y: 770, txt: 'FEDERAL RESERVE G.19 · AUG 2026', size: 18, color: '#8FA6C8', o: 0 }, { l: 1, t: 2.4, o: 1, e: 'step' }, { l: 3, o: 0, e: 'step' }], 'g19', 3),
        P('counterwall', [{ x: 960, y: 470, s: 1.0, cap: 'OWED ON U.S. CREDIT CARDS', n: 1.26, k: 1, pre: '$', unit: ' TRILLION', size: 96, color: '#FF9A8A', sub: 'NEW YORK FED · Q2 2026', o: 0 }, { l: 3, t: 0.3, o: 0 }, { l: 3, t: 0.4, o: 1, e: 'step' }], 'n126', 6),
        zero([{ x: 1700, y: G + 40, s: 1.9, face: 0, look: [-8, -4], flip: true }, { l: 0, t: 1.4, face: 2 }, { l: 1, t: 1.3, face: 3 }, { l: 2, face: 9 }, { l: 3, t: 1.0, face: 3, pose: 'scared' }, { end: 0.8, pose: 'neutral', face: 7 }], { z: 5 }), vig(0.6)],
      sfx: [sfx('chime', 1.4, { g: 0.4 }), sfx('tension', 1.3, { l: 1, g: 0.35 }), sfx('roll', 2.0, { l: 1, g: 0.3 }), sfx('gulp', 0.6, { l: 3, g: 0.5 }), sfx('dun', 0.4, { l: 3, g: 0.4 })],
    },
    // ===== s44: NEXT MORNING. 8:14. Same café, same framing as the first shot. ZERO taps; the world freezes for an
    // instant (he doesn't jump this time); he gives the terminal a knowing nod =====
    {
      lines: [N('Next morning.', { at: 0.3 }), N('Eight fourteen.', { gap: 0.2 })], min: 4.6, bg: '#2A1E18',
      freeze: { at: 1.9, until: 3.0, tint: 0.55 },
      cam: cam({ z: 1.12, x: 880, y: 480 }, { end: 0, z: 1.2, x: 870, y: 490, e: 'lin' }),
      actors: [...cafe({ termK: [{ t: 1.75, l2: 'PROCESSING', timer: 0, wave: 1, e: 'step' }, { t: 3.4, l2: 'APPROVED', ok: 1, timer: 1.63, wave: 0, e: 'step' }], man: { pose: 'reach', look: 0.2 } }),
        P('wallclock', { x: 1760, y: 170, s: 0.75, h: 8.233, m: 0, sec: false }, 'clock', -14),
        P('zcard', [{ x: hand(ZX, G, [123, 124])[0], y: hand(ZX, G, [123, 124])[1], s: 0.62, tilt: -8, live: true }, { t: 1.6, x: TAP[0], y: TAP[1], s: 0.5, tilt: 18, e: 'io' }, { t: 3.4, x: hand(ZX, G, [123, 124])[0], y: hand(ZX, G, [123, 124])[1], s: 0.62, tilt: -8, e: 'io' }], 'card', 6),
        zero([{ x: ZX, face: 2, pose: 'neutral', hl: [116, 124], hr: [130, 124], look: [6, -4] }, { t: 1.6, pose: 'reach', hr: [166, 30], hl: [92, 166], y: G - 14, face: 0, e: 'io' }, { t: 2.0, face: 1, look: [8, -6] }, { t: 2.4, headR: 10, e: 'out' }, { t: 2.7, headR: 0, face: 2 }, { t: 3.4, pose: 'neutral', hr: [130, 124], hl: [116, 124], y: G, e: 'io' }], { z: 5 }),
        vig(0.55)],
      sfx: [sfx('espresso', 0, { g: 0.35, bed: true }), sfx('chatter', 0, { g: 0.3, bed: true }), sfx('beep', 1.75, { g: 0.5 }), sfx('freeze', 1.7, { g: 0.35 }), sfx('beep', 3.4, { g: 0.5 }), sfx('chime', 3.45, { g: 0.3 })],
    },
    // ===== s45: the recap as snapshots sliding into frame: the capsule, the three stops, the green dial, the lock =====
    {
      lines: [N('Two seconds.', { at: 0.3 }), N('Three companies.', { gap: 0.3 }), N("A machine that's starting to learn his habits.", { gap: 0.3 }), N('And not one cent moving.', { gap: 0.4 })], min: 8, hold: 1.0, bg: '#2A2638',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#2A2638' }, 'bg', -20), P('pool', { x: 1000, y: 560, rx: 900, ry: 560, kind: 'warm', op: 0.45 }, 'pl', -10),
        P('snap', [{ x: -400, y: 300, s: 0.8, inner: 'payterm', ip: { s: 1.0, l2: 'PROCESSING', timer: 1.92, ok: 1 }, iy: 140, bgc: '#C9A98A', txt: '2 SECONDS', tilt: -6 }, { l: 0, x: -400 }, { l: 0, t: 0.5, x: 420, e: 'out' }], 's1', 1),
        P('snap', [{ x: 2400, y: 330, s: 0.8, inner: 'routeholo', ip: { s: 0.33, prog: 1, cross: 1 }, txt: '3 COMPANIES', tilt: 5 }, { l: 1, x: 2400 }, { l: 1, t: 0.5, x: 900, e: 'out' }], 's2', 2),
        P('snap', [{ x: 2400, y: 640, s: 0.8, inner: 'riskdial', ip: { s: 0.55, v: 0.16 }, iy: 60, bgc: '#26141E', txt: 'HIS HABITS', tilt: -3 }, { l: 2, x: 2400 }, { l: 2, t: 0.5, x: 1420, e: 'out' }], 's3', 3),
        P('snap', [{ x: -400, y: 760, s: 0.8, inner: 'creditbar', ip: { s: 0.28, lock: 1, sent: '$0.00' }, bgc: '#26141E', txt: 'NOT ONE CENT', tilt: 4 }, { l: 3, x: -400 }, { l: 3, t: 0.5, x: 640, e: 'out' }], 's4', 4),
        P('capsule', [{ x: 1650, y: 230, s: 0.5, trail: 0, state: 'ok', check: true, o: 0 }, { l: 0, t: 0.3, o: 1, e: 'step' }], 'cap', 5),
        vig(0.7)],
      sfx: [sfx('swipe', 0.4, { l: 0, g: 0.3 }), sfx('swipe', 0.4, { l: 1, g: 0.3 }), sfx('swipe', 0.4, { l: 2, g: 0.3 }), sfx('swipe', 0.4, { l: 3, g: 0.3 })],
    },
    // ===== s46: THE IRONY (no words). APPROVED; the phone buzzes: "You earned 5¢ cash back!". ZERO, proud. Behind him
    // the man in the grey cap is still counting coins. ZERO looks at the nickel, at the man, at us. PIX: "...".
    // ZERO puts the nickel in the man's hand =====
    {
      act: 'understands', lines: [], min: 8.2, bg: '#2A1E18',
      cam: cam({ z: 1.35, x: 640, y: 560 }, { end: 0, z: 1.42, x: 620, y: 570, e: 'lin' }),
      actors: [...cafe({ term: { l2: 'APPROVED', ok: 1, timer: 1.63 }, man: { x: 400, pose: 'reach', look: 0.5 }, manK: [{ t: 6.6, look: 0.9 }, { t: 7.2, pose: 'stand', look: 0.95 }], woman: { x: 150 } }),
        ...[0, 1, 2].map(i => P('coin', [{ x: 530 + i * 22, y: 684 - i * 5, s: 0.3, txt: '', color: i === 1 ? '#C9CED8' : '#C08A3E' }], 'mc' + i, 1)),
        P('phone', [{ x: hand(ZX, G, [140, 104])[0] + 10, y: hand(ZX, G, [140, 104])[1] - 40, s: 0.55, screen: '+5¢', fs: 30, dot: 1, buzz: 0, o: 0 }, { t: 0.4, o: 1, buzz: 1, e: 'step' }, { t: 0.9, buzz: 0 }, { t: 3.6, o: 0, e: 'step' }], 'ph', 6),
        P('notif', [{ x: 960, y: 150, s: 1.0, w: 900, txt: 'You earned 5¢ cash back!', size: 42, icon: '#58E08A', o: 0, ui: true }, { t: 0.9, o: 1, e: 'step' }, { t: 3.4, o: 0, e: 'step' }], 'msg', 46),
        zero([{ x: ZX, face: 0, look: [4, 2], hr: [150, 150] }, { t: 0.5, squash: 0.95 }, { t: 0.6, squash: 1 }, { t: 0.9, hr: [140, 104], look: [4, 6], face: 0, e: 'out' }, { t: 1.4, pose: 'proud', hr: null, face: 2, look: [6, -4] },
          { t: 2.4, flip: true, pose: 'neutral', face: 0, look: [8, 0] }, { t: 3.3, face: 9 }, ...lookCam({ t: 3.6 }, { face: 1 }), { t: 5.0, flip: true, look: [8, 2], face: 1 },
          { t: 5.3, x: 720, pose: 'walk', e: 'io' }, { t: 6.0, pose: 'present', hr: [166, 120], face: 2 }, { t: 7.0, pose: 'neutral', hr: null, face: 2, look: [8, -2] }], { z: 5 }),
        P('coin', [{ x: hand(ZX, G, [140, 104])[0], y: hand(ZX, G, [140, 104])[1], s: 0.45, o: 0 }, { t: 3.6, o: 1, e: 'step' }, { t: 5.3, x: hand(ZX, G, [140, 104])[0], y: hand(ZX, G, [140, 104])[1] }, { t: 6.0, x: 556, y: 676, e: 'io' }, { t: 7.0, x: 550, y: 680 }], 'nickel', 7),
        pix([{ x: 1080, y: 400, s: 1.0, face: 0, o: 0 }, { t: 4.2, o: 1, e: 'step' }, { t: 4.6, face: 4 }, { t: 6.4, face: 2 }]),
        P('bubble', [{ x: 1170, y: 290, txt: '...', w: 170, h: 100, o: 0 }, { t: 4.7, o: 1, e: 'step' }, { t: 6.2, o: 0, e: 'step' }], 'dots', 10), vig(0.55)],
      sfx: [sfx('chatter', 0, { g: 0.25, bed: true }), sfx('buzz', 0.4, { g: 0.5 }), sfx('coin', 3.6, { g: 0.4 }), sfx('zero-boop', 3.6, { g: 0.4 }), sfx('coin', 6.1, { g: 0.6 }), sfx('chime', 6.6, { g: 0.3 })],
    },
    // ===== s47: ZERO walks out with his coffee; the pigeon on the sill outside. The question for next time, his look =====
    {
      act: 'understands', lines: [N('And the bank that just lent him four seventy-five?', { at: 0.5 }), N("It's quietly hoping he pays late.", { gap: 0.5 }), N("That's a whole other system.", { gap: 0.6 })], min: 8.5, hold: 1.2, bg: '#2A1E18',
      cam: cam({ z: 1.15, x: 760, y: 520 }, { end: 0, z: 1.25, x: 560, y: 520, e: 'lin' }),
      actors: [...cafe({ term: { l2: 'TAP CARD' }, man: { x: 760, pose: 'reach', look: 0.8 }, woman: { x: 1500, look: -0.4 } }),
        P('cup', [{ ...(([x, y]) => ({ x: x + 6, y: y + 40 }))(hand(ZX, G, [128, 128])), s: 0.62 }, { t: 0.4 }, { l: 1, t: 0.4, x: 470 + 6, e: 'io' }], 'cup', 7),
        zero([{ x: ZX, face: 2, hl: [118, 126], hr: [128, 128], look: [-6, -2], flip: true }, { t: 0.4, x: ZX }, { l: 1, t: 0.4, x: 470 - 172 * 0, pose: 'walk', hl: [118, 126], hr: [128, 128], e: 'io' }, { l: 1, t: 1.0, pose: 'neutral', hl: [118, 126], hr: [128, 128] },
          { l: 2, face: 0, look: [-8, -4] }, ...lookCam({ l: 2, t: 1.0 }, { face: 4, tilt: 10 })], { z: 5 }),
        pix([{ x: 900, y: 300, s: 0.8, face: 2 }, { l: 1, face: 5 }, { l: 2, face: 1 }]), vig(0.55)],
      sfx: [sfx('chatter', 0, { g: 0.25, bed: true }), sfx('door', 0.2, { l: 1, g: 0.2 }), sfx('tension', 0.3, { l: 1, g: 0.25 })],
    },
    // ===== CLICK · ZERO UNDERSTANDS, on black. The end =====
    endMark(),
  ],
};
