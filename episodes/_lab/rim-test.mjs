// Test: ZERO's light rim on dark sets (black, dark blue, night room, space) and on a light set (should look unchanged).
import { G, zero, prop, walk, lookCam, shrug, PALETTE as C } from '../../src/kit.mjs';
import { room, desk, space } from '../../src/sets.mjs';

const act = (x = 960) => zero([{ x, pose: 'neutral', face: 0 }, ...walk(x - 200, x + 120, 0.3, 1.1), ...shrug(1.9, { to: 'neutral' }), ...lookCam(3.0, { face: 1 })]);
const card = txt => prop('text', { x: 960, y: 120, txt, size: 54, color: '#FFC93C' }, { ui: true, z: 50 });

export default {
  id: 'rim-test', format: 'long', music: 'curious', musicGain: 0.1, title: 'Rim test',
  beats: [
    { min: 4.2, actors: [prop('rect', { x: 960, y: 540, w: 4000, h: 3000, fill: '#111111' }, { z: -12 }), act(), card('FONDO NEGRO')] },
    { min: 4.2, actors: [prop('rect', { x: 960, y: 540, w: 4000, h: 3000, fill: '#1B2140' }, { z: -12 }), act(), card('AZUL OSCURO')] },
    { min: 4.2, cam: [{ z: 1.1, x: 960, y: 580 }], actors: [...room({ night: true }), ...desk({ x: 1300 }), act(860), card('HABITACIÓN DE NOCHE')] },
    { min: 4.2, actors: [...space(), zero([{ x: 960, y: 760, s: 2.4, r: -8, pose: 'shrug', face: 3 }, { u: 1, r: 4, y: 730, e: 'io' }], { z: 5 }), card('ESPACIO')] },
    { min: 4.2, actors: [...room(), ...desk({ x: 1300 }), act(860), prop('text', { x: 960, y: 120, txt: 'FONDO CLARO (SIN CAMBIOS)', size: 54, color: '#111111' }, { ui: true, z: 50 })] },
  ],
};
