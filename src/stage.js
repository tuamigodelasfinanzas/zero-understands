// Runs inside the browser. window.DATA = { ep, beats: [{start, dur, lines: [{start, dur, who, text}]}], w, h, fps }.
// window.frame(t) draws the whole video at second t. Every visual comes from the episode JSON, so the same
// episode can be re-rendered in another language by translating its strings.
(() => {
  const { zero, limbs, pix, PROPS, COLORS, FONT, esc } = window.PUPPETS;
  const D = window.DATA, ep = D.ep, W = D.w, H = D.h;
  const root = document.getElementById('stage');
  // the life layer (see alive() below) is on unless the episode sets life: false or the render runs with ZERO_LIFE=0
  const LIFE = D.ep.life ?? D.life ?? true;
  // light rim around ZERO so his black body reads on dark sets; invisible on light ones (ZERO_RIM=0 or ep.rim: false turns it off)
  const RIM = D.ep.rim ?? D.rim ?? true;

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
      return { id, type: a.type, keys, z: a.z ?? 0, depth: a.depth };
    });
    finals[i] = {};
    for (const a of b.actors) finals[i][a.id] = stateAt(a.keys, b.dur + 1, b);
  });

  // ---------- life: principles of animation applied on top of the keyframes ----------
  // The keys say where ZERO must be; this layer decides how he gets there. It samples the keyed motion a little
  // before and after "now" and derives: anticipation (a small move against the direction before a move starts),
  // follow-through/overshoot when it stops, leaning into motion and back on acceleration, the head and the hands
  // dragging behind the body (overlapping action), eyes leading the turn, subtle squash and stretch on vertical
  // impulses, and an idle layer (breathing, weight shift, small head drift) so he is never frozen.
  const clamp = (v, a) => Math.max(-a, Math.min(a, v));
  const V2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  function alive(a, st, beat, lt, gt, sp) {
    const at = t => stateAt(a.keys, Math.min(beat.dur, Math.max(0, t)), beat);
    const h = 0.14;
    const P = at(lt - h), N = at(lt + h);
    const flip = st.flip ? -1 : 1;
    const s = st.s ?? 1;
    const seed = a.id.length * 1.7 + (a.id.charCodeAt(0) || 0) * 0.13;
    const lying = Math.abs(st.r ?? 0) > 30;
    // body: anticipation + overshoot from the second difference of x / y (ignored for teleports and cuts)
    const d2 = (k) => { const p0 = P[k] ?? st[k] ?? 0, p1 = st[k] ?? 0, p2 = N[k] ?? st[k] ?? 0; const a2 = p2 - 2 * p1 + p0; return Math.abs(a2) > 260 || Math.abs(p2 - p0) > 900 ? [0, 0] : [a2, (p2 - p0) / (2 * h)]; };
    const [ax, vx] = d2('x'), [ay, vy] = d2('y');
    if (!lying) {
      st.x = (st.x ?? 0) - clamp(ax * 0.3, 7 * s);
      st.y = (st.y ?? 0) - clamp(ay * 0.18, 5 * s);
      // lean into the motion, and back when it is about to start (the body is "pushed" by the hips)
      st.lean = (st.lean ?? 0) + flip * (clamp(vx / s * 0.012, 7) - clamp(ax / s * 0.09, 6));
      // head lags behind the body
      st.headR = (st.headR ?? 0) + flip * clamp(-vx / s * 0.006, 5) + flip * clamp(ax / s * 0.05, 4);
      // squash on vertical impulses, stretch while moving fast vertically
      st.squash = (st.squash ?? 1) * (1 - Math.min(0.07, Math.abs(ay) / s * 0.0016) + Math.min(0.04, Math.abs(vy) / s * 0.00005));
    }
    // limbs: blur over ~0.15 s (smooth pose changes, hands arrive a beat after the body) + a little overshoot
    const L = (t) => limbs(at(t));
    const now = limbs(st);
    const lag = (k) => {
      let acc = [0, 0], wsum = 0;
      for (let i = 0; i < 5; i++) { const w = [0.3, 0.25, 0.2, 0.15, 0.1][i], v = L(lt - i * 0.035)[k]; acc = [acc[0] + v[0] * w, acc[1] + v[1] * w]; wsum += w; }
      const cur = [acc[0] / wsum, acc[1] / wsum];
      let old = [0, 0]; for (let i = 0; i < 5; i++) { const v = L(lt - 0.12 - i * 0.035)[k]; old = [old[0] + v[0] / 5, old[1] + v[1] / 5]; }
      const over = [clamp((cur[0] - old[0]) * 0.28, 7), clamp((cur[1] - old[1]) * 0.28, 7)];
      // when the keys hold still, the overshoot settles: blend it out by how far the blur already is from "now"
      const settle = Math.min(1, Math.hypot(now[k][0] - cur[0], now[k][1] - cur[1]) / 6 + 0.25);
      return [cur[0] + over[0] * settle, cur[1] + over[1] * settle];
    };
    st.hl = lag('hl'); st.hr = lag('hr');
    if (!lying) { st.fl = lag('fl'); st.fr = lag('fr'); }
    // eyes lead: look where the keys will be looking a moment from now
    const ahead = at(lt + 0.12);
    if (isNumArr(ahead.look)) st.look = ahead.look;
    // idle: breathing (3.4 s), weight shift (5.3 s), head drift; hands breathe with the chest
    const br = Math.sin(gt * 2 * Math.PI / 3.4 + seed);
    st.squash = (st.squash ?? 1) * (1 + 0.012 * br);
    if (!lying) {
      st.lean = (st.lean ?? 0) + 1.3 * Math.sin(gt * 2 * Math.PI / 5.3 + seed * 0.7);
      st.headR = (st.headR ?? 0) + 1.6 * Math.sin(gt * 2 * Math.PI / 4.1 + seed) + 0.7 * Math.sin(gt * 1.3 + seed * 2);
    }
    st.hl = V2(st.hl, [st.hl[0], st.hl[1] - 1.2 * br], 1);
    st.hr = V2(st.hr, [st.hr[0], st.hr[1] - 1.2 * br], 1);
    // talking: small nods instead of a rigid head
    if (sp >= 0) st.headR = (st.headR ?? 0) + 2.5 * Math.sin(sp * 5.5) * Math.min(1, sp * 4);
    return st;
  }

  // tout / tin: { type: 'zoom' | 'iris' | 'wipe' | 'fall', x, y (world point for zoom/iris), dur, color }
  //   zoom: the camera dives into a point (a screen, a head, a door) and the next beat opens from it
  //   iris: a circle closes on a point; wipe: a band of colour crosses the frame; fall: the world drops away upwards
  function transition(spec, beat, lt) {
    const out = {};
    const one = (t, k, dir) => { // k: 0 → 1 progress into the cut (dir 'out') or out of it ('in')
      const x = t.x ?? W / 2, y = t.y ?? H / 2, col = t.color ?? '#111111';
      const e = dir === 'out' ? EASE.in(k) : EASE.out(1 - k);    // e = 1 at the cut
      if (t.type === 'zoom') { out.zoom = 1 + e * (t.z ?? 9); out.zx = x; out.zy = y; out.pull = Math.min(1, e * 1.6); if (e > 0.75) out.over = `<rect width="${W}" height="${H}" fill="${col}" opacity="${((e - 0.75) / 0.25).toFixed(3)}"/>`; }
      if (t.type === 'iris') { const r = Math.hypot(W, H) * (1 - e); out.over = `<path fill-rule="evenodd" fill="${col}" d="M0 0H${W}V${H}H0Z M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z"/>`; }
      if (t.type === 'wipe') { const p = dir === 'out' ? EASE.io(k) : 1 + EASE.io(k); const X = -W * 1.3 + p * W * 1.3; out.over = `<path fill="${t.color ?? '#FFC93C'}" d="M${X} 0 H${X + W * 1.15} L${X + W * 1.3} ${H} H${X + W * 0.15} Z"/>`; }
      if (t.type === 'fall') out.dy = (dir === 'out' ? 1 : -1) * e * H * 1.2;
    };
    if (spec.tout) { const d = spec.tout.dur ?? 0.5, k = (lt - (beat.dur - d)) / d; if (k > 0) one(spec.tout, Math.min(1, k), 'out'); }
    if (spec.tin) { const d = spec.tin.dur ?? 0.5, k = lt / d; if (k < 1) one(spec.tin, Math.max(0, k), 'in'); }
    return out;
  }

  function speaking(beat, who, gt) {
    for (const ln of beat.lines) if (ln.who === who && gt >= ln.start && gt <= ln.start + ln.dur) return gt - ln.start;
    return -1;
  }

  function draw(beat, gt) {
    const lt = gt - beat.start;
    const spec = ep.beats[beat.i];
    const cam = spec.cam ? stateAt(spec.cam.map(k => Object.assign({}, k, (k.t == null && k.u == null && k.l == null && k.end == null) ? { t: 0 } : {})), lt, beat) : {};
    let cz = cam.z ?? 1, cx = cam.x ?? W / 2, cy = cam.y ?? H / 2;
    // integrated transitions (docs/direccion-visual.md §14): tout ends a beat, tin opens the next one
    const tr = transition(spec, beat, lt);
    if (tr.zoom) { cz *= tr.zoom; cx += (tr.zx - cx) * tr.pull; cy += (tr.zy - cy) * tr.pull; }
    if (tr.dy) cy += tr.dy;
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
        svg = zero(Object.assign(LIFE && st.life !== false ? alive(a, st, beat, lt, gt, sp) : { ...st }, { rim: RIM && !(tr.zoom > 1.8) ? st.rim ?? 1 : 0 }));   // no rim inside zoom transitions: huge filter regions stall the renderer
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
      // parallax: depth < 1 sits behind (moves and zooms less with the camera), > 1 is foreground
      if (a.depth != null && a.depth !== 1 && svg) {
        const k = (1 + (cz - 1) * a.depth) / cz, dx = (cx - W / 2) * (1 - a.depth), dy = (cy - H / 2) * (1 - a.depth);
        svg = `<g transform="translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy}) translate(${dx.toFixed(1)} ${dy.toFixed(1)})">${svg}</g>`;
      }
      if (st.ui) overlay += svg; else world += svg;
    }
    const bg = spec.bg ?? '#FFFFFF';
    const gray = cam.gray ? `filter="url(#gray)"` : '';
    let html = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><filter id="zrim" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="d"/>
        <feFlood flood-color="#FFF4E3"/><feComposite in2="d" operator="in" result="rim"/>
        <feGaussianBlur in="d" stdDeviation="7" result="b"/>
        <feFlood flood-color="#FFF4E3" flood-opacity="0.32"/><feComposite in2="b" operator="in" result="glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="gray"><feColorMatrix type="saturate" values="${1 - (cam.gray ?? 0)}"/></filter></defs>
      <rect width="${W}" height="${H}" fill="${bg}"/>
      <g ${gray}><g transform="${shake} translate(${W / 2} ${H / 2}) scale(${cz}) translate(${-cx} ${-cy})">${world}</g>${overlay}</g>`;
    if (cam.flash) html += `<rect width="${W}" height="${H}" fill="#fff" opacity="${cam.flash}"/>`;
    if (cam.black) html += `<rect width="${W}" height="${H}" fill="#111" opacity="${cam.black}"/>`;
    html += tr.over || '';
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
