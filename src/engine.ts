import type { Background, BgStyle, DecoDepth, DecoLayer, DeviceKind, DeviceLayer, Mood, PosPreset, Project, ShadowPreset, SurpriseMode } from './types';
import { clamp, DEVICE_META, isDark, makeDevice, mulberry32, PALETTES, paletteToBg, pick, rngRange, textOn, uid, DECO_PRESETS } from './templates';
import { IMAGE_ASSETS } from './imageAssets';
import type { ThemeVariation } from './utils/colorExtraction';
import { ICONS } from './iconLibrary';

export interface Slot { k: DeviceKind; x: number; y: number; w: number; t?: number }
export interface Composition { id: string; label: string; cat: 'single' | 'duo' | 'trio' | 'quad' | 'multi' | 'special'; tags: string[]; slots: Slot[]; }
const C = (id: string, label: string, cat: Composition['cat'], tags: string[], slots: Slot[]): Composition => ({ id, label, cat, tags, slots });

export const COMPOSITIONS: Composition[] = [
  C('hero', 'Center hero', 'single', ['minimal', 'premium'], [{ k: 'laptop', x: 0.2, y: 0.18, w: 0.6 }]),
  C('hero-big', 'Large hero', 'single', ['premium', 'bold'], [{ k: 'laptop', x: 0.13, y: 0.14, w: 0.74 }]),
  C('hero-phone', 'Phone hero', 'single', ['mobile', 'minimal'], [{ k: 'phone', x: 0.41, y: 0.1, w: 0.18 }]),
  C('duo-lap-phone', 'Laptop + Phone', 'duo', ['responsive', 'saas'], [{ k: 'laptop', x: 0.09, y: 0.18, w: 0.58 }, { k: 'phone', x: 0.65, y: 0.3, w: 0.14 }]),
  C('trio-responsive', 'Responsive trio', 'trio', ['responsive', 'portfolio'], [{ k: 'laptop', x: 0.06, y: 0.14, w: 0.55 }, { k: 'tablet', x: 0.57, y: 0.33, w: 0.26 }, { k: 'phone', x: 0.8, y: 0.38, w: 0.12 }]),
];

export function deviceBox(d: DeviceLayer) { const h = d.w / DEVICE_META[d.kind].aspect; const pad = d.w * 0.04; return { x: d.x - pad, y: d.y - pad, w: d.w + pad * 2, h: h + pad * 2 }; }
function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

export interface DesignScore { total: number; balance: number; spacing: number; contrast: number; visibility: number }
export function scoreDesign(p: Project): DesignScore {
  const { w: cw, h: ch } = p.canvas;
  const boxes = p.devices.filter(d => d.visible).map(deviceBox);
  let bx = 0, by = 0, area = 0;
  for (const b of boxes) { const a = b.w * b.h; bx += (b.x + b.w / 2) * a; by += (b.y + b.h / 2) * a; area += a; }
  const cx = area ? bx / area : cw / 2, cy = area ? by / area : ch / 2;
  const off = Math.hypot(cx - cw / 2, cy - ch / 2) / Math.hypot(cw / 2, ch / 2);
  const balance = Math.round(clamp(1 - off * 1.4, 0, 1) * 100);
  let spacing = 100;
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { if (overlaps(boxes[i], boxes[j])) spacing -= 30; }
  spacing = Math.round(clamp(spacing, 0, 100));
  const tc = p.text.autoColor ? textOn(p.background.c1) : p.text.color;
  const contrast = Math.round(Math.abs((parseInt(tc.slice(1), 16) & 0xff) - (parseInt(p.background.c1.slice(1), 16) & 0xff)) / 255 * 60 + 40);
  const covered = boxes.reduce((s, b) => s + Math.min(b.w * b.h, cw * ch), 0) / (cw * ch);
  const vis = 1 - Math.abs(covered - 0.42) * 1.8;
  const visibility = Math.round(clamp(vis, 0, 1) * 100);
  const total = Math.round(balance * 0.3 + spacing * 0.3 + contrast * 0.15 + visibility * 0.25);
  return { total, balance, spacing, contrast, visibility };
}

export interface GenOpts { mode: SurpriseMode; mood: Mood; seed: number; locks: { devices: boolean; background: boolean; decoration: boolean; text: boolean; logo: boolean }; bgType?: 'auto' | 'vector' | 'image' | 'hybrid'; includeIcons?: boolean; iconCount?: number; includeDeco?: boolean; decoIntensity?: number; includeText?: boolean; }

export function generateDesign(base: Project, opts: GenOpts): Project {
  const rnd = mulberry32(opts.seed >>> 0);
  let p: Project = JSON.parse(JSON.stringify({ ...base, thumbnail: null }));
  const { w: cw, h: ch } = p.canvas;
  const doBg = !opts.locks.background && (opts.mode === 'all' || opts.mode === 'background' || opts.mode === 'colors');
  const doDevices = !opts.locks.devices && (opts.mode === 'all' || opts.mode === 'layout' || opts.mode === 'devices');
  const doDeco = !opts.locks.decoration && (opts.mode === 'all' || opts.mode === 'decor');
  if (doBg) { const palIdx = Math.floor(rnd() * PALETTES.length); const pal = PALETTES[palIdx]; p = { ...p, background: { ...paletteToBg(pal, Math.floor(rnd() * 1e9)), angle: pal.angle + Math.floor(rngRange(rnd, -18, 18)) }, accents: { a1: pal.a1, a2: pal.a2 } }; }
  if (doDevices) { const usable = p.assets.length; const count = clamp(usable || 1, 1, 3); const pool = COMPOSITIONS.filter(c => c.slots.length === count); const comp = pool.length ? pool[Math.floor(rnd() * pool.length)] : COMPOSITIONS[0]; const assets = p.assets; p = { ...p, devices: comp.slots.map((s, i) => { const d = makeDevice(s.k, cw, ch, assets[i % Math.max(1, assets.length)]?.id ?? null, i); return { ...d, x: s.x * cw, y: s.y * ch, w: s.w * cw, tilt: (s.t ?? 0) + Math.floor(rngRange(rnd, -4, 4)), shadow: 'soft' as ShadowPreset, assetId: assets.length ? assets[i % assets.length].id : null, z: i }; }) }; }
  if (doDeco) { const count = Math.round(clamp((opts.decoIntensity ?? 50) / 100 * 6, 0, 8)); const decos: DecoLayer[] = []; for (let i = 0; i < count; i++) { const preset = DECO_PRESETS[Math.floor(rnd() * DECO_PRESETS.length)]; decos.push({ id: uid(), preset: preset.id, x: 0.1 + rnd() * 0.8, y: 0.1 + rnd() * 0.8, scale: 0.05 + rnd() * 0.08, rotation: Math.floor(rngRange(rnd, -24, 24)), opacity: 0.4 + rnd() * 0.4, blur: 0, depth: (rnd() > 0.5 ? 'front' : 'back') as DecoDepth, hue: null, seed: Math.floor(rnd() * 1e9) }); } p = { ...p, decos }; }
  return { ...p, mood: opts.mood, updatedAt: Date.now() };
}

export function generateVariations(base: Project, n: number, mood: Mood, _bgType?: string, _themeVariations?: ThemeVariation[]): Project[] {
  const out: { p: Project; s: number }[] = [];
  for (let i = 0; i < n; i++) { const seed = (Date.now() ^ (i + 1) * 2654435761 ^ Math.floor(Math.random() * 1e9)) >>> 0; const p = generateDesign(base, { mode: 'all', mood, seed, locks: { devices: false, background: false, decoration: false, text: false, logo: false } }); out.push({ p, s: scoreDesign(p).total }); }
  return out.sort((a, b) => b.s - a.s).map(x => x.p);
}

export function responsiveShowcase(p: Project, variant: number): Project {
  const { w: cw, h: ch } = p.canvas;
  const comps = COMPOSITIONS.filter(c => c.id === 'trio-responsive');
  const comp = comps[variant % comps.length] || comps[0];
  const kinds: DeviceKind[] = ['laptop', 'tablet', 'phone'];
  return { ...p, devices: comp.slots.slice(0, 3).map((s, i) => { const d = makeDevice(kinds[i] ?? s.k, cw, ch, p.assets[i]?.id ?? null, i); return { ...d, x: s.x * cw, y: s.y * ch, w: s.w * cw, tilt: s.t ?? 0, z: i }; }), updatedAt: Date.now() };
}
export const _internals = { isDark };
