import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface ChipOption {
  value: string;
  label: string;
  emoji?: string | null;
  /** How many items this chip would leave after filtering. 0 disables it. */
  count: number;
  /** Active-state classes, e.g. a tag's own badge color. Falls back to primary. */
  color?: string;
  /** Inline override for a tag's freely-chosen bg/text color pair — takes
   *  precedence over `color` when present (see tagBadgeStyle in @/lib/tagColor). */
  style?: CSSProperties;
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
  /**
   * Opt-in: instead of scrolling sideways, keep the chips to a single row and
   * collapse whatever doesn't fit into a "More" dropdown at the end. How many
   * fit is measured, not guessed, so it adapts to any width and any language.
   */
  overflowMenu?: boolean;
  className?: string;
}

/** Horizontal gap between chips, matching the `gap-2` on the row below. Pages
 *  may restyle it (plants.css uses 11px), so it's read off the DOM instead of
 *  assumed — this is only the fallback for the first measure. */
const FALLBACK_GAP = 8;

/**
 * One row of tappable chips, shared by plant categories, supply categories,
 * and supply tags — replaces the old Popover+Command combobox, which took
 * three taps (open, scroll, pick) for lists short enough to just lay flat.
 */
const FilterChips = ({
  options,
  active,
  onChange,
  allLabel,
  totalCount,
  edgeFade,
  overflowMenu,
  className = "",
}: FilterChipsProps) => {
  const { t } = useLanguage();
  const isActive = (value: string) => (Array.isArray(active) ? active.includes(value) : active === value);

  const viewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(options.length);
  const [moreOpen, setMoreOpen] = useState(false);

  // Whether an "All" chip leads the row. Only its presence matters here, not
  // the selection, so clicking a chip doesn't churn the measure callback.
  const hasAllChip = !!allLabel && !Array.isArray(active);

  // The index of the chip that must stay on screen even if it would otherwise
  // be collapsed (see the promotion in the render below). Read through a ref
  // so measure() can use the current selection without being rebuilt — and
  // the observers torn down and re-attached — on every click.
  const promotedIndex = options.findIndex((o) => isActive(o.value));
  const promotedRef = useRef(-1);
  promotedRef.current = promotedIndex;

  // Widths come from a hidden copy of the full row rather than the real one:
  // a chip that's been collapsed into the dropdown isn't rendered, so there'd
  // be nothing left to measure when the window grows back. The ghost lives
  // inside the same wrapper, so page-level CSS sizes its chips identically.
  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const ghost = ghostRef.current;
    if (!viewport || !ghost) return;

    const children = Array.from(ghost.children) as HTMLElement[];
    // Last ghost child is the "More" button; everything before it is a chip
    // (including the "All" chip, which is never collapsed).
    const moreWidth = children.length > 0 ? children[children.length - 1].offsetWidth : 0;
    const chips = children.slice(0, -1);
    if (chips.length === 0) return;

    // Gap is read off the *real* row, not the ghost: a page can restyle it
    // (plants.css sets 11px over the default 8px) via a selector that only
    // matches the real one, and measuring with the wrong gap would let a
    // chip past the edge.
    const row = rowRef.current;
    const rowStyles = row ? getComputedStyle(row) : null;
    const gap = (rowStyles && parseFloat(rowStyles.columnGap || rowStyles.gap)) || FALLBACK_GAP;

    // clientWidth of the clipping box, so any padding a page adds is excluded.
    const avail = viewport.clientWidth;
    const total = chips.reduce((sum, el, i) => sum + el.offsetWidth + (i > 0 ? gap : 0), 0);
    // Everything fits: no dropdown, no reserved space for its button.
    if (total <= avail) {
      setVisibleCount(options.length);
      return;
    }

    const budget = avail - moreWidth - gap;
    let used = 0;
    let fit = 0;
    for (let i = 0; i < chips.length; i++) {
      const next = used + chips[i].offsetWidth + (i > 0 ? gap : 0);
      if (next > budget) break;
      used = next;
      fit++;
    }
    // `fit` counts the "All" chip when there is one; the caller's options are
    // what actually gets sliced, so discount it here.
    const offset = hasAllChip ? 1 : 0;
    let visible = Math.max(0, fit - offset);

    // A selected chip that lands past the cut gets swapped into the last
    // visible slot. It can be wider than the chip it replaces, so re-check
    // the row at its real width and give back slots until it fits —
    // otherwise the overflow would eat into the "More" button itself.
    const promoted = promotedRef.current;
    if (promoted >= visible) {
      const rowWidth = (optionIdxs: number[]) => {
        const cols = [...(hasAllChip ? [0] : []), ...optionIdxs.map((i) => i + offset)];
        return cols.reduce((sum, c, k) => sum + (chips[c]?.offsetWidth ?? 0) + (k > 0 ? gap : 0), 0);
      };
      while (visible > 0) {
        const idxs = [...Array.from({ length: visible - 1 }, (_, i) => i), promoted];
        if (rowWidth(idxs) <= budget) break;
        visible--;
      }
    }
    setVisibleCount(visible);
  }, [options.length, hasAllChip]);

  // Layout effect so the first paint already has the right count — a frame of
  // all 20 chips overflowing before collapsing would be a visible jump.
  // Deliberately not keyed on `options` identity: callers rebuild that array
  // every render, and re-measuring each time forces a synchronous reflow. The
  // observer below covers content changes instead.
  // promotedIndex is a dep because a newly selected chip may be wider than the
  // one it displaces, which changes how many fit.
  useLayoutEffect(() => {
    if (!overflowMenu) return;
    measure();
  }, [overflowMenu, measure, promotedIndex]);

  useEffect(() => {
    if (!overflowMenu) return;
    const viewport = viewportRef.current;
    const ghost = ghostRef.current;
    if (!viewport || !ghost) return;
    // The viewport catches window resizes; the ghost catches the chips' own
    // width changing — a language switch, counts arriving with the data, or a
    // webfont finishing loading. The ghost always renders every option, so its
    // size never reacts to visibleCount and the two can't feed each other.
    const ro = new ResizeObserver(() => measure());
    ro.observe(viewport);
    ro.observe(ghost);
    return () => ro.disconnect();
  }, [overflowMenu, measure]);

  // In overflow mode the row is exactly as wide as the container, so the
  // leftover space after the last chip that fits is handed back to the chips
  // themselves — they grow to take it up and the row reads as a full,
  // deliberate line rather than one that stops short. `grow` (not `flex-1`)
  // keeps each chip's natural width as its starting point, so a long label
  // still gets more room than a short one. justify-center keeps the label
  // centred once a pill is wider than its text.
  const stretch = (ghost: boolean) => (overflowMenu && !ghost ? " grow justify-center" : "");

  const chipClass = (on: boolean, disabled: boolean, color?: string, hasStyle?: boolean) =>
    `shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors whitespace-nowrap ${
      disabled
        ? "bg-card border-border text-muted-foreground/40 cursor-not-allowed"
        : on
          // An inline style (custom color) supplies its own bg/text, so no color
          // utility class is added alongside it — just the transparent border.
          ? `${hasStyle ? "" : (color ?? "bg-primary text-primary-foreground")} border-transparent`
          : "bg-card border-border text-muted-foreground hover:border-primary/40"
    }`;

  const renderChip = (opt: ChipOption, ghost = false) => {
    const disabled = opt.count === 0;
    const on = isActive(opt.value);
    return (
      <button
        key={opt.value}
        type="button"
        disabled={disabled}
        tabIndex={ghost ? -1 : undefined}
        aria-pressed={on}
        onClick={ghost ? undefined : () => onChange(opt.value)}
        style={on ? opt.style : undefined}
        className={chipClass(on, disabled, opt.color, !!opt.style) + stretch(ghost)}
      >
        {opt.emoji && <span>{opt.emoji}</span>}
        {opt.label}
        <span className="opacity-70">{opt.count}</span>
      </button>
    );
  };

  const renderAllChip = (ghost = false) =>
    allLabel && !Array.isArray(active) ? (
      <button
        type="button"
        tabIndex={ghost ? -1 : undefined}
        // Every other chip reports its state this way, and the "All" chip is
        // just as much a toggle — without it a page has no way to style the
        // selected/unselected states apart (plants.css had resorted to
        // ":first-child:not([aria-pressed])", which is true whether or not
        // it's actually the active filter).
        aria-pressed={active === null}
        onClick={ghost ? undefined : () => onChange("")}
        className={chipClass(active === null, false) + stretch(ghost)}
      >
        {allLabel}
        {typeof totalCount === "number" && <span className="opacity-70">{totalCount}</span>}
      </button>
    ) : null;

  // Keep the active chip on screen: if the current selection got collapsed
  // into the dropdown, swap it into the last visible slot so it's still
  // obvious what's being filtered on, and still one tap to clear.
  let inRow = options;
  let inMenu: ChipOption[] = [];
  if (overflowMenu && visibleCount < options.length) {
    inRow = options.slice(0, visibleCount);
    if (promotedIndex >= visibleCount && inRow.length > 0) {
      inRow = [...inRow.slice(0, -1), options[promotedIndex]];
    }
    // The menu is simply everything the row didn't take, in the original
    // order — derived rather than spliced, so a promotion can't leave a chip
    // in both places or in neither.
    const rowValues = new Set(inRow.map((o) => o.value));
    inMenu = options.filter((o) => !rowValues.has(o.value));
  }

  // Radix supplies the trigger's aria-expanded/aria-haspopup through asChild,
  // so the button only carries its own label. Deliberately not stretched: it
  // opens a menu rather than filtering anything, so it keeps its own width
  // while the chips absorb the slack and carry it to the row's edge.
  const moreButton = (ghost = false) => (
    <button type="button" tabIndex={ghost ? -1 : undefined} className={`${chipClass(false, false)} gap-1`}>
      {t("filter.more")}
      <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60" />
    </button>
  );

  return (
    <div className={`relative ${className}`}>
      <div
        ref={viewportRef}
        className={overflowMenu ? "overflow-hidden" : "-mx-4 px-4 overflow-x-auto scrollbar-hide"}
      >
        <div ref={rowRef} className={`flex items-center gap-2 pb-1 ${overflowMenu ? "w-full" : "w-max"}`}>
          {renderAllChip()}
          {inRow.map((opt) => renderChip(opt))}
          {inMenu.length > 0 && (
            <Popover open={moreOpen} onOpenChange={setMoreOpen}>
              <PopoverTrigger asChild>{moreButton()}</PopoverTrigger>
              <PopoverContent className="p-0 w-56" align="end">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {inMenu.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={opt.label}
                          disabled={opt.count === 0}
                          onSelect={() => {
                            onChange(opt.value);
                            setMoreOpen(false);
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4 shrink-0", isActive(opt.value) ? "opacity-100" : "opacity-0")}
                          />
                          {opt.emoji && <span className="mr-1.5">{opt.emoji}</span>}
                          <span className="flex-1 truncate">{opt.label}</span>
                          <span className="ml-2 opacity-60">{opt.count}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Measuring copy of the full row. Invisible, untabbable and ignored by
          screen readers, but laid out with the same styles so its widths are
          the real ones. Last child so page CSS keyed to `> div:first-child`
          still lands on the row above. */}
      {overflowMenu && (
        // The zero-height clipper keeps the full-width ghost from spilling out
        // of the page and creating a horizontal scrollbar. Clipping doesn't
        // affect the children's offsetWidth, which is all we read.
        <div className="pointer-events-none absolute left-0 top-0 h-0 w-full overflow-hidden" aria-hidden="true">
          <div ref={ghostRef} className="invisible flex w-max items-center gap-2">
            {renderAllChip(true)}
            {options.map((opt) => renderChip(opt, true))}
            {moreButton(true)}
          </div>
        </div>
      )}

      {edgeFade && !overflowMenu && (
        // `overflow` clips at an element's padding edge, not its content edge —
        // so the scroll strip's real right boundary is out at its own -mx-4
        // bleed (16px past this wrapper's box), not flush with the wrapper.
        // "right-0" here left that last 16px unfaded, so a chip's edge stayed
        // fully visible, uncovered, right at the scroll limit. "-right-4"
        // pushes the fade out to where the strip actually ends.
        <div className="pointer-events-none absolute -right-4 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent" />
      )}
    </div>
  );
};

export default FilterChips;
