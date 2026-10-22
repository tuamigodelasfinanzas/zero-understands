// Thumbnail compositor: one resolved concept (from src/thumbs/director.mjs) -> a 1280x720 SVG + a QA report.
// Layer order is the same for every thumbnail, so the feed reads as one channel (docs/miniaturas.md):
//   world (soft focus) -> light -> hero, back -> ZERO (rim light, contact shadow) -> hero, front -> PIX -> grade -> text
// Scenes are drawn with ZERO on the left; when he stands on the right the scene is mirrored, but ZERO himself never is
// (his head notch always points up-left, as in the Bible) and text never is.
(() => {
  const K = window.TKIT, P = window.PUPPETS;
  const W = 1280, H = 720;
  const f = K.f;

  // ZERO's emotions: Bible face (ZE-xx index) + body language. Hands are local targets in his 200x220 box.
  const EMOTIONS = {
    curious: { face: 0, pose: 'leanin', headR: 6, look: [5, 1] },
    confused: { face: 4, pose: 'shrug', headR: 10, look: [3, 0] },
    shocked: { face: 3, hl: [56, 116], hr: [144, 116], lean: -7, look: [4, 0] },
    surprised: { face: 3, pose: 'back', look: [5, 0] },
    suspicious: { face: 4, pose: 'crossed', headR: -8, look: [6, 1] },
    impressed: { face: 3, pose: 'open', headR: -4, look: [3, -2] },
    worried: { face: 9, hl: [93, 116], hr: [107, 116], headR: 8, look: [5, 1] },
    realizing: { face: 6, pose: 'point', headR: -5, look: [6, 0] },
    sad: { face: 7, pose: 'sad', look: [3, 3] },
    angry: { face: 8, pose: 'hips', headR: -4, look: [5, 0] },
    scared: { face: 9, pose: 'cover', lean: -5, look: [5, 0] },
    tired: { face: 11, pose: 'sad', headR: 10 },
    pointing: { face: 3, pose: 'point', look: [6, 0] },
  };

  // mirror ZERO's limbs (not his head): used when he stands on the right and must face left
  function mirrorZero(st) {
    const L = P.limbs(st);
    const mx = p => [200 - p[0], p[1]];
    return Object.assign({}, st, {
      hl: mx(L.hr), hr: mx(L.hl), fl: mx(L.fr), fr: mx(L.fl), pose: 'neutral', pose2: null,
      tilt: -(L.tilt), lean: -(L.lean), headR: -(st.headR ?? 0), look: st.look ? [-st.look[0], st.look[1]] : [0, 0],
      holdR: st.holdL, holdL: st.holdR,
    });
  }

  // measures text with the real font (Fredoka Bold must be loaded before render)
  const ctx2d = document.createElement('canvas').getContext('2d');
  const measure = (s, size) => { ctx2d.font = `700 ${size}px Fredoka`; return ctx2d.measureText(s).width; };

  // text zones (canonical = ZERO on the left). x/y/w/h of the box the text must fit in, and its alignment.
  const ZONES = {
    tr: { x: 600, y: 36, w: 640, h: 300, align: 'end' },
    tl: { x: 40, y: 36, w: 640, h: 300, align: 'start' },
    tc: { x: 260, y: 30, w: 760, h: 240, align: 'middle' },
    mr: { x: 640, y: 180, w: 600, h: 300, align: 'end' },
    br: { x: 600, y: 400, w: 520, h: 230, align: 'end' },     // stops short of the timestamp (bottom-right)
    bl: { x: 40, y: 420, w: 600, h: 260, align: 'start' },
  };
  const flipZone = z => ({ tr: 'tl', tl: 'tr', mr: 'ml', br: 'bl', bl: 'br', tc: 'tc', ml: 'mr' })[z] ?? z;
  ZONES.ml = { x: 40, y: 180, w: 600, h: 300, align: 'start' };

  function textBlock(t, zoneName) {
    const z = Object.assign({}, ZONES[zoneName] || ZONES.tr, t.box || {});
    const lines = t.lines.map(s => String(s).toUpperCase());
    const n = lines.length;
    // biggest size that fits the zone; never below the mobile minimum
    let size = Math.min(t.max ?? 150, (z.h / (n * 0.98)));
    const widest = Math.max(...lines.map(l => measure(l, 100))) / 100;
    size = Math.min(size, z.w / widest);
    size = Math.max(size, t.min ?? 84);
    const lh = size * 0.98, sw = Math.max(10, size * 0.12);
    const ax = z.align === 'end' ? z.x + z.w : z.align === 'middle' ? z.x + z.w / 2 : z.x;
    const y0 = z.y + size * 0.82;
    const hl = new Set(t.hl ?? [n - 1]);
    const col = i => hl.has(i) ? (t.color ?? K.C.YEL) : (t.base ?? '#FFFFFF');
    const rows = lines.map((l, i) => {
      const y = y0 + i * lh;
      const common = `x="${f(ax)}" y="${f(y)}" text-anchor="${z.align}" font-family="Fredoka" font-weight="700" font-size="${f(size)}"`;
      return `<text ${common} fill="#000" opacity="0.55" transform="translate(0 ${f(size * 0.07)})" stroke="#000" stroke-width="${f(sw)}" stroke-linejoin="round">${P.esc(l)}</text>
        <text ${common} fill="${col(i)}" stroke="#0B0C12" stroke-width="${f(sw)}" stroke-linejoin="round" paint-order="stroke">${P.esc(l)}</text>`;
    }).join('');
    const wMax = Math.max(...lines.map(l => measure(l, size))) + sw;
    const bx = z.align === 'end' ? ax - wMax : z.align === 'middle' ? ax - wMax / 2 : ax;
    const box = [bx, z.y, wMax, n * lh + size * 0.12];
    return { svg: rows, box, size };
  }

  function render(spec) {
    K.reset();
    const m = spec.zero.side === 'right';
    const fam = spec.family;
    const ctx = { W, H, m, fam, accent: spec.accent ?? fam.accent, floor: 640, opts: spec.heroOpts || {}, wopts: spec.worldOpts || {} };
    const world = window.TWORLDS[spec.world] || window.TWORLDS.machine;
    const w = world(ctx);
    ctx.floor = w.floor ?? ctx.floor;
    const hero = (window.THEROES[spec.hero] || window.THEROES.mouth)(ctx);

    // ZERO
    const emo = EMOTIONS[spec.zero.emotion] || EMOTIONS.curious;
    const hpct = spec.zero.height ?? hero.zero?.height ?? 0.46;
    const s = hero.zero?.s ?? (hpct * H) / 200;
    let zx = spec.zero.x ?? hero.zero?.x ?? 250, zy = spec.zero.y ?? hero.zero?.y ?? ctx.floor + 14;
    let st = Object.assign({ x: zx, y: zy, s, face: emo.face, pose: emo.pose ?? 'neutral' }, emo, hero.zero?.st || {}, spec.zero.st || {});
    delete st.height;
    st.look = st.look || [0, 0];
    st.shadow = false;
    // in the mirrored scene ZERO stands at W - x, facing left, with his own (unmirrored) head
    const sx = m ? W - zx : zx;
    st.x = sx;
    if (m) st = mirrorZero(st);
    const zsvg = `${hero.zero?.noShadow ? '' : K.shadow(sx, zy, 60 * s, 0.45)}${P.zero(Object.assign({ rim: 1 }, st))}`;
    const zbox = [sx - 62 * s, zy - 205 * s, 124 * s, 205 * s];
    // things stuck on ZERO by the story (a shipping label, a price tag); drawn in frame coordinates, never mirrored
    const onZero = hero.onZero ? hero.onZero(sx, zy, s, m) : '';

    // text, in the zone opposite ZERO unless the hero says otherwise
    const zoneName = spec.text.zone ?? hero.textZone ?? 'tr';
    const tb = textBlock(Object.assign({}, spec.text, hero.textBox && !spec.text.box ? { box: hero.textBox } : {}), m ? flipZone(zoneName) : zoneName);

    // PIX: a secondary character who reveals the hidden layer (scan beam toward the hero's focus)
    let pixSvg = '', pixBox = null;
    if (spec.pix && spec.pix.on !== false && hero.pix !== false) {
      const hp = Object.assign({ x: 1000, y: 150, s: 0.95, face: 2 }, hero.pix || {}, spec.pix.at || {});
      let px = m ? W - hp.x : hp.x;
      // PIX never sits on the text: if he would, he drops just below it
      const [bx, by, bw, bh] = tb.box, r = 55 * hp.s;
      if (px + r > bx && px - r < bx + bw && hp.y + r > by && hp.y - r < by + bh) hp.y = by + bh + r + 10;
      const tgt = hp.scan ? [m ? W - hp.scan[0] : hp.scan[0], hp.scan[1]] : null;
      pixSvg = `${tgt ? K.beam(px, hp.y, tgt[0], tgt[1], hp.beamW ?? 160, '#7CC2FF', 0.5) : ''}${K.pool(px, hp.y, 110 * hp.s, 110 * hp.s, '#FFC93C', 0.55)}${P.pix({ x: px, y: hp.y, s: hp.s, face: hp.face, halo: hp.halo, flip: m })}`;
      pixBox = [px - 50 * hp.s, hp.y - 50 * hp.s, 100 * hp.s, 100 * hp.s];
    }

    const mir = inner => m ? `<g transform="translate(${W} 0) scale(-1 1)">${inner}</g>` : inner;
    const blur = ctx.wopts.blur ?? w.blur ?? 2.6;
    const filters = `<filter id="tblur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${blur}"/></filter>
      <filter id="zrim" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="d"/><feFlood flood-color="#FFF4E3"/><feComposite in2="d" operator="in" result="rim"/><feGaussianBlur in="d" stdDeviation="9" result="b"/><feFlood flood-color="#FFF4E3" flood-opacity="0.38"/><feComposite in2="b" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="tvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#04050B" stop-opacity="0"/><stop offset="1" stop-color="#04050B" stop-opacity="${fam.vignette ?? 0.7}"/></radialGradient>`;
    // a soft dark wash behind the text so it reads on any world
    const [tx, ty, tw, th] = tb.box;
    const wash = `<ellipse cx="${f(tx + tw / 2)}" cy="${f(ty + th / 2)}" rx="${f(tw * 0.75)}" ry="${f(th * 0.85)}" fill="${K.radial('#05060C', 0.55)}"/>`;
    // the key light: a pool behind ZERO and one on the hero's focus
    const fx = hero.focus ? (m ? W - hero.focus[0] : hero.focus[0]) : W / 2;
    const keys = `${K.pool(sx, zy - 150 * s, 260 * s, 230 * s, fam.key ?? '#FFE2A6', 0.42)}${hero.focus ? K.pool(fx, hero.focus[1], hero.focusR ?? 260, (hero.focusR ?? 260) * 0.8, ctx.accent, 0.45) : ''}`;

    const body = `
      <g filter="url(#tblur)">${mir(w.back)}</g>
      <rect width="${W}" height="${H}" fill="${fam.haze ?? fam.bg1 ?? '#0E1330'}" opacity="${w.haze ?? fam.hazeOp ?? 0.32}"/>
      ${mir(w.mid ?? '')}
      ${keys}
      ${mir(hero.back ?? '')}
      ${zsvg}${onZero}
      ${mir(hero.front ?? '')}
      ${pixSvg}
      ${mir(w.front ?? '')}
      <rect width="${W}" height="${H}" fill="url(#tvig)"/>
      ${fam.grade ? `<rect width="${W}" height="${H}" fill="${fam.grade}" opacity="${fam.gradeOp ?? 0.08}" style="mix-blend-mode:soft-light"/>` : ''}
      ${wash}${tb.svg}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${filters}${K.defs()}</defs><rect width="${W}" height="${H}" fill="${fam.bg2 ?? '#0E1330'}"/>${body}</svg>`;

    // ---------- automatic checks (the questions in docs/miniaturas.md that geometry can answer) ----------
    const inter = (a, b) => { if (!a || !b) return 0; const x = Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0])), y = Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1])); return x * y; };
    const heroBox = hero.box ? (m ? [W - hero.box[0] - hero.box[2], hero.box[1], hero.box[2], hero.box[3]] : hero.box) : null;
    const words = spec.text.lines.join(' ').trim().split(/\s+/).length;
    const checks = [
      { q: 'ZERO is immediately visible (30-50 % of the height)', pass: zbox[3] / H >= 0.28 && zbox[3] / H <= 0.52, value: Math.round(zbox[3] / H * 100) + '%' },
      { q: 'ZERO is not in the dead centre', pass: Math.abs(sx - W / 2) > 160, value: Math.round(sx) },
      { q: 'Text is 2-5 words', pass: words >= 1 && words <= 5, value: words },
      { q: 'Text readable on a phone (font >= 84 px at 1280)', pass: tb.size >= 84, value: Math.round(tb.size) },
      { q: 'Text never covers ZERO', pass: inter(tb.box, zbox) < 0.04 * zbox[2] * zbox[3], value: Math.round(inter(tb.box, zbox)) },
      { q: 'Text does not cover the main object', pass: !heroBox || inter(tb.box, heroBox) < 0.15 * heroBox[2] * heroBox[3], value: heroBox ? Math.round(inter(tb.box, heroBox) / (heroBox[2] * heroBox[3]) * 100) + '%' : 'n/a' },
      { q: 'Text inside the safe margins', pass: tb.box[0] >= 24 && tb.box[0] + tb.box[2] <= W - 24 && tb.box[1] >= 16 && tb.box[1] + tb.box[3] <= H - 20, value: tb.box.map(Math.round).join(',') },
      { q: 'Nothing important under the YouTube timestamp', pass: inter(tb.box, [1100, 640, 180, 80]) === 0 && inter([zbox[0], zbox[1], zbox[2], zbox[3] * 0.7], [1100, 640, 180, 80]) === 0, value: '' },
      { q: 'PIX does not cover the text', pass: !pixBox || inter(pixBox, tb.box) === 0, value: '' },
    ];
    return { svg, qa: { pass: checks.every(c => c.pass), checks, boxes: { zero: zbox, text: tb.box, hero: heroBox, pix: pixBox } } };
  }

  window.THUMB = { render, EMOTIONS, ZONES, W, H };
})();
