import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { allCategories, PlantCategory, type Plant } from "@/data/plants";
import { usePlants, useCategoryInfo, useViewCounts } from "@/hooks/useCloudData";
import PlantCard from "@/components/PlantCard";
import FilterChips from "@/components/FilterChips";
import Seo from "@/components/Seo";
import { ArrowDownUp, Check, ChevronsUpDown, Leaf, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import "./catalog.css";

// "default" isn't a real sort — it means "leave the current sort_order-based
// order alone", i.e. today's behavior before this feature existed. It's a
// selectable option (not just "no ?sort param") so it has a place in the
// dropdown alongside the others, rather than being an unlabeled empty state.
const sortOptions = [
  { value: "default", labelTh: "ค่าเริ่มต้น", labelEn: "Default" },
  { value: "popular", labelTh: "ยอดนิยม", labelEn: "Most viewed" },
  { value: "name-asc", labelTh: "ชื่อ ก-ฮ", labelEn: "Name A-Z" },
  { value: "name-desc", labelTh: "ชื่อ ฮ-ก", labelEn: "Name Z-A" },
] as const;
type SortValue = (typeof sortOptions)[number]["value"];

/**
 * How many cards to render at a time. Caps what's *drawn*, not what's
 * loaded — filtering, sorting, the result count and the chip counts all
 * still run over the full list, so nothing about search or filters changes.
 * Divisible by 2/3/4 so the last row is never ragged at any breakpoint.
 */
const PAGE_SIZE = 24;

/** Stable identity for "no plants yet" — a fresh `[]` each render would
 *  invalidate the useMemo below on every single render. */
const NO_PLANTS: Plant[] = [];

const PlantsPage = () => {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get("cat") as PlantCategory | null) || null;
  const sortBy = (searchParams.get("sort") as SortValue | null) || "default";

  // Local state drives typing + filtering instantly; the URL is updated on a
  // short debounce so every keystroke doesn't spam history/query-client re-runs.
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  // Bumped whenever the result set is replaced wholesale, to re-trigger the
  // entrance animation even when the new set happens to be the same size.
  const [animPass, setAnimPass] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // How many cards have already played their entrance animation. Lets
  // "show more" animate only the cards it just revealed instead of
  // re-running gsap.from(opacity: 0) over the ones already on screen,
  // which would blink the whole grid on every click.
  const animatedCount = useRef(0);
  const isFirstRender = useRef(true);

  const { data } = usePlants();
  const plants = data?.plants ?? NO_PLANTS;
  const hasData = plants.length > 0;
  const categoryInfo = useCategoryInfo();
  const { data: viewCounts } = useViewCounts();

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchParams(
        (p) => {
          if (search) p.set("q", search);
          else p.delete("q");
          return p;
        },
        { replace: true },
      );
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered = useMemo(() => plants
    .filter((p) => {
      const matchesCat = !activeCategory || p.category === activeCategory;
      // Also match the plant's category label (e.g. "แคคตัส/ไม้อวบน้ำ") —
      // a plant's own name is often a specific species (Echeveria,
      // Gymnocalycium...) that never contains the general word someone
      // types for the kind of plant it is, so name-only search missed
      // every plant in a category whose name doesn't spell that category out.
      const catInfo = categoryInfo[p.category];
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.name.th.includes(search) ||
        p.name.en.toLowerCase().includes(q) ||
        !!catInfo?.th.includes(search) ||
        !!catInfo?.en.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (viewCounts?.[`plant:${b.id}`] ?? 0) - (viewCounts?.[`plant:${a.id}`] ?? 0);
        case "name-asc":
          return a.name.en.localeCompare(b.name.en);
        case "name-desc":
          return b.name.en.localeCompare(a.name.en);
        default:
          return 0; // "default" — leave plants' own sort_order-based order alone
      }
    }),
    [plants, activeCategory, search, sortBy, categoryInfo, viewCounts],
  );

  // Only this slice is rendered; `filtered` above stays whole so the result
  // count, the chip counts and every filter keep seeing all of it.
  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  const setCategory = (value: string) => {
    setSearchParams(
      (p) => {
        if (!value || value === activeCategory) p.delete("cat");
        else p.set("cat", value);
        return p;
      },
      { replace: true },
    );
  };

  const setSort = (value: SortValue) => {
    setSearchParams(
      (p) => {
        if (value === "default") p.delete("sort");
        else p.set("sort", value);
        return p;
      },
      { replace: true },
    );
    setSortOpen(false);
  };

  const activeSortLabel =
    sortOptions.find((s) => s.value === sortBy)?.[lang === "th" ? "labelTh" : "labelEn"] ?? "";

  const clearFilters = () => {
    setSearch("");
    setSearchParams({}, { replace: true });
  };

  const hasFilters = !!activeCategory || !!search;

  const categoryOptions = allCategories.map((cat) => {
    const info = categoryInfo[cat];
    return {
      value: cat,
      label: lang === "th" ? info.th : info.en,
      emoji: info.emoji,
      count: plants.filter((p) => p.category === cat).length,
    };
  });

  // Switching category or sort is a different set of plants, so it starts
  // back at the first page and everything counts as unseen. Search is
  // deliberately absent: it narrows the same set live as you type, and
  // resetting here would re-run the entrance animation on every character.
  useEffect(() => {
    // Not on mount. There's nothing to reset yet, and bumping animPass here
    // re-ran the animation effect, whose cleanup reverted the entrance
    // animation a beat after it started — the page looked like it had no
    // animation at all whenever plants were already cached (i.e. arriving
    // from any other page).
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setVisible(PAGE_SIZE);
    animatedCount.current = 0;
    setAnimPass((n) => n + 1);
  }, [activeCategory, sortBy]);

  // Entrance animation. Two things trigger it and nothing else: a fresh set
  // (animPass, bumped above) and "show more" (visible). A plain count-based
  // trigger would have fired on every keystroke too, which is the flicker
  // the original version of this effect was written to avoid — and it would
  // have silently skipped the animation when two categories happened to
  // hold the same number of plants.
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Only the cards this pass just revealed: re-running gsap.from() over
      // ones already on screen would blink the whole grid on every click.
      const fresh = gsap.utils.toArray<HTMLElement>(".plant-card-item").slice(animatedCount.current);
      if (fresh.length === 0) return;
      gsap.from(fresh, {
        y: 30,
        duration: 0.4,
        opacity: 0,
        ease: "power2.out",
        // `amount` spreads the whole stagger across a fixed window instead of
        // adding 0.05s per card: at 65 cards `each: 0.05` meant the last one
        // sat at opacity 0 for 3.2s, so anyone scrolling met blank space.
        stagger: { amount: 0.5 },
      });
    }, containerRef);
    animatedCount.current = containerRef.current.childElementCount;
    return () => ctx.revert();
    // hasData flips false -> true once, when the query resolves. Without it
    // the first run happens against an empty grid, leaving animatedCount at
    // 0 — so the first "show more" would have re-animated every card on
    // screen, not just the new ones. Typing never changes it.
  }, [animPass, visible, hasData]);

  return (
    <div className="catalog-page">
      <Seo
        title={lang === "th" ? "พรรณไม้ทั้งหมด | TreeKingdom" : "All Plants | TreeKingdom"}
        description={
          lang === "th"
            ? "เลือกชมพรรณไม้หลากหลายชนิด พร้อมข้อมูลการดูแลครบถ้วน"
            : "Browse our full plant catalog with detailed care information."
        }
      />
      <div className="catalog-decoration catalog-decoration-left" aria-hidden="true" />
      <div className="catalog-decoration catalog-decoration-right" aria-hidden="true" />
      <div className="catalog-container">
        <header className="catalog-title-block">
          <span className="catalog-title-icon"><Leaf /></span>
          <div><h1>{t("nav.plants")}</h1><p>{lang === "th" ? "ค้นพบพรรณไม้หลากหลายสายพันธุ์ เพื่อบ้านและสวนของคุณ" : "Discover plants for every home and garden"}</p></div>
          <span className="catalog-handwriting" aria-hidden="true">ต้นไม้<br />ทำให้ทุกวัน<br />สดใสขึ้น</span>
        </header>

        <div className="catalog-tools">
          <div className="catalog-search">
            <Search />
            <input
              type="text"
              placeholder={t("search.plants")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="catalog-search-input"
            />
            <button type="button" onClick={() => setSearch(search.trim())}>{lang === "th" ? "ค้นหา" : "Search"}</button>
          </div>
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={sortOpen}
                className="catalog-sort"
              >
                <ArrowDownUp />
                <span className="opacity-70">{t("sort.label")}</span>
                <span className="text-foreground">{activeSortLabel}</span>
                <ChevronsUpDown className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-52" align="end">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {sortOptions.map((opt) => {
                      const label = lang === "th" ? opt.labelTh : opt.labelEn;
                      return (
                        <CommandItem key={opt.value} value={label} onSelect={() => setSort(opt.value)}>
                          <Check className={cn("mr-2 h-4 w-4", sortBy === opt.value ? "opacity-100" : "opacity-0")} />
                          {label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <FilterChips
          className="catalog-filter-chips"
          options={categoryOptions}
          active={activeCategory}
          onChange={setCategory}
          allLabel={t("all")}
          totalCount={plants.length}
          overflowMenu
        />

        {hasFilters && (
          <div className="flex items-center justify-between mb-6 text-sm">
            <span className="text-muted-foreground">
              {t("filter.results").replace("{n}", String(filtered.length))}
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {t("filter.clear")}
            </button>
          </div>
        )}

        {/* Plant grid */}
        <div ref={containerRef} className="catalog-grid">
          {shown.map((plant) => (
            <div key={plant.id} className="plant-card-item">
              <PlantCard plant={plant} variant="catalog" />
            </div>
          ))}
        </div>

        {remaining > 0 && (
          <div className="catalog-more-wrap">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="catalog-more"
            >
              {t("plants.showMore").replace("{n}", String(remaining))}
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-5xl mb-4">🔍</p>
            <p className="mb-4">{lang === "th" ? "ไม่พบพรรณไม้ที่ค้นหา" : "No plants found"}</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {t("filter.noResults.clear")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantsPage;
