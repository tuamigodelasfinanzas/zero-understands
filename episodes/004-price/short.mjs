// Short · Why does $9.99 feel so much cheaper than $10? (pillar: money / adult life; loops on the two tags)
import { GS, N, PX, zero, pix, prop, popIn, yellow, blue, red, sfx, lookCam, tilt, shrug } from '../../src/kit.mjs';
import { storeS, streetS, minimalS } from '../../src/sets.mjs';

const tags = (o = {}) => [
  prop('tag', [{ x: 280, y: 760, s: 1.1, txt: '$10', tilt: -6 }, ...(o.l || [])], { id: 't1', z: 4 }),
  prop('tag', [{ x: 800, y: 760, s: 1.1, txt: '$9.99', size: 64, tilt: 6, fill: '#FFF6DA' }, ...(o.r || [])], { id: 't2', z: 4 }),
];

export default {
  id: '004-price', format: 'short', captions: true, music: 'curious', musicGain: 0.09,
  title: 'Why does $9.99 feel so much cheaper than $10?',
  description: "It's one cent. Your brain doesn't care. ZERO is trying to understand humans.\n\n#shorts #money #psychology #animation",
  tags: ['shorts', 'money', 'psychology', 'pricing', 'left digit effect', 'animation'],
  beats: [
    { pre: 0.4, lines: [N('Why does $9.99 feel so much cheaper than $10?')],
      tout: { type: 'zoom', x: 800, y: 760, z: 9, dur: 0.5, color: '#FFF6DA' },
      actors: [...storeS(), ...tags(),
        zero([{ x: 540, y: GS, s: 3, face: 4, look: [-9, -6], headR: -6 }, { t: 1.0, look: [9, -6], headR: 6, face: 2 }, { t: 1.8, look: [-9, -6], headR: -6, face: 1 }, { t: 2.6, look: [9, -6], headR: 6, face: 2 }])],
      sfx: [sfx('whoosh', 1.0, { g: 0.4 }), sfx('whoosh', 2.6, { g: 0.4 })] },
    { lines: [N("It's one cent. But your brain reads from left to right, and it's in a hurry."), N('It sees the 9 first... and files the price under "nine-something."')],
      tin: { type: 'zoom', x: 540, y: 820, z: 6, dur: 0.5, color: '#FFF6DA' }, tout: { type: 'wipe', dur: 0.5 },
      actors: [...minimalS({ wall: '#FFF6DA', floor: '#F1E3BD', trim: '#FFF9E8' }),
        prop('tag', [{ x: 540, y: 820, s: 0, txt: '$9.99', size: 64, fill: '#FFF6DA' }, { t: 0.2, s: 2.2, e: 'back' }]),
        prop('arrow', [{ x: 160, y: 520, len: 0, color: '#2F80ED' }, { l: 0, t: 2.2, len: 0 }, { l: 0, t: 3.4, len: 700, e: 'out' }], { z: 5 }),
        yellow('9...', 360, 1150, { l: 1, t: 0.6 }, { size: 150 }),
        blue('"NINE-SOMETHING"', 540, 1330, { l: 1, t: 1.6 }, { size: 74 })],
      sfx: [sfx('pop', 0.2), sfx('whoosh', 2.2, { l: 0 }), sfx('dato', 0.6, { l: 1, g: 0.6 })] },
    { lines: [N("It's called the left-digit effect, and it even works with used cars."), N('Cars with just under 80,000 miles sell for noticeably more than cars just over it.'), N('Same car. Different first digit.')],
      tin: { type: 'wipe', dur: 0.5 }, tout: { type: 'zoom', x: 540, y: 1100, z: 9, dur: 0.5, color: '#FFFFFF' },
      actors: [...streetS(),
        yellow('LEFT-DIGIT EFFECT', 540, 330, { l: 0, t: 0.8 }, { size: 86 }),
        prop('counter', [{ x: 270, y: 760, n: 79900, label: 'MILES', s: 0 }, { l: 1, t: 0.2, s: 1.15, e: 'back' }], { z: 4 }),
        prop('counter', [{ x: 810, y: 760, n: 80000, label: 'MILES', s: 0 }, { l: 1, t: 1.6, s: 1.15, e: 'back' }], { z: 4 }),
        popIn('text', { l: 1, t: 2.6 }, { x: 270, y: 1010, txt: '$$$', size: 110, color: '#2E9E5B', stroke: 4 }, { z: 9 }),
        popIn('text', { l: 1, t: 3.4 }, { x: 810, y: 1010, txt: '$$', size: 110, color: '#9A9A9A', stroke: 4 }, { z: 9 }),
        zero([{ x: 540, y: GS, s: 2.4, face: 0, look: [-8, -8] }, { l: 1, t: 1.6, look: [8, -8] }, { l: 2, t: 0, face: 4, look: [0, -4] }, ...shrug({ l: 2, t: 0.8 }, { face: 4 })])],
      sfx: [sfx('pop', 0.2, { l: 1 }), sfx('pop', 1.6, { l: 1 }), sfx('coin', 2.6, { l: 1 }), sfx('dun', 3.4, { l: 1 })] },
    { bg: '#E4EBF3', tin: { type: 'zoom', x: 540, y: 900, z: 6, dur: 0.5, color: '#FFFFFF' }, tout: { type: 'iris', x: 540, y: 1100, dur: 0.45 },
      cam: [{ z: 1.1, x: 540, y: 1000 }, { u: 1, z: 1.2, x: 540, y: 1050, e: 'io' }],
      lines: [N('One cent, and your brain sees a whole different number.')],
      actors: [prop('logo', { x: 540, y: 900, s: 8, eyes: false, sw: 4 }, { z: 0 }),
        prop('worker', [{ x: 360, y: 1260, s: 1.7, pose: 'present', face: 2 }], { z: 3 }),
        prop('tag', [{ x: 650, y: 980, s: 1, txt: '$9.99', size: 64, fill: '#FFF6DA' }, { u: 0.5, tilt: 8 }, { u: 1, tilt: -4 }], { z: 3 }),
        prop('gear', [{ x: 450, y: 760, s: 0.9, spin: 0 }, { u: 1, spin: 140, e: 'lin' }], { z: 1 }),
        prop('gear', [{ x: 640, y: 700, s: 0.6, spin: 10 }, { u: 1, spin: -160, e: 'lin' }], { z: 1 })] },
    { lines: [PX("It's one cent, ZERO.", { at: 1.4 })], min: 3.4,
      tin: { type: 'iris', x: 540, y: 1100, dur: 0.45 },
      actors: [...storeS(), ...tags(),
        zero([{ x: 540, y: GS, s: 3, face: 2, pose: 'celebrate', look: [9, -6] }, { t: 1.0, face: 2, pose: 'neutral' }, { end: 0.6, face: 4, look: [-9, -6], headR: -6 }]),
        pix([{ x: 820, y: 360, s: 2, face: 1 }])],
      sfx: [sfx('cheer', 0.1, { g: 0.4 }), sfx('pix-ting', 1.3, { g: 0.4 })] },
  ],
};
