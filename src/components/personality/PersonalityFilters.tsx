import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CHIPS, CHIP_GROUPS, NEUTRAL_PROFILE, profileFromChips } from "@/lib/personality";
import PersonalityResults from "./PersonalityResults";
import { RotateCcw } from "lucide-react";

const PersonalityFilters = () => {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (key: string) => {
    const chip = CHIPS.find((c) => c.key === key)!;
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      // only one chip per group
      const others = prev.filter((k) => CHIPS.find((c) => c.key === k)?.group !== chip.group);
      return [...others, key];
    });
  };

  const profile = useMemo(
    () => (selected.length ? profileFromChips(selected) : NEUTRAL_PROFILE),
    [selected]
  );

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">{t("personality.filters.intro")}</p>
      <div className="space-y-3 mb-6">
        {CHIP_GROUPS.map((g) => (
          <div key={g.key}>
            <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-1.5">
              {lang === "th" ? g.th : g.en}
            </p>
            <div className="flex flex-wrap gap-2">
              {CHIPS.filter((c) => c.group === g.key).map((c) => {
                const active = selected.includes(c.key);
                return (
                  <button
                    key={c.key}
                    onClick={() => toggle(c.key)}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold border-2 transition-all inline-flex items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.03]"
                        : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <span>{c.emoji}</span>
                    {lang === "th" ? c.th : c.en}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <button
          onClick={() => setSelected([])}
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t("personality.filters.clear")}
        </button>
      )}

      <PersonalityResults profile={profile} />
    </div>
  );
};

export default PersonalityFilters;
