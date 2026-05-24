import { Trash2 } from 'lucide-react';

export default function CheckItem({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 bg-white rounded-xl border border-[#f0e0cc]">
      <button
        onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          item.checked
            ? 'bg-[#b5652a] border-[#b5652a]'
            : 'border-[#d4b896] bg-transparent'
        }`}
      >
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
        <span className="text-[10px] bg-[#c9472b] text-white px-1.5 py-0.5 rounded-full font-semibold shrink-0">
          TJ's
        </span>
      )}
      {onDelete && (
        <button onClick={() => onDelete(item.id)} className="text-[#c0a090] p-0.5 shrink-0">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
