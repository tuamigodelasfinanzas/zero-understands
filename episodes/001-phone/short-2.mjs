// Short 2 · Why notifications are so addictive (loops on the PING)
import { GS, N, PX, zero, pix, prop, popIn, yellow, blue, sfx } from '../../src/kit.mjs';

const held = (o = {}) => ({ type: 'phone', s: 0.24, ...o });
const taps = (n, t0, dt) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hl: [112, 104], e: 'in' }, { t: t0 + i * dt + dt / 2, hl: [98, 128] }]).flat();

export default {
  id: '001-phone-s2', format: 'short', captions: true, music: 'curious', musicGain: 0.09,
  title: "Why can't you ignore that sound?",
  description: 'Your phone works like a slot machine. ZERO is trying to understand humans.\n\n#shorts #psychology #dopamine #animation',
  tags: ['shorts', 'psychology', 'notifications', 'dopamine', 'animation'],
  beats: [
    { pre: 0.5, lines: [N("Why can't you ignore that sound?")],
      actors: [prop('floor', { x: 0, y: GS }),
        prop('phone', [{ x: 840, y: 1150, s: 0.5, dot: 0 }, { t: 0.05, dot: 1, buzz: 1, e: 'pop' }, { t: 0.4, buzz: 0 }]),
        zero([{ x: 420, y: GS, s: 3, face: 0, headR: 0 }, { t: 0.1, headR: 0 }, { t: 0.45, headR: 360, face: 3, look: [8, 2], e: 'out' }])],
      sfx: [sfx('ping', 0), sfx('whoosh', 0.15)] },
    { min: 5,
      actors: [prop('floor', { x: 0, y: GS }),
        zero([{ x: 330, y: GS, s: 3, pose: 'phone', holdR: held(), face: 0 },
          ...[0.4, 1.9, 3.4].map(t => [{ t, hr: [138, 76] }, { t: t + 0.4, hr: [138, 120], e: 'out' }, { t: t + 0.7, hr: [138, 106] }]).flat(), { t: 1.3, face: 1 }, { t: 2.8, face: 1 }, { t: 4.1, face: 2 }]),
        prop('slot', [{ x: 740, y: 900, s: 0.75, reels: '???', label: 'REFRESH' }, ...[0.4, 1.9, 3.4].map((t, i) => [{ t, lever: 1, e: 'out' }, { t: t + 0.4, lever: 0, reels: ['x?x', '?xx', '♥♥♥'][i] }]).flat()]),
        popIn('like', 3.9, { x: 740, y: 470 }, { z: 9 })],
      sfx: [sfx('roll', 0.4), sfx('dun', 1.2), sfx('roll', 1.9), sfx('dun', 2.7), sfx('roll', 3.4), sfx('coin', 3.9)] },
    { lines: [N('In the 1950s, pigeons that got food at random pecked a button nonstop.'), N('Scientists call it a variable reward.'), N('Maybe a message, maybe a like, maybe nothing.'), N('That "maybe" is the trick.')],
      actors: [prop('floor', { x: 0, y: GS }),
        blue('1950s', 540, 330, 0.3, { size: 90 }),
        prop('button', { x: 440, y: 1430, s: 1.1 }),
        prop('pigeon', [{ x: 250, y: 1340, s: 1.2, peck: 0 }, ...Array.from({ length: 40 }, (_, i) => [{ t: 0.4 + i * 0.36, peck: 1, e: 'in' }, { t: 0.58 + i * 0.36, peck: 0 }]).flat()]),
        zero([{ x: 800, y: GS, s: 2.9, pose: 'phone', holdR: held(), face: 1, look: [-6, 0] }, ...taps(40, 0.4, 0.36)]),
        yellow('VARIABLE REWARD', 540, 560, { l: 1, t: 0.3 }, { size: 86 }),
        yellow('MAYBE', 540, 760, { l: 3, t: 0.4 }, { size: 120 })],
      sfx: Array.from({ length: 8 }, (_, i) => sfx('peck', 0.4 + i * 1.44, { g: 0.4 })) },
    { lines: [PX('Problem solved.', { at: 1.4 })], min: 3.6,
      actors: [prop('floor', { x: 0, y: GS }),
        zero([{ x: 420, y: GS, s: 3, pose: 'phone', holdR: held(), face: 1 }, { t: 0.8, pose: 'neutral', holdR: null, face: 4 }, { end: 0.35, headR: 0 }, { end: 0.05, headR: 300, face: 3, e: 'in' }]),
        pix([{ x: 900, y: 700, s: 2.2, face: 4 }, { t: 0.5, x: 560, y: 1050 }, { t: 1.0, x: 900, y: 700 }]),
        prop('phone', [{ x: 560, y: 1080, s: 0.24, o: 0 }, { t: 0.8, o: 1, e: 'step' }, { t: 1.0, x: 980, y: 760 }, { t: 1.3, x: 1250, y: 760 }])],
      sfx: [sfx('whoosh', 0.6), sfx('pix-ting', 1.1, { g: 0.5 }), sfx('ping', 0, { end: 0.35 })] },
  ],
};
