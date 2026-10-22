// Short 1 · "One more video" (loops: the last frame is the first one)
import { GS, N, PX, Z0, zero, pix, prop, popIn, yellow, sfx } from '../../src/kit.mjs';

const NIGHT = '#2B2F4A';
const held = (o = {}) => ({ type: 'phone', s: 0.24, r: 90, ...o });
const bedroom = (o = {}) => [
  prop('bed', { x: 560, y: 1400 }, { id: 'bed', z: 1 }),
  prop('glow', { x: 330, y: 1150, rr: 230, op: 0.3 }, { id: 'glow', z: 0 }),
  prop('clock', { x: 540, y: 520, txt: o.clock ?? '02:43', s: 1.1 }, { id: 'clock', z: 2 }),
  zero({ x: 700, y: 1205, r: -90, s: 2.6, pose: 'phone', hr: [176, 60], face: 1, blink: false, holdR: held({ feed: 0 }), ...o.z }),
  prop('blanket', { x: 760, y: 1345, s: 1 }, { id: 'blanket', z: 7 }),
];

export default {
  id: '001-phone-s1', format: 'short', captions: true, music: 'curious-2', musicGain: 0.09,
  title: 'ZERO at 2 AM: "one more video"',
  description: 'Every next video is a tiny "maybe". ZERO is trying to understand humans.\n\n#shorts #psychology #animation',
  tags: ['shorts', 'psychology', 'phone', 'sleep', 'animation'],
  beats: [
    { bg: NIGHT, pre: 0.6, lines: [PX('ZERO. Go to sleep.'), Z0('One more video.')],
      actors: [...bedroom(), pix([{ x: 820, y: 760, s: 2.2, face: 7 }])], sfx: [sfx('swipe', 0.2)] },
    { min: 2.6, bg: '#FFF6DA',
      actors: [prop('clock', [{ x: 540, y: 520, txt: '07:00', ring: true, s: 1.1, r: -4 }, { t: 0.1, r: 4 }, { t: 0.2, r: -4 }, { t: 0.3, r: 4 }, { t: 0.4, r: 0 }]),
        zero([{ x: 540, y: GS, s: 3, pose: 'sad', face: 11 }, { t: 1.4, face: 1 }])],
      cam: [{ shake: 6 }, { t: 0.6, shake: 0 }],
      sfx: [sfx('buzz', 0), sfx('buzz', 0.45)] },
    { lines: [N("If you've ever done this, your brain may be playing a trick on you."), N('Every next video is a tiny "maybe": maybe this one\'s the good one.'), N('And at 2 AM, the part of your brain that says "stop" is the most tired part of all.')],
      actors: [prop('logo', { x: 540, y: 900, s: 8, eyes: false, sw: 4 }, { z: 0 }),
        prop('worker', [{ x: 380, y: 1200, s: 1.1, pose: 'neutral' }], { z: 2 }),
        prop('worker', [{ x: 620, y: 1200, s: 1.1, pose: 'sad', face: 11, lean: 0 }, { l: 2, t: 1.5, lean: 18 }], { z: 2 }),
        prop('sign', [{ x: 720, y: 1120, s: 1, tilt: 0 }, { l: 2, t: 1.5, tilt: 35 }], { z: 3 }),
        popIn('zzz', { l: 2, t: 1.8 }, { x: 690, y: 860, size: 64 }),
        yellow('MAYBE?', 540, 420, { l: 1, t: 0.5 }, { size: 120 })],
      sfx: [sfx('roll', 0.5, { l: 1 }), sfx('thud', 1.5, { l: 2, g: 0.4 })] },
    { bg: NIGHT, lines: [PX('You learned nothing.')],
      actors: [...bedroom({ z: { face: 0, holdR: null, pose: 'neutral' } }), pix([{ x: 820, y: 760, s: 2.2, face: 1 }])] },
    { bg: NIGHT, min: 1.3, actors: [...bedroom({ z: { face: 1 } })], sfx: [sfx('swipe', 0.4)] },
  ],
};
