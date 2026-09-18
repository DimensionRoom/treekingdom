import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { allCategories, PlantCategory } from "@/data/plants";
import { usePlants, useCategoryInfo, useViewCounts } from "@/hooks/useCloudData";
import PlantCard from "@/components/PlantCard";
import FilterChips from "@/components/FilterChips";
import Seo from "@/components/Seo";
import { Search, X, ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import gsap from "gsap";

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

const PlantsPage = () => {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get("cat") as PlantCategory | null) || null;
  const sortBy = (searchParams.get("sort") as SortValue | null) || "default";

  // Local state drives typing + filtering instantly; the URL is updated on a
  // short debounce so every keystroke doesn't spam history/query-client re-runs.
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [sortOpen, setSortOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = usePlants();
  const plants = data?.plants ?? [];
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

  const filtered = plants
    .filter((p) => {
      const matchesCat = !activeCategory || p.category === activeCategory;
      const matchesSearch =
        !search ||
        p.name.th.includes(search) ||
        p.name.en.toLowerCase().includes(search.toLowerCase());
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
    });

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

  // Only re-run the entrance animation when the result *set* changes for a
  // structural reason (category switch) — not on every keystroke, which used
  // to restart gsap.from(opacity:0) on each character and could leave cards
  // stuck invisible if a re-render interrupted the tween mid-flight.
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".plant-card-item", {
        y: 30, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, [activeCategory, sortBy]);

  return (
    <div className="section-padding">
      <Seo
        title={lang === "th" ? "พรรณไม้ทั้งหมด | TreeKingdom" : "All Plants | TreeKingdom"}
        description={
          lang === "th"
            ? "เลือกชมพรรณไม้หลากหลายชนิด พร้อมข้อมูลการดูแลครบถ้วน"
            : "Browse our full plant catalog with detailed care information."
        }
      />
      <div className="container mx-auto">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          🌱 {t("nav.plants")}
        </h1>
        <p className="text-muted-foreground mb-6">{t("categories.sub")}</p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("search.plants")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
            />
          </div>
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={sortOpen}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-transparent text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
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
          className="mb-4"
          options={categoryOptions}
          active={activeCategory}
          onChange={setCategory}
          allLabel={t("all")}
          totalCount={plants.length}
          edgeFade
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
        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((plant) => (
            <div key={plant.id} className="plant-card-item">
              <PlantCard plant={plant} />
            </div>
          ))}
        </div>

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
