import { Link } from 'react-router-dom';
import { brands, montages } from '../data/content';

const BYLINE = [
  { name: 'Matthew Utsunomiya', url: 'https://www.instagram.com/mattdrawsmoments/' },
  { name: 'Jamille Clostre', url: 'https://www.instagram.com/artisanaljam/' },
];
import { logoSrc } from '../lib/media';
import { Arrow, Check, Cutout, Kicker, LoopVideo, Reveal } from '../components/ui';
import { MontageShowcase } from '../components/MontageStack';

const STRIP = [
  'rose-festival-260614-rosefestival-whiskeym-edt', 'celine-img-1289', 'd23-d23-mspiggy-edt', 're-you-img-8677',
  'under-the-sea-luncheon-img20261112-16175661', 'adobe-zizou-26-06-16-adobezizou-katliente-raw', 'kinn-pet-portraits-26-08-22-hera-edt2',
  'd23-d23-samuraivader-edt', 'coffee-fest-1883-odeko-img-3944', 'modern-luxury-subjects-24', 'briarwood-festival-img-1063', 'rose-festival-260614-rosefestival-somedailyjoe-edt',
];

export function TrustedBy() {
  return (
    <section className="trusted" aria-label="Our clients">
      <p className="trusted__label">Our clients include:</p>
      <div className="trusted__row wrap">
        <span className="wordmark wordmark--celine">CELINE<small>PARIS</small></span>
        <span className="wordmark wordmark--khy">KHY<small>BY KYLIE JENNER</small></span>
        <span className="wordmark wordmark--disney">Disney</span>
        <span className="wordmark wordmark--adobe">Adobe</span>
        <span className="wordmark wordmark--sisley">sisley<small>PARIS</small></span>
      </div>
      <p className="trusted__more">&amp; other major luxury &amp; lifestyle brands.</p>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero on-dark deckle-bottom">
        <div className="wrap hero__grid">
          <Reveal className="hero__photo"><Cutout slug="artistphotos-26-06-16-adobezizou-10" alt="Matt drawing a guest at an Adobe event" tilt={-2.5} /></Reveal>
          <div className="hero__copy">
            <Reveal><img className="hero__logo" src={logoSrc} alt="Signet Arts" /></Reveal>
            <Reveal delay={1}><h1>Fashion Portraits, <em>Drawn&nbsp;Live.</em></h1></Reveal>
            <Reveal delay={2}><p className="hero__sub">Bespoke keepsakes that elevate your event and leave a lasting impression.</p></Reveal>
            <Reveal delay={3}>
              <div className="hero__actions">
                <Link to="/contact" className="btn btn--gold">Book your date <Arrow /></Link>
                <Link to="/portfolio" className="text-link">See our portfolio</Link>
              </div>
              <p className="byline">By{' '}
                {BYLINE.map((a, n) => (
                  <span key={a.url}>{n > 0 && ' and '}<span className="byline__name">{a.name}<a href={a.url} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} on Instagram`}><svg className="ig" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" /></svg></a></span></span>
                ))}
              </p>
            </Reveal>
          </div>
          <Reveal className="hero__photo" delay={1}><Cutout slug="artistphotos-jam-cledepeau" alt="Jam drawing a portrait at a Clé de Peau event" tilt={2.5} /></Reveal>
        </div>
      </section>

      <TrustedBy />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <Reveal>
              <Kicker>The experience</Kicker>
              <h2>Custom, hand-drawn portraits, <em>in under ten minutes.</em></h2>
            </Reveal>
            <Reveal delay={1}><p className="lede">A one-of-a-kind memento that guests will treasure long after the event. Each portrait is original art made in real time, on location, in ink, ink wash, and alcohol marker.</p></Reveal>
          </div>
          <div className="steps">
            {[
              ['1', 'Drawn live', 'The artist draws each guest live, in the moment, right there at your event.'],
              ['2', 'Part of the party', 'Guests watch their portrait come to life line by line, then head back to their drink, their friends, the dance floor.'],
              ['3', 'The keepsake', 'The finished portrait is ready to pick up before the end of the night, signed and sleeved.'],
            ].map(([n, h, t], i) => (
              <Reveal key={n} delay={i}><span className="step__num">{n}</span><h3>{h}</h3><p>{t}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy on-dark deckle-top deckle-bottom">
        <div className="wrap">
          <Reveal><Kicker>On location</Kicker></Reveal>
          <Reveal delay={1}><h2>Original art, <em>made in real time.</em></h2></Reveal>
          <div className="at-work">
            <Reveal><div className="painted painted--tall"><LoopVideo slug="artistphotos-img-0879" label="Matt sketching on location at LACMA" /></div></Reveal>
            <Reveal delay={1}><Cutout slug="artistphotos-d23-mobilesketching" alt="Sketching cosplayers on the D23 show floor" tilt={1.5} /></Reveal>
            <Reveal delay={2}><Cutout slug="artistphotos-26-06-16-adobezizou-20" alt="An artist's hands mid-portrait on a clipboard" tilt={-1.5} /></Reveal>
            <Reveal delay={2}><Cutout slug="artistphotos-26-06-04-dtlaartnight-setup2" alt="The Signet portrait station set up at DTLA Art Night" tilt={-1} /></Reveal>
            <Reveal delay={3}><Cutout slug="artistphotos-img-8338" alt="A delighted guest with her portrait" tilt={2} /></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Reveal>
            <Kicker>Why brands choose live illustration</Kicker>
            <h2>A wow-factor guests <em>keep, post, and frame.</em></h2>
            <div style={{ marginTop: '2.2rem' }}><Link to="/live-events" className="btn">Explore our offerings <Arrow /></Link></div>
          </Reveal>
          <div className="why">
            {[
              ['Fashion-inspired portraits', 'Elegant portraits that guests are excited to keep and share.'],
              ['Bespoke & unique', 'Every portrait is individually hand-drawn for each guest.'],
              ['Tailored to your brand', 'Illustrations and cards customized to reflect your event experience.'],
              ['Traditional art in a digital world', 'A timeless keepsake. Stand out in a world of AI slop.'],
            ].map(([h, t], i) => (
              <Reveal key={h} className="why__item" delay={i}><Check /><div><h4>{h}</h4><p>{t}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-blush" aria-label="Selected work">
        <div className="wrap split" style={{ alignItems: 'end' }}>
          <Reveal><Kicker>Selected work</Kicker><h2>{brands.length} brands, <em>hundreds of guests.</em></h2></Reveal>
          <Reveal delay={1} style={{ justifySelf: 'end' }}><Link to="/portfolio" className="text-link">Open the sketchbooks</Link></Reveal>
        </div>
        <div className="strip">
          <div className="strip__track">
            {[...STRIP, ...STRIP].map((s, i) => (
              <div className="strip__item" key={i} aria-hidden={i >= STRIP.length}><Cutout slug={s} alt="" size="sm" tilt={i % 2 ? 1.5 : -1.5} /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="center"><Kicker className="center">Event montages</Kicker></Reveal>
          <Reveal className="center" delay={1}><h2>The whole night, <em>on a single page.</em></h2></Reveal>
          <MontageShowcase m={montages[0]} />
          <Reveal className="center"><Link to="/live-events#montages" className="btn">See more montages <Arrow /></Link></Reveal>
        </div>
      </section>

      <section className="section bg-burgundy on-dark deckle-top center">
        <div className="narrow">
          <Reveal><p className="shout" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', color: 'var(--gold)', margin: 0 }}>Make your event<br />a work of art</p></Reveal>
          <Reveal delay={1}><p className="lede" style={{ margin: '1.6rem auto 2.4rem', maxWidth: '34rem' }}>Based in Los Angeles and available for travel. Tell us about your celebration, launch, or activation.</p></Reveal>
          <Reveal delay={2}><Link to="/contact" className="btn btn--gold">Begin your enquiry <Arrow /></Link></Reveal>
        </div>
      </section>
    </>
  );
}
