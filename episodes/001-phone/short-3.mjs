// Short 3 · ZERO's brain when he gets a notification (loops on the siren)
import { GS, N, PX, zero, pix, prop, popIn, sfx, lookCam } from '../../src/kit.mjs';
import { roomS, deskS } from '../../src/sets.mjs';

const PHONE = { x: 690, y: GS - 214 };
const typing = (n, t0 = 0, dt = 0.18) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hl: [100, 136], hr: [126, 142], e: 'in' }, { t: t0 + i * dt + dt / 2, hl: [100, 142], hr: [126, 136] }]).flat();

const brain = () => [prop('logo', { x: 540, y: 900, s: 8, eyes: false, sw: 4 }, { id: 'brain', z: 0 })];
const worker = (id, x, keys) => prop('worker', [{ x, y: 1215, s: 1, pose: 'type', face: 0 }, ...keys], { id, z: 3 });
const desks = () => [330, 540, 750].map((x, i) => prop('desk', { x, y: 1145, w: 150, legs: 50, s: 1 }, { id: 'dk' + i, z: 4 }));

export default {
  id: '001-phone-s3', format: 'short', captions: true, music: 'tense', musicGain: 0.08,
  title: "ZERO's brain when he gets a notification",
  description: 'Dopamine fires before the reward, not after. ZERO is trying to understand humans.\n\n#shorts #psychology #dopamine #brain',
  tags: ['shorts', 'brain', 'dopamine', 'notification', 'animation'],
  beats: [
    // HOOK (L2): ZERO is working. The phone lights up. He freezes... and we dive into his head.
    { pre: 0.2, min: 2.4,
      cam: [{ z: 1.25, x: 560, y: 1150 }, { t: 0.6, z: 1.25, x: 560, y: 1150 }, { t: 1.8, z: 1.5, x: 470, y: 1060, e: 'io' }],
      actors: [...roomS(), ...deskS({ x: 800 }),
        prop('phone', [{ ...PHONE, s: 0.4, dot: 0 }, { t: 0.5, dot: 1, buzz: 1, e: 'pop' }, { t: 0.8, buzz: 0 }], { z: 7 }),
        zero([{ x: 470, y: GS, s: 3, pose: 'type', face: 0, look: [6, 2] }, ...typing(3, 0),
          { t: 0.55, look: [9, 2], face: 3, hl: [100, 136], hr: [126, 136], e: 'out' }, { t: 0.8, headR: 6, e: 'out' }])],
      sfx: [sfx('type', 0), sfx('ping', 0.5)],
      tout: { type: 'zoom', x: 470, y: 1060, z: 9, dur: 0.5, color: '#FFFFFF' } },
    // inside his head (L3): the alarm goes off before he even knows what it is
    { min: 5.2, bg: '#E4EBF3', tin: { type: 'zoom', x: 540, y: 900, z: 6, dur: 0.45, color: '#FFFFFF' },
      actors: [...brain(), ...desks(),
        prop('siren', [{ x: 540, y: 470, on: 0, s: 1.4 }, ...Array.from({ length: 8 }, (_, i) => [{ t: 0.15 + i * 0.3, on: 1, e: 'step' }, { t: 0.3 + i * 0.3, on: 0, e: 'step' }]).flat()]),
        prop('drop', [{ x: 1300, y: 860, s: 0.9, shout: 0 }, { t: 1.0, x: 360, e: 'out' }, { t: 1.4, shout: 1, e: 'pop' }]),
        ...[330, 540, 750].map((x, i) => worker('w' + i, x, [{ t: 0.3, face: 3, pose: 'scared' }, { t: 2.2 + i * 0.15, x }, { t: 3.6 + i * 0.15, x: 1400, pose: 'run' }]))],
      cam: [{ z: 1.2, x: 540, y: 920, shake: 0 }, { t: 0.15, shake: 5 }, { t: 2, shake: 0 }],
      sfx: [sfx('tension', 0.15), sfx('pop', 1.0), sfx('boing', 1.4), sfx('whoosh', 2.3)],
      tout: { type: 'iris', x: 540, y: 1100, dur: 0.4 } },
    // the reward: socks, 20% off. ZERO looks at us.
    { min: 3.4, tin: { type: 'iris', x: 470, y: 1100, dur: 0.4 },
      cam: [{ z: 1.25, x: 560, y: 1150 }],
      actors: [...roomS(), ...deskS({ x: 800 }),
        zero([{ x: 470, y: GS, s: 3, pose: 'phone', face: 3, holdR: { type: 'phone', s: 0.24 }, look: [4, 2] }, { t: 1.0, face: 4 }, ...lookCam(1.6, { face: 4, tilt: -8 })]),
        prop('phone', [{ x: 640, y: 1150, s: 0.3, screen: 'Socks|20% OFF', fs: 26, screenY: -16 }, { t: 0.3, x: 760, y: 900, s: 1.6, e: 'back' }], { z: 9 })],
      sfx: [sfx('whoosh', 0), sfx('dun', 1.0)],
      tout: { type: 'zoom', x: 470, y: 1060, z: 9, dur: 0.45, color: '#FFFFFF' } },
    { bg: '#E4EBF3', tin: { type: 'zoom', x: 540, y: 900, z: 6, dur: 0.45, color: '#FFFFFF' },
      cam: [{ z: 1.15, x: 540, y: 960 }, { l: 1, t: 0, z: 1.15 }, { l: 1, t: 1.5, z: 1.35, x: 540, y: 1080, e: 'io' }],
      lines: [N("Dopamine doesn't fire when you get the reward."), N('It fires when your brain thinks a reward might be coming.')],
      actors: [...brain(), ...desks(),
        ...[330, 540, 750].map((x, i) => worker('w' + i, 1300, [{ t: 0, pose: 'walk', face: 7 }, { l: 1, t: 1.5 + i * 0.6, x, pose: 'type', e: 'lin' }])),
        prop('drop', { x: 380, y: 760, s: 0.8, mega: false })] },
    { lines: [PX('Again?')], min: 2.2, bg: '#E4EBF3', cam: [{ z: 1.35, x: 540, y: 1080 }],
      actors: [...brain(), ...desks(), ...[330, 540, 750].map((x, i) => worker('w' + i, x, [{ face: i === 2 ? 7 : 0 }])),
        pix({ x: 780, y: 760, s: 1.9, face: 1 })] },
  ],
};
