import { useCallback, useEffect, useRef, useState } from 'react';
import { brands, type Brand } from '../data/content';
import { BookCover, SketchbookModal } from '../components/Sketchbook';
import { Cutout, Reveal } from '../components/ui';

type Open = { brand: Brand; piece: number; origin: HTMLElement } | null;
const TILT = [-2.2, 1.6, -1.2, 2.4, -1.8, 1.1];

function Row({ brand, index, onOpen, isSource }: { brand: Brand; index: number; onOpen: (b: Brand, piece: number, origin: HTMLElement) => void; isSource: boolean }) {
  const book = useRef<HTMLButtonElement>(null);
  const four = brand.pieces.slice(0, 4);
  const thumb = (i: number, hideSmall = false) => {
    const pc = four[i];
    if (!pc) return <div className={hideSmall ? 'pf__hidden-sm' : ''} />;
    return (
      <button key={pc.slug} className={`pf__thumb ${hideSmall ? 'pf__hidden-sm' : ''}`} onClick={() => onOpen(brand, i, book.current!)} aria-label={`Open the ${brand.name} sketchbook at ${pc.caption ?? `piece ${i + 1}`}`}>
        <Cutout slug={pc.slug} alt="" size="sm" tilt={TILT[(index + i) % TILT.length]} />
      </button>
    );
  };
  return (
    <Reveal className="pf__row" delay={0}>
      {thumb(0, true)}
      {thumb(1)}
      <button ref={book} className={`book-btn ${isSource ? 'is-source' : ''}`} onClick={() => onOpen(brand, 0, book.current!)} aria-label={`Open the ${brand.name} sketchbook (${brand.pieces.length} sketches)`}>
        <BookCover brand={brand} />
      </button>
      {thumb(2)}
      {thumb(3, true)}
    </Reveal>
  );
}

export default function Portfolio() {
  const [open, setOpen] = useState<Open>(null);
  const onOpen = useCallback((brand: Brand, piece: number, origin: HTMLElement) => setOpen({ brand, piece, origin }), []);

  // while the sketchbook is open, lock scrolling and make the page inert
  useEffect(() => {
    const shell = document.getElementById('app-shell');
    document.body.classList.toggle('is-locked', !!open);
    if (shell) shell.inert = !!open;
    return () => { document.body.classList.remove('is-locked'); if (shell) shell.inert = false; };
  }, [open]);

  return (
    <>
      <section className="page-head portfolio-head">
        <div className="narrow">
          <Reveal><h1>Portfolio</h1><div className="portfolio-rule" /></Reveal>
          <Reveal delay={1}><p className="lede" style={{ marginTop: '1.6rem' }}>A sketchbook for every brand we’ve drawn for. Browse the previews, then open any sketchbook to leaf through its pages.</p></Reveal>
        </div>
      </section>
      <section className="section pf" style={{ paddingTop: '1rem' }}>
        <div className="wrap pf__rows">
          {brands.map((b, i) => <Row key={b.id} brand={b} index={i} onOpen={onOpen} isSource={open?.brand.id === b.id} />)}
        </div>
      </section>
      {open && <SketchbookModal key={open.brand.id} brand={open.brand} startPiece={open.piece} origin={open.origin} onClosed={() => setOpen(null)} />}
    </>
  );
}
