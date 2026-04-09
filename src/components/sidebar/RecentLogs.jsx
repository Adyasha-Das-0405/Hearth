import { formatRange } from "../../utils/dateUtils";

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

export default function RecentLogs({ events, onSelect, onEdit, onDelete }) {
  if (events.length === 0) return null;

  return (
    <div className="panel-card">
      <div className="logs-title">
        <span style={{ color: "var(--accent)" }}>▪</span>
        Recent Logs
      </div>

      {events.map((ev) => (
        <div key={ev.id} className="log-item" onClick={() => onSelect(ev)}>
          <div className="log-date">{formatRange(ev.rangeStart, ev.rangeEnd)}</div>

          <div className="log-row">
            <div className="log-title">{ev.subject}</div>

            <div className="log-actions">
              <button
                className="log-btn log-btn-edit"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(ev);
                }}
              >
                <EditIcon />
              </button>

              <button
                className="log-btn log-btn-delete"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(ev.id);
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}