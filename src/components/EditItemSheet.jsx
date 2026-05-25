import { useState } from 'react';
import { X, Trash2, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '../utils/categories';

export default function EditItemSheet({ item, onSave, onDelete, onClose }) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category ?? 'other');
  const [isStaple, setIsStaple] = useState(item.isStaple ?? false);
  const [isTJ, setIsTJ] = useState(item.isTJ ?? false);

  function handleSave() {
    if (!name.trim()) return;
    onSave({ ...item, name: name.trim(), category, isStaple, isTJ });
    onClose();
  }

  function handleDelete() {
    onDelete(item.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-[#fdf6ee] w-full rounded-t-3xl p-5 pb-10 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="flex justify-center -mt-1 mb-1">
          <div className="w-10 h-1 bg-[#dcc9b4] rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#3d2b1f]">Edit item</h2>
          <button onClick={onClose} className="text-[#a89080] p-1"><X size={18} /></button>
        </div>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#f5e8d6] rounded-xl px-4 py-3 text-base text-[#3d2b1f] outline-none"
        />

        {/* Category chips */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[#7a5c48] uppercase tracking-wide">Category</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === cat.id ? 'bg-[#b5652a] text-white' : 'bg-[#f5e8d6] text-[#7a5c48]'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsStaple((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isStaple ? 'bg-[#b5652a] text-white' : 'bg-[#f5e8d6] text-[#7a5c48]'
            }`}
          >
            <RefreshCw size={12} /> Recurring
          </button>
          <button
            onClick={() => setIsTJ((v) => !v)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isTJ ? 'bg-[#c9472b] text-white' : 'bg-[#f5e8d6] text-[#a89080]'
            }`}
          >
            TJ's
          </button>
        </div>

        {/* Save + Delete */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[#fce8e8] text-red-500 text-sm font-medium"
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-[#b5652a] text-white font-semibold text-sm active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
