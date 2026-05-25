import { useState, useEffect, useMemo } from 'react';
import { Plus, RotateCcw, RefreshCw, Loader2, X } from 'lucide-react';
import CheckItem from '../components/CheckItem';
import {
  getGroceryItems, saveGroceryItems,
  getSisterGrocery, saveSisterGrocery,
  saveActiveMealIds,
  uid,
} from '../utils/storage';
import { CATEGORIES, CATEGORY_MAP, DEFAULT_CATEGORY } from '../utils/categories';

function sortByChecked(items) {
  return [...items].sort((a, b) => Number(a.checked) - Number(b.checked));
}

// ── Add item row at the bottom ─────────────────────────────────────────────
function AddItemPanel({ onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [isStaple, setIsStaple] = useState(false);
  const [isTJ, setIsTJ] = useState(false);

  function submit() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category, isStaple, isTJ });
    setName('');
    setCategory(DEFAULT_CATEGORY);
    setIsStaple(false);
    setIsTJ(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#f0e0cc] p-4 flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[#b5652a]">Add item</p>

      {/* Name row */}
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Item name..."
          className="flex-1 bg-[#f5e8d6] rounded-xl px-3 py-2.5 text-base text-[#3d2b1f] placeholder-[#b8a090] outline-none" />
        <button onClick={submit} className="bg-[#b5652a] text-white rounded-xl px-4 py-2 font-semibold active:scale-95 text-sm">
          Add
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              category === cat.id ? 'bg-[#b5652a] text-white' : 'bg-[#f5e8d6] text-[#7a5c48]'
            }`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="flex gap-2">
        <button type="button" onClick={() => setIsStaple((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            isStaple ? 'bg-[#b5652a] text-white' : 'bg-[#f5e8d6] text-[#7a5c48]'
          }`}>
          <RefreshCw size={12} />
          Recurring
        </button>
        <button type="button" onClick={() => setIsTJ((v) => !v)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            isTJ ? 'bg-[#c9472b] text-white' : 'bg-[#f5e8d6] text-[#a89080]'
          }`}>
          TJ's
        </button>
      </div>
    </div>
  );
}

// ── Single grocery item row ────────────────────────────────────────────────
function GroceryItemRow({ item, onToggle, onDelete, onToggleStaple }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 bg-white rounded-xl border border-[#f0e0cc]">
      <button onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          item.checked ? 'bg-[#b5652a] border-[#b5652a]' : 'border-[#d4b896]'
        }`}>
        {item.checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-[#b8a090]' : 'text-[#3d2b1f]'}`}>
        {item.name}
      </span>
      {item.fromMeal && (
        <span className="text-[10px] text-[#a89080] italic shrink-0">{item.fromMeal}</span>
      )}
      {item.isTJ && (
        <span className="text-[10px] bg-[#c9472b] text-white px-1.5 py-0.5 rounded-full font-semibold shrink-0">TJ's</span>
      )}
      {item.isStaple && (
        <button onClick={() => onToggleStaple(item.id)} title="Recurring item" className="shrink-0">
          <RefreshCw size={12} className="text-[#b5652a]" />
        </button>
      )}
      {!item.isStaple && onDelete && (
        <button onClick={() => onDelete(item.id)} className="text-[#c0a090] p-0.5 shrink-0">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ── Sister item row (simple) ───────────────────────────────────────────────
function SisterItemRow({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 bg-white rounded-xl border border-[#f0d0da]">
      <button onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          item.checked ? 'bg-[#c25a7a] border-[#c25a7a]' : 'border-[#e0b0c0]'
        }`}>
        {item.checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-[#c0a0b0]' : 'text-[#3d2b1f]'}`}>
        {item.name}
      </span>
      <button onClick={() => onDelete(item.id)} className="text-[#d0a0b0] p-0.5 shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

export default function GroceryPage({ meals, activeMealIds }) {
  const [loading, setLoading] = useState(true);
  const [myItems, setMyItems] = useState([]);
  const [sisterItems, setSisterItems] = useState([]);
  const [sisterInput, setSisterInput] = useState('');

  // Load grocery + sister from Supabase on mount
  useEffect(() => {
    Promise.all([getGroceryItems(), getSisterGrocery()]).then(([items, sister]) => {
      setMyItems(items);
      setSisterItems(sister);
      setLoading(false);
    });
  }, []);

  // ── Derive meal ingredients from shared props, merge into item list ───────
  const allItems = useMemo(() => {
    const activeMeals = meals.filter((m) => activeMealIds.includes(m.id));
    const mealIngIds = new Set();

    // Collect all meal-driven items
    const mealDriven = [];
    const seen = new Set();
    for (const meal of activeMeals) {
      for (const ing of meal.ingredients ?? []) {
        const key = ing.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          const compositeId = `meal_${ing.id}_${meal.id}`;
          mealIngIds.add(compositeId);
          mealDriven.push({
            id: compositeId,
            name: ing.name,
            category: ing.category ?? DEFAULT_CATEGORY,
            isStaple: false,
            isTJ: ing.isTJ,
            fromMeal: meal.name,
            checked: false,
          });
        }
      }
    }

    // Merge: saved items + meal-driven (dedupe by name)
    const savedNames = new Set(myItems.map((i) => i.name.toLowerCase()));
    const newMealItems = mealDriven.filter((m) => !savedNames.has(m.name.toLowerCase()));

    return [...myItems, ...newMealItems];
  }, [myItems, meals, activeMealIds]);

  function persistMyItems(updated) {
    // Only save non-meal-driven items to Supabase
    const toSave = updated.filter((i) => !i.id.startsWith('meal_'));
    setMyItems(toSave);
    saveGroceryItems(toSave);
  }

  function toggleItem(id) {
    const updated = allItems.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
    persistMyItems(updated);
  }

  function deleteItem(id) {
    persistMyItems(allItems.filter((i) => i.id !== id));
  }

  function toggleStaple(id) {
    const updated = allItems.map((i) => (i.id === id ? { ...i, isStaple: !i.isStaple } : i));
    persistMyItems(updated);
  }

  function addItem({ name, category, isStaple, isTJ }) {
    const newItem = { id: uid(), name, category, isStaple, isTJ, checked: false, fromMeal: null };
    const updated = [...allItems, newItem];
    persistMyItems(updated);
  }

  // ── Reset week ────────────────────────────────────────────────────────────
  function resetWeek() {
    // Keep staples (unchecked), drop everything else
    const kept = myItems
      .filter((i) => i.isStaple)
      .map((i) => ({ ...i, checked: false }));
    setMyItems(kept);
    saveGroceryItems(kept);
    saveActiveMealIds([]);
    setSisterItems([]);
    saveSisterGrocery([]);
  }

  // ── Sister ────────────────────────────────────────────────────────────────
  function addSister(name) {
    if (!name.trim()) return;
    const updated = [...sisterItems, { id: uid(), name: name.trim(), checked: false }];
    setSisterItems(updated);
    saveSisterGrocery(updated);
  }
  function toggleSister(id) {
    const updated = sisterItems.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
    setSisterItems(updated);
    saveSisterGrocery(updated);
  }
  function deleteSister(id) {
    const updated = sisterItems.filter((i) => i.id !== id);
    setSisterItems(updated);
    saveSisterGrocery(updated);
  }

  // ── Group by category ─────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const groups = {};
    for (const item of allItems) {
      const cat = item.category ?? DEFAULT_CATEGORY;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    // Return in CATEGORIES order, only non-empty
    return CATEGORIES
      .filter((c) => groups[c.id]?.length > 0)
      .map((c) => ({ ...c, items: sortByChecked(groups[c.id]) }));
  }, [allItems]);

  const totalUnchecked = allItems.filter((i) => !i.checked).length
    + sisterItems.filter((i) => !i.checked).length;

  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3d2b1f] tracking-tight">TJ's List 🛒</h1>
          <p className="text-sm text-[#a89080] mt-0.5">
            {loading ? 'Loading…'
              : totalUnchecked > 0 ? `${totalUnchecked} item${totalUnchecked !== 1 ? 's' : ''} left`
              : '🎉 All done!'}
          </p>
        </div>
        <button onClick={resetWeek}
          className="flex items-center gap-1.5 text-xs text-[#a89080] bg-[#f5e8d6] px-3 py-2 rounded-xl active:bg-[#ecd8c0]">
          <RotateCcw size={13} />
          Reset week
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#d4b896]" />
        </div>
      )}

      {!loading && (
        <div className="px-4 flex flex-col gap-4">

          {/* ── Category groups ── */}
          {grouped.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-2 text-[#c8aa90]">
              <span className="text-4xl">🛒</span>
              <p className="text-sm text-center">
                Your list is empty.<br />Add items below or activate meals on the Meals tab.
              </p>
            </div>
          )}

          {grouped.map((cat) => (
            <div key={cat.id}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-base">{cat.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8a7060]">{cat.label}</span>
                <span className="text-xs text-[#c0a890] ml-auto">
                  {cat.items.filter((i) => !i.checked).length} left
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {cat.items.map((item) => (
                  <GroceryItemRow
                    key={item.id}
                    item={item}
                    onToggle={toggleItem}
                    onDelete={deleteItem}
                    onToggleStaple={toggleStaple}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* ── Add item panel ── */}
          <AddItemPanel onAdd={addItem} />

          {/* ── Sister's section ── */}
          <div className="bg-[#fff5f8] rounded-2xl border border-[#f0d0da] p-4 flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#c25a7a]">
              For your sister 💕
            </p>
            <div className="flex flex-col gap-1.5">
              {sortByChecked(sisterItems).map((item) => (
                <SisterItemRow key={item.id} item={item} onToggle={toggleSister} onDelete={deleteSister} />
              ))}
              {sisterItems.length === 0 && (
                <p className="text-xs text-[#d0a0b0] text-center py-1">No items added for her yet</p>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <input value={sisterInput} onChange={(e) => setSisterInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { addSister(sisterInput); setSisterInput(''); } }}
                placeholder="Add her item..."
                className="flex-1 bg-[#fde8f0] rounded-xl px-3 py-2 text-base text-[#3d2b1f] placeholder-[#d0a0b0] outline-none" />
              <button onClick={() => { addSister(sisterInput); setSisterInput(''); }}
                className="bg-[#c25a7a] text-white rounded-xl px-3 py-2 active:scale-95">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
