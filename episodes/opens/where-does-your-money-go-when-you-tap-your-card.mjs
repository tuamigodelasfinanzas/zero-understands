// ZeroOpen generated from the title only: Where Does Your Money Go When You Tap Your Card?
// Plan: content/opens/where-does-your-money-go-when-you-tap-your-card.json. Regenerate with: node tools/zeroopen.mjs plan "Where Does Your Money Go When You Tap Your Card?"
import { zeroOpenBeats } from '../../src/zeroopen.mjs';
import plan from '../../content/opens/where-does-your-money-go-when-you-tap-your-card.json' with { type: 'json' };

export default {
  id: 'open-where-does-your-money-go-when-you-tap-your-card', format: 'long', title: "Where Does Your Money Go When You Tap Your Card? (ZeroOpen)",
  music: 'curious', musicGain: 0.05,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.38,
  beats: zeroOpenBeats(plan),
};
