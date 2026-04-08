import { useMemo } from 'react';
import { dateKey, cmpKey, isInRange } from '../../utils/dateUtils';
import FanEvents from './FanEvents';

export default function DateCell({
  day,
  year,
  month,
  todayKey,
  rangeStart,
  rangeEnd,
  selecting,
  hoverKey,
  events,
  onMouseDown,
  onMouseEnter,
  onEventClick,
}) {
  // Empty spacer — no interactivity needed
  if (!day) return <div className="date-cell empty" />;

  const key     = dateKey(year, month, day);
  const isToday = key === todayKey;

  // ── Class computation ────────────────────────────────────────────────────
  const className = useMemo(() => {
    const classes = ['date-cell'];

    if (isToday) classes.push('today');

    if (rangeStart && rangeEnd) {
      if (key === rangeStart)                                 classes.push('range-start');
      else if (key === rangeEnd)                              classes.push('range-end');
      else if (isInRange(key, rangeStart, rangeEnd))          classes.push('range-mid');
    } else if (key === rangeStart) {
      classes.push('range-start');
    }

    // Live preview while the user is still dragging
    if (selecting && hoverKey && rangeStart) {
      const lo = cmpKey(rangeStart, hoverKey) <= 0 ? rangeStart : hoverKey;
      const hi = cmpKey(rangeStart, hoverKey) <= 0 ? hoverKey   : rangeStart;
      if (!rangeEnd && isInRange(key, lo, hi)) classes.push('selecting');
    }

    return classes.join(' ');
  }, [key, isToday, rangeStart, rangeEnd, selecting, hoverKey]);

  const isEdge = className.includes('range-start') || className.includes('range-end');

  return (
    <div
      className={className}
      onMouseDown={() => onMouseDown(key)}
      onMouseEnter={() => onMouseEnter(key)}
    >
      <span className="date-num">{String(day).padStart(2, '0')}</span>

      {/* Accent dot on range edges */}
      {isEdge && <div className="range-dot" />}

      {/* Event chips / fan */}
      {events.length > 0 && (
        <FanEvents events={events} onSelect={onEventClick} />
      )}
    </div>
  );
}
