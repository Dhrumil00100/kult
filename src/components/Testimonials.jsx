import { useState, useEffect, useRef, useCallback } from 'react';

const REVIEWS = [
  {
    name: 'Marcus T.',
    svc: "Men's Cut & Hot Towel Shave",
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&auto=format&fit=crop&face',
    quote: "Best fade I've ever had — period. The attention to detail is unlike any barbershop I've been to. Clean, premium atmosphere and the hot towel shave was incredible.",
  },
  {
    name: 'Sophia L.',
    svc: 'Balayage & Treatment',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop&face',
    quote: "KULT completely transformed my hair. The balayage was absolutely flawless — I've never received so many compliments. Pure luxury from start to finish.",
  },
  {
    name: 'David K.',
    svc: "Men's Deep Cleanse Facial",
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop&face',
    quote: "Finally a salon that takes men as seriously as women. The facial was genuinely one of the best experiences I've had. My skin has never looked better.",
  },
  {
    name: 'Rachel & Tom W.',
    svc: 'Bridal & Groom Package',
    img: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=100&q=80&auto=format&fit=crop&face',
    quote: "We came together for our wedding prep — the bridal package for me and the groom's grooming for Tom. Both of us were absolutely blown away. Perfect day!",
  },
  {
    name: 'James A.',
    svc: 'Regular Family Client — 3 Years',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&auto=format&fit=crop&face',
    quote: "I bring my whole family here — my wife for color, myself for a cut and beard, and even my teenage son. Everyone is treated like a VIP. Wouldn't go anywhere else.",
  },
];

const GAP = 24;

export default function Testimonials() {
  const [cur, setCur] = useState(0);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const txRef = useRef(0);
  const sectionRef = useRef(null);

  const perView = useCallback(() => {
    const w = viewportRef.current?.offsetWidth || 0;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }, []);

  const totalGroups = useCallback(() => Math.ceil(REVIEWS.length / perView()), [perView]);

  const calcOffset = useCallback((idx) => {
    const pv = perView();
    const vw = viewportRef.current?.offsetWidth || 0;
    const cardW = (vw - GAP * (pv - 1)) / pv;
    return idx * (cardW + GAP);
  }, [perView]);

  const goTo = useCallback((idx) => {
    const g = totalGroups();
    const next = ((idx % g) + g) % g;
    setCur(next);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${calcOffset(next)}px)`;
    }
  }, [totalGroups, calcOffset]);

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => setCur(c => {
      const g = Math.ceil(REVIEWS.length / perView());
      const next = (c + 1) % g;
      if (trackRef.current) {
        const pv = perView();
        const vw = viewportRef.current?.offsetWidth || 0;
        const cardW = (vw - GAP * (pv - 1)) / pv;
        trackRef.current.style.transform = `translateX(-${next * (cardW + GAP)}px)`;
      }
      return next;
    }), 5500);
  }, [perView]);

  const stopAuto = useCallback(() => clearInterval(timerRef.current), []);

  useEffect(() => {
    goTo(0);
    startAuto();
    const onResize = () => { setCur(0); goTo(0); };
    const debouncedResize = debounce(onResize, 280);
    window.addEventListener('resize', debouncedResize);
    return () => { stopAuto(); window.removeEventListener('resize', debouncedResize); };
  }, []);

  // Pause on hover
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    sec.addEventListener('mouseenter', stopAuto);
    sec.addEventListener('mouseleave', startAuto);
    return () => {
      sec.removeEventListener('mouseenter', stopAuto);
      sec.removeEventListener('mouseleave', startAuto);
    };
  }, [stopAuto, startAuto]);

  // Reveal
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sibs = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = sibs.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), Math.min(idx * 85, 350));
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const dots = Array.from({ length: Math.ceil(REVIEWS.length / 3) }, (_, i) => i);

  return (
    <section id="testimonials" className="testi-section" aria-labelledby="testi-title" ref={sectionRef}>
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow">Client Love</p>
          <h2 id="testi-title" className="sec-title">What Our Clients Say</h2>
          <p className="sec-sub">Real words from our community — men and women who trust KULT with their look.</p>
        </header>

        <div className="testi-wrap" role="region" aria-label="Testimonials carousel">
          <div className="testi-viewport" ref={viewportRef}>
            <div className="testi-track" id="testi-track" ref={trackRef}
              onTouchStart={e => { txRef.current = e.touches[0].clientX; stopAuto(); }}
              onTouchEnd={e => {
                const d = txRef.current - e.changedTouches[0].clientX;
                if (Math.abs(d) > 45) d > 0 ? goTo(cur + 1) : goTo(cur - 1);
                startAuto();
              }}
            >
              {REVIEWS.map(({ name, svc, img, quote }) => (
                <article className="tcard" key={name} aria-label={`Review by ${name}`}>
                  <div className="tcard-top">
                    <div className="tcard-stars" aria-label="5 out of 5 stars">★★★★★</div>
                    <img src={img} alt={name} className="tcard-avatar" width="52" height="52" loading="lazy" />
                  </div>
                  <blockquote>"{quote}"</blockquote>
                  <footer>
                    <cite className="tcard-name">{name}</cite>
                    <span className="tcard-svc">{svc}</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          <div className="testi-controls">
            <button className="tc-btn" id="testi-prev" aria-label="Previous review"
              onClick={() => { stopAuto(); goTo(cur - 1); startAuto(); }}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="tc-dots" id="tc-dots" role="tablist" aria-label="Review navigation">
              {dots.map(i => (
                <button
                  key={i}
                  className={`tc-dot${i === cur ? ' active' : ''}`}
                  role="tab"
                  aria-label={`Review page ${i + 1}`}
                  aria-selected={i === cur}
                  onClick={() => { stopAuto(); goTo(i); startAuto(); }}
                />
              ))}
            </div>
            <button className="tc-btn" id="testi-next" aria-label="Next review"
              onClick={() => { stopAuto(); goTo(cur + 1); startAuto(); }}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="trust-strip reveal">
          {[
            { icon: 'fa-shield-alt', text: '100% Satisfaction Guaranteed' },
            { icon: 'fa-venus-mars', text: 'Welcoming for Everyone' },
            { icon: 'fa-clock',      text: 'Always On Time' },
            { icon: 'fa-star',       text: 'Rated 4.9 / 5 on Google' },
          ].map(({ icon, text }) => (
            <div className="trust-item" key={text}>
              <i className={`fas ${icon}`} aria-hidden="true"></i>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
