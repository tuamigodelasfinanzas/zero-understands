// Video 003 "What Your Credit Card Does at Midnight", the whole episode: parts 1-3 joined for the single final render
// (one MP4, one captions.srt, the thumbnails). The parts stay separate for review renders.
// story: where each act of ZeroStoryEngine starts (docs/zerostory.md); object: the one thing we follow (the $975).
import p1 from './part1.mjs';
import p2 from './part2.mjs';
import p3 from './part3.mjs';

const at = (part, i) => ({ 1: 0, 2: p1.beats.length, 3: p1.beats.length + p2.beats.length })[part] + i;

export default {
  ...p1,
  id: 'v003-midnight',
  title: 'What Your Credit Card Does at Midnight',
  description: "ZERO pays the minimum on his first credit card bill, and at midnight a coin falls out of nowhere onto his balance. He follows the debt inside the machine that charges interest every single night, and finds out who really pays for the cash back.",
  tags: ['how it works', 'credit cards', 'credit card interest', 'APR', 'minimum payment', 'grace period', 'personal finance'],
  thumbnail: 'content/thumbs/v003-midnight.json',
  beats: [...p1.beats, ...p2.beats, ...p3.beats],
  story: [['hook', at(1, 0)], ['mystery', at(1, 2)], ['enter', at(1, 4)], ['discovery', at(2, 0)], ['complication', at(3, 0)], ['reveal', at(3, 3)], ['consequence', at(3, 8)], ['understands', at(3, 11)]],
  object: { name: 'the $975 (the yellow capsule)', ids: ['ph', 'card', 'cap', 'cap25', 'cap60', 'capi', 'dent', 'coin', 'sp', 'bal', 'int'] },
};
