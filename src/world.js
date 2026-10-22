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
  };

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
        ${route}${dots}
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
    // ZERO drew, the shipping label, a red NEXT DAY stamp (stamp 0..1), wet 0..1 (darker spots on the label)
    giftbox(p) {
      const w = p.w ?? 150, h = p.h ?? 120, c = p.color ?? YEL;
      const label = p.label ? `<g transform="translate(${-w * 0.1} ${-h * 0.52})"><rect x="-34" y="-26" width="68" height="52" fill="#FBF8F1"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${-26 + i * 6}" y="4" width="${i % 3 ? 2.5 : 4}" height="16" fill="#1B1E33"/>`).join('')}<rect x="-26" y="-18" width="34" height="4" fill="#6A6F86"/><rect x="-26" y="-10" width="44" height="4" fill="#6A6F86"/>
        ${(p.wet ?? 0) > 0 ? `<ellipse cx="6" cy="-6" rx="${f(16 * p.wet)}" ry="${f(12 * p.wet)}" fill="#7E93B0" opacity="0.45"/><ellipse cx="-14" cy="8" rx="${f(8 * p.wet)}" ry="${f(6 * p.wet)}" fill="#7E93B0" opacity="0.35"/>` : ''}</g>` : '';
      const stamp = (p.stamp ?? 0) > 0 ? `<g transform="translate(${w * 0.22} ${-h * 0.32}) rotate(-8) scale(${f(0.55 + 0.45 * p.stamp)})" opacity="${f(Math.min(1, p.stamp * 1.5))}"><rect x="-38" y="-16" width="76" height="32" rx="4" fill="none" stroke="#D63C46" stroke-width="4"/>${T('NEXT DAY', 15, '#D63C46', 0, -2)}</g>` : '';
      const bow = p.bow === false ? '' : `<rect x="${-w * 0.07}" y="${-h}" width="${w * 0.14}" height="${h}" fill="${CORAL}" opacity="0.9"/><g transform="translate(${w * 0.04} ${-h - h * 0.16})"><ellipse cx="-18" cy="-10" rx="22" ry="13" fill="${CORAL}" transform="rotate(-25 -18 -10)"/><ellipse cx="18" cy="-10" rx="22" ry="13" fill="${CORAL}" transform="rotate(25 18 -10)"/><circle r="9" fill="${shade(CORAL, 0.2)}"/></g>`;
      const heart = p.heart ? `<path transform="translate(${-w * 0.3} ${-h * 0.25}) scale(0.7)" d="M 0 12 C -20 -4 -12 -20 0 -9 C 12 -20 20 -4 0 12 Z" fill="none" stroke="#D63C46" stroke-width="4"/>` : '';
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><ellipse cx="0" cy="3" rx="${w * 0.6}" ry="8" fill="#000" opacity="0.28"/>${box(w, h, c, { tape: false })}${bow}${heart}${label}${stamp}</g>`;
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
        <path d="M ${-30} ${-86 - bob} Q -34 ${-150 - bob} 0 ${-166 - bob + breath} Q 34 ${-150 - bob} 30 ${-86 - bob} Z" fill="${sh}"/>${p.apron ? `<path d="M -22 ${-130 - bob} H 22 V ${-80 - bob} H -22 Z" fill="${p.apron}"/>` : ''}
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
    // system-view overlay: a blue grid, a scan line sweeping down, tinted wash (op 0..1). ui layer.
    sysview(p) { const op = p.op ?? 1, gt = p.gt ?? 0, y = fr(gt * 0.45) * 1180 - 50; if (op <= 0) return ''; return `<g opacity="${f(op)}"><rect x="0" y="0" width="1920" height="1080" fill="#0A1B33" opacity="0.55"/><rect x="0" y="0" width="1920" height="1080" fill="url(#wGrid)" opacity="0.6"/><rect x="0" y="${f(y)}" width="1920" height="6" fill="#7CC2FF" opacity="0.6"/><rect x="0" y="${f(y - 60)}" width="1920" height="60" fill="#7CC2FF" opacity="0.08"/>${T('SYSTEM VIEW', 30, '#7CC2FF', 170, 60, 'letter-spacing="6"')}<circle cx="44" cy="70" r="9" fill="#E85B4E" opacity="${fr(gt) < 0.5 ? 1 : 0.2}"/></g>`; },
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
  };
  Object.assign(PROPS, W);
  window.WORLD = { defs, NIGHT, icons };
})();
