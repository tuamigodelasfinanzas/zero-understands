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
      const shaft = op > 0 ? `<g opacity="${f(Math.min(1, op * 2))}"><rect x="-70" y="-250" width="140" height="250" fill="${NAVY}"/>${Array.from({ length: 5 }, (_, i) => `<path d="M ${-40 + i * 20} -250 V 900" stroke="${i === 2 ? YEL : SYS}" stroke-width="${i === 2 ? 6 : 3}" opacity="${f(0.5 + 0.5 * Math.sin(gt * 6 + i))}"/>`).join('')}<ellipse cx="0" cy="-130" rx="140" ry="200" fill="url(#wSys)" opacity="0.8"/></g>` : '';
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
  Object.assign(PROPS, W);
  window.WORLD_PAY = { CAFE };
})();
