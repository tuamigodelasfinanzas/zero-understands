// Short 1 · "One more video" (loops: the last frame is the first one)
import { GS, N, PX, Z0, zero, pix, prop, popIn, yellow, sfx, lookCam } from '../../src/kit.mjs';
import { roomS } from '../../src/sets.mjs';

const NIGHT = '#2B2F4A';
const held = (o = {}) => ({ type: 'phone', s: 0.24, r: 90, ...o });
// L2 bedroom (docs/direccion-visual.md): night = dark blue walls, the phone is the only light; day = sun beam on the bed
const bedroom = (o = {}) => [
  ...roomS({ night: !o.day, lamp: false, plant: false, shelfX: 2400, winX: 230 }),
  prop('clock', [{ x: 700, y: 560, txt: o.clock ?? '02:43', s: 0.9, ring: !!o.ring, r: 0 }, ...(o.clockKeys || [])], { id: 'clock', z: 2 }),
  prop('bed', { x: 560, y: 1400 }, { id: 'bed', z: 1 }),
  ...(o.day ? [] : [prop('glow', [{ x: 330, y: 1150, rr: 230, op: 0.3 }, { u: 0.5, op: 0.4, e: 'io' }, { u: 1, op: 0.3, e: 'io' }], { id: 'glow', z: 0 })]),
  zero([{ x: 700, y: 1205, r: -90, s: 2.6, pose: 'phone', hr: [176, 60], face: 1, blink: false, holdR: held({ feed: 0 }), ...o.z }, ...(o.zk || [])]),
  prop('blanket', { x: 760, y: 1345, s: 1 }, { id: 'blanket', z: 7 }),
];

export default {
  id: '001-phone-s1', format: 'short', captions: true, music: 'curious-2', musicGain: 0.09,
  title: 'ZERO at 2 AM: "one more video"',
  description: 'Every next video is a tiny "maybe". ZERO is trying to understand humans.\n\n#shorts #psychology #animation',
  tags: ['shorts', 'psychology', 'phone', 'sleep', 'animation'],
  beats: [
    { bg: NIGHT, pre: 0.6, lines: [PX('ZERO. Go to sleep.'), Z0('One more video.')],
      cam: [{ z: 1.2, x: 490, y: 1200 }, { u: 1, z: 1.4, x: 590, y: 1220, e: 'io' }],
      actors: [...bedroom({ zk: [{ l: 1, t: 0, look: [4, -6], face: 1 }, { l: 1, t: 0.25, look: [-2, 4] }] }), pix([{ x: 820, y: 860, s: 0, face: 7 }, { t: 0.3, s: 2.0, e: 'pop' }, { u: 1, y: 880, e: 'io' }])],
      sfx: [sfx('pix-ting', 0.3, { g: 0.4 }), sfx('swipe', 0.2, { l: 1 })], tout: { type: 'wipe', dur: 0.45 } },
    // 07:00, same room in daylight: the alarm rings, he is still holding the phone
    { min: 2.8, tin: { type: 'wipe', dur: 0.45 },
      actors: [...bedroom({ day: true, clock: '07:00', ring: true, clockKeys: [{ t: 0.1, r: -6 }, { t: 0.2, r: 6 }, { t: 0.3, r: -6 }, { t: 0.4, r: 6 }, { t: 0.5, r: 0 }],
        z: { face: 11 }, zk: [{ t: 0.15, squash: 0.9, e: 'out' }, { t: 0.35, squash: 1 }, { t: 1.4, face: 1 }] })],
      cam: [{ z: 1.2, x: 490, y: 1200, shake: 6 }, { t: 0.6, shake: 0 }, { t: 2.6, z: 1.5, x: 480, y: 1200, e: 'io' }],
      sfx: [sfx('buzz', 0), sfx('buzz', 0.45)],
      tout: { type: 'zoom', x: 340, y: 1170, z: 8, dur: 0.5, color: '#FFFFFF' } },
    // inside his head (L3): the "stop" worker is the most tired one
    { tin: { type: 'zoom', x: 540, y: 900, z: 6, dur: 0.5, color: '#FFFFFF' }, bg: '#E4EBF3',
      lines: [N("If you've ever done this, your brain may be playing a trick on you."), N('Every next video is a tiny "maybe": maybe this one\'s the good one.'), N('And at 2 AM, the part of your brain that says "stop" is the most tired part of all.')],
      cam: [{ z: 1, x: 540, y: 960 }, { t: 1.8, z: 1, x: 540, y: 960 }, { t: 3.0, z: 1.45, x: 540, y: 1000, e: 'io' }],
      actors: [prop('logo', { x: 540, y: 900, s: 8, eyes: false, sw: 4 }, { z: 0 }),
        // the screen in his head never stops offering the next one
        prop('tv', [{ x: 540, y: 830, s: 1.15, on: 1, txt: 'NEXT ▶', size: 54, screen: '#2F80ED' }, { t: 0.9, txt: '5', e: 'step' }, { t: 1.5, txt: '4', e: 'step' }, { t: 2.1, txt: '3', e: 'step' }, { t: 2.7, txt: '2', e: 'step' }, { t: 3.3, txt: '1', e: 'step' }, { t: 3.9, txt: 'NEXT ▶', e: 'step' },
          { l: 1, t: 0.4, txt: '?', size: 110, screen: '#7B5CD6', e: 'step' }, { l: 2, t: 0, txt: '02:43', size: 70, screen: '#241C3A', e: 'step' }], { z: 1 }),
        prop('worker', [{ x: 380, y: 1200, s: 1.1, pose: 'neutral' }], { z: 2 }),
        prop('worker', [{ x: 620, y: 1200, s: 1.1, pose: 'sad', face: 11, lean: 0 }, { l: 2, t: 1.5, lean: 18 }], { z: 2 }),
        prop('sign', [{ x: 720, y: 1120, s: 1, tilt: 0 }, { l: 2, t: 1.5, tilt: 35 }], { z: 3 }),
        popIn('zzz', { l: 2, t: 1.8 }, { x: 690, y: 1010, size: 54 }),
        yellow('MAYBE?', 540, 600, { l: 1, t: 0.5 }, { size: 110, keys: [{ l: 2, t: 0, o: 1 }, { l: 2, t: 0.3, o: 0 }] })],
      sfx: [sfx('roll', 0.5, { l: 1 }), sfx('thud', 1.5, { l: 2, g: 0.4 })], tout: { type: 'iris', x: 640, y: 1150, dur: 0.45 } },
    { bg: NIGHT, tin: { type: 'iris', x: 540, y: 1150, dur: 0.45 }, lines: [PX('You learned nothing.')], cam: [{ z: 1.2, x: 490, y: 1200 }],
      actors: [...bedroom({ z: { face: 0, holdR: null, pose: 'neutral' } }), pix([{ x: 820, y: 860, s: 2.0, face: 1 }])] },
    { bg: NIGHT, min: 1.3, cam: [{ z: 1.2, x: 490, y: 1200 }], actors: [...bedroom({ z: { face: 1 } })], sfx: [sfx('swipe', 0.4)] },
  ],
};
