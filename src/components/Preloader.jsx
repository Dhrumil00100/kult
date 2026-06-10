import { useEffect, useRef } from 'react';

export default function Preloader() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    document.body.style.overflow = 'hidden';

    const hide = () => {
      el.classList.add('out');
      document.body.style.overflow = '';
      const cleanup = () => el.remove();
      el.addEventListener('transitionend', cleanup, { once: true });
      setTimeout(cleanup, 1000);
    };

    const gracePeriod = 600;
    const maxWait = 1400;
    const start = performance.now();

    const schedule = () => {
      const elapsed = performance.now() - start;
      const delay = Math.max(0, Math.min(gracePeriod, maxWait - elapsed));
      setTimeout(hide, delay);
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
      setTimeout(hide, maxWait);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div id="preloader" aria-hidden="true" ref={ref}>
      <div className="pl-inner">
        <div className="pl-logo">
          <span className="pl-l">K</span>
          <span className="pl-brand">ULT</span>
        </div>
        <div className="pl-bar">
          <div className="pl-fill"></div>
        </div>
        <p className="pl-tag">Luxury for Everyone</p>
      </div>
    </div>
  );
}
