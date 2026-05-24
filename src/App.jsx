import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import MealsPage from './pages/MealsPage';
import GroceryPage from './pages/GroceryPage';
import { getMeals, saveMeals, getActiveMealIds, saveActiveMealIds } from './utils/storage';

export default function App() {
  const [tab, setTab] = useState('meals');

  // Shared state — both pages read from here so there's no race condition
  const [meals, setMeals] = useState([]);
  const [activeMealIds, setActiveMealIds] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMeals(), getActiveMealIds()]).then(([m, ids]) => {
      setMeals(m);
      setActiveMealIds(ids);
      setMealsLoading(false);
    });
  }, []);

  function updateMeals(updated) {
    setMeals(updated);
    saveMeals(updated);
  }

  function updateActiveMealIds(ids) {
    setActiveMealIds(ids);
    saveActiveMealIds(ids);
  }

  return (
    <div className="max-w-md mx-auto min-h-svh bg-[#fdf6ee] relative">
      {tab === 'meals' && (
        <MealsPage
          meals={meals}
          activeMealIds={activeMealIds}
          loading={mealsLoading}
          onMealsChange={updateMeals}
          onActiveChange={updateActiveMealIds}
        />
      )}
      {tab === 'grocery' && (
        <GroceryPage
          meals={meals}
          activeMealIds={activeMealIds}
        />
      )}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
