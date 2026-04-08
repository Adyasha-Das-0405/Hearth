import { useState, useEffect } from 'react';

const STORAGE_KEY = 'calendly_events';

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useEvents() {
  const [events, setEvents] = useState(loadEvents);

  // Persist to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  function addEvent(event) {
    setEvents((prev) => [...prev, { ...event, id: Date.now() }]);
  }

  function removeEvent(id) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function updateEvent(id, patch) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  /** Most recent events first, capped at `limit`. */
  function recentEvents(limit = 4) {
    return [...events].sort((a, b) => b.id - a.id).slice(0, limit);
  }

  return { events, addEvent, removeEvent, updateEvent, recentEvents };
}
