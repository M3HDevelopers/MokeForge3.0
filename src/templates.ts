import type {
  Asset, Background, BgStyle, BgType, DecoCat, DecoLayer, DecoPrim, DecoSet, DecoShape,
  DeviceKind, DeviceLayer, FitMode, LightType, Material, Mood, PatternKind, PosPreset,
  Project, ScreenRect, ShadowPreset, TextBlock,
} from './types';

export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const pick = <T,>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];
export const rngRange = (r: () => number, min: number, max: number) => min + r() * (max - min);
export function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }
export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const c = (v: number) => clamp(Math.round(v + amt), 0, 255);
  const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
export function hexToRgb(hex: string): [number, number, number] { const n = parseInt(hex.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgba(hex: string, a: number): string { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
export function luminance(hex: string): number { const [r, g, b] = hexToRgb(hex); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }
export const isDark = (hex: string) => luminance(hex) < 0.5;
export const textOn = (hex: string) => (luminance(hex) > 0.56 ? '#15171c' : '#f2f0ea');

export const DEVICE_META: Record<DeviceKind, { label: string; aspect: number; defFw: number; colors: { name: string; hex: string }[] }> = {
  laptop: { label: 'Laptop', aspect: 1.56, defFw: 0.62, colors: [{ name: 'Graphite', hex: '#33363c' }, { name: 'Silver', hex: '#d8dade' }, { name: 'Midnight', hex: '#20242c' }, { name: 'Sand', hex: '#c9b8a3' }] },
  phone: { label: 'Phone', aspect: 0.485, defFw: 0.16, colors: [{ name: 'Black', hex: '#1a1c20' }, { name: 'Silver', hex: '#dfe1e6' }, { name: 'Gold', hex: '#e3cfa8' }, { name: 'Deep Blue', hex: '#2e4057' }, { name: 'Forest', hex: '#2f4a3e' }] },
  tablet: { label: 'Tablet', aspect: 1.38, defFw: 0.30, colors: [{ name: 'Space Gray', hex: '#33363c' }, { name: 'Silver', hex: '#dcdfe4' }, { name: 'Slate Blue', hex: '#3d4a5c' }] },
  browser: { label: 'Browser', aspect: 1.47, defFw: 0.55, colors: [{ name: 'Dark', hex: '#22262d' }, { name: 'Light', hex: '#eef0f3' }] },
  monitor: { label: 'Monitor', aspect: 1.68, defFw: 0.56, colors: [{ name: 'Charcoal', hex: '#23262b' }, { name: 'Silver', hex: '#d3d6db' }] },
};
export const MATERIALS: { id: Material; label: string }[] = [{ id: 'matte', label: 'Matte' }, { id: 'glossy', label: 'Glossy' }, { id: 'glass', label: 'Glass' }, { id: 'metallic', label: 'Metallic' }];

export function deviceGeometry(kind: DeviceKind, w: number, h: number, radiusMul = 1): ScreenRect {
  switch (kind) {
    case 'laptop': { const baseH = h * 0.062, lidH = h - baseH; const x = w * 0.062, y = lidH * 0.06; return { x, y, w: w - x * 2, h: lidH - y - lidH * 0.055, r: Math.min(w, h) * 0.014 * radiusMul }; }
    case 'phone': { const pad = w * 0.052; return { x: pad, y: pad * 1.12, w: w - pad * 2, h: h - pad * 2.24, r: w * 0.088 * radiusMul }; }
    case 'tablet': { const pad = Math.min(w, h) * 0.048; return { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2, r: Math.min(w, h) * 0.035 * radiusMul }; }
    case 'browser': { const chrome = Math.max(h * 0.09, 26); return { x: 0, y: chrome, w, h: h - chrome, r: Math.min(w, h) * 0.02 * radiusMul }; }
    case 'monitor': { const standH = h * 0.15, screenH = h - standH, pad = screenH * 0.028; return { x: pad, y: pad, w: w - pad * 2, h: screenH - pad * 2, r: Math.min(w, h) * 0.01 * radiusMul }; }
  }
}
export function computeFit(s: ScreenRect, iw: number, ih: number, fit: FitMode, zoom: number, panX: number, panY: number) {
  let dw: number, dh: number;
  if (fit === 'stretch') { dw = s.w; dh = s.h; }
  else if (fit === 'cover') { const scale = Math.max(s.w / iw, s.h / ih); dw = iw * scale; dh = ih * scale; }
  else { const scale = Math.min(s.w / iw, s.h / ih); dw = iw * scale; dh = ih * scale; }
  dw *= zoom; dh *= zoom;
  const cx = s.x + s.w / 2 + panX * s.w * 0.5, cy = s.y + s.h / 2 + panY * s.h * 0.5;
  return { dx: cx - dw / 2, dy: cy - dh / 2, dw, dh };
}
export function suggestFitMode(screenAspect: number, imageAspect: number): FitMode {
  const ratio = screenAspect / imageAspect;
  if (ratio > 0.9 && ratio < 1.1) return 'contain';
  return 'cover';
}

export const CANVAS_PRESETS = [{ label: 'Showcase', w: 1600, h: 1000 }, { label: 'MacBook', w: 1440, h: 900 }, { label: 'Portfolio', w: 1200, h: 800 }, { label: 'LinkedIn', w: 1200, h: 628 }, { label: 'Square', w: 1080, h: 1080 }, { label: 'IG Portrait', w: 1080, h: 1350 }, { label: 'Story', w: 1080, h: 1920 }, { label: 'Full HD', w: 1920, h: 1080 }];
export const PROJECT_TYPES = ['Website', 'Web App', 'Mobile App', 'Dashboard', 'Landing Page', 'E-commerce', 'Portfolio', 'Desktop App', 'Custom'];
export const EXPORT_PRESETS = [{ id: 'original', label: 'Original', w: 0, h: 0 }, { id: 'portfolio', label: 'Portfolio', w: 1200, h: 800 }, { id: 'linkedin', label: 'LinkedIn Post', w: 1200, h: 627 }, { id: 'square', label: 'IG Square', w: 1080, h: 1080 }, { id: 'hd', label: 'Full HD', w: 1920, h: 1080 }, { id: '4k', label: '4K', w: 3840, h: 2160 }];

export const bg = (type: BgType, c1: string, c2: string, c3: string, angle: number, pattern: PatternKind, po: number, style: BgStyle = 'plain'): Background => ({ type, c1, c2, c3, angle, pattern, patternOpacity: po, style, seed: 7, light: { type: 'none', intensity: 0.5 }, meshPoints: 4 });

export const BG_PRESETS = [
  { id: 'studio-dark', name: 'Studio Dark', cat: 'Studio', sw: ['#17191e', '#17191e'] as [string, string], bg: bg('solid', '#17191e', '#17191e', '#17191e', 0, 'grid', 0.05, 'studio') },
  { id: 'paper', name: 'Paper', cat: 'Minimal', sw: ['#f4f4f1', '#f4f4f1'] as [string, string], bg: bg('solid', '#f4f4f1', '#f4f4f1', '#f4f4f1', 0, 'none', 0) },
  { id: 'ember', name: 'Ember Fade', cat: 'Gradient', sw: ['#1c1d22', '#3a241b'] as [string, string], bg: bg('linear', '#1c1d22', '#3a241b', '#3a241b', 135, 'none', 0) },
  { id: 'spotlight', name: 'Spotlight', cat: 'Studio', sw: ['#262a32', '#101216'] as [string, string], bg: bg('radial', '#262a32', '#101216', '#101216', 0, 'none', 0, 'studio') },
  { id: 'deepmesh', name: 'Deep Mesh', cat: 'Mesh', sw: ['#0e1116', '#1d3a38'] as [string, string], bg: bg('mesh', '#0e1116', '#ff6b3d', '#45d6c8', 0, 'none', 0) },
];

export const PATTERNS: { id: PatternKind; label: string }[] = [{ id: 'none', label: 'None' }, { id: 'dots', label: 'Dots' }, { id: 'grid', label: 'Grid' }, { id: 'rings', label: 'Rings' }, { id: 'diag', label: 'Diag' }, { id: 'noise', label: 'Noise' }];
export const LIGHTING: { id: LightType; label: string }[] = [{ id: 'none', label: 'None' }, { id: 'top', label: 'Top' }, { id: 'bottom', label: 'Riser' }, { id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }, { id: 'center', label: 'Center' }, { id: 'ambient', label: 'Ambient' }];
export const TECH_BADGES = ['React', 'TypeScript', 'Node.js', 'Next.js', 'Vue', 'Angular', 'MongoDB', 'Tailwind', 'Express', 'Python', 'Firebase', 'Supabase', 'Flutter', 'React Native', 'Figma', 'GraphQL', 'Docker', 'AWS', 'Vite', 'Prisma'];

export interface TypoPreset { id: string; label: string; scale: number; pos: PosPreset; badges: boolean; spacingNote: string }
export const TYPO_PRESETS: TypoPreset[] = [
  { id: 'saas', label: 'Modern SaaS', scale: 1.0, pos: 'bottom-left', badges: true, spacingNote: 'balanced' },
  { id: 'editorial', label: 'Editorial', scale: 1.35, pos: 'top-left', badges: false, spacingNote: 'wide' },
  { id: 'minimal', label: 'Minimal', scale: 0.8, pos: 'bottom-center', badges: false, spacingNote: 'airy' },
  { id: 'bold', label: 'Bold', scale: 1.5, pos: 'center-left', badges: true, spacingNote: 'tight' },
  { id: 'technical', label: 'Technical', scale: 0.9, pos: 'bottom-left', badges: true, spacingNote: 'mono' },
];

export const SHADOWS: { id: ShadowPreset; label: string; dx: number; dy: number; blur: number; alpha: number }[] = [
  { id: 'none', label: 'None', dx: 0, dy: 0, blur: 0, alpha: 0 },
  { id: 'soft', label: 'Soft', dx: 0, dy: 22, blur: 55, alpha: 0.38 },
  { id: 'hard', label: 'Hard', dx: 14, dy: 18, blur: 3, alpha: 0.42 },
  { id: 'float', label: 'Float', dx: 0, dy: 44, blur: 90, alpha: 0.48 },
  { id: 'glow', label: 'Glow', dx: 0, dy: 12, blur: 70, alpha: 0.5 },
  { id: 'product', label: 'Product', dx: 0, dy: 30, blur: 42, alpha: 0.42 },
  { id: 'cinematic', label: 'Cinematic', dx: 0, dy: 60, blur: 120, alpha: 0.55 },
  { id: 'long', label: 'Long', dx: 26, dy: 40, blur: 26, alpha: 0.3 },
];
export const FIT_MODES: { id: FitMode; label: string }[] = [{ id: 'cover', label: 'Cover' }, { id: 'contain', label: 'Contain' }, { id: 'stretch', label: 'Stretch' }];
export const POSITIONS: PosPreset[] = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'];
export const DECO_SETS: { id: DecoSet; label: string }[] = [{ id: 'none', label: 'None' }, { id: 'orbs', label: 'Orbs' }, { id: 'rings', label: 'Rings' }, { id: 'grid', label: 'Dot field' }, { id: 'sparkles', label: 'Sparkles' }, { id: 'waves', label: 'Waves' }];

export interface DecoPresetDef { id: string; label: string; cat: DecoCat; prim: DecoPrim; role: string }
const dp = (id: string, label: string, cat: DecoCat, prim: DecoPrim, role: string = 'abstract'): DecoPresetDef => ({ id, label, cat, prim, role });
export const DECO_PRESETS: DecoPresetDef[] = [
  dp('circle', 'Circle', 'geometric', 'disc', 'depth'), dp('ring', 'Ring', 'geometric', 'ring', 'frame'),
  dp('square', 'Square', 'geometric', 'square', 'structure'), dp('triangle', 'Triangle', 'geometric', 'triangle', 'structure'),
  dp('line', 'Line', 'geometric', 'line', 'motion'), dp('arc', 'Arc', 'geometric', 'arc', 'frame'),
  dp('dot', 'Dot field', 'geometric', 'dotgrid', 'texture'), dp('plus', 'Plus', 'geometric', 'plus', 'tech'),
  dp('orbit', 'Orbit', 'geometric', 'orbit', 'frame'),
  dp('glass-orb', 'Glass Orb', 'depth', 'glassorb', 'depth'), dp('chrome-ring', 'Chrome Ring', 'luxury', 'chromering', 'luxury'),
  dp('soft-sphere', 'Soft 3D Sphere', 'depth', 'softsphere', 'depth'), dp('rounded-cube', 'Rounded Cube', 'depth', 'roundedcube', 'depth'),
  dp('floating-pill', 'Floating Pill', 'motion', 'floatingpill', 'motion'), dp('torus-3d', '3D Torus', 'depth', 'torus3d', 'depth'),
  dp('pyramid', 'Pyramid', 'structure', 'pyramid', 'structure'), dp('hex-frame', 'Hex Frame', 'tech', 'hexframe', 'tech'),
  dp('spiral', 'Spiral', 'motion', 'spiral', 'motion'), dp('halo', 'Halo Ring', 'frame', 'halo', 'frame'),
  dp('fluid-ribbon', 'Fluid Ribbon', 'motion', 'fluidribbon', 'motion'), dp('liquid-blob', 'Liquid Blob', 'soft', 'liquidblob', 'soft'),
  dp('layered-wave', 'Layered Wave', 'motion', 'layeredwave', 'motion'), dp('shadow-blob', 'Shadow Blob', 'soft', 'shadowblob', 'soft'),
];

export interface Palette { c1: string; c2: string; c3: string; type: BgType; angle: number; pattern: PatternKind; po: number; a1: string; a2: string; style: BgStyle; light: LightType; dark: boolean }
export const PALETTES: Palette[] = [
  { c1: '#17191e', c2: '#3a241b', c3: '#3a241b', type: 'linear', angle: 135, pattern: 'grid', po: 0.05, a1: '#ff6b3d', a2: '#ffd166', style: 'studio', light: 'bottom', dark: true },
  { c1: '#0f1c22', c2: '#1d4149', c3: '#1d4149', type: 'linear', angle: 120, pattern: 'none', po: 0, a1: '#45d6c8', a2: '#f2f0ea', style: 'abstract', light: 'top', dark: true },
  { c1: '#0e1116', c2: '#ff6b3d', c3: '#45d6c8', type: 'mesh', angle: 0, pattern: 'noise', po: 0.05, a1: '#ff6b3d', a2: '#45d6c8', style: 'plain', light: 'ambient', dark: true },
  { c1: '#f4f4f1', c2: '#f4f4f1', c3: '#f4f4f1', type: 'solid', angle: 0, pattern: 'grid', po: 0.09, a1: '#1d1f24', a2: '#ff6b3d', style: 'studio', light: 'top', dark: false },
  { c1: '#262a32', c2: '#101216', c3: '#101216', type: 'radial', angle: 0, pattern: 'none', po: 0, a1: '#ffd166', a2: '#f2f0ea', style: 'studio', light: 'center', dark: true },
  { c1: '#fdf3e7', c2: '#f3d9c6', c3: '#f3d9c6', type: 'linear', angle: 145, pattern: 'none', po: 0, a1: '#b4552d', a2: '#2e4057', style: 'abstract', light: 'top', dark: false },
];
export function paletteToBg(pal: Palette, seed: number): Background { return { type: pal.type, c1: pal.c1, c2: pal.c2, c3: pal.c3, angle: pal.angle, pattern: pal.pattern, patternOpacity: pal.po, style: pal.style, seed, light: { type: pal.light, intensity: 0.55 }, meshPoints: 4 }; }

export function makeDevice(kind: DeviceKind, cw: number, ch: number, assetId: string | null, index: number): DeviceLayer {
  const meta = DEVICE_META[kind]; const w = cw * meta.defFw;
  return { id: uid(), kind, name: `${meta.label} ${index + 1}`, x: (cw - w) / 2, y: (ch - w / meta.aspect) / 2, w, tilt: 0, color: meta.colors[0].hex, assetId, fit: 'cover', zoom: 1, panX: 0, panY: 0, shadow: 'soft', url: 'yourapp.com', visible: true, brightness: 1, reflection: 0, radiusMul: 1, opacity: 1, material: 'matte', z: index };
}
export function makeDefaultProject(name: string, type: string, cw: number, ch: number): Project {
  const preset = BG_PRESETS[0];
  return { id: uid(), name, type, createdAt: Date.now(), updatedAt: Date.now(), canvas: { w: cw, h: ch }, assets: [], devices: [makeDevice('laptop', cw, ch, null, 0)], background: { ...preset.bg, seed: Math.floor(Math.random() * 1e9) }, text: { enabled: true, title: '', subtitle: '', showBadges: false, badges: ['React', 'TypeScript', 'Tailwind'], position: 'bottom-left', scale: 1, color: '#f2f0ea', autoColor: true, fontFamily: 'space-grotesk' }, logo: { enabled: false, assetId: null, position: 'top-right', size: 0.08, opacity: 0.9 }, decoration: { set: 'orbs', seed: Math.floor(Math.random() * 1e9), intensity: 1, density: 0.5, layers: [] }, accents: { a1: '#ff6b3d', a2: '#45d6c8' }, thumbnail: null, exportCount: 0, decos: [], mood: 'auto', icons: [], textboxes: [] };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrate(p: any): Project { const base = makeDefaultProject('x', 'Custom', 1600, 1000); return { ...base, ...p, canvas: { ...base.canvas, ...(p.canvas || {}) }, background: { ...base.background, ...(p.background || {}) }, decoration: { ...base.decoration, ...(p.decoration || {}), layers: (p.decoration?.layers) || [] }, devices: (p.devices || []).map((d: any) => ({ brightness: 1, reflection: 0, radiusMul: 1, opacity: 1, material: 'matte' as Material, z: 0, ...d })), decos: p.decos || [], mood: p.mood || 'auto', accents: p.accents || { a1: '#ff6b3d', a2: '#45d6c8' }, text: { ...base.text, ...(p.text || {}) }, logo: { ...base.logo, ...(p.logo || {}) }, icons: p.icons || [], textboxes: p.textboxes || [] }; }

export const LAYOUTS = [{ id: 'single', label: 'Hero device', desc: 'One device', devices: [{ kind: 'laptop' as DeviceKind, fx: 0.19, fy: 0.17, fw: 0.62 }] }, { id: 'duo', label: 'Laptop + Phone', desc: 'Web + mobile', devices: [{ kind: 'laptop' as DeviceKind, fx: 0.11, fy: 0.16, fw: 0.6 }, { kind: 'phone' as DeviceKind, fx: 0.66, fy: 0.3, fw: 0.135 }] }, { id: 'responsive', label: 'Responsive trio', desc: 'Desktop · tablet · phone', devices: [{ kind: 'laptop' as DeviceKind, fx: 0.07, fy: 0.13, fw: 0.55 }, { kind: 'tablet' as DeviceKind, fx: 0.58, fy: 0.34, fw: 0.25 }, { kind: 'phone' as DeviceKind, fx: 0.79, fy: 0.4, fw: 0.115 }] }];
export function applyLayoutPositions(p: Project, layoutId: string): Project { const layout = LAYOUTS.find(l => l.id === layoutId); if (!layout) return p; const { w: cw, h: ch } = p.canvas; const assets = p.assets; const devices: DeviceLayer[] = layout.devices.map((d, i) => { const meta = DEVICE_META[d.kind]; const w = cw * d.fw; const prev = p.devices[i]; return { ...makeDevice(d.kind, cw, ch, assets[i]?.id ?? null, i), x: cw * d.fx, y: ch * d.fy, w, assetId: assets[i]?.id ?? prev?.assetId ?? null, color: prev?.color ?? meta.colors[0].hex }; }); return { ...p, devices, updatedAt: Date.now() }; }
export function randomizeProject(p: Project): Project { const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0; const rnd = mulberry32(seed); const pal = pick(rnd, PALETTES); return { ...p, updatedAt: Date.now(), background: paletteToBg(pal, Math.floor(rnd() * 1e9)), accents: { a1: pal.a1, a2: pal.a2 } }; }
export type { Asset, DecoLayer, Mood };
