import { useEffect, useRef } from 'react';

export default function Contact() {
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

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title" ref={ref}>
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow">Visit Us</p>
          <h2 id="contact-title" className="sec-title">Find KULT</h2>
        </header>

        <div className="contact-grid">
          <div className="contact-info reveal">
            <div className="cinfo-item">
              <div className="cinfo-icon"><i className="fas fa-map-marker-alt" aria-hidden="true"></i></div>
              <div>
                <h3>Our Location</h3>
                <p>104-105 A,Radhe Kishan Villa Complex<br /> opposite Topaz Restaurant, Isanpur, Ahmedabad, Gujarat 382443</p>
              </div>
            </div>
            <div className="cinfo-item">
              <div className="cinfo-icon"><i className="fas fa-clock" aria-hidden="true"></i></div>
              <div>
                <h3>Opening Hours</h3>
                <p>Mon – Fri: 9:00 AM – 7:00 PM<br />Saturday: 8:00 AM – 6:00 PM<br />Sunday: 10:00 AM – 4:00 PM</p>
              </div>
            </div>
            <div className="cinfo-item">
              <div className="cinfo-icon"><i className="fas fa-phone-alt" aria-hidden="true"></i></div>
              <div>
                <h3>Phone</h3>
                <a href="tel:+15551234567" className="cinfo-link">+1 (555) 123-4567</a>
              </div>
            </div>
            <div className="cinfo-item">
              <div className="cinfo-icon"><i className="fas fa-envelope" aria-hidden="true"></i></div>
              <div>
                <h3>Email</h3>
                <a href="mailto:hello@kultsalon.com" className="cinfo-link">hello@kultsalon.com</a>
              </div>
            </div>
            <div className="cinfo-socials">
              <p className="cinfo-social-label">Follow our work</p>
              <div className="socials">
                <a href="#" className="soc-btn" aria-label="Follow on Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="soc-btn" aria-label="Follow on Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="soc-btn" aria-label="Follow on TikTok"><i className="fab fa-tiktok"></i></a>
                <a href="#" className="soc-btn" aria-label="Follow on Pinterest"><i className="fab fa-pinterest-p"></i></a>
              </div>
            </div>
          </div>

          <div className="contact-map reveal">
            <div className="map-placeholder">
              <div className="map-pin-anim" aria-hidden="true">
                <i className="fas fa-map-marker-alt"></i>
                <div className="map-ripple"></div>
              </div>
              <h3>45 Elegance Avenue</h3>
              <p>New York, NY 10001</p>
              <a
                href="https://maps.google.com/?q=45+Elegance+Avenue+New+York+NY"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                <i className="fas fa-directions" aria-hidden="true"></i> Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
