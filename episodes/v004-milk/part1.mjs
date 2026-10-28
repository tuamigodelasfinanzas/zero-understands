// Video 004 "Why Is the Milk Always at the Back of the Store?": part 1, the ZeroOpen. ZERO needs one thing from the
// supermarket (milk) and walks to the far end of the store to get it. Who decided it goes all the way back there?
// PIX opens the dairy wall onto the cold room behind it; ZERO goes in with the carton he is holding.
import { G, N, zero, pix, sfx, cam, lookCam, tilt, walk } from '../../src/kit.mjs';
import { brandBeat } from '../../src/zeroopen.mjs';
import { P, vig, ui, hand, shop, oc, walkHold } from './common.mjs';

const BASKET = (x, y, items = [], k = []) => P('basket', [{ x, y, s: 0.95, items }, ...k], 'bsk', 7);

export default {
  id: 'v004-part1',
  format: 'long',
  title: 'Why Is the Milk Always at the Back of the Store? (part 1)',
  description: 'Part 1 of video 004.',
  tags: ['how it works', 'supermarkets', 'milk'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // EVENT. ZERO at the door with an empty basket and a shopping list that says one word
    {
      zo: 'event', lines: [N('ZERO needs one thing from the supermarket.', { at: 0.4 }), N('Milk.', { gap: 0.3 })], min: 4.6, hold: 0.2, bg: '#DCE6D3',
      cam: cam({ z: 1.08, x: 900, y: 560 }, { end: 0, z: 1.2, x: 880, y: 580, e: 'lin' }),
      actors: [...shop({ signs: [[1500, null, 'WELCOME', '#2E9E5B']] }),
        BASKET(690, 748, []),
        P('notif', [{ x: 960, y: 130, s: 1.0, w: 760, txt: 'Shopping list: milk', size: 44, icon: '#2E9E5B', o: 0, ui: true }, { t: 0.9, o: 1, e: 'step' }], 'list', 46),
        zero([{ x: 560, face: 0, pose: 'neutral', hr: [150, 120], hl: [92, 140], look: [6, 0] }, { t: 2.4, face: 2, look: [8, -4] }, { t: 3.6, face: 0, look: [10, -2] }], { z: 5 }), vig(0.4)],
      sfx: [sfx('doorbell', 0.2, { g: 0.5 }), sfx('chatter', 0, { g: 0.12, bed: true }), sfx('pop', 0.9, { g: 0.3 })],
    },
    // ANOMALY (no narration). A very long walk: aisle after aisle, to the far back wall. ZERO arrives and takes a carton
    {
      zo: 'anomaly', lines: [], min: 9.2, bg: '#DCE6D3',
      cam: cam({ z: 1.2, x: 900, y: 580 }, { t: 1.0, z: 1.15, x: 1050, y: 570, e: 'io' }, { t: 6.0, z: 1.15, x: 2900, y: 570, e: 'io' }, { t: 8.0, z: 1.28, x: 3080, y: 600, e: 'io' }, { end: 0, z: 1.3, x: 3100, y: 600, e: 'lin' }),
      actors: [...shop({ w: 5000, wx: 2300, seed: 2, signs: [[800, 1, 'CEREAL', '#3F78D0'], [1400, 2, 'SNACKS', '#D9573F'], [2000, 3, 'DRINKS', '#4E8F5A'], [2600, 4, 'FROZEN', '#6D5CAE'], [3200, null, 'DAIRY', '#2A57A3']] }),
        P('dairycase', { x: 3500, y: G, w: 1500, gap: 3, gapRow: 1 }, 'dcase', -6),
        BASKET(690, 748, [], [...walkHold(560, 3020, 0.6, 5.4).b, { t: 7.8, x: 3150, y: 745 }]),
        P('carton', [{ x: 3166, y: 600, s: 0.62, o: 0, shadow: false }, { t: 6.5, o: 0 }, { t: 6.6, o: 1, e: 'step' }, { t: 7.4, x: 3197, y: 700, s: 0.8, e: 'io' }, { t: 8.2, x: 3150, y: 800, s: 0.85, e: 'io' }], 'carton', 8),
        zero([{ x: 560, face: 0, pose: 'neutral', hr: [150, 120], hl: [92, 140], look: [6, 0] }, ...walkHold(560, 3020, 0.6, 5.4).z, { t: 3.2, face: 4 }, { t: 4.8, face: 3, headR: 6 }, { t: 6.1, face: 3, pose: 'neutral', hr: [150, 120], hl: [92, 140], headR: 0 },
          { t: 6.4, hr: [168, 96], face: 2, e: 'io' }, { t: 7.2, hr: [168, 96] }, { t: 8.0, hr: [150, 120], face: 0, look: [10, 2] }, ...lookCam({ t: 8.3 }, { face: 3 })], { z: 5 }), vig(0.4)],
      sfx: [sfx('chatter', 0, { g: 0.12, bed: true }), sfx('roll', 0.6, { g: 0.2, dur: 5.4 }), sfx('hum', 6.1, { g: 0.3 }), sfx('pop', 6.7, { g: 0.4 })],
    },
    // QUESTION. A floor plan in the corner: the dairy wall is the farthest point from the entrance
    {
      zo: 'question', lines: [N('The milk is the farthest thing from the door.', { at: 0.3 }), N('Who decided that?', { gap: 0.5 })], min: 6.5, hold: 0.7, bg: '#DCE6D3',
      cam: cam({ z: 1.3, x: 3120, y: 600 }, { end: 0, z: 1.18, x: 3020, y: 580, e: 'lin' }),
      actors: [...shop({ w: 5000, wx: 2300, seed: 2, signs: [[2600, 4, 'FROZEN', '#6D5CAE'], [3200, null, 'DAIRY', '#2A57A3']] }),
        P('dairycase', { x: 3500, y: G, w: 1500, gap: 3, gapRow: 1 }, 'dcase', -6),
        ui(P('storemap', [{ x: 1440, y: 380, s: 0.62, labels: 1, pin: [560, 70], paths: [{ pts: [[110, 880], [185, 830], [185, 120], [560, 70]], prog: 0, color: '#FFC93C', w: 12 }] }, { t: 0.4, paths: [{ pts: [[110, 880], [185, 830], [185, 120], [560, 70]], prog: 0, color: '#FFC93C', w: 12 }] }, { t: 3.0, paths: [{ pts: [[110, 880], [185, 830], [185, 120], [560, 70]], prog: 1, color: '#FFC93C', w: 12 }], e: 'io' }], 'map', 44)),
        BASKET(3150, 745, [], []),
        P('carton', { x: 3150, y: 800, s: 0.85, shadow: false, glow: 0.45 }, 'carton', 8),
        zero([{ x: 3020, face: 3, pose: 'neutral', hr: [150, 120], hl: [92, 140], look: [10, 2] }, { l: 1, face: 4, headR: 10 }, ...lookCam({ l: 1, t: 1.0 }, { face: 1, tilt: 8 })], { z: 5 }), vig(0.4)],
      sfx: [sfx('roomtone', 0, { g: 0.2, bed: true }), sfx('swipe', 0.4, { g: 0.4 }), sfx('tick', 1.0, { l: 0, g: 0.3, dur: 2.4 })],
    },
    // PIX REVEALS. PIX scans the carton's date tag; the glass wall behind it turns to X-ray: a cold room full of racks
    {
      zo: 'reveal', lines: [], min: 5.4, bg: '#DCE6D3',
      cam: cam({ z: 1.2, x: 3070, y: 600 }, { end: 0, z: 1.05, x: 3320, y: 560, e: 'io' }),
      actors: [...shop({ w: 5000, wx: 2300, seed: 2, signs: [[2600, 4, 'FROZEN', '#6D5CAE'], [3200, null, 'DAIRY', '#2A57A3']] }),
        P('dairycase', { x: 3500, y: G, w: 1500, gap: 3, gapRow: 1 }, 'dcase', -6),
        P('coldroom', [{ x: 3500, y: 560, s: 0.62, w: 1500, h: 700, rackX: 380, racks: 3, frame: true, o: 0 }, { t: 2.6, o: 0 }, { t: 3.4, o: 1, e: 'out' }], 'cold', -4),
        BASKET(3150, 745, [], []),
        P('carton', { x: 3150, y: 800, s: 0.85, shadow: false, glow: 0.45 }, 'carton', 8),
        pix([{ x: 3120, y: 420, s: 0.2, o: 0, face: 0 }, { t: 0.4, o: 1, e: 'step' }, { t: 1.0, x: 3260, y: 480, s: 1.0, face: 2, e: 'back' }, { t: 2.4, face: 3 }, { t: 3.0, x: 3420, y: 400, face: 1, e: 'io' }, { t: 4.4, face: 2 }]),
        P('scanbeam', [{ x: 3260, y: 480, dx: -50, dy: 250, w: 120, o: 0 }, { t: 1.1, o: 1, e: 'step' }, { t: 2.3, o: 0, e: 'step' }], 'beam', 9),
        zero([{ x: 3020, face: 0, pose: 'neutral', hr: [150, 120], hl: [92, 140], look: [8, -4] }, { t: 0.5, face: 0, look: [8, -6] }, { t: 2.0, face: 2, look: [10, -4] }, { t: 3.6, face: 3, look: [12, -2] }], { z: 5 }), vig(0.4)],
      sfx: [sfx('pix-ting', 0.45, { g: 0.6 }), sfx('scan', 1.1, { g: 0.5 }), sfx('hum', 1.9, { g: 0.3 }), sfx('swipe', 3.0, { g: 0.5 })],
    },
    // ENTRY. ZERO holds the carton up to the X-ray window, which pulls them both in
    {
      zo: 'entry', lines: [], min: 3.6, bg: '#DCE6D3',
      cam: cam({ z: 1.05, x: 3320, y: 560 }, { t: 1.2, z: 1.5, x: 3360, y: 580, e: 'io' }, { t: 2.6, z: 3.2, x: 3500, y: 560, e: 'io' }),
      tout: { type: 'zoom', x: 3500, y: 560, dur: 0.7, color: '#050A18' },
      actors: [...shop({ w: 5000, wx: 2300, seed: 2, signs: [[2600, 4, 'FROZEN', '#6D5CAE'], [3200, null, 'DAIRY', '#2A57A3']] }),
        P('dairycase', { x: 3500, y: G, w: 1500, gap: 3, gapRow: 1 }, 'dcase', -6),
        P('coldroom', { x: 3500, y: 560, s: 0.62, w: 1500, h: 700, rackX: 380, racks: 3, frame: true }, 'cold', -4),
        P('carton', [{ x: 3150, y: 800, s: 0.85, shadow: false, glow: 0.45 }, { t: 0.3, x: 3280, y: 690, s: 0.85, e: 'back' }, { t: 1.4, x: 3360, y: 640, s: 0.85 }, { t: 2.3, x: 3500, y: 640, s: 0.4, e: 'in' }, { t: 2.7, s: 0.05, o: 0, e: 'in' }], 'carton', 8),
        pix([{ x: 3420, y: 400, s: 1.0, face: 2 }, { t: 0.4, face: 3 }, { t: 1.9, x: 3500, y: 600, s: 0.6, e: 'in' }, { t: 2.4, o: 0, e: 'step' }]),
        zero([{ x: 3020, face: 2, pose: 'neutral', hr: [150, 120], hl: [92, 140], look: [10, -4] }, { t: 0.4, face: 3 }, { t: 0.65, squash: 0.84, y: G + 6, pose: 'back', e: 'out' }, { t: 0.95, squash: 1.1, y: 640, x: 3220, pose: 'celebrate', e: 'out' }, { t: 1.45, squash: 1, y: 620, x: 3360, pose: 'reach', hr: [150, 40], s: 1.3, face: 2, e: 'in' },
          { t: 2.3, x: 3490, y: 640, s: 0.5, pose: 'celebrate', e: 'in' }, { t: 2.7, x: 3500, y: 640, s: 0.05, o: 0, e: 'in' }], { z: 8 }), vig(0.5)],
      sfx: [sfx('pop', 0.3, { g: 0.5 }), sfx('whoosh', 0.7, { g: 0.6 }), sfx('thud', 1.25, { g: 0.5 }), sfx('whoosh', 2.4, { g: 0.7 })],
    },
    brandBeat({ behind: [P('coldroom', { x: 960, y: 540, w: 2100, h: 1180, rackX: 700, racks: 3, temp: 3 }, 'cold', -20), P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#050A18', op: 0.55 }, 'dk', -19)] }),
    // THE PROMISE. Inside: the cold room, ZERO with the carton, and the two explanations as signs
    {
      zo: 'promise', lines: [N('Two explanations are fighting over this carton.', { at: 0.05 }), N('One has a villain.', { gap: 0.5 }), N('The other has a truck.', { gap: 0.5 })],
      min: 10, hold: 0.7, bg: '#9CC3D8',
      cam: cam({ z: 1.12, x: 960, y: 560, shake: 1.0 }, { end: 0, z: 1.0, x: 960, y: 540, e: 'io' }),
      actors: [P('coldroom', { x: 960, y: 540, w: 2100, h: 1180, rackX: 1000, racks: 3, temp: 3 }, 'cold', -20),
        P('pool', { x: 640, y: 640, rx: 520, ry: 420, kind: 'pix', op: 0.45 }, 'pixlight', 1),
        P('carton', { x: 640, y: 940, s: 1.5, glow: 0.8 }, 'carton', 6),
        zero([{ x: 380, y: 975, face: 2, pose: 'neutral', look: [8, -4], hr: [150, 120], hl: [92, 140] }, { l: 1, face: 3 }, { l: 2, face: 2 }], { z: 5 }),
        pix([{ x: 1000, y: 360, s: 1.2, face: 1 }, { l: 1, face: 3 }, { l: 2, face: 2 }]),
        P('text', [{ x: 1380, y: 250, txt: 'A · THE TRICK', size: 66, color: '#E63946', o: 0, ui: true, stroke: 5 }, { l: 1, t: 0.2, o: 1, e: 'step' }], 'ta', 46),
        P('text', [{ x: 1380, y: 400, txt: 'B · THE TRUCK', size: 66, color: '#2A57A3', o: 0, ui: true, stroke: 5 }, { l: 2, t: 0.2, o: 1, e: 'step' }], 'tb', 46),
        vig(0.7)],
      sfx: [sfx('hum', 0, { g: 0.3, bed: true }), sfx('ping', 0.2, { l: 1, g: 0.3 }), sfx('engine', 0.1, { l: 2, g: 0.25 })],
    },
  ],
};
