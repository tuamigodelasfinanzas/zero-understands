// Video 004, part 2: the first explanation, the truck. Behind the dairy wall is a cold room; milk has a legal
// temperature (7°C), loses shelf life fast when it warms up, and arrives in a refrigerated truck at the dock, which
// is at the back of the store. Truck, dock, cold room, dairy case: the cold chain. Put the milk at the front and every
// carton crosses the whole store.
import { G, N, zero, pix, sfx, cam, lookCam, shrug } from '../../src/kit.mjs';
import { P, vig, ui, shop, oc, zc, bdStore, bdCold } from './common.mjs';

const NAVY = '#0B1226';
const dark = () => [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#12172E' }, 'bg', -20)];
const src = (id, txt, y = 1010, at = { t: 0 }, size = 24) => P('text', [{ x: 960, y, txt, size, color: '#8FA6C8', o: 0, ui: true }, { ...at, o: 1, e: 'step' }], id, 46);
const cold = (o = {}) => P('coldroom', { x: 960, y: 540, w: 2100, h: 1180, rackX: o.rackX ?? 1000, racks: 3, temp: o.temp ?? 3 }, 'cold', -20);

export default {
  id: 'v004-part2',
  format: 'long',
  title: 'Why Is the Milk Always at the Back of the Store? (part 2)',
  description: 'Part 2 of video 004.',
  tags: ['how it works', 'supermarkets', 'milk'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // ===== d1: the room behind the wall. Cold on purpose =====
    {
      lines: [N('Behind every dairy wall, there is a room like this.', { at: 0.3 }), N('Cold on purpose.', { gap: 0.4 }), N('Three degrees.', { gap: 0.3 })], min: 10, hold: 0.8, bg: '#9CC3D8',
      cam: cam({ z: 1.08, x: 900, y: 560 }, { end: 0, z: 1.0, x: 960, y: 540, e: 'lin' }),
      actors: [cold(), P('pool', { x: 560, y: 640, rx: 520, ry: 420, kind: 'pix', op: 0.4 }, 'pixlight', 1),
        P('carton', { x: 600, y: 940, s: 1.3, glow: 0.7, frost: 0.35 }, 'carton', 6),
        P('text', [{ x: 1500, y: 380, txt: '3°C', size: 200, color: '#58E08A', o: 0, ui: true, stroke: 7 }, { l: 2, t: 0.1, o: 1, e: 'step' }], 'big3', 46),
        zero([{ x: 330, y: 975, face: 3, pose: 'neutral', look: [8, -4], hr: [150, 120], hl: [92, 140] }, { l: 1, face: 2, look: [10, -2] }, { l: 2, face: 3, headR: 6 }], { z: 5 }),
        pix([{ x: 900, y: 300, s: 1.1, face: 1 }, { l: 2, face: 2 }]), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.3, bed: true }), sfx('ping', 0.1, { l: 2, g: 0.3 })],
    },
    // ===== d2: the rule. Cooled to seven degrees or less, and kept there =====
    {
      lines: [N('For milk, cold is not a preference.', { at: 0.3 }), N('The rule says: cooled to seven degrees Celsius or less, and kept there.', { gap: 0.4 }), N('So what happens when it isn’t?', { gap: 0.6 })], min: 12.5, hold: 0.9, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdStore(0.7),
        P('thermo', [{ x: 960, y: 480, v: 3, lit: 0, w: 1300 }, { l: 1, t: 0.2, lit: 1, e: 'out' }], 'th', 4),
        P('text', [{ x: 960, y: 760, txt: '“Cooled to 7°C (45°F) or less and maintained thereat.”', size: 42, color: '#E6ECF5', o: 0, ui: true }, { l: 1, t: 0.4, o: 1, e: 'step' }], 'q', 46),
        src('s1', 'FACT · Grade “A” pasteurized milk, state dairy rules built on the Pasteurized Milk Ordinance (here: Maine, 01-001 CMR ch. 329, §V)', 920, { l: 1, t: 0.6 }, 22),
        zc([{ l: 1, face: 0 }, { l: 2, face: 4, headR: 8 }]), oc(), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('swipe', 0.3, { l: 1, g: 0.35 }), sfx('ping', 0.5, { l: 1, g: 0.3 })],
    },
    // ===== d3: how fast it goes wrong: about three hours at room temperature = one day of shelf life =====
    {
      lines: [N('One small experiment measured it.', { at: 0.3 }), N('About three hours at room temperature,', { gap: 0.3 }), N('and a carton loses a whole day of shelf life.', { gap: 0.2 }), N('So how does a store keep it cold, all the way from the factory?', { gap: 0.7 })], min: 14, hold: 0.9, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdCold(0.66),
        P('thermo', [{ x: 960, y: 360, v: 3, w: 1300 }, { l: 1, t: 0, v: 3 }, { l: 1, t: 2.6, v: 25, e: 'io' }], 'th', 4),
        P('carton', [{ x: 560, y: 840, s: 1.5, glow: 0.5, frost: 0.4 }, { l: 1, t: 0.2, frost: 0, e: 'io' }], 'carton', 6),
        P('text', [{ x: 1160, y: 640, txt: '3.2 h at 25°C', size: 78, color: '#FFD98A', o: 0, ui: true, stroke: 5 }, { l: 1, t: 0.3, o: 1, e: 'step' }], 'h', 46),
        P('text', [{ x: 1220, y: 760, txt: '= –1 DAY OF SHELF LIFE', size: 78, color: '#FF8A7A', o: 0, ui: true, stroke: 5 }, { l: 2, t: 0.1, o: 1, e: 'step' }], 'd', 46),
        src('s1', 'ESTIMATE · Xu & Sun, Journal of Emerging Investigators, 2022: one small experiment (n=1). Real cartons vary.', 920, { l: 1, t: 0.6 }, 22),
        zc([{ l: 0, face: 0 }, { l: 2, face: 3 }, { l: 3, face: 4, headR: 8 }]), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('tick', 0.3, { l: 1, g: 0.3, dur: 3.2 }), sfx('dun', 0.15, { l: 2, g: 0.5 })],
    },
    // ===== d4: five in the morning: a refrigerated truck backs up to the dock, at the back of the store =====
    {
      lines: [N('It arrives in a refrigerated truck.', { at: 0.6 }), N('The truck backs up to a dock.', { gap: 0.4 }), N('And the dock is at the back of the store.', { gap: 0.5 })], min: 14, hold: 0.9, bg: '#8FA0B8',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.1, x: 1100, y: 600, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#8FA0B8' }, 'sky', -22), P('rect', { x: 960, y: 940, w: 3000, h: 400, fill: '#6B7689' }, 'yard', -21),
        P('rect', { x: 1500, y: 450, w: 1500, h: 900, fill: '#B9A99A' }, 'wall', -20),
        P('dock', [{ x: 1560, y: G, s: 1, open: 0 }, { l: 1, t: 1.2, open: 0 }, { l: 1, t: 2.2, open: 1, e: 'io' }], 'dk', -10),
        P('reefer', [{ x: -300, y: G + 20, s: 0.95, flip: true, open: 1, roll: 1 }, { t: 0.4, x: -300, roll: 1 }, { t: 4.6, x: 880, roll: 1, e: 'out' }, { t: 5.0, x: 880, roll: 0 }], 'truck', 0),
        P('carton', [{ x: 1400, y: 700, s: 0.55, glow: 0.9, shadow: false, o: 0 }, { t: 4.7, o: 0 }, { t: 4.9, o: 1, e: 'step' }], 'carton', 8),
        P('text', [{ x: 960, y: 110, txt: 'THIS MORNING · 5:10 AM', size: 54, color: '#F4F7FB', o: 0, ui: true, stroke: 4 }, { t: 0.2, o: 1, e: 'step' }], 'time', 46),
        zero([{ x: 1720, y: G, face: 0, pose: 'neutral', look: [-8, -2], flip: true }, { l: 1, face: 3 }, { l: 2, face: 4, headR: 8 }], { z: 5 }),
        pix([{ x: 1700, y: 260, s: 1.0, face: 2 }, { l: 2, face: 1 }]), vig(0.45)],
      sfx: [sfx('engine', 0.2, { g: 0.4, dur: 4.4 }), sfx('clunk', 4.8, { g: 0.5 }), sfx('hum', 4.9, { g: 0.2, bed: true }), sfx('door', 1.6, { l: 1, g: 0.4 })],
    },
    // ===== d5: truck, dock, cold room, dairy case: the cold chain; a Wegmans manager's words =====
    {
      lines: [N('Truck. Dock. Cold room. Dairy case.', { at: 0.3 }), N('A Wegmans manager told NPR why that matters:', { gap: 0.5 }), N('“We don’t have to worry about ever breaking the cold chain.”', { gap: 0.4 })], min: 15, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 960, y: 540, e: 'lin' }),
      actors: [...bdStore(0.82),
        P('reefer', { x: 330, y: 630, s: 0.3, flip: true, open: 1 }, 'm1', 3), P('dock', { x: 720, y: 650, s: 0.38, open: 1 }, 'm2', 3),
        P('coldroom', { x: 1170, y: 480, s: 0.34, w: 1500, h: 820, rackX: 700, racks: 2, temp: 3 }, 'm3', 3), P('dairycase', { x: 1640, y: 650, s: 0.36, w: 1500 }, 'm4', 3),
        P('rect', [{ x: 330, y: 790, w: 20, h: 8, fill: '#58E08A', rx: 4 }, { l: 0, t: 0.8, x: 995, w: 1310, e: 'io' }, { l: 0, t: 3.4, x: 995, w: 1310 }], 'line', 2),
        ...[['TRUCK', 330], ['DOCK', 720], ['COLD ROOM', 1170], ['DAIRY CASE', 1640]].map(([t, x], i) => P('text', [{ x, y: 840, txt: t, size: 30, color: '#C7D3EA', o: 0, ui: true }, { l: 0, t: 0.8 + i * 0.7, o: 1, e: 'step' }], 'lb' + i, 46)),
        ...[330, 720, 1170, 1640].map((x, i) => P('text', [{ x, y: 900, txt: '≤ 7°C', size: 34, color: '#58E08A', o: 0, ui: true }, { l: 0, t: 0.8 + i * 0.7, o: 1, e: 'step' }], 'tm' + i, 46)),
        P('carton', [{ x: 330, y: 770, s: 0.65, glow: 0.8, shadow: false }, { l: 0, t: 0.8, x: 330 }, { l: 0, t: 1.4, x: 720, e: 'io' }, { l: 0, t: 2.1, x: 1170, e: 'io' }, { l: 0, t: 2.8, x: 1640, y: 760, e: 'io' }], 'carton', 8),
        P('text', [{ x: 960, y: 220, txt: '“We don’t have to worry about ever breaking the cold chain.”', size: 48, color: '#E6ECF5', o: 0, ui: true }, { l: 2, t: 0.2, o: 1, e: 'step' }], 'qq', 46),
        P('text', [{ x: 960, y: 290, txt: 'Kevin Lang, Wegmans store manager · NPR Planet Money, Episode 555, 2016', size: 26, color: '#8FA6C8', o: 0, ui: true }, { l: 2, t: 0.5, o: 1, e: 'step' }], 'qa', 46),
        zc([{ l: 0, face: 2 }, { l: 2, face: 0 }], { x: 200 }), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('roll', 0.8, { g: 0.25, dur: 2.2 }), sfx('ping', 3.0, { g: 0.3 })],
    },
    // ===== d6: what if the milk were at the front: every carton crosses the store; ten minutes out of the cold ≈ an hour =====
    {
      lines: [N('Now put the milk at the front door.', { at: 0.3 }), N('Every carton would cross the whole store, past the warm shelves.', { gap: 0.4 }), N('Ten minutes out of the cold costs about an hour of shelf life.', { gap: 0.4 }), N('So is it just plumbing?', { gap: 0.7 })], min: 17, hold: 0.9, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 960, y: 540, e: 'lin' }),
      actors: [...dark(),
        P('storemap', [{ x: 600, y: 560, s: 0.7, labels: 1, paths: [{ pts: [[1365, 105], [1100, 112], [620, 104]], prog: 1, color: '#58E08A', w: 10 }, { pts: [[1365, 120], [1365, 520], [900, 780], [185, 830], [110, 880]], prog: 0, color: '#FF6B5B', w: 10 }] },
          { l: 1, t: 0.2, paths: [{ pts: [[1365, 105], [1100, 112], [620, 104]], prog: 1, color: '#58E08A', w: 10 }, { pts: [[1365, 120], [1365, 520], [900, 780], [185, 830], [110, 880]], prog: 0, color: '#FF6B5B', w: 10 }] },
          { l: 1, t: 3.2, paths: [{ pts: [[1365, 105], [1100, 112], [620, 104]], prog: 1, color: '#58E08A', w: 10 }, { pts: [[1365, 120], [1365, 520], [900, 780], [185, 830], [110, 880]], prog: 1, color: '#FF6B5B', w: 10 }], e: 'io' }], 'map', -20),
        P('thermo', [{ x: 1520, y: 330, v: 3, w: 560, ticks: false, lit: 1 }, { l: 2, t: 0, v: 3 }, { l: 2, t: 3.5, v: 22, e: 'io' }], 'th', 4),
        P('text', [{ x: 1520, y: 520, txt: '10 MIN AT ROOM TEMP', size: 42, color: '#FFD98A', o: 0, ui: true, stroke: 4 }, { l: 2, t: 0.1, o: 1, e: 'step' }], 'a', 46),
        P('text', [{ x: 1500, y: 600, txt: '≈ –1 HOUR OF SHELF LIFE', size: 46, color: '#FF8A7A', o: 0, ui: true, stroke: 4 }, { l: 2, t: 0.5, o: 1, e: 'step' }], 'b', 46),
        src('s1', 'ESTIMATE · our arithmetic on the same experiment (3.2 h at 25°C = 1 day): 10 min ≈ 1 h 15 min. Real stores vary.', 1000, { l: 2, t: 0.8 }, 22),
        zc([{ l: 0, face: 0 }, { l: 1, face: 3 }, { l: 3, face: 4, headR: 8 }]), oc(), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('swipe', 0.4, { l: 1, g: 0.4 }), sfx('buzz', 0.5, { l: 2, g: 0.3 }), sfx('ping', 0.3, { l: 3, g: 0.3 })],
    },
  ],
};
