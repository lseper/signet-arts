/* Signet Arts — small progressive enhancements. Everything works without JS. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');

  // Header: tighten on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.mobile-menu a').forEach(a =>
      a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }

  // Scroll reveals (fade-up, brush sweep, painted underline)
  const revealables = document.querySelectorAll('.reveal, .reveal-brush, .painted, [data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(el => io.observe(el));

    // Only play painted-edge videos while on screen
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else { v.pause(); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('video[data-autoplay]').forEach(v => vio.observe(v));
  } else {
    revealables.forEach(el => el.classList.add('is-visible'));
  }

  // Duplicate marquee contents for a seamless loop
  document.querySelectorAll('.marquee__track').forEach(track => {
    track.innerHTML += track.innerHTML;
    [...track.children].slice(track.children.length / 2).forEach(c => c.setAttribute('aria-hidden', 'true'));
  });

  // Gallery: filters + lightbox
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    const items = [...gallery.querySelectorAll('.gallery__item')];
    const buttons = document.querySelectorAll('.gallery-filters button');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.filter;
      items.forEach(it => { it.hidden = f !== 'all' && !it.dataset.cat.split(' ').includes(f); });
    }));

    const lb = document.querySelector('.lightbox');
    const lbImg = lb.querySelector('img');
    const lbTitle = lb.querySelector('.lightbox__title');
    const lbCount = lb.querySelector('.lightbox__count');
    let current = 0, lastFocus = null;
    const visible = () => items.filter(i => !i.hidden);
    const show = (idx) => {
      const list = visible();
      current = (idx + list.length) % list.length;
      const it = list[current];
      lbImg.src = it.dataset.full;
      lbImg.alt = it.querySelector('img').alt;
      lbTitle.textContent = it.querySelector('figcaption span').textContent;
      lbCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
    };
    const open = (it) => {
      lastFocus = document.activeElement;
      show(visible().indexOf(it));
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox__close').focus();
    };
    const close = () => {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    items.forEach(it => {
      it.tabIndex = 0;
      it.addEventListener('click', () => open(it));
      it.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); } });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
    lb.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lightbox__stage')) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // Contact form — until a form service is connected, compose an email to the studio.
  const form = document.querySelector('form.form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const services = d.getAll('service').join(', ') || '—';
      const body = [
        `Name: ${d.get('name')}`,
        `Email: ${d.get('email')}`,
        `Phone: ${d.get('phone') || '—'}`,
        `Event type: ${d.get('event')}`,
        `Date: ${d.get('date') || 'TBD'}`,
        `Location: ${d.get('location') || '—'}`,
        `Guest count: ${d.get('guests') || '—'}`,
        `Interested in: ${services}`,
        `How they found us: ${d.get('source') || '—'}`,
        '',
        d.get('message') || ''
      ].join('\n');
      const subject = `Booking enquiry — ${d.get('event')} ${d.get('date') ? '(' + d.get('date') + ')' : ''}`.trim();
      window.location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      form.classList.add('sent');
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
