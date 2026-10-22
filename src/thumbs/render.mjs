// Renders a thumbnail plan (from director.mjs) to JPGs with Chromium: every concept with and without text (A1 A2 B1 B2
// C1 C2, 1280x720), each concept's best as A/B/C.jpg, thumb.jpg (primary) and alt.jpg (alternative), a review sheet
// (full size, phone size, Thumbnail Score, a mock feed) and plan.json with the decisions, scores and QA.
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

// how many earlier videos already led with this hero (previews/thumbs/*/plan.json): repetition lowers Originality
function seenCount(hero, outDir) {
  const dir = path.join(ROOT, 'previews/thumbs');
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const d of fs.readdirSync(dir)) {
    const f = path.join(dir, d, 'plan.json');
    if (!fs.existsSync(f) || path.resolve(dir, d) === path.resolve(outDir)) continue;
    try { const p = JSON.parse(fs.readFileSync(f, 'utf8')); if (p.variants?.find(v => v.id === p.recommended)?.hero === hero) n++; } catch { }
  }
  return n;
}
const SCORE_NAMES = { clarity: 'Clarity', curiosity: 'Curiosity', zeroVisibility: 'Zero visibility', mobile: 'Mobile readability', hierarchy: 'Visual hierarchy', adult: 'Adult appeal', brand: 'Brand consistency', emotion: 'Emotional impact', originality: 'Originality' };
const total = sc => Object.values(sc).reduce((a, b) => a + b, 0);
const gateMin = sc => Math.min(sc.clarity, sc.curiosity, sc.mobile);

// plan: { title, recommended, variants: [{ id, ...spec }] } -> files in outDir
// Every concept is rendered twice: <id>1 with text, <id>2 without (6 thumbnails). Before a thumbnail is accepted it is
// scored; below 8 in Clarity, Curiosity or Mobile readability it is redesigned (PIX out, the next text option...)
// until it passes, or it is flagged on the sheet. thumb.jpg = recommended primary, alt.jpg = a clearly different alternative.
export async function renderPlan(plan, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await browser();
  const p = await page(b, 1280, 720);
  const results = [];
  const evalSpec = spec => p.evaluate(sp => window.THUMB.render(sp).qa, spec);
  for (const v of plan.variants) {
    v.seen = seenCount(v.hero, outDir);
    for (const withText of [true, false]) {
      const id = v.id + (withText ? '1' : '2');
      let spec = JSON.parse(JSON.stringify(v));
      if (!withText) spec.text = { ...spec.text, off: true };
      let qa = await evalSpec(spec);
      const notes = [];
      // automatic redesign: each step keeps the story and changes one thing
      const steps = [
        s => s.pix?.on ? (notes.push('PIX out'), { ...s, pix: { ...s.pix, on: false } }) : null,
        ...(withText ? (v.textOptions || []).slice(1).map(o => s => (notes.push(`text "${o.lines.join(' ')}"`), { ...s, text: { ...s.text, lines: o.lines, hl: o.hl } })) : []),
      ];
      for (const step of steps) {
        if (!qa.redesign.length) break;
        const next = step(spec);
        if (!next) continue;
        const q2 = await evalSpec(next);
        // keep a step only if it raises the weakest gate score (PIX out: also on a tie) and breaks no check
        const better = gateMin(q2.score) > gateMin(qa.score) || (gateMin(q2.score) === gateMin(qa.score) && notes.at(-1) === 'PIX out');
        if ((better && (q2.pass || !qa.pass)) || (q2.pass && !qa.pass)) { spec = next; qa = q2; } else notes.pop();
      }
      const r = await p.evaluate(sp => { const o = window.THUMB.render(sp); document.body.innerHTML = o.svg; return o.qa; }, spec);
      const png = path.join(outDir, `${id}.png`);
      await p.screenshot({ path: png });
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-q:v', '2', path.join(outDir, `${id}.jpg`)]);
      fs.rmSync(png);
      results.push({ id, concept: v.id, withText, qa: r, notes, text: withText ? spec.text.lines : null, pixOn: !!spec.pix?.on });
      const sc = r.score;
      console.log(`${id} · ${v.angle} · ${spec.layout} · ${r.pose}${withText ? ` · "${spec.text.lines.join(' ')}"` : ' · no text'} · score ${Math.round(total(sc))}/90 (clarity ${sc.clarity}, curiosity ${sc.curiosity}, mobile ${sc.mobile})${r.redesign.length ? ' · NEEDS REDESIGN: ' + r.redesign.join(', ') : ''}${notes.length ? ' · redesigned: ' + notes.join(', ') : ''} · QA ${r.pass ? 'OK' : 'FAIL: ' + r.checks.filter(c => !c.pass).map(c => c.q).join('; ')}`);
    }
  }
  // primary: the recommended concept, with or without text (the image alone wins only when it scores at least as well
  // and the hero is one whose picture already asks the question); alternative: the best of the other concepts
  const ok = r => !r.qa.redesign.length && r.qa.pass;
  const rec = results.filter(r => r.concept === plan.recommended);
  const recV = plan.variants.find(v => v.id === plan.recommended);
  const r1 = rec.find(r => r.withText), r2 = rec.find(r => !r.withText);
  const primary = recV.meta?.noText && ok(r2) && total(r2.qa.score) >= total(r1.qa.score) ? r2 : (ok(r1) ? r1 : r2);
  const alt = results.filter(r => r.concept !== plan.recommended).sort((a, b2) => (ok(b2) - ok(a)) || (total(b2.qa.score) - total(a.qa.score)))[0];
  plan.primary = primary.id; plan.alternative = alt?.id;
  fs.copyFileSync(path.join(outDir, `${primary.id}.jpg`), path.join(outDir, 'thumb.jpg'));
  if (alt) fs.copyFileSync(path.join(outDir, `${alt.id}.jpg`), path.join(outDir, 'alt.jpg'));
  // A/B/C.jpg = each concept's best version, for YouTube's Test & Compare
  for (const v of plan.variants) { const best = results.filter(r => r.concept === v.id).sort((a, b2) => (ok(b2) - ok(a)) || (total(b2.qa.score) - total(a.qa.score)) || (b2.withText - a.withText))[0]; fs.copyFileSync(path.join(outDir, `${best.id}.jpg`), path.join(outDir, `${v.id}.jpg`)); }
  plan.qa = Object.fromEntries(results.map(r => [r.id, { ...r.qa, notes: r.notes, text: r.text, pix: r.pixOn }]));
  fs.writeFileSync(path.join(outDir, 'plan.json'), JSON.stringify(plan, null, 1));

  // review sheet: each thumbnail full size, at phone size (160x90, how most people meet it), its score and checks,
  // then a fake feed with the primary and the alternative
  const img = id => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(outDir, `${id}.jpg`)).toString('base64');
  const rows = results.length;
  const sheetH = 160 + rows * 400 + 320;
  const sp = await b.newPage({ viewport: { width: 1400, height: sheetH } });
  const badge = id => id === plan.primary ? ' ★ PRIMARY' : id === plan.alternative ? ' ☆ ALTERNATIVE' : '';
  await sp.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS()}*{margin:0;padding:0;box-sizing:border-box}body{background:#0F0F12;color:#eee;font-family:Fredoka,Arial;padding:30px 40px;width:1400px}
    h1{font-size:30px;margin-bottom:6px}.sub{color:#9aa;font-size:17px;margin-bottom:24px;line-height:1.4}.row{display:flex;gap:28px;align-items:flex-start;height:380px;margin-bottom:20px}
    .big{width:640px;height:360px;border-radius:12px}.tag{font-size:22px;margin-bottom:8px}.rec{color:#FFC93C}.small{width:160px;height:90px;border-radius:6px;display:block;margin:6px 0 10px}
    .qa{font-size:13px;color:#9aa;line-height:1.4}.bad{color:#FF6B5B}.sc{display:grid;grid-template-columns:150px 40px;font-size:13px;color:#ccd}.feed{display:flex;gap:20px}.card{width:300px}.card img{width:300px;height:169px;border-radius:10px}.card p{font-size:15px;margin-top:6px;color:#ddd}.card span{font-size:12px;color:#888}</style></head><body>
    <h1>${plan.title}${plan.titleProposed ? ' <span style="font-size:16px;color:#9aa">(title proposed with the thumbnail)</span>' : ''}</h1><div class="sub">${plan.category} · core question: ${plan.coreQuestion ?? ''}<br>primary ${plan.primary} · alternative ${plan.alternative} — ${plan.why ?? ''}</div>
    ${results.map(r => { const v = plan.variants.find(x => x.id === r.concept); return `<div class="row"><img class="big" src="${img(r.id)}"><div style="width:620px"><div class="tag ${badge(r.id) ? 'rec' : ''}">${r.id} · ${v.angle.toUpperCase()} · ${(v.layout || '').toUpperCase()}${r.withText ? '' : ' · NO TEXT'}${badge(r.id)}</div>
      <div class="qa">Mystery: ${v.mystery ?? ''}<br>ZERO: ${r.qa.pose}${r.text ? ` · text: “${r.text.join(' ')}”` : ''} · PIX: ${r.pixOn ? v.pix.role : 'no'}${r.notes.length ? '<br>redesigned: ' + r.notes.join(', ') : ''}</div>
      <div style="display:flex;gap:24px"><img class="small" src="${img(r.id)}"><div class="sc">${Object.entries(r.qa.score).map(([k, val]) => `<span class="${['clarity', 'curiosity', 'mobile'].includes(k) && val < 8 ? 'bad' : ''}">${SCORE_NAMES[k]}</span><span class="${['clarity', 'curiosity', 'mobile'].includes(k) && val < 8 ? 'bad' : ''}">${val}</span>`).join('')}</div></div>
      <div class="qa">${r.qa.checks.filter(c => !c.pass).map(c => `<div class="bad">✗ ${c.q}</div>`).join('') || '✓ all automatic checks pass'}</div></div></div>`; }).join('')}
    <div class="feed">${[plan.primary, plan.alternative].filter(Boolean).map(id => `<div class="card"><img src="${img(id)}"><p>${plan.title}</p><span>Zero Understands · 12K views · 1 day ago</span></div>`).join('')}</div></body></html>`);
  await sp.evaluate('document.fonts.ready');
  await sp.screenshot({ path: path.join(outDir, 'sheet.png'), fullPage: true });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.join(outDir, 'sheet.png'), '-q:v', '3', path.join(outDir, 'sheet.jpg')]);
  fs.rmSync(path.join(outDir, 'sheet.png'));
  await b.close();
  return plan;
}
