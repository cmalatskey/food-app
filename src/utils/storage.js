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
export async function getMeals() { return get('meals', []) }
export async function saveMeals(meals) { return set('meals', meals) }

// ── Active meals for the week ──────────────────────────────────────────────
export async function getActiveMealIds() { return get('active_meal_ids', []) }
export async function saveActiveMealIds(ids) { return set('active_meal_ids', ids) }

// ── Unified grocery items ──────────────────────────────────────────────────
// Each item: { id, name, category, isStaple, isTJ, checked, fromMeal? }
export async function getGroceryItems() {
  const items = await get('grocery_items', null)

  // First-ever load or migrating from old format
  if (items === null) {
    const [oldStaples, oldExtras] = await Promise.all([
      get('staples', []),
      get('grocery_my', []),
    ])
    const migrated = [
      ...oldStaples.map((s) => ({
        id: s.id,
        name: s.name,
        category: 'other',
        isStaple: true,
        isTJ: false,
        checked: false,
        fromMeal: null,
      })),
      ...oldExtras.map((i) => ({
        id: i.id,
        name: i.name,
        category: 'other',
        isStaple: false,
        isTJ: i.isTJ ?? false,
        checked: false,
        fromMeal: null,
      })),
    ]
    await set('grocery_items', migrated)
    return migrated
  }

  return items
}
export async function saveGroceryItems(items) { return set('grocery_items', items) }

// ── Sister's items (stays separate) ───────────────────────────────────────
export async function getSisterGrocery() { return get('grocery_sister', []) }
export async function saveSisterGrocery(items) { return set('grocery_sister', items) }

// ── ID generator ──────────────────────────────────────────────────────────
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
