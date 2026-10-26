// Shared pieces of video 003 "What Your Credit Card Does at Midnight": ZERO's room at 11:58 PM, his phone, the wall
// clock, and the bank's night machine. The café, the capsule and the fibre come from video 002 (same world).
import { G, prop, zero, PALETTE } from '../../src/kit.mjs';
import { room as roomSet } from '../../src/sets.mjs';
export { P, vig, ui, sysOn, hand, cafe, fiber, ride, TERM, ZX } from '../v002-card/common.mjs';
import { P } from '../v002-card/common.mjs';

export const ZX0 = 700;                                  // where ZERO stands at his desk
export const PH = [ZX0 + 40 * 2.6 + 10, G - 100 * 2.6 - 20];   // the phone in his right hand (hr [140,104])
export const ph = (k, more = []) => P('phone', [{ x: PH[0], y: PH[1], s: 1.15, fs: 20, screenColor: '#E8F0FF', ...k }, ...more], 'ph', 7);

// his room at night: the wall clock (counting from 11:58), a paper calendar with the due date circled, a desk
export const myRoom = (o = {}) => [
  ...roomSet({ night: true, plant: false, shelfX: 1500, picX: 1180 }),
  P('shadow', { x: 1300, y: G + 4, w: 300, op: 0.12 }, 'dsh', 4),
  prop('desk', { x: 1300, y: G - 172 }, { id: 'desk', z: 6 }),
  P('wallclock', [{ x: 1550, y: 250, s: 1.05, h: 11, m: 58, run: true, sec: true, rim: '#C9CFE6', ...(o.clock || {}) }, ...(o.clockK || [])], 'clock', -8),
  P('calendar', { x: 960, y: 330, s: 0.9, month: 'NOVEMBER', today: 20, circ: 1 }, 'cal', -8),
];
export { PALETTE };

// backdrops with their own look (the story test counts how long one look lasts): the fibre, the bank's wine-red hall,
// the data hall where the night machine runs, the blue network hall. A dim layer keeps the figures on top readable
const dimmer = () => P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#050A18', op: 0.5 }, 'dim', -4);
export const back = {
  fib: (speed = 0.3) => [...fiber({ speed }), P('pool', { x: 960, y: 540, rx: 900, ry: 560, kind: 'pix', op: 0.35 }, 'pl', -10)],
  bank: () => [P('bankroom', { x: 960, y: G, lcol: 'green', light: 0 }, 'bg', -20), dimmer()],
  hall: () => [P('datahall', { x: 960, y: G, spX: -1000, bikeSp: 300 }, 'bg', -20), dimmer()],
  net: () => [P('nethall', { x: 960, y: G, speed: 0.2 }, 'bg', -20), dimmer()],
};
// the object we follow, small in a corner when a beat is about numbers: the $975
export const oc = (x = 160, y = 150, txt = '$975', s = 0.6) => P('capsule', { x, y, s, trail: 0, txt }, 'cap', 7);
import { fiber } from '../v002-card/common.mjs';
