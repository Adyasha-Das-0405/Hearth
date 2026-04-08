import { formatRange } from '../../utils/dateUtils';

export default function RecentLogs({ events, onSelect }) {
  if (events.length === 0) return null;

  return (
    <div className="panel-card">
      <div className="logs-title">
        <span style={{ color: 'var(--accent)' }}>▪</span>
        Recent Logs
      </div>

      {events.map((ev) => (
        <div
          key={ev.id}
          className="log-item"
          onClick={() => onSelect(ev)}
        >
          <div className="log-date">{formatRange(ev.rangeStart, ev.rangeEnd)}</div>
          <div className="log-title">{ev.subject}</div>
        </div>
      ))}
    </div>
  );
}
