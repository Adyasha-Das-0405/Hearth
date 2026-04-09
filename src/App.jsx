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
  const { events, addEvent, removeEvent, updateEvent, recentEvents } = useEvents();

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

  // Modal target range
  const [modalStart, setModalStart] = useState(null);
  const [modalEnd, setModalEnd] = useState(null);

  // NEW: Editing mode
  const [editingEvent, setEditingEvent] = useState(null);

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
    onRangeReady: (lo, hi) => {
      setEditingEvent(null);
      setModalStart(lo);
      setModalEnd(hi);
      setShowConfigModal(true);
    },
  });

  function openCreateModal(start, end) {
    setEditingEvent(null);
    setModalStart(start);
    setModalEnd(end);
    setShowConfigModal(true);
  }

  function openEditModal(event) {
    setEditingEvent(event);
    setModalStart(event.rangeStart);
    setModalEnd(event.rangeEnd || event.rangeStart);
    setShowConfigModal(true);
    setSelectedKey(null);
  }

  function handlePenClick(key) {
    openCreateModal(key, key);
    setSelectedKey(null);
  }

  function handleSaveEvent(eventData) {
    if (editingEvent) {
      updateEvent(editingEvent.id, {
        ...eventData,
        notes: eventData.notes || "",
      });
    } else {
      addEvent({ ...eventData, notes: eventData.notes || sideNote });
    }

    setShowConfigModal(false);
    setSideNote("");
    setModalStart(null);
    setModalEnd(null);
    setEditingEvent(null);
  }

  function handleConfigClose() {
    setShowConfigModal(false);
    setModalStart(null);
    setModalEnd(null);
    setEditingEvent(null);
  }

  function handleClearRange() {
    clearRange();
    setSideNote("");
  }

  function handleDeleteEvent(id) {
    removeEvent(id);

    // Close detail modal if it was open for the same event
    if (detailEvent?.id === id) setDetailEvent(null);

    // Close edit modal if deleting currently editing event
    if (editingEvent?.id === id) handleConfigClose();
  }

  return (
    <div
      className="cal-root"
      onMouseLeave={() => {
        if (selecting) clearRange();
      }}
    >
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
            if (rangeStart) {
              openCreateModal(rangeStart, rangeEnd || rangeStart);
            }
          }}
          recentEvents={recentEvents()}
          onSelectEvent={setDetailEvent}
          onEditEvent={openEditModal}
          onDeleteEvent={handleDeleteEvent}
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
          editEvent={editingEvent}
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