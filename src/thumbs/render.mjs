// Renders a thumbnail plan (from director.mjs) to JPGs with Chromium: one 1280x720 file per concept, the recommended
// one copied to thumb.jpg, a review sheet (full size + phone size + a mock feed) and plan.json with the QA report.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const SCRIPTS = ['src/faces.js', 'src/puppets.js', 'src/thumbs/kit.js', 'src/thumbs/worlds.js', 'src/thumbs/heroes.js', 'src/thumbs/compose.js'];

function fontCSS() {
  const file = path.join(ROOT, 'node_modules/@fontsource/fredoka/files/fredoka-latin-700-normal.woff2');
  if (!fs.existsSync(file)) { console.warn('::warning::Fredoka not found (npm install), fallback font'); return ''; }
  return `@font-face{font-family:'Fredoka';font-weight:700;src:url(data:font/woff2;base64,${fs.readFileSync(file).toString('base64')}) format('woff2')}`;
}

async function browser() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  const exe = process.env.ZERO_CHROME || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
  return chromium.launch({ executablePath: exe, args: ['--font-render-hinting=none'] });
}

async function page(b, w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', e => console.error('page error: ' + e.message));
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS()}*{margin:0;padding:0}body{width:${w}px;height:${h}px;overflow:hidden}</style></head><body><div id="t" style="font-family:Fredoka;font-weight:700">.</div></body></html>`);
  for (const s of SCRIPTS) await p.addScriptTag({ path: path.join(ROOT, s) });
  await p.evaluate('document.fonts.load("700 100px Fredoka")');
  await p.evaluate('document.fonts.ready');
  return p;
}

// plan: { title, recommended, variants: [{ id, ...spec }] } -> files in outDir
export async function renderPlan(plan, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await browser();
  const p = await page(b, 1280, 720);
  const results = [];
  for (const v of plan.variants) {
    const r = await p.evaluate(spec => { const o = window.THUMB.render(spec); document.body.innerHTML = o.svg; return o.qa; }, v);
    const png = path.join(outDir, `${v.id}.png`);
    await p.screenshot({ path: png });
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-q:v', '2', path.join(outDir, `${v.id}.jpg`)]);
    fs.rmSync(png);
    results.push({ id: v.id, qa: r });
    console.log(`${v.id} · ${v.angle} · "${v.text.lines.join(' ')}" · QA ${r.pass ? 'OK' : 'FAIL: ' + r.checks.filter(c => !c.pass).map(c => c.q).join('; ')}`);
  }
  fs.copyFileSync(path.join(outDir, `${plan.recommended}.jpg`), path.join(outDir, 'thumb.jpg'));
  plan.qa = Object.fromEntries(results.map(r => [r.id, r.qa]));
  fs.writeFileSync(path.join(outDir, 'plan.json'), JSON.stringify(plan, null, 1));

  // review sheet: each concept full size, at phone size (~13 %, how most people meet it) and in a fake feed
  const img = id => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(outDir, `${id}.jpg`)).toString('base64');
  const vs = plan.variants;
  const sheetH = 120 + vs.length * 400 + 300;
  const sp = await b.newPage({ viewport: { width: 1400, height: sheetH } });
  await sp.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS()}*{margin:0;padding:0;box-sizing:border-box}body{background:#0F0F12;color:#eee;font-family:Fredoka,Arial;padding:30px 40px;width:1400px}
    h1{font-size:30px;margin-bottom:6px}.sub{color:#9aa;font-size:17px;margin-bottom:24px}.row{display:flex;gap:28px;align-items:flex-start;height:380px;margin-bottom:20px}
    .big{width:640px;height:360px;border-radius:12px}.tag{font-size:22px;margin-bottom:8px}.rec{color:#FFC93C}.small{width:168px;height:94px;border-radius:6px;display:block;margin:6px 0 14px}
    .qa{font-size:14px;color:#9aa;line-height:1.45}.bad{color:#FF6B5B}.feed{display:flex;gap:20px}.card{width:300px}.card img{width:300px;height:169px;border-radius:10px}.card p{font-size:15px;margin-top:6px;color:#ddd}.card span{font-size:12px;color:#888}</style></head><body>
    <h1>${plan.title}</h1><div class="sub">${plan.category} · ${plan.world} · recommended: ${plan.recommended} — ${plan.why ?? ''}</div>
    ${vs.map(v => `<div class="row"><img class="big" src="${img(v.id)}"><div><div class="tag ${v.id === plan.recommended ? 'rec' : ''}">${v.id} · ${v.angle.toUpperCase()}${v.id === plan.recommended ? ' ★' : ''}</div>
      <div class="qa">${v.concept ?? ''}<br>ZERO: ${v.zero.emotion} · text: “${v.text.lines.join(' ')}”</div><img class="small" src="${img(v.id)}">
      <div class="qa">${plan.qa[v.id].checks.map(c => `<div class="${c.pass ? '' : 'bad'}">${c.pass ? '✓' : '✗'} ${c.q}</div>`).join('')}</div></div></div>`).join('')}
    <div class="feed">${vs.map(v => `<div class="card"><img src="${img(v.id)}"><p>${plan.title}</p><span>Zero Understands · 12K views · 1 day ago</span></div>`).join('')}</div></body></html>`);
  await sp.evaluate('document.fonts.ready');
  await sp.screenshot({ path: path.join(outDir, 'sheet.png'), fullPage: true });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.join(outDir, 'sheet.png'), '-q:v', '3', path.join(outDir, 'sheet.jpg')]);
  fs.rmSync(path.join(outDir, 'sheet.png'));
  await b.close();
  return plan;
}
