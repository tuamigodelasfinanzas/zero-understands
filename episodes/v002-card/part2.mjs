// Video 002 "What Happens in the 2 Seconds After You Tap Your Card": part 2 (script scenes s13-s31), the journey.
// Three stops, each with its own colour: SHOP SIDE (teal sorting hall), the NETWORK (navy-and-gold grand station, then
// the data centre), ZERO'S BANK (burgundy and brass: the vault, the scale of trust, the risk dial). The answer rides
// back, the café unfreezes, and the cliffhanger: nobody has paid anybody yet.
import { G, N, zero, pix, sfx, cam, lookCam, tilt, shrug } from '../../src/kit.mjs';
import { P, vig, ui, sysOn, FREEZE, TERM, ZX, hand, cafe, fiber, ride } from './common.mjs';

const TAP = [935, 545];
const person = (k, id, z = -1) => P('person', k, id, z);
const BANK = 8000, NETX = 16000, ACQX = 24000, TERMX = 32000;    // far-apart sets for the cuts of the return montage

// ---------- the sets ----------
const acq = (o = {}) => [P('acqhall', { x: (o.x ?? 0) + 960, y: G, flow: o.flow ?? 1, rev: o.rev ?? 0 }, 'acq' + (o.id ?? ''), -20),
  P('pool', { x: (o.x ?? 0) + 960, y: 760, rx: 900, ry: 260, kind: 'warm', op: 0.35 }, 'acqpool' + (o.id ?? ''), -12)];
const net = (o = {}) => [P('nethall', [{ x: (o.x ?? 0) + 960, y: G, speed: o.speed ?? 1, flood: o.flood ?? 0, blur: o.blur ?? 0 }, ...(o.k || [])], 'net' + (o.id ?? ''), -20),
  P('pool', { x: (o.x ?? 0) + 960, y: 300, rx: 1100, ry: 600, kind: 'cool', op: 0.3 }, 'netpool' + (o.id ?? ''), -12)];
const room = (k = [], o = {}) => [P('bankroom', [{ x: (o.x ?? 0) + 960, y: G, light: 0, lcol: 'coral' }, ...k], 'room' + (o.id ?? ''), -20)];
// the scale of trust with the question (the capsule) floating over its pivot
const SC = [1150, G], CAPQ = [1150, 196];
const scale = (k = []) => P('riskscale', [{ x: SC[0], y: SC[1], s: 0.75, tilt: 0, nl: 0, ev: ['REAL CHIP', '$4.75', '3 BLOCKS AWAY'], ne: 0 }, ...k], 'scale', -4);
const dial = (k = []) => P('riskdial', [{ x: 400, y: 430, s: 0.62, v: 0.35 }, ...k], 'dial', -4);
const qcap = (k = []) => P('capsule', [{ x: CAPQ[0], y: CAPQ[1], s: 0.55, trail: 0, txt: '?' }, ...k], 'cap', 2);

export default {
  id: 'v002-part2',
  format: 'long',
  title: 'What Happens in the 2 Seconds After You Tap Your Card (animatic, part 2)',
  description: 'Animatic of the second part of video 002.',
  tags: ['how it works', 'credit cards', 'payments'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // ===== s13: STOP 1, SHOP SIDE. The capsule drops out of a pneumatic tube into an inbox tray; ZERO tumbles out,
    // dusts himself off. A clerk looks at him: no idea who he is =====
    {
      lines: [N('First stop:', { at: 1.4 }), N('a company the coffee shop pays to handle its cards.', { gap: 0.15 }), N('It works for the shop, not for ZERO.', { gap: 0.4 }), N('And it has no idea who he is.', { gap: 0.3 })],
      min: 11, bg: '#1A2E2E',
      cam: cam({ z: 0.62, x: 960, y: 170 }, { t: 1.2, z: 0.62, x: 960, y: 170 }, { l: 1, t: 1.6, z: 1.0, x: 1060, y: 520, e: 'io' }, { l: 3, z: 1.35, x: 1180, y: 600, e: 'io' }),
      actors: [...acq(),
        person([{ x: 300, y: G - 30, s: 2.0, pose: 'type', shirt: '#E8E2D6', skin: '#8E6450', hair: '#1E1820', seed: 21, look: 0.1 }], 'op1', -8),
        person([{ x: 640, y: G - 30, s: 2.0, pose: 'carry', shirt: '#9FB3B0', skin: '#D8B08C', hair: '#6B4A2A', seed: 22, flip: true }], 'op2', -8),
        person([{ x: 1560, y: G - 10, s: 2.1, pose: 'type', shirt: '#E8E2D6', skin: '#B9876A', hair: '#3A2A22', seed: 23, look: 0.4, flip: true }, { l: 3, pose: 'stand', look: -0.8 }, { l: 3, t: 1.0, pose: 'shrug' }], 'clerk', -8),
        P('tray', { x: 1240, y: G + 20, s: 1.1, txt: 'SHOP SIDE · IN' }, 'tray', 6),
        ...ride(1260, 300, 0.6, { trail: 0, look: [0, 6], face: 3,
          capK: [{ t: 0.5, y: 300 }, { t: 1.0, y: G - 70, e: 'in' }, { t: 1.15, y: G - 110, ang: 8, e: 'out' }, { t: 1.35, y: G - 70, ang: 0, e: 'in' }],
          zK: [{ t: 0.5, y: 300 - 38 * 0.6 + 36 * 0.702 }, { t: 1.0, y: G - 70 - 22.8 + 25.3, e: 'in' }, { t: 1.15, x: 1100, y: G - 260, s: 2.0, pose: 'celebrate', fl: null, fr: null, hl: null, hr: null, face: 3, e: 'out' },
            { t: 1.55, x: 900, y: G, squash: 0.85, pose: 'neutral', e: 'in' }, { t: 1.75, squash: 1, face: 1 },
            { l: 1, t: 0.2, pose: 'hips', hl: [96, 170], hr: [104, 170], look: [-4, 6] }, { l: 1, t: 0.6, hl: [92, 176], hr: [108, 164] }, { l: 1, t: 1.0, hl: [96, 166], hr: [104, 176] }, { l: 1, t: 1.5, pose: 'neutral', hl: null, hr: null, look: [6, -2], face: 2 },
            { l: 2, pose: 'point', hr: [150, 100], look: [-6, -2], face: 0 }, { l: 2, t: 1.4, pose: 'neutral', hr: null },
            { l: 3, look: [8, -2], face: 2, pose: 'wave', hr: [150, 100] }, { l: 3, t: 0.3, hr: [150, 78] }, { l: 3, t: 0.6, hr: [150, 100] }, { l: 3, t: 1.2, pose: 'neutral', hr: null, face: 1 }, ...lookCam({ l: 3, t: 1.6 }, { face: 1 })] }),
        pix([{ x: 1500, y: 260, s: 0.9, face: 0, o: 0 }, { t: 1.6, o: 1, e: 'step' }, { t: 1.9, x: 1400, y: 380, s: 1.1, face: 2, e: 'out' }, { l: 2, face: 1 }, { l: 3, face: 5 }]),
        vig(0.6)],
      sfx: [sfx('tunnel', 0, { g: 0.2, bed: true }), sfx('whoosh', 0.4, { g: 0.6 }), sfx('thud', 1.0, { g: 0.6 }), sfx('boing', 1.15, { g: 0.35 }), sfx('thud', 1.55, { g: 0.4 }), sfx('type', 0, { l: 1, g: 0.25 })],
    },
    // ===== s14: the first eight digits light up on a departure board; they name the network and the bank; the rail
    // switch swings toward NETWORK and the capsule, with ZERO on it, takes that track =====
    {
      lines: [N('It only reads the first digits of the card number.', { at: 0.3 }), N('They say which network to ask,', { gap: 0.4 }), N('and which bank is behind the card.', { gap: 0.1 })],
      min: 8.5, hold: 1.4, bg: '#1A2E2E',
      cam: cam({ z: 1.0, x: 960, y: 520 }, { end: 0, z: 1.05, x: 980, y: 520, e: 'lin' }),
      actors: [...acq(), P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#05070F', op: 0.65 }, 'dim', -10),
        P('binboard', [{ x: 960, y: 330, s: 0.95, k: 0, ans: 0, sw: 0 }, { t: 0.8, k: 0 }, { l: 0, t: 2.4, k: 1, e: 'lin' }, { l: 1, ans: 0 }, { l: 1, t: 0.5, ans: 1, e: 'out' }, { l: 1, t: 0.8, sw: 0 }, { l: 1, t: 1.3, sw: 1, e: 'back' }], 'bin', 0),
        ...ride(150, 816, 0.42, { trail: 0.4, look: [8, -6], face: 0,
          path: [{ l: 1, t: 1.4, x: 150, y: 816 }, { end: 0.9, x: 960, y: 816, e: 'in' }, { end: 0, x: 1720, y: 656, e: 'lin' }],
          zK: [{ l: 0, t: 1.0, look: [4, -8], face: 0 }, { l: 1, face: 2, look: [6, -6] }, { end: 0.9, face: 3 }] }),
        ui(pix([{ x: 1720, y: 860, s: 0.8, face: 1 }, { l: 0, t: 0.5, face: 2 }, { end: 1.0, x: 1840, y: 600, e: 'in' }])),
        vig(0.7)],
      sfx: [sfx('tunnel', 0, { g: 0.15, bed: true }), sfx('tick', 0.8, { g: 0.3 }), sfx('tick', 1.1, { g: 0.3 }), sfx('tick', 1.4, { g: 0.3 }), sfx('tick', 1.7, { g: 0.3 }), sfx('tick', 2.0, { g: 0.3 }), sfx('tick', 2.3, { g: 0.3 }), sfx('tick', 2.6, { g: 0.3 }), sfx('tick', 2.9, { g: 0.3 }),
        sfx('clunk', 1.3, { l: 1, g: 0.6 }), sfx('belt', 1.4, { l: 1, g: 0.3, bed: true, dur: 3 }), sfx('whoosh', 0.9, { end: 0.9, g: 0.5 })],
    },
    // ===== s15: in the cable to the network (gold light). PIX projects ZERO's frozen coffee; ZERO tilts his head =====
    {
      lines: [N('Which raises a better question.', { at: 0.3 }), N('Why does a coffee need a network at all?', { gap: 0.3 })], min: 5.6, bg: '#120E05',
      cam: cam({ z: 1.12, x: 960, y: 560 }, { end: 0, z: 1.2, x: 960, y: 560, e: 'lin' }),
      tout: { type: 'zoom', x: 960, y: 470, dur: 0.6, color: '#0C1130' },
      actors: [...fiber({ speed: 1.2, tint: '#E2B54E', bg: '#120E05' }), P('pool', { x: 860, y: 680, rx: 520, ry: 420, kind: 'pix', op: 0.6 }, 'pixlight', 1),
        ...ride(760, 780, 1.3, { trail: 0.7, look: [8, -6], zK: [{ l: 1, look: [10, -8], face: 0 }, ...tilt({ l: 1, t: 1.2 }, { deg: 14, face: 1 })] }),
        P('holo', [{ x: 1380, y: 420, w: 380, h: 330, txt: 'ONE COFFEE · $4.75', size: 26, color: '#FFD98A', on: 0 }, { l: 1, on: 0 }, { l: 1, t: 0.3, on: 1, e: 'out' }], 'cupholo', 6),
        P('cup', [{ x: 1380, y: 470, s: 1.3, o: 0 }, { l: 1, t: 0.25, o: 0 }, { l: 1, t: 0.4, o: 0.9, e: 'step' }], 'cuph', 7),
        pix([{ x: 1100, y: 300, s: 1.0, face: 2 }, { l: 1, x: 1160, y: 260, face: 1 }]), vig(0.8)],
      sfx: [sfx('fiber', 0, { g: 0.35, bed: true }), sfx('pix-ting', 0.2, { l: 1, g: 0.5 }), sfx('whoosh', 0, { end: 0.6, g: 0.6 })],
    },
    // ===== s16: STOP 2, the NETWORK. Pull out from ZERO on the floor to the whole grand station: rivers of
    // capsules crossing at three heights, bridges, the gold NETWORK sign. ZERO's jaw drops =====
    {
      lines: [N('Because thousands of banks issue cards,', { at: 0.8 }), N('and millions of shops take them.', { gap: 0.15 }), N('Most of them have never met.', { gap: 0.4 }), N('The network is where they all agree to meet,', { gap: 0.4 }), N('under one set of rules.', { gap: 0.1 })],
      min: 12, bg: '#0C1130',
      cam: cam({ z: 1.7, x: 940, y: 760 }, { t: 0.4, z: 1.7, x: 940, y: 760 }, { l: 1, t: 1.2, z: 0.48, x: 960, y: 200, e: 'io' }, { end: 0, z: 0.5, x: 960, y: 220, e: 'lin' }),
      actors: [...net({ speed: 1 }),
        ...ride(900, G - 70, 0.6, { trail: 0, look: [0, -8], face: 0, cap: { glow: 1.4 }, zK: [{ t: 0.5, face: 3, look: [0, -10] }, { l: 2, face: 3, look: [-6, -8] }, { l: 3, face: 2, look: [6, -8] }] }),
        pix([{ x: 1080, y: 640, s: 0.6, face: 2 }, { l: 1, x: 1180, y: 520, face: 3 }]),
        P('holo', [{ x: 260, y: -160, w: 420, h: 200, icon: 'bank', txt: 'BANKS: THOUSANDS', size: 26, on: 0 }, { l: 0, t: 0.6, on: 1, e: 'out' }], 'hb', 9),
        P('holo', [{ x: 1660, y: -160, w: 420, h: 200, icon: 'shop', txt: 'SHOPS: MILLIONS', size: 26, on: 0 }, { l: 1, t: 0.3, on: 1, e: 'out' }], 'hs', 9),
        vig(0.55)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('whoosh', 0.5, { l: 1, g: 0.5 }), sfx('chime', 0.3, { l: 3, g: 0.3 })],
    },
    // ===== s17: the wall counter rolls up to 258 billion; the rivers speed up into streaks; ZERO counts on his
    // fingers and gives up =====
    {
      lines: [N("In the U.S., that's mostly Visa or Mastercard.", { at: 0.3 }), N('In a single year, Visa alone handled 258 billion payments.', { gap: 0.4 }), N("That's about eight thousand every second.", { gap: 0.4 })],
      min: 10.5, hold: 1.0, bg: '#0C1130',
      cam: cam({ z: 0.8, x: 960, y: 330 }, { end: 0, z: 0.86, x: 960, y: 340, e: 'lin' }),
      actors: [...net({ k: [{ l: 2, speed: 1 }, { l: 2, t: 1.2, speed: 4, blur: 1, e: 'in' }] }),
        P('counterwall', [{ x: 960, y: 60, s: 1.0, cap: 'PAYMENTS IN ONE YEAR', n: 258000000000, k: 0, sub: '≈ 8,200 EVERY SECOND', subOn: 0 }, { l: 1, t: 0.6, k: 0 }, { l: 1, t: 3.2, k: 1, e: 'out' }, { l: 2, subOn: 0 }, { l: 2, t: 1.4, subOn: 1, e: 'step' }], 'ctr', 2),
        P('text', [{ x: 960, y: 290, txt: 'VISA, FISCAL YEAR 2025', size: 24, color: '#8FA6C8', o: 0 }, { l: 1, t: 3.2, o: 1, e: 'step' }], 'src', 3),
        ...ride(1000, G - 60, 0.75, { trail: 0, look: [0, -8], face: 0,
          zK: [{ l: 1, t: 1.0, pose: 'think', hl: null, hr: null, fl: [120, 196], fr: [134, 200], face: 0, look: [0, -8] }, { l: 1, t: 1.6, hr: [150, 100] }, { l: 1, t: 2.0, hr: [150, 90] }, { l: 1, t: 2.4, hr: [150, 80] }, { l: 2, t: 1.4, face: 9 }, { l: 2, t: 2.2, pose: 'shrug', hr: null, face: 1 }] }),
        pix([{ x: 1300, y: 700, s: 0.8, face: 2 }, { l: 2, t: 1.4, face: 3 }]), vig(0.55)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('tick', 0.6, { l: 1, g: 0.25 }), sfx('tick', 1.2, { l: 1, g: 0.25 }), sfx('tick', 1.8, { l: 1, g: 0.25 }), sfx('tick', 2.4, { l: 1, g: 0.25 }), sfx('dato', 3.2, { l: 1, g: 0.5 }), sfx('jet', 1.2, { l: 2, g: 0.35 })],
    },
    // ===== s18: cut to a data centre: rows of racks, the cooling towers steaming outside, SPARE POWER and SPARE
    // COOLING, a technician cycling down the aisle; the camera tracks sideways with ZERO's capsule =====
    {
      lines: [N('All of it runs through four giant data centers,', { at: 0.3 }), N('with spare power,', { gap: 0.25 }), N('spare cooling', { gap: 0.15 }), N('and spare connections,', { gap: 0.15 }), N('so a question never has to wait.', { gap: 0.3 })],
      min: 10.5, bg: '#10142A',
      cam: cam({ z: 0.9, x: 200, y: 520 }, { end: 0, z: 0.9, x: 1800, y: 520, e: 'lin' }),
      actors: [P('datahall', { x: 960, y: G, spX: -1000, bikeSp: 300 }, 'dc', -20),
        P('holo', [{ x: 1500, y: 200, w: 420, h: 150, txt: '4 DATA CENTERS', size: 36, on: 0 }, { l: 0, t: 1.4, on: 1, e: 'out' }], 'h4', 6),
        P('holo', [{ x: 2150, y: 260, w: 460, h: 150, icon: 'network', is: 0.6, txt: 'SPARE CONNECTIONS', size: 26, on: 0 }, { l: 3, on: 1, e: 'out' }], 'hc', 6),
        ...ride(-300, 640, 0.95, { trail: 0.6, look: [8, -6], path: [{ t: 0, x: -300, y: 640 }, { end: 0, x: 2300, y: 620, e: 'lin' }], zK: [{ l: 1, look: [-6, -2], face: 0 }, { l: 2, look: [6, -2] }, { l: 4, face: 2, look: [8, -4] }] }),
        pix([{ x: -60, y: 480, s: 0.8, face: 2 }, { end: 0, x: 2540, y: 460, e: 'lin' }]), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.45, bed: true }), sfx('engine', 0, { l: 1, g: 0.2, dur: 1.4 }), sfx('roll', 0, { l: 3, g: 0.3 })],
    },
    // ===== s19: PATTERN INTERRUPT (no words). Back on the station floor: a flood of capsules sweeps ZERO's away;
    // PIX lights the one yellow among thousands; ZERO dives and catches it =====
    {
      lines: [], min: 3.6, bg: '#0C1130',
      cam: cam({ z: 1.25, x: 900, y: 640, shake: 2 }, { t: 1.4, z: 1.2, x: 1260, y: 640, e: 'io' }, { end: 0, z: 1.25, x: 1460, y: 620, e: 'io' }),
      actors: [...net({ flood: 1, speed: 2.2 }),
        P('capsule', [{ x: 860, y: G + 40, s: 0.6, trail: 0 }, { t: 0.5, x: 860 }, { t: 1.6, x: 1600, y: G + 70, trail: 0.6, e: 'in' }, { t: 2.6, x: 1700, y: G + 70, trail: 0.3, e: 'out' }, { t: 3.0, x: 1640, y: G - 20, trail: 0, e: 'out' }], 'cap', 4),
        zero([{ x: 820, y: G, s: 1.6, face: 2, pose: 'neutral' }, { t: 0.6, face: 3, pose: 'scared' }, { t: 1.2, x: 900, pose: 'run', face: 8, e: 'in' }, { t: 2.1, x: 1450, y: G - 120, pose: 'reach', hr: [166, 30], face: 8, e: 'out' }, { t: 2.5, x: 1560, y: G + 20, squash: 0.85, pose: 'celebrate', hr: null, face: 2, e: 'in' }, { t: 2.8, squash: 1, x: 1600, y: G }], { z: 5 }),
        pix([{ x: 1100, y: 420, s: 0.9, face: 3 }, { t: 1.2, x: 1500, y: 560, face: 1, e: 'io' }]),
        P('scanbeam', [{ x: 1500, y: 560, dx: 120, dy: 420, w: 160, op: 0 }, { t: 1.3, op: 1, e: 'step' }, { t: 2.6, op: 0, e: 'step' }], 'beam', 6),
        vig(0.6)],
      sfx: [sfx('hub', 0, { g: 0.3, bed: true }), sfx('whoosh', 0.5, { g: 0.7 }), sfx('rain', 0.4, { g: 0.25, dur: 2.4 }), sfx('pix-ting', 1.3, { g: 0.5 }), sfx('whoosh', 2.0, { g: 0.5 }), sfx('drop', 2.5, { g: 0.5 })],
    },
    // ===== s20: the strange part. PIX scans the capsule: no money inside, a question: CAN ZERO PAY $4.75? It shoots
    // off toward the bank =====
    {
      lines: [N("Here's the strange part.", { at: 0.2 }), N("The network doesn't move money either.", { gap: 0.2 }), N('It moves questions.', { gap: 0.4 })], min: 6.4, hold: 0.8, bg: '#0C1130',
      cam: cam({ z: 1.3, x: 1250, y: 620 }, { end: 0, z: 1.4, x: 1250, y: 600, e: 'lin' }),
      tout: { type: 'zoom', x: 1700, y: 520, dur: 0.6, color: '#26141E' },
      actors: [...net({ speed: 1 }),
        ...ride(1250, G - 80, 0.75, { trail: 0, look: [0, 8], face: 0, cap: { glow: 1.2 },
          capK: [{ l: 1, t: 1.0, txt: '$4.75' }, { l: 1, t: 1.1, txt: '?', e: 'step' }, { end: 0.7, x: 1250, trail: 0 }, { end: 0, x: 2600, y: G - 300, trail: 1, e: 'in' }],
          zK: [{ l: 1, look: [0, 10], face: 0 }, { l: 1, t: 1.1, face: 3 }, { l: 2, face: 2, look: [8, -6] }, { end: 0.7, x: 1250 }, { end: 0, x: 2600, y: G - 300 - 22.8 * 1.25 + 25.3 * 1.25, e: 'in' }] }),
        P('scanbeam', [{ x: 1500, y: 470, dx: -250, dy: 360, w: 180, op: 0 }, { l: 1, t: 0.2, op: 1, e: 'step' }, { l: 1, t: 1.4, op: 0, e: 'step' }], 'beam', 6),
        pix([{ x: 1500, y: 470, s: 0.9, face: 2 }, { l: 2, face: 1 }]),
        P('statustag', [{ x: 1250, y: 610, s: 0.9, w: 560, txt: 'CAN ZERO PAY $4.75?', color: '#7CC2FF', on: 0 }, { l: 2, on: 0 }, { l: 2, t: 0.3, on: 1, e: 'out' }, { end: 0.7, on: 1 }, { end: 0.5, on: 0, e: 'step' }], 'q', 7),
        vig(0.6)],
      sfx: [sfx('hub', 0, { g: 0.3, bed: true }), sfx('scan', 0.2, { l: 1, g: 0.5 }), sfx('pop', 1.1, { l: 1, g: 0.4 }), sfx('ping', 0.3, { l: 2, g: 0.4 }), sfx('whoosh', 0, { end: 0.6, g: 0.7 })],
    },
    // ===== s21: STOP 3, ZERO'S BANK. The vault door rolls open; inside, the decision room: the scale of trust, the
    // risk dial, the question floating over the pivot. Two questions =====
    {
      lines: [N("Last stop: ZERO's bank.", { at: 0.5 }), N('The one that gave him the card.', { gap: 0.2 }), N('It has a fraction of a second to answer two things.', { gap: 0.4 }), N('Does he have enough credit?', { gap: 0.4 }), N('And is this really him?', { gap: 0.3 })],
      min: 13, bg: '#26141E',
      cam: cam({ z: 0.8, x: 960, y: 260 }, { l: 1, t: 1.0, z: 1.3, x: 960, y: 420, e: 'io' }, { l: 2, t: -0.05, z: 1.3, x: 960, y: 420 }, { l: 2, z: 1.0, x: BANK + 960, y: 540, e: 'step' }, { end: 0, z: 1.04, x: BANK + 960, y: 530, e: 'lin' }),
      actors: [P('vault', [{ x: 960, y: G, open: 0 }, { t: 0.4, open: 0 }, { l: 1, t: 0.6, open: 1, e: 'io' }], 'vault', -20),
        ...ride(960, 760, 0.5, { cid: 'capv', zid: 'zv', trail: 0.3, look: [0, -8], face: 0, path: [{ t: 0, x: 960, y: 760 }, { l: 1, t: 0.5, x: 960, y: 760 }, { l: 2, t: -0.05, x: 960, y: 420, e: 'in' }], zK: [{ l: 1, face: 3 }] }),
        ...room([], { x: BANK }),
        P('riskscale', { x: BANK + SC[0], y: G, s: 0.75, tilt: 0, nl: 0, ev: [], ne: 0 }, 'scale', -4), P('riskdial', { x: BANK + 400, y: 430, s: 0.62, v: 0.35 }, 'dial', -4),
        P('capsule', { x: BANK + CAPQ[0], y: CAPQ[1], s: 0.55, trail: 0, txt: '?' }, 'cap', 2),
        zero([{ x: BANK + 1760, y: G, s: 1.8, face: 0, flip: true, look: [-6, -6] }, { l: 3, face: 4 }, { l: 4, face: 9, look: [-8, -2] }], { z: 5 }),
        pix([{ x: BANK + 1560, y: 260, s: 0.9, face: 2 }]),
        P('holo', [{ x: BANK + 640, y: 110, w: 460, h: 140, txt: 'ENOUGH CREDIT?', size: 34, color: '#FFD98A', on: 0 }, { l: 3, t: 0.2, on: 1, e: 'out' }], 'q1', 6),
        P('holo', [{ x: BANK + 1450, y: 120, w: 460, h: 140, txt: 'REALLY HIM?', size: 34, color: '#FFD98A', on: 0 }, { l: 4, t: 0.2, on: 1, e: 'out' }], 'q2', 6),
        vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('thud', 0.6, { l: 1, g: 0.5 }), sfx('door', 0.9, { l: 1, g: 0.6 }), sfx('whoosh', -0.1, { l: 2, g: 0.5 }), sfx('ping', 0.2, { l: 3, g: 0.35 }), sfx('ping', 0.2, { l: 4, g: 0.35 })],
    },
    // ===== s22: it asks his habits. ZERO raises his hand (ask me!); nobody does. Hundreds of habit chips fly in and
    // swarm the scale. 500+ details, about a millisecond =====
    {
      lines: [N("For the second one, it doesn't ask ZERO.", { at: 0.2 }), N('It asks his habits.', { gap: 0.3 }), N('Visa says its own system weighs more than five hundred details about every payment,', { gap: 0.4 }), N('in about a millisecond.', { gap: 0.1 })],
      min: 12, bg: '#26141E',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 980, y: 520, e: 'lin' }),
      actors: [...room(), scale(), dial(), qcap(),
        P('habitchips', [{ x: SC[0], y: 380, k: 0, n: 44 }, { l: 1, t: 0.2, k: 0 }, { l: 2, t: 1.0, k: 1, e: 'out' }], 'chips', 4),
        zero([{ x: 1760, y: G, s: 1.8, face: 0, flip: true, look: [-6, -6] }, { t: 0.6, pose: 'point', hr: [150, 40], face: 2, look: [-6, -8] }, { t: 0.8, hr: [150, 30] }, { t: 1.0, hr: [150, 40] }, { l: 1, pose: 'neutral', hr: null, face: 7 }, { l: 2, face: 0, look: [-8, -6] }], { z: 5 }),
        pix([{ x: 1560, y: 260, s: 0.9, face: 2 }, { l: 1, face: 1 }]),
        P('holo', [{ x: 600, y: 140, w: 520, h: 160, txt: '500+ DETAILS · ~1 MS', size: 34, color: '#FFD98A', on: 0 }, { l: 2, t: 2.4, on: 1, e: 'out' }], 'h500', 6),
        P('text', [{ x: 600, y: 250, txt: 'VISA, 2019', size: 22, color: '#E6CFC0', o: 0 }, { l: 2, t: 2.6, o: 1, e: 'step' }], 'h500s', 6),
        vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('tape', 0.2, { l: 1, g: 0.2 }), sfx('roll', 0.3, { l: 1, g: 0.4 }), sfx('ping', 2.4, { l: 2, g: 0.35 })],
    },
    // ===== s23: COMPLICATION. A new card has no habits: the chips go blank, doubt weights drop into the left pan, the
    // dial swings into the red (FIRST PURCHASE · NO HISTORY), the room goes coral; ZERO hides his face =====
    {
      lines: [N("But ZERO's card is brand new.", { at: 0.2 }), N('He has no habits.', { gap: 0.3 }), N('And to a fraud machine,', { gap: 0.4 }), N('no history can look a lot like a stolen card.', { gap: 0.1 })],
      min: 10.5, hold: 1.0, bg: '#26141E',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { l: 2, z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.6, x: 520, y: 470, shake: 1, e: 'io' }),
      actors: [...room([{ l: 2, light: 0 }, { l: 2, t: 1.0, light: 1, e: 'io' }]),
        scale([{ l: 1, tilt: 0, nl: 0 }, { l: 1, t: 0.6, nl: 3, e: 'step' }, { l: 1, t: 1.0, nl: 6, tilt: -1, e: 'back' }]),
        dial([{ l: 2, v: 0.35 }, { l: 2, t: 1.2, v: 0.84, e: 'back' }, { l: 3, txt: 'FIRST PURCHASE', txt2: 'NO HISTORY', e: 'step' }]), qcap([{ l: 2, state: 'ask' }, { l: 3, state: 'hold', e: 'step' }]),
        P('habitchips', [{ x: SC[0], y: 380, k: 1, n: 44, blank: 0 }, { l: 1, blank: 0 }, { l: 1, t: 0.4, blank: 1, e: 'io' }], 'chips', 4),
        zero([{ x: 1760, y: G, s: 1.8, face: 0, flip: true, look: [-6, -6] }, { l: 0, t: 1.0, face: 2, pose: 'proud' }, { l: 1, face: 9, pose: 'neutral' }, { l: 3, pose: 'cover', face: 9, e: 'out' }], { z: 5 }),
        pix([{ x: 1560, y: 260, s: 0.9, face: 2 }, { l: 1, face: 3 }, { l: 3, face: 1, x: 1620, y: 320 }]),
        vig(0.7)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('error', 0.4, { l: 1, g: 0.3 }), sfx('clunk', 0.6, { l: 1, g: 0.5 }), sfx('clunk', 1.0, { l: 1, g: 0.5 }), sfx('tension', 0, { l: 2, g: 0.5 }), sfx('buzz', 1.2, { l: 2, g: 0.35 })],
    },
    // ===== s24: CUT. The frozen café: the terminal's timer has crept to 1.10 s. Nobody has moved =====
    {
      lines: [N('Back in the coffee shop,', { at: 0.4 }), N('the clock says one point one seconds.', { gap: 0.1 })], min: 5, bg: '#2A1E18', freeze: FREEZE,
      cam: cam({ z: 2.6, x: TERM[0], y: TERM[1] - 170 }, { l: 1, t: 1.2, z: 2.6, x: TERM[0], y: TERM[1] - 170 }, { end: 0, z: 1.2, x: 900, y: 520, e: 'io' }),
      actors: [...cafe({ baristaK: [{ pose: 'stand', look: -0.8, flip: true }], term: { l2: 'PROCESSING', timer: 0.01, wave: 1, live: true }, termK: [{ t: 0.3, timer: 0.01 }, { l: 1, t: 1.0, timer: 1.10, e: 'out' }] }),
        P('zcard', { x: TAP[0], y: TAP[1], s: 0.5, tilt: 18, wake: 0.6 }, 'card', 6), vig(0.6)],
      sfx: [sfx('roomtone', 0, { g: 0.3, bed: true }), sfx('tick', 0.2, { l: 1, g: 0.4 }), sfx('tick', 0.6, { l: 1, g: 0.4 }), sfx('tick', 1.0, { l: 1, g: 0.4 })],
    },
    // ===== s25: the stand-in. Back in the network hall, behind a frosted BACKUP screen, a stand-in robot gets up from
    // its chair, ready to answer for the bank. Cut to the bank: it isn't down, it's just not sure (the dial trembles,
    // ZERO clenches his fists); the robot sits back down =====
    {
      lines: [N('If a bank ever takes too long, or goes down,', { at: 0.2 }), N('the network can answer for it,', { gap: 0.1 }), N('using AI to stand in.', { gap: 0.1 }), N("But ZERO's bank isn't down.", { gap: 0.5 }), N("It's just not sure.", { gap: 0.3 })],
      min: 12, bg: '#0C1130',
      cam: cam({ z: 1.0, x: NETX + 960, y: 560 }, { l: 2, z: 1.08, x: NETX + 1100, y: 600, e: 'io' }, { l: 3, t: -0.05, z: 1.08, x: NETX + 1100, y: 600 }, { l: 3, z: 1.0, x: 960, y: 540, e: 'step' }, { end: 0, z: 1.12, x: 1180, y: 560, e: 'io' }),
      actors: [...net({ x: NETX, id: 'n' }), P('pool', { x: NETX + 1200, y: 760, rx: 600, ry: 300, kind: 'cool', op: 0.4 }, 'robpool', -11),
        P('standin', [{ x: NETX + 1200, y: G, s: 1.15, up: 0 }, { l: 1, up: 0 }, { l: 1, t: 0.8, up: 1, e: 'back' }], 'robot', -2),
        P('holo', [{ x: NETX + 560, y: 360, w: 420, h: 160, icon: 'bank', is: 0.6, txt: 'BANK: NO ANSWER?', size: 24, color: '#FF8A7A', on: 0 }, { t: 0.6, on: 1, e: 'out' }], 'nobank', 6),
        ...room([{ light: 1 }, { l: 4, light: 1 }, { l: 4, t: 1.0, light: 0.6, e: 'io' }]), scale([{ tilt: -1, nl: 6 }]), dial([{ v: 0.84, txt: 'FIRST PURCHASE', txt2: 'NO HISTORY' }, { l: 4, v: 0.84 }, { l: 4, t: 0.6, v: 0.7, e: 'io' }, { l: 4, t: 1.2, v: 0.86, e: 'io' }]), qcap([{ state: 'hold' }]),
        zero([{ x: 1760, y: G, s: 1.8, face: 9, flip: true, pose: 'cover' }, { l: 3, pose: 'hips', face: 8, look: [-6, -4] }, { l: 4, pose: 'neutral', hl: [96, 150], hr: [104, 150], face: 9, look: [-8, -6] }], { z: 5 }),
        pix([{ x: 1560, y: 260, s: 0.9, face: 1 }, { l: 4, face: 9 }]),
        vig(0.6)],
      sfx: [sfx('hub', 0, { g: 0.25, bed: true, dur: 9 }), sfx('beep', 0.8, { l: 1, g: 0.3 }), sfx('slide', 0.8, { l: 1, g: 0.4 }), sfx('hum', 0, { l: 3, g: 0.25, bed: true }), sfx('tension', 0, { l: 4, g: 0.3 })],
    },
    // ===== s26: the evidence adds up: three green chips drop into the right pan (REAL CHIP · $4.75 · 3 BLOCKS AWAY),
    // the scale tips back, the dial returns to green, the coral light lifts; ZERO peeks between his fingers =====
    {
      lines: [N('Then the evidence adds up.', { at: 0.2 }), N('A real chip,', { gap: 0.4 }), N('one only the real card can make.', { gap: 0.1 }), N('A tiny amount.', { gap: 0.4 }), N('A coffee shop a few blocks from his address.', { gap: 0.4 })],
      min: 12, bg: '#26141E',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 520, e: 'lin' }),
      actors: [...room([{ light: 0.6 }, { l: 4, light: 0.6 }, { end: 0.5, light: 0, e: 'io' }]),
        scale([{ tilt: -1, nl: 6, ne: 0 }, { l: 1, t: 0.2, ne: 1, tilt: -0.6, e: 'back' }, { l: 3, t: 0.2, ne: 2, nl: 4, tilt: -0.1, e: 'back' }, { l: 4, t: 0.6, ne: 3, nl: 2, tilt: 0.6, e: 'back' }]),
        dial([{ v: 0.84, txt: 'FIRST PURCHASE', txt2: 'NO HISTORY' }, { l: 1, t: 0.4, v: 0.66, e: 'out' }, { l: 3, t: 0.4, v: 0.45, e: 'out' }, { l: 4, t: 0.8, v: 0.16, txt: 'LOOKS LIKE ZERO', txt2: null, e: 'out' }]),
        qcap([{ state: 'hold' }, { l: 4, t: 1.2, state: 'ask', e: 'step' }]),
        P('habitchips', [{ x: SC[0], y: 380, k: 1, n: 44, blank: 1, o: 1 }, { t: 0.2, o: 1 }, { t: 0.9, o: 0, e: 'in' }], 'chips', 4),
        zero([{ x: 1760, y: G, s: 1.8, face: 9, flip: true, pose: 'cover', look: [-6, -2] }, { l: 1, t: 0.4, hl: [76, 92], hr: [124, 112], face: 0, look: [-8, -4] }, { l: 4, t: 0.8, pose: 'neutral', hl: null, hr: null, face: 2 }, { end: 0.5, pose: 'celebrate', face: 2 }], { z: 5 }),
        pix([{ x: 1560, y: 260, s: 0.9, face: 1 }, { l: 4, t: 0.8, face: 2 }]),
        vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('clunk', 0.2, { l: 1, g: 0.6 }), sfx('clunk', 0.2, { l: 3, g: 0.6 }), sfx('clunk', 0.6, { l: 4, g: 0.6 }), sfx('chime', 1.0, { l: 4, g: 0.5 })],
    },
    // ===== s27: CREDIT: YES. What the bank actually does: no money leaves (MONEY SENT: $0.00); a yellow lock drops
    // on $4.75 of ZERO's credit line. A promise. ZERO looks around for the money =====
    {
      lines: [N('Credit: yes.', { at: 0.3 }), N('And now look at what the bank actually does.', { gap: 0.4 }), N("It doesn't send any money.", { gap: 0.3 }), N("It puts a hold on four seventy-five of ZERO's credit line.", { gap: 0.3 }), N('A promise.', { gap: 0.5 })],
      min: 13, hold: 1.0, bg: '#26141E',
      actors: [...room([{ light: 0 }]), scale([{ tilt: 0.6, nl: 2, ne: 3 }]), dial([{ v: 0.16, txt: 'LOOKS LIKE ZERO' }]), qcap([{ state: 'ok', check: true }]),
        P('text', [{ x: 1150, y: 90, txt: 'CREDIT: YES', size: 54, color: '#58E08A', o: 0 }, { t: 0.4, o: 1, e: 'step' }, { l: 1, o: 0, e: 'step' }], 'cy', 8),
        sysOn({ l: 1, t: 0.2 }), P('rect', [{ x: 960, y: 540, w: 2200, h: 1400, fill: '#05070F', op: 0, ui: true }, { l: 1, t: 0.2, op: 0 }, { l: 1, t: 0.7, op: 0.75, e: 'out' }], 'dimc', 44),
        P('creditbar', [{ x: 960, y: 470, s: 1.0, lock: 0, o: 0, ui: true }, { l: 1, t: 0.6, o: 0 }, { l: 1, t: 0.9, o: 1, e: 'step' }, { l: 2, t: 0.6, sent: '$0.00', e: 'step' }, { l: 3, t: 1.6, lock: 0 }, { l: 3, t: 2.2, lock: 1, e: 'back' }], 'bar', 45),
        ui(zero([{ x: 1680, y: 1010, s: 1.7, face: 0, flip: true, look: [-8, -4], o: 0 }, { l: 1, t: 0.9, o: 1, e: 'step' }, { l: 2, t: 0.6, pose: 'shrug', face: 4, look: [8, -2] }, { l: 2, t: 1.4, look: [-8, -2] }, { l: 3, pose: 'neutral', face: 0, look: [-8, -4] }, { l: 4, face: 2 }], { z: 48 })),
        ui(pix([{ x: 1600, y: 240, s: 1.1, face: 2, o: 0 }, { l: 1, t: 0.9, o: 1, e: 'step' }])),
      ],
      sfx: [sfx('chime', 0.3, { g: 0.5 }), sfx('whoosh', 0.2, { l: 1, g: 0.4 }), sfx('error', 0.6, { l: 2, g: 0.2 }), sfx('click', 2.2, { l: 3, g: 0.7 }), sfx('dato', 0.2, { l: 4, g: 0.4 })],
    },
    // ===== s28: and the promise works both ways: PIX's hologram of the dispute (no coffee → DISPUTE → the coins are
    // pulled back from the shop) =====
    {
      lines: [N('And the promise works both ways.', { at: 0.2 }), N('If the coffee never showed up,', { gap: 0.4 }), N('ZERO could dispute the charge,', { gap: 0.1 }), N('and the money would be pulled back from the shop.', { gap: 0.1 })],
      min: 10.5, bg: '#26141E',
      actors: [...room([{ light: 0 }]), sysOn({ t: -1 }),
        P('disputeholo', [{ x: 960, y: 470, s: 0.2, o: 0, press: 0, back: 0, ui: true }, { t: 0.2, o: 1, e: 'step' }, { t: 0.7, s: 1.15, e: 'back' }, { l: 2, t: 0.8, press: 0 }, { l: 2, t: 1.0, press: 1, e: 'out' }, { l: 2, t: 1.3, press: 0, e: 'out' }, { l: 3, t: 0.4, back: 0 }, { l: 3, t: 2.4, back: 1, e: 'io' }], 'disp', 45),
        ui(zero([{ x: 260, y: 1010, s: 1.6, face: 0, look: [8, -4] }, { l: 1, face: 7 }, { l: 2, pose: 'point', hr: [150, 100], face: 8 }, { l: 3, pose: 'neutral', hr: null, face: 2 }], { z: 48 })),
        ui(pix([{ x: 1680, y: 860, s: 1.0, face: 2 }])),
      ],
      sfx: [sfx('pix-ting', 0.2, { g: 0.5 }), sfx('click', 1.0, { l: 2, g: 0.6 }), sfx('tape', 0.4, { l: 3, g: 0.3 }), sfx('coin', 2.0, { l: 3, g: 0.5 })],
    },
    // ===== s29: the answer rides back the same way, one cut per stop: bank, network, the shop's company, the
    // terminal. The capsule is green now =====
    {
      lines: [N('The answer rides back the same way.', { at: 0.2 }), N('Bank,', { gap: 0.3 }), N('network,', { gap: 0.2 }), N("the shop's company,", { gap: 0.2 }), N('the terminal.', { gap: 0.2 })],
      min: 7.5, hold: 0.3, bg: '#050A18',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { l: 2, t: -0.1, z: 1.0, x: 960, y: 540 }, { l: 2, z: 1.0, x: NETX + 960, y: 520, e: 'step' }, { l: 3, t: -0.1, z: 1.05, x: NETX + 960, y: 520 }, { l: 3, z: 0.75, x: ACQX + 960, y: 300, e: 'step' }, { l: 4, t: -0.1, z: 0.78, x: ACQX + 960, y: 290 }, { l: 4, z: 1.0, x: TERMX + 960, y: 540, e: 'step' }, { end: 0, z: 1.3, x: TERMX + 960, y: 560, e: 'in' }),
      tout: { type: 'zoom', x: 960, y: 600, dur: 0.5, color: '#FFFFFF' },
      actors: [...room([{ light: 0.5, lcol: 'green' }]), P('riskscale', { x: SC[0], y: G, s: 0.75, tilt: 0.6, nl: 2, ev: ['REAL CHIP', '$4.75', '3 BLOCKS AWAY'], ne: 3 }, 'scale', -4),
        ...ride(CAPQ[0], CAPQ[1] + 300, 0.7, { cid: 'c1', zid: 'z1', cap: { state: 'ok', check: true, trail: 0 }, face: 2, path: [{ t: 0, x: CAPQ[0], y: CAPQ[1] + 300 }, { t: 0.4, x: CAPQ[0] + 60, y: CAPQ[1] + 280 }, { l: 2, t: -0.1, x: -400, y: 600, e: 'in' }], ang: 0, look: [-8, -4] }),
        ...net({ x: NETX, id: 'n', speed: 3, blur: 0.6 }),
        ...ride(NETX + 1900, 560, 0.85, { cid: 'c2', zid: 'z2', cap: { state: 'ok', trail: 1, ang: 180 }, face: 2, look: [-8, -2], path: [{ l: 2, x: NETX + 1900, y: 560 }, { l: 3, t: -0.1, x: NETX + 100, y: 520, e: 'lin' }] }),
        ...acq({ x: ACQX, id: 'a', rev: 1 }),
        ...ride(ACQX + 1260, 700, 0.6, { cid: 'c3', zid: 'z3', cap: { state: 'ok', trail: 0.9, ang: 90 }, face: 2, look: [0, -8], path: [{ l: 3, x: ACQX + 1260, y: 700 }, { l: 4, t: -0.1, x: ACQX + 1260, y: -200, e: 'in' }] }),
        P('rect', { x: TERMX + 960, y: 540, w: 3000, h: 2000, fill: '#0B1226' }, 'tbg', -20), P('rect', { x: TERMX + 960, y: 540, w: 3000, h: 2000, fill: 'url(#wGrid)', op: 0.25 }, 'tgrid', -19),
        P('payterm', { x: TERMX + 960, y: 1180, s: 1.6, l1: '$4.75', l2: 'PROCESSING', timer: 1.84 }, 'term', 0),
        ...ride(TERMX + 960, 120, 0.7, { cid: 'c4', zid: 'z4', cap: { state: 'ok', trail: 0.8, ang: -90 }, face: 2, look: [0, 8], path: [{ l: 4, x: TERMX + 960, y: 120 }, { end: 0, x: TERMX + 960, y: 560, e: 'in' }] }),
        vig(0.6)],
      sfx: [sfx('whoosh', 0.2, { l: 1, g: 0.5 }), sfx('whoosh', 0, { l: 2, g: 0.6 }), sfx('jet', 0, { l: 2, g: 0.3 }), sfx('whoosh', 0, { l: 3, g: 0.6 }), sfx('swipe', 0, { l: 4, g: 0.6 }), sfx('whoosh', 0, { end: 0.5, g: 0.7 })],
    },
    // ===== s30: TWO SECONDS. The café unfreezes at once: BEEP, APPROVED, the coffee lands in the cup, the pigeon
    // finishes its flap, the queue breathes. ZERO pops out of the terminal and the barista hands him his coffee =====
    {
      lines: [N('Two seconds.', { at: 1.1 })], min: 4.2, hold: 1.0, bg: '#2A1E18',
      cam: cam({ z: 1.12, x: 880, y: 500, shake: 1 }, { t: 0.3, z: 1.12, x: 880, y: 500 }, { end: 0, z: 1.18, x: 860, y: 500, e: 'lin' }),
      actors: [...cafe({ term: { l2: 'APPROVED', ok: 1, timer: 1.92 }, esp: { pour: 1, cupFill: 0.35 }, espK: [{ t: 0.1, cupFill: 0.35 }, { t: 0.9, cupFill: 0.95, pour: 0, e: 'out' }],
          baristaK: [{ pose: 'stand', look: -0.8, flip: true }, { t: 1.3, pose: 'reach', look: -0.6 }], birdK: [{ flap: 0.8 }, { t: 0.4, flap: 0, e: 'out' }],
          manK: [{ t: 0.2, look: 0.2 }], womanK: [{ t: 0.3, look: 0.1 }] }),
        P('zcard', [{ x: TAP[0], y: TAP[1], s: 0.5, tilt: 18, wake: 0 }, { t: 0.7, x: ZX + 70, y: 650, s: 0.62, tilt: -8, e: 'out' }, { t: 1.3, o: 0, e: 'step' }], 'card', 6),
        zero([{ x: TERM[0], y: 470, s: 0.05, o: 0, face: 2 }, { t: 0.15, o: 1, e: 'step' }, { t: 0.45, x: 820, y: 560, s: 1.4, pose: 'celebrate', e: 'out' }, { t: 0.75, x: ZX, y: G, s: 2.6, squash: 0.85, pose: 'neutral', e: 'in' }, { t: 0.95, squash: 1, face: 2, look: [8, -4] },
          { t: 1.6, pose: 'reach', hr: [160, 110], look: [8, -2] }, { t: 2.3, pose: 'neutral', hr: [128, 128], hl: [118, 126], face: 2, look: [4, 2] }], { z: 5 }),
        P('cup', [{ x: 1180, y: 600, s: 0.8, o: 0 }, { t: 1.4, o: 1, e: 'step' }, { t: 2.2, x: hand(ZX, G, [128, 128])[0] + 6, y: hand(ZX, G, [128, 128])[1] + 40, s: 0.62, e: 'io' }], 'cup', 7),
        vig(0.55)],
      sfx: [sfx('beep', 0.05, { g: 0.7 }), sfx('chime', 0.15, { g: 0.4 }), sfx('espresso', 0.1, { g: 0.35, bed: true }), sfx('chatter', 0.1, { g: 0.3, bed: true }), sfx('pop', 0.15, { g: 0.5 }), sfx('thud', 0.75, { g: 0.4 }), sfx('drop', 0.5, { g: 0.4 })],
    },
    // ===== s31: ZERO sits by the window with his coffee. He didn't pay. PIX projects over the terminal: $4.75 ·
    // PENDING. Behind, the man in the grey cap pays the barista in coins. ZERO freezes mid-sip =====
    {
      lines: [N('ZERO thinks he just paid.', { at: 0.6 }), N("He didn't.", { gap: 0.5 }), N('Nobody has paid anybody.', { gap: 0.5 }), N('Not yet.', { gap: 0.3 }), N('So when does the money actually move?', { gap: 0.8 })],
      min: 11, hold: 1.2, bg: '#2A1E18',
      cam: cam({ z: 1.0, x: 900, y: 520 }, { l: 1, z: 1.0, x: 900, y: 520 }, { l: 2, z: 1.25, x: 760, y: 560, e: 'io' }, { end: 0, z: 1.3, x: 760, y: 560, e: 'lin' }),
      actors: [...cafe({ term: { l2: 'APPROVED', ok: 1, timer: 1.92 }, esp: { pour: 0, cupFill: 0 },
          man: { x: 760, y: G + 10, pose: 'stand', look: 0.8 }, manK: [{ l: 2, t: 0.6, pose: 'reach', look: 0.7 }, { l: 3, t: 1.2, pose: 'stand' }],
          woman: { x: 1500, y: G + 20, look: -0.4 }, baristaK: [{ pose: 'stand', look: -0.7, flip: true }, { l: 2, t: 0.3, pose: 'reach' }] }),
        P('cafetable', { x: 330, y: G + 30, s: 1.0 }, 'table', 1), P('stool', { x: 150, y: G + 40, s: 1.0 }, 'stool', 2),
        zero([{ x: 150, y: G - 115, s: 2.2, face: 2, pose: 'neutral', fl: [112, 200], fr: [128, 200], hl: [118, 126], hr: [140, 118], look: [8, 2] },
          { l: 0, t: 0.6, hr: [134, 104], look: [8, -2], face: 2 }, { l: 1, face: 3, look: [0, 1], e: 'step' }, { l: 3, face: 9, look: [8, -4] }, { l: 4, face: 1, look: [0, 1] }], { z: 5 }),
        P('cup', [{ x: hand(150, G - 115, [140, 118], 2.2)[0] + 10, y: hand(150, G - 115, [140, 118], 2.2)[1] + 30, s: 0.55 }, { l: 0, t: 0.6, x: hand(150, G - 115, [134, 104], 2.2)[0] + 12, y: hand(150, G - 115, [134, 104], 2.2)[1] + 24, tilt: -20, e: 'io' }], 'cup', 6),
        pix([{ x: 1080, y: 300, s: 0.8, face: 2, o: 0 }, { l: 1, t: 0.3, o: 1, e: 'step' }, { l: 2, face: 1 }]),
        P('statustag', [{ x: 1080, y: 380, s: 0.9, txt: '$4.75 · PENDING', on: 0 }, { l: 1, t: 0.5, on: 0 }, { l: 1, t: 0.8, on: 1, e: 'out' }], 'tag', 8),
        P('statustag', [{ x: 680, y: 190, s: 0.75, w: 380, txt: '$4.75 · CASH', color: '#58E08A', on: 0 }, { l: 3, t: 0.5, on: 0 }, { l: 3, t: 0.8, on: 1, e: 'out' }, { l: 4, on: 1 }, { l: 4, t: 0.3, on: 0, e: 'out' }], 'cash', 8),
        vig(0.55)],
      sfx: [sfx('chatter', 0, { g: 0.3, bed: true }), sfx('gulp', 0.7, { g: 0.4 }), sfx('dun', 0.1, { l: 1, g: 0.4 }), sfx('pix-ting', 0.6, { l: 1, g: 0.4 }), sfx('coin', 0.3, { l: 3, g: 0.5 }), sfx('coin', 0.55, { l: 3, g: 0.4 }), sfx('tension', 0.2, { l: 4, g: 0.3 })],
    },
  ],
};
