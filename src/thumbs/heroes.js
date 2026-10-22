// Thumbnail heroes: the one big idea in front of the world, told as a mini-story ZERO has just discovered.
// Each hero is a reusable situation (something hidden, something wrong, something huge), parameterised by objects,
// so a new topic usually needs a new playbook entry in director.mjs, not new drawing code.
// Drawn with ZERO on the left; returns { back, front, focus: [x,y], focusR, box: [x,y,w,h] (main object, kept clear of
// the text), zero: { x, y, height, st } (where ZERO stands and how, when the story needs it), onZero (things stuck on
// him), pix: { x, y, s, face, halo, scan: [x,y] } | false, textZone }.
(() => {
  const K = window.TKIT;
  const { f, rnd, tr, shade, tint, pool, cone, box, person, C } = K;
  const W = 1280, H = 720;
  const brown = ['#B98A5A', '#A77A4C', '#C69A66', '#9A7048'];

  // any object of the kit, standing on (0,0), scaled to about `h` px tall
  const OBJ = {
    box: o => [box(170, 140, o.c ?? C.YEL, { label: true }), 175],
    parcel: o => [box(150, 120, o.c ?? brown[0]), 150],
    card: o => [`<g ${tr(0, -63)}>${K.card(200, o.c ?? C.BLUE)}</g>`, 126],
    coin: o => [`<g ${tr(0, -60)}>${K.coin(60)}</g>`, 126],
    cash: o => [K.stack(9, 170), 100],
    ticket: o => [`<g ${tr(0, -55)}>${K.ticket(260, '#FFFFFF', { m: o.m, seat: o.seat })}</g>`, 110],
    phone: o => [`<g ${tr(0, -110)}>${K.phone(110, { screen: o.screen ?? '#DDEBFF' })}</g>`, 220],
    cart: o => [K.cart('#B9C2CF', { load: o.load }), 200],
    terminal: o => [K.terminal('#2A2F45', { amount: o.amount, ok: o.ok }), 270],
    tag: o => [`<g ${tr(-130, -60)}>${K.pricetag(o.price ?? '$9.99', 260, { m: o.m })}</g>`, 130],
    slot: o => [K.slot({ m: o.m }), 420],
    seat: o => [K.seat(o.c ?? C.BLUE), 252],
    suitcase: o => [K.suitcase(o.c ?? C.CORAL), 206],
    bank: o => [K.bank(420, 330, '#D9D2C3', { sign: o.sign ?? 'BANK', m: o.m }), 400],
    tower: o => [K.tower(220, 520, o.c ?? '#2B3A5C', { logo: o.logo ?? C.CORAL, seed: 3 }), 540],
    house: o => [K.house(o.c ?? '#C96F53'), 136],
    receipt: o => [`<g ${tr(0, -520)}>${K.receipt(200, 520, { mark: true })}</g>`, 532],
    wallet: o => [`<g ${tr(0, -50)}>${K.wallet('#6B4E3D', { empty: o.empty })}</g>`, 110],
    screen: o => [`<g ${tr(0, -122)}>${K.screen(420)}</g>`, 244],
    vault: o => [`<g ${tr(0, -224)}>${K.vault(200, { open: o.open })}</g>`, 448],
    paycheck: o => [`<g ${tr(0, -90)}><rect x="-150" y="-90" width="300" height="180" rx="10" fill="#EAF6EE"/><rect x="-150" y="-90" width="300" height="40" rx="10" fill="#2E9E5B"/>${K.label('$', 80, '#2E9E5B', { m: o.m })}<rect x="-120" y="50" width="160" height="10" rx="5" fill="#9AA0AE"/></g>`, 180],
    cup: o => [`<g><rect x="-40" y="-110" width="80" height="110" rx="12" fill="#F6F1E6"/><rect x="-40" y="-70" width="80" height="34" fill="#8D5A3B"/><path d="M 40 -90 q 34 0 34 30 q 0 30 -34 30" fill="none" stroke="#F6F1E6" stroke-width="12"/><path d="M -14 -130 q 10 -14 0 -28 M 10 -130 q 10 -14 0 -28" stroke="#fff" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round"/></g>`, 160],
    product: o => [K.product('box', o.c ?? C.CORAL, 3), 200],
    milk: o => [K.product('bottle', '#F4F7FB', 3.2), 256],
    gov: o => [K.bank(460, 360, '#C9CED8', { sign: o.sign ?? 'TAX OFFICE', m: o.m, cols: 6 }), 430],
    ship: o => [`<g ${tr(0, -30)}>${K.ship('#2B3A5C')}</g>`, 400],
    person: o => [person(o.c ?? '#5C6B8A', { seed: o.seed ?? 2 }), 156],
    screenwall: o => [`<g>${Array.from({ length: 12 }, (_, i) => { const r = Math.floor(i / 4), k = i % 4, up = rnd(i * 7) > 0.5; const pts = Array.from({ length: 7 }, (_, j) => Math.min(0.95, Math.max(0.05, 0.5 + (up ? 1 : -1) * (j / 6 - 0.5) * 0.8 + (rnd(i * 13 + j) - 0.5) * 0.3))); return `<g ${tr(-330 + k * 165, -560 + r * 180)}><rect x="0" y="0" width="155" height="170" rx="8" fill="#0D1020"/><g ${tr(14, 24)}>${K.chart(127, 120, pts, up ? C.GREEN : C.RED, { panel: false, sw: 6 })}</g></g>`; }).join('')}<rect x="-40" y="0" width="80" height="0"/></g>`, 560],
    contract: o => [`<g ${tr(0, -340)}><rect x="-130" y="0" width="260" height="340" rx="8" fill="#F6F1E6"/>${Array.from({ length: 16 }, (_, i) => `<rect x="-100" y="${30 + i * 18}" width="${150 + rnd(i) * 50}" height="7" rx="3" fill="#9AA0AE"/>`).join('')}<path d="M -90 320 q 30 -30 60 0 t 60 0" stroke="${C.BLUE}" stroke-width="5" fill="none"/></g>`, 340],
  };
  function obj(kind, h, o = {}) {
    const [svg, nat] = (OBJ[kind] || OBJ.box)(o);
    return `<g transform="scale(${f(h / nat)})">${svg}</g>`;
  }
  // a small object stuck to ZERO's hand (frame coordinates, never mirrored)
  // an aircraft seat seen from the front with its passenger, (0,0) = floor under it
  const seatFront = (x, v) => { const c = '#2F6FD6', p = ['#7A5C5C', '#5C6B8A', '#6E7A5C', '#8A6E5C', '#9E7A4C'][v], sk = ['#C99A78', '#8D5A3B', '#E3B48F', '#6B4430', '#C99A78'][v];
    return `<g ${tr(x, 0)}><rect x="-50" y="-260" width="100" height="230" rx="26" fill="${c}"/><rect x="-42" y="-252" width="84" height="40" rx="14" fill="#E9EDF4"/>${v === 3 ? '' : `<rect x="-32" y="-170" width="64" height="100" rx="24" fill="${p}"/><circle cx="0" cy="-192" r="24" fill="${sk}"/>`}<rect x="-54" y="-70" width="108" height="40" rx="12" fill="${shade(c, 0.2)}"/></g>`; };
  const inHand = (kind, h, dx = 52, dy = -96, rot = -8) => (x, y, s, m) => `<g ${tr(x + (m ? -dx : dx) * s, y + dy * s, 1, m ? -rot : rot)}>${obj(kind, h * s / 1.5)}</g>`;

  const THEROES = {
    // ---------------------------------------------------------------- the channel's signature: ZERO SEES WHAT WE DON'T
    // ZERO has just put the thing on the belt; it shoots off into a wall that is cut open (dollhouse section) to show the
    // enormous hidden machine behind it: scan, sort, routes branching, an overhead line, docks, and at the far end the
    // door where it leaves at dawn. The clock hangs by the text (time is the hook). Reads at phone size as
    // ZERO -> yellow box -> huge machine -> question. opts: obj, clock [h, m], dawn (far door colour), pix (true/false)
    cutaway(ctx) {
      const o = ctx.opts, a = ctx.accent ?? '#4FA8FF', m = ctx.m;
      const belt = 548;                                   // top of the front belt
      const X0 = 640, Y0 = 286, IX = 676, IY = 318;       // cut edge and the inner corner of the wall thickness
      const vp = [1030, 430];                             // vanishing point of the hidden hall
      const BW = [880, 362, 1180, 486];                   // its back wall: x0, y0, x1, y1 (floor line)
      const dawn = o.dawn ?? '#FFB27A';
      // a strip (belt) in perspective from A to B, width wa -> wb, lighter top edge
      const strip = (ax, ay, bx, by, wa, wb, c = '#424C7C', top = '#7A86B8') => {
        const d = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / d, ny = (bx - ax) / d;
        const P = (x, y, w, k) => `${f(x + nx * w * k)} ${f(y + ny * w * k)}`;
        return `<path d="M ${P(ax, ay, wa, -0.5)} L ${P(bx, by, wb, -0.5)} L ${P(bx, by, wb, 0.5)} L ${P(ax, ay, wa, 0.5)} Z" fill="${c}"/><path d="M ${P(ax, ay, wa, -0.5)} L ${P(bx, by, wb, -0.5)} L ${P(bx, by, wb, -0.2)} L ${P(ax, ay, wa, -0.2)} Z" fill="${top}"/>`;
      };
      const along = (ax, ay, bx, by, wa, wb, ts, seed) => ts.map((t, i) => { const w = wa + (wb - wa) * t; return `<g ${tr(ax + (bx - ax) * t, ay + (by - ay) * t - w * 0.2)}>${box(w * 0.9, w * 0.7, brown[(seed + i) % 4], { depth: w * 0.12 })}</g>`; }).join('');
      const tiny = (x, y, s, seed, pose) => `<g ${tr(x, y, s)}>${person(['#5C6B8A', '#6E5C7A', '#4E6A6A'][seed % 3], { vest: '#FF9E45', seed, pose, shadow: false })}</g>`;
      const blink = (x, y, c, r = 4) => `${pool(x, y, r * 4, r * 4, c, 0.6)}<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${tint(c, 0.4)}"/>`;

      // ---- the hidden hall (everything inside is clipped to the cut) ----
      let hall = `<rect x="${IX}" y="${IY}" width="${W - IX + 60}" height="${700 - IY}" fill="#1A2148"/>`;
      // ceiling, floor, left wall, back wall
      hall += `<path d="M ${IX} ${IY} L ${W + 60} ${IY} L ${W + 60} ${IY + 8} L ${BW[2]} ${BW[1]} L ${BW[0]} ${BW[1]} Z" fill="#161C3E"/>`;
      hall += `<path d="M ${IX} 720 L ${IX} 660 L ${BW[0]} ${BW[3]} L ${BW[2]} ${BW[3]} L ${W + 60} 660 L ${W + 60} 720 Z" fill="${K.linear('#232A4C', '#1A2040')}"/>`;
      hall += Array.from({ length: 9 }, (_, i) => { const x = IX + i * 90; return `<path d="M ${f(x)} 660 L ${f(BW[0] + (x - IX) / (W + 60 - IX) * (BW[2] - BW[0]))} ${BW[3]}" stroke="#2C3458" stroke-width="2"/>`; }).join('');
      hall += `<path d="M ${IX} ${IY} L ${BW[0]} ${BW[1]} L ${BW[0]} ${BW[3]} L ${IX} 660 Z" fill="#1B2246"/>`;
      hall += `<rect x="${BW[0]}" y="${BW[1]}" width="${BW[2] - BW[0]}" height="${BW[3] - BW[1]}" fill="#1E2550"/>`;
      // the far door, open on the dawn: the only warm-pink light in the frame (this is where "by morning" happens)
      const dx0 = 944, dx1 = 1116, dy0 = 394;
      hall += pool((dx0 + dx1) / 2, BW[3] - 30, 240, 120, dawn, 0.7);
      hall += `<rect x="${dx0 - 10}" y="${dy0 - 10}" width="${dx1 - dx0 + 20}" height="${BW[3] - dy0 + 10}" fill="#0E1230"/><rect x="${dx0}" y="${dy0}" width="${dx1 - dx0}" height="${BW[3] - dy0}" fill="${K.linear('#FFE6B8', dawn)}"/>`;
      hall += `<rect x="${dx0}" y="${BW[3] - 14}" width="${dx1 - dx0}" height="14" fill="${shade(dawn, 0.35)}"/>`;
      hall += `<g ${tr(1006, BW[3] - 6, 0.13)} opacity="0.9">${K.truck('#2A2F4A', { cab: '#1E2340' })}</g><g ${tr(1074, BW[3] - 4, 0.1)} opacity="0.75">${K.truck('#2A2F4A', { cab: '#1E2340' })}</g>`;
      hall += `<path d="M ${dx0} ${BW[3]} L ${dx1} ${BW[3]} L ${dx1 + 120} 660 L ${dx0 - 90} 660 Z" fill="${K.linear(dawn, dawn, true, 0.45, 0)}"/>`;
      // docks along the right wall, trucks backed in
      hall += `<path d="M ${W + 60} ${IY + 8} L ${BW[2]} ${BW[1]} L ${BW[2]} ${BW[3]} L ${W + 60} 660 Z" fill="#1A2045"/>`;
      hall += [[1196, 0.55], [1240, 0.8]].map(([x, k]) => `<g ${tr(x, 540 + (k - 0.55) * 160)}><rect x="${-22 * k}" y="${-92 * k}" width="${44 * k}" height="${92 * k}" fill="${tint('#2A3260', 0.1)}"/><rect x="${-17 * k}" y="${-80 * k}" width="${34 * k}" height="${80 * k}" fill="${K.linear('#FFD9A8', '#E8945C')}" opacity="0.85"/>${blink(0, -100 * k, '#3DDC84', 3)}</g>`).join('');
      // ceiling lamps receding, and their light on the floor
      for (let i = 0; i < 4; i++) { const t = i / 4, x = 760 + (vp[0] - 760) * t * 0.9, y = IY + 30 + (BW[1] + 10 - IY - 30) * t, k = 1 - t * 0.7; hall += `${K.cone(x, y, 16 * k, 150 * k, 150 * k, '#FFD58A', 0.18)}<rect x="${f(x - 16 * k)}" y="${f(y - 3)}" width="${f(32 * k)}" height="${f(6 * k)}" rx="3" fill="#FFE7A8"/>`; }
      for (let i = 0; i < 3; i++) { const t = i / 3, x = 1230 - (1230 - vp[0]) * t * 0.6, y = IY + 26 + (BW[1] + 6 - IY - 26) * t, k = 1 - t * 0.6; hall += `<rect x="${f(x - 14 * k)}" y="${f(y - 3)}" width="${f(28 * k)}" height="${f(5 * k)}" rx="3" fill="#FFE7A8" opacity="0.8"/>`; }
      // a second line high up, far away: the hall keeps going
      hall += strip(IX, 352, BW[0] + 40, BW[1] + 8, 14, 8, '#2A3158', '#3A4470') + along(IX, 352, BW[0] + 40, BW[1] + 8, 14, 8, [0.2, 0.5, 0.8], 1);
      // the overhead line: parcels climb a ramp and cross the hall up high
      hall += strip(800, 520, 900, 388, 30, 22) + strip(900, 388, W + 60, 376, 22, 26);
      hall += Array.from({ length: 7 }, (_, i) => `<rect x="${f(930 + i * 60)}" y="390" width="5" height="${f(BW[3] - 390 + (i * 60) * 0.06)}" fill="#151A38"/>`).join('');
      hall += along(800, 520, 900, 388, 30, 22, [0.35, 0.8], 1) + along(900, 388, W + 60, 376, 22, 26, [0.12, 0.3, 0.48, 0.66, 0.84], 2);
      // straight on toward the dawn door, and the big route curving to the docks
      hall += strip(780, 548, dx0 + 50, BW[3] - 6, 40, 16) + along(780, 548, dx0 + 50, BW[3] - 6, 40, 16, [0.3, 0.58, 0.8], 3);
      hall += strip(770, 556, 1060, 600, 46, 44) + strip(1060, 600, W + 60, 590, 44, 50) + along(770, 556, 1060, 600, 46, 44, [0.35, 0.75], 0) + along(1060, 600, W + 60, 590, 44, 50, [0.25, 0.7], 2);
      // the belt coming out of the scanner
      hall += strip(IX - 10, belt + 4, 800, belt - 2, 36, 34);
      // the sorter where the routes split: a diverter with three route lights
      hall += `<g ${tr(800, 536)}><rect x="-34" y="-58" width="68" height="40" rx="6" fill="#2C3460"/><rect x="-34" y="-58" width="68" height="8" rx="4" fill="#3E4880"/>${blink(-18, -38, '#3DDC84', 4)}${blink(0, -38, C.YEL, 4)}${blink(18, -38, a, 4)}<rect x="-6" y="-18" width="12" height="20" fill="#232A50"/></g>`;
      hall += `<g ${tr(806, 548, 1, -24)}><rect x="0" y="-5" width="54" height="10" rx="5" fill="#FF9E45"/></g>`;
      // a forklift with a pallet, tiny night-shift workers
      hall += `<g ${tr(918, 520, 0.42)}>${K.shadow(0, 0, 70, 0.4)}<rect x="-50" y="-70" width="80" height="54" rx="10" fill="#E07B39"/><rect x="-40" y="-110" width="40" height="42" fill="none" stroke="#2A2F45" stroke-width="7"/><rect x="34" y="-150" width="8" height="150" fill="#2A2F45"/><rect x="40" y="-14" width="56" height="8" fill="#2A2F45"/><g ${tr(68, -14)}>${box(56, 44, brown[1], { depth: 8 })}</g><circle cx="-30" cy="-12" r="13" fill="#15182A"/><circle cx="16" cy="-12" r="13" fill="#15182A"/>${blink(-30, -116, C.YEL, 5)}</g>`;
      hall += tiny(870, 506, 0.34, 1, 'walk') + tiny(1130, 492, 0.24, 4) + tiny(1186, 640, 0.5, 2, 'walk') + tiny(1010, 534, 0.3, 5);
      // blinking operational lights
      hall += blink(BW[0] + 20, BW[1] + 20, C.RED, 3) + blink(BW[2] - 24, BW[1] + 24, '#3DDC84', 3) + blink(1240, IY + 40, C.YEL, 3);
      // depth haze toward the back
      hall += `<rect x="${IX}" y="${IY}" width="${W + 60 - IX}" height="${660 - IY}" fill="${K.radial('#1A2350', 0.35)}"/>`;
      hall += pool(1000, 470, 320, 170, a, 0.32);

      const clipId = 'cutclip';
      // the visible warehouse steps back: darker and softer than the story in front of it
      let back = `<rect x="-60" y="-60" width="${X0 + 160}" height="780" fill="${K.linear('#0A0D1E', '#0A0D1E', false, 0.38, 0)}"/>`;
      back += `<defs><clipPath id="${clipId}"><rect x="${IX}" y="${IY}" width="${W + 60 - IX}" height="${640 - IY}"/></clipPath></defs>`;
      // the building's wall, the cut through it (lighter section), and the wall thickness
      back += `<rect x="${X0 - 30}" y="${Y0 - 40}" width="${W - X0 + 120}" height="${640 - Y0 + 40}" fill="#1A2140"/>`;
      back += `<g clip-path="url(#${clipId})">${hall}</g>`;
      back += `<path d="M ${X0} ${Y0} L ${W + 60} ${Y0} L ${W + 60} ${IY} L ${IX} ${IY} Z" fill="#3A4470"/><path d="M ${X0} ${Y0} L ${IX} ${IY} L ${IX} 640 L ${X0} 640 Z" fill="#323C66"/>`;
      back += `<path d="M ${X0 - 12} ${Y0 - 12} L ${W + 60} ${Y0 - 12} L ${W + 60} ${Y0} L ${X0} ${Y0} L ${X0} 640 L ${X0 - 12} 640 Z" fill="#8C96BE"/><rect x="${X0 - 12}" y="640" width="${W - X0 + 80}" height="12" fill="#8C96BE"/><rect x="${X0 - 12}" y="652" width="${W - X0 + 80}" height="6" fill="#5A6390"/>`;
      // the front belt into the scanner tunnel at the cut
      back += `<g ${tr(-60, belt)}>${K.conveyor(IX + 140, '#3A4160', { legs: 80 })}</g>`;
      back += Array.from({ length: 6 }, (_, i) => `<rect x="${f(560 + i * 34)}" y="${belt - 7}" width="18" height="3" rx="1.5" fill="#8C96BE" opacity="${f(0.25 + i * 0.05)}"/>`).join('');
      // scanner tunnel: hazard frame, blue light inside, a sheet of scan light across the belt
      const sx0 = 612, sx1 = 724, sy = 430;
      back += `${pool(668, 490, 120, 90, a, 0.6)}<rect x="${sx0}" y="${sy}" width="${sx1 - sx0}" height="${belt - sy}" fill="#090B18"/>`;
      back += `<rect x="${sx0 + 10}" y="${sy + 18}" width="${sx1 - sx0 - 20}" height="${belt - sy - 18}" fill="${K.linear(a, '#0B1030', true, 0.75, 0.1)}"/>`;
      back += `${K.hazard(sx0 - 14, sy - 22, sx1 - sx0 + 28, 22, C.YEL, '#14151C', 14)}${K.hazard(sx0 - 14, sy - 22, 14, belt - sy + 22, C.YEL, '#14151C', 14)}`;
      back += `<rect x="${sx0 + 30}" y="${sy + 8}" width="4" height="${belt - sy - 8}" fill="#BFE3FF" opacity="0.9"/>${K.beam(sx0 + 32, sy + 10, sx0 - 40, belt - 4, 60, '#7CC2FF', 0.35)}`;
      back += blink(sx1 - 10, sy - 32, C.YEL, 5);
      // the hero box, already moving: tilted back by the jolt, faint trail, speed lines
      const bx = 482, bw = 162, bh = 122, tilt = -3;
      back += pool(bx, belt - 80, 230, 150, '#FFC93C', 0.4);
      back += [0.1, 0.05].map((op, i) => `<g ${tr(bx - 34 * (i + 1), belt - 2, 1, tilt)} opacity="${op}">${box(bw, bh, C.YEL, { tape: false })}</g>`).join('');
      back += [[-46, 110], [-86, 150], [-124, 90]].map(([y, l], i) => `<rect x="${f(bx - bw / 2 - 26 - l)}" y="${belt + y - 3}" width="${l}" height="6" rx="3" fill="#FFE7A8" opacity="${0.55 - i * 0.1}"/>`).join('');
      back += `${K.shadow(bx + 8, belt + 2, bw * 0.55, 0.45)}<g ${tr(bx, belt - 2, 1, tilt)}>${o.obj && o.obj !== 'box' ? obj(o.obj, 150, { m }) : box(bw, bh, C.YEL, { label: true })}</g>`;

      // the clock hangs from the roof beside the question: 11:47 at night -> "by morning?"
      const [hh, mm] = o.clock ?? ctx.wopts.clock ?? [11, 47];
      const cx = o.clockAt?.[0] ?? 862, cy = o.clockAt?.[1] ?? 92, r = o.clockR ?? 54;
      let front = `<rect x="${cx - 26}" y="-10" width="5" height="${cy - r + 10}" fill="#11131F"/><rect x="${cx + 21}" y="-10" width="5" height="${cy - r + 10}" fill="#11131F"/>`;
      front += `<g ${tr(cx, cy)}><g transform="${m ? 'scale(-1 1)' : ''}">${K.clock(r, hh, mm, { glow: '#FFD58A' })}<g ${tr(0, r * 0.42)}>${K.label('PM', r * 0.24, '#8A90A6')}</g></g></g>`;

      const pix = o.pix === false ? false : { x: 744, y: 352, s: 0.7, face: 2, scan: [960, 470], beamW: 230 };
      return {
        back, front, focus: [bx, belt - 90], focusR: 200, box: [370, 380, 260, 170],
        zero: { x: 205, height: 0.42, st: { face: 3, hl: [72, 150], hr: [149, 124], fl: [82, 206], fr: [124, 202], lean: 11, headR: 4, look: [7, 0], pose: 'neutral', ...(o.zst || {}) } },
        pix, textZone: 'tr', textBox: { x: 620, y: 30, w: 620, h: 250 },
      };
    },
    // ---------------------------------------------------------------- CURIOSITY: things vanish into the system
    // an object rides the belt into the mouth of the system; ZERO leans in to see where it goes
    mouth(ctx) {
      const o = ctx.opts, g = o.glow ?? '#4FA8FF';
      let back = `<g ${tr(1070, 610)}>${K.mouth(290, 270, { glow: g })}</g>`;
      back += `<g ${tr(-40, 570)}>${K.conveyor(1030, '#3A4160', { legs: 80 })}</g>`;
      back += `<g ${tr(1010, 562)}>${o.obj === 'box' || !o.obj ? box(120, 92, brown[1]) : obj(o.obj, 100, { m: ctx.m, c: o.c })}</g>`;
      back += `<g ${tr(1070, 610)} opacity="0.9">${K.mouth(290, 270, { stripsOnly: true })}</g>`;
      back += pool(1080, 470, 200, 220, g, 0.45);
      const front = `<g ${tr(680, 562)}>${obj(o.obj ?? 'box', o.objH ?? 150, { m: ctx.m, c: o.c, amount: o.amount })}</g>`;
      return { back, front, focus: [1060, 450], focusR: 240, box: [600, 300, 640, 300], zero: { x: 270, st: { pose: 'reach', lean: 8, ...(o.zst || {}) } }, pix: { x: 905, y: 300, s: 0.85, face: 2, scan: [1075, 470], beamW: 200 }, textZone: 'tr' };
    },
    // ZERO rides the thing we follow (a coin, a parcel) along a glowing track from where it starts to where it goes
    ride(ctx) {
      const o = ctx.opts, a = ctx.accent ?? '#3FD0FF';
      const track = `M -100 700 C 260 640 520 610 760 560 S 1040 500 1150 500`;
      let back = `<path d="${track}" fill="none" stroke="${shade(a, 0.5)}" stroke-width="40" stroke-linecap="round"/><path d="${track}" fill="none" stroke="${a}" stroke-width="16" stroke-linecap="round"/><path d="${track}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="10 70" stroke-linecap="round" opacity="0.9"/>`;
      back += `<g ${tr(1140, 520)}>${pool(0, -60, 220, 200, a, 0.7)}${obj(o.dest ?? 'bank', o.destH ?? 190, { m: ctx.m, sign: o.sign })}</g>`;
      back += [[880, 538, 18], [960, 520, 14], [1030, 508, 11]].map(([x, y, r]) => `<g ${tr(x, y - r)}>${K.coin(r)}</g>`).join('');
      const front = `<g ${tr(120, 720)}>${obj(o.src ?? 'terminal', o.srcH ?? 300, { m: ctx.m, amount: o.amount })}</g>`;
      const veh = `<g ${tr(330, 618, 1, -8)}>${o.vehicle === 'box' ? box(190, 70, C.YEL, { label: true }) : `<ellipse cx="0" cy="0" rx="120" ry="34" fill="${C.AMBER}"/><ellipse cx="0" cy="-12" rx="120" ry="34" fill="${C.YEL}"/><ellipse cx="0" cy="-12" rx="84" ry="22" fill="none" stroke="${C.AMBER}" stroke-width="6"/>`}</g>`;
      return { back: back + veh, front, focus: [1140, 450], focusR: 200, box: [900, 320, 360, 220], zero: { x: 330, y: 600, height: 0.42, noShadow: true, st: { pose: 'run', face: 3, lean: 10, look: [6, 0], ...(o.zst || {}) } }, pix: { x: 560, y: 200, s: 0.8, face: 2 }, textZone: 'tr' };
    },
    // money (or data) disappears through a pipe behind a wall; ZERO has just noticed
    pipe(ctx) {
      const o = ctx.opts, a = ctx.accent;
      let back = `<g ${tr(560, 640)}>${obj(o.src ?? 'cash', o.srcH ?? 120, { m: ctx.m })}</g>`;
      // the wall, with a broken hole showing the hidden room
      const wc = o.wallC ?? tint(ctx.fam.wall ?? '#2A3048', 0.28);
      back += `<rect x="760" y="250" width="600" height="390" fill="${wc}"/><rect x="760" y="250" width="22" height="390" fill="${shade(wc, 0.45)}"/>${Array.from({ length: 6 }, (_, i) => `<rect x="782" y="${262 + i * 64}" width="600" height="3" fill="${shade(wc, 0.2)}"/>`).join('')}`;
      back += `<path d="M 860 330 L 930 300 L 1010 320 L 1110 296 L 1180 340 L 1170 430 L 1200 520 L 1120 580 L 1000 560 L 900 590 L 850 500 L 880 420 Z" fill="#06070D"/><path d="M 860 330 L 930 300 L 1010 320 L 1110 296 L 1180 340 L 1170 430 L 1200 520 L 1120 580 L 1000 560 L 900 590 L 850 500 L 880 420 Z" fill="none" stroke="${tint(wc, 0.3)}" stroke-width="8" stroke-linejoin="round"/>`;
      back += pool(1040, 450, 200, 160, o.glow ?? '#7B5CD6', 0.6);
      back += `<g ${tr(1060, 560)}>${obj(o.sink ?? 'vault', o.sinkH ?? 200, { m: ctx.m, open: 0.45 })}</g>`;
      const path = [[560, 520], [560, 380], [1060, 380], [1060, 450]];
      back += K.pipe(path, 46, o.pipeC ?? '#8C96B0');
      // glass windows with coins inside
      back += [[560, 470], [650, 380], [740, 380]].map(([x, y]) => `<rect x="${x - 22}" y="${y - 20}" width="44" height="40" rx="8" fill="#0D1020"/><g ${tr(x, y)}>${K.coin(14)}</g>`).join('');
      back += [[900, 360], [960, 410], [1000, 370]].map(([x, y], i) => `<g ${tr(x, y, 1, i * 20)}>${K.coin(16)}</g>`).join('');
      return { back, front: '', focus: [1040, 440], focusR: 220, box: [520, 300, 700, 340], zero: { x: 250, st: { ...(o.zst || {}) } }, pix: { x: 900, y: 270, s: 0.75, face: 5, halo: 'blue', scan: [1050, 470], beamW: 140 }, textZone: 'tr' };
    },
    // a door / opening glows at the end of a long corridor of repeated things (aisles, servers, slots, seats, doors)
    corridor(ctx) {
      const o = ctx.opts, item = o.item ?? 'shelves', vx = o.vx ?? 820, vy = o.vy ?? 420;
      let back = '';
      const n = 9;
      for (let i = n; i >= 0; i--) {
        const t = (i / n) ** 1.7;                      // 0 near .. 1 far
        const sc = 1.25 * (1 - t) + 0.08;
        for (const side of [-1, 1]) {
          if (t < 0.3 && side < 0) continue;            // keep the rows nearest ZERO clear
          const x = vx + side * (560 * (1 - t) + 30), y = vy + (ctx.floor + 40 - vy) * (1 - t);
          const g = `<g ${tr(x, y, sc)} opacity="${f(1 - t * 0.5)}">`;
          if (item === 'servers') back += `${g}<g ${tr(-60, 0)}>${K.server(420, { seed: i * 2 + side })}</g></g>`;
          else if (item === 'slots') back += `${g}${K.slot({ c: ['#B23A48', '#7B5CD6', '#2F80ED'][(i + (side > 0)) % 3], m: ctx.m })}</g>`;
          else if (item === 'seats') back += `${g}${[0, 1, 2].map(j => seatFront(side * j * 118, (i * 3 + j + (side > 0)) % 5)).join('')}<rect x="${side > 0 ? -60 : -300}" y="-450" width="360" height="80" rx="14" fill="#7E879C"/><rect x="${side > 0 ? -60 : -300}" y="-380" width="360" height="10" fill="#5E667C"/></g>`;
          else if (item === 'doors') back += `${g}${K.door(150, 280, ['#4A3F6B', '#3A4E6B', '#5A3F5B'][(i + (side > 0)) % 3])}</g>`;
          else if (item === 'screens') back += `${g}<g ${tr(0, -260)}>${K.screen(240, { inner: K.chart(180, 80, [0.2, 0.5, 0.3, 0.7, 0.5, 0.9], rnd(i + side) > 0.5 ? C.GREEN : C.RED, { panel: false }).replace('<g>', '<g transform="translate(-90 -40)">') })}</g></g>`;
          else back += `${g}<g ${tr(-140, 0)}>${K.shelf(280, 4, i * 3 + (side > 0) * 7, { h: 360, c: '#C9C2B5', tags: true })}</g></g>`;
        }
      }
      // the thing at the end of the corridor, in a pool of accent light
      const end = o.end ? `<g ${tr(vx, vy + 40)}>${pool(0, -60, 200, 180, ctx.accent, 0.8)}${o.end === 'exit' ? K.door(90, 170, '#2A2D3A', { open: 0.6, sign: o.sign ?? 'CANCEL', m: ctx.m, edge: C.CORAL, color: C.CORAL }) : obj(o.end, o.endH ?? 120, { m: ctx.m })}</g>` : '';
      return { back: back + end, front: '', focus: [vx, vy], focusR: 260, box: [vx - 140, vy - 120, 280, 240], zero: { x: 240, st: { ...(o.zst || {}) } }, pix: o.pix === false ? false : { x: vx - 170, y: vy - 70, s: 0.7, face: 2, scan: [vx, vy + 10], beamW: 90 }, textZone: o.textZone ?? 'tr', textBox: { h: 250 } };
    },
    // ZERO peeks at what is watching him: eyes and cameras in the dark, copies of him on screens
    watcher(ctx) {
      const o = ctx.opts;
      let back = `<rect x="560" y="200" width="760" height="440" fill="#05060C" opacity="0.75"/>`;
      [[700, 420, 34], [860, 330, 26], [1010, 440, 40], [1160, 340, 28], [900, 540, 22], [1180, 540, 30]].forEach(([x, y, r], i) => { back += `<g ${tr(x, y)}>${pool(0, 0, r * 3, r * 2, '#3FD0FF', 0.4)}${K.eye(r, { iris: i % 2 ? '#3FD0FF' : C.CORAL })}</g>`; });
      back += `<g ${tr(600, 230)}>${K.camera({ r: 10 })}</g><g ${tr(1280, 250) } transform="scale(-1 1)">${K.camera({ r: 10 })}</g>`;
      // little profile cards of ZERO being copied
      back += [[640, 560], [760, 600], [1080, 610]].map(([x, y], i) => `<g ${tr(x, y, 0.9, -6 + i * 6)}><rect x="-50" y="-34" width="100" height="68" rx="8" fill="#13285C"/><circle cx="-24" cy="-4" r="16" fill="#fff"/><rect x="0" y="-14" width="36" height="6" rx="3" fill="#3FD0FF"/><rect x="0" y="0" width="28" height="6" rx="3" fill="#3FD0FF" opacity="0.6"/></g>`).join('');
      return { back, front: '', focus: [920, 440], focusR: 300, box: [600, 300, 640, 320], zero: { x: 270, st: { ...(o.zst || {}) } }, onZero: o.phone === false ? null : inHand('phone', 90, 50, -120, -10), pix: false, textZone: 'tr' };
    },

    // ---------------------------------------------------------------- CONSEQUENCE: it happens to ZERO
    // ZERO himself is on the belt with a label stuck on him, going under the scanner
    scanned(ctx) {
      const o = ctx.opts, laser = o.laser ?? C.RED;
      let back = `<g ${tr(-60, 560)}>${K.conveyor(1400, '#3A4160', { legs: 80 })}</g>`;
      back += [[80, 120, 90], [600, 130, 110], [800, 110, 90]].map(([x, w, h], i) => `<g ${tr(x, 552)}>${o.items ? obj(o.items, h, { m: ctx.m }) : box(w, h, brown[i % 4])}</g>`).join('');
      back += `<g ${tr(330, 560)}><rect x="-150" y="-430" width="40" height="430" fill="#2A3048"/><rect x="110" y="-430" width="40" height="430" fill="#2A3048"/><rect x="-170" y="-470" width="340" height="60" rx="10" fill="#1A1E33"/><rect x="-60" y="-454" width="120" height="26" rx="5" fill="${laser}"/></g>`;
      back += `<g ${tr(330, 125)}>${cone(0, 0, 40, 300, 440, laser, 0.38)}</g>`;
      const sticker = (x, y, sc) => o.sticker === 'price' ? `<g ${tr(x - 40 * sc, y, sc * 0.45, -10)}>${K.pricetag(o.price ?? '$0.99', 220)}</g>` : `<g ${tr(x, y, sc)}><rect x="-34" y="-22" width="68" height="44" rx="4" fill="#F6F1E6" transform="rotate(-8)"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${-24 + i * 10}" y="-6" width="${i % 2 ? 3 : 6}" height="20" fill="${C.INK}" transform="rotate(-8)"/>`).join('')}<rect x="-24" y="-16" width="40" height="5" fill="${C.INK}" transform="rotate(-8)"/></g>`;
      return { back, front: `<rect x="0" y="0" width="${W}" height="${H}" fill="${laser}" opacity="0.05"/>`, focus: [330, 300], focusR: 220, box: [170, 100, 330, 460], zero: { x: 330, y: 552, noShadow: true, height: 0.44, st: { ...(o.zst || {}) } }, onZero: (x, y, s) => sticker(x + 2 * s, y - 62 * s, s * 0.62), pix: { x: 960, y: 420, s: 0.9, face: 5, halo: 'red' }, textZone: 'tr' };
    },
    // a big coin cut into slices that tiny people carry away to the banks; ZERO is left with one sliver
    slices(ctx) {
      const o = ctx.opts, cx = 700, cy = 470, r = 150, n = o.n ?? 5;
      const pt = (a, rr, x = cx, y = cy) => [x + rr * Math.cos(a * Math.PI / 180), y + rr * Math.sin(a * Math.PI / 180)];
      const wedge = (x, y, rr, a0, a1) => { const [x0, y0] = pt(a0, rr, x, y), [x1, y1] = pt(a1, rr, x, y); return `<path d="M ${f(x)} ${f(y)} L ${f(x0)} ${f(y0)} A ${rr} ${rr} 0 0 1 ${f(x1)} ${f(y1)} Z" fill="${C.YEL}"/><path d="M ${f(x0)} ${f(y0)} A ${rr} ${rr} 0 0 1 ${f(x1)} ${f(y1)}" fill="none" stroke="${C.AMBER}" stroke-width="${f(rr * 0.08)}"/>`; };
      // where the coin was: a dashed ghost, and the one slice left
      let back = `${K.shadow(cx, 640, 170, 0.35)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#000" opacity="0.25"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.YEL}" stroke-width="5" stroke-dasharray="16 12" opacity="0.7"/>`;
      back += wedge(cx, cy, r, 150, 150 + 360 / n);
      // the other slices walk away toward the buildings, smaller and smaller
      const dest = o.dest ?? 'bank';
      const far = [[1010, 380, 0.55], [1150, 330, 0.42], [900, 300, 0.36], [1200, 470, 0.62]];
      far.forEach(([x, y, k], i) => {
        back += `<g ${tr(x + 40, y - 70 * k, k * 0.7)}>${pool(0, -120, 200, 160, ctx.accent, 0.35)}${obj(dest, 260, { m: ctx.m })}</g>`;
      });
      let front = '';
      [[880, 600, 0.95, -60], [1010, 520, 0.75, -10], [930, 470, 0.6, 30], [1150, 560, 0.85, 80]].forEach(([x, y, k, a0], i) => {
        front += `<g ${tr(x, y, k)}>${person(['#5C6B8A', '#7A5C5C', '#6E7A5C', '#8A6E5C'][i % 4], { seed: i * 3, pose: 'walk' })}${wedge(0, -175, 70, a0, a0 + 360 / n)}</g>`;
      });
      front += `<g ${tr(cx, cy)}>${K.label('$', 110, C.YEL, { m: ctx.m })}</g>`;
      return { back, front, focus: [cx + 120, cy], focusR: 300, box: [cx - 170, 300, 600, 340], zero: { x: 260, st: { ...(o.zst || {}) } }, pix: false, textZone: 'tr', textBox: { h: 250 } };
    },
    // an open container that should be full is almost empty (vault, wallet, seat): ZERO stares into it
    empty(ctx) {
      const o = ctx.opts, x = 960, y = 480, r = 160;
      let back = `<g ${tr(x, y)}><circle r="${r * 1.1}" fill="#2A2F45"/><circle r="${r}" fill="#090A12"/>${pool(0, 40, r * 0.9, r * 0.7, ctx.accent, 0.5)}
        <rect x="${-r * 0.7}" y="40" width="${r * 1.4}" height="10" fill="#3A4160"/><rect x="${-r * 0.7}" y="-30" width="${r * 1.4}" height="10" fill="#3A4160"/><g ${tr(20, 40)}>${K.coin(16)}</g>
        <g ${tr(-60, 40, 0.5)}><rect x="-30" y="-46" width="60" height="46" fill="#F6F1E6" transform="rotate(-6)"/><text x="0" y="-14" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="20" fill="${C.INK}" transform="${ctx.m ? 'scale(-1 1)' : ''} rotate(-6)">IOU</text></g></g>`;
      back += `<g ${tr(x + r * 1.15, y, 1)}><g transform="scale(0.42 1)">${K.vault(r, { open: 0 })}</g></g>`;
      return { back, front: '', focus: [x, y], focusR: 260, box: [x - 180, y - 170, 400, 340], zero: { x: 300, st: { ...(o.zst || {}) } }, pix: { x: 700, y: 330, s: 0.8, face: 5, scan: [x, y + 30], beamW: 140 }, textZone: 'tr', textBox: { h: 240 } };
    },
    // the hamster wheel: ZERO runs inside it and the belt drives a machine that pays someone else
    wheel(ctx) {
      const o = ctx.opts, cx = 330, cy = 400, r = 250;
      let back = `<g ${tr(cx, cy)}><circle r="${r}" fill="none" stroke="#5A6385" stroke-width="22"/><circle r="${r}" fill="none" stroke="#7C86A8" stroke-width="6"/>${Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="${-r}" width="6" height="${r}" fill="#3A4160" transform="rotate(${i * 30})"/>`).join('')}<circle r="22" fill="#7C86A8"/></g>`;
      back += `<rect x="${cx - 14}" y="${cy}" width="28" height="${ctx.floor - cy}" fill="#3A4160"/>`;
      back += `<path d="M ${cx} ${cy} L 900 ${cy - 60}" stroke="#2A2D3A" stroke-width="10" stroke-dasharray="18 8"/>`;
      back += `<g ${tr(980, 640)}>${obj(o.sink ?? 'bank', 330, { m: ctx.m, sign: o.sign })}</g>`;
      back += [[1100, 600], [1150, 620], [1060, 625], [1200, 630]].map(([x, y]) => `<g ${tr(x, y)}>${K.coin(18)}</g>`).join('');
      const front = `<g ${tr(cx, cy)}><path d="M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0" fill="none" stroke="#7C86A8" stroke-width="10" opacity="0.6"/></g>`;
      return { back, front, focus: [980, 460], focusR: 240, box: [780, 300, 420, 340], zero: { x: cx, y: cy + r - 14, height: 0.42, noShadow: true, st: { pose: 'run', lean: 12, ...(o.zst || {}) } }, pix: false, textZone: 'tr' };
    },
    // ZERO runs late with his suitcase while the plane door closes in front of him
    gate(ctx) {
      const o = ctx.opts, dx = 960, k = o.closed ?? 0.7;
      // the fuselage, seen from the jet bridge: white skin, a row of windows, the open door lit from inside
      let back = `<path d="M 600 300 Q 900 250 1400 270 L 1400 660 Q 900 680 600 640 Z" fill="#E9EDF4"/><path d="M 600 560 Q 900 600 1400 580 L 1400 660 Q 900 680 600 640 Z" fill="#C9CFDA"/>
        <rect x="600" y="380" width="800" height="16" fill="${C.BLUE}"/>${[660, 740, 1160, 1240, 1320].map(x => `<rect x="${x}" y="330" width="34" height="44" rx="16" fill="#3B4A66"/>`).join('')}
        <rect x="${dx - 95}" y="330" width="190" height="300" rx="40" fill="#2A2D3A"/><rect x="${dx - 80}" y="345" width="160" height="272" rx="34" fill="#FFE7A8"/>${pool(dx, 480, 220, 240, '#FFE7A8', 0.75)}
        <g ${tr(dx - 80 + 160 * (1 - k), 345)}><rect width="${f(160 * k)}" height="272" rx="30" fill="#D6DCE6"/><rect x="${f(160 * k - 30)}" y="120" width="12" height="40" rx="6" fill="#8A94A8"/></g>`;
      back += `<g ${tr(dx, 300)}><rect x="-120" y="-28" width="240" height="56" rx="10" fill="#0D1020"/>${K.label(o.sign ?? 'CLOSED', 30, C.CORAL, { m: ctx.m, ls: 3 })}</g>`;
      back += `<rect x="0" y="600" width="${W}" height="140" fill="#2B2F4A"/>`;
      return { back, front: '', focus: [dx, 480], focusR: 260, box: [dx - 160, 300, 320, 340], zero: { x: 330, st: { pose: 'run', face: 9, lean: 14, look: [6, 0], ...(o.zst || {}) } }, onZero: (x, y, s, m) => `<g ${tr(x + (m ? 105 : -105) * s, y, s * 0.62)}>${K.suitcase(C.CORAL)}</g>`, pix: false, textZone: 'tr', textBox: { h: 200 } };
    },
    // ZERO sits on the couch, surrounded by things that each drain his wallet through a thin tube
    swarm(ctx) {
      const o = ctx.opts;
      const tiles = [[640, 340, C.CORAL, 'play'], [800, 300, '#1DB954', 'note'], [960, 330, C.BLUE, 'cloud'], [1110, 300, C.PURPLE, 'game'], [700, 500, '#F2994A', 'box'], [880, 470, C.RED, 'dumbbell'], [1060, 480, '#2E9E5B', 'news'], [1180, 430, '#E84393', 'play']];
      let back = `<g ${tr(300, 640)}>${K.couch('#5B4B7A')}</g>`;
      let front = '';
      const wx = 330, wy = 520;
      tiles.forEach(([x, y, c, g], i) => {
        back += `<path d="M ${x} ${y} Q ${f((x + wx) / 2)} ${f(Math.max(y, wy) + 80)} ${wx} ${wy}" fill="none" stroke="${shade(c, 0.2)}" stroke-width="7" opacity="0.8"/>`;
        const tx = (x + wx) / 2, ty = Math.max(y, wy) + 40;
        back += `<g ${tr(f(x + (wx - x) * 0.35), f(y + (ty - y) * 0.5))}>${K.coin(11)}</g>`;
        front += `<g ${tr(x, y, 1, (i % 3 - 1) * 6)}>${pool(0, 0, 90, 90, c, 0.45)}${K.app(c, g, 86)}</g>`;
      });
      return { back, front, focus: [900, 400], focusR: 320, box: [580, 240, 680, 330], zero: { x: 330, y: 600, height: 0.4, st: { ...(o.zst || {}) } }, onZero: (x, y, s, m) => `<g ${tr(x + (m ? -40 : 40) * s, y - 50 * s, s * 0.45)}>${K.wallet('#6B4E3D', { empty: true })}</g>`, pix: false, textZone: 'tr' };
    },
    // ZERO under a giant umbrella full of holes, paying into a tower that stays dry
    umbrella(ctx) {
      const o = ctx.opts;
      let back = `<g ${tr(1060, 650)}>${pool(0, -260, 220, 260, ctx.accent, 0.35)}${obj('tower', 390, { logo: C.GREEN })}</g>`;
      back += K.pipe([[340, 560], [600, 560], [600, 470], [1000, 470]], 22, '#8C96B0') + [[460, 560], [720, 470], [860, 470]].map(([x, y]) => `<g ${tr(x, y)}>${K.coin(13)}</g>`).join('');
      const front = `<g ${tr(250, 270)}>${K.umbrella(220, C.CORAL, { holes: [[-120, -60, 20], [40, -140, 16], [140, -40, 18], [-30, -40, 14]], shaft: 120 })}</g>` + K.rain(W, H, 70, '#9FC3E6', 9) + [[130, 300], [290, 230], [390, 330], [220, 320]].map(([x, y], i) => `<path d="M ${x} ${y} l -4 ${40 + i * 10}" stroke="#9FC3E6" stroke-width="6" stroke-linecap="round" opacity="0.9"/>`).join('');
      return { back, front, focus: [1060, 420], focusR: 240, box: [930, 300, 260, 350], zero: { x: 250, st: { ...(o.zst || {}) } }, pix: false, textZone: 'tr', textBox: { h: 240 } };
    },
    // a giant stamp comes down on ZERO's paper
    stamp(ctx) {
      const o = ctx.opts;
      let back = `<g ${tr(840, 640)}><rect x="-260" y="-150" width="520" height="22" rx="6" fill="#5A4636"/><rect x="-230" y="-128" width="24" height="128" fill="#3A2E24"/><rect x="206" y="-128" width="24" height="128" fill="#3A2E24"/></g>`;
      back += `<g ${tr(840, 486, 1, -4)}><rect x="-170" y="-14" width="340" height="18" rx="3" fill="#F6F1E6"/><g ${tr(40, -8, 1, -10)}><rect x="-110" y="-30" width="220" height="60" rx="8" fill="none" stroke="${C.RED}" stroke-width="7" opacity="0.85" transform="scale(1 0.32)"/></g></g>`;
      back += `<g ${tr(840, 455, 0.78)}>${K.stampTool(C.RED)}</g><g ${tr(840, 470)}><path d="M -180 -30 l -40 -10 M 180 -30 l 40 -10 M -170 -70 l -40 -30 M 170 -70 l 40 -30" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.6"/></g>`;
      back += `<g ${tr(1100, 600, 1, 8)}><rect x="-70" y="-90" width="140" height="90" fill="#F6F1E6"/><g ${tr(0, -45, 1, -14)}><rect x="-62" y="-22" width="124" height="44" rx="6" fill="none" stroke="${C.RED}" stroke-width="6"/>${K.label(o.word ?? 'DENIED', 26, C.RED, { m: ctx.m })}</g></g>`;
      return { back, front: '', focus: [840, 470], focusR: 260, box: [600, 300, 560, 340], zero: { x: 260, st: { ...(o.zst || {}) } }, pix: false, textZone: o.textZone ?? 'tr', textBox: { h: 210 } };
    },
    // ZERO standing on a price chart. mode 'cliff': the line drops off a cliff right in front of him;
    // mode 'pen': a giant mechanical pen in the dark is drawing the line he stands on
    chart(ctx) {
      const o = ctx.opts, mode = o.mode ?? 'cliff';
      const top = `M -60 600 L 120 560 L 260 584 L 400 530`;
      let back = '';
      if (mode === 'cliff') {
        back += `<rect x="470" y="300" width="900" height="460" fill="#05060C" opacity="0.6"/><path d="${top} L 470 548 L 470 720 L -60 720 Z" fill="#14402C"/><path d="${top} L 470 548" fill="none" stroke="${C.GREEN}" stroke-width="18" stroke-linejoin="round" stroke-linecap="round"/>`;
        back += `<path d="M 470 548 L 520 600 L 640 720" fill="none" stroke="${C.RED}" stroke-width="18" stroke-linecap="round"/><rect x="520" y="560" width="900" height="200" fill="#05060C"/>${pool(860, 720, 460, 160, C.RED, 0.7)}`;
        back += [[620, 630, 0], [720, 680, 40], [560, 690, -30], [820, 640, 20]].map(([x, y, r]) => `<g ${tr(x, y, 1, r)}>${K.coin(18)}</g>`).join('');
        return { back, front: '', focus: [700, 620], focusR: 260, box: [520, 520, 640, 200], zero: { x: 330, y: 572, height: 0.42, st: { ...(o.zst || {}) } }, pix: false, textZone: 'tr' };
      }
      // pen mode: the line continues up and right, drawn right now by a pen on a long arm out of the dark
      const line = `${top} L 560 470 L 700 520 L 860 400`;
      back += `<path d="${line} L 860 720 L -60 720 Z" fill="#14402C"/><path d="${line}" fill="none" stroke="${C.GREEN}" stroke-width="18" stroke-linejoin="round" stroke-linecap="round"/>`;
      back += `<path d="M 1400 520 L 1150 470 L 960 330" fill="none" stroke="#3A4766" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/><circle cx="1150" cy="470" r="34" fill="#55618A"/><circle cx="1150" cy="470" r="12" fill="#2A3350"/>`;
      back += `<g ${tr(872, 392, 1.7, -40)}><rect x="-22" y="-120" width="44" height="120" rx="10" fill="#E9E4DA"/><rect x="-22" y="-120" width="44" height="26" rx="10" fill="#C9CED8"/><path d="M -22 0 L 0 34 L 22 0 Z" fill="#E9E4DA"/><path d="M -7 22 L 0 34 L 7 22 Z" fill="${C.GREEN}"/></g>`;
      back += pool(870, 400, 160, 120, C.GREEN, 0.6);
      return { back, front: '', focus: [880, 400], focusR: 240, box: [780, 300, 420, 260], zero: { x: 300, y: 576, height: 0.42, st: { ...(o.zst || {}) } }, pix: false, textZone: 'tr', textBox: { h: 230 } };
    },
    // ZERO pushes a cart that's grown into a tower of things he never wanted; a receipt trails to the floor
    overload(ctx) {
      const o = ctx.opts, cols = [C.CORAL, C.BLUE, C.YEL, C.GREEN, '#F2994A', C.PURPLE, '#EB5757'];
      let back = '';
      let pile = '';
      for (let r = 0; r < 7; r++) for (let k = 0; k < 5 - Math.floor(r / 2); k++) pile += `<g ${tr(-90 + k * 48 + (r % 2) * 22, -150 - r * 52)}>${K.product(['box', 'bottle', 'can'][(r + k) % 3], cols[(r * 3 + k) % 7], 1.15)}</g>`;
      back += `<g ${tr(620, 640)}>${pile}${K.cart('#B9C2CF')}</g>`;
      back += `<g ${tr(860, 380, 1, 10)}>${K.receipt(110, 250, { mark: true })}</g>`;
      return { back, front: '', focus: [620, 380], focusR: 260, box: [500, 240, 420, 400], zero: { x: 300, st: { pose: 'push', lean: 6, ...(o.zst || {}) } }, pix: false, textZone: 'tr' };
    },
    // same box, much less inside: ZERO peeks into a big package that holds a tiny product
    shrink(ctx) {
      const o = ctx.opts, x = 820;
      let back = `<g ${tr(x, 640)}>${K.shadow(0, 0, 220, 0.35)}<rect x="-180" y="-380" width="360" height="380" fill="${o.c ?? C.CORAL}"/><rect x="-180" y="-380" width="360" height="70" fill="${tint(o.c ?? C.CORAL, 0.2)}"/>
        <rect x="-150" y="-300" width="300" height="290" fill="#0E0F18"/>${pool(0, -100, 160, 140, ctx.accent, 0.5)}<g ${tr(40, -14)}>${K.product('box', o.c ?? C.CORAL, 1.2)}</g>
        <path d="M -180 -380 L -230 -470 L -60 -470 L -10 -380 Z" fill="${shade(o.c ?? C.CORAL, 0.15)}"/></g>`;
      back += `<g ${tr(1090, 320)}>${K.pricetag(o.price ?? '$4.99', 200, { m: ctx.m, r: 10 })}</g>`;
      return { back, front: '', focus: [x, 520], focusR: 220, box: [640, 260, 360, 380], zero: { x: 300, st: { ...(o.zst || {}) } }, pix: { x: 640, y: 330, s: 0.75, face: 5, scan: [x + 20, 600], beamW: 100 }, textZone: 'tr' };
    },

    // ---------------------------------------------------------------- SCALE / SURPRISE
    // ZERO on a catwalk over a hub of endless belts and thousands of parcels (world: hub)
    hub(ctx) {
      const o = ctx.opts;
      // the catwalk ZERO stands on: grating, kick plate, a rail at hip height (in front of him: depth)
      const back = `<rect x="-200" y="640" width="${W + 400}" height="100" fill="#151A2C"/><rect x="-200" y="640" width="${W + 400}" height="6" fill="#3A4160"/>`;
      const front = `<rect x="-200" y="676" width="${W + 400}" height="60" fill="#10131F"/><rect x="-200" y="596" width="${W + 400}" height="10" rx="5" fill="#E0A100"/><rect x="-200" y="636" width="${W + 400}" height="6" fill="#B07E00"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${40 + i * 120}" y="596" width="8" height="84" fill="#B07E00"/>`).join('')}`;
      return { back, front, focus: [860, 330], focusR: 360, box: [600, 260, 560, 300], zero: { x: 300, y: 664, height: 0.46, st: { ...(o.zst || {}) } }, pix: { x: 640, y: 420, s: 0.8, face: 3 }, textZone: 'tr', textBox: { h: 230 } };
    },
    // one object, impossibly big, towering over ZERO (vault, receipt, price tag, contract, ship, slot machine)
    giant(ctx) {
      const o = ctx.opts, k = o.obj ?? 'receipt';
      const x = o.x ?? 860, h = o.h ?? 760;
      let back = `<g ${tr(x, 680)}>${pool(0, -h * 0.45, h * 0.55, h * 0.5, ctx.accent, 0.45)}${obj(k, h, { m: ctx.m, price: o.price, open: o.open })}</g>`;
      if (k === 'receipt') back += `<g ${tr(x - 40, 640)}><path d="M -100 0 q 120 -40 240 0 q 120 40 240 0" fill="none" stroke="#F6F1E6" stroke-width="26"/></g>`;
      back += `<g ${tr(x + 210, 640, 0.6)}>${person('#5C6B8A', { seed: 4 })}</g>`;
      return { back, front: '', focus: [x, 420], focusR: 340, box: [x - 220, 100, 440, 540], zero: { x: 230, height: 0.36, st: { ...(o.zst || {}) } }, pix: false, textZone: o.textZone ?? 'tl' };
    },
    // one card terminal and a whole planet of banks and networks lit up behind it
    web(ctx) {
      const o = ctx.opts, a = ctx.accent ?? '#3FD0FF', sx = 700, sy = 520;
      let back = `<ellipse cx="760" cy="1180" rx="1200" ry="720" fill="#0E2A4A"/><ellipse cx="760" cy="1180" rx="1200" ry="720" fill="none" stroke="${a}" stroke-width="4" opacity="0.6"/>`;
      const nodes = Array.from({ length: 16 }, (_, i) => { const t = i / 15, ang = Math.PI * (1.08 + t * 0.84); return [760 + Math.cos(ang) * 1150, 1180 + Math.sin(ang) * 690 - rnd(i) * 50]; }).filter(([x, y]) => y < 600 && x > 380);
      nodes.forEach(([x, y], i) => {
        back += `<path d="M ${sx} ${sy - 230} Q ${f((sx + x) / 2)} ${f(Math.min(y, sy) - 220)} ${f(x)} ${f(y - 40)}" fill="none" stroke="${a}" stroke-width="3" opacity="0.7"/><path d="M ${sx} ${sy - 230} Q ${f((sx + x) / 2)} ${f(Math.min(y, sy) - 220)} ${f(x)} ${f(y - 40)}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="6 60" stroke-dashoffset="${i * 17}"/>`;
        back += `<g ${tr(x, y, 0.22 + rnd(i * 3) * 0.12)}>${pool(0, -200, 300, 300, a, 0.5)}${[K.bank(420, 330, '#D9D2C3'), K.tower(220, 520, '#2B3A5C', { seed: i }), K.server(420, { seed: i })][i % 3]}</g>`;
      });
      back += `<g ${tr(sx, sy + 120)}>${pool(0, -200, 240, 200, a, 0.6)}${obj('terminal', 250, { amount: o.amount ?? '$4.50' })}</g><g ${tr(sx + 150, sy + 120)}>${obj('cup', 110)}</g>`;
      return { back, front: '', focus: [sx, sy - 100], focusR: 300, box: [sx - 120, sy - 160, 300, 300], zero: { x: 250, st: { ...(o.zst || {}) } }, pix: false, textZone: 'tr' };
    },
    // a huge machine: one coin goes in, a flood comes out (money creation, cheap production)
    machine(ctx) {
      const o = ctx.opts, x = 860;
      let back = `<g ${tr(x, 640, 0.85)}>${K.shadow(0, 0, 320, 0.4)}<rect x="-260" y="-340" width="520" height="340" rx="20" fill="#3A4766"/><rect x="-260" y="-340" width="520" height="40" rx="20" fill="#4E5C82"/>
        <g ${tr(-130, -190)}>${K.gear(70, '#55618A')}</g><g ${tr(-20, -250)}>${K.gear(44, '#6A77A0', { rot: 15 })}</g>
        <rect x="40" y="-280" width="180" height="110" rx="10" fill="#0D1020"/>${[0, 1, 2].map(i => `<rect x="${60 + i * 52}" y="-262" width="40" height="72" rx="6" fill="${[C.GREEN, C.YEL, C.CORAL][i]}" opacity="0.8"/>`).join('')}
        <path d="M -200 -340 L -200 -420 L -120 -420 L -120 -340" fill="#2A3350"/>${pool(150, -60, 160, 80, '#FFD58A', 0.5)}<rect x="160" y="-110" width="120" height="80" fill="#0D1020"/></g>`;
      back += `<g ${tr(x - 136, 270)}>${o.input === 'raw' ? box(70, 50, brown[2]) : K.coin(26)}</g>`;
      const out = o.output === 'products' ? Array.from({ length: 15 }, (_, i) => `<g ${tr(x + 170 + (i % 5) * 46 + Math.floor(i / 5) * 20, 645 - Math.floor(i / 5) * 56)}>${K.product(['box', 'bottle', 'can'][i % 3], [C.CORAL, C.BLUE, C.GREEN, '#F2994A'][i % 4], 1.15)}</g>`).join('') + `<g ${tr(x + 250, 410)}>${K.pricetag(o.price ?? '$1', 170, { m: ctx.m, r: -8 })}</g>`
        : Array.from({ length: 22 }, (_, i) => `<g ${tr(x + 190 + (i % 7) * 26 + rnd(i) * 10, 630 - Math.floor(i / 7) * 24 - rnd(i * 3) * 8)}>${K.coin(20)}</g>`).join('');
      return { back: back + out, front: '', focus: [x, 460], focusR: 320, box: [x - 240, 330, 600, 310], zero: { x: 260, st: { ...(o.zst || {}) } }, pix: { x: x - 300, y: 330, s: 0.75, face: 5, scan: [x, 470], beamW: 160 }, textZone: 'tr', textBox: { h: 240 } };
    },
    // many small streams from tiny houses flow into one tower (premiums, taxes, fees, subscriptions)
    funnel(ctx) {
      const o = ctx.opts, tx = 1060;
      let back = `<g ${tr(tx, 640)}>${pool(0, -220, 240, 260, ctx.accent, 0.4)}${obj(o.sink ?? 'tower', o.sinkH ?? 360, { m: ctx.m, logo: C.GREEN, sign: o.sign })}</g>`;
      const srcs = [[470, 640], [580, 690], [700, 640], [800, 700], [400, 700]];
      srcs.forEach(([x, y], i) => {
        back += `<path d="M ${x} ${y - 120} Q ${f((x + tx) / 2)} ${f(y - 330 - i * 16)} ${tx - 40} ${470}" fill="none" stroke="${C.YEL}" stroke-width="5" stroke-dasharray="2 22" stroke-linecap="round"/>`;
        back += `<g ${tr(x, y, 0.62)}>${obj(o.src ?? 'house', 150, { c: ['#C96F53', '#5C7A9E', '#8A6E5C', '#6E8A5C', '#9E5C7A'][i] })}</g>`;
        back += [0.3, 0.55, 0.8].map(t => { const qx = (x + tx) / 2, qy = y - 330 - i * 16, px = (1 - t) ** 2 * x + 2 * (1 - t) * t * qx + t * t * (tx - 40), py = (1 - t) ** 2 * (y - 120) + 2 * (1 - t) * t * qy + t * t * 470; return `<g ${tr(px, py)}>${K.coin(12)}</g>`; }).join('');
      });
      return { back, front: '', focus: [tx, 470], focusR: 260, box: [900, 320, 320, 320], zero: { x: 230, st: { ...(o.zst || {}) } }, pix: false, textZone: 'tr', textBox: { h: 240 } };
    },
    // two identical things for one place (two tickets, one seat): something is wrong
    two(ctx) {
      const o = ctx.opts, sx = 860;
      let back = `<g ${tr(sx, 640)}>${pool(0, -140, 200, 200, ctx.accent, 0.55)}${obj(o.slot ?? 'seat', 300, { c: C.BLUE })}</g>`;
      back += `<g ${tr(1110, 640)}>${person('#7A5C5C', { seed: 6, s: 1.7, fx: true })}</g>`;
      back += `<g ${tr(1030, 420, 0.5, 10)}>${obj(o.obj ?? 'ticket', 110, { m: ctx.m, seat: o.seat ?? 'SEAT 14C' })}</g>`;
      return { back, front: '', focus: [sx, 480], focusR: 220, box: [700, 300, 520, 340], zero: { x: 290, st: { ...(o.zst || {}) } }, onZero: (x, y, s, m) => `<g ${tr(x + (m ? -70 : 70) * s, y - 112 * s, s * 0.4, m ? 10 : -10)}>${K.ticket(260, '#FFFFFF', { seat: o.seat ?? 'SEAT 14C' })}</g>`, pix: { x: 860, y: 230, s: 0.75, face: 4 }, textZone: 'tr' };
    },
  };

  window.THEROES = THEROES;
  window.TOBJ = obj;
})();
