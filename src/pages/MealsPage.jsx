import { useState } from 'react';
import { Plus } from 'lucide-react';
import MealCard from '../components/MealCard';
import MealForm from '../components/MealForm';
import {
  getMeals,
  saveMeals,
  getActiveMealIds,
  saveActiveMealIds,
} from '../utils/storage';

export default function MealsPage() {
  const [meals, setMeals] = useState(() => getMeals());
  const [activeMealIds, setActiveMealIds] = useState(() => getActiveMealIds());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  function persist(updated) {
    setMeals(updated);
    saveMeals(updated);
  }

  function handleSave(meal) {
    let updated;
    if (meals.find((m) => m.id === meal.id)) {
      updated = meals.map((m) => (m.id === meal.id ? meal : m));
    } else {
      updated = [meal, ...meals];
    }
    persist(updated);
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id) {
    persist(meals.filter((m) => m.id !== id));
    // also remove from active
    const newActive = activeMealIds.filter((aid) => aid !== id);
    setActiveMealIds(newActive);
    saveActiveMealIds(newActive);
  }

  function handleVibeChange(id, vibe) {
    persist(meals.map((m) => (m.id === id ? { ...m, vibe } : m)));
  }

  function handleToggleActive(id) {
    const newActive = activeMealIds.includes(id)
      ? activeMealIds.filter((aid) => aid !== id)
      : [...activeMealIds, id];
    setActiveMealIds(newActive);
    saveActiveMealIds(newActive);
  }

  const overMeals  = meals.filter((m) => m.vibe === 'over');
  const mehMeals   = meals.filter((m) => m.vibe === 'meh');
  const loveMeals  = meals.filter((m) => m.vibe === 'love');
  const ordered    = [...loveMeals, ...mehMeals, ...overMeals];

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-[#3d2b1f] tracking-tight">My Meals 🍽️</h1>
        <p className="text-sm text-[#a89080] mt-0.5">
          {meals.length === 0
            ? 'Add your first meal to get started'
            : `${meals.length} meal${meals.length !== 1 ? 's' : ''} · ${activeMealIds.length} on this week's list`}
        </p>
      </div>

      {/* Meals */}
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

      {/* FAB */}
      <button
        onClick={() => { setEditing(null); setShowForm(true); }}
        className="fixed right-5 bottom-[80px] bg-[#b5652a] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40"
      >
        <Plus size={26} />
      </button>

      {/* Form modal */}
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
