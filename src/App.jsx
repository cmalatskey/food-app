import { useState } from 'react';
import BottomNav from './components/BottomNav';
import MealsPage from './pages/MealsPage';
import GroceryPage from './pages/GroceryPage';

export default function App() {
  const [tab, setTab] = useState('meals');

  return (
    <div className="max-w-md mx-auto min-h-svh bg-[#fdf6ee] relative">
      {tab === 'meals'   && <MealsPage />}
      {tab === 'grocery' && <GroceryPage />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
