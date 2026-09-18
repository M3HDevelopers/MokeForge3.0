import type { Background, BgStyle, ImageBgState, LightType } from './types';
import { isDark, luminance, mulberry32, rgba, shade } from './templates';

export async function renderBackground(ctx: CanvasRenderingContext2D, b: Background, w: number, h: number, accents: { a1: string; a2: string }): Promise<void> {
  const kind = b.kind || 'procedural';
  if (kind === 'image' || kind === 'hybrid') {
    const img = b.image;
    if (img && (img.imageId || img.customSrc)) { await paintImageBackground(ctx, img, w, h); }
    else { paintBase(ctx, b, w, h); }
    if (img) paintImageOverlays(ctx, img, w, h);
    paintLighting(ctx, b, w, h);
    return;
  }
  paintBase(ctx, b, w, h);
  const style = b.style || 'plain';
  if (style !== 'plain') paintStyle(ctx, style, b, w, h, accents);
  paintPattern(ctx, b, w, h);
  paintLighting(ctx, b, w, h);
}

function paintBase(ctx: CanvasRenderingContext2D, b: Background, w: number, h: number) {
  if (b.type === 'solid') { ctx.fillStyle = b.c1; ctx.fillRect(0, 0, w, h); }
  else if (b.type === 'linear') { const a = ((b.angle - 90) * Math.PI) / 180; const cx = w / 2, cy = h / 2, len = (Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a))) / 2; const g = ctx.createLinearGradient(cx - Math.cos(a) * len, cy - Math.sin(a) * len, cx + Math.cos(a) * len, cy + Math.sin(a) * len); g.addColorStop(0, b.c1); g.addColorStop(1, b.c2); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  else if (b.type === 'radial') { const g = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, Math.max(w, h) * 0.72); g.addColorStop(0, b.c1); g.addColorStop(1, b.c2); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  else { ctx.fillStyle = b.c1; ctx.fillRect(0, 0, w, h); const blob = (x: number, y: number, r: number, color: string) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(color, 0.7)); g.addColorStop(1, rgba(color, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }; const rnd = mulberry32(b.seed || 7); const n = Math.max(2, Math.min(6, b.meshPoints || 4)); for (let i = 0; i < n; i++) { const col = i % 2 === 0 ? b.c2 : b.c3; blob(rnd() * w, rnd() * h, Math.max(w, h) * (0.3 + rnd() * 0.25), col); } }
}

function paintStyle(ctx: CanvasRenderingContext2D, style: BgStyle, b: Background, w: number, h: number, accents: { a1: string; a2: string }) {
  const rnd = mulberry32((b.seed || 7) ^ style.length * 7919);
  const dark = isDark(b.c1); const ink = dark ? '#ffffff' : '#15171c'; const min = Math.min(w, h);
  switch (style) {
    case 'studio': { const horizon = h * 0.66; const floor = ctx.createLinearGradient(0, horizon, 0, h); floor.addColorStop(0, rgba(ink, 0)); floor.addColorStop(1, rgba(ink, dark ? 0.05 : 0.07)); ctx.fillStyle = floor; ctx.fillRect(0, horizon, w, h - horizon); const g = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, Math.max(w, h) * 0.5); g.addColorStop(0, rgba(ink, dark ? 0.07 : 0.55)); g.addColorStop(1, rgba(ink, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); vignette(ctx, w, h, dark ? 0.4 : 0.12); break; }
    case 'abstract': { ctx.save(); const sphere = (x: number, y: number, r: number, c1: string, c2: string, alpha: number) => { const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, rgba(c1, alpha)); g.addColorStop(1, rgba(c2, alpha * 0.85)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }; sphere(w * 0.85, h * 0.22, min * 0.16, shade(accents.a1, 40), shade(accents.a1, -60), 0.85); sphere(w * 0.1, h * 0.82, min * 0.12, shade(accents.a2, 30), shade(accents.a2, -50), 0.7); ctx.strokeStyle = rgba(accents.a2, 0.3); ctx.lineWidth = Math.max(3, min * 0.012); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-min * 0.1, h * 0.55); ctx.bezierCurveTo(w * 0.3, h * 0.35, w * 0.6, h * 0.75, w * 1.1, h * 0.42); ctx.stroke(); ctx.restore(); break; }
    case 'grid': { ctx.save(); const col = rgba(ink, dark ? 0.07 : 0.09); const step = Math.max(40, min / 14); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); } for (let y = 0; y <= h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); } ctx.stroke(); ctx.restore(); break; }
    case 'tech': { ctx.save(); const col = rgba(ink, dark ? 0.1 : 0.12); const n = 14; const pts: [number, number][] = []; for (let i = 0; i < n; i++) pts.push([rnd() * w, rnd() * h]); ctx.strokeStyle = rgba(ink, dark ? 0.05 : 0.07); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (d < min * 0.34) { ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); } } ctx.stroke(); for (const [x, y] of pts) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); break; }
    case 'glass': { ctx.save(); const glass = (x: number, y: number, r: number) => { ctx.fillStyle = rgba('#ffffff', dark ? 0.05 : 0.35); ctx.strokeStyle = rgba('#ffffff', dark ? 0.12 : 0.6); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }; glass(w * 0.82, h * 0.24, min * 0.17); glass(w * 0.14, h * 0.76, min * 0.12); ctx.restore(); break; }
    default: break;
  }
}

function paintPattern(ctx: CanvasRenderingContext2D, b: Background, w: number, h: number) {
  const { pattern, patternOpacity, c1 } = b;
  if (pattern === 'none' || patternOpacity <= 0) return;
  const col = luminance(c1) > 0.5 ? '#191b21' : '#f2f0ea';
  ctx.save(); ctx.globalAlpha = patternOpacity;
  if (pattern === 'dots') { ctx.fillStyle = col; for (let y = 13; y < h; y += 26) for (let x = 13; x < w; x += 26) { ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill(); } }
  else if (pattern === 'grid') { ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= w; x += 48) { ctx.moveTo(x, 0); ctx.lineTo(x, h); } for (let y = 0; y <= h; y += 48) { ctx.moveTo(0, y); ctx.lineTo(w, y); } ctx.stroke(); }
  else if (pattern === 'noise') { let a = 1234567 >>> 0; const r = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; ctx.fillStyle = col; const count = Math.floor((w * h) / 550); for (let i = 0; i < count; i++) { ctx.globalAlpha = patternOpacity * r() * 0.7; ctx.fillRect(r() * w, r() * h, 1.1, 1.1); } }
  ctx.restore();
}

const imgCache = new Map<string, HTMLImageElement>();
function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imgCache.get(src);
  if (hit && hit.complete && hit.naturalWidth) return Promise.resolve(hit);
  return new Promise((resolve, reject) => { const img = new Image(); if (/^https?:/.test(src)) img.crossOrigin = 'anonymous'; img.onload = () => { imgCache.set(src, img); resolve(img); }; img.onerror = () => reject(new Error('image load failed')); img.src = src; });
}

async function paintImageBackground(ctx: CanvasRenderingContext2D, img: ImageBgState, w: number, h: number) {
  const src = img.customSrc || '';
  if (!src) return;
  const image = await loadImage(src);
  ctx.save();
  const sc = Math.max(w / image.naturalWidth, h / image.naturalHeight) * img.scale;
  const dw = image.naturalWidth * sc, dh = image.naturalHeight * sc;
  ctx.globalAlpha = img.opacity;
  ctx.drawImage(image, (w - dw) / 2, (h - dh) / 2, dw, dh);
  ctx.restore();
}

function paintImageOverlays(ctx: CanvasRenderingContext2D, img: ImageBgState, w: number, h: number) {
  if (img.tint && img.tintOpacity > 0) { ctx.save(); ctx.globalAlpha = img.tintOpacity; ctx.fillStyle = img.tint; ctx.fillRect(0, 0, w, h); ctx.restore(); }
}

function paintLighting(ctx: CanvasRenderingContext2D, b: Background, w: number, h: number) {
  const lt = b.light?.type || 'none';
  if (lt === 'none') return;
  const inten = b.light?.intensity ?? 0.5;
  const radial = (x: number, y: number, r: number, a: number) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba('#ffffff', a)); g.addColorStop(1, rgba('#ffffff', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); };
  const linear = (x0: number, y0: number, x1: number, y1: number, a: number) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba('#ffffff', a)); g.addColorStop(1, rgba('#ffffff', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); };
  if (lt === 'top') linear(0, 0, 0, h * 0.6, 0.16 * inten);
  else if (lt === 'bottom') linear(0, h, 0, h * 0.4, 0.14 * inten);
  else if (lt === 'center') radial(w / 2, h * 0.42, Math.max(w, h) * 0.5, 0.2 * inten);
}

function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, a: number) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}

export async function bgThumb(b: Background, accents: { a1: string; a2: string }, size = 132): Promise<string> {
  const c = document.createElement('canvas'); c.width = size; c.height = Math.round(size * 0.66);
  const ctx = c.getContext('2d')!;
  await renderBackground(ctx, b, c.width, c.height, accents);
  return c.toDataURL('image/jpeg', 0.82);
}
export const lightLabel = (t: LightType) => t === 'none' ? 'None' : t === 'top' ? 'Top' : t === 'bottom' ? 'Riser' : t === 'left' ? 'Left' : t === 'right' ? 'Right' : t === 'center' ? 'Center' : 'Ambient';
