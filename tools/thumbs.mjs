// Thumbnail generator CLI: three concepts (A curiosity, B consequence, C scale) for a video, from just its title.
//   node tools/thumbs.mjs "Why Airlines Overbook Flights"            -> out/thumbs/why-airlines-overbook-flights/
//   node tools/thumbs.mjs content/thumbs/v001-package.json [out-dir]  -> variables from a file (see docs/miniaturas.md)
//   node tools/thumbs.mjs --plan "Why Airlines Overbook Flights"     -> only prints the creative decisions
// Output: A.jpg B.jpg C.jpg (1280x720), thumb.jpg (= recommended), sheet.jpg (review: full, phone size, feed), plan.json.
import fs from 'node:fs';
import path from 'node:path';
import { plan } from '../src/thumbs/director.mjs';
import { renderPlan } from '../src/thumbs/render.mjs';

const args = process.argv.slice(2);
const only = args[0] === '--plan' && args.shift();
const [what, outArg] = args;
if (!what) { console.error('usage: node tools/thumbs.mjs "<video title>" | <variables.json> [out-dir]'); process.exit(1); }
const input = what.endsWith('.json') && fs.existsSync(what) ? JSON.parse(fs.readFileSync(what, 'utf8')) : { VIDEO_TITLE: what };
const p = plan(input);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
if (only) { console.log(JSON.stringify(p, null, 1)); process.exit(0); }
const out = outArg ?? path.join('out/thumbs', slug(p.title));
console.log(`${p.title}\n  ${p.category} · playbook ${p.playbook} · recommended ${p.recommended}`);
await renderPlan(p, out);
console.log('OK', out);
