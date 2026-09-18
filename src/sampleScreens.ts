import type { Asset } from './types';
import { uid } from './templates';
import { urlToAsset } from './store';

function paintDashboard(): string {
  const W = 1600, H = 1000; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d')!;
  x.fillStyle = '#101318'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#151a21'; x.fillRect(0, 0, 250, H);
  x.fillStyle = '#ff6b3d'; x.beginPath(); x.arc(42, 48, 12, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#e9e7e1'; x.font = '600 22px "Space Grotesk"'; x.fillText('Nova', 66, 56);
  const stats = [['Revenue', '₹4.82L', '+12.4%'], ['Orders', '1,284', '+8.1%'], ['Visitors', '38.2K', '+22.6%'], ['Refunds', '0.9%', '-1.2%']];
  stats.forEach((s, i) => { const cx = 300 + i * 322; x.fillStyle = '#171d25'; x.beginPath(); x.roundRect(cx, 160, 298, 130, 14); x.fill(); x.fillStyle = '#7c8592'; x.font = '500 15px "IBM Plex Sans"'; x.fillText(s[0], cx + 26, 200); x.fillStyle = '#f2f0ea'; x.font = '700 34px "Space Grotesk"'; x.fillText(s[1], cx + 26, 248); });
  x.fillStyle = '#171d25'; x.beginPath(); x.roundRect(300, 320, 940, 380, 14); x.fill();
  const pts = [620, 590, 600, 560, 575, 530, 545, 500, 520, 470, 490, 450];
  x.beginPath(); pts.forEach((p, i) => { const px = 340 + (i / (pts.length - 1)) * 860; i === 0 ? x.moveTo(px, p) : x.lineTo(px, p); }); x.strokeStyle = '#45d6c8'; x.lineWidth = 3.5; x.stroke();
  return c.toDataURL('image/jpeg', 0.88);
}

function paintMobile(): string {
  const W = 750, H = 1500; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d')!;
  x.fillStyle = '#0f1115'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#e9e7e1'; x.font = '600 30px "Space Grotesk"'; x.fillText('Hey, Mira', 44, 170);
  const g = x.createLinearGradient(44, 260, 706, 560); g.addColorStop(0, '#2a1c12'); g.addColorStop(1, '#3d2417');
  x.fillStyle = g; x.beginPath(); x.roundRect(44, 260, 662, 300, 34); x.fill();
  x.fillStyle = '#f7ede2'; x.font = '700 72px "Space Grotesk"'; x.fillText('₹1,24,500', 92, 420);
  return c.toDataURL('image/jpeg', 0.88);
}

export async function loadDemoAssets(): Promise<Asset[]> {
  try {
    const assets = await Promise.all([
      urlToAsset('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600', 'analytics-dashboard'),
      urlToAsset('https://images.unsplash.com/photo-1563986768609-322da935f263?w=750', 'finance-app'),
    ]);
    if (assets.every(a => a.dataUrl.length > 1000)) return assets;
    throw new Error('empty');
  } catch {
    return [
      { id: uid(), name: 'analytics-dashboard', dataUrl: paintDashboard(), w: 1600, h: 1000 },
      { id: uid(), name: 'finance-app', dataUrl: paintMobile(), w: 750, h: 1500 },
    ];
  }
}
