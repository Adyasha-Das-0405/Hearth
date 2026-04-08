import { MONTHS } from '../constants';

// ── Grid Helpers ───────────────────────────────────────────────────────────

/** Total days in a given month (0-indexed month). */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * First weekday of the month, adjusted so Mon = 0 … Sun = 6
 * (matches the MON-first calendar grid).
 */
export function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay(); // 0 = Sun
  return day === 0 ? 6 : day - 1;
}

// ── Date Key Helpers ───────────────────────────────────────────────────────
// A "date key" is a zero-padded ISO-like string: "2026-01-05"
// It is used as a stable, sortable, serialisable identifier throughout the app.

/** Build a date key from year, 0-indexed month, and day. */
export function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Decompose a date key back into { y, m (0-indexed), d }. */
export function parseKey(key) {
  const [y, m, d] = key.split('-');
  return { y: +y, m: +m - 1, d: +d };
}

/** Lexicographic comparison — works because of the zero-padded format. */
export function cmpKey(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Return today's date key. */
export function todayKey() {
  const now = new Date();
  return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

// ── Range Helpers ──────────────────────────────────────────────────────────

/**
 * Return { lo, hi } — the start and end of a range in chronological order,
 * guarding against a null end (single-day selection).
 */
export function normaliseRange(start, end) {
  const e = end ?? start;
  return cmpKey(start, e) <= 0 ? { lo: start, hi: e } : { lo: e, hi: start };
}

/**
 * True if `key` falls within [lo, hi] inclusive.
 */
export function isInRange(key, lo, hi) {
  return cmpKey(key, lo) >= 0 && cmpKey(key, hi) <= 0;
}

// ── Formatting ─────────────────────────────────────────────────────────────

/**
 * Human-readable range label used in the UI.
 *   "Jan 5"          – single day
 *   "Jan 5 – 10"     – same month
 *   "Jan 5 – Feb 2"  – cross-month
 */
export function formatRange(start, end) {
  if (!start) return '—';
  const s = parseKey(start);
  const e = end ? parseKey(end) : s;
  const sm = MONTHS[s.m].slice(0, 3);
  const em = MONTHS[e.m].slice(0, 3);

  if (!end || start === end) return `${sm} ${s.d}`;
  if (s.m === e.m && s.y === e.y) return `${sm} ${s.d} – ${e.d}`;
  return `${sm} ${s.d} – ${em} ${e.d}`;
}

// ── Grid Builder ───────────────────────────────────────────────────────────

/**
 * Build the flat array of cells for the calendar grid.
 * Leading `null`s pad the first week so day 1 lands on its correct column.
 *
 * @returns {(number|null)[]}
 */
export function buildGridCells(year, month) {
  const days = getDaysInMonth(year, month);
  const offset = getFirstDayOfMonth(year, month);
  const cells = Array(offset).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  return cells;
}

// ── Event Indexing ─────────────────────────────────────────────────────────

/**
 * Index events by their (normalised) start key so the calendar grid can
 * look up events for a given day in O(1).
 *
 * Only the start day is used as the visual anchor — the fan effect renders
 * all events starting on that day, while the range highlight shows the span.
 *
 * @param {object[]} events
 * @returns {Record<string, object[]>}
 */
export function indexEventsByStartDay(events) {
  return events.reduce((acc, ev) => {
    const { lo } = normaliseRange(ev.rangeStart, ev.rangeEnd);
    if (!acc[lo]) acc[lo] = [];
    acc[lo].push(ev);
    return acc;
  }, {});
}
