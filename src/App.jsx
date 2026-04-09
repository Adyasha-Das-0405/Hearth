import { useState } from 'react';

// Hooks
import { useMonthNav }    from './hooks/useMonthNav';
import { useRangeSelect } from './hooks/useRangeSelect';
import { useEvents }      from './hooks/useEvents';
import { useSettings }    from './hooks/useSettings';

// Layout
import CalHeader     from './components/layout/CalHeader';
import MonthHero     from './components/layout/MonthHero';
import SettingsPanel from './components/layout/SettingsPanel';

// Calendar
import CalendarGrid from './components/calendar/CalendarGrid';

// Sidebar
import SidePanel from './components/sidebar/SidePanel';

// Modals
import EventConfigModal  from './components/modals/EventConfigModal';
import EventDetailModal  from './components/modals/EventDetailModal';

// Styles
import './styles/index.css';

export default function App() {
  // ── Feature hooks ──────────────────────────────────────────────────────
  const { year, month, flipClass, changeMonth } = useMonthNav();
  const { events, addEvent, recentEvents }      = useEvents();
  const {
    bgImg, cycleBg, handleBgUpload, openFilePicker, fileInputRef,
    isDayMode, toggleDayNight,
    isPlaying, toggleMusic, trackIdx, selectTrack, volume, setVolume, musicReady,
  } = useSettings();

  // ── UI state ────────────────────────────────────────────────────────────
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [detailEvent,     setDetailEvent]     = useState(null);
  const [sideNote,        setSideNote]        = useState('');

  // ── Range selection ─────────────────────────────────────────────────────
  const {
    rangeStart, rangeEnd, selecting, hoverKey,
    handleMouseDown, handleMouseEnter, clearRange,
  } = useRangeSelect({
    onRangeReady: () => setShowConfigModal(true),
  });

  // ── Event handlers ───────────────────────────────────────────────────────
  function handleSaveEvent(eventData) {
    addEvent({ ...eventData, notes: eventData.notes || sideNote });
    setShowConfigModal(false);
    setSideNote('');
    clearRange();
  }

  function handleConfigClose() {
    setShowConfigModal(false);
    clearRange();
  }

  function handleClearRange() {
    clearRange();
    setSideNote('');
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="cal-root"
      onMouseLeave={() => { if (selecting) clearRange(); }}
    >
      {/* Background layers */}
      <div
        className={`bg-layer ${isDayMode ? 'bg-layer--day' : ''}`}
        style={{ backgroundImage: `url('${bgImg}')` }}
      />
      <div className="bg-noise" />

      {/* Header — logo, nav, clock only */}
      <CalHeader />

      {/* Month title + navigation */}
      <MonthHero
        year={year}
        month={month}
        flipClass={flipClass}
        onPrev={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
      />

      {/* Drag hint */}
      <p className="hint-bar">Click &amp; drag across dates to create an event range</p>

      {/* Main content */}
      <div className="cal-body">
        <CalendarGrid
          year={year}
          month={month}
          flipClass={flipClass}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          selecting={selecting}
          hoverKey={hoverKey}
          events={events}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onEventClick={setDetailEvent}
        />

        <SidePanel
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          sideNote={sideNote}
          onNoteChange={setSideNote}
          onClear={handleClearRange}
          onSaveNote={() => setShowConfigModal(true)}
          recentEvents={recentEvents()}
          onSelectEvent={setDetailEvent}
        />
      </div>

      {/* ── Settings FAB + tray (bottom-right) ─────────────────────────── */}
      <SettingsPanel
        onCycleBg={cycleBg}
        onOpenFilePicker={openFilePicker}
        onBgUpload={handleBgUpload}
        fileInputRef={fileInputRef}
        isDayMode={isDayMode}
        onToggleDayNight={toggleDayNight}
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
        trackIdx={trackIdx}
        onSelectTrack={selectTrack}
        volume={volume}
        onVolumeChange={setVolume}
        musicReady={musicReady}
      />

      {/* Modals */}
      {showConfigModal && rangeStart && (
        <EventConfigModal
          rangeStart={rangeStart}
          rangeEnd={rangeEnd ?? rangeStart}
          initialNote={sideNote}
          onSave={handleSaveEvent}
          onClose={handleConfigClose}
        />
      )}

      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
        />
      )}
    </div>
  );
}
