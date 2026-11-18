import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import type { Brand, Piece } from '../data/content';
import { img, ratio } from '../lib/media';

/* ------------------------------------------------------------------ cover */

function CoverFace({ brand, showCount = true }: { brand: Brand; showCount?: boolean }) {
  return (
    <div className="cover" style={{ ['--bk' as string]: brand.cover }}>
      <span className="cover__mono" style={{ fontSize: brand.mono.length > 2 ? '.7em' : undefined }}>{brand.mono}</span>
      <span className="cover__name">{brand.name}</span>
      <span className="cover__sub">{brand.sub}</span>
      {showCount && <span className="cover__count">{brand.pieces.length} sketches</span>}
    </div>
  );
}

/** A closed sketchbook for the portfolio grid. */
export function BookCover({ brand }: { brand: Brand }) {
  return <div className="book"><div className="book__pages" /><CoverFace brand={brand} /></div>;
}

/* ------------------------------------------------------------------ pages */

type Page = { kind: 'intro' } | { kind: 'art'; piece: Piece; n: number } | { kind: 'end' } | { kind: 'blank' };

const tilts = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9, -2, 1.4];
const tapes = ['tape--tl tape--br', 'tape--tr', 'tape--tl', 'tape--tl tape--tr', 'tape--br', 'tape--tr tape--tl'];

function Pasted({ piece, n, total, fit }: { piece: Piece; n: number; total: number; fit?: number }) {
  const tilt = tilts[n % tilts.length];
  const wide = ratio(piece.slug) > 1.15;
  return (
    <figure className="pasted">
      <div className="pasted__frame" style={{ ['--tilt' as string]: `${tilt}deg`, ['--fit' as string]: fit ?? (wide ? 0.55 : 0.78) } as CSSProperties}>
        {tapes[n % tapes.length].split(' ').map((t) => <span key={t} className={`tape ${t}`} />)}
        <img src={img(piece.slug)} alt={piece.caption ?? `Live portrait ${n + 1} of ${total}`} decoding="async" />
      </div>
      {piece.caption && <figcaption>{piece.caption}</figcaption>}
    </figure>
  );
}

function Intro({ brand }: { brand: Brand }) {
  return (
    <div className="page__intro">
      <span className="kicker">Drawn live for</span>
      <h2>{brand.name}</h2>
      <p>{brand.blurb}</p>
      <p className="hand">{brand.pieces.length} portraits · ink, ink wash &amp; alcohol marker</p>
    </div>
  );
}

function End({ brand, onClose }: { brand: Brand; onClose: () => void }) {
  return (
    <div className="page__end">
      <span className="fin">fin.</span>
      <p style={{ margin: '1.2rem 0 1.8rem' }}>That’s the {brand.name} sketchbook. Imagine yours.</p>
      <Link to="/contact" className="btn btn--solid" onClick={onClose}>Book a date</Link>
    </div>
  );
}

function PageFace({ page, side, brand, idx, onClose }: { page: Page; side: 'left' | 'right'; brand: Brand; idx: number; onClose: () => void }) {
  return (
    <div className={`page page--${side}`}>
      {page.kind === 'intro' && <Intro brand={brand} />}
      {page.kind === 'art' && <div className="page__inner"><Pasted piece={page.piece} n={page.n} total={brand.pieces.length} /></div>}
      {page.kind === 'end' && <End brand={brand} onClose={onClose} />}
      {page.kind !== 'blank' && page.kind !== 'intro' && <span className="page__num">{idx}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ modal */

type Phase = 'enter' | 'center' | 'spread' | 'unspread' | 'return';

function useIsMobile() {
  const q = '(max-width: 760px)';
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
}

function pageSize(mobile: boolean) {
  const vw = window.innerWidth, vh = window.innerHeight;
  if (mobile) {
    const pw = Math.min(vw * 0.92, 520);
    return { pw, ph: Math.min(vh * 0.84, pw * 1.75) };
  }
  // two pages side by side, aspect 10:13, leave room for controls
  const ph = Math.min(vh * 0.84, ((vw * 0.92) / 2) * 1.3);
  return { pw: ph / 1.3, ph };
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function SketchbookModal({ brand, startPiece, origin, onClosed }: { brand: Brand; startPiece: number; origin: HTMLElement; onClosed: () => void }) {
  const mobile = useIsMobile();
  const [{ pw, ph }, setSize] = useState(() => pageSize(mobile));
  const [phase, setPhase] = useState<Phase>('enter');
  const [spread, setSpread] = useState(0);
  const [turning, setTurning] = useState<null | 'next' | 'prev'>(null);
  const [turnGo, setTurnGo] = useState(false);
  const [settled, setSettled] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const pages: Page[] = useMemo(() => {
    const list: Page[] = [{ kind: 'intro' }, ...brand.pieces.map((piece, n) => ({ kind: 'art' as const, piece, n })), { kind: 'end' }];
    if (list.length % 2) list.push({ kind: 'blank' });
    return list;
  }, [brand]);
  const spreads = pages.length / 2;

  useEffect(() => setSize(pageSize(mobile)), [mobile]);
  useEffect(() => {
    const on = () => setSize(pageSize(mobile));
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [mobile]);

  // open choreography
  useLayoutEffect(() => {
    setSpread(Math.floor((startPiece + 1) / 2));
    const fast = reduced();
    const t1 = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('center')));
    const t2 = window.setTimeout(() => setPhase('spread'), fast ? 30 : 680);
    return () => { cancelAnimationFrame(t1); clearTimeout(t2); };
  }, [startPiece]);

  useEffect(() => {
    if (phase !== 'spread') return;
    const s = window.setTimeout(() => setSettled(true), reduced() ? 20 : 920);
    const t = window.setTimeout(() => {
      closeBtn.current?.focus({ preventScroll: true });
      if (mobile && startPiece > 0) {
        scroller.current?.querySelectorAll('.pasted')[startPiece]?.scrollIntoView({ block: 'center' });
      }
    }, 700);
    return () => { clearTimeout(t); clearTimeout(s); };
  }, [phase, mobile, startPiece]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const fast = reduced();
    setTurning(null);
    setSettled(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase('unspread')));
    window.setTimeout(() => setPhase('return'), fast ? 20 : 650);
    window.setTimeout(() => { onClosed(); origin.focus({ preventScroll: true }); }, fast ? 60 : 1300);
  }, [onClosed, origin]);

  const flip = useCallback((dir: 'next' | 'prev') => {
    if (turning || phase !== 'spread') return;
    if (dir === 'next' && spread >= spreads - 1) return;
    if (dir === 'prev' && spread <= 0) return;
    setTurning(dir); setTurnGo(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setTurnGo(true)));
    window.setTimeout(() => {
      setSpread((s) => s + (dir === 'next' ? 1 : -1));
      setTurning(null); setTurnGo(false);
    }, reduced() ? 20 : 870);
  }, [turning, phase, spread, spreads]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (!mobile && e.key === 'ArrowRight') flip('next');
      if (!mobile && e.key === 'ArrowLeft') flip('prev');
      if (e.key === 'Tab') { // keep focus inside the modal
        const f = [...document.querySelectorAll<HTMLElement>('.sb button:not(:disabled), .sb a[href]')];
        if (!f.length) return;
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, flip, mobile]);

  // book transform per phase
  const atOrigin = phase === 'enter' || phase === 'return';
  let transform = 'none';
  if (atOrigin) {
    const r = origin.getBoundingClientRect();
    const s = r.width / pw;
    const dx = r.left + r.width / 2 - window.innerWidth / 2;
    const dy = r.top + r.height / 2 - window.innerHeight / 2;
    transform = `translate(${dx}px, ${dy}px) scale(${s}) rotate(-2deg)`;
  } else if (phase === 'spread' && !mobile) {
    transform = `translateX(${pw / 2}px)`;
  }
  const isSpread = phase === 'spread';
  const ready = isSpread;

  // which pages are visible (desktop)
  const L = (k: number) => pages[2 * k];
  const R = (k: number) => pages[2 * k + 1];
  let leftPage = L(spread), rightPage = R(spread);
  let leafFront: Page | null = null, leafBack: Page | null = null;
  if (turning === 'next') { rightPage = R(spread + 1); leafFront = R(spread); leafBack = L(spread + 1); }
  if (turning === 'prev') { leftPage = L(spread - 1); leafFront = L(spread); leafBack = R(spread - 1); }
  const pn = (pg: Page) => pages.indexOf(pg);

  return createPortal(
    <div className={`sb ${phase !== 'enter' && phase !== 'return' ? 'is-open' : ''} ${isSpread ? 'is-spread' : ''} ${ready ? 'is-ready' : ''} ${settled ? 'is-settled' : ''} ${mobile ? 'is-mobile' : ''}`}
      role="dialog" aria-modal="true" aria-label={`${brand.name} sketchbook`}>
      <div className="sb__backdrop" onClick={close} />
      <button ref={closeBtn} className="sb__close" onClick={close} aria-label="Close sketchbook">
        <svg viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>

      <div className={`sb__book ${mobile ? 'is-mobile' : 'is-desktop'}`}
        style={{ ['--pw' as string]: `${pw}px`, ['--ph' as string]: `${ph}px`, transform,
          transition: phase === 'enter' ? 'none' : phase === 'return' ? 'transform .65s cubic-bezier(.55,0,.35,1)' : undefined } as CSSProperties}
        onClick={(e) => e.stopPropagation()}>
        <div className="sb__pages">
          <div className="sb__spread-shadow" />
          <div className="sb__spread">
            {mobile ? (
              <div className="page page--right page--scroll" ref={scroller} style={{ left: 0 }}>
                <Intro brand={brand} />
                {brand.pieces.map((piece, n) => <Pasted key={piece.slug} piece={piece} n={n} total={brand.pieces.length} />)}
                <End brand={brand} onClose={close} />
              </div>
            ) : (
              <>
                <PageFace page={leftPage} side="left" brand={brand} idx={pn(leftPage)} onClose={close} />
                <PageFace page={rightPage} side="right" brand={brand} idx={pn(rightPage)} onClose={close} />
                {turning && leafFront && leafBack && (
                  <div className={`leaf leaf--${turning} ${turnGo ? 'is-turning' : ''}`}>
                    <PageFace page={leafFront} side={turning === 'next' ? 'right' : 'left'} brand={brand} idx={pn(leafFront)} onClose={close} />
                    <div className="page--back" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <PageFace page={leafBack} side={turning === 'next' ? 'left' : 'right'} brand={brand} idx={pn(leafBack)} onClose={close} />
                    </div>
                  </div>
                )}
                <div className="crease" />
              </>
            )}
          </div>
        </div>
        <div className="sb__cover-wrap">
          <CoverFace brand={brand} />
          <div className="sb__cover-inside" />
        </div>
      </div>

      {!mobile && (
        <nav className="sb__nav" aria-label="Turn pages">
          <button onClick={() => flip('prev')} disabled={spread === 0 || !!turning} aria-label="Previous pages">
            <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
          <span>{spread + 1} / {spreads}</span>
          <button onClick={() => flip('next')} disabled={spread >= spreads - 1 || !!turning} aria-label="Next pages">
            <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
        </nav>
      )}
      {mobile && <p className="sb__hint">Scroll to turn the pages</p>}
    </div>,
    document.body,
  );
}
