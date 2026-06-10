import { useEffect, useRef } from 'react';

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
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

  const smoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
  };

  const feats = [
    { icon: 'fa-certificate', title: 'Certified Masters',    sub: 'Stylists & barbers, internationally trained' },
    { icon: 'fa-leaf',        title: 'Premium Products',     sub: 'Luxury, cruelty-free brands only' },
    { icon: 'fa-lock',        title: 'Private VIP Suites',   sub: 'Available for him, her & everyone' },
    { icon: 'fa-comments',    title: 'Free Consultation',    sub: '15-min complimentary session' },
  ];

  return (
    <section id="about" className="about-section" aria-labelledby="about-title" ref={ref}>
      <div className="container about-wrap">
        <div className="about-imgs reveal">
          <div className="aimg-main">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&auto=format&fit=crop"
              alt="KULT — expert stylist at work"
              width="800" height="600" loading="lazy"
            />
          </div>
          <div className="aimg-accent">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80&auto=format&fit=crop"
              alt="KULT — women's styling session"
              width="500" height="400" loading="lazy"
            />
          </div>
          <div className="aimg-badge" aria-hidden="true">
            <span className="aib-est">Est.</span>
            <strong className="aib-year">2012</strong>
          </div>
          <div className="aimg-award" aria-label="Best Salon NYC 2024">
            <i className="fas fa-award" aria-hidden="true"></i>
            <div><strong>Best Salon</strong><span>NYC 2024</span></div>
          </div>
        </div>

        <div className="about-copy reveal">
          <p className="eyebrow">Our Philosophy</p>
          <h2 id="about-title" className="sec-title sec-title--left">
            A Space for<br />Every Individual
          </h2>
          <p className="about-lead">
            KULT was built on a simple truth — great style belongs to everyone, regardless of gender, background, or identity.
          </p>
          <p className="about-body">
            Since 2012, we've welcomed men and women through our doors with the same level of artistry, care, and premium service.
            Whether it's a precision fade, a balayage transformation, or a luxury facial — you'll leave looking and feeling your best.
          </p>
          <p className="about-body">
            Our internationally trained team uses only the finest products — from Olaplex to La Mer — tailored to your unique hair and skin needs.
          </p>

          <div className="about-feats">
            {feats.map(({ icon, title, sub }) => (
              <div className="afeat" key={title}>
                <div className="afeat-icon"><i className={`fas ${icon}`} aria-hidden="true"></i></div>
                <div>
                  <strong>{title}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="about-actions">
            <a href="#booking" className="btn btn-gold" onClick={e => smoothScroll(e, '#booking')}>Book a Consultation</a>
            <a href="#team"    className="btn btn-outline" onClick={e => smoothScroll(e, '#team')}>Meet the Team</a>
          </div>
        </div>
      </div>
    </section>
  );
}
