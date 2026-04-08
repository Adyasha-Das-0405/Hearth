import { useMemo } from 'react';
import { DAYS } from '../../constants';
import { buildGridCells, dateKey, indexEventsByStartDay, todayKey as getTodayKey } from '../../utils/dateUtils';
import DateCell from './DateCell';

export default function CalendarGrid({
  year,
  month,
  flipClass,
  rangeStart,
  rangeEnd,
  selecting,
  hoverKey,
  events,
  onMouseDown,
  onMouseEnter,
  onEventClick,
}) {
  const today      = getTodayKey();
  const cells      = useMemo(() => buildGridCells(year, month), [year, month]);
  const byStartDay = useMemo(() => indexEventsByStartDay(events), [events]);

  return (
    <div className={`cal-grid-wrap ${flipClass}`}>
      {/* Day-of-week header row */}
      <div className="day-headers">
        {DAYS.map((d) => (
          <div className="day-hdr" key={d}>{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="dates-grid">
        {cells.map((day, i) => {
          const key       = day ? dateKey(year, month, day) : null;
          const dayEvents = key ? (byStartDay[key] ?? []) : [];

          return (
            <DateCell
              key={i}
              day={day}
              year={year}
              month={month}
              todayKey={today}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              selecting={selecting}
              hoverKey={hoverKey}
              events={dayEvents}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}
