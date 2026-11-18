import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import './styles/global.css';
import { Footer, Header } from './components/Chrome';
import Home from './pages/Home';
import About from './pages/About';
import LiveEvents from './pages/LiveEvents';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';

const TITLES: Record<string, string> = {
  '/': 'Signet Arts · Live Fashion Portraits in Los Angeles',
  '/about': 'About · Signet Arts',
  '/live-events': 'Live Events · Signet Arts',
  '/portfolio': 'Portfolio · Signet Arts',
  '/contact': 'Contact · Signet Arts',
};

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.title = TITLES[pathname] ?? 'Signet Arts';
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <section className="page-head"><div className="narrow">
      <h1>Page <em>not found.</em></h1>
      <p className="lede">That page has wandered off the sketchbook.</p>
      <Link className="btn" to="/">Return home</Link>
    </div></section>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <RouteEffects />
      <div id="app-shell">
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/live-events" element={<LiveEvents />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/gallery" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
