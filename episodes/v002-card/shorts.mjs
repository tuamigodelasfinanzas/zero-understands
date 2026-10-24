// The two Shorts of video 002, built natively for 1080x1920 from the long video's key moments (same props, same world,
// re-composed for the vertical frame instead of cropped). No ZeroOpen and no brand mark: each one opens on its
// question, ends on its answer, and the last line loops into the first. Burned-in captions sit at y 1700, so nothing
// important goes below the floor line FL.
//   trust: the bank's fraud check, where a brand-new card looks like a stolen one (part 2, s22-s27)
//   cut:   who takes a slice of the $4.75, and who really pays for it (part 3, s37-s41)
import { G, N, zero, pix, sfx, cam } from '../../src/kit.mjs';
import { P, vig, cafe } from './common.mjs';
import full from './full.mjs';

const FL = 1480;                                   // the floor in the vertical frame (screen = world, cam z 1)
const V = cam({ z: 1, x: 540, y: 960 });
const K = 1920 / 1080;                             // café shots: the long video's world, full height
const LONG = 'https://www.youtube.com/@zerounderstands';
const base = (id, title, about, tags, beats) => ({
  id: `v002-${id}`, format: 'short', captions: true, music: full.music, musicGain: full.musicGain,
  title, tags: ['shorts', 'how it works', 'credit cards', 'payments', ...tags],
  description: `${about}\n\nThe whole two seconds, from the tap to the night the money moves: ${LONG}\n\n#shorts #howitworks #creditcards`,
  beats,
});

// ---------- the bank (burgundy and brass), vertical ----------
const SCX = 450;
const room = (k = []) => P('bankroom', [{ x: 540, y: FL, light: 0, lcol: 'coral' }, ...k], 'room', -20);
const scale = (k = []) => P('riskscale', [{ x: SCX, y: FL, s: 0.7, tilt: 0, nl: 0, ev: ['REAL CHIP', '$4.75', 'NEAR HOME'], ne: 0 }, ...k], 'scale', -4);
const dial = (k = []) => P('riskdial', [{ x: 540, y: 360, s: 0.85, v: 0.35 }, ...k], 'dial', -4);
const qcap = (k = []) => P('capsule', [{ x: SCX, y: FL - 690, s: 0.55, trail: 0, txt: '?' }, ...k], 'cap', 2);
const zb = (k = []) => zero([{ x: 895, y: FL, s: 1.8, face: 0, flip: true, look: [-6, -6] }, ...k], { z: 5 });
const pixb = (k = []) => pix([{ x: 900, y: 760, s: 0.8, face: 2 }, ...k]);

export const trust = base('short-trust', 'Why your bank thinks a new card is a stolen card',
  "Every tap, your bank checks your habits. ZERO's card is brand new, so he has none. Sources: Visa press release (Jun 2019, 500+ risk details in about a millisecond); each bank's model is private, so the scale is an illustration.",
  ['fraud detection', 'new credit card', 'contactless'], [
    // the question, then the habits: hundreds of chips swarm the scale
    { lines: [N('Every time you tap, your bank checks your habits.', { at: 0.2 }), N('More than five hundred details, in about a millisecond.', { gap: 0.3 })],
      min: 5, bg: '#26141E', cam: V,
      actors: [room(), scale(), dial(), qcap(),
        P('habitchips', [{ x: SCX, y: FL - 620, k: 0, n: 40 }, { t: 0.6, k: 0 }, { l: 1, t: 0.2, k: 1, e: 'out' }], 'chips', 4),
        zb([{ t: 0.5, pose: 'point', hr: [150, 40], face: 2, look: [-6, -8] }, { l: 1, pose: 'neutral', hr: null, face: 7 }]), pixb(),
        P('holo', [{ x: 540, y: 545, w: 600, h: 120, txt: '500+ DETAILS · ~1 MS', size: 36, color: '#FFD98A', on: 0 }, { l: 1, t: 1.2, on: 1, e: 'out' }], 'h500', 6),
        P('text', [{ x: 760, y: 470, txt: 'VISA, 2019', size: 24, color: '#E6CFC0', o: 0 }, { l: 1, t: 1.4, o: 1, e: 'step' }], 'h500s', 6),
        vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('roll', 0.2, { l: 1, g: 0.4 }), sfx('ping', 1.2, { l: 1, g: 0.35 })] },
    // the complication: no habits; the chips go blank, doubt drops into the left pan, the dial swings red
    { lines: [N("But ZERO's card is brand new.", { at: 0.2 }), N('No habits.', { gap: 0.3 }), N('And to a fraud machine,', { gap: 0.3 }), N('that looks a lot like a stolen card.', { gap: 0.1 })],
      min: 8, hold: 0.6, bg: '#26141E',
      cam: cam({ z: 1, x: 540, y: 960 }, { l: 3, z: 1, x: 540, y: 960 }, { end: 0, z: 1.35, x: 560, y: 700, shake: 1, e: 'io' }),
      actors: [room([{ l: 2, light: 0 }, { l: 2, t: 1.0, light: 1, e: 'io' }]),
        scale([{ l: 1, tilt: 0, nl: 0 }, { l: 1, t: 0.5, nl: 3, e: 'step' }, { l: 1, t: 0.9, nl: 6, tilt: -1, e: 'back' }]),
        dial([{ l: 2, v: 0.35 }, { l: 2, t: 1.0, v: 0.84, e: 'back' }, { l: 3, txt: 'FIRST PURCHASE', txt2: 'NO HISTORY', e: 'step' }]), qcap([{ l: 2, state: 'ask' }, { l: 3, state: 'hold', e: 'step' }]),
        P('habitchips', [{ x: SCX, y: FL - 620, k: 1, n: 40, blank: 0 }, { l: 1, blank: 0 }, { l: 1, t: 0.4, blank: 1, e: 'io' }], 'chips', 4),
        zb([{ face: 2, pose: 'proud' }, { l: 1, face: 9, pose: 'neutral' }, { l: 3, pose: 'cover', face: 9, e: 'out' }]),
        pixb([{ l: 1, face: 3 }, { l: 3, face: 1 }]), vig(0.7)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('error', 0.3, { l: 1, g: 0.3 }), sfx('clunk', 0.5, { l: 1, g: 0.5 }), sfx('clunk', 0.9, { l: 1, g: 0.5 }), sfx('tension', 0, { l: 2, g: 0.5 }), sfx('buzz', 1.0, { l: 2, g: 0.35 })] },
    // the evidence: three green chips tip the scale back, the dial returns to green; ZERO peeks, then celebrates
    { lines: [N('Then the evidence adds up.', { at: 0.2 }), N('A real chip.', { gap: 0.3 }), N('A tiny amount.', { gap: 0.3 }), N('A café near home.', { gap: 0.3 })],
      min: 7, bg: '#26141E', cam: V,
      actors: [room([{ light: 0.6 }, { l: 3, light: 0.6 }, { l: 3, t: 1.0, light: 0, e: 'io' }]),
        scale([{ tilt: -1, nl: 6, ne: 0 }, { l: 1, t: 0.2, ne: 1, tilt: -0.6, e: 'back' }, { l: 2, t: 0.2, ne: 2, nl: 4, tilt: -0.1, e: 'back' }, { l: 3, t: 0.3, ne: 3, nl: 2, tilt: 0.6, e: 'back' }]),
        dial([{ v: 0.84, txt: 'FIRST PURCHASE', txt2: 'NO HISTORY' }, { l: 1, t: 0.4, v: 0.66, e: 'out' }, { l: 2, t: 0.4, v: 0.45, e: 'out' }, { l: 3, t: 0.6, v: 0.16, txt: 'LOOKS LIKE ZERO', txt2: null, e: 'out' }]),
        qcap([{ state: 'hold' }]),
        zb([{ face: 9, pose: 'cover', look: [-6, -2] }, { l: 1, t: 0.3, hl: [76, 92], hr: [124, 112], face: 0, look: [-8, -4] }, { l: 3, t: 0.6, pose: 'neutral', hl: null, hr: null, face: 2 }]),
        pixb([{ face: 1 }, { l: 3, t: 0.6, face: 2 }]), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('clunk', 0.2, { l: 1, g: 0.6 }), sfx('clunk', 0.2, { l: 2, g: 0.6 }), sfx('clunk', 0.3, { l: 3, g: 0.6 })] },
    // the answer
    { lines: [N('Credit: yes.', { at: 0.2 })], min: 2.6, hold: 0.4, bg: '#26141E', cam: V,
      actors: [room([{ light: 0 }]), scale([{ tilt: 0.6, nl: 2, ne: 3 }]), dial([{ v: 0.16, txt: 'LOOKS LIKE ZERO' }]), qcap([{ state: 'ok', check: true }]),
        P('text', [{ x: 540, y: 640, txt: 'CREDIT: YES', size: 76, color: '#58E08A', o: 0 }, { t: 0.2, o: 1, e: 'step' }], 'cy', 8),
        zb([{ pose: 'celebrate', face: 2 }]), pixb([{ face: 2 }]), vig(0.6)],
      sfx: [sfx('chime', 0.2, { g: 0.5 })] },
  ]);

// ---------- the coin, vertical ----------
const dark = () => [P('rect', { x: 540, y: 960, w: 2000, h: 3000, fill: '#120E1E' }, 'bg', -20), P('pool', { x: 540, y: 760, rx: 700, ry: 700, kind: 'warm', op: 0.35 }, 'pl', -10)];
const PIE = [290, 620];
const zc = (k = []) => zero([{ x: 800, y: FL, s: 2.3, face: 2, look: [-8, -8], flip: true }, ...k], { z: 5 });
// the café, with the chalk menu centred over the till so a vertical slice holds both
const cafeV = o => cafe(o).map(a => a.id === 'cwall' ? { ...a, k: a.k.map(k => ({ ...k, menuX: 0 })) } : a);
const MAN = 820;

export const cut = base('short-cut', "The café doesn't get your $4.75",
  'Pay $4.75 by credit card and three companies take a slice before the café sees it. Average US credit interchange is about 1.9% (NBER, Jul 2026); ≈10-15¢ on a $4.75 coffee is our estimate.',
  ['interchange fees', 'card fees', 'cash back'], [
    // the hook: one big coin
    { lines: [N('You pay four seventy-five for a coffee.', { at: 0.2 }), N("The coffee shop doesn't get four seventy-five.", { gap: 0.3 })],
      min: 5, bg: '#120E1E', cam: V,
      actors: [...dark(), P('coinpie', [{ x: PIE[0], y: PIE[1], s: 0.2, o: 0 }, { t: 0.1, o: 1, e: 'step' }, { t: 0.6, s: 0.95, e: 'back' }], 'pie', 2),
        zc([{ l: 1, pose: 'point', hr: [150, 100], face: 0 }, { l: 1, t: 1.4, pose: 'neutral', hr: null, face: 4 }]), vig(0.6)],
      sfx: [sfx('coin', 0.6, { g: 0.5 })] },
    // the slices
    { lines: [N('The biggest slice goes to your bank.', { at: 0.2 }), N('The network takes one.', { gap: 0.3 }), N("The shop's card company takes one.", { gap: 0.2 }), N('Ten or fifteen cents a coffee.', { gap: 0.4 })],
      min: 9, hold: 0.6, bg: '#120E1E', cam: V,
      actors: [...dark(),
        P('coinpie', [{ x: PIE[0], y: PIE[1], s: 0.95, out: [0, 0, 0], note: '' }, { t: 0.3, out: [0, 0, 0] }, { t: 1.0, out: [1, 0, 0], e: 'back' }, { l: 1, t: 0.2, out: [1, 1, 0], e: 'back' }, { l: 2, t: 0.3, out: [1, 1, 1], e: 'back' }, { l: 3, cap: '≈ 10–15¢ OF $4.75 (ESTIMATE)', note: 'SLICES DRAWN BIGGER THAN LIFE', e: 'step' }], 'pie', 2),
        P('holo', [{ x: 540, y: 250, w: 300, h: 140, txt: '≈ 2%', size: 60, color: '#FFD98A', on: 0 }, { t: 1.2, on: 1, e: 'out' }, { l: 1, on: 0, e: 'step' }], 'h2', 6),
        P('text', [{ x: 540, y: 355, txt: 'AVERAGE · NBER, 2026', size: 24, color: '#E6CFC0', o: 0 }, { t: 1.4, o: 1, e: 'step' }, { l: 1, o: 0, e: 'step' }], 'h2s', 6),
        zc([{ face: 7 }, { l: 1, pose: 'point', hr: [150, 100], face: 0 }, { l: 2, pose: 'neutral', hr: null, face: 9 }, { l: 3, face: 1, look: [0, 1] }]), vig(0.6)],
      sfx: [sfx('slide', 1.0, { g: 0.5 }), sfx('slide', 0.2, { l: 1, g: 0.5 }), sfx('slide', 0.3, { l: 2, g: 0.5 }), sfx('coin', 0.3, { l: 3, g: 0.4 })] },
    // who pays: the prices; then the man in the grey cap counting coins, ZERO beside him
    { lines: [N('So who pays for it?', { at: 0.2 }), N('The shop builds it into its prices.', { gap: 0.3 }), N('For everyone.', { gap: 0.3 }), N('Even people who pay in cash.', { gap: 0.3 })],
      min: 8, hold: 0.8, bg: '#2A1E18',
      cam: cam({ z: K, x: 955, y: 540 }, { end: 0, z: K * 1.06, x: 965, y: 560, e: 'lin' }),
      actors: [...cafeV({ hlPrice: true, man: { x: MAN, pose: 'reach', look: 0.9 }, woman: { x: 150 }, fg: false }),
        P('statustag', [{ x: 960, y: 470, s: 0.75, w: 520, txt: 'CARD FEES INCLUDED', color: '#F2C14E', on: 0 }, { l: 1, t: 0.8, on: 0 }, { l: 1, t: 1.1, on: 1, e: 'out' }], 'incl', 8),
        ...[0, 1, 2].map(i => P('coin', [{ x: MAN + 130 + i * 22, y: 684 - i * 5, s: 0.32, txt: '', color: i === 1 ? '#C9CED8' : '#C08A3E' }], 'mc' + i, 1)),
        zero([{ x: 1130, y: G + 20, s: 2.1, face: 0, flip: true, look: [-8, -2] }, { l: 3, t: 0.8, face: 9 }], { z: 5 }), vig(0.55)],
      sfx: [sfx('chatter', 0, { g: 0.25, bed: true }), sfx('coin', 0.4, { l: 3, g: 0.4 }), sfx('coin', 0.9, { l: 3, g: 0.4 })] },
  ]);
