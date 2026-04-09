import Clock from "./Clock";

export default function CalHeader() {
  function scrollToRecentLogs() {
    const el = document.getElementById("recent-logs");
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Add glow
    el.classList.add("highlight");

    // Remove glow when user clicks anywhere else
    function handleOutsideClick(e) {
      if (!el.contains(e.target)) {
        el.classList.remove("highlight");
        document.removeEventListener("click", handleOutsideClick);
      }
    }

    // Delay so the click on "Events" itself doesn't instantly remove highlight
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);
  }

  return (
    <header className="cal-header">
      <div className="logo">Hearth</div>

      <nav className="nav-links">
        <a>Calendar</a>
        <a onClick={scrollToRecentLogs}>Events</a>
        <a>Archive</a>
      </nav>

      <div className="header-right">
        <Clock />
      </div>
    </header>
  );
}