export interface ChipOption {
  value: string;
  label: string;
  emoji?: string | null;
  /** How many items this chip would leave after filtering. 0 disables it. */
  count: number;
  /** Active-state classes, e.g. a tag's own badge color. Falls back to primary. */
  color?: string;
}

interface FilterChipsProps {
  options: ChipOption[];
  /**
   * `string | null` — single-select: the active value, or null for "all".
   * `string[]` — multi-select: every active value, each toggled independently.
   */
  active: string | string[] | null;
  /** Called with the clicked chip's value. Single-select passes "" for the "all" chip. */
  onChange: (value: string) => void;
  /** Single-select only: prepends an "All" chip that clears the selection. */
  allLabel?: string;
  totalCount?: number;
  /** Fades the right edge so a long row (e.g. 19 plant categories) hints it scrolls. */
  edgeFade?: boolean;
  className?: string;
}

/**
 * One row of tappable chips, shared by plant categories, supply categories,
 * and supply tags — replaces the old Popover+Command combobox, which took
 * three taps (open, scroll, pick) for lists short enough to just lay flat.
 */
const FilterChips = ({ options, active, onChange, allLabel, totalCount, edgeFade, className = "" }: FilterChipsProps) => {
  const isActive = (value: string) => (Array.isArray(active) ? active.includes(value) : active === value);

  const chipClass = (on: boolean, disabled: boolean, color?: string) =>
    `shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors whitespace-nowrap ${
      disabled
        ? "bg-card border-border text-muted-foreground/40 cursor-not-allowed"
        : on
          ? `${color ?? "bg-primary text-primary-foreground"} border-transparent`
          : "bg-card border-border text-muted-foreground hover:border-primary/40"
    }`;

  return (
    <div className={`relative ${className}`}>
      <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 w-max pb-1">
          {allLabel && !Array.isArray(active) && (
            <button type="button" onClick={() => onChange("")} className={chipClass(active === null, false)}>
              {allLabel}
              {typeof totalCount === "number" && <span className="opacity-70">{totalCount}</span>}
            </button>
          )}
          {options.map((opt) => {
            const disabled = opt.count === 0;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={disabled}
                aria-pressed={isActive(opt.value)}
                onClick={() => onChange(opt.value)}
                className={chipClass(isActive(opt.value), disabled, opt.color)}
              >
                {opt.emoji && <span>{opt.emoji}</span>}
                {opt.label}
                <span className="opacity-70">{opt.count}</span>
              </button>
            );
          })}
        </div>
      </div>
      {edgeFade && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent" />
      )}
    </div>
  );
};

export default FilterChips;
