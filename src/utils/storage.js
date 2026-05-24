// Simple localStorage helpers

const KEYS = {
  MEALS: 'carly_meals',
  STAPLES: 'carly_staples',
  GROCERY_MY: 'carly_grocery_my',
  GROCERY_SISTER: 'carly_grocery_sister',
  ACTIVE_MEALS: 'carly_active_meals', // meals selected for this week
};

function get(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Meals ──────────────────────────────────────────────────────────────────
export function getMeals() {
  return get(KEYS.MEALS, []);
}

export function saveMeals(meals) {
  set(KEYS.MEALS, meals);
}

// ── Staples (weekly recurring TJ's items) ─────────────────────────────────
export function getStaples() {
  return get(KEYS.STAPLES, DEFAULT_STAPLES);
}

export function saveStaples(staples) {
  set(KEYS.STAPLES, staples);
}

// ── Weekly grocery lists ───────────────────────────────────────────────────
export function getMyGrocery() {
  return get(KEYS.GROCERY_MY, []);
}
export function saveMyGrocery(items) {
  set(KEYS.GROCERY_MY, items);
}

export function getSisterGrocery() {
  return get(KEYS.GROCERY_SISTER, []);
}
export function saveSisterGrocery(items) {
  set(KEYS.GROCERY_SISTER, items);
}

// ── Active meals for the week ──────────────────────────────────────────────
export function getActiveMealIds() {
  return get(KEYS.ACTIVE_MEALS, []);
}
export function saveActiveMealIds(ids) {
  set(KEYS.ACTIVE_MEALS, ids);
}

// ── Default staples ────────────────────────────────────────────────────────
const DEFAULT_STAPLES = [
  { id: 's1', name: 'Eggs', checked: false },
  { id: 's2', name: 'Almond milk', checked: false },
  { id: 's3', name: 'Greek yogurt', checked: false },
  { id: 's4', name: 'Bananas', checked: false },
  { id: 's5', name: 'Avocados', checked: false },
  { id: 's6', name: 'Olive oil', checked: false },
  { id: 's7', name: 'Lemons', checked: false },
];

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
