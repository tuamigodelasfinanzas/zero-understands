// The three Shorts of video 001, cut from the long video's own beats and reframed for 1080x1920 (src/vertical.mjs).
// No ZeroOpen and no brand mark: each one starts on its strongest moment, with burned-in captions.
//   label:    what happens when the machines can't read your label (failure, a countdown, a storm)
//   hub:      the building that sorts 400,000+ packages an hour (scale, and ZERO losing his box)
//   kentucky: why a box crossing the country flies to Kentucky first (the hub-and-spoke idea)
import full from './full.mjs';
import { vbeat } from '../../src/vertical.mjs';

const L = (text, o = {}) => ({ who: 'narr', text, ...o });
const B = (i, o) => vbeat(full.beats[i], o);
const LONG = 'https://youtu.be/WQdi60KUmXk';
const base = (id, title, about, tags, beats) => ({
  id: `v001-${id}`, format: 'short', captions: true, music: full.music, musicGain: full.musicGain,
  title, tags: ['shorts', 'how it works', 'logistics', 'packages', ...tags],
  description: `${about}\n\nThe whole night, from the counter to mom's door: ${LONG}\n\n#shorts #howitworks #logistics`,
  beats,
});
const MAP = { zm: 0.75, fx: 1050 };

export const label = base('short-label', "What if the machines can't read your label?",
  "ZERO's label got wet. The cameras can't read it. Somewhere, a person gets about ten seconds. Sources: Engadget (2013), WDRB/WAVE (Apr 2025).",
  ['UPS', 'shipping label', 'overnight shipping'], [
    B(70, { lines: [L("What happens when the machines can't read your label?", { at: 0.2 })], noTin: true }),
    B(69, { lines: [L('It got wet in the rain.')] }),
    B(71), B(72), B(73), B(74), B(75, MAP), B(76), B(77, { noTout: true }),
  ]);

export const hub = base('short-hub', 'This building sorts 400,000 packages an hour',
  'Worldport, UPS\'s main air hub in Louisville: more than 400,000 packages an hour under one roof. Sources: UPS Jobs, AeroSavvy (2017), Industrial Distribution (2015).',
  ['UPS Worldport', 'air cargo', 'package sorting'], [
    B(31, { lines: [L('This building sorts more than four hundred thousand packages an hour.', { at: 0.2 }), L('Five point two million square feet.', { gap: 0.3 })], noTin: true }),
    B(32), B(34, { fx: 1150 }), B(35),
    B(39, { fx: 640, lines: [L('Every box goes through a tunnel of cameras that reads the label from every side.')] }),
    B(40), B(42), B(43), B(44, { noTout: true }),
  ]);

export const kentucky = base('short-kentucky', 'Why does your package fly to Kentucky?',
  "ZERO's box has to cross the country by morning. So why is its plane going to Louisville? Sources: UPS Jobs (95% within a 4-hour flight); 1,225 routes = 50 x 49 / 2.",
  ['hub and spoke', 'UPS', 'overnight shipping'], [
    B(23, { ...MAP, lines: [L('This box has to cross the country by morning.', { at: 0.2 })], noTin: true }),
    B(24, { ...MAP, lines: [L('So why is its plane flying to Kentucky?')] }),
    B(25, MAP), B(26, MAP), B(27, MAP), B(59, MAP),
    B(60, { lines: [L('Fewer routes means fuller planes.'), L("The plane to each city doesn't carry one box.", { gap: 0.3 })] }),
    B(61, { noTout: true }),
  ]);
