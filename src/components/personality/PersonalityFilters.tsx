import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CHIPS, CHIP_GROUPS, NEUTRAL_PROFILE, profileFromChips } from "@/lib/personality";
import PersonalityResults from "./PersonalityResults";
import { Droplets, Palette, RotateCcw, Sprout, Sun, type LucideIcon } from "lucide-react";

/** One icon per question group, so the panel scans at a glance. */
const GROUP_ICONS: Record<string, LucideIcon> = { water: Droplets, light: Sun, skill: Sprout, style: Palette };

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
      <section className="personality-panel">
        <div className="personality-panel-head">
          <p>{t("personality.filters.intro")}</p>
          {selected.length > 0 && (
            <button type="button" className="personality-clear" onClick={() => setSelected([])}>
              <RotateCcw />
              {t("personality.filters.clear")} ({selected.length})
            </button>
          )}
        </div>
        <div className="personality-groups">
          {CHIP_GROUPS.map((g) => {
            const Icon = GROUP_ICONS[g.key] ?? Sprout;
            return (
              <div key={g.key} className="personality-group">
                <p className="personality-group-label">
                  <span><Icon /></span>
                  {lang === "th" ? g.th : g.en}
                </p>
                <div className="personality-chips">
                  {CHIPS.filter((c) => c.group === g.key).map((c) => (
                    <button key={c.key} type="button" onClick={() => toggle(c.key)} aria-pressed={selected.includes(c.key)}>
                      <span>{c.emoji}</span>
                      {lang === "th" ? c.th : c.en}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <PersonalityResults profile={profile} />
    </div>
  );
};

export default PersonalityFilters;
