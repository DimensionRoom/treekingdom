import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuckyDomain } from "@/data/supplies";
import { useSupplies } from "@/hooks/useCloudData";
import { DOMAINS } from "@/lib/fortune";
import SupplyCard from "@/components/SupplyCard";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const LuckyList = () => {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<LuckyDomain | null>(null);
  const { data } = useSupplies();
  const supplies = data?.supplies ?? [];

  const list = supplies.filter(
    (s) => s.isLucky && (!filter || s.lucky?.luckyFor.includes(filter)),
  );

  return (
    <div className="space-y-5">
      <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max pb-1">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border-2 whitespace-nowrap transition-colors",
              !filter
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-card text-foreground border-border hover:border-accent/50",
            )}
          >
            {lang === "th" ? "ทั้งหมด" : "All"}
          </button>
          {DOMAINS.map((d) => (
            <button
              key={d.key}
              onClick={() => setFilter(d.key)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border-2 whitespace-nowrap transition-colors",
                filter === d.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card text-foreground border-border hover:border-accent/50",
              )}
            >
              <span className="mr-1">{d.emoji}</span>
              {lang === "th" ? d.th : d.en}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-5xl mb-4">✦</p>
          <p>{lang === "th" ? "ไม่พบไม้มงคลในหมวดนี้" : "No lucky plants in this category"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {list.map((s) => (
            <div key={s.id} className="relative">
              <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/95 text-accent-foreground text-[11px] font-semibold shadow-sm">
                <Sparkles className="w-3 h-3" />
                {lang === "th" ? "มงคล" : "Lucky"}
              </span>
              <SupplyCard supply={s} showDescription={false} showMeta={false} />
              {s.lucky && (
                <p className="mt-2 text-xs text-muted-foreground italic px-1">
                  ✦ {s.lucky.meaning[lang]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LuckyList;
