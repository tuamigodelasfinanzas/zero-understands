// Runs inside the browser. window.DATA = { ep, beats: [{start, dur, lines: [{start, dur, who, text}]}], w, h, fps }.
// window.frame(t) draws the whole video at second t. Every visual comes from the episode JSON, so the same
// episode can be re-rendered in another language by translating its strings.
(() => {
  const { zero, pix, PROPS, COLORS, FONT, esc } = window.PUPPETS;
  const D = window.DATA, ep = D.ep, W = D.w, H = D.h;
  const root = document.getElementById('stage');

  const EASE = {
    lin: x => x, step: () => 0,
    in: x => x * x * x, out: x => 1 - Math.pow(1 - x, 3),
    io: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    back: x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
    pop: x => { const c = 3.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
  };
  const META = new Set(['t', 'u', 'l', 'e', 'end']);
  const isNum = v => typeof v === 'number';
  const isNumArr = v => Array.isArray(v) && v.every(isNum);

  // key time in seconds from the beat start: t (s), u (fraction of beat), l (line index: starts at that line), end (s before beat end)
  function keyTime(k, beat) {
    if (k.end != null) return beat.dur - k.end;
    let t = 0;
    if (k.l != null) { const ln = beat.lines[k.l]; t = ln ? ln.start - beat.start : 0; }
    if (k.u != null) t += k.u * beat.dur;
    if (k.t != null) t += k.t;
    return t;
  }

  // resolve actor state at local time lt from its keys (values persist; numbers ease to the next key)
  function stateAt(keys, lt, beat) {
    const ks = keys.map(k => ({ k, at: keyTime(k, beat) })).sort((a, b) => a.at - b.at);
    const st = {};
    // before its first key an actor holds that key's values
    if (ks.length) for (const p in ks[0].k) if (!META.has(p)) st[p] = ks[0].k[p];
    for (let i = 0; i < ks.length; i++) {
      const { k, at } = ks[i];
      if (at <= lt) { for (const p in k) if (!META.has(p)) st[p] = k[p]; continue; }
      // k is the next key: ease numeric props from current state towards it
      const prev = i > 0 ? ks[i - 1].at : 0;
      const span = Math.max(1e-6, at - prev);
      const x = Math.min(1, Math.max(0, (lt - prev) / span));
      const e = (EASE[k.e] || EASE.io)(x);
      for (const p in k) {
        if (META.has(p) || !(p in st)) continue;
        const a = st[p], b = k[p];
        if (isNum(a) && isNum(b)) st[p] = a + (b - a) * e;
        else if (isNumArr(a) && isNumArr(b) && a.length === b.length) st[p] = a.map((v, j) => v + (b[j] - v) * e);
      }
      break;
    }
    return st;
  }

  // final state of every actor of a beat, so the next beat can continue from it (inherit: true)
  const finals = [];
  D.beats.forEach((b, i) => {
    const spec = ep.beats[i];
    const prev = spec.inherit && i > 0 ? finals[i - 1] : {};
    b.actors = (spec.actors || []).map((a, j) => {
      const id = a.id || `${a.type}-${j}`;
      const base = prev[id] ? Object.assign({}, prev[id]) : null;
      const keys = base ? [Object.assign({ t: 0 }, base), ...a.k.map(k => Object.assign({}, k))] : a.k;
      // a key with no time sits at t=0
      keys.forEach(k => { if (k.t == null && k.u == null && k.l == null && k.end == null) k.t = 0; });
      return { id, type: a.type, keys, z: a.z ?? 0 };
    });
    finals[i] = {};
    for (const a of b.actors) finals[i][a.id] = stateAt(a.keys, b.dur + 1, b);
  });

  function speaking(beat, who, gt) {
    for (const ln of beat.lines) if (ln.who === who && gt >= ln.start && gt <= ln.start + ln.dur) return gt - ln.start;
    return -1;
  }

  function draw(beat, gt) {
    const lt = gt - beat.start;
    const spec = ep.beats[beat.i];
    const cam = spec.cam ? stateAt(spec.cam.map(k => Object.assign({}, k, (k.t == null && k.u == null && k.l == null && k.end == null) ? { t: 0 } : {})), lt, beat) : {};
    const cz = cam.z ?? 1, cx = cam.x ?? W / 2, cy = cam.y ?? H / 2;
    const shake = cam.shake ? `translate(${(Math.sin(gt * 61) * cam.shake).toFixed(1)} ${(Math.cos(gt * 47) * cam.shake).toFixed(1)})` : '';
    let world = '', overlay = '';
    const actors = beat.actors.slice().sort((a, b) => a.z - b.z);
    for (const a of actors) {
      const st = stateAt(a.keys, lt, beat);
      if (st.o === 0 || st.hide) continue;
      let svg = '';
      if (a.type === 'zero') {
        // blink every ~3.7 s unless the face is fixed with blink:false
        if (st.blink !== false && st.blink == null) { const ph = (gt + (a.id.length * 0.7)) % 3.7; st.blink = ph < 0.12 ? Math.sin(ph / 0.12 * Math.PI) : 0; }
        if (st.blink === false) st.blink = 0;
        const sp = speaking(beat, 'zero', gt);
        if (sp >= 0 && st.bounce !== false) st.squash = (st.squash ?? 1) * (1 + 0.03 * Math.sin(sp * 20));
        svg = zero(st);
      } else if (a.type === 'pix') {
        const sp = speaking(beat, 'pix', gt);
        st.talk = sp >= 0 ? 0.5 + 0.5 * Math.sin(sp * 19) : 0;
        if (st.float !== false) st.y = (st.y ?? 0) + Math.sin(gt * 2.2 + 1) * 8;
        if (sp >= 0) st.s = (st.s ?? 1) * (1 + 0.04 * Math.abs(Math.sin(sp * 9)));
        svg = pix(st);
      } else if (PROPS[a.type]) {
        const inner = PROPS[a.type](st);
        svg = `<g transform="translate(${st.x ?? 0} ${st.y ?? 0}) rotate(${st.r ?? 0}) scale(${(st.sc ?? 1) * (st.fx ? -1 : 1)} ${st.sc ?? 1})" opacity="${st.o ?? 1}">${inner}</g>`;
      }
      if (st.ui) overlay += svg; else world += svg;
    }
    const bg = spec.bg ?? '#FFFFFF';
    const gray = cam.gray ? `filter="url(#gray)"` : '';
    let html = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><filter id="gray"><feColorMatrix type="saturate" values="${1 - (cam.gray ?? 0)}"/></filter></defs>
      <rect width="${W}" height="${H}" fill="${bg}"/>
      <g ${gray}><g transform="${shake} translate(${W / 2} ${H / 2}) scale(${cz}) translate(${-cx} ${-cy})">${world}</g>${overlay}</g>`;
    if (cam.flash) html += `<rect width="${W}" height="${H}" fill="#fff" opacity="${cam.flash}"/>`;
    if (cam.black) html += `<rect width="${W}" height="${H}" fill="#111" opacity="${cam.black}"/>`;
    html += captions(beat, gt) + '</svg>';
    root.innerHTML = html;
  }

  // burned-in captions (Shorts): the spoken line in short chunks, timed by the word boundaries from the voice
  function captions(beat, gt) {
    if (!ep.captions) return '';
    for (const ln of beat.lines) {
      if (gt < ln.start || gt > ln.start + ln.dur + 0.1 || ln.who === 'zero') continue;
      const words = ln.words?.length ? ln.words : evenWords(ln);
      const lt = gt - ln.start;
      let idx = words.findIndex(w => lt < w.end); if (idx < 0) idx = words.length - 1;
      const chunk = Math.floor(idx / 3) * 3;
      const txt = words.slice(chunk, chunk + 3).map((w, j) => `<tspan fill="${chunk + j === idx ? (ln.who === 'pix' ? COLORS.AMBER : COLORS.YEL) : '#fff'}">${esc(w.w)}</tspan>`).join(' ');
      const y = ep.capY ?? (W < H ? 1700 : H * 0.86), fs = ep.capSize ?? (W < H ? 82 : 64);
      return `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${fs}" stroke="#111" stroke-width="${fs * 0.16}" paint-order="stroke" stroke-linejoin="round">${txt}</text>`;
    }
    return '';
  }
  function evenWords(ln) {
    const ws = ln.text.split(/\s+/).filter(Boolean); const d = ln.dur / Math.max(1, ws.length);
    return ws.map((w, i) => ({ w, end: (i + 1) * d }));
  }

  window.frame = t => {
    let b = D.beats[D.beats.length - 1];
    for (const x of D.beats) if (t < x.start + x.dur) { b = x; break; }
    draw(b, t);
  };
  window.ready = true;
})();
