// Shorts cut from a long video: the same beats, reframed for a 1080x1920 frame instead of re-animated.
// The world of a long video is 1920x1080, so the camera zooms in by K (the vertical frame then shows a 607x1080 slice,
// full height) and follows o.fx/o.fy (the focus: ZERO, the box, the label). The camera never shows past the world's edges.
// ui props (screen space: notifications, system views, labels) are scaled by o.ui and recentred in the vertical frame.
export const K = 1920 / 1080;
const LW = 1920, LH = 1080, VW = 1080, VH = 1920;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mapKeys = (keys, f) => keys.map(k => f({ ...k }));

export function vbeat(b, o = {}) {
  const zm = o.zm ?? K, U = o.ui ?? 0.9;
  const camKeys = b.cam?.length ? b.cam : [{ z: 1, x: LW / 2, y: LH / 2 }];
  let lastZ = camKeys[0].z ?? 1;
  const cam = mapKeys(camKeys, k => {
    const z = (k.z ?? lastZ) * zm; lastZ = k.z ?? lastZ;
    const hw = VW / 2 / z, hh = VH / 2 / z;
    if (k.z != null) k.z = z;
    if (k.x != null || o.fx != null) k.x = hw * 2 >= LW ? LW / 2 : clamp(o.fx ?? k.x, hw, LW - hw);
    if (k.y != null || o.fy != null) k.y = hh * 2 >= LH ? LH / 2 : clamp(o.fy ?? k.y, hh, LH - hh);
    return k;
  });
  const actors = b.actors.map(a => {
    if (!a.k?.[0]?.ui) return a;
    return { ...a, k: mapKeys(a.k, k => {
      if (k.x != null) k.x = VW / 2 + (k.x - LW / 2) * U;
      if (k.y != null) k.y = VH / 2 + (k.y - LH / 2) * U + (o.uiDy ?? 0);
      if (k.s != null) k.s *= U;
      return k;
    }) };
  });
  // transitions are drawn in screen space too
  const tr = t => t && ({ ...t, ...(t.x != null ? { x: VW / 2 + (t.x - (b.cam?.[0]?.x ?? LW / 2)) * zm } : {}), ...(t.y != null ? { y: VH / 2 + (t.y - (b.cam?.[0]?.y ?? LH / 2)) * zm } : {}) });
  const out = { ...b, cam, actors, tin: tr(b.tin), tout: tr(b.tout) };
  if (o.lines) out.lines = o.lines;
  if (o.min != null) out.min = o.min;
  if (o.noTin) delete out.tin;
  if (o.noTout) delete out.tout;
  return out;
}
