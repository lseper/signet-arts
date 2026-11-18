import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { logoSrc } from '../lib/media';
import { contact } from '../data/content';

const LEFT = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/live-events', label: 'Live Events' }];
const RIGHT = [{ to: '/portfolio', label: 'Portfolio' }, { to: '/contact', label: 'Contact' }];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => { document.body.classList.toggle('menu-open', open); }, [open]);

  const link = (l: { to: string; label: string }) => (
    <li key={l.to}><NavLink to={l.to} end={l.to === '/'}>{l.label}</NavLink></li>
  );
  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="nav wrap" aria-label="Primary">
          <ul className="nav__links">{LEFT.map(link)}</ul>
          <Link to="/" className="brand" aria-label="Signet Arts, home"><img src={logoSrc} alt="Signet Arts" width="320" height="44" /></Link>
          <ul className="nav__links nav__links--right">{RIGHT.map(link)}</ul>
          <button className="nav__toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>Menu <span className="bars" /></button>
        </nav>
      </header>
      <div className="mobile-menu" id="mobile-menu" aria-hidden={!open}>
        {[...LEFT, ...RIGHT].map((l) => <NavLink key={l.to} to={l.to} end={l.to === '/'} tabIndex={open ? 0 : -1}>{l.label}</NavLink>)}
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer deckle-top on-dark">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__brand">
            <img className="footer__logo" src={logoSrc} alt="Signet Arts" />
            <p style={{ marginTop: '1.4rem', maxWidth: '24rem' }}>Live fashion portraits and event scene sketching by Matt Utsunomiya &amp; Jam Clostre. Hand-drawn in ink, ink wash, and alcohol marker across Los Angeles.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/live-events">Live Events</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/contact">Book a date</Link></li>
            </ul>
          </div>
          <div>
            <h4>Correspond</h4>
            <ul>
              <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              {contact.instagram.map((i) => <li key={i.handle}><a href={i.url} target="_blank" rel="noopener noreferrer">@{i.handle}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} Signet Arts · Los Angeles, California</span>
          <span>Original art, made in real time, on location.</span>
        </div>
      </div>
    </footer>
  );
}
