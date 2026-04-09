// ── Calendar Labels ────────────────────────────────────────────────────────

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ── Event Importance Levels ────────────────────────────────────────────────
// Palette: soft sage · warm amber · dusty rose · deep periwinkle
// Muted enough to sit on photography, distinct enough to differentiate at a glance.
export const IMPORTANCE_OPTIONS = [
  { value: 'low',      label: 'Casual',    cls: 'imp-low',      chip: 'color-low'      },
  { value: 'med',      label: 'Scheduled', cls: 'imp-med',      chip: 'color-med'      },
  { value: 'high',     label: 'Important', cls: 'imp-high',     chip: 'color-high'     },
  { value: 'critical', label: 'Urgent',    cls: 'imp-critical', chip: 'color-critical' },
];

// ── Preset Background Images ───────────────────────────────────────────────
export const BG_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80',
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1600&q=80',
];
