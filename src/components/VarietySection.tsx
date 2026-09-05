import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PlantVariety, PlantLevels } from "@/data/plants";
import { varietyImages } from "@/data/varietyImages";
import TagBadges from "@/components/TagBadges";
import ShareButton from "@/components/ShareButton";
import {
  X, Flower2, Calendar, Ruler, ChevronLeft, ChevronRight,
  Sun, Droplets, Wind, Thermometer, Lightbulb, MapPin,
} from "lucide-react";

interface VarietySectionProps {
  varieties: PlantVariety[];
  plantName: string;
  /** Levels are always inherited from the parent — varieties don't carry their own. */
  parentLevels?: PlantLevels;
}

/** The same four care dimensions PlantDetailPage tracks — light/water/humidity/temp. */
const LEVEL_ICONS: { key: keyof PlantLevels; icon: typeof Sun }[] = [
  { key: "light", icon: Sun },
  { key: "water", icon: Droplets },
  { key: "humidity", icon: Wind },
  { key: "temp", icon: Thermometer },
];

const VarietySection = ({ varieties, plantName, parentLevels }: VarietySectionProps) => {
  const { lang, t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const selected = varieties.find((v) => v.id === params.get("variety")) ?? null;
  const [imgIdx, setImgIdx] = useState(0);

  // Push so Back closes the sheet (expected on mobile); replace on close so
  // Back doesn't just reopen it. This also makes the variety linkable/shareable
  // on its own: opening .../plants/fern?variety=fern-boston pops the sheet open.
  const openVariety = (id: string) =>
    setParams((p) => {
      p.set("variety", id);
      return p;
    });
  const closeVariety = () =>
    setParams(
      (p) => {
        p.delete("variety");
        return p;
      },
      { replace: true },
    );

  // Reset image index when opening a new variety
  useEffect(() => {
    setImgIdx(0);
  }, [selected?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [selected]);

  return (
    <>
      <div className="mt-6">
        <h2 className="font-display font-bold text-lg text-card-foreground mb-3">
          {t("varieties.title")} ({varieties.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {varieties.map((v) => {
            const validImages = (v.images ?? []).filter((p: string) => p && p.trim() !== "");
            const thumb = validImages[0] ?? v.image ?? varietyImages[v.id];
            return (
              <button
                key={v.id}
                onClick={() => openVariety(v.id)}
                className="flex items-center gap-2 p-2 rounded-2xl bg-muted/50 border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left group overflow-hidden"
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={v.name[lang]}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                    loading="lazy"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className="text-2xl shrink-0">{v.emoji}</span>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-card-foreground truncate group-hover:text-primary transition-colors">
                    {v.name[lang]}
                  </p>
                  <p className="text-muted-foreground text-xs truncate">
                    {v.features[lang]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom sheet modal for mobile, centered card for desktop */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
          onClick={closeVariety}
        >
          <div
            className="bg-card w-full h-full md:h-auto md:w-auto md:max-w-lg md:rounded-2xl md:shadow-2xl md:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom md:fade-in md:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image carousel */}
            {selected && (
              <div className="relative h-44 md:h-56 shrink-0 bg-muted overflow-hidden">
                {(() => {
                  const gallery = (selected.images ?? []).filter((p: string) => p && p.trim() !== "");
                  const fallback = selected.image && selected.image.trim() !== "" ? [selected.image] : [];
                  const displayGallery = gallery.length > 0 ? gallery : fallback;
                  const safeIdx = Math.min(imgIdx, Math.max(0, displayGallery.length - 1));
                  return displayGallery.length > 0 ? (
                    <>
                      <img
                        src={displayGallery[safeIdx]}
                        alt={selected.name[lang]}
                        className="w-full h-full object-cover"
                      />
                      {displayGallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setImgIdx((i) => (i - 1 + displayGallery.length) % displayGallery.length)}
                            aria-label="previous image"
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-sm"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setImgIdx((i) => (i + 1) % displayGallery.length)}
                            aria-label="next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-sm"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 rounded-full bg-card/70 backdrop-blur-sm">
                            {displayGallery.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setImgIdx(i)}
                                aria-label={`image ${i + 1}`}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  i === safeIdx ? "bg-primary w-4" : "bg-muted-foreground/40"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl">{selected.emoji}</span>
                    </div>
                  );
                })()}
                <button
                  onClick={closeVariety}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              <TagBadges tags={selected.tags} className="mb-1.5" />
              <div className="flex items-start justify-between gap-3 mb-0.5">
                <h3 className="font-display font-bold text-xl text-card-foreground">
                  {selected.name[lang]}
                </h3>
                <ShareButton
                  title={
                    lang === "th"
                      ? `${selected.name.th} — สายพันธุ์ของ${plantName}`
                      : `${selected.name.en} — variety of ${plantName}`
                  }
                />
              </div>
              <p className="text-muted-foreground text-xs mb-3">
                {lang === "th" ? `สายพันธุ์ของ${plantName}` : `Variety of ${plantName}`}
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                {selected.description[lang]}
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Flower2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-card-foreground">{t("varieties.features")}</p>
                    <p className="text-xs text-muted-foreground">{selected.features[lang]}</p>
                  </div>
                </div>

                {parentLevels && (
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-semibold text-card-foreground">{t("varieties.care")}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {t("varieties.sameAsParent")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {LEVEL_ICONS.map(({ key, icon: Icon }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/60"
                              style={{ width: `${parentLevels[key]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.careTip && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-card-foreground">{t("varieties.tip")}</p>
                      <p className="text-xs text-muted-foreground">{selected.careTip[lang]}</p>
                    </div>
                  </div>
                )}

                {selected.origin && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-card-foreground">{t("varieties.origin")}</p>
                      <p className="text-xs text-muted-foreground">{selected.origin[lang]}</p>
                    </div>
                  </div>
                )}

                {selected.bloomSeason && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-card-foreground">{t("varieties.bloom")}</p>
                      <p className="text-xs text-muted-foreground">{selected.bloomSeason[lang]}</p>
                    </div>
                  </div>
                )}

                {selected.size && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Ruler className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-card-foreground">{t("varieties.size")}</p>
                      <p className="text-xs text-muted-foreground">{selected.size[lang]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VarietySection;
