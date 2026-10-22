// Video 001 "Where Your Package Goes While You Sleep", part 2 (script scenes s12-s26): the airport, the flight to the
// hub, Worldport, the sort, the people who run it at night, and the outbound containers.
// Direction: docs/mundo-vivo.md. ZERO rides what we follow: he squeezes into the container, clings on through
// take-off, gets kicked off the irregular lane, loses his box in the maze and slides down the chute after it.
import { G, N, zero, pix, sfx, cam, walk, lookCam, stepBack, leanIn, tilt } from '../../src/kit.mjs';
import { BOX, P, vig, sysOn, ui, ZB, VEST, SEAT, loader, rampSet, hubSet, flow, usView, HX, HY, AX } from './common.mjs';


// the hold of the cross-section hologram: the fuselage circle and two containers fitting its curve
const ULDS = (() => {
  const c = 'M -100 0 L 160 0 L 160 -300 L -160 -300 L -160 -120 Z';
  return `<circle cx="0" cy="-20" r="112" fill="none" stroke="#7CC2FF" stroke-width="6"/><path d="M -92 46 H 92" stroke="#7CC2FF" stroke-width="5"/>
    <path d="${c}" transform="translate(-44 46) scale(-0.22 0.22)" fill="#FFC93C" opacity="0.85"/><path d="${c}" transform="translate(44 46) scale(0.22 0.22)" fill="#7CC2FF" opacity="0.7"/>`;
})();

export default {
  id: 'v001-part2',
  format: 'long',
  title: 'Where Your Package Goes While You Sleep (animatic, part 2)',
  description: 'Animatic of video 001, from the airport to the outbound containers.',
  tags: ['how it works', 'logistics', 'packages', 'air cargo'],
  music: 'curious', musicGain: 0.06,
  voices: { narr: { voice: 'en-US-AndrewNeural', rate: '-6%' } },
  rimGlow: 0.14, rimWidth: 2.0, zshadow: 0.38,
  beats: [
    // ===== s12a: the ramp at night. The jet waits with its door open; the containers wait in a train =====
    {
      lines: [N("At the airport, the boxes don't board one by one.", { at: 0.8 })], min: 4.4, bg: '#0B0F26',
      tin: { type: 'iris', x: 960, y: 700, dur: 0.6, color: '#05060D' },
      cam: cam({ z: 1.0, x: 960, y: 560 }, { end: 0, z: 1.07, x: 900, y: 600, e: 'lin' }),
      actors: [...rampSet(), zero([{ x: -120, y: 1010, s: 1.4, face: 0, look: [6, -6], pose: 'run' }, { t: 0.9, x: 330, pose: 'run', e: 'lin' }, { t: 1.2, x: 380, pose: 'neutral', look: [8, -8], headR: -10, face: 3, e: 'out' }, { t: 2.6, look: [4, -3], headR: 0, face: 0 }]), vig(0.7)],
      sfx: [sfx('ramp', 0, { g: 0.5, bed: true }), sfx('beep', 1.6, { g: 0.25 })],
    },
    // ===== s12b: the worker lifts ZERO's box into a half-full container =====
    {
      lines: [N("They're packed into these.")], min: 3.4, bg: '#0B0F26',
      cam: cam({ z: 1.85, x: 820, y: 690 }, { end: 0, z: 1.95, x: 800, y: 690, e: 'lin' }),
      actors: [...rampSet({ uldK: [null, [{ fill: 0.5, door: 1 }, { t: 1.7, yellow: true, e: 'step' }]],
        w1: { x: 1180, pose: 'carry', hold: { type: 'giftbox', s: 0.5, ...ZB } }, w1K: [{ t: 1.2, x: 930, e: 'io' }, { t: 1.7, pose: 'reach', hold: null, e: 'step' }, { t: 2.4, pose: 'stand', x: 1000 }] }),
        zero([{ x: 1130, y: 975, s: 1.4, face: 0, look: [-6, -2], flip: true }, { t: 1.8, face: 2, look: [-8, -3] }, ...leanIn({ t: 2.2 }, 1130, { dx: -30, face: 0, look: [-8, -2] }).map(k => ({ ...k, flip: true }))]), vig(0.7)],
      sfx: [sfx('ramp', 0, { g: 0.45, bed: true }), sfx('thud', 1.7, { g: 0.4 })],
    },
    // ===== s12c: PIX shows why they're that shape. ZERO doesn't care: he squeezes in next to his box =====
    {
      lines: [N('Containers shaped to fit the inside of the plane.')], min: 5, hold: 1.4, bg: '#0B0F26',
      cam: cam({ z: 1.85, x: 800, y: 660 }, { l: 0, t: 2.6, z: 2.1, x: 770, y: 700, e: 'io' }),
      actors: [...rampSet({ uldK: [null, [{ fill: 0.5, door: 1, yellow: true }]], w1: { x: 1000, pose: 'stand', look: -0.4 } }),
        pix([{ x: 1400, y: 420, s: 0.9, face: 0, o: 0 }, { t: 0.2, o: 1, e: 'step' }, { t: 0.6, x: 1210, y: 520, face: 3, e: 'back' }, { l: 0, t: 2.6, face: 5 }]),
        P('holo', [{ x: 1000, y: 590, w: 250, h: 230, inner: ULDS, on: 0 }, { t: 0.7, on: 0 }, { t: 1.1, on: 1, e: 'out' }, { l: 0, t: 2.8, on: 1 }, { l: 0, t: 3.1, on: 0 }], 'xsec', 9),
        zero([{ x: 1130, y: 975, s: 1.4, face: 0, look: [-8, -6], flip: true }, ...tilt({ t: 1.4 }, { deg: -10, face: 4 }).map(k => ({ ...k, flip: true })),
          { l: 0, t: 2.4, x: 1000, y: 975, pose: 'run', flip: true, face: 8 }, { l: 0, t: 2.8, x: 820, y: 760, s: 1.25, squash: 0.62, pose: 'crossed', face: 2, flip: true, e: 'out' }, { end: 0.6, face: 2 }, { end: 0.3, face: 1, look: [0, 1] }], { z: 2 }),
        P('rect', [{ x: 760, y: 584, w: 312, h: 0, fill: '#9FC4D8', op: 0.42 }, { l: 0, t: 3.0, y: 584, h: 0 }, { l: 0, t: 3.6, y: 734, h: 300, e: 'io' }], 'curtain', 3),
        P('rect', [{ x: 760, y: 580, w: 320, h: 18, rx: 9, fill: '#8FB1C4' }, { l: 0, t: 3.0, y: 580 }, { l: 0, t: 3.6, y: 880, e: 'io' }], 'roll', 4), vig(0.7)],
      sfx: [sfx('ramp', 0, { g: 0.45, bed: true }), sfx('pix-ting', 0.6, { g: 0.5 }), sfx('swipe', 0.7, { g: 0.3 }), sfx('whoosh', 2.6, { l: 0, g: 0.4 }), sfx('swipe', 3.0, { l: 0, g: 0.35 })],
    },
    // ===== s13a: take-off, from the side of the runway =====
    {
      lines: [], min: 1.7, bg: '#060918',
      cam: cam({ z: 1.0, x: 960, y: 560, shake: 4, rot: 0 }, { u: 1, rot: -3, shake: 6, y: 520, e: 'in' }),
      actors: [P('runway', { x: 960, y: 640, speed: 2600 }, 'rw', -20),
        P('cargojet', [{ x: 900, y: 860, s: 0.58, tilt: 0, land: true, roll: 1200, door: 0 }, { t: 0.4, tilt: 0 }, { u: 1, tilt: 11, y: 700, e: 'in' }], 'jet', 0), vig(0.75)],
      sfx: [sfx('jet', 0, { g: 1 })],
    },
    // ===== s13b: inside the hold. Everything is strapped down except ZERO =====
    {
      lines: [], min: 1.9, bg: '#22263C',
      cam: cam({ z: 1.1, x: 900, y: 640, rot: 7, shake: 6 }, { u: 1, rot: 7.5, shake: 5 }),
      actors: [P('hold', { x: 960, y: 900, red: 0.6 }, 'hold', -20),
        ...[[280, 0.9, 1], [720, 0.5, 2], [1160, 1, 3], [1600, 0.8, 4]].map(([x, fill, seed], i) => P('uld', { x, y: 880, s: 1.35, fill, seed, door: 0, yellow: i === 1, yx: 60 }, 'u' + i, -5)),
        P('net', { x: 960, y: 880, w: 2600, h: 420, op: 0.35 }, 'net', -3),
        zero([{ x: 800, y: 760, s: 1.6, pose: 'scared', face: 3, lean: -28, hl: [60, 104], hr: [140, 104], fl: [20, 180], fr: [40, 196], look: [0, -2] }, { t: 0.5, fl: [10, 170], fr: [36, 190], lean: -34 }, { t: 1.0, fl: [24, 186], fr: [44, 200], lean: -30 }, { t: 1.5, fl: [8, 168], lean: -36, face: 9 }]),
        vig(0.85)],
      sfx: [sfx('jet', 0, { g: 0.6 }), sfx('engine', 0, { g: 0.4, bed: true })],
    },
    // ===== s14a: SYSTEM VIEW. ZERO expects a straight line to mom. PIX crosses it out =====
    {
      lines: [N("But the plane isn't flying to mom's city.")], min: 3.6, bg: '#06070F',
      cam: cam({ z: 1, x: 960, y: 540 }),
      actors: [...usView([{ direct: 0 }, { t: 0.2, direct: 0 }, { t: 1.2, direct: 1, e: 'io' }, { l: 0, t: 1.7, cross: 0 }, { l: 0, t: 2.0, cross: 1, e: 'back' }]),
        ui(pix([{ x: 1720, y: 250, s: 1.3, face: 0 }, { l: 0, t: 1.6, face: 1, spin: -18 }, { l: 0, t: 1.8, spin: 18 }, { l: 0, t: 2.0, spin: -14 }, { l: 0, t: 2.2, spin: 0 }])),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 2, flip: true, pose: 'point', look: [-8, -6] }, { l: 0, t: 1.9, face: 3, pose: 'neutral' }, { l: 0, t: 2.4, face: 7, look: [-6, -2] }], { z: 48 }))],
      sfx: [sfx('swipe', 0.2, { g: 0.3 }), sfx('error', 1.9, { g: 0.45 })],
    },
    // ===== s14b: the real flight bends to Louisville =====
    {
      lines: [N("It's flying to Louisville, Kentucky.")], min: 3.2, bg: '#06070F',
      cam: cam({ z: 1, x: 960, y: 540 }, { end: 0, z: 1.35, x: (AX + HX) / 2 + 40, y: 520, e: 'io' }),
      actors: [...usView([{ direct: 1, cross: 1, zarc: 0 }, { t: 0.2, zarc: 0 }, { t: 1.6, zarc: 1, e: 'io' }, { t: 1.6, hub: true, hubLabel: 'LOUISVILLE, KY', e: 'step' }]),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 7, flip: true, look: [-6, -2] }, ...tilt({ t: 1.7 }, { deg: 12, face: 4 }).map(k => ({ ...k, flip: true }))], { z: 48 }))],
      sfx: [sfx('whoosh', 0.3, { g: 0.35 }), sfx('ping', 1.6, { g: 0.4 })],
    },
    // ===== s14c: and every other city's planes too =====
    {
      lines: [N('And so are planes from all over the country.')], min: 3.6, hold: 0.8, bg: '#06070F',
      cam: cam({ z: 1.35, x: (AX + HX) / 2 + 40, y: 520 }, { t: 0.3, z: 1.35 }, { end: 0, z: 1, x: 960, y: 540, e: 'io' }),
      actors: [...usView([{ direct: 0, cross: 0, zarc: 1, hub: true, hubLabel: 'LOUISVILLE, KY', arcs: 0 }, { t: 0.3, arcs: 0 }, { end: 0.4, arcs: 1, e: 'io' }]),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 4, flip: true, look: [-6, -4], headR: 10 }, { t: 1.4, face: 3, headR: 0, look: [-8, -8] }], { z: 48 }))],
      sfx: [...[0.6, 1.0, 1.4, 1.8, 2.2].map(t => sfx('ping', t, { g: 0.18 }))],
    },
    // ===== s15a: the four-hour circle =====
    {
      lines: [N('Louisville is within a four-hour flight of ninety-five percent of the people in the United States.')], min: 6, bg: '#06070F',
      cam: cam({ z: 1, x: 960, y: 540 }),
      actors: [...usView([{ zarc: 0, hub: true, hubLabel: 'LOUISVILLE, KY', arcs: 1, ring: 0 }, { t: 0.6, ring: 0 }, { l: 0, t: 3.2, ring: 1, e: 'io' }]),
        ui(P('holo', [{ x: 520, y: 990, w: 760, h: 120, txt: '4-HOUR FLIGHT · 95% OF AMERICANS', size: 34, on: 0 }, { l: 0, t: 3.4, on: 0 }, { l: 0, t: 3.8, on: 1, e: 'out' }], 'h95', 46)),
        ui(pix([{ x: 1720, y: 250, s: 1.3, face: 3 }])),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 3, flip: true, look: [-8, -6] }, { l: 0, t: 3.6, face: 0 }], { z: 48 }))],
      sfx: [sfx('swipe', 0.6, { g: 0.3 }), sfx('ping', 3.8, { l: 0, g: 0.35 })],
    },
    // ===== s15b: not an accident. ZERO nods slowly =====
    {
      lines: [N("That's not an accident."), N("That's why the hub is here.", { gap: 0.4 })], min: 4, hold: 0.9, bg: '#06070F',
      cam: cam({ z: 1, x: 960, y: 540 }, { l: 1, z: 1, x: 960, y: 540 }, { end: 0, z: 1.6, x: HX, y: HY, e: 'io' }),
      actors: [...usView([{ zarc: 0, hub: true, hubLabel: 'LOUISVILLE, KY', arcs: 1, ring: 1 }]),
        ui(P('holo', { x: 520, y: 990, w: 760, h: 120, txt: '4-HOUR FLIGHT · 95% OF AMERICANS', size: 34, on: 1 }, 'h95', 46)),
        ui(pix([{ x: 1720, y: 250, s: 1.3, face: 1 }])),
        ui(zero([{ x: 1760, y: 1050, s: 1.8, face: 0, flip: true, look: [-8, -4] }, { l: 1, headR: 0 }, { l: 1, t: 0.3, headR: 10, face: 1 }, { l: 1, t: 0.6, headR: -2 }, { l: 1, t: 0.9, headR: 10 }, { l: 1, t: 1.2, headR: 0 }], { z: 48 }))],
    },
    // ===== s16a: in the hold, ZERO climbs onto a parcel to reach the only window =====
    {
      lines: [N('Late at night, planes line up in the dark.')], min: 3.4, bg: '#22263C',
      tin: { type: 'iris', x: 1200, y: 590, dur: 0.5, color: '#05060D' },
      cam: cam({ z: 1.5, x: 1060, y: 650, shake: 1.2 }, { end: 0, z: 1.75, x: 1170, y: 610, e: 'io' }),
      actors: [P('hold', { x: 960, y: 1020, window: 240 }, 'hold', -20),
        ...[[160, 0.9, 1], [600, 0.5, 2]].map(([x, fill, seed], i) => P('uld', { x, y: 1000, s: 1.35, fill, seed, door: 0, yellow: i === 1, yx: 60 }, 'u' + i, -5)),
        P('parcel', { x: 990, y: 1020, s: 1.3, v: 2 }, 'step', -2),
        zero([{ x: 990, y: 916, s: 2.0, face: 0, look: [8, -6], hl: [100, 150], hr: [150, 104], lean: 4 }, { t: 1.2, look: [8, -8], face: 3 }]), vig(0.85)],
      sfx: [sfx('engine', 0, { g: 0.35, bed: true })],
    },
    // ===== s16b: through the window: the queue of landing lights going down to the lit hub =====
    {
      lines: [N('At the busiest moments, about one lands every minute.', { at: 0.5 })], min: 4.6, hold: 1, bg: '#060918',
      cam: cam({ z: 1, x: 960, y: 560, shake: 1 }, { end: 0, z: 1.1, x: 1000, y: 580, e: 'lin' }),
      actors: [P('approach', { x: 960, y: 720, hx: 200, n: 9, period: 2.2 }, 'appr', -20),
        P('porthole', { x: 0, y: 0, ui: true, rr: 430 }, 'port', 45)],
      sfx: [sfx('engine', 0, { g: 0.35, bed: true })],
    },
    // ===== s17a: Worldport. From ZERO, tiny on the apron, out to the whole building =====
    {
      lines: [N('This is Worldport.', { at: 1.2 }), N("UPS's main air hub.", { gap: 0.2 })], min: 4.8, bg: '#141729',
      cam: cam({ z: 4.5, x: 935, y: 800 }, { t: 0.6, z: 4.5, x: 935, y: 800 }, { l: 1, t: 0.5, z: 0.62, x: 960, y: 560, e: 'io' }),
      actors: [P('hubaerial', { x: 960, y: 540 }, 'air', -20),
        zero([{ x: 935, y: 830, s: 0.16, face: 3, look: [0, -8], headR: -10 }], { z: 2 }), vig(0.6)],
      sfx: [sfx('ramp', 0, { g: 0.4, bed: true }), sfx('whoosh', 1.2, { g: 0.35 })],
    },
    // ===== s17b: the size, in PIX's numbers =====
    {
      lines: [N('Five point two million square feet.')], min: 2.8, bg: '#141729',
      cam: cam({ z: 0.62, x: 960, y: 560 }, { end: 0, z: 0.66, x: 960, y: 560, e: 'lin' }),
      actors: [P('hubaerial', { x: 960, y: 540 }, 'air', -20),
        ui(P('holo', [{ x: 960, y: 120, w: 620, h: 110, txt: '5.2 MILLION SQ FT', size: 40, on: 0 }, { t: 0.4, on: 1, e: 'out' }], 'hsq', 46)), vig(0.6)],
      sfx: [sfx('ping', 0.45, { g: 0.35 })],
    },
    // ===== s17c: and in football fields: the roof fills with ninety of them =====
    {
      lines: [N('Roughly ninety football fields,'), N('under one roof.', { gap: 0.2 })], min: 4.2, hold: 0.7, bg: '#141729',
      cam: cam({ z: 0.66, x: 960, y: 560 }, { end: 0, z: 0.8, x: 960, y: 540, e: 'io' }),
      actors: [P('hubaerial', [{ x: 960, y: 540, fields: 0 }, { t: 0.3, fields: 0 }, { l: 1, fields: 1, e: 'io' }], 'air', -20),
        ui(P('holo', { x: 960, y: 120, w: 620, h: 110, txt: '≈ 90 FOOTBALL FIELDS', size: 40, on: 1 }, 'hsq', 46)), vig(0.6)],
      sfx: [...[0.4, 0.8, 1.2, 1.6, 2.0].map(t => sfx('click', t, { g: 0.2 }))],
    },
    // ===== s17d: at ground level, ZERO looks up at the wall, and up, and steps back =====
    {
      lines: [], min: 1.6, bg: '#060918',
      cam: cam({ z: 1, x: 960, y: 520 }),
      actors: [P('hubwall', { x: 960, y: 760, dx: 300 }, 'wall', -20),
        zero([{ x: 960, y: 1000, s: 2.2, face: 0, look: [0, -4] }, { t: 0.3, look: [0, -8], headR: -14, face: 3, e: 'io' }, ...stepBack({ t: 0.8 }, 960, { dx: -60, face: 3 })]), vig(0.7)],
      sfx: [sfx('ramp', 0, { g: 0.4, bed: true })],
    },
    // ===== s18a: a jet coming up the lead-in line, and ZERO standing on it =====
    {
      lines: [N("Some planes don't even stop on the ramp.")], min: 3.2, bg: '#060918',
      cam: cam({ z: 0.9, x: 960, y: 560 }, { end: 0, z: 0.92, x: 980, y: 560, e: 'lin' }),
      actors: [P('hubwall', { x: 960, y: 700, dx: 600 }, 'wall', -20),
        P('cargojet', [{ x: -1500, y: 760, s: 0.75, land: true, roll: 300 }, { u: 1, x: -400, e: 'lin' }], 'jet', -2),
        P('rect', { x: 1560, y: 320, w: 1000, h: 760, fill: '#0B0E1C', op: 0.32 }, 'dockshade', 0),
        zero([{ x: 1250, y: 770, s: 1.3, face: 0, look: [8, -6] }, { l: 0, t: 1.4, flip: true, look: [-8, 0], face: 3, e: 'step' }]), vig(0.7)],
      sfx: [sfx('ramp', 0, { g: 0.35, bed: true }), sfx('engine', 0, { g: 0.5, bed: true })],
    },
    // ===== s18b: nose first into the building. ZERO dives out of the way =====
    {
      lines: [N('They pull right up to the building, nose first,'), N('like a car into a garage.')], min: 4.8, hold: 1.2, bg: '#060918',
      cam: cam({ z: 0.92, x: 980, y: 560 }, { end: 0, z: 0.98, x: 1000, y: 580, e: 'lin' }),
      actors: [P('hubwall', { x: 960, y: 700, dx: 600 }, 'wall', -20),
        P('cargojet', [{ x: -400, y: 760, s: 0.75, land: true, roll: 300 }, { l: 1, x: 520, roll: 120, e: 'out' }, { end: 0, x: 585, roll: 0, e: 'out' }], 'jet', -2),
        P('rect', { x: 1560, y: 320, w: 1000, h: 760, fill: '#0B0E1C', op: 0.32 }, 'dockshade', 0),
        zero([{ x: 1250, y: 770, s: 1.3, face: 3, look: [-8, 0], flip: true }, { t: 0.9, squash: 0.8, y: 774, e: 'out' }, { t: 1.2, x: 1420, y: 900, s: 1.6, squash: 1.1, pose: 'scared', e: 'out' }, { t: 1.5, x: 1480, y: 1030, s: 1.8, squash: 0.85, pose: 'neutral', face: 9, flip: false, e: 'in' }, { t: 1.7, squash: 1 },
          ...lookCam({ l: 1, t: 0.4 }, { face: 1 })], { z: 6 }), vig(0.7)],
      sfx: [sfx('engine', 0, { g: 0.5, bed: true }), sfx('whoosh', 0.9, { g: 0.5 }), sfx('thud', 1.5, { g: 0.6 })],
    },
    // ===== s19a: inside. Curtains up; ZERO tumbles out of the container among the parcels =====
    {
      lines: [N('The containers come off,'), N('the doors open,', { gap: 0.15 }), N('and the boxes go onto belts.', { gap: 0.15 })], min: 5, bg: '#1B1F33',
      cam: cam({ z: 0.95, x: 960, y: 560 }, { end: 0, z: 1.0, x: 1000, y: 560, e: 'lin' }),
      actors: [...hubSet(),
        P('conveyor', { x: 1500, y: 860, w: 1300, speed: 120, legs: 70, rail: false }, 'feed', -6),
        P('uld', [{ x: 300, y: G, s: 1.95, fill: 0.9, seed: 4, door: 0 }, { l: 1, door: 0 }, { l: 1, t: 0.6, door: 1, e: 'io' }], 'u0', -5),
        P('uld', [{ x: 920, y: G, s: 1.95, fill: 0.5, seed: 2, door: 0, yellow: true, yx: 60 }, { l: 1, t: 0.3, door: 0 }, { l: 1, t: 0.9, door: 1, e: 'io' }, { l: 2, yellow: false, e: 'step' }], 'u1', -5),
        P('giftbox', [{ x: 1040, y: 802, s: BOX * 0.95, ...ZB, o: 0 }, { l: 2, o: 1, e: 'step' }, { u: 1, x: 1300, e: 'lin' }], 'box', -3),
        ...flow('fp', 828, 900, 5, 260, 120, 5, i => ({ v: i, s: 0.9 })),
        P('person', [{ x: 1400, y: G, s: 2.3, pose: 'reach', flip: true, vest: VEST, shirt: '#3E4A66', skin: '#7A5440', seed: 2, look: -0.5 }, { l: 2, pose: 'stand' }], 'w1', -2),
        zero([{ x: 870, y: G - 240, s: 2.2, squash: 0.55, face: 1, look: [0, 1], pose: 'crossed', o: 0 }, { l: 1, t: 0.8, o: 1, e: 'step' }, { l: 2, t: 0.1, x: 1000, y: G, squash: 1, s: 2.6, pose: 'scared', face: 3, e: 'in' }, { l: 2, t: 0.5, pose: 'neutral', face: 0, look: [8, -2] }, { l: 2, t: 0.9, pose: 'celebrate', face: 11 }, { l: 2, t: 1.4, pose: 'neutral', face: 0 }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.5, bed: true }), sfx('clunk', 0.1, { g: 0.4 }), sfx('swipe', 0.6, { l: 1, g: 0.35 }), sfx('belt', 0, { l: 2, g: 0.3, bed: true })],
    },
    // ===== s19b: three lanes: small, large, and the odd ones. ZERO rides the odd one =====
    {
      lines: [N('Small boxes,'), N('big boxes,', { gap: 0.2 }), N('and weird-shaped ones each get their own lane.', { gap: 0.2 })], min: 6, bg: '#1B1F33',
      cam: cam({ z: 1.2, x: 900, y: 480 }, { l: 1, z: 1.2, x: 900, y: 480 }, { l: 1, t: 0.4, z: 1.2, x: 900, y: 650, e: 'io' }, { l: 2, z: 1.2, x: 900, y: 650 }, { l: 2, t: 0.4, z: 1.0, x: 960, y: 640, e: 'io' }),
      actors: [...hubSet({ fg: false }),
        P('conveyor', { x: 960, y: 470, w: 2600, speed: 160, legs: 0 }, 'bS', -8), P('conveyor', { x: 960, y: 700, w: 2600, speed: 120, legs: 0 }, 'bL', -7), P('conveyor', { x: 960, y: 900, w: 2600, speed: 90, legs: 30 }, 'bI', -6),
        P('plate', { x: 330, y: 380, txt: 'SMALL', w: 220, size: 30 }, 'pS', -5), P('plate', { x: 330, y: 610, txt: 'LARGE', w: 220, size: 30 }, 'pL', -5), P('plate', { x: 340, y: 810, txt: 'IRREGULAR', w: 260, size: 28 }, 'pI', -5),
        ...flow('s', 438, -300, 9, 300, 160, 6, i => ({ v: i, s: 0.55 })),
        ...flow('l', 668, -500, 6, 520, 120, 6, i => ({ v: i + 1, s: 1.25 })),
        ...flow('o', 868, -200, 4, 560, 90, 6, i => ({ type: 'oddparcel', k: ['tube', 'tire', 'guitar', 'golf'][i], s: 1 })),
        zero([{ x: 500, y: 868, s: 2.0, face: 0, look: [8, 0], o: 0 }, { l: 2, t: 0.2, o: 1, e: 'step' }, { l: 2, t: 0.2, x: 400, y: 868 }, { u: 1, x: 400 + 90 * 2.4, e: 'lin' }, { l: 2, t: 1.4, face: 2, pose: 'proud' }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.45, bed: true }), sfx('belt', 0, { g: 0.3, bed: true })],
    },
    // ===== s19c: the lane disagrees. A paddle sends ZERO back to the floor =====
    {
      lines: [], min: 2.6, hold: 0.6, bg: '#1B1F33',
      cam: cam({ z: 1.0, x: 960, y: 640 }, { t: 0.7, shake: 8, e: 'step' }, { t: 1.0, shake: 0 }),
      actors: [...hubSet({ fg: false }),
        P('conveyor', { x: 960, y: 470, w: 2600, speed: 160, legs: 0 }, 'bS', -8), P('conveyor', { x: 960, y: 700, w: 2600, speed: 120, legs: 0 }, 'bL', -7), P('conveyor', { x: 960, y: 900, w: 2600, speed: 90, legs: 30 }, 'bI', -6),
        P('plate', { x: 340, y: 810, txt: 'IRREGULAR', w: 260, size: 28 }, 'pI', -5),
        ...flow('o', 868, 120, 3, 560, 90, 2.6, i => ({ type: 'oddparcel', k: ['tire', 'guitar', 'golf'][i], s: 1 })),
        P('paddle', [{ x: 960, y: 860, s: 1.4, ang: -90 }, { t: 0.55, ang: -90 }, { t: 0.78, ang: -178, e: 'in' }, { t: 1.8, ang: -90, e: 'io' }], 'pad', -3),
        zero([{ x: 616, y: 868, s: 2.0, face: 2, pose: 'proud', look: [8, 0] }, { t: 0.6, x: 670, face: 3, e: 'lin' }, { t: 0.95, x: 820, y: 640, s: 2.3, pose: 'scared', e: 'out' }, { t: 1.25, x: 900, y: 1040, s: 2.5, squash: 0.8, pose: 'neutral', face: 9, e: 'in' }, { t: 1.45, squash: 1 }, ...lookCam({ t: 1.6 }, { face: 1 })], { z: 6 }), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.45, bed: true }), sfx('whoosh', 0.7, { g: 0.6 }), sfx('thud', 1.25, { g: 0.7 })],
    },
    // ===== s20a: the camera tunnel. The box goes in; every camera fires at the label =====
    {
      lines: [N('Then they pass through tunnels of cameras that read the label from every side.')], min: 5, bg: '#1B1F33',
      cam: cam({ z: 1.15, x: 760, y: 560 }, { end: 0, z: 1.2, x: 960, y: 540, e: 'io' }),
      actors: [...hubSet({ fg: false, dim: 0.4 }),
        P('conveyor', { x: 960, y: 760, w: 4000, speed: 120, legs: 175 }, 'belt', -8),
        P('camtunnel', [{ x: 960, y: 728, flash: 0, lx: -400, ty: -70 }, { u: 0.55, flash: 0, lx: -40 }, { u: 0.58, flash: 1, e: 'step' }, { u: 0.64, flash: 0.2 }, { u: 0.67, flash: 1, e: 'step' }, { u: 0.74, flash: 0, lx: 40 }], 'tun', -4),
        P('giftbox', [{ x: 520, y: 730, s: BOX, ...ZB }, { u: 1, x: 1060, e: 'lin' }], 'box', -3.5),
        P('strips', { x: 680, y: 728, h: 420 }, 'cur', -3),
        P('monitor', [{ x: 1300, y: 230, l1: 'READING…', size: 30 }, { u: 0.62, l1: 'ZIP 04101', e: 'step' }], 'mon', -6),
        zero([{ x: 120, y: G + 40, s: 2.6, face: 0, look: [8, -4] }, ...walk(120, 560, 0.6, 2.6), { u: 0.6, face: 3, look: [8, -6] }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('belt', 0, { g: 0.3, bed: true }), sfx('shutter', 0, { u: 0.58, g: 0.7 })],
    },
    // ===== s20b: nobody looks at it. Except ZERO, who peeks in exactly when the cameras fire =====
    {
      lines: [N('Nobody opens your box.'), N('Nobody even looks at it.', { gap: 0.3 })], min: 4, hold: 0.8, bg: '#1B1F33',
      cam: cam({ z: 1.6, x: 860, y: 520 }),
      actors: [...hubSet({ fg: false, dim: 0.4 }),
        P('conveyor', { x: 960, y: 760, w: 4000, speed: 120, legs: 175 }, 'belt', -8),
        P('camtunnel', [{ x: 960, y: 728, flash: 0, lx: 80, ty: -70 }, { l: 1, t: 0.7, flash: 1, e: 'step' }, { l: 1, t: 0.9, flash: 0 }], 'tun', -4),
        P('giftbox', [{ x: 1060, y: 730, s: BOX, ...ZB }, { u: 1, x: 1060 + 120 * 4, e: 'lin' }], 'box', -3.5),
        zero([{ x: 640, y: G + 40, s: 2.6, face: 0, look: [8, -4] }, ...leanIn({ l: 1, t: 0.1 }, 640, { dx: 60, face: 0, look: [8, -6] }), { l: 1, t: 0.7, face: 3, squash: 0.9, e: 'step' }, { l: 1, t: 0.85, x: 600, pose: 'back', squash: 1, face: 11 }, { l: 1, t: 1.6, face: 1, pose: 'neutral', look: [0, 1] }]),
        P('rect', [{ x: 960, y: 540, w: 1920, h: 1080, fill: '#E6F4FF', op: 0, ui: true }, { l: 1, t: 0.7, op: 0.7, e: 'step' }, { l: 1, t: 1.0, op: 0 }], 'flashw', 49), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('belt', 0, { g: 0.3, bed: true }), sfx('shutter', 0.7, { l: 1, g: 0.9 })],
    },
    // ===== s20c: the system reads the ZIP, picks the plane, and the box is off. ZERO runs after it =====
    {
      lines: [N('The system reads the address, picks the right plane, and starts moving the box toward it.')], min: 5.4, bg: '#1B1F33',
      cam: cam({ z: 1.0, x: 1300, y: 520 }, { t: 2.6, z: 1.0, x: 1300, y: 520 }, { end: 0, z: 1.0, x: 2100, y: 540, e: 'io' }),
      actors: [...hubSet({ fg: false, dim: 0.4, clockX: 2500 }),
        P('conveyor', { x: 1500, y: 760, w: 4000, speed: 160, legs: 175 }, 'belt', -8),
        P('camtunnel', { x: 960, y: 728, flash: 0 }, 'tun', -4),
        P('monitor', [{ x: 1520, y: 250, l1: 'ZIP 04101', size: 30, ok: 0 }, { t: 0.9, l2: 'PLANE → PWM', e: 'step' }, { t: 1.6, ok: 0 }, { t: 1.9, ok: 1, e: 'back' }], 'mon', -6),
        P('giftbox', [{ x: 1540, y: 730, s: BOX, ...ZB }, { t: 2.4, x: 1600 }, { u: 1, x: 2600, e: 'in' }], 'box', -5),
        zero([{ x: 1150, y: G + 40, s: 2.6, face: 1, look: [8, -8] }, { t: 2.0, face: 3, look: [8, 0] }, { t: 2.6, pose: 'run', face: 8 }, { u: 1, x: 2350, pose: 'run', e: 'in' }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('belt', 0, { g: 0.3, bed: true }), sfx('ping', 1.9, { g: 0.5 }), sfx('whoosh', 2.7, { g: 0.4 })],
    },
    // ===== s21a: crane up the maze. PIX flies through with the length =====
    {
      lines: [N('There are more than a hundred and fifty miles of conveyor belts in this building.')], min: 5.2, bg: '#1B1F33',
      cam: cam({ z: 1.0, x: 960, y: 760 }, { end: 0.4, z: 0.9, x: 960, y: 60, e: 'io' }),
      actors: [P('hubint', { x: 960, y: G, dim: 0.35 }, 'hub', -30), P('beltmaze', { x: 960, y: G }, 'maze', -10),
        pix([{ x: -200, y: 300, s: 1.1, face: 4 }, { u: 1, x: 2200, y: -100, e: 'io' }]),
        P('holo', [{ x: 960, y: 120, w: 620, h: 120, txt: '150+ MILES OF BELTS', size: 38, on: 0, ui: true }, { u: 0.45, on: 0 }, { u: 0.55, on: 1, e: 'out' }], 'hm', 46), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.5, bed: true }), sfx('pix-ting', 0, { u: 0.5, g: 0.4 })],
    },
    // ===== s21b: ZERO decides to follow his box: a run, a leap to the belt above =====
    {
      lines: [N('ZERO decides to follow his box.', { at: 0.3 })], min: 3.4, bg: '#1B1F33',
      cam: cam({ z: 1.0, x: 800, y: 520 }, { end: 0, z: 1.0, x: 1400, y: 480, e: 'io' }),
      actors: [P('hubint', { x: 960, y: G, dim: 0.35 }, 'hub', -30), P('beltmaze', { x: 960, y: G, op: 0.7 }, 'maze', -12),
        P('conveyor', { x: 700, y: 820, w: 1600, speed: 160, legs: 115 }, 'bA', -6), P('conveyor', { x: 1700, y: 560, w: 1800, speed: 160, legs: 375 }, 'bB', -7),
        P('giftbox', [{ x: 1500, y: 528, s: BOX, ...ZB }, { u: 1, x: 2000, e: 'lin' }], 'box', -6),
        zero([{ x: 200, y: 788, s: 2.4, pose: 'run', face: 8, look: [8, -4] }, { t: 1.4, x: 980, pose: 'run', e: 'lin' }, { t: 1.6, squash: 0.85, y: 794 }, { t: 2.0, x: 1250, y: 400, squash: 1.1, pose: 'celebrate', e: 'out' }, { t: 2.3, x: 1380, y: 528, squash: 0.9, pose: 'neutral', e: 'in' }, { t: 2.4, squash: 1, pose: 'run' }, { u: 1, x: 1700, e: 'lin' }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.45, bed: true }), sfx('whoosh', 1.7, { g: 0.5 }), sfx('thud', 2.3, { g: 0.5 })],
    },
    // ===== s22: a cart of parcels crosses in front; when it's gone, so is the box =====
    {
      lines: [N('ZERO does not follow his box.', { at: 1.6 })], min: 3.8, hold: 0.8, bg: '#1B1F33',
      cam: cam({ z: 1.0, x: 1400, y: 480 }),
      actors: [P('hubint', { x: 960, y: G, dim: 0.35 }, 'hub', -30), P('beltmaze', { x: 960, y: G, op: 0.7 }, 'maze', -12),
        P('conveyor', { x: 1700, y: 560, w: 1800, speed: 160, legs: 375 }, 'bB', -7),
        P('giftbox', [{ x: 1640, y: 528, s: BOX, ...ZB }, { t: 1.0, x: 1800, e: 'lin' }, { t: 1.05, o: 0, e: 'step' }], 'box', -6),
        P('boxwall', [{ x: 400, y: 1060, rows: 6, cols: 4, s: 1.0 }, { t: 0.2, x: 400 }, { t: 1.4, x: 2600, e: 'io' }], 'cart', 8),
        zero([{ x: 1500, y: 528, s: 2.4, pose: 'run', face: 8 }, { t: 0.5, x: 1560, pose: 'neutral', face: 0, e: 'out' }, { t: 1.5, face: 4, look: [8, 0] }, { t: 1.9, look: [-8, 0], headR: -6 }, { t: 2.4, look: [8, 0], headR: 6 }, { t: 2.9, look: [0, 1], headR: 0, face: 7 }], { z: 3 }), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.45, bed: true }), sfx('roll', 0.2, { g: 0.4 })],
    },
    // ===== s23: a wall of identical boxes. ZERO raises his sign =====
    {
      lines: [], min: 2.8, bg: '#1B1F33',
      cam: cam({ z: 1.0, x: 960, y: 540 }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#1B1F33' }, 'bg', -30), P('boxwall', { x: 960, y: 1000, rows: 10, cols: 15 }, 'wall', -10),
        P('pool', { x: 960, y: 640, rx: 700, ry: 600, kind: 'warm', op: 0.6 }, 'pl', -5),
        P('cardsign', [{ x: 960, y: 1300, s: 0.8, tilt: -3 }, { t: 0.4, y: 1300 }, { t: 1.3, y: 790, e: 'io' }], 'sign', 7),
        zero([{ x: 960, y: 1040, s: 2.6, face: 1, look: [0, 1], hl: [70, 168], hr: [130, 168] }, { t: 0.4, hl: [70, 168], hr: [130, 168] }, { t: 1.3, hl: [57, 112], hr: [143, 112], e: 'io' }]), vig(0.75)],
      sfx: [sfx('zero-boop', 1.4, { g: 0.5 })],
    },
    // ===== s24a: SYSTEM VIEW of the hub. The yellow dot never stops =====
    {
      lines: [N('But the system never loses it.')], min: 2.8, bg: '#06070F',
      cam: cam({ z: 1.0, x: 960, y: 540 }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#081326' }, 'bg', -20), sysOn({ t: -1 }),
        P('hubmap', [{ x: 960, y: 580, s: 1.0, prog: 0.05, zprog: 0 }, { u: 1, prog: 0.22, zprog: 0.02, e: 'lin' }], 'hm', 0),
        ui(pix([{ x: 1760, y: 230, s: 1.2, face: 3 }]))],
      sfx: [sfx('whoosh', 0, { g: 0.4 }), sfx('scan', 0.3, { g: 0.4 })],
    },
    // ===== s24b: every scan updates it, while ZERO's own dot wanders behind =====
    {
      lines: [N('Every scan updates where it is,'), N('even when ZERO has no idea.', { gap: 0.2 })], min: 4.4, bg: '#06070F',
      cam: cam({ z: 1.0, x: 960, y: 540 }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#081326' }, 'bg', -20), sysOn({ t: -1 }),
        P('hubmap', [{ x: 960, y: 580, s: 1.0, prog: 0.22, zprog: 0.02 }, { u: 1, prog: 0.62, zprog: 0.18, e: 'lin' }], 'hm', 0),
        P('text', [{ x: 960 - 420, y: 580 + 220, txt: '?', size: 90, color: '#FFFFFF', o: 0 }, { l: 1, o: 1, e: 'step' }], 'q', 2),
        ui(pix([{ x: 1760, y: 230, s: 1.2, face: 1 }]))],
      sfx: [sfx('scan', 0.9, { g: 0.35 }), sfx('scan', 2.2, { g: 0.35 }), sfx('scan', 3.4, { g: 0.35 })],
    },
    // ===== s24c: from one plane to the next, well under an hour =====
    {
      lines: [N("From the moment a box comes off one plane to the moment it's loaded onto the next,"), N('the whole trip through this building takes well under an hour.', { gap: 0.2 })], min: 9, bg: '#06070F',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.05, x: 960, y: 520, e: 'lin' }),
      actors: [P('rect', { x: 960, y: 540, w: 3000, h: 2000, fill: '#081326' }, 'bg', -20), sysOn({ t: -1 }),
        P('hubmap', [{ x: 960, y: 520, s: 1.0, prog: 0.62, zprog: 0.18 }, { l: 1, prog: 1, zprog: 0.86, e: 'lin' }], 'hm', 0),
        P('icon', [{ x: 960 - 850, y: 520 + 300, k: 'plane', s: 1.0, color: '#7CC2FF' }], 'pin', 3),
        P('icon', [{ x: 960 + 850, y: 520 + 80, k: 'plane', s: 1.0, color: '#7CC2FF' }, { l: 1, color: '#FFC93C', e: 'step' }], 'pout', 3),
        P('holo', [{ x: 960, y: 960, w: 760, h: 120, icon: null, txt: 'PLANE IN → PLANE OUT: UNDER 1 HOUR', size: 30, on: 0, ui: true }, { l: 1, t: 1.2, on: 0 }, { l: 1, t: 1.6, on: 1, e: 'out' }], 'hh', 46),
        ui(pix([{ x: 1760, y: 230, s: 1.2, face: 3 }, { l: 1, t: 1.6, face: 4 }]))],
      sfx: [...[1.0, 2.6, 4.2].map(t => sfx('scan', t, { g: 0.3 })), sfx('ping', 1.6, { l: 1, g: 0.4 })],
    },
    // ===== s24d: back on the floor: there it is. ZERO hugs his box =====
    {
      lines: [], min: 2.2, bg: '#1B1F33',
      cam: cam({ z: 1.5, x: 1150, y: 560 }),
      actors: [P('hubint', { x: 960, y: G, dim: 0.35 }, 'hub', -30), P('beltmaze', { x: 960, y: G, op: 0.6 }, 'maze', -12),
        P('conveyor', { x: 1000, y: 760, w: 3000, speed: 60, legs: 175 }, 'b', -7),
        P('giftbox', [{ x: 1200, y: 728, s: BOX, ...ZB }, { u: 1, x: 1290, e: 'lin' }], 'box', -6),
        zero([{ x: 950, y: 728, s: 2.4, face: 3, look: [8, 0], pose: 'run' }, { t: 0.4, x: 1070, pose: 'neutral', face: 10, e: 'out' }, { t: 0.6, hl: [150, 150], hr: [160, 136], lean: 10 }, { u: 1, x: 1160, e: 'lin' }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.4, bed: true }), sfx('zero-boop', 0.5, { g: 0.4 })],
    },
    // ===== s25a: it isn't only machines: the floor is full of people on the night shift =====
    {
      lines: [N("And it isn't only machines.", { at: 0.3 })], min: 2.6, bg: '#1B1F33',
      cam: cam({ z: 0.9, x: 960, y: 540 }, { end: 0, z: 0.95, x: 960, y: 540, e: 'lin' }),
      actors: [...hubSet({ fg: false }),
        P('conveyor', { x: 960, y: 760, w: 3200, speed: 120, legs: 175 }, 'b', -8), ...flow('fp', 728, -400, 9, 380, 120, 3, i => ({ v: i, s: 0.9 }), -7),
        ...[[200, 1, 'reach', '#3E4A66', '#9C6B50', 0], [620, 1, 'reach', '#2E3A55', '#D2A07E', 1], [1080, 1, 'reach', '#4C3E5E', '#7A5440', 2], [1500, 1, 'reach', '#2E4A3E', '#B9876A', 3]].map(([x, , pose, sh, sk, i]) => P('person', { x, y: 820, s: 2.0, pose, vest: VEST, shirt: sh, skin: sk, seed: i + 6, look: 0.3 }, 'pw' + i, -9)),
        P('person', [{ x: -200, y: 1000, s: 2.4, pose: 'walk', vest: VEST, shirt: '#3E4A66', skin: '#8E6450', seed: 9, cap: '#2B3A67' }, { u: 1, x: 900, e: 'lin' }], 'walker', 4),
        zero([{ x: 1500, y: 1020, s: 2.6, face: 0, look: [-8, -4], flip: true }, { t: 1.2, face: 3 }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.5, bed: true })],
    },
    // ===== s25b: twenty thousand, and the night is when they're needed =====
    {
      lines: [N('Around twenty thousand people work for UPS in Louisville,'), N('and the night is when this place needs them most.', { gap: 0.2 })], min: 7, bg: '#1B1F33',
      cam: cam({ z: 0.9, x: 960, y: 540 }, { l: 1, z: 0.9 }, { l: 1, t: 0.6, z: 1.3, x: 1560, y: 440, e: 'io' }),
      actors: [...hubSet({ fg: false }),
        P('conveyor', { x: 960, y: 760, w: 3200, speed: 120, legs: 175 }, 'b', -8), ...flow('fp', 728, -400, 14, 380, 120, 7, i => ({ v: i, s: 0.9 }), -7),
        ...[[200, '#3E4A66', '#9C6B50', 0], [620, '#2E3A55', '#D2A07E', 1], [1080, '#4C3E5E', '#7A5440', 2], [1500, '#2E4A3E', '#B9876A', 3]].map(([x, sh, sk, i]) => P('person', { x, y: 820, s: 2.0, pose: 'reach', vest: VEST, shirt: sh, skin: sk, seed: i + 6, look: 0.3 }, 'pw' + i, -9)),
        pix([{ x: 1300, y: 360, s: 1.2, face: 4 }]),
        P('holo', [{ x: 860, y: 300, w: 440, h: 240, icon: 'people', txt: '≈ 20,000 PEOPLE', size: 36, on: 0 }, { t: 0.4, on: 1, e: 'out' }], 'hp', 9),
        zero([{ x: 1500, y: 1020, s: 2.6, face: 3, look: [-8, -6], flip: true }, { l: 1, t: 0.6, look: [4, -8], headR: -10, flip: true, face: 11 }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.5, bed: true }), sfx('pix-ting', 0.4, { g: 0.4 }), sfx('tick', 0.8, { l: 1, g: 0.4 }), sfx('tick', 1.8, { l: 1, g: 0.4 })],
    },
    // ===== s25c: the break room. A worker on the bench, a backpack, an open book. ZERO sits down next to her =====
    {
      lines: [N('Some of them are students.', { at: 0.6 })], min: 3.6, bg: '#3A3348',
      cam: cam({ z: 1.0, x: 960, y: 540 }, { end: 0, z: 1.15, x: 900, y: 560, e: 'io' }),
      actors: [P('breakroom', { x: 960, y: G, h: 2, m: 13 }, 'room', -20),
        P('bench', { x: 820, y: G, s: 1.3 }, 'bench', -6),
        P('person', { x: 640, y: 894, s: 2.3, pose: 'sit', shirt: '#4C3E5E', skin: '#7A5440', hair: '#1E1820', seed: 4, look: 0.2, hl: [40, -110], hr: [56, -112], hold: { type: 'book', s: 0.45 } }, 'student', -4),
        P('rect', { x: 470, y: G - 60, w: 120, h: 130, rx: 30, fill: '#2B3A67' }, 'pack', -5),
        zero([{ x: 1700, y: G, s: 2.6, face: 0, look: [-8, -2], flip: true }, ...walk(1700, 1010, 0.3, 1.8).map(k => ({ ...k, flip: true })), { t: 2.3, y: 904, ...SEAT, flip: true, face: 0, look: [-6, 2], e: 'out' }]), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true })],
    },
    // ===== s25d: ZERO peeks at the book. On the board, the flyer =====
    {
      lines: [N('Through a program called Metropolitan College, people working the overnight Next Day Air shift can have their tuition paid.')], min: 7.4, bg: '#3A3348',
      cam: cam({ z: 1.4, x: 820, y: 640 }, { u: 0.45, z: 1.4, x: 820, y: 640 }, { u: 0.6, z: 1.7, x: 520, y: 330, e: 'io' }, { end: 0.6, z: 1.7, x: 520, y: 330 }, { end: 0, z: 1.3, x: 760, y: 560, e: 'io' }),
      actors: [P('breakroom', { x: 960, y: G, h: 2, m: 14 }, 'room', -20),
        P('pool', [{ x: 400, y: 280, rx: 160, ry: 180, kind: 'warm', op: 0 }, { u: 0.55, op: 0 }, { u: 0.62, op: 0.9 }], 'flyer', -15),
        P('bench', { x: 820, y: G, s: 1.3 }, 'bench', -6),
        P('person', { x: 640, y: 894, s: 2.3, pose: 'sit', shirt: '#4C3E5E', skin: '#7A5440', hair: '#1E1820', seed: 4, look: 0.2, hl: [40, -110], hr: [56, -112], hold: { type: 'book', s: 0.45 } }, 'student', -4),
        P('rect', { x: 470, y: G - 60, w: 120, h: 130, rx: 30, fill: '#2B3A67' }, 'pack', -5),
        P('holo', [{ x: 860, y: 330, w: 300, h: 200, icon: 'cap', txt: 'TUITION PAID', size: 26, on: 0 }, { u: 0.62, on: 0 }, { u: 0.68, on: 1, e: 'out' }], 'hc', 9),
        zero([{ x: 1010, y: 904, s: 2.6, ...SEAT, flip: true, face: 0, look: [-6, 2] }, ...leanIn({ t: 0.8 }, 1010, { dx: -60, face: 0, look: [-8, 4] }).map(k => ({ ...k, ...SEAT, flip: true })), { u: 0.5, face: 6 }, { u: 0.6, look: [-6, -8], headR: -8 }]), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('pix-ting', 0, { u: 0.68, g: 0.3 })],
    },
    // ===== s25e: by day, a student; by night, the vest goes on and she's back on the floor =====
    {
      lines: [N('They study by day and sort the country by night.')], min: 4, hold: 0.8, bg: '#3A3348',
      cam: cam({ z: 1.1, x: 860, y: 560 }),
      actors: [P('breakroom', { x: 960, y: G, h: 2, m: 15 }, 'room', -20), P('bench', { x: 820, y: G, s: 1.3 }, 'bench', -6),
        P('person', [{ x: 640, y: 894, s: 2.3, pose: 'sit', shirt: '#4C3E5E', skin: '#7A5440', hair: '#1E1820', seed: 4, look: 0.2, hl: [40, -110], hr: [56, -112], hold: { type: 'book', s: 0.45 } }, { t: 0.8, hold: null, hl: null, hr: null, e: 'step' }, { t: 1.2, y: G, pose: 'stand', vest: VEST, e: 'step' }, { t: 1.6, pose: 'walk', flip: true }, { u: 1, x: -150, e: 'lin' }], 'student', -4),
        zero([{ x: 1010, y: 904, s: 2.6, ...SEAT, flip: true, face: 6, look: [-6, 2] }, { t: 1.2, look: [-8, -2], face: 0 }, { t: 2.4, look: [-8, 0], face: 2 }]), vig(0.6)],
      sfx: [sfx('hum', 0, { g: 0.25, bed: true }), sfx('chime', 0.5, { g: 0.45 })],
    },
    // ===== s26a: everything in reverse. Chutes into containers, one city each =====
    {
      lines: [N('Then everything happens in reverse.', { at: 0.3 })], min: 3, bg: '#1B1F33',
      cam: cam({ z: 0.85, x: 960, y: 520 }, { end: 0, z: 0.9, x: 1000, y: 540, e: 'lin' }),
      actors: [...hubSet({ fg: false }),
        ...[[-100, 'BOS', 1], [640, 'PWM', 2], [1380, 'ATL', 3], [2120, 'MIA', 4]].map(([x, txt, seed]) => [
          P('chute', { x: x - 560, y: 120, dx: 410, dy: 320, txt, seed, tc: txt === 'PWM' ? '#FFC93C' : '#7CC2FF' }, 'ch' + seed, -5.5),
          P('dolly', { x, y: G, s: 1.5 }, 'dl' + seed, -7),
          P('uld', { x, y: G - 60, s: 1.5, fill: 0.3 + seed * 0.12, seed, door: 1, dest: txt, dc: txt === 'PWM' ? '#FFC93C' : '#7CC2FF' }, 'ul' + seed, -6)]).flat(),
        zero([{ x: 960, y: G + 60, s: 2.6, face: 0, look: [-6, -8], flip: true }]), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.5, bed: true }), sfx('slide', 0.8, { g: 0.3 })],
    },
    // ===== s26b: the yellow box goes down the PWM chute. ZERO goes down after it =====
    {
      lines: [N('Boxes slide down chutes into containers for one city.')], min: 4.2, bg: '#1B1F33',
      cam: cam({ z: 1.2, x: 440, y: 420 }, { end: 0, z: 1.25, x: 500, y: 460, e: 'io' }),
      actors: [...hubSet({ fg: false }),
        P('chute', { x: 80, y: 120, dx: 410, dy: 320, txt: 'PWM', seed: 2, tc: '#FFC93C' }, 'ch2', -5.5),
        P('dolly', { x: 640, y: G, s: 1.5 }, 'dl2', -7),
        P('uld', [{ x: 640, y: G - 60, s: 1.5, fill: 0.55, seed: 2, door: 1, dest: 'PWM', dc: '#FFC93C' }, { t: 1.4, yellow: true, yx: -40, e: 'step' }], 'ul2', -6),
        P('giftbox', [{ x: 120, y: 140, s: BOX * 0.7, ...ZB, tilt: 38 }, { t: 0.2, x: 120, y: 140 }, { t: 1.3, x: 480, y: 420, e: 'in' }, { t: 1.4, o: 0, e: 'step' }], 'box', -5.2),
        zero([{ x: 270, y: 280, s: 1.7, ...SEAT, face: 2, look: [8, 4], o: 0 }, { t: 1.6, o: 1, e: 'step' }, { t: 1.6, x: 270, y: 280 }, { t: 2.6, x: 470, y: 430, face: 3, e: 'in' }, { t: 2.75, o: 0, e: 'step' }], { z: -5.1 }), vig(0.7)],
      sfx: [sfx('hub', 0, { g: 0.45, bed: true }), sfx('slide', 0.3, { g: 0.6 }), sfx('thud', 1.35, { g: 0.4 }), sfx('slide', 1.7, { g: 0.6 }), sfx('thud', 2.7, { g: 0.5 })],
    },
    // ===== s26c: weighed, so the plane stays balanced; locked into place. ZERO peeks out of the curtain =====
    {
      lines: [N('Each container is weighed,'), N('so the plane stays balanced,', { gap: 0.15 }), N('and locked into place.', { gap: 0.2 })], min: 6, hold: 1.6, bg: '#1B1F33',
      cam: cam({ z: 1.2, x: 860, y: 560 }, { end: 1.0, z: 1.25, x: 860, y: 560, e: 'lin' }, { end: 0, black: 1, e: 'in' }),
      actors: [...hubSet({ fg: false }),
        P('floorscale', [{ x: 760, y: G, s: 1.6, a: 0 }, { l: 0, t: 0.2, a: 0 }, { l: 0, t: 0.6, a: 150, since: 0, e: 'out' }], 'scale', -8),
        P('dolly', [{ x: 760, y: G - 38, s: 1.95, lock: 0 }, { l: 2, t: 0.4, lock: 0 }, { l: 2, t: 0.5, lock: 0.5, e: 'step' }, { l: 2, t: 0.8, lock: 1, e: 'step' }], 'dl2', -7),
        P('uld', [{ x: 760, y: G - 118, s: 1.9, fill: 0.75, seed: 2, door: 1, dest: 'PWM', dc: '#FFC93C', yellow: true, yx: -40 }, { l: 0, t: 0.6, y: G - 112, e: 'out' }, { l: 0, t: 0.8, y: G - 118 }], 'ul2', -6),
        zero([{ x: 600, y: 760, s: 1.6, face: 2, o: 0, look: [-2, 2] }, { l: 1, o: 1, e: 'step' }, { l: 1, t: 0.6, face: 2, look: [8, -2] }, { l: 2, t: 0.5, squash: 0.9, face: 3 }, { l: 2, t: 0.8, squash: 1, face: 2 }], { z: -5.5 }),
        P('rect', { x: 760, y: G - 118 - 285, w: 600, h: 570, fill: '#9FC4D8', op: 0.35 }, 'curtainfg', -5), vig(0.75)],
      sfx: [sfx('hub', 0, { g: 0.45, bed: true }), sfx('clunk', 0.6, { l: 0, g: 0.4 }), sfx('clunk', 0.5, { l: 2, g: 0.7 }), sfx('clunk', 0.8, { l: 2, g: 0.8 }), sfx('clunk', 1.1, { l: 2, g: 0.9 })],
    },
  ],
};
