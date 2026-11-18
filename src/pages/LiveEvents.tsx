import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { montages } from '../data/content';
import { Arrow, Cutout, Kicker, Reveal } from '../components/ui';
import { MontageShowcase } from '../components/MontageStack';

const OFFERS = [
  { title: 'Individual Portraits', time: '5–10 min per portrait', art: 're-you-img-8677', alt: 'Rose-ink beauty portrait for RE:YOU',
    body: 'Head-and-shoulders fashion portraits for every guest who wants one. Ideal for cocktail hours, beauty counters, and steady lines of guests.' },
  { title: 'Couple & Full-Length Portraits', time: '12–15 min per portrait', art: 'rose-festival-260614-rosefestival-sylviamynt-edt', alt: 'Full-length couple portrait in rose ink',
    body: 'Head to toe, outfit and all, for couples, bridal parties, and the best-dressed guests of the night.' },
  { title: 'Event Montages', time: 'One piece, the whole event', art: 'vendexconcert-26-06-27-vendex-concertsketch', alt: 'Double-page concert montage',
    body: 'Rather than capturing a single moment, we compose one illustration from an event’s most memorable moments, capturing its energy, atmosphere, and story.' },
];

export default function LiveEvents() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 120);
  }, [hash]);

  return (
    <>
      <section className="page-head">
        <div className="narrow">
          <Reveal><Kicker className="center">Live Events</Kicker></Reveal>
          <Reveal delay={1}><h1>Fashion portraits, <em>drawn live.</em></h1></Reveal>
          <Reveal delay={2}><p className="lede">Custom, hand-drawn portraits in ink, ink wash, and alcohol marker: elegant keepsakes guests are excited to keep and share, and a live performance that becomes part of your event.</p></Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="offers">
            {OFFERS.map((o, i) => (
              <Reveal key={o.title} className="offer" delay={i}>
                <div className="offer__art"><Cutout slug={o.art} alt={o.alt} tilt={[-1.5, 1.2, -0.8][i]} /></div>
                <h3>{o.title}</h3>
                <p className="offer__time">{o.time}</p>
                <p>{o.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-burgundy on-dark deckle-top deckle-bottom">
        <div className="wrap">
          <Reveal><Kicker>The details</Kicker></Reveal>
          <div className="facts">
            <Reveal className="fact">
              <h3>Investment</h3>
              <div className="fact__big">$300<span style={{ fontSize: '.35em', marginLeft: '.3em' }}>/ hour</span></div>
              <p style={{ marginTop: '1rem' }}>Starting rate · minimum booking two hours. Materials and assistant included.</p>
            </Reveal>
            <Reveal className="fact" delay={1}>
              <h3>Capacity</h3>
              <ul>
                <li>Individual portrait: 5–10 min each</li>
                <li>Couple portrait: 12–15 min each</li>
                <li>Book one artist, or both Matt &amp; Jam</li>
              </ul>
            </Reveal>
            <Reveal className="fact" delay={2}>
              <h3>Perfect for</h3>
              <ul>
                <li>Weddings &amp; private celebrations</li>
                <li>Brand activations &amp; product launches</li>
                <li>Corporate events</li>
                <li>VIP &amp; private events</li>
              </ul>
            </Reveal>
          </div>
          <Reveal delay={2}><p style={{ marginTop: '2.6rem' }}>Based in Los Angeles. Available for travel.</p></Reveal>
          <Reveal delay={3}><Link to="/contact" className="btn btn--gold">Request a quote <Arrow /></Link></Reveal>
        </div>
      </section>

      <section className="section" id="montages" style={{ scrollMarginTop: 70 }}>
        <div className="wrap">
          <div className="center">
            <Reveal><Kicker className="center">Event montages · scene sketching</Kicker></Reveal>
            <Reveal delay={1}><h2>One drawing, <em>the whole event.</em></h2></Reveal>
            <Reveal delay={2}><p className="lede" style={{ maxWidth: '44rem', margin: '1.4rem auto 0' }}>An artist experiences your event alongside your guests and composes a single piece from its best moments. Flip through what we saw on the night, then the finished drawing.</p></Reveal>
          </div>
          {montages.map((m, i) => <MontageShowcase key={m.id} m={m} flip={i % 2 === 1} />)}
        </div>
      </section>
    </>
  );
}
