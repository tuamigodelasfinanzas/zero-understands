// Video 002 "What Happens in the 2 Seconds After You Tap Your Card": part 1 (script scenes s01-s12), the ZeroOpen in
// the café and the message. Direction: docs/mundo-vivo.md. The café freezes when ZERO taps (spec.freeze in
// src/stage.js): the world stops, ZERO and PIX keep moving, the capsule is the only yellow thing in every shot.
import { G, N, zero, pix, sfx, cam, lookCam, stepBack, leanIn, tilt } from '../../src/kit.mjs';
import { brandBeat } from '../../src/zeroopen.mjs';
import { P, vig, ui, sysOn, FREEZE, TERM, ZX, hand, cafe } from './common.mjs';

const CARD = 0.62;                       // the card in ZERO's hands (wide shots)
const live = k => ({ ...k, live: true });
const TAP = [935, 545];
const POUR = [4200, 300];               // the frozen-coffee insert, built away from the room                 // where the card hangs, frozen, after the tap
const card = (k, more = []) => P('zcard', [live(k), ...more], 'card', 6);

// inside the cable: the fibre rushing past, PIX's warm light on ZERO, ZERO sitting on the capsule
const fiber = (o = {}) => [P('fiber', [{ x: 0, y: 0, speed: o.speed ?? 1, vx: o.vx ?? 960, vy: o.vy ?? 470 }, ...(o.k || [])], 'fib', -20)];
const ride = (x, y, s = 1.5, o = {}) => [
  P('capsule', [{ x, y, s, trail: o.trail ?? 0.8, ang: o.ang ?? 0, ...(o.cap || {}) }, ...(o.capK || [])], 'cap', 3),
  zero([{ x, y: y - 38 * s + 36 * (1.17 * s), s: 1.17 * s, face: o.face ?? 2, fl: [120, 196], fr: [134, 200], hl: [84, 170], hr: [118, 170], look: o.look ?? [6, -2] }, ...(o.zK || [])], { z: 4 }),
];

export default {
  id: 'v002-part1',
  format: 'long',
  title: 'What Happens in the 2 Seconds After You Tap Your Card (animatic, part 1)',
  description: 'Animatic of the first part of video 002.',
  tags: ['how it works', 'credit cards', 'payments'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // ===== ZeroOpen (docs/zeroopen.md) =====
    // EVENT. 8:14 AM. ZERO in the queue with his brand-new card, the ACTIVATE sticker still on it; he peels it off,
    // proud. The barista pours his coffee
    {
      zo: 'event', lines: [N('ZERO just got his first credit card.', { at: 0.4 }), N('This is its first coffee.', { gap: 0.4 })], min: 5.6, hold: 0.15, bg: '#2A1E18',
      cam: cam({ z: 1.12, x: 880, y: 480 }, { end: 0, z: 1.2, x: 860, y: 500, e: 'lin' }),
      actors: [...cafe({ baristaK: [{ t: 3.6, pose: 'stand', look: -0.8, flip: true }] }),
        card({ x: hand(ZX, G, [123, 124])[0], y: hand(ZX, G, [123, 124])[1], s: CARD, tilt: -8, sticker: 1, peel: 0 }, [{ t: 2.6, peel: 0 }, { t: 3.2, peel: 1, sticker: 0, e: 'in' }]),
        zero([{ x: ZX, face: 2, pose: 'neutral', hl: [116, 124], hr: [130, 124], look: [2, -3] }, { t: 2.5, face: 8, look: [2, -6] }, { t: 3.2, face: 1, look: [6, -3], squash: 0.95, e: 'out' }, { t: 3.5, squash: 1 }, { t: 4.4, face: 2, look: [8, -2] }]), vig(0.55)],
      sfx: [sfx('espresso', 0, { g: 0.35, bed: true }), sfx('chatter', 0, { g: 0.3, bed: true }), sfx('peel', 2.7, { g: 0.6 })],
    },
    // ANOMALY. The tap: BEEP · PROCESSING · 0.01 s, and a ripple leaves the terminal. Time stops. Cut to the frozen
    // detail: the coffee hanging in the air between the spout and the cup. Back to the room: everybody stopped, the
    // pigeon mid-flap, people outside mid-step. Only ZERO moves; he waves at the man behind him. Nobody speaks
    {
      zo: 'anomaly', lines: [], min: 5.2, bg: '#2A1E18', freeze: { at: 1.05, tint: 0.55 },
      cam: cam({ z: 1.6, x: 900, y: 590 }, { t: 1.75, z: 1.66, x: 905, y: 585, e: 'lin' }, { t: 1.7, z: 1.6, x: POUR[0], y: POUR[1] + 160, e: 'step' }, { t: 2.7, z: 1.75, x: POUR[0], y: POUR[1] + 140, e: 'lin' },
        { t: 2.75, z: 1.05, x: 900, y: 520, e: 'step' }, { end: 0, z: 1.1, x: 880, y: 530, e: 'lin' }),
      actors: [...cafe({ baristaK: [{ pose: 'stand', look: -0.8, flip: true }], termK: [{ t: 0.55, l2: 'PROCESSING', timer: 0, wave: 1, e: 'step' }, { t: 1.05, timer: 0.01, e: 'lin' }],
        birdK: [{ t: 0.9, flap: 0 }, { t: 1.05, flap: 0.8, e: 'out' }] }),
        // the frozen detail, set apart from the room (the camera cuts to it)
        P('rect', { x: POUR[0], y: POUR[1] + 200, w: 1600, h: 1000, fill: '#C9B49A' }, 'insbg', 24),
        ...Array.from({ length: 5 }, (_, r) => P('rect', { x: POUR[0], y: POUR[1] - 120 + r * 70, w: 1600, h: 6, fill: '#B39D82' }, 'inst' + r, 25)),
        P('rect', { x: POUR[0], y: POUR[1] - 40, w: 420, h: 90, fill: '#AEB4C0', rx: 16 }, 'insmach', 26),
        P('pourclose', { x: POUR[0], y: POUR[1], s: 1.0 }, 'pour', 27),
        P('rect', { x: POUR[0], y: POUR[1] + 395, w: 1600, h: 40, fill: '#4A5270' }, 'insgrate', 28),
        P('ripple', [{ x: TERM[0], y: TERM[1] - 120, k: 0, live: true }, { t: 0.95, k: 0 }, { t: 1.7, k: 1, e: 'out' }], 'rip', 20),
        P('zcard', [{ x: hand(ZX, G, [123, 124])[0], y: hand(ZX, G, [123, 124])[1], s: CARD, tilt: -8 }, { t: 0.45, x: TAP[0], y: TAP[1], s: 0.5, tilt: 18, e: 'io' }, { t: 0.55, wake: 1, e: 'step' }], 'card', 6),
        zero([{ x: ZX, face: 2, pose: 'neutral', hl: [116, 124], hr: [130, 124], look: [6, -4] }, { t: 0.45, pose: 'reach', hr: [166, 30], hl: [92, 166], y: G - 14, face: 0, look: [8, -6], e: 'io' }, { t: 1.3, face: 0, look: [10, -8] }, { t: 1.7, hr: [150, 150], hl: [81, 168], pose: 'neutral', y: G, e: 'io' },
          { t: 2.9, look: [-8, 0], headR: -6, face: 3 }, { t: 3.2, look: [8, -2], headR: 6, face: 3, e: 'io' }, { t: 3.45, flip: true, look: [8, -2], headR: 0 }, { t: 3.6, pose: 'wave', hr: [150, 100], e: 'out' }, { t: 3.8, hr: [150, 78] }, { t: 4.0, hr: [150, 100] }, { t: 4.2, hr: [150, 78] },
          { t: 4.5, pose: 'neutral', hr: null, flip: false, face: 1, look: [0, 1] }]), vig(0.6)],
      sfx: [sfx('espresso', 0, { g: 0.35, bed: true, dur: 1.1 }), sfx('chatter', 0, { g: 0.3, bed: true, dur: 1.1 }), sfx('beep', 0.55, { g: 0.5 }), sfx('freeze', 1.0, { g: 0.7 }), sfx('roomtone', 1.3, { g: 0.25, bed: true })],
    },
    // QUESTION. Said after the viewer has already thought it; ZERO looks from the card to the terminal to us
    {
      zo: 'question', lines: [N('That café has never met ZERO.', { at: 0.1 }), N('His bank has never met the café.', { gap: 0.2 }), N('So who decides to trust him?', { gap: 0.3 })], min: 7.5, bg: '#2A1E18', freeze: FREEZE,
      cam: cam({ z: 1.3, x: 940, y: 560 }, { end: 0, z: 1.42, x: 920, y: 580, e: 'lin' }),
      actors: [...cafe({ baristaK: [{ pose: 'stand', look: -0.8, flip: true }], term: { l2: 'PROCESSING', timer: 0.01, wave: 1 } }),
        P('zcard', { x: TAP[0], y: TAP[1], s: 0.5, tilt: 18, wake: 0.6 }, 'card', 6),
        zero([{ x: ZX, face: 1, look: [0, 1] }, { l: 0, look: [8, -5], face: 0, e: 'io' }, { l: 1, look: [-6, -2], face: 0, e: 'io' }, ...lookCam({ l: 3 }, { face: 1, tilt: 8 })])],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true })],
    },

    // PIX REVEALS. PIX slides out from behind the terminal's screen, scans the frozen card (it wakes up in colour:
    // the antenna coil around its edge, the chip), then the counter turns to X-ray: cables of light running down
    // from the terminal into the floor
    {
      zo: 'reveal', lines: [], min: 5.0, bg: '#2A1E18', freeze: FREEZE,
      cam: cam({ z: 1.35, x: 920, y: 600 }, { end: 0, z: 1.45, x: 920, y: 620, e: 'io' }),
      actors: [...cafe({ baristaK: [{ pose: 'stand', look: -0.8, flip: true }], term: { l2: 'PROCESSING', timer: 0.01, live: true }, termK: [{ t: 2.8, open: 0 }, { t: 3.6, open: 1, e: 'io' }] }),
        P('hiddenlayer', [{ x: TERM[0], y: G - 150, w: 520, h: 250, kind: 'network', style: 'xray', open: 0, o: 0, wall: '#7A5038', live: true }, { t: 2.9, o: 0 }, { t: 3.0, open: 0, o: 1 }, { t: 3.9, open: 1, e: 'io' }], 'layer', -4),
        P('zcard', [{ x: TAP[0], y: TAP[1], s: 0.5, tilt: 18, wake: 0.6, xray: 0, live: true }, { t: 1.3, xray: 0 }, { t: 1.9, xray: 1, wake: 1, e: 'io' }, { t: 2.9, xray: 1 }, { t: 3.4, xray: 0.4, e: 'io' }], 'card', 6),
        pix([{ x: TERM[0], y: 430, s: 0.2, o: 0, face: 0 }, { t: 0.5, o: 1, e: 'step' }, { t: 1.0, x: 1080, y: 360, s: 1.0, face: 2, e: 'back' }, { t: 2.6, face: 3 }, { t: 2.9, x: 1100, y: 560, face: 1, e: 'io' }, { t: 4.2, face: 2 }]),
        P('scanbeam', [{ x: 1080, y: 360, dx: -150, dy: 140, w: 120, o: 0 }, { t: 1.2, o: 1, e: 'step' }, { t: 2.4, o: 0, e: 'step' }], 'beam', 9),
        P('scanbeam', [{ x: 1100, y: 560, dx: -190, dy: 220, w: 260, o: 0 }, { t: 3.0, o: 1, e: 'step' }, { t: 3.8, o: 0, e: 'step' }], 'beam2', 9),
        zero([{ x: ZX, face: 1, look: [0, 1] }, { t: 0.5, look: [8, -6], face: 0 }, ...stepBack({ t: 0.6 }, ZX, { dx: -40, face: 0 }), { t: 2.0, face: 2, look: [8, -4] }, ...leanIn({ t: 3.6 }, ZX - 40, { face: 2, look: [8, 6], dx: 40 })]), vig(0.6)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('pix-ting', 0.55, { g: 0.6 }), sfx('scan', 1.2, { g: 0.5 }), sfx('hum', 1.9, { g: 0.3 }), sfx('swipe', 3.0, { g: 0.5 }), sfx('fiber', 3.4, { g: 0.3, bed: true })],
    },
    // ZERO ENTERS. The chip lets go of a tiny yellow capsule ($4.75) that drifts toward the terminal; ZERO jumps onto
    // the counter, grabs it, and the terminal swallows them both
    {
      zo: 'entry', lines: [], min: 3.6, bg: '#2A1E18', freeze: FREEZE,
      cam: cam({ z: 1.45, x: 920, y: 620 }, { t: 1.2, z: 1.6, x: 900, y: 560, e: 'io' }, { t: 2.6, z: 2.4, x: TERM[0], y: 470, e: 'io' }),
      tout: { type: 'zoom', x: TERM[0], y: 430, dur: 0.7, color: '#050A18' },
      actors: [...cafe({ baristaK: [{ pose: 'stand', look: -0.8, flip: true }], term: { l2: 'PROCESSING', timer: 0.01, open: 1, live: true } }),
        P('hiddenlayer', { x: TERM[0], y: G - 150, w: 520, h: 250, kind: 'network', style: 'xray', open: 1, wall: '#7A5038', live: true }, 'layer', -4),
        P('zcard', { x: TAP[0], y: TAP[1], s: 0.5, tilt: 18, wake: 1, xray: 0.4, live: true }, 'card', 6),
        P('capsule', [{ x: TAP[0] - 20, y: TAP[1], s: 0.05, trail: 0, live: true }, { t: 0.3, s: 0.32, x: TAP[0] - 40, y: TAP[1] - 60, e: 'back' }, { t: 1.4, x: TAP[0] - 60, y: 420 }, { t: 2.3, x: TERM[0], y: 400, s: 0.22, e: 'in' }, { t: 2.7, y: 470, s: 0.05, e: 'in' }], 'cap', 7),
        pix([{ x: 1100, y: 560, s: 1.0, face: 2 }, { t: 0.4, face: 3 }, { t: 1.9, x: TERM[0] + 40, y: 380, s: 0.6, e: 'in' }, { t: 2.4, o: 0, e: 'step' }]),
        zero([{ x: ZX, face: 2, look: [8, -6] }, { t: 0.4, face: 1, look: [6, -8] }, { t: 0.65, squash: 0.82, y: G + 8, pose: 'back', e: 'out' }, { t: 0.95, squash: 1.1, y: 470, x: 820, pose: 'celebrate', e: 'out' }, { t: 1.25, y: G - 310, x: 840, squash: 0.9, pose: 'neutral', s: 1.4, e: 'in' },
          { t: 1.45, squash: 1, pose: 'reach', hr: [150, 40], look: [6, -8], face: 2 }, { t: 2.3, x: TERM[0] - 20, y: 470, s: 0.6, pose: 'celebrate', e: 'in' }, { t: 2.7, x: TERM[0], y: 470, s: 0.05, o: 0, e: 'in' }], { z: 8 }), vig(0.6)],
      sfx: [sfx('fiber', 0, { g: 0.35, bed: true }), sfx('pop', 0.3, { g: 0.5 }), sfx('whoosh', 0.7, { g: 0.6 }), sfx('thud', 1.25, { g: 0.5 }), sfx('whoosh', 2.4, { g: 0.7 })],
    },
    // CLICK · ZERO UNDERSTANDS over the fibre rushing past; the story doesn't stop for it
    brandBeat({ behind: [P('fiber', { x: 0, y: 0, speed: 3 }, 'fib', -20)] }),
    // THE PROMISE. Already inside: ZERO sitting on the capsule, PIX lighting him, three stops projected ahead
    {
      zo: 'promise', lines: [N('Between this tap and that cup, a tiny message will cross three companies,', { at: 0.05 }), N('survive a fraud test,', { gap: 0.1 }), N('and come back with a yes or a no.', { gap: 0.1 }), N('ZERO is riding it.', { gap: 0.5 })],
      min: 12, hold: 0.6, bg: '#050A18',
      cam: cam({ z: 1.12, x: 960, y: 560, shake: 1.2 }, { end: 0, z: 1.0, x: 960, y: 540, e: 'io' }),
      actors: [...fiber({ speed: 1.6 }),
        P('pool', { x: 680, y: 560, rx: 520, ry: 420, kind: 'pix', op: 0.6 }, 'pixlight', 1),
        ...ride(980, 760, 1.6, { zK: [{ l: 0, look: [-4, -6], headR: -6, face: 0 }, { l: 1, look: [6, -6], headR: 6, face: 4 }, { l: 3, t: 0.2, look: [0, 1], headR: 0, face: 6 }] }),
        pix([{ x: 620, y: 520, s: 1.4, face: 1 }, { l: 1, face: 5 }, { l: 2, face: 3 }]),
        P('holo', [{ x: 560, y: 220, w: 270, h: 210, icon: 'shop', txt: 'SHOP SIDE', size: 26, on: 0 }, { l: 0, t: 1.6, on: 0 }, { l: 0, t: 1.9, on: 1, e: 'out' }], 'h1', 8),
        P('holo', [{ x: 960, y: 190, w: 270, h: 210, icon: 'network', txt: 'NETWORK', size: 26, on: 0 }, { l: 0, t: 2.4, on: 0 }, { l: 0, t: 2.7, on: 1, e: 'out' }], 'h2', 8),
        P('holo', [{ x: 1360, y: 220, w: 270, h: 210, icon: 'bank', txt: "ZERO'S BANK", size: 26, on: 0 }, { l: 0, t: 3.2, on: 0 }, { l: 0, t: 3.5, on: 1, e: 'out' }], 'h3', 8),
        P('holo', [{ x: 1360, y: 220, w: 270, h: 210, icon: 'shield', txt: 'FRAUD TEST', size: 26, color: '#FF8A7A', on: 0 }, { l: 1, on: 0 }, { l: 1, t: 0.3, on: 1, e: 'out' }, { l: 2, on: 1 }, { l: 2, t: 0.2, on: 0 }], 'h4', 9),
        P('text', [{ x: 1480, y: 470, txt: 'YES / NO', size: 64, color: '#FFC93C', o: 0 }, { l: 2, t: 0.6, o: 1, e: 'step' }, { l: 3, o: 0, e: 'step' }], 'yn', 9),
        vig(0.85)],
      sfx: [sfx('fiber', 0, { g: 0.4, bed: true }), sfx('ping', 1.9, { g: 0.3 }), sfx('ping', 2.7, { g: 0.3 }), sfx('ping', 3.5, { g: 0.3 }), sfx('tension', 0.3, { l: 1, g: 0.3 })],
    },
    // ===== s08: the card has no battery. Insert: the card in X-ray; the terminal's field reaches it and the coil lights =====
    {
      lines: [N('First surprise:', { at: 0.2 }), N('that card has no battery.', { gap: 0.15 }), N("The terminal's radio field wakes up its chip for a split second,", { gap: 0.4 }), N('just long enough to say one thing.', { gap: 0.1 })], min: 9, bg: '#0B1226',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.08, x: 960, y: 520, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#0B1226' }, 'bg', -20), P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: 'url(#wGrid)', op: 0.25 }, 'grid', -19),
        P('payterm', { x: 960, y: 1180, s: 1.6, l1: '$4.75', l2: 'PROCESSING', timer: 0.01 }, 'term', 0),
        P('field', [{ x: 960, y: 880, s: 1.4, on: 0 }, { l: 2, on: 0 }, { l: 2, t: 0.3, on: 1, e: 'out' }], 'fld', 1),
        P('zcard', [{ x: 960, y: 420, s: 3.0, xray: 0.2, wake: 0 }, { l: 1, xray: 1, e: 'io' }, { l: 2, t: 0.9, wake: 0 }, { l: 2, t: 1.3, wake: 1, e: 'out' }], 'card', 2),
        P('holo', [{ x: 1500, y: 300, w: 260, h: 120, txt: 'NO BATTERY', size: 30, color: '#FF8A9A', on: 0 }, { l: 1, t: 0.4, on: 0 }, { l: 1, t: 0.7, on: 1, e: 'out' }], 'nb', 3),
        P('capsule', [{ x: 760, y: 360, s: 0.1, o: 0, trail: 0 }, { l: 3, t: 0.6, o: 1, e: 'step' }, { l: 3, t: 1.1, s: 0.7, x: 600, y: 300, e: 'back' }], 'cap', 4),
        ui(zero([{ x: 300, y: 1010, s: 1.6, face: 0, look: [8, -6], pose: 'point', hr: [150, 100] }, { l: 2, face: 6, pose: 'neutral', hr: null }, { l: 3, face: 2, look: [6, -8] }], { z: 48 })),
        vig(0.7)],
      sfx: [sfx('hum', 0, { l: 2, g: 0.35 }), sfx('scan', 1.3, { l: 2, g: 0.5 }), sfx('pop', 0.6, { l: 3, g: 0.5 })],
    },
    // ===== s09a: to ZERO, it's his money (he hugs the capsule) =====
    {
      lines: [N("To ZERO, it's his money.")], min: 2.6, bg: '#050A18',
      cam: cam({ z: 1.6, x: 1000, y: 640 }, { end: 0, z: 1.7, x: 1000, y: 650, e: 'lin' }),
      actors: [...fiber({ speed: 0.6 }), P('pool', { x: 860, y: 680, rx: 520, ry: 420, kind: 'pix', op: 0.7 }, 'pixlight', 1),
        P('capsule', { x: 980, y: 760, s: 1.6, trail: 0.4 }, 'cap', 3),
        zero([{ x: 1060, y: 760 - 50, s: 1.9, face: 10, fl: [120, 196], fr: [134, 200], hl: [60, 190], hr: [80, 186], look: [-6, 4], headR: 10 }], { z: 4 }), vig(0.85)],
    },
    // ===== s09b: SYSTEM VIEW. To the system, it's a record: card, amount, shop, a one-time code. NAME: not included =====
    {
      lines: [N("To the system, it's this.", { at: 0.3 }), N('A card number.', { gap: 0.15 }), N('An amount.', { gap: 0.1 }), N('Which shop.', { gap: 0.1 }), N('And a code that only works once.', { gap: 0.2 })], min: 8, hold: 1.6, bg: '#050A18',
      actors: [...fiber({ speed: 0.6 }), sysOn({ t: 0.2 }),
        P('msgcard', [{ x: 900, y: 540, s: 0.2, hl: 0, o: 0, ui: true }, { t: 0.4, o: 1, e: 'step' }, { t: 1.1, s: 1.0, e: 'back' }, { l: 1, hl: 1, e: 'step' }, { l: 2, hl: 2, e: 'step' }, { l: 3, hl: 3, e: 'step' }, { l: 4, hl: 4, e: 'step' }, { end: 1.4, hl: 0, e: 'step' }], 'msg', 45),
        ui(pix([{ x: 1640, y: 260, s: 1.3, face: 3 }, { l: 4, face: 1 }])),
        ui(zero([{ x: 1600, y: 1010, s: 1.9, face: 4, look: [-8, -4], o: 0, flip: true }, { t: 1.0, o: 1, e: 'step' }, { l: 1, pose: 'point', look: [8, -2] }, { end: 1.4, pose: 'neutral', hl: [96, 110], hr: [104, 110], face: 3, look: [0, 1] }, { end: 0.9, face: 9 }], { z: 48 })),
      ],
      sfx: [sfx('whoosh', 0.2, { g: 0.5 }), sfx('scan', 0.3, { g: 0.5 }), sfx('ping', 0, { l: 1, g: 0.25 }), sfx('ping', 0, { l: 2, g: 0.25 }), sfx('ping', 0, { l: 3, g: 0.25 }), sfx('ping', 0, { l: 4, g: 0.25 }), sfx('error', 1.3, { end: 1.35, g: 0.25 })],
    },
    // ===== s10: copy the code and it's useless a second later =====
    {
      lines: [N('Copy that code,', { at: 0.2 }), N("and it's useless a second later.", { gap: 0.2 }), N("That's why a chip card is so hard to clone.", { gap: 0.4 })], min: 6.5, bg: '#050A18',
      actors: [...fiber({ speed: 0.6 }), sysOn({ t: -1 }),
        P('clonegag', [{ x: 960, y: 500, s: 1.5, k: 0, ui: true }, { l: 1, k: 0 }, { l: 1, t: 1.4, k: 1, e: 'in' }], 'clone', 45),
        ui(zero([{ x: 1720, y: 1010, s: 1.7, face: 0, look: [-8, -4], flip: true }, { l: 1, t: 1.0, face: 2 }, { l: 2, pose: 'proud', face: 1 }], { z: 48 })),
      ],
      sfx: [sfx('shutter', 0.3, { g: 0.5 }), sfx('error', 1.0, { l: 1, g: 0.3 }), sfx('fall', 1.2, { l: 1, g: 0.3 })],
    },
    // ===== s11: pay with a phone and even the number is fake: a token (the card number in disguise) =====
    {
      lines: [N('Pay with a phone instead,', { at: 0.2 }), N('and even the card number is fake.', { gap: 0.1 }), N("It's a stand-in called a token.", { gap: 0.3 }), N('Visa says it has handed out more than sixteen billion of them.', { gap: 0.3 })], min: 10, bg: '#050A18',
      actors: [...fiber({ speed: 0.6 }), sysOn({ t: -1 }),
        P('tokenphone', [{ x: 860, y: 560, s: 0.2, k: 0, o: 0, ui: true }, { t: 0.3, o: 1, e: 'step' }, { t: 0.9, s: 1.5, e: 'back' }, { l: 1, t: 0.6, k: 0 }, { l: 1, t: 1.0, k: 1, e: 'out' }], 'tok', 45),
        P('holo', [{ x: 1420, y: 330, w: 480, h: 150, txt: '16,000,000,000+', size: 44, on: 0, ui: true }, { l: 3, t: 2.2, on: 0 }, { l: 3, t: 2.5, on: 1, e: 'out' }], 'n16', 46),
        P('text', [{ x: 1420, y: 440, txt: 'TOKENS · VISA, 2025', size: 26, color: '#8FA6C8', o: 0, ui: true }, { l: 3, t: 2.6, o: 1, e: 'step' }], 'n16s', 46),
        ui(zero([{ x: 1600, y: 1010, s: 1.7, face: 4, look: [-8, -4], flip: true }, { l: 1, t: 1.0, face: 7 }, { l: 2, face: 2 }, { l: 3, face: 3, look: [-4, -8] }], { z: 48 })),
      ],
      sfx: [sfx('pop', 0.3, { g: 0.4 }), sfx('boing', 1.0, { l: 1, g: 0.35 }), sfx('ping', 2.5, { l: 3, g: 0.35 })],
    },
    // ===== s12: ZERO's theory, straight to his bank. PIX crosses it out and draws the real road: three stops =====
    {
      lines: [N("ZERO thinks it's going straight to his bank.", { at: 0.3 }), N("It isn't.", { gap: 0.4 }), N('Not even close.', { gap: 0.25 })], min: 6.4, hold: 1.2, bg: '#050A18',
      cam: cam({ z: 1, x: 960, y: 540 }, { end: 0, z: 1.06, x: 960, y: 520, e: 'lin' }),
      tout: { type: 'zoom', x: 1240, y: 430, dur: 0.6, color: '#050A18' },
      actors: [...fiber({ speed: 0.8 }),
        P('routeholo', [{ x: 960, y: 470, s: 1.0, cross: 0, prog: 0, o: 0 }, { t: 0.3, o: 1, e: 'step' }, { l: 1, t: 0.1, cross: 1, e: 'out' }, { l: 2, prog: 0 }, { l: 2, t: 1.4, prog: 1, e: 'io' }], 'route', 2),
        ...ride(1000, 900, 1.0, { cap: { trail: 0.5 }, zK: [{ t: 0.4, pose: 'point', hr: [150, 110], look: [8, -6], face: 2 }, { l: 1, pose: 'neutral', hr: null, face: 3 }, { l: 2, face: 4, look: [6, -8] }] }),
        pix([{ x: 1500, y: 760, s: 1.1, face: 0 }, { l: 1, face: 5, spin: -20 }, { l: 1, t: 0.2, spin: 20 }, { l: 1, t: 0.4, spin: -20 }, { l: 1, t: 0.6, spin: 0 }, { l: 2, face: 2 }]),
        vig(0.8)],
      sfx: [sfx('fiber', 0, { g: 0.35, bed: true }), sfx('error', 0.1, { l: 1, g: 0.5 }), sfx('swipe', 0.2, { l: 2, g: 0.4 }), sfx('whoosh', 0, { end: 0.6, g: 0.6 })],
    },
  ],
};
