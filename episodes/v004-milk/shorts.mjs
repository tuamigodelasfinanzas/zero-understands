// The three Shorts of video 004 "Why Is the Milk Always at the Back of the Store?", built natively for 1080x1920 (not cut
// from the long video): one surprising fact each, ZERO reacts, a punchline, and the last line loops into the first.
// Props sit in screen space (ui) on a dark backdrop; ZERO stands at the bottom right; captions sit at y 1700.
//   aisles: nobody walks every aisle                  (Tuesday)
//   truck:  the milk is where the truck backs in      (Thursday)
//   yard:   68% or 18%: it depends who measures       (Saturday)
import { N, zero, pix, sfx, cam, lookCam, shrug } from '../../src/kit.mjs';
import { P, vig, ui } from './common.mjs';
import full from './full.mjs';

const LONG = 'https://www.youtube.com/@zerounderstands';
const base = (id, title, about, tags, beats) => ({
  id: `v004-${id}`, format: 'short', captions: true, music: full.music, musicGain: full.musicGain,
  title, tags: ['shorts', 'how it works', 'supermarkets', 'milk', ...tags],
  description: `${about}\n\nThe whole story of the milk at the back of the store: ${LONG}\n\n#shorts #howitworks #supermarket`,
  beats,
});
const V = cam({ z: 1, x: 540, y: 960 });
const BG = '#12172E';
const bg = (c = BG) => P('rect', { x: 540, y: 960, w: 1400, h: 2200, fill: c }, 'bg', -30);
const num = (id, txt, y, size, color, at, extra = {}, x = 540) => P('text', [{ x, y, txt, size, color, o: 0, ui: true, stroke: 5 }, { ...at, o: 1, e: 'step' }], id, 46, extra);
const note = (id, txt, y, at, size = 28) => P('text', [{ x: 540, y, txt, size, color: '#9FB3D6', o: 0, ui: true, stroke: 4 }, { ...at, o: 1, e: 'step' }], id, 46);
const zs = (k = []) => zero([{ x: 900, y: 1800, s: 1.8, face: 0, flip: true, look: [-6, -6] }, ...k], { z: 48 });
const carton = (x, y, s = 1.3, k = []) => P('carton', [{ x, y, s, glow: 0.6, shadow: false, ui: true }, ...k], 'carton', 40);
const floor = (op = 0.5) => P('rect', { x: 540, y: 960, w: 1400, h: 2200, fill: '#0B1226', op }, 'dim', -28);

// ---------- Tuesday: the cart paths ----------
const full1 = [[110, 880], [185, 830], [185, 140], [560, 80], [1000, 90], [1370, 130], [1370, 560], [1370, 760], [620, 800]];
const dart = [[110, 880], [185, 830], [185, 140], [250, 200], [250, 330], [250, 200], [400, 130], [560, 80], [640, 220], [640, 380], [640, 200], [900, 110], [1370, 130]];
const map = (k = []) => ui(P('storemap', [{ x: 540, y: 760, s: 0.7, labels: 1, paths: [{ pts: full1, prog: 0, color: '#FFC93C', w: 9 }] }, ...k], 'map', 20));

export const aisles = base('short-aisles', 'Does anyone walk past the whole store?',
  'Larson, Bradlow & Fader (International Journal of Research in Marketing, 2005) analysed 8,751 shopping-cart paths in one US supermarket (data from 2001): none of the long trips covered all twelve aisles. A FACT about one store, not every store.',
  ['store layout', 'shopping behavior'], [
    { lines: [N('The milk is at the back so you walk past everything.', { at: 0.2 }), N('Is that true?', { gap: 0.3 })], min: 5.4, bg: BG, cam: V,
      actors: [bg(), carton(540, 420, 1.5), map([{ t: 0.6, paths: [{ pts: full1, prog: 0, color: '#FFC93C', w: 9 }] }, { t: 3.6, paths: [{ pts: full1, prog: 1, color: '#FFC93C', w: 9 }], e: 'io' }]),
        zs([{ t: 0.2, face: 0 }, { t: 3.6, face: 3 }]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.6, { g: 0.4 })] },
    { lines: [N('Researchers tracked eight thousand seven hundred fifty-one cart paths.', { at: 0.2 }), N('Not one long trip went down all twelve aisles.', { gap: 0.4 })], min: 9.5, bg: BG, cam: V,
      actors: [bg(), floor(0.2), map([{ t: 0, paths: [{ pts: full1, prog: 1, color: '#FFC93C', w: 9, op: 0.35 }, { pts: dart, prog: 0, color: '#58E08A', w: 9 }] }, { t: 1.0, paths: [{ pts: full1, prog: 1, color: '#FFC93C', w: 9, op: 0.35 }, { pts: dart, prog: 1, color: '#58E08A', w: 9 }], e: 'io' }]),
        num('z', '0 of 12', 1150, 170, '#FFFFFF', { l: 1, t: 0.2 }), num('z2', 'LONG TRIPS COVERED EVERY AISLE', 1260, 36, '#C7D3EA', { l: 1, t: 0.6 }),
        note('s', 'FACT · Larson et al. 2005 · one US store', 1340, { l: 1, t: 0.9 }),
        zs([{ l: 0, face: 0 }, { l: 1, face: 3 }]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.8, { g: 0.4 }), sfx('dun', 0.2, { l: 1, g: 0.4 })] },
    { lines: [N('Most people stay on the outer loop, and dart in for what they need.', { at: 0.2 }), N('So ZERO walked to the back of the store anyway.', { gap: 0.5 })], min: 8.5, bg: BG, cam: V,
      actors: [bg(), carton(540, 420, 1.5, [{ l: 1, t: 0.4, y: 380 }]), map([{ t: 0, paths: [{ pts: full1, prog: 1, color: '#FFC93C', w: 9, op: 0.35 }, { pts: dart, prog: 1, color: '#58E08A', w: 9 }] }]),
        zs([{ l: 0, face: 2 }, { l: 1, face: 4, headR: 8 }, ...lookCam({ l: 1, t: 0.6 }, { face: 1 })]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('ping', 0.3, { l: 1, g: 0.3 })] },
  ]);

// ---------- Thursday: the truck ----------
const chain = (k = {}) => [
  P('reefer', { x: 300, y: 560, s: 0.3, flip: true, open: 1, ui: true }, 'm1', 30), P('dock', { x: 780, y: 560, s: 0.34, open: 1, ui: true }, 'm2', 30),
  P('coldroom', { x: 300, y: 1040, s: 0.3, w: 1500, h: 820, rackX: 700, racks: 2, temp: 3, ui: true }, 'm3', 30), P('dairycase', { x: 780, y: 1040, s: 0.32, w: 1500, ui: true }, 'm4', 30),
];
export const truck = base('short-truck', 'The milk is where the truck is',
  'Milk has a legal temperature: Grade "A" milk is cooled to 7°C (45°F) or less and kept there (Pasteurized Milk Ordinance, here via Maine 01-001 CMR ch. 329). The store\'s refrigerated dock is at the back; a Wegmans manager said the layout keeps the cold chain unbroken (NPR Planet Money, Episode 555, 2016).',
  ['cold chain', 'dairy'], [
    { lines: [N('The milk is not at the back because of you.', { at: 0.2 }), N('It is there because of a truck.', { gap: 0.3 })], min: 5.4, bg: BG, cam: V,
      actors: [bg(), P('reefer', [{ x: -500, y: 900, s: 0.62, flip: true, open: 1, roll: 1, ui: true }, { t: 0.3, x: -500, roll: 1 }, { t: 3.4, x: 480, roll: 1, e: 'out' }, { t: 3.8, roll: 0 }], 'truck', 30),
        P('dock', { x: 840, y: 900, s: 0.7, open: 1, ui: true }, 'dk', 28),
        zs([{ l: 0, face: 0 }, { t: 3.4, face: 3 }]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('roll', 0.4, { g: 0.3, dur: 3 })] },
    { lines: [N('Truck. Dock. Cold room. Dairy case.', { at: 0.2 }), N('Seven degrees or less, the whole way.', { gap: 0.4 })], min: 9, bg: BG, cam: V,
      actors: [bg(), floor(0.2), ...chain(),
        ...[['TRUCK', 300, 700], ['DOCK', 780, 700], ['COLD ROOM', 300, 1200], ['DAIRY CASE', 780, 1200]].map(([t, x, y], i) => P('text', [{ x, y, txt: t, size: 34, color: '#C7D3EA', o: 0, ui: true }, { l: 0, t: 0.3 + i * 0.6, o: 1, e: 'step' }], 'lb' + i, 46)),
        carton(300, 640, 0.8, [{ l: 0, t: 0.3, x: 300, y: 640 }, { l: 0, t: 0.9, x: 780, y: 640, e: 'io' }, { l: 0, t: 1.5, x: 300, y: 1130, e: 'io' }, { l: 0, t: 2.1, x: 780, y: 1130, e: 'io' }]),
        num('t', '≤ 7°C', 1400, 130, '#58E08A', { l: 1, t: 0.3 }), note('s', 'FACT · Pasteurized Milk Ordinance', 1500, { l: 1, t: 0.6 }),
        zs([{ l: 0, face: 2 }, { l: 1, face: 0 }]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('roll', 0.3, { g: 0.25, dur: 2.2 }), sfx('ping', 2.2, { g: 0.3 })] },
    { lines: [N('A Wegmans manager said it plainly:', { at: 0.2 }), N('“We don’t have to worry about ever breaking the cold chain.”', { gap: 0.4 }), N('So where does the milk end up? Where the truck backs in.', { gap: 0.5 })], min: 12, bg: BG, cam: V,
      actors: [bg(), floor(0.2),
        num('q', '“We don’t have to worry', 380, 54, '#E6ECF5', { l: 1, t: 0.1 }), num('q2', 'about ever breaking', 460, 54, '#E6ECF5', { l: 1, t: 0.1 }), num('q3', 'the cold chain.”', 540, 54, '#E6ECF5', { l: 1, t: 0.1 }),
        note('qa', 'Kevin Lang, Wegmans · NPR Planet Money 555, 2016', 610, { l: 1, t: 0.4 }, 26),
        carton(540, 1300, 1.2, [{ l: 2, t: 0.3, y: 1260 }]),
        zs([{ l: 0, face: 2 }, { l: 1, face: 0 }, { l: 2, face: 4, headR: 8 }, ...lookCam({ l: 2, t: 0.8 }, { face: 1 })]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('ping', 0.3, { l: 1, g: 0.3 })] },
  ]);

// ---------- Saturday: two yardsticks ----------
const bar = (id, x, w, y0, h, color, l, t) => P('rect', [{ x, y: y0, w, h: 4, fill: color, rx: 14, ui: true }, { l, t, y: y0 - h / 2, h, e: 'out' }], id, 45);
export const yard = base('short-yard', '68% or 18%? Who is counting?',
  'Two studies, two yardsticks. Inman & Winer (1999, via UW–Madison): 68% of items on big trips and 54% on small trips were decided in the store (4,200 shoppers, 30,000 purchases, 14 US cities). Bell, Corsten & Knox (Netherlands, 2006 data, 2,945 trips): 18% of categories were decided in the store. Items and categories are different yardsticks.',
  ['impulse buying', 'shopping behavior'], [
    { lines: [N('How much of what you buy was not on your list?', { at: 0.2 }), N('One study says sixty-eight percent.', { gap: 0.4 }), N('Another says eighteen.', { gap: 0.3 })], min: 8, bg: BG, cam: V,
      actors: [bg(), num('a', '68%', 520, 230, '#FF8A7A', { l: 1, t: 0 }), num('b', '18%', 1000, 230, '#FFD98A', { l: 2, t: 0 }),
        carton(540, 330, 1.2), zs([{ l: 0, face: 0 }, { l: 1, face: 3 }, { l: 2, face: 3, headR: 6 }]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('dun', 0.1, { l: 1, g: 0.4 }), sfx('dun', 0.1, { l: 2, g: 0.4 })] },
    { lines: [N('The first one counted items.', { at: 0.2 }), N('The second counted categories.', { gap: 0.4 }), N('Different yardsticks, different answers.', { gap: 0.4 })], min: 10, bg: BG, cam: V,
      actors: [bg(), floor(0.2),
        bar('b1', 330, 300, 1250, 600, '#FF6B5B', 0, 0.8), bar('b2', 750, 300, 1250, 160, '#F2C14E', 1, 0.8),
        num('p1', '68%', 570, 110, '#FFFFFF', { l: 0, t: 1.2 }, {}, 330), num('p2', '18%', 1010, 110, '#FFFFFF', { l: 1, t: 1.2 }, {}, 750),
        num('l1', 'OF ITEMS', 1330, 36, '#FF8A7A', { l: 0, t: 1.4 }, {}, 330), num('l2', 'OF CATEGORIES', 1330, 36, '#FFD98A', { l: 1, t: 1.4 }, {}, 750),
        note('s', 'FACT · Inman & Winer 1999 · Bell, Corsten & Knox', 1450, { l: 2, t: 0.3 }, 26),
        zs([{ l: 0, face: 0 }, { l: 1, face: 2 }, { l: 2, face: 4 }]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.8, { l: 0, g: 0.4 }), sfx('swipe', 0.8, { l: 1, g: 0.4 })] },
    { lines: [N('Both numbers are real.', { at: 0.2 }), N('Neither one tells you what is in your basket.', { gap: 0.4 }), N('So how much of what ZERO buys was not on his list?', { gap: 0.5 })], min: 11, bg: BG, cam: V,
      actors: [bg(), carton(540, 520, 1.6), P('basket', [{ x: 540, y: 1050, s: 1.5, items: [], ui: true }, { l: 1, t: 0.4, items: ['#E8A33C'] }, { l: 2, t: 0.2, items: ['#E8A33C', '#D9573F', '#4E8F5A'] }], 'bsk', 30),
        zs([{ l: 0, face: 2 }, { l: 1, face: 0 }, { l: 2, face: 3, headR: 8 }, ...lookCam({ l: 2, t: 0.8 }, { face: 1 })]), vig(0.5)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('pop', 0.4, { l: 1, g: 0.3 }), sfx('pop', 0.2, { l: 2, g: 0.3 })] },
  ]);
