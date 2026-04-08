import Clock from './Clock';

export default function CalHeader({
  onCycleBg,
  onOpenFilePicker,
  onBgUpload,
  fileInputRef,
}) {
  return (
    <header className="cal-header">
      <div className="logo">calendly</div>

      <nav className="nav-links">
        <a>Calendar</a>
        <a>Events</a>
        <a>Archive</a>
      </nav>

      <div className="header-right">
        <button className="bg-upload-btn" onClick={onCycleBg}>
          🌄 Change BG
        </button>
        <button className="bg-upload-btn" onClick={onOpenFilePicker}>
          📎 Upload BG
        </button>
        {/* Hidden file input — triggered programmatically */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onBgUpload}
        />
        <Clock />
      </div>
    </header>
  );
}
