import { useMemo } from 'react';
import { DAYS } from '../../constants';
import { buildGridCells, dateKey, indexEventsByDay, todayKey as getTodayKey } from '../../utils/dateUtils';
import DateCell from './DateCell';

export default function CalendarGrid({
  year, month, flipClass,
  rangeStart, rangeEnd,
  selecting, hoverKey,
  selectedKey,
  events,
  onMouseDown, onMouseEnter,
  onEventClick,
  onPenClick,
}) {
  const today   = getTodayKey();
  const cells   = useMemo(() => buildGridCells(year, month), [year, month]);
  const byDay   = useMemo(() => indexEventsByDay(events), [events]);

  return (
    <div className={`cal-grid-wrap ${flipClass}`}>
      <div className="day-headers">
        {DAYS.map((d) => <div className="day-hdr" key={d}>{d}</div>)}
      </div>

      <div className="dates-grid">
        {cells.map((day, i) => {
          const key      = day ? dateKey(year, month, day) : null;
          const daySlots = key ? (byDay[key] ?? []) : [];

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
              isSelected={key === selectedKey}
              daySlots={daySlots}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onEventClick={onEventClick}
              onPenClick={onPenClick}
            />
          );
        })}
      </div>
    </div>
  );
}
