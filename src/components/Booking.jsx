import { useState, useRef, useEffect } from 'react';

const SVC_LABELS = {
  'womens-hair': "Women's Hair & Color",
  'mens-cut':    "Men's Cut & Grooming",
  'beard':       'Beard & Shave',
  'skin':        'Skin & Facials',
  'bridal':      'Bridal Package',
  'vip':         'VIP Full Day',
};

const SERVICE_GROUPS = [
  {
    label: 'For Her',
    options: [
      { value: 'womens-hair', label: "Women's Hair & Color" },
      { value: 'bridal', label: 'Bridal Package' },
    ],
  },
  {
    label: 'For Him',
    options: [
      { value: 'mens-cut', label: "Men's Cut & Grooming" },
      { value: 'beard', label: 'Beard & Shave' },
    ],
  },
  {
    label: 'For Everyone',
    options: [
      { value: 'skin', label: 'Skin & Facials' },
      { value: 'vip', label: 'VIP Full Day' },
    ],
  },
];

const TIME_OPTIONS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
].map(t => ({ value: t, label: t }));

export default function Booking({ onToast }) {
  const [fields, setFields] = useState({ name:'', email:'', phone:'', service:'', date:'', time:'', notes:'' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const ref = useRef(null);

  const today = new Date().toISOString().split('T')[0];

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

  const validate = () => {
    const errs = {};
    if (!fields.name.trim())  errs.name    = 'Please enter your full name.';
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      errs.email   = 'Please enter a valid email address.';
    if (!fields.service)      errs.service = 'Please select a service.';
    if (!fields.date)         errs.date    = 'Please select a preferred date.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => { const n = {...er}; delete n[name]; return n; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    const data = {
      id: `LM-${Date.now()}`,
      booked: new Date().toISOString(),
      ...fields,
    };
    try {
      const prev = JSON.parse(localStorage.getItem('kult_bookings') || '[]');
      prev.push(data);
      localStorage.setItem('kult_bookings', JSON.stringify(prev));
    } catch (_) {}

    setTimeout(() => {
      setSubmitting(false);
      const svcLabel = SVC_LABELS[data.service] || data.service;
      const firstName = data.name.split(' ')[0];
      const dateStr = data.date
        ? new Date(data.date + 'T12:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
        : '';
      setSuccess({ firstName, svcLabel, dateStr });
      onToast('✨ Appointment requested! We\'ll be in touch soon.');
    }, 1000);
  };

  const smoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
  };

  return (
    <section id="booking" className="booking-section" aria-labelledby="booking-title" ref={ref}>
      <div className="booking-bg" aria-hidden="true"></div>
      <div className="container">
        <div className="booking-card reveal">
          <div className="booking-left">
            <p className="eyebrow eyebrow--light">Ready for Your Look?</p>
            <h2 id="booking-title" className="sec-title sec-title--white">
              Book Your<br /><em>Session Today</em>
            </h2>
            <p className="booking-sub">
              Reserve your spot with one of our specialists. New clients receive a complimentary
              15-min consultation — for him, her, or anyone.
            </p>
            <ul className="booking-perks">
              {['Services for men & women','Free cancellation up to 24hrs','Choose your preferred stylist','Instant confirmation sent'].map(p => (
                <li key={p}><i className="fas fa-check-circle" aria-hidden="true"></i> {p}</li>
              ))}
            </ul>
            <div className="booking-contact">
              <a href="tel:+15551234567" className="bk-clink"><i className="fas fa-phone-alt" aria-hidden="true"></i> (555) 123-4567</a>
              <a href="mailto:hello@kultsalon.com" className="bk-clink"><i className="fas fa-envelope" aria-hidden="true"></i> hello@kultsalon.com</a>
            </div>
          </div>

          <div className="booking-right">
            {success ? (
              <div className="bk-success">
                <div className="bk-success-icon"><i className="fas fa-check-circle" aria-hidden="true"></i></div>
                <h3>You're all set, {success.firstName}! ✨</h3>
                <p>Your request for <strong>{success.svcLabel}</strong>{success.dateStr ? ` on <strong>${success.dateStr}</strong>` : ''} has been received.</p>
                <p style={{ marginTop:'.5rem', opacity:.7 }}>We'll be in touch within 24 hours to confirm. See you soon!</p>
                <a href="#services" className="btn btn-gold" style={{ marginTop:'1.2rem' }} onClick={e => smoothScroll(e, '#services')}>
                  Explore More Services
                </a>
              </div>
            ) : (
              <form id="booking-form" className="bk-form" noValidate aria-label="Book an appointment" onSubmit={handleSubmit}>
                <div className="bk-row">
                  <Field id="bk-name" label="Full Name" required error={errors.name}>
                    <input type="text" id="bk-name" name="name" placeholder="Your full name" value={fields.name} onChange={handleChange} autoComplete="name" />
                  </Field>
                  <Field id="bk-email" label="Email Address" required error={errors.email}>
                    <input type="email" id="bk-email" name="email" placeholder="you@email.com" value={fields.email} onChange={handleChange} autoComplete="email" />
                  </Field>
                </div>
                <div className="bk-row">
                  <Field id="bk-phone" label="Phone Number">
                    <input type="tel" id="bk-phone" name="phone" placeholder="+1 (555) 000-0000" value={fields.phone} onChange={handleChange} autoComplete="tel" />
                  </Field>
                  <Field id="bk-service" label="Service" required error={errors.service}>
                    <CustomSelect
                      id="bk-service"
                      name="service"
                      value={fields.service}
                      onChange={handleChange}
                      placeholder="Choose a service"
                      groups={SERVICE_GROUPS}
                      nativeSelect
                    />
                  </Field>
                </div>
                <div className="bk-row">
                  <Field id="bk-date" label="Preferred Date" required error={errors.date}>
                    <input type="date" id="bk-date" name="date" min={today} value={fields.date} onChange={handleChange} />
                  </Field>
                  <Field id="bk-time" label="Preferred Time">
                    <CustomSelect
                      id="bk-time"
                      name="time"
                      value={fields.time}
                      onChange={handleChange}
                      placeholder="Choose a time"
                      options={TIME_OPTIONS}
                    />
                  </Field>
                </div>
                <Field id="bk-notes" label="Special Requests">
                  <textarea id="bk-notes" name="notes" rows="3"
                    placeholder="Tell us anything — preferences, allergies, occasions, or your stylist preference…"
                    value={fields.notes} onChange={handleChange}
                  />
                </Field>
                <button type="submit" className="btn btn-gold btn-full" id="bk-submit" disabled={submitting}>
                  <i className="fas fa-calendar-check" aria-hidden="true"></i>
                  <span id="bk-submit-txt">{submitting ? 'Booking…' : 'Confirm My Appointment'}</span>
                </button>
                <p className="bk-privacy"><i className="fas fa-lock" aria-hidden="true"></i> Your information is private and never shared.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, required, error, children }) {
  return (
    <div className={`bk-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id} id={`${id}-label`}>
        {label} {required && <abbr title="required">*</abbr>}
      </label>
      {children}
      {error && <span className="bk-err" role="alert" aria-live="polite">{error}</span>}
    </div>
  );
}

function CustomSelect({ id, name, value, onChange, placeholder, groups, options, nativeSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const flatOptions = groups
    ? groups.flatMap(g => g.options)
    : (options || []);
  const selected = flatOptions.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (val) => {
    onChange({ target: { name, value: val } });
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`bk-select${open ? ' is-open' : ''}${!value ? ' is-placeholder' : ''}`}
    >
      {nativeSelect && (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          tabIndex={-1}
          aria-hidden="true"
          className="bk-select-native"
        >
          <option value="" disabled>{placeholder}</option>
          {flatOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      <button
        type="button"
        id={nativeSelect ? undefined : id}
        className="bk-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen(o => !o)}
      >
        <span className="bk-select-value">{selected?.label || placeholder}</span>
        <i className={`fas fa-chevron-down bk-select-chevron${open ? ' is-open' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <ul className="bk-select-menu" role="listbox" aria-labelledby={`${id}-label`}>
          {groups ? groups.map(group => (
            <li key={group.label} className="bk-select-group" role="presentation">
              <span className="bk-select-group-label" role="presentation">{group.label}</span>
              <ul role="group" aria-label={group.label}>
                {group.options.map(opt => (
                  <li key={opt.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === opt.value}
                      className={`bk-select-option${value === opt.value ? ' is-selected' : ''}`}
                      onClick={() => pick(opt.value)}
                    >
                      {opt.label}
                      {value === opt.value && <i className="fas fa-check" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          )) : flatOptions.map(opt => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={`bk-select-option${value === opt.value ? ' is-selected' : ''}`}
                onClick={() => pick(opt.value)}
              >
                {opt.label}
                {value === opt.value && <i className="fas fa-check" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
