import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupplies, useFortuneMessages } from "@/hooks/useCloudData";
import {
  WEEKDAYS,
  DOMAINS,
  getDailyFortune,
  matchPlants,
  buildProfile,
} from "@/lib/fortune";
import SupplyCard from "@/components/SupplyCard";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const LuckyDaily = () => {
  const { lang } = useLanguage();
  const [weekday, setWeekday] = useState<number | null>(null);
  const { data } = useSupplies();
  const supplies = data?.supplies ?? [];
  const { data: fortunePool } = useFortuneMessages();

  const today = useMemo(() => new Date(), []);
  const todayLabel = today.toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fortune = useMemo(() => {
    if (weekday === null) return null;
    // Fake profile from chosen weekday only
    const fakeBirth = new Date(today);
    const diff = (weekday - today.getDay() + 7) % 7;
    fakeBirth.setDate(today.getDate() - diff);
    return getDailyFortune(buildProfile(fakeBirth), today, fortunePool);
  }, [weekday, today, fortunePool]);

  const matches = useMemo(() => {
    if (weekday === null) return [];
    const fakeBirth = new Date(today);
    const diff = (weekday - today.getDay() + 7) % 7;
    fakeBirth.setDate(today.getDate() - diff);
    return matchPlants(supplies, buildProfile(fakeBirth), undefined, 4);
  }, [weekday, today]);

  return (
    <div className="space-y-5">
      <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-5 cute-shadow">
        <p className="text-xs text-muted-foreground mb-1">
          {lang === "th" ? "ดวงประจำวันที่" : "Daily fortune for"}
        </p>
        <p className="font-display font-bold text-base sm:text-lg text-foreground mb-4">
          {todayLabel}
        </p>
        <label className="block text-sm font-semibold mb-2 text-foreground">
          {lang === "th" ? "เลือกวันเกิดของคุณ" : "Pick your birth day"}
        </label>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap pb-1">
            {WEEKDAYS.map((w) => (
              <button
                key={w.key}
                onClick={() => setWeekday(w.key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border-2 whitespace-nowrap transition-colors",
                  weekday === w.key
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-muted text-foreground border-border hover:border-accent/50",
                )}
              >
                {lang === "th" ? w.th : w.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {fortune && (
        <>
          <div className="bg-gradient-to-br from-accent/10 via-card to-primary/5 border-2 border-accent/30 rounded-2xl p-4 sm:p-6 cute-shadow">
            <div className="flex items-baseline justify-between mb-3 sm:mb-4 gap-3">
              <h3 className="font-display font-bold text-lg sm:text-xl text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent shrink-0" />
                {lang === "th" ? "ดวงวันนี้" : "Today's fortune"}
              </h3>
              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-display font-bold text-accent">
                  {fortune.overall}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-foreground italic mb-4 sm:mb-5">"{fortune.message[lang]}"</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2.5 mb-4 sm:mb-5">
              {DOMAINS.map((d) => {
                const v = fortune.scores[d.key];
                return (
                  <div key={d.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-foreground font-medium truncate">
                        <span className="mr-1">{d.emoji}</span>
                        {lang === "th" ? d.th : d.en}
                      </span>
                      <span className="text-muted-foreground ml-1">{v}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all"
                        style={{ width: `${v}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border/50">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {lang === "th" ? "สีมงคล:" : "Lucky color:"}
              </span>
              <span
                className="inline-block w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-border shrink-0"
                style={{ background: `hsl(${fortune.luckyColor.hsl})` }}
              />
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {lang === "th" ? fortune.luckyColor.th : fortune.luckyColor.en}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-3 sm:mb-4">
              {lang === "th" ? "ต้นไม้เสริมดวงวันนี้" : "Plants to boost today's fortune"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {matches.map(({ supply }) => (
                <SupplyCard key={supply.id} supply={supply} showDescription={false} showMeta={false} />
              ))}
            </div>
          </div>
        </>
      )}

      {!fortune && (
        <p className="text-center text-muted-foreground py-8 text-sm">
          {lang === "th"
            ? "เลือกวันเกิดของคุณเพื่อดูดวงประจำวัน"
            : "Pick your birth day to see today's fortune"}
        </p>
      )}
    </div>
  );
};

export default LuckyDaily;
