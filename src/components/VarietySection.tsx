import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PlantVariety, PlantLevels } from "@/data/plants";
import { varietyImages } from "@/data/varietyImages";
import TagBadges from "@/components/TagBadges";
import ShareButton from "@/components/ShareButton";
import ImageWithFallback, { BlankImage } from "@/components/ImageWithFallback";
import ImageLightbox from "@/components/ImageLightbox";
import VarietyTree from "@/components/VarietyTree";
import Portal from "@/components/Portal";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import {
  Flower2, Calendar, Ruler, ChevronLeft, ChevronRight, ArrowLeft,
  Sun, Droplets, Wind, Thermometer, Lightbulb, MapPin, ExternalLink, Network,
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
  // The prop stays a flat array; the form/parent link lives on each row.
  const topLevel = varieties.filter((v) => !v.parentId);
  const formsOf = (parentId: string) => varieties.filter((v) => v.parentId === parentId);

  // A form is not openable on its own — only top-level varieties get a sheet.
  const selected = topLevel.find((v) => v.id === params.get("variety")) ?? null;
  const [imgIdx, setImgIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [treeOpen, setTreeOpen] = useState(false);
  // A form's own gallery, opened in its own lightbox instance so it never
  // collides with the parent carousel's imgIdx/zoomed.
  const [formZoom, setFormZoom] = useState<{ images: string[]; index: number } | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const selectedForms = selected ? formsOf(selected.id) : [];

  // Hoisted out of the carousel's own render so the lightbox can share them.
  const gallery = (selected?.images ?? []).filter((p: string) => p && p.trim() !== "");
  const singleImage = selected?.image && selected.image.trim() !== "" ? [selected.image] : [];
  const displayGallery = gallery.length > 0 ? gallery : singleImage;
  const safeIdx = Math.min(imgIdx, Math.max(0, displayGallery.length - 1));

  // Optional detail fields are stored as { th, en } objects, so an admin entry
  // saved with the field "touched" but left blank is still a truthy object —
  // `field &&` alone would render an empty section (icon + label, no text).
  // This checks the string that's actually about to be shown.
  const hasText = (v?: { th: string; en: string } | null) => !!v?.[lang]?.trim();

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
    setZoomed(false);
    setTreeOpen(false);
    setFormZoom(null);
  }, [selected?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [selected]);

  // Two-way sync with imgIdx: a swipe updates it, and the lightbox (which
  // shares the same variable) can update it back — carouselApi.scrollTo
  // only fires when the two are actually out of step, so this can't loop.
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setImgIdx(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    if (carouselApi.selectedScrollSnap() !== safeIdx) carouselApi.scrollTo(safeIdx);
  }, [carouselApi, safeIdx]);

  return (
    <>
      <div className="mt-6">
        <h2 className="font-display font-bold text-lg text-card-foreground mb-3">
          {t("varieties.title")} ({topLevel.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {topLevel.map((v) => {
            const validImages = (v.images ?? []).filter((p: string) => p && p.trim() !== "");
            const thumb = validImages[0] ?? v.image ?? varietyImages[v.id];
            return (
              <button
                key={v.id}
                onClick={() => openVariety(v.id)}
                className="flex items-center gap-2 p-2 rounded-2xl bg-muted/50 border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left group overflow-hidden"
              >
                <ImageWithFallback
                  src={thumb}
                  alt={v.name[lang]}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                  loading="lazy"
                  width={40}
                  height={40}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-card-foreground truncate group-hover:text-primary transition-colors">
                    {v.name[lang]}
                  </p>
                  <p className="text-muted-foreground text-xs truncate">
                    {v.features[lang]}
                  </p>
                </div>
                {formsOf(v.id).length > 0 && (
                  <Network className="w-4 h-4 shrink-0 text-muted-foreground" aria-label="has forms" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen "new page" push on mobile (no backdrop, slides in from
          the right — the plant page behind it shows through mid-slide,
          same as native app navigation); centered modal card on desktop
          (backdrop + slide-from-bottom, unchanged). */}
      {selected && (
        <Portal>
          <div
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:bg-black/60 md:backdrop-blur-sm"
            onClick={closeVariety}
          >
            <div
              className="bg-card w-full h-full md:h-auto md:max-w-lg md:rounded-2xl md:shadow-2xl md:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-right md:slide-in-from-right-0 md:slide-in-from-bottom md:fade-in md:zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image carousel */}
              {selected && (
                <div className="relative h-44 md:h-56 shrink-0 bg-muted overflow-hidden">
                  {displayGallery.length > 0 ? (
                    <>
                      <Carousel setApi={setCarouselApi} className="w-full h-full [&>div]:h-full">
                        <CarouselContent className="h-full -ml-0 [&>div]:h-full">
                          {displayGallery.map((src, i) => (
                            <CarouselItem key={i} className="pl-0 h-full">
                              <ImageWithFallback
                                src={src}
                                alt={`${selected.name[lang]} ${i + 1}`}
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => setZoomed(true)}
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                      {displayGallery.length > 1 && (
                        <>
                          {/* Swipe covers touch; arrows stay for mouse/desktop
                              and would just crowd a 176px-tall mobile image. */}
                          <button
                            onClick={() => setImgIdx((i) => (i - 1 + displayGallery.length) % displayGallery.length)}
                            aria-label="previous image"
                            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm items-center justify-center text-foreground hover:bg-card transition-colors shadow-sm"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setImgIdx((i) => (i + 1) % displayGallery.length)}
                            aria-label="next image"
                            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm items-center justify-center text-foreground hover:bg-card transition-colors shadow-sm"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 px-1 py-1 rounded-full bg-card/70 backdrop-blur-sm">
                            {displayGallery.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setImgIdx(i)}
                                aria-label={`image ${i + 1}`}
                                className="w-6 h-6 flex items-center justify-center"
                              >
                                <span
                                  className={`block rounded-full transition-all ${
                                    i === safeIdx ? "bg-primary w-4 h-2" : "bg-muted-foreground/40 w-2 h-2"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <BlankImage className="w-1/2 h-1/2" />
                    </div>
                  )}
                  {/* One labelled control at every size, same look and position
                      as the plant page's own back link. The icon-only X this
                      replaced sat unlabelled over a photo and read as "close",
                      not "back to the plant" — it kept getting missed. */}
                  <button
                    onClick={closeVariety}
                    className="absolute top-4 left-4 inline-flex items-center gap-2 text-foreground bg-card/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm hover:bg-card transition-colors shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t("back")}
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
                  <div className="flex items-center gap-1 shrink-0">
                    {selectedForms.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setTreeOpen((v) => !v)}
                        aria-pressed={treeOpen}
                        aria-label={lang === "th" ? "ฟอร์มของสายพันธุ์" : "Mutation forms"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          treeOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Network className="w-4 h-4" />
                      </button>
                    )}
                    <ShareButton
                      title={
                        lang === "th"
                          ? `${selected.name.th} — สายพันธุ์ของ${plantName}`
                          : `${selected.name.en} — variety of ${plantName}`
                      }
                    />
                  </div>
                </div>
                <p className="text-muted-foreground text-xs mb-3">
                  {lang === "th" ? `สายพันธุ์ของ${plantName}` : `Variety of ${plantName}`}
                </p>

                {treeOpen && selectedForms.length > 0 && (
                  <div className="mb-3 rounded-xl bg-muted/40 border border-border p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      {lang === "th"
                        ? `ฟอร์มของสายพันธุ์ (${selectedForms.length})`
                        : `Mutation forms (${selectedForms.length})`}
                    </p>
                    <VarietyTree
                      parent={selected}
                      forms={selectedForms}
                      onZoom={(images, index) => setFormZoom({ images, index })}
                    />
                  </div>
                )}

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

                  {hasText(selected.careTip) && (
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

                  {hasText(selected.origin) && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-card-foreground">{t("varieties.origin")}</p>
                        {selected.originUrl ? (
                          <a
                            href={selected.originUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {selected.origin[lang]}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="text-xs text-muted-foreground">{selected.origin[lang]}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {hasText(selected.bloomSeason) && (
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

                  {hasText(selected.size) && (
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
        </Portal>
      )}

      {/* ImageLightbox portals itself, so no wrapping needed here. */}
      {zoomed && selected && (
        <ImageLightbox
          images={displayGallery}
          index={safeIdx}
          onIndexChange={setImgIdx}
          onClose={() => setZoomed(false)}
          alt={selected.name[lang]}
        />
      )}

      {/* A form's images get their own lightbox, kept apart from the parent's. */}
      {formZoom && (
        <ImageLightbox
          images={formZoom.images}
          index={formZoom.index}
          onIndexChange={(index) => setFormZoom((z) => (z ? { ...z, index } : z))}
          onClose={() => setFormZoom(null)}
          alt={selected?.name[lang] ?? ""}
        />
      )}
    </>
  );
};

export default VarietySection;
