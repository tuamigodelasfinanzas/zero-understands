// Video 001 "Where Your Package Goes While You Sleep", the whole episode: parts 1-3 joined for the single final
// render (one MP4, one captions.srt, the thumbnails). The parts stay separate for review renders.
// story: where each act of ZeroStoryEngine starts (docs/zerostory.md); object: the one thing we follow.
import p1 from './part1.mjs';
import p2 from './part2.mjs';
import p3 from './part3.mjs';

const at = (part, i) => ({ 1: 0, 2: p1.beats.length, 3: p1.beats.length + p2.beats.length })[part] + i;

export default {
  ...p1,
  id: 'v001-package',
  title: 'Where Your Package Goes While You Sleep',
  description: 'ZERO forgot his mom\'s birthday. Next day air promises 10:30 AM on the other side of the country. ZERO rides the box through the night to see how.',
  tags: ['how it works', 'logistics', 'packages', 'air cargo', 'hub and spoke', 'UPS Worldport', 'overnight shipping'],
  beats: [...p1.beats, ...p2.beats, ...p3.beats],
  story: [['hook', at(1, 0)], ['mystery', at(1, 1)], ['enter', at(1, 3)], ['discovery', at(1, 8)], ['complication', at(3, 9)], ['reveal', at(3, 20)], ['consequence', at(3, 24)], ['understands', at(3, 28)]],
  object: { name: 'the yellow box', ids: ['box', 'u1', 'ul2', 'uldup', 'label', 'tc', 'map', 'hm', 'nb'] },
};
