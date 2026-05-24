import { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronUp, ShoppingBasket } from 'lucide-react';
import VibeRating from './VibeRating';

const VIBE_COLORS = {
  love: 'bg-emerald-100 text-emerald-700',
  meh:  'bg-amber-100 text-amber-700',
  over: 'bg-red-100 text-red-700',
};

export default function MealCard({ meal, onEdit, onDelete, onVibeChange, isActive, onToggleActive }) {
  const [expanded, setExpanded] = useState(false);
  const tjIngredients = meal.ingredients.filter((i) => i.isTJ);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all ${
      isActive ? 'border-[#b5652a]' : 'border-[#f0e0cc]'
    }`}>
      {/* Photo or placeholder */}
      {meal.photo && (
        <div className="h-40 rounded-t-2xl overflow-hidden">
          <img src={meal.photo} alt={meal.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-[#3d2b1f] text-base leading-tight">{meal.name}</h3>
            {meal.proteinSwaps && (
              <p className="text-xs text-[#a89080] mt-0.5">🔄 {meal.proteinSwaps}</p>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onEdit(meal)}
              className="p-2 text-[#a89080] active:text-[#b5652a]"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(meal.id)}
              className="p-2 text-[#a89080] active:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Vibe */}
        <VibeRating value={meal.vibe} onChange={(v) => onVibeChange(meal.id, v)} />

        {/* Ingredient count + expand */}
        {meal.ingredients.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-[#a89080] self-start"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}
            {tjIngredients.length > 0 && (
              <span className="ml-1 bg-[#c9472b]/10 text-[#c9472b] px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                {tjIngredients.length} TJ's
              </span>
            )}
          </button>
        )}

        {expanded && (
          <ul className="flex flex-col gap-1 pl-1">
            {meal.ingredients.map((ing) => (
              <li key={ing.id} className="flex items-center gap-2 text-sm text-[#5c3d2b]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4b896] shrink-0" />
                {ing.name}
                {ing.isTJ && (
                  <span className="text-[10px] bg-[#c9472b] text-white px-1.5 py-0.5 rounded-full font-semibold ml-auto">
                    TJ's
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {meal.notes && (
          <p className="text-xs text-[#a89080] italic border-t border-[#f0e0cc] pt-2">{meal.notes}</p>
        )}

        {/* Add to this week */}
        <button
          onClick={() => onToggleActive(meal.id)}
          className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-all ${
            isActive
              ? 'bg-[#b5652a] text-white'
              : 'bg-[#f5e8d6] text-[#7a5c48]'
          }`}
        >
          <ShoppingBasket size={15} />
          {isActive ? 'On this week\'s list ✓' : 'Add to this week'}
        </button>
      </div>
    </div>
  );
}
