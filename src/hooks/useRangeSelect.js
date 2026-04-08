import { useState, useEffect } from 'react';
import { cmpKey } from '../utils/dateUtils';

export function useRangeSelect({ onRangeReady }) {
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [hoverKey, setHoverKey] = useState(null);

  function handleMouseDown(key) {
    setRangeStart(key);
    setRangeEnd(null);
    setSelecting(true);
    setHoverKey(null);
  }

  function handleMouseEnter(key) {
    if (selecting) setHoverKey(key);
  }

  function handleMouseUp() {
    if (!selecting) return;

    const end = hoverKey && hoverKey !== rangeStart ? hoverKey : rangeStart;

    // Normalise so lo ≤ hi
    const lo = cmpKey(rangeStart, end) <= 0 ? rangeStart : end;
    const hi = cmpKey(rangeStart, end) <= 0 ? end : rangeStart;

    setRangeStart(lo);
    setRangeEnd(hi);
    setSelecting(false);
    setHoverKey(null);

    onRangeReady?.(lo, hi);
  }

  function clearRange() {
    setRangeStart(null);
    setRangeEnd(null);
    setSelecting(false);
    setHoverKey(null);
  }

  // Attach global mouseup so dragging outside the grid still finalises
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  });

  return {
    rangeStart,
    rangeEnd,
    selecting,
    hoverKey,
    handleMouseDown,
    handleMouseEnter,
    clearRange,
  };
}
