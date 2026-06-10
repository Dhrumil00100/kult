const ITEMS = [
  'Haircut & Style','Men\'s Grooming','Beard Shaping','Balayage & Color',
  'Luxury Facial','Keratin Treatment','Scalp Treatment','Bridal & Events','VIP Experience',
];

export default function Marquee() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i}>
            {item}
          </span>
        )).reduce((acc, el, i) => {
          acc.push(el);
          acc.push(<span key={`dot-${i}`} className="t-dot">✦</span>);
          return acc;
        }, [])}
      </div>
    </div>
  );
}
