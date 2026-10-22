// Animation test scene: the same keys rendered with and without the life layer (ZERO_LIFE=1)
import { G, PX, zero, pix, prop, floor, popIn, sfx, walk } from '../../src/kit.mjs';

export default {
  id: 'life-test', format: 'long', music: null,
  title: 'ZERO animation test',
  beats: [
    { min: 9.6,
      actors: [floor(),
        prop('phone', [{ x: 1330, y: 780, s: 0.3, r: -90, dot: 0 }, { t: 5.0, dot: 1, buzz: 1, e: 'pop' }, { t: 5.5, buzz: 0 }], { z: 3 }),
        prop('rect', { x: 1330, y: 800, w: 260, h: 16 }, { z: 2 }),
        zero([
          { x: 380, face: 0 },                                     // idle: just standing there
          { t: 1.6, x: 380, face: 0, look: [6, 0] },
          // the old engine slid ZERO across; the new one walks him
          ...(process.env.ZERO_LIFE === '1' ? walk(380, 1180, 1.8, 2.4) : [{ t: 1.8, x: 380, pose: 'walk' }, { t: 4.2, x: 1180, pose: 'neutral' }]),
          { t: 4.6, face: 2, look: [6, 0] },
          { t: 5.0, face: 2, look: [6, 0] },
          { t: 5.25, face: 3, look: [9, 2], headR: 8, e: 'out' },   // the buzz
          { t: 5.9, pose: 'reach', hr: [150, 150], face: 0 },       // reaches for it
          { t: 6.4, pose: 'phone', hr: null, holdR: { type: 'phone', s: 0.24, screen: '' }, headR: 0, face: 2 },
          { t: 7.4, face: 2 },
          { t: 7.7, y: G - 160, pose: 'celebrate', face: 2, e: 'out' },  // jumps for joy
          { t: 8.0, y: G, e: 'in' },
          { t: 8.6, pose: 'point', face: 0, look: [8, -3] },
        ])],
      sfx: [sfx('ping', 5.0)] },
  ],
};
