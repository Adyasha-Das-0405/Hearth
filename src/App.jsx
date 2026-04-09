import { useState } from "react";

import { useMonthNav } from "./hooks/useMonthNav";
import { useRangeSelect } from "./hooks/useRangeSelect";
import { useEvents } from "./hooks/useEvents";
import { useSettings } from "./hooks/useSettings";

import CalHeader from "./components/layout/CalHeader";
import MonthHero from "./components/layout/MonthHero";
import SettingsPanel from "./components/layout/SettingsPanel";
import CalendarGrid from "./components/calendar/CalendarGrid";
import SidePanel from "./components/sidebar/SidePanel";
import EventConfigModal from "./components/modals/EventConfigModal";
import EventDetailModal from "./components/modals/EventDetailModal";

import "./styles/index.css";

export default function App() {
  const { year, month, flipClass, changeMonth } = useMonthNav();
  const { events, addEvent, recentEvents } = useEvents();

  const {
    bgImg,
    cycleBg,
    handleBgUpload,
    openFilePicker,
    fileInputRef,
    isDayMode,
    toggleDayNight,
    isPlaying,
    toggleMusic,
    trackIdx,
    selectTrack,
    volume,
    setVolume,
    musicReady,
  } = useSettings();

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null);
  const [sideNote, setSideNote] = useState("");

  // ✅ NEW: modal target state (fixes the pen click bug)
  const [modalStart, setModalStart] = useState(null);
  const [modalEnd, setModalEnd] = useState(null);

  const {
    rangeStart,
    rangeEnd,
    selecting,
    hoverKey,
    selectedKey,
    setSelectedKey,
    handleMouseDown,
    handleMouseEnter,
    clearRange,
  } = useRangeSelect({
    // Drag completes → auto-open modal immediately with correct range
    onRangeReady: (lo, hi) => {
      setModalStart(lo);
      setModalEnd(hi);
      setShowConfigModal(true);
    },
  });

  // ✅ Single-day pen click → open modal ONLY for that date
  function handlePenClick(key) {
    setModalStart(key);
    setModalEnd(key);
    setShowConfigModal(true);
    setSelectedKey(null);
  }

  function handleSaveEvent(eventData) {
    addEvent({ ...eventData, notes: eventData.notes || sideNote });

    setShowConfigModal(false);
    setSideNote("");

    // Clear modal target
    setModalStart(null);
    setModalEnd(null);
  }

  function handleConfigClose() {
    setShowConfigModal(false);
    setModalStart(null);
    setModalEnd(null);
  }

  function handleClearRange() {
    clearRange();
    setSideNote("");
  }

  return (
    <div className="cal-root" onMouseLeave={() => { if (selecting) clearRange(); }}>
      <div
        className={`bg-layer ${isDayMode ? "bg-layer--day" : ""}`}
        style={{ backgroundImage: `url('${bgImg}')` }}
      />
      <div className="bg-noise" />

      <CalHeader />

      <MonthHero
        year={year}
        month={month}
        flipClass={flipClass}
        onPrev={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
      />

      <p className="hint-bar">
        Drag across dates to set a range · Click a date then the pen icon to add a note
      </p>

      <div className="cal-body">
        <CalendarGrid
          year={year}
          month={month}
          flipClass={flipClass}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          selecting={selecting}
          hoverKey={hoverKey}
          selectedKey={selectedKey}
          events={events}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onEventClick={setDetailEvent}
          onPenClick={handlePenClick}
        />

        <SidePanel
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          sideNote={sideNote}
          onNoteChange={setSideNote}
          onClear={handleClearRange}
          onSaveNote={() => {
            // if user clicks save note button, open modal using current range
            if (rangeStart) {
              setModalStart(rangeStart);
              setModalEnd(rangeEnd || rangeStart);
              setShowConfigModal(true);
            }
          }}
          recentEvents={recentEvents()}
          onSelectEvent={setDetailEvent}
        />
      </div>

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

      {showConfigModal && modalStart && (
        <EventConfigModal
          rangeStart={modalStart}
          rangeEnd={modalEnd}
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