import type { ImageCategory } from './types';
export interface ImageAsset { id: string; name: string; category: ImageCategory; tags: string[]; src: string; width: number; height: number; dark: boolean; busy: boolean; mood: string[]; }
export const IMAGE_ASSETS: ImageAsset[] = [
  { id: 'abs-01', name: 'Warm Dimensional', category: 'abstract', tags: ['warm', 'premium'], src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=2048', width: 2048, height: 2048, dark: false, busy: false, mood: ['premium', 'minimal'] },
  { id: 'abs-02', name: 'Vibrant Creative', category: 'abstract', tags: ['vibrant', 'creative'], src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=2048', width: 2048, height: 2048, dark: false, busy: false, mood: ['creative', 'bold'] },
  { id: '3d-01', name: '3D Glass', category: '3d', tags: ['glass', '3d'], src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=2048', width: 2048, height: 2048, dark: true, busy: false, mood: ['premium', 'futuristic'] },
  { id: 'studio-01', name: 'Dark Studio', category: 'studio', tags: ['studio', 'dark'], src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=2048', width: 2048, height: 2048, dark: true, busy: false, mood: ['premium', 'dark'] },
  { id: 'arch-01', name: 'Modern Architecture', category: 'architectural', tags: ['modern', 'minimal'], src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=2048', width: 2048, height: 2048, dark: false, busy: false, mood: ['corporate', 'minimal'] },
  { id: 'tech-01', name: 'Tech Network', category: 'tech', tags: ['tech', 'network'], src: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=2048', width: 2048, height: 2048, dark: true, busy: false, mood: ['developer', 'futuristic'] },
];
export const IMAGE_CATEGORIES: { id: ImageCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'abstract', label: 'Abstract' }, { id: '3d', label: '3D' },
  { id: 'studio', label: 'Studio' }, { id: 'architectural', label: 'Architectural' },
  { id: 'tech', label: 'Tech' },
];
export function findImage(id: string): ImageAsset | undefined { return IMAGE_ASSETS.find(a => a.id === id); }
export function searchImages(query: string, category?: ImageCategory | 'all'): ImageAsset[] {
  let list = IMAGE_ASSETS;
  if (category && category !== 'all') list = list.filter(a => a.category === category);
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(a => a.name.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)));
}
