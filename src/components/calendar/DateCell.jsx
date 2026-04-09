import { useMemo } from "react";
import { dateKey, cmpKey, isInRange } from "../../utils/dateUtils";
import { IMPORTANCE_OPTIONS } from "../../constants";

const PenIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="11"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.5 1.5 L14.5 4.5 L5 14 L1 15 L2 11 Z" />
    <line x1="9" y1="3.5" x2="12.5" y2="7" />
  </svg>
);

function getRangePosition(key, start, end) {
  const lo = cmpKey(start, end) <= 0 ? start : end;
  const hi = cmpKey(start, end) <= 0 ? end : start;

  if (key === lo && key === hi) return "solo";
  if (key === lo) return "start";
  if (key === hi) return "end";
  if (cmpKey(key, lo) > 0 && cmpKey(key, hi) < 0) return "mid";

  return null;
}

export default function DateCell({
  day,
  year,
  month,
  todayKey,
  rangeStart,
  rangeEnd,
  selecting,
  hoverKey,
  isSelected,
  daySlots,
  allEvents,
  onMouseDown,
  onMouseEnter,
  onEventClick,
  onPenClick,
}) {
  if (!day) return <div className="date-cell empty" />;

  const key = dateKey(year, month, day);
  const isToday = key === todayKey;

  const savedStyle = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return null;

    for (const ev of allEvents) {
      const start = ev.rangeStart;
      const end = ev.rangeEnd || ev.rangeStart;

      const pos = getRangePosition(key, start, end);
      if (pos) {
        return { importance: ev.importance, position: pos };
      }
    }

    return null;
  }, [allEvents, key]);

  const className = useMemo(() => {
    const c = ["date-cell"];

    if (isToday) c.push("today");
    if (isSelected) c.push("cell-selected");

    // ✅ Saved event coloring (importance-based)
    if (savedStyle) {
      c.push(`saved-${savedStyle.importance}`);
      c.push(`saved-${savedStyle.position}`);
    }

    // Current committed range highlight (lime)
    if (rangeStart && rangeEnd) {
      if (key === rangeStart) c.push("range-start");
      else if (key === rangeEnd) c.push("range-end");
      else if (isInRange(key, rangeStart, rangeEnd)) c.push("range-mid");
    } else if (key === rangeStart) {
      c.push("range-start");
    }

    // Live drag preview
    if (selecting && hoverKey && rangeStart) {
      const lo = cmpKey(rangeStart, hoverKey) <= 0 ? rangeStart : hoverKey;
      const hi = cmpKey(rangeStart, hoverKey) <= 0 ? hoverKey : rangeStart;

      if (!rangeEnd && isInRange(key, lo, hi)) c.push("selecting");
    }

    return c.join(" ");
  }, [
    key,
    isToday,
    isSelected,
    rangeStart,
    rangeEnd,
    selecting,
    hoverKey,
    savedStyle,
  ]);

  const isEdge =
    className.includes("range-start") || className.includes("range-end");

  return (
    <div
      className={className}
      onMouseDown={() => onMouseDown(key)}
      onMouseEnter={() => onMouseEnter(key)}
    >
      <span className="date-num">{String(day).padStart(2, "0")}</span>

      {isEdge && <div className="range-dot" />}

      {/* Pen button — top-right, only on single-clicked cells */}
      {isSelected && (
        <button
          className="pen-btn"
          title="Add note for this date"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onPenClick(key);
          }}
        >
          <PenIcon />
        </button>
      )}

      {/* Spanning event bars */}
      {daySlots.length > 0 && (
        <div className="cell-events">
          {daySlots.map(({ event, position }, i) => {
            const imp = IMPORTANCE_OPTIONS.find(
              (o) => o.value === event.importance
            );

            const isLabelVisible = position === "start" || position === "solo";

            return (
              <div
                key={`${event.id}-${i}`}
                className={`event-span ${imp.chip} span-${position}`}
                title={event.subject}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {isLabelVisible && (
                  <span className="event-span-label">{event.subject}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}