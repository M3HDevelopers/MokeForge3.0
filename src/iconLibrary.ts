export interface IconDef { id: string; name: string; category: string; tags: string[]; d: string; style: 'outline' | 'filled'; }
export const ICONS: IconDef[] = [
  { id: 'react', name: 'React', category: 'web', tags: ['react', 'component'], d: 'M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 3c4 3 6 6 6 9s-2 6-6 9c-4-3-6-6-6-9s2-6 6-6zM3 8c3-4 6-6 9-6s6 2 9 6M3 16c3 4 6 6 9 6s6-2 9-6', style: 'outline' },
  { id: 'node', name: 'Node.js', category: 'web', tags: ['node', 'backend'], d: 'M12 2l9 5v10l-9 5-9-5V7l9-5zm0 10l9-5M12 12v10', style: 'outline' },
  { id: 'typescript', name: 'TypeScript', category: 'web', tags: ['typescript', 'ts'], d: 'M4 4h16v16H4zm6 6h4m-2 0v6m4-6h-2', style: 'outline' },
  { id: 'tailwind', name: 'Tailwind', category: 'web', tags: ['tailwind', 'css'], d: 'M6 10c1-3 3-4 6-4s4 1 5 3c1-1 2-1 3-1 2 0 3 2 2 4-1 3-3 4-6 4s-4-1-5-3c-1 1-2 1-3 1-2 0-3-2-2-4z', style: 'outline' },
  { id: 'code', name: 'Code', category: 'dev', tags: ['code', 'programming'], d: 'M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16', style: 'outline' },
  { id: 'database', name: 'Database', category: 'dev', tags: ['database', 'db'], d: 'M4 6c0-2 4-3 8-3s8 1 8 3v12c0 2-4 3-8 3s-8-1-8-3V6zM4 6c0 2 4 3 8 3s8-1 8-3M4 12c0 2 4 3 8 3s8-1 8-3', style: 'outline' },
  { id: 'cloud', name: 'Cloud', category: 'dev', tags: ['cloud', 'aws'], d: 'M6 18a4 4 0 0 1 0-8 6 6 0 0 1 12 0 4 4 0 0 1 0 8H6z', style: 'outline' },
  { id: 'ai', name: 'AI', category: 'ai', tags: ['ai', 'intelligence'], d: 'M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4zM8 14h8v4a4 4 0 0 1-8 0v-4z', style: 'outline' },
  { id: 'chart', name: 'Chart', category: 'business', tags: ['chart', 'analytics'], d: 'M3 3v18h18M7 14l4-4 4 4 5-5', style: 'outline' },
  { id: 'lightning', name: 'Lightning', category: 'misc', tags: ['lightning', 'fast'], d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', style: 'outline' },
  { id: 'globe', name: 'Globe', category: 'misc', tags: ['globe', 'world'], d: 'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM2 12h20', style: 'outline' },
  { id: 'settings', name: 'Settings', category: 'misc', tags: ['settings', 'gear'], d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', style: 'outline' },
];
export const ICON_CATEGORIES = [
  { id: 'all', label: 'All', count: ICONS.length },
  { id: 'web', label: 'Web Dev', count: ICONS.filter(i => i.category === 'web').length },
  { id: 'dev', label: 'Programming', count: ICONS.filter(i => i.category === 'dev').length },
  { id: 'ai', label: 'AI / ML', count: ICONS.filter(i => i.category === 'ai').length },
  { id: 'business', label: 'Business', count: ICONS.filter(i => i.category === 'business').length },
  { id: 'misc', label: 'General', count: ICONS.filter(i => i.category === 'misc').length },
];
export function findIcon(id: string): IconDef | undefined { return ICONS.find(i => i.id === id); }
export function searchIcons(query: string, category?: string): IconDef[] {
  let list = ICONS;
  if (category && category !== 'all') list = list.filter(i => i.category === category);
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(i => i.name.toLowerCase().includes(q) || i.tags.some(t => t.includes(q)));
}
