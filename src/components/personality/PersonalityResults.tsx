import { useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlants, useSupplies } from "@/hooks/useCloudData";
import PlantCard from "@/components/PlantCard";
import SupplyCard from "@/components/SupplyCard";
import { CareProfile, archetypeFor, scorePlants } from "@/lib/personality";
import PersonalityExamples from "./PersonalityExamples";
import gsap from "gsap";

interface Props {
  profile: CareProfile;
  limit?: number;
}

const PersonalityResults = ({ profile, limit = 8 }: Props) => {
  const { t } = useLanguage();
  const { data: plantsData, isLoading } = usePlants();
  const { data: suppliesData } = useSupplies();
  const ref = useRef<HTMLDivElement>(null);

  const ranked = useMemo(
    () => scorePlants(profile, plantsData?.plants ?? []).slice(0, limit),
    [profile, plantsData, limit]
  );

  const matchedSupplies = useMemo(() => {
    const all = suppliesData?.supplies ?? [];
    const ids = new Set(ranked.map((r) => r.plant.id));
    const linked = all.filter((s) => s.plantId && ids.has(s.plantId));
    if (linked.length > 0) return linked.slice(0, 4);
    return all.filter((s) => s.category === "plants").slice(0, 4);
  }, [suppliesData, ranked]);

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll("[data-result-card]");
    gsap.fromTo(
      cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
  }, [ranked]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (ranked.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10">
        {t("personality.results.empty")}
      </p>
    );
  }

  const archetype = archetypeFor(profile);

  return (
    <div ref={ref}>
      <h2 className="font-display font-bold text-lg md:text-xl text-foreground mb-3">
        {t("personality.results.plants")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {ranked.map(({ plant, score }) => (
          <div key={plant.id} className="relative" data-result-card>
            <span title={`${t("personality.results.match")} ${score}%`} className="absolute top-2 right-2 z-20 px-2 py-1 rounded-full bg-accent text-accent-foreground text-[10px] md:text-xs font-bold shadow-md">
              {score}%
            </span>
            <PlantCard plant={plant} />
          </div>
        ))}
      </div>

      {matchedSupplies.length > 0 && (
        <div className="mt-7 md:mt-9">
          <h2 className="font-display font-bold text-lg md:text-xl text-foreground mb-3">
            {t("personality.results.supplies")}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {matchedSupplies.map((s) => (
              <div key={s.id} data-result-card>
                <SupplyCard supply={s} showDescription={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      <PersonalityExamples archetypeKey={archetype.key} />
    </div>
  );
};

export default PersonalityResults;
