// Pilot: "ZERO Tried to Check His Phone for Just 5 Minutes" (script: plan doc, Lote 1)
import { G, ZS, N, PX, Z0, zero, pix, prop, floor, popIn, text, yellow, blue, red, deskSet, brainSet, sfx } from '../../src/kit.mjs';

const phoneOnDesk = (k = {}) => prop('phone', [{ x: 735, y: 745, s: 0.3, r: -90, ...k }], { id: 'ph', z: 7 });
const held = (o = {}) => ({ type: 'phone', s: 0.24, ...o });

// a column of video cards rushing up past ZERO (the endless feed)
function feedShaft() {
  const out = [];
  for (let i = 0; i < 12; i++) {
    const x = i % 2 ? 1380 + (i % 3) * 60 : 540 - (i % 3) * 60;
    out.push(prop('feedcard', [{ x, y: 1300 + i * 260, i, rot: (i % 5) - 2, s: 1.1 }, { u: 1, y: -400 + i * 260 - 1600, e: 'lin' }], { id: 'fc' + i, z: 2 }));
  }
  return out;
}
const apps = () => Array.from({ length: 21 }, (_, i) => prop('app', [{ x: 1080 + (i % 7) * 120, y: 380 + Math.floor(i / 7) * 150, s: 0, i }, { t: 0.15 + i * 0.05, s: 1, e: 'pop' }, { u: 1, x: 1000 + (i % 7) * 120 }], { id: 'a' + i }));

const ep = {
  id: '001-phone',
  format: 'long',
  title: 'ZERO Tried to Check His Phone for Just 5 Minutes',
  description: `Why is it so hard to put your phone down? ZERO tried "just one minute"... two hours ago.

In this video:
0:00 Just one minute
0:25 What happens in your brain when the phone buzzes
2:00 The slot machine in your pocket
6:30 The phone you don't even touch
8:00 What actually helps

ZERO is trying to understand humans. Subscribe and he'll keep trying.

Sources: B.F. Skinner's variable reinforcement experiments (1950s); Ward et al., "Brain Drain" (University of Texas at Austin, 2017).`,
  tags: ['psychology', 'phone addiction', 'dopamine', 'animation', 'why do we', 'habits', 'ZERO'],
  category: 'EDUCATION',
  music: 'curious',
  musicGain: 0.11,
  thumb: {
    bg: '#FFFFFF',
    actors: [
      floor(),
      zero({ x: 760, y: 1010, s: 3.3, pose: 'phone', face: 9, look: [3, 3], holdR: held({ screen: '', dot: 1 }) }),
      prop('dot', { x: 1060, y: 330, rr: 70, n: 99 }, { z: 9 }),
      prop('text', { x: 1450, y: 470, txt: 'JUST', size: 150 }, { z: 9 }),
      prop('text', { x: 1450, y: 640, txt: '5 MIN?', size: 190, color: '#E63946', stroke: 6 }, { z: 9 }),
      pix({ x: 1640, y: 860, s: 2.4, face: 6 }),
    ],
  },
  beats: [
    // ---------------- 0:00 cold open ----------------
    {
      pre: 1.5, min: 2.5,
      lines: [PX("Don't."), Z0('Just one minute.')],
      actors: [
        ...deskSet(),
        phoneOnDesk({ dot: 0 }),
        prop('phone', [{ x: 735, y: 745, s: 0.3, r: -90, o: 0 }, { t: 0.95, o: 1, dot: 1, buzz: 1, e: 'step' }, { t: 1.4, buzz: 0 }, { l: 1, t: 0.6, o: 0, e: 'step' }], { id: 'ph2', z: 7 }),
        zero([{ x: 860, pose: 'type', look: [6, 1] }, { t: 1.0, look: [6, 1] }, { t: 1.15, look: [-8, 3], headR: -6, face: 3, e: 'out' }, { l: 1, t: 0, face: 0 },
          { l: 1, t: 0.6, pose: 'phone', holdR: held({ screen: '', dot: 1 }), headR: 0, look: [3, 3], e: 'step' }]),
        pix([{ x: 1500, y: 330, s: 0, face: 7 }, { l: 0, t: -0.35, s: 2.2, e: 'pop' }]),
      ],
      sfx: [sfx('type', 0.1), sfx('type', 0.5), sfx('ping', 0.95), sfx('pix-ting', 1.15, { g: 0.5 })],
    },
    { min: 1.4, actors: [popIn('card', 0, { x: 960, y: 540, txt: '2 HOURS LATER', size: 100 })], sfx: [sfx('whoosh', 0)] },
    {
      min: 2.8,
      actors: [floor(), zero([{ x: 1180, y: G - 132, r: -90, pose: 'phone', hr: [150, 64], face: 1, blink: false, look: [0, 0], holdR: held({ feed: 0, r: 90 }) }, { u: 1, holdR: held({ feed: 9, r: 90 }), e: 'lin' }]),
        prop('zzz', [{ x: 760, y: 700, o: 0 }])],
      sfx: [sfx('swipe', 0.4), sfx('swipe', 1.2), sfx('swipe', 2.0)],
    },
    // ---------------- 0:05 question ----------------
    {
      inherit: true,
      lines: [N('Why is it so difficult to put your phone down?')],
      cam: [{ z: 1, x: 960, y: 540 }, { u: 1, z: 1.35, x: 1020, y: 660 }],
      actors: [floor(), zero([{ u: 0.45, holdR: held({ feed: 9, r: 90 }), look: [0, 0] }, { u: 0.55, look: [-9, -4] }]),
        popIn('qmark', { u: 0.6 }, { x: 860, y: 560, size: 170 })],
    },
    // ---------------- 0:15 promise ----------------
    {
      lines: [N("The answer has less to do with self-control than you might think."), N("And once you understand what's happening inside your brain, those notifications start looking very different.")],
      cam: [{ z: 1, x: 960, y: 540 }, { l: 1, t: 0, z: 1.05 }, { end: 0.7, z: 1.15, x: 960, y: 420 }, { end: 0, z: 6, x: 960, y: 520, e: 'in' }],
      actors: [floor(), zero({ x: 960, face: 5 }),
        popIn('phone', { l: 0, t: 1.2 }, { x: 1350, y: 520, s: 1, dot: 1, screen: '3 new|notifications', fs: 16 }, { z: 4 }),
        popIn('phone', { l: 1, t: 2.6 }, { x: 560, y: 520, s: 1, dot: 1, screen: '12 new|notifications', fs: 16 }, { z: 4 })],
      sfx: [sfx('ping', 1.6, { l: 0 }), sfx('ping', 2.6, { l: 1 }), sfx('whoosh', 0, { end: 0.6 })],
    },
    // ---------------- 0:25 inside the brain ----------------
    {
      pre: 1.2,
      lines: [PX('Your brain loves rewards. And that phone is a reward machine.')],
      cam: [{ z: 1.2, flash: 0.9 }, { t: 0.5, z: 1, flash: 0 }],
      actors: [...brainSet(), pix([{ x: 1150, y: 420, s: 0, face: 3 }, { t: 0.8, s: 1.8, e: 'pop' }])],
      sfx: [sfx('pop', 0.8), sfx('pix-ting', 0.85, { g: 0.5 })],
    },
    // notification: the owl turn
    {
      lines: [N("It starts with a sound. One tiny buzz, and your attention is gone."), N("Your brain doesn't know if it's your best friend or an ad for socks. So it has to check.")],
      actors: [
        ...deskSet(),
        phoneOnDesk({ dot: 0 }),
        prop('phone', [{ x: 735, y: 745, s: 0.3, r: -90, o: 0 }, { l: 0, t: 1.3, o: 1, dot: 1, buzz: 1, e: 'step' }, { l: 0, t: 1.8, buzz: 0 }], { id: 'ph2', z: 7 }),
        zero([{ x: 860, pose: 'type', look: [6, 1] }, { l: 0, t: 1.4, headR: 0 }, { l: 0, t: 1.75, headR: 360, look: [-8, 3], face: 3, e: 'out' }, { l: 1, t: 0, headR: 360, face: 5 }, { l: 1, t: 1.4, face: 4, look: [-4, -6] }]),
        popIn('bubble', { l: 1, t: 1.6 }, { x: 420, y: 330, txt: 'BEST FRIEND?', size: 46, w: 420 }, { z: 9 }),
        popIn('bubble', { l: 1, t: 3.0 }, { x: 1450, y: 330, txt: 'SOCKS AD?', size: 46, w: 380, tail: 'r' }, { z: 9 }),
      ],
      sfx: [sfx('type', 0.2), sfx('buzz', 1.3, { l: 0 }), sfx('whoosh', 1.45, { l: 0 }), sfx('pop', 1.6, { l: 1 }), sfx('pop', 3.0, { l: 1 })],
    },
    {
      min: 2.8,
      actors: [prop('phone', [{ x: 960, y: 520, s: 0.3, screen: 'Socks|20% OFF', fs: 26, screenY: -16 }, { t: 0.35, s: 3.4, e: 'back' }]),
        zero([{ x: 1600, y: 1180, s: 1.9, face: 1, blink: false, look: [-6, 0] }], { z: 9 })],
      sfx: [sfx('whoosh', 0), sfx('dun', 0.9)],
    },
    // dopamine
    {
      lines: [N("Meet dopamine."), N("Most people think it's the pleasure chemical. It's not."), N("Dopamine is about wanting. It fires before the reward, when your brain thinks something good might be coming.")],
      actors: [
        ...brainSet({ workers: false }),
        prop('drop', [{ x: 760, y: 640, s: 0, shout: 0 }, { t: 0.3, s: 1.1, e: 'pop' }, { l: 2, t: 0.5, shout: 0 }, { l: 2, t: 0.8, shout: 1, e: 'pop' }], { id: 'drop', z: 4 }),
        red('PLEASURE', 1150, 380, { l: 1, t: 1.2 }, { size: 80, keys: [{ l: 1, t: 2.4, o: 1 }, { l: 1, t: 2.6, o: 0.25 }] }),
        prop('rect', [{ x: 1150, y: 380, w: 0, h: 12, fill: '#111111' }, { l: 1, t: 2.4, w: 0 }, { l: 1, t: 2.7, w: 440 }], { z: 10 }),
        yellow('WANTING', 1150, 560, { l: 2, t: 0.3 }, { size: 110 }),
        prop('worker', [{ x: 1000, y: 900, s: 1, pose: 'neutral' }, { l: 2, t: 1.0, x: 1000 }, { l: 2, t: 2.6, x: 1500, pose: 'run', face: 3 }], { id: 'w1', z: 2 }),
        prop('worker', [{ x: 1140, y: 900, s: 1, pose: 'neutral' }, { l: 2, t: 1.2, x: 1140 }, { l: 2, t: 2.8, x: 1600, pose: 'run', face: 3 }], { id: 'w2', z: 2 }),
        prop('worker', [{ x: 1290, y: 900, s: 1, pose: 'think', face: 6 }, { l: 2, t: 1.4, x: 1290 }, { l: 2, t: 3.0, x: 1700, pose: 'run', face: 3 }], { id: 'w3', z: 2 }),
      ],
      sfx: [sfx('pop', 0.3), sfx('error', 2.4, { l: 1, g: 0.5 }), sfx('idea', 0.3, { l: 2, g: 0.6 }), sfx('boing', 0.8, { l: 2 })],
    },
    // the scroll: falling through a bottomless feed
    {
      lines: [N('Then comes the scroll.'), N('There is no bottom. No last page. No natural moment to stop.'), N('Your brain keeps waiting for an ending that never arrives.')],
      cam: [{ shake: 0 }, { l: 0, t: 1.0, shake: 6 }, { end: 0, shake: 4 }],
      actors: [
        prop('hole', [{ x: 960, y: 1300, w: 50 }, { l: 0, t: 0.6, y: 960, w: 420 }], { z: 1 }),
        ...feedShaft(),
        zero([{ x: 960, y: G, pose: 'phone', holdR: held({ feed: 0 }), face: 0 }, { l: 0, t: 0.6, y: G }, { l: 0, t: 1.2, y: 760, pose: 'scared', face: 9, holdR: null, e: 'out' }, { l: 1, t: 0, y: 700, r: 12 }, { end: 0, y: 690, r: -12, face: 1 }]),
        yellow('NO BOTTOM', 960, 200, { l: 1, t: 0.2 }, { size: 96 }),
      ],
      sfx: [sfx('fall', 0.7, { l: 0 }), sfx('whoosh', 0.1, { l: 1 }), sfx('whoosh', 0.1, { l: 2 })],
    },
    // the algorithm: an octopus taking notes
    {
      lines: [N("And behind the screen, the algorithm is taking notes."), N("Every second you watch, it learns a little more about what keeps you there.")],
      actors: [
        floor(),
        zero([{ x: 420, pose: 'phone', holdR: held({ screen: '' }), face: 0, look: [6, 0] }, { l: 1, t: 0.8, face: 2 }]),
        prop('catvideo', [{ x: 980, y: 470, s: 0 }, { l: 1, t: 0.3, s: 1.3, e: 'pop' }], { z: 6 }),
        prop('octopus', [{ x: 1500, y: 1400, s: 1.3, wig: 0, note: '' }, { l: 0, t: 1.2, y: 600, e: 'back' }, { l: 1, t: 1.6, note: 'CATS|= YES', noteSize: 30, wig: 4 }, { end: 0, wig: 9 }], { z: 4 }),
        prop('rect', [{ x: 1500, y: 960, w: 900, h: 60, fill: '#FFFFFF' }], { z: 5 }),
      ],
      sfx: [sfx('boing', 1.2, { l: 0 }), sfx('pop', 0.3, { l: 1 }), sfx('click', 1.6, { l: 1 })],
    },
    // reward
    {
      min: 3,
      actors: [floor(),
        zero([{ x: 960, pose: 'phone', holdR: held({ screen: '' }), face: 0 }, { t: 0.5, face: 2 }, { t: 1.6, face: 0 }, { t: 2.0, pose: 'phone', hr: [130, 112] }, { t: 2.3, hr: [116, 98] }]),
        popIn('like', 0.45, { x: 1240, y: 360 }, { z: 9 }),
        prop('confetti', [{ x: 1240, y: 360, k: 0, o: 0 }, { t: 0.5, o: 1, e: 'step' }, { t: 1.6, k: 1, e: 'out' }], { z: 8 }),
      ],
      sfx: [sfx('coin', 0.45), sfx('cheer', 0.5, { g: 0.5 }), sfx('swipe', 2.0)],
    },
    {
      lines: [N('Notification. Dopamine. Scroll. Algorithm. Reward.'), N('And then... again. And again.')],
      actors: [floor(), zero({ x: 960, pose: 'phone', holdR: held({ screen: '' }), face: 1 }),
        prop('orbit', [{ x: 960, y: 520, rr: 470, words: ['NOTIFICATION', 'DOPAMINE', 'SCROLL', 'ALGORITHM', 'REWARD'], a: 0, size: 56 }, { l: 1, t: 0, a: 4 }, { end: 0, a: 26, e: 'in' }], { z: 7 })],
      cam: [{ z: 1 }, { end: 0, z: 1.15, shake: 3 }],
      sfx: [sfx('whoosh', 0.2, { l: 1 }), sfx('whoosh', 1.2, { l: 1 })],
    },
    // ---------------- 2:00 the slot machine in your pocket ----------------
    {
      min: 6.2,
      actors: [floor(),
        prop('slot', [{ x: 1180, y: 600, reels: '???', lever: 0, s: 1 },
          { t: 0.6, lever: 1, e: 'out' }, { t: 0.9, lever: 0, reels: 'x7$' }, { t: 1.6, reels: '$x*' },
          { t: 2.2, lever: 1, e: 'out' }, { t: 2.5, lever: 0, reels: '7*x' }, { t: 3.2, reels: 'x$7' },
          { t: 3.8, lever: 1, e: 'out' }, { t: 4.1, lever: 0, reels: '**$' }, { t: 4.6, reels: '777', coins: 0 }, { t: 5.2, coins: 1 }], { z: 3 }),
        zero([{ x: 620, pose: 'reach', hr: [190, 74], face: 0, look: [6, 0] },
          { t: 0.6, hr: [190, 140], e: 'out' }, { t: 0.9, hr: [190, 74] }, { t: 1.7, face: 1 },
          { t: 2.2, hr: [190, 140], e: 'out' }, { t: 2.5, hr: [190, 74] }, { t: 3.3, face: 1 },
          { t: 3.8, hr: [190, 140], e: 'out' }, { t: 4.1, hr: [190, 74] }, { t: 4.7, face: 2, pose: 'celebrate', hr: null, squash: 1.06 }]),
      ],
      sfx: [sfx('roll', 0.6), sfx('dun', 1.6), sfx('roll', 2.2), sfx('dun', 3.2), sfx('roll', 3.8), sfx('jackpot', 4.6)],
    },
    {
      lines: [N('In the 1950s, the psychologist B.F. Skinner tested something with pigeons.'), N('When a pigeon got food every time it pecked a button, it pecked normally.'), N('But when the food came at random... sometimes yes, sometimes no...', { gap: 0.15 })],
      actors: [floor(),
        blue('B.F. SKINNER · 1950s', 960, 140, 0.4, { size: 64 }),
        prop('button', [{ x: 760, y: 870, down: 0 }]),
        prop('pigeon', [{ x: 560, y: 800, peck: 0, s: 1.1 }, ...Array.from({ length: 10 }, (_, i) => [{ l: 1, t: 0.4 + i * 0.7, peck: 1, e: 'in' }, { l: 1, t: 0.6 + i * 0.7, peck: 0 }]).flat()]),
        prop('seed', [{ x: 860, y: 900, s: 0 }, { l: 1, t: 0.6, s: 1.2, e: 'pop' }]),
        prop('slot', [{ x: 1400, y: 560, s: 0, reels: '?x?' }, { l: 2, t: 0.6, s: 0.7, e: 'pop' }, { l: 2, t: 1.6, reels: 'x$x' }, { l: 2, t: 2.6, reels: '$x$' }]),
      ],
      sfx: [sfx('peck', 0.4, { l: 1 }), sfx('peck', 1.8, { l: 1 }), sfx('peck', 3.2, { l: 1 }), sfx('pop', 0.6, { l: 2 })],
    },
    {
      lines: [N("...the pigeon couldn't stop."), N('Scientists call it a variable reward. And it\'s exactly how your phone works.')],
      actors: [floor(),
        prop('button', [{ x: 560, y: 870, down: 0 }]),
        prop('pigeon', [{ x: 360, y: 800, peck: 0, s: 1.1 }, ...Array.from({ length: 22 }, (_, i) => [{ t: 0.2 + i * 0.32, peck: 1, e: 'in' }, { t: 0.36 + i * 0.32, peck: 0 }]).flat()]),
        zero([{ x: 1300, pose: 'phone', holdR: held({ screen: '' }), face: 1, look: [-6, 0] }, ...Array.from({ length: 22 }, (_, i) => [{ t: 0.2 + i * 0.32, hl: [112, 104], e: 'in' }, { t: 0.36 + i * 0.32, hl: [98, 128] }]).flat()]),
        yellow('VARIABLE REWARD', 960, 220, { l: 1, t: 0.6 }, { size: 100 }),
      ],
      sfx: Array.from({ length: 10 }, (_, i) => sfx('peck', 0.2 + i * 0.64, { g: 0.5 })),
    },
    {
      lines: [N("Maybe there's a message."), N('Maybe a like.'), N('Maybe nothing.'), N('That "maybe" is the whole trick.')],
      actors: [floor(),
        zero([{ x: 560, pose: 'phone', holdR: held({ screen: '' }), face: 0 }, { l: 0, t: 0, hr: [116, 70] }, { l: 0, t: 0.5, hr: [116, 112], e: 'out' }, { l: 0, t: 0.9, hr: [116, 98] }]),
        prop('slot', [{ x: 1300, y: 600, s: 0.8, lever: 0, reels: '???', label: 'MAYBE' }, { l: 0, t: 0.1, lever: 1, e: 'out' }, { l: 0, t: 0.5, lever: 0 }]),
        popIn('bubble', { l: 0, t: 0.2 }, { x: 960, y: 200, txt: 'A MESSAGE?', size: 44, w: 380 }, { z: 9 }),
        popIn('like', { l: 1, t: 0.1 }, { x: 1700, y: 220, s: 0.7 }, { z: 9 }),
        popIn('text', { l: 2, t: 0.1 }, { x: 1300, y: 600, txt: '...', size: 120 }, { z: 9 }),
        yellow('MAYBE', 960, 960, { l: 3, t: 0.3 }, { size: 120 }),
      ],
      sfx: [sfx('roll', 0.1, { l: 0 }), sfx('pop', 0.2, { l: 0 }), sfx('pop', 0.1, { l: 1 }), sfx('dun', 0.1, { l: 2 })],
    },
    {
      lines: [PX("You're not addicted to your phone."), PX('You\'re addicted to "maybe."')],
      actors: [floor(), zero({ x: 760, pose: 'phone', holdR: held({ screen: '' }), face: 1, look: [6, -2] }),
        pix([{ x: 1300, y: 420, s: 2.6, face: 3 }, { l: 1, t: 0, face: 3 }])],
    },
    // the red dot
    {
      lines: [N('Red means danger. Red means urgent.'), N('So apps paint their notifications red, and your brain treats a random update like an emergency.')],
      actors: [floor(),
        zero([{ x: 1500, pose: 'neutral', face: 0 }, { t: 0.4, face: 9, pose: 'run', flip: true }, { l: 0, t: 2.2, x: 500 }, { l: 1, t: 0.4, x: 330, r: -80, pose: 'scared', e: 'out' }, { l: 1, t: 1.4, r: 0, pose: 'phone', face: 1, flip: false, holdR: held({ screen: '' }) }]),
        prop('dot', [{ x: 2100, y: 720, rr: 110, n: 1 }, { t: 0.3, x: 1900 }, { l: 0, t: 2.4, x: 760, e: 'lin' }, { l: 1, t: 1.3, x: 760, s: 1 }, { l: 1, t: 1.5, s: 0, e: 'in' }], { z: 6 }),
        popIn('notif', { l: 1, t: 1.6 }, { x: 1080, y: 330, txt: 'Someone you may know joined.', size: 40, w: 760 }, { z: 9 }),
      ],
      cam: [{ shake: 0 }, { t: 0.4, shake: 4 }, { l: 1, t: 0.4, shake: 0 }],
      sfx: [sfx('tension', 0.2), sfx('thud', 0.45, { l: 1 }), sfx('pop', 1.6, { l: 1 }), sfx('dun', 2.6, { l: 1 })],
    },
    // the counter
    {
      lines: [N('The more you check, the more your brain expects to check.'), N('Some surveys say the average person picks up their phone around a hundred times a day.')],
      actors: [floor(),
        prop('counter', [{ x: 1560, y: 330, n: 37, label: 'PICKUPS TODAY' }, { l: 1, t: 0, n: 64 }, { end: 0.5, n: 103, e: 'lin' }], { z: 6 }),
        zero([{ x: 1150, face: 0, look: [6, -6] }, { l: 0, t: 1.5, face: 9 }, { l: 1, t: 0.6, pose: 'reach', look: [6, 4] }, { l: 1, t: 1.4, pose: 'phone', holdR: held({ screen: '' }), face: 1, look: [6, -6] }]),
        prop('phone', [{ x: 1330, y: 780, s: 0.3, r: -90 }, { l: 1, t: 1.4, o: 0, e: 'step' }]),
        prop('rect', [{ x: 1330, y: 800, w: 260, h: 16 }], { z: 2 }),
      ],
      sfx: Array.from({ length: 8 }, (_, i) => sfx('tick', 0.5 + i * 0.9, { l: 1, g: 0.4 })),
    },
    // not weakness
    {
      lines: [N("And here's the thing. You're not weak."), N('Some of the smartest designers in the world work every day to keep you scrolling.')],
      actors: [floor(),
        prop('board', { x: 1260, y: 560, txt: 'HOW TO|KEEP ZERO|SCROLLING', size: 62 }),
        prop('suit', [{ x: 560, y: 790, s: 1.1, tie: '#E63946' }, { u: 0.5, r: 3 }, { u: 1, r: -3 }]),
        prop('suit', [{ x: 790, y: 780, s: 1.2, tie: '#2F80ED' }]),
        prop('suit', [{ x: 1700, y: 790, s: 1.1, tie: '#FFC93C' }, { u: 0.6, r: -4 }]),
      ],
      sfx: [sfx('click', 0.5, { l: 1 })],
    },
    {
      lines: [N("It's not a fair fight."), N("It's you... against them.")],
      actors: [floor(), zero([{ x: 420, face: 0, look: [8, 0] }, { l: 1, t: 1.1, face: 9, squash: 0.97 }]), ...apps()],
      cam: [{ z: 1 }, { end: 0, z: 1.08, x: 900 }],
      sfx: [sfx('dun', 0.3, { l: 1 }), sfx('gulp', 1.3, { l: 1 })],
    },
    // ---------------- 6:30 the surprising part ----------------
    {
      lines: [N('So ZERO has a plan.'), N("He just won't touch it."), N('Easy.'), N('Right?')],
      actors: [...deskSet(),
        prop('phone', [{ x: 735, y: 745, s: 0.3, r: -90, down: true }], { id: 'ph', z: 7 }),
        zero([{ x: 860, pose: 'reach', hr: [60, 140], face: 0 }, { l: 0, t: 1.0, pose: 'proud', hr: null, face: 2 }, { l: 3, t: 0.2, face: 0, look: [-6, 2] }]),
        pix([{ x: 1500, y: 330, s: 0, face: 7 }, { l: 3, t: -0.2, s: 2.2, e: 'pop' }, { l: 3, t: 0.4, x: 1460 }, { l: 3, t: 0.6, x: 1540 }, { l: 3, t: 0.8, x: 1460 }, { l: 3, t: 1.0, x: 1500 }]),
      ],
      sfx: [sfx('thud', 0.9, { l: 0, g: 0.4 }), sfx('pix-ting', -0.1, { l: 3, g: 0.4 })],
    },
    {
      lines: [N('In 2017, researchers at the University of Texas gave people tests that needed focus.'), N('Some had their phone on the desk, face down.'), N('Some in a pocket or a bag.'), N('Some in another room.')],
      actors: [floor(),
        blue('UNIVERSITY OF TEXAS · 2017', 960, 120, 0.4, { size: 60 }),
        ...[300, 860, 1420].map((x, i) => [
          prop('desk', { x, y: G - 120, w: 300, legs: 98, s: 1 }, { id: 'd' + i, z: 6 }),
          zero({ x: x - 30, s: 1.6, pose: 'type', face: 0, look: [0, 4] }, { id: 'z' + i }),
          popIn('text', { l: i + 1, t: 0.1 }, { x, y: 400, txt: String(i + 1), size: 80 }, { z: 9 }),
        ]).flat(),
        prop('phone', [{ x: 400, y: G - 133, s: 0.22, r: -90, down: true, aura: 0 }, { l: 1, t: 0.6, aura: 1 }]),
        prop('wall', { x: 1680, y: G, w: 18, h: 640 }),
        prop('phone', [{ x: 1820, y: G - 30, s: 0.24, r: -90, down: true, o: 0 }, { l: 3, t: 0.3, o: 1, e: 'step' }]),
      ],
      sfx: [sfx('pop', 0.1, { l: 1 }), sfx('pop', 0.1, { l: 2 }), sfx('pop', 0.1, { l: 3 })],
    },
    {
      lines: [N('The people with the phone in another room did best.'), N('Even when the phone was silent and face down, just having it nearby took away some of their brainpower.')],
      actors: [floor(),
        ...[300, 860, 1420].map((x, i) => [
          prop('desk', { x, y: G - 120, w: 300, legs: 98 }, { id: 'd' + i, z: 6 }),
          zero([{ x: x - 30, s: 1.6, pose: 'type', face: i === 2 ? 2 : 0, look: [0, 4] }, ...(i === 0 ? [{ l: 1, t: 1.2, face: 11 }] : [])], { id: 'z' + i }),
        ]).flat(),
        prop('phone', [{ x: 400, y: G - 133, s: 0.22, r: -90, down: true, aura: 1 }]),
        prop('wall', { x: 1680, y: G, w: 18, h: 640 }),
        prop('phone', { x: 1820, y: G - 30, s: 0.24, r: -90, down: true }),
        popIn('text', { l: 0, t: 0.8 }, { x: 1420, y: 400, txt: '★ BEST', size: 70, color: '#FFC93C', stroke: 4 }, { z: 9 }),
      ],
      sfx: [sfx('cheer', 0.8, { l: 0, g: 0.4 })],
    },
    {
      lines: [N('Part of your brain is busy...'), N('not checking it.', { gap: 0.1 })],
      actors: [...brainSet({ workers: false }),
        prop('door', [{ x: 1140, y: 910, open: 0.25 }, { u: 0.5, open: 0.1 }, { u: 1, open: 0.3 }]),
        prop('phone', { x: 1260, y: 810, s: 0.4 }, { z: 1 }),
        prop('worker', [{ x: 960, y: 900, s: 1, pose: 'push', face: 9, lean: 12 }, { u: 0.5, lean: 16 }, { u: 1, lean: 10 }], { z: 3 }),
        yellow('RESISTING COSTS ENERGY', 960, 200, { l: 1, t: 0.2 }, { size: 78 }),
      ],
      cam: [{ shake: 2 }],
      sfx: [sfx('tension', 0.2)],
    },
    {
      lines: [PX("Your phone doesn't need to ring to steal your attention."), PX('It just needs to be there.')],
      actors: [...deskSet(),
        prop('phone', [{ x: 735, y: 745, s: 0.3, r: -90, down: true }, { l: 1, t: 1.0, x: 700 }, { l: 1, t: 1.8, x: 660 }, { end: 0.3, x: 610 }], { id: 'ph', z: 7 }),
        zero([{ x: 860, pose: 'type', face: 4, look: [-8, 3] }, { l: 1, t: 0.8, pose: 'push', hr: [40, 150], e: 'out' }, { l: 1, t: 1.0, hr: [60, 150] }, { l: 1, t: 1.6, hr: [30, 150] }, { l: 1, t: 1.8, hr: [60, 150] }, { end: 0.5, hr: [20, 150] }, { end: 0.3, hr: [60, 150] }], { flipNote: true }),
        pix({ x: 1520, y: 300, s: 2.2, face: 3 }),
      ],
      sfx: [sfx('click', 1.0, { l: 1 }), sfx('click', 1.8, { l: 1 }), sfx('click', 0, { end: 0.3 })],
    },
    // ---------------- 8:00 conclusion ----------------
    {
      lines: [N('So what can you do?'), N('Put the phone in another room.'), N("Turn off every notification that doesn't come from a real person."), N('And try grayscale mode: suddenly Instagram looks like a newspaper from 1940.')],
      cam: [{ gray: 0 }, { l: 3, t: 1.2, gray: 0 }, { l: 3, t: 2.4, gray: 1 }],
      actors: [floor(),
        zero([{ x: 700, pose: 'phone', holdR: held({ screen: '', feed: 3 }), face: 0 }, { l: 1, t: 0.2, pose: 'point', holdR: null }, { l: 3, t: 0, pose: 'phone', holdR: held({ feed: 3 }) }, { l: 3, t: 2.6, face: 11 }]),
        prop('wall', [{ x: 1500, y: G, h: 0, w: 18 }, { l: 1, t: 0.2, h: 640 }, { l: 2, t: 0, h: 640 }, { l: 2, t: 0.3, h: 0 }]),
        prop('phone', [{ x: 1720, y: G - 30, s: 0.26, r: -90, o: 0 }, { l: 1, t: 0.5, o: 1, e: 'step' }, { l: 2, t: 0.1, o: 0, e: 'step' }]),
        popIn('notif', { l: 2, t: 0.1 }, { x: 1300, y: 420, txt: 'Notifications: OFF', size: 46, w: 640, icon: '#9A9A9A' }, { z: 9, out: 0 }),
        prop('phone', [{ x: 1300, y: 540, s: 0, feed: 2, dot: 1, screen: '' }, { l: 3, t: 0.2, s: 1.6, e: 'pop' }]),
      ],
      sfx: [sfx('whoosh', 0.2, { l: 1 }), sfx('click', 0.2, { l: 2 }), sfx('dun', 2.4, { l: 3, g: 0.5 })],
    },
    {
      lines: [N("So your phone isn't addictive by accident."), N("It's designed around a brain that loves unpredictable rewards."), PX('Now you know.')],
      actors: [floor(), zero({ x: 760, face: 5, look: [0, -6], pose: 'think' }), pix([{ x: 1400, y: 380, s: 2.4, face: 3 }, { l: 2, t: 0, face: 3 }]),
        yellow('UNPREDICTABLE REWARDS', 960, 170, { l: 1, t: 0.3 }, { size: 80 })],
    },
    // ---------------- 8:30 gag ----------------
    {
      pre: 0.6,
      lines: [PX('Finally.', { at: 2.6 })],
      actors: [...deskSet(),
        prop('phone', [{ x: 760, y: 690, s: 0.3, r: 0, o: 0 }, { t: 1.6, o: 1, e: 'step' }, { t: 2.2, y: 745, r: -90 }], { id: 'ph', z: 7 }),
        zero([{ x: 860, pose: 'phone', holdR: held({ screen: '' }), face: 0, look: [-4, 4] }, { t: 0.4, hr: [70, 120] }, { t: 1.6, hr: [40, 150], holdR: null }, { t: 2.2, pose: 'proud', hr: null, face: 2 }]),
        pix({ x: 1520, y: 300, s: 2.2, face: 4 }),
      ],
      sfx: [sfx('thud', 2.2, { g: 0.4 })],
    },
    {
      min: 4.6,
      lines: [PX("We're doomed.", { at: 3.4 })],
      actors: [...deskSet(),
        prop('phone', [{ x: 735, y: 745, s: 0.3, r: -90, dot: 0 }, { t: 1.9, dot: 1, buzz: 1, e: 'pop' }, { t: 2.3, buzz: 0 }]),
        zero([{ x: 860, pose: 'proud', face: 2 }, { t: 2.0, face: 3, look: [-8, 2] }, { t: 2.3, x: 880, y: G - 260, r: -60, pose: 'run', face: 3, e: 'out' }, { t: 2.6, x: 912, y: 640, r: -90, pose: 'cover', face: 10, e: 'in' }]),
        pix([{ x: 1520, y: 300, s: 2.2, face: 4 }, { t: 2.8, face: 1, x: 1450, y: 420, s: 2.8 }]),
      ],
      sfx: [sfx('ping', 1.9), sfx('whoosh', 2.05), sfx('thud', 2.55)],
    },
    // end: black + symbol + boop, then the next video
    {
      min: 1.6,
      bg: '#111111',
      actors: [popIn('logo', 0.25, { x: 960, y: 560, s: 2.2, sw: 6 })],
      sfx: [sfx('zero-boop', 0.25), sfx('pix-ting', 0.75, { g: 0.6 })],
    },
    {
      min: 8,
      lines: [N('If you want to know why your brain procrastinates too, ZERO already found out.')],
      actors: [floor(), zero([{ x: 960, face: 0, pose: 'present' }, { l: 0, t: 2.5, pose: 'point', look: [8, -2] }]),
        popIn('qmark', 0.3, { x: 1180, y: 380, size: 160 })],
    },
  ],
};
export default ep;

// ---------- visual direction pass (docs/direccion-visual.md) ----------
// Sets by chapter, integrated transitions at the chapter turns and a slow purposeful push on long explanations.
import { room, minimal, space, casino, lab } from '../../src/sets.mjs';
{
  const B = ep.beats;
  const swap = (i, set) => { B[i].actors = [...set, ...B[i].actors.filter(a => a.id !== 'floor')]; };
  const tr = (i, spec) => { B[i].tout = spec; B[i + 1].tin = spec; };
  swap(2, room({ night: true }));
  swap(3, space()); B[3].bg = '#241C3A';
  swap(7, minimal());
  swap(9, space()); B[9].bg = '#241C3A';
  for (const i of [10, 11, 12]) swap(i, minimal({ wall: '#DCE8F7', floor: '#CCDBEE', trim: '#EAF1FA' }));   // blue: technology
  for (const i of [13, 16, 17]) swap(i, casino());
  swap(14, lab({ board: false })); swap(15, lab({ board: false }));
  for (const i of [27]) swap(i, minimal({ wall: '#E3F2E8', floor: '#D3E8DA', trim: '#EEF8F1' }));              // green: what helps
  swap(32, room());
  B[1].bg = '#241C3A';
  tr(2, { type: 'fall', dur: 0.7 });
  tr(4, { type: 'zoom', x: 960, y: 500, z: 9, dur: 0.6, color: '#FFFFFF' });
  tr(8, { type: 'fall', dur: 0.7 });
  tr(12, { type: 'iris', x: 960, y: 560, dur: 0.5 });
  tr(13, { type: 'wipe', dur: 0.5 });
  tr(15, { type: 'wipe', dur: 0.5 });
  tr(17, { type: 'iris', x: 960, y: 560, dur: 0.5 });
  tr(21, { type: 'wipe', dur: 0.5 });
  tr(24, { type: 'zoom', x: 960, y: 500, z: 9, dur: 0.6, color: '#FFFFFF' });
  tr(26, { type: 'wipe', dur: 0.5 });
  tr(28, { type: 'iris', x: 960, y: 560, dur: 0.5 });
  for (const [i, b] of B.entries()) if (!b.cam && (b.lines || []).length >= 2 && i !== 9) b.cam = [{ z: 1, x: 960, y: 540 }, { u: 1, z: 1.07, x: 960, y: 560, e: 'io' }];
}
