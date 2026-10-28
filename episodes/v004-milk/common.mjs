// Shared pieces of video 004 "Why Is the Milk Always at the Back of the Store?": the supermarket floor, the carton we
// follow, ZERO's basket. Props live in src/world-store.js; the fibre/capsule rides of video 002 aren't used here: this
// system is physical (a truck, a dock, a cold room, a wall of glass doors), so ZERO walks it.
import { G, prop, zero } from '../../src/kit.mjs';
export { P, vig, ui, hand } from '../v002-card/common.mjs';
import { P, ui } from '../v002-card/common.mjs';

// the shop floor: tile, a wall of shelving, warm ceiling light; signs: [[x, aisle no | null, text, colour]]
export const shop = (o = {}) => [
  P('interior', { x: 0, y: G, wall: '#DCE6D3', floor: '#C9CDD3', vx: o.vx ?? 960 }, 'int', -22),
  P('storewall', { x: o.wx ?? 960, y: G - 120, w: o.w ?? 3200, seed: o.seed ?? 1 }, 'swall', -20),
  P('pool', { x: o.px ?? 960, y: 120, rx: 1200, ry: 320, kind: 'warm', op: 0.22 }, 'lit', -18),
  ...(o.signs || []).map(([x, no, txt, col], i) => P('aislesign', { x, y: 150, no, txt, color: col, cord: 320 }, 'sg' + i, -12)),
];
// the carton we follow, small in a corner when a beat is about numbers (screen space)
export const oc = (x = 150, y = 250, s = 0.7, id = 'carton') => P('carton', { x, y, s, shadow: false, ui: true }, id, 40);
// ZERO watching from the corner of the frame (overlay, so the camera can move behind him)
export const zc = (k = [], o = {}) => ui(zero([{ x: o.x ?? 1700, y: 1010, s: o.s ?? 1.7, face: 0, look: [-8, -4], flip: true }, ...k], { z: 48 }));

// ZERO carrying the basket while he walks: the walk cycle's arms swing, so the right hand is pinned on the handle and the
// basket follows his hand (keys built from the same steps). Returns { z: keys for zero, b: keys for the basket prop }
import { walk } from '../../src/kit.mjs';
export const walkHold = (x0, x1, t0, dur, o = {}) => {
  const ks = walk(x0, x1, t0, dur, o), d = o.flip ? -1 : 1;
  return { z: ks.map(k => ({ ...k, hr: [150, 120] })), b: ks.map(k => ({ t: k.t, x: k.x + d * 130, y: k.y - 190, e: k.e })) };
};

// dimmed backdrops for beats about numbers: each is a different "look" (the story test counts how long one look lasts),
// the dim layer keeps the figures readable. Order matters: the first big prop of a beat names its look.
const dimmer = op => P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#0B1226', op }, 'dim', -19);
export const bdStore = (op = 0.66, seed = 5) => [P('storewall', { x: 960, y: G - 120, w: 3200, seed }, 'bgw', -20), P('interior', { x: 0, y: G, wall: '#DCE6D3', floor: '#C9CDD3', vx: 960 }, 'bgi', -22), dimmer(op)];
export const bdCold = (op = 0.62) => [P('coldroom', { x: 960, y: 540, w: 2100, h: 1180, rackX: 1000, racks: 3 }, 'bgc', -20), dimmer(op)];
