// Short · Why do you feel your phone buzz when it didn't? (phantom vibration; pillar: brain; loops on the buzz)
// Visual direction (docs/direccion-visual.md): ZERO is already busy watering his plant when his pocket "buzzes"; he checks:
// nothing. Inside his head a worker has the sensitivity dial at maximum and rings the alarm for every tiny signal.
import { GS, N, PX, zero, pix, prop, popIn, yellow, blue, red, sfx, lookCam, tilt } from '../../src/kit.mjs';
import { roomS } from '../../src/sets.mjs';

const phoneOff = { type: 'phone', s: 0.24, screenColor: '#2B2F3A', lit: 1 };
// ZERO waters the plant, feels the buzz, pats his pocket, pulls the phone out: black screen
const scene = (o = {}) => zero([{ x: 470, y: GS, s: 3, pose: 'reach', hr: [150, 150], face: 2, look: [-9, 4], flip: true },
  { t: o.buzz ?? 0.9, face: 3, look: [0, 6], squash: 0.94, e: 'out' }, { t: (o.buzz ?? 0.9) + 0.15, squash: 1 },
  { t: (o.buzz ?? 0.9) + 0.35, pose: 'hips', hr: null, flip: false, look: [6, 6], e: 'io' },
  { t: (o.buzz ?? 0.9) + 1.0, pose: 'phone', holdR: phoneOff, face: 0, look: [3, 3], e: 'io' },
  ...(o.after || [])]);

export default {
  id: '005-phantom', format: 'short', captions: true, music: 'curious', musicGain: 0.09,
  title: "Why do you feel your phone buzz when it didn't?",
  description: "Nothing. Again. ZERO is trying to understand humans.\n\n#shorts #psychology #brain #phone #animation",
  tags: ['shorts', 'psychology', 'phantom vibration', 'phone', 'brain', 'animation'],
  beats: [
    // HOOK (L2): already happening. The plant gets water, the pocket "buzzes", the phone is dark. He looks at us.
    { pre: 0.2, min: 4.4,
      lines: [N("Why do you feel your phone buzz... when it didn't?", { at: 2.3 })],
      cam: [{ z: 1.2, x: 500, y: 1150 }, { t: 1.6, z: 1.2, x: 500, y: 1150 }, { t: 2.6, z: 1.42, x: 470, y: 1120, e: 'io' }, { t: 0.9, shake: 0 }, { t: 0.95, shake: 4 }, { t: 1.2, shake: 0 }],
      actors: [...roomS({ plantX: 230, plantKeys: [{ t: 0.4, perk: 0.85 }, { t: 0.9, perk: 1.05, e: 'out' }, { u: 1, perk: 1 }] }),
        popIn('text', 0.9, { x: 610, y: 1260, txt: 'bzz', size: 60, color: '#9A9A9A' }, { z: 9, keys: [{ t: 1.4, o: 1 }, { t: 1.6, o: 0 }] }),
        scene({ after: [...lookCam(3.0, { face: 4, tilt: -8 })] })],
      sfx: [sfx('buzz', 0.9, { g: 0.6 }), sfx('swipe', 1.4, { g: 0.3 }), sfx('dun', 2.1, { g: 0.4 })],
      tout: { type: 'zoom', x: 470, y: 1060, z: 9, dur: 0.5, color: '#FFFFFF' } },

    // INSIDE HIS HEAD (L3): the worker turned the sensitivity to the max; every tiny signal sets off the alarm
    { bg: '#E4EBF3', tin: { type: 'zoom', x: 540, y: 900, z: 6, dur: 0.5, color: '#FFFFFF' },
      lines: [N("It's called phantom vibration."), N('In one study, almost nine out of ten students said they had felt it.'), N('Your brain is so ready for a notification... that it turns any tiny signal into a buzz.')],
      cam: [{ z: 1.15, x: 540, y: 980 }, { l: 2, t: 0, z: 1.15, x: 540, y: 980 }, { l: 2, t: 1.4, z: 1.35, x: 540, y: 1060, e: 'io' }],
      actors: [prop('logo', { x: 540, y: 900, s: 8, eyes: false, sw: 4 }, { z: 0 }),
        yellow('PHANTOM VIBRATION', 540, 330, { l: 0, t: 0.5 }, { size: 80 }),
        prop('counter', [{ x: 540, y: 760, n: 40, label: 'SENSITIVITY', s: 0.9 }, { l: 2, t: 0.4, n: 40 }, { l: 2, t: 1.6, n: 100, e: 'io' }], { z: 3 }),
        popIn('text', { l: 1, t: 0.8 }, { x: 540, y: 1460, txt: '9 / 10', size: 120, color: '#2F80ED', stroke: 4 }, { z: 9, keys: [{ l: 2, t: 0, o: 1 }, { l: 2, t: 0.2, o: 0 }] }),
        prop('worker', [{ x: 400, y: 1230, s: 1.6, pose: 'think', face: 0 }, { l: 2, t: 0.4, pose: 'reach', face: 2 }, { l: 2, t: 1.6, pose: 'celebrate', face: 2 }], { z: 3 }),
        prop('siren', [{ x: 720, y: 1080, on: 0, s: 1.1 }, ...Array.from({ length: 8 }, (_, i) => [{ l: 2, t: 2.0 + i * 0.3, on: 1, e: 'step' }, { l: 2, t: 2.15 + i * 0.3, on: 0, e: 'step' }]).flat()], { z: 3 })],
      sfx: [sfx('pop', 0.5, { l: 0 }), sfx('dato', 0.8, { l: 1, g: 0.5 }), sfx('roll', 0.4, { l: 2, g: 0.5 }), sfx('tension', 2.0, { l: 2 })],
      tout: { type: 'wipe', dur: 0.5 } },

    // THE RULE (L1): better to check for nothing than to miss something
    { tin: { type: 'wipe', dur: 0.5 }, bg: '#E4EBF3',
      lines: [N('A fold in your jeans. A muscle twitch.'), N('For your brain, checking for nothing is cheaper than missing something.')],
      cam: [{ z: 1.25, x: 540, y: 1180 }, { u: 1, z: 1.32, x: 540, y: 1190, e: 'io' }],
      actors: [prop('room', { x: 540, y: GS, wall: '#E4EBF3', floor: '#D9E2EC', trim: '#EEF3F8' }, { z: -10 }),
        zero([{ x: 340, y: GS, s: 3.1, pose: 'phone', holdR: phoneOff, face: 1, look: [3, 3] }, ...tilt({ l: 1, t: 0.6 }, { deg: 10, face: 4 })]),
        popIn('notif', { l: 0, t: 0.2 }, { x: 690, y: 860, txt: 'Fold in jeans', s: 1.05, icon: '#9A9A9A' }, { z: 9, keys: [{ l: 1, t: 0, o: 1 }, { l: 1, t: 0.2, o: 0 }] }),
        popIn('notif', { l: 0, t: 1.4 }, { x: 690, y: 1010, txt: 'Muscle twitch', s: 1.05, icon: '#9A9A9A' }, { z: 9, keys: [{ l: 1, t: 0, o: 1 }, { l: 1, t: 0.2, o: 0 }] }),
        red('MISS IT?', 720, 880, { l: 1, t: 1.2 }, { size: 100 }),
        prop('rect', [{ x: 720, y: 880, w: 0, h: 12, fill: '#111111' }, { l: 1, t: 2.2, w: 0 }, { l: 1, t: 2.5, w: 400 }], { z: 10 }),
        popIn('text', { l: 1, t: 2.6 }, { x: 720, y: 1040, txt: 'CHECK!', size: 110, color: '#2E9E5B', stroke: 4 }, { z: 9 })],
      sfx: [sfx('pop', 0.2, { l: 0 }), sfx('pop', 1.4, { l: 0 }), sfx('error', 2.2, { l: 1, g: 0.4 }), sfx('idea', 2.6, { l: 1, g: 0.5 })],
      tout: { type: 'iris', x: 470, y: 1100, dur: 0.45 } },

    // PAYOFF + LOOP: PIX tells him. He nods... and his pocket "buzzes" again.
    { tin: { type: 'iris', x: 470, y: 1100, dur: 0.45 }, lines: [PX("It's your leg, ZERO.", { at: 0.6 })], min: 3.6,
      cam: [{ z: 1.2, x: 500, y: 1150 }],
      actors: [...roomS({ plantX: 230 }),
        zero([{ x: 470, y: GS, s: 3, pose: 'phone', holdR: phoneOff, face: 1, look: [6, -6] }, { t: 1.8, pose: 'neutral', holdR: null, face: 0, look: [0, 2] },
          { end: 0.35, face: 3, look: [0, 6], squash: 0.94, e: 'out' }, { end: 0.2, squash: 1 }]),
        pix([{ x: 820, y: 860, s: 0, face: 5 }, { t: 0.3, s: 1.9, e: 'pop' }, { u: 1, y: 880, e: 'io' }])],
      sfx: [sfx('pix-ting', 0.3, { g: 0.4 }), sfx('buzz', 0, { end: 0.35, g: 0.6 })] },
  ],
};
