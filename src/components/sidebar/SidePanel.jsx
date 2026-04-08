import RecentLogs from './RecentLogs';
import { formatRange } from '../../utils/dateUtils';

export default function SidePanel({
  rangeStart,
  rangeEnd,
  sideNote,
  onNoteChange,
  onClear,
  onSaveNote,
  recentEvents,
  onSelectEvent,
}) {
  const hasRange    = rangeStart && rangeEnd;
  const rangeLabel  = hasRange ? formatRange(rangeStart, rangeEnd) : null;

  return (
    <div className="side-panel">
      {/* ── Note Card ───────────────────────────────────────────────────── */}
      <div className="panel-card">
        {hasRange ? (
          <>
            <div className="panel-label">Active Range</div>
            <div className="panel-range">{rangeLabel}</div>
            <textarea
              className="note-textarea"
              placeholder="Draft your agenda for this sprint…"
              value={sideNote}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={4}
            />
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={onClear}>Clear</button>
              <button className="btn btn-primary" onClick={onSaveNote}>Save Note</button>
            </div>
          </>
        ) : (
          <>
            <div className="panel-label">Quick Note</div>
            <div
              className="panel-range"
              style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans' }}
            >
              Select a date range on the calendar to create an event
            </div>
            <textarea
              className="note-textarea"
              placeholder="General monthly notes…"
              value={sideNote}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={5}
            />
          </>
        )}
      </div>

      {/* ── Recent Logs ─────────────────────────────────────────────────── */}
      <RecentLogs events={recentEvents} onSelect={onSelectEvent} />
    </div>
  );
}
