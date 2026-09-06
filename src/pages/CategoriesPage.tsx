import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SupplyCategory } from "@/data/supplies";
import { useSupplies, useTags } from "@/hooks/useCloudData";
import SupplyCard from "@/components/SupplyCard";
import FilterChips from "@/components/FilterChips";
import Seo from "@/components/Seo";
import { Search, ChevronsUpDown, Check, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const categoryOptions: { value: SupplyCategory; labelTh: string; labelEn: string; emoji: string }[] = [
  { value: "plants", labelTh: "ต้นไม้", labelEn: "Plants", emoji: "🌱" },
  { value: "fertilizer", labelTh: "ปุ๋ย", labelEn: "Fertilizer", emoji: "🌾" },
  { value: "pot", labelTh: "กระถาง", labelEn: "Pots", emoji: "🪴" },
  { value: "tools", labelTh: "อุปกรณ์", labelEn: "Tools", emoji: "🛠️" },
];

const sortOptions = [
  { value: "name-asc", labelTh: "ชื่อ ก-ฮ", labelEn: "Name A-Z" },
  { value: "name-desc", labelTh: "ชื่อ ฮ-ก", labelEn: "Name Z-A" },
  { value: "price-asc", labelTh: "ราคาต่ำ → สูง", labelEn: "Price: Low to High" },
  { value: "price-desc", labelTh: "ราคาสูง → ต่ำ", labelEn: "Price: High to Low" },
] as const;
type SortValue = (typeof sortOptions)[number]["value"];

const CategoriesPage = () => {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const activeTab = (params.get("cat") as SupplyCategory | null) || null;
  const sortBy = (params.get("sort") as SortValue | null) || "name-asc";
  const activeTags = (params.get("tags") ?? "").split(",").filter(Boolean);

  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [sortOpen, setSortOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: suppliesData } = useSupplies();
  const supplies = suppliesData?.supplies ?? [];
  const { data: tags } = useTags();

  useEffect(() => {
    const id = setTimeout(() => {
      setParams(
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

  const toggleTag = (key: string) => {
    const next = activeTags.includes(key) ? activeTags.filter((k) => k !== key) : [...activeTags, key];
    setParams(
      (p) => {
        if (next.length) p.set("tags", next.join(","));
        else p.delete("tags");
        return p;
      },
      { replace: true },
    );
  };

  const setCategory = (value: string) => {
    setParams(
      (p) => {
        if (!value || value === activeTab) p.delete("cat");
        else p.set("cat", value);
        return p;
      },
      { replace: true },
    );
  };

  const setSort = (value: SortValue) => {
    setParams(
      (p) => {
        if (value === "name-asc") p.delete("sort");
        else p.set("sort", value);
        return p;
      },
      { replace: true },
    );
    setSortOpen(false);
  };

  const clearFilters = () => {
    setSearch("");
    setParams({}, { replace: true });
  };

  // Only offer tags that actually appear on a product.
  const usedTagKeys = new Set(supplies.flatMap((s) => s.tags ?? []));
  const tagChoices = (tags ?? []).filter((tg) => usedTagKeys.has(tg.key));

  const filtered = supplies
    .filter((s) => {
      const matchesCat = !activeTab || s.category === activeTab;
      const matchesSearch =
        !search ||
        s.name.th.includes(search) ||
        s.name.en.toLowerCase().includes(search.toLowerCase());
      const matchesTags = activeTags.every((k) => (s.tags ?? []).includes(k));
      return matchesCat && matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc": return a.name.en.localeCompare(b.name.en);
        case "name-desc": return b.name.en.localeCompare(a.name.en);
        default: return 0;
      }
    });

  const hasFilters = !!activeTab || !!search || activeTags.length > 0;

  const categoryChipOptions = categoryOptions.map((cat) => ({
    value: cat.value,
    label: lang === "th" ? cat.labelTh : cat.labelEn,
    emoji: cat.emoji,
    count: supplies.filter((s) => s.category === cat.value).length,
  }));

  const tagChipOptions = tagChoices.map((tg) => ({
    value: tg.key,
    label: tg.name[lang] || tg.key,
    emoji: tg.emoji,
    count: supplies.filter((s) => (s.tags ?? []).includes(tg.key)).length,
    color: tg.color,
  }));

  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.[lang === "th" ? "labelTh" : "labelEn"] ?? "";

  // Re-run the entrance animation only when the result set changes for a
  // structural reason (category/tag/sort) — not on every keystroke, which
  // used to restart gsap.from(opacity:0) per character typed.
  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".supply-item", {
        y: 30, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
      });
    }, gridRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sortBy, params.get("tags")]);

  return (
    <div className="section-padding">
      <Seo
        title={lang === "th" ? "สินค้าและอุปกรณ์ทั้งหมด | TreeKingdom" : "All Products | TreeKingdom"}
        description={
          lang === "th"
            ? "เลือกซื้อต้นไม้ ปุ๋ย กระถาง และอุปกรณ์จัดสวนครบครัน"
            : "Shop plants, fertilizer, pots, and gardening supplies."
        }
      />
      <div className="container mx-auto">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          {t("supplies.title")}
        </h1>
        <p className="text-muted-foreground mb-6">{t("supplies.sub")}</p>

        <FilterChips
          className="mb-3"
          options={categoryChipOptions}
          active={activeTab}
          onChange={setCategory}
          allLabel={t("all")}
          totalCount={supplies.length}
        />

        {tagChipOptions.length > 0 && (
          <FilterChips className="mb-4" options={tagChipOptions} active={activeTags} onChange={toggleTag} />
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={lang === "th" ? "ค้นหาสินค้า..." : "Search products..."}
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

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((supply) => (
            <div key={supply.id} className="supply-item">
              <SupplyCard supply={supply} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-5xl mb-4">🔍</p>
            <p className="mb-4">{lang === "th" ? "ไม่พบสินค้าที่ค้นหา" : "No products found"}</p>
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

export default CategoriesPage;
