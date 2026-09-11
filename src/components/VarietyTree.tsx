import type { PlantVariety } from "@/data/plants";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageWithFallback from "@/components/ImageWithFallback";

interface Props {
  /** The variety the forms branch off — rendered as the root of the chart. */
  parent: PlantVariety;
  /** Its mutation forms, already filtered by the caller. */
  forms: PlantVariety[];
  /** Opens the lightbox on a form's own gallery. */
  onZoom: (images: string[], index: number) => void;
}

/**
 * A variety's mutation forms (cristata, variegated, spineless, …) as a small
 * vertical chart. Each form carries only a name, a description and an image,
 * and is shown in place — tapping one does not navigate anywhere, because a
 * form has no detail of its own worth a separate page. Only the image is
 * interactive, opening the lightbox.
 */
const VarietyTree = ({ parent, forms, onZoom }: Props) => {
  const { lang } = useLanguage();
  if (forms.length === 0) return null;

  return (
    <div>
      {/* root */}
      <p className="text-xs font-semibold text-card-foreground">{parent.name[lang]}</p>

      <ul className="mt-1.5 space-y-1.5">
        {forms.map((f, i) => {
          const gallery = (f.images ?? []).filter((p) => p && p.trim() !== "");
          const shots = gallery.length > 0 ? gallery : f.image ? [f.image] : [];
          const isLast = i === forms.length - 1;

          return (
            <li key={f.id} className="relative pl-5">
              {/* elbow: spine stops halfway on the last child so it ends at the joint */}
              <span
                className={`absolute left-0 top-0 w-px bg-border ${isLast ? "h-5" : "h-full"}`}
                aria-hidden="true"
              />
              <span className="absolute left-0 top-5 h-px w-4 bg-border" aria-hidden="true" />

              <div className="flex gap-2.5 rounded-xl border border-border bg-card p-2.5">
                <button
                  type="button"
                  onClick={() => shots.length > 0 && onZoom(shots, 0)}
                  disabled={shots.length === 0}
                  className="shrink-0 disabled:cursor-default"
                  aria-label={f.name[lang]}
                >
                  <ImageWithFallback
                    src={shots[0]}
                    alt={f.name[lang]}
                    className={`w-14 h-14 rounded-lg object-cover ${shots.length > 0 ? "cursor-zoom-in" : ""}`}
                    loading="lazy"
                    width={56}
                    height={56}
                  />
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-card-foreground">{f.name[lang]}</p>
                  {f.description?.[lang]?.trim() && (
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {f.description[lang]}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VarietyTree;
