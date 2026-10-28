// Video 004, part 3: the second explanation (the walk-through) and what the numbers really say. ZERO's basket has four
// things in it; how much of a shopping trip is unplanned depends on who measures (68% of items, 18% of categories);
// shoppers don't even walk every aisle. The milk is at the back because of the truck and stays there because walking
// past shelves is free. Circular ending: next week, one item, and he forgets the bread.
import { G, N, zero, pix, sfx, cam, lookCam, shrug, tilt, walk } from '../../src/kit.mjs';
import { endMark, ironyBeat } from '../../src/story.mjs';
import { P, vig, ui, shop, oc, zc, walkHold, bdStore, bdCold } from './common.mjs';

const NAVY = '#0B1226';
const dark = () => [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#12172E' }, 'bg', -20)];
const src = (id, txt, y = 1010, at = { t: 0 }, size = 24) => P('text', [{ x: 960, y, txt, size, color: '#8FA6C8', o: 0, ui: true }, { ...at, o: 1, e: 'step' }], id, 46);
const bar = (id, x, y, wmax, h, fill, at, w) => P('rect', [{ x, y, w: 20, h, fill, rx: h / 2 }, { ...at, x: x - 10 + w / 2, w, e: 'out' }], id, 6);
const txt = (id, t, x, y, size, color, at, extra = {}) => P('text', [{ x, y, txt: t, size, color, o: 0, ui: true, stroke: 5, ...extra }, { ...at, o: 1, e: 'step' }], id, 46);
const items = ['#3F78D0', '#E8A33C', '#D9573F', '#4E8F5A'];

export default {
  id: 'v004-part3',
  format: 'long',
  title: 'Why Is the Milk Always at the Back of the Store? (part 3)',
  description: 'Part 3 of video 004.',
  tags: ['how it works', 'supermarkets', 'milk'],
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.34,
  beats: [
    // ===== c1: the checkout. He came for one thing; the receipt has four =====
    {
      lines: [N('But look at ZERO’s receipt.', { at: 0.5 }), N('He came for one thing.', { gap: 0.4 }), N('He is leaving with four.', { gap: 0.4 })], min: 12, hold: 0.9, bg: '#C9CDD3',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.06, x: 1000, y: 560, e: 'lin' }),
      actors: [...bdStore(0.38, 3),
        P('checkout', { x: 560, y: G + 10, s: 1.1, items: items.slice(1), total: '$15.46' }, 'till', 0),
        P('carton', [{ x: 420, y: 700, s: 0.85, glow: 0.45, shadow: false }, { l: 1, t: 0.3, x: 420 }], 'carton', 6),
        P('receipt', [{ x: 1500, y: 130, s: 1.25, head: 'THE MARKET', lines: [['MILK 1 GAL', '$4.19', '#2A57A3'], ['POTATO CHIPS', '$3.49'], ['COOKIES', '$2.99'], ['CEREAL', '$4.79']], total: '$15.46', o: 0 }, { l: 0, t: 0.2, o: 0 }, { l: 0, t: 0.5, o: 1, e: 'step' }], 'rec', 5),
        P('text', [{ x: 1500, y: 960, txt: 'ILLUSTRATION · ZERO’s receipt', size: 24, color: '#5C6684', o: 0, ui: true }, { l: 0, t: 0.6, o: 1, e: 'step' }], 'ill', 46),
        zero([{ x: 1000, face: 2, pose: 'neutral', hr: [140, 126], hl: [96, 134], look: [-4, 0], flip: true }, { l: 1, face: 3 }, { l: 2, face: 4, headR: 8 }, ...lookCam({ l: 2, t: 1.2 }, { face: 1 })], { z: 5 }), vig(0.45)],
      sfx: [sfx('chatter', 0, { g: 0.12, bed: true }), sfx('beep', 0.3, { g: 0.4 }), sfx('beep', 0.8, { g: 0.4 }), sfx('beep', 1.3, { g: 0.4 }), sfx('belt', 0.2, { g: 0.2, dur: 4 }), sfx('dun', 0.3, { l: 2, g: 0.4 })],
    },
    // ===== c2: the second explanation, the walk-through =====
    {
      lines: [N('That is the other explanation: the walk-through.', { at: 0.4 }), N('Put the milk at the back, and people pass the shelves.', { gap: 0.4 }), N('Some of them buy things they never planned.', { gap: 0.4 }), N('But how many?', { gap: 0.7 })], min: 17, hold: 0.9, bg: '#DCE6D3',
      cam: cam({ z: 1.12, x: 900, y: 570 }, { t: 12, z: 1.12, x: 2300, y: 570, e: 'io' }, { end: 0, z: 1.12, x: 2400, y: 570, e: 'lin' }),
      actors: [...shop({ w: 5000, wx: 2000, seed: 4, signs: [[700, 1, 'CEREAL', '#3F78D0'], [1500, 2, 'SNACKS', '#D9573F'], [2300, 3, 'DRINKS', '#4E8F5A']] }),
        P('basket', [{ x: 690, y: 748, s: 0.95, items: [] }, ...walkHold(560, 2500, 1.5, 14).b, { l: 1, t: 0.4, items: ['#E8A33C'] }, { l: 2, t: 0.4, items: ['#E8A33C', '#D9573F', '#4E8F5A'] }], 'bsk', 7),
        P('carton', [{ x: 690, y: 800, s: 0.85, glow: 0.45, shadow: false }, ...walkHold(560, 2500, 1.5, 14).b.map(k => ({ ...k, y: 800, x: k.x - 2 }))], 'carton', 8),
        P('person', [{ x: 1350, y: G - 20, s: 2.2, pose: 'stand', shirt: '#7A5A3E', skin: '#D8B08C', cap: '#6B6F78', seed: 9, look: 0.6 }], 'sh1', -3),
        P('person', [{ x: 1900, y: G - 10, s: 2.3, pose: 'stand', shirt: '#4E6B8C', skin: '#8E6450', hair: '#1E1820', seed: 2, look: 0.2 }], 'sh2', -3),
        zero([{ x: 560, face: 0, pose: 'neutral', hr: [150, 120], hl: [92, 140], look: [6, 0] }, ...walkHold(560, 2500, 1.5, 14).z, { l: 2, face: 2 }, { l: 3, face: 4, headR: 8 }], { z: 5 }), vig(0.4)],
      sfx: [sfx('chatter', 0, { g: 0.12, bed: true }), sfx('roll', 1.5, { g: 0.2, dur: 12 }), sfx('pop', 0.4, { l: 1, g: 0.35 }), sfx('pop', 0.4, { l: 2, g: 0.35 })],
    },
    // ===== c2b: the scale: 33,248 items; one has to be farthest from the door =====
    {
      lines: [N('The average American supermarket carries thirty-three thousand items.', { at: 0.4 }), N('One of them has to sit farthest from the door.', { gap: 0.4 }), N('And the store gets to choose which.', { gap: 0.5 })], min: 14, hold: 0.9, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdStore(0.66, 7),
        txt('n', '33,248', 960, 400, 250, '#FFD98A', { l: 0, t: 0.5 }), txt('n2', 'ITEMS IN THE AVERAGE SUPERMARKET', 960, 570, 50, '#E6ECF5', { l: 0, t: 0.9 }, { stroke: 0 }),
        txt('n3', '45,575 supermarkets in the US', 960, 680, 38, '#C7D3EA', { l: 1, t: 0.1 }, { stroke: 0 }),
        src('s1', 'FACT \u00B7 FMI, \u201CThe Food Retailing Industry Speaks\u201D, 2025 (items); NielsenIQ TDLinx, 2024 (stores)', 1010, { l: 0, t: 1.2 }, 24),
        zc([{ l: 0, face: 0 }, { l: 1, face: 4, headR: 8 }, { l: 2, face: 3 }]), oc(), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('dun', 0.3, { g: 0.4 }), sfx('ping', 0.2, { l: 2, g: 0.3 })],
    },
    // ===== c3: "sixty to seventy percent": the number the industry repeated =====
    {
      lines: [N('For decades, one number kept getting repeated.', { at: 0.4 }), N('Sixty to seventy percent of supermarket purchases are unplanned.', { gap: 0.4 })], min: 11, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdStore(0.7),
        txt('n', '60–70%', 960, 440, 280, '#FF8A7A', { l: 1, t: 0.1 }),
        txt('u', 'UNPLANNED?', 960, 640, 90, '#FFD98A', { l: 1, t: 0.6 }),
        src('s1', 'An industry claim, quoted in Paco Underhill, “Why We Buy” (1999): “grocery industry studies.” Not a measurement we can check.', 960, { l: 1, t: 1.0 }, 24),
        zc([{ l: 0, face: 0 }, { l: 1, face: 3 }]), oc(), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('dun', 0.1, { l: 1, g: 0.5 })],
    },
    // ===== c4: the 1999 study: 68% of items on big trips, 54% on small ones =====
    {
      lines: [N('A 1999 study followed thirty thousand purchases in fourteen cities.', { at: 0.3 }), N('On big trips, sixty-eight percent of the items were decided in the store.', { gap: 0.4 }), N('On small trips, fifty-four.', { gap: 0.4 })], min: 15, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdCold(0.66),
        txt('h1', 'BIG TRIPS', 480, 300, 52, '#C7D3EA', { l: 1, t: 0 }, { stroke: 0 }), txt('h2', 'SMALL TRIPS', 1440, 300, 52, '#C7D3EA', { l: 2, t: 0 }, { stroke: 0 }),
        P('rect', [{ x: 480, y: 800, w: 260, h: 4, fill: '#FF6B5B', rx: 8 }, { l: 1, t: 0.2, x: 480, y: 575, h: 450, e: 'out' }], 'b1', 6),
        P('rect', [{ x: 1440, y: 800, w: 260, h: 4, fill: '#FFB86B', rx: 8 }, { l: 2, t: 0.2, x: 1440, y: 603, h: 396, e: 'out' }], 'b2', 6),
        txt('p1', '68%', 480, 520, 150, '#FFFFFF', { l: 1, t: 1.0 }), txt('p2', '54%', 1440, 550, 150, '#FFFFFF', { l: 2, t: 1.0 }),
        txt('t1', 'OF ITEMS UNPLANNED', 480, 860, 36, '#FF8A7A', { l: 1, t: 1.2 }, { stroke: 0 }), txt('t2', 'OF ITEMS UNPLANNED', 1440, 860, 36, '#FFB86B', { l: 2, t: 1.2 }, { stroke: 0 }),
        src('s1', 'FACT · Inman & Winer, 1999 (via UW–Madison): 4,200 shoppers, 30,000 purchases, 14 US cities. Items, not categories.', 960, { l: 1, t: 1.4 }, 22),
        zc([{ l: 0, face: 0 }, { l: 2, face: 3 }], { x: 960, s: 1.3 }), oc(), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.3, { l: 1, g: 0.4 }), sfx('swipe', 0.3, { l: 2, g: 0.4 }), sfx('dun', 1.0, { l: 1, g: 0.4 })],
    },
    // ===== c5: the Dutch study: 18% of categories; about one category per trip =====
    {
      lines: [N('A 2008 study in Dutch supermarkets asked it another way.', { at: 0.3 }), N('For each category in the basket: planned, or decided in the store?', { gap: 0.4 }), N('Eighteen percent.', { gap: 0.5 }), N('About one category per trip.', { gap: 0.4 })], min: 17, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdStore(0.7,6),
        ...[0, 1, 2, 3, 4, 5].map(i => P('rect', [{ x: 400 + i * 150, y: 500, w: 110, h: 110, fill: '#3A4570', rx: 18, op: 0 }, { l: 1, t: 0.1 + i * 0.12, op: 1 }, ...(i === 3 ? [{ l: 2, t: 0.2, fill: '#FFC93C' }] : [])], 'cat' + i, 5)),
        txt('c', 'ONE TRIP: 6.4 CATEGORIES', 700, 390, 44, '#C7D3EA', { l: 1, t: 0 }, { stroke: 0 }),
        txt('p', '18%', 1480, 520, 170, '#FFD98A', { l: 2, t: 0.1 }), txt('pp', 'DECIDED IN THE STORE', 1480, 650, 34, '#FFD98A', { l: 2, t: 0.5 }, { stroke: 0 }),
        txt('o', '≈ 1 OF 6', 700, 700, 90, '#FFFFFF', { l: 3, t: 0.2 }),
        src('s1', 'FACT · Bell, Corsten & Knox: 2,945 trips, 21 supermarkets, Netherlands, 2006 data. Categories (1.13 of 6.4 per trip), shopper-reported.', 960, { l: 2, t: 0.8 }, 22),
        zc([{ l: 0, face: 0 }, { l: 2, face: 4, headR: 8 }, { l: 3, face: 2 }]), oc(), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('pop', 0.2, { l: 1, g: 0.3, dur: 1 }), sfx('chime', 0.2, { l: 2, g: 0.4 })],
    },
    // ===== c5b: two yardsticks, two answers =====
    {
      lines: [N('Same question. Sixty-eight and eighteen.', { at: 0.3 }), N('They count different things: items against categories, American trips against Dutch ones.', { gap: 0.4 }), N('Both are real. Neither is the whole story.', { gap: 0.5 })], min: 15, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdCold(0.66),
        P('rect', [{ x: 960, y: 700, w: 4, h: 400, fill: '#3A4570', rx: 2 }], 'mid', 3),
        txt('a', '68%', 560, 480, 190, '#FF8A7A', { l: 0, t: 0.2 }), txt('a2', 'of ITEMS · US · 1999', 560, 610, 36, '#FF8A7A', { l: 0, t: 0.6 }, { stroke: 0 }),
        txt('b', '18%', 1360, 480, 190, '#FFD98A', { l: 0, t: 1.0 }), txt('b2', 'of CATEGORIES · NL · 2006', 1360, 610, 36, '#FFD98A', { l: 0, t: 1.4 }, { stroke: 0 }),
        txt('v', '≠', 960, 500, 150, '#FFFFFF', { l: 1, t: 0.2 }),
        txt('y', 'DIFFERENT YARDSTICKS', 960, 820, 56, '#C7D3EA', { l: 1, t: 0.8 }, { stroke: 0 }),
        zc([{ l: 0, face: 0 }, { l: 1, face: 4, headR: 8 }, { l: 2, face: 2 }]), oc(), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('dun', 0.2, { g: 0.4 }), sfx('dun', 1.0, { g: 0.4 }), sfx('ping', 0.3, { l: 1, g: 0.3 })],
    },
    // ===== c6: shoppers don't walk every aisle (cart tracking) =====
    {
      lines: [N('And do shoppers even walk past everything?', { at: 0.3 }), N('Researchers tracked thousands of carts in one supermarket.', { gap: 0.4 }), N('Not one long trip went down all twelve aisles.', { gap: 0.4 }), N('Most people use the outer loop as home base, and dart into the aisles they need.', { gap: 0.4 })], min: 21, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 960, y: 540, e: 'lin' }),
      actors: [...dark(),
        P('storemap', [{ x: 690, y: 540, s: 0.82, labels: 1, paths: [
          { pts: [[110, 880], [185, 830], [185, 140], [560, 80], [1000, 90], [1370, 130], [1370, 560], [1370, 760], [620, 800]], prog: 0, color: '#FFC93C', w: 7, op: 0.9 },
          { pts: [[110, 880], [185, 830], [185, 140], [250, 200], [250, 330], [250, 200], [400, 130], [560, 80], [640, 220], [640, 380], [640, 200], [900, 110], [1370, 130]], prog: 0, color: '#58E08A', w: 7, op: 0.9 },
          { pts: [[110, 880], [330, 700], [640, 720], [870, 700], [900, 400], [870, 700], [1370, 760]], prog: 0, color: '#FF6B5B', w: 7, op: 0.9 }] },
          { l: 1, t: 0.3, paths: [
            { pts: [[110, 880], [185, 830], [185, 140], [560, 80], [1000, 90], [1370, 130], [1370, 560], [1370, 760], [620, 800]], prog: 0, color: '#FFC93C', w: 7, op: 0.9 },
            { pts: [[110, 880], [185, 830], [185, 140], [250, 200], [250, 330], [250, 200], [400, 130], [560, 80], [640, 220], [640, 380], [640, 200], [900, 110], [1370, 130]], prog: 0, color: '#58E08A', w: 7, op: 0.9 },
            { pts: [[110, 880], [330, 700], [640, 720], [870, 700], [900, 400], [870, 700], [1370, 760]], prog: 0, color: '#FF6B5B', w: 7, op: 0.9 }] },
          { l: 2, t: 2.0, paths: [
            { pts: [[110, 880], [185, 830], [185, 140], [560, 80], [1000, 90], [1370, 130], [1370, 560], [1370, 760], [620, 800]], prog: 1, color: '#FFC93C', w: 7, op: 0.9 },
            { pts: [[110, 880], [185, 830], [185, 140], [250, 200], [250, 330], [250, 200], [400, 130], [560, 80], [640, 220], [640, 380], [640, 200], [900, 110], [1370, 130]], prog: 1, color: '#58E08A', w: 7, op: 0.9 },
            { pts: [[110, 880], [330, 700], [640, 720], [870, 700], [900, 400], [870, 700], [1370, 760]], prog: 1, color: '#FF6B5B', w: 7, op: 0.9 }], e: 'io' }], 'map', -20),
        txt('z', '0 of 12', 1620, 400, 120, '#FFFFFF', { l: 2, t: 0.8 }), txt('z2', 'long trips covered every aisle', 1620, 500, 32, '#C7D3EA', { l: 2, t: 1.2 }, { stroke: 0, size: 30 }),
        src('s1', 'FACT · Larson, Bradlow & Fader, Int’l Journal of Research in Marketing, 2005: 8,751 cart paths, one US supermarket (data from 2001).', 1010, { l: 1, t: 1.0 }, 22),
        zc([{ l: 0, face: 0 }, { l: 2, face: 3 }], { x: 1700 }), oc(), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.4, { l: 1, g: 0.4 }), sfx('dun', 0.9, { l: 2, g: 0.4 })],
    },
    // ===== c7: the picture: a reason put it there, a benefit keeps it there =====
    {
      lines: [N('So here is the whole picture.', { at: 0.3 }), N('A reason put the milk there: the truck, the cold room, the rule.', { gap: 0.4 }), N('A benefit keeps it there: whoever walks to the milk passes something else.', { gap: 0.4 })], min: 21, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 960, y: 540, e: 'lin' }),
      actors: [...dark(),
        P('storemap', [{ x: 690, y: 540, s: 0.82, labels: 1, paths: [
          { pts: [[1365, 110], [1100, 112], [620, 104]], prog: 0, color: '#7CC2FF', w: 12 },
          { pts: [[110, 880], [185, 830], [185, 120], [560, 90]], prog: 0, color: '#FFC93C', w: 12 }], pin: [560, 70] },
          { l: 1, t: 0.2, paths: [{ pts: [[1365, 110], [1100, 112], [620, 104]], prog: 0, color: '#7CC2FF', w: 12 }, { pts: [[110, 880], [185, 830], [185, 120], [560, 90]], prog: 0, color: '#FFC93C', w: 12 }] },
          { l: 1, t: 3.0, paths: [{ pts: [[1365, 110], [1100, 112], [620, 104]], prog: 1, color: '#7CC2FF', w: 12 }, { pts: [[110, 880], [185, 830], [185, 120], [560, 90]], prog: 0, color: '#FFC93C', w: 12 }], e: 'io' },
          { l: 2, t: 0.2, paths: [{ pts: [[1365, 110], [1100, 112], [620, 104]], prog: 1, color: '#7CC2FF', w: 12 }, { pts: [[110, 880], [185, 830], [185, 120], [560, 90]], prog: 0, color: '#FFC93C', w: 12 }] },
          { l: 2, t: 3.2, paths: [{ pts: [[1365, 110], [1100, 112], [620, 104]], prog: 1, color: '#7CC2FF', w: 12 }, { pts: [[110, 880], [185, 830], [185, 120], [560, 90]], prog: 1, color: '#FFC93C', w: 12 }], e: 'io' }], 'map', -20),
        txt('r1', 'WHY IT STARTED', 1620, 330, 40, '#7CC2FF', { l: 1, t: 0.3 }, { stroke: 0 }), txt('r2', 'the cold chain', 1620, 400, 54, '#E6ECF5', { l: 1, t: 0.7 }, { stroke: 0 }),
        txt('r3', 'WHY IT STAYS', 1620, 560, 40, '#FFD98A', { l: 2, t: 0.3 }, { stroke: 0 }), txt('r4', 'passing shelves is free', 1620, 630, 48, '#E6ECF5', { l: 2, t: 0.7 }, { stroke: 0 }),
        zc([{ l: 0, face: 0 }, { l: 1, face: 2 }, { l: 2, face: 3 }], { x: 1760 }), oc(), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.4, { l: 1, g: 0.4 }), sfx('swipe', 0.4, { l: 2, g: 0.4 }), sfx('chime', 3.2, { l: 2, g: 0.3 })],
    },
    // ===== c7a: even the stores give both answers =====
    {
      lines: [N('Even the stores give both answers.', { at: 0.4 }), N('A Kroger spokesperson told NPR the cold chain, and the walk-through.', { gap: 0.4 }), N('A BJ\u2019s dairy buyer said the same: the cold chain, and \u201Cbuilding the basket.\u201D', { gap: 0.4 })], min: 17, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.04, x: 960, y: 540, e: 'lin' }),
      actors: [...bdStore(0.7, 8),
        P('rect', [{ x: 560, y: 470, w: 760, h: 520, fill: '#1B2240', rx: 30, op: 0 }, { l: 1, t: 0.1, op: 0.92 }], 'c1', 3), P('rect', [{ x: 1360, y: 470, w: 760, h: 520, fill: '#1B2240', rx: 30, op: 0 }, { l: 2, t: 0.1, op: 0.92 }], 'c2', 3),
        txt('k1', 'KROGER', 560, 290, 70, '#FFFFFF', { l: 1, t: 0.3 }), txt('k2', '2,400 stores in 34 states', 560, 360, 30, '#C7D3EA', { l: 1, t: 0.5 }, { stroke: 0, size: 30 }),
        txt('k3', 'COLD CHAIN', 560, 470, 56, '#7CC2FF', { l: 1, t: 1.0 }), txt('k4', '+ WALK-THROUGH', 560, 560, 56, '#FFD98A', { l: 1, t: 1.6 }),
        txt('j1', 'BJ\u2019S', 1360, 290, 70, '#FFFFFF', { l: 2, t: 0.3 }), txt('j2', 'dairy buyer Rob Olsen', 1360, 360, 30, '#C7D3EA', { l: 2, t: 0.5 }, { stroke: 0, size: 30 }),
        txt('j3', 'COLD CHAIN', 1360, 470, 56, '#7CC2FF', { l: 2, t: 1.2 }), txt('j4', '+ \u201CBUILDING THE BASKET\u201D', 1360, 560, 46, '#FFD98A', { l: 2, t: 2.2 }),
        src('s1', 'NPR Planet Money, Episode 555 \u201CWhy Is The Milk In The Back Of The Store?\u201D (2016). Their words, not independently verified.', 900, { l: 1, t: 1.0 }, 24),
        zc([{ l: 0, face: 0 }, { l: 1, face: 3 }, { l: 2, face: 2 }], { x: 960, s: 1.3 }), oc(), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.3, { l: 1, g: 0.4 }), sfx('swipe', 0.3, { l: 2, g: 0.4 }), sfx('dun', 1.0, { l: 1, g: 0.3 }), sfx('dun', 1.2, { l: 2, g: 0.3 })],
    },
    // ===== c7b: seventy to eighty years in the back; a consultant would move it to the front =====
    {
      lines: [N('A supermarket consultant told NPR the milk has been in the back for seventy to eighty years.', { at: 0.4 }), N('He would move it to the front.', { gap: 0.4 }), N('In most stores, it is still back there.', { gap: 0.5 })], min: 14, hold: 1.0, bg: NAVY,
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 540, e: 'lin' }),
      actors: [...bdCold(0.66),
        txt('y', '70–80 YEARS', 960, 420, 220, '#FFFFFF', { l: 0, t: 0.8 }), txt('y2', 'in the back of the store', 960, 590, 56, '#C7D3EA', { l: 0, t: 1.2 }, { stroke: 0 }),
        P('carton', [{ x: 1650, y: 900, s: 1.1, glow: 0.7, shadow: false }, { l: 1, t: 0.2, x: 1650 }, { l: 1, t: 1.4, x: 330, e: 'io' }, { l: 2, t: 0.1, x: 330 }, { l: 2, t: 1.0, x: 1650, e: 'io' }], 'carton', 8),
        src('s1', 'Burt Flickinger, supermarket consultant · NPR Planet Money, Episode 555, 2016', 760, { l: 0, t: 1.8 }, 26),
        zc([{ l: 0, face: 0 }, { l: 1, face: 3 }, { l: 2, face: 4, headR: 8 }], { x: 1700, s: 1.5 }), vig(0.65)],
      sfx: [sfx('hum', 0, { g: 0.2, bed: true }), sfx('swipe', 0.2, { l: 1, g: 0.4 }), sfx('swipe', 0.2, { l: 2, g: 0.3 })],
    },
    // ===== c8: what it means for ZERO's basket =====
    {
      lines: [N('What does that mean for ZERO’s basket?', { at: 0.4 }), N('In the Dutch study, shoppers who called themselves fast and efficient bought eighty-two percent less on impulse than the average shopper.', { gap: 0.4 }), N('Trips for something needed right away: fifty-three percent less.', { gap: 0.4 })], min: 21, hold: 1.0, bg: '#C9CDD3',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 980, y: 540, e: 'lin' }),
      actors: [...bdStore(0.55, 3),
        P('receipt', { x: 1450, y: 120, s: 1.3, head: 'THE MARKET', lines: [['MILK 1 GAL', '$4.19', '#2A57A3'], ['POTATO CHIPS', '$3.49', '#B5463E'], ['COOKIES', '$2.99', '#B5463E'], ['CEREAL', '$4.79', '#B5463E']], total: '$15.46' }, 'rec', 5),
        P('text', [{ x: 1450, y: 960, txt: 'ILLUSTRATION · planned: 1 · not planned: 3', size: 24, color: '#5C6684', o: 0, ui: true }, { l: 0, t: 1.4, o: 1, e: 'step' }], 'ill', 46),
        P('carton', { x: 760, y: 840, s: 1.0, glow: 0.45, shadow: false }, 'carton', 6),
        txt('a', '–82%', 500, 300, 190, '#2E9E5B', { l: 1, t: 0.6 }), txt('a2', 'impulse buying · “fast and efficient”', 500, 430, 34, '#1B4A3A', { l: 1, t: 1.0 }, { stroke: 0, size: 34 }),
        txt('b', '–53%', 500, 560, 130, '#2E9E5B', { l: 2, t: 0.4 }), txt('b2', 'trips for an immediate need', 500, 660, 34, '#1B4A3A', { l: 2, t: 0.8 }, { stroke: 0, size: 34 }),
        src('s1', 'FACT · Bell, Corsten & Knox (Wharton): effects on unplanned category purchases vs. the average shopper. An association, not a promise.', 1010, { l: 1, t: 1.4 }, 22),
        zero([{ x: 1000, face: 0, pose: 'neutral', hr: [140, 126], hl: [96, 134], look: [-4, 0], flip: true }, { l: 1, face: 3 }, { l: 2, face: 2, pose: 'crossed' }], { z: 5 }), vig(0.45)],
      sfx: [sfx('chatter', 0, { g: 0.12, bed: true }), sfx('ping', 0.6, { l: 1, g: 0.3 }), sfx('chime', 0.4, { l: 2, g: 0.3 })],
    },
    // ===== e1: next week: the outer loop, straight to the milk, one item =====
    {
      lines: [N('Next week, ZERO goes for milk again.', { at: 0.4 }), N('This time, he knows the way.', { gap: 0.4 })], min: 12, hold: 0.9, bg: '#DCE6D3',
      cam: cam({ z: 1.12, x: 900, y: 570 }, { t: 1.0, z: 1.12, x: 1200, y: 570, e: 'io' }, { t: 8.0, z: 1.12, x: 3900, y: 570, e: 'io' }, { end: 0, z: 1.2, x: 4150, y: 590, e: 'lin' }),
      actors: [...shop({ w: 5000, wx: 2300, seed: 2, signs: [[800, 1, 'CEREAL', '#3F78D0'], [1400, 2, 'SNACKS', '#D9573F'], [2000, 3, 'DRINKS', '#4E8F5A'], [2600, 4, 'FROZEN', '#6D5CAE'], [3200, null, 'DAIRY', '#2A57A3']] }),
        P('dairycase', { x: 3500, y: G, w: 1500, gap: 3, gapRow: 1 }, 'dcase', -6),
        P('basket', [{ x: 690, y: 748, s: 0.95, items: [] }, ...walkHold(560, 3020, 1.0, 7).b], 'bsk', 7),
        P('carton', [{ x: 4446, y: 600, s: 0.62, o: 0, shadow: false }, { t: 8.3, o: 0 }, { t: 8.4, o: 1, e: 'step' }, { t: 9.3, x: 4477, y: 700, s: 0.8, e: 'io' }, { t: 10.2, x: 3150, y: 800, s: 0.85, e: 'io' }], 'carton', 8),
        zero([{ x: 560, face: 2, pose: 'neutral', hr: [150, 120], hl: [92, 140], look: [6, 0] }, ...walkHold(560, 3020, 1.0, 7).z, { t: 8.0, face: 2, hr: [150, 120], hl: [92, 140] }, { t: 8.5, hr: [168, 96], face: 2, e: 'io' }, { t: 9.0, hr: [168, 96] }, { t: 9.6, hr: [150, 120], face: 2 }, { t: 10.8, face: 2, look: [10, 2] }], { z: 5 }), vig(0.4)],
      sfx: [sfx('chatter', 0, { g: 0.12, bed: true }), sfx('roll', 1.0, { g: 0.2, dur: 7 }), sfx('pop', 8.5, { g: 0.4 })],
    },
    // ===== e2: the irony: he forgot the bread =====
    ironyBeat({ set: [...shop({ seed: 1, px: 960 }), P('carton', { x: 600, y: 770, s: 1.0, glow: 0.45, shadow: false }, 'carton', 6)], at: { x: 960, y: G }, phone: ['', 'Reminder: buy bread'], bg: '#DCE6D3',
      lines: [N('Some of what you buy was never on your list.', { at: 1.6 }), N('And some of what was on it never makes it home.', { gap: 0.6 })] }),
    endMark(),
  ],
};
