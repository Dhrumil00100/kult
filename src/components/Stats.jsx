import { useEffect, useRef } from 'react';

const STATS = [
  { icon: 'fa-calendar-alt', target: 12,   suffix: '+', label: 'Years of Excellence' },
  { icon: 'fa-users',        target: 8000, suffix: '+', label: 'Happy Clients'        },
  { icon: 'fa-user-tie',     target: 20,   suffix: '',  label: 'Expert Stylists'      },
  { icon: 'fa-star',         target: 35,   suffix: '+', label: 'Signature Services'   },
];

function countUp(el, target) {
  const dur = 1800;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(eased * target);
    el.textContent = target >= 1000
      ? (val >= 1000 ? Math.round(val / 1000) + 'k' : val)
      : val;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target >= 1000 ? Math.round(target / 1000) + 'k' : target;
  };
  requestAnimationFrame(tick);
}

export default function Stats() {
  const ref = useRef(null);

  useEffect(() => {
    const nums = ref.current?.querySelectorAll('.stat-n');
    if (!nums) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        countUp(e.target, parseInt(e.target.dataset.target, 10));
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    nums.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Reveal
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

  return (
    <section className="stats-band" aria-label="Salon achievements" ref={ref}>
      <div className="container stats-grid">
        {STATS.map(({ icon, target, suffix, label }) => (
          <div className="stat reveal" key={label}>
            <i className={`fas ${icon} stat-ico`} aria-hidden="true"></i>
            <div className="stat-num-wrap">
              <span className="stat-n" data-target={target}>0</span>
              {suffix && <span className="stat-suf">{suffix}</span>}
            </div>
            <p className="stat-lbl">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
