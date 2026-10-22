// Long video 2: "Why You Always Procrastinate (It's Not Laziness)" (pillar: brain & behaviour)
// Sources: Tim Pychyl (Carleton University) on procrastination as emotion regulation; Wohl, Pychyl & Bennett (2010) on
// self-forgiveness; Ersner-Hershfield et al. (2009) on the future self; present bias / temporal discounting.
import { G, ZS, N, PX, Z0, zero, pix, prop, floor, popIn, text, yellow, blue, red, deskSet, brainSet, sfx } from '../../src/kit.mjs';

const broom = { type: 'broom', s: 0.38 };
const sweep = (n, t0 = 0, dt = 0.5) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hr: [118, 106], lean: -4, e: 'io' }, { t: t0 + i * dt + dt / 2, hr: [146, 110], lean: 4, e: 'io' }]).flat();
const typing = (n, t0 = 0, dt = 0.18) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hl: [100, 136], hr: [126, 142], e: 'in' }, { t: t0 + i * dt + dt / 2, hl: [100, 142], hr: [126, 136] }]).flat();
const NIGHT = '#2B2F4A';
// ZERO's room: desk, laptop, the sticky note on the wall
const room = (o = {}) => [
  ...deskSet(),
  prop('sticky', [{ x: 1520, y: 330, s: 1.1, txt: o.note ?? 'ESSAY|DUE|TOMORROW', tilt: -5, fill: o.noteFill }, ...(o.noteKeys || [])], { id: 'note', z: 2 }),
];
const future = (k, o = {}) => zero(Array.isArray(k) ? k.map((x, i) => i ? x : { o: 0.5, ...x }) : { o: 0.5, ...k }, { id: o.id || 'fz' });
const futureLabel = (x, y, at = 0.2) => blue('FUTURE ZERO', x, y, at, { size: 54 });

const ep = {
  id: '002-procrastinate',
  format: 'long',
  title: "Why You Always Procrastinate (It's Not Laziness)",
  description: `Why do you leave things for later, even when you know it will hurt? ZERO had an essay due tomorrow. He cleaned the whole house instead.

In this video:
0:00 Just five minutes
0:37 You're not lazy
1:06 It's a feeling problem
2:22 Now vs. later
3:09 The planning fallacy
3:35 Future ZERO
4:24 Panic, guilt and the loop
5:06 What actually helps

ZERO is trying to understand humans. Subscribe and he'll keep trying.

Sources: Tim Pychyl, Carleton University (procrastination as emotion regulation); Wohl, Pychyl & Bennett (2010), self-forgiveness and procrastination; Ersner-Hershfield et al. (2009), neural basis of the future self; present bias research in behavioral economics.`,
  tags: ['procrastination', 'psychology', 'productivity', 'motivation', 'animation', 'why do we', 'ZERO'],
  category: 'EDUCATION',
  music: 'curious',
  musicGain: 0.11,
  thumb: {
    bg: '#FFFFFF',
    actors: [
      floor(),
      prop('sticky', { x: 360, y: 300, s: 1.5, txt: 'ESSAY|DUE|TOMORROW', tilt: -8 }, { z: 2 }),
      zero({ x: 760, y: 1010, s: 3.4, pose: 'neutral', hr: [118, 106], holdR: broom, face: 2, lean: -4 }),
      prop('text', { x: 1440, y: 420, txt: 'NOT', size: 170 }, { z: 9 }),
      prop('text', { x: 1440, y: 620, txt: 'LAZY?', size: 210, color: '#E63946', stroke: 6 }, { z: 9 }),
      pix({ x: 1660, y: 860, s: 2.4, face: 5 }),
    ],
  },
  beats: [
    // ---------------- 0:00 cold open ----------------
    {
      pre: 0.8, min: 3.4,
      lines: [Z0('Okay. Focus.', { at: 1.0 })],
      actors: [...room(),
        zero([{ x: 860, pose: 'type', face: 0, look: [6, 1] }, ...typing(4, 0.1), { t: 2.2, look: [9, -6], face: 4, headR: 4 }, { t: 3.0, look: [6, 1], face: 1, headR: 0 }])],
      sfx: [sfx('type', 0.1), sfx('tick', 2.2, { g: 0.4 })],
    },
    { min: 1.4, actors: [popIn('card', 0, { x: 960, y: 540, txt: '5 MINUTES LATER', size: 100 })], sfx: [sfx('whoosh', 0)] },
    {
      min: 4.2,
      lines: [PX('The essay?', { at: 2.4 })],
      actors: [...room({ messy: false }),
        zero([{ x: 520, pose: 'neutral', hr: [118, 106], holdR: broom, face: 2, look: [-4, 4] }, ...sweep(9)]),
        pix([{ x: 1520, y: 330, s: 0, face: 5 }, { t: 2.0, s: 2.2, e: 'pop' }])],
      sfx: [sfx('swipe', 0.3, { g: 0.4 }), sfx('swipe', 1.3, { g: 0.4 }), sfx('swipe', 2.3, { g: 0.4 }), sfx('pix-ting', 2.2, { g: 0.4 })],
    },
    {
      min: 3.0,
      actors: [...room({ messy: false }),
        zero([{ x: 1400, pose: 'reach', hr: [150, 150], face: 2, look: [6, 6] }, { t: 1.2, hr: [156, 140] }, { t: 2.2, hr: [150, 150] }]),
        ...[0, 1, 2].map(i => prop('rect', [{ x: 1468 + i * 16, y: 740, w: 12, h: 20, rx: 6, fill: '#2F80ED', o: 0 }, { t: 0.4 + i * 0.25, o: 1, e: 'step' }, { t: 1.0 + i * 0.25, y: 840, o: 0, e: 'in' }], { z: 7 })),
        popIn('text', 0.6, { x: 960, y: 200, txt: 'WATERING A PLANT. AGAIN.', size: 64 }, { z: 9 })],
      sfx: [sfx('pop', 0.6)],
    },
    { min: 1.4, actors: [popIn('card', 0, { x: 960, y: 540, txt: '11 PM', size: 110, bg: '#E63946' })], sfx: [sfx('whoosh', 0), sfx('dun', 0.4)] },
    {
      bg: NIGHT, min: 3.2,
      actors: [...room({ note: 'ESSAY|DUE|IN 1 HOUR', noteFill: '#E63946' }),
        prop('clock', [{ x: 960, y: 180, txt: '23:04', ring: true }], { z: 3 }),
        zero([{ x: 860, pose: 'type', face: 9, look: [6, 1] }, ...typing(16, 0, 0.18)])],
      cam: [{ shake: 3 }],
      sfx: Array.from({ length: 6 }, (_, i) => sfx('type', i * 0.5)),
    },
    // ---------------- 0:15 question + promise ----------------
    {
      lines: [N('Why do you always leave things for later...'), N("even when you know it's going to hurt?", { gap: 0.1 })],
      actors: [floor(), zero([{ x: 960, pose: 'sad', face: 11 }, { l: 1, t: 0.6, face: 7 }]),
        popIn('qmark', { l: 1, t: 0.8 }, { x: 1200, y: 380, size: 170 })],
      cam: [{ z: 1, x: 960, y: 540 }, { u: 1, z: 1.2, x: 980, y: 600 }],
    },
    {
      lines: [N("Spoiler: it's not because you're lazy."), N("And it's not bad time management either."), N("It's something much stranger. And once you see it, you can actually beat it.")],
      actors: [floor(), zero([{ x: 960, face: 5, pose: 'think' }, { l: 2, t: 0.4, face: 6, pose: 'point' }]),
        red('LAZY?', 520, 330, { l: 0, t: 1.0 }, { size: 110 }),
        prop('rect', [{ x: 520, y: 330, w: 0, h: 14 }, { l: 0, t: 1.8, w: 0 }, { l: 0, t: 2.1, w: 380 }], { z: 10 }),
        red('BAD AT TIME?', 1420, 330, { l: 1, t: 0.6 }, { size: 96 }),
        prop('rect', [{ x: 1420, y: 330, w: 0, h: 14 }, { l: 1, t: 1.6, w: 0 }, { l: 1, t: 1.9, w: 620 }], { z: 10 })],
      cam: [{ z: 1 }, { l: 2, t: 0, z: 1 }, { end: 0.6, z: 1.1 }, { end: 0, z: 5, y: 500, e: 'in' }],
      sfx: [sfx('error', 1.8, { l: 0, g: 0.5 }), sfx('error', 1.6, { l: 1, g: 0.5 }), sfx('idea', 0.4, { l: 2, g: 0.5 }), sfx('whoosh', 0, { end: 0.6 })],
    },
    // ---------------- 0:25 you're not lazy ----------------
    {
      lines: [N('Look at ZERO. Does he look lazy to you?'), N('In one afternoon, he cleaned his room, organized his pens by color, and watered a plant that did not need water.')],
      actors: [...room({ messy: false }),
        zero([{ x: 700, pose: 'proud', face: 2 }, { l: 1, t: 0.2, pose: 'neutral', hr: [118, 106], holdR: broom }, ...sweep(6, 0.4).map(k => ({ ...k, l: 1 }))]),
        popIn('text', { l: 1, t: 1.6 }, { x: 420, y: 200, txt: 'ROOM: DONE', size: 64, color: '#2E9E5B', stroke: 3 }, { z: 9 }),
        popIn('text', { l: 1, t: 3.0 }, { x: 960, y: 200, txt: 'PENS: DONE', size: 64, color: '#2E9E5B', stroke: 3 }, { z: 9 }),
        popIn('text', { l: 1, t: 4.6 }, { x: 1500, y: 200, txt: 'PLANT: DONE', size: 64, color: '#2E9E5B', stroke: 3 }, { z: 9 })],
      sfx: [sfx('pop', 1.6, { l: 1 }), sfx('pop', 3.0, { l: 1 }), sfx('pop', 4.6, { l: 1 })],
    },
    {
      lines: [N('He did everything... except the one thing he actually had to do.'), PX('Classic.')],
      actors: [floor(),
        prop('mask', { op: 0.55 }, { z: 1 }),
        prop('glow', { x: 960, y: 520, rr: 330, op: 1 }, { z: 2 }),
        prop('paper', [{ x: 960, y: 520, s: 0, title: 'ESSAY', lines: 0 }, { t: 0.3, s: 1.3, e: 'back' }], { z: 3 }),
        zero([{ x: 1450, face: 1, look: [-8, -2] }], { z: 4 }),
        pix([{ x: 420, y: 330, s: 2.2, face: 1 }])],
      sfx: [sfx('pop', 0.3), sfx('dun', 0.5, { l: 1, g: 0.5 })],
    },
    {
      lines: [N('Psychologists even have a name for this: productive procrastination.'), N("You stay busy, so it doesn't feel like avoiding. But it is.")],
      actors: [floor(),
        yellow('PRODUCTIVE PROCRASTINATION', 960, 200, { l: 0, t: 1.4 }, { size: 86 }),
        zero([{ x: 760, pose: 'neutral', hr: [118, 106], holdR: broom, face: 2 }, ...sweep(12, 0.2, 0.6), { l: 1, t: 2.2, face: 1 }]),
        prop('paper', [{ x: 1300, y: 700, s: 0.8, title: 'ESSAY', lines: 0, tilt: 6 }], { z: 3 }),
        prop('cloud', [{ x: 1300, y: 420, s: 0, mood: 0 }, { l: 1, t: 1.4, s: 0.6, e: 'back' }], { z: 4 })],
      sfx: [sfx('pop', 1.4, { l: 0 }), sfx('tension', 1.4, { l: 1, g: 0.6 })],
    },
    // ---------------- 1:10 it's a feeling ----------------
    {
      lines: [N("People who study procrastination, like psychologist Tim Pychyl, say the problem usually isn't time."), N("It's feelings.")],
      actors: [floor(),
        blue('TIM PYCHYL · CARLETON UNIVERSITY', 960, 140, 0.6, { size: 56 }),
        prop('clock', [{ x: 620, y: 520, txt: 'TIME?' }, { l: 1, t: 0, s: 1 }, { l: 1, t: 0.4, s: 0, e: 'in' }], { z: 3 }),
        prop('heart', [{ x: 1300, y: 520, s: 0 }, { l: 1, t: 0.3, s: 2.6, e: 'pop' }], { z: 3 }),
        yellow('FEELINGS', 1300, 800, { l: 1, t: 0.5 }, { size: 110 })],
      sfx: [sfx('pop', 0.3, { l: 1 }), sfx('dato', 0.5, { l: 1, g: 0.6 })],
    },
    {
      lines: [N('Think about it. Nobody procrastinates on eating pizza.'), N('We only put off the things that feel bad to start.')],
      actors: [floor(),
        zero([{ x: 560, face: 10, pose: 'celebrate' }, { l: 1, t: 0, face: 1, pose: 'neutral', look: [8, 0] }]),
        yellow('PIZZA? RIGHT NOW.', 560, 220, { l: 0, t: 1.4 }, { size: 74 }),
        popIn('heart', { l: 0, t: 1.6 }, { x: 760, y: 420, s: 1.2 }, { z: 9 }),
        prop('paper', [{ x: 1380, y: 620, s: 0, title: 'ESSAY', lines: 0 }, { l: 1, t: 0.3, s: 0.9, e: 'back' }], { z: 3 }),
        prop('cloud', [{ x: 1380, y: 330, s: 0, mood: 0 }, { l: 1, t: 1.4, s: 0.6, e: 'back' }], { z: 4 }),
        blue('LATER...', 1380, 150, { l: 1, t: 2.0 }, { size: 74 })],
      sfx: [sfx('cheer', 1.4, { l: 0, g: 0.4 }), sfx('pop', 0.3, { l: 1 }), sfx('dun', 2.0, { l: 1, g: 0.5 })],
    },
    {
      lines: [N('Some tasks come with a bad feeling attached.'), N('Boredom. Fear of doing it wrong. No idea where to start.'), N('So when ZERO looks at his essay... he sees this.')],
      actors: [floor(),
        prop('paper', [{ x: 960, y: 560, s: 1.2, title: 'ESSAY', lines: 0 }, { l: 2, t: 1.6, s: 1.2 }, { l: 2, t: 1.9, s: 0, e: 'in' }], { z: 3 }),
        popIn('bubble', { l: 1, t: 0.1 }, { x: 420, y: 260, txt: 'BORING', size: 50, w: 300 }, { z: 9 }),
        popIn('bubble', { l: 1, t: 1.0 }, { x: 1500, y: 260, txt: 'WHAT IF IT\'S BAD?', size: 46, w: 520, tail: 'r' }, { z: 9 }),
        popIn('bubble', { l: 1, t: 2.4 }, { x: 960, y: 140, txt: 'WHERE DO I START?', size: 46, w: 520 }, { z: 9 }),
        prop('cloud', [{ x: 960, y: 560, s: 0, mood: 0 }, { l: 2, t: 1.8, s: 1.8, e: 'back' }], { z: 4 }),
        zero([{ x: 1520, face: 0, look: [-8, -2] }, { l: 2, t: 2.0, face: 9, squash: 0.97 }])],
      cam: [{ shake: 0 }, { l: 2, t: 1.9, shake: 6 }, { l: 2, t: 2.4, shake: 0 }],
      sfx: [sfx('pop', 0.1, { l: 1 }), sfx('pop', 1.0, { l: 1 }), sfx('pop', 2.4, { l: 1 }), sfx('thud', 1.8, { l: 2 }), sfx('tension', 2.0, { l: 2 })],
    },
    {
      lines: [N('And your brain has one very simple rule.'), N('Bad feeling? Get away from it.')],
      actors: [floor(),
        prop('cloud', [{ x: 760, y: 420, s: 1.4, mood: 0 }, { l: 1, t: 0.6, x: 900 }, { end: 0, x: 1400 }], { z: 4 }),
        zero([{ x: 1100, face: 9, look: [-8, -4] }, { l: 1, t: 0.4, pose: 'run', flip: true, face: 9 }, { l: 1, t: 0.6, x: 1250 }, { end: 0, x: 2200, e: 'in' }]),
        prop('lines', [{ x: 1320, y: 760, o: 0 }, { l: 1, t: 0.6, o: 1 }], { z: 6 })],
      sfx: [sfx('whoosh', 0.6, { l: 1 }), sfx('boing', 0.4, { l: 1, g: 0.5 })],
    },
    {
      lines: [N('So you open a video. Or clean. Or check your phone.'), N('And instantly... relief.')],
      actors: [floor(),
        zero([{ x: 960, pose: 'phone', holdR: { type: 'phone', s: 0.24, screen: '' }, face: 0 }, { l: 1, t: 0.8, face: 2 }]),
        prop('cloud', [{ x: 1500, y: 300, s: 0.9, mood: 0 }, { l: 1, t: 0.6, o: 1 }, { l: 1, t: 1.4, o: 0, x: 1900 }], { z: 4 }),
        popIn('like', { l: 1, t: 0.8 }, { x: 1240, y: 360 }, { z: 9 }),
        prop('confetti', [{ x: 1240, y: 360, k: 0, o: 0 }, { l: 1, t: 0.85, o: 1, e: 'step' }, { l: 1, t: 2.0, k: 1, e: 'out' }], { z: 8 })],
      sfx: [sfx('swipe', 0.8, { l: 0 }), sfx('coin', 0.8, { l: 1 }), sfx('cheer', 0.85, { l: 1, g: 0.4 })],
    },
    {
      lines: [N('That relief feels like a reward.'), N('And whatever gets rewarded, your brain repeats.'), N('So next time the essay shows up, ZERO runs away even faster.')],
      actors: [floor(), zero({ x: 960, face: 1, pose: 'phone', holdR: { type: 'phone', s: 0.24, screen: '' } }),
        prop('orbit', [{ x: 960, y: 520, rr: 470, words: ['TASK', 'BAD FEELING', 'ESCAPE', 'RELIEF'], a: 0, size: 60, hi: 1 }, { l: 1, t: 0, a: 3 }, { end: 0, a: 22, e: 'in' }], { z: 7 })],
      cam: [{ z: 1 }, { end: 0, z: 1.12, shake: 3 }],
      sfx: [sfx('whoosh', 0.2, { l: 2 }), sfx('whoosh', 1.4, { l: 2 })],
    },
    {
      lines: [N("And if this sounds like you, you're far from alone."), N('Researchers estimate that about one in five adults are chronic procrastinators.'), N('Among students, it is most of them.')],
      actors: [floor(),
        ...[360, 660, 960, 1260, 1560].map((x, i) => zero([{ x, y: G, s: 1.6, face: i === 2 ? 11 : 0, o: 0 }, { l: 0, t: 0.3 + i * 0.15, o: 1, e: 'step' }, ...(i === 2 ? [{ l: 1, t: 0.6, face: 11 }] : []), { l: 2, t: 0.4 + i * 0.1, face: i === 1 ? 0 : 11 }], { id: 'c' + i })),
        prop('rect', [{ x: 960, y: 700, w: 230, h: 470, rx: 30, fill: 'none', stroke: 0 }, { l: 1, t: 0.6, stroke: 9 }], { z: 3 }),
        yellow('1 IN 5', 960, 220, { l: 1, t: 0.6 }, { size: 110 }),
        blue('STUDENTS: MOST', 960, 360, { l: 2, t: 0.3 }, { size: 80 })],
      sfx: [sfx('pop', 0.6, { l: 1 }), sfx('pop', 0.3, { l: 2 })],
    },
    {
      lines: [PX("So you're not avoiding the essay."), PX("You're avoiding how the essay makes you feel.")],
      actors: [floor(), zero({ x: 700, face: 5, pose: 'think', look: [6, -4] }), pix([{ x: 1300, y: 420, s: 2.6, face: 3 }])],
    },
    // ---------------- 2:40 now vs later ----------------
    {
      pre: 1.0,
      lines: [N("Inside your brain, there's a kind of tug of war."), N('One part wants to feel good right now.'), N('Another part can plan for the future.')],
      cam: [{ z: 1.2, flash: 0.9 }, { t: 0.5, z: 1, flash: 0 }],
      actors: [...brainSet({ workers: false }),
        prop('rect', [{ x: 960, y: 780, w: 0, h: 10 }, { l: 0, t: 1.4, w: 520 }], { z: 2 }),
        prop('worker', [{ x: 760, y: 900, s: 1.2, pose: 'push', face: 8, lean: -14, flip: true }, { u: 0.5, lean: -18 }, { u: 1, lean: -12 }], { z: 3 }),
        prop('worker', [{ x: 1160, y: 900, s: 1.2, pose: 'push', face: 5, lean: 10 }, { u: 0.5, lean: 14 }, { u: 1, lean: 8 }], { z: 3 }),
        yellow('NOW!', 700, 300, { l: 1, t: 0.4 }, { size: 100 }),
        blue('LATER', 1220, 300, { l: 2, t: 0.4 }, { size: 90 })],
      sfx: [sfx('pop', 0.6), sfx('tension', 1.4, { l: 0 })],
    },
    {
      lines: [N('The planner is smart, but slow, and it gets tired easily.'), N('The "right now" part is fast, loud... and it usually wins.')],
      actors: [...brainSet({ workers: false }),
        prop('rect', [{ x: 960, y: 780, w: 520, h: 10 }, { l: 1, t: 1.8, x: 800 }], { z: 2 }),
        prop('worker', [{ x: 760, y: 900, s: 1.2, pose: 'push', face: 8, lean: -14, flip: true }, { l: 1, t: 1.8, x: 600, pose: 'celebrate', face: 2, lean: 0 }], { z: 3 }),
        prop('worker', [{ x: 1160, y: 900, s: 1.2, pose: 'push', face: 11, lean: 10 }, { l: 0, t: 2.0, pose: 'sad', lean: 18 }, { l: 1, t: 1.8, x: 980, r: -80, y: 920 }], { z: 3 }),
        popIn('zzz', { l: 0, t: 2.4 }, { x: 1200, y: 700, size: 54 })],
      sfx: [sfx('thud', 1.8, { l: 1 }), sfx('cheer', 1.9, { l: 1, g: 0.4 })],
    },
    {
      lines: [N('Scientists see this with a simple question.'), N('Would you rather have 100 dollars today...'), N('or 110 dollars in one month?', { gap: 0.15 })],
      actors: [floor(),
        prop('tag', [{ x: 480, y: 420, s: 0, txt: '$100 TODAY', size: 42 }, { l: 1, t: 0.4, s: 1.5, e: 'back' }], { z: 4 }),
        prop('tag', [{ x: 1440, y: 420, s: 0, txt: '$110 IN 1 MONTH', size: 30, fill: '#FFF6DA' }, { l: 2, t: 0.4, s: 1.5, e: 'back' }], { z: 4 }),
        zero([{ x: 960, face: 5, pose: 'think' }, { l: 1, t: 0.4, look: [-9, -6] }, { l: 2, t: 0.4, look: [9, -6] }])],
      sfx: [sfx('pop', 0.4, { l: 1 }), sfx('pop', 0.4, { l: 2 })],
    },
    {
      lines: [N('Many people grab the money today, even though waiting just one month pays ten percent more.'), N('Rewards in the future simply feel smaller. Economists call it present bias.')],
      actors: [floor(),
        prop('tag', [{ x: 480, y: 420, s: 1.5, txt: '$100 TODAY', size: 42 }, { l: 0, t: 1.0, x: 700, y: 640, s: 0.8, e: 'io' }, { l: 0, t: 1.3, o: 0, e: 'step' }], { z: 4 }),
        prop('tag', [{ x: 1440, y: 420, s: 1.5, txt: '$110 IN 1 MONTH', size: 30, fill: '#FFF6DA' }, { l: 1, t: 0.6, s: 0.7, e: 'io' }], { z: 4 }),
        zero([{ x: 960, face: 5, pose: 'think' }, { l: 0, t: 0.8, pose: 'reach', hr: [60, 120], face: 2, flip: true }, { l: 0, t: 1.3, pose: 'proud', hr: null, flip: false, holdR: { type: 'tag', s: 0.22, txt: '$100' } }]),
        yellow('PRESENT BIAS', 960, 150, { l: 1, t: 1.6 }, { size: 96 })],
      sfx: [sfx('whoosh', 0.9, { l: 0 }), sfx('coin', 1.3, { l: 0 }), sfx('pop', 1.6, { l: 1 })],
    },
    {
      lines: [PX('Free money. Rejected.')],
      actors: [floor(), zero({ x: 760, face: 2, pose: 'proud', holdR: { type: 'tag', s: 0.22, txt: '$100' } }), pix([{ x: 1300, y: 420, s: 2.4, face: 1 }])],
      sfx: [sfx('pix-ting', 0.3, { g: 0.4 })],
    },
    // the planning fallacy
    {
      lines: [N('And your brain has one more trick.'), N('When ZERO makes a plan, he imagines everything going perfectly.'), N('The essay? One hour, tops.'), N('It took four.')],
      actors: [floor(),
        prop('board', [{ x: 1260, y: 520, s: 0, txt: 'PLAN|ESSAY: 1 HOUR|EASY', size: 58 }, { l: 1, t: 0.3, s: 1, e: 'back' }], { z: 3 }),
        prop('clock', [{ x: 1260, y: 160, s: 0, txt: '1:00' }, { l: 3, t: 0, s: 1, e: 'pop' }, { l: 3, t: 0.3, txt: '2:00', e: 'step' }, { l: 3, t: 0.6, txt: '3:00', e: 'step' }, { l: 3, t: 0.9, txt: '4:00', ring: true, e: 'step' }], { z: 4 }),
        zero([{ x: 560, face: 0, pose: 'neutral' }, { l: 1, t: 0.3, face: 2, pose: 'present' }, { l: 2, t: 0, pose: 'proud' }, { l: 3, t: 0.9, face: 11, pose: 'sad' }])],
      sfx: [sfx('pop', 0.3, { l: 1 }), sfx('tick', 0.3, { l: 3 }), sfx('tick', 0.6, { l: 3 }), sfx('buzz', 0.9, { l: 3 })],
    },
    {
      lines: [N('Psychologists call this the planning fallacy. We keep underestimating how long things take, even when we have been wrong before.'), N('So "I\'ll do it tomorrow" always sounds reasonable...'), N('every single day.', { gap: 0.1 })],
      actors: [floor(),
        yellow('PLANNING FALLACY', 960, 160, { l: 0, t: 1.4 }, { size: 96 }),
        ...[420, 760, 1100, 1440].map((x, i) => popIn('sticky', { l: i < 2 ? 1 : 2, t: 0.3 + (i % 2) * 0.6 }, { x, y: 470, s: 0.9, txt: 'START|TOMORROW', tilt: i % 2 ? 6 : -6 }, { z: 4 })),
        zero([{ x: 960, y: G, s: 2.2, face: 2, pose: 'proud' }, { l: 2, t: 1.0, face: 1 }])],
      sfx: [sfx('pop', 1.4, { l: 0 }), sfx('pop', 0.3, { l: 1 }), sfx('pop', 0.9, { l: 1 }), sfx('pop', 0.3, { l: 2 }), sfx('pop', 0.9, { l: 2 })],
    },
    // ---------------- 4:00 future ZERO ----------------
    {
      lines: [N('And then there is the strangest part of all: Future ZERO.'), N('When ZERO says "I\'ll do it tomorrow," he isn\'t really delaying the essay.'), N("He's handing it to someone else.")],
      actors: [floor(),
        zero([{ x: 560, face: 2, pose: 'present' }, { l: 2, t: 0, pose: 'push', hr: [150, 130] }, { l: 2, t: 1.2, pose: 'proud', hr: null }]),
        future([{ x: 1400, face: 0 }, { l: 2, t: 1.4, face: 4 }]),
        futureLabel(1400, 300, { l: 0, t: 1.6 }),
        prop('paper', [{ x: 780, y: 640, s: 0.45, title: 'ESSAY', lines: 0, tilt: -6 }, { l: 2, t: 0.2, x: 780 }, { l: 2, t: 1.2, x: 1230, tilt: 8, e: 'io' }], { z: 7 })],
      sfx: [sfx('pop', 1.6, { l: 0 }), sfx('whoosh', 0.3, { l: 2 })],
    },
    {
      lines: [N('In a study led by psychologist Hal Hershfield, people had their brains scanned while they thought about themselves...'), N('about a stranger...', { gap: 0.15 }), N('and about themselves ten years in the future.', { gap: 0.15 })],
      actors: [floor(),
        blue('HAL HERSHFIELD · 2009', 960, 120, 0.4, { size: 56 }),
        ...[[480, 'ME', 0], [960, 'A STRANGER', 1], [1440, 'ME IN 10 YEARS', 2]].map(([x, t, i]) => [
          prop('glow', [{ x, y: 500, rr: 0, op: 1 }, { l: i, t: 0.6, rr: 190, e: 'back' }], { id: 'gl' + i, z: 1 }),
          prop('logo', [{ x, y: 520, s: 0 }, { l: i, t: 0.3, s: 1.5, e: 'back' }], { id: 'lg' + i, z: 2 }),
          popIn('text', { l: i, t: 0.5 }, { x, y: 780, txt: t, size: 52 }, { z: 9 }),
        ]).flat()],
      sfx: [sfx('pop', 0.3, { l: 0 }), sfx('pop', 0.3, { l: 1 }), sfx('pop', 0.3, { l: 2 })],
    },
    {
      lines: [N('Thinking about your future self looked surprisingly similar to thinking about a stranger.'), N("To your brain, Future You is... kind of someone else.")],
      actors: [floor(),
        ...[[480, 'ME', '#FFC93C'], [960, 'A STRANGER', '#CFCFCF'], [1440, 'ME IN 10 YEARS', '#CFCFCF']].map(([x, t, c], i) => [
          prop('glow', { x, y: 500, rr: 190, op: 1 }, { z: 1 }),
          prop('logo', { x, y: 520, s: 1.5, fill: i === 0 ? '#FFC93C' : '#FFFFFF' }, { z: 2 }),
          prop('text', { x, y: 780, txt: t, size: 52 }, { z: 9 }),
        ]).flat(),
        yellow('=', 1200, 520, { l: 0, t: 2.2 }, { size: 200 }),
        prop('rect', [{ x: 1200, y: 520, w: 640, h: 360, rx: 40, fill: 'none', stroke: 0 }, { l: 0, t: 2.2, stroke: 8 }], { z: 3 })],
      sfx: [sfx('dato', 2.2, { l: 0, g: 0.6 })],
    },
    {
      lines: [N('So of course you leave the hard stuff for later.'), N("Later is somebody else's problem.")],
      actors: [floor(),
        zero([{ x: 520, face: 2, pose: 'proud' }]),
        future([{ x: 1400, face: 0 }, { l: 1, t: 0, face: 9 }, { end: 0.5, face: 11, squash: 0.95 }]),
        futureLabel(1400, 220, 0.2),
        ...Array.from({ length: 6 }, (_, i) => prop('paper', [{ x: 700, y: 560, s: 0, title: ['ESSAY', 'TAXES', 'EMAILS', 'GYM', 'DENTIST', 'LAUNDRY'][i], size: 46, lines: 0, tilt: (i % 2 ? 6 : -6) }, { t: 0.4 + i * 0.6, s: 0.4, e: 'pop' }, { t: 0.8 + i * 0.6, x: 1170, y: 800 - i * 40, e: 'io' }], { z: 7 + i * 0.01 }))],
      sfx: Array.from({ length: 6 }, (_, i) => sfx('whoosh', 0.8 + i * 0.6, { g: 0.4 })),
    },
    {
      lines: [PX('Future ZERO hates you, by the way.')],
      actors: [floor(), zero({ x: 520, face: 3, pose: 'proud' }), future({ x: 1400, face: 8 }), futureLabel(1400, 220, 0), pix([{ x: 960, y: 330, s: 2.2, face: 1 }])],
      sfx: [sfx('pix-ting', 0.2, { g: 0.4 })],
    },
    // ---------------- 5:00 panic, guilt, the loop ----------------
    {
      bg: NIGHT,
      lines: [N('Until the deadline gets close.'), N("Then a new feeling shows up, and it's stronger than boredom..."), N('panic.', { gap: 0.1 })],
      actors: [...room({ note: 'ESSAY|DUE|IN 1 HOUR', noteFill: '#E63946' }),
        prop('clock', [{ x: 960, y: 180, txt: '23:04' }, { l: 2, t: 0, ring: true }], { z: 3 }),
        prop('siren', [{ x: 1700, y: 760, s: 1.2, on: 0 }, ...Array.from({ length: 10 }, (_, i) => [{ l: 2, t: i * 0.3, on: 1, e: 'step' }, { l: 2, t: i * 0.3 + 0.15, on: 0, e: 'step' }]).flat()], { z: 3 }),
        zero([{ x: 860, pose: 'neutral', face: 1, look: [9, -6] }, { l: 2, t: 0, pose: 'scared', face: 9 }])],
      cam: [{ shake: 0 }, { l: 2, t: 0, shake: 7 }],
      sfx: [sfx('tick', 0.4, { l: 0 }), sfx('tick', 1.4, { l: 0 }), sfx('buzz', 0, { l: 2 }), sfx('buzz', 0.6, { l: 2 })],
    },
    {
      bg: NIGHT,
      lines: [N('Panic is finally bigger than the bad feeling, so you start.'), N('At eleven at night. With one hour left.')],
      actors: [...room({ note: 'ESSAY|DUE|IN 1 HOUR', noteFill: '#E63946' }),
        prop('clock', [{ x: 960, y: 180, txt: '23:04', ring: true }, { l: 1, t: 0.6, txt: '23:31', e: 'step' }, { end: 0.5, txt: '23:58', e: 'step' }], { z: 3 }),
        prop('paper', [{ x: 1720, y: 640, s: 0.7, title: 'ESSAY', lines: 0 }, { end: 0, lines: 1, e: 'lin' }], { z: 3 }),
        zero([{ x: 860, pose: 'type', face: 9, look: [6, 1] }, ...typing(40, 0, 0.16)])],
      cam: [{ shake: 3 }],
      sfx: Array.from({ length: 10 }, (_, i) => sfx('type', i * 0.6)),
    },
    {
      lines: [N('And it kind of works. You finish.'), N('But studies link chronic procrastination with more stress, worse sleep, and work that is... well... rushed.')],
      actors: [...deskSet(),
        zero([{ x: 860, pose: 'type', face: 2 }, { l: 1, t: 0, face: 11, pose: 'sad', lean: 10 }]),
        popIn('zzz', { l: 1, t: 1.0 }, { x: 700, y: 360, size: 64 }),
        red('STRESS', 420, 200, { l: 1, t: 2.0 }, { size: 80 }),
        red('LESS SLEEP', 960, 160, { l: 1, t: 2.6 }, { size: 80 }),
        red('RUSHED', 1500, 200, { l: 1, t: 4.4 }, { size: 80 })],
      sfx: [sfx('cheer', 0.4, { l: 0, g: 0.3 }), sfx('dun', 2.0, { l: 1, g: 0.5 }), sfx('dun', 2.6, { l: 1, g: 0.5 }), sfx('dun', 4.4, { l: 1, g: 0.5 })],
    },
    {
      lines: [N('Then comes guilt.'), N('And guilt is... another bad feeling.'), N('So next time, the task feels even worse, and you avoid it even more.')],
      actors: [floor(),
        zero([{ x: 960, face: 7, pose: 'sad' }]),
        prop('cloud', [{ x: 960, y: 230, s: 0.8, mood: 0, rain: 0 }, { l: 1, t: 0.4, s: 1.1, rain: 3, e: 'lin' }, { l: 2, t: 0, s: 1.3 }, { end: 0, s: 1.6, rain: 12, e: 'lin' }], { z: 7 }),
        prop('orbit', [{ x: 960, y: 620, rr: 560, words: ['AVOID', 'GUILT', 'WORSE FEELING'], a: 0, size: 60, hi: 1, o: 0 }, { l: 2, t: 0, o: 1 }, { end: 0, a: 16, e: 'in' }], { z: 8 })],
      sfx: [sfx('dun', 0.3, { l: 0 }), sfx('tension', 0.2, { l: 2 })],
    },
    {
      lines: [PX('A loop that feeds itself.')],
      actors: [floor(), zero({ x: 760, face: 7, pose: 'sad' }), prop('cloud', { x: 760, y: 260, s: 1.2, mood: 0, rain: 4 }, { z: 7 }), pix([{ x: 1400, y: 420, s: 2.4, face: 6 }])],
    },
    // ---------------- 6:10 what actually helps ----------------
    {
      lines: [N('So how do you break the loop?'), N('Not with more guilt. And not with a fancier calendar.')],
      actors: [floor(),
        prop('board', [{ x: 1260, y: 520, txt: 'NEW PLAN|WAKE UP 5 AM|37 TASKS', size: 58, r: 0 }, { l: 1, t: 1.6, r: 0 }, { l: 1, t: 2.2, r: 90, y: 880, e: 'in' }], { z: 3 }),
        zero([{ x: 520, face: 5, pose: 'think' }, { l: 1, t: 2.2, face: 3 }])],
      sfx: [sfx('thud', 2.2, { l: 1 })],
    },
    {
      lines: [N('Step one: forgive yourself.'), N('In a study at Carleton University, students who forgave themselves for procrastinating before their first exam procrastinated less before the next one.')],
      actors: [floor(),
        blue('CARLETON UNIVERSITY · 2010', 960, 130, { l: 1, t: 0.4 }, { size: 56 }),
        prop('cloud', [{ x: 1300, y: 300, s: 1.1, mood: 0, rain: 0 }, { l: 0, t: 1.2, s: 0.5, mood: 1, e: 'io' }], { z: 7 }),
        zero([{ x: 760, face: 7, pose: 'sad' }, { l: 0, t: 0.8, face: 2, pose: 'cover', hl: [124, 150], hr: [76, 150] }, { l: 1, t: 0, pose: 'neutral', hl: null, hr: null }]),
        popIn('heart', { l: 0, t: 1.0 }, { x: 760, y: 360, s: 1.6 }, { z: 9 }),
        prop('rect', [{ x: 1380, y: 650, w: 80, h: 0, fill: '#E63946', stroke: 5 }, { l: 1, t: 2.4, h: 300 }], { z: 3 }),
        prop('rect', [{ x: 1620, y: 650, w: 80, h: 0, fill: '#2E9E5B', stroke: 5 }, { l: 1, t: 4.8, h: 150 }], { z: 3 }),
        popIn('text', { l: 1, t: 2.4 }, { x: 1380, y: 880, txt: 'EXAM 1', size: 40 }, { z: 9 }),
        popIn('text', { l: 1, t: 4.8 }, { x: 1620, y: 880, txt: 'EXAM 2', size: 40 }, { z: 9 })],
      sfx: [sfx('pop', 1.0, { l: 0 }), sfx('pop', 2.4, { l: 1 }), sfx('coin', 4.8, { l: 1 })],
    },
    {
      lines: [N('Less guilt means less bad feeling. And less bad feeling means less running away.')],
      actors: [floor(), zero([{ x: 760, face: 0 }, { u: 0.6, face: 2 }]),
        prop('cloud', [{ x: 1250, y: 330, s: 1, mood: 0 }, { u: 0.8, s: 0.3, mood: 1, e: 'io' }], { z: 7 })],
    },
    {
      lines: [N('Step two: make the first step ridiculously small.'), N('Not "write the essay." Just "open the document."'), N("Your brain isn't afraid of opening a file.")],
      actors: [...room({ note: 'WRITE|THE|ESSAY', noteKeys: [{ l: 1, t: 2.0, txt: 'OPEN|THE|FILE', fill: '#DDEBFF', e: 'step' }] }),
        prop('cloud', [{ x: 1150, y: 430, s: 0.7, mood: 0 }, { l: 1, t: 2.0, s: 0.7 }, { l: 1, t: 2.6, s: 0.15, mood: 1, e: 'io' }], { z: 7 }),
        zero([{ x: 860, pose: 'type', face: 4, look: [6, 1] }, { l: 1, t: 2.0, face: 0 }, { l: 2, t: 0.6, face: 2 }])],
      sfx: [sfx('click', 2.0, { l: 1 }), sfx('idea', 2.1, { l: 1, g: 0.5 }), sfx('type', 0.6, { l: 2 })],
    },
    {
      lines: [N('Step three: start for just five minutes.'), N('Starting is the hardest part. Once you begin, the task usually looks smaller than it did from far away.'), N('And unfinished tasks tend to stay on your mind, so once you start, you often want to keep going.')],
      actors: [...room({ note: 'OPEN|THE|FILE', noteFill: '#DDEBFF' }),
        prop('clock', [{ x: 960, y: 180, txt: '05:00' }, { l: 0, t: 1.0, txt: '04:12', e: 'step' }, { l: 1, t: 0.8, txt: '02:30', e: 'step' }, { l: 2, t: 0, txt: '00:00', e: 'step' }, { l: 2, t: 1.4, txt: '+20 MIN', e: 'step' }], { z: 3 }),
        prop('paper', [{ x: 1720, y: 640, s: 0.7, title: 'ESSAY', lines: 0 }, { end: 0, lines: 0.75, e: 'lin' }], { z: 3 }),
        zero([{ x: 860, pose: 'type', face: 0, look: [6, 1] }, ...typing(30, 0.5, 0.3), { l: 2, t: 1.4, face: 2 }]),
        yellow('5 MINUTES', 960, 330, { l: 0, t: 0.8 }, { size: 80 })],
      sfx: [sfx('pop', 0.8, { l: 0 }), sfx('type', 0.5), sfx('type', 0.4, { l: 1 }), sfx('idea', 1.4, { l: 2, g: 0.5 })],
    },
    {
      lines: [N('Step four: make distractions a little harder to reach.'), N('Phone in another room. One tab. One task.')],
      actors: [floor(),
        zero([{ x: 700, pose: 'phone', holdR: { type: 'phone', s: 0.24, screen: '' }, face: 0 }, { l: 1, t: 0.2, pose: 'point', holdR: null }]),
        prop('wall', [{ x: 1500, y: G, h: 0, w: 18 }, { l: 1, t: 0.2, h: 640 }]),
        prop('phone', [{ x: 1720, y: G - 30, s: 0.26, r: -90, o: 0 }, { l: 1, t: 0.5, o: 1, e: 'step' }]),
        popIn('text', { l: 1, t: 1.6 }, { x: 960, y: 200, txt: '1 TAB · 1 TASK', size: 70 }, { z: 9 })],
      sfx: [sfx('whoosh', 0.2, { l: 1 }), sfx('pop', 1.6, { l: 1 })],
    },
    {
      lines: [N('And step five: be nice to Future ZERO.'), N('Picture him tomorrow, tired, with everything you left him.'), N('Then do one small thing for him today.')],
      actors: [floor(),
        zero([{ x: 520, face: 5, pose: 'think' }, { l: 2, t: 0.2, pose: 'present', face: 2 }]),
        future([{ x: 1400, face: 11, squash: 0.96 }, { l: 2, t: 1.4, face: 2, squash: 1 }]),
        futureLabel(1400, 220, 0.2),
        prop('paper', [{ x: 1250, y: 680, s: 0.4, title: 'ESSAY', lines: 0 }, { l: 2, t: 0.4, lines: 0.5 }]),
        popIn('heart', { l: 2, t: 1.4 }, { x: 1400, y: 360, s: 1.4 }, { z: 9 })],
      sfx: [sfx('pop', 1.4, { l: 2 }), sfx('cheer', 1.5, { l: 2, g: 0.3 })],
    },
    {
      lines: [N('It works with money too. In another study by Hershfield, people who saw an aged picture of themselves chose to save more for the future.'), N('Meeting Future You makes it easier to help him.')],
      actors: [floor(),
        prop('rect', [{ x: 1300, y: 470, w: 0, h: 0, fill: '#FFFFFF', stroke: 8, rx: 16 }, { l: 0, t: 1.6, w: 420, h: 520, e: 'back' }], { z: 3 }),
        future([{ x: 1300, y: 680, s: 1.6, face: 0, o: 0 }, { l: 0, t: 1.9, o: 0.5, e: 'step' }, { l: 1, t: 0.6, face: 2 }], { id: 'fz2' }),
        zero([{ x: 560, face: 0, look: [8, -2] }, { l: 0, t: 2.2, face: 3 }, { l: 1, t: 0.6, face: 2, pose: 'present' }]),
        prop('counter', [{ x: 560, y: 220, n: 100, label: 'SAVINGS', s: 0 }, { l: 0, t: 3.4, s: 1, e: 'back' }, { l: 0, t: 4.0, n: 100 }, { l: 1, t: 0, n: 160, e: 'out' }], { z: 6 })],
      sfx: [sfx('pop', 1.6, { l: 0 }), sfx('pop', 3.4, { l: 0 }), sfx('coin', 0, { l: 1 })],
    },
    // recap
    {
      lines: [N('So: forgive yourself.'), N('Make the first step tiny.', { gap: 0.15 }), N('Start for five minutes.', { gap: 0.15 }), N('Hide the distractions.', { gap: 0.15 }), N('And be nice to Future You.', { gap: 0.15 })],
      actors: [floor(),
        ...[['FORGIVE', 300], ['TINY STEP', 630], ['5 MIN', 960], ['NO PHONE', 1290], ['FUTURE YOU', 1620]].map(([t, x], i) => popIn('sticky', { l: i, t: 0.1 }, { x, y: 330, s: 0.95, txt: t, size: 36, tilt: i % 2 ? 5 : -5, fill: ['#FFC93C', '#DDEBFF', '#FFC93C', '#DDEBFF', '#FFC93C'][i] }, { z: 4 })),
        zero([{ x: 960, y: G, s: 2.2, face: 0, pose: 'neutral' }, { l: 4, t: 0.4, face: 2, pose: 'celebrate' }])],
      sfx: [0, 1, 2, 3, 4].map(i => sfx('pop', 0.1, { l: i })),
    },
    // ---------------- 7:30 conclusion ----------------
    {
      lines: [N("So procrastination isn't really a time problem."), N("It's a feeling problem. Your brain isn't lazy. It's protecting you from a bad feeling... a little too well."), PX('Now you know.')],
      actors: [floor(), zero({ x: 760, face: 5, look: [0, -6], pose: 'think' }), pix([{ x: 1400, y: 380, s: 2.4, face: 3 }]),
        yellow('A FEELING PROBLEM', 960, 170, { l: 1, t: 0.4 }, { size: 90 })],
    },
    // ---------------- gag ----------------
    {
      pre: 0.6, min: 5.4,
      lines: [PX('Humans...', { at: 4.0 })],
      actors: [...room({ note: 'OPEN|THE|FILE', noteFill: '#DDEBFF', noteKeys: [{ t: 2.0, txt: 'START|TOMORROW', fill: '#FFC93C', e: 'step' }] }),
        zero([{ x: 860, pose: 'type', face: 0, look: [6, 1] }, { t: 0.8, pose: 'think', face: 5, look: [9, -6] }, { t: 1.6, x: 1380, pose: 'reach', hr: [150, 70], face: 2, flip: false }, { t: 2.3, pose: 'proud', hr: null, face: 2 }]),
        pix([{ x: 400, y: 330, s: 2.2, face: 0 }, { t: 2.6, face: 1, s: 2.6 }])],
      sfx: [sfx('whoosh', 1.6), sfx('click', 2.0), sfx('pix-ting', 3.8, { g: 0.4 })],
    },
    // end: black + symbol + boop, then the next video
    {
      min: 1.6, bg: '#111111',
      actors: [popIn('logo', 0.25, { x: 960, y: 560, s: 2.2, sw: 6 })],
      sfx: [sfx('zero-boop', 0.25), sfx('pix-ting', 0.75, { g: 0.6 })],
    },
    {
      min: 7,
      lines: [N("And if you want to know why you can't put your phone down either... ZERO tried that too.")],
      actors: [floor(), zero([{ x: 960, face: 0, pose: 'present' }, { l: 0, t: 3.0, pose: 'point', look: [8, -2] }]),
        popIn('phone', 0.4, { x: 1320, y: 420, s: 1, dot: 1, screen: '' }, { z: 4 })],
    },
  ],
};
export default ep;

// ---------- visual direction pass (docs/direccion-visual.md) ----------
// The approved rule-compliant opening replaces the old first eight beats; chapter sets by colour meaning, integrated
// transitions at the chapter turns, a WOW (space) moment for the brain scan, slow pushes on long explanations.
import opening from './opening.mjs';
import { minimal as L1, space as L3 } from '../../src/sets.mjs';
{
  const B = ep.beats;
  const swap = (i, set) => { B[i].actors = [...set, ...B[i].actors.filter(a => a.id !== 'floor')]; };
  const tint = (wall, floor, trim) => L1({ wall, floor, trim });
  const CORAL = tint('#FBE3DF', '#F3D2CC', '#FDEFEC'), GREEN = tint('#E3F2E8', '#D3E8DA', '#EEF8F1'), PURPLE = tint('#ECE6F8', '#DDD3F0', '#F5F1FC'), CREAM = tint('#FFF4E3', '#EADCC6', '#F7EBD8');
  for (const i of [13, 14, 15, 34, 35]) swap(i, CORAL);          // the bad feeling, the loop
  for (const i of [21, 22, 23]) swap(i, CREAM);                  // money today vs later
  for (const i of [26, 29, 30]) swap(i, PURPLE);                 // Future ZERO, a stranger
  for (const i of [27, 28]) { swap(i, L3()); B[i].bg = '#241C3A'; }
  for (const i of [36, 37, 38, 41, 42, 43, 44]) swap(i, GREEN);  // what helps
  const tr = (i, spec) => { B[i].tout = spec; B[i + 1].tin = spec; };
  tr(9, { type: 'iris', x: 960, y: 560, dur: 0.5 });
  tr(18, { type: 'zoom', x: 960, y: 500, z: 9, dur: 0.6, color: '#FFFFFF' });
  tr(20, { type: 'wipe', dur: 0.5 });
  tr(23, { type: 'wipe', dur: 0.5 });
  tr(25, { type: 'iris', x: 960, y: 560, dur: 0.5 });
  tr(26, { type: 'fall', dur: 0.7 });
  tr(28, { type: 'fall', dur: 0.7 });
  tr(30, { type: 'wipe', dur: 0.5 });
  tr(33, { type: 'iris', x: 960, y: 560, dur: 0.5 });
  tr(35, { type: 'wipe', dur: 0.5 });
  tr(44, { type: 'iris', x: 960, y: 560, dur: 0.5 });
  for (const b of B) if (!b.cam && (b.lines || []).length >= 2 && !b.bg) b.cam = [{ z: 1, x: 960, y: 540 }, { u: 1, z: 1.07, x: 960, y: 560, e: 'io' }];
  // the opening (hook, time passing, night, the question in space, the promise) replaces beats 0-7 and zooms into "Look at ZERO"
  const open = opening.beats.slice(0, 5);
  B.splice(0, 8, ...open);
  B[5].tin = { type: 'zoom', x: 960, y: 540, z: 6, dur: 0.6, color: '#FFFFFF' };
}
