// Short · Why do elevators have a button that does nothing? (pillar: strange things we take as normal; loops on the tapping)
import { GS, N, PX, zero, pix, prop, popIn, yellow, blue, red, sfx } from '../../src/kit.mjs';

const ZX = 700;                       // ZERO inside the cabin, reaching the panel on the right
const press = (n, t0, dt) => Array.from({ length: n }, (_, i) => [{ t: t0 + i * dt, hr: [152, 110], e: 'out' }, { t: t0 + i * dt + dt * 0.5, hr: [140, 116] }]).flat();
// the cabin seen from the hallway: doors slide under the walls
const cabin = (o = {}) => [
  prop('rect', { x: 540, y: 1060, w: 800, h: 880, fill: '#F2F2F2' }, { id: 'cab', z: 0 }),
  prop('rect', { x: 845, y: 1240, w: 90, h: 220, rx: 10, fill: '#FFFFFF', stroke: 6 }, { id: 'panel', z: 1 }),
  prop('button', { x: 845, y: 1190, s: 0.42 }, { id: 'b1', z: 2 }),
  prop('button', { x: 845, y: 1280, s: 0.42 }, { id: 'b2', z: 2 }),
  prop('text', { x: 845, y: 1120, txt: '><', size: 34 }, { id: 'lbl', z: 2 }),
  prop('rect', [{ x: o.doorL ?? -70, y: 1060, w: 400, h: 880, fill: '#CFCFCF', stroke: 6 }, ...(o.doorKeys?.L || [])], { id: 'dl', z: 6 }),
  prop('rect', [{ x: o.doorR ?? 1150, y: 1060, w: 400, h: 880, fill: '#CFCFCF', stroke: 6 }, ...(o.doorKeys?.R || [])], { id: 'dr', z: 6 }),
  prop('rect', { x: -60, y: 1000, w: 400, h: 1100, fill: '#FFFFFF' }, { id: 'wl', z: 7 }),
  prop('rect', { x: 1140, y: 1000, w: 400, h: 1100, fill: '#FFFFFF' }, { id: 'wr', z: 7 }),
  prop('rect', { x: 540, y: 1060, w: 806, h: 886, fill: 'none', stroke: 10 }, { id: 'frame', z: 8 }),
  prop('rect', { x: 540, y: 560, w: 200, h: 80, rx: 12, fill: '#111111' }, { id: 'disp', z: 8 }),
  prop('text', { x: 540, y: 560, txt: o.floor ?? '3', size: 56, color: '#FFC93C' }, { id: 'fl', z: 9 }),
  prop('floor', { x: 0, y: GS }, { id: 'floor', z: 9 }),
];

export default {
  id: '003-buttons', format: 'short', captions: true, music: 'curious-2', musicGain: 0.09,
  title: 'Why do elevators have a button that does nothing?',
  description: "Some buttons don't do anything. They're there for you. ZERO is trying to understand humans.\n\n#shorts #psychology #placebo #animation",
  tags: ['shorts', 'psychology', 'placebo button', 'elevator', 'animation'],
  beats: [
    { pre: 0.3, lines: [N('Why do elevators have a button that does nothing?')],
      actors: [...cabin(), zero([{ x: ZX, y: GS, s: 3, pose: 'reach', hr: [140, 116], face: 4, look: [6, 0] }, ...press(9, 0.1, 0.36)])],
      sfx: Array.from({ length: 9 }, (_, i) => sfx('click', 0.1 + i * 0.36, { g: 0.5 })) },
    { lines: [N('In many elevators, the "close door" button doesn\'t work for you at all.'), N('In the US, the doors must stay open long enough for everyone to get in.'), N('Often only firefighters, with a special key, can use it.')],
      actors: [...cabin(), zero([{ x: ZX, y: GS, s: 3, pose: 'reach', hr: [140, 116], face: 1, look: [6, 0] }, ...press(6, 0.2, 0.5), { l: 1, t: 0, pose: 'neutral', hr: null, face: 4 }]),
        red('DOES NOTHING', 540, 330, { l: 0, t: 1.8 }, { size: 100 }),
        blue('FIREFIGHTERS ONLY', 540, 460, { l: 2, t: 0.6 }, { size: 80 })],
      sfx: [sfx('click', 0.2), sfx('click', 0.7), sfx('click', 1.2), sfx('dun', 1.8, { l: 0 }), sfx('pop', 0.6, { l: 2 })] },
    { lines: [N('In New York, most of the buttons at crosswalks stopped doing anything years ago.'), N('Many of them are still there. People still press them.')],
      actors: [prop('floor', { x: 0, y: GS }),
        prop('rect', { x: 640, y: 1000, w: 26, h: 1000, fill: '#111111' }, { z: 1 }),
        prop('rect', { x: 640, y: 1240, w: 120, h: 170, rx: 14, fill: '#FFC93C', stroke: 6 }, { z: 2 }),
        prop('button', { x: 640, y: 1230, s: 0.45 }, { z: 3 }),
        prop('rect', { x: 640, y: 560, w: 170, h: 220, rx: 18, fill: '#111111' }, { z: 2 }),
        prop('rect', [{ x: 640, y: 560, w: 80, h: 110, rx: 10, fill: '#E63946' }], { z: 3 }),
        blue('NEW YORK', 540, 300, 0.3, { size: 96 }),
        zero([{ x: 470, y: GS, s: 3, pose: 'reach', hr: [146, 124], face: 0, look: [8, -4] }, ...Array.from({ length: 14 }, (_, i) => [{ t: 0.4 + i * 0.4, hr: [156, 122], e: 'out' }, { t: 0.6 + i * 0.4, hr: [146, 124] }]).flat(), { l: 1, t: 0.4, face: 1 }])],
      sfx: Array.from({ length: 7 }, (_, i) => sfx('click', 0.4 + i * 0.8, { g: 0.5 })) },
    { lines: [N('They are called placebo buttons.'), N("They don't move the doors. They move you."), N('Pressing something makes waiting feel shorter, because you feel in control.')],
      actors: [prop('logo', { x: 540, y: 900, s: 8, eyes: false, sw: 4 }, { z: 0 }),
        prop('button', [{ x: 545, y: 1200, s: 1.5, down: 0 }, ...Array.from({ length: 10 }, (_, i) => [{ l: 1, t: 0.2 + i * 0.5, down: 1, e: 'out' }, { l: 1, t: 0.45 + i * 0.5, down: 0 }]).flat()], { z: 2 }),
        prop('worker', [{ x: 360, y: 1200, s: 1.7, pose: 'reach', face: 2 }], { z: 3 }),
        prop('worker', [{ x: 730, y: 1200, s: 1.7, pose: 'celebrate', face: 2, flip: true }], { z: 3 }),
        yellow('PLACEBO', 540, 360, { l: 0, t: 0.6 }, { size: 120 }),
        blue('"I\'M IN CONTROL"', 540, 1440, { l: 2, t: 1.6 }, { size: 70 })],
      sfx: [sfx('pop', 0.6, { l: 0 }), sfx('idea', 1.6, { l: 2, g: 0.5 })] },
    { lines: [PX("He's pressed it forty times.", { at: 0.5 })], min: 3.2,
      actors: [...cabin(), zero([{ x: ZX, y: GS, s: 3, pose: 'reach', hr: [140, 116], face: 4, look: [6, 0] }, ...press(8, 0.1, 0.36)]),
        pix([{ x: 300, y: 760, s: 2, face: 1 }])],
      sfx: [...Array.from({ length: 8 }, (_, i) => sfx('click', 0.1 + i * 0.36, { g: 0.5 })), sfx('pix-ting', 0.3, { g: 0.4 })] },
  ],
};
