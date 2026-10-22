// Thumbnail generator CLI: three concepts (A curiosity, B consequence, C scale) for a video, from just its title.
//   node tools/thumbs.mjs "Why Airlines Overbook Flights"            -> out/thumbs/why-airlines-overbook-flights/
//   node tools/thumbs.mjs content/thumbs/v001-package.json [out-dir]  -> variables from a file (see docs/miniaturas.md)
//   node tools/thumbs.mjs --topic "how airlines sell seats"          -> no title yet: proposes one with the thumbnail
//   node tools/thumbs.mjs --plan "Why Airlines Overbook Flights"     -> only prints the creative decisions
// Output: A1 A2 B1 B2 C1 C2.jpg (1 = text, 2 = no text), thumb.jpg (primary), alt.jpg (alternative), A/B/C.jpg (best of
// each concept), sheet.jpg (review: full, phone size, Thumbnail Score, feed), plan.json.
import fs from 'node:fs';
import path from 'node:path';
import { plan } from '../src/thumbs/director.mjs';
import { renderPlan } from '../src/thumbs/render.mjs';

const args = process.argv.slice(2);
const only = args[0] === '--plan' && args.shift();
const topicOnly = args[0] === '--topic' && args.shift();
const [what, outArg] = args;
if (!what) { console.error('usage: node tools/thumbs.mjs "<video title>" | <variables.json> [out-dir]'); process.exit(1); }
const input = what.endsWith('.json') && fs.existsSync(what) ? JSON.parse(fs.readFileSync(what, 'utf8')) : topicOnly ? { VIDEO_TOPIC: what } : { VIDEO_TITLE: what };
const p = plan(input);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
if (only) { console.log(JSON.stringify(p, null, 1)); process.exit(0); }
const out = outArg ?? path.join('out/thumbs', slug(p.title));
console.log(`${p.title}${p.titleProposed ? ' (proposed title)' : ''}\n  ${p.category} · playbook ${p.playbook} · recommended ${p.recommended} · core question: ${p.coreQuestion}`);
await renderPlan(p, out);
console.log(`OK ${out} · primary ${p.primary} · alternative ${p.alternative}`);
