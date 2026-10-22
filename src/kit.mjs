// Building blocks for writing episodes in a few lines. An episode file (episodes/<id>/*.mjs) exports
// default an object { id, format, title, description, tags, music, beats: [...] } built with these helpers.
// Times inside a beat: t = seconds, u = fraction of the beat, l = start of line l, end = seconds before the end.

export const G = 935;            // floor line in long videos (1920x1080)
export const GS = 1500;          // floor line in Shorts (1080x1920)
export const ZS = 2.6;           // ZERO's usual scale (572 px tall)

// lines
export const N = (text, o = {}) => ({ who: 'narr', text, ...o });
export const PX = (text, o = {}) => ({ who: 'pix', text, ...o });
export const Z0 = (text, o = {}) => ({ who: 'zero', text, ...o });

// actors
export const zero = (k, o = {}) => ({ id: o.id || 'z', type: 'zero', z: o.z ?? 5, k: withBase(k, { x: 960, y: G, s: ZS, pose: 'neutral', face: 0 }) });
export const pix = (k, o = {}) => ({ id: o.id || 'p', type: 'pix', z: o.z ?? 8, k: withBase(k, { x: 1520, y: 300, s: 2.2, face: 0 }) });
export const prop = (type, k, o = {}) => ({ id: o.id, type, z: o.z ?? 3, k: Array.isArray(k) ? k : [k] });
export const floor = (y = G) => prop('floor', { x: 0, y }, { id: 'floor', z: 0 });

function withBase(k, base) {
  const ks = Array.isArray(k) ? k : [k];
  ks[0] = Object.assign({}, base, ks[0]);
  return ks;
}

// something that pops in at time `at` (seconds, or a key time object like {l:1})
export function popIn(type, at, props, o = {}) {
  const tk = typeof at === 'object' ? at : { t: at };
  const plus = (k, d) => ({ ...k, t: (k.t ?? 0) + d });
  return prop(type, [
    { t: 0, ...props, o: 0, sc: 0 },
    { ...plus(tk, 0), o: 1, sc: 0.2, e: 'step' },
    { ...plus(tk, 0.32), sc: props.sc ?? 1, e: 'pop' },
    ...(o.out != null ? [{ end: o.out + 0.2, sc: props.sc ?? 1 }, { end: o.out, sc: 0, o: 0, e: 'in' }] : []),
    ...(o.keys || []),
  ], o);
}
export const text = (txt, x, y, at = 0.2, o = {}) => popIn('text', at, { x, y, txt, size: o.size ?? 84, color: o.color, stroke: o.stroke ?? (o.color && o.color !== '#111111' ? 3 : 0) }, { z: 9, ...o });
export const yellow = (txt, x, y, at, o = {}) => text(txt, x, y, at, { color: '#FFC93C', stroke: 5, ...o });
export const blue = (txt, x, y, at, o = {}) => text(txt, x, y, at, { color: '#2F80ED', stroke: 4, ...o });
export const red = (txt, x, y, at, o = {}) => text(txt, x, y, at, { color: '#E63946', stroke: 4, ...o });

// common sets
export const deskSet = (o = {}) => [
  floor(),
  prop('desk', { x: o.deskX ?? 1000, y: G - 172 }, { id: 'desk', z: 6 }),
  prop('laptop', { x: o.laptopX ?? 1150, y: G - 172, s: 0.75, fx: 1 }, { id: 'laptop', z: 6 }),
];
// brain view: ZERO's head as a giant frame, with gears and workers inside
export const brainSet = (o = {}) => [
  prop('logo', { x: 960, y: 610, s: 8.4, eyes: false }, { id: 'brain', z: 0 }),
  prop('gear', [{ x: 700, y: 520, s: 1.1, spin: 0 }, { u: 1, spin: 120, e: 'lin' }], { id: 'g1', z: 1 }),
  prop('gear', [{ x: 838, y: 420, s: 0.7, spin: 18 }, { u: 1, spin: -170, e: 'lin' }], { id: 'g2', z: 1 }),
  prop('gear', [{ x: 1240, y: 470, s: 0.8, spin: 0 }, { u: 1, spin: -150, e: 'lin' }], { id: 'g3', z: 1 }),
  ...(o.workers === false ? [] : [
    prop('worker', [{ x: 860, y: 900, s: 1.05, pose: 'walk', face: 0 }, { u: 1, x: 900 }], { id: 'w1', z: 2 }),
    prop('worker', [{ x: 1060, y: 900, s: 1.05, pose: 'neutral', face: 0 }], { id: 'w2', z: 2 }),
    prop('worker', [{ x: 1250, y: 900, s: 1.05, pose: 'think', face: 6 }], { id: 'w3', z: 2 }),
  ]),
];
export const sfx = (s, t = 0, o = {}) => ({ s, t, ...o });
export const cam = (...keys) => keys;
