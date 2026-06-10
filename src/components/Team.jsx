import { useEffect, useRef } from 'react';

const TEAM = [
  {
    img: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80&auto=format&fit=crop',
    alt: 'Marco Reyes — Creative Director & Senior Colorist',
    name: 'Marco Reyes',
    role: 'Creative Director & Senior Colorist',
    bio: '14 years experience. Trained in Milan & London. Specialist in color transformations for all hair types.',
    tags: ['Balayage', 'Color', "Men's Cuts"],
  },
  {
    img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80&auto=format&fit=crop',
    alt: 'James Calloway — Master Barber & Grooming Specialist',
    name: 'James Calloway',
    role: 'Master Barber & Grooming Specialist',
    bio: '10 years experience. Classically trained barber with a modern edge. Expert in fades, tapers, and beard artistry.',
    tags: ['Fades', 'Beard', 'Shave'],
  },
  {
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&face',
    alt: 'Isla James — Head Stylist & Bridal Specialist',
    name: 'Isla James',
    role: 'Head Stylist & Bridal Specialist',
    bio: '9 years experience. Celebrity stylist background. Expert in bridal, editorial looks, and precision cuts for all.',
    tags: ['Bridal', 'Updos', 'Editorial'],
  },
  {
    img: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80&auto=format&fit=crop&face',
    alt: 'Maya Chen — Lead Esthetician & Skin Therapist',
    name: 'Maya Chen',
    role: 'Lead Esthetician & Skin Therapist',
    bio: '8 years experience. Certified dermal clinician. Specializes in anti-aging facials and skin treatments for men & women.',
    tags: ['Facials', 'Peels', "Men's Skin"],
  },
];

export default function Team() {
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
    <section id="team" aria-labelledby="team-title" ref={ref}>
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow">The Experts</p>
          <h2 id="team-title" className="sec-title">Our Master Stylists &amp; Barbers</h2>
          <p className="sec-sub">
            A diverse, internationally trained team — specialists in both men's and women's styling, grooming, and skincare.
          </p>
        </header>

        <div className="team-grid">
          {TEAM.map(({ img, alt, name, role, bio, tags }) => (
            <article className="team-card reveal" key={name}>
              <div className="team-img-wrap">
                <img src={img} alt={alt} width="400" height="480" loading="lazy" />
                <div className="team-social" aria-label={`${name}'s social links`}>
                  <a href="#" aria-label={`${name} on Instagram`}><i className="fab fa-instagram"></i></a>
                  <a href="#" aria-label={`${name} on TikTok`}><i className="fab fa-tiktok"></i></a>
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">{name}</h3>
                <p className="team-role">{role}</p>
                <p className="team-bio">{bio}</p>
                <div className="team-tags">
                  {tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
