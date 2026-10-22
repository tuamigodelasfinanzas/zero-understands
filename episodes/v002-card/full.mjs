// Video 002 "What Happens in the 2 Seconds After You Tap Your Card", the whole episode: parts 1-3 joined for the
// single final render (one MP4, one captions.srt, the thumbnails). The parts stay separate for review renders.
// story: where each act of ZeroStoryEngine starts (docs/zerostory.md); object: the one thing we follow (the $4.75).
import p1 from './part1.mjs';
import p2 from './part2.mjs';
import p3 from './part3.mjs';

const at = (part, i) => ({ 1: 0, 2: p1.beats.length, 3: p1.beats.length + p2.beats.length })[part] + i;

export default {
  ...p1,
  id: 'v002-card',
  title: 'What Happens in the 2 Seconds After You Tap Your Card',
  description: 'ZERO just got his first credit card. He taps it for a $4.75 coffee, time stops, and he rides the payment through the shop side, the network and his bank to see who decides to trust him, and when the money really moves.',
  tags: ['how it works', 'credit cards', 'payments', 'contactless', 'interchange fees', 'card networks', 'fraud detection', 'settlement'],
  thumbnail: 'content/thumbs/v002-card.json',
  beats: [...p1.beats, ...p2.beats, ...p3.beats],
  story: [['hook', at(1, 0)], ['mystery', at(1, 1)], ['enter', at(1, 4)], ['discovery', at(2, 0)], ['complication', at(2, 10)], ['reveal', at(3, 4)], ['consequence', at(3, 5)], ['understands', at(3, 13)]],
  object: { name: 'the $4.75 (the yellow capsule)', ids: ['card', 'cap', 'capv', 'c1', 'c2', 'c3', 'c4', 'msg', 'clone', 'tok', 'route', 'bin', 'q', 'bar', 'disp', 'tag', 'stack', 'bundle', 'zb', 'banks', 'pie', 'paths', 'ph', 'nickel', 'cup', 'cupholo', 's1'] },
};
