// Video 003 "What Your Credit Card Does at Midnight": part 2, inside the bank's night machine. The grace period and
// how paying only part of it closes the window; the nightly rate (22.36% ÷ 365); sixty cents a night; interest on
// interest; thirty nights = $18; the minimum payment and how little of it touches the debt.
import { G, N, zero, pix, sfx, cam, lookCam, tilt, shrug } from '../../src/kit.mjs';
import { P, vig, ui, fiber, ride, back, oc } from './common.mjs';

const BG = '#050A18';
// ZERO watching from the corner of the frame (overlay, so the camera can move behind him)
const zc = (k = [], o = {}) => ui(zero([{ x: o.x ?? 1700, y: 1010, s: o.s ?? 1.7, face: 0, look: [-8, -4], flip: true }, ...k], { z: 48 }));
const dark = (speed = 0.4, tint) => [...fiber({ speed, tint }), P('pool', { x: 960, y: 540, rx: 900, ry: 560, kind: 'pix', op: 0.35 }, 'pl', -10)];

export default {
  id: 'v003-part2',
  format: 'long',
  title: 'What Your Credit Card Does at Midnight (part 2)',
  description: 'Part 2 of video 003.',
  tags: ['how it works', 'credit cards', 'interest'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // ===== d1: the grace period. A capsule ($1,000) walks the green window and comes out paid; nothing was charged =====
    {
      lines: [N('A card gives you a grace period.', { at: 0.3 }), N('Pay the whole bill by the due date,', { gap: 0.3 }), N('and the loan was free.', { gap: 0.2 }), N('So what happens if he pays only part?', { gap: 0.5 })], min: 9, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 980, y: 540, e: 'lin' }),
      actors: [...back.fib(0.4),
        P('calendar', { x: 960, y: 300, s: 2.0, month: 'OCTOBER', today: 0, circ: 0 }, 'cal', 3),
        P('rect', [{ x: 960, y: 470, w: 1000, h: 36, fill: '#58E08A', rx: 18, op: 0 }, { l: 0, t: 0.8, op: 0 }, { l: 0, t: 1.4, op: 0.85, e: 'out' }], 'win', 4),
        P('text', [{ x: 960, y: 560, txt: 'GRACE PERIOD · NO INTEREST', size: 40, color: '#8FF0B0', o: 0 }, { l: 0, t: 1.4, o: 1, e: 'step' }], 'gp', 9),
        P('text', [{ x: 960, y: 610, txt: 'at least 21 days · CFPB', size: 24, color: '#8FA6C8', o: 0 }, { l: 0, t: 1.6, o: 1, e: 'step' }], 'gps', 9),
        P('capsule', [{ x: 330, y: 470, s: 0.9, trail: 0.3, txt: '$1,000', o: 0 }, { l: 0, t: 1.0, o: 1, e: 'step' }, { l: 1, x: 330 }, { l: 1, t: 1.4, x: 1590, e: 'io' }, { l: 2, t: 0.3, state: 'ok', check: true, e: 'step' }], 'cap', 6),
        P('text', [{ x: 1590, y: 380, txt: 'PAID IN FULL → $0 INTEREST', size: 34, color: '#8FF0B0', o: 0 }, { l: 2, t: 0.3, o: 1, e: 'step' }], 'pif', 9),
        zc([{ l: 1, face: 2 }, { l: 2, face: 7 }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('chime', 1.4, { g: 0.3 }), sfx('swipe', 1.4, { l: 1, g: 0.4 }), sfx('chime', 0.3, { l: 2, g: 0.5 })],
    },
    // ===== d2: ZERO paid twenty-five. The capsule splits (a small $25 leaves), and the green window snaps shut =====
    {
      lines: [N('ZERO paid twenty-five.', { at: 0.3 }), N('Not the whole bill.', { gap: 0.3 }), N("And that's the moment the window closes.", { gap: 0.5 })], min: 8.5, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.08, x: 960, y: 540, e: 'lin' }),
      actors: [...back.fib(0.4),
        P('calendar', { x: 960, y: 300, s: 2.0, month: 'OCTOBER', today: 0, circ: 0 }, 'cal', 3),
        P('rect', [{ x: 960, y: 470, w: 1000, h: 36, fill: '#58E08A', rx: 18, op: 0.85 }, { l: 2, t: 0.2, op: 0.85 }, { l: 2, t: 0.7, op: 0, e: 'in' }], 'win', 4),
        P('rect', [{ x: 960, y: 470, w: 1000, h: 36, fill: '#FF6B5B', rx: 18, op: 0 }, { l: 2, t: 0.2, op: 0 }, { l: 2, t: 0.7, op: 0.85, e: 'out' }], 'win2', 4),
        P('text', [{ x: 960, y: 560, txt: 'GRACE PERIOD · CLOSED', size: 40, color: '#FF9A8A', o: 0 }, { l: 2, t: 0.7, o: 1, e: 'step' }], 'gp', 9),
        P('capsule', [{ x: 640, y: 780, s: 1.3, trail: 0.2, txt: '$1,000' }, { l: 0, t: 0.2, txt: '$1,000' }], 'cap', 6),
        P('capsule', [{ x: 640, y: 780, s: 0.01, trail: 0, txt: '$25', state: 'ok', o: 0 }, { l: 0, t: 1.4, o: 1, s: 0.01, e: 'step' }, { l: 0, t: 2.0, x: 1400, y: 740, s: 0.7, e: 'out' }, { l: 1, t: 0.6, x: 1700, y: 740 }], 'cap25', 6),
        P('text', [{ x: 640, y: 930, txt: 'STILL OWED: $975', size: 46, color: '#FFD98A', o: 0 }, { l: 0, t: 2.2, o: 1, e: 'step' }], 'owed', 9),
        zc([{ l: 1, face: 3 }, { l: 2, face: 9, pose: 'scared' }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('coin', 1.6, { g: 0.4 }), sfx('swipe', 2.0, { g: 0.4 }), sfx('dun', 0.7, { l: 2, g: 0.5 })],
    },
    // ===== d3: from tonight the interest runs on what he still owes: the sky goes dark over the capsule =====
    {
      lines: [N('From now on, interest is charged on what he still owes.', { at: 0.3 }), N('Starting tonight.', { gap: 0.4 }), N('But how much?', { gap: 0.5 })], min: 6.5, hold: 0.8, bg: '#0A1030',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.08, x: 960, y: 540, e: 'lin' }),
      actors: [P('skyclock', [{ x: 960, y: 1080, prog: 0.3 }, { end: 0, prog: 0.5, e: 'lin' }], 'sky', -20),
        P('capsule', { x: 960, y: 640, s: 1.6, trail: 0, txt: '$975' }, 'cap', 6),
        P('text', [{ x: 960, y: 820, txt: '11:59 PM', size: 54, color: '#C9D3E6', o: 0 }, { l: 1, t: 0.2, o: 1, e: 'step' }], 'tm', 9),
        zc([{ l: 1, face: 3, look: [-8, -8] }]), vig(0.6)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('tension', 0.6, { l: 1, g: 0.3 })],
    },
    // ===== d4: the machine: yearly rate on a big counter =====
    {
      lines: [N('Every night, a machine takes the yearly rate.', { at: 0.3 }), N('Twenty-two point three six percent.', { gap: 0.3 }), N('The average on cards that charge interest.', { gap: 0.3 })], min: 10, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...back.bank(),
        P('counterwall', [{ x: 960, y: 470, s: 1.0, cap: 'YEARLY RATE (APR)', n: 22.36, k: 0, unit: '%', size: 120, color: '#FF9A8A', sub: 'FEDERAL RESERVE G.19 · AUG 2026', o: 0 }, { l: 0, t: 0.5, o: 1, k: 0, e: 'step' }, { l: 1, t: 0.2, k: 1, e: 'out' }], 'rate', 6),
        zc([{ l: 1, face: 3 }, { l: 2, face: 2 }]), oc(), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('roll', 1.2, { g: 0.3 }), sfx('chime', 3.0, { g: 0.4 })],
    },
    // ===== d5: it divides by 365 and gets a daily rate =====
    {
      lines: [N('Then it divides by three hundred sixty-five.', { at: 0.3 }), N('Because it checks again every single day.', { gap: 0.4 })], min: 8, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.bank(),
        P('text', [{ x: 960, y: 400, txt: '22.36% ÷ 365', size: 130, color: '#FFD98A', o: 0 }, { l: 0, t: 0.4, o: 1, e: 'step' }], 'div', 9),
        P('text', [{ x: 960, y: 620, txt: '= 0.0613% A DAY', size: 100, color: '#8FF0B0', o: 0 }, { l: 0, t: 2.8, o: 1, e: 'step' }], 'res', 9),
        P('calendar', [{ x: 1650, y: 250, s: 0.9, month: 'EVERY DAY', today: 0, circ: 0, o: 0 }, { l: 1, t: 0.2, o: 1, e: 'step' }, { l: 1, t: 1.8, today: 20, e: 'lin' }], 'cal', 5),
        zc([{ l: 0, face: 2 }, { l: 1, face: 6 }]), oc(), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('slide', 0.4, { g: 0.4 }), sfx('ping', 2.8, { g: 0.4 }), sfx('swipe', 0.2, { l: 1, g: 0.3 })],
    },
    // ===== d6: it sounds like nothing; ZERO shrugs =====
    {
      lines: [N('Six hundredths of a percent.', { at: 0.3 }), N('It sounds like nothing.', { gap: 0.4 })], min: 5.5, hold: 0.6, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...back.bank(),
        P('text', [{ x: 960, y: 480, txt: '0.0613%', size: 220, color: '#FFD98A' }, { l: 1, t: 0.3, size: 150, e: 'in' }], 'pct', 9),
        P('text', [{ x: 960, y: 640, txt: 'basically nothing', size: 50, color: '#8FA6C8', o: 0 }, { l: 1, t: 0.7, o: 1, e: 'step' }], 'bn', 9),
        zero([{ x: 1500, y: G, s: 2.4, face: 0, look: [-8, -4], flip: true }, ...shrug({ l: 1, t: 0.5 }, { face: 1 })], { z: 5 }), oc(), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('zero-boop', 1.2, { l: 1, g: 0.3 })],
    },
    // ===== d7: on $975 it is sixty cents; the counter ticks tonight and tomorrow night =====
    {
      lines: [N("On nine hundred seventy-five dollars, it's sixty cents.", { at: 0.3 }), N('Tonight.', { gap: 0.4 }), N('And tomorrow night.', { gap: 0.3 })], min: 10, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.hall(),
        P('counterwall', [{ x: 960, y: 470, s: 1.0, cap: 'ZERO OWES', n: 975, dec: 2, k: 1, pre: '$', size: 130, color: '#FFD98A', o: 1 }, { l: 1, t: 0.2, n: 975.6, e: 'out' }, { l: 2, t: 0.4, n: 976.2, e: 'out' }], 'bal', 6),
        P('coin', [{ x: 1300, y: 160, s: 1.2, txt: '60¢', color: '#FFC93C', o: 0 }, { l: 0, t: 2.2, o: 0 }, { l: 0, t: 2.3, o: 1, e: 'step' }, { l: 1, t: 0.2, x: 1210, y: 440, s: 0.6, e: 'in' }, { l: 1, t: 0.4, o: 0, e: 'step' },
          { l: 2, t: 0.1, x: 1300, y: 160, s: 1.2, o: 1, e: 'step' }, { l: 2, t: 0.5, x: 1210, y: 440, s: 0.6, e: 'in' }, { l: 2, t: 0.7, o: 0, e: 'step' }], 'coin', 8),
        P('text', [{ x: 960, y: 760, txt: '+60¢ A NIGHT', size: 56, color: '#FFD98A', o: 0 }, { l: 1, t: 0.4, o: 1, e: 'step' }], 'pn', 9),
        zc([{ l: 1, face: 3 }, { l: 2, face: 9 }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('whoosh', 2.3, { g: 0.4 }), sfx('coin', 0.5, { l: 1, g: 0.6 }), sfx('whoosh', 0.1, { l: 2, g: 0.4 }), sfx('coin', 0.6, { l: 2, g: 0.6 })],
    },
    // ===== d8: interest on interest: yesterday's sixty cents are part of tonight's balance =====
    {
      lines: [N('And tomorrow, those sixty cents are part of the balance.', { at: 0.3 }), N('So tomorrow night, the interest earns interest.', { gap: 0.4 })], min: 9, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.hall(),
        P('capsule', [{ x: 760, y: 560, s: 1.9, trail: 0, txt: '$975', spin: 1 }], 'cap', 6),
        P('capsule', [{ x: 1180, y: 540, s: 0.01, trail: 0, txt: '60¢', o: 0 }, { l: 0, t: 1.0, o: 1, s: 0.9, e: 'back' }, { l: 0, t: 2.8, x: 880, y: 560, e: 'io' }, { l: 0, t: 3.4, o: 0, e: 'step' }], 'cap60', 7),
        P('capsule', [{ x: 1230, y: 800, s: 0.01, trail: 0, txt: 'new 60¢', o: 0 }, { l: 1, t: 0.4, o: 1, s: 0.7, e: 'back' }, { l: 1, t: 1.6, x: 1000, y: 640, s: 0.4, e: 'io' }, { l: 1, t: 2.2, o: 0, e: 'step' }], 'capi', 7),
        P('text', [{ x: 960, y: 900, txt: 'INTEREST ON INTEREST', size: 60, color: '#FF9A8A', o: 0 }, { l: 1, t: 1.0, o: 1, e: 'step' }], 'ioi', 9),
        zc([{ l: 0, face: 2 }, { l: 1, face: 4 }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('pop', 1.0, { g: 0.4 }), sfx('coin', 3.0, { g: 0.5 }), sfx('tension', 0.6, { l: 1, g: 0.3 }), sfx('ping', 1.0, { l: 1, g: 0.4 })],
    },
    // ===== d9: thirty nights: the calendar fills and the pile counts up to about $18 =====
    {
      lines: [N('Thirty nights later:', { at: 0.3 }), N('about eighteen dollars.', { gap: 0.3 }), N("For a bill he didn't finish paying.", { gap: 0.4 }), N('So what does the next bill ask for?', { gap: 0.5 })], min: 9, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.fib(0.3),
        P('calendar', [{ x: 560, y: 320, s: 1.9, month: 'NOVEMBER', today: 0, circ: 0 }, { l: 0, t: 0.6, today: 30, e: 'lin' }], 'cal', 5),
        P('counterwall', [{ x: 1380, y: 520, s: 0.8, cap: 'INTEREST IN 30 NIGHTS', n: 18.08, dec: 2, k: 0, pre: '$', size: 120, color: '#FF9A8A', sub: 'ESTIMATE · 22.36% APR ON $975', o: 0, w: 900 }, { l: 0, t: 0.6, o: 1, k: 0, e: 'step' }, { l: 0, t: 1.0, k: 1, e: 'lin' }], 'int', 6),
        zc([{ l: 0, face: 2 }, { l: 1, face: 3 }, { l: 2, face: 9 }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('roll', 0.8, { g: 0.35 }), sfx('chime', 3.0, { g: 0.4 })],
    },
    // ===== d10: the next bill: the minimum is built from two pieces: one percent of the debt + all the interest =====
    {
      lines: [N('Then the next bill arrives.', { at: 0.3 }), N('The minimum payment is built from two things:', { gap: 0.4 }), N('one percent of what you owe,', { gap: 0.3 }), N('plus all of that interest.', { gap: 0.3 })], min: 13, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...back.net(),
        P('rect', { x: 960, y: 520, w: 760, h: 520, fill: '#F4F1EA', rx: 18 }, 'paper', 4),
        P('text', [{ x: 960, y: 330, txt: 'STATEMENT', size: 36, color: '#5C6684' }], 'st', 9),
        P('text', [{ x: 960, y: 420, txt: 'MINIMUM PAYMENT', size: 30, color: '#5C6684', o: 0 }, { l: 1, t: 0.2, o: 1, e: 'step' }], 'mp', 9),
        P('text', [{ x: 960, y: 520, txt: '$27.83', size: 120, color: '#1B1E33', o: 0 }, { l: 1, t: 0.4, o: 1, e: 'step' }], 'amt', 9),
        P('rect', [{ x: 720, y: 640, w: 250, h: 70, fill: '#58E08A', rx: 14, op: 0 }, { l: 2, t: 0.2, op: 0.9, e: 'step' }], 'b1', 8),
        P('text', [{ x: 720, y: 640, txt: '1% = $9.75', size: 36, color: '#0A3A1C', o: 0 }, { l: 2, t: 0.3, o: 1, e: 'step' }], 'b1t', 9),
        P('rect', [{ x: 1090, y: 640, w: 440, h: 70, fill: '#FF6B5B', rx: 14, op: 0 }, { l: 3, t: 0.2, op: 0.9, e: 'step' }], 'b2', 8),
        P('text', [{ x: 1090, y: 640, txt: 'INTEREST = $18.08', size: 36, color: '#3A0F0A', o: 0 }, { l: 3, t: 0.3, o: 1, e: 'step' }], 'b2t', 9),
        P('text', [{ x: 960, y: 760, txt: 'ESTIMATE · a common formula (NerdWallet); your card may differ', size: 22, color: '#5C6684', o: 0 }, { l: 3, t: 0.8, o: 1, e: 'step' }], 'src', 9),
        zc([{ l: 1, face: 2 }, { l: 3, face: 3 }]), oc(), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('buzz', 0.3, { g: 0.4 }), sfx('swipe', 0.4, { l: 1, g: 0.3 }), sfx('ping', 0.3, { l: 2, g: 0.35 }), sfx('ping', 0.3, { l: 3, g: 0.35 })],
    },
    // ===== d11: so less than a third of the payment touches the debt; the rest just pays for the nights =====
    {
      lines: [N('Only about a third of that payment touches the debt.', { at: 0.3 }), N('The rest just pays for the nights.', { gap: 0.4 })], min: 8, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.net(),
        P('capsule', [{ x: 960, y: 480, s: 2.2, trail: 0, txt: '$975' }], 'cap', 6),
        P('capsule', [{ x: 960, y: 480, s: 0.01, trail: 0, txt: '$9.75', state: 'ok', o: 0 }, { l: 0, t: 0.6, o: 1, s: 0.9, e: 'back' }, { l: 0, t: 1.8, x: 960, y: 420, e: 'io' }], 'dent', 7),
        P('text', [{ x: 960, y: 760, txt: '$9.75 of $27.83 → DEBT (35%)', size: 54, color: '#8FF0B0', o: 0 }, { l: 0, t: 1.0, o: 1, e: 'step' }], 't1', 9),
        P('text', [{ x: 960, y: 840, txt: '$18.08 → THE NIGHTS', size: 54, color: '#FF9A8A', o: 0 }, { l: 1, t: 0.2, o: 1, e: 'step' }], 't2', 9),
        zc([{ l: 0, face: 3 }, { l: 1, face: 9 }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('pop', 0.6, { g: 0.4 }), sfx('dun', 0.2, { l: 1, g: 0.4 })],
    },
  ],
};
