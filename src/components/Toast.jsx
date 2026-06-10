import { useEffect, useRef } from 'react';

export default function Toast({ message, onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!message) return;
    timerRef.current = setTimeout(onClose, 6000);
    return () => clearTimeout(timerRef.current);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      id="toast"
      className="toast show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-inner">
        <i className="fas fa-check-circle toast-icon" aria-hidden="true"></i>
        <span id="toast-msg">{message}</span>
      </div>
      <button className="toast-close" id="toast-close" aria-label="Dismiss notification" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}
