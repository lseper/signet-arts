import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { img, video, poster, isVideo } from '../lib/media';

/** Adds `is-in` once the element scrolls into view. */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style }: { children: ReactNode; delay?: number; as?: 'div' | 'section' | 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'figure' | 'li'; className?: string; style?: CSSProperties }) {
  const [ref, inView] = useInView<HTMLElement>();
  const Comp = Tag as 'div';
  return (
    <Comp ref={ref as React.Ref<HTMLDivElement>} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ ...style, ['--d' as string]: delay }}>
      {children}
    </Comp>
  );
}

/** Autoplaying muted loop that only plays while on screen. */
export function LoopVideo({ slug, className, label }: { slug: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={video(slug)} poster={poster(slug)} muted loop playsInline preload="metadata" aria-label={label} />;
}

/** Image or video by slug. */
export function Media({ slug, size = 'lg', alt = '', className }: { slug: string; size?: 'sm' | 'lg'; alt?: string; className?: string }) {
  if (isVideo(slug)) return <LoopVideo slug={slug} className={className} label={alt} />;
  return <img className={className} src={img(slug, size)} alt={alt} loading="lazy" decoding="async" />;
}

export function Cutout({ slug, alt, tilt = 0, size = 'lg', polaroid = false, style, className = '' }: { slug: string; alt: string; tilt?: number; size?: 'sm' | 'lg'; polaroid?: boolean; style?: CSSProperties; className?: string }) {
  return (
    <div className={`cutout ${polaroid ? 'cutout--polaroid' : ''} ${className}`} style={{ ...style, ['--tilt' as string]: `${tilt}deg` }}>
      <Media slug={slug} size={size} alt={alt} />
    </div>
  );
}

/** Oval photo ringed with a periwinkle brush stroke, as in the decks' "Who we are" slide. */
export function BrushOval({ slug, alt }: { slug: string; alt: string }) {
  return (
    <div className="brush-oval">
      <div className="brush-oval__img"><Media slug={slug} alt={alt} /></div>
      <svg viewBox="0 0 100 125" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <filter id="brushy" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" />
          </filter>
        </defs>
        <g fill="none" stroke="currentColor" strokeLinecap="round" filter="url(#brushy)">
          <ellipse cx="50" cy="62.5" rx="45" ry="57" strokeWidth="4.2" strokeDasharray="250 18" transform="rotate(-6 50 62.5)" />
          <ellipse cx="50.5" cy="62" rx="46.5" ry="58.5" strokeWidth="1.6" opacity=".7" strokeDasharray="120 40 60 30" transform="rotate(-4 50 62.5)" />
        </g>
      </svg>
    </div>
  );
}

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`kicker ${className}`}>{children}</span>;
}

export function Arrow() { return <span className="arrow" aria-hidden="true" />; }

export const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13l6 6L21 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const PenNib = () => (
  <svg viewBox="0 0 64 24" aria-hidden="true"><path d="M3 12c9-5 19-6 29-5h22l7 5-7 5H32c-10 1-20 0-29-5z" fill="none" stroke="currentColor" strokeWidth="1.1" /><path d="M3 12h22" stroke="currentColor" strokeWidth=".8" /><circle cx="26" cy="12" r="1.4" fill="currentColor" /><path d="M40 7v10M44 7v10" stroke="currentColor" strokeWidth=".7" /></svg>
);
