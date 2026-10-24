// Shared pieces of video 002 "What Happens in the 2 Seconds After You Tap Your Card": the café at 8:14 AM where time
// stops, the terminal, ZERO's card, the capsule we follow and the fibre it rides (props in src/world-pay.js).
import { G, prop, zero } from '../../src/kit.mjs';

export const P = (type, k, id, z = 0, o = {}) => prop(type, k, { id, z, ...o });
export const vig = (op = 0.75) => P('vignette', { x: 0, y: 0, ui: true, op }, 'vig', 50);
export const ui = a => ({ ...a, k: a.k.map(k => ({ ...k, ui: true })) });
export const sysOn = (at, id = 'sys') => (at.t ?? 0) < 0 ? P('sysview', { x: 0, y: 0, ui: true, op: 1, light: true }, id, -15) : P('sysview', [{ x: 0, y: 0, ui: true, op: 0 }, { ...at, op: 0, e: 'step' }, { ...at, t: (at.t ?? 0) + 0.5, op: 1, e: 'out' }], id, 40);

// the frozen café: the stage stops every prop that isn't live; same: true holds the clock of the previous freeze
export const FREEZE = { at: 0, same: true, tint: 0.55 };

// where things stand in the café (screen coordinates in the wide shot)
export const TERM = [905, G - 324];       // the terminal on the counter (its foot)
export const ZX = 760;                    // ZERO in the queue, at the counter
// a point of ZERO's body in world space (his local frame: 200 wide, feet at y 204), for props in his hands
export const hand = (x, y, [hx, hy], s = 2.6) => [x + (hx - 100) * s, y - (204 - hy) * s];

// ---------- the café at 8:14 AM ----------
// back wall (window onto the street, chalk menu, cups), the back counter with the espresso machine, the barista,
// the front counter with the pastry case and the terminal, the queue behind ZERO (the man who pays cash is second),
// pendant lamps, warm morning pools, a chair in the foreground. o.* overrides: termK (terminal keys), baristaK,
// espK (espresso keys), q (queue extra keys), birdK, fg: false drops the foreground chair
export const cafe = (o = {}) => [
  P('interior', { x: 0, y: G, wall: '#C9A98A', floor: '#6B5444', vx: 1100 }, 'int', -22),
  P('cafewall', { x: 960, y: G, menuX: 250, cupsX: 1250, hlPrice: o.hlPrice }, 'cwall', -20),
  P('bird', [{ x: 470, y: 594, s: 0.9, flip: true, ...(o.bird || {}) }, ...(o.birdK || [])], 'bird', -19),
  // back counter + espresso machine
  P('rect', { x: 1560, y: G - 165, w: 900, h: 330, fill: '#5C3B29' }, 'backc', -16),
  P('rect', { x: 1560, y: G - 336, w: 920, h: 22, fill: '#E9E2D3' }, 'backtop', -16),
  P('espresso', [{ x: 1560, y: G - 346, s: 0.95, pour: 1, cupFill: 0.35, ...(o.esp || {}) }, ...(o.espK || [])], 'esp', -15),
  P('pool', { x: 1560, y: 420, rx: 420, ry: 300, kind: 'warm', op: 0.35 }, 'esppool', -14),
  // the barista: apron, looking at the machine, then at ZERO
  P('person', [{ x: 1270, y: G - 40, s: 2.25, pose: 'reach', shirt: '#E8E2D6', skin: '#B9876A', hair: '#3A2A22', apron: '#2F5A4C', seed: 4, look: 0.7, flip: true, ...(o.barista || {}) }, ...(o.baristaK || [])], 'barista', -10),
  P('barcounter', { x: 1180, y: G, w: 1000 }, 'counter', -6),
  P('payterm', [{ x: TERM[0], y: TERM[1] + 13, s: 0.82, l1: '$4.75', l2: 'TAP CARD', ...(o.term || {}) }, ...(o.termK || [])], 'term', -5),
  // the queue: a woman on her phone, the man who pays cash (hat, coins), a student
  P('person', [{ x: 360, y: G + 10, s: 2.3, pose: 'stand', shirt: '#7A5A3E', skin: '#D8B08C', cap: '#6B6F78', pants: '#3E3A44', seed: 9, look: 0.6, ...(o.man || {}) }, ...(o.manK || [])], 'man', -3),
  P('person', [{ x: 150, y: G + 20, s: 2.35, pose: 'type', shirt: '#4E6B8C', skin: '#8E6450', hair: '#1E1820', seed: 2, look: 0.2, ...(o.woman || {}) }, ...(o.womanK || [])], 'woman', -2),
  P('pendant', { x: 760, y: 40, cord: 300, len: 700, spread: 760, color: '#2F5A4C' }, 'lamp1', -9),
  P('pendant', { x: 1400, y: 40, cord: 300, len: 700, spread: 760, color: '#2F5A4C' }, 'lamp2', -9),
  P('pool', { x: 280, y: 380, rx: 520, ry: 420, kind: 'cool', op: 0.45 }, 'winpool', -18),
  P('pool', { x: 900, y: 900, rx: 700, ry: 160, kind: 'warm', op: 0.5 }, 'floorpool', -12),
  ...(o.fg === false ? [] : [P('potplant', { x: 1880, y: G + 160, s: 1.6, seed: 2, color: '#2F5A4C' }, 'fgplant', 30, { depth: 1.2 })]),
];

// ZERO holding his card in front of him (both hands), proud; the card prop follows the hands
export const zHold = (x, extra = []) => zero([{ x, face: 2, pose: 'neutral', hl: [118, 126], hr: [128, 128], look: [6, -2] }, ...extra], { z: 5 });

// inside the cable: the fibre rushing past, PIX's warm light on ZERO, ZERO sitting on the capsule
export const fiber = (o = {}) => [P('fiber', [{ x: 0, y: 0, speed: o.speed ?? 1, vx: o.vx ?? 960, vy: o.vy ?? 470, tint: o.tint, bg: o.bg }, ...(o.k || [])], o.id ?? 'fib', -20)];
// o.path: keys {t|l|u|end, x, y, e} that move the capsule and ZERO together; o.capK / o.zK: keys for one of them
const seat = (y, s) => y - 38 * s + 36 * (1.17 * s);
export const ride = (x, y, s = 1.5, o = {}) => [
  P('capsule', [{ x, y, s, trail: o.trail ?? 0.8, ang: o.ang ?? 0, ...(o.cap || {}) }, ...(o.path || []).map(k => ({ ...k })), ...(o.capK || [])], o.cid ?? 'cap', o.cz ?? 3),
  zero([{ x, y: seat(y, s), s: 1.17 * s, face: o.face ?? 2, fl: [120, 196], fr: [134, 200], hl: [84, 170], hr: [118, 170], look: o.look ?? [6, -2] }, ...(o.path || []).map(k => ({ ...k, ...(k.y != null ? { y: seat(k.y, s) } : {}) })), ...(o.zK || [])], { z: o.zz ?? 4, id: o.zid }),
];
