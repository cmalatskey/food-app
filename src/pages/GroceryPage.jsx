import { useState, useMemo } from 'react';
import { Plus, RotateCcw, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import CheckItem from '../components/CheckItem';
import {
  getMeals,
  getStaples,
  saveStaples,
  getMyGrocery,
  saveMyGrocery,
  getSisterGrocery,
  saveSisterGrocery,
  getActiveMealIds,
  saveActiveMealIds,
  uid,
} from '../utils/storage';

// Unchecked items first, checked items at the bottom
function sortByChecked(items) {
  return [...items].sort((a, b) => Number(a.checked) - Number(b.checked));
}

function SectionHeader({ title, count, open, toggle, accent }) {
  return (
    <button
      onClick={toggle}
      className="flex items-center justify-between w-full mb-2"
    >
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold uppercase tracking-wider ${accent}`}>{title}</span>
        {count > 0 && (
          <span className="text-xs bg-[#f5e8d6] text-[#7a5c48] px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {open ? <ChevronUp size={16} className="text-[#a89080]" /> : <ChevronDown size={16} className="text-[#a89080]" />}
    </button>
  );
}

function AddItemRow({ placeholder, onAdd, isTJToggle }) {
  const [val, setVal] = useState('');
  const [isTJ, setIsTJ] = useState(isTJToggle ?? false);

  function submit() {
    if (!val.trim()) return;
    onAdd(val.trim(), isTJ);
    setVal('');
  }

  return (
    <div className="flex gap-2 mt-2">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        className="flex-1 bg-[#f5e8d6] rounded-xl px-3 py-2 text-base text-[#3d2b1f] placeholder-[#b8a090] outline-none"
      />
      {isTJToggle !== undefined && (
        <button
          type="button"
          onClick={() => setIsTJ((v) => !v)}
          className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            isTJ ? 'bg-[#c9472b] text-white' : 'bg-[#f5e8d6] text-[#a89080]'
          }`}
        >
          TJ's
        </button>
      )}
      <button
        onClick={submit}
        className="bg-[#b5652a] text-white rounded-xl px-3 py-2 active:scale-95"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

export default function GroceryPage() {
  // ── Staples ────────────────────────────────────────────────────────────
  const [staples, setStaples] = useState(() => getStaples());
  const [staplesOpen, setStaplesOpen] = useState(true);
  const [editingStaples, setEditingStaples] = useState(false);

  function toggleStaple(id) {
    const updated = staples.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s));
    setStaples(updated);
    saveStaples(updated);
  }

  function addStaple(name) {
    const updated = [...staples, { id: uid(), name, checked: false }];
    setStaples(updated);
    saveStaples(updated);
  }

  function deleteStaple(id) {
    const updated = staples.filter((s) => s.id !== id);
    setStaples(updated);
    saveStaples(updated);
  }

  // ── Reset the whole week ───────────────────────────────────────────────
  function resetWeek() {
    // Uncheck all staples (they recur every week)
    const resetedStaples = staples.map((s) => ({ ...s, checked: false }));
    setStaples(resetedStaples);
    saveStaples(resetedStaples);

    // Clear active meals for the week
    saveActiveMealIds([]);
    setMealItems([]);

    // Clear one-off extras
    setMyExtras([]);
    saveMyGrocery([]);

    // Clear sister's items
    setSisterItems([]);
    saveSisterGrocery([]);
  }

  // ── Meal-driven ingredients (re-reads localStorage every mount) ────────
  const mealIngredients = useMemo(() => {
    const meals = getMeals();
    const activeIds = getActiveMealIds();
    const activeMeals = meals.filter((m) => activeIds.includes(m.id));
    const seen = new Set();
    const items = [];
    for (const meal of activeMeals) {
      for (const ing of meal.ingredients) {
        const key = ing.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          items.push({
            id: ing.id + '_' + meal.id,
            name: ing.name,
            isTJ: ing.isTJ,
            fromMeal: meal.name,
            checked: false,
          });
        }
      }
    }
    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mealItems, setMealItems] = useState(mealIngredients);
  const [mealsOpen, setMealsOpen] = useState(true);

  function toggleMealItem(id) {
    setMealItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }

  // ── My extras ─────────────────────────────────────────────────────────
  const [myExtras, setMyExtras] = useState(() => getMyGrocery());
  const [extrasOpen, setExtrasOpen] = useState(true);

  function toggleMyExtra(id) {
    const updated = myExtras.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
    setMyExtras(updated);
    saveMyGrocery(updated);
  }

  function addMyExtra(name, isTJ) {
    const updated = [...myExtras, { id: uid(), name, isTJ, checked: false }];
    setMyExtras(updated);
    saveMyGrocery(updated);
  }

  function deleteMyExtra(id) {
    const updated = myExtras.filter((i) => i.id !== id);
    setMyExtras(updated);
    saveMyGrocery(updated);
  }

  // ── Sister's items ─────────────────────────────────────────────────────
  const [sisterItems, setSisterItems] = useState(() => getSisterGrocery());
  const [sisterOpen, setSisterOpen] = useState(true);

  function toggleSister(id) {
    const updated = sisterItems.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
    setSisterItems(updated);
    saveSisterGrocery(updated);
  }

  function addSister(name) {
    const updated = [...sisterItems, { id: uid(), name, checked: false }];
    setSisterItems(updated);
    saveSisterGrocery(updated);
  }

  function deleteSister(id) {
    const updated = sisterItems.filter((i) => i.id !== id);
    setSisterItems(updated);
    saveSisterGrocery(updated);
  }

  // ── Total unchecked count ──────────────────────────────────────────────
  const totalUnchecked =
    staples.filter((s) => !s.checked).length +
    mealItems.filter((i) => !i.checked).length +
    myExtras.filter((i) => !i.checked).length +
    sisterItems.filter((i) => !i.checked).length;

  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3d2b1f] tracking-tight">TJ's List 🛒</h1>
          <p className="text-sm text-[#a89080] mt-0.5">
            {totalUnchecked > 0 ? `${totalUnchecked} item${totalUnchecked !== 1 ? 's' : ''} left` : '🎉 All done!'}
          </p>
        </div>
        <button
          onClick={resetWeek}
          className="flex items-center gap-1.5 text-xs text-[#a89080] bg-[#f5e8d6] px-3 py-2 rounded-xl active:bg-[#ecd8c0]"
        >
          <RotateCcw size={13} />
          Reset week
        </button>
      </div>

      <div className="px-4 flex flex-col gap-5">
        {/* ── Staples section ── */}
        <section className="bg-[#fffaf4] rounded-2xl border border-[#f0e0cc] p-4">
          <SectionHeader
            title="Weekly staples"
            count={staples.filter((s) => !s.checked).length}
            open={staplesOpen}
            toggle={() => setStaplesOpen((v) => !v)}
            accent="text-[#b5652a]"
          />
          {staplesOpen && (
            <>
              <div className="flex flex-col gap-1.5">
                {sortByChecked(staples).map((item) => (
                  <CheckItem
                    key={item.id}
                    item={item}
                    onToggle={toggleStaple}
                    onDelete={editingStaples ? deleteStaple : null}
                  />
                ))}
                {staples.length === 0 && (
                  <p className="text-xs text-[#c0a090] text-center py-3">No staples yet</p>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <AddItemRow placeholder="Add staple..." onAdd={(name) => addStaple(name)} />
              </div>
              <button
                onClick={() => setEditingStaples((v) => !v)}
                className="flex items-center gap-1 mt-2 text-xs text-[#a89080]"
              >
                <Settings size={12} />
                {editingStaples ? 'Done editing' : 'Edit staples'}
              </button>
            </>
          )}
        </section>

        {/* ── Meal ingredients section ── */}
        <section className="bg-[#fffaf4] rounded-2xl border border-[#f0e0cc] p-4">
          <SectionHeader
            title="From meals"
            count={mealItems.filter((i) => !i.checked).length}
            open={mealsOpen}
            toggle={() => setMealsOpen((v) => !v)}
            accent="text-[#7a8c3d]"
          />
          {mealsOpen && (
            <>
              {mealItems.length === 0 ? (
                <p className="text-xs text-[#c0a090] text-center py-3">
                  Go to Meals → tap "Add to this week" on a meal to fill ingredients here
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {sortByChecked(mealItems).map((item) => (
                    <CheckItem
                      key={item.id}
                      item={item}
                      onToggle={toggleMealItem}
                      onDelete={null}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── My extras section ── */}
        <section className="bg-[#fffaf4] rounded-2xl border border-[#f0e0cc] p-4">
          <SectionHeader
            title="My extras"
            count={myExtras.filter((i) => !i.checked).length}
            open={extrasOpen}
            toggle={() => setExtrasOpen((v) => !v)}
            accent="text-[#5a7ab5]"
          />
          {extrasOpen && (
            <>
              <div className="flex flex-col gap-1.5">
                {sortByChecked(myExtras).map((item) => (
                  <CheckItem
                    key={item.id}
                    item={item}
                    onToggle={toggleMyExtra}
                    onDelete={deleteMyExtra}
                  />
                ))}
                {myExtras.length === 0 && (
                  <p className="text-xs text-[#c0a090] text-center py-3">No extras added</p>
                )}
              </div>
              <AddItemRow
                placeholder="Add one-off item..."
                onAdd={addMyExtra}
                isTJToggle={false}
              />
            </>
          )}
        </section>

        {/* ── Sister's section ── */}
        <section className="bg-[#fff5f8] rounded-2xl border border-[#f0d0da] p-4">
          <SectionHeader
            title="For your sister 💕"
            count={sisterItems.filter((i) => !i.checked).length}
            open={sisterOpen}
            toggle={() => setSisterOpen((v) => !v)}
            accent="text-[#c25a7a]"
          />
          {sisterOpen && (
            <>
              <div className="flex flex-col gap-1.5">
                {sortByChecked(sisterItems).map((item) => (
                  <CheckItem
                    key={item.id}
                    item={item}
                    onToggle={toggleSister}
                    onDelete={deleteSister}
                  />
                ))}
                {sisterItems.length === 0 && (
                  <p className="text-xs text-[#d0a0b0] text-center py-3">No items added for her yet</p>
                )}
              </div>
              <AddItemRow placeholder="Add her item..." onAdd={(name) => addSister(name)} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
