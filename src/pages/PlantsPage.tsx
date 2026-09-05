import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { allCategories, PlantCategory } from "@/data/plants";
import { usePlants, useCategoryInfo } from "@/hooks/useCloudData";
import PlantCard from "@/components/PlantCard";
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

const PlantsPage = () => {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const activeCategory = (searchParams.get("cat") as PlantCategory | null) || null;
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = usePlants();
  const plants = data?.plants ?? [];
  const categoryInfo = useCategoryInfo();

  const filtered = plants.filter((p) => {
    const matchesCat = !activeCategory || p.category === activeCategory;
    const matchesSearch =
      !search ||
      p.name.th.includes(search) ||
      p.name.en.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const setCategory = (value: string) => {
    if (value === "all" || value === activeCategory) {
      setSearchParams({});
    } else {
      setSearchParams({ cat: value });
    }
    setOpen(false);
  };

  const activeCatLabel = activeCategory
    ? `${categoryInfo[activeCategory].emoji} ${lang === "th" ? categoryInfo[activeCategory].th : categoryInfo[activeCategory].en}`
    : lang === "th" ? "ทั้งหมด" : "All";

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.querySelectorAll(".plant-card-item"), {
        y: 30, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
      });
    }
  }, [activeCategory, search]);

  return (
    <div className="section-padding">
      <div className="container mx-auto">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          🌱 {t("nav.plants")}
        </h1>
        <p className="text-muted-foreground mb-8">{t("categories.sub")}</p>

        {/* Search + category autocomplete */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={open}
                className="flex-1 flex items-center justify-between w-full px-4 py-2.5 rounded-full bg-muted border-2 border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-sm"
              >
                <span>{activeCatLabel}</span>
                <div className="flex items-center gap-1">
                  {activeCategory && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setSearchParams({}); }}
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
                      <Check className={cn("mr-2 h-4 w-4", !activeCategory ? "opacity-100" : "opacity-0")} />
                      {lang === "th" ? "ทั้งหมด" : "All"}
                    </CommandItem>
                    {allCategories.map((cat) => {
                      const info = categoryInfo[cat];
                      const label = `${info.emoji} ${lang === "th" ? info.th : info.en}`;
                      return (
                        <CommandItem key={cat} value={label} onSelect={() => setCategory(cat)}>
                          <Check className={cn("mr-2 h-4 w-4", activeCategory === cat ? "opacity-100" : "opacity-0")} />
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
            <p>{lang === "th" ? "ไม่พบพรรณไม้ที่ค้นหา" : "No plants found"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantsPage;
