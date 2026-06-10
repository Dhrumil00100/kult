import { useState, useCallback, useEffect } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import About from './components/About';
import Stats from './components/Stats';
import Team from './components/Team';
import Gallery from './components/Gallery';
import Lightbox from './components/Lightbox';
import Testimonials from './components/Testimonials';
import Booking from './components/Booking';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Toast from './components/Toast';
export default function App() {
  const [toastMsg, setToastMsg] = useState('');
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0 });

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMsg('');
  }, []);

  const openLightbox = useCallback((index, items) => {
    setLightbox({ open: true, items, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(lb => ({ ...lb, open: false }));
  }, []);

  // Update --hh CSS variable on resize
  useEffect(() => {
    const update = () => {
      const h = document.getElementById('site-header')?.offsetHeight || 76;
      document.documentElement.style.setProperty('--hh', `${h}px`);
    };
    let t;
    const debounced = () => { clearTimeout(t); t = setTimeout(update, 120); };
    window.addEventListener('resize', debounced);
    update();
    return () => window.removeEventListener('resize', debounced);
  }, []);

  // Card tilt effect (desktop, no-touch, no-reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    const applyTilt = () => {
      document.querySelectorAll('.svc-card, .team-card').forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width  - 0.5) * 7;
          const y = ((e.clientY - r.top)  / r.height - 0.5) * 7;
          card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
        };
        const onLeave = () => {
          card.style.transition = 'transform 0.5s ease';
          card.style.transform = '';
          setTimeout(() => { card.style.transition = ''; }, 500);
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        card._tiltCleanup = () => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        };
      });
    };

    // Apply after sections render
    const t = setTimeout(applyTilt, 500);
    return () => {
      clearTimeout(t);
      document.querySelectorAll('.svc-card, .team-card').forEach(card => card._tiltCleanup?.());
    };
  }, []);

  return (
    <>
      <Preloader />

      <Header />

      <main id="main-content">
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Stats />
        <Team />
        <Gallery onOpenLightbox={openLightbox} />
        <Testimonials />
        <Booking onToast={showToast} />
        <FAQ />
        <Contact />
      </main>

      <Footer onToast={showToast} />

      {/* Floating book button (mobile) */}
      <a href="#booking" className="float-book" aria-label="Book appointment"
        onClick={e => {
          e.preventDefault();
          const target = document.querySelector('#booking');
          if (!target) return;
          const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
        }}
      >
        <i className="fas fa-calendar-plus" aria-hidden="true"></i>
        <span>Book Now</span>
      </a>

      {toastMsg && <Toast message={toastMsg} onClose={dismissToast} />}

      {lightbox.open && (
        <Lightbox
          items={lightbox.items}
          startIndex={lightbox.index}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
