import { MONTHS } from '../../constants';

export default function MonthHero({ year, month, flipClass, onPrev, onNext }) {
  return (
    <div className="month-hero">
      <div className="month-sub">{year} Monthly Agenda</div>

      <div className="month-nav">
        <button className="month-nav-btn" onClick={onPrev} aria-label="Previous month">
          ‹
        </button>

        <h1 className={`month-title ${flipClass}`}>
          {MONTHS[month].toUpperCase()}
        </h1>

        <button className="month-nav-btn" onClick={onNext} aria-label="Next month">
          ›
        </button>
      </div>
    </div>
  );
}
