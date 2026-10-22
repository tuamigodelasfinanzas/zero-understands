// Stylized environments by level (docs/direccion-visual.md §4-5, §10): every set has a coloured background, a few
// relevant objects, contact shadows and a little ambient motion, laid out in depth so the camera gets parallax.
// They return actor lists to spread into a beat: actors: [...room(), zero(...), ...].
import { G, prop, PALETTE as C } from './kit.mjs';

// Level 1: plain stylized background + a hint of space (floor, soft vignette shapes)
export const minimal = (o = {}) => [
  prop('room', { x: 960, y: o.y ?? G, wall: o.wall ?? C.bluegray, floor: o.floor ?? '#D9E2EC', trim: o.trim ?? '#EEF3F8' }, { id: 'set', z: -10, depth: 0.85 }),
  ...(o.extras || []),
];

// Level 2: ZERO's room. Window with drifting clouds and a light beam, shelf, picture, lamp, rug, plant.
export const room = (o = {}) => {
  const night = o.night;
  return [
    prop('room', { x: 960, y: G, wall: night ? '#3A3F62' : C.cream, floor: night ? '#2C304B' : '#EADCC6', trim: night ? '#444A70' : '#F7EBD8' }, { id: 'set', z: -10, depth: 0.8 }),
    prop('window', [{ x: o.winX ?? 420, y: 360, w: 300, h: 250, drift: 0, sky: night ? '#1B2140' : C.sky, sun: !night, seed: 1 }, { u: 1, drift: 0.12, e: 'lin' }], { id: 'win', z: -9, depth: 0.8 }),
    ...(night ? [] : [prop('beam', [{ x: (o.winX ?? 420) + 40, y: 500, w: 300, len: G - 500, skew: 200, ph: 0 }, { u: 1, ph: 0.35, e: 'lin' }], { id: 'beam', z: -8, depth: 0.85 })]),
    prop('shelf', { x: o.shelfX ?? 1500, y: 300, seed: 2, obj: 'globe' }, { id: 'shelf', z: -9, depth: 0.8 }),
    prop('picture', { x: o.picX ?? 1180, y: 330, tilt: 3 }, { id: 'pic', z: -9, depth: 0.8 }),
    prop('rug', { x: 960, y: G + 40, w: 420, fill: night ? '#3F4570' : '#F2D7B0' }, { id: 'rug', z: -7, depth: 1 }),
    prop('lamp', { x: o.lampX ?? 1760, y: G - 330, s: 1, on: night ? 1 : 0.15 }, { id: 'lamp', z: -6, depth: 0.95 }),
    ...(o.plant === false ? [] : [prop('plant', [{ x: o.plantX ?? 1620, y: G - 90, s: 0.9, sway: 0 }, ...(o.plantKeys || [{ u: 0.5, sway: 3, e: 'io' }, { u: 1, sway: -2, e: 'io' }])], { id: 'plant', z: -2 })]),
  ];
};

// Level 2: the desk corner inside the room (desk, laptop, pen cup, contact shadows)
export const desk = (o = {}) => [
  prop('shadow', { x: o.x ?? 1000, y: G + 4, w: 300, op: 0.12 }, { id: 'dsh', z: 4 }),
  prop('desk', { x: o.x ?? 1000, y: G - 172 }, { id: 'desk', z: 6 }),
  prop('laptop', { x: (o.x ?? 1000) + 150, y: G - 172, s: 0.75, fx: 1 }, { id: 'laptop', z: 6 }),
  prop('pencup', { x: (o.x ?? 1000) + 240, y: G - 172, s: 0.7, messy: o.messy ?? true }, { id: 'pens', z: 6 }),
];

// Level 3: the room falls away and ZERO is floating in a deep purple universe of questions
export const space = (o = {}) => [
  prop('rect', { x: 960, y: 540, w: 4000, h: 3000, fill: C.deep }, { id: 'sky', z: -12, depth: 0.2 }),
  prop('stars', [{ x: 960, y: 540, tw: 0, n: 90 }, { u: 1, tw: 1, e: 'lin' }], { id: 'stars', z: -11, depth: 0.3 }),
  prop('planet', [{ x: o.planetX ?? 1600, y: 260, s: 0.9, r: 0 }, { u: 1, r: 8, e: 'lin' }], { id: 'planet', z: -10, depth: 0.5 }),
  prop('planet', [{ x: 260, y: 860, s: 0.45, fill: '#2F80ED', ring: '#FF6B5B' }], { id: 'planet2', z: -10, depth: 0.6 }),
];
