import { useEffect, useRef, useState } from 'react';
import type { Montage } from '../data/content';
import { img, isVideo, poster, video } from '../lib/media';
import { Cutout, Reveal } from './ui';

const TILTS = [-3, 4, -6, 2.5, -1.5, 5];

/** A flippable pile of photos & clips from the event; click (or use arrows) to send the top card to the back. */
function Stack({ items, name }: { items: Montage['stack']; name: string }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const [leaving, setLeaving] = useState<number | null>(null);
  const vids = useRef<Map<number, HTMLVideoElement>>(new Map());
  const top = order[0];

  // only the top card's video plays
  useEffect(() => {
    vids.current.forEach((v, i) => { if (i === top) v.play().catch(() => {}); else v.pause(); });
  }, [top]);

  const advance = (dir: 1 | -1) => {
    if (leaving !== null) return;
    if (dir === -1) { setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]); return; }
    setLeaving(top);
    window.setTimeout(() => { setOrder((o) => [...o.slice(1), o[0]]); setLeaving(null); }, 420);
  };

  return (
    <div>
      <div className="stack" role="group" aria-roledescription="photo stack" aria-label={`Photos and clips from ${name}`}>
        {order.slice().reverse().map((i) => {
          const depth = order.indexOf(i);
          const it = items[i];
          return (
            <button key={it.slug} type="button" className={`stack__card ${leaving === i ? 'is-leaving' : ''}`}
              onClick={() => depth === 0 && advance(1)} tabIndex={depth === 0 ? 0 : -1}
              aria-label={depth === 0 ? `${it.label}. Show next` : undefined} aria-hidden={depth !== 0}
              style={{ zIndex: 10 - depth, transform: `rotate(${depth === 0 ? 0 : TILTS[i % TILTS.length]}deg) translateY(${depth * 6}px) scale(${1 - depth * 0.03})`, border: 0 }}>
              {isVideo(it.slug)
                ? <video ref={(v) => { if (v) vids.current.set(i, v); else vids.current.delete(i); }} src={video(it.slug)} poster={poster(it.slug)} muted loop playsInline preload="metadata" />
                : <img src={img(it.slug, 'lg')} alt={it.label} loading="lazy" decoding="async" />}
              <span className="tag">
                {isVideo(it.slug) && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor" /></svg>}
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
      {items.length > 1 && (
        <div className="stack__controls">
          <button type="button" onClick={() => advance(-1)} aria-label="Previous photo"><svg width="18" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg></button>
          <span>{items.indexOf(items[top]) + 1} / {items.length}</span>
          <button type="button" onClick={() => advance(1)} aria-label="Next photo"><svg width="18" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg></button>
        </div>
      )}
    </div>
  );
}

export function MontageShowcase({ m, flip }: { m: Montage; flip?: boolean }) {
  return (
    <article className={`montage ${flip ? 'montage--flip' : ''}`} id={m.id}>
      <Reveal className="montage__stack-col"><Stack items={m.stack} name={m.name} /></Reveal>
      <div>
        <Reveal className="montage__title">
          <p className="montage__meta">{m.meta}</p>
          <h3>{m.name}</h3>
          <p>{m.blurb}</p>
        </Reveal>
        <Reveal as="figure" className="montage__final" delay={1} style={{ margin: '1.8rem 0 0' }}>
          <Cutout slug={m.sketch} alt={`Finished event montage: ${m.name}`} />
          <figcaption>{m.sketchCaption}</figcaption>
        </Reveal>
      </div>
    </article>
  );
}
