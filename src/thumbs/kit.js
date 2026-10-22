// Thumbnail kit: the small pieces every thumbnail world is built from (docs/miniaturas.md).
// Same language as the videos (docs/mundo-vivo.md): ZERO is the only thing with a black outline; the world is flat
// tonal shapes with a lighter top, a darker side and a soft contact shadow, lit by pools of warm, cool or accent light.
// Everything is drawn for a 1280x720 frame and centred on (0,0) unless it says otherwise.
(() => {
  const { COLORS, FONT, esc } = window.PUPPETS;
  const { INK, WHITE, YEL, AMBER, RED, BLUE, CORAL, GREEN, PURPLE } = COLORS;
  const f = n => Math.round(n * 100) / 100;
  const fr = x => x - Math.floor(x);
  const rnd = i => fr(Math.sin(i * 127.1 + 311.7) * 43758.5453);   // deterministic noise
  const hex = c => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v * (1 - k) + B[i] * k).toString(16).padStart(2, '0')).join(''); };
  const shade = (c, k) => mix(c, '#070812', k), tint = (c, k) => mix(c, '#FFFFFF', k);
  const lum = c => { const [r, g, b] = hex(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const tr = (x, y, s = 1, r = 0) => `transform="translate(${f(x)} ${f(y)})${r ? ` rotate(${f(r)})` : ''}${s !== 1 ? ` scale(${f(s)})` : ''}"`;

  // ---------- defs: gradients are created on demand and collected here for the frame's <defs> ----------
  let DEFS = new Map();
  const reset = () => { DEFS = new Map(); };
  const defs = () => [...DEFS.values()].join('');
  const id = s => 't' + s.replace(/[^a-zA-Z0-9]/g, '');
  function radial(color, op = 0.7) {
    const k = id('r' + color + op);
    if (!DEFS.has(k)) DEFS.set(k, `<radialGradient id="${k}"><stop offset="0" stop-color="${tint(color, 0.35)}" stop-opacity="${op}"/><stop offset="0.45" stop-color="${color}" stop-opacity="${f(op * 0.35)}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
    return `url(#${k})`;
  }
  function linear(a, b, vertical = true, oa = 1, ob = 1) {
    const k = id('l' + a + b + vertical + oa + ob);
    if (!DEFS.has(k)) DEFS.set(k, `<linearGradient id="${k}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${a}" stop-opacity="${oa}"/><stop offset="1" stop-color="${b}" stop-opacity="${ob}"/></linearGradient>`);
    return `url(#${k})`;
  }

  // ---------- light ----------
  const pool = (x, y, rx, ry, color, op = 0.7) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry ?? rx)}" fill="${radial(color, op)}"/>`;
  // cone of light from (x,y) pointing down (or to angle a, degrees from straight down)
  const cone = (x, y, w0, w1, len, color, op = 0.45, a = 0) => `<g ${tr(x, y, 1, a)}><path d="M ${-w0 / 2} 0 L ${w0 / 2} 0 L ${w1 / 2} ${len} L ${-w1 / 2} ${len} Z" fill="${linear(color, color, true, op, 0)}"/></g>`;
  // beam between two points (PIX scanning, lasers)
  const beam = (x0, y0, x1, y1, w, color, op = 0.5) => {
    const a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI, d = Math.hypot(x1 - x0, y1 - y0);
    return `<g ${tr(x0, y0, 1, a)}><path d="M 0 -4 L ${f(d)} ${f(-w / 2)} L ${f(d)} ${f(w / 2)} L 0 4 Z" fill="${linear(color, color, false, op, op * 0.35)}"/></g>`;
  };
  const shadow = (x, y, rx, op = 0.35, ry) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry ?? rx * 0.12)}" fill="#000" opacity="${op}"/>`;
  const lamp = (x, y, color = '#FFD58A', o = {}) => `<g ${tr(x, y, o.s ?? 1)}><rect x="-2" y="${-(o.cord ?? 200)}" width="4" height="${o.cord ?? 200}" fill="${o.dark ?? '#11131F'}"/><path d="M -34 12 Q -30 -16 0 -18 Q 30 -16 34 12 Z" fill="${o.shade ?? '#2D6E7E'}"/><ellipse cx="0" cy="12" rx="26" ry="6" fill="${tint(color, 0.5)}"/></g>`;

  // ---------- generic shapes ----------
  // cardboard box seen 3/4: front, lighter top, darker side; (0,0) = bottom-centre of the front face
  function box(w, h, c, o = {}) {
    const d = o.depth ?? 0.22 * Math.min(w, h), side = o.side ?? 1;
    const top = `M ${-w / 2} ${-h} L ${-w / 2 + side * d * 0.7} ${-h - d * 0.55} L ${w / 2 + side * d * 0.7} ${-h - d * 0.55} L ${w / 2} ${-h} Z`;
    const sx = side > 0 ? w / 2 : -w / 2;
    const sd = `M ${sx} ${-h} L ${sx + side * d * 0.7} ${-h - d * 0.55} L ${sx + side * d * 0.7} ${-d * 0.55} L ${sx} 0 Z`;
    return `<g><path d="${top}" fill="${tint(c, 0.2)}"/><path d="${sd}" fill="${shade(c, 0.28)}"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${c}"/>
      ${o.tape === false ? '' : `<rect x="${f(-w * 0.07)}" y="${-h}" width="${f(w * 0.14)}" height="${f(h * 0.32)}" fill="${tint(c, 0.32)}" opacity="0.7"/>`}
      ${o.label ? `<rect x="${f(w * 0.08)}" y="${f(-h * 0.62)}" width="${f(w * 0.32)}" height="${f(h * 0.3)}" rx="3" fill="#F6F1E6"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${f(w * 0.12 + i * w * 0.04)}" y="${f(-h * 0.48)}" width="${f(w * (i % 2 ? 0.012 : 0.022))}" height="${f(h * 0.12)}" fill="${INK}"/>`).join('')}` : ''}</g>`;
  }
  // diagonal hazard stripes in a rect (the "mouth of the system" frame)
  function hazard(x, y, w, h, a = YEL, b = '#14151C', step = 26) {
    const k = id('hz' + a + b + step);
    if (!DEFS.has(k)) DEFS.set(k, `<pattern id="${k}" width="${step * 2}" height="${step * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${step * 2}" height="${step * 2}" fill="${b}"/><rect width="${step}" height="${step * 2}" fill="${a}"/></pattern>`);
    return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="url(#${k})"/>`;
  }
  // a flat person (no outline, muted), feet at (0,0); pose: stand | walk | look | sit
  function person(c = '#6E7A96', o = {}) {
    const skin = o.skin ?? ['#C99A78', '#8D5A3B', '#E3B48F', '#6B4430'][Math.floor(rnd(o.seed ?? 1) * 4)];
    const sw = o.pose === 'walk' ? 9 : 0;
    return `<g ${tr(0, 0, o.s ?? 1)}>${o.shadow === false ? '' : shadow(0, 0, 26, 0.25)}
      <rect x="-15" y="-58" width="12" height="58" rx="6" fill="${shade(c, 0.45)}" transform="rotate(${sw} -9 -58)"/><rect x="3" y="-58" width="12" height="58" rx="6" fill="${shade(c, 0.45)}" transform="rotate(${-sw} 9 -58)"/>
      <rect x="-22" y="-120" width="44" height="70" rx="18" fill="${c}"/>${o.vest ? `<rect x="-22" y="-104" width="44" height="10" fill="${o.vest}"/>` : ''}
      <circle cx="0" cy="-138" r="18" fill="${skin}"/>${o.cap ? `<path d="M -19 -142 Q -18 -160 0 -160 Q 18 -160 19 -142 Z" fill="${o.cap}"/><rect x="${o.fx ? -30 : 4}" y="-146" width="26" height="6" rx="3" fill="${o.cap}"/>` : ''}</g>`;
  }
  // text that stays readable when the scene is mirrored (counter-flips itself)
  const label = (txt, size, color, o = {}) => `<g transform="${o.m ? 'scale(-1 1)' : ''}"><text x="0" y="${f(size * 0.35)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${size}" fill="${color}" ${o.ls ? `letter-spacing="${o.ls}"` : ''}>${esc(txt)}</text></g>`;
  // a dark sign plate with lit letters (OUTBOUND style)
  const plate = (txt, w, h, o = {}) => `<g><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h * 0.18}" fill="${o.fill ?? '#141726'}"/><rect x="${-w / 2 + 6}" y="${-h / 2 + 6}" width="${w - 12}" height="${h - 12}" rx="${h * 0.14}" fill="none" stroke="${o.edge ?? YEL}" stroke-width="3"/>${label(txt, h * 0.46, o.color ?? YEL, { m: o.m, ls: 2 })}</g>`;

  // ---------- money ----------
  const coin = (r = 22, c = YEL) => `<g><ellipse cx="0" cy="${f(r * 0.12)}" rx="${r}" ry="${r}" fill="${AMBER}"/><circle r="${r}" fill="${c}"/><circle r="${f(r * 0.68)}" fill="none" stroke="${AMBER}" stroke-width="${f(r * 0.12)}"/><text x="0" y="${f(r * 0.36)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${f(r * 1.05)}" fill="${AMBER}">$</text></g>`;
  const bill = (w = 90, c = '#5DBB7A') => `<g><rect x="${-w / 2}" y="${-w * 0.24}" width="${w}" height="${w * 0.48}" rx="${w * 0.05}" fill="${c}"/><rect x="${-w / 2 + w * 0.06}" y="${-w * 0.18}" width="${w * 0.88}" height="${w * 0.36}" rx="${w * 0.04}" fill="none" stroke="${shade(c, 0.25)}" stroke-width="${w * 0.03}"/><circle r="${w * 0.12}" fill="${shade(c, 0.2)}"/></g>`;
  const stack = (n, w, c = '#5DBB7A') => Array.from({ length: n }, (_, i) => `<g ${tr(0, -i * w * 0.1)}><rect x="${-w / 2}" y="${-w * 0.1}" width="${w}" height="${w * 0.1}" fill="${i % 2 ? c : shade(c, 0.12)}"/></g>`).join('') + `<g ${tr(0, -n * w * 0.1 - w * 0.05)}><rect x="${-w / 2}" y="${-w * 0.06}" width="${w}" height="${w * 0.12}" fill="${tint(c, 0.15)}"/></g>`;
  // a fat pipe along a polyline with rounded joints; flow = coins travelling inside (visible through glass)
  function pipe(pts, w, c, o = {}) {
    const d = 'M ' + pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L ');
    return `<g><path d="${d}" fill="none" stroke="${shade(c, 0.35)}" stroke-width="${w + 10}" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="${tint(c, 0.35)}" stroke-width="${f(w * 0.18)}" stroke-linejoin="round" stroke-linecap="round" transform="translate(0 ${f(-w * 0.22)})" opacity="0.6"/></g>`;
  }
  const card = (w = 200, c = BLUE, o = {}) => `<g><rect x="${-w / 2}" y="${-w * 0.315}" width="${w}" height="${w * 0.63}" rx="${w * 0.06}" fill="${c}"/><rect x="${-w / 2}" y="${-w * 0.315}" width="${w}" height="${w * 0.2}" rx="${w * 0.06}" fill="${tint(c, 0.12)}" opacity="0.6"/>
    <rect x="${-w * 0.38}" y="${-w * 0.1}" width="${w * 0.17}" height="${w * 0.13}" rx="${w * 0.02}" fill="${YEL}"/><path d="M ${-w * 0.38} ${-w * 0.035} h ${w * 0.17} M ${-w * 0.295} ${-w * 0.1} v ${w * 0.13}" stroke="${AMBER}" stroke-width="${w * 0.012}"/>
    ${[0, 1, 2, 3].map(i => `<rect x="${f(-w * 0.38 + i * w * 0.2)}" y="${f(w * 0.1)}" width="${f(w * 0.15)}" height="${f(w * 0.05)}" rx="${w * 0.02}" fill="${tint(c, 0.5)}"/>`).join('')}
    <circle cx="${w * 0.3}" cy="${-w * 0.17}" r="${w * 0.07}" fill="${tint(c, 0.4)}" opacity="0.8"/><circle cx="${w * 0.38}" cy="${-w * 0.17}" r="${w * 0.07}" fill="${tint(c, 0.6)}" opacity="0.8"/></g>`;
  const terminal = (c = '#2A2F45', o = {}) => `<g>${shadow(0, 4, 90, 0.35)}<path d="M -70 0 L -60 -250 Q -58 -268 -40 -268 L 40 -268 Q 58 -268 60 -250 L 70 0 Z" fill="${c}"/><path d="M 40 -268 Q 58 -268 60 -250 L 70 0 L 50 0 Z" fill="${shade(c, 0.3)}"/>
    <rect x="-44" y="-246" width="88" height="70" rx="8" fill="${o.screen ?? '#7CE0A0'}"/>${o.ok ? label('PAID', 26, '#0E3B22') : label(o.amount ?? '$4.50', 24, '#0E3B22')}
    ${[0, 1, 2].map(r => [0, 1, 2].map(cl => `<rect x="${-40 + cl * 30}" y="${-158 + r * 30}" width="22" height="20" rx="5" fill="${tint(c, 0.25)}"/>`).join('')).join('')}
    ${o.waves !== false ? `<g fill="none" stroke="${YEL}" stroke-width="7" stroke-linecap="round" opacity="0.9"><path d="M 80 -230 q 16 22 0 44"/><path d="M 100 -246 q 26 38 0 76"/></g>` : ''}</g>`;

  // ---------- logistics ----------
  function conveyor(len, c = '#3A3F55', o = {}) { // side view, (0,0) = left end of the belt top
    const legs = Array.from({ length: Math.max(2, Math.round(len / 220) + 1) }, (_, i) => `<rect x="${f(20 + i * (len - 40) / Math.max(1, Math.round(len / 220)))}" y="22" width="12" height="${o.legs ?? 120}" fill="${shade(c, 0.45)}"/>`).join('');
    const rollers = Array.from({ length: Math.floor(len / 34) }, (_, i) => `<circle cx="${17 + i * 34}" cy="12" r="7" fill="${shade(c, 0.5)}"/>`).join('');
    return `<g>${o.legs === 0 ? '' : legs}<rect x="0" y="-6" width="${len}" height="30" rx="8" fill="${c}"/><rect x="0" y="-8" width="${len}" height="8" rx="4" fill="${tint(c, 0.25)}"/>${rollers}</g>`;
  }
  // the mouth of the system: dark opening, strip curtain, hazard frame, light from inside; (0,0) = bottom-centre
  function mouth(w, h, o = {}) {
    const glow = o.glow ?? '#4FA8FF';
    const strips = Array.from({ length: Math.round(w / 34) }, (_, i) => `<rect x="${f(-w / 2 + 6 + i * (w - 12) / Math.round(w / 34))}" y="${-h + 6}" width="${f((w - 12) / Math.round(w / 34) - 5)}" height="${h - 10}" fill="#5A6385" opacity="0.32"/>`).join('');
    if (o.stripsOnly) return `<g>${strips}</g>`;
    return `<g>${hazard(-w / 2 - 34, -h - 34, w + 68, h + 34)}<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#06070D"/>
      <ellipse cx="0" cy="${-h * 0.45}" rx="${w * 0.42}" ry="${h * 0.45}" fill="${radial(glow, 0.85)}"/>${strips}
      ${o.sign ? `<g ${tr(0, -h - 80)}>${plate(o.sign, Math.max(200, o.sign.length * 30), 62, { m: o.m })}</g>` : ''}</g>`;
  }
  function rack(w, h, levels, seed = 1, o = {}) { // warehouse shelving full of boxes; (0,0) = bottom-left
    const c = o.c ?? '#3B5A8C', bc = o.boxes ?? ['#B98A5A', '#A77A4C', '#C69A66', '#8F6A44'];
    let s = `<rect x="0" y="${-h}" width="10" height="${h}" fill="${c}"/><rect x="${w - 10}" y="${-h}" width="10" height="${h}" fill="${c}"/>`;
    for (let l = 0; l < levels; l++) {
      const y = -l * h / levels;
      s += `<rect x="0" y="${f(y - 8)}" width="${w}" height="8" fill="${o.beam ?? '#E07B39'}"/>`;
      let x = 14; let k = 0;
      while (x < w - 30) {
        const bw = 34 + rnd(seed * 13 + l * 7 + k) * 46, bh = Math.min(h / levels - 18, 26 + rnd(seed + l * 3 + k * 5) * 40);
        if (x + bw > w - 14) break;
        if (rnd(seed * 3 + l + k * 11) > (o.gaps ?? 0.12)) s += `<g ${tr(x + bw / 2, y - 8)}>${box(bw, bh, o.yellow && rnd(seed + k * l + 5) > 0.93 ? YEL : bc[Math.floor(rnd(seed + l * 5 + k) * bc.length)], { tape: bw > 40, depth: 6 })}</g>`;
        x += bw + 6; k++;
      }
    }
    return s;
  }
  function truck(c = '#E8E8EE', o = {}) { // side view facing right, (0,0) = ground under the middle
    const cab = o.cab ?? '#2F80ED';
    return `<g>${shadow(0, 2, 230, 0.35)}<rect x="-230" y="-200" width="330" height="170" rx="6" fill="${c}"/><rect x="-230" y="-200" width="330" height="18" fill="${tint(c, 0.4)}"/><rect x="${o.open ? -232 : -2000}" y="-190" width="20" height="160" fill="${shade(c, 0.4)}"/>
      <path d="M 108 -150 L 180 -150 Q 200 -150 210 -120 L 226 -70 L 226 -30 L 108 -30 Z" fill="${cab}"/><path d="M 128 -140 L 176 -140 Q 190 -140 196 -118 L 204 -96 L 128 -96 Z" fill="#9FD0FF"/>
      <rect x="-230" y="-34" width="456" height="14" fill="#262A3A"/>${[-170, -110, 160].map(x => `<circle cx="${x}" cy="-18" r="26" fill="#1A1C26"/><circle cx="${x}" cy="-18" r="11" fill="#8A90A6"/>`).join('')}
      <circle cx="222" cy="-60" r="8" fill="#FFE7A8"/></g>`;
  }
  function plane(c = '#EEF1F6', o = {}) { // side view facing right, (0,0) = fuselage centre; ~700 px long
    const tail = o.tail ?? '#2F80ED';
    const win = Array.from({ length: 16 }, (_, i) => `<rect x="${-230 + i * 32}" y="-30" width="16" height="20" rx="7" fill="${o.lit ? '#FFE7A8' : '#3B4A66'}"/>`).join('');
    return `<g><path d="M -330 -10 Q -330 -60 -270 -64 L 260 -64 Q 340 -60 362 -10 Q 340 40 260 44 L -270 44 Q -330 40 -330 -10 Z" fill="${c}"/>
      <path d="M -330 -10 Q -330 30 -270 44 L 260 44 Q 340 40 362 -10 Z" fill="${shade(c, 0.12)}"/>
      <path d="M -260 -64 L -330 -200 L -280 -200 L -170 -64 Z" fill="${tail}"/><path d="M -60 20 L -170 130 L -110 130 L 60 20 Z" fill="${shade(c, 0.22)}"/>
      ${win}<path d="M 300 -40 Q 330 -40 342 -16 L 300 -16 Z" fill="#3B4A66"/>
      ${o.door ? `<rect x="230" y="-56" width="34" height="88" rx="8" fill="${o.doorOpen ? '#FFE7A8' : shade(c, 0.25)}"/>` : ''}</g>`;
  }

  // ---------- buildings and rooms ----------
  // bank façade with columns and a pediment; (0,0) = ground centre
  function bank(w = 560, h = 380, c = '#D9D2C3', o = {}) {
    const n = o.cols ?? 5, cw = w / (n * 2 + 1);
    const cols = Array.from({ length: n }, (_, i) => `<rect x="${f(-w / 2 + cw * (1 + i * 2))}" y="${-h + 70}" width="${f(cw)}" height="${h - 110}" fill="${tint(c, 0.15)}"/><rect x="${f(-w / 2 + cw * (1 + i * 2) + cw * 0.65)}" y="${-h + 70}" width="${f(cw * 0.35)}" height="${h - 110}" fill="${shade(c, 0.15)}"/>`).join('');
    return `<g>${shadow(0, 0, w * 0.6, 0.3)}<rect x="${-w / 2 - 20}" y="-40" width="${w + 40}" height="40" fill="${shade(c, 0.1)}"/><rect x="${-w / 2}" y="${-h + 50}" width="${w}" height="${h - 90}" fill="${shade(c, 0.35)}"/>${cols}
      <rect x="${-w / 2 - 20}" y="${-h + 40}" width="${w + 40}" height="34" fill="${c}"/><path d="M ${-w / 2 - 30} ${-h + 40} L 0 ${-h - 70} L ${w / 2 + 30} ${-h + 40} Z" fill="${c}"/><path d="M ${-w / 2 + 40} ${-h + 28} L 0 ${-h - 44} L ${w / 2 - 40} ${-h + 28} Z" fill="${shade(c, 0.12)}"/>
      ${o.sign ? `<g ${tr(0, -h + 57)}>${label(o.sign, 26, shade(c, 0.6), { m: o.m, ls: 6 })}</g>` : ''}</g>`;
  }
  // round vault door; open 0..1 swings it; (0,0) = centre
  function vault(r = 200, o = {}) {
    const c = o.c ?? '#9AA3B5';
    const bolts = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<circle cx="${f(Math.cos(a) * r * 0.86)}" cy="${f(Math.sin(a) * r * 0.86)}" r="${f(r * 0.045)}" fill="${shade(c, 0.35)}"/>`; }).join('');
    const spokes = [0, 60, 120].map(a => `<rect x="${-r * 0.36}" y="${-r * 0.03}" width="${r * 0.72}" height="${r * 0.06}" rx="${r * 0.03}" fill="${shade(c, 0.4)}" transform="rotate(${a})"/>`).join('');
    return `<g><circle r="${r * 1.12}" fill="${shade(c, 0.55)}"/><circle r="${r * 1.04}" fill="${o.inside ?? '#0B0D18'}"/>
      <g transform="translate(${f((o.open ?? 0) * r * 1.3)} 0) scale(${f(1 - (o.open ?? 0) * 0.55)} 1)"><circle r="${r}" fill="${c}"/><circle r="${r}" fill="none" stroke="${tint(c, 0.25)}" stroke-width="${r * 0.05}"/><circle r="${r * 0.72}" fill="${shade(c, 0.1)}"/>${bolts}<circle r="${r * 0.14}" fill="${shade(c, 0.4)}"/>${spokes}</g></g>`;
  }
  // a wall of glass windows with a sky behind (airports, offices); (0,0) = top-left
  function glassWall(w, h, sky1, sky2, o = {}) {
    const n = o.n ?? 6;
    return `<g><rect x="0" y="0" width="${w}" height="${h}" fill="${linear(sky1, sky2)}"/>${o.extra ?? ''}${Array.from({ length: n + 1 }, (_, i) => `<rect x="${f(i * w / n - 6)}" y="0" width="12" height="${h}" fill="${o.frame ?? '#1A2033'}"/>`).join('')}<rect x="0" y="${h * 0.62}" width="${w}" height="8" fill="${o.frame ?? '#1A2033'}"/></g>`;
  }
  function board(rows, w, o = {}) { // departure board; rows: [[left, right, colorRight]]; (0,0) = top-centre
    const rh = o.rh ?? 46;
    return `<g><rect x="${-w / 2}" y="0" width="${w}" height="${rows.length * rh + 30}" rx="10" fill="#0D1020"/>${rows.map((r, i) => `<rect x="${-w / 2 + 12}" y="${15 + i * rh}" width="${w - 24}" height="${rh - 8}" rx="5" fill="#161B33"/>
      <g ${tr(-w / 2 + 20 + (w * 0.3), 15 + i * rh + (rh - 8) / 2)}>${label(r[0], rh * 0.46, '#FFD58A', { m: o.m })}</g><g ${tr(w / 2 - 20 - w * 0.17, 15 + i * rh + (rh - 8) / 2)}>${label(r[1], rh * 0.46, r[2] ?? '#7CE0A0', { m: o.m })}</g>`).join('')}</g>`;
  }
  function ticket(w = 260, c = '#FFFFFF', o = {}) { // boarding pass; (0,0) = centre
    const h = w * 0.42;
    return `<g><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * 0.04}" fill="${c}"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h * 0.26}" rx="${w * 0.04}" fill="${o.band ?? BLUE}"/><rect x="${-w / 2}" y="${-h / 2 + h * 0.13}" width="${w}" height="${h * 0.13}" fill="${o.band ?? BLUE}"/>
      <path d="M ${w * 0.22} ${-h / 2 + h * 0.3} V ${h / 2 - 8}" stroke="#C9CED8" stroke-width="3" stroke-dasharray="6 6"/>
      <g ${tr(-w * 0.13, -h * 0.02)}>${label(o.seat ?? 'SEAT 14C', h * 0.24, INK, { m: o.m })}</g>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${f(-w * 0.4 + i * w * 0.07)}" y="${f(h * 0.2)}" width="${f(w * (i % 3 ? 0.02 : 0.035))}" height="${f(h * 0.18)}" fill="${INK}"/>`).join('')}
      <circle cx="${w * 0.36}" cy="${h * 0.08}" r="${h * 0.16}" fill="${o.mark ?? '#EEF1F6'}"/></g>`;
  }
  function seat(c = '#2F80ED', o = {}) { // aircraft seat facing right, (0,0) = floor under it
    return `<g>${shadow(0, 0, 60, 0.3)}<rect x="-40" y="-60" width="16" height="60" fill="${shade(c, 0.5)}"/><rect x="20" y="-60" width="16" height="60" fill="${shade(c, 0.5)}"/><rect x="-56" y="-96" width="110" height="38" rx="14" fill="${c}"/><rect x="-62" y="-230" width="40" height="160" rx="18" fill="${shade(c, 0.15)}"/><rect x="-66" y="-252" width="46" height="40" rx="14" fill="${tint(c, 0.7)}"/></g>`;
  }
  function suitcase(c = CORAL, s = 1) { return `<g ${tr(0, 0, s)}>${shadow(0, 0, 60, 0.3)}<rect x="-14" y="-200" width="10" height="70" rx="4" fill="#3A3F55"/><rect x="4" y="-200" width="10" height="70" rx="4" fill="#3A3F55"/><rect x="-18" y="-206" width="36" height="12" rx="6" fill="#3A3F55"/><rect x="-60" y="-140" width="120" height="130" rx="16" fill="${c}"/><rect x="-60" y="-140" width="18" height="130" rx="9" fill="${tint(c, 0.2)}"/><rect x="-30" y="-140" width="8" height="130" fill="${shade(c, 0.2)}"/><rect x="22" y="-140" width="8" height="130" fill="${shade(c, 0.2)}"/><circle cx="-40" cy="-6" r="8" fill="#1A1C26"/><circle cx="40" cy="-6" r="8" fill="#1A1C26"/></g>`; }

  // ---------- shops ----------
  function product(kind, c, s = 1) { // small product at (0,0) bottom
    if (kind === 'can') return `<g ${tr(0, 0, s)}><rect x="-16" y="-50" width="32" height="50" rx="5" fill="${c}"/><rect x="-16" y="-34" width="32" height="16" fill="${tint(c, 0.6)}"/><rect x="-16" y="-52" width="32" height="6" rx="3" fill="#C9CED8"/></g>`;
    if (kind === 'bottle') return `<g ${tr(0, 0, s)}><rect x="-14" y="-62" width="28" height="62" rx="9" fill="${c}"/><rect x="-6" y="-80" width="12" height="22" rx="3" fill="${shade(c, 0.2)}"/><rect x="-14" y="-40" width="28" height="18" fill="${tint(c, 0.7)}"/></g>`;
    return `<g ${tr(0, 0, s)}><rect x="-22" y="-66" width="44" height="66" rx="3" fill="${c}"/><rect x="-22" y="-66" width="44" height="14" fill="${shade(c, 0.2)}"/><circle cx="0" cy="-30" r="11" fill="${tint(c, 0.6)}"/></g>`;
  }
  function shelf(w, levels, seed = 1, o = {}) { // shop shelving full of products; (0,0) = bottom-left
    const h = o.h ?? 380, c = o.c ?? '#E9E4DA', cols = o.colors ?? [CORAL, BLUE, YEL, GREEN, '#F2994A', PURPLE, '#EB5757'];
    let s = `<rect x="0" y="${-h}" width="${w}" height="${h}" fill="${shade(c, 0.2)}"/>`;
    for (let l = 0; l < levels; l++) {
      const y = -l * h / levels - 10;
      s += `<rect x="0" y="${f(y)}" width="${w}" height="12" fill="${c}"/>`;
      if (o.tags) s += `<rect x="${f(w * 0.3)}" y="${f(y + 2)}" width="40" height="20" rx="3" fill="${YEL}"/>`;
      const kinds = ['box', 'can', 'bottle'], kind = kinds[Math.floor(rnd(seed + l) * 3)], cl = cols[Math.floor(rnd(seed * 7 + l) * cols.length)];
      for (let x = 30; x < w - 20; x += kind === 'box' ? 52 : 40) s += `<g ${tr(x, y)}>${product(kind, rnd(seed + x + l) > 0.75 ? cols[Math.floor(rnd(seed + x) * cols.length)] : cl, 1)}</g>`;
    }
    return s;
  }
  function cart(c = '#B9C2CF', o = {}) { // shopping cart facing right, (0,0) = floor under the middle
    const load = o.load ? o.load.map((p, i) => `<g ${tr(-60 + i * 36 + (i % 2) * 6, -150 - (i % 3) * 14)}>${product(['box', 'bottle', 'can'][i % 3], p, 1.1)}</g>`).join('') : '';
    return `<g>${shadow(0, 0, 110, 0.3)}${load}<path d="M -110 -160 L 110 -160 L 92 -60 L -86 -60 Z" fill="none" stroke="${c}" stroke-width="9" stroke-linejoin="round"/>${[-60, -20, 20, 60].map(x => `<path d="M ${x} -160 L ${x * 0.85} -60" stroke="${c}" stroke-width="5"/>`).join('')}<path d="M -110 -160 L -140 -200 L -170 -200" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/><path d="M -86 -60 L -70 -24 L 90 -24" fill="none" stroke="${c}" stroke-width="8"/><circle cx="-60" cy="-10" r="12" fill="#1A1C26"/><circle cx="70" cy="-10" r="12" fill="#1A1C26"/></g>`;
  }
  function pricetag(txt, w = 220, o = {}) { // (0,0) = hole
    const h = w * 0.5, c = o.fill ?? YEL;
    return `<g ${o.r ? `transform="rotate(${o.r})"` : ''}><path d="M 0 0 L ${w * 0.22} ${-h / 2} L ${w} ${-h / 2} L ${w} ${h / 2} L ${w * 0.22} ${h / 2} Z" fill="${c}"/><path d="M ${w * 0.22} ${h / 2} L ${w} ${h / 2} L ${w} ${h * 0.3} L ${w * 0.22} ${h * 0.3} Z" fill="${shade(c, 0.15)}" opacity="0.6"/><circle cx="${w * 0.16}" cy="0" r="${h * 0.1}" fill="${o.hole ?? '#1A1C26'}"/><g ${tr(w * 0.6, -h * 0.02)}>${label(txt, h * 0.48, o.color ?? INK, { m: o.m })}</g></g>`;
  }

  // ---------- tech ----------
  function server(h = 420, o = {}) { // server rack, (0,0) = bottom-left, 120 wide
    const rows = Math.floor((h - 20) / 30);
    return `<g><rect x="0" y="${-h}" width="120" height="${h}" rx="6" fill="${o.c ?? '#1B2238'}"/>${Array.from({ length: rows }, (_, i) => `<rect x="10" y="${-h + 12 + i * 30}" width="100" height="22" rx="3" fill="#252E4A"/><circle cx="24" cy="${-h + 23 + i * 30}" r="4" fill="${rnd(i + (o.seed ?? 0)) > 0.5 ? '#3FD0FF' : rnd(i * 3 + (o.seed ?? 0)) > 0.85 ? CORAL : '#7CE0A0'}"/><rect x="36" y="${-h + 20 + i * 30}" width="${30 + rnd(i * 7 + (o.seed ?? 0)) * 50}" height="6" rx="3" fill="#36406A"/>`).join('')}</g>`;
  }
  function phone(w = 150, o = {}) { // (0,0) = centre
    const h = w * 2;
    return `<g><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * 0.16}" fill="#15171F"/><rect x="${-w / 2 + w * 0.07}" y="${-h / 2 + w * 0.12}" width="${w * 0.86}" height="${h - w * 0.24}" rx="${w * 0.08}" fill="${o.screen ?? '#DDEBFF'}"/>${o.inner ?? ''}</g>`;
  }
  // app tile without any real brand: rounded square + simple glyph
  function app(c, glyph = 'play', s = 90) {
    const g = { play: `<path d="M -14 -20 L 22 0 L -14 20 Z" fill="#fff"/>`, note: `<path d="M -8 18 a 9 9 0 1 1 0 -0.1 V -22 L 18 -28 V 10 a 9 9 0 1 1 0 -0.1 V -16 L -8 -10" fill="#fff"/>`, cloud: `<path d="M -24 12 a 12 12 0 0 1 2 -24 a 16 16 0 0 1 30 -4 a 12 12 0 0 1 16 28 Z" fill="#fff"/>`, box: `<rect x="-18" y="-16" width="36" height="32" rx="4" fill="#fff"/><rect x="-18" y="-16" width="36" height="9" fill="${shade(c, 0.2)}" opacity="0.4"/>`, dumbbell: `<rect x="-24" y="-4" width="48" height="8" fill="#fff"/><rect x="-28" y="-14" width="10" height="28" rx="3" fill="#fff"/><rect x="18" y="-14" width="10" height="28" rx="3" fill="#fff"/>`, game: `<rect x="-24" y="-12" width="48" height="26" rx="12" fill="#fff"/><circle cx="12" cy="0" r="4" fill="${c}"/><rect x="-16" y="-2" width="12" height="4" fill="${c}"/>`, news: `<rect x="-20" y="-20" width="40" height="40" rx="4" fill="#fff"/><rect x="-14" y="-12" width="28" height="5" fill="${c}"/><rect x="-14" y="-2" width="28" height="4" fill="${c}" opacity="0.6"/><rect x="-14" y="8" width="18" height="4" fill="${c}" opacity="0.6"/>` }[glyph];
    return `<g ${tr(0, 0, s / 90)}><rect x="-45" y="-45" width="90" height="90" rx="22" fill="${c}"/><rect x="-45" y="-45" width="90" height="40" rx="22" fill="${tint(c, 0.15)}" opacity="0.6"/>${g}</g>`;
  }
  function chart(w, h, pts, c = GREEN, o = {}) { // line chart on a dark panel; pts = 0..1 values; (0,0) = top-left
    const d = pts.map((v, i) => `${f(i * w / (pts.length - 1))} ${f(h - v * h)}`).join(' L ');
    return `<g>${o.panel === false ? '' : `<rect x="-30" y="-30" width="${w + 60}" height="${h + 60}" rx="14" fill="#0D1020" opacity="0.85"/>`}${[0.25, 0.5, 0.75].map(k => `<rect x="0" y="${f(h * k)}" width="${w}" height="2" fill="#2A3150"/>`).join('')}
      <path d="M 0 ${h} L ${d} L ${w} ${h} Z" fill="${linear(c, c, true, 0.35, 0)}"/><path d="M ${d}" fill="none" stroke="${c}" stroke-width="${o.sw ?? 10}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  }

  // ---------- places of chance and protection ----------
  function slot(o = {}) { // slot machine, (0,0) = floor centre, ~380 tall
    const c = o.c ?? '#B23A48', sy = o.symbols ?? ['7', '$', '7'];
    return `<g>${shadow(0, 0, 130, 0.35)}<rect x="-110" y="-380" width="220" height="380" rx="20" fill="${c}"/><rect x="60" y="-380" width="50" height="380" rx="20" fill="${shade(c, 0.25)}"/><rect x="-96" y="-420" width="192" height="60" rx="16" fill="${YEL}"/>${label(o.top ?? 'JACKPOT', 28, '#7A2030', { m: o.m })}
      <rect x="-90" y="-320" width="180" height="100" rx="12" fill="#0D1020"/>${sy.map((s, i) => `<rect x="${-82 + i * 56}" y="-312" width="52" height="84" rx="8" fill="#FFF8E8"/><g ${tr(-56 + i * 56, -276)}>${label(s, 44, s === '$' ? GREEN : RED, { m: o.m })}</g>`).join('')}
      <rect x="-70" y="-190" width="140" height="40" rx="10" fill="${shade(c, 0.4)}"/><rect x="-40" y="-60" width="80" height="30" rx="8" fill="#0D1020"/><path d="M 110 -300 h 30 v -90" fill="none" stroke="#C9CED8" stroke-width="10"/><circle cx="140" cy="-396" r="18" fill="${RED}"/></g>`;
  }
  function umbrella(r = 260, c = CORAL, o = {}) { // (0,0) = top of the handle shaft under the canopy
    const scalR = Array.from({ length: 5 }, (_, i) => { const x1 = r - i * 2 * r / 5, x0 = x1 - 2 * r / 5; return `Q ${f((x0 + x1) / 2)} ${f(-r * 0.12)} ${f(x0)} 0`; }).join(' ');
    return `<g><path d="M ${-r} 0 Q ${-r} ${f(-r * 0.9)} 0 ${f(-r * 0.92)} Q ${r} ${f(-r * 0.9)} ${r} 0 ${scalR} Z" fill="${c}"/>
      <path d="M 0 ${-r * 0.92} Q ${r * 0.35} ${-r * 0.6} ${r * 0.4} 0" fill="none" stroke="${shade(c, 0.25)}" stroke-width="5"/><path d="M 0 ${-r * 0.92} Q ${-r * 0.35} ${-r * 0.6} ${-r * 0.4} 0" fill="none" stroke="${shade(c, 0.25)}" stroke-width="5"/>
      ${o.holes ? o.holes.map(([x, y, rr]) => `<ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr * 0.8}" fill="${o.through ?? '#0D1020'}"/>`).join('') : ''}
      <rect x="-5" y="${-r * 0.92}" width="10" height="${r * 0.92 + (o.shaft ?? 260)}" fill="#2A2D3A"/><path d="M 0 ${o.shaft ?? 260} q 0 30 -26 30 q -22 0 -22 -22" fill="none" stroke="#2A2D3A" stroke-width="12" stroke-linecap="round"/></g>`;
  }
  const rain = (w, h, n, c = '#9FC3E6', seed = 1) => Array.from({ length: n }, (_, i) => `<path d="M ${f(rnd(seed + i) * w)} ${f(rnd(seed * 3 + i * 7) * h)} l -6 26" stroke="${c}" stroke-width="4" stroke-linecap="round" opacity="0.55"/>`).join('');

  // ---------- skyline and night ----------
  function skyline(w, base, n, c, seed = 1, o = {}) { // (0,0) = left, base = ground y; lights in windows
    let s = '';
    for (let i = 0; i < n; i++) {
      const bw = 60 + rnd(seed + i) * 90, x = i * w / n - 20, bh = (o.min ?? 120) + rnd(seed * 5 + i * 3) * (o.max ?? 300);
      s += `<rect x="${f(x)}" y="${f(base - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${c}"/>`;
      if (o.lights !== false) for (let j = 0; j < Math.floor(bh / 30) * 3; j++) if (rnd(seed + i * 31 + j * 7) > 0.62) s += `<rect x="${f(x + 10 + (j % 3) * (bw - 20) / 3)}" y="${f(base - bh + 12 + Math.floor(j / 3) * 30)}" width="10" height="12" fill="${o.light ?? '#FFD58A'}" opacity="${o.lop ?? 0.75}"/>`;
    }
    return s;
  }
  const stars = (w, h, n, seed = 2, x0 = 0, y0 = 0) => Array.from({ length: n }, (_, i) => `<circle cx="${f(x0 + rnd(seed + i) * w)}" cy="${f(y0 + rnd(seed * 9 + i * 3) * h)}" r="${f(1 + rnd(i) * 1.8)}" fill="#FFFFFF" opacity="${f(0.3 + rnd(i * 5) * 0.6)}"/>`).join('');
  function clock(r = 70, hh = 3, mm = 0, o = {}) { // wall clock; (0,0) = centre
    const ha = (hh % 12 + mm / 60) * 30, ma = mm * 6;
    return `<g>${o.glow ? pool(0, 0, r * 2.2, r * 2.2, o.glow, 0.5) : ''}<circle r="${r + 8}" fill="${o.rim ?? '#1A1C26'}"/><circle r="${r}" fill="${o.face ?? '#F6F1E6'}"/>${Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="${-r + 6}" width="6" height="${i % 3 ? 8 : 14}" fill="#1A1C26" transform="rotate(${i * 30})"/>`).join('')}
      <rect x="-5" y="${-r * 0.5}" width="10" height="${r * 0.5}" rx="5" fill="#1A1C26" transform="rotate(${ha})"/><rect x="-3.5" y="${-r * 0.78}" width="7" height="${r * 0.78}" rx="3.5" fill="#1A1C26" transform="rotate(${ma})"/><circle r="7" fill="${RED}"/></g>`;
  }


  // ---------- more places and things ----------
  function tower(w = 260, h = 560, c = '#2B3A5C', o = {}) { // office/insurance tower, (0,0) = ground centre
    let win = '';
    for (let r = 0; r < Math.floor((h - 80) / 34); r++) for (let k = 0; k < Math.floor((w - 30) / 34); k++) if (rnd(r * 17 + k + (o.seed ?? 0)) > 0.35) win += `<rect x="${f(-w / 2 + 20 + k * 34)}" y="${f(-h + 60 + r * 34)}" width="18" height="20" fill="${o.light ?? '#FFD58A'}" opacity="${f(0.45 + rnd(r + k * 3) * 0.5)}"/>`;
    return `<g>${shadow(0, 0, w * 0.7, 0.35)}<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${c}"/><rect x="${w / 2 - w * 0.22}" y="${-h}" width="${w * 0.22}" height="${h}" fill="${shade(c, 0.3)}"/><rect x="${-w / 2 - 10}" y="${-h - 16}" width="${w + 20}" height="22" fill="${tint(c, 0.12)}"/>${win}
      ${o.logo ? `<g ${tr(0, -h + 28)}><circle r="22" fill="${o.logo}"/></g>` : ''}${o.door !== false ? `<rect x="-30" y="-70" width="60" height="70" fill="${o.doorc ?? '#FFE2A6'}" opacity="0.9"/>` : ''}</g>`;
  }
  function house(c = '#C96F53', s = 1) { return `<g ${tr(0, 0, s)}>${shadow(0, 0, 70, 0.3)}<rect x="-55" y="-80" width="110" height="80" fill="${tint(c, 0.15)}"/><rect x="25" y="-80" width="30" height="80" fill="${shade(c, 0.15)}"/><path d="M -70 -76 L 0 -136 L 70 -76 Z" fill="${c}"/><rect x="-36" y="-56" width="24" height="22" fill="#FFD58A"/><rect x="8" y="-46" width="22" height="46" fill="${shade(c, 0.35)}"/></g>`; }
  function receipt(w = 200, h = 520, o = {}) { // long receipt; (0,0) = top centre; zigzag bottom
    const lines = Array.from({ length: Math.floor((h - 60) / 28) }, (_, i) => `<rect x="${-w / 2 + 20}" y="${30 + i * 28}" width="${f(w * (0.35 + rnd(i) * 0.25))}" height="9" rx="4" fill="#9AA0AE"/><rect x="${w / 2 - 20 - w * 0.18}" y="${30 + i * 28}" width="${w * 0.18}" height="9" rx="4" fill="${o.mark && i % 3 === 1 ? CORAL : '#6E7486'}"/>`).join('');
    const zig = Array.from({ length: Math.round(w / 20) }, (_, i) => `L ${f(-w / 2 + (i + 0.5) * 20)} ${h + 12} L ${f(-w / 2 + (i + 1) * 20)} ${h}`).join(' ');
    return `<g><path d="M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2} ${h} ${zig.split(' L ').reverse().join(' L ').replace(/^/, 'L ')} L ${-w / 2} ${h} Z" fill="#F6F1E6"/><path d="M ${-w / 2} ${h} ${zig}" fill="#F6F1E6"/>${lines}<rect x="${w / 2 - 14}" y="0" width="14" height="${h}" fill="#D9D2C3"/></g>`;
  }
  function wallet(c = '#6B4E3D', o = {}) { // open wallet, (0,0) = centre
    return `<g><rect x="-80" y="-50" width="160" height="100" rx="14" fill="${c}"/><rect x="-80" y="-50" width="160" height="34" rx="14" fill="${tint(c, 0.18)}"/>${o.empty ? `<rect x="-60" y="-44" width="120" height="8" rx="4" fill="${shade(c, 0.4)}"/>` : `<g ${tr(-10, -58, 0.9, -6)}>${bill(110)}</g>`}<circle cx="58" cy="2" r="8" fill="${YEL}"/></g>`;
  }
  function screen(w = 420, o = {}) { // TV / big screen with a play glyph; (0,0) = centre
    const h = w * 0.58;
    return `<g><rect x="${-w / 2 - 12}" y="${-h / 2 - 12}" width="${w + 24}" height="${h + 24}" rx="14" fill="#0D0F18"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="${o.fill ?? linear('#2F80ED', '#7B5CD6')}"/>${o.inner ?? `<circle r="${h * 0.2}" fill="#fff" opacity="0.92"/><path d="M ${-h * 0.06} ${-h * 0.1} L ${h * 0.11} 0 L ${-h * 0.06} ${h * 0.1} Z" fill="${o.glyph ?? '#2F80ED'}"/>`}</g>`;
  }
  function ship(c = '#2B3A5C', o = {}) { // container ship side view facing right, (0,0) = waterline centre, ~900 long
    const cols = ['#E07B39', '#2F80ED', '#2E9E5B', '#C0392B', '#F2C14E', '#7B5CD6', '#8A94A8'];
    let cont = '';
    for (let r = 0; r < (o.rows ?? 6); r++) for (let k = 0; k < 22; k++) if (rnd(r * 29 + k) > 0.08) cont += `<rect x="${-380 + k * 32}" y="${-100 - (r + 1) * 30}" width="30" height="28" fill="${cols[Math.floor(rnd(r * 7 + k * 13) * cols.length)]}"/>`;
    return `<g>${cont}<path d="M -440 -100 L 420 -100 L 470 -160 L 480 -100 L 440 30 L -400 30 Z" fill="${c}"/><rect x="-440" y="-20" width="900" height="16" fill="${CORAL}"/><rect x="330" y="-300" width="80" height="200" fill="#E8E8EE"/><rect x="340" y="-290" width="60" height="18" fill="#3B4A66"/></g>`;
  }
  function camera(o = {}) { // security camera on a wall arm, looking down-left; (0,0) = wall mount
    return `<g ${o.r ? `transform="rotate(${o.r})"` : ''}><rect x="-8" y="-20" width="16" height="40" fill="#2A2D3A"/><rect x="-6" y="-4" width="60" height="10" fill="#2A2D3A"/><g ${tr(70, 10, 1, 25)}><rect x="-50" y="-22" width="100" height="44" rx="10" fill="#E9E4DA"/><rect x="-62" y="-14" width="16" height="28" rx="4" fill="#2A2D3A"/><circle cx="-56" cy="0" r="7" fill="${RED}"/></g></g>`;
  }
  function stampTool(c = '#B23A48') { // big rubber stamp, (0,0) = bottom of the rubber
    return `<g><rect x="-150" y="-60" width="300" height="60" rx="8" fill="${c}"/><rect x="-170" y="-110" width="340" height="56" rx="14" fill="#3A2A2A"/><rect x="-40" y="-260" width="80" height="160" rx="20" fill="#5A3E2E"/><ellipse cx="0" cy="-270" rx="90" ry="44" fill="#6E4C38"/></g>`;
  }
  function door(w = 140, h = 260, c = '#3A4160', o = {}) { // (0,0) = bottom centre; open 0..1 shows light
    return `<g><rect x="${-w / 2 - 14}" y="${-h - 14}" width="${w + 28}" height="${h + 14}" fill="${shade(c, 0.4)}"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${o.open ? (o.light ?? '#FFE2A6') : c}"/>${o.open ? `<path d="M ${-w / 2} ${-h} L ${f(-w / 2 + w * (1 - o.open))} ${-h + 20} L ${f(-w / 2 + w * (1 - o.open))} -10 L ${-w / 2} 0 Z" fill="${tint(c, 0.1)}"/>` : `<circle cx="${w / 2 - 22}" cy="${-h / 2}" r="8" fill="${YEL}"/>`}${o.sign ? `<g ${tr(0, -h - 50)}>${plate(o.sign, Math.max(140, o.sign.length * 26), 48, { m: o.m, edge: o.edge, color: o.color })}</g>` : ''}</g>`;
  }
  function couch(c = '#5B4B7A') { // (0,0) = floor centre
    return `<g>${shadow(0, 0, 240, 0.35)}<rect x="-230" y="-200" width="460" height="120" rx="40" fill="${shade(c, 0.12)}"/><rect x="-250" y="-110" width="500" height="80" rx="30" fill="${c}"/><rect x="-270" y="-160" width="70" height="140" rx="30" fill="${tint(c, 0.1)}"/><rect x="200" y="-160" width="70" height="140" rx="30" fill="${tint(c, 0.1)}"/><rect x="-230" y="-30" width="20" height="30" fill="#1A1C26"/><rect x="210" y="-30" width="20" height="30" fill="#1A1C26"/></g>`;
  }
  function eye(r = 40, o = {}) { // a watching eye (cameras, algorithms), no outline
    return `<g><path d="M ${-r * 1.6} 0 Q 0 ${-r * 1.3} ${r * 1.6} 0 Q 0 ${r * 1.3} ${-r * 1.6} 0 Z" fill="${o.white ?? '#E9EEF8'}"/><circle r="${r * 0.62}" fill="${o.iris ?? '#3FD0FF'}"/><circle r="${r * 0.3}" fill="#05060C"/><circle cx="${r * 0.15}" cy="${-r * 0.18}" r="${r * 0.1}" fill="#fff"/></g>`;
  }
  function gear(r = 80, c = '#4A4470', o = {}) {
    const n = o.teeth ?? 10;
    const teeth = Array.from({ length: n }, (_, i) => `<rect x="${-r * 0.16}" y="${-r * 1.18}" width="${r * 0.32}" height="${r * 0.36}" rx="${r * 0.05}" fill="${c}" transform="rotate(${i * 360 / n + (o.rot ?? 0)})"/>`).join('');
    return `<g>${teeth}<circle r="${r}" fill="${c}"/><circle r="${r * 0.72}" fill="${tint(c, 0.1)}"/><circle r="${r * 0.25}" fill="${shade(c, 0.4)}"/></g>`;
  }

  window.TKIT = {
    f, rnd, mix, shade, tint, lum, tr, reset, defs, radial, linear, pool, cone, beam, shadow, lamp, box, hazard, person, label, plate,
    coin, bill, stack, pipe, card, terminal, conveyor, mouth, rack, truck, plane, bank, vault, glassWall, board, ticket, seat, suitcase,
    product, shelf, cart, pricetag, server, phone, app, chart, slot, umbrella, rain, skyline, stars, clock,
    tower, house, receipt, wallet, screen, ship, camera, stampTool, door, couch, eye, gear,
    C: { INK, WHITE, YEL, AMBER, RED, BLUE, CORAL, GREEN, PURPLE },
  };
})();
