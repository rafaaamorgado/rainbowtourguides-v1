interface FilterChipsProps {
  filters: string[];
  selected: string[];
  onToggle: (filter: string) => void;
  label?: string;
}

export default function FilterChips({ filters, selected, onToggle, label }: FilterChipsProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-medium text-foreground">{label}</div>
      )}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isSelected = selected.includes(filter);
          return (
            <button
              key={filter}
              onClick={() => onToggle(filter)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-brand ${
                isSelected
                  ? "bg-primary text-white shadow-soft"
                  : "bg-white border border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
