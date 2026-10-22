// The world of video 002 "What Happens in the 2 Seconds After You Tap Your Card" (docs/mundo-vivo.md): the café where
// time stops, the terminal, ZERO's first card, the yellow capsule (the transaction we follow), the fibre it rides,
// and the stops of the payment system. Same rules as world.js: flat tonal shapes, no outlines (only ZERO has one),
// every prop lives on its own clock gt; the stage's freeze (spec.freeze) stops that clock for the frozen café.
(() => {
  const { PROPS, COLORS, FONT, esc } = window.PUPPETS;
  const { INK, WHITE, YEL, AMBER, CORAL } = COLORS;
  const f = n => Math.round(n * 100) / 100;
  const T = (txt, size, color, x = 0, y = 0, extra = '') => `<text x="${f(x)}" y="${f(y + size * 0.35)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${size}" fill="${color}" ${extra}>${esc(txt)}</text>`;
  const TL = (txt, size, color, x = 0, y = 0, extra = '') => `<text x="${f(x)}" y="${f(y + size * 0.35)}" font-family="${FONT}" font-weight="700" font-size="${size}" fill="${color}" ${extra}>${esc(txt)}</text>`;
  const fr = x => x - Math.floor(x);
  const rnd = i => fr(Math.sin(i * 127.1 + 311.7) * 43758.5453);
  const S = p => `scale(${p.s ?? 1})`;
  const mix = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const c = [16, 8, 0].map(s => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k)); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
  const shade = (c, k) => mix(c, '#0B0E1C', k), tint = (c, k) => mix(c, '#FFFFFF', k);
  const GREEN = '#58E08A', SYS = '#7CC2FF', NAVY = '#0A1020';

  // the café palette: morning, warm wood, cream tiles, a deep green accent (yellow stays for the capsule)
  const CAFE = { wall: '#C9A98A', wallDk: '#A88468', tile: '#E9E1D2', wood: '#7A5038', woodDk: '#5C3B29', green: '#2F5A4C', board: '#22302B', chalk: '#EDE7DA', sky: '#BFE0F2' };

  const W = {
    // ===== the café (8:14 AM) =====
    // back wall: plaster above, cream subway tiles behind the bar, the chalk menu with real prices (fiction: this café),
    // a big window onto the morning street (people walk past, a bus, a pigeon on the outside sill), shelves of cups
    cafewall(p) {
      const gt = p.gt ?? 0, wx = p.winX ?? -680, ww = p.winW ?? 560, wh = p.winH ?? 440, wy = -560;
      const tiles = Array.from({ length: 9 }, (_, r) => Array.from({ length: 34 }, (_, c) => `<rect x="${-200 + c * 76 + (r % 2) * 38}" y="${-610 + r * 34}" width="72" height="30" rx="3" fill="${r % 3 === 1 && c % 5 === 2 ? '#E2D8C6' : CAFE.tile}"/>`).join('')).join('');
      // the street through the window: sky, the building across, passers-by, a bus every ~11 s
      const street = (() => {
        const ppl = Array.from({ length: 5 }, (_, i) => { const sp = 40 + rnd(i) * 50, dir = i % 2 ? -1 : 1, x = ((gt * sp * dir + rnd(i + 3) * 900) % 900 + 900) % 900 - 450;
          const c = ['#5C6E8C', '#8A5A4E', '#4E6B5A', '#6D5C7E', '#9C7A4E'][i]; return `<g transform="translate(${f(x)} ${wh / 2 - 40}) scale(${0.55 + rnd(i + 7) * 0.15})"><rect x="-16" y="-118" width="32" height="70" rx="14" fill="${c}"/><circle cy="-134" r="15" fill="${shade(c, 0.35)}"/><rect x="-12" y="-52" width="10" height="52" fill="${shade(c, 0.5)}" transform="rotate(${f(Math.sin(gt * 6 + i) * 14)} -7 -52)"/><rect x="2" y="-52" width="10" height="52" fill="${shade(c, 0.5)}" transform="rotate(${f(-Math.sin(gt * 6 + i) * 14)} 7 -52)"/></g>`; }).join('');
        const bx = ((gt % 11) / 11) * (ww + 900) - ww / 2 - 600;
        const bus = `<g transform="translate(${f(bx)} ${wh / 2 - 46})"><rect x="0" y="-150" width="560" height="140" rx="18" fill="#D9573F"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${24 + i * 86}" y="-132" width="70" height="56" rx="6" fill="#F4E6CF" opacity="0.85"/>`).join('')}<circle cx="110" cy="-10" r="26" fill="#1B1E33"/><circle cx="450" cy="-10" r="26" fill="#1B1E33"/></g>`;
        const facade = `<rect x="${-ww / 2}" y="${-wh / 2 + 60}" width="${ww}" height="${wh - 120}" fill="#D7C7B0"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${-ww / 2 + 24 + (i % 4) * 136}" y="${-wh / 2 + 90 + Math.floor(i / 4) * 120}" width="88" height="80" fill="${rnd(i + 2) > 0.6 ? '#F2D79B' : '#9FB6C8'}"/>`).join('')}<rect x="${-ww / 2}" y="${wh / 2 - 70}" width="${ww}" height="70" fill="#9AA0A8"/>`;
        return `<rect x="${-ww / 2}" y="${-wh / 2}" width="${ww}" height="${wh}" fill="${CAFE.sky}"/>${facade}${bus}${ppl}<path d="M ${-ww / 2} ${-wh / 2} L ${-ww / 2 + ww * 0.4} ${-wh / 2} L ${-ww / 2} ${wh * 0.1} Z" fill="#fff" opacity="0.12"/>`;
      })();
      const id = 'wCafeWin';
      const cups = Array.from({ length: 2 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<g transform="translate(${(p.cupsX ?? 1020) + c * 62} ${-640 + r * 120})"><path d="M -22 -40 H 22 V -8 Q 22 0 14 0 H -14 Q -22 0 -22 -8 Z" fill="${[WHITE, '#E8DCC8', '#2F5A4C', WHITE, '#C9555A', '#E8DCC8'][(c + r * 2) % 6]}"/><path d="M 22 -32 q 14 0 14 10 q 0 10 -14 10" fill="none" stroke="${['#DDD', '#CFC2AC', '#244A3E', '#DDD', '#A8444A', '#CFC2AC'][(c + r * 2) % 6]}" stroke-width="5"/></g>`).join('') + `<rect x="${(p.cupsX ?? 1020) - 30}" y="${-636 + r * 120}" width="400" height="12" rx="3" fill="${CAFE.woodDk}"/>`).join('');
      const menu = `<g transform="translate(${p.menuX ?? 250} ${p.menuY ?? -740})"><rect x="-330" y="-150" width="660" height="300" rx="10" fill="${CAFE.woodDk}"/><rect x="-312" y="-132" width="624" height="264" rx="6" fill="${CAFE.board}"/>
        ${T('MORNING', 30, '#E8C468', 0, -104, 'letter-spacing="4"')}
        ${[['COFFEE', '4.75'], ['LATTE', '5.25'], ['TEA', '3.50'], ['CROISSANT', '3.95']].map(([n, pr], i) => `${TL(n, 30, CAFE.chalk, -270, -50 + i * 50)}<path d="M ${-100 + n.length * 4} ${-46 + i * 50} H 150" stroke="${CAFE.chalk}" stroke-width="2" stroke-dasharray="3 7" opacity="0.5"/>${TL('$' + pr, 30, i === 0 && p.hlPrice ? YEL : CAFE.chalk, 168, -50 + i * 50)}`).join('')}</g>`;
      return `<g><rect x="-3200" y="-2200" width="6400" height="2200" fill="${CAFE.wall}"/><rect x="-3200" y="-640" width="6400" height="640" fill="${CAFE.wallDk}" opacity="0.25"/>
        ${tiles}
        <g transform="translate(${wx} ${wy})"><defs><clipPath id="${id}"><rect x="${-ww / 2}" y="${-wh / 2}" width="${ww}" height="${wh}"/></clipPath></defs>
          <rect x="${-ww / 2 - 22}" y="${-wh / 2 - 22}" width="${ww + 44}" height="${wh + 44}" fill="${CAFE.green}"/><g clip-path="url(#${id})">${street}</g>
          <path d="M 0 ${-wh / 2} V ${wh / 2}" stroke="${CAFE.green}" stroke-width="14"/><rect x="${-ww / 2 - 34}" y="${wh / 2 + 16}" width="${ww + 68}" height="22" rx="4" fill="${shade(CAFE.green, 0.25)}"/>
          ${TL('OPEN', 40, '#F2D79B', -ww / 2 + 30, -wh / 2 + 40, 'opacity="0.9" letter-spacing="3"')}
          <ellipse cx="0" cy="0" rx="${ww}" ry="${wh}" fill="url(#wCool)" opacity="0.35"/></g>
        ${menu}${cups}
        <rect x="-3200" y="-26" width="6400" height="26" fill="${shade(CAFE.wall, 0.45)}"/></g>`;
    },
    // a pigeon outside on the sill, flat world style; flap 0..1 opens the wings (freeze it mid-flap)
    bird(p) {
      const gt = p.gt ?? 0, fl = p.flap ?? Math.max(0, Math.sin(gt * 14)) * (fr(gt / 5) < 0.25 ? 1 : 0), pk = p.peck ?? (fr(gt / 2.3) < 0.15 ? 1 : 0), c = '#7D8496';
      return `<g transform="${S(p)} scale(${p.flip ? -1 : 1} 1)"><ellipse cx="0" cy="4" rx="40" ry="6" fill="#000" opacity="0.2"/>
        <path d="M -40 -30 Q -10 -64 34 -40 Q 44 -20 20 -6 L -30 -10 Z" fill="${c}"/><path d="M -36 -24 L -66 -36 L -58 -14 Z" fill="${shade(c, 0.3)}"/>
        <g transform="translate(-4 -40) rotate(${f(-20 - 80 * fl)})"><path d="M 0 0 Q 30 -10 52 6 Q 24 14 0 8 Z" fill="${shade(c, 0.2)}"/></g>
        <g transform="translate(30 -46) rotate(${f(pk * 40)})"><circle r="14" fill="${shade(c, 0.1)}"/><circle cx="5" cy="-3" r="2.6" fill="#1B1E33"/><path d="M 12 0 L 22 3 L 12 6 Z" fill="#E0A100"/><path d="M -8 8 Q 0 14 8 8" stroke="#6FB49A" stroke-width="4" fill="none"/></g>
        <path d="M -6 -6 v 10 M 8 -6 v 10" stroke="#C97A5A" stroke-width="3"/></g>`;
    },
    // the espresso machine on the back counter: chrome body, two group heads, a gauge whose needle trembles, steam
    // from the wand; pour 0..1 draws the coffee falling into the cup under the left spout (cupFill 0..1)
    espresso(p) {
      const gt = p.gt ?? 0, pour = p.pour ?? 0, cf = p.cupFill ?? 0;
      const steam = Array.from({ length: 6 }, (_, i) => { const k = fr(gt * 0.5 + i / 6); return `<circle cx="${f(170 + Math.sin(k * 7 + i) * 16)}" cy="${f(-120 - k * 200)}" r="${f(10 + k * 30)}" fill="#F4F1EA" opacity="${f(0.35 * (1 - k))}"/>`; }).join('');
      const drops = pour > 0 ? Array.from({ length: 5 }, (_, i) => { const k = fr(gt * 2.2 + i / 5); return `<ellipse cx="-80" cy="${f(-142 + k * 70)}" rx="3.5" ry="6" fill="#5A3420" opacity="${f(pour)}"/>`; }).join('') : '';
      return `<g transform="${S(p)}"><ellipse cx="0" cy="4" rx="230" ry="14" fill="#000" opacity="0.25"/>
        <rect x="-220" y="-330" width="440" height="200" rx="22" fill="#C9CED8"/><rect x="-220" y="-330" width="440" height="40" rx="18" fill="#E4E8EE"/><rect x="150" y="-330" width="70" height="200" rx="18" fill="#A7AEBB"/>
        ${[-80, 60].map(x => `<g transform="translate(${x} -130)"><rect x="-34" y="0" width="68" height="26" rx="6" fill="#4A5270"/><rect x="-10" y="26" width="20" height="14" fill="#3A3F5C"/><rect x="34" y="6" width="80" height="12" rx="6" fill="#2A2E40"/></g>`).join('')}
        <g transform="translate(-10 -240)"><circle r="34" fill="#F4F1EA"/><circle r="34" fill="none" stroke="#4A5270" stroke-width="6"/><path d="M 0 0 L ${f(22 * Math.cos(-0.6 + Math.sin(gt * 9) * 0.06))} ${f(22 * Math.sin(-0.6 + Math.sin(gt * 9) * 0.06))}" stroke="${CORAL}" stroke-width="4" stroke-linecap="round"/></g>
        <path d="M 170 -150 L 186 -60" stroke="#8B93A3" stroke-width="10" stroke-linecap="round"/>${steam}
        <rect x="-220" y="-20" width="440" height="20" rx="4" fill="#4A5270"/><rect x="-200" y="-30" width="400" height="12" rx="3" fill="#6C7590"/>
        ${pour > 0 ? `<rect x="-84" y="-104" width="8" height="${f(70 * Math.min(1, pour * 1.5))}" rx="4" fill="#6B3E24"/>` : ''}${drops}
        <g transform="translate(-80 -30)"><path d="M -30 -48 H 30 L 24 0 H -24 Z" fill="${WHITE}"/><path d="M -27 ${f(-44 + 40 * (1 - cf))} H 27 L 25 -3 H -25 Z" fill="#5A3420" opacity="${f(cf > 0 ? 1 : 0)}"/><path d="M 30 -38 q 18 0 18 14 q 0 14 -18 14" fill="none" stroke="#DDD" stroke-width="6"/></g></g>`;
    },
    // the coffee stream falling from the spout into ZERO's cup, big (close shots): len, frozen drops hang in the air
    pourclose(p) {
      const gt = p.gt ?? 0, len = p.len ?? 260;
      const drops = Array.from({ length: 7 }, (_, i) => { const k = fr(gt * 1.8 + i / 7); return `<ellipse cx="${f(Math.sin(i * 3) * 4)}" cy="${f(len * 0.55 + k * len * 0.5)}" rx="${f(5 + rnd(i) * 3)}" ry="${f(9 + rnd(i) * 4)}" fill="#6B3E24"/>`; }).join('');
      return `<g transform="${S(p)}"><path d="M -10 0 Q -8 ${len * 0.3} -5 ${len * 0.55} L 5 ${len * 0.55} Q 8 ${len * 0.3} 10 0 Z" fill="#6B3E24"/><path d="M -3 0 V ${len * 0.5}" stroke="#A8724E" stroke-width="3" opacity="0.6"/>${drops}
        <g transform="translate(0 ${len + 20})"><path d="M -110 -140 H 110 L 90 0 H -90 Z" fill="${WHITE}"/><path d="M -104 -120 H 104 L 100 -96 H -100 Z" fill="#5A3420"/><path d="M 110 -110 q 60 0 60 44 q 0 44 -60 44" fill="none" stroke="#E6E1D6" stroke-width="18"/><ellipse cx="0" cy="-120" rx="104" ry="14" fill="#7A4A2C"/>
          ${Array.from({ length: 4 }, (_, i) => { const k = fr(gt * 0.6 + i / 4); return `<circle cx="${f(-30 + i * 22 + Math.sin(k * 6) * 8)}" cy="${f(-150 - k * 120)}" r="${f(8 + k * 18)}" fill="#F4F1EA" opacity="${f(0.4 * (1 - k))}"/>`; }).join('')}</g></g>`;
    },
    // the front counter: warm wood with panels, a glass pastry case (croissants, muffins), a tip jar, napkins
    barcounter(p) {
      const w = p.w ?? 1100, top = -300, c = CAFE.wood;
      const pastries = Array.from({ length: 6 }, (_, i) => i % 2 ? `<path d="M ${-30 + (i % 3) * 0} 0 q 30 -40 60 0 q -30 10 -60 0 Z" fill="#D9A45A" transform="translate(${-180 + i * 64} ${i < 3 ? -60 : -10})"/>` : `<g transform="translate(${-180 + i * 64} ${i < 3 ? -60 : -10})"><path d="M -24 0 L -20 -26 H 20 L 24 0 Z" fill="#B76E4A"/><ellipse cx="0" cy="-28" rx="26" ry="16" fill="#7A3E2A"/></g>`).join('');
      return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="${w / 2 + 40}" ry="18" fill="#000" opacity="0.3"/>
        <rect x="${-w / 2}" y="${top}" width="${w}" height="${-top}" fill="${c}"/>${Array.from({ length: 11 }, (_, i) => `<rect x="${-w / 2 + i * w / 11}" y="${top + 30}" width="6" height="${-top - 40}" fill="${shade(c, 0.18)}"/>`).join('')}
        <rect x="${-w / 2}" y="-40" width="${w}" height="40" fill="${shade(c, 0.35)}"/>
        <rect x="${-w / 2 - 20}" y="${top - 24}" width="${w + 40}" height="28" rx="5" fill="#E9E2D3"/><rect x="${-w / 2 - 20}" y="${top}" width="${w + 40}" height="8" fill="#B8AE9B"/>
        <g transform="translate(${-w * 0.3} ${top - 24})"><rect x="-230" y="-150" width="460" height="150" rx="10" fill="#DDEBF2" opacity="0.35"/>${pastries}<rect x="-230" y="-150" width="460" height="10" fill="#A7AEBB"/><path d="M -220 -140 L -140 -140 L -210 -20 Z" fill="#fff" opacity="0.2"/></g>
        <g transform="translate(${w * 0.06} ${top - 24})"><path d="M -34 0 L -30 -86 H 30 L 34 0 Z" fill="#DDEBF2" opacity="0.55"/><rect x="-34" y="-96" width="68" height="12" rx="4" fill="#C2CBD6"/>${T('TIPS', 16, '#3A3F5C', 0, -60)}<circle cx="-10" cy="-14" r="10" fill="#E0A100"/><circle cx="8" cy="-10" r="9" fill="#C9CED8"/><rect x="-18" y="-40" width="34" height="18" rx="3" fill="#7BC67E" transform="rotate(-14)"/></g></g>`;
    },
    // the card terminal on its swivel stand (the scene's star): screen with l1 (amount), l2 (status), the timer
    // (seconds, shown as "0.00 s"), the contactless mark; wave 0..1 sends the radio rings out to the card; ok 0..1
    // turns it green (APPROVED); open 0..1 lifts the screen like a hatch onto a glowing cable shaft going down
    payterm(p) {
      const gt = p.gt ?? 0, ok = p.ok ?? 0, wv = p.wave ?? 0, op = p.open ?? 0;
      const scr = ok > 0.5 ? '#D8F7E3' : '#E8F1FA', stCol = ok > 0.5 ? '#1E8C4E' : (p.st2 ?? '#2F5E9E');
      const rings = wv > 0 ? [0, 1, 2].map(i => { const k = fr(gt * 1.6 + i / 3); return `<path d="M ${f(-30 - k * 40)} ${f(-300 - k * 30)} A ${f(40 + k * 60)} ${f(40 + k * 60)} 0 0 1 ${f(30 + k * 40)} ${f(-300 - k * 30)}" fill="none" stroke="${SYS}" stroke-width="5" opacity="${f(wv * (1 - k))}"/>`; }).join('') : '';
      return `<g transform="${S(p)}"><ellipse cx="0" cy="2" rx="80" ry="10" fill="#000" opacity="0.3"/>
        <rect x="-26" y="-60" width="52" height="60" fill="#3A3F5C"/><rect x="-60" y="-12" width="120" height="14" rx="6" fill="#2A2E40"/>
        <g transform="translate(0 -60)"><rect x="-80" y="-250" width="160" height="250" rx="22" fill="#2A2E40"/><rect x="-80" y="-250" width="160" height="30" rx="14" fill="#3A3F5C"/>
          <rect x="-64" y="-224" width="128" height="104" rx="8" fill="${scr}"/>
          ${T(p.l1 ?? '$4.75', 30, '#1B1E33', 0, -196)}${T(p.l2 ?? 'TAP CARD', p.s2 ?? 15, stCol, 0, -162, 'letter-spacing="1.5"')}
          ${p.timer != null ? `<rect x="-46" y="-148" width="92" height="22" rx="5" fill="${ok > 0.5 ? '#1E8C4E' : '#1B1E33'}"/>${T(Number(p.timer).toFixed(2) + ' s', 15, ok > 0.5 ? '#E6FFE9' : YEL, 0, -142, 'letter-spacing="1"')}` : ''}
          ${[0, 1, 2, 3].map(r => [0, 1, 2].map(c => `<rect x="${-46 + c * 34}" y="${-108 + r * 24}" width="24" height="16" rx="4" fill="${r === 3 && c === 2 ? '#2E9E5B' : r === 3 && c === 0 ? '#C9555A' : '#4A5270'}"/>`).join('')).join('')}
          <g transform="translate(0 -12)">${[0, 1, 2].map(i => `<path d="M ${-4 + i * 6} -10 q 6 10 0 20" fill="none" stroke="#9AA3B5" stroke-width="2.5" transform="translate(${i * 4} 0)"/>`).join('')}</g>
          ${op > 0 ? `<g opacity="${f(op)}"><rect x="-80" y="-250" width="160" height="250" rx="22" fill="${NAVY}" opacity="0.82"/><rect x="-80" y="-250" width="160" height="250" rx="22" fill="none" stroke="${SYS}" stroke-width="4"/>
            <rect x="-50" y="-200" width="100" height="70" rx="6" fill="none" stroke="${SYS}" stroke-width="3" opacity="0.7"/><rect x="-30" y="-110" width="60" height="40" rx="4" fill="#13203A" stroke="${SYS}" stroke-width="3"/>${T('CHIP', 11, SYS, 0, -96)}
            ${[-16, 0, 16].map((x, i) => `<path d="M ${x} -70 V 120" stroke="${i === 1 ? YEL : SYS}" stroke-width="${i === 1 ? 6 : 3}" opacity="${f(0.6 + 0.4 * Math.sin(gt * 7 + i))}"/>`).join('')}
            <circle cx="0" cy="${f(-60 + fr(gt * 1.4) * 180)}" r="7" fill="${YEL}"/></g>` : ''}</g>
        ${rings}</g>`;
    },
    // ZERO's first credit card (purple, so yellow stays for the capsule): chip, contactless mark, last digits; sticker 0..1
    // still on it (ACTIVATE), peel 0..1 curls it off; xray 0..1 shows what's inside (the antenna coil around the edge,
    // the chip); wake 0..1 lights the coil (the terminal's field powers it)
    zcard(p) {
      const c = p.color ?? '#6B4FD6', xr = p.xray ?? 0, wk = p.wake ?? 0, gt = p.gt ?? 0, st = p.sticker ?? 0, pl = p.peel ?? 0;
      const coil = Array.from({ length: 4 }, (_, i) => { const m = 10 + i * 7; return `<rect x="${-86 + m}" y="${-54 + m}" width="${172 - 2 * m}" height="${108 - 2 * m}" rx="${12 - i}" fill="none" stroke="${wk > 0 ? mix('#C9A227', '#FFF2A8', wk * (0.6 + 0.4 * Math.sin(gt * 20 + i))) : '#C9A227'}" stroke-width="2.4"/>`; }).join('');
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})">
        <rect x="-86" y="-54" width="172" height="108" rx="12" fill="${c}" opacity="${f(1 - 0.75 * xr)}"/><rect x="-86" y="-54" width="172" height="108" rx="12" fill="${NAVY}" opacity="${f(0.85 * xr)}"/>
        <path d="M -86 20 Q 0 -10 86 30 V 42 Q 86 54 74 54 H -74 Q -86 54 -86 42 Z" fill="${shade(c, 0.2)}" opacity="${f(1 - xr)}"/>
        ${xr > 0 ? `<g opacity="${f(xr)}"><rect x="-86" y="-54" width="172" height="108" rx="12" fill="none" stroke="#9C88F0" stroke-width="3"/>${coil}<path d="M -50 -6 H -36" stroke="#C9A227" stroke-width="2.4"/></g>` : ''}
        <rect x="-66" y="-16" width="34" height="26" rx="5" fill="#E6C14A"/><path d="M -66 -3 H -32 M -49 -16 V 10" stroke="#B9962F" stroke-width="2"/>
        ${wk > 0 ? `<rect x="-72" y="-22" width="46" height="38" rx="8" fill="none" stroke="#FFF2A8" stroke-width="3" opacity="${f(wk)}"/>` : ''}
        <g opacity="${f(1 - xr)}">${T('•••• 4417', 15, '#EDE7FF', 22, 22, 'letter-spacing="1"')}${T('ZERO', 11, '#D9D0FF', -50, 38, 'letter-spacing="2"')}
          <g transform="translate(58 -30)">${[0, 1, 2].map(i => `<path d="M ${i * 6} -9 q 6 9 0 18" fill="none" stroke="#EDE7FF" stroke-width="2.4"/>`).join('')}</g></g>
        ${st > 0 ? `<g opacity="${f(st)}" transform="translate(20 -6) rotate(${f(-6 - 40 * pl)} 60 -20) translate(${f(60 * pl)} ${f(-50 * pl)})"><rect x="-58" y="-22" width="116" height="40" rx="5" fill="#FBF8F1"/><path d="M 44 -22 L 58 -22 L 58 -8 Z" fill="#E2DCCD"/>${T('ACTIVATE', 14, '#C63D46', 0, -9, 'letter-spacing="1"')}${T('call 1-800', 9, '#5C6684', 0, 6)}</g>` : ''}
      </g>`;
    },
    // ===== the object we follow =====
    // the capsule: the transaction, a pill of yellow light with the amount on it. state: ask (yellow) | ok (green) |
    // hold (coral); trail 0..1 draws streaks behind it (direction ang degrees); spin wobbles it; glow sizes its halo
    capsule(p) {
      const gt = p.gt ?? 0, stt = p.state ?? 'ask', c = stt === 'ok' ? '#5BE08F' : stt === 'hold' ? CORAL : YEL, c2 = stt === 'ok' ? '#1E8C4E' : stt === 'hold' ? '#B5463E' : AMBER;
      const tr = p.trail ?? 0, wob = (p.spin ?? 1) * Math.sin(gt * 5) * 3;
      const streaks = tr > 0 ? Array.from({ length: 7 }, (_, i) => { const y = -34 + i * 11, l = (120 + rnd(i) * 220) * tr, k = fr(gt * 3 + rnd(i + 4)); return `<rect x="${f(-90 - l - k * 40)}" y="${f(y - 2)}" width="${f(l)}" height="4" rx="2" fill="${c}" opacity="${f(0.25 + 0.4 * rnd(i + 1))}"/>`; }).join('') : '';
      return `<g transform="${S(p)} rotate(${f((p.ang ?? 0))})">${streaks}<g transform="rotate(${f(wob)})">
        <ellipse rx="${f(150 * (p.glow ?? 1))}" ry="${f(90 * (p.glow ?? 1))}" fill="url(#wPix)" opacity="0.9"/>
        <rect x="-86" y="-38" width="172" height="76" rx="38" fill="${c}"/><rect x="-86" y="4" width="172" height="34" rx="17" fill="${c2}" opacity="0.45"/>
        <rect x="-64" y="-28" width="90" height="10" rx="5" fill="#FFFFFF" opacity="0.55"/>
        ${T(p.txt ?? '$4.75', 34, stt === 'ask' ? '#3A2A00' : '#08240F', 0, -4)}
        ${p.check ? `<circle cx="78" cy="-30" r="20" fill="#1E8C4E"/><path d="M 68 -30 l 7 8 l 13 -15" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>` : ''}</g></g>`;
    },
    // inside the cable: fibre strands converging on a vanishing point, rings of light rushing at us (speed), pulses
    // flying along the strands; tint shifts the colour (blue by day, deep purple at night)
    fiber(p) {
      const gt = p.gt ?? 0, sp = p.speed ?? 1, vx = p.vx ?? 960, vy = p.vy ?? 470, col = p.tint ?? SYS, bg = p.bg ?? '#050A18';
      const strands = Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2 + 0.1, R = 1500; return `<path d="M ${vx} ${vy} L ${f(vx + Math.cos(a) * R)} ${f(vy + Math.sin(a) * R * 0.8)}" stroke="${col}" stroke-width="${2 + (i % 3)}" opacity="${0.12 + 0.1 * (i % 4)}"/>`; }).join('');
      const rings = Array.from({ length: 7 }, (_, i) => { const k = fr(gt * 0.45 * sp + i / 7), z = Math.pow(k, 2.4), r = 30 + z * 1500; return `<ellipse cx="${vx}" cy="${vy}" rx="${f(r)}" ry="${f(r * 0.78)}" fill="none" stroke="${col}" stroke-width="${f(2 + z * 22)}" opacity="${f(Math.min(1, k * 2) * (1 - z) * 0.55)}"/>`; }).join('');
      const pulses = Array.from({ length: 22 }, (_, i) => { const a = rnd(i) * Math.PI * 2, k = fr(gt * (0.3 + rnd(i + 9) * 0.5) * sp + rnd(i + 2)), z = Math.pow(k, 2.2), d = 40 + z * 1300; return `<rect x="${f(vx + Math.cos(a) * d)}" y="${f(vy + Math.sin(a) * d * 0.8)}" width="${f(4 + z * 50)}" height="${f(3 + z * 6)}" rx="2" fill="${i % 7 === 0 ? '#FFFFFF' : col}" opacity="${f(0.3 + 0.7 * z)}" transform="rotate(${f(a * 180 / Math.PI)} ${f(vx + Math.cos(a) * d)} ${f(vy + Math.sin(a) * d * 0.8)})"/>`; }).join('');
      return `<g><rect x="-200" y="-200" width="2320" height="1480" fill="${bg}"/><radialGradient id="wFibC"><stop offset="0" stop-color="${col}" stop-opacity="0.55"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>
        <circle cx="${vx}" cy="${vy}" r="380" fill="url(#wFibC)"/>${strands}${rings}${pulses}<circle cx="${vx}" cy="${vy}" r="18" fill="#FFFFFF" opacity="0.8"/></g>`;
    },
    // SYSTEM VIEW of the message: a record with its fields (hl lights one, 1-4), the joke row NAME (NOT INCLUDED, coral),
    // and the easter egg nobody points at: FUNDS — (there is no money in the message)
    msgcard(p) {
      const hl = p.hl ?? 0, gt = p.gt ?? 0;
      const rows = [['CARD', '•••• •••• •••• 4417'], ['AMOUNT', '$4.75'], ['SHOP', 'CAFÉ #20931'], ['CODE', p.code ?? '8F3A-91C2-E07B'], ['NAME', 'NOT INCLUDED'], ['FUNDS', '—']];
      return `<g transform="${S(p)}"><rect x="-430" y="-300" width="860" height="600" rx="26" fill="${NAVY}" opacity="0.92"/><rect x="-430" y="-300" width="860" height="600" rx="26" fill="none" stroke="${SYS}" stroke-width="4"/>
        <rect x="-430" y="-300" width="860" height="70" rx="26" fill="#13203A"/>${TL('AUTHORIZATION REQUEST', 26, SYS, -390, -266, 'letter-spacing="3"')}<circle cx="380" cy="-266" r="10" fill="${YEL}" opacity="${f(0.5 + 0.5 * Math.sin(gt * 6))}"/>
        ${rows.map(([k, v], i) => { const on = hl === i + 1, joke = i === 4, egg = i === 5, y = -190 + i * 76; return `<g opacity="${f(egg ? 0.45 : (hl && !on && !joke ? 0.55 : 1))}"><rect x="-400" y="${y - 30}" width="800" height="62" rx="10" fill="${on ? '#1C3358' : 'transparent'}"/>${TL(k, 24, joke ? '#FF8A9A' : '#8FA6C8', -380, y, 'letter-spacing="2"')}${TL(v, 30, joke ? '#FF8A9A' : (on ? YEL : '#E6ECF5'), -170, y, i === 3 ? 'font-family="monospace" letter-spacing="2"' : '')}</g>`; }).join('')}
        <rect x="-430" y="${f(-300 + 600 * fr(gt * 0.35))}" width="860" height="5" fill="${SYS}" opacity="0.35"/></g>`;
    },
    // the clone gag: the one-time code, a copy of it that greys out and crumbles (k 0..1)
    clonegag(p) {
      const k = p.k ?? 0;
      const card = (txt, col, o) => `<rect x="-150" y="-56" width="300" height="112" rx="14" fill="#13203A" stroke="${col}" stroke-width="4" opacity="${o}"/>${T(txt, 34, col, 0, -6, `font-family="monospace" letter-spacing="3" opacity="${o}"`)}`;
      const bits = Array.from({ length: 14 }, (_, i) => `<rect x="${f(-140 + i * 20 + rnd(i) * 10)}" y="${f(-40 + k * 300 * (0.5 + rnd(i + 5)))}" width="16" height="16" fill="#6C7590" opacity="${f(Math.max(0, k * 2 - 1) * (1 - k * 0.6))}" transform="rotate(${f(k * 200 * rnd(i + 2))} ${f(-132 + i * 20)} 0)"/>`).join('');
      return `<g transform="${S(p)}"><g transform="translate(-220 0)">${card(p.code ?? '8F3A', YEL, 1)}${T('ORIGINAL', 18, '#8FA6C8', 0, 80, 'letter-spacing="3"')}</g>
        <path d="M -50 0 H 50" stroke="#8FA6C8" stroke-width="5" stroke-dasharray="10 8"/><path d="M 40 -12 L 56 0 L 40 12" fill="none" stroke="#8FA6C8" stroke-width="5"/>
        <g transform="translate(220 0)">${card(p.code ?? '8F3A', mix(YEL, '#6C7590', Math.min(1, k * 1.6)), f(1 - 0.35 * Math.min(1, k)))}${bits}${T(k > 0.3 ? 'TOO LATE' : 'COPY', 18, k > 0.3 ? '#FF8A9A' : '#8FA6C8', 0, 80, 'letter-spacing="3"')}
          ${k > 0.45 ? `<g transform="rotate(-12) scale(${f(Math.min(1, 0.6 + (k - 0.45) * 3))})" opacity="${f(Math.min(1, (k - 0.45) * 4))}"><rect x="-130" y="-34" width="260" height="68" rx="8" fill="none" stroke="${CORAL}" stroke-width="7"/>${T('EXPIRED', 44, CORAL, 0, -4, 'letter-spacing="4"')}</g>` : ''}</g></g>`;
    },
    // a phone showing the card that's paying with it: the number wears a disguise (glasses and a moustache, k 0..1)
    tokenphone(p) {
      const k = p.k ?? 0;
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><rect x="-120" y="-220" width="240" height="440" rx="36" fill="#1B1E33"/><rect x="-104" y="-196" width="208" height="392" rx="18" fill="#E8F1FA"/>
        <g transform="translate(0 -60) scale(1.05)"><rect x="-86" y="-54" width="172" height="108" rx="12" fill="#6B4FD6"/><rect x="-66" y="-16" width="34" height="26" rx="5" fill="#E6C14A"/>${T(k > 0.5 ? '•••• 9032' : '•••• 4417', 15, '#EDE7FF', 22, 22)}</g>
        ${k > 0 ? `<g opacity="${f(Math.min(1, k * 2))}" transform="translate(28 -40)"><circle cx="-26" cy="0" r="16" fill="none" stroke="#1B1E33" stroke-width="5"/><circle cx="20" cy="0" r="16" fill="none" stroke="#1B1E33" stroke-width="5"/><path d="M -10 0 H 4" stroke="#1B1E33" stroke-width="5"/><path d="M -28 22 Q -16 14 -3 22 Q 10 14 22 22 Q 10 32 -3 26 Q -16 32 -28 22 Z" fill="#1B1E33"/></g>` : ''}
        ${T(k > 0.5 ? 'TOKEN' : 'CARD', 30, k > 0.5 ? '#2F80ED' : '#1B1E33', 0, 70, 'letter-spacing="4"')}${T('not the real number', 16, '#5C6684', 0, 110, `opacity="${f(Math.max(0, k * 2 - 1))}"`)}</g>`;
    },
    // the route hologram: card → bank in a straight line (cross 0..1 strikes it), then the real path with three stops
    // (prog 0..1): SHOP SIDE, NETWORK, ZERO'S BANK, and back
    routeholo(p) {
      const cr = p.cross ?? 0, pr = p.prog ?? 0, gt = p.gt ?? 0;
      const A = [-560, 120], B = [560, 120], st = [[-280, -110, 'SHOP SIDE'], [0, -190, 'NETWORK'], [280, -110, "ZERO'S BANK"]];
      const path = `M ${A[0]} ${A[1]} C -500 -60 -380 -110 -280 -110 S -100 -190 0 -190 S 200 -110 280 -110 S 500 -60 ${B[0]} ${B[1]}`;
      return `<g transform="${S(p)}"><rect x="-680" y="-300" width="1360" height="540" rx="30" fill="${NAVY}" opacity="0.6"/>
        <g transform="translate(${A[0]} ${A[1]})"><rect x="-56" y="-36" width="112" height="72" rx="10" fill="#6B4FD6"/>${T('CARD', 20, '#EDE7FF', 0, 70)}</g>
        <g transform="translate(${B[0]} ${B[1]})"><path d="M -60 30 V -10 L 0 -46 L 60 -10 V 30 Z" fill="none" stroke="${SYS}" stroke-width="7" stroke-linejoin="round"/>${T('BANK', 20, SYS, 0, 70)}</g>
        <path d="M ${A[0] + 70} ${A[1]} H ${B[0] - 80}" stroke="#E6ECF5" stroke-width="6" stroke-dasharray="16 12" opacity="${f(1 - Math.max(0, pr - 0.2))}"/>
        ${cr > 0 ? `<path d="M ${f(-cr * 40)} ${f(120 - cr * 40)} L ${f(cr * 40)} ${f(120 + cr * 40)} M ${f(cr * 40)} ${f(120 - cr * 40)} L ${f(-cr * 40)} ${f(120 + cr * 40)}" stroke="#FF5A4E" stroke-width="12" stroke-linecap="round"/>` : ''}
        ${pr > 0 ? `<path d="${path}" fill="none" stroke="${YEL}" stroke-width="7" stroke-linecap="round" pathLength="100" stroke-dasharray="${f(100 * pr)} 100"/>` : ''}
        ${st.map(([x, y, n], i) => { const on = pr > 0.18 + i * 0.25; return `<g transform="translate(${x} ${y})" opacity="${f(on ? 1 : 0.0)}"><circle r="34" fill="#13203A" stroke="${YEL}" stroke-width="5"/>${T(String(i + 1), 30, YEL, 0, -2)}${T(n, 22, '#E6ECF5', 0, -66, 'letter-spacing="2"')}</g>`; }).join('')}
        <circle cx="${f(A[0])}" cy="${f(A[1])}" r="${f(14 + 8 * Math.sin(gt * 5))}" fill="none" stroke="${YEL}" stroke-width="3" opacity="0.5"/></g>`;
    },
  };
  // line icons for holograms (added to world.js's set): the shop, the card, the network, the bank, a lock, a shield
  Object.assign(window.WORLD.icons, {
    shop: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"><path d="M -50 -10 V 40 H 50 V -10"/><path d="M -58 -10 L -48 -42 H 48 L 58 -10 Z"/><rect x="-14" y="10" width="28" height="30"/></g>`,
    card: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"><rect x="-56" y="-36" width="112" height="72" rx="10"/><path d="M -56 -12 H 56"/></g><rect x="-40" y="6" width="22" height="16" rx="3" fill="${c}"/>`,
    network: c => `<g stroke="${c}" stroke-width="6"><path d="M -40 -30 L 40 30 M -40 30 L 40 -30 M -50 0 H 50 M 0 -40 V 40"/></g><g fill="${c}"><circle cx="-40" cy="-30" r="10"/><circle cx="40" cy="30" r="10"/><circle cx="-40" cy="30" r="10"/><circle cx="40" cy="-30" r="10"/><circle r="14"/></g>`,
    bank: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"><path d="M -56 -14 L 0 -46 L 56 -14 Z"/><path d="M -40 -6 V 30 M -14 -6 V 30 M 14 -6 V 30 M 40 -6 V 30"/><path d="M -58 40 H 58"/></g>`,
    lock: c => `<g fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"><rect x="-36" y="-6" width="72" height="50" rx="8"/><path d="M -22 -6 V -24 A 22 22 0 0 1 22 -24 V -6"/></g><circle cy="18" r="7" fill="${c}"/>`,
    shield: c => `<path d="M 0 -48 L 42 -32 V 4 Q 42 34 0 50 Q -42 34 -42 4 V -32 Z" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/><path d="M -16 2 L -4 14 L 18 -12" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
    phone: c => `<rect x="-26" y="-46" width="52" height="92" rx="10" fill="none" stroke="${c}" stroke-width="7"/><circle cy="32" r="5" fill="${c}"/>`,
  });
  // the terminal's radio field reaching out (rings of arcs from y = 0 upward, then the card above lights up): on 0..1
  W.field = p => { const gt = p.gt ?? 0, on = p.on ?? 1, r0 = p.r ?? 360; return `<g transform="${S(p)}" opacity="${f(on)}">${[0, 1, 2, 3].map(i => { const k = fr(gt * 0.9 + i / 4), r = 60 + k * r0; return `<path d="M ${f(-r)} 0 A ${f(r)} ${f(r * 0.7)} 0 0 1 ${f(r)} 0" fill="none" stroke="${SYS}" stroke-width="${f(10 - 6 * k)}" opacity="${f(0.8 * (1 - k))}"/>`; }).join('')}</g>`; };
  // the ripple when time stops: a ring that leaves the terminal and sweeps the room (k 0..1)
  W.ripple = p => { const k = p.k ?? 0; if (k <= 0 || k >= 1) return ''; const r = 40 + k * 2600; return `<circle r="${f(r)}" fill="none" stroke="#DDEBFF" stroke-width="${f(30 * (1 - k))}" opacity="${f(0.7 * (1 - k))}"/><circle r="${f(r * 0.92)}" fill="none" stroke="#FFFFFF" stroke-width="${f(6 * (1 - k))}" opacity="${f(0.5 * (1 - k))}"/>`; };
  // ===== part 2: the three stops (each stop has its own colour so the journey reads at a glance) =====
  // SHOP SIDE is teal and institutional, the NETWORK is a navy-and-gold grand station, ZERO'S BANK is burgundy and brass
  const ACQ = { wall: '#25403F', wallDk: '#1A2E2E', floor: '#2C3A3A', glass: '#9FE3D6', brass: '#C9A24A' };
  const NET = { wall: '#1C2658', wallDk: '#111842', floor: '#232C60', gold: '#E2B54E', glass: '#7CC2FF' };
  const BNK = { wall: '#3A2230', wallDk: '#26141E', floor: '#2E1A24', brass: '#C9A24A', brassDk: '#8A6A2A' };
  // the other transactions: pale little capsules, never yellow (yellow is only ZERO's)
  const pale = (x, y, s, o = 1, c = '#DDE6EA') => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})" opacity="${f(o)}"><rect x="-30" y="-13" width="60" height="26" rx="13" fill="${c}"/><rect x="-22" y="-9" width="30" height="5" rx="2.5" fill="#fff" opacity="0.6"/></g>`;
  Object.assign(W, {
    // the shop side (the acquirer): a sorting hall where pneumatic tubes rain messages down from thousands of
    // terminals onto long sorting desks; a brass SHOP SIDE sign; warm desk lamps; flow 0..1 sets the traffic
    acqhall(p) {
      const gt = p.gt ?? 0, fl = p.flow ?? 1, rev = p.rev ?? 0;
      const tubes = Array.from({ length: 11 }, (_, i) => { const x = -1500 + i * 300, top = -1500, bot = -430;
        const caps = Array.from({ length: 3 }, (_, j) => { const k = fr(gt * (0.7 + rnd(i * 3 + j) * 0.6) * (rev ? -1 : 1) + rnd(i + j * 7)); return rnd(i * 5 + j) < fl ? pale(x, top + k * (bot - top), 0.9, 0.9) : ''; }).join('');
        return `<rect x="${x - 22}" y="${top}" width="44" height="${bot - top}" fill="${ACQ.glass}" opacity="0.16"/><rect x="${x - 22}" y="${top}" width="6" height="${bot - top}" fill="#fff" opacity="0.18"/>${caps}
          <path d="M ${x - 34} ${bot} h 68 l -8 40 h -52 Z" fill="${ACQ.brass}"/><rect x="${x - 26}" y="${bot + 40}" width="52" height="10" fill="${shade(ACQ.brass, 0.4)}"/>`; }).join('');
      const desks = [-1050, 0, 1050].map(x => `<g transform="translate(${x} 0)"><rect x="-420" y="-300" width="840" height="300" fill="${shade(ACQ.wall, 0.35)}"/><rect x="-440" y="-320" width="880" height="26" rx="4" fill="#B9C7C4"/>
          ${[-300, -100, 100, 300].map((tx, i) => `<g transform="translate(${tx} -320)"><path d="M -70 0 L -60 -40 H 60 L 70 0 Z" fill="#5E7472"/>${Array.from({ length: 2 + (i % 2) }, (_, j) => pale(-20 + j * 22, -34 - j * 6, 0.7, 0.95)).join('')}</g>`).join('')}
          ${[-260, 260].map(lx => `<g transform="translate(${lx} -320)"><path d="M 0 0 V -90 L 40 -130" stroke="#1B2626" stroke-width="6" fill="none"/><path d="M 20 -150 L 70 -110 L 50 -96 Z" fill="#1B2626"/><path d="M 52 -104 L 140 40 L -40 40 Z" fill="url(#wConeWarm)" opacity="0.5"/></g>`).join('')}</g>`).join('');
      return `<g><rect x="-3000" y="-2600" width="6000" height="2600" fill="${ACQ.wall}"/>
        ${Array.from({ length: 14 }, (_, i) => `<rect x="${-2800 + i * 420}" y="-2600" width="18" height="2600" fill="${ACQ.wallDk}" opacity="0.6"/>`).join('')}
        <rect x="-3000" y="-1560" width="6000" height="70" fill="${ACQ.wallDk}"/>${tubes}
        <g transform="translate(0 -1180)"><rect x="-380" y="-80" width="760" height="160" rx="12" fill="${shade(ACQ.brass, 0.55)}"/><rect x="-364" y="-64" width="728" height="128" rx="8" fill="none" stroke="${ACQ.brass}" stroke-width="5"/>
          <g transform="translate(-270 0) scale(0.75)">${window.WORLD.icons.shop(ACQ.brass)}</g>${TL('SHOP SIDE', 58, ACQ.brass, -190, -14, 'letter-spacing="6"')}${TL('CARD PROCESSING FOR SHOPS', 20, '#BFD8D2', -186, 34, 'letter-spacing="3"')}</g>
        ${desks}<rect x="-3000" y="0" width="6000" height="1800" fill="${ACQ.floor}"/><rect x="-3000" y="0" width="6000" height="900" fill="url(#wFloorFade)"/>
        ${Array.from({ length: 24 }, (_, i) => `<path d="M ${-2900 + i * 250} 0 L ${-3600 + i * 310} 900" stroke="#3A4A4A" stroke-width="3" opacity="0.6"/>`).join('')}</g>`;
    },
    // the inbox tray at a desk, close (the capsule lands in it): wire basket, a label plate
    tray(p) { return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="190" ry="14" fill="#000" opacity="0.3"/><path d="M -170 0 L -150 -80 H 150 L 170 0 Z" fill="#5E7472"/><path d="M -150 -80 H 150" stroke="#9FB3B0" stroke-width="6"/>${Array.from({ length: 9 }, (_, i) => `<path d="M ${-130 + i * 32} -76 L ${-140 + i * 35} -4" stroke="#47595A" stroke-width="4"/>`).join('')}<rect x="-60" y="-50" width="120" height="30" rx="4" fill="#E8EFEC"/>${T(p.txt ?? 'INCOMING', 14, '#25403F', 0, -36, 'letter-spacing="2"')}</g>`; },
    // the card number on a departure-board panel: the first eight digits (the BIN) light up (k 0..1) and answer two
    // questions (ans 0..1): which network, which bank; below, a rail switch whose blade swings (sw 0..1) toward NETWORK
    binboard(p) {
      const k = p.k ?? 0, ans = p.ans ?? 0, sw = p.sw ?? 0, gt = p.gt ?? 0;
      const digits = (p.num ?? '48219037••••4417').split('');
      const tiles = digits.map((d, i) => { const on = i < 8 && k > i / 8, x = -690 + i * 86 + Math.floor(i / 4) * 12; return `<g transform="translate(${x} 0)"><rect x="-38" y="-56" width="76" height="112" rx="8" fill="${on ? '#3A2E08' : '#151A33'}"/><rect x="-38" y="-2" width="76" height="4" fill="#05070F"/>${T(d, 64, on ? YEL : '#C9D3E6', 0, -6, 'font-family="monospace"')}</g>`; }).join('');
      const bracket = k > 0 ? `<g opacity="${f(Math.min(1, k * 1.5))}"><path d="M -728 84 V 104 H ${f(-728 + 712 * Math.min(1, k))} V 84" fill="none" stroke="${YEL}" stroke-width="5"/>${T('FIRST 8 DIGITS', 22, YEL, -380, 132, 'letter-spacing="3"')}</g>` : '';
      const qa = [['WHICH NETWORK?', 'NETWORK', -250], ['WHICH BANK?', "ZERO'S BANK", 250]].map(([q, a, x]) => `<g transform="translate(${x} 240)" opacity="${f(ans)}"><rect x="-210" y="-46" width="420" height="92" rx="12" fill="#13203A" stroke="${SYS}" stroke-width="3"/>${T(q, 20, '#8FA6C8', 0, -20, 'letter-spacing="2"')}${T(a, 32, '#E6ECF5', 0, 14, 'letter-spacing="2"')}</g>`).join('');
      // the rail switch: a track from the left, the blade pivoting at the junction
      const rail = (d, o = 1) => `<path d="${d}" fill="none" stroke="#8A93A8" stroke-width="10" opacity="${o}"/>`;
      const ang = -18 * sw + 14 * (1 - sw);
      const track = `<g transform="translate(0 520)">${Array.from({ length: 26 }, (_, i) => `<rect x="${-900 + i * 36}" y="-26" width="14" height="52" fill="#3A2E24"/>`).join('')}${rail('M -900 -18 H 0')}${rail('M -900 18 H 0')}
        <path d="M 40 0 Q 400 0 760 -170" fill="none" stroke="${sw > 0.5 ? YEL : '#8A93A8'}" stroke-width="12" opacity="${f(0.5 + 0.5 * sw)}"/><path d="M 40 0 Q 400 0 760 170" fill="none" stroke="#8A93A8" stroke-width="12" opacity="${f(0.8 - 0.5 * sw)}"/>
        <g transform="rotate(${f(ang)})"><rect x="0" y="-10" width="300" height="20" rx="8" fill="#C9D3E6"/></g><circle r="22" fill="#4A5270"/><circle r="8" fill="${YEL}"/>
        ${T('NETWORK', 26, sw > 0.5 ? YEL : '#8FA6C8', 840, -200, 'letter-spacing="3"')}${T('OTHER NETWORKS', 20, '#5C6684', 860, 210, 'letter-spacing="2"')}</g>`;
      return `<g transform="${S(p)}"><rect x="-780" y="-120" width="1560" height="300" rx="20" fill="#0C1022"/><rect x="-780" y="-120" width="1560" height="300" rx="20" fill="none" stroke="#2A3254" stroke-width="6"/>
        ${TL('CARD NUMBER', 22, '#8FA6C8', -730, -88, 'letter-spacing="3"')}${tiles}${bracket}${qa}${p.track === false ? '' : track}
        <rect x="-780" y="${f(-120 + 300 * fr(gt * 0.4))}" width="1560" height="4" fill="${SYS}" opacity="0.2"/></g>`;
    },
    // the network: a grand central station for messages. Arched windows, gold-lit columns, rivers of pale capsules
    // crossing in glass tubes at three heights (speed), bridges, a hanging NETWORK sign; flood 0..1 thickens the
    // ground-level river (the stream that sweeps ZERO away); signs FROM SHOPS / TO BANKS, no logos
    nethall(p) {
      const gt = p.gt ?? 0, sp = p.speed ?? 1, fl = p.flood ?? 0, blur = p.blur ?? 0;
      const arches = Array.from({ length: 7 }, (_, i) => { const x = -2400 + i * 800; return `<g transform="translate(${x} -1500)"><path d="M -280 900 V 0 A 280 280 0 0 1 280 0 V 900 Z" fill="#3A4FA0"/><path d="M -280 900 V 0 A 280 280 0 0 1 280 0 V 900 Z" fill="url(#wCool)" opacity="0.6"/>
          ${[-140, 0, 140].map(gx => `<path d="M ${gx} -270 V 900" stroke="${NET.wallDk}" stroke-width="10"/>`).join('')}${[200, 450, 700].map(gy => `<path d="M -280 ${gy} H 280" stroke="${NET.wallDk}" stroke-width="10"/>`).join('')}</g>`; }).join('');
      const cols = Array.from({ length: 8 }, (_, i) => `<g transform="translate(${-2800 + i * 800} 0)"><rect x="-60" y="-2200" width="120" height="2200" fill="#20285A"/><rect x="-80" y="-120" width="160" height="120" fill="#262F66"/><rect x="-72" y="-2200" width="10" height="2200" fill="${NET.gold}" opacity="0.5"/></g>`).join('');
      const river = (y, dir, s, dens, i0) => { const n = Math.round(26 * dens); return `<g><rect x="-3200" y="${y - 40 * s}" width="6400" height="${80 * s}" rx="${40 * s}" fill="${NET.glass}" opacity="0.12"/><rect x="-3200" y="${y - 40 * s}" width="6400" height="${6 * s}" fill="#fff" opacity="0.15"/>
        ${Array.from({ length: n }, (_, j) => { const k = fr(gt * sp * (0.12 + rnd(i0 + j) * 0.05) + rnd(j + i0 * 3)), x = dir > 0 ? -3200 + k * 6400 : 3200 - k * 6400; return pale(x, y + (rnd(j * 7 + i0) - 0.5) * 30 * s, s * (0.9 + rnd(j) * 0.3), 0.85, j % 9 === 0 ? '#BFD8FF' : '#DDE6EA'); }).join('')}
        ${blur ? `<rect x="-3200" y="${y - 30 * s}" width="6400" height="${60 * s}" fill="#DDE6EA" opacity="${f(0.35 * blur)}"/>` : ''}</g>`; };
      const bridges = [-1600, 1600].map(x => `<g transform="translate(${x} -620)"><rect x="-420" y="0" width="840" height="30" fill="#2A3470"/><path d="M -420 0 V -70 H 420 V 0" fill="none" stroke="${NET.gold}" stroke-width="5" opacity="0.7"/>${Array.from({ length: 9 }, (_, i) => `<path d="M ${-400 + i * 100} 0 V -70" stroke="${NET.gold}" stroke-width="3" opacity="0.5"/>`).join('')}</g>`).join('');
      const sign = `<g transform="translate(0 -1320)"><path d="M -200 -260 V -120 M 200 -260 V -120" stroke="#0A0E26" stroke-width="8"/><rect x="-460" y="-120" width="920" height="200" rx="20" fill="#0A0E26"/><rect x="-440" y="-100" width="880" height="160" rx="14" fill="none" stroke="${NET.gold}" stroke-width="5"/>
        <g transform="translate(-320 -20) scale(0.9)">${window.WORLD.icons.network(NET.gold)}</g>${TL('NETWORK', 84, NET.gold, -230, -30, 'letter-spacing="10"')}${TL('ONE SET OF RULES', 22, '#C9D3E6', -226, 38, 'letter-spacing="5"')}</g>`;
      const dirs = [[-1500, '← FROM SHOPS'], [1500, 'TO BANKS →']].map(([x, t]) => `<g transform="translate(${x} -980)"><rect x="-230" y="-40" width="460" height="80" rx="10" fill="#0A0E26"/>${T(t, 34, '#E6ECF5', 0, -4, 'letter-spacing="3"')}</g>`).join('');
      const chand = Array.from({ length: 4 }, (_, i) => { const x = -2000 + i * 1330; return `<g transform="translate(${x} -1650)"><path d="M 0 -900 V 0" stroke="#0A0E26" stroke-width="6"/><ellipse rx="150" ry="34" fill="none" stroke="${NET.gold}" stroke-width="10"/>${Array.from({ length: 7 }, (_, j) => `<circle cx="${-130 + j * 43}" cy="${f(Math.abs(j - 3) * -6)}" r="11" fill="#FFE7A0"/>`).join('')}<ellipse cx="0" cy="0" rx="420" ry="300" fill="url(#wWarm)" opacity="0.7"/></g><ellipse cx="${x}" cy="40" rx="700" ry="110" fill="url(#wWarm)" opacity="0.45"/>`; }).join('');
      return `<g><rect x="-3200" y="-3000" width="6400" height="3000" fill="${NET.wall}"/>${arches}${cols}
        ${river(-1040, 1, 1.1, 1, 1)}${river(-760, -1, 0.9, 1, 2)}${bridges}${river(-420, 1, 1.25, 1, 3)}${sign}${dirs}
        <rect x="-3200" y="0" width="6400" height="2000" fill="${NET.floor}"/><rect x="-3200" y="0" width="6400" height="10" fill="${NET.gold}" opacity="0.5"/>
        ${Array.from({ length: 20 }, (_, i) => `<rect x="${-3000 + i * 320}" y="30" width="120" height="900" fill="${NET.gold}" opacity="0.04" transform="skewX(-20)"/>`).join('')}
        ${chand}${fl > 0 ? river(70, 1, 1.4, 0.4 + 1.6 * fl, 4) : ''}<rect x="-3200" y="0" width="6400" height="1000" fill="url(#wFloorFade)" opacity="0.6"/></g>`;
    },
    // a wall counter (a big mechanical board): cap above, the number rolling up to n as k goes 0..1, sub below
    counterwall(p) {
      const k = p.k ?? 1, n = Math.round((p.n ?? 0) * Math.min(1, k)), gt = p.gt ?? 0, w = p.w ?? 1100;
      const txt = (p.pre ?? '') + n.toLocaleString('en-US') + (p.unit ?? '');
      return `<g transform="${S(p)}"><rect x="${-w / 2}" y="-170" width="${w}" height="340" rx="22" fill="#0A0E26"/><rect x="${-w / 2 + 14}" y="-156" width="${w - 28}" height="312" rx="14" fill="none" stroke="${p.color ?? NET.gold}" stroke-width="5"/>
        ${T(p.cap ?? '', 28, '#C9D3E6', 0, -110, 'letter-spacing="4"')}${T(txt, p.size ?? 96, p.color ?? NET.gold, 0, -10, 'font-family="monospace"')}${p.sub ? T(p.sub, 30, '#E6ECF5', 0, 96, `letter-spacing="3" opacity="${f(p.subOn ?? 1)}"`) : ''}
        ${k < 1 ? `<rect x="${-w / 2 + 30}" y="${f(-60 + 60 * fr(gt * 9))}" width="${w - 60}" height="3" fill="#fff" opacity="0.15"/>` : ''}</g>`;
    },
    // a data centre: rows of racks in three depths with blinking lights, overhead cable trays, steam rising from
    // the cooling towers through the high windows, spare generators and spare cooling marked SPARE, a SITE 1 OF 4
    // sign, and a tiny technician cycling down the aisle (bike 0..1 shows him)
    datahall(p) {
      const gt = p.gt ?? 0;
      const rack = (x, s, i) => `<g transform="translate(${f(x)} 0) scale(${s})"><rect x="-70" y="-560" width="140" height="560" fill="#1A1F38"/><rect x="-70" y="-560" width="140" height="18" fill="#2A3154"/>
        ${Array.from({ length: 12 }, (_, r) => `<rect x="-58" y="${-530 + r * 42}" width="116" height="34" rx="3" fill="#232A4A"/>${[0, 1, 2].map(c => { const on = fr(gt * (0.6 + rnd(i * 31 + r * 3 + c)) + rnd(i + r + c * 5)) > 0.4; return `<circle cx="${-40 + c * 12}" cy="${-513 + r * 42}" r="3.5" fill="${on ? (c === 2 && r % 5 === 0 ? '#58E08A' : SYS) : '#2E3A5E'}"/>`; }).join('')}`).join('')}</g>`;
      const row = (y, s, n, x0, i0, dark) => `<g transform="translate(0 ${y})">${Array.from({ length: n }, (_, i) => rack(x0 + i * 160 * s, s, i + i0)).join('')}${dark ? `<rect x="-3000" y="${-560 * s}" width="6000" height="${560 * s}" fill="#05060F" opacity="${dark}"/>` : ''}</g>`;
      const steam = Array.from({ length: 10 }, (_, i) => { const k = fr(gt * 0.25 + i / 10), x = -1500 + (i % 5) * 700; return `<circle cx="${f(x + Math.sin(k * 5 + i) * 40)}" cy="${f(-1500 - k * 400)}" r="${f(40 + k * 120)}" fill="#E6ECF5" opacity="${f(0.3 * (1 - k))}"/>`; }).join('');
      const win = `<rect x="-3000" y="-1950" width="6000" height="420" fill="#2A3A6A"/>${Array.from({ length: 5 }, (_, i) => `<g transform="translate(${-1500 + i * 700} -1530)"><path d="M -120 0 L -90 -240 H 90 L 120 0 Z" fill="#7A86A8"/></g>`).join('')}${steam}${Array.from({ length: 16 }, (_, i) => `<rect x="${-3000 + i * 400}" y="-1950" width="30" height="420" fill="#141933"/>`).join('')}`;
      const trays = [-1080, -980].map((y, j) => `<rect x="-3000" y="${y}" width="6000" height="22" fill="#2A3154"/>${Array.from({ length: 4 }, (_, c) => `<path d="M -3000 ${y + 26 + c * 6} H 3000" stroke="${[YEL, SYS, '#C9555A', '#58E08A'][c]}" stroke-width="4" opacity="0.5"/>`).join('')}`).join('');
      const spare = (x, lab, ic) => `<g transform="translate(${x} 0)"><rect x="-200" y="-300" width="400" height="300" rx="10" fill="#3A4466"/><rect x="-180" y="-280" width="360" height="120" rx="6" fill="#2A3154"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${-160 + i * 56}" y="-140" width="40" height="120" rx="4" fill="#232A4A"/>`).join('')}
        <rect x="-150" y="-370" width="300" height="56" rx="8" fill="${YEL}"/>${T(lab, 26, '#3A2A00', 0, -346, 'letter-spacing="3"')}${ic}</g>`;
      const fan = (gt2) => `<g transform="translate(0 -220)"><circle r="56" fill="#232A4A"/>${[0, 1, 2, 3].map(i => `<path d="M 0 0 L 50 -12 L 50 12 Z" fill="#7A86A8" transform="rotate(${f(gt2 * 400 + i * 90)})"/>`).join('')}</g>`;
      const bx = ((gt * (p.bikeSp ?? 260)) % 3600) - 1800;
      const bike = (p.bike ?? 1) > 0 ? `<g transform="translate(${f(bx)} -6) scale(0.8)"><circle cx="-40" cy="-30" r="30" fill="none" stroke="#C9D3E6" stroke-width="6"/><circle cx="40" cy="-30" r="30" fill="none" stroke="#C9D3E6" stroke-width="6"/><path d="M -40 -30 L -6 -80 L 40 -30 M -6 -80 H 28 L 40 -30 M 28 -80 L 22 -100" stroke="${CORAL}" stroke-width="6" fill="none"/>
        <rect x="-26" y="-190" width="40" height="80" rx="16" fill="#E8853A"/><circle cx="-4" cy="-212" r="22" fill="#B9876A"/><path d="M -26 -222 Q -4 -250 18 -222 Z" fill="${YEL}"/><path d="M -10 -110 L -20 -60 L -40 -30 M 6 -110 L 20 -70 L 30 -40" stroke="#33384F" stroke-width="10" stroke-linecap="round" fill="none"/></g>` : '';
      return `<g><rect x="-3000" y="-2600" width="6000" height="2600" fill="#10142A"/>${win}${trays}
        <rect x="-3000" y="-430" width="6000" height="2430" fill="#1C2244"/>${Array.from({ length: 8 }, (_, i) => `<rect x="-3000" y="${-430 + i * i * 14}" width="6000" height="3" fill="#2A3360"/>`).join('')}<rect x="-3000" y="-430" width="6000" height="1300" fill="url(#wFloorFade)"/><ellipse cx="0" cy="-200" rx="2600" ry="200" fill="url(#wSys)" opacity="0.25"/>
        ${row(-420, 0.6, 30, -2400, 0, 0.45)}${row(-210, 0.8, 22, -2300, 50, 0.2)}
        <g transform="translate(0 -160)"><rect x="-260" y="-56" width="520" height="112" rx="12" fill="#0A0E26"/><rect x="-246" y="-42" width="492" height="84" rx="8" fill="none" stroke="${SYS}" stroke-width="4"/>${T(p.sign ?? 'DATA CENTER · SITE 1 OF 4', 26, SYS, 0, -4, 'letter-spacing="3"')}</g>
        ${p.spare === false ? '' : spare(p.spX ?? -1100, 'SPARE POWER', '') + spare((p.spX ?? -1100) + 2200, 'SPARE COOLING', `<g transform="translate(0 0)">${fan(gt)}</g>`)}
        ${bike}</g>`;
    },
    // ZERO's bank: a vault wall of brass and burgundy stone; the round vault door swings open (open 0..1) onto the
    // warm-lit decision room; a plate above: ZERO'S BANK · CARD ISSUER
    vault(p) {
      const op = p.open ?? 0, gt = p.gt ?? 0, R = 380;
      const bolts = Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<rect x="${f(Math.cos(a) * (R - 40) - 14)}" y="${f(Math.sin(a) * (R - 40) - 14)}" width="28" height="28" rx="6" fill="${BNK.brassDk}"/>`; }).join('');
      const door = `<g transform="translate(${f(-R * 1.6 * op)} 0) scale(${f(1 - 0.75 * op)} 1)"><circle r="${R}" fill="${BNK.brass}"/><circle r="${R - 26}" fill="${shade(BNK.brass, 0.15)}"/>${bolts}<circle r="150" fill="${BNK.brassDk}"/>
        <g transform="rotate(${f(op * 300 + Math.sin(gt) * 2)})">${[0, 1, 2].map(i => `<rect x="-12" y="-140" width="24" height="280" rx="10" fill="${BNK.brass}" transform="rotate(${i * 60})"/>`).join('')}<circle r="40" fill="${BNK.brass}"/></g></g>`;
      return `<g transform="${S(p)}"><rect x="-3000" y="-2600" width="6000" height="2600" fill="${BNK.wall}"/>${Array.from({ length: 30 }, (_, r) => Array.from({ length: 16 }, (_, c) => `<rect x="${-3000 + c * 400 + (r % 2) * 200}" y="${-2600 + r * 90}" width="392" height="84" fill="${shade(BNK.wall, 0.1 + 0.15 * rnd(r * 16 + c))}"/>`).join('')).join('')}
        <g transform="translate(0 -520)"><circle r="${R + 40}" fill="${BNK.wallDk}"/><circle r="${R}" fill="#FFE2A6" opacity="${f(op)}"/><circle r="${R}" fill="url(#wWarm)" opacity="${f(op)}"/>${op > 0.2 ? `<g opacity="${f(op * 0.8)}" fill="#8A5A3A"><rect x="-8" y="-150" width="16" height="${R + 150}"/><rect x="-170" y="-160" width="340" height="12" rx="6"/><path d="M -170 -150 L -230 -40 H -110 Z M 170 -150 L 110 -40 H 230 Z"/><rect x="-${R}" y="200" width="${2 * R}" height="${R}" fill="#C99A6A"/></g>` : ''}${door}</g>
        <g transform="translate(0 -1100)"><rect x="-400" y="-70" width="800" height="140" rx="10" fill="${BNK.wallDk}"/><rect x="-386" y="-56" width="772" height="112" rx="6" fill="none" stroke="${BNK.brass}" stroke-width="4"/>
          <g transform="translate(-300 0) scale(0.7)">${window.WORLD.icons.bank(BNK.brass)}</g>${TL("ZERO'S BANK", 54, BNK.brass, -220, -12, 'letter-spacing="5"')}${TL('THE BANK THAT GAVE HIM THE CARD', 18, '#E6CFC0', -216, 30, 'letter-spacing="2"')}</g>
        <rect x="-3000" y="0" width="6000" height="2000" fill="${BNK.floor}"/><rect x="-3000" y="0" width="6000" height="900" fill="url(#wFloorFade)"/></g>`;
    },
    // inside the bank: the decision room. Burgundy walls, brass rails, server cabinets with warm amber lights, a
    // low gallery; light 'coral' bathes it red (the doubt), 'green' when it approves (light 0..1 mixes it in)
    bankroom(p) {
      const gt = p.gt ?? 0, lc = p.lcol === 'green' ? '#58E08A' : CORAL, li = p.light ?? 0;
      const cab = (x, i) => `<g transform="translate(${x} 0)"><rect x="-90" y="-620" width="180" height="620" fill="#2A1620"/><rect x="-90" y="-620" width="180" height="20" fill="${BNK.brassDk}"/>${Array.from({ length: 14 }, (_, r) => `<rect x="-74" y="${-590 + r * 40}" width="148" height="30" rx="3" fill="#3A2230"/><circle cx="-58" cy="${-575 + r * 40}" r="4" fill="${fr(gt * (0.5 + rnd(i * 14 + r)) + rnd(r + i)) > 0.45 ? '#FFC976' : '#4A2A36'}"/>`).join('')}</g>`;
      return `<g><rect x="-3000" y="-2600" width="6000" height="2600" fill="${BNK.wall}"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${-2800 + i * 480}" y="-2600" width="40" height="2600" fill="${BNK.wallDk}"/>`).join('')}
        <rect x="-3000" y="-1300" width="6000" height="26" fill="${BNK.brass}" opacity="0.7"/><rect x="-3000" y="-1240" width="6000" height="8" fill="${BNK.brass}" opacity="0.4"/>
        ${[-2300, -2080, -1860, 1860, 2080, 2300].map((x, i) => cab(x, i)).join('')}
        <rect x="-3000" y="0" width="6000" height="2000" fill="${BNK.floor}"/><ellipse cx="0" cy="40" rx="1300" ry="160" fill="url(#wWarm)" opacity="0.5"/><rect x="-3000" y="0" width="6000" height="900" fill="url(#wFloorFade)"/>
        ${li > 0 ? `<rect x="-3000" y="-2600" width="6000" height="4600" fill="${lc}" opacity="${f(0.22 * li)}"/>` : ''}</g>`;
    },
    // the scale of trust: a brass balance; tilt -1..1 (left pan down = doubt wins); the left pan holds nl coral
    // doubt weights, the right pan holds the evidence chips (ev: list of labels, n shown = ne)
    riskscale(p) {
      const t = p.tilt ?? 0, a = t * 14, L = 460, nl = p.nl ?? 0, ev = p.ev ?? [], ne = p.ne ?? ev.length;
      const ax = Math.cos(a * Math.PI / 180) * L, ay = Math.sin(a * Math.PI / 180) * L;
      const pan = (x, y, inner, lab, col) => `<g transform="translate(${f(x)} ${f(y)})"><path d="M 0 0 L -170 260 M 0 0 L 170 260" stroke="${BNK.brassDk}" stroke-width="5"/><path d="M -200 260 Q 0 330 200 260 Z" fill="${BNK.brass}"/><g transform="translate(0 256)">${inner}</g>${T(lab, 24, col, 0, 370, 'letter-spacing="4"')}</g>`;
      const weights = Array.from({ length: nl }, (_, i) => `<g transform="translate(${-90 + (i % 4) * 60} ${-30 - Math.floor(i / 4) * 50})"><path d="M -26 0 L -20 -44 H 20 L 26 0 Z" fill="${CORAL}"/><rect x="-8" y="-54" width="16" height="12" rx="4" fill="#B5463E"/>${T('?', 22, '#3A0E0A', 0, -24)}</g>`).join('');
      const chips = ev.slice(0, ne).map((l, i) => `<g transform="translate(${-110 + (i % 2) * 220 - (i === 2 ? 110 : 0)} ${-34 - Math.floor(i / 2) * 64})"><rect x="-110" y="-26" width="220" height="52" rx="26" fill="#1E8C4E"/><rect x="-104" y="-20" width="208" height="40" rx="20" fill="none" stroke="#58E08A" stroke-width="3"/>${T(l, 18, '#E6FFE9', 0, -4, 'letter-spacing="1"')}</g>`).join('');
      return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="320" ry="24" fill="#000" opacity="0.3"/><path d="M -200 0 L -120 -60 H 120 L 200 0 Z" fill="${BNK.brassDk}"/><rect x="-22" y="-900" width="44" height="850" fill="${BNK.brass}"/>
        <g transform="translate(0 -900)"><path d="M ${f(-ax)} ${f(-ay)} L ${f(ax)} ${f(ay)}" stroke="${BNK.brass}" stroke-width="30" stroke-linecap="round"/><circle r="40" fill="${BNK.brassDk}"/><path d="M 0 -40 L -16 -110 H 16 Z" fill="${BNK.brass}" transform="rotate(${f(a)})"/>
          ${pan(-ax, -ay, weights, 'DOUBT', '#FF9A8A')}${pan(ax, ay, chips, 'EVIDENCE', '#8FF0B0')}</g></g>`;
    },
    // the risk dial: a big half-moon gauge from green to red; v 0..1 the needle; txt and txt2 the readout; when the
    // needle is deep in the red it trembles
    riskdial(p) {
      const v = p.v ?? 0.2, gt = p.gt ?? 0, sh = v > 0.7 ? Math.sin(gt * 40) * 2 : 0, ang = -180 + 180 * v + sh, R = 300;
      const segs = Array.from({ length: 18 }, (_, i) => { const a0 = Math.PI + i / 18 * Math.PI, a1 = Math.PI + (i + 0.85) / 18 * Math.PI, c = mix(mix('#58E08A', '#F2C14E', Math.min(1, i / 9)), CORAL, Math.max(0, (i - 9) / 9));
        return `<path d="M ${f(Math.cos(a0) * R)} ${f(Math.sin(a0) * R)} A ${R} ${R} 0 0 1 ${f(Math.cos(a1) * R)} ${f(Math.sin(a1) * R)} L ${f(Math.cos(a1) * (R - 70))} ${f(Math.sin(a1) * (R - 70))} A ${R - 70} ${R - 70} 0 0 0 ${f(Math.cos(a0) * (R - 70))} ${f(Math.sin(a0) * (R - 70))} Z" fill="${c}"/>`; }).join('');
      return `<g transform="${S(p)}"><path d="M -360 40 V -10 A 360 360 0 0 1 360 -10 V 40 Z" fill="#1E0F16"/><path d="M -360 40 V -10 A 360 360 0 0 1 360 -10 V 40 Z" fill="none" stroke="${BNK.brass}" stroke-width="8"/>${segs}
        ${T('RISK', 34, '#E6CFC0', 0, -120, 'letter-spacing="8"')}<g transform="rotate(${f(ang)})"><path d="M 0 -12 L ${R - 40} 0 L 0 12 Z" fill="#F4EDE4"/></g><circle r="30" fill="${BNK.brass}"/>
        ${p.txt ? `<rect x="-330" y="70" width="660" height="${p.txt2 ? 120 : 70}" rx="10" fill="#1E0F16"/>${T(p.txt, 28, v > 0.6 ? '#FF9A8A' : '#8FF0B0', 0, 104, 'letter-spacing="3"')}${p.txt2 ? T(p.txt2, 24, '#E6CFC0', 0, 150, 'letter-spacing="3"') : ''}` : ''}</g>`;
    },
    // the habits: little chips (TIME, PLACE, AMOUNT…) flying in from the left to a cloud around (tx, ty); k 0..1 the
    // flight; blank 0..1 turns them grey and empty ("?"): a new card has no habits to read
    habitchips(p) {
      const k = p.k ?? 0, bl = p.blank ?? 0, tx = p.tx ?? 0, ty = p.ty ?? 0, gt = p.gt ?? 0;
      const labs = ['TIME', 'PLACE', 'AMOUNT', 'SHOP TYPE', 'DEVICE', 'DISTANCE', 'USUAL SPEND', 'LAST BUY', 'HOUR', 'COUNTRY', 'SPEED', 'CHIP', 'MERCHANT', 'FREQUENCY', 'PATTERN', 'CARD AGE'];
      return `<g>${Array.from({ length: p.n ?? 40 }, (_, i) => { const l = labs[i % labs.length], d = rnd(i) * 0.5, kk = Math.max(0, Math.min(1, (k - d) / 0.5)); if (kk <= 0) return '';
        const e = 1 - Math.pow(1 - kk, 3), sx = -1400 - rnd(i + 3) * 600, sy = -600 + rnd(i + 5) * 1200, a = rnd(i + 9) * Math.PI * 2, rr = 120 + rnd(i + 11) * 300;
        const ex = tx + Math.cos(a + gt * 0.2) * rr, ey = ty + Math.sin(a + gt * 0.2) * rr * 0.55 + bl * 60 * rnd(i + 2);
        const x = sx + (ex - sx) * e, y = sy + (ey - sy) * e - Math.sin(e * Math.PI) * 200, c = mix('#2F5E9E', '#4A4F60', bl), tc = mix('#DDEBFF', '#8A90A0', bl);
        return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f((1 - e) * 40 * (rnd(i) - 0.5) + bl * 20 * (rnd(i + 1) - 0.5))}) scale(${f(0.8 + rnd(i + 4) * 0.4)})" opacity="${f(1 - 0.4 * bl)}"><rect x="-74" y="-20" width="148" height="40" rx="20" fill="${c}"/>${T(bl > 0.5 ? '?' : l, 16, tc, 0, -3, 'letter-spacing="1"')}</g>`; }).join('')}</g>`;
    },
    // the stand-in: behind a frosted screen sits a backup robot with a STAND-IN sign; up 0..1 gets him off his chair
    standin(p) {
      const up = p.up ?? 0, gt = p.gt ?? 0, y = -60 * up, bl = fr(gt / 3.1) < 0.06 ? 0.2 : 1;
      return `<g transform="${S(p)}"><rect x="-120" y="-200" width="240" height="20" fill="#2A1620"/><path d="M -100 -180 V 0 M 100 -180 V 0" stroke="#2A1620" stroke-width="16"/>
        <g transform="translate(0 ${f(y)})"><rect x="-90" y="-330" width="180" height="150" rx="20" fill="#9AA6B8"/><rect x="-70" y="-310" width="140" height="80" rx="14" fill="#1B1E33"/><rect x="-42" y="${f(-280 - 6 * (1 - bl))}" width="22" height="${f(18 * bl)}" rx="5" fill="#7CC2FF"/><rect x="20" y="${f(-280 - 6 * (1 - bl))}" width="22" height="${f(18 * bl)}" rx="5" fill="#7CC2FF"/><path d="M 0 -330 V -370" stroke="#9AA6B8" stroke-width="8"/><circle cy="-376" r="12" fill="${CORAL}" opacity="${f(0.5 + 0.5 * Math.sin(gt * 6))}"/>
          <rect x="-110" y="-180" width="220" height="190" rx="22" fill="#B7C1D0"/><rect x="-80" y="-150" width="160" height="60" rx="6" fill="#F4F1EA"/>${T('STAND-IN', 26, '#3A3F5C', 0, -124, 'letter-spacing="2"')}</g>
        <rect x="-300" y="-560" width="600" height="560" rx="16" fill="#E6ECF5" opacity="0.32"/><rect x="-300" y="-560" width="600" height="560" rx="16" fill="none" stroke="#E6ECF5" stroke-width="6" opacity="0.6"/>${T('BACKUP', 20, '#E6ECF5', 0, -530, 'letter-spacing="4" opacity="0.8"')}</g>`;
    },
    // ZERO's credit line as a long bar: the line, a little slice at the end ($4.75, exaggerated so we can see it)
    // that a yellow lock drops onto (lock 0..1); sent: the counter of money actually sent (it stays at $0.00)
    creditbar(p) {
      const lk = p.lock ?? 0, w = p.w ?? 1300, sl = 90;
      return `<g transform="${S(p)}">${TL("ZERO'S CREDIT LINE", 30, '#E6CFC0', -w / 2, -110, 'letter-spacing="4"')}
        <rect x="${-w / 2}" y="-50" width="${w}" height="100" rx="20" fill="#1E0F16"/><rect x="${-w / 2 + 10}" y="-40" width="${w - 20 - sl}" height="80" rx="14" fill="#2F5E9E"/>${T('AVAILABLE', 26, '#DDEBFF', -sl / 2, -4, 'letter-spacing="4"')}
        <rect x="${w / 2 - 10 - sl}" y="-40" width="${sl}" height="80" rx="14" fill="${lk > 0.5 ? '#6B5A1E' : '#2F5E9E'}"/>${lk > 0 ? `<g transform="translate(${w / 2 - 10 - sl / 2} ${f(-200 + 200 * Math.min(1, lk))})" opacity="${f(Math.min(1, lk * 3))}"><g transform="scale(0.9)">${window.WORLD.icons.lock(YEL)}</g></g>` : ''}
        ${lk > 0.5 ? `${T('$4.75 ON HOLD', 26, YEL, w / 2 - 10 - sl / 2, 96, 'letter-spacing="2"')}` : ''}
        ${p.sent != null ? `<g transform="translate(${-w / 2 + 160} 150)"><rect x="-160" y="-36" width="320" height="72" rx="10" fill="#1E0F16"/>${T('MONEY SENT: ' + p.sent, 24, '#E6CFC0', 0, -4, 'letter-spacing="2"')}</g>` : ''}</g>`;
    },
    // the dispute, as a PIX hologram: an empty cup (the coffee never came), a DISPUTE button (press 0..1), and an
    // arrow that pulls the coins back from the shop to ZERO's card (back 0..1)
    disputeholo(p) {
      const pr = p.press ?? 0, bk = p.back ?? 0, gt = p.gt ?? 0;
      const coins = Array.from({ length: 4 }, (_, i) => { const k = Math.max(0, Math.min(1, bk * 1.4 - i * 0.12)); return `<g transform="translate(${f(380 - 760 * k)} ${f(150 - Math.sin(k * Math.PI) * 80 - i * 4)})"><circle r="26" fill="${YEL}"/><circle r="17" fill="none" stroke="${AMBER}" stroke-width="4"/></g>`; }).join('');
      return `<g transform="${S(p)}"><rect x="-560" y="-260" width="1120" height="520" rx="26" fill="${SYS}" opacity="0.12"/><rect x="-560" y="-260" width="1120" height="520" rx="26" fill="none" stroke="${SYS}" stroke-width="4"/>
        <g transform="translate(-380 -40)"><path d="M -60 -60 H 60 L 50 50 H -50 Z" fill="none" stroke="${SYS}" stroke-width="7"/><path d="M 60 -40 q 34 0 34 26 q 0 26 -34 26" fill="none" stroke="${SYS}" stroke-width="7"/>${T('NO COFFEE', 22, SYS, 0, 100, 'letter-spacing="3"')}</g>
        <g transform="translate(0 -60) scale(${f(1 - 0.08 * pr)})"><rect x="-150" y="-50" width="300" height="100" rx="50" fill="${mix('#3A2230', CORAL, pr)}" stroke="${CORAL}" stroke-width="5"/>${T('DISPUTE', 36, '#FFFFFF', 0, -4, 'letter-spacing="4"')}</g>
        <g transform="translate(380 -40) scale(0.9)">${window.WORLD.icons.shop(SYS)}</g>${T('SHOP', 22, SYS, 380, 60, 'letter-spacing="3"')}
        <g transform="translate(-380 150) scale(0.7)">${window.WORLD.icons.card('#9C88F0')}</g>
        ${bk > 0 ? `<path d="M 300 210 H -300" stroke="${YEL}" stroke-width="6" stroke-dasharray="14 10" opacity="${f(Math.min(1, bk * 3))}"/><path d="M -280 194 L -310 210 L -280 226" fill="none" stroke="${YEL}" stroke-width="6" opacity="${f(Math.min(1, bk * 3))}"/>` : ''}${coins}
        ${T('within 60 days of the statement', 20, '#BFD8FF', 0, 230, 'opacity="0.8"')}</g>`;
    },
    // a café cup on its saucer (ZERO's coffee), steam with gt; fill 0..1
    cup(p) {
      const gt = p.gt ?? 0, fl = p.fill ?? 1;
      return `<g transform="${S(p)} rotate(${p.tilt ?? 0})"><ellipse cx="0" cy="-4" rx="70" ry="12" fill="#E6E1D6"/><path d="M -46 -80 H 46 L 38 -10 Q 0 4 -38 -10 Z" fill="${WHITE}"/><ellipse cx="0" cy="-80" rx="46" ry="10" fill="${fl > 0 ? '#6B3E24' : '#EEE'}"/><path d="M 46 -66 q 26 0 26 20 q 0 20 -26 20" fill="none" stroke="#DDD" stroke-width="8"/>
        ${(p.steam ?? 1) ? Array.from({ length: 3 }, (_, i) => { const k = fr(gt * 0.5 + i / 3); return `<circle cx="${f(-14 + i * 14 + Math.sin(k * 6 + i) * 6)}" cy="${f(-100 - k * 90)}" r="${f(8 + k * 14)}" fill="#F4F1EA" opacity="${f(0.45 * (1 - k))}"/>`; }).join('') : ''}</g>`;
    },
    // a small round café table with a stool, by the window
    cafetable(p) { return `<g transform="${S(p)}"><ellipse cx="0" cy="6" rx="200" ry="14" fill="#000" opacity="0.25"/><rect x="-16" y="-300" width="32" height="300" fill="#2A2E40"/><ellipse cx="0" cy="-2" rx="90" ry="12" fill="#2A2E40"/><ellipse cx="0" cy="-306" rx="190" ry="26" fill="${CAFE.woodDk}"/><ellipse cx="0" cy="-314" rx="190" ry="24" fill="${CAFE.wood}"/></g>`; },
    stool(p) { return `<g transform="${S(p)}"><rect x="-70" y="-230" width="140" height="26" rx="12" fill="${CAFE.green}"/><path d="M -50 -204 L -64 0 M 50 -204 L 64 0 M -56 -90 H 56" stroke="#2A2E40" stroke-width="10"/></g>`; },
    // a status tag PIX projects over a thing: an amount, a dot and a word (PENDING in amber, PAID in green)
    statustag(p) {
      const c = p.color ?? '#F2C14E', gt = p.gt ?? 0, on = p.on ?? 1; if (on <= 0) return '';
      const w = p.w ?? 420;
      return `<g transform="${S(p)} scale(${f(0.85 + 0.15 * on)})" opacity="${f(on)}"><rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="44" fill="#13203A" opacity="0.92"/><rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="44" fill="none" stroke="${c}" stroke-width="4"/>
        <circle cx="${-w / 2 + 50}" cy="0" r="14" fill="${c}" opacity="${f(0.55 + 0.45 * Math.sin(gt * 4))}"/>${TL(p.txt ?? '$4.75 · PENDING', p.size ?? 32, '#E6ECF5', -w / 2 + 80, -4, 'letter-spacing="2"')}</g>`;
    },
  });
  Object.assign(PROPS, W);
  window.WORLD_PAY = { CAFE, ACQ, NET, BNK };
})();
