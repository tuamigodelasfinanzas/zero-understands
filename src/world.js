// The world kit for "Zero Understands" (docs/mundo-vivo.md): the places ZERO walks into, drawn by code.
// Simple character, rich world. ZERO is the only thing with a black outline; the world is flat tonal shapes with a
// darker side and a soft contact shadow, lit by warm and cool pools, so he always reads first.
// Every prop gets gt (seconds since the video started) from the stage, and uses it for its own small life:
// steam, blinking lights, rollers, rain, passing cars, a cat's tail. The world keeps moving while ZERO stands still.
(() => {
  const { PROPS, COLORS, FONT, esc, zero } = window.PUPPETS;
  const { INK, WHITE, YEL, AMBER, RED, BLUE, CORAL } = COLORS;
  const f = n => Math.round(n * 100) / 100;
  const T = (txt, size, color, x = 0, y = 0, extra = '') => `<text x="${f(x)}" y="${f(y + size * 0.35)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${size}" fill="${color}" ${extra}>${esc(txt)}</text>`;
  const fr = x => x - Math.floor(x);
  // deterministic noise: same input, same value, every frame and every render
  const rnd = i => fr(Math.sin(i * 127.1 + 311.7) * 43758.5453);
  const S = p => `scale(${p.s ?? 1})`;
  // blends two hex colours (k = 0 → a, 1 → b)
  const mix = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const c = [16, 8, 0].map(s => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k)); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
  const shade = (c, k) => mix(c, '#0B0E1C', k), tint = (c, k) => mix(c, '#FFFFFF', k);
  const gid = (...a) => 'w' + a.join('').replace(/[^a-zA-Z0-9]/g, '');

  // ---------- shared colours of the night-shift world ----------
  const NIGHT = { sky: '#0E1330', sky2: '#27305E', wall: '#2E3458', wallDk: '#242946', floor: '#1E2238', warm: '#FFD58A', sodium: '#FFB25C', cool: '#9FD0FF', sys: '#4FA8FF', teal: '#2D6E7E' };

  // light gradients, shared by every prop (the stage puts WORLD.defs inside the frame's <defs>)
  const defs = `
    <radialGradient id="wWarm"><stop offset="0" stop-color="#FFE2A6" stop-opacity="0.75"/><stop offset="0.5" stop-color="#FFC976" stop-opacity="0.25"/><stop offset="1" stop-color="#FFC976" stop-opacity="0"/></radialGradient>
    <radialGradient id="wSodium"><stop offset="0" stop-color="#FFB867" stop-opacity="0.7"/><stop offset="0.55" stop-color="#FF9E45" stop-opacity="0.22"/><stop offset="1" stop-color="#FF9E45" stop-opacity="0"/></radialGradient>
    <radialGradient id="wCool"><stop offset="0" stop-color="#CFE8FF" stop-opacity="0.6"/><stop offset="0.5" stop-color="#9FD0FF" stop-opacity="0.2"/><stop offset="1" stop-color="#9FD0FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="wSys"><stop offset="0" stop-color="#7CC2FF" stop-opacity="0.7"/><stop offset="0.5" stop-color="#4FA8FF" stop-opacity="0.22"/><stop offset="1" stop-color="#4FA8FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="wPix"><stop offset="0" stop-color="#FFE7A0" stop-opacity="0.8"/><stop offset="0.45" stop-color="#FFC93C" stop-opacity="0.25"/><stop offset="1" stop-color="#FFC93C" stop-opacity="0"/></radialGradient>
    <radialGradient id="wVig" cx="0.5" cy="0.5" r="0.72"><stop offset="0.55" stop-color="#05060F" stop-opacity="0"/><stop offset="1" stop-color="#05060F" stop-opacity="0.85"/></radialGradient>
    <linearGradient id="wConeWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE2A6" stop-opacity="0.55"/><stop offset="1" stop-color="#FFE2A6" stop-opacity="0"/></linearGradient>
    <linearGradient id="wConeCool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE8FF" stop-opacity="0.45"/><stop offset="1" stop-color="#CFE8FF" stop-opacity="0"/></linearGradient>
    <linearGradient id="wDark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#04050B" stop-opacity="0"/><stop offset="1" stop-color="#04050B" stop-opacity="0.95"/></linearGradient>
    <linearGradient id="wFloorFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient>
    <pattern id="wGrid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4FA8FF" stroke-width="1.5" opacity="0.5"/></pattern>`;

  // ---------- small pieces ----------
  const box = (w, h, c, o = {}) => { // a cardboard box seen from the side with a hint of its top (no outline)
    const top = o.top ?? 0.18 * h;
    return `<g><path d="M ${-w / 2} ${-h} L ${-w / 2 + top * 0.6} ${-h - top} L ${w / 2 + top * 0.6} ${-h - top} L ${w / 2} ${-h} Z" fill="${tint(c, 0.18)}"/>
      <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${c}"/><path d="M ${w / 2} ${-h} L ${w / 2 + top * 0.6} ${-h - top} L ${w / 2 + top * 0.6} ${-top} L ${w / 2} 0 Z" fill="${shade(c, 0.25)}"/>
      ${o.tape !== false ? `<rect x="${-w * 0.08}" y="${-h}" width="${w * 0.16}" height="${h * 0.35}" fill="${tint(c, 0.3)}" opacity="0.6"/>` : ''}</g>`;
  };
  const icons = { // line icons for holograms and signs, centred, ~100 px
    truck: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"><path d="M -50 20 V -30 H 18 V 20 Z"/><path d="M 18 -12 H 38 L 52 6 V 20 H 18"/><circle cx="-28" cy="26" r="10" fill="${c}"/><circle cx="34" cy="26" r="10" fill="${c}"/></g>`,
    plane: c => `<path d="M -54 6 L -10 4 L 14 -40 L 26 -40 L 14 4 L 44 4 L 54 -12 L 62 -12 L 56 12 L 62 36 L 54 36 L 44 20 L 14 20 L 26 64 L 14 64 L -10 22 L -54 20 Q -64 13 -54 6 Z" transform="translate(-4 -12) scale(0.9)" fill="${c}"/>`,
    hub: c => `<g fill="${c}"><path d="M -60 30 V -6 L -30 -24 L 0 -6 L 30 -24 L 60 -6 V 30 Z"/><rect x="-46" y="4" width="14" height="14" fill="#0A1B33"/><rect x="-16" y="4" width="14" height="14" fill="#0A1B33"/><rect x="14" y="4" width="14" height="14" fill="#0A1B33"/><rect x="42" y="4" width="8" height="26" fill="#0A1B33"/></g>`,
    label: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"><path d="M -40 -46 H 26 L 44 -28 V 46 H -40 Z"/></g><g fill="${c}">${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-28 + i * 9}" y="10" width="${i % 3 ? 4 : 7}" height="26"/>`).join('')}<rect x="-28" y="-30" width="40" height="7"/><rect x="-28" y="-16" width="56" height="7"/></g>`,
    coin: c => `<circle r="44" fill="none" stroke="${c}" stroke-width="8"/>${T('$', 58, c, 0, -4)}`,
    warn: c => `<path d="M 0 -50 L 52 42 H -52 Z" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="round"/><rect x="-5" y="-16" width="10" height="34" rx="4" fill="${c}"/><circle cy="30" r="6" fill="${c}"/>`,
    house: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"><path d="M -44 4 L 0 -38 L 44 4"/><path d="M -32 -6 V 40 H 32 V -6"/><rect x="-10" y="12" width="20" height="28"/></g>`,
    sun: c => `<g stroke="${c}" stroke-width="7" stroke-linecap="round" fill="none"><path d="M -40 20 A 40 40 0 0 1 40 20"/><path d="M -60 20 H 60"/>${[-60, -30, 0, 30, 60].map(a => `<path d="M 0 0 L 0 -14" transform="translate(${f(Math.sin(a * Math.PI / 180) * 56)} ${f(20 - Math.cos(a * Math.PI / 180) * 56)}) rotate(${a})"/>`).join('')}</g>`,
    gps: c => `<path d="M 0 46 C -30 10 -36 -4 -36 -14 A 36 36 0 0 1 36 -14 C 36 -4 30 10 0 46 Z" fill="none" stroke="${c}" stroke-width="7"/><circle cy="-14" r="12" fill="${c}"/>`,
    heart: c => `<path d="M 0 30 C -50 -10 -30 -50 0 -22 C 30 -50 50 -10 0 30 Z" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>`,
    cup: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"><path d="M -30 -20 H 26 V 20 Q 26 40 -2 40 Q -30 40 -30 20 Z"/><path d="M 26 -8 Q 44 -8 44 6 Q 44 18 26 18"/><path d="M -14 -34 q 6 -8 0 -16 M 4 -34 q 6 -8 0 -16" stroke-linecap="round"/></g>`,
    cap: c => `<g fill="${c}"><path d="M -60 -10 L 0 -36 L 60 -10 L 0 16 Z"/><path d="M -34 2 V 26 Q 0 44 34 26 V 2 L 0 16 Z"/></g><path d="M 50 -6 V 30" stroke="${c}" stroke-width="5"/><circle cx="50" cy="34" r="7" fill="${c}"/>`,
    clock: c => `<circle r="46" fill="none" stroke="${c}" stroke-width="8"/><path d="M 0 -28 V 0 L 20 12" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    people: c => `<g fill="${c}"><circle cx="-26" cy="-22" r="14"/><path d="M -50 30 Q -50 -2 -26 -2 Q -2 -2 -2 30 Z"/><circle cx="26" cy="-22" r="14"/><path d="M 2 30 Q 2 -2 26 -2 Q 50 -2 50 30 Z"/></g>`,
  };

  // the air network on the US map (video 001 part 2): ZERO's expected straight line to mom (direct 0..1, cross 0..1
  // strikes it out), the real flight to the hub (zarc 0..1), every other city's flight converging (arcs 0..1, with
  // planes flowing along them; frozen stops them, arcColor/hubColor recolour), and the four-hour circle around the
  // hub (ring 0..1, filled only over land)
  const HUB = [265, 111];
  const CITIES = [[40, 32], [30, 100], [55, 150], [100, 168], [105, 88], [150, 105], [215, 52], [205, 180], [232, 204], [300, 150], [335, 212], [352, 74], [372, 52], [180, 140], [320, 100]];
  const arcPath = (a, b, lift = 34) => `M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - lift} ${b[0]} ${b[1]}`;
  const onArc = (a, b, k, lift = 34) => { const c = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - lift]; return [(1 - k) ** 2 * a[0] + 2 * (1 - k) * k * c[0] + k * k * b[0], (1 - k) ** 2 * a[1] + 2 * (1 - k) * k * c[1] + k * k * b[1]]; };
  function usx(p, pts) {
    const gt = p.gt ?? 0, A = [48, 112], B = [366, 80];
    let o = '';
    if ((p.ring ?? 0) > 0) { const r = 240 * p.ring; o += `<defs><clipPath id="wUSclip"><polygon points="${pts}"/></clipPath></defs><circle cx="${HUB[0]}" cy="${HUB[1]}" r="${f(r)}" fill="#BFE3FF" opacity="0.2" clip-path="url(#wUSclip)"/><circle cx="${HUB[0]}" cy="${HUB[1]}" r="${f(r)}" fill="none" stroke="${YEL}" stroke-width="3" stroke-dasharray="10 8" opacity="0.9"/>`; }
    if ((p.direct ?? 0) > 0) o += `<path d="M ${A[0]} ${A[1]} L ${B[0]} ${B[1]}" stroke="#E6ECF5" stroke-width="4" stroke-dasharray="12 10" pathLength="320" stroke-dashoffset="0" opacity="0.8" style="stroke-dasharray:${f(320 * p.direct)} 320"/>`;
    if ((p.cross ?? 0) > 0) { const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], k = p.cross * 22; o += `<path d="M ${f(m[0] - k)} ${f(m[1] - k)} L ${f(m[0] + k)} ${f(m[1] + k)} M ${f(m[0] + k)} ${f(m[1] - k)} L ${f(m[0] - k)} ${f(m[1] + k)}" stroke="#FF5A4E" stroke-width="8" stroke-linecap="round"/>`; }
    const n = Math.round(CITIES.length * (p.arcs ?? 0));
    const ac = p.arcColor ?? '#7CC2FF';
    CITIES.slice(0, n).forEach((c, i) => { o += `<path d="${arcPath(c, HUB)}" fill="none" stroke="${ac}" stroke-width="2.5" opacity="0.7"/><circle cx="${c[0]}" cy="${c[1]}" r="4" fill="${ac}"/>`; const q = onArc(c, HUB, p.frozen ? 0.15 + 0.1 * rnd(i) : fr(gt * 0.3 + i * 0.37)); o += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="4.5" fill="#FFFFFF"/>`; });
    if ((p.zarc ?? 0) > 0) { o += `<path d="${arcPath(A, HUB, 50)}" fill="none" stroke="${YEL}" stroke-width="5" stroke-linecap="round" pathLength="300" stroke-dasharray="${f(300 * p.zarc)} 300"/>`; const q = onArc(A, HUB, p.zarc, 50); o += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="7" fill="${YEL}"/>`; }
    const hc = p.hubColor ?? YEL;
    if (p.hub) o += `<circle cx="${HUB[0]}" cy="${HUB[1]}" r="9" fill="${hc}"/><circle cx="${HUB[0]}" cy="${HUB[1]}" r="${f(9 + 22 * fr(gt * 0.8))}" fill="none" stroke="${hc}" stroke-width="3" opacity="${f(1 - fr(gt * 0.8))}"/>${p.hubLabel ? `<g transform="translate(${HUB[0]} ${HUB[1] + 30})"><rect x="-62" y="-13" width="124" height="26" rx="5" fill="#0A1B33" opacity="0.85"/>${T(p.hubLabel, 15, YEL, 0, -4, 'letter-spacing="1"')}</g>` : ''}`;
    return o;
  }

  // ---------- the props ----------
  const W = {
    // full-frame vertical gradient (sky, wall wash); a and b are the top and bottom colours
    bgrad(p) { const id = gid('bg', p.a, p.b); const w = p.w ?? 9000, h = p.h ?? 6000; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/></linearGradient></defs><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#${id})"/>`; },
    // a soft pool of light; kind warm | cool | sodium | sys | pix; fl adds a faint flicker
    pool(p) { const fl = p.fl ? 1 - p.fl * (0.5 + 0.5 * Math.sin(p.gt * 23) * Math.sin(p.gt * 7.3)) : 1; return `<ellipse rx="${p.rx ?? 400}" ry="${p.ry ?? p.rx ?? 400}" fill="url(#w${({ warm: 'Warm', cool: 'Cool', sodium: 'Sodium', sys: 'Sys', pix: 'Pix' })[p.kind ?? 'warm']})" opacity="${f((p.op ?? 1) * fl)}"/>`; },
    // a cone of light from a lamp at (0,0) down to y = len
    cone(p) { const w0 = p.w0 ?? 60, w1 = p.w1 ?? 520, l = p.len ?? 700; return `<path d="M ${-w0 / 2} 0 L ${w0 / 2} 0 L ${w1 / 2} ${l} L ${-w1 / 2} ${l} Z" fill="url(#${p.cool ? 'wConeCool' : 'wConeWarm'})" opacity="${p.op ?? 1}"/>`; },
    vignette(p) { return `<rect x="0" y="0" width="1920" height="1080" fill="url(#wVig)" opacity="${p.op ?? 1}"/>`; },
    haze(p) { return `<rect x="-5000" y="-5000" width="10000" height="10000" fill="${p.color ?? '#141833'}" opacity="${p.op ?? 0.25}"/>`; },
    // the interior every indoor scene stands in: wall, skirting, floorboards converging to a vanishing point
    // (a slight perspective view instead of a flat side band), floor line at y = 0
    interior(p) {
      const wall = p.wall ?? NIGHT.wall, fl = p.floor ?? '#3A3048', vx = p.vx ?? 0, n = 26;
      let planks = '';
      for (let i = -n; i <= n; i++) planks += `<path d="M ${i * 160} 0 L ${f(vx + (i * 160 - vx) * 3.2)} 900" stroke="${shade(fl, 0.3)}" stroke-width="3" opacity="0.55"/>`;
      const stripes = p.paper ? Array.from({ length: 60 }, (_, i) => `<rect x="${-4800 + i * 160}" y="-3000" width="56" height="3000" fill="${tint(wall, 0.05)}"/>`).join('') : '';
      const tiles = p.tiles ? `<g opacity="0.5">${Array.from({ length: 12 }, (_, r) => Array.from({ length: 70 }, (_, c) => `<rect x="${-4800 + c * 140 + (r % 2) * 70}" y="${-1120 + r * 70}" width="134" height="64" rx="4" fill="${tint(wall, 0.06)}"/>`).join('')).join('')}</g>` : '';
      return `<g><rect x="-5000" y="-3000" width="10000" height="3000" fill="${wall}"/>${stripes}${tiles}
        <rect x="-5000" y="0" width="10000" height="1600" fill="${fl}"/>${planks}<rect x="-5000" y="0" width="10000" height="900" fill="url(#wFloorFade)"/>
        <rect x="-5000" y="-34" width="10000" height="34" fill="${shade(wall, 0.35)}"/><rect x="-5000" y="-38" width="10000" height="5" fill="${tint(wall, 0.15)}"/></g>`;
    },
    // window onto a night city: sky, moon, two layers of buildings whose windows switch on and off, a train
    // crossing every ~9 s, curtains, and optional rain running down the glass
    nightWindow(p) {
      const w = p.w ?? 380, h = p.h ?? 320, gt = p.gt ?? 0, id = gid('nw', p.seed ?? 1, w, h);
      const bld = (layer, n, col, base, hmin, hmax, sp) => Array.from({ length: n }, (_, i) => {
        const bw = 40 + rnd(i + layer * 50) * 50, x = -w / 2 - 20 + i * (w + 40) / n, bh = hmin + rnd(i * 3 + layer) * (hmax - hmin);
        const lights = Array.from({ length: Math.floor(bh / 26) * 2 }, (_, j) => { const on = rnd(i * 31 + j * 7 + layer + Math.floor(gt / (3 + rnd(j + i) * 6))) > 0.55; return on ? `<rect x="${f(x + 8 + (j % 2) * (bw / 2 - 4))}" y="${f(base - bh + 10 + Math.floor(j / 2) * 26)}" width="9" height="11" fill="${rnd(i + j) > 0.8 ? '#BFE3FF' : '#FFD58A'}" opacity="${sp}"/>` : ''; }).join('');
        return `<rect x="${f(x)}" y="${f(base - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${col}"/>${lights}`;
      }).join('');
      const tx = ((gt + (p.seed ?? 0) * 3) % 9) / 9 * (w + 400) - w / 2 - 200;
      const train = `<g transform="translate(${f(tx)} ${h * 0.28})"><rect x="0" y="-10" width="180" height="16" rx="4" fill="#1A1F3A"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${8 + i * 21}" y="-6" width="12" height="6" fill="#FFE7A8"/>`).join('')}</g>`;
      const rain = p.rain ? Array.from({ length: 26 }, (_, i) => { const x = -w / 2 + rnd(i) * w, y = fr(gt * (0.25 + rnd(i + 9) * 0.3) + rnd(i + 3)) * (h + 40) - h / 2 - 20; return `<path d="M ${f(x)} ${f(y)} q 2 10 0 ${f(14 + rnd(i + 5) * 12)}" stroke="#CFE6FF" stroke-width="3" opacity="0.55" fill="none" stroke-linecap="round"/>`; }).join('') : '';
      const cur = p.curtains === false ? '' : `<path d="M ${-w / 2 - 60} ${-h / 2 - 50} H ${-w / 2 + 40} Q ${-w / 2 + 20 + 6 * Math.sin(gt * 0.9)} ${0} ${-w / 2 + 50} ${h / 2 + 30} H ${-w / 2 - 60} Z" fill="${p.curtain ?? '#6B4E7A'}"/>
        <path d="M ${w / 2 + 60} ${-h / 2 - 50} H ${w / 2 - 40} Q ${w / 2 - 20 + 6 * Math.sin(gt * 0.8 + 1)} ${0} ${w / 2 - 50} ${h / 2 + 30} H ${w / 2 + 60} Z" fill="${p.curtain ?? '#6B4E7A'}"/>
        <rect x="${-w / 2 - 90}" y="${-h / 2 - 62}" width="${w + 180}" height="12" rx="6" fill="#1B1E33"/>`;
      return `<g transform="${S(p)}"><defs><clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath>
          <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky ?? NIGHT.sky}"/><stop offset="1" stop-color="${p.sky2 ?? '#3B3F78'}"/></linearGradient></defs>
        <g clip-path="url(#${id})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#${id}s)"/>
          <circle cx="${w * 0.25}" cy="${-h * 0.26}" r="${h * 0.08}" fill="#FFF4D6" opacity="0.9"/>
          ${bld(0, 9, '#3A4078', h * 0.5, h * 0.25, h * 0.6, 0.6)}${train}${bld(1, 6, '#232850', h * 0.5, h * 0.12, h * 0.38, 0.95)}${rain}
          <path d="M ${-w / 2} ${-h / 2} L ${-w / 2 + w * 0.35} ${-h / 2} L ${-w / 2} ${h * 0.1} Z" fill="#fff" opacity="0.05"/></g>
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="#E8DCC8" stroke-width="14"/><path d="M 0 ${-h / 2} V ${h / 2}" stroke="#E8DCC8" stroke-width="9"/>
        <rect x="${-w / 2 - 26}" y="${h / 2}" width="${w + 52}" height="20" rx="4" fill="#D9CBB4"/><rect x="${-w / 2 - 26}" y="${h / 2 + 20}" width="${w + 52}" height="8" fill="#9C8F7C"/>${cur}</g>`;
    },
    // fridge: hums (a tiny shiver), magnets, a photo, a US map magnet with two hearts; door opens (open 0..1) with cold light
    fridge(p) {
      const gt = p.gt ?? 0, j = p.hum === false ? 0 : 0.6 * Math.sin(gt * 90) * (Math.sin(gt * 0.7) > 0 ? 1 : 0.3), c = p.color ?? '#D9E3EC', o = p.open ?? 0;
      const mags = [[-80, -560, CORAL], [60, -520, BLUE], [90, -300, YEL], [-60, -250, '#7BC67E']].map(([x, y, col]) => `<circle cx="${x}" cy="${y}" r="10" fill="${col}"/>`).join('');
      return `<g transform="${S(p)} translate(${f(j)} 0)">
        <ellipse cx="0" cy="4" rx="190" ry="18" fill="#000" opacity="0.3"/>
        <rect x="-150" y="-640" width="300" height="640" rx="26" fill="${c}"/><rect x="110" y="-640" width="40" height="640" rx="20" fill="${shade(c, 0.18)}"/>
        <rect x="-150" y="-420" width="300" height="10" fill="${shade(c, 0.22)}"/>
        <rect x="-128" y="-600" width="12" height="130" rx="6" fill="${shade(c, 0.35)}"/><rect x="-128" y="-380" width="12" height="170" rx="6" fill="${shade(c, 0.35)}"/>
        ${mags}
        <g transform="translate(-20 -560) rotate(-4)"><rect x="-44" y="-34" width="88" height="68" fill="#F5EFE4"/><rect x="-36" y="-26" width="72" height="44" fill="#9CC3E6"/><circle cx="-8" cy="4" r="9" fill="#5A3E2B"/><rect x="-16" y="12" width="16" height="10" fill="#C0533F"/><circle cx="14" cy="6" r="7" fill="${INK}"/></g>
        <g transform="translate(10 -200)">${PROPS.usmap({ s: p.mapS ?? 0.42, tone: 'magnet', a: p.mapA ?? 0, prog: p.mapProg ?? 0, gt })}</g>
        ${o > 0 ? `<path d="M 150 -640 L ${f(150 + 240 * o)} -600 L ${f(150 + 240 * o)} -30 L 150 0 Z" fill="${tint(c, 0.1)}"/><path d="M 150 -630 L ${f(150 + 700 * o)} -300 L ${f(150 + 900 * o)} 300 L 150 0 Z" fill="url(#wConeCool)" opacity="${f(o)}"/>` : ''}
      </g>`;
    },
    // stylized contiguous US outline; tone 'magnet' (fridge souvenir), 'holo' (system blue), 'paper';
    // a = ZERO's dot, b = mom's heart; prog 0..1 draws the dashed route; stretch > 1 widens it (the comic version)
    usmap(p) {
      const pts = '20,20 110,22 180,28 250,30 262,40 285,45 300,60 320,50 335,58 350,55 365,40 385,22 398,35 380,55 370,70 365,90 372,105 360,125 345,145 330,165 338,195 345,222 330,215 318,180 300,172 270,178 245,185 225,195 210,225 190,205 175,185 155,175 120,172 90,165 55,150 40,125 22,90 15,55';
      const st = p.stretch ?? 1, tone = p.tone ?? 'holo';
      const fill = tone === 'holo' ? 'rgba(79,168,255,0.16)' : tone === 'paper' ? '#E9DFC9' : '#7BC6A4', stroke = tone === 'holo' ? NIGHT.sys : tone === 'paper' ? '#B9A989' : '#4E9C7A';
      const A = [48, 112], B = [366, 80], prog = p.prog ?? 0, len = 330;
      const route = prog > 0 ? `<path d="M ${A[0]} ${A[1]} Q 210 40 ${B[0]} ${B[1]}" fill="none" stroke="${tone === 'holo' ? YEL : RED}" stroke-width="5" stroke-linecap="round" pathLength="${len}" stroke-dasharray="${f(len * prog)} ${len}"/>` : '';
      const dots = (p.dots ?? []).map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${YEL}"/>${i === p.dots.length - 1 ? `<circle cx="${x}" cy="${y}" r="${f(7 + 14 * fr(p.gt ?? 0))}" fill="none" stroke="${YEL}" stroke-width="3" opacity="${f(1 - fr(p.gt ?? 0))}"/>` : ''}`).join('');
      return `<g transform="${S(p)} scale(${st} 1) translate(-206 -122)">
        <polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${tone === 'holo' ? 4 : 0}" stroke-linejoin="round"/>
        ${tone === 'magnet' ? `<polygon points="${pts}" fill="none" stroke="#3E7D63" stroke-width="5" stroke-linejoin="round" transform="translate(3 5)" opacity="0.4"/>` : ''}
        ${usx(p, pts)}${route}${dots}
        ${(p.a ?? 1) > 0 ? `<g transform="translate(${A[0]} ${A[1]}) scale(${1 / st} 1)"><circle r="10" fill="${INK}"/><circle r="5" fill="${WHITE}"/></g>` : ''}
        <g transform="translate(${B[0]} ${B[1]}) scale(${f((1 + 0.12 * Math.sin((p.gt ?? 0) * 6)) / st)} ${f(1 + 0.12 * Math.sin((p.gt ?? 0) * 6))})"><path d="M 0 12 C -20 -4 -12 -20 0 -9 C 12 -20 20 -4 0 12 Z" fill="${RED}"/></g></g>`;
    },
    // wall calendar: a month grid, the past days crossed out, tomorrow circled in red (circ 0..1 draws it)
    calendar(p) {
      const today = p.today ?? 22, circ = p.circ ?? 1;
      let cells = '';
      for (let d = 1; d <= 31; d++) {
        const i = d + 2, x = -96 + (i % 7) * 32, y = -40 + Math.floor(i / 7) * 34;
        cells += `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="17" fill="${d === today + 1 ? RED : '#4A4F66'}">${d}</text>`;
        if (d < today) cells += `<path d="M ${x - 9} ${y - 15} L ${x + 9} ${y + 3} M ${x + 9} ${y - 15} L ${x - 9} ${y + 3}" stroke="#8A8FA6" stroke-width="2.5"/>`;
        if (d === today + 1 && circ > 0) cells += `<ellipse cx="${x}" cy="${y - 6}" rx="19" ry="17" fill="none" stroke="${RED}" stroke-width="4" pathLength="100" stroke-dasharray="${f(100 * circ)} 100" transform="rotate(-20 ${x} ${y - 6})"/>${circ > 0.95 ? `<path transform="translate(${x + 18} ${y - 26}) scale(0.5)" d="M 0 12 C -20 -4 -12 -20 0 -9 C 12 -20 20 -4 0 12 Z" fill="${RED}"/>` : ''}`;
      }
      return `<g transform="${S(p)} rotate(${p.tilt ?? 1.5})"><rect x="-120" y="-150" width="240" height="300" rx="6" fill="#000" opacity="0.25" transform="translate(6 8)"/>
        <rect x="-120" y="-150" width="240" height="300" rx="6" fill="#F4EEE2"/><rect x="-120" y="-150" width="240" height="70" rx="6" fill="#C9555A"/>
        <rect x="-120" y="-150" width="240" height="70" fill="#7FB8D8" opacity="0.0"/>${T(p.month ?? 'OCTOBER', 30, '#FFF4E3', 0, -122)}
        <circle cx="-60" cy="-150" r="7" fill="#1B1E33"/><circle cx="60" cy="-150" r="7" fill="#1B1E33"/>${cells}</g>`;
    },
    // kitchen counter run: base cabinets, worktop, sink, toaster, fruit bowl, kettle with steam; upper cabinets
    kitchen(p) {
      const gt = p.gt ?? 0, w = p.w ?? 760, top = -330, c = p.color ?? '#7C9CB8';
      const steam = Array.from({ length: 5 }, (_, i) => { const k = fr(gt * 0.45 + i / 5); return `<circle cx="${f(250 + Math.sin(k * 7 + i) * 14)}" cy="${f(top - 120 - k * 170)}" r="${f(10 + k * 26)}" fill="#E6ECF5" opacity="${f(0.32 * (1 - k))}"/>`; }).join('');
      const doors = Array.from({ length: Math.floor(w / 190) }, (_, i) => `<rect x="${-w / 2 + 14 + i * 190}" y="${top + 34}" width="176" height="${-top - 60}" rx="8" fill="${tint(c, 0.08)}"/><rect x="${-w / 2 + 90 + i * 190}" y="${top + 60}" width="24" height="8" rx="4" fill="${shade(c, 0.4)}"/>`).join('');
      const uppers = Array.from({ length: Math.floor(w / 190) }, (_, i) => `<rect x="${-w / 2 + 14 + i * 190}" y="${top - 560}" width="176" height="210" rx="8" fill="${tint(c, 0.12)}"/><rect x="${-w / 2 + 90 + i * 190}" y="${top - 380}" width="24" height="8" rx="4" fill="${shade(c, 0.4)}"/>`).join('');
      return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="${w / 2 + 40}" ry="20" fill="#000" opacity="0.28"/>
        <rect x="${-w / 2}" y="${top - 575}" width="${w}" height="240" rx="6" fill="${c}"/>${uppers}<rect x="${-w / 2}" y="${top - 335}" width="${w}" height="10" fill="${shade(c, 0.35)}"/>
        <rect x="${-w / 2}" y="${top}" width="${w}" height="${-top}" fill="${c}"/>${doors}<rect x="${-w / 2}" y="-26" width="${w}" height="26" fill="${shade(c, 0.45)}"/>
        <rect x="${-w / 2 - 20}" y="${top - 22}" width="${w + 40}" height="30" rx="6" fill="#E9E2D3"/><rect x="${-w / 2 - 20}" y="${top}" width="${w + 40}" height="8" fill="#B8AE9B"/>
        <g transform="translate(-200 ${top - 22})"><rect x="-80" y="-6" width="160" height="10" rx="4" fill="#9FA9B8"/><path d="M -20 -6 V -90 Q -20 -110 10 -110 Q 34 -110 34 -86" fill="none" stroke="#B9C2CF" stroke-width="10" stroke-linecap="round"/></g>
        <g transform="translate(20 ${top - 22})"><rect x="-56" y="-80" width="112" height="80" rx="20" fill="#C9555A"/><rect x="-36" y="-92" width="22" height="14" rx="4" fill="#3A3F5C"/><rect x="10" y="-92" width="22" height="14" rx="4" fill="#3A3F5C"/><rect x="40" y="-50" width="20" height="8" rx="3" fill="#3A3F5C"/></g>
        <g transform="translate(130 ${top - 22})"><path d="M -54 0 Q -54 -40 0 -40 Q 54 -40 54 0 Z" fill="#D8C7A6"/><circle cx="-22" cy="-46" r="20" fill="${CORAL}"/><circle cx="10" cy="-52" r="18" fill="#F2C14E"/><circle cx="30" cy="-40" r="16" fill="#7BC67E"/></g>
        <g transform="translate(250 ${top - 22})"><path d="M -44 0 L -36 -86 Q 0 -104 36 -86 L 44 0 Z" fill="#E9EEF5"/><path d="M 36 -70 Q 70 -66 60 -30" fill="none" stroke="#E9EEF5" stroke-width="12"/><rect x="-14" y="-112" width="28" height="12" rx="5" fill="#3A3F5C"/><path d="M -44 -60 L -78 -78" stroke="#E9EEF5" stroke-width="14" stroke-linecap="round"/><circle cx="-24" cy="-20" r="5" fill="${p.kettleOn === false ? '#555' : '#FF5A4E'}"/></g>
        ${p.steam === false ? '' : steam}</g>`;
    },
    // analog wall clock: h, m set the time; the second hand ticks with real time (sec offset in s0)
    wallclock(p) {
      const gt = p.gt ?? 0, sec = Math.floor((p.s0 ?? 12) + gt) % 60, m = (p.m ?? 47) + (p.run ? gt / 60 : 0), h = (p.h ?? 6) + m / 60;
      const hand = (a, l, w, c) => `<path d="M 0 ${l * 0.18} L 0 ${-l}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" transform="rotate(${f(a)})"/>`;
      return `<g transform="${S(p)}"><circle r="96" fill="#000" opacity="0.25" transform="translate(5 7)"/><circle r="96" fill="${p.rim ?? '#E8DCC8'}"/><circle r="82" fill="#FBF6EC"/>
        ${Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="-76" width="6" height="${i % 3 ? 10 : 18}" rx="3" fill="#3A3F5C" transform="rotate(${i * 30})"/>`).join('')}
        ${hand(h * 30, 44, 9, '#1B1E33')}${hand(m * 6, 66, 6, '#1B1E33')}${p.sec === false ? '' : hand(sec * 6, 70, 3, RED)}<circle r="7" fill="${RED}"/></g>`;
    },
    // ceiling pendant lamp: cord from far above, shade, bulb glow and a light cone; swings a little
    pendant(p) {
      const gt = p.gt ?? 0, sw = (p.swing ?? 1.2) * Math.sin(gt * 1.1), on = p.on ?? 1, cord = p.cord ?? 500;
      return `<g transform="${S(p)} rotate(${f(sw)})"><rect x="-2" y="${-cord}" width="4" height="${cord}" fill="#121528"/>
        ${on ? `<g transform="translate(0 30)">${W.cone({ w0: 110, w1: p.spread ?? 900, len: p.len ?? 820, op: 0.9 * on })}</g><ellipse cx="0" cy="40" rx="70" ry="40" fill="url(#wWarm)"/>` : ''}
        <path d="M -70 34 Q -66 -26 0 -30 Q 66 -26 70 34 Z" fill="${p.color ?? '#E3A33C'}"/><path d="M 30 -26 Q 66 -20 70 34 L 46 34 Q 44 -10 30 -26 Z" fill="${shade(p.color ?? '#E3A33C', 0.25)}"/>
        <ellipse cx="0" cy="34" rx="70" ry="9" fill="${on ? '#FFF1C9' : '#555'}"/></g>`;
    },
    // a cat: a background character with a life of its own (tail swish, ear flick, blinking, looking around)
    // mode 'sit' | 'jump' (startled: arched, fur up); look -1..1 turns the head
    cat(p) {
      const gt = p.gt ?? 0, c = p.color ?? '#3B3350', tail = Math.sin(gt * 2.1) * 18 + Math.sin(gt * 0.7) * 10, blink = fr(gt / 4.3 + 0.2) < 0.04, lk = p.look ?? Math.sin(gt * 0.4) * 0.5;
      if (p.mode === 'jump') return `<g transform="${S(p)}"><path d="M -70 0 Q -80 -90 0 -96 Q 80 -90 70 0 L 56 0 Q 50 -50 0 -54 Q -50 -50 -56 0 Z" fill="${c}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M ${-60 + i * 15} ${-88 + Math.abs(i - 4) * 4} l ${(i - 4) * 2} -16" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`).join('')}<g transform="translate(76 -78)"><circle r="30" fill="${c}"/><path d="M -24 -16 L -20 -44 L -4 -26 Z M 24 -16 L 20 -44 L 4 -26 Z" fill="${c}"/><circle cx="-10" cy="-2" r="8" fill="#F2E27A"/><circle cx="12" cy="-2" r="8" fill="#F2E27A"/><circle cx="-10" cy="-2" r="3" fill="${INK}"/><circle cx="12" cy="-2" r="3" fill="${INK}"/></g><path d="M -70 -40 Q -120 -100 -100 -150" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round"/></g>`;
      return `<g transform="${S(p)}"><ellipse cx="0" cy="2" rx="60" ry="8" fill="#000" opacity="0.25"/>
        <path d="M 30 -6 Q ${f(90 + tail)} -10 ${f(80 + tail * 1.4)} ${f(-70 - tail * 0.3)}" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/>
        <path d="M -44 0 Q -50 -70 -6 -86 Q 40 -92 44 -40 Q 46 -12 36 0 Z" fill="${c}"/>
        <g transform="translate(${f(-10 + lk * 10)} -104)"><circle r="34" fill="${c}"/><path d="M -28 -14 L -24 -48 L -4 -30 Z" fill="${c}" transform="rotate(${fr(gt / 5.1) < 0.05 ? -12 : 0} -16 -24)"/><path d="M 28 -14 L 24 -48 L 4 -30 Z" fill="${c}"/>
          ${blink ? `<path d="M -18 0 h 12 M 6 0 h 12" stroke="#F2E27A" stroke-width="3"/>` : `<ellipse cx="${f(-12 + lk * 6)}" cy="0" rx="7" ry="8" fill="#F2E27A"/><ellipse cx="${f(12 + lk * 6)}" cy="0" rx="7" ry="8" fill="#F2E27A"/><ellipse cx="${f(-12 + lk * 8)}" cy="0" rx="2.4" ry="6" fill="${INK}"/><ellipse cx="${f(12 + lk * 8)}" cy="0" rx="2.4" ry="6" fill="${INK}"/>`}</g></g>`;
    },
    // door with frame; open 0..1 swings it (shown as narrowing), a picture next to it can be knocked with tilt
    doorway(p) {
      const o = p.open ?? 0, c = p.color ?? '#8E6A52', w = 200 * (1 - 0.82 * o);
      return `<g transform="${S(p)}"><rect x="-122" y="-520" width="244" height="520" fill="#1A1C30"/><rect x="-122" y="-532" width="244" height="22" fill="#D9CBB4"/><rect x="-134" y="-532" width="18" height="532" fill="#D9CBB4"/><rect x="116" y="-532" width="18" height="532" fill="#D9CBB4"/>
        ${o > 0 ? `<path d="M -110 -500 L 110 -500 L 110 0 L -110 0 Z" fill="#141627"/><path d="M -110 -500 L 110 0 L -110 0 Z" fill="url(#wCool)" opacity="0.4"/>` : ''}
        <g transform="translate(-110 0)"><rect x="0" y="-506" width="${f(w + 10)}" height="506" fill="${c}"/><rect x="${f(w * 0.12)}" y="-470" width="${f(w * 0.76)}" height="180" fill="${tint(c, 0.1)}"/><rect x="${f(w * 0.12)}" y="-260" width="${f(w * 0.76)}" height="220" fill="${tint(c, 0.1)}"/><circle cx="${f(w - 16)}" cy="-250" r="10" fill="#E8C468"/></g></g>`;
    },
    // a wall hook with keys (swing 0..1 after being grabbed)
    keyhook(p) { const gt = p.gt ?? 0, sw = (p.swing ?? 0) * 25 * Math.sin(gt * 9) * Math.exp(-((p.since ?? 9) * 2)); return `<g transform="${S(p)}"><rect x="-60" y="-12" width="120" height="24" rx="8" fill="#8E6A52"/>${p.keys === false ? '' : `<g transform="translate(-20 10) rotate(${f(sw)})"><path d="M 0 0 V 22" stroke="#C9C9D6" stroke-width="4"/><circle cy="34" r="12" fill="none" stroke="#E8C468" stroke-width="6"/><rect x="-4" y="44" width="8" height="34" fill="#E8C468"/></g>`}<path d="M 20 10 q 0 20 14 16" stroke="#C9C9D6" stroke-width="6" fill="none"/></g>`; },
    // ZERO's present: the yellow box (the object the viewer follows through the whole system), with a bow, the heart
    // (open 0..1 lifts the two top flaps; the bow is gone by then),
    // ZERO drew, the shipping label, a red NEXT DAY stamp (stamp 0..1), wet 0..1 (darker spots on the label)
    giftbox(p) {
      const w = p.w ?? 150, h = p.h ?? 120, c = p.color ?? YEL;
      const label = p.label ? `<g transform="translate(${-w * 0.1} ${-h * 0.52})"><rect x="-34" y="-26" width="68" height="52" fill="#FBF8F1"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${-26 + i * 6}" y="4" width="${i % 3 ? 2.5 : 4}" height="16" fill="#1B1E33"/>`).join('')}<rect x="-26" y="-18" width="34" height="4" fill="#6A6F86"/><rect x="-26" y="-10" width="44" height="4" fill="#6A6F86"/>
        ${(p.wet ?? 0) > 0 ? `<ellipse cx="6" cy="-6" rx="${f(16 * p.wet)}" ry="${f(12 * p.wet)}" fill="#7E93B0" opacity="0.45"/><ellipse cx="-14" cy="8" rx="${f(8 * p.wet)}" ry="${f(6 * p.wet)}" fill="#7E93B0" opacity="0.35"/>` : ''}</g>` : '';
      const stamp = (p.stamp ?? 0) > 0 ? `<g transform="translate(${w * 0.22} ${-h * 0.32}) rotate(-8) scale(${f(0.55 + 0.45 * p.stamp)})" opacity="${f(Math.min(1, p.stamp * 1.5))}"><rect x="-38" y="-16" width="76" height="32" rx="4" fill="none" stroke="#D63C46" stroke-width="4"/>${T('NEXT DAY', 15, '#D63C46', 0, -2)}</g>` : '';
      const bow = p.bow === false ? '' : `<rect x="${-w * 0.07}" y="${-h}" width="${w * 0.14}" height="${h}" fill="${CORAL}" opacity="0.9"/><g transform="translate(${w * 0.04} ${-h - h * 0.16})"><ellipse cx="-18" cy="-10" rx="22" ry="13" fill="${CORAL}" transform="rotate(-25 -18 -10)"/><ellipse cx="18" cy="-10" rx="22" ry="13" fill="${CORAL}" transform="rotate(25 18 -10)"/><circle r="9" fill="${shade(CORAL, 0.2)}"/></g>`;
      const heart = p.heart ? `<path transform="translate(${-w * 0.3} ${-h * 0.25}) scale(0.7)" d="M 0 12 C -20 -4 -12 -20 0 -9 C 12 -20 20 -4 0 12 Z" fill="none" stroke="#D63C46" stroke-width="4"/>` : '';
      const op = p.open ?? 0, flaps = op > 0 ? `<path d="M ${-w / 2} ${-h} L ${f(-w / 2 - w * 0.35 * op)} ${f(-h - h * 0.5 * op)} L ${f(-w * 0.05 - w * 0.3 * op)} ${f(-h - h * 0.55 * op)} L 0 ${-h} Z" fill="${shade(c, 0.12)}"/><path d="M ${w / 2} ${-h} L ${f(w / 2 + w * 0.35 * op)} ${f(-h - h * 0.5 * op)} L ${f(w * 0.05 + w * 0.3 * op)} ${f(-h - h * 0.55 * op)} L 0 ${-h} Z" fill="${shade(c, 0.05)}"/>` : '';
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><ellipse cx="0" cy="3" rx="${w * 0.6}" ry="8" fill="#000" opacity="0.28"/>${box(w, h, c, { tape: false })}${op > 0 ? '' : bow}${heart}${label}${stamp}${flaps}</g>`;
    },
    // plain brown parcel (everybody else's boxes); v picks a size and shade
    parcel(p) { const v = Math.abs(p.v ?? 0), w = p.w ?? [120, 160, 100, 140, 180][v % 5], h = p.h ?? [90, 110, 80, 130, 100][v % 5], c = p.color ?? ['#A47A55', '#B88B60', '#93704F', '#AD835A', '#9C7550'][v % 5]; return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><ellipse cx="0" cy="3" rx="${w * 0.6}" ry="7" fill="#000" opacity="0.25"/>${box(w, h, c)}<rect x="${-w * 0.3}" y="${-h * 0.6}" width="${w * 0.32}" height="${h * 0.26}" fill="#F2EEE6"/></g>`; },
    // a person of the world: flat, no outline, muted colours so ZERO stays the brightest-contrast figure.
    // pose stand | walk | type | yawn | carry | sit | point | shrug | wave; skin, shirt, pants; cap; flip; look
    person(p) {
      const gt = p.gt ?? 0, sk = p.skin ?? '#C99A74', sh = p.shirt ?? '#4C6E8C', pa = p.pants ?? '#2B2F45', pose = p.pose ?? 'stand', ph = gt * (p.speed ?? 1) * 2 * Math.PI / 0.9 + (p.seed ?? 0);
      const breath = Math.sin(gt * 1.8 + (p.seed ?? 0)) * 1.2;
      let hl = [-22, -70], hr = [22, -70], fl = [-10, 0], frr = [10, 0], bob = 0, headR = (p.headR ?? 0) + Math.sin(gt * 0.6 + (p.seed ?? 0)) * 2, mouth = '';
      if (pose === 'walk') { const a = Math.sin(ph); fl = [-4 + a * 20, 0]; frr = [4 - a * 20, 0]; hl = [-10 - a * 22, -72]; hr = [10 + a * 22, -72]; bob = Math.abs(Math.cos(ph)) * 4; }
      if (pose === 'type') { const a = Math.sin(gt * 17), b = Math.sin(gt * 13 + 1); hl = [26, -96 + a * 3]; hr = [44, -96 + b * 3]; }
      if (pose === 'yawn') { const y = Math.max(0, Math.sin(gt * 0.9)); hl = [-22, -70]; hr = [6, -150 + 20 * (1 - y)]; mouth = `<ellipse cx="8" cy="10" rx="${f(4 + 5 * y)}" ry="${f(3 + 8 * y)}" fill="#3A1F1A"/>`; headR -= 8 * y; }
      if (pose === 'carry') { hl = [24, -110]; hr = [40, -110]; }
      if (pose === 'point') { hr = [70, -140]; }
      if (pose === 'shrug') { hl = [-40, -126]; hr = [40, -126]; }
      if (pose === 'wave') { hr = [40, -170 + 10 * Math.sin(gt * 10)]; }
      if (pose === 'reach') { hl = [50, -110]; hr = [64, -112]; }
      if (pose === 'sit') { fl = [36, 0]; frr = [44, 0]; }
      const hip = pose === 'sit' ? [0, -50] : [0, -86];
      const limb = (a, b, w, c) => `<path d="M ${f(a[0])} ${f(a[1])} L ${f(b[0])} ${f(b[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
      const knee = (ft) => pose === 'sit' ? [ft[0] - 4, -50] : [(hip[0] + ft[0]) / 2 + 3, (hip[1] + ft[1]) / 2];
      const legs = pose === 'sit' ? limb(hip, [40, -50], 20, pa) + limb([40, -50], fl, 18, pa) : limb(hip, knee(fl), 20, pa) + limb(knee(fl), fl, 18, pa) + limb(hip, knee(frr), 20, pa) + limb(knee(frr), frr, 18, pa);
      const sh0 = [0, -160 - bob + breath];
      const held = p.hold ? `<g transform="translate(${f((hl[0] + hr[0]) / 2)} ${f((hl[1] + hr[1]) / 2 + 30)})">${PROPS[p.hold.type || 'parcel']({ ...p.hold, s: p.hold.s ?? 0.8 })}</g>` : '';
      const look = p.look ?? 0, eyes = p.eyes === false ? '' : (fr(gt / 3.9 + (p.seed ?? 0)) < 0.035 ? `<path d="M ${f(-9 + look * 6)} -2 h 7 M ${f(5 + look * 6)} -2 h 7" stroke="#1B1E33" stroke-width="3"/>` : `<circle cx="${f(-6 + look * 7)}" cy="-2" r="3.6" fill="#1B1E33"/><circle cx="${f(8 + look * 7)}" cy="-2" r="3.6" fill="#1B1E33"/>`);
      const cap = p.cap ? `<path d="M -26 -18 Q -24 -42 2 -42 Q 26 -40 28 -18 Z" fill="${p.cap}"/><rect x="2" y="-22" width="40" height="8" rx="4" fill="${p.cap}"/>` : `<path d="M -27 -6 Q -30 -38 0 -40 Q 28 -38 27 -10 Q 14 -26 -6 -24 Q -20 -22 -27 -6 Z" fill="${p.hair ?? '#2A2230'}"/>`;
      return `<g transform="translate(0 ${f(-bob)}) ${S(p)} scale(${p.flip ? -1 : 1} 1)"><ellipse cx="0" cy="${f(bob + 2)}" rx="44" ry="7" fill="#000" opacity="0.22"/>
        ${pose === 'sit' ? '' : ''}${legs}
        ${limb([-14, -150 - bob], hl, 15, shade(sh, 0.15))}
        <path d="M ${-30} ${-86 - bob} Q -34 ${-150 - bob} 0 ${-166 - bob + breath} Q 34 ${-150 - bob} 30 ${-86 - bob} Z" fill="${sh}"/>${p.vest ? `<path d="M -27 ${-92 - bob} Q -30 ${-146 - bob} -10 ${-158 - bob} L 10 ${-158 - bob} Q 30 ${-146 - bob} 27 ${-92 - bob} Z" fill="${p.vest}"/><rect x="-28" y="${-122 - bob}" width="56" height="7" fill="#E6ECF2" opacity="0.9"/>` : ''}${p.apron ? `<path d="M -22 ${-130 - bob} H 22 V ${-80 - bob} H -22 Z" fill="${p.apron}"/>` : ''}
        <rect x="-9" y="${-182 - bob}" width="18" height="20" fill="${shade(sk, 0.15)}"/>
        <g transform="translate(0 ${f(-212 - bob + breath)}) rotate(${f(headR)})"><ellipse cx="0" cy="0" rx="27" ry="30" fill="${sk}"/>${cap}${eyes}${mouth}</g>
        ${held}${limb([14, -150 - bob], hr, 15, sh)}<circle cx="${f(hl[0])}" cy="${f(hl[1] - bob)}" r="8" fill="${sk}"/><circle cx="${f(hr[0])}" cy="${f(hr[1] - bob)}" r="8" fill="${sk}"/></g>`;
    },
    // shop interior back wall: pigeonhole shelves full of envelopes and boxes, a poster, a wall vent
    shopwall(p) {
      const gt = p.gt ?? 0, c = p.wall ?? '#2F5260';
      const shelf = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-150" y="0" width="300" height="12" fill="#C8A57A"/><rect x="-150" y="12" width="300" height="5" fill="#8E6A52"/>${[0, 1, 2, 3].map(i => `<g transform="translate(${-110 + i * 72} 0)">${PROPS.parcel({ v: Math.abs(i + x) % 5, s: 0.5, gt })}</g>`).join('')}</g>`;
      return `<g transform="${S(p)}"><rect x="-5000" y="-3000" width="10000" height="3000" fill="${c}"/><rect x="-5000" y="-3000" width="10000" height="1500" fill="${shade(c, 0.25)}"/>
        <rect x="-5000" y="-1560" width="10000" height="60" fill="${tint(c, 0.12)}"/>${shelf(-520, -760)}${shelf(-520, -560)}${shelf(-520, -360)}
        <g transform="translate(-100 -720)"><rect x="-70" y="-90" width="140" height="180" fill="#E9E2D3"/><rect x="-54" y="-74" width="108" height="70" fill="${CORAL}" opacity="0.8"/>${icons.plane('#F4EEE2').replace('<path', '<path transform="translate(0 -40) scale(0.6)"')}<rect x="-54" y="10" width="80" height="8" fill="#6A6F86"/><rect x="-54" y="26" width="60" height="8" fill="#6A6F86"/><rect x="-54" y="42" width="90" height="8" fill="#6A6F86"/></g>
        <g transform="translate(700 -1300)"><rect x="-70" y="-30" width="140" height="60" rx="6" fill="${shade(c, 0.3)}"/>${[0, 1, 2, 3, 4].map(i => `<rect x="-60" y="${-22 + i * 10}" width="120" height="4" fill="${tint(c, 0.15)}"/>`).join('')}</g></g>`;
    },
    // the lit menu board: rows of services; hl = index of the highlighted row (glows); prices are $ signs, never numbers
    menuboard(p) {
      const rows = p.rows ?? [['GROUND', '$'], ['2 DAY', '$$'], ['NEXT DAY', '$$$']], hl = p.hl ?? -1, gt = p.gt ?? 0, fl = 0.92 + 0.08 * (Math.sin(gt * 31) > 0.97 ? 0 : 1);
      return `<g transform="${S(p)}"><rect x="-260" y="-150" width="520" height="300" rx="12" fill="#111428"/><rect x="-248" y="-138" width="496" height="276" rx="8" fill="#1A2140" opacity="${f(fl)}"/>
        ${T(p.title ?? 'SHIPPING', 30, '#9FB3D9', 0, -110)}
        ${rows.map(([a, b], i) => { const y = -50 + i * 66, on = i === hl; return `${on ? `<rect x="-232" y="${y - 28}" width="464" height="56" rx="8" fill="${YEL}" opacity="${f(0.85 + 0.15 * Math.sin(gt * 8))}"/>` : ''}<text x="-210" y="${y + 12}" font-family="${FONT}" font-weight="700" font-size="34" fill="${on ? INK : '#F4EEE2'}">${esc(a)}</text><text x="210" y="${y + 12}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="34" fill="${on ? INK : '#FFD58A'}">${esc(b)}</text>`; }).join('')}
        <ellipse cx="0" cy="40" rx="420" ry="260" fill="url(#wCool)" opacity="0.25"/></g>`;
    },
    // service counter with a scale (its display shows kg), a card terminal (blinks), a bell and a pen on a chain
    counter(p) {
      const gt = p.gt ?? 0, w = p.w ?? 700, c = p.color ?? '#8C5E45', topY = -300, blink = fr(gt * 1.3) < 0.5;
      return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="${w / 2 + 40}" ry="18" fill="#000" opacity="0.3"/>
        <rect x="${-w / 2}" y="${topY}" width="${w}" height="${-topY}" fill="${c}"/>${[0, 1, 2, 3].map(i => `<rect x="${-w / 2 + 20 + i * (w - 40) / 4}" y="${topY + 50}" width="${(w - 40) / 4 - 16}" height="${-topY - 80}" rx="6" fill="${tint(c, 0.06)}"/>`).join('')}
        <rect x="${-w / 2 - 24}" y="${topY - 26}" width="${w + 48}" height="30" rx="5" fill="#D8CDB8"/><rect x="${-w / 2 - 24}" y="${topY}" width="${w + 48}" height="8" fill="#9E9380"/>
        <g transform="translate(${-w * 0.2} ${topY - 26})"><rect x="-80" y="-14" width="160" height="14" rx="4" fill="#9FA9B8"/><rect x="-60" y="-24" width="120" height="10" rx="3" fill="#C2CBD6"/><g transform="translate(0 0)"><rect x="-44" y="2" width="88" height="34" rx="4" fill="#1B1E33"/>${T(p.kg ?? '0.00 kg', 18, '#7CFF8A', 0, 10)}</g></g>
        <g transform="translate(${w * 0.3} ${topY - 26})"><path d="M -30 0 L -26 -70 Q -26 -80 -16 -80 H 16 Q 26 -80 26 -70 L 30 0 Z" fill="#3A3F5C"/><rect x="-18" y="-70" width="36" height="24" rx="3" fill="${p.paid ? '#7CFF8A' : '#9FD0FF'}" opacity="${p.paid ? 1 : (blink ? 0.9 : 0.6)}"/>${[0, 1, 2].map(r => [0, 1, 2].map(c2 => `<rect x="${-16 + c2 * 12}" y="${-40 + r * 11}" width="8" height="7" rx="2" fill="#C2CBD6"/>`).join('')).join('')}</g>
        <g transform="translate(${w * 0.06} ${topY - 26})"><ellipse cx="0" cy="-2" rx="22" ry="5" fill="#8C8F9E"/><path d="M -18 -4 Q -18 -30 0 -30 Q 18 -30 18 -4 Z" fill="#E8C468"/><circle cy="-34" r="4" fill="#E8C468"/></g></g>`;
    },
    // rubber stamp (handle + red pad face); drop it from above with keys
    stamp(p) { return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><ellipse cx="0" cy="-130" rx="34" ry="30" fill="#8E6A52"/><rect x="-12" y="-110" width="24" height="60" fill="#8E6A52"/><rect x="-70" y="-50" width="140" height="34" rx="6" fill="#3A3F5C"/><rect x="-66" y="-16" width="132" height="16" fill="#D63C46"/></g>`; },
    // a conveyor belt: frame, legs, the belt (its stripes move at speed px/s), rollers that spin, side rail, motor lamp
    conveyor(p) {
      const gt = p.gt ?? 0, w = p.w ?? 1000, sp = p.speed ?? 120, off = (gt * sp) % 60, c = p.color ?? '#5C6684';
      const stripes = Array.from({ length: Math.ceil(w / 60) + 2 }, (_, i) => `<rect x="${f(-w / 2 + i * 60 + off - 60)}" y="-30" width="4" height="22" fill="#2A2E40"/>`).join('');
      const rollers = Array.from({ length: Math.floor(w / 70) }, (_, i) => `<g transform="translate(${-w / 2 + 35 + i * 70} 4) rotate(${f(gt * sp * 1.6)})"><circle r="12" fill="#8C93AA"/><rect x="-11" y="-2" width="22" height="4" fill="#5C6684"/></g>`).join('');
      const legs = Array.from({ length: Math.max(2, Math.floor(w / 300) + 1) }, (_, i) => { const x = -w / 2 + 40 + i * (w - 80) / Math.max(1, Math.floor(w / 300)); return `<rect x="${f(x - 9)}" y="20" width="18" height="${p.legs ?? 250}" fill="${shade(c, 0.3)}"/><rect x="${f(x - 26)}" y="${(p.legs ?? 250) + 14}" width="52" height="10" rx="3" fill="${shade(c, 0.4)}"/>`; }).join('');
      return `<g transform="${S(p)}"><defs><clipPath id="${gid('cv', w)}"><rect x="${-w / 2}" y="-32" width="${w}" height="26"/></clipPath></defs>${p.legs === 0 ? '' : legs}
        <rect x="${-w / 2}" y="-32" width="${w}" height="26" rx="12" fill="#353A50"/><g clip-path="url(#${gid('cv', w)})">${stripes}</g>${rollers}
        <rect x="${-w / 2}" y="-6" width="${w}" height="30" rx="6" fill="${c}"/><rect x="${-w / 2}" y="20" width="${w}" height="6" fill="${shade(c, 0.4)}"/>
        ${p.rail === false ? '' : `<rect x="${-w / 2}" y="-58" width="${w}" height="9" rx="4" fill="${tint(c, 0.25)}" opacity="0.7"/>`}
        ${p.lamp ? `<g transform="translate(${-w / 2 + 30} -6)"><rect x="-10" y="-80" width="20" height="80" fill="#3A3F5C"/><circle cy="-88" r="12" fill="${fr(gt * 0.8) < 0.5 ? '#FFB25C' : '#7A4A1A'}"/><circle cy="-88" r="40" fill="url(#wSodium)" opacity="${fr(gt * 0.8) < 0.5 ? 0.8 : 0}"/></g>` : ''}</g>`;
    },
    // the mouth of the system: a dark opening in the wall with a strip curtain that sways (and parts when push > 0),
    // a hazard frame and a small red/green light above it
    mouth(p) {
      const gt = p.gt ?? 0, w = p.w ?? 300, h = p.h ?? 260, push = p.push ?? 0;
      const strips = Array.from({ length: 8 }, (_, i) => { const x = -w / 2 + 10 + i * (w - 20) / 8, sway = Math.sin(gt * 1.6 + i * 0.8) * 4 + push * (i < 4 ? -1 : 1) * (40 + i * 6) * Math.exp(-Math.abs(i - 3.5) * 0.4); return `<path d="M ${f(x)} ${-h} L ${f(x + (w - 20) / 8 - 3)} ${-h} L ${f(x + (w - 20) / 8 - 3 + sway)} 0 L ${f(x + sway)} 0 Z" fill="#9FC4D8" opacity="0.32"/>`; }).join('');
      const hz = Array.from({ length: Math.ceil((w + 60) / 30) }, (_, i) => `<path d="M ${-w / 2 - 30 + i * 30} ${-h - 30} l 15 0 l -15 30 l -15 0 Z" fill="${i % 2 ? '#1B1E33' : '#E8B83C'}"/>`).join('');
      return `<g transform="${S(p)}"><rect x="${-w / 2 - 30}" y="${-h - 30}" width="${w + 60}" height="${h + 30}" fill="#E8B83C"/><g clip-path="none">${hz}</g>
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#05060D"/><ellipse cx="0" cy="${-h * 0.4}" rx="${w * 0.4}" ry="${h * 0.35}" fill="#1A2B4A" opacity="${0.5 + 0.2 * Math.sin(gt * 2)}"/>${strips}
        <circle cx="0" cy="${-h - 60}" r="13" fill="${p.light === 'green' ? '#58E08A' : '#E85B4E'}"/><circle cx="0" cy="${-h - 60}" r="44" fill="url(#w${p.light === 'green' ? 'Cool' : 'Sodium'})"/></g>`;
    },
    // a hologram panel PIX projects: blue light, an icon, a caption; on 0..1 builds it (flickers in)
    holo(p) {
      const on = p.on ?? 1, gt = p.gt ?? 0, w = p.w ?? 240, h = p.h ?? 200, fl = on < 1 ? (Math.sin(gt * 60) > 0 ? 1 : 0.5) : 1, c = p.color ?? '#7CC2FF';
      if (on <= 0) return '';
      return `<g transform="${S(p)} scale(${f(0.8 + 0.2 * on)} ${f(on)})" opacity="${f(on * fl)}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="${c}" opacity="0.14"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="none" stroke="${c}" stroke-width="4" opacity="0.8"/>
        ${Array.from({ length: Math.floor(h / 12) }, (_, i) => `<rect x="${-w / 2 + 4}" y="${-h / 2 + i * 12 + ((gt * 30) % 12)}" width="${w - 8}" height="2" fill="${c}" opacity="0.12"/>`).join('')}
        ${p.icon ? `<g transform="translate(0 ${p.txt ? -18 : 0}) scale(${p.is ?? 1})">${icons[p.icon](p.ic ?? c)}</g>` : ''}${p.txt ? T(p.txt, p.size ?? 26, p.tc ?? c, 0, h / 2 - 40) : ''}${p.inner ?? ''}</g>`;
    },
    // a beam from PIX to what it scans (from 0,0 to dx,dy, fan width w), sweeping with gt
    scanbeam(p) { const dx = p.dx ?? 300, dy = p.dy ?? 200, w = p.w ?? 160, sw = Math.sin((p.gt ?? 0) * 5) * w * 0.3; return `<g opacity="${p.op ?? 1}"><path d="M 0 0 L ${f(dx - w / 2 + sw)} ${dy} L ${f(dx + w / 2 + sw)} ${dy} Z" fill="#7CC2FF" opacity="0.28"/><path d="M ${f(dx - w / 2 + sw)} ${dy} L ${f(dx + w / 2 + sw)} ${dy}" stroke="#BFE3FF" stroke-width="4"/></g>`; },
    icon(p) { return `<g transform="${S(p)}">${icons[p.k](p.color ?? YEL)}</g>`; },
    // inside the system: a dark tunnel in slight perspective; overhead lamps rush past (speed px/s), each one
    // sweeping a band of light over the rollers; walls with cable trays and blinking status LEDs
    tunnel(p) {
      const gt = p.gt ?? 0, sp = p.speed ?? 500, flick = p.flick ?? 0, vx = 960, vy = 470;
      const K = (i, n) => fr(gt * sp / 2600 + i / n);          // 0 at the vanishing point, 1 at the camera
      const at = (k, x0, y0, x1, y1) => { const e = k * k; return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e]; };
      const lampOn = i => !(flick && Math.sin(gt * 40 + i * 2.1) > 0.4);
      // walls, ceiling, floor as four planes meeting at the far opening
      let g = `<rect x="-3000" y="-3000" width="7920" height="7080" fill="#05060D"/>
        <path d="M -600 -500 L ${vx - 70} ${vy - 40} L ${vx + 70} ${vy - 40} L 2520 -500 Z" fill="#0B0E1E"/>
        <path d="M -600 -500 L ${vx - 70} ${vy - 40} L ${vx - 70} ${vy + 40} L -600 1700 Z" fill="#0E1124"/>
        <path d="M 2520 -500 L ${vx + 70} ${vy - 40} L ${vx + 70} ${vy + 40} L 2520 1700 Z" fill="#0E1124"/>
        <path d="M -600 1700 L ${vx - 70} ${vy + 40} L ${vx + 70} ${vy + 40} L 2520 1700 Z" fill="#11142A"/>
        <rect x="${vx - 70}" y="${vy - 40}" width="140" height="80" fill="#14284A"/><rect x="${vx - 50}" y="${vy - 28}" width="100" height="56" fill="#2C4A78" opacity="${f(0.5 + 0.2 * Math.sin(gt * 3))}"/>`;
      // the belt: two rails converging, rollers rushing towards us between them
      g += `<path d="M ${vx - 22} ${vy + 40} L 470 1080 L 1450 1080 L ${vx + 22} ${vy + 40} Z" fill="#191D33"/>`;
      for (let i = 0; i < 18; i++) { const k = K(i, 18), [xl, y] = at(k, vx - 22, vy + 40, 470, 1080), [xr] = at(k, vx + 22, vy + 40, 1450, 1080); g += `<rect x="${f(xl)}" y="${f(y)}" width="${f(xr - xl)}" height="${f(2 + 12 * k * k)}" fill="#3A4060" opacity="${f(Math.min(1, k * 2))}"/>`; }
      g += `<path d="M ${vx - 22} ${vy + 40} L 470 1080" stroke="#5C6684" stroke-width="10"/><path d="M ${vx + 22} ${vy + 40} L 1450 1080" stroke="#5C6684" stroke-width="10"/>`;
      // ribs on the walls with status LEDs, cable trays, ceiling lamps rushing past
      for (let i = 0; i < 10; i++) {
        const k = K(i + 0.5, 10), w = 2 + 18 * k * k, op = Math.min(1, k * 2.5);
        for (const side of [-1, 1]) {
          const [x, yt] = at(k, vx + side * 70, vy - 40, vx + side * 1560, -500), [, yb] = at(k, vx + side * 70, vy + 40, vx + side * 1560, 1700);
          g += `<rect x="${f(x - w / 2)}" y="${f(yt)}" width="${f(w)}" height="${f(yb - yt)}" fill="#1A1F38" opacity="${f(op)}"/>`;
          g += `<circle cx="${f(x - side * w)}" cy="${f(yt + (yb - yt) * 0.45)}" r="${f(1.5 + 6 * k * k)}" fill="${rnd(i + side) > 0.7 ? '#E85B4E' : '#58E08A'}" opacity="${f(op * (fr(gt * 1.3 + rnd(i * 3 + side)) < 0.7 ? 1 : 0.15))}"/>`;
          const [cx, cy] = at(k, vx + side * 60, vy - 10, vx + side * 1400, 200);
          g += `<rect x="${f(cx - (side < 0 ? 0 : 60 * k * k))}" y="${f(cy)}" width="${f(4 + 60 * k * k)}" height="${f(2 + 10 * k * k)}" fill="#252B4A" opacity="${f(op)}"/>`;
        }
      }
      for (let i = 0; i < 7; i++) {
        const k = K(i, 7), [, y] = at(k, vx, vy - 38, vx, -500), w = 20 + 420 * k * k, on = lampOn(i);
        g += `<g opacity="${f(Math.min(1, k * 3))}"><rect x="${f(vx - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(3 + 26 * k * k)}" rx="${f(2 + 8 * k * k)}" fill="${on ? '#EAF4FF' : '#3A4060'}"/>${on ? `<ellipse cx="${vx}" cy="${f(y + 40 + 160 * k * k)}" rx="${f(40 + 700 * k * k)}" ry="${f(20 + 260 * k * k)}" fill="url(#wCool)" opacity="0.6"/>` : ''}</g>`;
      }
      return `<g>${g}</g>`;
    },
    // the light of the tunnel lamps washing over the foreground as each one passes overhead (put it above ZERO)
    tunwash(p) {
      const gt = p.gt ?? 0, sp = p.speed ?? 500, flick = p.flick ?? 0;
      let w = 0; for (let i = 0; i < 7; i++) { const k = fr(gt * sp / 2600 + i / 7); if (!(flick && Math.sin(gt * 40 + i * 2.1) > 0.4)) w += Math.exp(-Math.pow((k - 0.93) / 0.07, 2)); }
      return `<rect x="-3000" y="-3000" width="7920" height="7080" fill="#BFE0FF" opacity="${f(Math.min(0.22, w * 0.2) * (p.op ?? 1))}" style="mix-blend-mode:screen"/>`;
    },
    // the shipping label, big (system view): barcode, address, service band, deadline, ZIP. hl highlights part
    // 1 barcode, 2 address, 3 service, 4 deadline, 5 zip; wet 0..1 smears the ZIP
    biglabel(p) {
      const hl = p.hl ?? 0, gt = p.gt ?? 0, wet = p.wet ?? 0, sys = p.sys ?? 0;
      const glow = (on, x, y, w, h) => on ? `<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" rx="10" fill="none" stroke="${YEL}" stroke-width="7" opacity="${f(0.8 + 0.2 * Math.sin(gt * 9))}"/>` : '';
      const ink = mix('#1B1E33', NIGHT.sys, sys), paper = mix('#FBF8F1', '#0E2240', sys);
      const bars = Array.from({ length: 46 }, (_, i) => `<rect x="${-300 + i * 13}" y="150" width="${[3, 6, 2, 8, 4][(i * 7) % 5]}" height="120" fill="${ink}"/>`).join('');
      const zip = (p.zip ?? '0 4 1 0 1').split(' ').map((d, i) => `<text x="${-130 + i * 52}" y="98" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="58" fill="${ink}" ${wet > 0 && i > 1 ? `filter="url(#wBleed)" opacity="${f(1 - wet * 0.55)}"` : ''}>${esc(d)}</text>`).join('');
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><defs><filter id="wBleed" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f(0.2 + wet * 6)}"/></filter></defs>
        <rect x="-340" y="-300" width="680" height="600" rx="10" fill="#000" opacity="0.3" transform="translate(10 14)"/><rect x="-340" y="-300" width="680" height="600" rx="10" fill="${paper}"/>${sys > 0 ? `<rect x="-340" y="-300" width="680" height="600" rx="10" fill="none" stroke="${NIGHT.sys}" stroke-width="4"/>` : ''}
        <rect x="-340" y="-300" width="680" height="96" rx="10" fill="${mix('#1B1E33', '#1D4E8A', sys)}"/>${T(p.service ?? 'NEXT DAY AIR', 50, '#FBF8F1', 0, -270)}${glow(hl === 3, -340, -300, 680, 96)}
        <g font-family="${FONT}" font-weight="700" fill="${ink}"><text x="-300" y="-150" font-size="26" opacity="0.6">SHIP TO:</text><rect x="-300" y="-120" width="360" height="22" rx="6" fill="${ink}" opacity="0.75"/><rect x="-300" y="-84" width="420" height="22" rx="6" fill="${ink}" opacity="0.75"/><rect x="-300" y="-48" width="280" height="22" rx="6" fill="${ink}" opacity="0.75"/></g>${glow(hl === 2, -300, -160, 440, 134)}
        <g transform="translate(240 -90)"><rect x="-70" y="-60" width="140" height="120" rx="10" fill="none" stroke="${ink}" stroke-width="5"/>${T('BY', 22, ink, 0, -42)}<path d="M 0 -6 L 0 -26 M 0 -6 L 16 2" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><circle cy="-6" r="26" fill="none" stroke="${ink}" stroke-width="4"/>${T('MORNING', 20, ink, 0, 32)}</g>${glow(hl === 4, 170, -150, 140, 120)}
        ${zip}${wet > 0 ? `<ellipse cx="40" cy="90" rx="${f(150 * wet)}" ry="${f(60 * wet)}" fill="#6F86A8" opacity="${f(0.35 * wet)}"/><path d="M ${f(20 + 60 * wet)} 60 q 10 ${f(60 * wet)} 0 ${f(120 * wet)}" stroke="#6F86A8" stroke-width="10" opacity="${f(0.3 * wet)}" fill="none" stroke-linecap="round"/>` : ''}${glow(hl === 5, -160, 50, 320, 76)}
        ${bars}${glow(hl === 1, -300, 150, 600, 120)}</g>`;
    },
    // system-view overlay: a blue grid, a scan line sweeping down, tinted wash (op 0..1). ui layer; light: no wash and a
    // faint grid, for pages that are already system view (it draws over them)
    sysview(p) { const op = p.op ?? 1, gt = p.gt ?? 0, y = fr(gt * 0.45) * 1180 - 50; if (op <= 0) return ''; return `<g opacity="${f(op)}"><rect x="0" y="0" width="1920" height="1080" fill="#0A1B33" opacity="${p.light ? 0 : 0.55}"/><rect x="0" y="0" width="1920" height="1080" fill="url(#wGrid)" opacity="${p.light ? 0.22 : 0.6}"/><rect x="0" y="${f(y)}" width="1920" height="6" fill="#7CC2FF" opacity="0.6"/><rect x="0" y="${f(y - 60)}" width="1920" height="60" fill="#7CC2FF" opacity="0.08"/>${T('SYSTEM VIEW', 30, '#7CC2FF', 170, 60, 'letter-spacing="6"')}<circle cx="44" cy="70" r="9" fill="#E85B4E" opacity="${fr(gt) < 0.5 ? 1 : 0.2}"/></g>`; },
    // a scanner arch over a belt: two posts, a top bar with a red line of light; flash 0..1 when it reads something
    scanarch(p) { const fl = p.flash ?? 0, gt = p.gt ?? 0; return `<g transform="${S(p)}"><rect x="-150" y="-330" width="26" height="330" fill="#4A5270"/><rect x="124" y="-330" width="26" height="330" fill="#4A5270"/><rect x="-170" y="-360" width="340" height="50" rx="8" fill="#5C6684"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${-100 + i * 50}" cy="-335" r="7" fill="${fl > 0.3 ? YEL : (Math.sin(gt * 6 + i) > 0 ? '#E85B4E' : '#6A2A2A')}"/>`).join('')}<path d="M -124 -300 L 124 -300 L 124 -40 L -124 -40 Z" fill="${fl > 0.3 ? '#FFE7A0' : '#E85B4E'}" opacity="${f(0.06 + 0.3 * fl)}"/>${[0, 1, 2].map(i => `<path d="M -124 ${-260 + i * 90 + Math.sin(gt * 4 + i) * 30} L 124 ${-230 + i * 90 - Math.sin(gt * 4 + i) * 30}" stroke="#FF5A4E" stroke-width="2" opacity="0.7"/>`).join('')}</g>`; },
    // top-down view of a belt with boxes (for the overhead shot); off scrolls the belt
    topbelt(p) { const gt = p.gt ?? 0, off = (gt * (p.speed ?? 140)) % 80, w = p.w ?? 2400; return `<g transform="${S(p)}"><rect x="${-w / 2}" y="-170" width="${w}" height="340" fill="#2A2E40"/>${Array.from({ length: Math.ceil(w / 80) + 2 }, (_, i) => `<rect x="${f(-w / 2 + i * 80 + off - 80)}" y="-160" width="10" height="320" fill="#353A50"/>`).join('')}<rect x="${-w / 2}" y="-190" width="${w}" height="22" fill="#5C6684"/><rect x="${-w / 2}" y="168" width="${w}" height="22" fill="#5C6684"/></g>`; },
    // top-down box: lid flaps, tape strip (tape 0..1 runs it across), bow on top, label
    topbox(p) { const w = p.w ?? 220, h = p.h ?? 170, c = p.color ?? YEL, tp = p.tape ?? 0; return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="${-w / 2 + 10}" y="${-h / 2 + 14}" width="${w}" height="${h}" fill="#000" opacity="0.3"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${c}"/><path d="M ${-w / 2} 0 H ${w / 2}" stroke="${shade(c, 0.2)}" stroke-width="4"/>${tp > 0 ? `<rect x="${-w / 2 - 6}" y="-14" width="${f((w + 12) * tp)}" height="28" fill="#E9E2D0" opacity="0.85"/>` : ''}${p.bow ? `<rect x="-14" y="${-h / 2}" width="28" height="${h}" fill="${CORAL}"/><rect x="${-w / 2}" y="-14" width="${w}" height="28" fill="${CORAL}"/><circle r="26" fill="${shade(CORAL, 0.15)}"/>` : ''}${p.label ? `<rect x="${w * 0.12}" y="${-h * 0.38}" width="${w * 0.3}" height="${h * 0.32}" fill="#FBF8F1"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${w * 0.15 + i * 9}" y="${-h * 0.18}" width="4" height="${h * 0.1}" fill="#1B1E33"/>`).join('')}` : ''}${p.heart ? `<path transform="translate(${-w * 0.25} ${h * 0.22}) scale(0.9)" d="M 0 12 C -20 -4 -12 -20 0 -9 C 12 -20 20 -4 0 12 Z" fill="none" stroke="#D63C46" stroke-width="4"/>` : ''}</g>`; },
    // tape dispenser gun (top-down), ZERO's hands push it
    tapegun(p) { return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><circle r="46" fill="#3A3F5C"/><circle r="30" fill="#E9E2D0"/><circle r="12" fill="#3A3F5C"/><rect x="30" y="-12" width="70" height="24" rx="6" fill="#C9555A"/><rect x="-20" y="30" width="30" height="80" rx="10" fill="#C9555A"/></g>`; },
    // night road scrolling under the truck: asphalt, dashes, kerb, streetlights and two skyline layers at their own speeds
    road(p) {
      const gt = p.gt ?? 0, sp = p.speed ?? 900;
      const dash = Array.from({ length: 16 }, (_, i) => `<rect x="${f(-1800 + i * 260 - (gt * sp) % 260)}" y="120" width="140" height="12" rx="6" fill="#C9B98A" opacity="0.8"/>`).join('');
      const poles = Array.from({ length: 6 }, (_, i) => { const x = -1800 + i * 720 - (gt * sp * 0.8) % 720; return `<g transform="translate(${f(x)} 0)"><rect x="-6" y="-520" width="12" height="520" fill="#1D2136"/><path d="M 0 -520 Q 0 -560 60 -560 H 100" fill="none" stroke="#1D2136" stroke-width="10"/><rect x="80" y="-570" width="60" height="14" rx="6" fill="#FFCF8A"/><ellipse cx="110" cy="-200" rx="200" ry="360" fill="url(#wSodium)" opacity="0.5"/></g>`; }).join('');
      const city = (n, col, hmin, hmax, k, y0, seed) => Array.from({ length: n }, (_, i) => { const w = 90 + rnd(i + seed) * 120, x = fr((i / n) - (gt * sp * k) / 5000 + 10) * 5000 - 2500, h = hmin + rnd(i * 3 + seed) * (hmax - hmin); return `<rect x="${f(x)}" y="${f(y0 - h)}" width="${f(w)}" height="${f(h)}" fill="${col}"/>${Array.from({ length: 5 }, (_, j) => rnd(i * 9 + j + seed) > 0.6 ? `<rect x="${f(x + 14 + (j % 2) * 40)}" y="${f(y0 - h + 20 + j * 30)}" width="12" height="12" fill="#FFD58A" opacity="0.7"/>` : '').join('')}`; }).join('');
      return `<g><defs><linearGradient id="wRoadSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070A1C"/><stop offset="1" stop-color="#2A2F5C"/></linearGradient></defs><rect x="-3000" y="-1600" width="6000" height="1600" fill="url(#wRoadSky)"/><rect x="-3000" y="-4000" width="6000" height="2400" fill="#070A1C"/>
        <g opacity="0.8">${city(20, '#1E2348', 160, 420, 0.05, -40, 3)}</g>${city(14, '#151935', 80, 260, 0.15, -20, 7)}
        <rect x="-3000" y="-40" width="6000" height="40" fill="#1A1D2E"/><rect x="-3000" y="0" width="6000" height="3000" fill="#22263A"/>${dash}
        <rect x="-3000" y="250" width="6000" height="16" fill="#3A3F5C"/>${poles}</g>`;
    },
    // rain over a region (w x h centred), drops fall at their own speeds; ang tilts them; splash rings on the ground
    rain(p) {
      const gt = p.gt ?? 0, w = p.w ?? 2400, h = p.h ?? 1400, n = p.n ?? 120, ang = p.ang ?? 12, op = p.op ?? 0.6;
      const drops = Array.from({ length: n }, (_, i) => { const sp = 1.1 + rnd(i + 2) * 0.8, k = fr(gt * sp + rnd(i)), x = -w / 2 + rnd(i * 7) * w, y = -h / 2 + k * h, l = 26 + rnd(i + 5) * 30; return `<path d="M ${f(x + k * ang * 8)} ${f(y)} l ${f(ang * 0.4)} ${f(l)}" stroke="#BFD9FF" stroke-width="${rnd(i) > 0.8 ? 3 : 2}" stroke-linecap="round" opacity="${f(op * (0.5 + 0.5 * rnd(i + 1)))}"/>`; }).join('');
      const spl = p.ground != null ? Array.from({ length: 14 }, (_, i) => { const k = fr(gt * 1.7 + rnd(i * 5)), x = -w / 2 + rnd(i * 11) * w; return `<ellipse cx="${f(x)}" cy="${p.ground}" rx="${f(4 + 22 * k)}" ry="${f(1.5 + 5 * k)}" fill="none" stroke="#BFD9FF" stroke-width="2" opacity="${f(0.6 * (1 - k))}"/>`; }).join('') : '';
      return `<g>${drops}${spl}</g>`;
    },
    // a single drop falling from (0,0) to y=len every period seconds (phase ph); splat at the bottom
    drip(p) { const gt = p.gt ?? 0, per = p.period ?? 1.6, k = fr((gt + (p.ph ?? 0)) / per), len = p.len ?? 300, fall = Math.min(1, k / 0.55), y = fall * fall * len, sp = k > 0.55 ? (k - 0.55) / 0.45 : 0; return `<g opacity="${p.op ?? 1}">${k < 0.55 ? `<path d="M 0 ${f(y - 14)} q 8 14 0 18 q -8 -4 0 -18 Z" fill="#BFD9FF"/>` : `<ellipse cx="0" cy="${len}" rx="${f(6 + 30 * sp)}" ry="${f(2 + 6 * sp)}" fill="none" stroke="#BFD9FF" stroke-width="3" opacity="${f(1 - sp)}"/>`}<path d="M -10 0 q 10 ${f(6 + 4 * Math.sin(gt * 3))} 20 0" fill="#BFD9FF" opacity="0.7"/></g>`; },
    // the delivery truck in cutaway: cab with a driver (coffee), wipers, headlights; cargo bay open to us with
    // shelves of parcels and a dim lamp; wheels spin; the whole thing rocks a little with the road
    truck(p) {
      const gt = p.gt ?? 0, rock = Math.sin(gt * 7) * 1.2 + Math.sin(gt * 2.3) * 1.5, wip = Math.sin(gt * 3.2) * 32, c = p.color ?? '#E8E4DA';
      const wheel = x => `<g transform="translate(${x} 0) rotate(${f(gt * 900)})"><circle r="62" fill="#14161F"/><circle r="30" fill="#5C6684"/><rect x="-28" y="-4" width="56" height="8" fill="#3A3F5C"/></g>`;
      return `<g transform="${S(p)}"><ellipse cx="0" cy="58" rx="760" ry="26" fill="#000" opacity="0.35"/><g transform="translate(0 ${f(rock)})">
        <rect x="-700" y="-560" width="1000" height="530" rx="12" fill="${shade(c, 0.1)}"/><rect x="-680" y="-540" width="960" height="490" fill="#2A2638"/>
        <ellipse cx="-200" cy="-400" rx="520" ry="300" fill="url(#wWarm)" opacity="${f(0.55 + 0.05 * Math.sin(gt * 13))}"/><rect x="-220" y="-540" width="40" height="14" fill="#FFE7A8"/>
        ${[[-600, 0, -60], [-470, 1, -60], [-350, 2, -60], [-600, 3, -212], [-440, 4, -212], [130, 0, -212], [240, 2, -212], [200, 4, -60]].map(([x, v, y]) => `<g transform="translate(${x} ${y})">${PROPS.parcel({ v, s: 0.9 })}</g>`).join('')}
        <rect x="-680" y="-200" width="420" height="12" fill="#5C6684"/><rect x="-680" y="-188" width="420" height="5" fill="#2A2E40"/><rect x="60" y="-200" width="240" height="12" fill="#5C6684"/>
        <path d="M -660 -380 L -280 -330 M -660 -300 L -280 -250" stroke="#E8B83C" stroke-width="5" opacity="0.7"/>
        <rect x="-700" y="-60" width="1000" height="40" fill="${shade(c, 0.25)}"/>
        <path d="M 300 -420 L 470 -420 Q 520 -420 540 -360 L 580 -200 L 580 -30 L 300 -30 Z" fill="${p.cab ?? '#C9555A'}"/><path d="M 330 -400 L 460 -400 Q 500 -400 515 -350 L 545 -230 L 330 -230 Z" fill="#20253F"/>
        <g transform="translate(420 -230) scale(0.62)">${PROPS.person({ gt, pose: 'sit', shirt: '#5D7A8C', skin: '#A87B5A', cap: '#2E4A5A', seed: 3, look: 0.6 })}</g>
        <g transform="translate(470 -330)"><path d="M 0 0 h 18 v 22 h -18 Z" fill="#E9EEF5"/><path d="M 4 -8 q 4 -6 0 -12" stroke="#E6ECF5" stroke-width="3" fill="none" opacity="${f(0.4 + 0.3 * Math.sin(gt * 3))}"/></g>
        <g transform="translate(525 -240) rotate(${f(-60 + wip)})"><rect x="-3" y="-140" width="6" height="140" fill="#111"/></g>
        <rect x="560" y="-140" width="40" height="40" rx="8" fill="#FFF1C9"/><path d="M 600 -130 L 1300 -200 L 1300 0 L 600 -100 Z" fill="#FFE2A6" opacity="0.18"/>
        ${p.fuel ? `<g transform="translate(200 -40)"><rect x="-60" y="-10" width="120" height="50" rx="10" fill="#5C6684"/>${T('FUEL', 18, '#E8E4DA', 0, 4)}</g>` : ''}</g>
        <g transform="translate(-480 0)">${wheel(0)}</g><g transform="translate(-300 0)">${wheel(0)}</g><g transform="translate(430 0)">${wheel(0)}</g></g>`;
    },
    // small in-world sign plate (chapter labels live inside the world, never as floating titles)
    plate(p) { const w = p.w ?? 360; return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="${-w / 2}" y="-40" width="${w}" height="80" rx="8" fill="${p.fill ?? '#1B1E33'}"/><rect x="${-w / 2 + 8}" y="-32" width="${w - 16}" height="64" rx="5" fill="none" stroke="${p.color ?? YEL}" stroke-width="3"/>${T(p.txt ?? '', p.size ?? 34, p.color ?? YEL, 0, -4, 'letter-spacing="3"')}</g>`; },
    // a storefront window onto the wet street: cars pass with headlights, pedestrians with umbrellas, rain on the glass
    storefront(p) {
      const gt = p.gt ?? 0, w = p.w ?? 700, h = p.h ?? 420, id = gid('sf', w, h);
      const car = (k, dir, col, y) => { const x = dir > 0 ? -w / 2 - 300 + k * (w + 600) : w / 2 + 300 - k * (w + 600); return `<g transform="translate(${f(x)} ${y}) scale(${dir} 1)"><rect x="-130" y="-60" width="260" height="50" rx="14" fill="${col}"/><path d="M -80 -60 L -50 -100 H 50 L 80 -60 Z" fill="${col}"/><path d="M -70 -64 L -46 -94 H 0 V -64 Z M 8 -64 V -94 H 46 L 70 -64 Z" fill="#1B2140"/><circle cx="-80" cy="-10" r="22" fill="#111"/><circle cx="80" cy="-10" r="22" fill="#111"/><path d="M 130 -40 L 480 -80 L 480 0 Z" fill="#FFE2A6" opacity="0.22"/><rect x="122" y="-46" width="12" height="12" rx="4" fill="#FFF1C9"/><rect x="-134" y="-46" width="10" height="12" rx="3" fill="#E85B4E"/></g>`; };
      const ped = (k, dir, seed) => { const x = dir > 0 ? -w / 2 - 100 + k * (w + 200) : w / 2 + 100 - k * (w + 200); return `<g transform="translate(${f(x)} ${h / 2 - 40}) scale(0.62)">${PROPS.person({ gt, pose: 'walk', flip: dir < 0, shirt: '#3B4466', skin: '#9C7A63', seed, eyes: false })}<g transform="translate(${dir > 0 ? 10 : -10} -300)"><path d="M -80 0 Q 0 -70 80 0 Z" fill="${seed > 2 ? '#C9555A' : '#2F4E6E'}"/><rect x="-2" y="0" width="4" height="70" fill="#111"/></g></g>`; };
      return `<g transform="${S(p)}"><defs><clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath></defs>
        <g clip-path="url(#${id})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#141935"/><rect x="${-w / 2}" y="${h / 2 - 90}" width="${w}" height="90" fill="#1F2440"/>
          ${[0, 1, 2, 3].map(i => `<rect x="${-w / 2 + i * 200 - 40}" y="${-h / 2 - 20}" width="150" height="${h * 0.6}" fill="#1E2448"/>${[0, 1, 2].map(j => `<rect x="${-w / 2 + i * 200 - 20 + j * 40}" y="${-h / 2 + 30}" width="18" height="18" fill="${rnd(i * 3 + j + Math.floor(gt / 4)) > 0.5 ? '#FFD58A' : '#2A3058'}"/>`).join('')}`).join('')}
          <ellipse cx="0" cy="${h / 2 - 60}" rx="${w}" ry="40" fill="url(#wSodium)" opacity="0.6"/>
          ${car(fr(gt / 5.5), 1, '#7A8FB0', h / 2 - 20)}${car(fr(gt / 7 + 0.5), -1, '#B05A4E', h / 2 - 30)}${ped(fr(gt / 11 + 0.3), 1, 1)}${ped(fr(gt / 13 + 0.7), -1, 3)}
          ${W.rain({ gt, w, h, n: 30, op: 0.45, ang: 6 })}<path d="M ${-w / 2} ${-h / 2} L ${-w / 2 + w * 0.3} ${-h / 2} L ${-w / 2} ${h * 0.2} Z" fill="#fff" opacity="0.05"/></g>
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="#1B1E33" stroke-width="18"/><path d="M ${-w / 6} ${-h / 2} V ${h / 2} M ${w / 6} ${-h / 2} V ${h / 2}" stroke="#1B1E33" stroke-width="10"/>
        ${p.txt ? `<g opacity="0.85">${T(p.txt, 38, '#FFD58A', 0, -h / 2 + 50, 'letter-spacing="5"')}</g>` : ''}</g>`;
    },
    // price tag with a dollar sign (never a number we can't source)
    pricetag(p) { const sw = Math.sin((p.gt ?? 0) * 3 + (p.seed ?? 0)) * 6; return `<g transform="${S(p)} rotate(${f((p.tilt ?? 0) + sw)})"><path d="M 0 0 L 0 30" stroke="#C9C9D6" stroke-width="3"/><g transform="translate(0 30)"><path d="M -40 10 L -20 -10 H 40 V 70 H -20 L -40 50 Z" fill="${YEL}" transform="rotate(90)"/><circle cx="0" cy="-24" r="6" fill="#1B1E33" transform="translate(0 0)"/>${T(p.txt ?? '$', 46, '#1B1E33', 0, 22)}</g></g>`; },
    // ZERO's arm seen from above or reaching into frame: a black line ending in his round hand (only ZERO is black)
    arm(p) { return `<g><path d="M ${p.x0 ?? 0} ${p.y0 ?? 0} L ${p.x1 ?? 0} ${p.y1 ?? -200}" stroke="${p.color ?? INK}" stroke-width="${p.w ?? 24}" stroke-linecap="round"/><circle cx="${p.x1 ?? 0}" cy="${p.y1 ?? -200}" r="${(p.w ?? 24) * 0.8}" fill="${p.hand ?? p.color ?? INK}"/></g>`; },
    // ZERO from straight above (top-down shots): the white head with its notch, shoulders and hands
    zerotop(p) { const r = p.rr ?? 60, look = p.look ?? 0; return `<g transform="${S(p)} rotate(${p.r ?? 0})"><ellipse cx="6" cy="10" rx="${r * 1.2}" ry="${r * 1.05}" fill="#000" opacity="0.25"/><ellipse cx="0" cy="${-r * 0.2}" rx="${r * 0.55}" ry="${r * 0.9}" fill="${INK}"/><path d="M ${-r * 0.45} ${-r * 0.2} L ${-r * 0.8} ${r * 0.75} M ${r * 0.45} ${-r * 0.2} L ${r * 0.8} ${r * 0.75}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><circle cx="${-r * 0.8}" cy="${r * 0.75}" r="12" fill="${INK}"/><circle cx="${r * 0.8}" cy="${r * 0.75}" r="12" fill="${INK}"/><circle r="${r * 0.8}" fill="${WHITE}" stroke="${INK}" stroke-width="7"/><path d="M ${f(-r * 0.2)} ${f(-r * 0.78)} l 8 -14 l 6 14" fill="${WHITE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round" transform="rotate(${look * 30})"/></g>`; },
    // dark silhouette of a chair back in the foreground (sells depth in interior shots)
    fgchair(p) { const c = p.color ?? '#0B0D1A'; return `<g transform="${S(p)}"><rect x="-120" y="-520" width="30" height="620" rx="12" fill="${c}"/><rect x="90" y="-520" width="30" height="620" rx="12" fill="${c}"/><rect x="-120" y="-520" width="240" height="40" rx="16" fill="${c}"/><rect x="-120" y="-420" width="240" height="26" rx="10" fill="${c}"/><rect x="-150" y="-80" width="300" height="50" rx="14" fill="${c}"/></g>`; },
    // a plant in a pot, flat world style, sways a little
    potplant(p) { const gt = p.gt ?? 0, sw = Math.sin(gt * 0.8 + (p.seed ?? 0)) * 3, c = p.color ?? '#3F7A5E'; return `<g transform="${S(p)}"><ellipse cx="0" cy="2" rx="60" ry="8" fill="#000" opacity="0.25"/><path d="M -46 0 L -54 -90 H 54 L 46 0 Z" fill="${p.pot ?? '#B5654A'}"/><rect x="-60" y="-104" width="120" height="20" rx="6" fill="${shade(p.pot ?? '#B5654A', 0.15)}"/><g transform="translate(0 -100) rotate(${f(sw)})">${[[-60, -120, -30], [0, -170, 0], [60, -130, 25], [-30, -200, -12], [36, -190, 14]].map(([x, y, r], i) => `<ellipse cx="${x / 2}" cy="${y / 2}" rx="26" ry="70" fill="${i % 2 ? c : shade(c, 0.2)}" transform="rotate(${r} ${x / 2} ${y / 2}) translate(${x / 2} ${y / 2}) translate(${-x / 2} ${-y / 2})"/>`).join('')}</g></g>`; },
    // foreground table edge with a mug that steams (bottom of frame, in front of everything)
    fgtable(p) { const gt = p.gt ?? 0, c = p.color ?? '#140F1E'; const steam = Array.from({ length: 4 }, (_, i) => { const k = fr(gt * 0.4 + i / 4); return `<circle cx="${f(160 + Math.sin(k * 6 + i) * 10)}" cy="${f(-130 - k * 150)}" r="${f(8 + k * 22)}" fill="#E6ECF5" opacity="${f(0.25 * (1 - k))}"/>`; }).join(''); return `<g transform="${S(p)}"><rect x="-900" y="0" width="1500" height="400" fill="${c}"/><rect x="-900" y="-14" width="1500" height="22" rx="8" fill="${tint(c, 0.08)}"/><g transform="translate(160 -14)"><path d="M -44 0 L -40 -100 H 40 L 44 0 Z" fill="#2A2238"/><path d="M 40 -80 Q 80 -76 74 -40 Q 70 -16 42 -20" fill="none" stroke="#2A2238" stroke-width="14"/></g>${steam}<g transform="translate(-300 -14)"><rect x="-90" y="-16" width="180" height="16" rx="4" fill="#231B30"/><rect x="-70" y="-30" width="140" height="14" rx="4" fill="#2A2238"/></g></g>`; },
    // queue posts with a retractable belt (institutional detail)
    stanchion(p) { const n = p.n ?? 3, gap = p.gap ?? 260, c = p.color ?? '#B9C2CF'; return `<g transform="${S(p)}">${Array.from({ length: n }, (_, i) => `<g transform="translate(${i * gap} 0)"><ellipse cx="0" cy="0" rx="46" ry="10" fill="#000" opacity="0.3"/><ellipse cx="0" cy="-6" rx="36" ry="9" fill="${shade(c, 0.3)}"/><rect x="-7" y="-260" width="14" height="254" fill="${c}"/><rect x="-14" y="-276" width="28" height="22" rx="6" fill="${shade(c, 0.2)}"/></g>`).join('')}${Array.from({ length: n - 1 }, (_, i) => `<path d="M ${i * gap + 10} -250 Q ${i * gap + gap / 2} -226 ${(i + 1) * gap - 10} -250" stroke="${p.belt ?? '#C9555A'}" stroke-width="14" fill="none"/>`).join('')}</g>`; },
    // floor mat seen in slight perspective
    mat(p) { const w = p.w ?? 420; return `<g transform="${S(p)}"><path d="M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 + 60} 90 L ${-w / 2 - 60} 90 Z" fill="${p.color ?? '#3E2F3A'}"/>${p.txt ? `<g transform="translate(0 48) scale(1 0.55)">${T(p.txt, 54, p.tc ?? '#8E7A86', 0, -4, 'letter-spacing="6"')}</g>` : ''}</g>`; },
    // waiting bench with a forgotten newspaper
    bench(p) { const c = p.color ?? '#5C4A42'; return `<g transform="${S(p)}"><ellipse cx="0" cy="4" rx="260" ry="14" fill="#000" opacity="0.28"/><rect x="-240" y="-120" width="480" height="26" rx="8" fill="${c}"/><rect x="-220" y="-94" width="20" height="94" fill="${shade(c, 0.35)}"/><rect x="200" y="-94" width="20" height="94" fill="${shade(c, 0.35)}"/><rect x="-240" y="-230" width="480" height="70" rx="10" fill="${tint(c, 0.05)}"/><rect x="-200" y="-160" width="14" height="40" fill="${shade(c, 0.3)}"/><rect x="186" y="-160" width="14" height="40" fill="${shade(c, 0.3)}"/><g transform="translate(110 -128) rotate(-6)"><rect x="-60" y="-10" width="120" height="14" fill="#D9D4C8"/><rect x="-50" y="-7" width="60" height="3" fill="#8A8578"/></g></g>`; },
    // green road sign on its own post (it scrolls past behind the truck)
    roadsign(p) { const w = p.w ?? 380; return `<g transform="${S(p)}"><rect x="-8" y="-40" width="16" height="560" fill="#2A2E40"/><rect x="${-w / 2}" y="-130" width="${w}" height="96" rx="10" fill="#1E6B48"/><rect x="${-w / 2 + 8}" y="-122" width="${w - 16}" height="80" rx="6" fill="none" stroke="#EAF4EE" stroke-width="3"/>${T(p.txt ?? 'AIRPORT →', 38, '#EAF4EE', 0, -92)}</g>`; },
    // a worker seen from above: hard hat and shoulders (top-down shots); walks with gt
    persontop(p) { const gt = p.gt ?? 0, sw = Math.sin(gt * 7 + (p.seed ?? 0)) * 8; return `<g transform="${S(p)} rotate(${p.r ?? 0})"><ellipse cx="6" cy="8" rx="44" ry="36" fill="#000" opacity="0.25"/><circle cx="${f(-14 + sw)}" cy="-28" r="10" fill="${p.skin ?? '#B9876A'}"/><circle cx="${f(-14 - sw)}" cy="28" r="10" fill="${p.skin ?? '#B9876A'}"/><ellipse cx="0" cy="0" rx="22" ry="38" fill="${p.shirt ?? '#2D6E7E'}"/><circle r="22" fill="${p.hat ?? YEL}"/><path d="M 14 -14 A 22 22 0 0 1 14 14" fill="none" stroke="${shade(p.hat ?? YEL, 0.2)}" stroke-width="6"/></g>`; },
    // a brown parcel from above (top-down shots)
    topparcel(p) { const v = Math.abs(p.v ?? 0), w = [150, 120, 180, 100][v % 4], h = [110, 100, 130, 90][v % 4], c = ['#A47A55', '#B88B60', '#93704F', '#AD835A'][v % 4]; return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" fill="#000" opacity="0.3"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${c}"/><rect x="${-w / 2}" y="-10" width="${w}" height="20" fill="${tint(c, 0.25)}" opacity="0.6"/><rect x="${w * 0.08}" y="${-h * 0.4}" width="${w * 0.3}" height="${h * 0.26}" fill="#F2EEE6"/></g>`; },

    // ===== the air network (video 001, part 2): ramp, cargo jet, containers, the hub =====
    // the airport ramp at night: sky with stars, the lit hub and the tower on the horizon (y = 0), blue taxiway lights,
    // parked jets with blinking beacons, floodlight masts with sodium cones, slab joints converging, a tug train crossing
    ramp(p) {
      const gt = p.gt ?? 0, vx = p.vx ?? 0;
      const stars = Array.from({ length: 50 }, (_, i) => `<circle cx="${f(-3000 + rnd(i * 3) * 6000)}" cy="${f(-2800 + rnd(i * 7) * 2500)}" r="${rnd(i) > 0.85 ? 3 : 2}" fill="#DDE6FF" opacity="${f(0.3 + 0.4 * fr(rnd(i * 5) + gt * 0.15 * rnd(i + 9)))}"/>`).join('');
      const jet = (x, s, i) => `<g transform="translate(${x} -6) scale(${s})"><path d="M -300 -40 L 260 -50 Q 330 -46 330 -20 Q 320 0 260 0 L -260 0 Q -300 -10 -300 -40 Z" fill="#1B2040"/><path d="M -290 -40 L -340 -170 L -250 -170 L -200 -46 Z" fill="#1B2040"/><path d="M -60 -10 L -180 30 L -100 30 L 60 -10 Z" fill="#161A36"/><circle cx="0" cy="-54" r="10" fill="#FF4A4A" opacity="${fr(gt * 1.1 + i * 0.3) < 0.15 ? 1 : 0.15}"/></g>`;
      const taxi = Array.from({ length: 80 }, (_, i) => `<circle cx="${-3200 + i * 80}" cy="16" r="5" fill="#5AA8FF" opacity="${f(0.55 + 0.35 * Math.sin(gt * 2 + i))}"/>`).join('');
      const joints = Array.from({ length: 15 }, (_, i) => `<path d="M ${vx + (i - 7) * 50} 0 L ${vx + (i - 7) * 900} 1500" stroke="#30344C" stroke-width="5" opacity="0.6"/>`).join('') + Array.from({ length: 7 }, (_, i) => `<rect x="-4000" y="${f(30 + i * i * 28)}" width="8000" height="${2 + i}" fill="#30344C" opacity="0.5"/>`).join('');
      const mast = x => `<g transform="translate(${x} 0)"><rect x="-12" y="-780" width="24" height="1060" fill="#151935"/><rect x="-80" y="-820" width="160" height="50" rx="6" fill="#1D2240"/>${[-60, -20, 20, 60].map(dx => `<rect x="${dx - 14}" y="-788" width="28" height="16" rx="4" fill="#FFD9A0"/>`).join('')}
        <path d="M -80 -780 L 80 -780 L 520 300 L -520 300 Z" fill="url(#wConeWarm)" opacity="0.4"/><ellipse cx="0" cy="300" rx="560" ry="90" fill="url(#wSodium)" opacity="0.65"/></g>`;
      const k = fr(gt / 18 + (p.seed ?? 0)), tx = -2800 + k * 5600;
      const tug = `<g transform="translate(${f(tx)} 120) scale(0.55)"><rect x="0" y="-70" width="120" height="60" rx="10" fill="#D9A43A"/><rect x="30" y="-110" width="60" height="44" rx="6" fill="#1D2240"/><circle cx="60" cy="-118" r="9" fill="#FFB25C" opacity="${fr(gt * 2) < 0.5 ? 1 : 0.2}"/>${[0, 1, 2].map(i => `<g transform="translate(${-200 - i * 240} 0)"><rect x="-100" y="-34" width="200" height="16" fill="#4A5270"/><path d="M -80 -34 L 100 -34 L 100 -200 L -100 -200 L -100 -90 Z" fill="#9AA3B5"/><rect x="-86" y="-186" width="172" height="140" fill="#2A2638"/></g>`).join('')}<circle cx="30" cy="-6" r="14" fill="#14161F"/><circle cx="96" cy="-6" r="14" fill="#14161F"/></g>`;
      return `<g><defs><linearGradient id="wRampSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060918"/><stop offset="1" stop-color="#2A3060"/></linearGradient></defs>
        <rect x="-4000" y="-3200" width="8000" height="3200" fill="url(#wRampSky)"/>${stars}<ellipse cx="0" cy="0" rx="2600" ry="160" fill="url(#wSodium)" opacity="0.35"/>
        ${p.hub === false ? '' : `<rect x="-1500" y="-150" width="2500" height="150" fill="#141830"/>${Array.from({ length: 80 }, (_, i) => rnd(i * 7) > 0.45 ? `<rect x="${-1490 + i * 31}" y="-100" width="14" height="12" fill="#FFCF8A" opacity="0.55"/>` : '').join('')}${Array.from({ length: 42 }, (_, i) => `<rect x="${-1490 + i * 60}" y="-154" width="10" height="6" fill="#FFCF8A" opacity="0.8"/>`).join('')}
        <g transform="translate(1250 0)"><rect x="-15" y="-470" width="30" height="470" fill="#141830"/><path d="M -60 -540 L 60 -540 L 50 -470 L -50 -470 Z" fill="#1E2A3F"/><rect x="-54" y="-528" width="108" height="26" fill="#7CE0B0" opacity="0.55"/><circle cy="-552" r="7" fill="#FF4A4A" opacity="${fr(gt * 0.8) < 0.3 ? 1 : 0.2}"/></g>`}
        ${jet(-900, 0.38, 0)}${jet(-380, 0.3, 1)}${jet(520, 0.34, 2)}
        <rect x="-4000" y="0" width="8000" height="3000" fill="#23273B"/><rect x="-4000" y="0" width="8000" height="1400" fill="url(#wFloorFade)" opacity="0.6"/>${taxi}${joints}
        <path d="M ${vx + 40} 0 Q ${vx + 380} 420 ${vx - 320} 1500" fill="none" stroke="#D9B44A" stroke-width="14" opacity="0.7"/>
        ${tug}${(p.masts ?? [-1150, 1050]).map(mast).join('')}</g>`;
    },
    // a cargo jet side-on, nose to the right (no real airline's livery): fuselage, cheatline, fin, wing, two engines,
    // gear; door 0..1 opens the main-deck cargo door (warm light inside); land turns on the landing light;
    // tilt rotates it about the main gear (take-off); beacon and strobes blink with gt
    cargojet(p) {
      const gt = p.gt ?? 0, door = p.door ?? 0, c = p.color ?? '#E6E4DE', liv = p.livery ?? '#2B3A67';
      const beacon = fr(gt * 1.1) < 0.14, strobe = fr(gt * 0.9 + 0.5) < 0.05;
      const wheel = (x, n = 2) => Array.from({ length: n }, (_, i) => `<g transform="translate(${x + i * 70} -46) rotate(${f(gt * (p.roll ?? 0))})"><circle r="44" fill="#14161F"/><circle r="18" fill="#5C6684"/><rect x="-16" y="-3" width="32" height="6" fill="#3A3F5C"/></g>`).join('');
      return `<g transform="${S(p)} rotate(${f(-(p.tilt ?? 0))} -100 -50)"><ellipse cx="0" cy="4" rx="${p.tilt ? 0 : 1000}" ry="26" fill="#000" opacity="0.35"/>
        <rect x="-140" y="-280" width="22" height="230" fill="#4A5270"/><rect x="740" y="-280" width="18" height="230" fill="#4A5270"/>${wheel(-200)}${wheel(712, 1)}
        <path d="M -880 -470 L -960 -930 L -820 -930 L -560 -490 Z" fill="${liv}"/><path d="M -900 -880 L -830 -880 L -640 -500" stroke="${tint(liv, 0.25)}" stroke-width="14" fill="none"/>
        <path d="M -920 -470 L 760 -570 Q 950 -566 966 -430 Q 958 -286 770 -268 L -700 -268 Q -880 -300 -920 -470 Z" fill="${c}"/>
        <path d="M -900 -380 L -700 -268 L 770 -268 Q 930 -282 958 -380 Z" fill="${shade(c, 0.18)}"/>
        <path d="M -900 -456 L 940 -470" stroke="${liv}" stroke-width="20"/><path d="M -900 -432 L 940 -446" stroke="${tint(liv, 0.3)}" stroke-width="6"/>
        <path d="M 836 -508 L 904 -502 L 930 -476 L 846 -478 Z" fill="#1A2140"/><path d="M 850 -502 L 868 -500 L 862 -482 L 848 -484 Z" fill="#7CA4D8" opacity="0.5"/>
        <path d="M -930 -470 L -1010 -500 L -950 -500 L -780 -470 Z" fill="${shade(c, 0.1)}"/>
        ${door > 0 ? `<rect x="520" y="-560" width="190" height="200" fill="#2A2638"/><ellipse cx="615" cy="-450" rx="120" ry="110" fill="url(#wWarm)" opacity="0.9"/><g transform="translate(520 -560) rotate(${f(-100 * door)})"><rect x="0" y="0" width="190" height="200" fill="${tint(c, 0.05)}"/><rect x="0" y="184" width="190" height="16" fill="${shade(c, 0.2)}"/></g>`
          : `<path d="M 520 -560 V -362 H 712 V -566" fill="none" stroke="${shade(c, 0.22)}" stroke-width="4"/>`}
        <path d="M -320 -300 L 120 -300 L 380 -220 L -60 -220 Z" fill="${shade(c, 0.32)}"/>
        <g transform="translate(160 -196)"><path d="M -230 -50 L 150 -60 Q 190 -56 190 0 Q 190 56 150 60 L -230 50 L -290 0 Z" fill="#8C93AA"/><ellipse cx="174" cy="0" rx="22" ry="58" fill="#1B1E33"/><ellipse cx="176" cy="0" rx="10" ry="40" fill="#3A3F5C" opacity="${f(0.6 + 0.4 * Math.sin(gt * 30))}"/><rect x="-200" y="-12" width="300" height="10" fill="${liv}" opacity="0.6"/></g>
        <circle cx="0" cy="-578" r="10" fill="#FF4A4A" opacity="${beacon ? 1 : 0.2}"/>${beacon ? `<circle cx="0" cy="-578" r="80" fill="#FF4A4A" opacity="0.25"/>` : ''}
        <circle cx="-940" cy="-920" r="9" fill="#FFFFFF" opacity="${strobe ? 1 : 0.15}"/>${strobe ? `<circle cx="-940" cy="-920" r="120" fill="#FFFFFF" opacity="0.3"/>` : ''}
        ${p.land ? `<circle cx="760" cy="-262" r="14" fill="#FFF6D8"/><path d="M 760 -262 L 1700 -420 L 1700 -60 Z" fill="#FFF1C9" opacity="0.1"/>` : ''}</g>`;
    },
    // an air cargo container (the ULD the script talks about), seen from its open face: aluminium frame with the
    // contour cut that lets it fit the curve of the fuselage, ribs, a vinyl curtain (door 0..1 rolls it up), parcels
    // stacked inside (fill 0..1), the yellow box in one slot (yellow: true), an ID plate
    uld(p) {
      const w = 320, h = 300, fill = p.fill ?? 0.7, door = p.door ?? 0, cc = p.color ?? '#AEB6C6';
      const shape = `M -100 0 L 160 0 L 160 -${h} L -160 -${h} L -160 -120 Z`;
      const rows = Math.round(4 * fill);
      const stack = Array.from({ length: rows }, (_, r) => Array.from({ length: 3 }, (_, i) => { const v = (r * 3 + i + (p.seed ?? 0)) % 5, x = -96 + i * 96 + (r % 2) * 10 + (r === 0 && i === 0 ? 30 : 0); return `<g transform="translate(${x} ${-8 - r * 68}) scale(0.62)">${PROPS.parcel({ v })}</g>`; }).join('')).join('');
      const yb = p.yellow ? `<g transform="translate(${p.yx ?? 40} ${p.yy ?? -8 - Math.max(0, rows - 1) * 68 - 68})">${PROPS.giftbox({ s: 0.62, label: true, stamp: 1, wet: p.wet ?? 0 })}</g>` : '';
      return `<g transform="${S(p)}"><ellipse cx="0" cy="2" rx="180" ry="10" fill="#000" opacity="0.3"/><defs><clipPath id="${gid('uldc', p.seed ?? 0)}"><path d="${shape}"/></clipPath></defs>
        <path d="${shape}" fill="${cc}"/><g clip-path="url(#${gid('uldc', p.seed ?? 0)})"><rect x="-150" y="-${h - 12}" width="300" height="${h - 20}" fill="#1E1C2C"/>${stack}${yb}
        ${door < 1 ? `<rect x="-160" y="-${h}" width="320" height="${f(h * (1 - door))}" fill="#9FC4D8" opacity="0.38"/>${[-90, 0, 90].map(x => `<rect x="${x - 6}" y="-${h}" width="12" height="${f(h * (1 - door))}" fill="#E6C14A" opacity="0.7"/>`).join('')}<rect x="-160" y="${f(-h + h * (1 - door) - 14)}" width="320" height="18" rx="9" fill="#8FB1C4"/>` : `<rect x="-160" y="-${h}" width="320" height="20" rx="10" fill="#8FB1C4"/>`}</g>
        <path d="${shape}" fill="none" stroke="${shade(cc, 0.25)}" stroke-width="10" stroke-linejoin="round"/>${[-80, 0, 80].map(x => `<rect x="${x - 3}" y="-${h}" width="6" height="14" fill="${shade(cc, 0.3)}"/>`).join('')}
        <rect x="70" y="-${h + 2}" width="84" height="26" rx="3" fill="#F2EEE6"/>${T(p.id ?? 'AKE', 16, '#1B1E33', 112, -h + 9)}
        ${p.dest ? `<g transform="translate(-60 -${h + 40})"><rect x="-60" y="-24" width="120" height="48" rx="6" fill="#1B1E33"/>${T(p.dest, 28, p.dc ?? '#7CC2FF', 0, -4)}</g>` : ''}</g>`;
    },
    // low airport dolly a container sits on, with a tow bar; lock 0..1 raises its side stops
    dolly(p) { const l = p.lock ?? 1; return `<g transform="${S(p)}"><rect x="-190" y="-40" width="380" height="22" rx="4" fill="#4A5270"/><rect x="-200" y="-46" width="400" height="8" fill="#6C7590"/>${[-170, 170].map(x => `<rect x="${x - 8}" y="${f(-46 - 26 * l)}" width="16" height="${f(26 * l + 6)}" fill="#E6C14A"/>`).join('')}<path d="M -190 -28 L -300 -10" stroke="#3A3F5C" stroke-width="10"/>${[-130, 130].map(x => `<circle cx="${x}" cy="-14" r="16" fill="#14161F"/>`).join('')}</g>`; },
    // inside the main deck of the cargo jet, side cutaway: quilted insulation between ribs, ceiling lamps, a floor of
    // roller tracks, a cargo net; window: x of a round window (moonlight comes in); red: the dim red night light
    hold(p) {
      const gt = p.gt ?? 0, red = p.red ?? 0;
      const ribs = Array.from({ length: 26 }, (_, i) => { const x = -2600 + i * 200; return `<rect x="${x}" y="-760" width="150" height="740" rx="10" fill="#353A54"/>${[0, 1, 2, 3].map(j => `<rect x="${x + 12}" y="${-740 + j * 180}" width="126" height="160" rx="12" fill="#3B4060"/>`).join('')}<rect x="${x + 150}" y="-780" width="50" height="780" fill="#2A2E44"/>`; }).join('');
      const lamps = Array.from({ length: 9 }, (_, i) => { const x = -2400 + i * 600; return `<rect x="${x - 60}" y="-790" width="120" height="16" rx="6" fill="${red ? '#FF7A6A' : '#FFE7B0'}"/><ellipse cx="${x}" cy="-600" rx="300" ry="260" fill="url(#w${red ? 'Sodium' : 'Warm'})" opacity="${f(0.45 + 0.05 * Math.sin(gt * 9 + i))}"/>`; }).join('');
      const rollers = Array.from({ length: 70 }, (_, i) => `<circle cx="${-2600 + i * 76}" cy="-6" r="10" fill="#7A8299"/>`).join('');
      const win = p.window != null ? `<g transform="translate(${p.window} -430)"><circle r="70" fill="#1E2236"/><circle r="52" fill="#0B1030"/><circle cx="-14" cy="-14" r="10" fill="#DDE6FF" opacity="0.8"/><ellipse cx="0" cy="0" rx="52" ry="52" fill="url(#wCool)" opacity="0.6"/><ellipse cx="60" cy="380" rx="160" ry="40" fill="url(#wCool)" opacity="0.35"/></g>` : '';
      return `<g><rect x="-4000" y="-3000" width="8000" height="3000" fill="#22263C"/>${ribs}${lamps}${win}
        <path d="M -4000 -800 L 4000 -800 L 4000 -1400 L -4000 -1400 Z" fill="#191C2E"/><rect x="-4000" y="-20" width="8000" height="40" fill="#4A5270"/>${rollers}<rect x="-4000" y="20" width="8000" height="2000" fill="#1A1D2E"/>
        ${red ? `<rect x="-4000" y="-3000" width="8000" height="5000" fill="#FF3B2E" opacity="${f(0.08 * red)}"/>` : ''}</g>`;
    },
    // a cargo net strapped across the front of the containers (foreground of the hold)
    net(p) { const w = p.w ?? 1400, h = p.h ?? 700; let d = ''; for (let i = 0; i <= w / 70; i++) d += `M ${-w / 2 + i * 70} ${-h} L ${-w / 2 + i * 70 - 120} 0 `; for (let i = 0; i <= w / 70; i++) d += `M ${-w / 2 + i * 70 - 120} ${-h} L ${-w / 2 + i * 70} 0 `; return `<g opacity="${p.op ?? 0.5}"><path d="${d}" stroke="#2A2E40" stroke-width="7"/></g>`; },
    // night take-off seen from the side of the runway: sky, distant lights, runway edge lights and centre line rushing
    // past at speed px/s (the camera pans with the jet)
    runway(p) {
      const gt = p.gt ?? 0, sp = p.speed ?? 2400;
      const edge = (y, r, c) => Array.from({ length: 40 }, (_, i) => `<circle cx="${f(-3000 + ((i * 160 - gt * sp) % 6400 + 6400) % 6400)}" cy="${y}" r="${r}" fill="${c}"/>`).join('');
      return `<g><rect x="-4000" y="-3000" width="8000" height="3000" fill="url(#wRampSky)"/><defs><linearGradient id="wRampSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060918"/><stop offset="1" stop-color="#2A3060"/></linearGradient></defs>
        <ellipse cx="0" cy="0" rx="3000" ry="140" fill="url(#wSodium)" opacity="0.3"/>${Array.from({ length: 60 }, (_, i) => `<circle cx="${f(-3000 + rnd(i * 13) * 6000 - (gt * sp * 0.05) % 300)}" cy="${f(-4 - rnd(i) * 30)}" r="3" fill="#FFCF8A" opacity="0.6"/>`).join('')}
        <rect x="-4000" y="0" width="8000" height="3000" fill="#1B1E2E"/><rect x="-4000" y="90" width="8000" height="200" fill="#2A2E44"/>${edge(96, 8, '#FFFFFF')}${edge(284, 10, '#FFFFFF')}
        ${Array.from({ length: 30 }, (_, i) => `<rect x="${f(-3000 + ((i * 240 - gt * sp) % 7200 + 7200) % 7200)}" y="186" width="120" height="8" fill="#E6E4DE" opacity="0.7"/>`).join('')}</g>`;
    },
    // the night approach seen through a round window: a queue of landing lights coming down a slope of air toward the
    // lit hub on the horizon; ground lights in perspective. n planes, one every (period) seconds
    approach(p) {
      const gt = p.gt ?? 0, n = p.n ?? 8, hx = p.hx ?? 560;
      const ground = Array.from({ length: 14 }, (_, r) => Array.from({ length: 40 }, (_, i) => { const y = 10 + r * r * 6, sx = (i - 20) * (60 + r * 24); return rnd(r * 40 + i) > 0.55 ? `<circle cx="${f(hx * 0.3 + sx)}" cy="${y}" r="${f(1.5 + r * 0.25)}" fill="${rnd(i * 3 + r) > 0.7 ? '#FFFFFF' : '#FFC27A'}" opacity="0.75"/>` : ''; }).join('')).join('');
      const planes = Array.from({ length: n }, (_, j) => { const k = fr(gt / (p.period ?? 3.4) / n + j / n), x = -1500 + (hx + 1500) * k, y = -1000 + 990 * k, s = 0.4 + 0.6 * (1 - k), on = fr(gt * 1.2 + j * 0.37) < 0.15;
        return `<g transform="translate(${f(x)} ${f(y)})" opacity="${f(Math.min(1, (1 - k) * 8))}"><path d="M 0 0 L ${f(260 * s)} ${f(120 * s)} L ${f(200 * s)} ${f(200 * s)} Z" fill="#FFF1C9" opacity="0.12"/><circle r="${f(70 * s)}" fill="url(#wCool)"/><circle r="${f(10 * s + 3)}" fill="#FFFFFF"/><circle cx="${f(-16 * s)}" cy="${f(-6 * s)}" r="${f(3 * s + 1)}" fill="#FF4A4A" opacity="${on ? 1 : 0.2}"/></g>`; }).join('');
      return `<g><rect x="-4000" y="-3000" width="8000" height="3000" fill="url(#wRampSky)"/><defs><linearGradient id="wRampSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060918"/><stop offset="1" stop-color="#2A3060"/></linearGradient></defs>
        ${Array.from({ length: 40 }, (_, i) => `<circle cx="${f(-2000 + rnd(i * 3) * 4000)}" cy="${f(-1500 + rnd(i * 7) * 1300)}" r="2" fill="#DDE6FF" opacity="0.5"/>`).join('')}
        <rect x="-4000" y="0" width="8000" height="2000" fill="#0B0E1E"/>${ground}
        <ellipse cx="${hx}" cy="6" rx="420" ry="70" fill="url(#wSodium)"/><ellipse cx="${hx}" cy="6" rx="200" ry="26" fill="#FFCF8A" opacity="0.6"/>${planes}</g>`;
    },
    // screen-space round window frame (POV shots): dark wall with a round hole r at the centre, a rim, a glint
    porthole(p) { const r = p.rr ?? 400, cx = p.cx ?? 960, cy = p.cy ?? 540; return `<g><path d="M -100 -100 H 2020 V 1180 H -100 Z M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z" fill="#1E2236" fill-rule="evenodd"/><circle cx="${cx}" cy="${cy}" r="${r + 18}" fill="none" stroke="#3A3F58" stroke-width="40"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0B0D18" stroke-width="10"/><path d="M ${cx - r * 0.6} ${cy - r * 0.55} Q ${cx - r * 0.2} ${cy - r * 0.85} ${cx + r * 0.2} ${cy - r * 0.8}" stroke="#FFFFFF" stroke-width="10" fill="none" opacity="0.12" stroke-linecap="round"/></g>`; },
    // the hub from the air at night (top-down with a slight tilt): the main building with its piers, jets parked
    // at the piers, tugs crawling, sodium pools on the apron; fields 0..1 tiles the roof with up to 90 football fields;
    // city: the lights of the city around the airport (for the pull-out)
    hubaerial(p) {
      const gt = p.gt ?? 0, fl = p.fields ?? 0;
      const jetTop = (x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M 0 -120 Q 10 -110 10 -80 L 10 80 Q 0 120 -10 80 L -10 -80 Q -10 -110 0 -120 Z" fill="#DCDAD4"/><path d="M -10 -10 L -110 40 L -110 56 L -10 30 Z M 10 -10 L 110 40 L 110 56 L 10 30 Z" fill="#C9C7C0"/><path d="M -6 90 L -44 110 L 44 110 L 6 90 Z" fill="#C9C7C0"/><rect x="-6" y="80" width="12" height="30" fill="#2B3A67"/></g>`;
      const piers = [[-640, -1], [0, -1], [640, -1], [-320, 1], [320, 1]];
      const jets = piers.map(([x, d], i) => [-1, 1].map(sd => [0, 1].map(j => (i + j + (sd > 0 ? 1 : 0)) % 3 === 0 ? '' : jetTop(x + sd * 190, d * (420 + j * 260), sd > 0 ? -90 : 90, 0.85)).join('')).join('')).join('');
      const tugs = Array.from({ length: 16 }, (_, i) => { const k = fr(gt * 0.03 * (0.6 + rnd(i)) + rnd(i * 3)), a = k * Math.PI * 2, rx = 1400 + rnd(i * 5) * 400, ry = 900 + rnd(i * 7) * 200; return `<circle cx="${f(Math.cos(a) * rx)}" cy="${f(Math.sin(a) * ry)}" r="7" fill="#FFB25C" opacity="${fr(gt * 2 + i * 0.3) < 0.5 ? 1 : 0.4}"/>`; }).join('');
      const fields = fl > 0 ? Array.from({ length: Math.round(90 * fl) }, (_, i) => { const c = i % 15, r = Math.floor(i / 15), x = -900 + c * 120, y = -270 + r * 90; return `<g><rect x="${x + 3}" y="${y + 3}" width="114" height="84" fill="${i % 2 ? '#3C8C4E' : '#46A05A'}"/><rect x="${x + 9}" y="${y + 9}" width="102" height="72" fill="none" stroke="#EAF4EE" stroke-width="2.5" opacity="0.8"/><path d="M ${x + 60} ${y + 9} V ${y + 81}" stroke="#EAF4EE" stroke-width="2.5" opacity="0.8"/></g>`; }).join('') : '';
      const city = p.city ? Array.from({ length: 900 }, (_, i) => { const a = rnd(i * 3) * Math.PI * 2, r = 3400 + Math.pow(rnd(i * 7), 0.7) * 14000; return `<circle cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" r="${f(30 + rnd(i) * 60)}" fill="${rnd(i * 11) > 0.8 ? '#FFFFFF' : '#FFC27A'}" opacity="0.5"/>`; }).join('') : '';
      return `<g transform="scale(1 ${p.tiltY ?? 0.62})"><rect x="-30000" y="-30000" width="60000" height="60000" fill="#0B0E1E"/>${city}<rect x="-6000" y="-5000" width="12000" height="10000" fill="#141729"/><rect x="-3000" y="-1500" width="6000" height="3000" rx="200" fill="#1E2236"/>
        ${Array.from({ length: 24 }, (_, i) => `<ellipse cx="${f(-2600 + rnd(i * 11) * 5200)}" cy="${f(-1300 + rnd(i * 17) * 2600)}" rx="260" ry="260" fill="url(#wSodium)" opacity="0.4"/>`).join('')}
        <path d="M -3000 1100 H 3000 M -3000 -1100 H 3000" stroke="#C9A84A" stroke-width="8" opacity="0.4"/>
        ${piers.map(([x, d]) => `<rect x="-90" y="${d > 0 ? 260 : -900}" width="180" height="640" fill="#2E3354" transform="translate(${x} 0)"/>`).join('')}
        <rect x="-930" y="-300" width="1860" height="600" fill="#3A3F5C"/>${Array.from({ length: 11 }, (_, i) => `<path d="M ${-930 + i * 186} -300 V 300" stroke="#2E3354" stroke-width="4"/>`).join('')}${Array.from({ length: 30 }, (_, i) => `<rect x="${f(-880 + rnd(i) * 1740)}" y="${f(-260 + rnd(i * 3) * 500)}" width="40" height="28" fill="#4A5270"/>`).join('')}
        <rect x="-930" y="-300" width="1860" height="600" fill="none" stroke="#FFB25C" stroke-width="5" opacity="0.6"/>${fields}
        <rect x="-930" y="300" width="1860" height="60" fill="#22263C"/>${Array.from({ length: 46 }, (_, i) => `<rect x="${-920 + i * 40}" y="316" width="20" height="14" fill="#FFCF8A" opacity="${rnd(i) > 0.3 ? 0.7 : 0.1}"/>`).join('')}
        ${jets}${tugs}</g>`;
    },
    // the hub's outer wall at ground level, low angle: corrugated panels, a dock door (warm interior, rubber seals,
    // hazard stripes), sodium wall lamps, the lead-in line and stop bar painted on the tarmac; horizon at y = 0
    hubwall(p) {
      const gt = p.gt ?? 0, dx = p.dx ?? 700, dw = p.dw ?? 1000, dh = p.dh ?? 760;
      const panels = Array.from({ length: 90 }, (_, i) => `<rect x="${-4500 + i * 100}" y="-1700" width="10" height="1700" fill="#262B48"/>`).join('');
      const lamps = [-1700, -900, -100, 1600, 2400].map(x => `<g transform="translate(${x} -880)"><rect x="-40" y="-14" width="80" height="22" rx="6" fill="#FFD9A0"/><path d="M -40 8 L 40 8 L 300 900 L -300 900 Z" fill="url(#wConeWarm)" opacity="0.35"/></g>`).join('');
      const hz = Array.from({ length: Math.ceil(dh / 40) }, (_, i) => `<path d="M 0 ${-dh + i * 40} l 30 0 l -30 30 Z" fill="${i % 2 ? '#1B1E33' : '#E8B83C'}"/>`).join('');
      return `<g><rect x="-4500" y="-3000" width="9000" height="3000" fill="url(#wRampSky)"/><defs><linearGradient id="wRampSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060918"/><stop offset="1" stop-color="#2A3060"/></linearGradient></defs>
        <rect x="-4500" y="-1700" width="9000" height="1700" fill="#2E3458"/>${panels}<rect x="-4500" y="-1720" width="9000" height="30" fill="#1D2240"/>${Array.from({ length: 60 }, (_, i) => `<rect x="${-4480 + i * 150}" y="-1726" width="12" height="8" fill="#FF4A4A" opacity="${fr(gt * 0.7 + i * 0.13) < 0.2 ? 1 : 0.2}"/>`).join('')}
        <g transform="translate(${dx} 0)"><rect x="${-dw / 2 - 40}" y="${-dh - 40}" width="${dw + 80}" height="${dh + 40}" fill="#14161F"/><rect x="${-dw / 2}" y="${-dh}" width="${dw}" height="${dh}" fill="#3B3149"/><ellipse cx="0" cy="${-dh * 0.45}" rx="${dw * 0.55}" ry="${dh * 0.5}" fill="url(#wWarm)"/>
          ${Array.from({ length: 5 }, (_, i) => `<rect x="${-dw / 2 + 60 + i * (dw - 120) / 4 - 30}" y="${-dh * 0.38}" width="60" height="${dh * 0.38}" fill="#2A2638" opacity="0.8"/>`).join('')}<rect x="${-dw / 2}" y="${-dh * 0.38 - 20}" width="${dw}" height="22" fill="#5C6684"/>
          <g transform="translate(${-dw / 2 - 40} 0)">${hz}</g><g transform="translate(${dw / 2 + 10} 0)">${hz}</g>
          <g transform="translate(0 ${-dh - 110})"><rect x="-140" y="-40" width="280" height="80" rx="8" fill="#1B1E33"/><rect x="-132" y="-32" width="264" height="64" rx="5" fill="none" stroke="#FFC93C" stroke-width="3"/>${T(p.txt ?? 'DOCK 7', 34, '#FFC93C', 0, -4, 'letter-spacing="3"')}</g></g>
        ${lamps}<rect x="-4500" y="0" width="9000" height="3000" fill="#23273B"/><rect x="-4500" y="0" width="9000" height="40" fill="#1B1E2E"/>
        <path d="M ${dx - 2400} 520 Q ${dx - 600} 200 ${dx} 40" fill="none" stroke="#D9B44A" stroke-width="16" opacity="0.7"/><rect x="${dx - 260}" y="70" width="520" height="16" fill="#E6E4DE" opacity="0.8"/>
        ${[-1300, -500, 1500].map(x => `<ellipse cx="${x}" cy="160" rx="420" ry="80" fill="url(#wSodium)" opacity="0.6"/>`).join('')}</g>`;
    },
    // inside the hub: high trusses, hanging sodium lamps, three tiers of belts in the background with parcels flowing
    // (each tier its own speed and direction), railings, columns with hazard feet; floor at y = 0 with reflections
    hubint(p) {
      const gt = p.gt ?? 0, dim = p.dim ?? 0;
      const tiers = [[-820, 160, 0.55], [-560, -220, 0.7], [-320, 260, 0.85]];
      const tier = ([y, sp, s], ti) => { const off = ((gt * sp) % 300 + 300) % 300; return `<g><rect x="-4500" y="${y}" width="9000" height="${26 * s}" fill="#4A5270"/><rect x="-4500" y="${y + 26 * s}" width="9000" height="${10 * s}" fill="#2A2E44"/><rect x="-4500" y="${y - 50 * s}" width="9000" height="${6 * s}" fill="#E6C14A" opacity="0.55"/>
        ${Array.from({ length: 32 }, (_, i) => { const x = -4500 + i * 300 + off, v = (i * 7 + ti) % 5; return rnd(i + ti * 40) > 0.25 ? `<g transform="translate(${f(x)} ${y}) scale(${f(s * 0.7)})">${PROPS.parcel({ v })}</g>` : ''; }).join('')}
        ${Array.from({ length: 16 }, (_, i) => `<rect x="${-4500 + i * 600 + ti * 120}" y="${y + 30 * s}" width="${14 * s}" height="${-y}" fill="#252A42"/>`).join('')}</g>`; };
      const truss = Array.from({ length: 46 }, (_, i) => `<path d="M ${-4500 + i * 200} -1300 L ${-4400 + i * 200} -1180 L ${-4300 + i * 200} -1300" stroke="#2A2E48" stroke-width="10" fill="none"/>`).join('');
      const lamps = Array.from({ length: 12 }, (_, i) => { const x = -3300 + i * 600; return `<g transform="translate(${x} -1150)"><path d="M 0 -150 V 0" stroke="#1B1E33" stroke-width="4"/><path d="M -40 0 L 40 0 L 26 -24 L -26 -24 Z" fill="#1B1E33"/><ellipse cx="0" cy="4" rx="24" ry="8" fill="#FFD9A0"/><path d="M -40 4 L 40 4 L 380 1150 L -380 1150 Z" fill="url(#wConeWarm)" opacity="${f(0.22 * (1 - dim))}"/></g><ellipse cx="${x}" cy="40" rx="300" ry="50" fill="url(#wSodium)" opacity="${f(0.45 * (1 - dim))}"/>`; }).join('');
      const cols = Array.from({ length: 9 }, (_, i) => `<g transform="translate(${-4000 + i * 1000} 0)"><rect x="-26" y="-1300" width="52" height="1300" fill="#20243C"/><path d="M -26 -120 h 52 v 120 h -52 Z" fill="#E8B83C"/>${[0, 1, 2].map(j => `<path d="M -26 ${-100 + j * 40} l 52 -30 v 18 l -52 30 Z" fill="#1B1E33"/>`).join('')}</g>`).join('');
      return `<g><rect x="-4500" y="-3000" width="9000" height="3000" fill="#1B1F33"/>${truss}<rect x="-4500" y="-1310" width="9000" height="20" fill="#252A46"/>${tiers.map(tier).join('')}${cols}${lamps}
        <rect x="-4500" y="0" width="9000" height="2500" fill="#262A3C"/><rect x="-4500" y="0" width="9000" height="900" fill="url(#wFloorFade)" opacity="0.5"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${-4500 + i * 300}" y="0" width="3" height="900" fill="#30344C" opacity="0.6" transform="skewX(${(i - 15) * 2})"/>`).join('')}
        ${dim ? `<rect x="-4500" y="-3000" width="9000" height="5500" fill="#05060F" opacity="${f(0.6 * dim)}"/>` : ''}</g>`;
    },
    // odd-shaped parcels for the irregular lane: k tube | tire | guitar | golf
    oddparcel(p) {
      const k = p.k ?? 'tube', sh = '<ellipse cx="0" cy="3" rx="90" ry="8" fill="#000" opacity="0.25"/>';
      const body = {
        tube: `<rect x="-120" y="-48" width="240" height="44" rx="22" fill="#B88B60"/><ellipse cx="120" cy="-26" rx="10" ry="22" fill="#8C6844"/><rect x="-30" y="-48" width="50" height="44" fill="#F2EEE6"/>`,
        tire: `<circle cy="-70" r="70" fill="#1F2130"/><circle cy="-70" r="34" fill="#3A3F5C"/><circle cy="-70" r="20" fill="#14161F"/><rect x="-20" y="-150" width="40" height="30" fill="#F2EEE6"/>`,
        guitar: `<g transform="rotate(-8)"><path d="M -140 -10 Q -150 -60 -100 -66 Q -70 -70 -60 -50 Q -40 -64 -10 -56 L 120 -46 L 130 -24 L -10 -16 Q -40 -8 -60 -22 Q -70 0 -100 0 Q -134 2 -140 -10 Z" fill="#2A2238"/><rect x="-80" y="-48" width="40" height="20" fill="#F2EEE6"/></g>`,
        golf: `<rect x="-36" y="-170" width="72" height="170" rx="20" fill="#3D6B58"/><rect x="-36" y="-100" width="72" height="14" fill="#2A4A3C"/>${[-18, 0, 18].map((x, i) => `<rect x="${x - 3}" y="${-230 + i * 10}" width="6" height="70" fill="#9AA3B5"/><circle cx="${x}" cy="${-232 + i * 10}" r="9" fill="#C9CED8"/>`).join('')}<rect x="-20" y="-70" width="40" height="22" fill="#F2EEE6"/>`,
      }[k];
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})">${sh}${body}</g>`;
    },
    // a diverter paddle beside a belt: post and an arm that swings by ang degrees (0 = parked along the belt edge)
    paddle(p) { const a = p.ang ?? 0; return `<g transform="${S(p)}"><rect x="-14" y="-160" width="28" height="160" fill="#4A5270"/><circle cy="-160" r="22" fill="#5C6684"/><g transform="translate(0 -160) rotate(${f(a)})"><rect x="0" y="-16" width="240" height="32" rx="10" fill="#E8B83C"/>${[0, 1, 2, 3, 4].map(i => `<path d="M ${20 + i * 44} -16 l 22 0 l -22 32 l -22 0 Z" fill="#1B1E33"/>`).join('')}</g></g>`; },
    // the camera tunnel over the belt, side cutaway: a hood lined with camera heads (top, back, floor rail) that all
    // flash (flash 0..1) and draw their sight lines to the label (red: the read failed); a strip of status LEDs runs along the hood
    camtunnel(p) {
      const gt = p.gt ?? 0, fl = p.flash ?? 0, w = p.w ?? 560, h = p.h ?? 440, ty = p.ty ?? -120;
      const heads = [...[-200, -100, 0, 100, 200].map(x => [x, -h + 50, 90]), ...[-160, 0, 160].map(x => [x, -h * 0.55, 0]), ...[-210, 210].map(x => [x, -40, x < 0 ? -40 : 220])];
      const cam_ = ([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-24" y="-18" width="48" height="36" rx="6" fill="#3A3F5C"/><circle r="12" fill="#0B0D18"/><circle r="7" fill="${fl > 0.2 ? (p.red ? '#FFD0C8' : '#E6F4FF') : (p.red ? '#E85B4E' : '#3A7BD5')}"/><circle cx="-3" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.8"/></g>`;
      const lines = fl > 0.05 ? heads.map(([x, y]) => `<path d="M ${x} ${y} L ${p.lx ?? 0} ${ty}" stroke="${p.red ? '#FF8A7A' : '#7CC2FF'}" stroke-width="3" opacity="${f(0.8 * fl)}"/>`).join('') : '';
      return `<g transform="${S(p)}"><rect x="${-w / 2 - 30}" y="${-h - 40}" width="${w + 60}" height="${h + 40}" rx="20" fill="#4A5270"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#0C0F1E"/>
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${p.red ? '#FF8A7A' : '#CFE8FF'}" opacity="${f(0.45 * fl + (p.red ? 0.12 : 0))}"/>${heads.map(cam_).join('')}${lines}
        ${Array.from({ length: 14 }, (_, i) => `<rect x="${-w / 2 + 10 + i * (w - 20) / 14}" y="${-h - 28}" width="${(w - 20) / 14 - 8}" height="10" rx="3" fill="${fr(gt * 1.5 - i / 14) < 0.15 ? '#7CC2FF' : '#23304E'}"/>`).join('')}
        ${T(p.txt ?? 'DIMENSION · WEIGHT · LABEL', 18, '#9AA3B5', 0, -h - 58, 'letter-spacing="2"')}</g>`;
    },
    // the curtain the camera tunnel's belt runs through (put it in front of the box at the tunnel mouth)
    strips(p) { const gt = p.gt ?? 0, h = p.h ?? 440; return `<g>${Array.from({ length: 6 }, (_, i) => `<path d="M ${i * 14} ${-h} L ${i * 14 + 12} ${-h} L ${f(i * 14 + 12 + Math.sin(gt * 2 + i) * 4 + (p.push ?? 0) * 40)} 0 L ${f(i * 14 + Math.sin(gt * 2 + i) * 4 + (p.push ?? 0) * 40)} 0 Z" fill="#9FC4D8" opacity="0.3"/>`).join('')}</g>`; },
    // a hanging monitor: dark screen, lines of system text (l1, l2), ok: 0..1 shows the green check
    monitor(p) { const w = p.w ?? 460, h = p.h ?? 250; return `<g transform="${S(p)}"><path d="M -80 ${-h / 2} V -2000 M 80 ${-h / 2} V -2000" stroke="#1B1E33" stroke-width="8"/><rect x="${-w / 2 - 16}" y="${-h / 2 - 16}" width="${w + 32}" height="${h + 32}" rx="14" fill="#1B1E33"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#0A1B33"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#wGrid)" opacity="0.4"/>
      ${p.l1 ? T(p.l1, p.size ?? 34, p.c1 ?? '#7CC2FF', 0, -h / 2 + 50) : ''}${p.l2 ? T(p.l2, p.size ?? 34, YEL, 0, -h / 2 + 110) : ''}${(p.ok ?? 0) > 0 ? `<g transform="translate(0 ${h / 2 - 50}) scale(${f(p.ok)})"><circle r="30" fill="#2E9E5B"/><path d="M -14 0 L -4 10 L 16 -12" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : ''}</g>`; },
    // the maze: belts crossing at several heights and angles, each carrying parcels at its own pace (background)
    beltmaze(p) {
      const gt = p.gt ?? 0;
      const segs = [[-2600, -1100, 2600, -1100, 120], [2600, -820, -2600, -760, 90], [-2600, -560, 600, -560, 150], [600, -560, 1400, -260, 150], [-2600, -300, 2600, -300, 110], [2600, -60, -400, -60, 130], [-1800, -1100, -800, -560, 100], [1200, -1100, 2000, -820, 80]];
      const belt = ([x0, y0, x1, y1, sp], si) => { const L = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI, n = Math.floor(L / 260);
        const parcels = Array.from({ length: n }, (_, i) => { const d = ((i * 260 + gt * sp) % L + L) % L; return rnd(i + si * 30) > 0.3 ? `<g transform="translate(${f(d)} 0) rotate(${f(-a)}) scale(0.62)">${PROPS.parcel({ v: (i + si) % 5 })}</g>` : ''; }).join('');
        const legs = Array.from({ length: Math.floor(L / 500) + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / Math.max(1, Math.floor(L / 500)), y = y0 + (y1 - y0) * i / Math.max(1, Math.floor(L / 500)); return `<rect x="${f(x - 7)}" y="${f(y + 20)}" width="14" height="${f(-y - 20)}" fill="#20243C"/>`; }).join('');
        return `${legs}<g transform="translate(${x0} ${y0}) rotate(${f(a)})"><rect x="0" y="0" width="${f(L)}" height="24" fill="#4A5270"/><rect x="0" y="24" width="${f(L)}" height="8" fill="#2A2E44"/><rect x="0" y="-46" width="${f(L)}" height="6" fill="#E6C14A" opacity="0.5"/>${parcels}</g>`; };
      return `<g opacity="${p.op ?? 1}">${segs.map(belt).join('')}</g>`;
    },
    // a wall of identical brown boxes (rows x cols), each with its label; n hides none of them (it's the joke)
    boxwall(p) {
      const rows = p.rows ?? 8, cols = p.cols ?? 14, bw = p.bw ?? 150, bh = p.bh ?? 112;
      return `<g transform="${S(p)}">${Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => { const x = (c - cols / 2) * bw + (r % 2) * bw * 0.5, y = -(r + 1) * bh, col = ['#A47A55', '#AD835A', '#9C7550'][Math.floor(rnd(r * 31 + c) * 3)];
        return `<rect x="${x + 2}" y="${y + 2}" width="${bw - 4}" height="${bh - 4}" fill="${col}"/><rect x="${x + 2}" y="${y + 2}" width="${bw - 4}" height="8" fill="${tint(col, 0.15)}"/><rect x="${x + bw * 0.12}" y="${y + bh * 0.3}" width="${bw * 0.3}" height="${bh * 0.26}" fill="#F2EEE6"/><rect x="${x + bw * 0.12}" y="${y + bh * 0.62}" width="${bw * 0.22}" height="4" fill="#1B1E33" opacity="0.5"/>`; }).join('')).join('')}</g>`;
    },
    // ZERO's handwritten cardboard sign
    cardsign(p) { return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="-140" y="-80" width="280" height="160" rx="6" fill="#C9A27A"/><rect x="-140" y="-80" width="280" height="12" fill="#B38B62"/><path d="M -130 74 L -100 60 L -60 78" stroke="#8C6844" stroke-width="3" fill="none"/><text x="0" y="22" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${p.size ?? 58}" fill="${INK}" transform="rotate(-3)">${esc(p.txt ?? 'Great.')}</text></g>`; },
    // SYSTEM VIEW of the hub from above: the belt network as blue lines, grey dots flowing on it, scanner nodes;
    // the yellow dot is ZERO's box (prog 0..1 along its route), ZERO's own dot follows at zprog; nodes ping as it passes
    hubmap(p) {
      const gt = p.gt ?? 0;
      const route = [[-760, 300], [-420, 300], [-420, 40], [-60, 40], [-60, -220], [360, -220], [360, 80], [760, 80]];
      const net = [[[-900, -320], [900, -320]], [[-900, 200], [900, 200]], [[-600, -400], [-600, 400]], [[200, -400], [200, 400]], [[600, -400], [600, 400]], [[-900, -60], [500, -60]], [[-200, -400], [-200, 400]]];
      const len = pts => pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
      const at = (pts, k) => { let d = k * len(pts); for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d <= l) return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * d / l, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * d / l]; d -= l; } return pts[pts.length - 1]; };
      const poly = pts => pts.map(q => q.join(',')).join(' ');
      const flow = net.map((pts, ni) => Array.from({ length: 10 }, (_, i) => { const q = at(pts, fr(gt * 0.08 * (ni % 2 ? -1 : 1) + i / 10 + ni * 0.13)); return `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="7" fill="#9AA3B5" opacity="0.7"/>`; }).join('')).join('');
      const nodesK = [0.12, 0.3, 0.5, 0.68, 0.86], prog = p.prog ?? 0;
      const nodes = nodesK.map(k => { const q = at(route, k), d = prog - k, ping = d > 0 && d < 0.08 ? d / 0.08 : 0; return `<rect x="${f(q[0] - 14)}" y="${f(q[1] - 14)}" width="28" height="28" fill="${prog >= k ? YEL : '#2A4A7A'}" stroke="#7CC2FF" stroke-width="3"/>${ping ? `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(20 + 60 * ping)}" fill="none" stroke="${YEL}" stroke-width="4" opacity="${f(1 - ping)}"/>` : ''}`; }).join('');
      const yb = at(route, prog), zp = at(route, Math.max(0, p.zprog ?? 0));
      return `<g transform="${S(p)}">${net.map(pts => `<polyline points="${poly(pts)}" fill="none" stroke="#2F5E9E" stroke-width="16" stroke-linecap="round"/>`).join('')}<polyline points="${poly(route)}" fill="none" stroke="#4FA8FF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="${poly(route)}" fill="none" stroke="${YEL}" stroke-width="6" stroke-dasharray="${f(len(route) * prog)} 99999" stroke-linecap="round" stroke-linejoin="round"/>${flow}${nodes}
        <circle cx="${f(yb[0])}" cy="${f(yb[1])}" r="${f(22 + 3 * Math.sin(gt * 8))}" fill="${YEL}"/><circle cx="${f(yb[0])}" cy="${f(yb[1])}" r="60" fill="url(#wPix)"/>
        ${p.zprog != null ? `<g transform="translate(${f(zp[0])} ${f(zp[1])})"><circle r="15" fill="${WHITE}" stroke="${INK}" stroke-width="5"/><path d="M -4 -15 l 4 -8 l 4 8" fill="${WHITE}" stroke="${INK}" stroke-width="3"/></g>` : ''}</g>`;
    },
    // the break room: lockers, a humming vending machine, an inside window onto the sort floor (belts moving), a
    // clock, a notice board with flyers, warm light; floor at y = 0
    breakroom(p) {
      const gt = p.gt ?? 0, wall = p.wall ?? '#3A3348';
      const lockers = Array.from({ length: 6 }, (_, i) => `<g transform="translate(${-1500 + i * 130} 0)"><rect x="0" y="-760" width="124" height="760" fill="#4E5A78"/><rect x="0" y="-760" width="124" height="10" fill="#5E6A88"/>${[0, 1, 2, 3, 4].map(j => `<rect x="20" y="${-720 + j * 12}" width="84" height="5" fill="#3A445E"/>`).join('')}<rect x="96" y="-420" width="10" height="40" rx="4" fill="#9AA3B5"/></g>`).join('');
      const winOff = ((gt * 140) % 260 + 260) % 260;
      const win = `<g transform="translate(160 -560)"><rect x="-360" y="-200" width="720" height="380" fill="#14172A"/><rect x="-360" y="-200" width="720" height="380" fill="url(#wSodium)" opacity="0.35"/><rect x="-360" y="40" width="720" height="18" fill="#4A5270"/>${Array.from({ length: 5 }, (_, i) => `<g transform="translate(${f(-460 + i * 260 + winOff)} 40) scale(0.45)">${PROPS.parcel({ v: i })}</g>`).join('')}${[-200, 60, 260].map((x, i) => `<g transform="translate(${x} 170) scale(0.45)">${PROPS.person({ gt, pose: 'walk', shirt: '#4C5E7C', vest: '#E8823C', seed: i + 4, speed: 0.6 })}</g>`).join('')}<rect x="-376" y="-216" width="752" height="412" fill="none" stroke="#2A2638" stroke-width="32"/><path d="M -300 -180 L -200 -180 L -340 120 Z" fill="#FFFFFF" opacity="0.05"/></g>`;
      const vend = `<g transform="translate(1250 0)"><rect x="-150" y="-820" width="300" height="820" rx="10" fill="#7A2E3A"/><rect x="-120" y="-780" width="170" height="560" fill="#1E2236"/><rect x="-120" y="-780" width="170" height="560" fill="#BFE3FF" opacity="${f(0.16 + 0.03 * Math.sin(gt * 40))}"/>${Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 }, (_, c) => `<rect x="${-110 + c * 40}" y="${-760 + r * 108}" width="30" height="60" rx="5" fill="${['#E85B4E', '#4FA8FF', '#7BC6A4', '#E6C14A'][(r + c) % 4]}" opacity="0.85"/>`).join('')).join('')}<rect x="70" y="-700" width="60" height="120" rx="6" fill="#2A1E26"/><rect x="-120" y="-180" width="170" height="70" fill="#14161F"/><ellipse cx="-30" cy="-500" rx="300" ry="420" fill="url(#wCool)" opacity="0.35"/></g>`;
      const board = `<g transform="translate(-480 -640)"><rect x="-170" y="-130" width="340" height="250" fill="#8C6844"/><rect x="-160" y="-120" width="320" height="230" fill="#B38B62"/><g transform="translate(-80 -30) rotate(-4)"><rect x="-56" y="-70" width="112" height="140" fill="#F2EEE6"/><g transform="translate(0 -20) scale(0.5)">${icons.cap('#2B3A67')}</g><rect x="-40" y="30" width="80" height="6" fill="#2B3A67"/><rect x="-40" y="44" width="60" height="5" fill="#9AA3B5"/></g><g transform="translate(70 -10) rotate(5)"><rect x="-60" y="-60" width="120" height="110" fill="#FFF4D6"/><rect x="-44" y="-40" width="88" height="6" fill="#C9555A"/><rect x="-44" y="-24" width="70" height="5" fill="#9AA3B5"/><rect x="-44" y="-12" width="80" height="5" fill="#9AA3B5"/></g><circle cx="-80" cy="-96" r="6" fill="#E85B4E"/><circle cx="70" cy="-66" r="6" fill="#4FA8FF"/></g>`;
      return `<g><rect x="-4000" y="-3000" width="8000" height="3000" fill="${wall}"/><rect x="-4000" y="-300" width="8000" height="300" fill="${shade(wall, 0.15)}"/>${lockers}${board}${win}${vend}
        <g transform="translate(-160 -880) scale(0.7)">${PROPS.wallclock({ gt, h: p.h ?? 2, m: p.m ?? 13, s0: 0 })}</g>
        <rect x="-4000" y="0" width="8000" height="2000" fill="#2E2A3A"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${-4000 + i * 280}" y="0" width="4" height="900" fill="#3A3548" transform="skewX(${(i - 15) * 2})"/>`).join('')}<rect x="-4000" y="0" width="8000" height="900" fill="url(#wFloorFade)" opacity="0.5"/>
        <ellipse cx="0" cy="-500" rx="1300" ry="700" fill="url(#wWarm)" opacity="0.35"/></g>`;
    },
    // an open book (held with both hands, or on a lap)
    book(p) { return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><path d="M -70 -6 Q -36 -20 0 -8 Q 36 -20 70 -6 L 70 40 Q 36 28 0 40 Q -36 28 -70 40 Z" fill="${p.cover ?? '#2B3A67'}"/><path d="M -64 -10 Q -32 -22 0 -12 L 0 34 Q -32 24 -64 34 Z" fill="#F2EEE6"/><path d="M 64 -10 Q 32 -22 0 -12 L 0 34 Q 32 24 64 34 Z" fill="#E9E4DA"/>${[0, 1, 2, 3].map(i => `<path d="M -54 ${-6 + i * 9} Q -30 ${-14 + i * 9} -8 ${-6 + i * 9}" stroke="#9AA3B5" stroke-width="2" fill="none"/>`).join('')}</g>`; },
    // a platform scale under a container; the dial's needle (a, degrees) swings with a damped wobble from since
    floorscale(p) { const gt = p.gt ?? 0, a = (p.a ?? 0) + (p.since != null && gt > p.since ? 30 * Math.exp(-(gt - p.since) * 3) * Math.sin((gt - p.since) * 14) : 0); return `<g transform="${S(p)}"><rect x="-260" y="-24" width="520" height="24" fill="#5C6684"/><rect x="-270" y="-30" width="540" height="10" fill="#7A8299"/><g transform="translate(330 -220)"><rect x="-8" y="0" width="16" height="200" fill="#4A5270"/><circle r="80" fill="#1B1E33"/><circle r="66" fill="#F2EEE6"/>${Array.from({ length: 9 }, (_, i) => `<path d="M 0 -60 V -48" stroke="#1B1E33" stroke-width="4" transform="rotate(${-120 + i * 30})"/>`).join('')}<g transform="rotate(${f(-120 + a)})"><path d="M -4 0 L 0 -56 L 4 0 Z" fill="#C63D46"/></g><circle r="8" fill="#1B1E33"/></g></g>`; },
    // a chute sloping down from (0,0) to (dx,dy), side walls, parcels sliding down it (speed), a city plate at the top
    chute(p) {
      const gt = p.gt ?? 0, dx = p.dx ?? 600, dy = p.dy ?? 500, L = Math.hypot(dx, dy), a = Math.atan2(dy, dx) * 180 / Math.PI, sp = p.speed ?? 220;
      const parcels = p.empty ? '' : Array.from({ length: Math.floor(L / 220) }, (_, i) => { const d = ((i * 220 + gt * sp) % L + L) % L; return `<g transform="translate(${f(d)} -4) scale(0.6)" opacity="${f(Math.min(1, (L - d) / 60))}">${PROPS.parcel({ v: (i + (p.seed ?? 0)) % 5 })}</g>`; }).join('');
      return `<g><g transform="rotate(${f(a)})"><rect x="0" y="0" width="${f(L)}" height="30" fill="#8C93AA"/><rect x="0" y="-70" width="${f(L)}" height="16" fill="#6C7590"/>${parcels}<rect x="0" y="-74" width="${f(L)}" height="104" fill="#9FC4D8" opacity="0.08"/></g>
        ${p.txt ? `<g transform="translate(40 -150)"><rect x="-80" y="-34" width="160" height="68" rx="8" fill="#1B1E33"/><rect x="-72" y="-26" width="144" height="52" rx="5" fill="none" stroke="${p.tc ?? '#7CC2FF'}" stroke-width="3"/>${T(p.txt, 34, p.tc ?? '#7CC2FF', 0, -4, 'letter-spacing="3"')}</g>` : ''}</g>`;
    },

    // ===== video 001, part 3: the money, the problem, the big picture, the delivery =====
    // fifty cities on a night-blue page: mesh 0..1 draws the point-to-point routes (coral tangle, 1,225 of them),
    // star 0..1 draws the hub routes (yellow, fifty), A and B are ZERO's city and mom's (direct 0..1 joins them)
    netdiagram(p) {
      const gt = p.gt ?? 0, n = 50, mesh = p.mesh ?? 0, star = p.star ?? 0;
      const pts = Array.from({ length: n }, (_, i) => { const a = rnd(i * 3 + 1) * Math.PI * 2, r = 0.25 + 0.75 * Math.sqrt(rnd(i * 5 + 2)); return [f(Math.cos(a) * r * 760), f(Math.sin(a) * r * 360)]; });
      pts[0] = [-700, 40]; pts[1] = [700, -60];
      let m = '';
      if (mesh > 0) { const tot = n * (n - 1) / 2, k = Math.round(tot * mesh); let c = 0; for (let i = 0; i < n && c < k; i++) for (let j = i + 1; j < n && c < k; j++, c++) m += `M ${pts[i][0]} ${pts[i][1]} L ${pts[j][0]} ${pts[j][1]} `; }
      const hubs = star > 0 ? pts.slice(0, Math.round(n * star)).map(q => `M 0 0 L ${q[0]} ${q[1]}`).join(' ') : '';
      return `<g transform="${S(p)}">${m ? `<path d="${m}" stroke="#FF6B5B" stroke-width="1.6" opacity="${f(0.35 * (p.mop ?? 1))}" fill="none"/>` : ''}
        ${hubs ? `<path d="${hubs}" stroke="${YEL}" stroke-width="4" opacity="0.85" fill="none"/>` : ''}${(p.direct ?? 0) > 0 ? `<path d="M ${pts[0][0]} ${pts[0][1]} L ${f(pts[0][0] + (pts[1][0] - pts[0][0]) * p.direct)} ${f(pts[0][1] + (pts[1][1] - pts[0][1]) * p.direct)}" stroke="#E6ECF5" stroke-width="6" stroke-dasharray="16 12"/>` : ''}
        ${pts.slice(2).map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="9" fill="#7CC2FF" opacity="${f(p.dots ?? 1)}"/>`).join('')}
        ${star > 0 ? `<circle r="${f(22 + 4 * Math.sin(gt * 5))}" fill="${YEL}"/><circle r="70" fill="url(#wPix)"/>` : ''}
        <g transform="translate(${pts[0][0]} ${pts[0][1]})"><circle r="16" fill="${INK}" stroke="${WHITE}" stroke-width="5"/></g>
        <g transform="translate(${pts[1][0]} ${pts[1][1]}) scale(${f(1.6 + 0.15 * Math.sin(gt * 6))})"><path d="M 0 12 C -20 -4 -12 -20 0 -9 C 12 -20 20 -4 0 12 Z" fill="${RED}"/></g></g>`;
    },
    // a plane in silhouette that fills with coins (fill 0..1); more coins rise into it from below
    coinplane(p) {
      const gt = p.gt ?? 0, fl = p.fill ?? 0, shape = 'M -700 -40 L 520 -60 Q 700 -56 720 0 Q 700 50 520 56 L -620 56 Q -700 40 -700 -40 Z M -640 -40 L -720 -260 L -600 -260 L -480 -50 Z M -120 20 L -420 210 L -300 210 L 160 20 Z';
      const coins = Array.from({ length: 260 }, (_, i) => { const x = -720 + rnd(i * 3) * 1440, y = 220 - (i / 260) * 500 + rnd(i) * 30; return i / 260 < fl ? `<g transform="translate(${f(x)} ${f(y)})"><ellipse rx="22" ry="9" fill="${AMBER}"/><ellipse rx="22" ry="9" cy="-4" fill="${YEL}"/></g>` : ''; }).join('');
      const rising = (p.rise ?? 1) > 0 ? Array.from({ length: 14 }, (_, i) => { const k = fr(gt * 0.5 + i / 14), x = -600 + rnd(i * 7) * 1200; return `<g transform="translate(${f(x)} ${f(520 - k * 420)})" opacity="${f(1 - k)}"><circle r="16" fill="${YEL}" stroke="${AMBER}" stroke-width="4"/></g>`; }).join('') : '';
      return `<g transform="${S(p)}"><defs><clipPath id="wCoinPlane"><path d="${shape}"/></clipPath></defs><path d="${shape}" fill="#13203A"/><g clip-path="url(#wCoinPlane)">${coins}</g><path d="${shape}" fill="none" stroke="#7CC2FF" stroke-width="6" stroke-linejoin="round"/>${rising}</g>`;
    },
    // the hub being built: a side elevation that rises block by block (grow 0..1), a tower crane with a swinging
    // load, coins pouring like concrete from a hopper; a year plate
    buildgrow(p) {
      const gt = p.gt ?? 0, g = p.grow ?? 0, cols = 12, rows = 4, bw = 150, bh = 110, n = Math.round(cols * rows * g);
      const blocks = Array.from({ length: n }, (_, i) => { const c = i % cols, r = Math.floor(i / cols); return `<rect x="${-cols * bw / 2 + c * bw + 3}" y="${-(r + 1) * bh + 3}" width="${bw - 6}" height="${bh - 6}" fill="${r % 2 ? '#3E4466' : '#464D72'}"/>${r === rows - 1 ? `<rect x="${-cols * bw / 2 + c * bw + 3}" y="${-(r + 1) * bh + 3}" width="${bw - 6}" height="8" fill="#FFB25C" opacity="0.6"/>` : ''}`; }).join('');
      const sw = Math.sin(gt * 1.2) * 6;
      const crane = `<g transform="translate(${cols * bw / 2 - 120} 0)"><rect x="-14" y="-820" width="28" height="820" fill="#D9A43A"/>${Array.from({ length: 16 }, (_, i) => `<path d="M -14 ${-i * 50} L 14 ${-i * 50 - 50}" stroke="#A97F2A" stroke-width="5"/>`).join('')}<rect x="-700" y="-850" width="900" height="26" fill="#D9A43A"/><rect x="120" y="-880" width="80" height="60" fill="#5C6684"/><g transform="translate(-520 -824) rotate(${f(sw)})"><path d="M 0 0 V 300" stroke="#1B1E33" stroke-width="4"/><rect x="-60" y="300" width="120" height="70" fill="#464D72"/></g></g>`;
      const pour = (p.pour ?? 1) > 0 ? Array.from({ length: 18 }, (_, i) => { const k = fr(gt * 0.9 + i / 18); return `<circle cx="${f(-300 + Math.sin(i * 2.1) * 30)}" cy="${f(-900 + k * (900 - rows * bh * g))}" r="12" fill="${YEL}" stroke="${AMBER}" stroke-width="3" opacity="${f(1 - k * 0.4)}"/>`; }).join('') + `<path d="M -380 -1000 L -220 -1000 L -260 -920 L -340 -920 Z" fill="#5C6684"/>` : '';
      return `<g transform="${S(p)}"><rect x="-4000" y="0" width="8000" height="2000" fill="#23273B"/><rect x="${-cols * bw / 2 - 20}" y="-6" width="${cols * bw + 40}" height="10" fill="#3A3F5C"/>${blocks}${crane}${pour}
        ${p.year ? `<g transform="translate(${-cols * bw / 2 + 140} 80)"><rect x="-110" y="-38" width="220" height="76" rx="8" fill="#1B1E33"/><rect x="-102" y="-30" width="204" height="60" rx="5" fill="none" stroke="${YEL}" stroke-width="3"/>${T(p.year, 40, YEL, 0, -4, 'letter-spacing="4"')}</g>` : ''}</g>`;
    },
    // the night as the product: the sky goes from dusk to night to dawn (prog 0..1), the moon crosses, and a clock
    // ring above the hub sweeps from 6 PM to 6 AM; icons mark evening pickup, the sort, the morning delivery
    skyclock(p) {
      const gt = p.gt ?? 0, k = p.prog ?? 0;
      const sky = k < 0.5 ? mix('#3A2E5C', '#070A1C', k * 2) : mix('#070A1C', '#4A3E6C', (k - 0.5) * 2), low = k < 0.5 ? mix('#E8825A', '#1E2348', k * 2) : mix('#1E2348', '#F0A86A', (k - 0.5) * 2);
      const ma = Math.PI * (1 - k), mx = Math.cos(ma) * 900, my = -Math.sin(ma) * 600 - 100;
      const hand = -90 + k * 360, ic = (a, name, on) => { const r = 330, x = Math.cos(a * Math.PI / 180) * r, y = Math.sin(a * Math.PI / 180) * r; return `<g transform="translate(${f(x)} ${f(-560 + y)}) scale(0.7)" opacity="${on ? 1 : 0.35}">${icons[name](on ? YEL : '#9AA3B5')}</g>`; };
      return `<g><defs><linearGradient id="wSkyClock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${low}"/></linearGradient></defs><rect x="-4000" y="-3000" width="8000" height="3000" fill="url(#wSkyClock)"/>
        <g transform="translate(${f(mx)} ${f(my)})"><circle r="60" fill="#F4EEDC"/><circle cx="22" cy="-14" r="52" fill="${sky}" opacity="0.92"/></g>
        <g transform="translate(0 -560)"><circle r="260" fill="none" stroke="#E6ECF5" stroke-width="10" opacity="0.5"/>${Array.from({ length: 12 }, (_, i) => `<path d="M 0 -240 V -210" stroke="#E6ECF5" stroke-width="8" opacity="0.6" transform="rotate(${i * 30})"/>`).join('')}<path d="M 0 0 L 0 -200" stroke="${YEL}" stroke-width="14" stroke-linecap="round" transform="rotate(${f(hand + 90)})"/><circle r="16" fill="${YEL}"/></g>
        ${ic(-90, 'truck', k < 0.3)}${ic(90, 'hub', k >= 0.3 && k < 0.75)}${ic(200, 'house', k >= 0.75)}
        <rect x="-4000" y="0" width="8000" height="2000" fill="#141729"/><rect x="-1500" y="-150" width="2500" height="150" fill="#141830"/>${Array.from({ length: 80 }, (_, i) => rnd(i * 7) > 0.45 ? `<rect x="${-1490 + i * 31}" y="-100" width="14" height="12" fill="#FFCF8A" opacity="0.55"/>` : '').join('')}</g>`;
    },
    // a lightning storm over the ramp: bolts on their own schedule (or flash 0..1 keyed), a coral rim on the clouds
    lightning(p) {
      const gt = p.gt ?? 0, auto = fr(gt / 2.7), fl = Math.max(p.flash ?? 0, auto < 0.05 ? 1 - auto / 0.05 : 0), x = (rnd(Math.floor(gt / 2.7)) - 0.5) * 2400;
      const clouds = Array.from({ length: 9 }, (_, i) => `<ellipse cx="${-2000 + i * 500 + Math.sin(gt * 0.2 + i) * 40}" cy="${-700 + (i % 3) * 60}" rx="420" ry="160" fill="#14172A" opacity="0.9"/>`).join('');
      return `<g>${clouds}${fl > 0.05 ? `<path d="M ${f(x)} -760 l -60 220 l 70 0 l -90 260 l 40 -10 l -80 260" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="${f(fl)}"/><rect x="-4000" y="-3000" width="8000" height="5000" fill="#DDE6FF" opacity="${f(0.35 * fl)}"/>` : ''}
        <rect x="-4000" y="-3000" width="8000" height="5000" fill="#FF5A4E" opacity="${f(p.coral ?? 0)}" style="mix-blend-mode:multiply"/></g>`;
    },
    // the remote reading desk: a person seen from behind with a headset at a screen that shows the photo of the
    // wet label; a countdown ring (cd 0..1 left) with its number n; zip: what the person typed, ok turns it green
    telecode(p) {
      const cd = p.cd ?? 1, ok = p.ok ?? 0, r = 90;
      const arc = cd > 0 ? `<path d="M 0 ${-r} A ${r} ${r} 0 ${cd > 0.5 ? 1 : 0} 1 ${f(Math.sin(cd * 2 * Math.PI) * r)} ${f(-Math.cos(cd * 2 * Math.PI) * r)}" fill="none" stroke="${cd < 0.35 ? CORAL : YEL}" stroke-width="16" stroke-linecap="round"/>` : '';
      return `<g transform="${S(p)}"><rect x="-4000" y="-3000" width="8000" height="3000" fill="#1A1C2E"/><rect x="-4000" y="0" width="8000" height="2000" fill="#22263A"/>
        <ellipse cx="0" cy="-420" rx="900" ry="520" fill="url(#wCool)" opacity="0.45"/>
        <g transform="translate(0 -420)"><rect x="-470" y="-290" width="940" height="560" rx="20" fill="#0B0D18"/><rect x="-440" y="-260" width="880" height="500" fill="#E9EEF5"/><g transform="translate(-130 -10) scale(0.62)">${PROPS.biglabel({ wet: p.wet ?? 0.7, gt: p.gt })}</g>
          <g transform="translate(300 -110)"><circle r="${r}" fill="none" stroke="#C9CED8" stroke-width="16"/>${arc}${T(String(p.n ?? 10), 84, cd < 0.35 ? CORAL : '#1B1E33', 0, -6)}</g>
          <g transform="translate(300 110)"><rect x="-130" y="-46" width="260" height="92" rx="10" fill="${ok > 0 ? '#2E9E5B' : '#FFFFFF'}" stroke="#9AA3B5" stroke-width="4"/>${T(p.zip ?? '', 54, ok > 0 ? '#FFFFFF' : '#1B1E33', 0, -6, 'letter-spacing="6"')}</g>
          <rect x="-40" y="270" width="80" height="120" fill="#0B0D18"/></g>
        <rect x="-900" y="-30" width="1600" height="40" rx="8" fill="#2E2A3A"/>
        <g transform="translate(-600 360) scale(2.4)">${PROPS.person({ gt: p.gt, pose: 'type', shirt: '#3E4A66', skin: '#7A5440', hair: '#1E1820', seed: 8, eyes: false, flip: false })}</g>
        <g transform="translate(-626 -90)"><path d="M -50 -10 Q 0 -80 50 -10" fill="none" stroke="#1B1E33" stroke-width="10"/><rect x="40" y="-20" width="22" height="40" rx="8" fill="#1B1E33"/></g></g>`;
    },
    // a stylized world at night (equirectangular, 1000 x 500 at s 1): continents in system blue, hubs (Louisville,
    // Memphis, Leipzig) that light up (lou/mem/lei 0..1) with their own arcs; dens multiplies the arcs (December);
    // breath -1..1 pulls the planes in toward the hubs (-1) or out to the cities (1); snow 0..1
    worldmap(p) {
      const gt = p.gt ?? 0, P_ = (lon, lat) => [f((lon + 180) / 360 * 1000 - 500), f((90 - lat) / 180 * 500 - 250)];
      const land = [
        [[-168, 66], [-140, 70], [-95, 72], [-80, 68], [-60, 60], [-55, 50], [-67, 45], [-75, 38], [-81, 31], [-80, 25], [-90, 30], [-97, 26], [-105, 22], [-110, 23], [-117, 32], [-124, 40], [-125, 48], [-135, 58], [-150, 60], [-165, 62]],
        [[-55, 82], [-25, 82], [-20, 70], [-45, 60], [-55, 68]],
        [[-80, 10], [-62, 10], [-50, 0], [-35, -7], [-40, -22], [-55, -35], [-68, -55], [-75, -45], [-72, -20], [-81, -5]],
        [[-10, 36], [-9, 44], [-2, 49], [5, 53], [9, 57], [5, 62], [15, 70], [30, 70], [40, 65], [40, 45], [28, 41], [20, 40], [15, 38], [10, 44], [3, 42]],
        [[-5, 50], [1, 51], [-2, 57], [-6, 58], [-5, 54]],
        [[-17, 21], [-5, 36], [10, 37], [32, 31], [43, 12], [51, 12], [40, -15], [35, -25], [20, -35], [12, -18], [9, 4], [-8, 5], [-17, 14]],
        [[40, 45], [40, 65], [60, 70], [100, 77], [140, 72], [170, 66], [160, 58], [140, 50], [130, 35], [120, 22], [108, 10], [100, 2], [95, 15], [80, 8], [72, 20], [60, 25], [50, 28], [35, 32], [28, 41]],
        [[114, -22], [130, -12], [142, -11], [153, -27], [146, -39], [135, -35], [115, -34]]];
      const hubs = [['lou', -85.7, 38.2, 'LOUISVILLE', '#FFC93C'], ['mem', -90.0, 35.1, 'MEMPHIS', '#B48CFF'], ['lei', 12.4, 51.3, 'LEIPZIG', '#FF9E45']];
      const dens = p.dens ?? 1, br = p.breath ?? 0;
      const arcs = hubs.map(([key, lon, lat, , col], hi) => { const on = p[key] ?? 0; if (on <= 0) return ''; const H = P_(lon, lat), m = Math.round(14 * dens * on);
        return Array.from({ length: m }, (_, i) => { const cl = hi === 2 ? [-10 + rnd(i * 3 + hi) * 50, 36 + rnd(i * 5 + hi) * 24] : [-122 + rnd(i * 3 + hi) * 52, 27 + rnd(i * 5 + hi) * 20]; const C = P_(cl[0], cl[1]), c = [(H[0] + C[0]) / 2, Math.min(H[1], C[1]) - 18];
          const kk = br !== 0 ? (br > 0 ? br : 1 + br) : fr(gt * 0.25 + rnd(i + hi * 50)), t = br < 0 ? 1 - kk : kk, q = [(1 - t) ** 2 * H[0] + 2 * (1 - t) * t * c[0] + t * t * C[0], (1 - t) ** 2 * H[1] + 2 * (1 - t) * t * c[1] + t * t * C[1]];
          return `<path d="M ${H[0]} ${H[1]} Q ${f(c[0])} ${f(c[1])} ${C[0]} ${C[1]}" stroke="${col}" stroke-width="0.8" fill="none" opacity="0.6"/><circle cx="${f(q[0])}" cy="${f(q[1])}" r="1.6" fill="#FFFFFF"/>`; }).join(''); }).join('');
      const dots = hubs.map(([key, lon, lat, name, col]) => { const on = p[key] ?? 0; if (on <= 0) return ''; const H = P_(lon, lat), dy = key === 'mem' ? 12 : -10; return `<circle cx="${H[0]}" cy="${H[1]}" r="${f(3 + 1.5 * on)}" fill="${col}"/><circle cx="${H[0]}" cy="${H[1]}" r="${f(4 + 10 * fr(gt * 0.8))}" fill="none" stroke="${col}" stroke-width="0.8" opacity="${f(1 - fr(gt * 0.8))}"/>${(p.labels ?? 1) ? `<g opacity="${f(on)}">${T(name, 7, col, H[0] + (key === 'lei' ? 0 : key === 'mem' ? -26 : 24), H[1] + dy, 'letter-spacing="0.5"')}</g>` : ''}`; }).join('');
      const snow = (p.snow ?? 0) > 0 ? Array.from({ length: 120 }, (_, i) => { const k = fr(gt * 0.06 * (0.5 + rnd(i)) + rnd(i * 7)); return `<circle cx="${f(-500 + rnd(i * 3) * 1000 + Math.sin(gt + i) * 4)}" cy="${f(-250 + k * 500)}" r="${f(0.8 + rnd(i) * 1.2)}" fill="#FFFFFF" opacity="${f(0.7 * p.snow)}"/>`; }).join('') : '';
      return `<g transform="${S(p)}"><rect x="-600" y="-300" width="1200" height="600" fill="#060B1A"/>${land.map(pl => `<polygon points="${pl.map(q => P_(q[0], q[1]).join(',')).join(' ')}" fill="#12284A" stroke="#2F5E9E" stroke-width="1.2" stroke-linejoin="round"/>`).join('')}
        ${Array.from({ length: 160 }, (_, i) => { const pl = land[[0, 0, 0, 3, 3, 6, 6, 6][i % 8]], a = pl[Math.floor(rnd(i) * pl.length)], b = pl[Math.floor(rnd(i * 3) * pl.length)], q = P_(a[0] + (b[0] - a[0]) * rnd(i * 5) * 0.6, a[1] + (b[1] - a[1]) * rnd(i * 7) * 0.6); return `<circle cx="${q[0]}" cy="${q[1]}" r="0.9" fill="#FFCF8A" opacity="0.5"/>`; }).join('')}
        ${arcs}${dots}${snow}</g>`;
    },
    // a neighbourhood at dawn from above: blocks with houses, trees, the street grid; the van follows its route
    // (prog 0..1) and only ever turns right; each right turn gets a badge as it passes; warm light from the east;
    // rider: ZERO sits on the van's roof
    neighborhood(p) {
      const gt = p.gt ?? 0, k = p.prog ?? 0, B = 420, S2 = 120;
      const route = [[-1100, -270], [-270, -270], [-270, 270], [-810, 270], [-810, 810], [270, 810]].map(([x, y]) => [x, y]);
      const len = route.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - route[i][0], q[1] - route[i][1]), 0);
      let d = k * len, pos = route[0], ang = 0, seg = 0;
      for (let i = 1; i < route.length; i++) { const l = Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]); ang = Math.atan2(route[i][1] - route[i - 1][1], route[i][0] - route[i - 1][0]) * 180 / Math.PI; if (d <= l) { pos = [route[i - 1][0] + (route[i][0] - route[i - 1][0]) * d / l, route[i - 1][1] + (route[i][1] - route[i - 1][1]) * d / l]; seg = i; break; } d -= l; pos = route[i]; seg = i; }
      const blocks = [];
      for (let bx = -4; bx <= 3; bx++) for (let by = -3; by <= 3; by++) { const x = bx * (B + S2) + S2 / 2 - 0, y = by * (B + S2) + S2 / 2 + 0;
        blocks.push(`<rect x="${x}" y="${y}" width="${B}" height="${B}" fill="#2E4A3E"/>${[0, 1, 2, 3].map(h => { const hx = x + 40 + (h % 2) * 210, hy = y + 40 + Math.floor(h / 2) * 210, c = ['#C9555A', '#5C6684', '#8C6844', '#4E7A8C'][Math.floor(rnd(bx * 31 + by * 7 + h) * 4)]; return `<rect x="${hx + 8}" y="${hy + 10}" width="130" height="110" fill="#000" opacity="0.25"/><rect x="${hx}" y="${hy}" width="130" height="110" fill="${c}"/><path d="M ${hx} ${hy + 55} H ${hx + 130}" stroke="${shade(c, 0.25)}" stroke-width="6"/>`; }).join('')}${rnd(bx * 13 + by) > 0.4 ? `<circle cx="${x + 190}" cy="${y + 190}" r="34" fill="#3F7A5E"/>` : ''}`); }
      const badges = route.slice(1, -1).map((q, i) => i + 1 < seg ? `<g transform="translate(${q[0] + 60} ${q[1] - 60})"><circle r="36" fill="${YEL}"/><path d="M -12 14 V -4 Q -12 -12 -4 -12 H 12 M 4 -20 L 12 -12 L 4 -4" stroke="#1B1E33" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : '').join('');
      return `<g transform="${S(p)}"><rect x="-6000" y="-6000" width="12000" height="12000" fill="#3A3F5C"/>${blocks.join('')}
        <polyline points="${route.map(q => q.join(',')).join(' ')}" fill="none" stroke="${YEL}" stroke-width="10" stroke-dasharray="26 18" opacity="0.8"/>${badges}
        <g transform="translate(${f(pos[0])} ${f(pos[1])}) rotate(${f(ang)})"><rect x="-70" y="-38" width="150" height="76" rx="12" fill="#000" opacity="0.3" transform="translate(8 10)"/><rect x="-70" y="-38" width="150" height="76" rx="12" fill="#4A5270"/><rect x="40" y="-34" width="34" height="68" rx="8" fill="#1B1E33"/><rect x="-60" y="-28" width="90" height="56" rx="6" fill="#5C6684"/>${p.rider ? `<g transform="rotate(90) scale(0.42)">${PROPS.zerotop({ r: 0, look: p.look ?? 0 })}</g>` : ''}</g>
        <rect x="-6000" y="-6000" width="12000" height="12000" fill="url(#wWarm)" opacity="${f(0.25 + 0.15 * Math.sin(gt * 0.3))}"/></g>`;
    },
    // mom's front door in the morning: siding, a window with a lamp on, a porch light, the door (open 0..1 shows
    // only warm light, never her), a doormat, a plant; the step at y = 0
    doorstep(p) {
      const open = p.open ?? 0, c = p.wall ?? '#7A8CA8';
      return `<g><rect x="-4000" y="-3000" width="8000" height="3000" fill="${c}"/>${Array.from({ length: 70 }, (_, i) => `<rect x="-4000" y="${-3000 + i * 44}" width="8000" height="4" fill="${shade(c, 0.12)}"/>`).join('')}
        <g transform="translate(-620 -560)"><rect x="-180" y="-160" width="360" height="300" fill="#2A2638"/><rect x="-166" y="-146" width="332" height="272" fill="#FFE2A6" opacity="0.8"/><path d="M -166 -146 Q -60 -40 -100 126 L -166 126 Z M 166 -146 Q 60 -40 100 126 L 166 126 Z" fill="#C9555A"/><rect x="-190" y="130" width="380" height="20" fill="${tint(c, 0.2)}"/></g>
        <rect x="-230" y="-700" width="460" height="700" fill="${tint(c, 0.25)}"/><rect x="-180" y="-660" width="360" height="660" fill="#2A1E2E"/>
        <rect x="-180" y="-660" width="${f(360 * open)}" height="660" fill="#FFE2A6"/><ellipse cx="0" cy="40" rx="${f(40 + 300 * open)}" ry="40" fill="url(#wWarm)" opacity="${f(open)}"/>
        <g transform="translate(${f(-180 + 360 * open)} 0) scale(${f(1 - open)} 1)"><rect x="0" y="-660" width="360" height="660" fill="#3D6B58"/><rect x="40" y="-620" width="120" height="240" rx="6" fill="${shade('#3D6B58', 0.15)}"/><rect x="200" y="-620" width="120" height="240" rx="6" fill="${shade('#3D6B58', 0.15)}"/><rect x="40" y="-340" width="280" height="280" rx="6" fill="${shade('#3D6B58', 0.15)}"/><circle cx="320" cy="-330" r="14" fill="#E6C14A"/></g>
        <g transform="translate(320 -520)"><rect x="-30" y="-50" width="60" height="90" rx="10" fill="#1B1E33"/><rect x="-20" y="-36" width="40" height="60" rx="6" fill="#FFE7A0"/><circle cy="-6" r="90" fill="url(#wWarm)" opacity="0.8"/></g>
        <rect x="-4000" y="0" width="8000" height="2000" fill="#6B6F7A"/><rect x="-400" y="0" width="800" height="40" fill="#8C909A"/>
        <path d="M -220 40 L 220 40 L 260 110 L -260 110 Z" fill="#7A4A3A"/>
        <g transform="translate(560 0) scale(1.3)">${PROPS.potplant({ gt: p.gt, seed: 2, color: '#3F7A5E' })}</g>
        <ellipse cx="400" cy="-300" rx="1200" ry="900" fill="url(#wWarm)" opacity="0.4"/></g>`;
    },
    // a small birthday card tucked against the box
    bdaycard(p) { return `<g transform="${S(p)} rotate(${p.tilt ?? -8})"><rect x="-70" y="-50" width="140" height="100" rx="6" fill="#FBF8F1"/><rect x="-70" y="-50" width="140" height="100" rx="6" fill="none" stroke="#C9555A" stroke-width="4"/><text x="0" y="-4" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="22" fill="#C9555A">Happy</text><text x="0" y="24" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="22" fill="#C9555A">B-day</text></g>`; },
    // ---------- ZeroOpen (docs/zeroopen.md) ----------
    // a small screen standing on a counter (or hung on a wall, hang: true): up to three lines; c2 colours line 2,
    // alert 0..1 pulses a ring around it so the eye goes there before the narrator says anything
    screen(p) {
      const w = p.w ?? 300, h = p.h ?? 180, gt = p.gt ?? 0, al = p.alert ?? 0;
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})">${p.hang ? `<path d="M -60 ${-h / 2} V -2000 M 60 ${-h / 2} V -2000" stroke="#1B1E33" stroke-width="6"/>` : `<rect x="-14" y="${h / 2}" width="28" height="60" fill="#3A3F5C"/><rect x="-70" y="${h / 2 + 56}" width="140" height="12" rx="6" fill="#3A3F5C"/>`}
        <rect x="${-w / 2 - 12}" y="${-h / 2 - 12}" width="${w + 24}" height="${h + 24}" rx="12" fill="#1B1E33"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="${p.bg ?? '#EAF2FA'}"/>
        ${p.l1 ? T(p.l1, p.s1 ?? 24, p.c1 ?? '#5C6684', 0, -h / 2 + 40, 'letter-spacing="2"') : ''}${p.l2 ? T(p.l2, p.s2 ?? 34, p.c2 ?? '#1B1E33', 0, 0) : ''}${p.l3 ? T(p.l3, p.s3 ?? 26, p.c3 ?? '#2E9E5B', 0, h / 2 - 40) : ''}
        ${al > 0 ? `<rect x="${-w / 2 - 30}" y="${-h / 2 - 30}" width="${w + 60}" height="${h + 60}" rx="22" fill="none" stroke="${YEL}" stroke-width="${f(6 * al)}" opacity="${f(al * (0.55 + 0.45 * Math.sin(gt * 9)))}"/>` : ''}
        <ellipse cx="0" cy="0" rx="${w}" ry="${h}" fill="url(#wCool)" opacity="0.35"/></g>`;
    },
    // the hidden layer PIX opens: a panel in a wall whose two doors slide apart (open 0..1) or that clears like an
    // X-ray (style 'xray'), showing the system working behind it. kind: logistics | money | network | booking |
    // store | subscriptions | generic. The doors take the colour of the wall (wall)
    hiddenlayer(p) {
      const gt = p.gt ?? 0, w = p.w ?? 780, h = p.h ?? 520, op = p.open ?? 0, k = p.kind ?? 'generic', st = p.style ?? 'doors', LB = '#7CC2FF';
      let c = '';
      if (k === 'logistics') {
        c = [0, 1, 2].map(r => { const y = -h / 2 + 110 + r * 150, sp = [90, 140, 60][r], dir = r === 1 ? -1 : 1;
          return `<rect x="${-w / 2}" y="${y}" width="${w}" height="14" fill="#2A3352"/>${Array.from({ length: 9 }, (_, i) => { const x = -w / 2 + ((i * 130 + dir * gt * sp) % (w + 130) + w + 130) % (w + 130) - 60, v = Math.floor(rnd(i + r * 9) * 3); return `<rect x="${f(x)}" y="${y - [40, 54, 34][v]}" width="${[56, 70, 46][v]}" height="${[40, 54, 34][v]}" fill="${i === 4 && r === 1 ? YEL : ['#A47A55', '#B88B60', '#93704F'][v]}"/>`; }).join('')}
            <g transform="translate(${-w / 4 + r * w / 4} ${y - 90})"><path d="M -50 90 V 0 H 50 V 90" fill="none" stroke="#4A5270" stroke-width="10"/><circle cy="10" r="8" fill="${fr(gt * 0.9 + r * 0.3) < 0.15 ? '#E6F4FF' : LB}"/>${fr(gt * 0.9 + r * 0.3) < 0.15 ? `<path d="M 0 10 L -40 90 L 40 90 Z" fill="${LB}" opacity="0.35"/>` : ''}</g>`; }).join('')
          + `<g transform="translate(${f(-w / 2 + fr(gt * 0.12) * (w + 300) - 150)} ${h / 2 - 40}) scale(0.9)">${icons.truck('#4A5270')}</g>`
          + Array.from({ length: 4 }, (_, i) => `<path d="M ${-w / 2 + 120 + i * 170} ${-h / 2 + 60} l 22 -14 l 0 28 Z" fill="${YEL}" opacity="${f(0.4 + 0.6 * (Math.sin(gt * 4 + i) > 0))}"/>`).join('');
      } else if (k === 'money' || k === 'subscriptions') {
        const N_ = [[-w * 0.38, 0], [-w * 0.1, -h * 0.3], [-w * 0.1, h * 0.28], [w * 0.18, -h * 0.05], [w * 0.38, -h * 0.32], [w * 0.38, h * 0.3]];
        const E_ = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [1, 4], [2, 5]];
        c = E_.map(([a, b]) => `<path d="M ${f(N_[a][0])} ${f(N_[a][1])} L ${f(N_[b][0])} ${f(N_[b][1])}" stroke="#2F5E9E" stroke-width="5"/>`).join('')
          + E_.map(([a, b], i) => { const q = fr(gt * 0.5 + i / E_.length); return `<circle cx="${f(N_[a][0] + (N_[b][0] - N_[a][0]) * q)}" cy="${f(N_[a][1] + (N_[b][1] - N_[a][1]) * q)}" r="12" fill="${YEL}" stroke="${AMBER}" stroke-width="3"/>`; }).join('')
          + N_.map(([x, y], i) => `<g transform="translate(${f(x)} ${f(y)})"><circle r="38" fill="#13203A" stroke="${LB}" stroke-width="5"/><g transform="scale(0.45)">${icons[k === 'subscriptions' ? (i % 2 ? 'coin' : 'clock') : (i === 0 ? 'coin' : 'hub')](i === 0 ? YEL : LB)}</g></g>`).join('');
      } else if (k === 'network') {
        c = Array.from({ length: 12 }, (_, i) => { const x = -w / 2 + 90 + (i % 4) * (w - 180) / 3, y = -h / 2 + 100 + Math.floor(i / 4) * (h - 200) / 2; return `<rect x="${f(x - 30)}" y="${f(y - 18)}" width="60" height="36" rx="6" fill="#13203A" stroke="${LB}" stroke-width="4"/><circle cx="${f(x + 18)}" cy="${f(y)}" r="5" fill="${Math.sin(gt * 7 + i) > 0 ? '#58E08A' : '#2E5E3E'}"/>`; }).join('')
          + Array.from({ length: 16 }, (_, i) => { const r = i % 3, q = fr(gt * 0.6 + rnd(i) ), y = -h / 2 + 100 + r * (h - 200) / 2; return `<rect x="${f(-w / 2 + 60 + q * (w - 120))}" y="${f(y - 6)}" width="16" height="12" fill="${i === 3 ? YEL : LB}"/>`; }).join('');
      } else if (k === 'booking') {
        c = Array.from({ length: 6 }, (_, i) => `<rect x="${-w / 2 + 40}" y="${-h / 2 + 40 + i * 70}" width="${w * 0.45}" height="54" fill="#13203A"/>${T(['LIS 18:40', 'MAD 19:05', 'LHR 19:30', 'CDG 20:10', 'JFK 21:00', 'FRA 21:45'][i], 28, i === 2 ? YEL : '#E6ECF5', -w / 2 + 40 + w * 0.225, -h / 2 + 67 + i * 70)}`).join('')
          + Array.from({ length: 30 }, (_, i) => `<rect x="${f(w * 0.08 + (i % 6) * 54)}" y="${f(-h / 2 + 60 + Math.floor(i / 6) * 80)}" width="40" height="56" rx="8" fill="${rnd(i + Math.floor(gt * 2)) > 0.25 ? '#2F5E9E' : (i === 13 ? CORAL : '#13203A')}"/>`).join('');
      } else if (k === 'store') {
        c = Array.from({ length: 5 }, (_, i) => `<rect x="${-w / 2 + 70 + i * (w - 140) / 4 - 26}" y="${-h / 2 + 60}" width="52" height="${h - 160}" fill="#2A3352"/>`).join('')
          + `<path d="M ${-w / 2 + 30} ${h / 2 - 50} C ${-w / 4} ${-h / 2 + 20} 0 ${h / 2} ${w / 4} ${-h / 2 + 40} S ${w / 2 - 30} ${h / 2 - 60} ${w / 2 - 30} ${h / 2 - 60}" fill="none" stroke="${YEL}" stroke-width="6" stroke-dasharray="18 12" stroke-dashoffset="${f(-gt * 60)}"/>`
          + Array.from({ length: 6 }, (_, i) => `<circle cx="${f(-w / 2 + 90 + rnd(i) * (w - 180))}" cy="${f(-h / 2 + 80 + rnd(i * 3) * (h - 200))}" r="${f(26 + 10 * Math.sin(gt * 3 + i))}" fill="${CORAL}" opacity="0.35"/>`).join('');
      } else {
        c = Array.from({ length: 3 }, (_, i) => `<g transform="translate(${-w / 4 + i * w / 4} 0) rotate(${f(gt * (i % 2 ? -40 : 40))})">${Array.from({ length: 8 }, (_, j) => `<rect x="-14" y="-86" width="28" height="30" fill="#2F5E9E" transform="rotate(${j * 45})"/>`).join('')}<circle r="62" fill="#2F5E9E"/><circle r="20" fill="#13203A"/></g>`).join('')
          + Array.from({ length: 10 }, (_, i) => `<circle cx="${f(-w / 2 + fr(gt * 0.3 + i / 10) * w)}" cy="${f(h / 2 - 60)}" r="9" fill="${YEL}"/>`).join('');
      }
      const id = 'wHL' + (p.uid ?? 0), doors = st === 'doors';
      const dw = w / 2 * (1 - op), wall = p.wall ?? '#2F5260';
      return `<g transform="${S(p)}"><defs><clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath></defs>
        <rect x="${-w / 2 - 18}" y="${-h / 2 - 18}" width="${w + 36}" height="${h + 36}" fill="#1B1E33" opacity="${f(Math.min(1, op * 4))}"/>
        <g clip-path="url(#${id})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#0A1020"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#wGrid)" opacity="0.35"/>
          <g opacity="${f(doors ? 1 : op)}">${c}</g><ellipse cx="0" cy="0" rx="${w * 0.6}" ry="${h * 0.6}" fill="url(#wSys)" opacity="${f(0.5 * op)}"/>
          ${doors ? `<rect x="${-w / 2}" y="${-h / 2}" width="${f(dw)}" height="${h}" fill="${wall}"/><rect x="${f(w / 2 - dw)}" y="${-h / 2}" width="${f(dw)}" height="${h}" fill="${wall}"/>
            ${op > 0 && op < 1 ? `<rect x="${f(-w / 2 + dw - 3)}" y="${-h / 2}" width="6" height="${h}" fill="${LB}"/><rect x="${f(w / 2 - dw - 3)}" y="${-h / 2}" width="6" height="${h}" fill="${LB}"/>` : ''}` : `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${wall}" opacity="${f(1 - op)}"/><rect x="${-w / 2}" y="${f(-h / 2 + h * fr(gt * 0.8))}" width="${w}" height="10" fill="${LB}" opacity="${f(op > 0 && op < 1 ? 0.8 : 0)}"/>`}</g>
        <rect x="${-w / 2 - 18}" y="${-h / 2 - 18}" width="${w + 36}" height="${h + 36}" fill="none" stroke="${LB}" stroke-width="4" opacity="${f(op)}"/></g>`;
    },
    // a bank card (chip, stripe, last digits) and a boarding pass, objects ZERO can hold or tap
    paycard(p) { const c = p.color ?? '#2F5E9E'; return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="-86" y="-54" width="172" height="108" rx="12" fill="${c}"/><rect x="-86" y="-24" width="172" height="10" fill="${shade(c, 0.25)}" opacity="0.6"/><rect x="-66" y="-6" width="34" height="26" rx="5" fill="#E6C14A"/>${T('•••• 4021', 16, '#E6ECF5', 20, 30, 'letter-spacing="1"')}<path d="M 50 -40 a 14 14 0 1 0 0.1 0 M 66 -40 a 14 14 0 1 0 0.1 0" fill="#FFFFFF" opacity="0.35"/></g>`; },
    pass(p) { return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="-110" y="-50" width="220" height="100" rx="8" fill="#F4F1EA"/><rect x="-110" y="-50" width="220" height="26" rx="8" fill="#2F5E9E"/><path d="M 50 -50 V 50" stroke="#9AA3B5" stroke-width="3" stroke-dasharray="6 5"/>${T('BOARDING PASS', 12, '#FFFFFF', -30, -37)}${T(p.seat ?? 'SEAT 18A', 22, '#1B1E33', -30, 4)}${Array.from({ length: 10 }, (_, i) => `<rect x="${62 + i * 4}" y="-20" width="${i % 3 ? 2 : 3}" height="50" fill="#1B1E33"/>`).join('')}</g>`; },
    // the micro brand signature (1-2 s): ZERO's head, the wordmark, a yellow underline that wipes in (k 0..1);
    // flash 0..1 is the CLICK
    zumark(p) {
      const k = p.k ?? 1, fl = p.flash ?? 0;
      return `<g transform="${S(p)}">${fl > 0 ? `<circle r="${f(120 + 500 * (1 - fl))}" fill="none" stroke="${YEL}" stroke-width="${f(10 * fl)}" opacity="${f(fl)}"/>` : ''}
        <g transform="translate(-350 -2) scale(0.8)">${PROPS.logo({ s: 1 })}</g>
        <text x="-250" y="22" font-family="${FONT}" font-weight="700" font-size="72" fill="#FFFFFF" letter-spacing="3">ZERO UNDERSTANDS</text>
        <rect x="-250" y="44" width="${f(760 * k)}" height="10" rx="5" fill="${YEL}"/></g>`;
    },
    // a hard hat, held by the brim (ZERO holds it, never wears it)
    hardhat(p) { return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><path d="M -70 0 Q -70 -80 0 -84 Q 70 -80 70 0 Z" fill="${p.color ?? '#E8B83C'}"/><path d="M -8 -82 H 8 V 0 H -8 Z" fill="${shade(p.color ?? '#E8B83C', 0.15)}"/><rect x="-96" y="-8" width="192" height="18" rx="9" fill="${shade(p.color ?? '#E8B83C', 0.1)}"/></g>`; },
    // a recap photo: white frame, a night scene inside with one icon and a caption, a strip of tape
    photo(p) {
      const k = p.k ?? 'label', c = p.c ?? '#0E1A33';
      const inner = k === 'trail' ? `${[0, 1, 2, 3, 4].map(i => `<circle cx="${-90 + i * 45}" cy="${20 - Math.sin(i / 4 * Math.PI) * 40}" r="11" fill="${YEL}"/>`).join('')}` : k === 'ten' ? `<circle r="70" fill="none" stroke="${CORAL}" stroke-width="12"/>${T('10', 64, CORAL, 0, -4)}` : `<g transform="scale(1.3)">${icons[k](YEL)}</g>`;
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="-170" y="-170" width="340" height="380" fill="#000" opacity="0.3" transform="translate(10 14)"/><rect x="-170" y="-170" width="340" height="380" fill="#F4F1EA"/><rect x="-150" y="-150" width="300" height="270" fill="${c}"/><g transform="translate(0 -15)">${inner}</g>
        ${p.txt ? T(p.txt, 26, '#1B1E33', 0, 158) : ''}<rect x="-50" y="-186" width="100" height="32" fill="#E9E2D0" opacity="0.85" transform="rotate(-4)"/></g>`;
    },
  };
  Object.assign(PROPS, W);
  window.WORLD = { defs, NIGHT, icons };
})();
