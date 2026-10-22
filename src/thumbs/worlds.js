// Thumbnail worlds: the place behind ZERO, one per kind of system (src/thumbs/heroes.js puts the story in front).
// Drawn with ZERO on the left (x ~ 250); compose.js mirrors them when he stands on the right.
// A world returns { back (drawn in soft focus), mid (sharp: lights, pools), floor (y of the floor line), blur, haze }.
// Worlds are dim on purpose: the key light, ZERO and the hero carry the contrast, the world supports.
(() => {
  const K = window.TKIT, P = window.PUPPETS;
  const { f, rnd, tr, shade, tint, pool, cone, box, person, C } = K;
  const W = 1280, H = 720;
  const brown = ['#B98A5A', '#A77A4C', '#C69A66', '#9A7048'];
  const sky = (ctx, h = 720) => `<rect x="-200" y="-200" width="${W + 400}" height="${h + 400}" fill="${K.linear(ctx.fam.bg1, ctx.fam.bg2)}"/>`;
  const floorBand = (y, c, o = {}) => {
    let s = `<rect x="-200" y="${y}" width="${W + 400}" height="${H - y + 200}" fill="${c}"/><rect x="-200" y="${y}" width="${W + 400}" height="${H - y + 200}" fill="${K.linear('#000000', '#000000', true, 0, 0.45)}"/>`;
    if (o.lines !== false) for (let i = -10; i <= 22; i++) s += `<path d="M ${i * 90} ${y} L ${f(640 + (i * 90 - 640) * 3.2)} ${H + 200}" stroke="${shade(c, 0.25)}" stroke-width="2" opacity="0.5"/>`;
    return s;
  };

  // ======================= WORLDS =======================
  const TWORLDS = {
    // night-shift warehouse (logistics, packages, supply chain): racks, high windows, sodium lamps, tiny workers
    warehouse(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam;
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${fam.wall ?? '#25304F'}"/>`;
      // high windows onto the night
      for (let i = 0; i < 6; i++) back += `<g ${tr(70 + i * 210, 40)}><rect width="160" height="90" fill="${K.linear('#0B1030', '#283A72')}"/>${K.stars(160, 90, 8, i + 3)}<rect x="76" width="8" height="90" fill="#1A2140"/></g>`;
      // trusses
      back += `<rect x="-200" y="140" width="${W + 400}" height="12" fill="#1A2140"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M ${i * 100} 152 L ${i * 100 + 50} 196 L ${i * 100 + 100} 152" fill="none" stroke="#1A2140" stroke-width="6"/>`).join('');
      // back racks (two depths)
      back += `<g ${tr(-40, fl - 20, 0.62)} opacity="0.75">${K.rack(800, 520, 5, 4, { c: '#2E4A7A' })}</g><g ${tr(760, fl - 20, 0.62)} opacity="0.75">${K.rack(900, 520, 5, 9, { c: '#2E4A7A' })}</g>`;
      back += `<g ${tr(80, fl, 0.9)}>${K.rack(560, 470, 4, 7, { c: '#3B5A8C', yellow: true })}</g>`;
      back += floorBand(fl, fam.floor ?? '#2A3048');
      back += `<rect x="-200" y="${fl + 40}" width="${W + 400}" height="8" fill="${C.YEL}" opacity="0.55"/>`;
      // tiny people with their own life
      back += `<g ${tr(560, fl - 4, 0.75)}>${person('#5C6B8A', { vest: '#FF9E45', seed: 2, pose: 'walk' })}</g><g ${tr(700, fl - 8, 0.6)}>${person('#6E5C7A', { vest: '#FF9E45', seed: 5 })}</g>`;
      // lamps and their pools
      let mid = [200, 620, 1040].map(x => `${cone(x, 210, 50, 420, 440, '#FFD58A', 0.22)}${K.lamp(x, 200, '#FFD58A', { cord: 60 })}`).join('');
      mid += [200, 620, 1040].map(x => pool(x, fl + 10, 220, 40, '#FFB867', 0.35)).join('');
      // the night-shift clock (worldOpts.clock = [h, m]): tells "while you sleep" without words
      if (ctx.wopts.clock) mid += `<g ${tr(470, 250)}>${K.clock(44, ctx.wopts.clock[0], ctx.wopts.clock[1], { glow: '#FFD58A' })}</g>`;
      return { back, mid, floor: fl };
    },
    // the sorting hub seen from a catwalk: belts converging to the horizon, thousands of parcels, open doors on the night
    hub(ctx) {
      const fl = ctx.floor = 660, fam = ctx.fam, vx = 860, vy = 300;
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${vy + 200}" fill="${fam.wall ?? '#25304F'}"/>`;
      // the far wall: a huge open door on the night, a cargo plane being loaded outside
      back += `<g ${tr(vx, vy)}><rect x="-340" y="-170" width="680" height="170" fill="${K.linear('#0B1030', '#3B4A8A')}"/>${K.stars(680, 100, 16, 5, -340, -170)}<rect x="-340" y="-30" width="680" height="30" fill="#151A30"/><g ${tr(40, -62, 0.4)}>${K.plane('#E9EDF4', { tail: '#2F80ED', lit: true })}</g>${pool(40, -40, 260, 60, '#FFE2A6', 0.5)}</g>`;
      back += `<rect x="-200" y="${vy}" width="${W + 400}" height="${H}" fill="#1B2038"/>`;
      // belts radiating from the vanishing point, lit edges, parcels riding them, smaller with distance
      const belts = 13;
      for (let i = 0; i < belts; i++) {
        const ex = -1100 + i * (W + 2200) / (belts - 1), dx = ex - vx, dy = H + 160 - vy;
        const p0 = [vx + dx * 0.03, vy + dy * 0.03];
        back += `<path d="M ${f(p0[0] - 3)} ${f(p0[1])} L ${f(ex - 70)} ${H + 160} L ${f(ex + 70)} ${H + 160} L ${f(p0[0] + 3)} ${f(p0[1])} Z" fill="#4A5274"/>`;
        back += `<path d="M ${f(p0[0] - 3)} ${f(p0[1])} L ${f(ex - 70)} ${H + 160}" stroke="#FFB867" stroke-width="2.5" opacity="0.55"/><path d="M ${f(p0[0] + 3)} ${f(p0[1])} L ${f(ex + 70)} ${H + 160}" stroke="#14182A" stroke-width="3"/>`;
        for (let k = 0; k < 12; k++) {
          const t = ((k + rnd(i * 7)) / 12) ** 2;
          if (t < 0.015 || rnd(i * 13 + k) < 0.22) continue;
          const x = vx + dx * t, y = vy + dy * t, sc = 0.07 + t * 1.15;
          back += `<g ${tr(x, y)}>${box(80 * sc, 60 * sc, rnd(i * 5 + k * 3) > 0.93 ? C.YEL : shade(brown[(i + k) % 4], (1 - t) * 0.5), { tape: sc > 0.3, depth: 12 * sc })}</g>`;
        }
        // a worker beside some belts, scale with distance
        if (i % 3 === 1) { const t = 0.22 + rnd(i) * 0.2, x = vx + dx * t + 40 * t, y = vy + dy * t; back += `<g ${tr(x, y, 0.15 + t * 0.9)}>${person(['#5C6B8A', '#6E5C7A', '#7A6E5C'][i % 3], { vest: '#FF9E45', seed: i, shadow: false })}</g>`; }
      }
      for (let i = 0; i < 6; i++) { const x = 120 + i * 220; back += `${cone(x, 120, 30, 300, 420, '#FFD58A', 0.14)}${K.lamp(x, 116, '#FFD58A', { cord: 40, s: 0.6 })}`; }
      let mid = pool(vx, vy + 40, 560, 160, '#FFB867', 0.4) + pool(vx, 520, 700, 200, '#FFB867', 0.18);
      return { back, mid, floor: fl, blur: 1.1, haze: 0.14 };
    },
    // a container port at night: cranes, stacks of containers, dark water with reflections (ships, trade, tariffs)
    port(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, hz = 470;
      let back = sky(ctx) + K.stars(W, 260, 40, 13);
      const cols = ['#E07B39', '#2F80ED', '#2E9E5B', '#C0392B', '#F2C14E', '#7B5CD6'];
      for (let k = 0; k < 40; k++) for (let r = 0; r < 3; r++) if (rnd(k * 7 + r) > 0.2) back += `<rect x="${k * 34 - 20}" y="${hz - 22 - r * 20}" width="32" height="18" fill="${shade(cols[Math.floor(rnd(k + r * 9) * 6)], 0.45)}"/>`;
      [[180, 1], [560, 0.8], [1000, 1.1]].forEach(([x, k]) => { back += `<g ${tr(x, hz, k)} fill="#2A3150"><rect x="-70" y="-300" width="14" height="300"/><rect x="56" y="-300" width="14" height="300"/><rect x="-140" y="-310" width="320" height="22"/><rect x="-90" y="-340" width="60" height="34"/><rect x="20" y="-300" width="8" height="120" fill="#3A4160"/></g><circle cx="${x + 160 * k}" cy="${hz - 310 * k}" r="5" fill="${C.RED}"/>`; });
      back += `<rect x="-200" y="${hz}" width="${W + 400}" height="${H}" fill="${K.linear('#0E1E3A', '#050A18')}"/>`;
      for (let i = 0; i < 40; i++) back += `<rect x="${f(rnd(i) * W)}" y="${f(hz + 10 + rnd(i * 3) * 220)}" width="${f(30 + rnd(i * 5) * 90)}" height="3" fill="#FFD58A" opacity="${f(0.15 + rnd(i * 7) * 0.3)}"/>`;
      let mid = pool(640, hz, 700, 140, '#FFB867', 0.25);
      return { back, mid, floor: fl, haze: 0.18 };
    },
    // generic hidden-system machine room (mystery, fallback): pipes, gauges, a big door with light behind it
    machine(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam;
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${fam.wall ?? '#1D1A33'}"/>`;
      back += K.pipe([[-50, 120], [1400, 120]], 34, '#3D3A63') + K.pipe([[-50, 210], [380, 210], [380, 600]], 26, '#4A4470') + K.pipe([[1400, 260], [980, 260], [980, 700]], 30, '#3D3A63');
      for (let i = 0; i < 4; i++) back += `<g ${tr(520 + i * 130, 330)}><circle r="38" fill="#2A2748"/><circle r="30" fill="#E9E4DA"/><rect x="-3" y="-24" width="6" height="26" fill="${C.RED}" transform="rotate(${-60 + i * 40})"/></g>`;
      back += floorBand(fl, fam.floor ?? '#1A1830');
      let mid = `${cone(640, 0, 80, 700, 700, '#CFC2FF', 0.12)}`;
      return { back, mid, floor: fl };
    },
    // payments and the internet seen as a place: a dark plain with a glowing grid, cables, a city of banks far away
    network(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, a = ctx.accent ?? '#3FD0FF', hz = 430;
      let back = sky(ctx);
      back += K.stars(W, 300, 40, 7);
      back += `<g opacity="0.85">${K.skyline(W + 200, hz, 18, shade(fam.bg2, 0.25), 3, { min: 60, max: 160, light: a, lop: 0.6 })}</g>`;
      back += `<rect x="-200" y="${hz}" width="${W + 400}" height="${H}" fill="${shade(fam.bg2, 0.35)}"/>`;
      for (let i = -14; i <= 28; i++) back += `<path d="M ${640 + i * 30} ${hz} L ${f(640 + i * 30 * 9)} ${H + 300}" stroke="${a}" stroke-width="1.6" opacity="0.28"/>`;
      for (let k = 1; k < 9; k++) { const y = hz + (H - hz) * (k / 8) ** 1.8; back += `<rect x="-200" y="${f(y)}" width="${W + 400}" height="1.6" fill="${a}" opacity="0.25"/>`; }
      // cables in the sky with pulses
      [[[-100, 260], [400, 120], [900, 300], [1400, 160]], [[-100, 380], [500, 300], [1000, 380], [1400, 260]], [[200, -40], [520, 200], [780, 240], [1400, 90]]].forEach((c, i) => {
        const d = `M ${c[0][0]} ${c[0][1]} C ${c[1][0]} ${c[1][1]} ${c[2][0]} ${c[2][1]} ${c[3][0]} ${c[3][1]}`;
        back += `<path d="${d}" fill="none" stroke="${a}" stroke-width="5" opacity="0.35"/><path d="${d}" fill="none" stroke="${tint(a, 0.6)}" stroke-width="5" stroke-dasharray="6 90" stroke-dashoffset="${i * 40}" opacity="0.9"/>`;
      });
      let mid = pool(640, hz, 700, 120, a, 0.25);
      return { back, mid, floor: fl, blur: 1.8, haze: 0.18 };
    },
    // a grand banking hall at night: columns, arched windows, brass teller bars, chandeliers, marble floor
    bankhall(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, wall = fam.wall ?? '#1E3A3E';
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${wall}"/>`;
      for (let i = 0; i < 5; i++) back += `<g ${tr(130 + i * 260, 360)}><path d="M -60 0 V -200 A 60 60 0 0 1 60 -200 V 0 Z" fill="${K.linear('#0B1A2E', '#1F3D5C')}"/>${K.stars(120, 180, 5, i + 9, -60, -250)}<rect x="-4" y="-250" width="8" height="250" fill="${shade(wall, 0.4)}"/></g>`;
      for (let i = 0; i < 6; i++) back += `<rect x="${f(-10 + i * 260)}" y="40" width="70" height="${fl - 40}" fill="${tint(wall, 0.12)}"/><rect x="${f(40 + i * 260)}" y="40" width="20" height="${fl - 40}" fill="${shade(wall, 0.2)}"/><rect x="${f(-24 + i * 260)}" y="30" width="98" height="26" fill="${tint(wall, 0.2)}"/>`;
      // teller counter with brass bars
      back += `<rect x="-200" y="${fl - 190}" width="${W + 400}" height="190" fill="${shade(wall, 0.3)}"/><rect x="-200" y="${fl - 200}" width="${W + 400}" height="16" fill="${tint(wall, 0.25)}"/>`;
      back += Array.from({ length: 60 }, (_, i) => `<rect x="${i * 24 - 40}" y="${fl - 330}" width="5" height="130" fill="${C.AMBER}" opacity="0.7"/>`).join('') + `<rect x="-200" y="${fl - 336}" width="${W + 400}" height="8" fill="${C.AMBER}" opacity="0.8"/>`;
      // marble floor
      let tiles = `<rect x="-200" y="${fl}" width="${W + 400}" height="${H}" fill="${shade(wall, 0.15)}"/>`;
      for (let r = 0; r < 6; r++) for (let k = -8; k < 24; k++) if ((r + k) % 2) { const y0 = fl + (r / 6) ** 1.5 * 140, y1 = fl + ((r + 1) / 6) ** 1.5 * 140, sx = 1 + (r / 6) * 2.2, sx1 = 1 + ((r + 1) / 6) * 2.2; tiles += `<path d="M ${f(640 + (k * 80 - 640) * sx)} ${f(y0)} L ${f(640 + ((k + 1) * 80 - 640) * sx)} ${f(y0)} L ${f(640 + ((k + 1) * 80 - 640) * sx1)} ${f(y1)} L ${f(640 + (k * 80 - 640) * sx1)} ${f(y1)} Z" fill="${tint(wall, 0.1)}" opacity="0.6"/>`; }
      back += tiles;
      let mid = [260, 760, 1160].map(x => `${cone(x, 120, 60, 460, 520, '#FFE2A6', 0.18)}<g ${tr(x, 110)}><rect x="-2" y="-120" width="4" height="120" fill="#11131F"/><ellipse cx="0" cy="0" rx="60" ry="16" fill="${C.AMBER}"/><ellipse cx="0" cy="-6" rx="40" ry="10" fill="#FFE2A6"/></g>`).join('');
      return { back, mid, floor: fl };
    },
    // airport terminal at sunset: glass wall, planes on the apron, a jet bridge, departure board, rows of seats
    airport(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam;
      let back = sky(ctx);
      back += `<g ${tr(-40, 40)}>${K.glassWall(W + 80, 470, fam.sky1 ?? '#FF9E5E', fam.sky2 ?? '#4B3F8A', { n: 7, frame: '#151A2C', extra: `<rect x="0" y="380" width="${W + 80}" height="90" fill="#3A3550"/><g ${tr(380, 330, 0.55)}>${K.plane('#E9EDF4', { tail: C.BLUE })}</g><g ${tr(1050, 360, 0.35)}>${K.plane('#E9EDF4', { tail: C.CORAL })}</g>` })}</g>`;
      back += `<rect x="-200" y="510" width="${W + 400}" height="${H}" fill="${fam.floor ?? '#2B2F4A'}"/>`;
      for (let i = 0; i < 9; i++) back += `<g ${tr(-20 + i * 160, 600, 0.55)}>${K.seat('#3E4A72')}</g><g ${tr(60 + i * 160, 600, 0.55)}>${K.seat('#3E4A72')}</g>`;
      back += `<g ${tr(520, 600, 0.7)}>${person('#8A6E5C', { seed: 3, pose: 'walk' })}</g><g ${tr(560, 600, 0.6)}>${K.suitcase('#2F80ED')}</g><g ${tr(980, 600, 0.65)}>${person('#5C6B8A', { seed: 7 })}</g>`;
      back += floorBand(fl, fam.floor ?? '#2B2F4A', { lines: false });
      let mid = pool(640, 300, 700, 260, '#FFB867', 0.25);
      return { back, mid, floor: fl, haze: 0.22 };
    },
    // inside a plane: curved walls, overhead bins, oval windows (the corridor hero lays the seats)
    cabin(ctx) {
      const fl = ctx.floor = 650, fam = ctx.fam;
      let back = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="${K.linear('#5B5F78', '#2E3248')}"/><rect x="-200" y="${fl - 20}" width="${W + 400}" height="${H}" fill="#2A2E44"/><rect x="760" y="${fl - 20}" width="120" height="${H}" fill="#8C3B4A" opacity="0.8"/>`;
      back += `<path d="M -200 120 Q 640 -40 1480 120 L 1480 -200 L -200 -200 Z" fill="#8C93A8"/>`;
      let mid = pool(820, 380, 380, 240, '#FFE2A6', 0.55) + pool(820, 60, 600, 120, '#FFE2A6', 0.3);
      return { back, mid, floor: fl, haze: 0.12 };
    },
    // a supermarket after hours: shelves full of colour, aisle signs, a few tubes still lit
    supermarket(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, wall = fam.wall ?? '#2A2F48';
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${wall}"/>`;
      back += `<g ${tr(-60, fl, 1)}>${K.shelf(700, 5, 3, { h: 420, c: '#C9C2B5', tags: true })}</g><g ${tr(700, fl, 1)}>${K.shelf(700, 5, 8, { h: 420, c: '#C9C2B5', tags: true })}</g>`;
      [[240, 'AISLE 4'], [900, 'AISLE 5']].forEach(([x, t]) => { back += `<g ${tr(x, 120)}><rect x="-2" y="-120" width="4" height="70" fill="#11131F"/><rect x="-110" y="-50" width="220" height="70" rx="10" fill="${C.BLUE}"/>${K.label(t, 30, '#fff', { m: ctx.m })}</g>`; });
      back += floorBand(fl, fam.floor ?? '#3A3F55', { lines: false });
      for (let i = 0; i < 16; i++) back += `<rect x="${i * 90 - 40}" y="${fl}" width="2" height="${H}" fill="#000" opacity="0.15"/>`;
      let mid = [200, 640, 1080].map(x => `<rect x="${x - 90}" y="0" width="180" height="14" rx="7" fill="#EAF6FF"/>${cone(x, 14, 180, 520, 560, '#DDF0FF', 0.16)}`).join('');
      return { back, mid, floor: fl, haze: 0.38 };
    },
    // a living room at night: window on the city, lamp, TV glow (subscriptions, screens, home)
    livingroom(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, wall = fam.wall ?? '#2B2240';
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${wall}"/>`;
      back += `<g ${tr(880, 90)}><rect width="340" height="300" fill="${K.linear('#0E1330', '#3B3F78')}"/>${K.skyline(340, 300, 7, '#232850', 4, { min: 60, max: 170 })}<rect x="166" width="8" height="300" fill="#E8DCC8"/><rect width="340" height="300" fill="none" stroke="#E8DCC8" stroke-width="12"/></g>`;
      back += `<g ${tr(120, 200)}><rect width="180" height="120" fill="#3D3157"/><rect x="12" y="12" width="156" height="96" fill="#5B4B7A"/></g>`;
      back += floorBand(fl, fam.floor ?? '#20192F', { lines: false });
      back += `<g ${tr(1180, fl, 1)}><rect x="-6" y="-300" width="12" height="300" fill="#11131F"/><path d="M -60 -300 L 60 -300 L 40 -380 L -40 -380 Z" fill="#E8C98E"/></g>`;
      let mid = pool(1180, 280, 260, 260, '#FFD58A', 0.4) + pool(700, 420, 520, 300, '#4FA8FF', 0.22);
      return { back, mid, floor: fl };
    },
    // a casino floor: no windows, no clocks, rows of glowing machines, patterned carpet, gold chandeliers
    casino(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, wall = fam.wall ?? '#2A1030';
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${wall}"/>`;
      for (let i = 0; i < 9; i++) back += `<g ${tr(-30 + i * 160, fl - 30, 0.55)}>${K.slot({ c: ['#B23A48', '#7B5CD6', '#2F80ED'][i % 3], m: ctx.m })}</g>`;
      for (let i = 0; i < 8; i++) back += `<g ${tr(40 + i * 170, fl - 10, 0.75)}>${person(['#6E5C7A', '#5C6B8A', '#7A5C5C'][i % 3], { seed: i + 2 })}</g>`;
      let carpet = `<rect x="-200" y="${fl}" width="${W + 400}" height="${H}" fill="#3A0F2A"/>`;
      for (let r = 0; r < 5; r++) for (let k = 0; k < 22; k++) carpet += `<circle cx="${f(k * 64 - 40 + (r % 2) * 32)}" cy="${f(fl + 12 + r * 18)}" r="${4 + r}" fill="${C.YEL}" opacity="0.18"/>`;
      back += carpet;
      let mid = [220, 640, 1060].map(x => `<g ${tr(x, 70)}><rect x="-2" y="-80" width="4" height="80" fill="#11131F"/>${pool(0, 20, 160, 90, '#FFD58A', 0.6)}<path d="M -70 0 L 70 0 L 40 40 L -40 40 Z" fill="${C.AMBER}"/></g>`).join('');
      return { back, mid, floor: fl };
    },
    // a server hall: racks on both sides, cold light, blinking LEDs (data, cloud, AI, the internet)
    serverroom(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, wall = fam.wall ?? '#0E1838';
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${wall}"/>`;
      for (let i = 0; i < 11; i++) back += `<g ${tr(-40 + i * 128, fl, 1)}>${K.server(470, { seed: i * 3 })}</g>`;
      back += floorBand(fl, fam.floor ?? '#141E3A');
      for (let i = 0; i < 18; i++) back += `<rect x="${i * 76 - 20}" y="${fl}" width="2" height="${H}" fill="#3FD0FF" opacity="0.12"/>`;
      let mid = [320, 960].map(x => cone(x, 0, 200, 520, 640, '#9FD0FF', 0.14)).join('');
      return { back, mid, floor: fl };
    },
    // a city street at night (insurance, taxes, companies, rent): towers, street lamps, wet road
    city(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam;
      let back = sky(ctx) + K.stars(W, 200, 30, 11);
      back += K.skyline(W + 200, 560, 14, shade(fam.bg2, 0.15), 6, { min: 160, max: 320 });
      back += `<g ${tr(0, 0)}>${K.skyline(W + 200, 620, 9, shade(fam.bg2, 0.4), 12, { min: 120, max: 240, lop: 0.9 })}</g>`;
      back += `<rect x="-200" y="${fl - 20}" width="${W + 400}" height="${H}" fill="#151826"/>`;
      for (let i = 0; i < 14; i++) back += `<rect x="${i * 110}" y="${fl + 40}" width="60" height="6" fill="#FFD58A" opacity="0.35"/>`;
      if (ctx.wopts.rain !== false) back += K.rain(W, H, 90, '#9FC3E6', 4);
      let mid = [160, 1120].map(x => `<rect x="${x - 4}" y="${fl - 330}" width="8" height="330" fill="#0D0F18"/><rect x="${x - 4}" y="${fl - 330}" width="60" height="8" fill="#0D0F18"/>${cone(x + 50, fl - 322, 30, 260, 320, '#FFD58A', 0.3)}`).join('');
      return { back, mid, floor: fl };
    },
    // a factory: huge machines, an overhead crane, orange sparks light (manufacturing, cheap goods, supply chain)
    factory(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, wall = fam.wall ?? '#22304A';
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${wall}"/>`;
      for (let i = 0; i < 5; i++) back += `<g ${tr(60 + i * 270, 60)}><rect width="200" height="150" fill="${K.linear('#E07B39', '#5B3A6E')}"/><rect x="40" y="70" width="24" height="80" fill="#2B2440"/><rect x="120" y="50" width="30" height="100" fill="#2B2440"/><rect x="96" width="8" height="150" fill="#1A2033"/></g>`;
      back += `<rect x="-200" y="250" width="${W + 400}" height="18" fill="#E0A100"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${i * 50}" y="252" width="22" height="14" fill="#14151C"/>`).join('')}`;
      back += `<g ${tr(180, fl, 1)}><rect x="-120" y="-300" width="240" height="300" fill="#3A4766"/>${K.gear(60, '#55618A')}<g ${tr(0, -180)}>${K.gear(70, '#4A5578')}</g></g><g ${tr(1080, fl, 1)}><rect x="-140" y="-340" width="280" height="340" fill="#3A4766"/><g ${tr(-40, -220)}>${K.gear(80, '#4A5578')}</g></g>`;
      back += `<g ${tr(-40, fl - 160)}>${K.conveyor(1400, '#3A4160', { legs: 0 })}</g>` + Array.from({ length: 10 }, (_, i) => `<g ${tr(40 + i * 140, fl - 168)}>${K.product('box', ['#2F80ED', '#FF6B5B', '#2E9E5B', '#F2994A'][i % 4], 1)}</g>`).join('');
      back += floorBand(fl, fam.floor ?? '#1E2436');
      let mid = pool(640, 300, 600, 280, '#FF9E45', 0.22);
      return { back, mid, floor: fl };
    },
    // a trading room: a wall of screens with red and green charts, a ticker, dark desks (stocks, crypto, investing)
    trading(ctx) {
      const fl = ctx.floor = 640, fam = ctx.fam, wall = fam.wall ?? '#0B1424';
      let back = sky(ctx) + `<rect x="-200" y="-200" width="${W + 400}" height="${fl + 200}" fill="${wall}"/>`;
      for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) {
        const up = rnd(r * 7 + k) > 0.45, pts = Array.from({ length: 8 }, (_, i) => Math.min(0.95, Math.max(0.05, 0.5 + (up ? 1 : -1) * (i / 7 - 0.5) * 0.7 + (rnd(r * 31 + k * 7 + i) - 0.5) * 0.35)));
        back += `<g ${tr(-20 + k * 190, 40 + r * 140)}><rect x="0" y="0" width="176" height="124" rx="6" fill="#0D1020"/><g ${tr(14, 14)}>${K.chart(148, 96, pts, up ? '#2E9E5B' : '#E63946', { panel: false, sw: 5 })}</g></g>`;
      }
      back += `<rect x="-200" y="470" width="${W + 400}" height="30" fill="#05060C"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 120}" y="482" width="70" height="8" rx="4" fill="${rnd(i) > 0.5 ? '#2E9E5B' : '#E63946'}"/>`).join('')}`;
      back += floorBand(fl, fam.floor ?? '#10182A');
      let mid = pool(640, 260, 760, 260, '#3FD0FF', 0.14);
      return { back, mid, floor: fl };
    },
  };

  window.TWORLDS = TWORLDS;
  window.TWORLD_HELPERS = { sky, floorBand, brown };
})();
