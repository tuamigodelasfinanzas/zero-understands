// Short 3 · ZERO's brain when he gets a notification (loops on the siren)
import { GS, N, PX, zero, pix, prop, popIn, sfx } from '../../src/kit.mjs';

const brain = () => [prop('logo', { x: 540, y: 900, s: 8, eyes: false, sw: 4 }, { id: 'brain', z: 0 })];
const worker = (id, x, keys) => prop('worker', [{ x, y: 1215, s: 1, pose: 'type', face: 0 }, ...keys], { id, z: 3 });
const desks = () => [330, 540, 750].map((x, i) => prop('desk', { x, y: 1145, w: 150, legs: 50, s: 1 }, { id: 'dk' + i, z: 4 }));

export default {
  id: '001-phone-s3', format: 'short', captions: true, music: 'tense', musicGain: 0.08,
  title: "ZERO's brain when he gets a notification",
  description: 'Dopamine fires before the reward, not after. ZERO is trying to understand humans.\n\n#shorts #psychology #dopamine #brain',
  tags: ['shorts', 'brain', 'dopamine', 'notification', 'animation'],
  beats: [
    { min: 5.2,
      actors: [...brain(), ...desks(),
        prop('siren', [{ x: 540, y: 470, on: 0, s: 1.4 }, ...Array.from({ length: 8 }, (_, i) => [{ t: 0.15 + i * 0.3, on: 1, e: 'step' }, { t: 0.3 + i * 0.3, on: 0, e: 'step' }]).flat()]),
        prop('drop', [{ x: 1300, y: 860, s: 0.9, shout: 0 }, { t: 1.0, x: 360, e: 'out' }, { t: 1.4, shout: 1, e: 'pop' }]),
        ...[330, 540, 750].map((x, i) => worker('w' + i, x, [{ t: 0.3, face: 3, pose: 'scared' }, { t: 2.2 + i * 0.15, x }, { t: 3.6 + i * 0.15, x: 1400, pose: 'run' }]))],
      cam: [{ shake: 0 }, { t: 0.15, shake: 5 }, { t: 2, shake: 0 }],
      sfx: [sfx('ping', 0), sfx('tension', 0.15), sfx('pop', 1.0), sfx('boing', 1.4), sfx('whoosh', 2.3)] },
    { min: 2.6, actors: [prop('floor', { x: 0, y: GS }), zero({ x: 400, y: GS, s: 2.6, pose: 'phone', face: 1, holdR: { type: 'phone', s: 0.24 } }),
      prop('phone', [{ x: 760, y: 900, s: 0.3, screen: 'Socks|20% OFF', fs: 26, screenY: -16 }, { t: 0.3, s: 1.8, e: 'back' }])], sfx: [sfx('whoosh', 0), sfx('dun', 1.0)] },
    { lines: [N("Dopamine doesn't fire when you get the reward."), N('It fires when your brain thinks a reward might be coming.')],
      actors: [...brain(), ...desks(),
        ...[330, 540, 750].map((x, i) => worker('w' + i, 1300, [{ t: 0, pose: 'walk', face: 7 }, { l: 1, t: 1.5 + i * 0.6, x, pose: 'type', e: 'lin' }])),
        prop('drop', { x: 380, y: 760, s: 0.8, mega: false })] },
    { lines: [PX('Again?')], min: 2.2,
      actors: [...brain(), ...desks(), ...[330, 540, 750].map((x, i) => worker('w' + i, x, [{ face: i === 2 ? 7 : 0 }])),
        pix({ x: 780, y: 760, s: 1.9, face: 1 })] },
  ],
};
