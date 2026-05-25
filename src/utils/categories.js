export const CATEGORIES = [
  { id: 'produce',  label: 'Produce',      emoji: '🥦' },
  { id: 'frozen',   label: 'Frozen',       emoji: '🧊' },
  { id: 'dairy',    label: 'Dairy & Eggs', emoji: '🥛' },
  { id: 'protein',  label: 'Meat & Fish',  emoji: '🥩' },
  { id: 'pantry',   label: 'Pantry',       emoji: '🥫' },
  { id: 'snacks',   label: 'Snacks',       emoji: '🍪' },
  { id: 'other',    label: 'Other',        emoji: '🛒' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
export const DEFAULT_CATEGORY = 'other';
