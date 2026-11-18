import { Link } from 'react-router-dom';
import { artists } from '../data/content';
import { Arrow, BrushOval, Cutout, Kicker, Reveal } from '../components/ui';
import { TrustedBy } from './Home';

export default function About() {
  const { matt, jam } = artists;
  return (
    <>
      <section className="page-head">
        <div className="narrow">
          <Reveal><Kicker className="center">Who we are</Kicker></Reveal>
          <Reveal delay={1}><h1>Two artists, <em>drawing the moment.</em></h1></Reveal>
          <Reveal delay={2}><p className="lede">Matt Utsunomiya and Jam Clostre co-founded their live event art practice and work together as a team at events across Southern California. They share a passion for drawing live, in the moment, and sketching the world around them.</p></Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="wrap bio">
          <Reveal className="bio__media">
            <BrushOval slug={matt.portrait} alt="Matt Utsunomiya sketching under a clip light" />
            <div className="bio__extra"><Cutout slug={matt.extra} alt="Matt with a guest and his finished Adobe portrait" tilt={4} polaroid size="sm" /></div>
          </Reveal>
          <Reveal delay={1}>
            <h2>{matt.name}</h2>
            <a className="handle" href={`https://www.instagram.com/${matt.handle}/`} target="_blank" rel="noopener noreferrer">@{matt.handle}</a>
            <p className="lede">Matt draws in bold, fluid ink: fashion portraits, cosplay at conventions like D23, and full-scene sketches of concerts and shows.</p>
            <p>In May, Matt’s drawings became part of Kylie Jenner’s marketing campaign for her brand KHY. Compared with the brand’s typical posts of models wearing its products, his illustrations earned substantially more engagement across multiple metrics.</p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-blush">
        <div className="wrap bio bio--flip">
          <Reveal className="bio__media">
            <BrushOval slug={jam.portrait} alt="Jam Clostre drawing a portrait at a Clé de Peau counter" />
            <div className="bio__extra"><Cutout slug={jam.extra} alt="Jam sketching outside the Dior show at LACMA" tilt={-4} polaroid /></div>
          </Reveal>
          <Reveal delay={1}>
            <h2>{jam.name}</h2>
            <a className="handle" href={`https://www.instagram.com/${jam.handle}/`} target="_blank" rel="noopener noreferrer">@{jam.handle}</a>
            <p className="lede">Jam’s portraits are lyrical and color-forward, all washes of rose and flourishes of line, made for beauty counters, luxury retail, and celebrations.</p>
            <p>Her event sketchbooks capture whole rooms in a single spread, from packed concert floors to runway arrivals, drawn as the night unfolds.</p>
          </Reveal>
        </div>
      </section>

      <TrustedBy />

      <section className="section">
        <div className="wrap split">
          <Reveal>
            <Kicker>Our practice</Kicker>
            <h2>Naturally, a unique way to <em>document the magic.</em></h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="lede">Events, concerts, parties, conventions: our skillset turns each one into something guests can hold. Every portrait is drawn by hand, in front of them, by an artist who noticed the way they laughed.</p>
            <Link to="/portfolio" className="btn" style={{ marginTop: '1rem' }}>Browse the portfolio <Arrow /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section bg-navy on-dark deckle-top center">
        <div className="narrow">
          <Reveal><p className="shout" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--gold)', margin: 0 }}>Thank you for<br />your consideration</p></Reveal>
          <Reveal delay={1}><p className="handles" style={{ margin: '2rem 0 2.4rem' }}>See more on Instagram:{' '}
            <a href="https://www.instagram.com/artisanaljam/" target="_blank" rel="noopener noreferrer">artisanaljam</a> &amp;{' '}
            <a href="https://www.instagram.com/mattdrawsmoments/" target="_blank" rel="noopener noreferrer">mattdrawsmoments</a></p></Reveal>
          <Reveal delay={2}><Link to="/contact" className="btn btn--gold">Work with us <Arrow /></Link></Reveal>
        </div>
      </section>
    </>
  );
}
