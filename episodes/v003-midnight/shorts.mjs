// The three Shorts of video 003 "What Your Credit Card Does at Midnight", built natively for 1080x1920 (not cut from the
// long video): one surprising number each, ZERO reacts, a punchline, and the last line loops into the first.
// The worlds are the long video's (ZERO's room at night, the café) seen through a tall camera: z 1.78 shows a 607 px
// slice of the 1920x1080 world at full height. Numbers are ui props in screen space (y 150-560); captions sit at y 1700.
//   night: the nightly rate, sixty cents while he sleeps          (Tuesday)
//   nickel: the 5¢ cash back vs the interest on its own coffee   (Thursday)
//   who:    who pays the interest and who gets the rewards        (Saturday)
import { G, N, zero, pix, sfx, cam, lookCam, shrug } from '../../src/kit.mjs';
import { P, vig, ui, cafe, hand, ZX, myRoom, ph, PH, ZX0 } from './common.mjs';
import full from './full.mjs';

const LONG = 'https://www.youtube.com/@zerounderstands';
const base = (id, title, about, tags, beats) => ({
  id: `v003-${id}`, format: 'short', captions: true, music: full.music, musicGain: full.musicGain,
  title, tags: ['shorts', 'how it works', 'credit cards', 'personal finance', ...tags],
  description: `${about}\n\nThe whole story of the midnight coin: ${LONG}\n\n#shorts #howitworks #creditcards`,
  beats,
});
const dim = (op = 0.35) => P('rect', { x: 540, y: 960, w: 2000, h: 3000, fill: '#050A18', op, ui: true }, 'dimui', 40);
const num = (id, txt, y, size, color, at, extra = {}) => P('text', [{ x: 540, y, txt, size, color, o: 0, ui: true, stroke: 5 }, { ...at, o: 1, e: 'step' }], id, 46, extra);
const note = (id, txt, y, at) => P('text', [{ x: 540, y, txt, size: 30, color: '#E6ECF5', o: 0, ui: true, stroke: 4 }, { ...at, o: 1, e: 'step' }], id, 46);

// ---------- Tuesday: the night room, the coin falls at midnight ----------
const HR = [140, 104];
const hold = (k = {}) => ({ x: ZX0, face: 0, pose: 'neutral', hr: HR, hl: [96, 130], look: [4, 6], ...k });
const NV = cam({ z: 1.78, x: 800, y: 700 });
const counter = (keys, o = {}) => ui(P('counterwall', [{ x: 540, y: 230, s: 0.95, cap: 'ZERO OWES', n: 975, dec: 2, k: 1, pre: '$', size: 120, color: '#FFD98A', w: 1000, ...o }, ...keys], 'bal', 46));

export const night = base('short-night', 'Why your balance goes up at midnight',
  'Your card checks the amount you owe every night: yearly rate ÷ 365, applied to the balance. 22.36% is the average rate on card accounts assessed interest (Federal Reserve G.19, Aug 2026); the $975 balance and the sixty cents a night are an illustration with that arithmetic.',
  ['credit card interest', 'APR', 'daily interest'], [
    { lines: [N('ZERO paid his bill, and his balance still went up at midnight.', { at: 0.2 }), N('Here is why.', { gap: 0.3 })], min: 5.4, bg: '#262A45', cam: NV,
      actors: [...myRoom({ clock: { h: 12, m: 0, run: false, sec: false } }),
        ph({ screen: 'BALANCE|$975.00|', fs: 20, screenY: 0 }, [{ t: 2.9, screen: 'BALANCE|$975.60|', e: 'step' }]),
        P('coin', [{ x: PH[0] - 10, y: 330, s: 1.5, roll: 0, o: 0, txt: '60¢', color: '#FFC93C' }, { t: 1.5, o: 0 }, { t: 1.6, o: 1, e: 'step' }, { t: 2.9, x: PH[0], y: PH[1] - 10, s: 0.5, roll: 360, e: 'in' }, { t: 3.05, o: 0, s: 0.1, e: 'step' }], 'coin', 8),
        P('pool', [{ x: PH[0], y: 500, rx: 220, ry: 260, kind: 'warm', op: 0 }, { t: 1.55, op: 0 }, { t: 2.0, op: 0.7, e: 'out' }, { t: 3.2, op: 0, e: 'in' }], 'cp', 5),
        counter([{ t: 2.95, n: 975.6, e: 'step' }]),
        zero([hold(), { t: 1.6, look: [10, -12], face: 3, headR: -6 }, { t: 2.9, look: [4, 6], face: 0, headR: 0 }, { t: 3.4, headR: 10, face: 4, e: 'out' }, ...lookCam({ l: 1, t: 0.1 }, { face: 1 })]), vig(0.5)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('chime', 1.5, { g: 0.5 }), sfx('whoosh', 1.6, { g: 0.5 }), sfx('coin', 2.9, { g: 0.6 })] },
    { lines: [N('Every night, your card takes the yearly rate: twenty-two point three six percent.', { at: 0.2 }), N('Divides it by three hundred sixty-five.', { gap: 0.3 }), N('Six hundredths of a percent.', { gap: 0.3 })], min: 10, bg: '#262A45', cam: NV,
      actors: [...myRoom({ clock: { h: 12, m: 0, run: false, sec: false } }), ph({ screen: 'BALANCE|$975.60|', fs: 20, screenY: 0 }), 
        num('d', '22.36% ÷ 365', 300, 120, '#FFD98A', { l: 0, t: 0.8 }), num('r', '= 0.0613% A DAY', 470, 84, '#8FF0B0', { l: 1, t: 1.4 }),
        zero([hold({ look: [4, -2] }), { l: 1, face: 2 }, ...shrug({ l: 2, t: 0.6 }, { face: 1 })]), vig(0.5)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('ping', 1.4, { l: 1, g: 0.4 })] },
    { lines: [N("On nine hundred seventy-five dollars, that's sixty cents.", { at: 0.2 }), N('Tonight. And tomorrow night.', { gap: 0.3 }), N('While you sleep.', { gap: 0.4 })], min: 8.5, bg: '#262A45', cam: NV,
      actors: [...myRoom({ clock: { h: 12, m: 0, run: false, sec: false } }), ph({ screen: 'BALANCE|$975.60|', fs: 20, screenY: 0 }),
        counter([{ l: 0, t: 1.2, n: 975.6, e: 'out' }, { l: 1, t: 0.6, n: 976.2, e: 'out' }, { l: 2, t: 0.2, n: 976.79, e: 'out' }], { n: 975.6 }),
        num('pn', '+60¢ A NIGHT', 460, 80, '#FFD98A', { l: 0, t: 1.2 }), note('src', 'ESTIMATE · 22.36% APR ON $975', 540, { l: 0, t: 1.4 }),
        zero([hold({ look: [8, -4], headR: 8, face: 4 }), { l: 1, face: 9 }, { l: 2, face: 4, headR: 10 }]), vig(0.5)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('roll', 0.4, { g: 0.35 }), sfx('coin', 1.2, { g: 0.5 }), sfx('coin', 0.6, { l: 1, g: 0.5 }), sfx('coin', 0.2, { l: 2, g: 0.5 })] },
  ]);

// ---------- Thursday: the café, the nickel and its own interest ----------
const CV = cam({ z: 1.78, x: 820, y: 640 });
const cardAt = (k, more = []) => P('zcard', [{ x: hand(ZX, G, [123, 124])[0], y: hand(ZX, G, [123, 124])[1], s: 0.62, tilt: -8, ...k }, ...more], 'card', 6);
const zc = (k = []) => zero([{ x: ZX, face: 2, pose: 'neutral', hl: [116, 124], hr: [130, 124], look: [6, -4] }, ...k]);
const coin = (id, txt, y, s, at, extra = []) => P('coin', [{ x: 540, y, s, txt, color: '#C9CED8', o: 0, ui: true }, { ...at, o: 1, e: 'step' }, ...extra], id, 47);

export const nickel = base('short-nickel', 'The cash back on your coffee lasts 17 days',
  "ZERO earns 5¢ of cash back on a $4.75 coffee (1%, an illustration). If he carries a balance at 22.36% APR (Federal Reserve G.19, Aug 2026), that coffee costs ≈ 0.3¢ a day in interest: 5 ÷ 0.29 ≈ 17 days. ESTIMATE, simple arithmetic; interest compounds daily, so it's slightly faster.",
  ['cash back', 'credit card interest', 'coffee'], [
    { lines: [N('ZERO just earned five cents of cash back on his coffee.', { at: 0.2 })], min: 4.6, bg: '#2A1E18', cam: CV,
      actors: [...cafe({ term: { l2: 'APPROVED', ok: 1, timer: 1.63 } }), cardAt({}),
        coin('nick', '5¢', 300, 3.2, { t: 1.0 }, [{ t: 1.4, y: 300, s: 3.8, e: 'back' }]),
        ui(P('notif', [{ x: 540, y: 520, s: 1.0, w: 900, txt: 'You earned 5¢ cash back!', size: 38, icon: '#58E08A', o: 0 }, { t: 1.2, o: 1, e: 'step' }], 'msg', 46)),
        zc([{ t: 1.2, face: 2, pose: 'proud' }]), vig(0.5)],
      sfx: [sfx('chatter', 0, { g: 0.3, bed: true }), sfx('chime', 1.0, { g: 0.4 }), sfx('coin', 1.0, { g: 0.5 })] },
    { lines: [N('But he carries a balance.', { at: 0.2 }), N('So that coffee starts costing him a third of a cent every day.', { gap: 0.3 })], min: 8, bg: '#2A1E18', cam: CV,
      actors: [...cafe({ term: { l2: 'APPROVED', ok: 1, timer: 1.63 } }), cardAt({}),
        ui(P('capsule', { x: 540, y: 290, s: 1.6, trail: 0, txt: '$4.75' }, 'cap', 46)),
        num('f', '≈ 0.3¢ A DAY', 470, 110, '#FFD98A', { l: 1, t: 0.6 }), note('fs', 'ESTIMATE · 22.36% APR', 560, { l: 1, t: 0.8 }),
        ui(P('calendar', [{ x: 540, y: 760, s: 1.3, month: 'DAYS', today: 0, circ: 0, o: 0 }, { l: 1, t: 1.6, o: 1, e: 'step' }, { l: 1, t: 2.0, today: 17, e: 'lin' }], 'cal', 46)),
        zc([{ l: 0, face: 3 }, { l: 1, face: 4 }]), vig(0.5)],
      sfx: [sfx('chatter', 0, { g: 0.3, bed: true }), sfx('ping', 0.6, { l: 1, g: 0.4 })] },
    { lines: [N('Seventeen days later, the nickel is gone.', { at: 0.2 }), N('And ZERO is still holding his coffee.', { gap: 0.4 }), N('He just earned five cents.', { gap: 0.5 })], min: 9, bg: '#2A1E18', cam: CV,
      actors: [...cafe({ term: { l2: 'TAP CARD' } }), 
        P('cup', [{ x: hand(ZX, G, [128, 128])[0] + 6, y: hand(ZX, G, [128, 128])[1] + 40, s: 0.62, steam: 1 }], 'cup', 7),
        coin('nick', '5¢', 420, 3.6, { t: 0 }, [{ l: 0, t: 1.4, y: 470, s: 1.2, e: 'in' }, { l: 0, t: 1.9, o: 0, e: 'step' }, { l: 2, t: 0.2, y: 420, s: 3.6, o: 1, e: 'step' }]),
        zero([{ x: ZX, face: 2, hl: [118, 126], hr: [128, 128], look: [-6, -2], flip: true }, { l: 0, t: 1.9, face: 3 }, { l: 1, face: 9 }, ...lookCam({ l: 2, t: 0.8 }, { face: 1 })]), vig(0.5)],
      sfx: [sfx('chatter', 0, { g: 0.3, bed: true }), sfx('coin', 1.9, { g: 0.5 }), sfx('dun', 1.9, { g: 0.3 }), sfx('coin', 0.2, { l: 2, g: 0.5 })] },
  ]);

// ---------- Saturday: who pays, who gets the rewards ----------
const FL = 1480;
const V = cam({ z: 1, x: 540, y: 960 });
const wall = () => P('bankroom', { x: 540, y: FL, light: 0, lcol: 'green' }, 'room', -20);
const pile = (k = 0.8) => P('coinmountain', { x: 540, y: FL + 40, s: 0.75, k }, 'pile', -6);
const zb = (k = []) => zero([{ x: 880, y: FL, s: 2.7, face: 0, flip: true, look: [-6, -6] }, ...k], { z: 5 });
const pixb = (k = []) => pix([{ x: 200, y: 600, s: 1.0, face: 2 }, ...k]);
const bar = (id, y, color, x0, l, t, w, h = 130) => ui(P('rect', [{ x: x0 + 10, y, w: 20, h, fill: color, rx: 20 }, { l, t, x: x0 + w / 2, w, e: 'out' }], id, 45));

export const who = base('short-who', 'Who really pays for your cash back?',
  'CFPB, The Consumer Credit Card Market (2023, data for 2022): people who carry a balance paid 94% of interest and fees and earned 27% of rewards; people who pay in full paid 6% and earned 73%.',
  ['cash back', 'credit card rewards', 'CFPB'], [
    { lines: [N('Who really pays for the cash back on your credit card?', { at: 0.2 })], min: 4.2, bg: '#050A18', cam: V,
      actors: [wall(), pile(0.5), ui(P('coin', [{ x: 540, y: 560, s: 4.2, txt: 'CASH BACK', color: '#FFC93C', o: 1 }], 'cb', 46)),
        zb([{ l: 0, t: 0.6, face: 4, headR: 10 }]), pixb(), vig(0.5)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('coin', 0.2, { g: 0.5 })] },
    { lines: [N('Ninety-four percent of card interest and fees comes from people who carry a balance.', { at: 0.2 }), N('They earn only twenty-seven percent of the rewards.', { gap: 0.4 })], min: 10, bg: '#050A18', cam: V,
      actors: [wall(), pile(0.8),
        num('h1', 'CARRY A BALANCE', 330, 76, '#FF9A8A', { t: 0 }),
        bar('a', 470, '#FF6B5B', 60, 0, 0.8, 900), num('at', '94% OF INTEREST + FEES', 590, 44, '#FFD9D2', { l: 0, t: 1.4 }),
        bar('b', 760, '#F2C14E', 60, 1, 0.4, 260), num('bt', '27% OF REWARDS', 880, 44, '#FFE9B0', { l: 1, t: 1.0 }),
        zb([{ l: 0, face: 3 }, { l: 1, face: 4 }]), pixb(), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.8, { l: 0, g: 0.4 }), sfx('swipe', 0.4, { l: 1, g: 0.4 })] },
    { lines: [N('People who pay in full earn seventy-three percent.', { at: 0.2 }), N("So who's the cash back really for?", { gap: 0.5 })], min: 8, bg: '#050A18', cam: V,
      actors: [wall(), pile(1.0),
        num('h2', 'PAY IN FULL', 330, 76, '#8FF0B0', { t: 0 }),
        bar('a', 470, '#58E08A', 60, 0, 0.8, 100), num('at', '6% OF INTEREST + FEES', 590, 44, '#C8F5D6', { l: 0, t: 1.4 }),
        bar('b', 760, '#F2C14E', 60, 0, 1.0, 900), num('bt', '73% OF REWARDS', 880, 44, '#FFE9B0', { l: 0, t: 1.6 }),
        note('src', 'CFPB · 2023 · DATA FOR 2022', 1010, { t: 0.4 }),
        zb([{ l: 0, face: 2 }, { l: 1, face: 4, headR: 10 }, ...lookCam({ l: 1, t: 0.6 }, { face: 1 })]), pixb([{ l: 1, face: 4 }]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.8, { l: 0, g: 0.4 }), sfx('dun', 0.3, { l: 1, g: 0.4 })] },
  ]);
