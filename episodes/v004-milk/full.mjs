// Video 004 "Why Is the Milk Always at the Back of the Store?", the whole episode: parts 1-3 joined for the single final
// render (one MP4, one captions.srt, the thumbnails). The parts stay separate for review renders.
// story: where each act of ZeroStoryEngine starts (docs/zerostory.md); object: the one thing we follow (the milk carton).
import p1 from './part1.mjs';
import p2 from './part2.mjs';
import p3 from './part3.mjs';

const at = (part, i) => ({ 1: 0, 2: p1.beats.length, 3: p1.beats.length + p2.beats.length })[part] + i;

export default {
  ...p1,
  id: 'v004-milk',
  title: 'Why Is the Milk Always at the Back of the Store?',
  description: "ZERO walks to the far end of the supermarket for one carton of milk and wants to know who decided it goes there. He follows the carton behind the dairy wall to find two competing explanations: a trick to make you walk past everything, and a refrigerated truck at the back door.",
  tags: ['how it works', 'supermarkets', 'milk', 'store layout', 'cold chain', 'impulse buying', 'grocery'],
  thumbnail: 'content/thumbs/v004-milk.json',
  beats: [...p1.beats, ...p2.beats, ...p3.beats],
  story: [['hook', at(1, 0)], ['mystery', at(1, 2)], ['enter', at(1, 4)], ['discovery', at(2, 0)], ['complication', at(3, 0)], ['reveal', at(3, 8)], ['consequence', at(3, 11)], ['understands', at(3, 13)]],
  object: { name: 'the milk carton (blue and white)', ids: ['carton'] },
};
