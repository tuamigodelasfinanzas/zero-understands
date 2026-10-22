// Thumbnail compositor: one resolved concept (from src/thumbs/director.mjs) -> a 1280x720 SVG + a QA report.
// Layer order is the same for every thumbnail, so the feed reads as one channel (docs/miniaturas.md):
//   world (soft focus) -> light -> hero, back -> ZERO (rim light, contact shadow) -> hero, front -> PIX -> grade -> text
// Scenes are drawn with ZERO on the left; when he stands on the right the scene is mirrored, but ZERO himself never is
// (his head notch always points up-left, as in the Bible) and text never is.
(() => {
  const K = window.TKIT, P = window.PUPPETS;
  const W = 1280, H = 720;
  const f = K.f;

  // ZERO's master poses: the only twelve the thumbnails use (docs/miniaturas.md §3b). Each one is a Bible face (ZE-xx
  // index) + body language, drawn facing right; ZERO is turned toward the main concept automatically. Hands are local
  // targets in his 200x220 box. Never invent a pose for one thumbnail: add it here, for every video, or don't.
  const POSES = {
    curious: { face: 0, pose: 'leanin', headR: 6, look: [5, 1], impact: 6 },
    confused: { face: 4, pose: 'shrug', headR: 10, look: [3, 0], impact: 7 },
    shocked: { face: 3, hl: [56, 116], hr: [144, 116], lean: -7, look: [4, 0], impact: 9 },
    suspicious: { face: 4, pose: 'crossed', headR: -8, look: [6, 1], impact: 7 },
    worried: { face: 9, hl: [93, 116], hr: [107, 116], headR: 8, look: [5, 1], impact: 8 },
    mindblown: { face: 3, hl: [66, 84], hr: [134, 84], lean: -5, look: [3, -1], impact: 10 },
    thinking: { face: 5, pose: 'think', headR: 6, look: [5, -2], impact: 5 },
    discovery: { face: 6, pose: 'present', headR: -5, look: [6, 0], impact: 8 },
    lookingup: { face: 3, hl: [76, 150], hr: [124, 150], lean: -6, headR: -10, look: [3, -7], impact: 8 },
    pointing: { face: 3, pose: 'point', look: [6, 0], impact: 7 },
    chasing: { face: 3, hl: [72, 150], hr: [149, 124], fl: [82, 206], fr: [124, 202], lean: 11, headR: 4, look: [7, 0], impact: 9 },
    waitwhat: { face: 3, hl: [70, 160], hr: [150, 108], lean: -8, headR: -6, look: [5, 0], impact: 9 },
  };
  // older names (and the user's words) for the same twelve poses
  const ALIASES = { surprised: 'waitwhat', impressed: 'lookingup', realizing: 'discovery', sad: 'worried', scared: 'worried', tired: 'worried', angry: 'suspicious', 'mind blown': 'mindblown', 'looking up': 'lookingup', running: 'chasing', 'wait what': 'waitwhat', 'happy discovery': 'discovery' };
  const poseOf = name => POSES[name] ? name : (ALIASES[name] && POSES[ALIASES[name]] ? ALIASES[name] : 'curious');

  // PIX's functions: he appears only to do one of these (docs/miniaturas.md §3b), never as decoration
  const PIX_ROLES = {
    reveal: { face: 2, beam: '#7CC2FF' },               // opens / lights up the hidden layer
    scan: { face: 5, halo: 'blue', beam: '#7CC2FF' },    // reads what something really is
    warn: { face: 6, halo: 'red' },                      // warns ZERO
    illuminate: { face: 3, beam: '#FFD58A' },            // shines light on something
    point: { face: 2, halo: 'red', beam: '#FF6B5B' },    // flags an anomaly
    discover: { face: 4 },                               // has just found something
  };

  // the four master layouts: where the weight sits and how big ZERO is (the hero draws the scene inside it)
  const LAYOUTS = {
    discovery: { name: 'DISCOVERY', zero: 0.42 },       // ZERO -> looks -> hidden mechanism
    danger: { name: 'DANGER / CONSEQUENCE', zero: 0.44 }, // system -> happens to ZERO
    scale: { name: 'SCALE', zero: 0.34 },               // tiny ZERO, gigantic thing
    beforeafter: { name: 'BEFORE / AFTER', zero: 0.4 }, // in -> system -> out (less)
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
    const ctx = { W, H, m, fam, accent: spec.accent ?? fam.accent, floor: 640, opts: spec.heroOpts || {}, wopts: spec.worldOpts || {}, hero: spec.hero };
    const world = window.TWORLDS[spec.world] || window.TWORLDS.machine;
    const w = world(ctx);
    ctx.floor = w.floor ?? ctx.floor;
    const hero = (window.THEROES[spec.hero] || window.THEROES.mouth)(ctx);

    // ZERO: one of the twelve master poses. The story's own action (hero) wins over the emotion; the layout sets his size.
    const meta = spec.meta || {};
    const layout = LAYOUTS[spec.layout] || LAYOUTS.discovery;
    const poseName = poseOf(spec.zero.pose ?? meta.pose ?? spec.zero.emotion);
    const P0 = POSES[poseName];
    const hpct = spec.zero.height ?? hero.zero?.height ?? layout.zero;
    const s = hero.zero?.s ?? (hpct * H) / 200;
    let zx = spec.zero.x ?? hero.zero?.x ?? 250, zy = spec.zero.y ?? hero.zero?.y ?? ctx.floor + 14;
    let st = Object.assign({ x: zx, y: zy, s, pose: 'neutral' }, P0);
    delete st.impact;
    st.look = st.look || [0, 0];
    st.shadow = false;
    // ZERO always turns toward the main concept: eyes, head and body lead the viewer to it
    const focusC = hero.focus ? hero.focus[0] : W;
    const facesBack = focusC < zx - 20;
    // in the mirrored scene ZERO stands at W - x with his own (unmirrored) head
    const sx = m ? W - zx : zx;
    st.x = sx;
    if (m !== facesBack) st = mirrorZero(st);
    const zsvg = `${hero.zero?.noShadow ? '' : K.shadow(sx, zy, 60 * s, 0.45)}${P.zero(Object.assign({ rim: 1 }, st))}`;
    const zbox = [sx - 62 * s, zy - 205 * s, 124 * s, 205 * s];
    // things stuck on ZERO by the story (a shipping label, a price tag); drawn in frame coordinates, never mirrored
    const onZero = hero.onZero ? hero.onZero(sx, zy, s, m) : '';

    // text, in the zone opposite ZERO unless the hero says otherwise; spec.text.off = the no-text version
    const noText = !!spec.text.off;
    const zoneName = spec.text.zone ?? hero.textZone ?? 'tr';
    const tb = noText ? { svg: '', box: [0, 0, 0, 0], size: 0 } : textBlock(Object.assign({}, spec.text, hero.textBox && !spec.text.box ? { box: hero.textBox } : {}), m ? flipZone(zoneName) : zoneName);

    // PIX: only with a function (reveal, scan, warn, illuminate, point, discover), never as decoration
    let pixSvg = '', pixBox = null;
    const role = PIX_ROLES[spec.pix?.role ?? meta.pixRole];
    if (spec.pix && spec.pix.on !== false && hero.pix && role) {
      const hp = Object.assign({ x: 1000, y: 150, s: 0.95 }, hero.pix, { face: role.face, halo: role.halo }, spec.pix.at || {});
      let px = m ? W - hp.x : hp.x;
      // PIX never sits on the text: if he would, he drops just below it
      const [bx, by, bw, bh] = tb.box, r = 55 * hp.s;
      if (!noText && px + r > bx && px - r < bx + bw && hp.y + r > by && hp.y - r < by + bh) hp.y = by + bh + r + 10;
      const tgt = hp.scan ?? hero.focus;
      const t2 = role.beam && tgt ? [m ? W - tgt[0] : tgt[0], tgt[1]] : null;
      pixSvg = `${t2 ? K.beam(px, hp.y, t2[0], t2[1], hp.beamW ?? 160, role.beam, 0.5) : ''}${K.pool(px, hp.y, 110 * hp.s, 110 * hp.s, '#FFC93C', 0.55)}${P.pix({ x: px, y: hp.y, s: hp.s, face: hp.face, halo: hp.halo, flip: m })}`;
      pixBox = [px - 50 * hp.s, hp.y - 50 * hp.s, 100 * hp.s, 100 * hp.s];
    }

    const mir = inner => m ? `<g transform="translate(${W} 0) scale(-1 1)">${inner}</g>` : inner;
    const blur = ctx.wopts.blur ?? w.blur ?? 2.6;
    const filters = `<filter id="tblur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${blur}"/></filter>
      <filter id="zrim" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="d"/><feFlood flood-color="#FFF4E3"/><feComposite in2="d" operator="in" result="rim"/><feGaussianBlur in="d" stdDeviation="9" result="b"/><feFlood flood-color="#FFF4E3" flood-opacity="0.38"/><feComposite in2="b" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="tvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#04050B" stop-opacity="0"/><stop offset="1" stop-color="#04050B" stop-opacity="${fam.vignette ?? 0.7}"/></radialGradient>`;
    // a soft dark wash behind the text so it reads on any world
    const [tx, ty, tw, th] = tb.box;
    const wash = noText ? '' : `<ellipse cx="${f(tx + tw / 2)}" cy="${f(ty + th / 2)}" rx="${f(tw * 0.75)}" ry="${f(th * 0.85)}" fill="${K.radial('#05060C', 0.55)}"/>`;
    // the key light: a pool behind ZERO and one on the hero's focus (the main object glows like a beacon)
    const fx = hero.focus ? (m ? W - hero.focus[0] : hero.focus[0]) : W / 2;
    const keys = `${K.pool(sx, zy - 150 * s, 260 * s, 230 * s, fam.key ?? '#FFE2A6', 0.42)}${hero.focus ? K.pool(fx, hero.focus[1], hero.focusR ?? 260, (hero.focusR ?? 260) * 0.8, hero.focusColor ?? ctx.accent, 0.45) : ''}`;

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
    const words = noText ? 0 : spec.text.lines.join(' ').trim().split(/\s+/).length;
    const zh = zbox[3] / H;
    const checks = [
      { q: 'ZERO is immediately visible (28-52 % of the height)', pass: zh >= 0.28 && zh <= 0.52, value: Math.round(zh * 100) + '%' },
      { q: 'ZERO is not in the dead centre', pass: Math.abs(sx - W / 2) > 160, value: Math.round(sx) },
      { q: 'ZERO faces the main concept', pass: !hero.focus || Math.abs(focusC - zx) <= 20 || (focusC > zx) !== facesBack, value: poseName },
      { q: 'One unresolved visual question (the mystery)', pass: !!spec.mystery, value: spec.mystery ?? '' },
      { q: 'PIX only with a function', pass: !pixBox || !!role, value: pixBox ? (spec.pix?.role ?? meta.pixRole) : 'no PIX' },
      ...(noText ? [] : [
        { q: 'Text is 2-5 words', pass: words >= 1 && words <= 5, value: words },
        { q: 'Text readable on a phone (font >= 84 px at 1280)', pass: tb.size >= 84, value: Math.round(tb.size) },
        { q: 'Text never covers ZERO', pass: inter(tb.box, zbox) < 0.04 * zbox[2] * zbox[3], value: Math.round(inter(tb.box, zbox)) },
        { q: 'Text does not cover the main object', pass: !heroBox || inter(tb.box, heroBox) < 0.15 * heroBox[2] * heroBox[3], value: heroBox ? Math.round(inter(tb.box, heroBox) / (heroBox[2] * heroBox[3]) * 100) + '%' : 'n/a' },
        { q: 'Text inside the safe margins', pass: tb.box[0] >= 24 && tb.box[0] + tb.box[2] <= W - 24 && tb.box[1] >= 16 && tb.box[1] + tb.box[3] <= H - 20, value: tb.box.map(Math.round).join(',') },
        { q: 'PIX does not cover the text', pass: !pixBox || inter(pixBox, tb.box) === 0, value: '' },
      ]),
      { q: 'Nothing important under the YouTube timestamp', pass: inter(tb.box, [1100, 640, 180, 80]) === 0 && inter([zbox[0], zbox[1], zbox[2], zbox[3] * 0.7], [1100, 640, 180, 80]) === 0, value: '' },
    ];

    // ---------- Thumbnail Score (heuristic, /10): forces a quality bar, it does not predict CTR ----------
    const cl = v => Math.max(0, Math.min(10, Math.round(v * 10) / 10));
    const attention = 1 + (meta.attention ?? 2) + (noText ? 0 : 1) + (pixBox ? 1 : 0);   // things that need conscious attention
    const capPx = tb.size * 0.72 * 160 / 1280;                                         // text cap height at 160x90
    const objPx = heroBox ? Math.min(heroBox[2], heroBox[3]) * 160 / 1280 : 20;
    const zeroPx = zbox[3] * 90 / H;
    const question = !noText && /[?!]|\.\.\./.test(spec.text.lines.join(' '));
    const score = {
      clarity: cl(10 - Math.max(0, attention - 5) * 1.5 - Math.max(0, words - 4) * 1 - (heroBox && inter(tb.box, heroBox) > 0.05 * heroBox[2] * heroBox[3] ? 1.5 : 0)),
      curiosity: cl(5 + (spec.mystery ? 2 : 0) + (meta.hidden || meta.anomaly ? 2 : { danger: 2, beforeafter: 2, scale: 1 }[spec.layout] ?? 0) + (question ? 1 : 0) + (noText && meta.noText ? 1 : 0) - (spec.echo && !noText ? 3 : 0)),
      zeroVisibility: cl(10 - Math.abs(zh - layout.zero) * 25),
      mobile: noText ? cl(Math.min(10 - Math.max(0, 14 - objPx) * 0.7, 10 - Math.max(0, 22 - zeroPx) * 0.5)) : cl(10 - Math.max(0, 10 - capPx) - Math.max(0, words - 4) * 0.8),
      hierarchy: cl(10 - (inter(tb.box, zbox) > 0 ? 2 : 0) - (pixBox && inter(pixBox, zbox) > 0 ? 2 : 0) - (hero.focus ? 0 : 2) - (heroBox && inter(heroBox, zbox) > 0.25 * zbox[2] * zbox[3] ? 1 : 0)),
      adult: 9,                                                                         // locked by the style rules (palette, type, no cartoon fx)
      brand: cl(10 - (POSES[spec.zero.pose ?? meta.pose ?? spec.zero.emotion] ? 0 : 1) - (pixBox && !role ? 3 : 0)),
      emotion: P0.impact,
      originality: cl(10 - (spec.seen ?? 0) * 2.5),
    };
    const gate = ['clarity', 'curiosity', 'mobile'].filter(k => score[k] < 8);
    return { svg, qa: { pass: checks.every(c => c.pass), checks, score, redesign: gate, pose: poseName, boxes: { zero: zbox, text: tb.box, hero: heroBox, pix: pixBox } } };
  }

  window.THUMB = { render, POSES, ALIASES, PIX_ROLES, LAYOUTS, ZONES, W, H };
})();
