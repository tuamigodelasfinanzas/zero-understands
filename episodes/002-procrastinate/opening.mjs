// Test: the first ~40 s of "Why You Always Procrastinate" rebuilt with the visual direction rules
// (docs/direccion-visual.md): story sets with depth, the world reacting to ZERO, micro-stories, gestures,
// purposeful camera, one WOW moment for the question, integrated transitions.
import { G, ZS, N, PX, Z0, zero, pix, prop, popIn, yellow, red, sfx, walk, lookCam, tilt, shrug, openArms, stepBack, leanIn, PALETTE as C } from '../../src/kit.mjs';
import { room, desk, minimal, space } from '../../src/sets.mjs';

const broom = { type: 'broom', s: 0.38 };
const sweep = (n, t0 = 0, dt = 0.5) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hr: [118, 106], lean: -4, e: 'io' }, { t: t0 + i * dt + dt / 2, hr: [146, 110], lean: 4, e: 'io' }]).flat();
const typing = (n, t0 = 0, dt = 0.18) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hl: [100, 136], hr: [126, 142], e: 'in' }, { t: t0 + i * dt + dt / 2, hl: [100, 142], hr: [126, 136] }]).flat();

export default {
  id: 'procrastinate-open', format: 'long', music: 'curious', musicGain: 0.11,
  title: 'Procrastination opening (visual direction test)',
  beats: [
    // HOOK (L2 room, already happening): ZERO is working... until the deadline note falls off the wall behind him
    {
      pre: 0.4, min: 7.6,
      lines: [Z0('Okay. Focus.', { at: 6.4 })],
      cam: [{ z: 1.18, x: 1000, y: 600 }, { t: 1.6, z: 1.18, x: 1000, y: 600 }, { t: 3.0, z: 1.05, x: 900, y: 560, e: 'io' }, { t: 5.2, z: 1.3, x: 960, y: 560, e: 'io' }],
      actors: [...room(), ...desk({ x: 1000 }),
        // the note peels off, flutters and lands on the floor: the world interrupts him
        prop('sticky', [{ x: 1500, y: 470, s: 0.9, txt: 'ESSAY|DUE|TOMORROW', tilt: -5 }, { t: 1.3, tilt: -16, e: 'io' }, { t: 1.6, x: 1490, y: 520, tilt: 30, e: 'in' },
          { t: 2.1, x: 1440, y: 700, tilt: -40, e: 'io' }, { t: 2.6, x: 1400, y: G - 22, tilt: 82, e: 'in' }, { t: 4.2, x: 1400, y: G - 22, s: 0.9 }, { t: 4.5, o: 0, e: 'step' }], { id: 'note', z: 7 }),
        zero([{ x: 860, pose: 'type', face: 0, look: [6, 1] }, ...typing(7, 0.1),
          { t: 2.6, look: [9, 3], headR: 6, face: 3, e: 'out' },                         // a sound behind him: eyes first, then head
          { t: 3.0, pose: 'neutral', hl: null, hr: null, face: 4 },
          ...walk(860, 1300, 3.1, 0.9),                                                     // goes to see
          ...leanIn(4.0, 1300, { dx: 20, look: [8, 6] }),
          { t: 4.5, pose: 'present', hr: [150, 120], holdR: { type: 'sticky', s: 0.22, txt: 'ESSAY|DUE|TOMORROW' }, look: [9, -2], face: 9, e: 'io' },  // reads it
          ...lookCam(5.2, { face: 1 }),                                                     // ...and looks at us
        ])],
      sfx: [sfx('type', 0.1), sfx('whoosh', 1.6, { g: 0.3 }), sfx('thud', 2.6, { g: 0.35 }), sfx('dun', 4.6, { g: 0.5 })],
      tout: { type: 'wipe', dur: 0.55 },
    },
    // TIME PASSES, SHOWN NOT SAID: the clock on the wall races, light moves, ZERO sweeps
    {
      min: 5.2, tin: { type: 'wipe', dur: 0.55 },
      lines: [PX('The essay?', { at: 3.2 })],
      cam: [{ z: 1, x: 960, y: 540 }, { u: 1, z: 1.08, x: 900, y: 560 }],
      actors: [...room({ plantKeys: [{ t: 1.4, sway: 0 }, { t: 1.7, sway: -9, e: 'out' }, { t: 2.2, sway: 5, e: 'io' }, { t: 2.7, sway: -2, e: 'io' }, { t: 3.2, sway: 0, e: 'io' }] }), ...desk({ x: 1000, messy: false }),
        prop('clock', [{ x: 1180, y: 190, s: 0.7, txt: '16:00' }, { t: 0.4, txt: '17:00', e: 'step' }, { t: 0.8, txt: '18:00', e: 'step' }, { t: 1.2, txt: '19:30', e: 'step' }, { t: 1.6, txt: '21:00', e: 'step' }], { id: 'clock', z: -5 }),
        zero([{ x: 520, pose: 'neutral', hr: [118, 106], holdR: broom, face: 2, look: [-4, 4] }, ...sweep(3, 0),
          ...walk(520, 1440, 1.5, 0.9).map(k => ({ ...k, hr: [118, 106] })),               // sweeps his way past the plant (it sways as he passes)
          { t: 2.6, face: 2, look: [6, 4] }, { t: 3.0, look: [-9, -4], face: 0 },
          ...lookCam(3.9, { face: 1, tilt: -6 })]),                                        // PIX asks; ZERO just looks at us
        pix([{ x: 760, y: 280, s: 0, face: 5 }, { t: 2.9, s: 2.0, e: 'pop' }])],
      sfx: [sfx('swipe', 0.2, { g: 0.4 }), sfx('tick', 0.4), sfx('tick', 0.8), sfx('tick', 1.2), sfx('tick', 1.6), sfx('swipe', 1.8, { g: 0.4 }), sfx('pix-ting', 3.0, { g: 0.4 })],
    },
    // NIGHT: same room, lamp on, panic
    {
      min: 3.4,
      cam: [{ z: 1.05, x: 960, y: 560 }, { u: 1, z: 1.35, x: 960, y: 600, e: 'in' }, { shake: 0 }, { t: 1.2, shake: 3 }],
      actors: [...room({ night: true }), ...desk({ x: 1000 }),
        prop('clock', [{ x: 1180, y: 190, s: 0.7, txt: '23:04', ring: true }], { id: 'clock', z: -5 }),
        prop('sticky', { x: 1500, y: 470, s: 0.9, txt: 'ESSAY|DUE|IN 1 HOUR', tilt: -5, fill: C.coral }, { id: 'note', z: -4 }),
        zero([{ x: 860, pose: 'type', face: 9, look: [6, 1] }, ...typing(16, 0, 0.16)])],
      sfx: Array.from({ length: 6 }, (_, i) => sfx('type', i * 0.5)),
      tout: { type: 'fall', dur: 0.7 },
    },
    // WOW (L3) for the question: the room falls away, ZERO floats in a purple universe of unanswered questions
    {
      tin: { type: 'fall', dur: 0.7 },
      lines: [N('Why do you always leave things for later...', { at: 1.0 }), N("even when you know it's going to hurt?", { gap: 0.1 })],
      cam: [{ z: 1, x: 960, y: 540 }, { u: 1, z: 1.15, x: 960, y: 520 }],
      actors: [...space(),
        zero([{ x: 960, y: 760, s: 2.4, r: -8, pose: 'scared', face: 3, look: [0, -4] }, { t: 1.0, r: 6, pose: 'shrug', face: 4, e: 'io' }, { u: 0.7, r: -4, y: 740, e: 'io' }, { u: 1, r: 3, y: 760, face: 7, e: 'io' }], { z: 5 }),
        ...[[620, 330, 0.5], [1320, 420, 1.2], [1500, 760, 2.0], [420, 700, 2.6]].map(([x, y, t], i) => popIn('qmark', t, { x, y, size: 90 + i * 20 }, { keys: [{ u: 1, y: y - 40, e: 'lin' }] }))],
      sfx: [sfx('fall', 0.1, { g: 0.5 }), sfx('pop', 0.5), sfx('pop', 1.2), sfx('pop', 2.0), sfx('pop', 2.6)],
    },
    // PROMISE (L1, simple frame): the two wrong answers crossed out, then ZERO opens his arms: "let me show you"
    {
      tin: { type: 'iris', x: 960, y: 560, dur: 0.5 },
      lines: [N("Spoiler: it's not because you're lazy."), N("And it's not bad time management either."), N("It's something much stranger. And once you see it, you can actually beat it.")],
      cam: [{ z: 1, x: 960, y: 540 }, { l: 2, t: 0, z: 1 }, { end: 1.0, z: 1.12, x: 960, y: 500 }],
      actors: [...minimal(),
        zero([{ x: 960, face: 5, pose: 'think' }, ...tilt({ l: 0, t: 1.0 }, { deg: 10, face: 4, hold: 1.2 }), ...shrug({ l: 1, t: 0.6 }, { from: 'think', to: 'neutral' }), ...openArms({ l: 2, t: 0.6 })]),
        red('LAZY?', 480, 300, { l: 0, t: 1.0 }, { size: 110 }),
        prop('rect', [{ x: 480, y: 300, w: 0, h: 14, fill: C.ink }, { l: 0, t: 1.8, w: 0 }, { l: 0, t: 2.1, w: 380 }], { z: 10 }),
        red('BAD AT TIME?', 1440, 300, { l: 1, t: 0.4 }, { size: 96 }),
        prop('rect', [{ x: 1440, y: 300, w: 0, h: 14, fill: C.ink }, { l: 1, t: 1.4, w: 0 }, { l: 1, t: 1.7, w: 620 }], { z: 10 }),
        popIn('bulb', { l: 2, t: 1.2 }, { x: 1180, y: 420, s: 0.9, on: 1 }, { z: 9 })],
      sfx: [sfx('error', 1.8, { l: 0, g: 0.5 }), sfx('error', 1.4, { l: 1, g: 0.5 }), sfx('idea', 1.2, { l: 2, g: 0.6 })],
      tout: { type: 'zoom', x: 960, y: 640, z: 10, dur: 0.6, color: '#FFFFFF' },
    },
    { min: 1.2, tin: { type: 'zoom', x: 960, y: 540, z: 6, dur: 0.6, color: '#FFFFFF' },
      actors: [prop('logo', { x: 960, y: 610, s: 8.4, eyes: false }, { z: 0 })] },
  ],
};
