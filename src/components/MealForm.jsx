import { useState, useRef } from 'react';
import { X, Plus, Camera, Trash2 } from 'lucide-react';
import VibeRating from './VibeRating';
import { uid } from '../utils/storage';

const EMPTY_MEAL = {
  id: '',
  name: '',
  vibe: 'love',
  photo: null,       // base64 data URL
  proteinSwaps: '',  // free text e.g. "chicken / shrimp / tofu"
  ingredients: [],   // [{ id, name, isTJ }]
  notes: '',
};

export default function MealForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? { ...EMPTY_MEAL, id: uid() });
  const [newIngredient, setNewIngredient] = useState('');
  const [newIngIsTJ, setNewIngIsTJ] = useState(true);
  const fileRef = useRef();

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function addIngredient() {
    if (!newIngredient.trim()) return;
    setForm((f) => ({
      ...f,
      ingredients: [
        ...f.ingredients,
        { id: uid(), name: newIngredient.trim(), isTJ: newIngIsTJ },
      ],
    }));
    setNewIngredient('');
    setNewIngIsTJ(true);
  }

  function removeIngredient(id) {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.filter((i) => i.id !== id),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-[#fdf6ee] w-full rounded-t-3xl max-h-[92svh] overflow-y-auto pb-24">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#dcc9b4] rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-2">
          <h2 className="text-lg font-semibold text-[#3d2b1f]">
            {initial ? 'Edit Meal' : 'Add Meal'}
          </h2>
          <button onClick={onCancel} className="text-[#a89080] p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-5 mt-2">
          {/* Photo */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileRef}
              onChange={handlePhoto}
            />
            {form.photo ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden">
                <img src={form.photo} alt="meal" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, photo: null }))}
                  className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="w-full h-36 border-2 border-dashed border-[#d4b896] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#a89080] active:bg-[#f5e8d6] transition-colors"
              >
                <Camera size={28} />
                <span className="text-sm">Add a photo</span>
              </button>
            )}
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#7a5c48] uppercase tracking-wide">
              Meal name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Chicken stir-fry"
              className="bg-[#f5e8d6] rounded-xl px-4 py-3 text-[#3d2b1f] placeholder-[#b8a090] outline-none text-base"
              required
            />
          </div>

          {/* Protein swaps */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#7a5c48] uppercase tracking-wide">
              Protein swaps
            </label>
            <input
              value={form.proteinSwaps}
              onChange={(e) => setForm((f) => ({ ...f, proteinSwaps: e.target.value }))}
              placeholder="e.g. chicken / shrimp / tofu"
              className="bg-[#f5e8d6] rounded-xl px-4 py-3 text-[#3d2b1f] placeholder-[#b8a090] outline-none text-base"
            />
          </div>

          {/* Vibe */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#7a5c48] uppercase tracking-wide">
              Current vibe
            </label>
            <VibeRating
              value={form.vibe}
              onChange={(v) => setForm((f) => ({ ...f, vibe: v }))}
            />
          </div>

          {/* Ingredients */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#7a5c48] uppercase tracking-wide">
              Ingredients
            </label>

            {/* Existing */}
            <div className="flex flex-col gap-1.5">
              {form.ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center gap-2 bg-[#f5e8d6] rounded-xl px-3 py-2"
                >
                  <span className="flex-1 text-[#3d2b1f] text-sm">{ing.name}</span>
                  {ing.isTJ && (
                    <span className="text-[10px] bg-[#c9472b] text-white px-2 py-0.5 rounded-full font-semibold">
                      TJ's
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing.id)}
                    className="text-[#c08060] p-0.5"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new */}
            <div className="flex gap-2">
              <input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                placeholder="Add ingredient..."
                className="flex-1 bg-[#f5e8d6] rounded-xl px-3 py-2.5 text-[#3d2b1f] placeholder-[#b8a090] outline-none text-base"
              />
              <button
                type="button"
                onClick={() => setNewIngIsTJ((v) => !v)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  newIngIsTJ
                    ? 'bg-[#c9472b] text-white'
                    : 'bg-[#f5e8d6] text-[#a89080]'
                }`}
                title="Toggle Trader Joe's item"
              >
                TJ's
              </button>
              <button
                type="button"
                onClick={addIngredient}
                className="bg-[#b5652a] text-white rounded-xl px-3 py-2 active:scale-95"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#7a5c48] uppercase tracking-wide">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Any extra tips, variations, or links..."
              rows={2}
              className="bg-[#f5e8d6] rounded-xl px-4 py-3 text-[#3d2b1f] placeholder-[#b8a090] outline-none text-base resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#b5652a] text-white font-semibold rounded-2xl py-4 text-base active:scale-[0.98] transition-transform mt-1"
          >
            {initial ? 'Save changes' : 'Add meal'}
          </button>
        </form>
      </div>
    </div>
  );
}
