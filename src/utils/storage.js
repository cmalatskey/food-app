import { supabase } from '../lib/supabase'

// ── Core helpers ───────────────────────────────────────────────────────────
async function get(key, fallback) {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('value')
      .eq('key', key)
      .single()
    if (error) return fallback
    return data?.value ?? fallback
  } catch {
    return fallback
  }
}

async function set(key, value) {
  try {
    await supabase.from('app_state').upsert({ key, value })
  } catch (e) {
    console.error('Supabase write error', e)
  }
}

// ── Meals ──────────────────────────────────────────────────────────────────
export async function getMeals() {
  return get('meals', [])
}
export async function saveMeals(meals) {
  return set('meals', meals)
}

// ── Staples ────────────────────────────────────────────────────────────────
export async function getStaples() {
  return get('staples', DEFAULT_STAPLES)
}
export async function saveStaples(staples) {
  return set('staples', staples)
}

// ── Weekly grocery lists ───────────────────────────────────────────────────
export async function getMyGrocery() {
  return get('grocery_my', [])
}
export async function saveMyGrocery(items) {
  return set('grocery_my', items)
}

export async function getSisterGrocery() {
  return get('grocery_sister', [])
}
export async function saveSisterGrocery(items) {
  return set('grocery_sister', items)
}

// ── Active meals for the week ──────────────────────────────────────────────
export async function getActiveMealIds() {
  return get('active_meal_ids', [])
}
export async function saveActiveMealIds(ids) {
  return set('active_meal_ids', ids)
}

// ── Default staples ────────────────────────────────────────────────────────
const DEFAULT_STAPLES = [
  { id: 's1', name: 'Carrots', checked: false },
  { id: 's2', name: 'Cucumbers', checked: false },
  { id: 's3', name: 'Greek yogurt', checked: false },
  { id: 's4', name: 'Bananas', checked: false },
  { id: 's5', name: 'Chicken', checked: false },
  { id: 's6', name: 'Sweet Potatoes', checked: false },
]

// ── ID generator ──────────────────────────────────────────────────────────
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
