import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import MealCard from '../components/MealCard';
import MealForm from '../components/MealForm';

export default function MealsPage({ meals, activeMealIds, loading, onMealsChange, onActiveChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  function handleSave(meal) {
    const exists = meals.find((m) => m.id === meal.id);
    const updated = exists
      ? meals.map((m) => (m.id === meal.id ? meal : m))
      : [meal, ...meals];
    onMealsChange(updated);
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id) {
    onMealsChange(meals.filter((m) => m.id !== id));
    onActiveChange(activeMealIds.filter((aid) => aid !== id));
  }

  function handleVibeChange(id, vibe) {
    onMealsChange(meals.map((m) => (m.id === id ? { ...m, vibe } : m)));
  }

  function handleToggleActive(id) {
    const newActive = activeMealIds.includes(id)
      ? activeMealIds.filter((aid) => aid !== id)
      : [...activeMealIds, id];
    onActiveChange(newActive);
  }

  const loveMeals = meals.filter((m) => m.vibe === 'love');
  const mehMeals  = meals.filter((m) => m.vibe === 'meh');
  const overMeals = meals.filter((m) => m.vibe === 'over');
  const ordered   = [...loveMeals, ...mehMeals, ...overMeals];

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-[#3d2b1f] tracking-tight">My Meals 🍽️</h1>
        <p className="text-sm text-[#a89080] mt-0.5">
          {loading
            ? 'Loading…'
            : meals.length === 0
            ? 'Add your first meal to get started'
            : `${meals.length} meal${meals.length !== 1 ? 's' : ''} · ${activeMealIds.length} on this week's list`}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#d4b896]" />
        </div>
      )}

      {!loading && (
        <div className="px-4 flex flex-col gap-3">
          {ordered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#c8aa90]">
              <span className="text-5xl">🥘</span>
              <p className="text-sm text-center">
                No meals yet.<br />Tap the + to add your first one!
              </p>
            </div>
          )}
          {ordered.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onEdit={(m) => { setEditing(m); setShowForm(true); }}
              onDelete={handleDelete}
              onVibeChange={handleVibeChange}
              isActive={activeMealIds.includes(meal.id)}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => { setEditing(null); setShowForm(true); }}
        className="fixed right-5 bottom-[80px] bg-[#b5652a] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40"
      >
        <Plus size={26} />
      </button>

      {showForm && (
        <MealForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
