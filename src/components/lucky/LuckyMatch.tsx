import { useState, useMemo, useRef, useEffect } from "react";
import gsap from "gsap";
import { format } from "date-fns";
import { th as thLocale } from "date-fns/locale";
import { CalendarIcon, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupplies } from "@/hooks/useCloudData";
import {
  buildProfile,
  matchPlants,
  WEEKDAYS,
  ZODIACS,
  CHINESE_ZODIACS,
} from "@/lib/fortune";
import SupplyCard from "@/components/SupplyCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const LuckyMatch = () => {
  const { lang } = useLanguage();
  const { data: suppliesData } = useSupplies();
  const supplies = suppliesData?.supplies ?? [];
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Animate popover open
  useEffect(() => {
    if (open && popoverRef.current) {
      const el = popoverRef.current;
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.85, y: -10, transformOrigin: "top center" },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" },
      );
      const days = el.querySelectorAll("[role='gridcell']");
      gsap.fromTo(
        days,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "back.out(2)",
          stagger: { amount: 0.4, from: "start", grid: "auto" },
        },
      );
    }
  }, [open]);

  // Animate profile cards when date changes
  useEffect(() => {
    if (date && profileRef.current) {
      const cards = profileRef.current.querySelectorAll(".profile-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.08,
        },
      );
    }
  }, [date]);

  const handleSelect = (d: Date | undefined) => {
    setDate(d);
    if (d && popoverRef.current) {
      // little bounce on the selected cell
      const selected = popoverRef.current.querySelector("[aria-selected='true']");
      if (selected) {
        gsap.fromTo(
          selected,
          { scale: 0.6 },
          { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" },
        );
      }
      // close with a small delay so user sees the selection bounce
      setTimeout(() => setOpen(false), 280);
    }
  };


  const profile = useMemo(() => {
    if (!date || isNaN(date.getTime())) return null;
    return buildProfile(date);
  }, [date]);

  const matches = useMemo(() => {
    if (!profile) return [];
    return matchPlants(supplies, profile, undefined, 6);
  }, [profile]);

  const wd = profile ? WEEKDAYS[profile.weekday] : null;
  const zo = profile ? ZODIACS.find((z) => z.key === profile.zodiac) : null;
  const cz = profile
    ? CHINESE_ZODIACS.find((z) => z.key === profile.chineseZodiac)
    : null;

  return (
    <div className="space-y-5">
      <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-5 cute-shadow">
        <label className="block text-sm font-semibold mb-2 text-foreground">
          {lang === "th" ? "กรอกวันเกิดของคุณ" : "Enter your birthday"}
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[260px] justify-start text-left font-medium rounded-full border-2 bg-muted h-11 px-4 hover:bg-muted/80 transition-transform hover:scale-[1.02] active:scale-95",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
              {date
                ? lang === "th"
                  ? format(date, "d MMMM", { locale: thLocale }) +
                    " " +
                    (date.getFullYear() + 543)
                  : format(date, "PPP")
                : lang === "th"
                  ? "เลือกวันเกิด"
                  : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            ref={popoverRef}
            className="w-auto max-w-[calc(100vw-2rem)] p-0 rounded-3xl border-2 border-border cute-shadow overflow-hidden bg-card data-[state=open]:animate-none data-[state=closed]:animate-none"
            align="start"
            sideOffset={8}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
              defaultMonth={date ?? new Date(2000, 0, 1)}
              initialFocus
              locale={lang === "th" ? thLocale : undefined}
              className={cn("p-3 sm:p-4 pointer-events-auto")}
              lang={lang}
            />
          </PopoverContent>
        </Popover>
      </div>

      {profile && wd && zo && cz && (
        <>
          <div ref={profileRef} className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="profile-card bg-card border-2 border-border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
                {lang === "th" ? "วันเกิด" : "Born on"}
              </p>
              <p className="font-display font-bold text-xs sm:text-lg text-foreground break-words leading-tight">
                {lang === "th" ? `วัน${wd.th}` : wd.en}
              </p>
            </div>
            <div className="profile-card bg-card border-2 border-border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
                {lang === "th" ? "ราศี" : "Zodiac"}
              </p>
              <p className="font-display font-bold text-xs sm:text-lg text-foreground break-words leading-tight">
                {lang === "th" ? zo.th : zo.en}
              </p>
            </div>
            <div className="profile-card bg-card border-2 border-border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
                {lang === "th" ? "นักษัตร" : "Chinese"}
              </p>
              <p className="font-display font-bold text-xs sm:text-lg text-foreground break-words leading-tight">
                {lang === "th" ? `ปี${cz.th}` : cz.en}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              {lang === "th"
                ? "ต้นไม้มงคลที่แนะนำ"
                : "Recommended for you"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {matches.map(({ supply }) => (
                <div key={supply.id} className="relative">
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/95 text-accent-foreground text-[10px] sm:text-[11px] font-semibold shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    {lang === "th" ? "เหมาะกับคุณ" : "For you"}
                  </span>
                  <SupplyCard supply={supply} showDescription={false} showMeta={false} />
                  {supply.lucky && (
                    <p className="mt-2 text-xs text-muted-foreground italic px-1">
                      ✦ {supply.lucky.meaning[lang]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!profile && (
        <p className="text-center text-muted-foreground py-8 text-sm">
          {lang === "th"
            ? "เลือกวันเกิดเพื่อดูต้นไม้มงคลที่เหมาะกับดวงของคุณ"
            : "Select your birthday to see plants matching your destiny"}
        </p>
      )}
    </div>
  );
};

export default LuckyMatch;
