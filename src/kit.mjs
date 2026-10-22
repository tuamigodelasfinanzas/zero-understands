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
export const zero = (k, o = {}) => ({ id: o.id || 'z', type: 'zero', z: o.z ?? 5, depth: o.depth, k: withBase(k, { x: 960, y: G, s: ZS, pose: 'neutral', face: 0 }) });
export const pix = (k, o = {}) => ({ id: o.id || 'p', type: 'pix', z: o.z ?? 8, k: withBase(k, { x: 1520, y: 300, s: 2.2, face: 0 }) });
export const prop = (type, k, o = {}) => ({ id: o.id, type, z: o.z ?? 3, depth: o.depth, k: Array.isArray(k) ? k : [k] });
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

// walk cycle: keys that move ZERO from x0 to x1 between t0 and t0+dur with real steps (feet, arm swing, bob).
// Use inside zero([...]) after his starting key, e.g. zero([{ x: 300 }, ...walk(300, 900, 1.0, 2.2)]).
// Moving left? pass flip: true in the starting key; the cycle is drawn in ZERO's own (mirrored) space.
export function walk(x0, x1, t0, dur, o = {}) {
  const step = o.step ?? 0.3, n = Math.max(2, Math.round(dur / step)), dt = dur / n, s = o.s ?? ZS;
  const bob = (o.bob ?? 3.5) * s;
  const ks = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + i * dt, x = x0 + (x1 - x0) * (i / n), a = i % 2 ? 1 : -1, last = i === n;
    // contact pose (feet apart, arms swinging opposite to the legs)
    ks.push(last
      ? { t, x, y: o.y ?? G, fl: [90, 204], fr: [110, 204], hl: [81, 168], hr: [119, 168], e: 'out' }
      : { t, x, y: o.y ?? G, fl: [100 - 13 * a, 204], fr: [100 + 13 * a, 204], hl: [84 + 10 * a, 167], hr: [116 - 10 * a, 167], e: 'io' });
    // passing pose half a step later: body up, back foot lifted
    if (!last) ks.push({ t: t + dt / 2, x: x + (x1 - x0) / n / 2, y: (o.y ?? G) - bob, fl: a > 0 ? [100, 204] : [102, 194], fr: a > 0 ? [98, 194] : [100, 204], hl: [84, 168], hr: [116, 168], e: 'io' });
  }
  return ks;
}

// ---------- palette (docs/direccion-visual.md §11) ----------
export const PALETTE = {
  ink: '#111111', yellow: '#FFC93C', amber: '#E0A100', blue: '#2F80ED', purple: '#7B5CD6', coral: '#FF6B5B', red: '#E63946',
  green: '#2E9E5B', cream: '#FFF4E3', bluegray: '#E4EBF3', deep: '#241C3A', night: '#2B2F4A', sky: '#CFE6FF',
};

// ---------- ZERO's gestures (§3) ----------
// Each returns keys for zero([...]). `at` is a time: seconds, or a key time like { l: 1, t: 0.4 }.
const at_ = (at, d = 0) => (typeof at === 'number' ? { t: at + d } : { ...at, t: (at.t ?? 0) + d });
// slowly looks at the viewer (after something absurd), holds, then returns to `back` (optional state)
export const lookCam = (at, o = {}) => [{ ...at_(at), headR: 0 }, { ...at_(at, 0.35), look: [0, 1], headR: o.tilt ?? 0, face: o.face ?? 1, e: 'io' }, ...(o.back ? [{ ...at_(at, 0.35 + (o.hold ?? 1.0)), ...o.back }] : [])];
// head tilt when something doesn't make sense
export const tilt = (at, o = {}) => [{ ...at_(at), headR: 0 }, { ...at_(at, 0.4), headR: o.deg ?? 12, face: o.face ?? 4, e: 'out' }, ...(o.hold ? [{ ...at_(at, 0.4 + o.hold), headR: 0, e: 'io' }] : [])];
export const shrug = (at, o = {}) => [{ ...at_(at), pose: o.from ?? 'neutral' }, { ...at_(at, 0.25), pose: 'shrug', headR: -6, face: o.face ?? 1, e: 'out' }, { ...at_(at, 0.25 + (o.hold ?? 0.7)), pose: 'shrug' }, { ...at_(at, 0.55 + (o.hold ?? 0.7)), pose: o.to ?? 'neutral', headR: 0 }];
export const crossArms = (at, o = {}) => [{ ...at_(at), pose: 'crossed', face: o.face ?? 1, headR: o.deg ?? -5 }];
export const openArms = (at, o = {}) => [{ ...at_(at), pose: 'open', face: o.face ?? 2, headR: 0 }];
// steps back from something surprising (x = where he stands now)
export const stepBack = (at, x, o = {}) => [{ ...at_(at), x }, { ...at_(at, 0.3), x: x + (o.dx ?? -70), pose: 'back', face: o.face ?? 3, e: 'out' }, { ...at_(at, 0.9), pose: o.to ?? 'neutral' }];
// leans in to look at something curious
export const leanIn = (at, x, o = {}) => [{ ...at_(at), x }, { ...at_(at, 0.6), x: x + (o.dx ?? 40), pose: 'leanin', face: o.face ?? 0, look: o.look ?? [8, 4], e: 'io' }];
