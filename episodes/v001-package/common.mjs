// Shared pieces of video 001's parts: the yellow box's size, prop shorthand, the vignette, the route on the US map,
// SYSTEM VIEW switch-on, the screen-space helper, and the sets of the air network (ramp, hub, US map).
import { G, prop } from '../../src/kit.mjs';

export const BOX = 1.15;         // the yellow box's scale next to ZERO (s 2.6): a shoebox he can sit on
export const P = (type, k, id, z = 0, o = {}) => prop(type, k, { id, z, ...o });
export const vig = (op = 0.75) => P('vignette', { x: 0, y: 0, ui: true, op }, 'vig', 50);
// a point on the route drawn on the US map (quadratic from ZERO's dot to mom's heart), for the trail of scans
export const route = t => [
  Math.round(((1 - t) ** 2 * 48 + 2 * (1 - t) * t * 210 + t * t * 366) * 10) / 10,
  Math.round(((1 - t) ** 2 * 112 + 2 * (1 - t) * t * 40 + t * t * 80) * 10) / 10];
// at.t < 0: already on when the beat starts, as a light layer that doesn't dim the map or plan
export const sysOn = (at, id = 'sys') => (at.t ?? 0) < 0 ? P('sysview', { x: 0, y: 0, ui: true, op: 1, light: true }, id, -15) : P('sysview', [{ x: 0, y: 0, ui: true, op: 0 }, { ...at, op: 0, e: 'step' }, { ...at, t: (at.t ?? 0) + 0.5, op: 1, e: 'out' }], id, 40);
export const ui = a => ({ ...a, k: a.k.map(k => ({ ...k, ui: true })) });
// map coordinates of the US map (usmap at 960,560, s 3.3) to the screen
export const onMap = ([x, y], s = 3.3, cx = 960, cy = 560) => [cx + (x - 206) * s, cy + (y - 122) * s];

// ---------- part 2 and 3: the air network ----------
export const WET = 0.6;                          // the label got wet on the road (it matters in part 3)
export const ZB = { label: true, stamp: 1, wet: WET };   // ZERO's box from here on
export const VEST = '#E8823C';                   // hi-vis vests of the night shift (orange: yellow belongs to the box)
export const SEAT = { fl: [120, 196], fr: [134, 200] };  // ZERO sitting (feet forward)

// ---------- sets ----------
// the ramp at night: a jet with its cargo door open on the horizon, a scissor loader at the door, the dolly train of
// containers in front, ramp workers; o.ulds overrides the three containers, o.extra adds actors
export const loader = (x, y, s = 1, lift = 1) => [
  P('rect', { x, y: y - 10, w: 220 * s, h: 26 * s, fill: '#D9A43A' }, 'ldbase', -14),
  P('rect', { x: x - 30 * s, y: y - 10 - 90 * s * lift, w: 16 * s, h: 200 * s * lift, fill: '#4A5270', r: 34 }, 'ldx1', -14),
  P('rect', { x: x + 30 * s, y: y - 10 - 90 * s * lift, w: 16 * s, h: 200 * s * lift, fill: '#4A5270', r: -34 }, 'ldx2', -14),
  P('rect', { x, y: y - 20 - 180 * s * lift, w: 240 * s, h: 22 * s, fill: '#E6C14A' }, 'ldtop', -14)];
export const rampSet = (o = {}) => [
  P('ramp', { x: 960, y: 560, vx: 300 }, 'ramp', -30),
  P('cargojet', { x: 1280, y: 700, s: 0.55, door: 1 }, 'jet', -20),
  ...loader(1618, 700, 0.8, 1.05),
  P('uld', { x: 1618, y: 528, s: 0.4, fill: 1, seed: 9, door: 0 }, 'uldup', -13),
  ...(o.ulds || [[330, 0.9, 0, 1], [760, 0.45, 1, 2], [1190, 1, 0, 3]]).map(([x, fill, door, seed], i) => [
    P('dolly', { x, y: 930, s: 1 }, 'd' + i, -6),
    P('uld', [{ x, y: 884, s: 1.05, fill, door, seed, ...(o.uldK?.[i]?.[0] || {}) }, ...(o.uldK?.[i]?.slice(1) || [])], 'u' + i, -5)]).flat(),
  P('person', [{ x: 1540, y: 960, s: 1.25, pose: 'carry', flip: true, vest: VEST, shirt: '#3E4A66', skin: '#9C6B50', seed: 3, hold: { type: 'parcel', v: 2, s: 0.7 }, ...(o.w1 || {}) }, ...(o.w1K || [{ u: 1, x: 1330, e: 'lin' }])], 'w1', -2),
  P('person', { x: 1700, y: 530, s: 0.5, pose: 'reach', vest: VEST, shirt: '#2E3A55', seed: 5 }, 'w2', -12),
  ...(o.extra || []),
];

// inside the hub: trusses, lamps, tiers of belts; the wall clock says it's the middle of the night
export const hubSet = (o = {}) => [
  P('hubint', { x: 960, y: G, dim: o.dim ?? 0 }, 'hub', -30),
  P('wallclock', { x: o.clockX ?? 1720, y: 250, s: 0.6, h: o.h ?? 1, m: o.m ?? 52, s0: 10 }, 'clock', -25),
  ...(o.fg === false ? [] : [P('stanchion', { x: -120, y: G + 170, s: 1.1, n: 2, gap: 300, belt: '#E8B83C' }, 'fgpost', 30, { depth: 1.15 })]),
];

// parcels flowing along a belt at y (screen), from x0, every gap px, at speed px/s for about dur seconds
export const flow = (id, y, x0, n, gap, speed, dur, mk, z = -4) => Array.from({ length: n }, (_, i) => {
  const it = mk(i);
  return P(it.type ?? 'parcel', [{ x: x0 + i * gap, y, ...it }, { u: 1, x: x0 + i * gap + speed * dur, e: 'lin' }], id + i, z);
});

// SYSTEM VIEW of the US: deep blue page, grid, the map; k = keys of the map
export const usView = (k, extra = []) => [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#081326' }, 'bg', -20), sysOn({ t: -1 }),
  P('usmap', [{ x: 960, y: 560, s: 3.3, tone: 'holo', a: 1, prog: 0, hub: false, ...k[0] }, ...k.slice(1)], 'map', 0), ...extra];
export const [HX, HY] = onMap([265, 111]);
export const [AX, AY] = onMap([48, 112]);
