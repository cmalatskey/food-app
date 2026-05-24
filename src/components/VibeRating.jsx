// Three-tier "how tired am I of this meal" rating
const VIBES = [
  { value: 'love', emoji: '😍', label: 'Still obsessed' },
  { value: 'meh',  emoji: '😐', label: 'Getting old'   },
  { value: 'over', emoji: '🙅', label: 'Need a break'  },
];

export default function VibeRating({ value, onChange, readOnly = false }) {
  return (
    <div className="flex gap-2">
      {VIBES.map((v) => (
        <button
          key={v.value}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(v.value)}
          title={v.label}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs transition-all ${
            value === v.value
              ? 'bg-[#b5652a] text-white scale-105 shadow-sm'
              : 'bg-[#f5e8d6] text-[#8a6a50]'
          } ${readOnly ? 'cursor-default' : 'active:scale-95'}`}
        >
          <span className="text-lg leading-none">{v.emoji}</span>
          <span className="whitespace-nowrap">{v.label}</span>
        </button>
      ))}
    </div>
  );
}

export { VIBES };
