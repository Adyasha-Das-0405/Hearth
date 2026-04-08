import { useState } from 'react';
import { IMPORTANCE_OPTIONS } from '../../constants';

export default function FanEvents({ events, onSelect }) {
  const [open, setOpen] = useState(false);

  // ── Single event — simple chip ──────────────────────────────────────────
  if (events.length === 1) {
    const ev  = events[0];
    const imp = IMPORTANCE_OPTIONS.find((i) => i.value === ev.importance);

    return (
      <div className="cell-events">
        <div
          className={`event-chip ${imp.chip}`}
          title={ev.subject}
          onClick={(e) => { e.stopPropagation(); onSelect(ev); }}
        >
          {ev.subject}
        </div>
      </div>
    );
  }

  // ── Multiple events — fan layout ─────────────────────────────────────────
  const SPREAD_PX  = 18;   // vertical offset per card when open
  const ANGLE_DEG  = 12;   // rotation spread

  return (
    <div
      className="fan-container"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {events.map((ev, i) => {
        const imp       = IMPORTANCE_OPTIONS.find((x) => x.value === ev.importance);
        const midOffset = (events.length - 1) / 2;
        const angle     = open ? (i - midOffset) * ANGLE_DEG : 0;
        const translateY = open ? -(i * SPREAD_PX) : -(i * 3);
        const opacity   = open ? 1 : i === events.length - 1 ? 1 : 0.7;

        return (
          <div
            key={ev.id}
            className={`fan-item ${imp.chip}`}
            style={{
              zIndex: i,
              transform: `translateY(${translateY}px) rotate(${angle}deg)`,
              opacity,
              transition: `all ${0.2 + i * 0.04}s ease`,
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(ev); }}
          >
            {ev.subject}
          </div>
        );
      })}
    </div>
  );
}
