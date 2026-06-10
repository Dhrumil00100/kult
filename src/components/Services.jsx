import { useState, useEffect, useRef } from 'react';

const SERVICES = [
  {
    svc: 'women',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=75&auto=format&fit=crop',
    imgAlt: "Women's hair and color service",
    icon: 'fa-magic',
    name: "Women's Hair & Color",
    desc: "Balayage, highlights, cuts & full-color transformations by our master colorists.",
    items: ['Haircut & Blowout', 'Balayage & Ombré', 'Full Color & Highlights', 'Keratin Treatment'],
    bookVal: 'womens-hair',
  },
  {
    svc: 'men',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=75&auto=format&fit=crop',
    imgAlt: "Men's cut and grooming service",
    icon: 'fa-cut',
    name: "Men's Cut & Grooming",
    desc: "Precision cuts, fades & classic barbering elevated to a luxury experience.",
    items: ['Precision Haircut', 'Skin Fade & Taper', 'Classic Hot Towel Shave', 'Hair & Scalp Treatment'],
    bookVal: 'mens-cut',
  },
  {
    svc: 'men',
    img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=75&auto=format&fit=crop',
    imgAlt: 'Beard shaping and styling service',
    icon: 'fa-user-tie',
    name: 'Beard & Shave',
    desc: 'Expert beard sculpting, shaping & luxury hot-towel shave services.',
    items: ['Beard Sculpt & Shape', 'Straight Razor Shave', 'Beard Conditioning', 'Line-Up & Define'],
    bookVal: 'beard',
  },
  {
    svc: 'both',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=75&auto=format&fit=crop',
    imgAlt: 'Skin and facial treatment service',
    icon: 'fa-spa',
    name: 'Skin & Facials',
    desc: 'Clinical-grade facials & skincare regimens designed for all skin types — men and women.',
    items: ['Signature Glow Facial', "Men's Deep Cleanse Facial", 'Chemical Peel', 'LED Light Therapy'],
    bookVal: 'skin',
  },
  {
    svc: 'both',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=75&auto=format&fit=crop',
    imgAlt: 'Bridal and events service',
    icon: 'fa-crown',
    name: 'Bridal & Events',
    desc: 'Complete wedding-day packages for the whole party — bride, groom & everyone in between.',
    items: ['Bridal Hair & Makeup', "Groom's Cut & Groom", 'Bridal Party Packages', 'Trial Sessions'],
    bookVal: 'bridal',
  },
  {
    svc: 'both',
    img: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=75&auto=format&fit=crop',
    imgAlt: 'VIP full day luxury experience',
    icon: 'fa-gem',
    iconGold: true,
    name: 'VIP Full Day',
    desc: 'The ultimate package for him or her — every service, champagne & total relaxation.',
    items: ['Full Hair Service', 'Facial + Head Massage', 'Manicure & Pedicure', 'Champagne & Refreshments'],
    bookVal: 'vip',
    isVip: true,
    vipLabel: 'Book VIP',
  },
];

const TABS = [
  { label: 'All Services', filter: 'all' },
  { label: 'For Her',      filter: 'women' },
  { label: 'For Him',      filter: 'men' },
  { label: 'Unisex',       filter: 'both' },
];

export default function Services() {
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);

  // Reveal on scroll
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

  const isVisible = (svc) =>
    filter === 'all' || svc === filter || (svc === 'both' && (filter === 'both' || filter === 'men' || filter === 'women'));

  const preSelectService = (val) => {
    const sel = document.getElementById('bk-service');
    if (sel) {
      sel.value = val;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const smoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
  };

  return (
    <section id="services" aria-labelledby="services-title" ref={sectionRef}>
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow">For Everyone</p>
          <h2 id="services-title" className="sec-title">Our Signature Services</h2>
          <p className="sec-sub">
            A complete menu of premium treatments tailored for men and women — because great style has no gender.
          </p>
        </header>

        <div className="svc-tabs reveal" role="tablist" aria-label="Filter services by gender">
          {TABS.map(({ label, filter: f }) => (
            <button
              key={f}
              className={`stab${filter === f ? ' active' : ''}`}
              data-svc-filter={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <article
              key={i}
              className={`svc-card reveal${s.isVip ? ' svc-card--vip' : ''}${!isVisible(s.svc) ? ' svc-hidden' : ''}`}
              tabIndex={isVisible(s.svc) ? 0 : -1}
              data-svc={s.svc}
              aria-hidden={!isVisible(s.svc)}
            >
              <div
                className="svc-img"
                style={{ backgroundImage: `url('${s.img}')` }}
                role="img"
                aria-label={s.imgAlt}
              />
              {s.isVip && <div className="svc-vip-badge">✦ Most Popular</div>}
              <div className="svc-body">
                <div className={`svc-icon${s.iconGold ? ' svc-icon--gold' : ''}`}>
                  <i className={`fas ${s.icon}`} aria-hidden="true"></i>
                </div>
                <h3 className="svc-name">{s.name}</h3>
                <p className="svc-desc">{s.desc}</p>
                <ul className="svc-list" aria-label={`${s.name} services`}>
                  {s.items.map((item, j) => (
                    <li key={j}><i className="fas fa-check" aria-hidden="true"></i> {item}</li>
                  ))}
                </ul>
                <div className="svc-footer">
                  <a
                    href="#booking"
                    className="btn btn-gold-sm"
                    onClick={e => { preSelectService(s.bookVal); smoothScroll(e, '#booking'); }}
                  >
                    {s.vipLabel || 'Book Now'}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
