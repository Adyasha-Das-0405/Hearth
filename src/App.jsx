import { useState } from 'react';

import { useMonthNav }    from './hooks/useMonthNav';
import { useRangeSelect } from './hooks/useRangeSelect';
import { useEvents }      from './hooks/useEvents';
import { useSettings }    from './hooks/useSettings';

import CalHeader     from './components/layout/CalHeader';
import MonthHero     from './components/layout/MonthHero';
import SettingsPanel from './components/layout/SettingsPanel';
import CalendarGrid  from './components/calendar/CalendarGrid';
import SidePanel     from './components/sidebar/SidePanel';
import EventConfigModal  from './components/modals/EventConfigModal';
import EventDetailModal  from './components/modals/EventDetailModal';

import './styles/index.css';

export default function App() {
  const { year, month, flipClass, changeMonth } = useMonthNav();
  const { events, addEvent, recentEvents }      = useEvents();
  const {
    bgImg, cycleBg, handleBgUpload, openFilePicker, fileInputRef,
    isDayMode, toggleDayNight,
    isPlaying, toggleMusic, trackIdx, selectTrack, volume, setVolume, musicReady,
  } = useSettings();

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [detailEvent,     setDetailEvent]     = useState(null);
  const [sideNote,        setSideNote]        = useState('');

  const {
    rangeStart, rangeEnd,
    selecting, hoverKey,
    selectedKey, setSelectedKey,
    handleMouseDown, handleMouseEnter,
    clearRange,
  } = useRangeSelect({
    // Drag completes → auto-open modal immediately
    onRangeReady: () => setShowConfigModal(true),
  });

  // Single-day pen click → open modal for that specific date
  function handlePenClick(key) {
    setShowConfigModal(true);
    setSelectedKey(null);
  }

  function handleSaveEvent(eventData) {
    addEvent({ ...eventData, notes: eventData.notes || sideNote });
    setShowConfigModal(false);
    setSideNote('');
    // Range stays — no clearRange() here
  }

  function handleConfigClose() {
    setShowConfigModal(false);
  }

  function handleClearRange() {
    clearRange();
    setSideNote('');
  }

  // Modal targets the committed range, or falls back to the clicked single day
  const modalRangeStart = rangeStart ?? selectedKey;
  const modalRangeEnd   = rangeEnd   ?? selectedKey;

  return (
    <div
      className="cal-root"
      onMouseLeave={() => { if (selecting) clearRange(); }}
    >
      <div
        className={`bg-layer ${isDayMode ? 'bg-layer--day' : ''}`}
        style={{ backgroundImage: `url('${bgImg}')` }}
      />
      <div className="bg-noise" />

      <CalHeader />

      <MonthHero
        year={year} month={month} flipClass={flipClass}
        onPrev={() => changeMonth(-1)} onNext={() => changeMonth(1)}
      />

      <p className="hint-bar">
        Drag across dates to set a range · Click a date then the pen icon to add a note
      </p>

      <div className="cal-body">
        <CalendarGrid
          year={year} month={month} flipClass={flipClass}
          rangeStart={rangeStart} rangeEnd={rangeEnd}
          selecting={selecting} hoverKey={hoverKey}
          selectedKey={selectedKey}
          events={events}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onEventClick={setDetailEvent}
          onPenClick={handlePenClick}
        />

        <SidePanel
          rangeStart={rangeStart} rangeEnd={rangeEnd}
          sideNote={sideNote} onNoteChange={setSideNote}
          onClear={handleClearRange}
          onSaveNote={() => setShowConfigModal(true)}
          recentEvents={recentEvents()}
          onSelectEvent={setDetailEvent}
        />
      </div>

      <SettingsPanel
        onCycleBg={cycleBg} onOpenFilePicker={openFilePicker}
        onBgUpload={handleBgUpload} fileInputRef={fileInputRef}
        isDayMode={isDayMode} onToggleDayNight={toggleDayNight}
        isPlaying={isPlaying} onToggleMusic={toggleMusic}
        trackIdx={trackIdx} onSelectTrack={selectTrack}
        volume={volume} onVolumeChange={setVolume} musicReady={musicReady}
      />

      {showConfigModal && modalRangeStart && (
        <EventConfigModal
          rangeStart={modalRangeStart}
          rangeEnd={modalRangeEnd}
          initialNote={sideNote}
          onSave={handleSaveEvent}
          onClose={handleConfigClose}
        />
      )}

      {detailEvent && (
        <EventDetailModal event={detailEvent} onClose={() => setDetailEvent(null)} />
      )}
    </div>
  );
}
