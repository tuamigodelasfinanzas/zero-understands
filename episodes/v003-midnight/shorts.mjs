// The three Shorts of video 003 "What Your Credit Card Does at Midnight", built natively for 1080x1920 (not cut from the
// long video): one surprising number each, ZERO reacts, a punchline, and the last line loops into the first.
// Burned-in captions sit at y 1700, so nothing important goes below the floor line FL.
//   night: the nightly rate, sixty cents while he sleeps          (Tuesday)
//   nickel: the 5¢ cash back vs the interest on its own coffee   (Thursday)
//   who:    who pays the interest and who gets the rewards        (Saturday)
import { N, zero, pix, sfx, cam, lookCam, shrug } from '../../src/kit.mjs';
import { P, vig } from './common.mjs';
import full from './full.mjs';

const FL = 1480;
const V = cam({ z: 1, x: 540, y: 960 });
const LONG = 'https://www.youtube.com/@zerounderstands';
const base = (id, title, about, tags, beats) => ({
  id: `v003-${id}`, format: 'short', captions: true, music: full.music, musicGain: full.musicGain,
  title, tags: ['shorts', 'how it works', 'credit cards', 'personal finance', ...tags],
  description: `${about}\n\nThe whole story of the midnight coin: ${LONG}\n\n#shorts #howitworks #creditcards`,
  beats: beats.map(b => ({ ...b, actors: b.actors.map(fill) })),
});
// the vertical frame is tall: bring the figures down into the middle band and scale them up so the top isn't empty
const GROW = { text: ['size', 1.2], counterwall: ['s', 1.15], capsule: ['s', 1.3], coin: ['s', 1.2], calendar: ['s', 1.2], rect: ['h', 1.2] };
const STAY = new Set(['room', 'dim', 'vig']);
function fill(a) {
  if (STAY.has(a.id) || a.type === 'zero') return a;
  const [key, f] = GROW[a.type] ?? [];
  return { ...a, k: a.k.map(k => ({ ...k, ...(k.y != null ? { y: k.y + 190 } : {}), ...(key && k[key] != null ? { [key]: k[key] * f } : {}) })) };
}
const wall = () => P('bankroom', { x: 540, y: FL, light: 0, lcol: 'green' }, 'room', -20);
const dim = () => P('rect', { x: 540, y: 960, w: 2000, h: 3000, fill: '#050A18', op: 0.45 }, 'dim', -4);
const zb = (k = []) => zero([{ x: 880, y: FL, s: 1.9, face: 0, flip: true, look: [-6, -6] }, ...k], { z: 5 });
const pixb = (k = []) => pix([{ x: 220, y: 700, s: 0.8, face: 2 }, ...k]);

export const night = base('short-night', 'Why your balance goes up at midnight',
  'Your card checks the amount you owe every night: yearly rate ÷ 365, applied to the balance. 22.36% is the average rate on card accounts assessed interest (Federal Reserve G.19, Aug 2026); the $975 balance and the sixty cents a night are an illustration with that arithmetic.',
  ['credit card interest', 'APR', 'daily interest'], [
    { lines: [N('ZERO paid his bill, and his balance still went up at midnight.', { at: 0.2 }), N('Here is why.', { gap: 0.3 })], min: 4.6, bg: '#050A18', cam: V,
      actors: [wall(), dim(), P('counterwall', [{ x: 540, y: 560, s: 0.85, cap: 'ZERO OWES', n: 975, dec: 2, k: 1, pre: '$', size: 120, color: '#FFD98A', w: 1100 }, { l: 0, t: 1.8, n: 975.6, e: 'out' }], 'bal', 6),
        P('coin', [{ x: 540, y: 130, s: 1.6, txt: '60¢', color: '#FFC93C', o: 0 }, { l: 0, t: 1.4, o: 1, e: 'step' }, { l: 0, t: 1.8, x: 540, y: 470, s: 0.7, e: 'in' }, { l: 0, t: 2.0, o: 0, e: 'step' }], 'coin', 8),
        zb([{ l: 0, t: 1.8, face: 3 }, ...lookCam({ l: 1, t: 0.1 }, { face: 4 })]), pixb(), vig(0.6)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('whoosh', 1.4, { g: 0.4 }), sfx('coin', 1.8, { g: 0.6 })] },
    { lines: [N('Every night, your card takes the yearly rate: twenty-two point three six percent.', { at: 0.2 }), N('Divides it by three hundred sixty-five.', { gap: 0.3 }), N('Six hundredths of a percent.', { gap: 0.3 })], min: 10, bg: '#050A18', cam: V,
      actors: [wall(), dim(),
        P('text', [{ x: 540, y: 520, txt: '22.36% ÷ 365', size: 120, color: '#FFD98A', o: 0 }, { l: 0, t: 0.8, o: 1, e: 'step' }], 'd', 9),
        P('text', [{ x: 540, y: 700, txt: '= 0.0613% A DAY', size: 80, color: '#8FF0B0', o: 0 }, { l: 1, t: 1.4, o: 1, e: 'step' }], 'r', 9),
        zb([{ l: 2, face: 1 }, ...shrug({ l: 2, t: 0.6 }, { face: 1 })]), pixb(), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('ping', 1.4, { l: 1, g: 0.4 })] },
    { lines: [N("On nine hundred seventy-five dollars, that's sixty cents.", { at: 0.2 }), N('Tonight. And tomorrow night.', { gap: 0.3 }), N('While you sleep.', { gap: 0.4 })], min: 8.5, bg: '#050A18', cam: V,
      actors: [wall(), dim(), P('counterwall', [{ x: 540, y: 600, s: 0.85, cap: 'ZERO OWES', n: 975, dec: 2, k: 1, pre: '$', size: 120, color: '#FFD98A', w: 1100 }, { l: 0, t: 1.2, n: 975.6, e: 'out' }, { l: 1, t: 0.6, n: 976.2, e: 'out' }, { l: 2, t: 0.2, n: 976.79, e: 'out' }], 'bal', 6),
        P('text', [{ x: 540, y: 900, txt: '+60¢ A NIGHT', size: 76, color: '#FFD98A', o: 0 }, { l: 0, t: 1.2, o: 1, e: 'step' }], 'pn', 9),
        P('text', { x: 540, y: 1000, txt: 'ESTIMATE · 22.36% APR ON $975', size: 28, color: '#8FA6C8' }, 'src', 9),
        zb([{ l: 1, face: 9 }, { l: 2, face: 4, headR: 10 }]), pixb([{ l: 2, face: 4 }]), vig(0.6)],
      sfx: [sfx('roll', 0.4, { g: 0.35 }), sfx('coin', 1.2, { g: 0.5 }), sfx('coin', 0.6, { l: 1, g: 0.5 }), sfx('coin', 0.2, { l: 2, g: 0.5 })] },
  ]);

export const nickel = base('short-nickel', 'The cash back on your coffee lasts 17 days',
  "ZERO earns 5¢ of cash back on a $4.75 coffee (1%, an illustration). If he carries a balance at 22.36% APR (Federal Reserve G.19, Aug 2026), that coffee costs ≈ 0.3¢ a day in interest: 5 ÷ 0.29 ≈ 17 days. ESTIMATE, simple arithmetic; interest compounds daily, so it's slightly faster.",
  ['cash back', 'credit card interest', 'coffee'], [
    { lines: [N('ZERO just earned five cents of cash back on his coffee.', { at: 0.2 })], min: 4.6, bg: '#050A18', cam: V,
      actors: [wall(), dim(), P('capsule', { x: 540, y: 560, s: 1.4, trail: 0, txt: '$4.75' }, 'cap', 6),
        P('coin', [{ x: 540, y: 130, s: 1.4, txt: '5¢', color: '#C9CED8', o: 0 }, { l: 0, t: 1.2, o: 1, e: 'step' }, { l: 0, t: 2.2, x: 540, y: 900, e: 'out' }], 'nick', 8),
        zb([{ l: 0, t: 1.5, face: 2, pose: 'proud' }]), pixb(), vig(0.6)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('coin', 2.2, { g: 0.5 })] },
    { lines: [N('But he carries a balance.', { at: 0.2 }), N('So that coffee starts costing him a third of a cent every day.', { gap: 0.3 })], min: 8, bg: '#050A18', cam: V,
      actors: [wall(), dim(), P('capsule', { x: 540, y: 560, s: 1.4, trail: 0, txt: '$4.75' }, 'cap', 6),
        P('text', [{ x: 540, y: 820, txt: '≈ 0.3¢ A DAY', size: 110, color: '#FFD98A', o: 0 }, { l: 1, t: 0.6, o: 1, e: 'step' }], 'f', 9),
        P('text', { x: 540, y: 940, txt: 'ESTIMATE · 22.36% APR', size: 28, color: '#8FA6C8' }, 'fs', 9),
        P('calendar', [{ x: 860, y: 330, s: 0.9, month: 'DAYS', today: 0, circ: 0, o: 0 }, { l: 1, t: 1.6, o: 1, e: 'step' }, { l: 1, t: 2.0, today: 17, e: 'lin' }], 'cal', 5),
        zb([{ l: 0, face: 3 }, { l: 1, face: 4 }]), pixb(), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('ping', 0.6, { l: 1, g: 0.4 })] },
    { lines: [N('Seventeen days later, the nickel is gone.', { at: 0.2 }), N('And ZERO is still holding his coffee.', { gap: 0.4 }), N('He just earned five cents.', { gap: 0.5 })], min: 9, bg: '#050A18', cam: V,
      actors: [wall(), dim(), P('capsule', { x: 540, y: 560, s: 1.4, trail: 0, txt: '$4.75' }, 'cap', 6),
        P('coin', [{ x: 540, y: 900, s: 1.4, txt: '5¢', color: '#C9CED8' }, { l: 0, t: 1.6, x: 540, y: 600, s: 0.5, e: 'in' }, { l: 0, t: 1.9, o: 0, e: 'step' }, { l: 2, t: 0.2, o: 1, x: 540, y: 900, s: 1.4, e: 'step' }], 'nick', 8),
        zb([{ l: 0, t: 1.9, face: 3 }, { l: 1, face: 9 }, ...lookCam({ l: 2, t: 0.8 }, { face: 1 })]), pixb([{ l: 2, t: 1.4, face: 4 }]), vig(0.6)],
      sfx: [sfx('coin', 1.9, { g: 0.5 }), sfx('dun', 1.9, { g: 0.3 }), sfx('coin', 0.2, { l: 2, g: 0.5 })] },
  ]);

export const who = base('short-who', 'Who really pays for your cash back?',
  'CFPB, The Consumer Credit Card Market (2023, data for 2022): people who carry a balance paid 94% of interest and fees and earned 27% of rewards; people who pay in full paid 6% and earned 73%.',
  ['cash back', 'credit card rewards', 'CFPB'], [
    { lines: [N('Who really pays for the cash back on your credit card?', { at: 0.2 })], min: 4.2, bg: '#050A18', cam: V,
      actors: [wall(), dim(), P('coin', [{ x: 540, y: 600, s: 3.2, txt: 'CASH BACK', color: '#FFC93C' }], 'cb', 6),
        zb([{ l: 0, t: 0.6, face: 4, headR: 10 }]), pixb(), vig(0.6)],
      sfx: [sfx('roomtone', 0, { g: 0.25, bed: true }), sfx('coin', 0.2, { g: 0.5 })] },
    { lines: [N('Ninety-four percent of card interest and fees comes from people who carry a balance.', { at: 0.2 }), N('They earn only twenty-seven percent of the rewards.', { gap: 0.4 })], min: 10, bg: '#050A18', cam: V,
      actors: [wall(), dim(),
        P('text', { x: 540, y: 420, txt: 'CARRY A BALANCE', size: 64, color: '#FF9A8A' }, 'h1', 9),
        P('rect', [{ x: 90, y: 560, w: 20, h: 110, fill: '#FF6B5B', rx: 16 }, { l: 0, t: 0.8, x: 450, w: 740, e: 'out' }], 'a', 6),
        P('text', [{ x: 540, y: 660, txt: '94% OF INTEREST + FEES', size: 40, color: '#FFD9D2', o: 0 }, { l: 0, t: 1.4, o: 1, e: 'step' }], 'at', 9),
        P('rect', [{ x: 90, y: 780, w: 20, h: 110, fill: '#F2C14E', rx: 16 }, { l: 1, t: 0.4, x: 200, w: 220, e: 'out' }], 'b', 6),
        P('text', [{ x: 540, y: 880, txt: '27% OF REWARDS', size: 40, color: '#FFE9B0', o: 0 }, { l: 1, t: 1.0, o: 1, e: 'step' }], 'bt', 9),
        zb([{ l: 0, face: 3 }, { l: 1, face: 4 }]), pixb(), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.8, { l: 0, g: 0.4 }), sfx('swipe', 0.4, { l: 1, g: 0.4 })] },
    { lines: [N('People who pay in full earn seventy-three percent.', { at: 0.2 }), N("So who's the cash back really for?", { gap: 0.5 })], min: 8, bg: '#050A18', cam: V,
      actors: [wall(), dim(),
        P('text', { x: 540, y: 420, txt: 'PAY IN FULL', size: 64, color: '#8FF0B0' }, 'h2', 9),
        P('rect', [{ x: 90, y: 560, w: 20, h: 110, fill: '#58E08A', rx: 16 }, { l: 0, t: 0.8, x: 140, w: 100, e: 'out' }], 'a', 6),
        P('text', [{ x: 540, y: 660, txt: '6% OF INTEREST + FEES', size: 40, color: '#C8F5D6', o: 0 }, { l: 0, t: 1.4, o: 1, e: 'step' }], 'at', 9),
        P('rect', [{ x: 90, y: 780, w: 20, h: 110, fill: '#F2C14E', rx: 16 }, { l: 0, t: 1.0, x: 460, w: 740, e: 'out' }], 'b', 6),
        P('text', [{ x: 540, y: 880, txt: '73% OF REWARDS', size: 40, color: '#FFE9B0', o: 0 }, { l: 0, t: 1.6, o: 1, e: 'step' }], 'bt', 9),
        P('text', { x: 540, y: 1020, txt: 'CFPB · 2023 · DATA FOR 2022', size: 28, color: '#8FA6C8' }, 'src', 9),
        zb([{ l: 0, face: 2 }, { l: 1, face: 4, headR: 10 }, ...lookCam({ l: 1, t: 0.6 }, { face: 1 })]), pixb([{ l: 1, face: 4 }]), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.8, { l: 0, g: 0.4 }), sfx('dun', 0.3, { l: 1, g: 0.4 })] },
  ]);
