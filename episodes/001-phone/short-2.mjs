// Short 2 · Why notifications are so addictive (loops on the PING)
// Visual direction (docs/direccion-visual.md): starts with ZERO already reading when the phone interrupts; the camera dives
// into the phone and the phone is a casino (L3); the 1950s lab shows the pigeon doing exactly what ZERO does; PIX takes the
// phone away... and a PING somewhere else starts it all again.
import { GS, N, PX, zero, pix, prop, popIn, yellow, blue, sfx, walk, lookCam, tilt, leanIn } from '../../src/kit.mjs';
import { roomS, deskS, minimalS, casinoS } from '../../src/sets.mjs';

const held = (o = {}) => ({ type: 'phone', s: 0.24, ...o });
const book = { type: 'paper', s: 0.3, title: 'BOOK', lines: 1 };
const taps = (n, t0, dt) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hl: [112, 104], e: 'in' }, { t: t0 + i * dt + dt / 2, hl: [98, 128] }]).flat();
const pulls = [0.5, 2.0, 3.5];
const PHONE = { x: 690, y: GS - 214 };     // the phone standing on the desk

export default {
  id: '001-phone-s2', format: 'short', captions: true, music: 'curious', musicGain: 0.09,
  title: "Why can't you ignore that sound?",
  description: 'Your phone works like a slot machine. ZERO is trying to understand humans.\n\n#shorts #psychology #dopamine #animation',
  tags: ['shorts', 'psychology', 'notifications', 'dopamine', 'animation'],
  beats: [
    // HOOK (L2): ZERO is reading. PING. Eyes first, then head, the book drops, he walks to the phone. The camera dives in.
    { pre: 0.3, min: 4.2,
      lines: [N("Why can't you ignore that sound?", { at: 1.1 })],
      cam: [{ z: 1.15, x: 540, y: 1100 }, { t: 1.6, z: 1.15, x: 540, y: 1100 }, { t: 3.4, z: 1.5, x: 640, y: 1180, e: 'io' }],
      actors: [...roomS(), ...deskS({ x: 800 }),
        prop('phone', [{ ...PHONE, s: 0.4, dot: 0 }, { t: 0.25, dot: 1, buzz: 1, e: 'pop' }, { t: 0.6, buzz: 0 }, { t: 0.9, buzz: 1 }, { t: 1.1, buzz: 0 }], { id: 'ph', z: 7 }),
        // the book falls out of his hand when he forgets it
        prop('paper', [{ x: 444, y: 1180, s: 0.3, title: 'BOOK', lines: 1, o: 0 }, { t: 0.9, o: 1, e: 'step' }, { t: 1.35, x: 420, y: GS - 20, tilt: 80, e: 'in' }], { id: 'bk', z: 4 }),
        zero([{ x: 330, y: GS, s: 3, pose: 'phone', holdR: book, face: 0, look: [3, 4] },
          { t: 0.3, look: [9, 1], face: 3, e: 'out' },                 // eyes first...
          { t: 0.6, headR: 8, e: 'out' },                                // ...then the head
          { t: 0.9, pose: 'neutral', holdR: null },                      // forgets the book
          ...walk(330, 450, 1.3, 0.6, { y: GS }),
          ...leanIn(2.0, 450, { dx: 30, look: [9, 2], face: 1 })])],
      sfx: [sfx('ping', 0.25), sfx('thud', 1.35, { g: 0.3 })],
      tout: { type: 'zoom', x: PHONE.x, y: PHONE.y, z: 9, dur: 0.6, color: '#241C3A' } },

    // WOW (L3): inside the phone there is a casino. Every refresh pulls the lever. Nothing, nothing... JACKPOT.
    { min: 5.2, tin: { type: 'zoom', x: 540, y: 960, z: 6, dur: 0.5, color: '#241C3A' },
      cam: [{ z: 1.3, x: 500, y: 1130 }, { t: 3.6, z: 1.3, x: 500, y: 1130 }, { t: 4.4, z: 1.42, x: 500, y: 1100, e: 'out' }],
      actors: [...casinoS(), prop('glow', { x: 260, y: GS - 280, rr: 330, op: 0.16 }, { z: -7 }),
        prop('slot', [{ x: 690, y: 1160, s: 0.8, reels: '???', label: 'REFRESH' }, ...pulls.map((t, i) => [{ t, lever: 1, e: 'out' }, { t: t + 0.4, lever: 0, reels: ['x?x', '?xx', '♥♥♥'][i] }]).flat()], { z: 4 }),
        zero([{ x: 260, y: GS, s: 2.8, pose: 'phone', holdR: held(), face: 0, look: [3, 3] },
          ...pulls.map(t => [{ t, hr: [138, 76] }, { t: t + 0.4, hr: [138, 120], e: 'out' }, { t: t + 0.7, hr: [138, 106] }]).flat(),
          { t: 1.2, face: 2, look: [8, -2] }, { t: 1.9, face: 0 }, { t: 2.7, face: 2, look: [8, -2] }, { t: 3.4, face: 0 },
          { t: 3.95, face: 1, pose: 'celebrate', holdR: held(), e: 'pop' }, { t: 4.7, pose: 'phone' }]),
        popIn('like', 3.95, { x: 690, y: 820 }, { z: 9 }),
        ...[0, 1, 2, 3, 4, 5].map(i => prop('coin', [{ x: 520 + i * 70, y: 1180, s: 0.8, o: 0, roll: 0 }, { t: 3.95, o: 1, e: 'step' }, { t: 4.9, x: 380 + i * 110, y: GS - 30, roll: 360 + i * 90, e: 'in' }], { z: 6 }))],
      sfx: [sfx('roll', 0.5), sfx('dun', 1.2, { g: 0.4 }), sfx('roll', 2.0), sfx('dun', 2.7, { g: 0.4 }), sfx('roll', 3.5), sfx('coin', 3.95), sfx('cheer', 4.0, { g: 0.35 })],
      tout: { type: 'wipe', dur: 0.5 } },

    // EXPLANATION (L2, 1950s lab): the pigeon pecks nonstop... and so does ZERO. He notices. Looks at us.
    { tin: { type: 'wipe', dur: 0.5 },
      lines: [N('In the 1950s, pigeons that got food at random pecked a button nonstop.'), N('Scientists call it a variable reward.'), N('Maybe a message, maybe a like, maybe nothing.'), N('That "maybe" is the trick.')],
      cam: [{ z: 1.3, x: 540, y: 1140 }, { l: 3, t: 0, z: 1.3, x: 540, y: 1140 }, { l: 3, t: 1.2, z: 1.55, x: 640, y: 1200, e: 'io' }],
      actors: [...minimalS({ wall: '#EFE4CC', floor: '#E0D2B4', trim: '#F6EEDD' }),
        prop('board', { x: 540, y: 640, s: 0.62, txt: '1950s|LAB', size: 80 }, { z: -5, depth: 0.85 }),
        prop('shadow', { x: 330, y: GS + 4, w: 230, op: 0.12 }, { z: 1 }),
        prop('button', { x: 440, y: 1430, s: 1.1 }),
        prop('pigeon', [{ x: 250, y: 1340, s: 1.2, peck: 0 }, ...Array.from({ length: 44 }, (_, i) => [{ t: 0.4 + i * 0.36, peck: 1, e: 'in' }, { t: 0.58 + i * 0.36, peck: 0 }]).flat()]),
        zero([{ x: 800, y: GS, s: 2.9, pose: 'phone', holdR: held(), face: 1, look: [-6, 0] }, ...taps(44, 0.4, 0.36),
          { l: 3, t: 0.3, face: 2, look: [-9, 1] },                    // looks at the pigeon...
          { l: 3, t: 0.9, look: [3, 4] },                              // ...at his own thumb...
          ...lookCam({ l: 3, t: 1.4 }, { face: 4, tilt: -8 })]),       // ...and at us
        yellow('VARIABLE REWARD', 540, 930, { l: 1, t: 0.3 }, { size: 80, keys: [{ l: 2, t: 0, o: 1 }, { l: 2, t: 0.2, o: 0 }] }),
        popIn('notif', { l: 2, t: 0.1 }, { x: 540, y: 930, txt: 'New message', s: 0.8, icon: '#2F80ED' }, { z: 9, keys: [{ l: 2, t: 1.0, o: 1 }, { l: 2, t: 1.15, o: 0 }] }),
        popIn('like', { l: 2, t: 1.2 }, { x: 540, y: 930, s: 0.9 }, { z: 9, keys: [{ l: 2, t: 2.0, o: 1 }, { l: 2, t: 2.15, o: 0 }] }),
        popIn('text', { l: 2, t: 2.2 }, { x: 540, y: 930, txt: '...', size: 120, color: '#9A9A9A' }, { z: 9, keys: [{ l: 3, t: 0, o: 1 }, { l: 3, t: 0.15, o: 0 }] }),
        yellow('MAYBE', 540, 930, { l: 3, t: 0.3 }, { size: 140 })],
      sfx: [...Array.from({ length: 9 }, (_, i) => sfx('peck', 0.4 + i * 1.44, { g: 0.4 })), sfx('ping', 0.1, { l: 2, g: 0.5 }), sfx('coin', 1.2, { l: 2, g: 0.5 }), sfx('dun', 1.5, { l: 3, g: 0.4 })],
      tout: { type: 'iris', x: 760, y: 1120, dur: 0.45 } },

    // PAYOFF + LOOP (back in the room): PIX takes the phone. Problem solved... until a PING somewhere else.
    { tin: { type: 'iris', x: 420, y: 1150, dur: 0.45 }, lines: [PX('Problem solved.', { at: 1.3 })], min: 4.0,
      cam: [{ z: 1.15, x: 540, y: 1100 }],
      actors: [...roomS(), ...deskS({ x: 800 }),
        zero([{ x: 330, y: GS, s: 3, pose: 'phone', holdR: held(), face: 1, look: [3, 4] },
          { t: 0.75, pose: 'neutral', holdR: null, face: 3, look: [6, -6], e: 'out' },
          ...tilt(1.6, { deg: -8, face: 4 }),
          { end: 0.4, headR: -8 }, { end: 0.08, headR: 352, face: 3, look: [9, 1], e: 'in' }]),
        pix([{ x: 900, y: 700, s: 2.0, face: 4 }, { t: 0.45, x: 470, y: 1120, e: 'io' }, { t: 0.95, x: 860, y: 780, e: 'io' }, { t: 2.2, x: 880, y: 760 }]),
        prop('phone', [{ x: 470, y: 1140, s: 0.24, o: 0 }, { t: 0.75, o: 1, e: 'step' }, { t: 0.95, x: 900, y: 860, e: 'io' }, { t: 1.2, x: 1250, y: 820, e: 'in' }], { z: 9 }),
        prop('phone', [{ ...PHONE, s: 0.4, dot: 0, o: 0 }, { end: 0.45, o: 1, dot: 1, buzz: 1, e: 'step' }], { z: 7 })],
      sfx: [sfx('whoosh', 0.55), sfx('pix-ting', 1.1, { g: 0.5 }), sfx('ping', 0, { end: 0.4 })] },
  ],
};
