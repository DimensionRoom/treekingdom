import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SupplyCategory } from "@/data/supplies";
import { useSupplies, useTags } from "@/hooks/useCloudData";
import SupplyCard from "@/components/SupplyCard";
import Seo from "@/components/Seo";
import { Search, ChevronsUpDown, Check, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const categoryOptions: { value: SupplyCategory; labelTh: string; labelEn: string }[] = [
  { value: "plants", labelTh: "ต้นไม้", labelEn: "Plants" },
  { value: "fertilizer", labelTh: "ปุ๋ย", labelEn: "Fertilizer" },
  { value: "pot", labelTh: "กระถาง", labelEn: "Pots" },
  { value: "tools", labelTh: "อุปกรณ์", labelEn: "Tools" },
];

const CategoriesPage = () => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<SupplyCategory | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc">("name-asc");
  const [sortOpen, setSortOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useSearchParams();

  const { data: suppliesData } = useSupplies();
  const supplies = suppliesData?.supplies ?? [];
  const { data: tags } = useTags();

  // ?tags=new,sale — kept in the URL so a filtered list can be shared.
  const activeTags = (params.get("tags") ?? "").split(",").filter(Boolean);
  const toggleTag = (key: string) => {
    const next = activeTags.includes(key)
      ? activeTags.filter((k) => k !== key)
      : [...activeTags, key];
    setParams(
      (p) => {
        if (next.length) p.set("tags", next.join(","));
        else p.delete("tags");
        return p;
      },
      { replace: true },
    );
  };

  // Only offer tags that actually appear on a product.
  const usedTagKeys = new Set(supplies.flatMap((s) => s.tags ?? []));
  const tagChoices = (tags ?? []).filter((t) => usedTagKeys.has(t.key));

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

  const setCategory = (value: string) => {
    if (value === "all" || value === activeTab) {
      setActiveTab(null);
    } else {
      setActiveTab(value as SupplyCategory);
    }
    setOpen(false);
  };

  const sortOptions = [
    { value: "name-asc", labelTh: "ชื่อ ก-ฮ", labelEn: "Name A-Z" },
    { value: "name-desc", labelTh: "ชื่อ ฮ-ก", labelEn: "Name Z-A" },
    { value: "price-asc", labelTh: "ราคาต่ำ → สูง", labelEn: "Price: Low to High" },
    { value: "price-desc", labelTh: "ราคาสูง → ต่ำ", labelEn: "Price: High to Low" },
  ];

  const activeCatLabel = activeTab
    ? categoryOptions.find((c) => c.value === activeTab)?.[lang === "th" ? "labelTh" : "labelEn"] ?? ""
    : lang === "th" ? "ทั้งหมด" : "All";

  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.[lang === "th" ? "labelTh" : "labelEn"] ?? "";

  useEffect(() => {
    if (gridRef.current) {
      gsap.from(gridRef.current.querySelectorAll(".supply-item"), {
        y: 30, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
      });
    }
  }, [activeTab, search, sortBy, params]);

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
        <p className="text-muted-foreground mb-8">{t("supplies.sub")}</p>

        {tagChoices.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tagChoices.map((tg) => {
              const on = activeTags.includes(tg.key);
              return (
                <button
                  key={tg.key}
                  onClick={() => toggleTag(tg.key)}
                  aria-pressed={on}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-colors ${
                    on ? `${tg.color} border-transparent` : "bg-card border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {tg.emoji && <span className="mr-1">{tg.emoji}</span>}
                  {tg.name[lang] || tg.key}
                </button>
              );
            })}
            {activeTags.length > 0 && (
              <button
                onClick={() => setParams((p) => { p.delete("tags"); return p; }, { replace: true })}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-muted-foreground hover:bg-muted"
              >
                <X className="w-3 h-3" />
                {lang === "th" ? "ล้างแท็ก" : "Clear tags"}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={open}
                className="flex-1 flex items-center justify-between w-full px-4 py-2.5 rounded-full bg-muted border-2 border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-sm"
              >
                <span>{activeCatLabel}</span>
                <div className="flex items-center gap-1">
                  {activeTab && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setActiveTab(null); }}
                      className="p-0.5 rounded-full hover:bg-border transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </span>
                  )}
                  <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
              <Command>
                <CommandInput placeholder={lang === "th" ? "ค้นหาหมวดหมู่..." : "Search category..."} />
                <CommandList>
                  <CommandEmpty>{lang === "th" ? "ไม่พบหมวดหมู่" : "No category found"}</CommandEmpty>
                  <CommandGroup>
                    <CommandItem value="all" onSelect={() => setCategory("all")}>
                      <Check className={cn("mr-2 h-4 w-4", !activeTab ? "opacity-100" : "opacity-0")} />
                      {lang === "th" ? "ทั้งหมด" : "All"}
                    </CommandItem>
                    {categoryOptions.map((cat) => {
                      const label = lang === "th" ? cat.labelTh : cat.labelEn;
                      return (
                        <CommandItem key={cat.value} value={label} onSelect={() => setCategory(cat.value)}>
                          <Check className={cn("mr-2 h-4 w-4", activeTab === cat.value ? "opacity-100" : "opacity-0")} />
                          {label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={sortOpen}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-transparent text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <span className="opacity-70">{lang === "th" ? "เรียงโดย:" : "Sort:"}</span>
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
                        <CommandItem key={opt.value} value={label} onSelect={() => { setSortBy(opt.value as typeof sortBy); setSortOpen(false); }}>
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
            <p>{lang === "th" ? "ไม่พบสินค้าที่ค้นหา" : "No products found"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
