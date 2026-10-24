// ZeroOpen: the narrative opening of every long Zero Understands video (docs/zeroopen.md). Not an intro: the story
// starts at frame one and follows one grammar every time:
//   SOMETHING DOESN'T MAKE SENSE → ZERO NOTICES → PIX REVEALS → ZERO ENTERS → CLICK → ZERO UNDERSTANDS → the story goes on.
// Three layers, each usable on its own:
//   deriveOpen({ title, ... })   the plan: the 12 fields (situation, anomaly, question, reveal, entry, narration...)
//                                derived from the title alone, any field overridable
//   zeroOpenBeats(plan, o)       the beats of the opening, built from reusable pieces; an episode can replace any act
//   checkOpen(ep, o)             the 12-question quality test, run on the real beats (timings estimated from the voice)
// Shorts never use it: they start on their strongest hook with no brand moment (docs/zeroopen.md §Shorts).
import { G, N, zero, pix, prop, sfx, cam, walk, lookCam, stepBack, leanIn } from './kit.mjs';

const P = (type, k, id, z = 0, o = {}) => prop(type, k, { id, z, ...o });

// ---------- 1. the plan ----------
// Each archetype is one family of systems. Variants keep the grammar and change the situation, the object, the
// reveal and the entry, so two videos about related systems never open the same way. Placeholders: {SYSTEM}.
export const ARCHETYPES = {
  logistics: {
    match: /package|parcel|deliver|shipping|ship |amazon|warehouse|supply chain|temu|ikea|courier|by morning|overnight/i,
    kind: 'logistics', system: 'the delivery network', sound: 'belt rumble under the room tone, scanner beeps behind the wall',
    variants: [
      { situation: 'ZERO at home late at night, ordering something on his phone', object: 'phone', action: 'taps BUY NOW',
        screen: { l1: '11:47 PM', l2: 'ORDER PLACED', l3: 'ARRIVES TOMORROW 8:00 AM' }, clock: [11, 47],
        anomaly: 'the delivery time is only hours away, in the middle of the night', reaction: 'looks at the clock, back at the phone, at the clock',
        question: ['Wait.', 'How is that even possible?'], reveal: 'PIX scans the order; the wall of the room slides open on a fulfillment floor already moving',
        entry: 'the order drops out of the phone as a box onto a belt; ZERO jumps on it', promise: ['Between tapping Buy Now and that box reaching the door, something enormous happens while you sleep.', 'Tonight, ZERO is staying awake to see it.'] },
      { situation: 'ZERO at a shipping counter with a box that has to arrive tomorrow', object: 'giftbox', action: 'puts the box on the counter and pays',
        screen: { l1: 'NEXT DAY', l2: 'DELIVERY', l3: 'TOMORROW BY 10:30 AM' }, clock: [6, 47],
        anomaly: 'tomorrow morning, on the other side of the country', reaction: 'looks at the clock, at the screen, at the box',
        question: ['Wait.', 'How is that even possible?'], reveal: 'PIX scans the label; the back wall opens on the belts, scanners and trucks behind it',
        entry: 'the box rides the belt into the wall; ZERO leaps onto it', promise: ['Between this counter and that front door, something enormous happens while the country sleeps.', 'Tonight, ZERO is staying awake to see it.'] },
    ],
  },
  payments: {
    match: /credit card|debit|card|payment|visa|mastercard|tap to pay|checkout|fee/i,
    kind: 'money', system: 'the payment network', sound: 'terminal BEEP, a coin ring that splits into three',
    variants: [
      { situation: 'ZERO paying €100 at a shop with his card', object: 'card', action: 'taps the card on the terminal',
        screen: { l1: 'TOTAL', l2: '€100.00', l3: 'APPROVED' }, anomaly: 'the €100 goes into the terminal and splits into several routes instead of going to the shop',
        reaction: 'follows the pieces with his eyes, counts them on his fingers', question: ['You paid a hundred euros.', 'So where exactly did it go?'],
        reveal: 'PIX scans the terminal; it opens like a hatch onto a network of banks and card schemes', entry: 'ZERO grabs the last coin as it slips in and goes with it',
        promise: ['In the next two seconds, that payment is going to visit more companies than ZERO has ever heard of.', "He's going with it."] },
    ],
  },
  banking: {
    match: /bank|deposit|savings|interest|loan|mortgage|atm|money/i,
    kind: 'money', system: 'the banking system', sound: 'counter bell, a vault hum',
    variants: [
      { situation: 'ZERO depositing his savings at a bank counter', object: 'coin', action: 'slides his money across the counter',
        screen: { l1: 'BALANCE', l2: '€1,000', l3: 'AVAILABLE' }, anomaly: 'his money is lent out to someone else the moment it lands, but his balance never changes',
        reaction: 'looks at the balance, at the money walking away, at the balance', question: ['His money just left.', 'So why is it still in his account?'],
        reveal: 'PIX scans the counter; the wall behind the teller turns transparent on a web of loans', entry: 'ZERO follows his money behind the counter',
        promise: ['Behind that counter, the same money exists in more than one place at once.', 'ZERO wants to know how.'] },
    ],
  },
  airline: {
    match: /airline|flight|seat|overbook|airport|boarding|plane ticket|cheap flight/i,
    kind: 'booking', system: 'the booking system', sound: 'gate chime, departure board flaps',
    variants: [
      { situation: 'ZERO at the gate with boarding pass SEAT 18A', object: 'ticket', action: 'hands his boarding pass to the agent',
        screen: { l1: 'GATE B12', l2: 'SEAT 18A', l3: 'BOARDING' }, anomaly: 'another passenger walks up holding SEAT 18A too',
        reaction: 'compares both passes, looks at the agent', question: ['The airline just sold this seat twice.', "And it wasn't a mistake."],
        reveal: 'PIX scans the boarding pass; the departure board opens on the booking system behind the airport wall', entry: 'ZERO steps through the board into the system',
        promise: ['Somewhere in there, a computer decided this flight should have more passengers than seats.', 'ZERO is going to find it.'] },
    ],
  },
  supermarket: {
    match: /supermarket|grocery|store layout|aisle|walmart|costco|mercadona|shopping/i,
    kind: 'store', system: 'the store', sound: 'cart wheel squeak, checkout beeps',
    variants: [
      { situation: 'ZERO walks into a supermarket with an empty basket and a list: MILK', object: 'basket', action: 'walks the aisles; the basket fills by itself',
        screen: { l1: 'LIST', l2: 'MILK', l3: '1 ITEM' }, anomaly: 'at the checkout the basket is full and the milk is at the bottom',
        reaction: 'looks at the list, at the basket, at the list', question: ['ZERO came here for one thing.', 'That was exactly the problem.'],
        reveal: 'PIX scans the store; the camera rises and the walls go transparent on the layout, the promotions and the paths', entry: 'ZERO walks back in, now able to see the system',
        promise: ['Every metre of this store was designed before ZERO walked in.', "Now he's going to walk it again, with the lights on."] },
    ],
  },
  subscriptions: {
    match: /subscription|netflix|spotify|membership|gym|recurring|saas/i,
    kind: 'subscriptions', system: 'the subscription machine', sound: 'a small charge ding that keeps repeating',
    variants: [
      { situation: 'ZERO pays €12 for one app', object: 'phone', action: 'confirms one payment',
        screen: { l1: 'CHARGE', l2: '€12', l3: 'MONTHLY' }, anomaly: 'more charges appear and follow him: €9, €15, €7, €11',
        reaction: 'walks faster; the charges keep up', question: ["ZERO isn't buying things anymore.", "He's renting his entire life."],
        reveal: 'PIX reveals the machine printing the charges behind the wall', entry: 'ZERO climbs into the machine through the payment slot',
        promise: ['Inside, every company is built around one number: how long ZERO forgets to cancel.', "He's about to see it."] },
    ],
  },
  internet: {
    match: /internet|wifi|data|router|ads|advertis|google|free app|social media|tiktok|instagram|algorithm/i,
    kind: 'network', system: 'the network', sound: 'router blink ticks, a modem chirp',
    variants: [
      { situation: 'ZERO opens a free app', object: 'phone', action: 'opens the app',
        screen: { l1: 'PRICE', l2: 'FREE', l3: '0.00' }, anomaly: 'his phone starts sending little packets out of the window, one per tap',
        reaction: 'taps, watches a packet leave, taps again', question: ['If the app is free...', 'what exactly is ZERO paying with?'],
        reveal: 'PIX scans the router; it opens on rows of servers trading his taps', entry: 'ZERO dives into the router after a packet',
        promise: ['In the time it takes the page to load, ZERO is going to be sold.', "He's going to watch it happen."] },
    ],
  },
  insurance: {
    match: /insurance|premium|claim|policy/i,
    kind: 'money', system: 'the insurance pool', sound: 'a stamp, a paper shuffle',
    variants: [
      { situation: 'ZERO pays his insurance premium', object: 'coin', action: 'drops the payment in',
        screen: { l1: 'PREMIUM', l2: '€40', l3: 'PAID' }, anomaly: 'his money lands in a huge pool with everyone else and is paying for someone else\'s accident',
        reaction: 'looks for his coin in the pool', question: ['ZERO has never had an accident.', 'So who is his money for?'],
        reveal: 'PIX scans the payment; the wall opens on the pool and the people drawing from it', entry: 'ZERO jumps into the pool after his coin',
        promise: ['Insurance is a bet. ZERO just placed one without knowing the odds.', "He's going inside to read them."] },
    ],
  },
  generic: {
    match: /./, kind: 'generic', system: 'the hidden system', sound: 'a room tone that changes when the wall opens',
    variants: [
      { situation: 'ZERO doing something ordinary that involves {SYSTEM}', object: 'coin', action: 'does the ordinary thing',
        screen: { l1: '', l2: '?', l3: '' }, anomaly: 'the result is not what anybody would expect', reaction: 'looks at the result, at us, at the result',
        question: ['Wait.', 'Why did that happen?'], reveal: 'PIX scans the object; the wall opens on the machinery behind it', entry: 'ZERO walks in through the opening',
        promise: ['Behind this wall is the answer.', 'ZERO is going in.'] },
    ],
  },
};

const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const fill = (v, sys) => typeof v === 'string' ? v.replace(/\{SYSTEM\}/g, sys) : Array.isArray(v) ? v.map(x => fill(x, sys)) : v;

// in: { title, topic?, question?, system?, mystery?, archetype?, variant?, avoid?: [variant index already used] }
// out: the plan, with the 12 fields the brief asks for (UPPER_CASE) and the machine fields the builder reads
export function deriveOpen(input) {
  const text = [input.title, input.topic, input.system, input.mystery].filter(Boolean).join(' ');
  const key = input.archetype ?? Object.keys(ARCHETYPES).find(k => k !== 'generic' && ARCHETYPES[k].match.test(text)) ?? 'generic';
  const A = ARCHETYPES[key], free = A.variants.map((_, i) => i).filter(i => !(input.avoid ?? []).includes(i));
  const vi = input.variant ?? (free.length ? free[hash(input.title ?? '') % free.length] : 0);
  const v = A.variants[vi], sys = input.system ?? A.system;
  const plan = {
    archetype: key, variant: vi, kind: A.kind, object: v.object, screen: v.screen, clock: v.clock,
    question: input.question ? [input.question] : v.question, promise: input.promise ?? v.promise,
    VIDEO_TITLE: input.title, VIDEO_TOPIC: input.topic ?? key, MAIN_SYSTEM: sys, KEY_MYSTERY: input.mystery ?? v.anomaly,
    CORE_QUESTION: input.question ?? v.question.join(' '),
    EVERYDAY_SITUATION: fill(input.situation ?? v.situation, sys),
    VISUAL_ANOMALY: input.mystery ?? v.anomaly,
    ZERO_ACTION: v.action, ZERO_REACTION: v.reaction,
    PIX_REVEAL: v.reveal, HIDDEN_SYSTEM: sys, ENTRY_TRANSITION: v.entry,
    OPENING_NARRATION: [...(input.eventLines ?? []), ...(input.question ? [input.question] : v.question), '(CLICK · ZERO UNDERSTANDS)', ...(input.promise ?? v.promise)],
    SOUND_DESIGN: `${A.sound}; silence (0.5-0.8 s) right before the question; zu-signature on the crossing`,
    MICRO_BRAND_MOMENT: 'PIX chirp → CLICK → "ZERO UNDERSTANDS" wordmark over the moving system, 1.2 s, no narration stop',
    FIRST_MAIN_STORY_BEAT: (input.promise ?? v.promise)[0],
  };
  return { ...plan, ...(input.overrides ?? {}) };
}

// ---------- 2. the beats ----------
// Reusable pieces. Every act is a beat tagged zo: '<act>' so the quality test can find it.
// The micro brand signature: the system rushing past, the CLICK, the wordmark; the camera never stops moving.
export function brandBeat(o = {}) {
  return {
    zo: 'brand', lines: [], min: o.dur ?? 1.2, bg: '#05060D',
    cam: cam({ z: 1.0, x: 960, y: 540 }, { u: 1, z: 1.25, x: 960, y: 540, e: 'in' }),
    actors: [...(o.behind ?? [P('hiddenlayer', [{ x: 960, y: 540, w: 1920, h: 1080, open: 1, kind: o.kind ?? 'generic', style: 'xray', s: 1.1 }, { u: 1, s: 1.3, e: 'in' }], 'bl', -20)]),
      P('rect', [{ x: 960, y: 540, w: 1920, h: 1080, fill: '#05060D', op: 0.55, ui: true }], 'dim', 40),
      P('zumark', [{ x: 940, y: 540, s: 1.05, k: 0, flash: 0, o: 0, ui: true }, { t: 0.2, o: 1, flash: 1, e: 'step' }, { t: 0.55, k: 1, flash: 0, e: 'out' }, { u: 1, s: 0.96, e: 'lin' }], 'mark', 45)],
    sfx: [sfx('zu-signature', 0, { g: 0.9 })],
  };
}

// keys that open a hiddenlayer between t0 and t0 + dur, inside a beat
export const openKeys = (t0, dur = 0.9, at = {}) => [{ ...at, t: t0, open: 0 }, { ...at, t: t0 + dur, open: 1, e: 'io' }];

// a generic place for any archetype: a wall with the hidden panel, a counter, the in-world screen, a clock
const place = (plan, o = {}) => [
  P('interior', { x: 0, y: G, wall: o.wall ?? '#2F5260', floor: '#2C3340', vx: 1200 }, 'int', -21),
  P('wallclock', { x: 360, y: 220, s: 0.7, h: plan.clock?.[0] ?? 9, m: plan.clock?.[1] ?? 41, s0: 5 }, 'clock', -15),
  P('hiddenlayer', [{ x: 1500, y: 400, w: 720, h: 460, kind: plan.kind, open: 0, wall: o.wall ?? '#2F5260' }, ...(o.layerKeys ?? [])], 'layer', -14),
  P('counter', { x: 900, y: G, w: 700 }, 'counter', -4),
  P('screen', [{ x: 1120, y: G - 486, s: 0.9, ...plan.screen, l2: o.before ?? plan.screen.l2, l3: o.before ? '' : plan.screen.l3 }, ...(o.screenKeys ?? [])], 'scr', -3),
  P('pool', { x: 900, y: 560, rx: 700, ry: 420, kind: 'warm', op: 0.35 }, 'pl', -10),
];
const objectProp = (plan, k) => {
  const t = { giftbox: ['giftbox', { s: 0.45 }], phone: ['phone', { s: 0.9 }], card: ['paycard', { s: 0.6 }], coin: ['coin', { s: 0.9 }], ticket: ['pass', { s: 0.6 }], basket: ['parcel', { s: 0.9, v: 1 }] }[plan.object] ?? ['coin', { s: 0.9 }];
  return P(t[0], k.map((x, i) => i ? x : { ...t[1], ...x }), 'obj', 2);
};

// The full opening from a plan, with no hand work: event, anomaly, question, reveal, entry, brand, promise.
// o.acts.<name>(plan, def) can replace any act; o.place replaces the set.
export function zeroOpenBeats(plan, o = {}) {
  const set = (k = {}) => (o.place ?? place)(plan, k);
  const acts = {
    event: () => ({ zo: 'event', lines: (o.eventLines ?? []).map((l, i) => N(l, i ? { gap: 0.3 } : { at: 0.9 })), min: 4, bg: '#10131F',
      cam: cam({ z: 1.0, x: 900, y: 520 }, { end: 0, z: 1.12, x: 940, y: 520, e: 'lin' }),
      actors: [...set({ before: '…' }), objectProp(plan, [{ x: 640, y: 560, o: 0 }, { t: 0.5, o: 1, e: 'step' }, { t: 0.7, x: 760, y: G - 330, e: 'in' }]),
        zero([{ x: 300, face: 0, look: [8, 0] }, ...walk(300, 560, 0, 0.5), { t: 0.6, pose: 'reach', hr: [170, 110], e: 'out' }, { t: 1.0, pose: 'neutral', hr: null }])],
      sfx: [sfx('thud', 0.7, { g: 0.6 }), sfx('beep', 1.3, { g: 0.4 })] }),
    anomaly: () => ({ zo: 'anomaly', lines: [], min: 3.6, bg: '#10131F',
      cam: cam({ z: 2.6, x: 1120, y: G - 486 }, { t: 1.4, z: 2.6, x: 1120, y: G - 486 }, { t: 1.6, z: 2.4, x: 360, y: 230, e: 'io' }, { t: 2.5, z: 2.4, x: 360, y: 230 }, { t: 2.8, z: 1.9, x: 600, y: 560, e: 'io' }),
      actors: [...set({ screenKeys: [{ t: 0.4, ...plan.screen, alert: 1, e: 'step' }] }), objectProp(plan, [{ x: 760, y: G - 330 }]),
        zero([{ x: 560, face: 0, look: [8, -4] }, { t: 1.6, look: [-8, -8], headR: -10, face: 3 }, { t: 2.6, look: [8, -4], headR: 0, face: 3 }, { t: 3.2, look: [0, 1], face: 1 }])],
      sfx: [sfx('ping', 0.4, { g: 0.4 }), sfx('tick', 1.7, { g: 0.4 }), sfx('tick', 2.2, { g: 0.4 })] }),
    question: () => ({ zo: 'question', lines: plan.question.map((l, i) => N(l, i ? { gap: 0.5 } : { at: 0.3 })), min: 3, bg: '#10131F',
      cam: cam({ z: 1.6, x: 640, y: 520 }, { end: 0, z: 1.7, x: 640, y: 520, e: 'lin' }),
      actors: [...set({}), objectProp(plan, [{ x: 760, y: G - 330 }]), zero([{ x: 560, face: 1, look: [0, 1] }, ...lookCam({ t: 0.2 }, { face: 4, tilt: 8 })])] }),
    reveal: () => ({ zo: 'reveal', lines: [], min: 3.8, bg: '#10131F',
      cam: cam({ z: 1.0, x: 1060, y: 500 }, { end: 0, z: 1.1, x: 1240, y: 480, e: 'io' }),
      actors: [...set({ layerKeys: openKeys(1.4, 1.0) }), objectProp(plan, [{ x: 760, y: G - 330 }]),
        pix([{ x: 1200, y: 700, s: 0.6, face: 0, o: 0 }, { t: 0.3, o: 1, e: 'step' }, { t: 0.7, x: 900, y: 380, s: 1.3, face: 2, e: 'back' }, { t: 1.4, x: 1180, y: 300, face: 3, e: 'io' }]),
        P('scanbeam', [{ x: 900, y: 380, dx: -140, dy: 240, w: 140, o: 0 }, { t: 0.8, o: 1, e: 'step' }, { t: 1.3, o: 0, e: 'step' }], 'beam', 9),
        zero([{ x: 560, face: 1, look: [8, -4] }, ...stepBack({ t: 1.5 }, 560, { face: 3 }), ...leanIn({ t: 2.6 }, 500, { face: 6, look: [8, -6] })])],
      sfx: [sfx('pix-ting', 0.3, { g: 0.5 }), sfx('scan', 0.8, { g: 0.5 }), sfx('swipe', 1.4, { g: 0.5 })] }),
    entry: () => ({ zo: 'entry', lines: [], min: 2.6, bg: '#10131F',
      cam: cam({ z: 1.1, x: 1240, y: 480 }, { t: 1.0, z: 1.1, x: 1240, y: 480 }, { u: 1, z: 1.9, x: 1500, y: 420, e: 'in' }),
      tout: { type: 'zoom', x: 1500, y: 420, dur: 0.5, color: '#05060D' },
      actors: [...set({ layerKeys: [{ open: 1 }] }), objectProp(plan, [{ x: 760, y: G - 330 }, { t: 0.4, x: 760, y: G - 330 }, { t: 1.2, x: 1500, y: 420, s: 0.3, e: 'in' }]),
        pix([{ x: 1180, y: 300, s: 1.3, face: 4 }, { t: 0.9, x: 1500, y: 400, s: 0.5, e: 'in' }]),
        zero([{ x: 500, face: 6, look: [8, -6] }, { t: 0.4, face: 8, pose: 'run' }, { t: 1.2, x: 1100, pose: 'run', e: 'lin' }, { t: 1.4, squash: 0.85 }, { t: 1.8, x: 1500, y: 560, s: 1.2, squash: 1.1, pose: 'celebrate', e: 'out' }, { u: 1, s: 0.3, y: 420, e: 'in' }], { z: 6 })],
      sfx: [sfx('whoosh', 1.3, { g: 0.5 })] }),
    brand: () => brandBeat({ kind: plan.kind }),
    promise: () => ({ zo: 'promise', lines: plan.promise.map((l, i) => N(l, i ? { gap: 0.4 } : { at: 0.05 })), min: 6, bg: '#05060D',
      cam: cam({ z: 1.25, x: 960, y: 540 }, { end: 0, z: 1.15, x: 960, y: 560, e: 'io' }),
      actors: [P('hiddenlayer', { x: 960, y: 540, w: 1920, h: 1080, open: 1, kind: plan.kind, style: 'xray', s: 1.3 }, 'bl', -20),
        objectProp(plan, [{ x: 960, y: 760, s: 1.4 }]), zero([{ x: 960, y: 760, s: 1.6, face: 6, look: [6, -4] }, { u: 0.6, face: 2 }], { z: 6 }),
        pix([{ x: 1300, y: 420, s: 1.2, face: 1 }])] }),
  };
  return ['event', 'anomaly', 'question', 'reveal', 'entry', 'brand', 'promise'].map(k => o.acts?.[k] ? o.acts[k](plan, acts[k]) : acts[k]());
}

// ---------- 3. the quality test ----------
const BANNED = /welcome back|in today'?s video|today we('| a)re|like and subscribe|subscribe|notification bell|before we start|smash that/i;
// ep: the episode (its beats from the start of the video); est(text) → seconds. Returns [{ n, q, ok, why }].
export function checkOpen(ep, est) {
  const beats = []; let t = 0;
  for (const b of ep.beats) {
    let lt = b.pre ?? (b.lines?.length ? 0.35 : 0); const lines = [];
    for (const ln of b.lines || []) { if (ln.at != null) lt = ln.at; const d = est(ln.text); lines.push({ text: ln.text, start: t + lt, end: t + lt + d }); lt += d + (ln.gap ?? 0.3); }
    const dur = Math.max(b.min ?? 0, lines.length ? lt - 0.3 + (b.hold ?? 0.55) : 0, 0.5);
    beats.push({ b, start: t, dur, lines }); t += dur;
  }
  const act = name => beats.find(x => x.b.zo === name), brand = act('brand'), all = beats.flatMap(x => x.lines);
  const first = beats[0], qLine = all.find(l => /\?|\.\.\.|mistake|problem|life\./.test(l.text) && act('question') && l.start >= act('question').start);
  const hasType = (x, re) => x?.b.actors.some(a => re.test(a.type));
  const before = brand ? all.filter(l => l.start < brand.start) : all;
  const words = before.reduce((s, l) => s + l.text.split(/\s+/).length, 0);
  const after = brand && beats[beats.indexOf(brand) + 1];
  const capsEarly = beats.filter(x => x.start < 20).some(x => x.b.actors.some(a => a.type === 'text'));
  const R = [
    [1, 'Something happens in the first 3 seconds', !!first && ((first.b.sfx || []).some(s => (s.t ?? 0) < 3) || first.b.actors.some(a => a.k.length > 1 && a.k[1].t != null && a.k[1].t < 3)), 'first beat has a sound or a move before 3 s'],
    [2, 'There is a clear curiosity gap', !!act('anomaly') && (act('anomaly').lines.length === 0), 'an anomaly beat shows it before anyone says it'],
    [3, 'ZERO has something to do', !!first && first.b.actors.some(a => a.type === 'zero' && a.k.length > 2), 'ZERO acts in the event beat'],
    [4, 'The central question lands quickly', !!qLine && qLine.end < 20, qLine ? `question ends at ${qLine.end.toFixed(1)} s` : 'no question line'],
    [5, 'PIX reveals rather than decorates', !!act('reveal') && hasType(act('reveal'), /^pix$/) && hasType(act('reveal'), /hiddenlayer|scanbeam|sysview/), 'PIX and a reveal mechanism share the reveal beat'],
    [6, 'ZERO physically enters the system', !!act('entry') && act('entry').b.actors.some(a => a.type === 'zero' && a.k.length > 2), 'an entry beat moves ZERO in'],
    [7, 'The branded moment is extremely short', !!brand && brand.dur <= 2, brand ? `${brand.dur.toFixed(1)} s` : 'no brand beat'],
    [8, 'The story moves again immediately', !!after && after.lines.length > 0 && after.lines[0].start - after.start <= 0.6, after?.lines[0] ? `first line ${(after.lines[0].start - after.start).toFixed(1)} s after the mark` : 'no line after the mark'],
    [9, 'No unnecessary exposition', words <= 45 && !all.some(l => BANNED.test(l.text)), `${words} words before the mark; no channel talk`],
    [10, 'It makes you want the answer', null, 'human call: watch it'],
    [11, 'Designed for adults', !capsEarly && !all.some(l => BANNED.test(l.text)), capsEarly ? 'caption text in the first 20 s' : 'no captions in the first 20 s, no YouTube clichés'],
    [12, 'Unmistakably Zero Understands', !!brand && beats.some(x => hasType(x, /^zero$/)) && beats.some(x => hasType(x, /^pix$/)) && (brand.b.sfx || []).some(s => s.s === 'zu-signature'), 'ZERO, PIX and the zu-signature are all there'],
  ];
  return { total: t, entryAt: brand?.start, checks: R.map(([n, q, ok, why]) => ({ n, q, ok, why })) };
}
