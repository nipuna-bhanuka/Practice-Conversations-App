interface Props {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export function CategoryFilter({ options, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o)}
            className={`h-9 rounded-full border px-4 text-sm font-semibold transition-colors hover:border-ink ${
              active ? 'border-ink bg-ink text-white' : 'border-[#E1E4EA] bg-white text-body'
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
