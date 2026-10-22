// ZeroOpen from the command line (docs/zeroopen.md).
//   node tools/zeroopen.mjs plan "<VIDEO_TITLE>" [--topic ..] [--question ..] [--system ..] [--mystery ..]
//        derives the plan from the title (12 fields), saves content/opens/<slug>.json and writes a ready-to-render
//        episode with the whole opening at episodes/opens/<slug>.mjs (preview it like any episode)
//   node tools/zeroopen.mjs check <episode.mjs>
//        runs the 12-question quality test on the opening of an episode
//   node tools/zeroopen.mjs story "<VIDEO_TITLE>" | <episode.mjs>
//        ZeroStoryEngine: the story plan for a title, or the story test on a whole episode
import fs from 'node:fs';
import path from 'node:path';
import { deriveOpen, checkOpen } from '../src/zeroopen.mjs';
import { deriveStory, checkStory } from '../src/story.mjs';
import { estimate } from '../src/voice.mjs';

const [cmd, arg, ...rest] = process.argv.slice(2);
const opt = {}; for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

if (cmd === 'plan' && arg) {
  const plan = deriveOpen({ title: arg, ...opt });
  const s = slug(arg);
  fs.writeFileSync(`content/opens/${s}.json`, JSON.stringify(plan, null, 2) + '\n');
  fs.writeFileSync(`episodes/opens/${s}.mjs`, `// ZeroOpen generated from the title only: ${arg.replace(/\n/g, ' ')}\n// Plan: content/opens/${s}.json. Regenerate with: node tools/zeroopen.mjs plan "${arg.replace(/"/g, '\\"')}"\nimport { zeroOpenBeats } from '../../src/zeroopen.mjs';\nimport plan from '../../content/opens/${s}.json' with { type: 'json' };\n\nexport default {\n  id: 'open-${s}', format: 'long', title: ${JSON.stringify(arg + ' (ZeroOpen)')},\n  music: 'curious', musicGain: 0.05,\n  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },\n  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.38,\n  beats: zeroOpenBeats(plan),\n};\n`);
  for (const k of Object.keys(plan).filter(k => k === k.toUpperCase())) console.log(`${k.padEnd(22)} ${Array.isArray(plan[k]) ? plan[k].join(' / ') : plan[k]}`);
  console.log(`\nsaved content/opens/${s}.json and episodes/opens/${s}.mjs`);
} else if (cmd === 'check' && arg) {
  const ep = (await import(path.resolve(arg))).default;
  const r = checkOpen(ep, t => estimate(t, 'narr'));
  console.log(`ZeroOpen check: ${ep.title}\nentry into the system at ${r.entryAt?.toFixed(1)} s\n`);
  for (const c of r.checks) console.log(`${c.ok === null ? 'LOOK' : c.ok ? ' OK ' : 'FAIL'}  ${String(c.n).padStart(2)}. ${c.q}  (${c.why})`);
  process.exitCode = r.checks.some(c => c.ok === false) ? 1 : 0;
} else if (cmd === 'story' && arg) {
  if (arg.endsWith('.mjs')) {
    const ep = (await import(path.resolve(arg))).default;
    const r = checkStory(ep, t => estimate(t, 'narr'));
    console.log(`ZeroStory check: ${ep.title} (${(r.total / 60).toFixed(1)} min)\n`);
    for (const c of r.checks) console.log(`${c.ok ? ' OK ' : 'FAIL'}  ${c.n}. ${c.q}  (${c.why})`);
    process.exitCode = r.checks.some(c => !c.ok) ? 1 : 0;
  } else console.log(JSON.stringify(deriveStory({ title: arg, ...opt }), null, 2));
} else console.log('usage: node tools/zeroopen.mjs plan "<VIDEO_TITLE>" | check <episode.mjs> | story "<VIDEO_TITLE>" | story <episode.mjs>');
