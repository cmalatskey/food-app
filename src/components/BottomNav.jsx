import { UtensilsCrossed, ShoppingBasket } from 'lucide-react';

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#fdf6ee] border-t border-[#e8d9c4] flex z-50 safe-area-bottom">
      <button
        onClick={() => setTab('meals')}
        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
          tab === 'meals'
            ? 'text-[#b5652a]'
            : 'text-[#a89080]'
        }`}
      >
        <UtensilsCrossed size={22} strokeWidth={tab === 'meals' ? 2.2 : 1.6} />
        Meals
      </button>
      <button
        onClick={() => setTab('grocery')}
        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
          tab === 'grocery'
            ? 'text-[#b5652a]'
            : 'text-[#a89080]'
        }`}
      >
        <ShoppingBasket size={22} strokeWidth={tab === 'grocery' ? 2.2 : 1.6} />
        Grocery
      </button>
    </nav>
  );
}
