import { useEffect, useRef, useState, useCallback } from 'react';

export default function Lightbox({ items, startIndex, onClose }) {
  const [cur, setCur] = useState(startIndex ?? 0);
  const closeRef = useRef(null);

  useEffect(() => {
    setCur(startIndex ?? 0);
  }, [startIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => { document.body.style.overflow = ''; };
  }, []);

  const goTo = useCallback((idx) => {
    const len = items.length;
    setCur(((idx % len) + len) % len);
  }, [items]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  goTo(cur - 1);
      if (e.key === 'ArrowRight') goTo(cur + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cur, goTo, onClose]);

  // Touch swipe
  const txRef = useRef(0);
  const onTouchStart = (e) => { txRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const d = txRef.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) goTo(d > 0 ? cur + 1 : cur - 1);
  };

  if (!items || items.length === 0) return null;

  const item = items[cur];
  const hiResSrc = item.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
  const caption = item.label;

  return (
    <div
      id="lightbox"
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className="lb-close" id="lb-close" aria-label="Close image viewer" onClick={onClose} ref={closeRef}>
        <i className="fas fa-times"></i>
      </button>
      <button className="lb-prev" id="lb-prev" aria-label="Previous image" onClick={() => goTo(cur - 1)}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="lb-next" id="lb-next" aria-label="Next image" onClick={() => goTo(cur + 1)}>
        <i className="fas fa-chevron-right"></i>
      </button>
      <div className="lb-img-wrap">
        <img id="lb-img" src={hiResSrc} alt={item.alt} />
        <p className="lb-caption" id="lb-caption">{caption}</p>
      </div>
    </div>
  );
}
