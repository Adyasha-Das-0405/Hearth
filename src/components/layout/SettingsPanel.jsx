import { useState, useRef, useEffect } from "react";
import { MUSIC_TRACKS } from "../../hooks/useSettings";

export default function SettingsPanel({
  // background
  onCycleBg,
  onOpenFilePicker,
  onBgUpload,
  fileInputRef,

  // day/night
  isDayMode,
  onToggleDayNight,

  // music
  isPlaying,
  onToggleMusic,
  trackIdx,
  onSelectTrack,
  volume,
  onVolumeChange,
  musicReady,

  // ✅ NEW year selector
  year,
  onYearChange,
}) {
  const [open, setOpen] = useState(false);
  const trayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (trayRef.current && !trayRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="settings-root" ref={trayRef}>
      <div className={`settings-tray ${open ? "settings-tray--open" : ""}`}>
        {/* ── Section: Background ──────────────────────────────────────── */}
        <div className="stray-section">
          <div className="stray-label">Background</div>
          <div className="stray-row">
            <button
              className="stray-btn stray-btn--icon"
              onClick={onCycleBg}
              title="Cycle preset backgrounds"
            >
              <span>🌄</span>
              <span>Cycle BG</span>
            </button>

            <button
              className="stray-btn stray-btn--icon"
              onClick={onOpenFilePicker}
              title="Upload custom background"
            >
              <span>📎</span>
              <span>Upload</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onBgUpload}
          />
        </div>

        <div className="stray-divider" />

        {/* ── Section: Year Selector ───────────────────────────────────── */}
        <div className="stray-section">
          <div className="stray-label">Year</div>

          <select
            className="year-select"
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="stray-divider" />

        {/* ── Section: Appearance ──────────────────────────────────────── */}
        <div className="stray-section">
          <div className="stray-label">Appearance</div>
          <div className="stray-row stray-row--between">
            <span className="stray-row-text">
              {isDayMode ? "☀️ Day Mode" : "🌙 Night Mode"}
            </span>
            <button
              className={`toggle-pill ${isDayMode ? "toggle-pill--on" : ""}`}
              onClick={onToggleDayNight}
              aria-label="Toggle day/night mode"
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>

        <div className="stray-divider" />

        {/* ── Section: Music ───────────────────────────────────────────── */}
        <div className="stray-section">
          <div className="stray-label">Ambient Music</div>

          <div
            className="stray-row stray-row--between"
            style={{ marginBottom: 10 }}
          >
            <span className="stray-row-text">
              {isPlaying ? "▶ Playing" : "⏸ Paused"} —{" "}
              {MUSIC_TRACKS[trackIdx].label}
            </span>

            <button
              className={`play-btn ${isPlaying ? "play-btn--active" : ""}`}
              onClick={onToggleMusic}
              disabled={!musicReady && !isPlaying}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>

          <div className="track-list">
            {MUSIC_TRACKS.map((t, i) => (
              <button
                key={t.id}
                className={`track-item ${
                  i === trackIdx ? "track-item--active" : ""
                }`}
                onClick={() => onSelectTrack(i)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="volume-row">
            <span className="volume-icon">🔈</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="volume-slider"
              aria-label="Volume"
            />
            <span className="volume-icon">🔊</span>
          </div>
        </div>
      </div>

      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      <button
        className={`settings-fab ${open ? "settings-fab--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Settings"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="settings-fab-icon"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </div>
  );
}