import { useState, useEffect, useRef } from 'react';
import { cmpKey, todayKey } from '../utils/dateUtils';

export function useRangeSelect({ onRangeReady } = {}) {
  const [rangeStart,  setRangeStart]  = useState(null);
  const [rangeEnd,    setRangeEnd]    = useState(null);
  const [selecting,   setSelecting]   = useState(false);
  const [hoverKey,    setHoverKey]    = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const draggedRef = useRef(false);
  const downKeyRef = useRef(null);

  // ── Auto-expire past ranges ──────────────────────────────────────────────
  useEffect(() => {
    if (!rangeEnd) return;
    if (cmpKey(rangeEnd, todayKey()) < 0) {
      setRangeStart(null);
      setRangeEnd(null);
      setSelectedKey(null);
    }
  }, [rangeEnd]);

  // ── Mouse handlers ───────────────────────────────────────────────────────
  function handleMouseDown(key) {
    downKeyRef.current = key;
    draggedRef.current = false;
    setSelecting(true);
    setHoverKey(null);
  }

  function handleMouseEnter(key) {
    if (!selecting) return;
    if (key !== downKeyRef.current) draggedRef.current = true;
    setHoverKey(key);
  }

  function handleMouseUp() {
    if (!selecting) return;
    setSelecting(false);
    setHoverKey(null);

    const downKey = downKeyRef.current;
    if (!downKey) return;

    if (!draggedRef.current) {
      // ── Single click → show pen button, keep existing range intact ───────
      setSelectedKey((prev) => (prev === downKey ? null : downKey));
    } else {
      // ── Drag → commit range and auto-open modal ───────────────────────────
      const end = hoverKey ?? downKey;
      const lo  = cmpKey(downKey, end) <= 0 ? downKey : end;
      const hi  = cmpKey(downKey, end) <= 0 ? end     : downKey;
      setRangeStart(lo);
      setRangeEnd(hi);
      setSelectedKey(null);
      onRangeReady?.(lo, hi);
    }
  }

  function clearRange() {
    setRangeStart(null);
    setRangeEnd(null);
    setSelectedKey(null);
    setSelecting(false);
    setHoverKey(null);
  }

  useEffect(() => {
  window.addEventListener("mouseup", handleMouseUp);
  return () => window.removeEventListener("mouseup", handleMouseUp);
}, [selecting, hoverKey]);

  return {
    rangeStart, rangeEnd,
    selecting, hoverKey,
    selectedKey, setSelectedKey,
    handleMouseDown, handleMouseEnter,
    clearRange,
  };
}
