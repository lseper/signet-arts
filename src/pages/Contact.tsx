import { useState, type FormEvent } from 'react';
import { contact } from '../data/content';
import { Arrow, Kicker, Media, PenNib, Reveal } from '../components/ui';

const SERVICES = ['Individual portraits', 'Couple & full-length', 'Event montage', 'Brand activation', 'Not sure yet'];
const OCCASIONS = ['Wedding', 'Engagement or shower', 'Quinceañera', 'Bar / Bat Mitzvah', 'Birthday or private party', 'Corporate event', 'Brand activation or launch', 'Concert or festival', 'Something else'];

export default function Contact() {
  const [sent, setSent] = useState(false);

  // Until a form service is connected, compose an email to the studio.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.reportValidity()) return;
    const d = new FormData(f);
    const body = [
      `Name: ${d.get('name')}`, `Email: ${d.get('email')}`, `Phone: ${d.get('phone') || '—'}`,
      `Occasion: ${d.get('event')}`, `Date: ${d.get('date') || 'TBD'}`, `Venue: ${d.get('location') || '—'}`,
      `Guest count: ${d.get('guests') || '—'}`, `Interested in: ${d.getAll('service').join(', ') || '—'}`,
      `Found us via: ${d.get('source') || '—'}`, '', String(d.get('message') || ''),
    ].join('\n');
    const subject = `Booking enquiry: ${d.get('event')}${d.get('date') ? ` (${d.get('date')})` : ''}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="section" style={{ paddingTop: 'clamp(2.5rem, 6vw, 5rem)' }}>
      <div className="wrap contact">
        <div className="contact__art">
          <Reveal><div className="painted painted--tall"><Media slug="artistphotos-26-09-29-fete-mattlockedin" alt="Matt, pen in hand, drawing under a clip light" /></div></Reveal>
          <Reveal delay={1}><p className="contact__note"><PenNib /> Pen in hand, ready when you are.</p></Reveal>
        </div>
        <div>
          <Reveal><Kicker>Get in touch</Kicker></Reveal>
          <Reveal delay={1}><h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5.4rem)', marginBottom: '1.4rem' }}>Let’s draw <em>your</em> event.</h1></Reveal>
          <Reveal delay={2}><p className="lede">Planning something in Los Angeles, or beyond? Tell us about it and we’ll come back with availability and a tailored proposal.</p></Reveal>
          <Reveal delay={3}>
            <div className="contact__direct">
              <div>Write to us<a href={`mailto:${contact.email}`}>{contact.email}</a></div>
              {contact.instagram.map((i) => <div key={i.handle}>Instagram<a href={i.url} target="_blank" rel="noopener noreferrer">@{i.handle}</a></div>)}
            </div>
          </Reveal>

          {sent ? (
            <div style={{ padding: '2rem 0' }}>
              <h2>Thank you, <em>truly.</em></h2>
              <p className="lede" style={{ marginTop: '1.2rem' }}>Your email app should have opened with your enquiry ready to send. If it didn’t, write to us at <a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
            </div>
          ) : (
            <Reveal>
              <form className="form" onSubmit={submit} noValidate>
                <div className="field"><label htmlFor="f-name">Your name</label><input id="f-name" name="name" autoComplete="name" required placeholder="First & last" /></div>
                <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
                <div className="field"><label htmlFor="f-phone">Phone (optional)</label><input id="f-phone" name="phone" type="tel" autoComplete="tel" /></div>
                <div className="field"><label htmlFor="f-event">Occasion</label>
                  <select id="f-event" name="event" required defaultValue=""><option value="" disabled>Select one</option>{OCCASIONS.map((o) => <option key={o}>{o}</option>)}</select>
                </div>
                <div className="field"><label htmlFor="f-date">Event date</label><input id="f-date" name="date" type="date" /></div>
                <div className="field"><label htmlFor="f-guests">Guest count</label><input id="f-guests" name="guests" inputMode="numeric" placeholder="Approximate" /></div>
                <div className="field field--full"><label htmlFor="f-location">Venue &amp; city</label><input id="f-location" name="location" placeholder="e.g. Hotel Bel-Air, Los Angeles" /></div>
                <fieldset className="field field--full">
                  <legend>Interested in</legend>
                  <div className="chips">{SERVICES.map((s) => <label key={s}><input type="checkbox" name="service" value={s} /><span>{s}</span></label>)}</div>
                </fieldset>
                <div className="field field--full"><label htmlFor="f-message">Tell us about your vision</label><textarea id="f-message" name="message" rows={4} placeholder="Theme, palette, timeline, anything you’re dreaming of…" /></div>
                <div className="field field--full"><label htmlFor="f-source">How did you find us?</label><input id="f-source" name="source" placeholder="Instagram, a planner, an event you attended…" /></div>
                <div className="form__foot">
                  <p>Every enquiry is read personally by Matt or Jam.</p>
                  <button className="btn btn--solid" type="submit">Send enquiry <Arrow /></button>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
