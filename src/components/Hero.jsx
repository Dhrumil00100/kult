import { useState, useEffect, useRef } from 'react';

const SLIDES = [
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1920&q=80&auto=format&fit=crop',
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [loadedBgs, setLoadedBgs] = useState({ 0: SLIDES[0] });
  const timerRef = useRef(null);
  const particlesRef = useRef(null);

  // Lazy-load slide backgrounds
  const preloadBg = (idx) => {
    if (loadedBgs[idx]) return;
    const img = new Image();
    img.onload = () => setLoadedBgs(prev => ({ ...prev, [idx]: SLIDES[idx] }));
    img.src = SLIDES[idx];
  };

  const showSlide = (idx) => {
    const next = ((idx % SLIDES.length) + SLIDES.length) % SLIDES.length;
    preloadBg(next);
    setCurrent(next);
    setTimeout(() => preloadBg((next + 1) % SLIDES.length), 800);
  };

  const startAuto = () => {
    timerRef.current = setInterval(() => setCurrent(c => {
      const next = (c + 1) % SLIDES.length;
      preloadBg(next);
      return next;
    }), 6000);
  };

  const stopAuto = () => clearInterval(timerRef.current);

  useEffect(() => {
    setTimeout(() => preloadBg(1), 2000);
    startAuto();
    const onVis = () => document.hidden ? stopAuto() : startAuto();
    document.addEventListener('visibilitychange', onVis);
    return () => { stopAuto(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  // Particles
  useEffect(() => {
    const wrap = particlesRef.current;
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const sz = (Math.random() * 5 + 2).toFixed(1);
      const d  = (Math.random() * 6 + 5).toFixed(1);
      const dl = (Math.random() * 4).toFixed(1);
      p.style.cssText = `width:${sz}px;height:${sz}px;left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*100).toFixed(1)}%;--d:${d}s;--dl:${dl}s`;
      frag.appendChild(p);
    }
    wrap.appendChild(frag);
    return () => { wrap.innerHTML = ''; };
  }, []);

  const smoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero" aria-label="Welcome to KULT">
      <div className="hero-slides" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide${i === current ? ' active' : ''}`}
            style={loadedBgs[i] ? { backgroundImage: `url('${loadedBgs[i]}')` } : {}}
          />
        ))}
      </div>
      <div className="hero-overlay" aria-hidden="true"></div>
      <div className="hero-particles" id="hero-particles" aria-hidden="true" ref={particlesRef}></div>

      <div className="hero-body">
        <p className="hero-eyebrow fade-up">✦ Luxury Salon for Men &amp; Women ✦</p>
        <h1 className="hero-title fade-up">
          Where Style<br /><em>Knows No Limits</em>
        </h1>
        <p className="hero-sub fade-up">
          Transformative hair, grooming &amp; wellness experiences for everyone — crafted by
          master stylists in a refined, welcoming space.
        </p>
        <div className="hero-ctas fade-up">
          <a href="#booking" className="btn btn-gold btn-lg" onClick={e => smoothScroll(e, '#booking')}>
            <i className="fas fa-calendar-check" aria-hidden="true"></i> Book Your Session
          </a>
          <a href="#services" className="btn btn-glass btn-lg" onClick={e => smoothScroll(e, '#services')}>
            Explore Services
          </a>
        </div>
        <div className="hero-stats fade-up" role="list" aria-label="Salon highlights">
          <div className="hstat" role="listitem"><strong>12+</strong><span>Years Excellence</span></div>
          <div className="hstat-sep" aria-hidden="true"></div>
          <div className="hstat" role="listitem"><strong>8,000+</strong><span>Happy Clients</span></div>
          <div className="hstat-sep" aria-hidden="true"></div>
          <div className="hstat" role="listitem"><strong>4.9 ★</strong><span>Average Rating</span></div>
          <div className="hstat-sep" aria-hidden="true"></div>
          <div className="hstat" role="listitem"><strong>20</strong><span>Expert Stylists</span></div>
        </div>
      </div>

      <div className="hero-dots" aria-label="Hero slideshow navigation">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hdot${i === current ? ' active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            data-slide={i}
            onClick={() => { stopAuto(); showSlide(i); startAuto(); }}
          />
        ))}
      </div>

      <a href="#services" className="hero-scroll-cue" aria-label="Scroll to services" onClick={e => smoothScroll(e, '#services')}>
        <span className="scroll-mouse"><span className="scroll-wheel"></span></span>
        <span className="scroll-label">Scroll</span>
      </a>
    </section>
  );
}
