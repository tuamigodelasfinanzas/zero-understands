// Shared pieces of video 001's parts: the yellow box's size, prop shorthand, the vignette, the route on the US map,
// SYSTEM VIEW switch-on and the screen-space helper.
import { prop } from '../../src/kit.mjs';

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
