// Quick look at an episode without rendering the video: PNG stills at chosen seconds (timing estimated, no voice).
// Usage: node tools/stills.mjs <episode.mjs> <out-dir> [every=2 | t1,t2,...]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { estimate } from '../src/voice.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const [epFile, outDir = 'out/stills', when = '2'] = process.argv.slice(2);
const ep = JSON.parse(JSON.stringify((await import(path.resolve(epFile))).default));
const [W, H] = ep.format === 'short' ? [1080, 1920] : [1920, 1080];
fs.mkdirSync(outDir, { recursive: true });

// same timing rules as src/render.mjs, with estimated line lengths
const beats = []; let t = 0;
for (const [i, b] of ep.beats.entries()) {
  const beat = { i, start: t, lines: [] };
  let lt = b.pre ?? (b.lines?.length ? 0.35 : 0);
  for (const ln of b.lines || []) { if (ln.at != null) lt = ln.at; const d = estimate(ln.text, ln.who); beat.lines.push({ who: ln.who, text: ln.text, start: t + lt, dur: d }); lt += d + (ln.gap ?? 0.3); }
  beat.dur = Math.max(b.min ?? 0, beat.lines.length ? lt - 0.3 + (b.hold ?? 0.55) : 0, 0.5);
  t += beat.dur; beats.push(beat);
}
const times = when.includes(',') ? when.split(',').map(Number) : Array.from({ length: Math.floor(t / Number(when)) + 1 }, (_, k) => k * Number(when));
console.log(`${beats.length} beats, ${t.toFixed(1)} s`); beats.forEach(b => console.log(`  beat ${b.i}: ${b.start.toFixed(1)}-${(b.start + b.dur).toFixed(1)}`));

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', e => console.error('page error: ' + e.message));
const fontFile = path.join(ROOT, 'node_modules/@fontsource/fredoka/files/fredoka-latin-700-normal.woff2');
const font = fs.existsSync(fontFile) ? `@font-face{font-family:'Fredoka';font-weight:700;src:url(data:font/woff2;base64,${fs.readFileSync(fontFile).toString('base64')}) format('woff2')}` : '';
await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${font}*{margin:0;padding:0}</style></head><body><div id="stage"></div></body></html>`);
await page.evaluate(d => { window.DATA = d; }, { ep, beats, w: W, h: H, fps: 30 });
for (const f of ['faces.js', 'puppets.js', 'world.js', 'world-pay.js', 'stage.js']) await page.addScriptTag({ path: path.join(ROOT, 'src', f) });
await page.waitForFunction('window.ready === true');
for (const x of times) {
  const t0 = Date.now();
  await page.evaluate(v => window.frame(v), x);
  await page.screenshot({ path: path.join(outDir, `t${x.toFixed(1).padStart(5, '0')}.png`) });
  if (process.env.ZERO_DEBUG) console.log(x, Date.now() - t0, 'ms');
}
await browser.close();
