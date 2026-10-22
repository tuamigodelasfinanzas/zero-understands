// ZeroStoryEngine, ZeroObjectJourney and ZeroEnding (docs/zerostory.md). ZeroOpen gets the viewer inside; these keep
// them there for ten minutes:
//   - one story, not a list of steps: HOOK → MYSTERY → ENTER SYSTEM → DISCOVERY → COMPLICATION → BIG REVEAL →
//     CONSEQUENCE → ZERO UNDERSTANDS, with ZERO wanting one thing the whole way;
//   - ONE OBJECT TO FOLLOW: the same physical thing carries us through the system (a box, €100, a data packet);
//   - progressive reveal: every answer opens a bigger question;
//   - a circular ending: back where it started, a payoff, one last irony, ZERO's look, CLICK, black. Never a CTA.
// deriveStory(title) plans it; endingBeats() builds the ending from reusable pieces; checkStory(ep) tests the result.
import { N, zero, pix, prop, sfx, cam, lookCam } from './kit.mjs';

const P = (type, k, id, z = 0, o = {}) => prop(type, k, { id, z, ...o });
export const ACTS = ['hook', 'mystery', 'enter', 'discovery', 'complication', 'reveal', 'consequence', 'understands'];

// ---------- the plan ----------
// Per family of systems: the object we follow, ZERO's goal, and the chain of questions (each answer → a bigger one),
// the complication (what goes wrong), the big reveal (the system seen whole) and the ironic last beat.
export const JOURNEYS = {
  logistics: {
    match: /package|parcel|deliver|shipping|amazon|warehouse|supply chain|temu|ikea|courier|overnight/i,
    object: 'one box (yellow, with a label)', goal: 'make sure the box arrives in time',
    chain: [['How can it possibly arrive by morning?', 'It never travels straight: everything goes through one hub.'],
      ['How does the system know where the box is going?', 'The label turns it into data; every scan updates where it is.'],
      ['Who pays for a plane to fly through the night?', 'Thousands of small payments share each big plane.'],
      ['And what happens when something goes wrong?', 'A person, with about ten seconds.']],
    complication: 'the label can no longer be read / the network stops', reveal: 'the hub is one of a few that breathe in every night and out every morning',
    irony: 'the system was perfectly on time; ZERO was the one who forgot', end: 'the box arrives; ZERO, who stayed up all night, is found asleep inside it',
  },
  payments: {
    match: /credit card|debit|card|payment|visa|mastercard|checkout|fee/i,
    object: '€100 from one tap of a card', goal: 'find out where his €100 actually went',
    chain: [['Where did the €100 go?', 'Not to the shop: to the shop\'s bank first.'], ['Why does the shop get less than €100?', 'Every company on the way takes a slice.'],
      ['Who decides the size of each slice?', 'The card network sets the rules.'], ['So who really pays for the free card and the points?', 'Everyone, through the prices.']],
    complication: 'the payment is declined / flagged as fraud', reveal: 'a few networks sit between almost every buyer and seller',
    irony: 'ZERO earns 1% points and feels rich', end: 'the €100 reaches the shop, minus its slices; ZERO taps again',
  },
  generic: {
    match: /./, object: 'the one thing the title is about, made physical', goal: 'answer the question from the opening',
    chain: [['What happens first?', '…'], ['Why does it work that way?', '…'], ['Who pays for it?', '…'], ['What happens when it fails?', '…']],
    complication: 'something breaks', reveal: 'the whole system seen at once', irony: 'a small human contradiction', end: 'back to the opening situation, now understood',
  },
};

export function deriveStory(input) {
  const text = [input.title, input.topic].filter(Boolean).join(' ');
  const key = input.journey ?? Object.keys(JOURNEYS).find(k => k !== 'generic' && JOURNEYS[k].match.test(text)) ?? 'generic';
  const J = JOURNEYS[key];
  return {
    journey: key, VIDEO_TITLE: input.title,
    OBJECT_TO_FOLLOW: input.object ?? J.object, ZERO_GOAL: input.goal ?? J.goal,
    QUESTION_CHAIN: (input.chain ?? J.chain).map(([q, a]) => ({ q, a })),
    COMPLICATION: input.complication ?? J.complication, BIG_REVEAL: input.reveal ?? J.reveal,
    CONSEQUENCE: input.end ?? J.end, ENDING_IRONY: input.irony ?? J.irony,
    ACTS: ACTS.map(a => ({ act: a, purpose: PURPOSE[a] })),
  };
}
const PURPOSE = {
  hook: 'something happens to ZERO in an ordinary situation (ZeroOpen event)',
  mystery: 'the thing that doesn\'t make sense, then the question (ZeroOpen anomaly + question)',
  enter: 'PIX reveals, ZERO goes in with the object, CLICK, the promise',
  discovery: 'follow the object; answer one question at a time, each answer opening a bigger one',
  complication: 'something goes wrong for the object; ZERO can lose it',
  reveal: 'pull out: the whole system at once, the scale nobody sees',
  consequence: 'the object arrives / the result lands in ZERO\'s ordinary world',
  understands: 'recap as images, one irony, ZERO\'s look, CLICK, black',
};

// ---------- the ending ----------
// The closing signature: black, the wordmark and the zu-signature, 1.4 s. Nothing else after it.
export function endMark(o = {}) {
  return {
    act: 'understands', lines: [], min: o.dur ?? 1.4, bg: '#05060D',
    cam: cam({ z: 1, x: 960, y: 540 }),
    actors: [P('zumark', [{ x: 940, y: 540, s: 1.05, k: 0, flash: 0, o: 0, ui: true }, { t: 0.15, o: 1, flash: 1, e: 'step' }, { t: 0.5, k: 1, flash: 0, e: 'out' }], 'mark', 45)],
    sfx: [sfx('zu-signature', 0, { g: 0.9 })],
  };
}

// The irony beat: ZERO's phone buzzes with one line that turns the whole video around; he reads it, looks at us,
// PIX says nothing (an ellipsis). set: the actors of the place we came back to; at: where ZERO stands
export function ironyBeat({ set = [], at = { x: 960, y: 935 }, phone = ['', ''], lines = [], s = 2.6, bg = '#7A8CA8', camK } = {}) {
  return {
    act: 'understands', lines, min: 5, hold: 0.8, bg,
    cam: camK ?? cam({ z: 1.5, x: at.x + 40, y: at.y - 300 }, { end: 0, z: 1.6, x: at.x + 40, y: at.y - 310, e: 'lin' }),
    actors: [...set,
      zero([{ ...at, s, face: 0, look: [4, 2], hr: [150, 150] }, { t: 0.5, squash: 0.95 }, { t: 0.6, squash: 1 }, { t: 0.9, hr: [140, 104], look: [4, 6], face: 0, e: 'out' },
        { t: 2.4, face: 3 }, ...lookCam({ t: 3.0 }, { face: 1 })], { z: 5 }),
      P('phone', [{ x: at.x + (140 - 100) * s / 2.6, y: at.y - (204 - 104) * s / 2.6 - 40, s: 0.55 * s / 2.6, dot: 1, buzz: 0, o: 0 }, { t: 0.4, o: 1, buzz: 1, e: 'step' }, { t: 0.9, buzz: 0 }], 'ph', 6),
      P('notif', [{ x: 960, y: 150, s: 1.05, w: 900, txt: phone[1], size: 42, icon: '#2F80ED', o: 0, ui: true }, { t: 1.0, o: 1, e: 'step' }], 'msg', 46),
      pix([{ x: at.x + 520, y: at.y - 420, s: 1.1, face: 0, o: 0 }, { t: 3.4, o: 1, e: 'step' }, { t: 3.8, face: 4 }]),
      P('bubble', [{ x: at.x + 600, y: at.y - 560, txt: '...', w: 170, h: 100, o: 0 }, { t: 3.9, o: 1, e: 'step' }], 'dots', 10)],
    sfx: [sfx('buzz', 0.4, { g: 0.5 }), sfx('zero-boop', 3.0, { g: 0.4 })],
  };
}

// ---------- the test ----------
// ep.story: [[act, firstBeatIndex], ...]; ep.object: { ids: [prop ids that are the object] }. est(text) → seconds.
export function checkStory(ep, est) {
  const beats = []; let t = 0;
  for (const b of ep.beats) {
    let lt = b.pre ?? (b.lines?.length ? 0.35 : 0); const lines = [];
    for (const ln of b.lines || []) { if (ln.at != null) lt = ln.at; const d = est(ln.text); lines.push({ text: ln.text, start: t + lt }); lt += d + (ln.gap ?? 0.3); }
    const dur = Math.max(b.min ?? 0, lines.length ? lt - 0.3 + (b.hold ?? 0.55) : 0, 0.5);
    beats.push({ b, start: t, dur, lines }); t += dur;
  }
  const story = ep.story ?? [], order = story.map(([a]) => ACTS.indexOf(a));
  const ids = new Set(ep.object?.ids ?? []);
  const withObj = beats.filter(x => x.b.actors.some(a => ids.has(a.id) || (a.type === 'zero' && a.k.some(k => k.holdR))) || x.b.objectOffscreen);
  const objShare = beats.length ? withObj.reduce((s, x) => s + x.dur, 0) / t : 0;
  const qs = beats.flatMap(x => x.lines).filter(l => /\?\s*$/.test(l.text)).map(l => l.start);
  const gaps = qs.slice(1).map((q, i) => q - qs[i]), maxGap = Math.max(0, ...gaps, t - (qs[qs.length - 1] ?? 0) - 120);
  // pattern interrupts: a "look" is the first big set prop of a beat; the longest run with the same look
  const look = x => x.b.actors.find(a => a.z <= -15 && !['vignette', 'rect', 'pool', 'sysview'].includes(a.type))?.type ?? x.b.bg;
  let run = 0, best = 0, prev = null, changes = 0;
  for (const x of beats) { const l = look(x); if (l === prev) run += x.dur; else { run = x.dur; changes++; } prev = l; best = Math.max(best, run); }
  const steps = beats.flatMap(x => x.lines).filter(l => /^(step \d|step one|first step|next step)/i.test(l.text));
  const last = beats[beats.length - 1], cta = beats.flatMap(x => x.lines).some(l => /subscribe|like and|notification bell|that'?s all for today/i.test(l.text));
  const R = [
    ['All eight acts, in order', ACTS.every(a => story.some(([s]) => s === a)) && order.every((v, i) => !i || v > order[i - 1]), story.map(s => s[0]).join(' → ') || 'no ep.story'],
    ['ONE OBJECT TO FOLLOW is on screen most of the time', objShare >= 0.6, `${Math.round(objShare * 100)}% of the running time`],
    ['Progressive reveal: questions keep coming', qs.length >= 4 && maxGap <= 150, `${qs.length} questions, longest gap ${Math.round(maxGap)} s`],
    ['Pattern interrupts: no look lasts too long', best <= 50, `${changes} changes of look, longest stretch ${Math.round(best)} s`],
    ['No "step 1, step 2"', steps.length === 0, steps.length ? steps[0].text : 'none'],
    ['Circular ending with the brand mark and no CTA', !!last && last.b.actors.some(a => a.type === 'zumark') && !cta, cta ? 'a CTA in the narration' : 'ends on the mark'],
  ];
  return { total: t, checks: R.map(([q, ok, why], i) => ({ n: i + 1, q, ok, why })) };
}
