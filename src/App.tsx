import { useEffect, useState, useRef } from 'react';
import { useStudio, classifyAsset } from './store';
import type { DeviceKind, Project } from './types';
import { applyLayoutPositions, CANVAS_PRESETS, DEVICE_META, PROJECT_TYPES, clamp, deviceGeometry, textOn, luminance, SHADOWS, FIT_MODES, POSITIONS, TECH_BADGES, TYPO_PRESETS, DECO_PRESETS, PATTERNS, LIGHTING, DECO_SETS, uid, makeDefaultProject as mkProject } from './templates';
import { COMPOSITIONS, scoreDesign } from './engine';
import { renderBackground } from './backgrounds';
import { drawDecos } from './decos';
import { makeThumbnail } from './renderer';
import { loadDemoAssets } from './sampleScreens';
import { ICONS } from './iconLibrary';
import { IMAGE_ASSETS } from './imageAssets';
import { LogoMark, IcPlus, IcUpload, IcLaptop, IcPhone, IcTablet, IcBrowser, IcMonitor, IcWand, IcDice, IcSave, IcExport, IcTrash, IcCopy, IcEye, IcEyeOff, IcUndo, IcRedo, IcClose, IcArrowL, IcImage, IcSpark, IcZoomIn, IcZoomOut, IcFit, IcUp, IcDown, IcFolder, IcStar, IcSpin, IcSearch, IcDevice, IcKeyboard, IcLayers, IcBg, IcType, IcGrid, IcRefresh } from './icons';

/* =================== APP =================== */
export default function App() {
  const booted = useStudio(s => s.booted);
  const view = useStudio(s => s.view);
  const project = useStudio(s => s.project);
  const boot = useStudio(s => s.boot);
  const toasts = useStudio(s => s.toasts);
  const dismissToast = useStudio(s => s.dismissToast);

  useEffect(() => { boot(); }, [boot]);
  if (!booted) return null;

  return (
    <div className="h-full bg-ink text-fg overflow-hidden">
      {view === 'editor' && project ? <Editor /> : <Dashboard />}
      <div className="fixed bottom-5 right-5 z-[60] space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="anim-toast pointer-events-auto flex items-center gap-2.5 pl-3 pr-2 py-2.5 rounded-lg border bg-panel2 shadow-xl" style={{ borderColor: 'var(--color-line)' }}>
            <span className="text-[12.5px] max-w-[300px]">{t.msg}</span>
            <button className="icon-btn !w-6 !h-6 ml-1" onClick={() => dismissToast(t.id)}><IcClose size={11} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =================== DASHBOARD =================== */
function Dashboard() {
  const projects = useStudio(s => s.projects);
  const totalExports = useStudio(s => s.totalExports);
  const openProject = useStudio(s => s.openProject);
  const deleteProject = useStudio(s => s.deleteProject);
  const duplicateProject = useStudio(s => s.duplicateProject);
  const createProject = useStudio(s => s.createProject);
  const importProject = useStudio(s => s.importProject);
  const toast = useStudio(s => s.toast);
  const [modal, setModal] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const loadDemo = async () => {
    setDemoLoading(true);
    try {
      const assets = await loadDemoAssets();
      let p = makeDefaultProject('Aurora Analytics', 'Dashboard', 1600, 1000);
      p = { ...p, assets };
      p = applyLayoutPositions(p, 'responsive');
      p = { ...p, devices: p.devices.map((d: any, i: number) => ({ ...d, assetId: assets[i === 2 ? 1 : 0]?.id ?? null })), text: { ...p.text, enabled: true, title: 'Aurora Analytics', subtitle: 'MERN stack analytics platform', showBadges: true, badges: ['React', 'Node.js', 'MongoDB', 'Tailwind'] } };
      try { p.thumbnail = await makeThumbnail(p); } catch { }
      importProject(p);
      const created = useStudio.getState().projects[0];
      openProject(created.id);
      toast('Demo project ready!');
    } catch { toast('Could not build demo', 'err'); }
    setDemoLoading(false);
  };

  return (
    <div className="h-full overflow-y-auto">
      <header className="sticky top-0 z-20 flex items-center justify-between px-8 h-14 border-b border-line2 bg-ink/90" style={{ backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-2.5">
          <LogoMark size={24} />
          <span className="text-[17px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-disp)' }}>MockForge</span>
          <span className="label-mono mt-0.5">mockup studio</span>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(true)}><IcPlus size={14} /> New project</button>
      </header>
      <main className="max-w-[1180px] mx-auto px-8 pb-20">
        <section className="pt-12 pb-10 anim-fade-up">
          <div className="label-mono mb-3" style={{ color: 'var(--color-acc)' }}>local-first · no ai runtime · canvas-true exports</div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="text-[44px] leading-[1.04] font-bold tracking-tight max-w-[620px]" style={{ fontFamily: 'var(--font-disp)' }}>
              Screenshots in.<br /><span style={{ color: 'var(--color-acc)' }}>Portfolio pieces</span> out.
            </h1>
            <div className="flex gap-2.5 pb-2">
              <button className="btn !py-2.5 !px-5" onClick={() => void loadDemo()} disabled={demoLoading}>
                {demoLoading ? <IcSpin size={15} /> : <IcArrowL size={15} className="rotate-180" />}
                {demoLoading ? 'Building…' : 'Open demo'}
              </button>
              <button className="btn btn-acc !py-2.5 !px-5" onClick={() => setModal(true)}><IcPlus size={15} /> Start fresh</button>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden border border-line2 bg-line2">
            {([['Projects', projects.length], ['Exports', totalExports], ['Screens', projects.reduce((n, p) => n + p.assets.length, 0)], ['Devices', projects.reduce((n, p) => n + p.devices.length, 0)]] as const).map(([label, n], i) => (
              <div key={label} className="bg-panel px-5 py-4" style={{ animation: `fadeUp .45s ${0.08 + i * 0.05}s cubic-bezier(.2,.7,.3,1) both` }}>
                <div className="text-[26px] font-bold leading-none" style={{ fontFamily: 'var(--font-disp)' }}>{n}</div>
                <div className="label-mono mt-1.5">{label}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[19px] font-semibold" style={{ fontFamily: 'var(--font-disp)' }}>{projects.length ? 'Your projects' : 'No projects yet'}</h2>
          </div>
          {projects.length === 0 ? (
            <div className="card border-dashed !border-line px-8 py-14 text-center anim-fade-up">
              <div className="mx-auto w-fit mb-4 text-dim"><IcFolder size={34} /></div>
              <p className="text-[14px] text-mut max-w-[420px] mx-auto">Everything lives in your browser. Start from a template or load the demo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p.id} className="card card-hover overflow-hidden cursor-pointer group" onClick={() => openProject(p.id)}>
                  <div className="relative aspect-[3/2] checker overflow-hidden">
                    {p.thumbnail ? <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-dim"><IcFolder size={26} /></div>}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(10,11,13,0.55)' }}>
                      <button className="btn !py-1.5 !px-3 text-[12px]" onClick={(e) => { e.stopPropagation(); openProject(p.id); }}>Open</button>
                      <button className="icon-btn bg-panel2 border border-line" onClick={(e) => { e.stopPropagation(); duplicateProject(p.id); }}><IcCopy size={14} /></button>
                      <button className="icon-btn bg-panel2 border border-line hover:!text-danger" onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}><IcTrash size={14} /></button>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-[13.5px] font-semibold truncate" style={{ fontFamily: 'var(--font-disp)' }}>{p.name}</div>
                    <div className="text-[10.5px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{p.type} · {p.canvas.w}×{p.canvas.h}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-[19px] font-semibold mb-1" style={{ fontFamily: 'var(--font-disp)' }}>Start from a device</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            {(Object.keys(DEVICE_META) as DeviceKind[]).map(kind => (
              <button key={kind} onClick={() => createProject('', kind === 'phone' ? 'Mobile App' : 'Website', 1600, 1000, kind)} className="card card-hover cursor-pointer p-4 flex flex-col items-center group">
                <div className="relative flex items-center justify-center w-full rounded-lg mb-3 overflow-hidden" style={{ height: 92, background: 'linear-gradient(135deg, #23262d, #191b20)' }}>
                  <span className="text-mut group-hover:text-acc transition-colors">
                    {kind === 'laptop' ? <IcLaptop size={32} /> : kind === 'phone' ? <IcPhone size={32} /> : kind === 'tablet' ? <IcTablet size={32} /> : kind === 'browser' ? <IcBrowser size={32} /> : <IcMonitor size={32} />}
                  </span>
                </div>
                <span className="text-[13px] font-semibold group-hover:text-acc transition-colors" style={{ fontFamily: 'var(--font-disp)' }}>{DEVICE_META[kind].label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
      {modal && <NewProjectModal onClose={() => setModal(false)} />}
    </div>
  );
}

function makeDefaultProject(name: string, type: string, cw: number, ch: number) {
  return mkProject(name, type, cw, ch);
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const createProject = useStudio(s => s.createProject);
  const [name, setName] = useState('');
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [preset, setPreset] = useState(CANVAS_PRESETS[0]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center anim-fade-in" style={{ background: 'rgba(8,9,11,0.78)' }} onClick={onClose}>
      <div className="anim-pop w-[560px] max-w-[94vw] rounded-xl border border-line bg-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-5 pb-4 border-b border-line2">
          <div className="text-[17px] font-semibold" style={{ fontFamily: 'var(--font-disp)' }}>New project</div>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <div className="label-mono mb-1.5">Project name</div>
            <input autoFocus className="input" placeholder="e.g. Nova Commerce" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') createProject(name, type, preset.w, preset.h); }} />
          </div>
          <div>
            <div className="label-mono mb-2">Project type</div>
            <div className="flex flex-wrap gap-1.5">{PROJECT_TYPES.map(t => (<button key={t} className={`chip ${t === type ? 'on' : ''}`} onClick={() => setType(t)}>{t}</button>))}</div>
          </div>
          <div>
            <div className="label-mono mb-2">Canvas size</div>
            <div className="grid grid-cols-4 gap-1.5">{CANVAS_PRESETS.map(cp => { const on = preset.w === cp.w && preset.h === cp.h; return (<button key={cp.label} onClick={() => setPreset(cp)} className="py-2 rounded-lg border cursor-pointer" style={{ borderColor: on ? 'var(--color-acc)' : 'var(--color-line)', background: on ? 'rgba(255,107,61,0.1)' : 'var(--color-ink)' }}><div className="text-[11px] font-medium" style={{ color: on ? 'var(--color-acc)' : 'var(--color-fg)' }}>{cp.label}</div><div className="text-[9px] mt-0.5" style={{ color: 'var(--color-dim)' }}>{cp.w}×{cp.h}</div></button>); })}</div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-line2 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-acc" onClick={() => createProject(name, type, preset.w, preset.h)}><IcPlus size={14} /> Create</button>
        </div>
      </div>
    </div>
  );
}

/* =================== EDITOR =================== */
function Editor() {
  const project = useStudio(s => s.project)!;
  const update = useStudio(s => s.update);
  const undo = useStudio(s => s.undo);
  const redo = useStudio(s => s.redo);
  const canUndo = useStudio(s => s.past.length > 0);
  const canRedo = useStudio(s => s.future.length > 0);
  const randomize = useStudio(s => s.randomize);
  const save = useStudio(s => s.save);
  const dirty = useStudio(s => s.dirty);
  const closeEditor = useStudio(s => s.closeEditor);
  const setExportOpen = useStudio(s => s.setExportOpen);
  const addFiles = useStudio(s => s.addFiles);
  const selection = useStudio(s => s.selection);
  const setSelection = useStudio(s => s.setSelection);
  const removeDevice = useStudio(s => s.removeDevice);
  const zoom = useStudio(s => s.zoom);
  const setZoom = useStudio(s => s.setZoom);
  const setGenOpen = useStudio(s => s.setGenOpen);
  const [exportOpen, setExportOpenLocal] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selection?.id && selection.kind === 'device') { e.preventDefault(); removeDevice(selection.id); }
      else if (e.key === 'Escape') { setSelection(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, save, selection, removeDevice, setSelection]);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => { const files = Array.from(e.clipboardData?.files ?? []).filter(f => f.type.startsWith('image/')); if (files.length) { e.preventDefault(); void addFiles(files); } };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [addFiles]);

  const fitZoom = () => { const availW = window.innerWidth - 264 - 292 - 120; const availH = window.innerHeight - 48 - 70; setZoom(clamp(Math.min(availW / project.canvas.w, availH / project.canvas.h), 0.1, 2)); };
  useEffect(() => { fitZoom(); }, []);

  return (
    <div className="h-full flex flex-col anim-fade-in">
      <div className="h-12 shrink-0 flex items-center gap-2 px-3 border-b border-line2 bg-panel relative z-20">
        <button className="icon-btn" onClick={closeEditor} title="Back"><IcArrowL size={16} /></button>
        <LogoMark size={19} />
        <input className="bg-transparent outline-none border border-transparent hover:border-line focus:border-acc rounded-md px-2 py-1 w-[220px]" style={{ fontFamily: 'var(--font-disp)', fontWeight: 600, fontSize: 14 }} value={project.name} onChange={(e) => update(p => ({ ...p, name: e.target.value }), false)} />
        <span className="flex items-center gap-1.5 text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: dirty ? 'var(--color-gold)' : 'var(--color-acc2)' }} />
          {dirty ? 'unsaved' : 'saved'}
        </span>
        <div className="flex-1" />
        <button className="icon-btn" disabled={!canUndo} onClick={undo}><IcUndo size={15} /></button>
        <button className="icon-btn" disabled={!canRedo} onClick={redo}><IcRedo size={15} /></button>
        <div className="w-px h-5 bg-line mx-1" />
        <button className="icon-btn" onClick={() => setZoom(zoom * 0.8)}><IcZoomOut size={15} /></button>
        <button className="icon-btn" onClick={() => setZoom(zoom * 1.2)}><IcZoomIn size={15} /></button>
        <div className="w-px h-5 bg-line mx-1" />
        <button className="btn btn-acc" onClick={() => setGenOpen(true)}><IcWand size={14} /> Design Engine</button>
        <button className="btn" onClick={randomize}><IcDice size={14} /> Surprise</button>
        <button className="btn" onClick={() => save()}><IcSave size={14} /> Save</button>
        <button className="btn" onClick={() => setExportOpen(true)}><IcExport size={14} /> Export</button>
      </div>
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <LeftPanel />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <StagePreview />
          <div className="h-9 shrink-0 border-t border-line2 bg-panel flex items-center justify-between px-3">
            <span className="text-[10.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>drag to move · ctrl+scroll to zoom · ctrl+v paste</span>
            <div className="flex items-center gap-1">
              <button className="icon-btn !w-7 !h-7" onClick={() => setZoom(zoom * 0.85)}><IcZoomOut size={13} /></button>
              <span className="text-[10.5px] w-10 text-center" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-mut)' }}>{Math.round(zoom * 100)}%</span>
              <button className="icon-btn !w-7 !h-7" onClick={() => setZoom(zoom * 1.18)}><IcZoomIn size={13} /></button>
              <button className="icon-btn !w-7 !h-7" onClick={fitZoom}><IcFit size={13} /></button>
            </div>
          </div>
        </div>
        <RightPanel />
      </div>
      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}
    </div>
  );
}

/* =================== STAGE PREVIEW =================== */
function StagePreview() {
  const p = useStudio(s => s.project)!;
  const zoom = useStudio(s => s.zoom);
  const setZoom = useStudio(s => s.setZoom);
  const setSelection = useStudio(s => s.setSelection);
  const selection = useStudio(s => s.selection);
  const update = useStudio(s => s.update);
  const checkpoint = useStudio(s => s.checkpoint);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.08 : 0.92)); };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom, setZoom]);

  const W = p.canvas.w * zoom, H = p.canvas.h * zoom;
  const sorted = [...p.devices].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

  return (
    <div ref={wrapRef} className="workspace-bg relative flex-1 overflow-auto" style={{ touchAction: 'none' }}>
      <div className="flex items-start justify-center p-6 pt-8" style={{ width: '100%', minHeight: '100%', minWidth: 'fit-content' }}>
        <div className={`relative shadow-[0_30px_90px_rgba(0,0,0,0.55)] ${selection?.kind === 'background' ? 'sel-ring' : ''}`} style={{ width: W, height: H }} onClick={() => setSelection({ kind: 'background' })}>
          <div className="absolute top-0 left-0 origin-top-left overflow-hidden" style={{ width: p.canvas.w, height: p.canvas.h, transform: `scale(${zoom})` }}>
            <BgCanvas p={p} />
            {sorted.map(d => <DeviceNode key={d.id} d={d} />)}
            <TextOverlay p={p} />
          </div>
          <div className="absolute -bottom-7 left-0 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-dim)' }}>
            <span>{p.canvas.w} × {p.canvas.h}</span>
            <span>·</span>
            <span>{p.devices.length} device{p.devices.length === 1 ? '' : 's'}</span>
            <span>·</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BgCanvas({ p }: { p: Project }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    renderBackground(ctx, p.background, p.canvas.w, p.canvas.h, p.accents).then(() => {
      // Draw decorations after background
    });
  }, [p.background, p.decos, p.accents, p.canvas.w, p.canvas.h]);
  return <canvas ref={ref} width={p.canvas.w} height={p.canvas.h} className="absolute inset-0" style={{ width: p.canvas.w, height: p.canvas.h, pointerEvents: 'none' }} />;
}

function DeviceNode({ d }: { d: import('./types').DeviceLayer }) {
  const p = useStudio(s => s.project)!;
  const selected = useStudio(s => s.selection?.kind === 'device' && s.selection.id === d.id);
  const setSelection = useStudio(s => s.setSelection);
  const update = useStudio(s => s.update);
  const checkpoint = useStudio(s => s.checkpoint);
  const zoom = useStudio(s => s.zoom);
  const assignAsset = useStudio(s => s.assignAsset);
  const asset = p.assets.find(a => a.id === d.assetId);
  const h = d.w / DEVICE_META[d.kind].aspect;
  const g = deviceGeometry(d.kind, d.w, h, d.radiusMul);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelection({ kind: 'device', id: d.id });
    checkpoint();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: d.x, oy: d.y };
  };
  const onMove = (e: React.PointerEvent) => {
    const drag = dragRef.current; if (!drag) return;
    const dx = (e.clientX - drag.sx) / zoom, dy = (e.clientY - drag.sy) / zoom;
    update(p => ({ ...p, devices: p.devices.map(x => x.id === d.id ? { ...x, x: drag.ox + dx, y: drag.oy + dy } : x) }), false);
  };
  const onUp = () => { dragRef.current = null; };

  return (
    <div className="absolute cursor-move" style={{ left: d.x, top: d.y, width: d.w, height: h, transform: `rotate(${d.tilt}deg)`, display: d.visible ? undefined : 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      {/* Device body */}
      <svg width={d.w} height={h} viewBox={`0 0 ${d.w} ${h}`} className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
        <defs><clipPath id={`clip-${d.id}`}><rect x={g.x} y={g.y} width={g.w} height={g.h} rx={g.r} /></clipPath></defs>
        {d.kind === 'laptop' && (() => { const baseH = h * 0.062, lidH = h - baseH; return (<><rect x={0} y={0} width={d.w} height={lidH} rx={d.w * 0.02} fill={d.color} /><rect x={g.x} y={g.y} width={g.w} height={g.h} rx={g.r} fill="#0b0c0f" /><rect x={-d.w * 0.045} y={lidH} width={d.w * 1.09} height={baseH * 0.55} rx={baseH * 0.3} fill={d.color} opacity={0.8} /></>); })()}
        {d.kind === 'phone' && (<><rect x={0} y={0} width={d.w} height={h} rx={d.w * 0.13} fill={d.color} /><rect x={g.x} y={g.y} width={g.w} height={g.h} rx={g.r} fill="#0b0c0f" /></>)}
        {d.kind === 'tablet' && (<><rect x={0} y={0} width={d.w} height={h} rx={d.w * 0.035} fill={d.color} /><rect x={g.x} y={g.y} width={g.w} height={g.h} rx={g.r} fill="#0b0c0f" /></>)}
        {d.kind === 'browser' && (() => { const chromeH = g.y; return (<><rect x={0} y={0} width={d.w} height={h} rx={d.w * 0.02} fill={d.color} /><rect x={g.x} y={g.y} width={g.w} height={g.h} rx={g.r} fill="#15171b" />{['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (<circle key={c} cx={chromeH * 0.55 + i * Math.max(3, chromeH * 0.12) * 2.6} cy={chromeH / 2} r={Math.max(3, chromeH * 0.12)} fill={c} />))}</>); })()}
        {d.kind === 'monitor' && (() => { const standH = h * 0.15, screenH = h - standH; return (<><rect x={0} y={0} width={d.w} height={screenH} rx={d.w * 0.012} fill={d.color} /><rect x={g.x} y={g.y} width={g.w} height={g.h} rx={g.r} fill="#0b0c0f" /></>); })()}
      </svg>
      {/* Screen content */}
      <div className="absolute overflow-hidden" style={{ left: g.x, top: g.y, width: g.w, height: g.h, borderRadius: g.r }}>
        {asset ? <img src={asset.dataUrl} alt="" draggable={false} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center" style={{ background: 'repeating-linear-gradient(45deg, #14161b 0 10px, #171a20 10px 20px)' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>+ add screenshot</span></div>}
      </div>
      {/* Selection ring */}
      {selected && (<svg className="absolute pointer-events-none" style={{ left: -7, top: -7, width: d.w + 14, height: h + 14, zIndex: 50 }}><rect className="sel-ring-svg" x={1} y={1} width={d.w + 12} height={h + 12} rx={8} /></svg>)}
      {selected && (<div className="absolute" style={{ left: -7, top: -30, background: 'var(--color-acc)', color: '#1a0e08', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, zIndex: 10001 }}>{d.name.toUpperCase()}</div>)}
    </div>
  );
}

function TextOverlay({ p }: { p: Project }) {
  const t = p.text;
  if (!t.enabled || (!t.title && !t.subtitle)) return null;
  const { w: cw, h: ch } = p.canvas;
  const M = Math.round(Math.min(cw, ch) * 0.055);
  const ts = clamp(cw * 0.037, 24, 58) * t.scale;
  const color = t.autoColor ? textOn(p.background.c1) : t.color;
  const align = t.position.includes('left') ? 'left' : t.position.includes('right') ? 'right' : 'center';
  const bx = t.position.includes('left') ? M : t.position.includes('right') ? cw - M - 400 : (cw - 400) / 2;
  const by = t.position.startsWith('top') ? M : t.position.startsWith('bottom') ? ch - M - ts * 2 : (ch - ts * 2) / 2;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ padding: M, display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center', justifyContent: t.position.startsWith('top') ? 'flex-start' : t.position.startsWith('bottom') ? 'flex-end' : 'center' }}>
      {t.title && <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: ts, lineHeight: 1.1, color, textAlign: align as any }}>{t.title}</div>}
      {t.subtitle && <div style={{ fontFamily: 'var(--font-mono)', fontSize: ts * 0.34, letterSpacing: 1.6, textTransform: 'uppercase' as const, color, opacity: 0.72, marginTop: t.title ? ts * 0.34 : 0 }}>{t.subtitle}</div>}
      {t.showBadges && t.badges.length > 0 && (
        <div className="flex flex-wrap gap-2" style={{ marginTop: (t.title || t.subtitle) ? ts * 0.42 : 0 }}>
          {t.badges.map(b => (<span key={b} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, padding: '5px 12px', borderRadius: 999, background: luminance(color) > 0.5 ? 'rgba(21,23,28,0.07)' : 'rgba(255,255,255,0.1)', border: `1px solid ${luminance(color) > 0.5 ? 'rgba(21,23,28,0.16)' : 'rgba(255,255,255,0.18)'}` }}>{b}</span>))}
        </div>
      )}
    </div>
  );
}

/* =================== LEFT PANEL =================== */
function LeftPanel() {
  const [tab, setTab] = useState<'screens' | 'devices' | 'backdrop'>('screens');
  return (
    <div className="w-[264px] shrink-0 border-r border-line2 bg-panel flex flex-col">
      <div className="border-b border-line2 px-1.5 pt-2 pb-1">
        <div className="flex gap-0.5">
          {([['screens', 'Screens', IcImage], ['devices', 'Layouts', IcDevice], ['backdrop', 'Backdrop', IcBg]] as const).map(([id, label, Icon]) => {
            const on = tab === id;
            return (<button key={id} onClick={() => setTab(id as any)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10.5px] font-medium" style={{ borderRadius: '6px 6px 0 0', color: on ? 'var(--color-fg)' : 'var(--color-dim)', background: on ? 'var(--color-ink)' : 'transparent', boxShadow: on ? 'inset 0 2px 0 var(--color-acc)' : 'none' }}><Icon size={12} />{label}</button>);
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-ink">
        {tab === 'screens' && <ScreensTab />}
        {tab === 'devices' && <LayoutsTab />}
        {tab === 'backdrop' && <BackdropTab />}
      </div>
    </div>
  );
}

function ScreensTab() {
  const project = useStudio(s => s.project)!;
  const addFiles = useStudio(s => s.addFiles);
  const removeAsset = useStudio(s => s.removeAsset);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="p-3">
      <div className="text-center py-5 px-3 cursor-pointer" style={{ border: '1.5px dashed var(--color-line)', borderRadius: 10, background: 'var(--color-panel)' }} onClick={() => inputRef.current?.click()}>
        <IcUpload size={18} />
        <div className="text-[12px] font-medium mt-1.5">Drop screenshots</div>
        <div className="text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>browse · Ctrl+V</div>
        <input ref={inputRef} type="file" hidden multiple accept="image/*" onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ''; }} />
      </div>
      <div className="mt-3">
        <div className="label-mono mb-2">Screenshots · {project.assets.length}</div>
        {project.assets.map((a, i) => (
          <div key={a.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-panel2 transition-colors mb-1">
            <img src={a.dataUrl} alt={a.name} className="w-[46px] h-8 object-cover rounded-md border border-line2" />
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-medium truncate">{a.name}</div>
              <div className="text-[9.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{classifyAsset(a)}</div>
            </div>
            <button className="icon-btn !w-5 !h-5" onClick={() => removeAsset(a.id)}><IcTrash size={10} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LayoutsTab() {
  const addDevice = useStudio(s => s.addDevice);
  const applyComposition = useStudio(s => s.applyComposition);
  return (
    <div className="p-3">
      <div className="label-mono mb-2">Add device</div>
      <div className="grid grid-cols-5 gap-1 mb-4">
        {(Object.keys(DEVICE_META) as DeviceKind[]).map(kind => {
          const Icon = kind === 'laptop' ? IcLaptop : kind === 'phone' ? IcPhone : kind === 'tablet' ? IcTablet : kind === 'browser' ? IcBrowser : IcMonitor;
          return (<button key={kind} onClick={() => addDevice(kind)} className="flex items-center justify-center py-2 rounded-lg border border-line bg-panel hover:border-acc/50 hover:text-acc text-mut"><Icon size={16} /></button>);
        })}
      </div>
      <div className="label-mono mb-2">Compositions · {COMPOSITIONS.length}</div>
      <div className="space-y-1.5">
        {COMPOSITIONS.map(c => (
          <button key={c.id} onClick={() => applyComposition(c.id)} className="w-full flex items-center gap-2.5 p-1.5 rounded-lg border border-line bg-panel hover:border-[#4a4f5c] text-left">
            <div className="text-[11.5px] font-medium">{c.label}</div>
            <div className="text-[9px] ml-auto" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{c.slots.length} dev</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BackdropTab() {
  const project = useStudio(s => s.project)!;
  const update = useStudio(s => s.update);
  return (
    <div className="p-3">
      <div className="label-mono mb-2">Style</div>
      <div className="grid grid-cols-4 gap-1 mb-4">
        {(['plain', 'studio', 'abstract', 'grid', 'editorial', 'tech', 'glass', 'architectural'] as const).map(s => (
          <button key={s} onClick={() => update(p => ({ ...p, background: { ...p.background, style: s } }))} className="py-1.5 text-[9.5px] rounded-md border capitalize" style={{ borderColor: project.background.style === s ? 'var(--color-acc)' : 'var(--color-line)', background: project.background.style === s ? 'rgba(255,107,61,0.12)' : 'var(--color-panel)', color: project.background.style === s ? 'var(--color-acc)' : 'var(--color-mut)' }}>{s}</button>
        ))}
      </div>
      <div className="label-mono mb-2">Type</div>
      <div className="seg mb-4">
        {(['solid', 'linear', 'radial', 'mesh'] as const).map(t => (<button key={t} className={project.background.type === t ? 'on' : ''} onClick={() => update(p => ({ ...p, background: { ...p.background, type: t } }))}>{t}</button>))}
      </div>
      <div className="label-mono mb-2">Colors</div>
      <div className="flex items-center gap-3">
        <input type="color" className="swatch-input" value={project.background.c1} onChange={(e) => update(p => ({ ...p, background: { ...p.background, c1: e.target.value } }))} />
        {project.background.type !== 'solid' && <input type="color" className="swatch-input" value={project.background.c2} onChange={(e) => update(p => ({ ...p, background: { ...p.background, c2: e.target.value } }))} />}
      </div>
      <div className="label-mono mb-2 mt-4">Pattern</div>
      <div className="grid grid-cols-6 gap-1">
        {PATTERNS.map(pt => (<button key={pt.id} onClick={() => update(p => ({ ...p, background: { ...p.background, pattern: pt.id } }))} className="py-1.5 text-[9.5px] rounded-md border" style={{ borderColor: project.background.pattern === pt.id ? 'var(--color-acc)' : 'var(--color-line)', color: project.background.pattern === pt.id ? 'var(--color-acc)' : 'var(--color-mut)' }}>{pt.label}</button>))}
      </div>
      <div className="label-mono mb-2 mt-4">Accents</div>
      <div className="flex items-center gap-3">
        <input type="color" className="swatch-input" value={project.accents.a1} onChange={(e) => update(p => ({ ...p, accents: { ...p.accents, a1: e.target.value } }))} />
        <input type="color" className="swatch-input" value={project.accents.a2} onChange={(e) => update(p => ({ ...p, accents: { ...p.accents, a2: e.target.value } }))} />
      </div>
    </div>
  );
}

/* =================== RIGHT PANEL =================== */
function RightPanel() {
  const selection = useStudio(s => s.selection);
  const project = useStudio(s => s.project)!;
  const device = selection?.kind === 'device' ? project.devices.find(d => d.id === selection.id) : undefined;
  return (
    <div className="w-[292px] shrink-0 border-l border-line2 bg-panel flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-ink min-h-0">
        {device ? <DeviceProps d={device} /> : selection?.kind === 'text' ? <TextProps /> : <BackgroundProps />}
        <LayersList />
      </div>
    </div>
  );
}

function DeviceProps({ d }: { d: import('./types').DeviceLayer }) {
  const project = useStudio(s => s.project)!;
  const update = useStudio(s => s.update);
  const checkpoint = useStudio(s => s.checkpoint);
  const removeDevice = useStudio(s => s.removeDevice);
  const duplicateDevice = useStudio(s => s.duplicateDevice);
  const meta = DEVICE_META[d.kind];
  const patch = (fn: (x: typeof d) => typeof d) => update(p => ({ ...p, devices: p.devices.map(x => x.id === d.id ? fn(x) : x) }), false);
  return (
    <>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="label-mono">{meta.label}</div>
          <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{d.name}</span>
        </div>
        <div className="flex gap-1">
          <button className="icon-btn" onClick={() => duplicateDevice(d.id)}><IcCopy size={14} /></button>
          <button className="icon-btn hover:!text-danger" onClick={() => removeDevice(d.id)}><IcTrash size={14} /></button>
        </div>
      </div>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="label-mono mb-2">Screenshot</div>
        <div className="grid grid-cols-4 gap-1.5">
          <button className="h-12 rounded-md border text-[9px]" style={{ borderColor: d.assetId === null ? 'var(--color-acc)' : 'var(--color-line)', color: d.assetId === null ? 'var(--color-acc)' : 'var(--color-dim)' }} onClick={() => { checkpoint(); patch(x => ({ ...x, assetId: null })); }}>none</button>
          {project.assets.map(a => (<button key={a.id} className="h-12 rounded-md overflow-hidden border" style={{ borderColor: d.assetId === a.id ? 'var(--color-acc)' : 'var(--color-line)' }} onClick={() => { checkpoint(); patch(x => ({ ...x, assetId: a.id })); }}><img src={a.dataUrl} alt="" className="w-full h-full object-cover" /></button>))}
        </div>
      </div>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="label-mono mb-2">Transform</div>
        <div className="mb-2.5"><div className="flex items-center justify-between mb-1"><span className="text-[11px] text-mut">Size</span><span className="text-[10.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{Math.round((d.w / project.canvas.w) * 100)}%</span></div><input type="range" className="slider w-full" min={8} max={110} value={Math.round((d.w / project.canvas.w) * 100)} onChange={(e) => patch(x => ({ ...x, w: clamp((parseInt(e.target.value) / 100) * project.canvas.w, 90, project.canvas.w * 1.1) }))} /></div>
        <div className="mb-2.5"><div className="flex items-center justify-between mb-1"><span className="text-[11px] text-mut">Tilt</span><span className="text-[10.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{d.tilt}°</span></div><input type="range" className="slider w-full" min={-24} max={24} value={d.tilt} onChange={(e) => patch(x => ({ ...x, tilt: parseInt(e.target.value) }))} /></div>
      </div>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="label-mono mb-2">Frame color</div>
        <div className="flex gap-2 flex-wrap">
          {meta.colors.map(c => (<button key={c.hex} title={c.name} onClick={() => { checkpoint(); patch(x => ({ ...x, color: c.hex })); }} className="cursor-pointer" style={{ width: 26, height: 26, borderRadius: 8, background: c.hex, border: `2px solid ${d.color === c.hex ? 'var(--color-acc)' : 'var(--color-line)'}` }} />))}
        </div>
      </div>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="label-mono mb-2">Shadow</div>
        <div className="grid grid-cols-4 gap-1">{SHADOWS.map(sh => (<button key={sh.id} onClick={() => { checkpoint(); patch(x => ({ ...x, shadow: sh.id as any })); }} className="py-1.5 text-[10.5px] rounded-md border" style={{ borderColor: d.shadow === sh.id ? 'var(--color-acc)' : 'var(--color-line)', color: d.shadow === sh.id ? 'var(--color-acc)' : 'var(--color-mut)' }}>{sh.label}</button>))}</div>
      </div>
    </>
  );
}

function BackgroundProps() {
  const project = useStudio(s => s.project)!;
  const update = useStudio(s => s.update);
  const checkpoint = useStudio(s => s.checkpoint);
  const t = project.text;
  return (
    <>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="label-mono mb-2">Text block</div>
        <input className="input mb-2" placeholder="Title" value={t.title} onChange={(e) => update(p => ({ ...p, text: { ...p.text, title: e.target.value } }), false)} style={{ fontFamily: 'var(--font-disp)', fontWeight: 600 }} />
        <input className="input" placeholder="Subtitle" value={t.subtitle} onChange={(e) => update(p => ({ ...p, text: { ...p.text, subtitle: e.target.value } }), false)} style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
      </div>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="label-mono mb-2">Position</div>
        <div className="grid grid-cols-3 gap-1">{POSITIONS.map(p => (<button key={p} onClick={() => { checkpoint(); update(pr => ({ ...pr, text: { ...pr.text, position: p } })); }} className="h-8 rounded border text-[9px]" style={{ borderColor: t.position === p ? 'var(--color-acc)' : 'var(--color-line)', background: t.position === p ? 'rgba(255,107,61,0.12)' : 'var(--color-panel)', color: t.position === p ? 'var(--color-acc)' : 'var(--color-mut)' }}>{p.replace('-', ' ')}</button>))}</div>
      </div>
      <div className="px-3.5 py-3.5 border-b border-line2">
        <div className="label-mono mb-2">Tech badges</div>
        <div className="flex flex-wrap gap-1.5">{TECH_BADGES.map(b => { const on = t.badges.includes(b); return (<button key={b} className={`chip ${on ? 'on' : ''}`} onClick={() => { checkpoint(); update(p => ({ ...p, text: { ...p.text, badges: on ? p.text.badges.filter(y => y !== b) : [...p.text.badges, b] } })); }}>{b}</button>); })}</div>
      </div>
    </>
  );
}

function TextProps() { return null; }

function LayersList() {
  const project = useStudio(s => s.project)!;
  const selection = useStudio(s => s.selection);
  const setSelection = useStudio(s => s.setSelection);
  const update = useStudio(s => s.update);
  return (
    <div className="px-3.5 py-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="label-mono">Layers</div>
        <IcLayers size={13} />
      </div>
      <div className="space-y-0.5">
        {[...project.devices].reverse().map(d => {
          const on = selection?.kind === 'device' && selection.id === d.id;
          return (<div key={d.id} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer ${on ? 'bg-[rgba(255,107,61,0.1)]' : 'hover:bg-panel2'}`} onClick={() => setSelection({ kind: 'device', id: d.id })} style={on ? { boxShadow: 'inset 2px 0 0 var(--color-acc)' } : undefined}>
            <button className="icon-btn !w-6 !h-6" onClick={(e) => { e.stopPropagation(); update(p => ({ ...p, devices: p.devices.map(x => x.id === d.id ? { ...x, visible: !x.visible } : x) }), false); }}>{d.visible ? <IcEye size={12} /> : <IcEyeOff size={12} />}</button>
            <span className="flex-1 text-[12px] truncate" style={{ opacity: d.visible ? 1 : 0.45 }}>{d.name}</span>
          </div>);
        })}
        <div className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer ${selection?.kind === 'text' ? 'bg-[rgba(255,107,61,0.1)]' : 'hover:bg-panel2'}`} onClick={() => setSelection({ kind: 'text' })}>
          <IcEye size={12} /><span className="flex-1 text-[12px]">Text block</span>
        </div>
        <div className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer ${selection?.kind === 'background' ? 'bg-[rgba(255,107,61,0.1)]' : 'hover:bg-panel2'}`} onClick={() => setSelection({ kind: 'background' })}>
          <IcEye size={12} /><span className="flex-1 text-[12px]">Background</span>
        </div>
      </div>
    </div>
  );
}

/* =================== EXPORT MODAL =================== */
function ExportModal({ onClose }: { onClose: () => void }) {
  const project = useStudio(s => s.project)!;
  const trackExport = useStudio(s => s.trackExport);
  const toast = useStudio(s => s.toast);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [scale, setScale] = useState<1 | 2 | 3>(2);
  const [busy, setBusy] = useState(false);

  const doExport = async () => {
    setBusy(true);
    try {
      const { exportBlob } = await import('./renderer');
      const targetW = project.canvas.w * scale, targetH = project.canvas.h * scale;
      const blob = await exportBlob(project, { format, quality: 0.92, scale, targetW, targetH, transparent: false });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${project.name}-${targetW}x${targetH}.${format === 'jpeg' ? 'jpg' : format}`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(`Exported ${targetW}×${targetH}`);
      trackExport();
    } catch { toast('Export failed', 'err'); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center anim-fade-in" style={{ background: 'rgba(8,9,11,0.78)' }} onClick={onClose}>
      <div className="anim-pop w-[500px] max-w-[94vw] rounded-xl border border-line bg-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line2">
          <div className="font-semibold text-[15px]" style={{ fontFamily: 'var(--font-disp)' }}>Export</div>
          <button className="icon-btn" onClick={onClose}><IcClose size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div><div className="label-mono mb-1.5">Format</div><div className="seg">{(['png', 'jpeg', 'webp'] as const).map(f => (<button key={f} className={format === f ? 'on' : ''} onClick={() => setFormat(f)}>{f.toUpperCase()}</button>))}</div></div>
          <div><div className="label-mono mb-1.5">Resolution</div><div className="seg">{([{id:'1',label:'1×'},{id:'2',label:'2×'},{id:'3',label:'3×'}]).map(s => (<button key={s.id} className={String(scale) === s.id ? 'on' : ''} onClick={() => setScale(parseInt(s.id) as 1|2|3)}>{s.label}</button>))}</div></div>
          <button className="btn btn-acc w-full justify-center !py-2.5" disabled={busy} onClick={() => void doExport()}>
            {busy ? <IcSpin size={15} /> : <IcExport size={15} />}
            {busy ? 'Rendering…' : `Download ${project.canvas.w * scale}×${project.canvas.h * scale}`}
          </button>
        </div>
      </div>
    </div>
  );
}
