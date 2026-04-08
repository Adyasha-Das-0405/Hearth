import { IMPORTANCE_OPTIONS } from '../../constants';
import { formatRange } from '../../utils/dateUtils';

export default function EventDetailModal({ event, onClose }) {
  const imp = IMPORTANCE_OPTIONS.find((i) => i.value === event.importance);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="detail-modal">
        <button className="detail-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Importance badge */}
        <div className={`importance-badge ${imp.cls}`}>
          {imp.label}
        </div>

        {/* Title + date range */}
        <div className="detail-title">{event.subject}</div>
        <div className="detail-range">{formatRange(event.rangeStart, event.rangeEnd)}</div>

        {/* Notes */}
        {event.notes && (
          <div className="detail-section">
            <div className="detail-section-label">Notes</div>
            <div className="detail-notes">{event.notes}</div>
          </div>
        )}

        {/* Links */}
        {event.links?.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-label">Links &amp; References</div>
            {event.links.map((l, i) => (
              <a
                key={i}
                className="detail-link"
                href={l.startsWith('http') ? l : '#'}
                target="_blank"
                rel="noreferrer"
              >
                <span>🔗</span>
                <span>{l}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
