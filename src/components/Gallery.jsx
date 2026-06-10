import { useState, useEffect, useRef, useCallback } from 'react';

export const GALLERY_ITEMS = [
  { cat: 'womens', src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=75&auto=format&fit=crop', alt: 'Balayage hair transformation',            label: 'Balayage',             cls: '' },
  { cat: 'mens',   src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=75&auto=format&fit=crop', alt: "Men's precision fade haircut",           label: 'Precision Fade',       cls: 'gitem-tall' },
  { cat: 'mens',   src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=75&auto=format&fit=crop', alt: 'Expert beard sculpting and shaping',     label: 'Beard Sculpt',         cls: '' },
  { cat: 'womens', src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=75&auto=format&fit=crop',   alt: "Stunning women's hair color transformation", label: 'Color Transformation', cls: 'gitem-wide' },
  { cat: 'skin',   src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=75&auto=format&fit=crop', alt: 'Radiant skin after glow facial',         label: 'Glow Facial',          cls: '' },
  { cat: 'mens',   src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=75&auto=format&fit=crop', alt: 'Classic hot towel shave',                label: 'Hot Towel Shave',      cls: '' },
  { cat: 'bridal', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=75&auto=format&fit=crop', alt: 'Elegant bridal updo',                    label: 'Bridal Updo',          cls: 'gitem-tall' },
  { cat: 'bridal', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=75&auto=format&fit=crop', alt: "Groom's wedding day styling",            label: "Groom's Style",        cls: '' },
];

const FILTERS = [
  { label: 'All Work', filter: 'all' },
  { label: "Men's",   filter: 'mens' },
  { label: "Women's", filter: 'womens' },
  { label: 'Skin',    filter: 'skin' },
  { label: 'Bridal',  filter: 'bridal' },
];

export default function Gallery({ onOpenLightbox }) {
  const [activeFilter, setActiveFilter] = useState('all');
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

  const isVisible = (cat) => activeFilter === 'all' || cat === activeFilter;

  const visibleItems = GALLERY_ITEMS.filter(item => isVisible(item.cat));

  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-title" ref={ref}>
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow">Our Work</p>
          <h2 id="gallery-title" className="sec-title">The KULT Portfolio</h2>
          <p className="sec-sub">Transformations for every individual — his, hers, and everyone's.</p>
        </header>

        <div className="gallery-filters reveal" role="tablist" aria-label="Filter gallery by category">
          {FILTERS.map(({ label, filter }) => (
            <button
              key={filter}
              className={`gf-btn${activeFilter === filter ? ' active' : ''}`}
              data-filter={filter}
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="gallery-grid" id="gallery-grid">
          {GALLERY_ITEMS.map((item, i) => {
            const visible = isVisible(item.cat);
            const visIdx = visibleItems.indexOf(item);
            return (
              <button
                key={i}
                className={`gitem reveal${item.cls ? ' ' + item.cls : ''}${!visible ? ' filtered-out' : ''}`}
                data-cat={item.cat}
                aria-label={`View ${item.label}`}
                aria-hidden={!visible}
                tabIndex={visible ? 0 : -1}
                onClick={() => visible && onOpenLightbox(visIdx, visibleItems)}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
                <div className="gitem-overlay">
                  <span><i className="fas fa-expand-alt" aria-hidden="true"></i> {item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
