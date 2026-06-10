import { useState, useEffect, useCallback } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 55);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const spy = () => {
      const offset = window.scrollY + window.innerHeight * 0.35;
      let active = '';
      sections.forEach(sec => { if (offset >= sec.offsetTop) active = sec.id; });
      setActiveSection(active);
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
    return () => window.removeEventListener('scroll', spy);
  }, []);

  // Close menu on escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const smoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
    closeMenu();
  };

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#about',    label: 'About'    },
    { href: '#team',     label: 'Team'     },
    { href: '#gallery',  label: 'Gallery'  },
    { href: '#testimonials', label: 'Reviews' },
    { href: '#faq',      label: 'FAQ'      },
    { href: '#contact',  label: 'Contact'  },
  ];

  const mobIcons = ['fa-cut','fa-heart','fa-users','fa-images','fa-star','fa-question-circle','fa-map-marker-alt'];

  return (
    <header id="site-header" className={scrolled ? 'scrolled' : ''} role="banner">
      <nav className="nav-wrap" role="navigation" aria-label="Main navigation">
        <a href="#hero" className="logo" aria-label="KULT — Home" onClick={e => smoothScroll(e, '#hero')}>
          <span className="logo-mark">✦</span>
          <span className="logo-name">KULT</span>
        </a>

        <ul className="nav-links" role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`nav-link${activeSection === href.slice(1) ? ' active' : ''}`}
                onClick={e => smoothScroll(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <a href="tel:+15551234567" className="nav-phone" aria-label="Call us">
            <i className="fas fa-phone-alt" aria-hidden="true"></i>
            <span>(555) 123-4567</span>
          </a>
          <a href="#booking" className="btn btn-gold nav-book" onClick={e => smoothScroll(e, '#booking')}>Book Now</a>
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            id="hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`} id="mobile-nav" aria-hidden={!menuOpen}>
        <div className="mobile-nav-inner">
          <ul role="list">
            {navLinks.map(({ href, label }, i) => (
              <li key={href}>
                <a href={href} className="mob-link" onClick={e => smoothScroll(e, href)}>
                  <i className={`fas ${mobIcons[i]}`} aria-hidden="true"></i> {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#booking" className="btn btn-gold mob-book" onClick={e => smoothScroll(e, '#booking')}>Book Appointment</a>
          <div className="mob-contact">
            <a href="tel:+15551234567"><i className="fas fa-phone-alt" aria-hidden="true"></i> (555) 123-4567</a>
            <a href="mailto:hello@kultsalon.com"><i className="fas fa-envelope" aria-hidden="true"></i> hello@kultsalon.com</a>
          </div>
          <div className="mob-socials">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
            <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a>
          </div>
        </div>
      </div>
    </header>
  );
}
