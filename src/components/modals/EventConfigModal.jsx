import { useState } from 'react';
import { IMPORTANCE_OPTIONS } from '../../constants';
import { formatRange } from '../../utils/dateUtils';

export default function EventConfigModal({
  rangeStart,
  rangeEnd,
  initialNote = '',
  onSave,
  onClose,
}) {
  const [subject,    setSubject]    = useState('');
  const [importance, setImportance] = useState('med');
  const [notes,      setNotes]      = useState(initialNote);
  const [linkInput,  setLinkInput]  = useState('');
  const [links,      setLinks]      = useState([]);

  // ── Link management ──────────────────────────────────────────────────────
  function addLink() {
    const val = linkInput.trim();
    if (!val) return;
    setLinks((prev) => [...prev, val]);
    setLinkInput('');
  }

  function removeLink(index) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!subject.trim()) {
      alert('Please add an event subject.');
      return;
    }
    onSave({ rangeStart, rangeEnd, subject: subject.trim(), importance, notes, links });
  }

  // ── Overlay click to close ────────────────────────────────────────────────
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <div className="modal-label">Event Configuration</div>
        <div className="modal-range-title">
          Selected Range:{' '}
          <span className="modal-range-dates">
            {formatRange(rangeStart, rangeEnd)}
          </span>
        </div>

        {/* Subject */}
        <div className="field-label">Event Subject</div>
        <input
          className="field-input"
          placeholder="e.g. Architectural Design Sprint"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        {/* Importance */}
        <div className="field-label">Importance Level</div>
        <select
          className="field-select"
          value={importance}
          onChange={(e) => setImportance(e.target.value)}
        >
          {IMPORTANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Links */}
        <div className="field-label">Important Links</div>
        <div className="link-row">
          <input
            className="field-input link-input"
            placeholder="Paste a URL or file name…"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
          />
          <button className="add-link-btn" onClick={addLink} aria-label="Add link">+</button>
        </div>

        {links.length > 0 && (
          <div className="links-list">
            {links.map((l, i) => (
              <div className="link-tag" key={i}>
                <span>🔗</span>
                <span>{l}</span>
                <button className="link-remove" onClick={() => removeLink(i)} aria-label="Remove link">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="field-label">Internal Notes</div>
        <textarea
          className="field-textarea"
          placeholder="Add details about scope, goals, context…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions */}
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-save"   onClick={handleSave}>Save Event ⚡</button>
        </div>
      </div>
    </div>
  );
}
