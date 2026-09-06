import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePersonalityExamples, type PersonalityExample } from "@/hooks/usePersonalityExamples";
import { usePlants } from "@/hooks/useCloudData";
import { defaultPersonalityExamples } from "@/data/personalityExamples";
import { ChevronLeft, ChevronRight, Sprout } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";

interface Props {
  archetypeKey: string;
}

const ExampleCard = ({
  ex,
  plantImages,
}: {
  ex: PersonalityExample;
  plantImages: Record<string, string[]>;
}) => {
  const { lang, t } = useLanguage();
  const [idx, setIdx] = useState(0);
  // The example's own uploads win; otherwise borrow the linked plant's photos so
  // a row seeded with no images still shows something real instead of an emoji.
  const images = ex.images?.length ? ex.images : (plantImages[ex.plantId ?? ""] ?? []);
  const img = images[idx];

  return (
    <article className="bg-card border-2 border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] bg-muted">
        <ImageWithFallback
          src={img}
          alt={lang === "th" ? ex.title.th : ex.title.en}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="previous image"
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 hover:bg-background shadow"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="next image"
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 hover:bg-background shadow"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i === idx ? "bg-primary" : "bg-background/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3 md:p-4">
        <h3 className="font-display font-bold text-sm md:text-base text-foreground flex items-center gap-1.5">
          <span>{ex.emoji}</span>
          {lang === "th" ? ex.title.th : ex.title.en}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
          {lang === "th" ? ex.description.th : ex.description.en}
        </p>
        {(lang === "th" ? ex.tips.th : ex.tips.en) && (
          <p className="mt-2 text-xs md:text-sm text-foreground bg-primary/5 border border-primary/20 rounded-2xl px-3 py-2">
            {lang === "th" ? ex.tips.th : ex.tips.en}
          </p>
        )}
        {ex.plantId && (
          <Link
            to={`/plants/${ex.plantId}`}
            className="mt-3 inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-primary hover:underline"
          >
            <Sprout className="w-3.5 h-3.5" />
            {t("personality.examples.viewPlant")}
          </Link>
        )}
      </div>
    </article>
  );
};

const PersonalityExamples = ({ archetypeKey }: Props) => {
  const { t } = useLanguage();
  const { data } = usePersonalityExamples();
  const { data: plantsData } = usePlants();
  const plantImages = plantsData?.images ?? {};

  // Fall back per archetype, not for the whole table: one DB row used to hide
  // every built-in example, including those for archetypes the DB says nothing about.
  const items = useMemo(() => {
    const rows = (data ?? []).filter((e) => e.archetype === archetypeKey);
    return rows.length > 0
      ? rows
      : defaultPersonalityExamples.filter((e) => e.archetype === archetypeKey);
  }, [data, archetypeKey]);

  if (items.length === 0) return null;

  return (
    <section className="mt-7 md:mt-9">
      <h2 className="font-display font-bold text-lg md:text-xl text-foreground mb-1">
        {t("personality.examples.title")}
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground mb-3">
        {t("personality.examples.subtitle")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {items.map((ex) => (
          <ExampleCard key={ex.id} ex={ex} plantImages={plantImages} />
        ))}
      </div>
    </section>
  );
};

export default PersonalityExamples;
