import type { DecoDepth, DecoLayer } from './types';
import { DECO_PRESETS, mulberry32, rgba, shade } from './templates';

export function drawDecos(ctx: CanvasRenderingContext2D, decos: DecoLayer[], w: number, h: number, accents: { a1: string; a2: string }, depth: DecoDepth): void {
  const min = Math.min(w, h);
  for (const d of decos || []) {
    if (d.depth !== depth) continue;
    const preset = DECO_PRESETS.find(p => p.id === d.preset);
    if (!preset) continue;
    const color = d.hue || (Math.floor(d.seed) % 2 === 0 ? accents.a1 : accents.a2);
    const x = d.x * w, y = d.y * h;
    const r = d.scale * min;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((d.rotation * Math.PI) / 180);
    ctx.globalAlpha = d.opacity;
    if (d.blur > 0) ctx.filter = `blur(${d.blur}px)`;
    drawPrim(ctx, preset.prim, r, color);
    ctx.restore();
  }
}

function drawPrim(ctx: CanvasRenderingContext2D, prim: string, r: number, color: string) {
  switch (prim) {
    case 'disc': ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); break;
    case 'ring': ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, r * 0.12); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); break;
    case 'square': ctx.fillStyle = color; ctx.fillRect(-r, -r, r * 2, r * 2); break;
    case 'triangle': ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r, r); ctx.lineTo(-r, r); ctx.closePath(); ctx.fill(); break;
    case 'line': ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, r * 0.14); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke(); break;
    case 'arc': ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, r * 0.12); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); break;
    case 'plus': ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, r * 0.34); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke(); break;
    case 'dotgrid': { const step = r * 0.45; ctx.fillStyle = color; for (let gy = 0; gy < 5; gy++) for (let gx = 0; gx < 5; gx++) { ctx.beginPath(); ctx.arc(-r + gx * step, -r + gy * step, Math.max(1.4, r * 0.07), 0, Math.PI * 2); ctx.fill(); } break; }
    case 'sparkle': ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * 0.16, -r * 0.16, r, 0); ctx.quadraticCurveTo(r * 0.16, r * 0.16, 0, r); ctx.quadraticCurveTo(-r * 0.16, r * 0.16, -r, 0); ctx.quadraticCurveTo(-r * 0.16, -r * 0.16, 0, -r); ctx.fill(); break;
    case 'glassorb': { const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r); g.addColorStop(0, shade(color, 60)); g.addColorStop(1, shade(color, -60)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); break; }
    case 'chromering': ctx.strokeStyle = color; ctx.lineWidth = r * 0.3; ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2); ctx.stroke(); break;
    case 'softsphere': { const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r); g.addColorStop(0, shade(color, 40)); g.addColorStop(1, shade(color, -40)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); break; }
    case 'floatingpill': ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-r, -r * 0.32); ctx.arc(r * 0.4, -r * 0.32, r * 0.32, Math.PI, 0); ctx.lineTo(r * 0.72, r * 0.32); ctx.arc(r * 0.4, r * 0.32, r * 0.32, 0, Math.PI); ctx.closePath(); ctx.fill(); break;
    case 'pyramid': ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r, r); ctx.lineTo(-r, r); ctx.closePath(); ctx.fill(); break;
    default: ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  }
}
