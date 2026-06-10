import { useState, useEffect, useRef } from 'react';

const FAQS = [
  {
    q: 'Is KULT really for both men and women?',
    a: 'Absolutely. KULT is a fully unisex luxury salon. We welcome men, women, and everyone — with dedicated services for each. Whether you need a precision fade or a balayage, our team has you fully covered.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking 1–2 weeks ahead, especially for weekends and bridal services. For same-week appointments, call us at (555) 123-4567 and we\'ll do our best to fit you in.',
  },
  {
    q: 'Do you offer consultations?',
    a: 'Yes! All new clients — men and women — receive a complimentary 15-minute consultation before their first service. We want to understand your style goals and deliver exactly what you\'re after.',
  },
  {
    q: 'What products do you use?',
    a: 'We use premium, cruelty-free products including Olaplex, Redken, American Crew (men\'s), La Mer skincare, and more — all selected for performance, safety, and the best possible results.',
  },
  {
    q: 'Can couples or families book together?',
    a: "Absolutely! We love when couples or families come in together. We can often schedule simultaneous appointments so no one is left waiting. Just mention it when booking and we'll coordinate everything.",
  },
  {
    q: 'Can I cancel or reschedule?',
    a: 'Yes! Free cancellation or rescheduling up to 24 hours before your appointment. Just call or email us as early as possible so we can offer your slot to other clients.',
  },
  {
    q: 'Do you have a loyalty membership?',
    a: 'Yes! Our KULT Loyalty Club gives you 10% off all services, priority booking, exclusive events, and complimentary quarterly treatments — available to all clients, men and women.',
  },
  {
    q: 'Do you offer gift cards?',
    a: 'Yes! KULT gift cards are available in any amount — the perfect gift for anyone. Purchase in-salon or call us to arrange delivery. They never expire and work on any service.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
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

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  const col1 = FAQS.slice(0, 4);
  const col2 = FAQS.slice(4);

  const renderItem = (faq, i) => (
    <div className="faq-item reveal" key={i}>
      <button
        className="faq-q"
        aria-expanded={openIdx === i}
        onClick={() => toggle(i)}
      >
        <span>{faq.q}</span>
        <i className="fas fa-plus faq-icon" aria-hidden="true"></i>
      </button>
      <div className={`faq-a${openIdx === i ? ' open' : ''}`} role="region">
        <div className="faq-a-inner">
          <p>{faq.a}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="faq" aria-labelledby="faq-title" ref={ref}>
      <div className="container faq-wrap">
        <header className="sec-head reveal">
          <p className="eyebrow">Got Questions?</p>
          <h2 id="faq-title" className="sec-title">Frequently Asked</h2>
          <p className="sec-sub">Everything you need to know before your visit — for men and women alike.</p>
        </header>

        <div className="faq-grid">
          <div className="faq-col">{col1.map((faq, i) => renderItem(faq, i))}</div>
          <div className="faq-col">{col2.map((faq, i) => renderItem(faq, i + 4))}</div>
        </div>
      </div>
    </section>
  );
}
