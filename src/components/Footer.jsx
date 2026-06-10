import { useState } from 'react';

export default function Footer({ onToast }) {
  const [nlEmail, setNlEmail] = useState('');
  const year = new Date().getFullYear();

  const smoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    const val = nlEmail.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return;
    setNlEmail('');
    onToast("💌 You're on the list! Welcome to the KULT community.");
  };

  return (
    <footer id="site-footer" role="contentinfo">
      <div className="container footer-main">
        <div className="foot-brand">
          <a href="#hero" className="logo foot-logo" aria-label="Back to top" onClick={e => smoothScroll(e, '#hero')}>
            <span className="logo-mark">✦</span>
            <span className="logo-name">KULT</span>
          </a>
          <p className="foot-tagline">Where style knows no limits.<br />Luxury for men &amp; women since 2012.</p>
          <div className="socials">
            <a href="#" className="soc-btn" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" className="soc-btn" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="soc-btn" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
            <a href="#" className="soc-btn" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a>
          </div>
        </div>

        <nav className="foot-nav" aria-label="Footer navigation">
          <div className="foot-col">
            <h4>Services</h4>
            <ul role="list">
              {["Women's Hair & Color", "Men's Cut & Grooming", "Beard & Shave", "Skin & Facials", "Bridal & Events", "VIP Experience"].map(s => (
                <li key={s}><a href="#services" onClick={e => smoothScroll(e, '#services')}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h4>Salon</h4>
            <ul role="list">
              <li><a href="#about"        onClick={e => smoothScroll(e, '#about')}>Our Story</a></li>
              <li><a href="#team"         onClick={e => smoothScroll(e, '#team')}>Meet the Team</a></li>
              <li><a href="#gallery"      onClick={e => smoothScroll(e, '#gallery')}>Portfolio</a></li>
              <li><a href="#testimonials" onClick={e => smoothScroll(e, '#testimonials')}>Reviews</a></li>
              <li><a href="#faq"          onClick={e => smoothScroll(e, '#faq')}>FAQ</a></li>
              <li><a href="#contact"      onClick={e => smoothScroll(e, '#contact')}>Contact &amp; Hours</a></li>
            </ul>
          </div>
          <div className="foot-col foot-col--newsletter">
            <h4>Stay Sharp &amp; Stylish</h4>
            <p>Join our community for grooming tips, style inspiration &amp; exclusive offers for everyone.</p>
            <form id="newsletter-form" className="nl-form" noValidate aria-label="Newsletter signup" onSubmit={handleNewsletter}>
              <div className="nl-input-wrap">
                <input
                  type="email"
                  id="nl-email"
                  placeholder="your@email.com"
                  aria-label="Email address for newsletter"
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe to newsletter">

                </button>
              </div>
              <p className="nl-note"><i className="fas fa-lock" aria-hidden="true"></i> No spam. Unsubscribe anytime.</p>
            </form>
          </div>
        </nav>
      </div>

      <div className="foot-bottom">
        <p>&copy; {year} KULT. All rights reserved.</p>
        <p>Crafted with <span className="heart" aria-label="love">♥</span> in New York</p>
      </div>
    </footer>
  );
}
