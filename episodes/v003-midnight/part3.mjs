// Video 003 "What Your Credit Card Does at Midnight": part 3. Next morning at the café (carrying a balance means every
// purchase costs from day one: a third of a cent a day), the scale (CFPB: $105B in interest, who pays, who gets the
// rewards), the statement's three-year box, two roads, and back to the desk at 11:58 for the circular ending.
import { G, N, zero, pix, sfx, cam, lookCam, tilt, shrug, crossArms } from '../../src/kit.mjs';
import { endMark, ironyBeat } from '../../src/story.mjs';
import { P, vig, ui, fiber, cafe, hand, ZX, myRoom, ph, PH, ZX0, back, oc } from './common.mjs';

const BG = '#050A18';
const zc = (k = [], o = {}) => ui(zero([{ x: o.x ?? 1700, y: 1010, s: o.s ?? 1.7, face: 0, look: [-8, -4], flip: true }, ...k], { z: 48 }));
const dark = (speed = 0.3) => [...fiber({ speed }), P('pool', { x: 960, y: 540, rx: 900, ry: 560, kind: 'pix', op: 0.35 }, 'pl', -10)];
const CARD = 0.62, HC = [123, 124];

export default {
  id: 'v003-part3',
  format: 'long',
  title: 'What Your Credit Card Does at Midnight (part 3)',
  description: 'Part 3 of video 003.',
  tags: ['how it works', 'credit cards', 'interest'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // ===== c1: next morning, same café. He taps again; this time he is carrying a balance =====
    {
      lines: [N('Next morning, ZERO buys a coffee.', { at: 0.4 }), N('Four seventy-five.', { gap: 0.3 }), N("There's one more catch.", { gap: 0.5 }), N('Once you carry a balance, every new purchase starts costing from the day you make it.', { gap: 0.3 })], min: 15, hold: 0.8, bg: '#2A1E18',
      cam: cam({ z: 1.12, x: 880, y: 480 }, { end: 0, z: 1.22, x: 870, y: 500, e: 'lin' }),
      actors: [...cafe({ termK: [{ t: 2.0, l2: 'PROCESSING', timer: 0, wave: 1, e: 'step' }, { t: 3.2, l2: 'APPROVED', ok: 1, timer: 1.63, wave: 0, e: 'step' }] }),
        P('wallclock', { x: 1760, y: 170, s: 0.75, h: 8, m: 14, sec: false }, 'clock', -14),
        P('zcard', [{ x: hand(ZX, G, HC)[0], y: hand(ZX, G, HC)[1], s: CARD, tilt: -8 }, { t: 1.8, x: 935, y: 545, s: 0.5, tilt: 18, e: 'io' }, { t: 3.4, x: hand(ZX, G, HC)[0], y: hand(ZX, G, HC)[1], s: CARD, tilt: -8, e: 'io' }], 'card', 6),
        zero([{ x: ZX, face: 2, pose: 'neutral', hl: [116, 124], hr: [130, 124], look: [6, -4] }, { t: 1.8, pose: 'reach', hr: [166, 30], hl: [92, 166], y: G - 14, face: 0, e: 'io' }, { t: 3.4, pose: 'neutral', hr: [130, 124], hl: [116, 124], y: G, face: 2, e: 'io' }, { l: 2, t: 0.3, face: 3, look: [-4, -6] }, ...lookCam({ l: 3, t: 0.8 }, { face: 4, tilt: 8 })]), vig(0.55)],
      sfx: [sfx('espresso', 0, { g: 0.35, bed: true }), sfx('chatter', 0, { g: 0.3, bed: true }), sfx('beep', 2.0, { g: 0.5 }), sfx('beep', 3.2, { g: 0.5 }), sfx('chime', 3.25, { g: 0.3 }), sfx('tension', 0.2, { l: 3, g: 0.25 })],
    },
    // ===== c2: the coffee as a capsule: a speck of interest every night, a third of a cent =====
    {
      lines: [N("Today, ZERO's coffee costs him a third of a cent.", { at: 0.3 }), N('Tomorrow, another third of a cent.', { gap: 0.4 })], min: 8, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.fib(0.4),
        P('capsule', { x: 960, y: 470, s: 1.9, trail: 0, txt: '$4.75' }, 'cap', 6),
        P('coin', [{ x: 1280, y: 180, s: 0.2, txt: '', color: '#FFC93C', o: 0 }, { l: 0, t: 2.2, o: 0 }, { l: 0, t: 2.3, o: 1, e: 'step' }, { l: 0, t: 3.2, x: 1180, y: 430, s: 0.12, e: 'in' }, { l: 0, t: 3.4, o: 0, e: 'step' }, { l: 1, t: 0.2, x: 1280, y: 180, s: 0.2, o: 1, e: 'step' }, { l: 1, t: 1.1, x: 1180, y: 430, s: 0.12, e: 'in' }, { l: 1, t: 1.3, o: 0, e: 'step' }], 'sp', 8),
        P('text', [{ x: 960, y: 760, txt: '$4.75 × 0.0613% ≈ 0.3¢ A DAY', size: 60, color: '#FFD98A', o: 0 }, { l: 0, t: 1.2, o: 1, e: 'step' }], 'f', 9),
        P('text', [{ x: 960, y: 830, txt: 'ESTIMATE · arithmetic on 22.36% APR', size: 24, color: '#8FA6C8', o: 0 }, { l: 0, t: 1.4, o: 1, e: 'step' }], 'fs', 9),
        zc([{ l: 0, face: 2 }, { l: 1, face: 7 }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('whoosh', 2.3, { g: 0.3 }), sfx('coin', 3.2, { g: 0.3 }), sfx('coin', 1.1, { l: 1, g: 0.3 })],
    },
    // ===== c3: the trick: nothing, multiplied by everyone. ZERO looks at us =====
    {
      lines: [N('A third of a cent.', { at: 0.3 }), N("That's the whole trick of this system.", { gap: 0.4 }), N('Almost nothing,', { gap: 0.5 }), N('multiplied by everyone.', { gap: 0.2 }), N('So how big does almost nothing get?', { gap: 0.6 })], min: 10, hold: 0.8, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.08, x: 960, y: 540, e: 'lin' }),
      actors: [...back.fib(0.4),
        P('capsule', [{ x: 960, y: 500, s: 1.4, trail: 0, txt: '0.3¢' }, { l: 2, t: 0.3, s: 1.4 }, { l: 3, t: 0.1, s: 0.4, e: 'in' }], 'cap', 6),
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => P('capsule', [{ x: 300 + (i % 6) * 270, y: 260 + Math.floor(i / 6) * 520, s: 0.01, trail: 0, txt: '0.3¢', o: 0 }, { l: 3, t: 0.1 + i * 0.12, o: 1, s: 0.45, e: 'back' }], 'm' + i, 5)),
        zero([{ x: 1600, y: G + 20, s: 2.3, face: 0, look: [-8, -4], flip: true }, { l: 1, face: 1 }, ...lookCam({ l: 2, t: 0.4 }, { face: 1 })], { z: 5 }), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('tension', 0.2, { l: 2, g: 0.3 }), sfx('pop', 0.1, { l: 3, g: 0.3 })],
    },
    // ===== r1: the pull-out: all the night machines. $105 billion in 2022 =====
    {
      lines: [N('Now zoom out.', { at: 0.3 }), N('In twenty twenty-two, American cardholders were charged more than a hundred and five billion dollars in interest.', { gap: 0.4 }), N('And who pays it?', { gap: 0.5 })], min: 13, hold: 1.0, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 960, y: 540, e: 'lin' }),
      actors: [...back.fib(0.3),
        P('coinmountain', [{ x: 960, y: 1040, s: 0.9, k: 0.15 }, { l: 1, t: 0.2, k: 0.15 }, { l: 1, t: 1.0, k: 1, e: 'io' }], 'mtn', 3),
        P('counterwall', [{ x: 960, y: 340, s: 0.9, cap: 'CARD INTEREST CHARGED, U.S., 2022', n: 105, k: 0, pre: '$', unit: ' BILLION', size: 100, color: '#FF9A8A', sub: 'CFPB · THE CONSUMER CREDIT CARD MARKET, 2023', o: 0 }, { l: 1, t: 0.6, o: 1, k: 0, e: 'step' }, { l: 1, t: 1.0, k: 1, e: 'lin' }], 'int', 6),
        zero([{ x: 300, y: G + 20, s: 2.0, face: 0, look: [8, -6] }, { l: 1, t: 1.5, face: 3 }], { z: 5 }), oc(), vig(0.65)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('whoosh', 0.3, { g: 0.5 }), sfx('roll', 1.0, { l: 1, g: 0.4 }), sfx('chime', 3.0, { l: 1, g: 0.35 })],
    },
    // ===== r2: who pays it, who gets the rewards: two bars (carry a balance vs pay in full) =====
    {
      lines: [N('Ninety-four percent of the interest and fees came from people who carry a balance.', { at: 0.3 }), N('They earned twenty-seven percent of the rewards.', { gap: 0.5 }), N('The people who pay in full paid six percent,', { gap: 0.5 }), N('and earned seventy-three percent of the rewards.', { gap: 0.3 })], min: 19, hold: 1.0, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...back.bank(),
        P('text', { x: 960, y: 120, txt: 'WHO PAYS · WHO GETS THE REWARDS', size: 44, color: '#C9D3E6' }, 'hd', 9),
        P('text', { x: 400, y: 260, txt: 'CARRY A BALANCE', size: 40, color: '#FF9A8A' }, 'h1', 9),
        P('text', { x: 1520, y: 260, txt: 'PAY IN FULL', size: 40, color: '#8FF0B0' }, 'h2', 9),
        // interest and fees paid
        P('rect', [{ x: 130, y: 380, w: 20, h: 70, fill: '#FF6B5B', rx: 10 }, { l: 0, t: 0.8, x: 400, w: 560, e: 'out' }], 'a1', 6),
        P('text', [{ x: 400, y: 470, txt: '94% OF INTEREST + FEES', size: 28, color: '#FFD9D2', o: 0 }, { l: 0, t: 1.2, o: 1, e: 'step' }], 'a1t', 9),
        P('rect', [{ x: 1250, y: 380, w: 20, h: 70, fill: '#58E08A', rx: 10 }, { l: 2, t: 0.8, x: 1258, w: 36, e: 'out' }], 'a2', 6),
        P('text', [{ x: 1520, y: 470, txt: '6%', size: 28, color: '#C8F5D6', o: 0 }, { l: 2, t: 1.2, o: 1, e: 'step' }], 'a2t', 9),
        // rewards earned
        P('rect', [{ x: 130, y: 640, w: 20, h: 70, fill: '#F2C14E', rx: 10 }, { l: 1, t: 0.6, x: 200, w: 160, e: 'out' }], 'b1', 6),
        P('text', [{ x: 400, y: 730, txt: '27% OF REWARDS', size: 28, color: '#FFE9B0', o: 0 }, { l: 1, t: 1.0, o: 1, e: 'step' }], 'b1t', 9),
        P('rect', [{ x: 1250, y: 640, w: 20, h: 70, fill: '#F2C14E', rx: 10 }, { l: 3, t: 0.8, x: 1460, w: 440, e: 'out' }], 'b2', 6),
        P('text', [{ x: 1520, y: 730, txt: '73% OF REWARDS', size: 28, color: '#FFE9B0', o: 0 }, { l: 3, t: 1.2, o: 1, e: 'step' }], 'b2t', 9),
        P('text', { x: 960, y: 960, txt: 'CFPB · 2023 · DATA FOR 2022', size: 24, color: '#8FA6C8' }, 'src', 9),
        zc([{ l: 0, face: 3 }, { l: 1, face: 4 }, { l: 3, face: 9 }], { x: 960, s: 1.4 }), oc(), vig(0.65)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('swipe', 0.8, { l: 0, g: 0.4 }), sfx('swipe', 0.6, { l: 1, g: 0.4 }), sfx('swipe', 0.8, { l: 2, g: 0.4 }), sfx('swipe', 0.8, { l: 3, g: 0.4 })],
    },
    // ===== r3: the cash back at the café: its nickel goes to the people who never pay interest =====
    {
      lines: [N('So the cash back at the café?', { at: 0.3 }), N('Most of it goes to people who never pay a cent of interest.', { gap: 0.4 })], min: 9, hold: 1.0, bg: '#2A1E18',
      cam: cam({ z: 1.15, x: 760, y: 520 }, { end: 0, z: 1.25, x: 700, y: 520, e: 'lin' }),
      actors: [...cafe({ term: { l2: 'APPROVED', ok: 1, timer: 1.63 } }),
        P('coin', [{ x: hand(ZX, G, [140, 104])[0], y: hand(ZX, G, [140, 104])[1], s: 0.45, o: 0 }, { l: 0, t: 0.8, o: 1, e: 'step' }, { l: 1, t: 0.4, x: 900, y: 700, s: 0.5, e: 'io' }], 'nick', 7),
        P('text', [{ x: 1330, y: 330, txt: '73% OF REWARDS', size: 50, color: '#8FF0B0', o: 0, ui: true }, { l: 1, t: 1.0, o: 1, e: 'step' }], 'rw', 46),
        zero([{ x: ZX, face: 2, pose: 'neutral', hl: [116, 124], hr: [140, 104], look: [6, -4] }, { l: 0, t: 0.8, face: 0 }, { l: 1, t: 0.6, face: 4, headR: 10, e: 'out' }, ...lookCam({ l: 1, t: 2.2 }, { face: 1 })]), vig(0.55)],
      sfx: [sfx('chatter', 0, { g: 0.3, bed: true }), sfx('coin', 0.8, { l: 0, g: 0.4 }), sfx('ping', 1.0, { l: 1, g: 0.4 })],
    },
    // ===== r4: and a late payment adds a fee on top: $14.5B in 2022 =====
    {
      lines: [N("And if he'd paid even one day late, there's a fee on top.", { at: 0.3 }), N('In twenty twenty-two, late fees alone added up to fourteen and a half billion dollars.', { gap: 0.4 })], min: 11, hold: 1.0, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...back.hall(),
        P('calendar', [{ x: 560, y: 330, s: 1.8, month: 'DUE DATE', today: 20, circ: 1 }, { l: 0, t: 1.4, today: 21, e: 'step' }], 'cal', 5),
        P('rect', [{ x: 560, y: 650, w: 330, h: 60, fill: '#FF6B5B', rx: 16, op: 0 }, { l: 0, t: 1.6, op: 0.9, e: 'step' }], 'late', 4),
        P('text', [{ x: 560, y: 650, txt: 'LATE FEE', size: 34, color: '#3A0F0A', o: 0 }, { l: 0, t: 1.7, o: 1, e: 'step' }], 'latet', 9),
        P('counterwall', [{ x: 1350, y: 480, s: 0.8, cap: 'LATE FEES, U.S., 2022', n: 14.5, dec: 1, k: 0, pre: '$', unit: ' BILLION', size: 100, color: '#FF9A8A', sub: 'CFPB, 2023', o: 0, w: 1000 }, { l: 1, t: 0.4, o: 1, k: 0, e: 'step' }, { l: 1, t: 0.8, k: 1, e: 'lin' }], 'lf', 6),
        zc([{ l: 0, face: 3 }, { l: 1, face: 9, pose: 'scared' }], { x: 960, s: 1.4 }), oc(), vig(0.65)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('dun', 1.6, { g: 0.5 }), sfx('roll', 0.8, { l: 1, g: 0.35 }), sfx('chime', 3.0, { l: 1, g: 0.35 })],
    },
    // ===== r5: persistent debt: nearly one in ten pay more in interest and fees than toward what they borrowed =====
    {
      lines: [N('And for nearly one in ten cardholders,', { at: 0.3 }), N('the bank takes more each year in interest and fees', { gap: 0.2 }), N('than they pay toward what they actually borrowed.', { gap: 0.2 }), N('The CFPB calls it persistent debt.', { gap: 0.5 })], min: 14, hold: 1.0, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...back.net(),
        P('text', { x: 960, y: 140, txt: 'NEARLY 1 IN 10 CARDHOLDERS', size: 54, color: '#FFD98A' }, 'hd', 9),
        P('rect', [{ x: 130, y: 420, w: 20, h: 90, fill: '#58E08A', rx: 14 }, { l: 2, t: 0.4, x: 300, w: 340, e: 'out' }], 'p1', 6),
        P('text', [{ x: 300, y: 500, txt: 'PAID TOWARD WHAT THEY BORROWED', size: 28, color: '#C8F5D6', o: 0 }, { l: 2, t: 0.8, o: 1, e: 'step' }], 'p1t', 9),
        P('rect', [{ x: 130, y: 640, w: 20, h: 90, fill: '#FF6B5B', rx: 14 }, { l: 1, t: 0.4, x: 700, w: 1140, e: 'out' }], 'p2', 6),
        P('text', [{ x: 700, y: 720, txt: 'INTEREST AND FEES, SAME YEAR', size: 28, color: '#FFD9D2', o: 0 }, { l: 1, t: 0.8, o: 1, e: 'step' }], 'p2t', 9),
        P('text', [{ x: 960, y: 900, txt: 'PERSISTENT DEBT · CFPB, 2023', size: 36, color: '#8FA6C8', o: 0 }, { l: 3, t: 0.3, o: 1, e: 'step' }], 'pd', 9),
        zc([{ l: 0, face: 3 }, { l: 1, face: 4 }, { l: 3, face: 9 }], { x: 1700, s: 1.5 }), oc(), vig(0.65)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('swipe', 0.4, { l: 1, g: 0.4 }), sfx('swipe', 0.4, { l: 2, g: 0.4 }), sfx('dun', 0.3, { l: 3, g: 0.5 })],
    },
    // ===== q1: the three-year box on every statement (law): does the math for him =====
    {
      lines: [N('By law, every statement has a box that does the math.', { at: 0.3 }), N('So how long would it take, paying only the minimum?', { gap: 0.4 })], min: 9, hold: 1.0, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.fib(0.3),
        P('rect', { x: 960, y: 540, w: 1000, h: 640, fill: '#F4F1EA', rx: 18 }, 'paper', 4),
        P('text', { x: 960, y: 310, txt: 'MINIMUM PAYMENT WARNING', size: 36, color: '#5C6684' }, 'w', 9),
        P('rect', [{ x: 960, y: 540, w: 880, h: 300, fill: '#FFFFFF', rx: 12, op: 0 }, { l: 0, t: 0.8, op: 1 }], 'box', 5),
        P('text', [{ x: 960, y: 480, txt: 'ONLY THE MINIMUM:', size: 40, color: '#1B1E33', o: 0 }, { l: 1, t: 0.2, o: 1, e: 'step' }], 'l1', 9),
        P('text', [{ x: 960, y: 560, txt: '69 MONTHS', size: 110, color: '#E63946', o: 0 }, { l: 1, t: 0.6, o: 1, e: 'step' }], 'l2', 9),
        P('text', [{ x: 960, y: 650, txt: '≈ $735 IN INTEREST', size: 60, color: '#1B1E33', o: 0 }, { l: 1, t: 1.0, o: 1, e: 'step' }], 'l3', 9),
        P('text', { x: 960, y: 780, txt: 'ESTIMATE · CFPB requires the box; these figures are our model of ZERO\'s $1,000', size: 22, color: '#5C6684' }, 'src', 9),
        zc([{ l: 0, face: 2 }, { l: 1, face: 3 }], { x: 1700 }), oc(), vig(0.65)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('swipe', 0.2, { g: 0.4 }), sfx('buzz', 0.4, { l: 1, g: 0.3 }), sfx('dun', 0.7, { l: 1, g: 0.5 })],
    },
    // ===== q2: two roads, same debt: minimum vs $100 a month =====
    {
      lines: [N('Paying a hundred a month instead?', { at: 0.3 }), N('About eleven months.', { gap: 0.4 }), N('And around ninety-four dollars in interest.', { gap: 0.4 })], min: 11, hold: 1.0, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 540, e: 'lin' }),
      actors: [...back.bank(),
        P('text', { x: 480, y: 220, txt: 'ONLY THE MINIMUM', size: 44, color: '#FF9A8A' }, 'h1', 9),
        P('text', { x: 1440, y: 220, txt: '$100 A MONTH', size: 44, color: '#8FF0B0' }, 'h2', 9),
        P('rect', [{ x: 130, y: 540, w: 20, h: 60, fill: '#FF6B5B', rx: 12 }, { l: 0, t: 0.4, x: 470, w: 700, e: 'out' }], 'r1', 6),
        P('text', [{ x: 480, y: 640, txt: '69 MONTHS · ≈ $735', size: 44, color: '#FFD9D2', o: 0 }, { l: 0, t: 1.4, o: 1, e: 'step' }], 'r1t', 9),
        P('rect', [{ x: 1250, y: 540, w: 20, h: 60, fill: '#58E08A', rx: 12 }, { l: 1, t: 0.4, x: 1295, w: 110, e: 'out' }], 'r2', 6),
        P('text', [{ x: 1440, y: 640, txt: '11 MONTHS · ≈ $94', size: 44, color: '#C8F5D6', o: 0 }, { l: 1, t: 1.2, o: 1, e: 'step' }], 'r2t', 9),
        P('text', { x: 960, y: 900, txt: 'ESTIMATE · $1,000 at 22.36% APR, no new purchases', size: 24, color: '#8FA6C8' }, 'src', 9),
        zc([{ l: 0, face: 3 }, { l: 1, face: 2 }, { l: 2, face: 7 }], { x: 960, s: 1.4 }), oc(), vig(0.65)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('swipe', 0.4, { l: 0, g: 0.4 }), sfx('swipe', 0.4, { l: 1, g: 0.4 }), sfx('chime', 1.2, { l: 1, g: 0.4 })],
    },
    // ===== q3: same card, same debt, one number he chooses once =====
    {
      lines: [N('Same card.', { at: 0.3 }), N('Same debt.', { gap: 0.3 }), N('One number he chooses once.', { gap: 0.5 })], min: 7, hold: 1.0, bg: BG,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.08, x: 960, y: 540, e: 'lin' }),
      actors: [...back.fib(0.3),
        P('capsule', { x: 960, y: 420, s: 2.0, trail: 0, txt: '$975' }, 'cap', 6),
        P('text', [{ x: 960, y: 700, txt: 'PAYMENT: $___', size: 100, color: '#FFD98A', o: 0 }, { l: 2, t: 0.1, o: 1, e: 'step' }], 'pay', 9),
        zc([{ l: 0, face: 0 }, { l: 2, face: 2, pose: 'proud' }]), vig(0.7)],
      sfx: [sfx('fiber', 0, { g: 0.3, bed: true }), sfx('ping', 0.1, { l: 2, g: 0.4 })],
    },
    // ===== e1: back at the desk, 11:58 next month: he sets $100. He stays up to watch midnight; the coin falls, smaller =====
    {
      lines: [N('Next month. Eleven fifty-eight.', { at: 0.4 }), N('This time ZERO chooses the number himself.', { gap: 0.3 })], min: 8, hold: 0.6, bg: '#262A45',
      cam: cam({ z: 1.12, x: 900, y: 520 }, { end: 0, z: 1.22, x: 860, y: 540, e: 'lin' }),
      actors: [...myRoom({ clock: { h: 11, m: 58, run: true } }),
        ph({ screen: 'PAY|$100.00|', fs: 20 }, [{ l: 1, t: 1.2, screen: 'AUTOPAY|$100.00|EVERY MONTH', e: 'step' }]),
        zero([{ x: ZX0, face: 0, pose: 'neutral', hr: [140, 104], hl: [96, 130], look: [4, 6] }, { l: 1, t: 1.0, hr: [150, 96], e: 'io' }, { l: 1, t: 1.2, hr: [140, 104], face: 2, squash: 0.96 }, { l: 1, t: 1.4, squash: 1 }]), vig(0.5)],
      sfx: [sfx('tick', 0, { g: 0.25, bed: true }), sfx('beep', 1.2, { l: 1, g: 0.5 })],
    },
    // ===== e2: the irony (no words): the 5¢ cash back on the desk; the midnight coin falls and takes it =====
    {
      act: 'understands', lines: [], min: 7.5, bg: '#262A45',
      cam: cam({ z: 1.3, x: 1000, y: 620 }, { end: 0, z: 1.45, x: 1020, y: 640, e: 'lin' }),
      actors: [...myRoom({ clock: { h: 11, m: 59.2, run: false, sec: false }, clockK: [{ t: 0.8, h: 11, m: 59.2 }, { t: 1.6, h: 12, m: 0, e: 'out' }] }),
        ph({ screen: 'BALANCE|$...|', fs: 20 }),
        P('coin', [{ x: 1180, y: G - 190, s: 0.45, txt: '5¢', color: '#C9CED8' }, { t: 4.4, x: 1180, y: G - 190 }, { t: 5.0, x: 1230, y: 160, s: 0.4, e: 'in' }, { t: 5.2, o: 0, e: 'step' }], 'nick', 7),
        P('coin', [{ x: 1180, y: -60, s: 0.8, txt: '60¢', color: '#FFC93C', o: 0 }, { t: 1.7, o: 0 }, { t: 1.8, o: 1, e: 'step' }, { t: 3.6, x: 1180, y: G - 215, s: 0.6, roll: 360, e: 'in' }, { t: 4.4, x: 1180, y: G - 215 }, { t: 5.0, x: 1230, y: 160, s: 0.5, e: 'in' }, { t: 5.2, o: 0, e: 'step' }], 'mid', 8),
        zero([{ x: ZX0, face: 2, pose: 'neutral', hr: [140, 104], hl: [96, 130], look: [4, 6] }, { t: 1.7, face: 3, look: [10, -8] }, { t: 3.6, look: [10, 2], face: 3 }, { t: 4.8, face: 4, headR: 8, look: [10, -8] }, ...lookCam({ t: 5.6 }, { face: 1 })]),
        pix([{ x: 1700, y: 380, s: 1.1, face: 0, o: 0 }, { t: 6.0, o: 1, e: 'step' }, { t: 6.4, face: 4 }]),
        P('bubble', [{ x: 1790, y: 250, txt: '...', w: 170, h: 100, o: 0 }, { t: 6.5, o: 1, e: 'step' }], 'dots', 10), vig(0.55)],
      sfx: [sfx('tick', 0, { g: 0.25, bed: true, dur: 1.7 }), sfx('chime', 1.7, { g: 0.5 }), sfx('whoosh', 1.9, { g: 0.5 }), sfx('coin', 3.6, { g: 0.6 }), sfx('whoosh', 4.9, { g: 0.5 }), sfx('zero-boop', 5.6, { g: 0.4 })],
    },
    // ===== e3: the question for next time: the phone buzzes with a charge he didn't make =====
    ironyBeat({ set: myRoom({ clock: { h: 12, m: 1, run: false, sec: false } }), at: { x: ZX0, y: G }, phone: ['', 'Was this you? $479.99 · unknown shop'], bg: '#262A45',
      lines: [N("And what happens the day someone else uses his card?", { at: 1.6 }), N("That's a whole other system.", { gap: 0.6 })] }),
    endMark(),
  ],
};
