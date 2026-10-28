// The world of video 004 "Why Is the Milk Always at the Back of the Store?" (docs/mundo-vivo.md): a supermarket seen from
// the shop floor and from behind the dairy wall: shelves, the milk carton we follow, the dairy case, the cold room,
// the refrigerated truck at the dock, the thermometer, the floor plan with shopping paths, the basket and the receipt.
// Same rules as world.js: flat tonal shapes, no outlines (only ZERO has one), every prop on its own clock gt.
(() => {
  const { PROPS, FONT, esc } = window.PUPPETS;
  const f = n => Math.round(n * 100) / 100;
  const T = (txt, size, color, x = 0, y = 0, extra = '') => `<text x="${f(x)}" y="${f(y + size * 0.35)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${size}" fill="${color}" ${extra}>${esc(txt)}</text>`;
  const TL = (txt, size, color, x = 0, y = 0, extra = '') => `<text x="${f(x)}" y="${f(y + size * 0.35)}" font-family="${FONT}" font-weight="700" font-size="${size}" fill="${color}" ${extra}>${esc(txt)}</text>`;
  const fr = x => x - Math.floor(x);
  const rnd = i => fr(Math.sin(i * 127.1 + 311.7) * 43758.5453);
  const S = p => `scale(${p.s ?? 1})`;
  const mix = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const c = [16, 8, 0].map(s => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k)); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
  const shade = (c, k) => mix(c, '#0B0E1C', k), tint = (c, k) => mix(c, '#FFFFFF', k);

  // the supermarket palette: sage wall, pale grey tile, steel shelving; the carton is blue and white
  const ST = { wall: '#DCE6D3', wallDk: '#C3D1BA', floor: '#C9CDD3', steel: '#8C96A8', steelDk: '#5F6A80', blue: '#3F78D0', blueDk: '#2A57A3', milk: '#F4F7FB', frost: '#CFE6F2', frostDk: '#9CC3D8', green: '#58E08A', amber: '#FFC93C', coral: '#FF6B5B' };
  const PROD = ['#E8A33C', '#D9573F', '#4E8F5A', '#6D5CAE', '#3F78D0', '#F2D15C', '#C9555A', '#7CB7A4', '#E58E5E', '#9AA6BC'];

  // one gable-top carton, origin at the bottom centre: white body, coloured label band, a milk drop. face: front width
  const carton = (o = {}) => {
    const c = o.color ?? ST.blue, w = o.w ?? 100, h = o.h ?? 150, d = w * 0.26, top = h * 0.2;
    return `<g>
      <path d="M ${-w / 2} ${-h} L ${-w / 2 + d * 0.5} ${-h - top} L ${w / 2 + d * 0.5 - 14} ${-h - top} L ${w / 2} ${-h} Z" fill="${tint(c, 0.55)}"/>
      <path d="M ${-w / 2 + d * 0.5} ${-h - top} L ${w / 2 + d * 0.5 - 14} ${-h - top} L ${w / 2 + d * 0.5} ${-h - top + 10} L ${-w / 2 + d * 0.5 + 12} ${-h - top + 10} Z" fill="${tint(c, 0.8)}"/>
      <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${ST.milk}"/>
      <path d="M ${w / 2} ${-h} L ${w / 2 + d * 0.5} ${-h - top + 10} L ${w / 2 + d * 0.5} ${-top + 10} L ${w / 2} 0 Z" fill="${shade(ST.milk, 0.1)}"/>
      <rect x="${-w / 2}" y="${-h * 0.58}" width="${w}" height="${h * 0.46}" fill="${c}"/>
      <path d="M 0 ${-h * 0.5} q ${w * 0.16} ${h * 0.14} 0 ${h * 0.22} q ${-w * 0.16} ${-h * 0.08} 0 ${-h * 0.22} Z" fill="${ST.milk}" transform="translate(${-w * 0.2} ${-h * 0.02})"/>
      ${o.txt === false ? '' : T(o.txt ?? 'MILK', w * 0.2, ST.milk, w * 0.14, -h * 0.35, 'letter-spacing="1"')}
      <rect x="${-w / 2}" y="${-h * 0.12}" width="${w}" height="${h * 0.12}" fill="${shade(c, 0.18)}"/>
      ${o.cap ? `<rect x="${-w * 0.12}" y="${-h - top - 8}" width="${w * 0.24}" height="12" rx="4" fill="${o.cap}"/>` : ''}
    </g>`;
  };
  // a product on a shelf: bottle, box or can, picked by a seed
  const product = (x, base, i, k) => {
    const col = PROD[Math.floor(rnd(k + i * 3) * 10)], kind = Math.floor(rnd(k * 2 + i) * 3), w = 30 + Math.floor(rnd(k + i) * 24), h = 58 + Math.floor(rnd(k * 3 + i) * 46);
    if (kind === 0) return `<g><rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="6" fill="${col}"/><rect x="${x}" y="${base - h * 0.62}" width="${w}" height="${h * 0.26}" fill="${tint(col, 0.55)}"/></g>`;
    if (kind === 1) return `<g><rect x="${x + w * 0.3}" y="${base - h - 16}" width="${w * 0.4}" height="18" rx="4" fill="${shade(col, 0.2)}"/><rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="${w * 0.3}" fill="${col}"/><rect x="${x}" y="${base - h * 0.55}" width="${w}" height="${h * 0.2}" fill="${tint(col, 0.6)}"/></g>`;
    return `<g><rect x="${x}" y="${base - h * 0.7}" width="${w + 8}" height="${h * 0.7}" rx="3" fill="${col}"/><rect x="${x}" y="${base - h * 0.7}" width="${w + 8}" height="9" fill="${shade(col, 0.2)}"/></g>`;
  };

  const W = {
    // ===== the shop floor =====
    // the back wall of the store: sage wall, a ceiling strip with light panels, a run of shelving units full of products.
    // origin at the floor, centred; w width; seed changes the products; lights 0..1 how bright the panels are
    storewall(p) {
      const w = p.w ?? 3200, seed = p.seed ?? 1, unit = 300, n = Math.ceil(w / unit), lights = p.lights ?? 1;
      let units = '';
      for (let u = 0; u < n; u++) {
        const x = -w / 2 + u * unit;
        let sh = '';
        for (let r = 0; r < 4; r++) {
          const y = -r * 132 - 14; let px = x + 12, i = 0, prods = '';
          while (px < x + unit - 44) { const k = seed * 97 + u * 41 + r * 13; prods += product(px, y, i, k); px += 34 + Math.floor(rnd(k + i) * 24) + 8; i++; }
          sh += prods + `<rect x="${x}" y="${y}" width="${unit - 8}" height="10" rx="3" fill="${ST.steel}"/>`;
        }
        units += `<g><rect x="${x}" y="-560" width="8" height="560" fill="${ST.steelDk}"/>${sh}<rect x="${x}" y="-562" width="${unit - 8}" height="12" fill="${ST.steelDk}"/></g>`;
      }
      const panels = Array.from({ length: Math.ceil(w / 520) }, (_, i) => `<rect x="${-w / 2 + i * 520 + 60}" y="-1090" width="400" height="26" rx="8" fill="#FFFDF0" opacity="${f(0.55 + 0.4 * lights)}"/>`).join('');
      return `<g><rect x="${-w / 2}" y="-1300" width="${w}" height="1300" fill="${ST.wall}"/><rect x="${-w / 2}" y="-1300" width="${w}" height="190" fill="${shade(ST.wall, 0.1)}"/>${panels}
        <rect x="${-w / 2}" y="-620" width="${w}" height="620" fill="${ST.wallDk}" opacity="0.5"/>${units}
        <rect x="${-w / 2}" y="-18" width="${w}" height="18" fill="${shade(ST.wall, 0.4)}"/></g>`;
    },
    // a sign hanging from the ceiling: aisle number and what's in it (or just words)
    aislesign(p) {
      const sw = Math.sin((p.gt ?? 0) * 0.8 + (p.seed ?? 0)) * 0.6, w = p.w ?? 300;
      return `<g transform="${S(p)} rotate(${f(sw)})"><path d="M ${-w / 2 + 30} 0 V -${p.cord ?? 260} M ${w / 2 - 30} 0 V -${p.cord ?? 260}" stroke="${ST.steelDk}" stroke-width="5"/>
        <rect x="${-w / 2}" y="0" width="${w}" height="96" rx="12" fill="${p.color ?? ST.blueDk}"/><rect x="${-w / 2 + 8}" y="8" width="${w - 16}" height="80" rx="8" fill="none" stroke="${tint(p.color ?? ST.blueDk, 0.5)}" stroke-width="2" opacity="0.6"/>
        ${p.no != null ? T(String(p.no), 56, '#FFF', -w / 2 + 52, 48) + T(p.txt ?? '', 30, '#FFF', 28, 48) : T(p.txt ?? '', 38, '#FFF', 0, 48, 'letter-spacing="3"')}</g>`;
    },
    // the milk carton we follow. origin bottom centre. txt label, color band, glow (PIX's light), frost 0..1
    carton(p) {
      const gt = p.gt ?? 0, c = p.color ?? ST.blue, fro = p.frost ?? 0;
      return `<g transform="${S(p)} rotate(${f(p.ang ?? 0)})">${p.glow ? `<ellipse cx="0" cy="-90" rx="${f(170 * p.glow)}" ry="${f(150 * p.glow)}" fill="url(#wPix)" opacity="0.85"/>` : ''}
        ${p.shadow === false ? '' : `<ellipse cx="14" cy="4" rx="78" ry="10" fill="#000" opacity="0.22"/>`}${carton({ color: c, w: 100, h: 150, txt: p.txt, cap: p.cap })}
        ${fro > 0 ? `<g opacity="${f(fro * 0.55)}"><rect x="-50" y="-150" width="100" height="150" fill="#E6F4FF"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${f(-40 + rnd(i) * 90)}" cy="${f(-140 + rnd(i + 5) * 130)}" r="${f(3 + rnd(i + 2) * 5)}" fill="#fff"/>`).join('')}</g>` : ''}
        ${p.tag ? `<g transform="translate(58 -96) rotate(8)"><rect x="-6" y="-30" width="78" height="52" rx="6" fill="#FFF4A8"/>${T(p.tag, 22, '#5C4A00', 33, -4)}</g>` : ''}</g>`;
    },
    // the dairy case: a refrigerated wall with glass doors, rows of cartons, a blue header. origin bottom centre.
    // gap: index (0-based, left to right on the middle shelf) of a carton that is missing; lit 0..1 interior light
    dairycase(p) {
      const w = p.w ?? 1500, h = 700, lit = p.lit ?? 1, n = Math.round(w / 112), cols = ['#2FA8A8', '#58B368', '#E85D5D', '#F2C14E', '#2FA8A8', '#8D6BC8'];
      let rows = '';
      for (let r = 0; r < 4; r++) {
        const y = -h + 100 + r * 142 + 118;
        let cs = '';
        for (let i = 0; i < n; i++) {
          const x = -w / 2 + 70 + i * 112 + (r % 2) * 10; if (r === (p.gapRow ?? 1) && i === p.gap) continue;
          const col = cols[(i * 5 + r * 3 + (p.seed ?? 0)) % 6];
          cs += `<g transform="translate(${f(x)} ${y}) scale(0.62)">${carton({ color: col, w: 100, h: 150, txt: r === 3 ? 'YOGURT' : r === 2 ? 'CREAM' : 'MILK' })}</g>`;
        }
        rows += cs + `<rect x="${-w / 2 + 14}" y="${y + 2}" width="${w - 28}" height="10" fill="${ST.steel}"/>`;
      }
      const door = (i, k) => `<g><rect x="${-w / 2 + 8 + i * (w - 16) / k}" y="${-h + 90}" width="${(w - 16) / k - 6}" height="${h - 120}" fill="#BFE0F2" opacity="0.1"/><path d="M ${-w / 2 + 40 + i * (w - 16) / k} ${-h + 100} l 120 0 l -90 ${h - 140} l -60 0 Z" fill="#fff" opacity="0.06"/><rect x="${-w / 2 + 8 + i * (w - 16) / k + (w - 16) / k - 34}" y="${-h * 0.55}" width="10" height="150" rx="5" fill="${ST.steelDk}"/></g>`;
      return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="${w / 2 + 40}" ry="16" fill="#000" opacity="0.25"/>
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="${shade(ST.blueDk, 0.25)}"/>
        <rect x="${-w / 2 + 10}" y="${-h + 90}" width="${w - 20}" height="${h - 110}" fill="${mix('#BFE0F2', '#FFFFFF', 0.4 * lit)}"/>
        ${rows}${Array.from({ length: 4 }, (_, i) => door(i, 4)).join('')}
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="84" rx="10" fill="${ST.blue}"/>${T(p.txt ?? 'DAIRY', 52, '#FFFFFF', 0, -h + 42, 'letter-spacing="10"')}
        <rect x="${-w / 2}" y="-22" width="${w}" height="22" fill="${shade(ST.blueDk, 0.35)}"/></g>`;
    },

    // ===== behind the wall =====
    // the cold room behind the dairy wall: frosty walls, racks of cartons on rolling crates, an evaporator fan with
    // mist, a strip curtain door, a temperature display. origin: centre. temp: number shown; open: strip curtain swing
    coldroom(p) {
      const gt = p.gt ?? 0, w = p.w ?? 1500, h = p.h ?? 820, temp = p.temp ?? 3, cols = ['#2FA8A8', '#58B368', '#E85D5D', '#F2C14E'];
      let racks = '';
      for (let k = 0; k < (p.racks ?? 3); k++) {
        const x = -w / 2 + (p.rackX ?? 340) + k * 330;
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) racks += `<g transform="translate(${f(x + (c - 1) * 76)} ${f(h / 2 - 90 - r * 114)}) scale(0.7)">${carton({ color: cols[(k + r + c) % 4], w: 100, h: 150, txt: 'MILK' })}</g>`;
        racks += `<rect x="${x - 130}" y="${h / 2 - 90}" width="260" height="14" fill="${ST.steelDk}"/><rect x="${x - 130}" y="${h / 2 - 96 - 3 * 114 + 110}" width="8" height="${3 * 114 + 6}" fill="${ST.steelDk}"/><rect x="${x + 122}" y="${h / 2 - 96 - 3 * 114 + 110}" width="8" height="${3 * 114 + 6}" fill="${ST.steelDk}"/>`;
        racks += `<circle cx="${x - 100}" cy="${h / 2 - 70}" r="12" fill="#2A2E40"/><circle cx="${x + 100}" cy="${h / 2 - 70}" r="12" fill="#2A2E40"/>`;
      }
      const fan = `<g transform="translate(${w / 2 - 280} ${-h / 2 + 110})"><rect x="-130" y="-46" width="260" height="92" rx="14" fill="#A9B4C6"/><circle cx="-50" cy="0" r="34" fill="#2A2E40"/><circle cx="50" cy="0" r="34" fill="#2A2E40"/>${[-50, 50].map(x => `<g transform="translate(${x} 0) rotate(${f(gt * 700)})"><path d="M 0 0 L 28 -8 L 28 8 Z M 0 0 L -28 8 L -28 -8 Z" fill="#DCE3EE" opacity="0.9"/></g>`).join('')}</g>`;
      const mist = Array.from({ length: 9 }, (_, i) => { const k = fr(gt * 0.18 + i / 9); return `<ellipse cx="${f(w / 2 - 330 + (rnd(i) - 0.5) * 220)}" cy="${f(-h / 2 + 190 + k * 340)}" rx="${f(40 + k * 90)}" ry="${f(16 + k * 34)}" fill="#EAF6FF" opacity="${f(0.22 * (1 - k))}"/>`; }).join('');
      const strips = Array.from({ length: 9 }, (_, i) => `<rect x="${f(-w / 2 + 46 + i * 20 + Math.sin(gt * 1.4 + i) * 2 * (p.sway ?? 1))}" y="${-h / 2 + 90}" width="14" height="${h - 90}" fill="#CFE0EA" opacity="0.7"/>`).join('');
      return `<g transform="${S(p)}"><clipPath id="wCold"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#wCold)">
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${ST.frost}"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="90" fill="${ST.frostDk}"/>
        ${Array.from({ length: 11 }, (_, i) => `<path d="M ${-w / 2 + i * 150} ${-h / 2 + 90} V ${h / 2}" stroke="#B5D3E2" stroke-width="3"/>`).join('')}
        <rect x="${-w / 2}" y="${h / 2 - 64}" width="${w}" height="64" fill="#8FB4C7"/>${Array.from({ length: 22 }, (_, i) => `<ellipse cx="${f(-w / 2 + rnd(i + 9) * w)}" cy="${h / 2 - 20 - rnd(i) * 30}" rx="${f(20 + rnd(i + 3) * 40)}" ry="6" fill="#F4FAFF" opacity="0.5"/>`).join('')}
        ${racks}${strips}${fan}${mist}
        <g transform="translate(${w / 2 - 150} ${-h / 2 + 330})"><rect x="-86" y="-52" width="172" height="104" rx="12" fill="#1B2240"/><rect x="-76" y="-42" width="152" height="84" rx="8" fill="#0B1226"/>${T(String(temp) + '°C', 56, ST.green, 0, -6, 'font-variant-numeric="tabular-nums"')}${T('COLD ROOM', 18, '#7CC2FF', 0, 26, 'letter-spacing="3"')}</g>
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#wCool)" opacity="0.18"/></g>${p.frame ? `<rect x="${-w / 2 - 6}" y="${-h / 2 - 6}" width="${w + 12}" height="${h + 12}" rx="20" fill="none" stroke="#7CC2FF" stroke-width="12" opacity="0.9"/>` : ''}</g>`;
    },
    // a refrigerated delivery truck backed up to the dock, side view; its rear (left) doors open on racks of cartons.
    // origin: bottom centre of the trailer. temp shown on the cooling unit
    reefer(p) {
      const gt = p.gt ?? 0, rock = Math.sin(gt * 6) * 1.0, cols = ['#2FA8A8', '#58B368', '#E85D5D', '#F2C14E'];
      const wheel = x => `<g transform="translate(${x} -52) rotate(${f(gt * (p.roll ?? 0) * 700)})"><circle r="52" fill="#14161F"/><circle r="26" fill="#5C6684"/><rect x="-24" y="-4" width="48" height="8" fill="#3A3F5C"/></g>`;
      const load = p.open ? Array.from({ length: 2 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<g transform="translate(${-640 + c * 72} ${-80 - r * 104}) scale(0.62)">${carton({ color: cols[(c + r) % 4], w: 100, h: 150, txt: false })}</g>`).join('')).join('') : '';
      const fl = p.flip ? -1 : 1;
      return `<g transform="${S(p)} scale(${fl} 1)"><ellipse cx="0" cy="6" rx="780" ry="20" fill="#000" opacity="0.3"/><g transform="translate(0 ${f(rock)})">
        <rect x="-700" y="-520" width="1000" height="450" rx="14" fill="#E9EEF5"/>${p.open ? `<rect x="-690" y="-505" width="400" height="420" fill="#1B2240"/>${load}` : ''}
        <rect x="-700" y="-120" width="1000" height="48" fill="#C3CCDA"/><rect x="-700" y="-440" width="1000" height="14" fill="${ST.blue}" opacity="0.9"/>
        <g transform="translate(110 -560)"><rect x="-130" y="0" width="300" height="54" rx="10" fill="#A9B4C6"/><circle cx="-60" cy="27" r="20" fill="#2A2E40"/><g transform="translate(-60 27) rotate(${f(gt * 700)})"><path d="M 0 0 L 17 -4 L 17 4 Z M 0 0 L -17 4 L -17 -4 Z" fill="#DCE3EE"/></g><rect x="0" y="12" width="150" height="30" rx="6" fill="#0B1226"/><g transform="translate(75 27) scale(${fl} 1)">${T((p.temp ?? 3) + '°C', 26, ST.green, 0, 0)}</g></g>
        <path d="M 300 -470 L 470 -470 Q 520 -470 540 -410 L 585 -250 L 585 -72 L 300 -72 Z" fill="${p.cab ?? '#3F6FB0'}"/><path d="M 335 -450 L 462 -450 Q 498 -450 512 -405 L 545 -290 L 335 -290 Z" fill="#20253F"/>
        <g transform="translate(405 -290) scale(0.58)">${PROPS.person({ gt, pose: 'sit', shirt: '#5D7A8C', skin: '#A87B5A', cap: '#2E4A5A', seed: 5, look: 0.5 })}</g>
        ${wheel(-520)}${wheel(-410)}${wheel(380)}${wheel(490)}</g></g>`;
    },
    // the loading dock in the back wall: a roller door with a yellow-and-black bumper and a light that flashes
    dock(p) {
      const gt = p.gt ?? 0, open = p.open ?? 1, w = 760, h = 640;
      return `<g transform="${S(p)}"><rect x="${-w / 2 - 60}" y="${-h - 60}" width="${w + 120}" height="${h + 60}" fill="${ST.steelDk}"/>
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#1B2240"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${f(h * (1 - open))}" fill="#9AA6BC"/>
        ${Array.from({ length: 8 }, (_, i) => `<rect x="${-w / 2}" y="${-h + i * (h / 8)}" width="${w}" height="4" fill="#7B8696" opacity="${open < 1 ? 0.6 : 0}"/>`).join('')}
        <rect x="${-w / 2 - 20}" y="-70" width="${w + 40}" height="70" fill="#2A2E40"/>${Array.from({ length: 14 }, (_, i) => `<path d="M ${-w / 2 - 20 + i * 58} -70 l 29 0 l -29 70 l -29 0 Z" fill="#F2C14E"/>`).join('')}
        <circle cx="${w / 2 + 20}" cy="${-h - 30}" r="18" fill="${fr(gt * 1.4) < 0.5 ? '#FF6B5B' : '#7A3A34'}"/>${T(p.txt ?? 'DELIVERIES', 34, '#F4F7FB', 0, -h - 34, 'letter-spacing="6"')}</g>`;
    },
    // a thermometer bar from 0 to 25°C with the 7°C line; v = where the marker is (°C); lit shows the green zone
    thermo(p) {
      const w = p.w ?? 1200, h = 74, v = Math.max(0, Math.min(25, p.v ?? 3)), x7 = -w / 2 + w * 7 / 25, xv = -w / 2 + w * v / 25;
      return `<g transform="${S(p)}"><rect x="${-w / 2 - 10}" y="${-h / 2 - 10}" width="${w + 20}" height="${h + 20}" rx="${h / 2 + 10}" fill="#12172E"/>
        <rect x="${-w / 2}" y="${-h / 2}" width="${x7 + w / 2}" height="${h}" rx="${h / 2}" fill="${ST.green}" opacity="${f(0.35 + 0.65 * (p.lit ?? 1))}"/>
        <rect x="${x7}" y="${-h / 2}" width="${w / 2 - x7}" height="${h}" rx="${h / 2}" fill="#7A3A34" opacity="0.55"/><rect x="${x7 - 30}" y="${-h / 2}" width="60" height="${h}" fill="#12172E" opacity="0"/>
        <path d="M ${x7} ${-h / 2 - 20} V ${h / 2 + 20}" stroke="#FFF" stroke-width="5" stroke-dasharray="10 8"/>${T('7°C', 34, '#FFFFFF', x7, -h / 2 - 48)}
        <circle cx="${f(xv)}" cy="0" r="${h * 0.62}" fill="${v <= 7 ? '#E8FFF0' : '#FFD9D2'}"/>${T(String(Math.round(v * 10) / 10).replace(/\.0$/, '') + '°', 34, v <= 7 ? '#1E8C4E' : '#B5463E', xv, 0)}
        ${p.ticks === false ? '' : [0, 5, 10, 15, 20, 25].map(t => T(t + '°', 24, '#8FA6C8', -w / 2 + w * t / 25, h / 2 + 40)).join('')}</g>`;
    },

    // ===== the floor plan =====
    // the store from above: entrance bottom-left, checkout along the bottom, twelve aisles, produce on the left wall, the
    // dairy wall along the back (blue), bakery on the right, the dock at the back right. paths: [{pts, prog, color, w, dash}]
    // dot: {path index, at 0..1} puts ZERO's marker on a path. labels: 0..1 opacity of the department names. origin: centre
    storemap(p) {
      const w = 1500, h = 900, L = -w / 2, Tp = -h / 2, labels = p.labels ?? 1;
      const aisles = Array.from({ length: 12 }, (_, i) => `<rect x="${L + 250 + i * 94}" y="${Tp + 220}" width="46" height="400" rx="6" fill="${ST.steel}"/><rect x="${L + 258 + i * 94}" y="${Tp + 230}" width="30" height="380" rx="4" fill="${PROD[i % 10]}" opacity="0.55"/>`).join('');
      const regs = Array.from({ length: 4 }, (_, i) => `<rect x="${L + 330 + i * 150}" y="${Tp + h - 120}" width="80" height="60" rx="6" fill="#5F6A80"/><rect x="${L + 340 + i * 150}" y="${Tp + h - 108}" width="60" height="30" rx="4" fill="#9AA6BC"/>`).join('');
      const paths = (p.paths || []).map(q => { const d = q.pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${L + x} ${Tp + y}`).join(' '); return `<path d="${d}" fill="none" stroke="${q.color ?? '#FFC93C'}" stroke-width="${q.w ?? 10}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="${f(q.prog ?? 1)} 1" opacity="${q.op ?? 1}"/>`; }).join('');
      const at = (q, t) => { const pts = q.pts, seg = pts.slice(1).map((b, i) => Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1])), tot = seg.reduce((a, b) => a + b, 0); let d = t * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, d / seg[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } d -= seg[i]; } return pts[0]; };
      const dot = p.dot && p.paths?.[p.dot.path] ? (([x, y]) => `<g transform="translate(${L + x} ${Tp + y})"><circle r="26" fill="#FFF" opacity="0.9"/><circle r="17" fill="#111"/><circle cx="-5" cy="-3" r="3.6" fill="#fff"/><circle cx="5" cy="-3" r="3.6" fill="#fff"/></g>`)(at(p.paths[p.dot.path], p.dot.at ?? 1)) : '';
      const ping = p.pin ? `<g transform="translate(${L + p.pin[0]} ${Tp + p.pin[1]})"><circle r="${f(34 + 10 * Math.sin((p.gt ?? 0) * 4))}" fill="none" stroke="#FFC93C" stroke-width="5" opacity="0.8"/>${PROPS.carton({ s: 0.34, shadow: false })}</g>` : '';
      return `<g transform="${S(p)}"><rect x="${L - 14}" y="${Tp - 14}" width="${w + 28}" height="${h + 28}" rx="22" fill="#12172E"/><rect x="${L}" y="${Tp}" width="${w}" height="${h}" rx="14" fill="#E8EEE4"/>
        <rect x="${L}" y="${Tp}" width="${w}" height="120" rx="14" fill="#C9AFA0" opacity="0.8"/><rect x="${L}" y="${Tp}" width="${f(w * 0.62)}" height="120" rx="14" fill="${ST.blue}"/><rect x="${L}" y="${Tp + 120 - 14}" width="${w}" height="14" fill="#E8EEE4"/>
        <rect x="${L}" y="${Tp + 120}" width="150" height="${h - 240}" fill="#7CB7A4" opacity="0.7"/><rect x="${L + w - 150}" y="${Tp + 120}" width="150" height="${h - 360}" fill="#E8A33C" opacity="0.6"/>
        <g transform="translate(${L + w - 230} ${Tp + 30})"><rect width="190" height="80" rx="8" fill="#5F6A80"/><rect x="20" y="20" width="150" height="40" rx="4" fill="#1B2240"/></g>
        ${aisles}${regs}<rect x="${L + 20}" y="${Tp + h - 12}" width="170" height="12" fill="${ST.green}"/>
        ${[['DAIRY', L + w * 0.31 + 150, Tp + 62, '#FFF'], ['PRODUCE', L + 75, Tp + h / 2 - 60, '#1B4A3A'], ['BAKERY', L + w - 75, Tp + h / 2 - 150, '#5C3B00'], ['DOCK', L + w - 135, Tp + 70, '#F4F7FB'], ['ENTRANCE', L + 105, Tp + h - 30, '#1B4A3A'], ['CHECKOUT', L + 600, Tp + h - 30, '#3A3F5C']].map(([t, x, y, c]) => `<g opacity="${labels}">${T(t, 26, c, x, y, 'letter-spacing="3"')}</g>`).join('')}
        ${paths}${ping}${dot}</g>`;
    },

    // ===== at the shelf and the till =====
    // a hand basket, origin at the middle of the handle; items: array of colours poking out of the top; w width
    basket(p) {
      const w = p.w ?? 150, its = p.items || [];
      return `<g transform="${S(p)}"><path d="M ${-w * 0.4} 10 Q 0 -44 ${w * 0.4} 10" fill="none" stroke="#C7364A" stroke-width="9" stroke-linecap="round"/>
        ${its.map((c, i) => `<g transform="translate(${f((i - (its.length - 1) / 2) * 36)} ${f(46 - 16 * (i % 2))})"><rect x="-17" y="-52" width="34" height="${64 + (i % 2) * 16}" rx="8" fill="${c}"/><rect x="-17" y="-34" width="34" height="14" fill="#fff" opacity="0.4"/></g>`).join('')}
        <path d="M ${-w / 2} 34 H ${w / 2} L ${w * 0.4} 120 H ${-w * 0.4} Z" fill="#E94A5F"/><path d="M ${-w / 2} 34 H ${w / 2} V 48 H ${-w / 2} Z" fill="#C7364A"/>
        ${Array.from({ length: 4 }, (_, i) => `<rect x="${f(-w * 0.34 + i * w * 0.22)}" y="64" width="${w * 0.12}" height="40" rx="5" fill="#C7364A" opacity="0.55"/>`).join('')}</g>`;
    },
    // the till and its belt, side view: a belt with items, a register, a divider bar. origin: floor, centre. items: colours on the belt
    checkout(p) {
      const gt = p.gt ?? 0, its = p.items || [];
      return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="470" ry="16" fill="#000" opacity="0.22"/>
        <rect x="-420" y="-250" width="520" height="30" rx="8" fill="#2A2E40"/>${Array.from({ length: 14 }, (_, i) => `<rect x="${f(-410 + ((i * 38 + gt * 40) % 520))}" y="-250" width="4" height="30" fill="#3A3F5C"/>`).join('')}
        <rect x="-420" y="-220" width="520" height="220" fill="#5F6A80"/><rect x="-420" y="-220" width="520" height="14" fill="#8C96A8"/>
        ${its.map((c, i) => `<g transform="translate(${-330 + i * 100} -250)"><rect x="-26" y="-64" width="52" height="64" rx="8" fill="${c}"/><rect x="-26" y="-40" width="52" height="14" fill="#fff" opacity="0.4"/></g>`).join('')}
        <rect x="100" y="-340" width="250" height="340" rx="12" fill="#3A3F5C"/><rect x="124" y="-330" width="200" height="110" rx="10" fill="#0B1226"/>${T(p.total ?? '', 44, '#8FF0B0', 224, -276)}
        <rect x="150" y="-190" width="150" height="26" rx="6" fill="#8C96A8"/><rect x="-40" y="-300" width="10" height="50" fill="#F2C14E"/></g>`;
    },
    // a till receipt: a paper strip with lines [[name, price],...] and a total; the bottom edge is torn
    receipt(p) {
      const ls = p.lines || [], w = 300, h = 120 + ls.length * 46 + (p.total ? 70 : 0);
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="${-w / 2 + 6}" y="8" width="${w}" height="${h}" fill="#000" opacity="0.18"/>
        <path d="M ${-w / 2} 0 H ${w / 2} V ${h} ${Array.from({ length: 11 }, (_, i) => `l -${w / 11} ${i % 2 ? 10 : -10}`).join(' ')} Z" fill="#FBF8EF"/>
        ${T(p.head ?? 'SUPERMARKET', 28, '#3A3F5C', 0, 38, 'letter-spacing="4"')}<path d="M ${-w / 2 + 20} 70 H ${w / 2 - 20}" stroke="#B9B5A8" stroke-width="3" stroke-dasharray="6 6"/>
        ${ls.map(([n, pr, c], i) => `${TL(n, 24, c ?? '#3A3F5C', -w / 2 + 24, 106 + i * 46)}<text x="${w / 2 - 24}" y="${f(106 + i * 46 + 8)}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="24" fill="${c ?? '#3A3F5C'}">${esc(pr)}</text>`).join('')}
        ${p.total ? `<path d="M ${-w / 2 + 20} ${h - 80} H ${w / 2 - 20}" stroke="#B9B5A8" stroke-width="3"/>${TL('TOTAL', 28, '#1B1E33', -w / 2 + 24, h - 46)}<text x="${w / 2 - 24}" y="${h - 36}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="30" fill="#1B1E33">${esc(p.total)}</text>` : ''}</g>`;
    },
  };
  Object.assign(PROPS, W);
})();
