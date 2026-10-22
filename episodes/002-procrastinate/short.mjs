// Short · Why does cleaning suddenly feel fun? (related to the long video on procrastination; loops on the sweeping)
import { GS, N, PX, zero, pix, prop, popIn, yellow, blue, sfx, lookCam, tilt } from '../../src/kit.mjs';
import { roomS, minimalS } from '../../src/sets.mjs';

const broom = { type: 'broom', s: 0.38 };
const sweep = (n, t0 = 0, dt = 0.5) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hr: [118, 106], lean: -4, e: 'io' }, { t: t0 + i * dt + dt / 2, hr: [146, 110], lean: 4, e: 'io' }]).flat();
const room = (o = {}) => [
  ...roomS({ lamp: false, plantX: 120, ...(o.night ? { night: true } : {}) }),
  prop('shadow', { x: 760, y: GS + 4, w: 230, op: 0.12 }, { id: 'dsh', z: 4 }),
  prop('desk', { x: 760, y: GS - 172, w: 420 }, { id: 'desk', z: 6 }),
  prop('laptop', { x: 850, y: GS - 172, s: 0.7, fx: 1 }, { id: 'laptop', z: 6 }),
  prop('sticky', [{ x: 380, y: 800, s: 0.9, txt: 'ESSAY|DUE|TOMORROW', tilt: -5 }, ...(o.sticky || [])], { id: 'note', z: 2 }),
  prop('pencup', { x: 945, y: GS - 172, s: 0.7, messy: o.messy ?? false }, { id: 'pens', z: 6 }),
];
// the room is small: frame it closer so it fills the vertical screen
const CAM = [{ z: 1.45, x: 650, y: 1180 }];
const FADE = [{ l: 2, t: 0, o: 1 }, { l: 2, t: 0.3, o: 0 }];
const sweeping = (k = []) => zero([{ x: 440, y: GS, s: 2.8, pose: 'neutral', hr: [118, 106], holdR: broom, face: 2, look: [-4, 4] }, ...sweep(14), ...k]);

export default {
  id: '002-procrastinate-s', format: 'short', captions: true, music: 'curious-2', musicGain: 0.09,
  title: 'Why does cleaning suddenly feel fun?',
  description: "Funny how your room gets clean the night before a deadline. ZERO is trying to understand humans.\n\n#shorts #procrastination #psychology #animation",
  tags: ['shorts', 'procrastination', 'psychology', 'productivity', 'animation'],
  beats: [
    { pre: 0.3, lines: [N('Why does cleaning suddenly feel fun when you have something important to do?')],
      actors: [...room(), sweeping(),
        prop('cloud', [{ x: 800, y: 1100, s: 0.45, mood: 0 }, { u: 0.5, y: 1080 }, { u: 1, y: 1100 }], { z: 7 })],
      cam: CAM,
      sfx: [sfx('swipe', 0.3, { g: 0.4 }), sfx('swipe', 1.3, { g: 0.4 }), sfx('swipe', 2.3, { g: 0.4 })] },
    { lines: [N("Because your brain isn't avoiding work. It's avoiding a feeling."), N('The essay feels heavy. Boring. Scary. No idea where to start.'), N('Cleaning feels like progress, without the bad part.')],
      actors: [...room({ messy: true }), sweeping([{ l: 1, t: 0, face: 9, look: [8, -2] }, { l: 2, t: 0, face: 2, look: [-4, 4] }]),
        prop('cloud', [{ x: 800, y: 1100, s: 0.45, mood: 0 }, { l: 1, t: 0.2, s: 0.8, y: 1000, e: 'back' }, { l: 2, t: 0.6, s: 0.5, y: 1090 }], { z: 7 }),
        popIn('bubble', { l: 1, t: 0.9 }, { x: 480, y: 610, txt: 'BORING', size: 44, w: 260 }, { z: 9, keys: FADE }),
        popIn('bubble', { l: 1, t: 1.5 }, { x: 800, y: 700, txt: 'SCARY', size: 44, w: 240, tail: 'r' }, { z: 9, keys: FADE }),
        popIn('bubble', { l: 1, t: 2.2 }, { x: 620, y: 830, txt: 'WHERE DO I START?', size: 36, w: 440 }, { z: 9, keys: FADE }),
        popIn('text', { l: 2, t: 1.2 }, { x: 620, y: 700, txt: 'PROGRESS!', size: 70, color: '#2E9E5B', stroke: 4 }, { z: 9 })],
      cam: CAM,
      sfx: [sfx('tension', 0.2, { l: 1 }), sfx('pop', 0.9, { l: 1 }), sfx('pop', 1.5, { l: 1 }), sfx('pop', 2.2, { l: 1 }), sfx('cheer', 1.2, { l: 2, g: 0.4 })],
      tout: { type: 'wipe', dur: 0.5 } },
    { lines: [N('Psychologists call it productive procrastination.'), N('Clean room. Same unfinished essay.')],
      tin: { type: 'wipe', dur: 0.5 }, tout: { type: 'wipe', dur: 0.5 },
      actors: [...minimalS({ wall: '#FBE3DF', floor: '#F3D2CC', trim: '#FDEFEC' }),
        yellow('PRODUCTIVE', 540, 330, { l: 0, t: 0.8 }, { size: 110 }),
        yellow('PROCRASTINATION', 540, 470, { l: 0, t: 1.2 }, { size: 96 }),
        prop('paper', [{ x: 540, y: 960, s: 0, title: 'ESSAY', lines: 0 }, { l: 1, t: 0.6, s: 1.4, e: 'back' }], { z: 4 }),
        zero([{ x: 820, y: GS, s: 2.4, pose: 'proud', face: 2, holdR: null }, { l: 1, t: 1.6, face: 1, look: [-8, -4] }, ...lookCam({ l: 1, t: 2.6 }, { face: 4, tilt: -8 })])],
      sfx: [sfx('pop', 0.8, { l: 0 }), sfx('pop', 0.6, { l: 1 }), sfx('dun', 1.6, { l: 1, g: 0.5 })] },
    { tin: { type: 'wipe', dur: 0.5 }, lines: [N('The trick: make the first step so small it feels silly.'), N('Not "write the essay." Just "open the document."')],
      actors: [...room({ sticky: [{ l: 1, t: 0, txt: 'WRITE|THE|ESSAY' }, { l: 1, t: 1.8, txt: 'OPEN|THE|FILE', fill: '#DDEBFF', e: 'step' }] }),
        zero([{ x: 560, y: GS, s: 2.6, pose: 'type', face: 0, look: [6, 2] }, { l: 1, t: 1.8, face: 2 }]),
        prop('cloud', [{ x: 800, y: 1100, s: 0.45, mood: 1 }, { l: 1, t: 1.8, s: 0.45 }, { l: 1, t: 2.4, s: 0, e: 'in' }], { z: 7 })],
      cam: CAM,
      sfx: [sfx('type', 0.3), sfx('click', 1.8, { l: 1 }), sfx('idea', 1.9, { l: 1, g: 0.5 })] },
    { lines: [PX('The essay, ZERO?', { at: 1.2 })], min: 3.2,
      actors: [...room(), sweeping(), prop('cloud', { x: 800, y: 1100, s: 0.45, mood: 0 }, { z: 7 }),
        pix([{ x: 720, y: 760, s: 1.4, face: 5 }])],
      cam: CAM,
      sfx: [sfx('swipe', 0.3, { g: 0.4 }), sfx('pix-ting', 1.1, { g: 0.4 }), sfx('swipe', 1.3, { g: 0.4 }), sfx('swipe', 2.3, { g: 0.4 })] },
  ],
};
