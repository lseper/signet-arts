import manifest from '../data/media.json';

type Entry = { kind: 'image' | 'video'; w: number; h: number; dw?: number; dh?: number };
const M = manifest as Record<string, Entry>;

/**
 * Where encoded media lives. Set VITE_MEDIA_BASE to the R2 bucket's public URL
 * (e.g. https://pub-xxxx.r2.dev/site) to serve from Cloudflare; otherwise media
 * is served from /public/media alongside the site.
 */
const BASE = (import.meta.env.VITE_MEDIA_BASE as string | undefined)?.replace(/\/$/, '') ?? `${import.meta.env.BASE_URL}media`;

export const img = (slug: string, size: 'sm' | 'lg' = 'lg') => `${BASE}/${slug}${size === 'sm' ? '-sm' : ''}.avif`;
export const video = (slug: string) => `${BASE}/${slug}.mp4`;
export const poster = (slug: string) => `${BASE}/${slug}-poster.avif`;
export const logoSrc = `${BASE}/signet-logo.avif`;

export function meta(slug: string): Entry {
  const m = M[slug];
  if (!m) throw new Error(`Unknown media slug: ${slug}`);
  return m;
}
export const isVideo = (slug: string) => meta(slug).kind === 'video';
export const ratio = (slug: string) => { const m = meta(slug); return m.w / m.h; };
