import Clock from './Clock';

export default function CalHeader() {
  return (
    <header className="cal-header">
      <div className="logo">calendly</div>

      <nav className="nav-links">
        <a>Calendar</a>
        <a>Events</a>
        <a>Archive</a>
      </nav>

      <div className="header-right">
        <Clock />
      </div>
    </header>
  );
}
