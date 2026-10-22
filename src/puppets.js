// ZERO, PIX and every prop, drawn as SVG strings from parameters.
// Geometry comes from zero-design/zero-base.svg and pix-base.svg (the Bible). Never redraw the characters freehand:
// change a parameter here and every video stays consistent.
(() => {
  const INK = '#111111', WHITE = '#FFFFFF', YEL = '#FFC93C', AMBER = '#E0A100', RED = '#E63946', BLUE = '#2F80ED', G1 = '#CFCFCF', G2 = '#9A9A9A';
  const FONT = "Fredoka, 'Arial Rounded MT Bold', Arial, sans-serif";
  const rad = d => d * Math.PI / 180;
  const f = n => Math.round(n * 100) / 100;
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // two-bone limb: from root, upper length a, lower length b, reaching target (bend = +1/-1 picks the elbow side)
  function ik(root, target, a, b, bend) {
    let dx = target[0] - root[0], dy = target[1] - root[1];
    let d = Math.hypot(dx, dy); const max = a + b - 0.01;
    if (d > max) { dx *= max / d; dy *= max / d; d = max; }
    if (d < 1) d = 1;
    const base = Math.atan2(dy, dx);
    const cos = Math.min(1, Math.max(-1, (a * a + d * d - b * b) / (2 * a * d)));
    const ang = base + bend * Math.acos(cos);
    const elbow = [root[0] + a * Math.cos(ang), root[1] + a * Math.sin(ang)];
    return [elbow, [root[0] + dx, root[1] + dy]];
  }

  // ---------- ZERO ----------
  // Local box 200x220 (as in zero-base.svg). Feet touch y=208. Hands: targets in local coords.
  const HEAD = '<path d="M 92.2 20.6 A 50 50 0 1 1 72 28.5 L 83.1 33.7 L 86 17.8 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6" stroke-linejoin="round"/>';
  const BODY = 'M 94 116 C 93 130 83 136 83 152 Q 83 168 100 168 Q 117 168 117 152 C 117 136 107 130 106 116 Z';
  const POSES = {
    // hands: [left hand target, right hand target]; legs: [left foot, right foot]; bodyR: body lean
    neutral: { hl: [81, 168], hr: [119, 168] },
    point: { hl: [81, 168], hr: [160, 120] },
    think: { hl: [81, 168], hr: [104, 104] },
    phone: { hl: [96, 130], hr: [138, 106], tilt: 6 },
    celebrate: { hl: [62, 96], hr: [138, 96], jump: 1 },
    shrug: { hl: [64, 128], hr: [136, 128] },
    sad: { hl: [86, 172], hr: [114, 172], tilt: 14 },
    run: { hl: [70, 150], hr: [132, 128], fl: [74, 200], fr: [124, 190], lean: 12 },
    walk: { hl: [86, 164], hr: [114, 164], fl: [88, 206], fr: [114, 206] },
    type: { hl: [100, 140], hr: [126, 138] },
    proud: { hl: [110, 146], hr: [90, 146] },
    scared: { hl: [72, 98], hr: [128, 98], tilt: -6 },
    reach: { hl: [81, 168], hr: [150, 150] },
    present: { hl: [81, 168], hr: [150, 140] },
    cover: { hl: [76, 92], hr: [124, 92] },
    push: { hl: [81, 168], hr: [146, 152] },
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  // where ZERO's hands and feet end up for a state (pose + explicit overrides); the stage uses it to smooth limbs over time
  function limbs(p) {
    const pose = POSES[p.pose] || POSES.neutral;
    const mix = POSES[p.pose2];
    const k = mix ? (p.poseMix ?? 0) : 0;
    const pick = (key, dflt) => { const A = pose[key] ?? dflt, B = mix ? (mix[key] ?? dflt) : A; return Array.isArray(A) ? A.map((v, i) => lerp(v, B[i], k)) : lerp(A, B, k); };
    return {
      hl: p.hl || pick('hl', [81, 168]), hr: p.hr || pick('hr', [119, 168]),
      fl: p.fl || pick('fl', [90, 204]), fr: p.fr || pick('fr', [110, 204]),
      tilt: pick('tilt', 0), lean: pick('lean', 0),
    };
  }
  function zero(p) {
    const L = limbs(p);
    const { hl, hr, fl, fr } = L;
    const tilt = (p.tilt ?? 0) + L.tilt;
    const lean = (p.lean ?? 0) + L.lean;
    const face = p.face ?? 0;
    const [lx, ly] = p.look || [0, 0];
    const blink = p.blink ? 1 - 0.85 * p.blink : 1;
    const elL = ik([88, 132], hl, 19.3, 18, 1), elR = ik([112, 132], hr, 19.3, 18, -1);
    const leg = (hip, foot) => { const [k2, ft] = ik(hip, foot, 22, 22, hip[0] < 100 ? -1 : 1); return [k2, ft]; };
    const LL = leg([93, 160], fl), LR = leg([107, 160], fr);
    const limb = (root, [e, h], w) => `<polyline points="${f(root[0])},${f(root[1])} ${f(e[0])},${f(e[1])} ${f(h[0])},${f(h[1])}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const foot = ([, ft], side) => `<ellipse cx="${f(ft[0] + side * 4)}" cy="${f(ft[1] + 2)}" rx="10" ry="6" fill="${INK}"/>`;
    const hand = ([, h]) => `<circle cx="${f(h[0])}" cy="${f(h[1])}" r="6.5" fill="${INK}"/>`;
    const held = (h, what) => what ? `<g transform="translate(${f(h[0])} ${f(h[1])})">${PROPS[what.type || what]?.(Object.assign({ s: 0.24 }, typeof what === 'object' ? what : {})) || ''}</g>` : '';
    const faceSVG = (window.ZERO_FACES[face] || window.ZERO_FACES[0]);
    const headT = `rotate(${f(tilt + (p.headR ?? 0))} 100 116)`;
    const squash = p.squash ?? 1;
    const flip = p.flip ? -1 : 1;
    const s = p.s ?? 1;
    return `<g transform="translate(${f(p.x ?? 0)} ${f(p.y ?? 0)}) rotate(${f(p.r ?? 0)}) scale(${f(s * flip)} ${f(s * squash)}) translate(-100 -208)" opacity="${p.o ?? 1}">
      ${p.shadow === false ? '' : `<ellipse cx="100" cy="208" rx="36" ry="5.5" fill="rgba(17,17,17,0.09)"/>`}
      <g transform="rotate(${f(lean)} 100 204)">
        ${limb([93, 160], LL, 11)}${foot(LL, -1)}${limb([107, 160], LR, 11)}${foot(LR, 1)}
        <path transform="rotate(${f(tilt * 0.3)} 100 144)" d="${BODY}" fill="${INK}"/>
        <g transform="${headT}">
          <g transform="translate(0 ${f(p.lid ?? 0)})">${p.open ? '' : HEAD}</g>
          ${p.open ? `<g transform="rotate(${f(-p.open)} 72 28.5)">${HEAD}</g>` : ''}
          <g transform="translate(${f(lx)} ${f(ly)}) translate(100 80) scale(1 ${f(blink)}) translate(-100 -80)">${faceSVG}</g>
        </g>
        ${limb([88, 132], elL, 9)}${hand(elL)}${limb([112, 132], elR, 9)}${hand(elR)}
        ${held(elR[1], p.holdR)}${held(elL[1], p.holdL)}
      </g></g>`;
  }

  // ---------- PIX ----------
  // Local box 100x100, centre (50,50). Floats on its own; talk = 0..1 mouth opening.
  function pix(p) {
    const e = window.PIX_FACES[p.face ?? 0] || window.PIX_FACES[0];
    const s = p.s ?? 1, spin = p.spin ?? 0;
    const halo = p.halo ? `<circle cx="50" cy="50" r="44" fill="none" stroke="${p.halo === 'red' ? RED : BLUE}" stroke-width="4" opacity="0.8"/>` : '';
    const mouth = p.talk > 0.02 && (p.face ?? 0) === 0 ? `<ellipse cx="50" cy="61" rx="${f(3 + 2 * p.talk)}" ry="${f(1 + 4 * p.talk)}" fill="${INK}"/>` : '';
    const ray = 'fill="#FFC93C" stroke="#E0A100" stroke-width="3" stroke-linejoin="round"';
    return `<g transform="translate(${f(p.x ?? 0)} ${f(p.y ?? 0)}) scale(${f(s * (p.flip ? -1 : 1))} ${f(s)}) translate(-50 -50)" opacity="${p.o ?? 1}">
      ${halo}<g transform="rotate(${f(spin)} 50 50)">
      <path d="M 43.5 24.1 L 57.6 6.7 L 64.9 27.9 Z" ${ray}/><path d="M 75.6 42.6 L 93.6 56.1 L 72.6 64.1 Z" ${ray}/>
      <path d="M 56.5 75.9 L 42.4 93.3 L 35.1 72.1 Z" ${ray}/><path d="M 24.4 57.4 L 6.4 43.9 L 27.4 35.9 Z" ${ray}/>
      <circle cx="50" cy="50" r="29" fill="${YEL}" stroke="${AMBER}" stroke-width="3"/></g>
      <circle cx="50" cy="51" r="21" fill="#FFE38A"/>${e.face}${mouth}${e.fx}</g>`;
  }

  // ---------- props ----------
  // Every prop draws centred on (0,0) at its natural size; the scene places it with x, y, s, r.
  const T = (txt, size, color = INK, extra = '') => `<text x="0" y="${f(size * 0.35)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${size}" fill="${color}" ${extra}>${esc(txt)}</text>`;
  const PROPS = {
    phone(p) { // 120x220 phone; screen text, notification dot, grayscale
      const sc = p.screen ?? '', gray = p.gray ?? 0, lit = p.lit ?? 1;
      const scr = gray > 0.5 ? '#BDBDBD' : (p.screenColor || '#DDEBFF');
      return `<g transform="scale(${p.s ?? 1})">
        <rect x="-60" y="-110" width="120" height="220" rx="18" fill="${INK}"/>
        <rect x="-50" y="-96" width="100" height="186" rx="8" fill="${p.down ? INK : scr}" opacity="${p.down ? 1 : lit}"/>
        ${p.down ? '' : (p.feed ? [0, 1, 2].map(i => `<rect x="-42" y="${-86 + i * 60 + ((p.feed * 60) % 60)}" width="84" height="50" rx="6" fill="${['#FFC93C', '#2F80ED', '#E63946'][(i + Math.floor(p.feed)) % 3]}" opacity="${gray > 0.5 ? 0.25 : 0.55}"/>`).join('') : '')}
        ${!p.down && sc ? `<g transform="translate(0 ${p.screenY ?? -10})">${String(sc).split('|').map((l, i) => `<text x="0" y="${i * 24}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${p.fs ?? 18}" fill="${INK}">${esc(l)}</text>`).join('')}</g>` : ''}
        ${p.dot ? `<circle cx="48" cy="-98" r="${14 * p.dot}" fill="${RED}" stroke="${WHITE}" stroke-width="3"/>` : ''}
        ${p.buzz ? `<g stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${p.buzz}"><path d="M -80 -60 l -14 -6"/><path d="M -82 -20 l -18 0"/><path d="M 80 -60 l 14 -6"/><path d="M 82 -20 l 18 0"/></g>` : ''}
        ${p.aura ? `<rect x="-74" y="-124" width="148" height="248" rx="26" fill="none" stroke="${RED}" stroke-width="10" opacity="${p.aura}"/>` : ''}
      </g>`;
    },
    laptop(p) {
      return `<g transform="scale(${p.s ?? 1})"><path d="M -110 -150 h 220 v 140 h -220 Z" fill="${INK}" transform="skewX(-6)"/><rect x="-96" y="-138" width="196" height="116" rx="4" fill="#DDEBFF" transform="skewX(-6)"/>
        <path d="M -140 0 h 280 l -10 14 h -260 Z" fill="${INK}"/>${p.code !== false ? [0, 1, 2, 3].map(i => `<rect x="${-80 + (i % 2) * 20}" y="${-124 + i * 24}" width="${70 + ((i * 37) % 60)}" height="8" rx="4" fill="${G2}" transform="skewX(-6)"/>`).join('') : ''}</g>`;
    },
    desk(p) { const w = p.w ?? 560, l = p.legs ?? 150; return `<g transform="scale(${p.s ?? 1})"><rect x="${-w / 2}" y="0" width="${w}" height="22" rx="6" fill="${INK}"/><rect x="${-w / 2 + 30}" y="22" width="16" height="${l}" fill="${INK}"/><rect x="${w / 2 - 46}" y="22" width="16" height="${l}" fill="${INK}"/></g>`; },
    floor(p) { return `<rect x="-2000" y="0" width="4000" height="6" fill="${INK}" opacity="${p.o ?? 1}"/>`; },
    text(p) { return T(p.txt, p.size ?? 90, p.color ?? INK, p.stroke ? `stroke="${INK}" stroke-width="${p.stroke}" paint-order="stroke"` : ''); },
    card(p) { // big caption card like "2 HOURS LATER"
      const w = p.w ?? 900, h = p.h ?? 170;
      return `<g transform="scale(${p.s ?? 1})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="28" fill="${p.bg ?? YEL}" stroke="${INK}" stroke-width="8"/>${T(p.txt, p.size ?? 96)}</g>`;
    },
    bubble(p) { // speech bubble; tail points down-left (or right with p.tail='r')
      const w = p.w ?? 360, h = p.h ?? 130, tr = p.tail === 'r' ? -1 : 1;
      return `<g transform="scale(${p.s ?? 1})"><path d="M ${-w / 2} ${-h / 2} h ${w} v ${h} h ${-w / 2 + 40 * tr} l ${-50 * tr} 50 l ${10 * tr} -50 h ${-w / 2 + 40 * -tr + (tr < 0 ? w - 80 : 0) - (tr < 0 ? w - 80 : 0)} Z" fill="${WHITE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${T(p.txt, p.size ?? 56, p.color ?? INK)}</g>`;
    },
    notif(p) { // notification banner
      const w = p.w ?? 620;
      return `<g transform="scale(${p.s ?? 1})"><rect x="${-w / 2}" y="-60" width="${w}" height="120" rx="26" fill="${WHITE}" stroke="${INK}" stroke-width="6"/>
        <rect x="${-w / 2 + 22}" y="-36" width="72" height="72" rx="18" fill="${p.icon ?? RED}"/><text x="${-w / 2 + 120}" y="14" font-family="${FONT}" font-weight="700" font-size="${p.size ?? 44}" fill="${INK}">${esc(p.txt)}</text></g>`;
    },
    dot(p) { return `<g transform="scale(${p.s ?? 1})"><circle r="${p.rr ?? 60}" fill="${RED}" stroke="${WHITE}" stroke-width="10"/>${p.n != null ? T(p.n, (p.rr ?? 60) * 1.1, WHITE) : ''}</g>`; },
    counter(p) { const n = Math.round(p.n ?? 0); return `<g transform="scale(${p.s ?? 1})"><rect x="-150" y="-80" width="300" height="160" rx="24" fill="${BLUE}" stroke="${INK}" stroke-width="7"/>${T(n, 96, WHITE)}<text x="0" y="-92" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="34" fill="${INK}">${esc(p.label ?? '')}</text></g>`; },
    confetti(p) { // burst 0..1
      const k = p.k ?? 0, cols = [YEL, RED, BLUE, AMBER]; let s = '';
      for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 40 + 260 * k * (0.6 + (i % 5) / 10), y = r * Math.sin(a) + 260 * k * k; s += `<rect x="${f(r * Math.cos(a))}" y="${f(y)}" width="16" height="10" fill="${cols[i % 4]}" transform="rotate(${i * 37} ${f(r * Math.cos(a))} ${f(y)})" opacity="${f(1 - k * 0.8)}"/>`; }
      return `<g transform="scale(${p.s ?? 1})">${s}</g>`;
    },
    heart(p) { return `<g transform="scale(${p.s ?? 1})"><path d="M 0 30 C -50 -10 -30 -50 0 -22 C 30 -50 50 -10 0 30 Z" fill="${RED}" stroke="${INK}" stroke-width="5"/></g>`; },
    like(p) { return `<g transform="scale(${p.s ?? 1})"><circle r="64" fill="${RED}" stroke="${INK}" stroke-width="6"/><path d="M 0 30 C -50 -10 -30 -50 0 -22 C 30 -50 50 -10 0 30 Z" fill="${WHITE}"/></g>`; },
    drop(p) { // dopamine: yellow drop with a megaphone
      return `<g transform="scale(${p.s ?? 1})"><path d="M 0 -120 C 40 -60 80 -20 80 30 A 80 80 0 0 1 -80 30 C -80 -20 -40 -60 0 -120 Z" fill="${YEL}" stroke="${INK}" stroke-width="7"/>
        <ellipse cx="-22" cy="20" rx="9" ry="16" fill="${INK}"/><ellipse cx="22" cy="20" rx="9" ry="16" fill="${INK}"/>
        ${p.mega !== false ? `<g transform="translate(70 30) rotate(${-20 + (p.shout ?? 0) * 6})"><path d="M 0 -18 L 90 -55 L 90 55 L 0 18 Z" fill="${RED}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-24" y="-16" width="28" height="32" rx="6" fill="${INK}"/></g>` : ''}
        ${p.shout ? `<g transform="translate(250 -210)" opacity="${p.shout}">${PROPS.bubble({ txt: '!!!', w: 200, h: 110, size: 70, color: RED })}</g>` : ''}</g>`;
    },
    worker(p) { // tiny helmeted worker inside the brain: a mini ZERO with a yellow hard hat
      return `<g transform="scale(${p.s ?? 1})">${zero({ x: 0, y: 0, s: 1, pose: p.pose ?? 'neutral', face: p.face ?? 0, look: p.look, shadow: false, lean: p.lean ?? 0 })}<path d="M -46 -186 A 46 40 0 0 1 46 -186 Z" fill="${YEL}" stroke="${INK}" stroke-width="5"/><rect x="-56" y="-190" width="112" height="10" rx="5" fill="${AMBER}" stroke="${INK}" stroke-width="4"/></g>`;
    },
    gear(p) { const r = p.rr ?? 60; let teeth = ''; for (let i = 0; i < 10; i++) teeth += `<rect x="-10" y="${-r - 18}" width="20" height="26" rx="4" fill="${p.color ?? G1}" stroke="${INK}" stroke-width="4" transform="rotate(${i * 36})"/>`; return `<g transform="scale(${p.s ?? 1}) rotate(${p.spin ?? 0})">${teeth}<circle r="${r}" fill="${p.color ?? G1}" stroke="${INK}" stroke-width="5"/><circle r="${r * 0.32}" fill="${WHITE}" stroke="${INK}" stroke-width="5"/></g>`; },
    feedcard(p) { const c = [YEL, BLUE, RED, G1][(p.i ?? 0) % 4]; return `<g transform="scale(${p.s ?? 1}) rotate(${p.rot ?? 0})"><rect x="-130" y="-80" width="260" height="160" rx="16" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M -24 -30 L 34 0 L -24 30 Z" fill="${WHITE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`; },
    octopus(p) {
      let legs = ''; for (let i = 0; i < 6; i++) { const x = -90 + i * 36, w = Math.sin((p.wig ?? 0) + i) * 14; legs += `<path d="M ${x} 40 q ${w} 70 ${-w + (i < 3 ? -20 : 20)} 120" fill="none" stroke="#8E6BBF" stroke-width="26" stroke-linecap="round"/>`; }
      return `<g transform="scale(${p.s ?? 1})">${legs}<ellipse cx="0" cy="-20" rx="120" ry="110" fill="#8E6BBF" stroke="${INK}" stroke-width="7"/>
        <g fill="${WHITE}" stroke="${INK}" stroke-width="6"><circle cx="-40" cy="-20" r="30"/><circle cx="40" cy="-20" r="30"/></g><path d="M -10 -20 h 20" stroke="${INK}" stroke-width="6"/>
        <circle cx="-34" cy="-16" r="10" fill="${INK}"/><circle cx="46" cy="-16" r="10" fill="${INK}"/>
        ${p.pad !== false ? `<g transform="translate(130 60) rotate(10)"><rect x="-60" y="-80" width="120" height="160" rx="10" fill="${WHITE}" stroke="${INK}" stroke-width="6"/>${p.note ? `<text x="0" y="-20" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${p.noteSize ?? 26}" fill="${INK}">${String(p.note).split('|').map((l, i) => `<tspan x="0" dy="${i ? 32 : 0}">${esc(l)}</tspan>`).join('')}</text>` : [0, 1, 2, 3].map(i => `<rect x="-40" y="${-50 + i * 28}" width="${50 + (i * 23) % 30}" height="8" rx="4" fill="${G2}"/>`).join('')}</g>` : ''}</g>`;
    },
    catvideo(p) { return `<g transform="scale(${p.s ?? 1})"><rect x="-160" y="-110" width="320" height="220" rx="16" fill="#FFE9C7" stroke="${INK}" stroke-width="7"/><path d="M -60 40 Q -60 -40 0 -40 Q 60 -40 60 40 Z" fill="${AMBER}" stroke="${INK}" stroke-width="6"/><path d="M -50 -20 L -40 -70 L -16 -38 M 50 -20 L 40 -70 L 16 -38" fill="${AMBER}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="-20" cy="0" r="7" fill="${INK}"/><circle cx="20" cy="0" r="7" fill="${INK}"/><path d="M -8 16 Q 0 24 8 16" stroke="${INK}" stroke-width="4" fill="none"/></g>`; },
    slot(p) { // slot machine; lever 0..1 (pulled), reels = "xxx" symbols
      const sy = p.reels ?? '???', lever = p.lever ?? 0;
      const sym = c => c === '7' ? T('7', 70, RED) : c === '$' ? T('$', 70, '#2E9E5B') : c === 'x' ? T('×', 70, G2) : c === '*' ? T('★', 66, YEL, `stroke="${INK}" stroke-width="2"`) : T(c, 60, INK);
      return `<g transform="scale(${p.s ?? 1})"><rect x="-200" y="-240" width="400" height="480" rx="40" fill="${RED}" stroke="${INK}" stroke-width="8"/>
        <rect x="-170" y="-120" width="340" height="150" rx="16" fill="${WHITE}" stroke="${INK}" stroke-width="6"/>
        ${[0, 1, 2].map(i => `<g transform="translate(${-110 + i * 110} -45)">${sym(sy[i] || '?')}</g>`).join('')}
        <rect x="-140" y="-210" width="280" height="60" rx="14" fill="${YEL}" stroke="${INK}" stroke-width="6"/>${`<g transform="translate(0 -180)">${T(p.label ?? 'JACKPOT', 40)}</g>`}
        <g transform="translate(200 -40) rotate(${lever * 70})"><rect x="0" y="-12" width="20" height="24" fill="${INK}"/><line x1="20" y1="0" x2="20" y2="-180" stroke="${G2}" stroke-width="14" stroke-linecap="round"/><circle cx="20" cy="-190" r="28" fill="${RED}" stroke="${INK}" stroke-width="6"/></g>
        ${p.coins ? Array.from({ length: 8 }, (_, i) => `<circle cx="${-120 + i * 34}" cy="${200 + Math.sin(i * 7) * 10 + (1 - p.coins) * -80}" r="22" fill="${YEL}" stroke="${INK}" stroke-width="5" opacity="${p.coins}"/>`).join('') : ''}</g>`;
    },
    pigeon(p) { // peck 0..1 (head down)
      const k = p.peck ?? 0;
      return `<g transform="scale(${p.s ?? 1})"><ellipse cx="0" cy="0" rx="90" ry="60" fill="${G1}" stroke="${INK}" stroke-width="7"/>
        <path d="M -70 -10 L -150 -30 L -140 20 Z" fill="${G2}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
        <g transform="translate(60 -40) rotate(${k * 60})"><circle cx="20" cy="-30" r="40" fill="${G1}" stroke="${INK}" stroke-width="7"/><circle cx="30" cy="-40" r="7" fill="${INK}"/><path d="M 56 -34 L 84 -24 L 56 -16 Z" fill="${AMBER}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>
        <path d="M -20 58 v 40 M 20 58 v 40" stroke="${AMBER}" stroke-width="8" stroke-linecap="round"/></g>`;
    },
    button(p) { const d = p.down ?? 0; return `<g transform="scale(${p.s ?? 1})"><rect x="-90" y="10" width="180" height="50" rx="12" fill="${INK}"/><ellipse cx="0" cy="${f(10 + d * 14)}" rx="70" ry="26" fill="${RED}" stroke="${INK}" stroke-width="6"/></g>`; },
    seed(p) { return `<g transform="scale(${p.s ?? 1})">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${i * 22 - 44}" cy="${(i % 2) * 8}" rx="9" ry="6" fill="${AMBER}" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`; },
    suit(p) { // anonymous designer in a suit (grey, no face details: they are "them")
      return `<g transform="scale(${p.s ?? 1})"><circle cx="0" cy="-150" r="52" fill="${G1}" stroke="${INK}" stroke-width="6"/><path d="M -70 -86 Q 0 -110 70 -86 L 80 60 L -80 60 Z" fill="#3A3A3A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M 0 -96 L 14 -70 L 0 10 L -14 -70 Z" fill="${p.tie ?? RED}" stroke="${INK}" stroke-width="4"/><path d="M -60 60 v 80 M 60 60 v 80" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
        <g fill="${INK}"><ellipse cx="-18" cy="-152" rx="6" ry="9"/><ellipse cx="18" cy="-152" rx="6" ry="9"/></g></g>`;
    },
    board(p) { const lines = String(p.txt ?? '').split('|'); return `<g transform="scale(${p.s ?? 1})"><rect x="-320" y="-200" width="640" height="400" rx="16" fill="${WHITE}" stroke="${INK}" stroke-width="10"/>${lines.map((l, i) => `<text x="0" y="${-80 + i * 90}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${p.size ?? 64}" fill="${i === 0 ? RED : INK}">${esc(l)}</text>`).join('')}<path d="M -200 200 l -40 120 M 200 200 l 40 120" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>`; },
    app(p) { const c = [RED, BLUE, YEL, '#2E9E5B', '#8E6BBF', '#FF7A00'][(p.i ?? 0) % 6]; return `<g transform="scale(${p.s ?? 1})"><rect x="-50" y="-50" width="100" height="100" rx="26" fill="${c}" stroke="${INK}" stroke-width="6"/><g fill="${WHITE}"><ellipse cx="-14" cy="-6" rx="7" ry="11"/><ellipse cx="14" cy="-6" rx="7" ry="11"/></g><g fill="${INK}"><circle cx="-12" cy="-4" r="4"/><circle cx="16" cy="-4" r="4"/></g><path d="M -22 -26 L -6 -18 M 22 -26 L 6 -18" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>`; },
    door(p) { const a = p.open ?? 0; return `<g transform="scale(${p.s ?? 1})"><rect x="-100" y="-260" width="200" height="260" fill="${INK}"/><g transform="skewY(${a * -10}) scale(${1 - a * 0.5} 1)"><rect x="-100" y="-260" width="200" height="260" fill="#C98B4A" stroke="${INK}" stroke-width="8"/><circle cx="70" cy="-130" r="10" fill="${YEL}" stroke="${INK}" stroke-width="4"/></g></g>`; },
    wall(p) { return `<g><rect x="${-(p.w ?? 20) / 2}" y="${-(p.h ?? 700)}" width="${p.w ?? 20}" height="${p.h ?? 700}" fill="${INK}"/></g>`; },
    arrow(p) { const l = p.len ?? 200; return `<g transform="scale(${p.s ?? 1})"><path d="M 0 0 L ${l} 0" stroke="${p.color ?? INK}" stroke-width="14" stroke-linecap="round"/><path d="M ${l - 30} -30 L ${l + 6} 0 L ${l - 30} 30" fill="none" stroke="${p.color ?? INK}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>`; },
    qmark(p) { return `<g transform="scale(${p.s ?? 1})">${T('?', p.size ?? 160, YEL, `stroke="${INK}" stroke-width="5" paint-order="stroke"`)}</g>`; },
    orbit(p) { // words spinning around a centre
      const w = p.words || [], r = p.rr ?? 330, a0 = p.a ?? 0;
      return w.map((t, i) => { const a = a0 + i * 2 * Math.PI / w.length; return `<g transform="translate(${f(r * Math.cos(a))} ${f(r * 0.55 * Math.sin(a))})">${T(t, p.size ?? 52, i === (p.hi ?? -1) ? RED : INK)}</g>`; }).join('');
    },
    logo(p) { // the channel symbol: ZERO's head with the notch
      return `<g transform="scale(${p.s ?? 1}) translate(-100 -70)">${HEAD.replace('#FFFFFF', p.fill ?? WHITE).replace('stroke-width="6"', `stroke-width="${p.sw ?? 6}"`)}${p.eyes === false ? '' : `<ellipse cx="87" cy="80" rx="6" ry="11" fill="${INK}"/><ellipse cx="113" cy="80" rx="6" ry="11" fill="${INK}"/>`}</g>`;
    },
    rect(p) { return `<rect x="${-(p.w ?? 100) / 2}" y="${-(p.h ?? 100) / 2}" width="${p.w ?? 100}" height="${p.h ?? 100}" rx="${p.rx ?? 0}" fill="${p.fill ?? INK}" opacity="${p.op ?? 1}" ${p.stroke ? `stroke="${INK}" stroke-width="${p.stroke}"` : ''}/>`; },
    hole(p) { return `<ellipse cx="0" cy="0" rx="${p.w ?? 300}" ry="${(p.w ?? 300) * 0.22}" fill="${INK}"/>`; },
    lines(p) { // speed / motion lines
      return `<g stroke="${INK}" stroke-width="8" stroke-linecap="round" opacity="${p.op ?? 0.6}">${[0, 1, 2].map(i => `<path d="M ${-i * 20} ${i * 40 - 40} h -90"/>`).join('')}</g>`;
    },
    bed(p) { // side view; ZERO lies on it (blanket drawn by the scene on top if needed)
      return `<g transform="scale(${p.s ?? 1})"><rect x="-330" y="-60" width="660" height="70" rx="14" fill="${p.sheet ?? '#DDEBFF'}" stroke="${INK}" stroke-width="7"/><rect x="-350" y="-170" width="30" height="300" rx="8" fill="${INK}"/><rect x="320" y="-110" width="30" height="240" rx="8" fill="${INK}"/><rect x="-300" y="-112" width="150" height="56" rx="26" fill="${WHITE}" stroke="${INK}" stroke-width="6"/></g>`;
    },
    blanket(p) { return `<g transform="scale(${p.s ?? 1})"><path d="M -200 -70 Q 0 -110 240 -70 L 250 20 L -200 20 Z" fill="${p.fill ?? BLUE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`; },
    clock(p) { return `<g transform="scale(${p.s ?? 1})"><rect x="-170" y="-70" width="340" height="140" rx="22" fill="${INK}" stroke="${p.ring ? RED : G2}" stroke-width="${p.ring ? 10 : 5}"/>${T(p.txt ?? '02:43', 76, p.ring ? RED : '#7CFF8A')}</g>`; },
    glow(p) { return `<circle r="${p.rr ?? 260}" fill="#DDEBFF" opacity="${p.op ?? 0.35}"/>`; },
    sign(p) { return `<g transform="scale(${p.s ?? 1}) rotate(${p.tilt ?? 0})"><rect x="-8" y="0" width="16" height="160" fill="${G2}"/><path d="M -38 -92 L 38 -92 L 92 -38 L 92 38 L 38 92 L -38 92 L -92 38 L -92 -38 Z" transform="translate(0 -80) scale(0.8)" fill="${RED}" stroke="${INK}" stroke-width="6"/><g transform="translate(0 -80)">${T('STOP', 40, WHITE)}</g></g>`; },
    siren(p) { const on = (p.on ?? 0) > 0.5; return `<g transform="scale(${p.s ?? 1})"><path d="M -50 0 L -40 -70 A 40 40 0 0 1 40 -70 L 50 0 Z" fill="${on ? RED : '#8a2a31'}" stroke="${INK}" stroke-width="6"/><rect x="-66" y="0" width="132" height="22" rx="6" fill="${INK}"/>${on ? `<g stroke="${RED}" stroke-width="8" stroke-linecap="round"><path d="M -80 -60 l -40 -20"/><path d="M 80 -60 l 40 -20"/><path d="M 0 -120 v -40"/></g>` : ''}</g>`; },
    mask(p) { return `<rect x="-3000" y="-3000" width="6000" height="6000" fill="${p.fill ?? INK}" opacity="${p.op ?? 0.6}"/>`; },
    zzz(p) { return T('z z z', p.size ?? 60, G2); },
    sticky(p) { // sticky note with up to 3 lines (txt "A|B")
      const ls = String(p.txt ?? '').split('|'), fs = p.size ?? 34;
      return `<g transform="scale(${p.s ?? 1}) rotate(${p.tilt ?? -4})"><rect x="-110" y="-100" width="220" height="200" fill="${p.fill ?? YEL}" stroke="${INK}" stroke-width="5"/><path d="M 60 100 L 110 50 L 110 100 Z" fill="${AMBER}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>${ls.map((l, i) => `<text x="0" y="${f((i - (ls.length - 1) / 2) * fs * 1.15 + fs * 0.35)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${fs}" fill="${p.color ?? INK}">${esc(l)}</text>`).join('')}</g>`;
    },
    paper(p) { // a document page; lines 0..1 = how much of it is written
      const n = Math.round((p.lines ?? 0) * 8);
      return `<g transform="scale(${p.s ?? 1}) rotate(${p.tilt ?? 0})"><rect x="-130" y="-170" width="260" height="340" rx="8" fill="${WHITE}" stroke="${INK}" stroke-width="7"/>${p.title ? `<text x="0" y="-118" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${p.size ?? 40}" fill="${INK}">${esc(p.title)}</text>` : ''}${Array.from({ length: n }, (_, i) => `<rect x="-96" y="${-80 + i * 30}" width="${i % 3 === 2 ? 120 : 192}" height="10" rx="5" fill="${G2}"/>`).join('')}</g>`;
    },
    broom(p) { // drawn so ZERO's hand holds it near the top
      return `<g transform="scale(${p.s ?? 1}) rotate(${p.r2 ?? 0})"><rect x="-6" y="-40" width="12" height="230" rx="6" fill="#C98B4A" stroke="${INK}" stroke-width="4"/><path d="M -40 190 L 40 190 L 56 260 L -56 260 Z" fill="${YEL}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M -30 210 v 44 M 0 210 v 48 M 30 210 v 44" stroke="${AMBER}" stroke-width="4"/></g>`;
    },
    tag(p) { // price tag
      return `<g transform="scale(${p.s ?? 1}) rotate(${p.tilt ?? 0})"><path d="M -150 -70 L 110 -70 L 170 0 L 110 70 L -150 70 Z" fill="${p.fill ?? WHITE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle cx="120" cy="0" r="12" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>${`<g transform="translate(-20 0)">${T(p.txt ?? '$10', p.size ?? 76, p.color ?? INK)}</g>`}</g>`;
    },
    cloud(p) { // the bad feeling: a grey cloud with a grumpy face; mood 0 grumpy, 1 sad
      const m = p.mood ?? 0;
      return `<g transform="scale(${p.s ?? 1})"><path d="M -150 60 Q -210 60 -200 0 Q -200 -60 -130 -60 Q -110 -130 -30 -120 Q 30 -170 90 -110 Q 170 -120 180 -40 Q 230 0 190 50 Q 180 70 140 60 Z" fill="${p.fill ?? '#8C8C99'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M -70 -42 L -24 -26 M 70 -42 L 24 -26" stroke="${INK}" stroke-width="8" stroke-linecap="round" opacity="${1 - m}"/><circle cx="-44" cy="-6" r="10" fill="${INK}"/><circle cx="44" cy="-6" r="10" fill="${INK}"/><path d="M -30 ${f(34 - m * 6)} Q 0 ${f(18 + m * 20)} 30 ${f(34 - m * 6)}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>${p.rain ? [-110, -40, 30, 100].map((x, i) => `<path d="M ${x} ${80 + ((p.rain * 120 + i * 37) % 80)} l -8 26" stroke="${BLUE}" stroke-width="7" stroke-linecap="round"/>`).join('') : ''}</g>`;
    },
    plant(p) { return `<g transform="scale(${p.s ?? 1})"><path d="M -50 0 L 50 0 L 40 90 L -40 90 Z" fill="#C98B4A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M 0 0 C -10 -60 -70 -90 -80 -60 C -80 -30 -30 -20 0 0 M 0 0 C 10 -80 70 -110 80 -80 C 85 -40 30 -20 0 0" fill="#2E9E5B" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`; },
    pencup(p) { return `<g transform="scale(${p.s ?? 1})">${[[-24, YEL, -10], [0, BLUE, 0], [24, RED, 10]].map(([x, c, r]) => `<rect x="${x - 7}" y="-90" width="14" height="80" fill="${c}" stroke="${INK}" stroke-width="4" transform="rotate(${p.messy ? r * 3 : 0} ${x} -10)"/>`).join('')}<rect x="-45" y="-20" width="90" height="80" rx="8" fill="${WHITE}" stroke="${INK}" stroke-width="6"/></g>`; },
  };

  window.PUPPETS = { zero, limbs, pix, PROPS, POSES, COLORS: { INK, WHITE, YEL, AMBER, RED, BLUE, G1, G2 }, FONT, esc };
})();
