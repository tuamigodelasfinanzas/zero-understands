// Video 003 "What Your Credit Card Does at Midnight": part 1, the ZeroOpen. 11:58 PM, ZERO pays the minimum on his
// first bill; at midnight a coin falls out of nowhere onto his balance. PIX opens the phone, ZERO follows the capsule
// ($975, what he still owes) inside, and finds the first answer: the calendar and its green window.
import { G, N, zero, pix, sfx, cam, lookCam, tilt, stepBack, leanIn } from '../../src/kit.mjs';
import { brandBeat } from '../../src/zeroopen.mjs';
import { P, vig, ui, fiber, ride, myRoom, ph, PH, ZX0 } from './common.mjs';

const HR = [140, 104];                         // his hand on the phone
const hold = (k = {}) => ({ x: ZX0, face: 0, pose: 'neutral', hr: HR, hl: [96, 130], look: [4, 6], ...k });

export default {
  id: 'v003-part1',
  format: 'long',
  title: 'What Your Credit Card Does at Midnight (part 1)',
  description: 'Part 1 of video 003.',
  tags: ['how it works', 'credit cards', 'interest'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // EVENT. 11:58 PM. ZERO at his desk with the phone; the bill is due today. He taps PAY $25 and the app says thanks
    {
      zo: 'event', lines: [N('Eleven fifty-eight at night.', { at: 0.4 }), N('ZERO has two minutes to pay his first credit card bill.', { gap: 0.3 })], min: 5.6, hold: 0.15, bg: '#262A45',
      cam: cam({ z: 1.12, x: 900, y: 520 }, { end: 0, z: 1.22, x: 860, y: 540, e: 'lin' }),
      actors: [...myRoom(),
        ph({ screen: 'BILL DUE TODAY|$1,000.00|MINIMUM $25', fs: 15 }, [{ t: 3.9, screen: 'PAID|$25.00|THANK YOU', e: 'step' }]),
        P('notif', [{ x: 960, y: 140, s: 0.95, w: 900, txt: 'Payment received: $25.00', size: 40, icon: '#2E9E5B', o: 0, ui: true }, { t: 4.1, o: 1, e: 'step' }], 'msg', 46),
        zero([hold(), { t: 3.6, hr: [150, 96], e: 'io' }, { t: 3.9, hr: HR, face: 2, squash: 0.96 }, { t: 4.1, squash: 1 }, { t: 4.8, face: 2, look: [6, 2] }]), vig(0.5)],
      sfx: [sfx('tick', 0, { g: 0.25, bed: true }), sfx('beep', 3.7, { g: 0.5 }), sfx('chime', 4.1, { g: 0.35 })],
    },
    // ANOMALY (no narration). The clock reaches twelve; a yellow coin drops out of nowhere onto the phone, and the
    // balance goes up. ZERO looks from the coin to the phone to the clock
    {
      zo: 'anomaly', lines: [], min: 4.6, bg: '#262A45',
      cam: cam({ z: 1.2, x: 880, y: 540 }, { t: 2.0, z: 1.75, x: 860, y: 640, e: 'io' }, { end: 0, z: 1.85, x: 850, y: 640, e: 'lin' }),
      actors: [...myRoom({ clock: { h: 11, m: 59.4, run: false, sec: false }, clockK: [{ t: 1.0, h: 11, m: 59.4 }, { t: 1.8, h: 12, m: 0, e: 'out' }] }),
        ph({ screen: 'BALANCE|$975.00|', fs: 20, screenY: 0 }, [{ t: 3.0, screen: 'BALANCE|$975.60|', e: 'step' }]),
        P('coin', [{ x: PH[0] - 10, y: 330, s: 1.5, roll: 0, o: 0, txt: '60¢', color: '#FFC93C' }, { t: 1.95, o: 0 }, { t: 2.0, o: 1, e: 'step' }, { t: 2.9, x: PH[0], y: PH[1] - 10, s: 0.5, roll: 360, e: 'in' }, { t: 3.05, o: 0, s: 0.1, e: 'step' }], 'coin', 8),
        P('pool', [{ x: PH[0], y: 500, rx: 220, ry: 260, kind: 'warm', op: 0 }, { t: 1.95, op: 0 }, { t: 2.3, op: 0.7, e: 'out' }, { t: 3.2, op: 0, e: 'in' }], 'cp', 5),
        zero([hold(), { t: 1.0, look: [10, -10], face: 0 }, { t: 1.9, look: [6, -12], face: 3, headR: -6 }, { t: 2.9, look: [4, 6], face: 0, headR: 0 }, { t: 3.4, headR: 10, face: 4, e: 'out' }, { t: 4.2, look: [10, -10], headR: 0, face: 3 }]), vig(0.55)],
      sfx: [sfx('tick', 0, { g: 0.25, bed: true, dur: 1.8 }), sfx('chime', 1.8, { g: 0.5 }), sfx('whoosh', 2.0, { g: 0.5 }), sfx('coin', 2.9, { g: 0.6 }), sfx('error', 3.05, { g: 0.3 })],
    },
    // QUESTION. Said after the viewer has already thought it
    {
      zo: 'question', lines: [N('At midnight, his balance went up.', { at: 0.3 }), N('Who adds money to a debt while you sleep?', { gap: 0.4 })], min: 5.4, bg: '#262A45',
      cam: cam({ z: 1.6, x: 860, y: 640 }, { end: 0, z: 1.3, x: 880, y: 600, e: 'lin' }),
      actors: [...myRoom({ clock: { h: 12, m: 0, run: false, sec: false } }), ph({ screen: 'BALANCE|$975.60|', fs: 20, screenY: 0 }),
        zero([hold({ face: 4, headR: 10, look: [4, 6] }), { l: 1, face: 3, headR: 0, look: [10, -8] }, ...lookCam({ l: 1, t: 1.4 }, { face: 1, tilt: 8 })]), vig(0.55)],
      sfx: [sfx('roomtone', 0, { g: 0.2, bed: true })],
    },
    // PIX REVEALS. PIX slips out of the phone, scans the number, and the wall turns to X-ray: a clock and a machine
    {
      zo: 'reveal', lines: [], min: 5.0, bg: '#262A45',
      cam: cam({ z: 1.25, x: 900, y: 600 }, { end: 0, z: 1.1, x: 1000, y: 540, e: 'io' }),
      actors: [...myRoom({ clock: { h: 12, m: 0, run: false, sec: false } }),
        P('hiddenlayer', [{ x: 1180, y: G - 360, w: 760, h: 460, kind: 'money', style: 'xray', open: 0, o: 0, wall: '#3A3F62' }, { t: 2.6, o: 1, open: 0 }, { t: 3.7, open: 1, e: 'io' }], 'layer', -4),
        ph({ screen: 'BALANCE|$975.60|', fs: 20, screenY: 0 }),
        pix([{ x: PH[0] + 30, y: PH[1] - 40, s: 0.2, o: 0, face: 0 }, { t: 0.4, o: 1, e: 'step' }, { t: 1.0, x: 1060, y: 420, s: 1.0, face: 2, e: 'back' }, { t: 2.4, face: 3 }, { t: 2.9, x: 1000, y: 620, face: 1, e: 'io' }, { t: 4.2, face: 2 }]),
        P('scanbeam', [{ x: 1060, y: 420, dx: -220, dy: 200, w: 120, o: 0 }, { t: 1.1, o: 1, e: 'step' }, { t: 2.3, o: 0, e: 'step' }], 'beam', 9),
        zero([hold({ look: [6, -4] }), { t: 0.5, face: 0, look: [8, -6] }, ...stepBack({ t: 0.6 }, ZX0, { dx: -50, face: 0 }), { t: 2.0, face: 2, look: [8, -4] }, ...leanIn({ t: 3.6 }, ZX0 - 50, { face: 2, look: [8, 4], dx: 50 })]), vig(0.55)],
      sfx: [sfx('pix-ting', 0.45, { g: 0.6 }), sfx('scan', 1.1, { g: 0.5 }), sfx('hum', 1.9, { g: 0.3 }), sfx('swipe', 3.0, { g: 0.5 })],
    },
    // ENTRY. The balance lets go of a capsule ($975); ZERO grabs it and the phone swallows them both
    {
      zo: 'entry', lines: [], min: 3.6, bg: '#262A45',
      cam: cam({ z: 1.3, x: 900, y: 620 }, { t: 1.2, z: 1.7, x: 840, y: 640, e: 'io' }, { t: 2.6, z: 2.8, x: PH[0], y: PH[1], e: 'io' }),
      tout: { type: 'zoom', x: PH[0], y: PH[1], dur: 0.7, color: '#050A18' },
      actors: [...myRoom({ clock: { h: 12, m: 0, run: false, sec: false } }),
        P('hiddenlayer', { x: 1180, y: G - 360, w: 760, h: 460, kind: 'money', style: 'xray', open: 1, wall: '#3A3F62' }, 'layer', -4),
        ph({ screen: 'BALANCE|$975.60|', fs: 20, screenY: 0 }),
        P('capsule', [{ x: PH[0] - 10, y: PH[1], s: 0.05, trail: 0, txt: '$975' }, { t: 0.3, s: 0.34, x: PH[0] - 70, y: PH[1] - 110, e: 'back' }, { t: 1.4, x: PH[0] - 100, y: PH[1] - 140 }, { t: 2.3, x: PH[0], y: PH[1] - 30, s: 0.22, e: 'in' }, { t: 2.7, s: 0.05, e: 'in' }], 'cap', 8),
        pix([{ x: 1100, y: 560, s: 1.0, face: 2 }, { t: 0.4, face: 3 }, { t: 1.9, x: PH[0] + 80, y: PH[1] - 60, s: 0.6, e: 'in' }, { t: 2.4, o: 0, e: 'step' }]),
        zero([hold({ look: [8, -6] }), { t: 0.4, face: 1 }, { t: 0.65, squash: 0.82, y: G + 8, pose: 'back', e: 'out' }, { t: 0.95, squash: 1.1, y: 560, x: ZX0 + 30, pose: 'celebrate', e: 'out' }, { t: 1.25, y: G - 330, x: ZX0 + 60, squash: 0.9, pose: 'neutral', s: 1.4, e: 'in' },
          { t: 1.45, squash: 1, pose: 'reach', hr: [150, 40], look: [6, -8], face: 2 }, { t: 2.3, x: PH[0] - 20, y: PH[1] + 40, s: 0.6, pose: 'celebrate', e: 'in' }, { t: 2.7, x: PH[0], y: PH[1] + 40, s: 0.05, o: 0, e: 'in' }], { z: 8 }), vig(0.6)],
      sfx: [sfx('pop', 0.3, { g: 0.5 }), sfx('whoosh', 0.7, { g: 0.6 }), sfx('thud', 1.25, { g: 0.5 }), sfx('whoosh', 2.4, { g: 0.7 })],
    },
    brandBeat({ behind: [P('fiber', { x: 0, y: 0, speed: 3 }, 'fib', -20)] }),
    // THE PROMISE. Inside: ZERO on the capsule, a calendar ahead of him with a green window on the first weeks
    {
      zo: 'promise', lines: [N('Inside, the first thing ZERO finds is a calendar.', { at: 0.05 }), N('And for the first weeks, his thousand dollars cost him nothing.', { gap: 0.3 })],
      min: 9, hold: 0.6, bg: '#050A18',
      cam: cam({ z: 1.12, x: 960, y: 560, shake: 1.2 }, { end: 0, z: 1.0, x: 960, y: 540, e: 'io' }),
      actors: [...fiber({ speed: 1.2 }),
        P('pool', { x: 680, y: 640, rx: 520, ry: 420, kind: 'pix', op: 0.6 }, 'pixlight', 1),
        ...ride(900, 800, 1.5, { cap: { txt: '$975' }, zK: [{ l: 0, look: [4, -8], headR: -6, face: 0 }, { l: 1, look: [6, -6], headR: 4, face: 2 }] }),
        pix([{ x: 560, y: 560, s: 1.3, face: 1 }, { l: 1, face: 2 }]),
        P('calendar', [{ x: 1380, y: 330, s: 1.5, month: 'OCTOBER', today: 0, circ: 0, ui: true, o: 0 }, { l: 0, t: 1.6, o: 0 }, { l: 0, t: 1.9, o: 1, e: 'out' }], 'cal2', 8),
        P('rect', [{ x: 1380, y: 330, w: 330, h: 60, fill: '#58E08A', op: 0, rx: 18 }, { l: 1, op: 0 }, { l: 1, t: 0.2, op: 0.35, e: 'out' }], 'win', 7),
        P('text', [{ x: 1380, y: 560, txt: 'GRACE PERIOD', size: 44, color: '#8FF0B0', o: 0, ui: true }, { l: 1, t: 0.5, o: 1, e: 'step' }], 'gp', 9),
        vig(0.85)],
      sfx: [sfx('fiber', 0, { g: 0.4, bed: true }), sfx('ping', 1.9, { g: 0.3 }), sfx('chime', 0.6, { l: 1, g: 0.3 })],
    },
  ],
};
