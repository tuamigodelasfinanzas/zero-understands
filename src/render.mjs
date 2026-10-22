// Renders an episode: episodes/<id>/<file>.json -> MP4 (H.264 + AAC) and a thumbnail JPG.
// Usage: node src/render.mjs <episode.json> <out-dir>
// Env: ZERO_VOICE=false renders without voice (durations estimated), ZERO_FPS (default 30), ZERO_ONLY=3-7 renders only those beats.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { tts, voiceOn, estimate } from './voice.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const [epFile, outDir = 'out'] = process.argv.slice(2);
const ep = epFile.endsWith('.mjs') ? JSON.parse(JSON.stringify((await import(path.resolve(epFile))).default)) : JSON.parse(fs.readFileSync(epFile, 'utf8'));
const FPS = Number(process.env.ZERO_FPS || 30);
const [W, H] = ep.format === 'short' ? [1080, 1920] : [1920, 1080];
const work = path.join(outDir, 'work');
fs.mkdirSync(work, { recursive: true });

if (process.env.ZERO_ONLY) {
  const [a, b] = process.env.ZERO_ONLY.split('-').map(Number);
  ep.beats = ep.beats.slice(a, (b ?? a) + 1);
}

// 1) voice: one clip per line; the beat lasts as long as its lines need (never shorter than `min`)
let useVoice = voiceOn();
const clips = [];
const beats = [];
let t = 0;
for (const [i, b] of ep.beats.entries()) {
  const beat = { i, start: t, lines: [] };
  let lt = b.pre ?? (b.lines?.length ? 0.35 : 0);
  for (const [j, ln] of (b.lines || []).entries()) {
    if (ln.at != null) lt = ln.at;
    let d = estimate(ln.text, ln.who);
    if (useVoice) {
      const f = path.join(work, `v${i}-${j}.mp3`);
      try { d = tts(ln.text, f, ln.who, ep.voices); clips.push({ file: f, at: t + lt, gain: ln.who === 'narr' ? 1 : 1.05 }); }
      catch (e) { console.warn('::warning::voice failed, continuing without voice: ' + e.message); useVoice = false; clips.length = 0; }
    }
    beat.lines.push({ who: ln.who, text: ln.text, start: t + lt, dur: d });
    lt += d + (ln.gap ?? 0.3);
  }
  const need = beat.lines.length ? lt - 0.3 + (b.hold ?? 0.55) : 0;
  beat.dur = Math.max(b.min ?? 0, need, 0.5);
  t += beat.dur;
  beats.push(beat);
}
const total = t;
console.log(`${ep.id}: ${beats.length} beats, ${total.toFixed(1)} s`);

// 2) sound effects at their beat times
const SFX = path.join(ROOT, 'assets/sfx');
const sfx = [];
for (const [i, b] of ep.beats.entries()) for (const s of b.sfx || []) {
  const beat = beats[i];
  let at = beat.start + (s.t ?? 0) + (s.u != null ? s.u * beat.dur : 0) + (s.l != null && beat.lines[s.l] ? beat.lines[s.l].start - beat.start : 0);
  if (s.end != null) at = beat.start + beat.dur - s.end;
  const f = path.join(SFX, s.s + '.wav');
  if (fs.existsSync(f)) sfx.push({ file: f, at, gain: s.g ?? 0.8 }); else console.warn('::warning::missing sfx ' + s.s);
}

// 3) frames
function font() {
  const base = [path.join(ROOT, 'node_modules/@fontsource/fredoka/files'), path.join(ROOT, 'assets/fonts')];
  for (const b of base) {
    const file = path.join(b, 'fredoka-latin-700-normal.woff2');
    if (fs.existsSync(file)) return `@font-face{font-family:'Fredoka';font-weight:700;src:url(data:font/woff2;base64,${fs.readFileSync(file).toString('base64')}) format('woff2')}`;
  }
  console.warn('::warning::Fredoka not found, fallback font');
  return '';
}
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const exe = process.env.ZERO_CHROME || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${font()}*{margin:0;padding:0}html,body{width:${W}px;height:${H}px;overflow:hidden;background:#fff}</style></head><body><div id="stage"></div></body></html>`);
await page.evaluate(d => { window.DATA = d; }, { ep, beats, w: W, h: H, fps: FPS, life: process.env.ZERO_LIFE === '1' });
for (const f of ['faces.js', 'puppets.js', 'stage.js']) await page.addScriptTag({ path: path.join(ROOT, 'src', f) });
await page.waitForFunction('window.ready === true');
await page.evaluate('document.fonts.ready');

const video = path.join(work, 'video.mp4');
const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-g', String(FPS * 2), video], { stdio: ['pipe', 'inherit', 'inherit'] });
const N = Math.ceil(total * FPS);
const stills = process.env.ZERO_STILLS ? Number(process.env.ZERO_STILLS) : 0;
for (let k = 0; k < N; k++) {
  await page.evaluate(x => window.frame(x), k / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (stills && k % Math.round(FPS * stills) === 0) fs.writeFileSync(path.join(work, `still-${String(k).padStart(5, '0')}.jpg`), buf);
  if (k % (FPS * 10) === 0) console.log(`frame ${k}/${N}`);
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));

// 4) thumbnail (long videos): its own beat, rendered at 1280x720
if (ep.thumb) {
  const tp = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const tep = Object.assign({}, ep, { beats: [ep.thumb], captions: false, format: 'long' });
  await tp.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${font()}*{margin:0;padding:0}</style></head><body><div id="stage"></div></body></html>`);
  await tp.evaluate(d => { window.DATA = d; }, { ep: tep, beats: [{ i: 0, start: 0, dur: 1, lines: [] }], w: 1920, h: 1080, fps: FPS });
  for (const f of ['faces.js', 'puppets.js', 'stage.js']) await tp.addScriptTag({ path: path.join(ROOT, 'src', f) });
  await tp.waitForFunction('window.ready === true'); await tp.evaluate('document.fonts.ready');
  await tp.evaluate(() => window.frame(0.99));
  await tp.screenshot({ path: path.join(outDir, 'thumb-full.png') });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.join(outDir, 'thumb-full.png'), '-vf', 'scale=1280:720', '-q:v', '2', path.join(outDir, 'thumb.jpg')]);
}
await browser.close();

// 5) audio: voices + sfx + music bed ducked under the voice, then mux
const plan = { total, clips, sfx, music: ep.music ? path.join(ROOT, 'assets/music', ep.music + '.wav') : null, musicGain: ep.musicGain ?? 0.12 };
fs.writeFileSync(path.join(work, 'mix.json'), JSON.stringify(plan));
const wav = path.join(work, 'audio.wav');
execFileSync('python3', [path.join(ROOT, 'tools/mix.py'), path.join(work, 'mix.json'), wav], { stdio: 'inherit' });
const out = path.join(outDir, ep.format === 'short' ? 'short.mp4' : 'video.mp4');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', video, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out]);
fs.writeFileSync(path.join(outDir, 'timing.json'), JSON.stringify({ total, beats: beats.map(b => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2), lines: b.lines.map(l => l.text) })) }, null, 1));
console.log('OK', out, total.toFixed(1) + ' s');
