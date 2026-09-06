import { useParams, Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlants, useCategoryInfo, useSupplies } from "@/hooks/useCloudData";
import { ArrowLeft, Sun, Droplets, Wind, Thermometer, Layers, Lightbulb, ChevronLeft, ChevronRight, X } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import { Progress } from "@/components/ui/progress";
import VarietySection from "@/components/VarietySection";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import TagBadges from "@/components/TagBadges";
import ImageWithFallback, { BlankImage } from "@/components/ImageWithFallback";
import { saleInfo } from "@/lib/price";
import Seo from "@/components/Seo";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const PlantDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const backTo = (location.state as { from?: string } | null)?.from ?? "/plants";
  const { lang, t } = useLanguage();
  const { data } = usePlants();
  const { data: suppliesData } = useSupplies();
  const plants = data?.plants ?? [];
  const plantImages = data?.images ?? {};
  const categoryInfo = useCategoryInfo();
  const plant = plants.find((p) => p.id === id);
  const relatedSupplies = (suppliesData?.supplies ?? []).filter((s) => s.plantId === id);
  const supplyImages = suppliesData?.images ?? {};
  const ref = useRef<HTMLDivElement>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  const openFullscreen = useCallback((index: number) => {
    setFullscreenIndex(index);
    setFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => setFullscreen(false), []);

  const images = id ? plantImages[id] ?? [] : [];

  useEffect(() => {
    if (ref.current) {
      gsap.from(ref.current.children, {
        y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
      });
    }
  }, [id]);

  useEffect(() => {
    if (!carouselApi) return;
    setSlideCount(carouselApi.scrollSnapList().length);
    setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  if (!plant) {
    return (
      <div className="section-padding text-center">
        <Seo title="Plant Not Found | TreeKingdom" description="This plant doesn't exist." noindex />
        <p className="text-5xl mb-4">🌿</p>
        <p className="text-muted-foreground">{lang === "th" ? "ไม่พบพรรณไม้" : "Plant not found"}</p>
        <Link to={backTo} className="text-primary mt-4 inline-block hover:underline">
          ← {t("back")}
        </Link>
      </div>
    );
  }

  const getLevelColor = (key: string, level: number) => {
    // แสง: เหลืองอ่อน → ส้มทอง
    if (key === "light") {
      if (level <= 25) return "bg-[hsl(48,70%,75%)]";
      if (level <= 50) return "bg-[hsl(45,75%,65%)]";
      if (level <= 75) return "bg-[hsl(42,80%,58%)]";
      return "bg-[hsl(38,85%,52%)]";
    }
    // น้ำ: ฟ้าอ่อน → น้ำเงินเข้ม
    if (key === "water") {
      if (level <= 25) return "bg-[hsl(200,60%,80%)]";
      if (level <= 50) return "bg-[hsl(205,65%,68%)]";
      if (level <= 75) return "bg-[hsl(210,70%,58%)]";
      return "bg-[hsl(215,75%,50%)]";
    }
    // ความชื้น: มิ้นท์อ่อน → เขียวเทอร์ควอยซ์
    if (key === "humidity") {
      if (level <= 25) return "bg-[hsl(170,40%,78%)]";
      if (level <= 50) return "bg-[hsl(168,45%,65%)]";
      if (level <= 75) return "bg-[hsl(165,50%,55%)]";
      return "bg-[hsl(162,55%,45%)]";
    }
    // อุณหภูมิ: ฟ้าเย็น → แดงร้อน
    if (level <= 25) return "bg-[hsl(210,65%,65%)]";
    if (level <= 50) return "bg-[hsl(170,45%,60%)]";
    if (level <= 75) return "bg-[hsl(35,75%,58%)]";
    return "bg-[hsl(0,60%,58%)]";
  };

  const careItems = [
    { key: "light", icon: Sun, value: plant.care.light, level: plant.levels.light },
    { key: "water", icon: Droplets, value: plant.care.water, level: plant.levels.water },
    { key: "humidity", icon: Wind, value: plant.care.humidity, level: plant.levels.humidity },
    { key: "temp", icon: Thermometer, value: plant.care.temp, level: plant.levels.temp },
    { key: "soil", icon: Layers, value: plant.care.soil },
    { key: "tips", icon: Lightbulb, value: plant.care.tips },
  ];

  const hasImages = images.length > 0;

  const pageUrl = absoluteUrl(`/plants/${plant.id}`);

  return (
    <div className="fixed inset-0 top-16 z-20 flex flex-col md:flex-row bg-background" ref={ref}>
      <Seo
        title={lang === "th" ? `${plant.name.th} — วิธีดูแล | TreeKingdom` : `${plant.name.en} — Care Guide | TreeKingdom`}
        description={plant.description[lang]}
        image={images[0]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: plant.name[lang],
            description: plant.description[lang],
            image: images[0] ? absoluteUrl(images[0]) : undefined,
            url: pageUrl,
            inLanguage: lang === "th" ? "th" : "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: lang === "th" ? "พรรณไม้" : "Plants", item: absoluteUrl("/plants") },
              { "@type": "ListItem", position: 3, name: plant.name[lang], item: pageUrl },
            ],
          },
        ]}
      />
      {/* Left: Image carousel or emoji fallback */}
      <div className="h-48 md:h-full md:w-2/5 bg-muted flex items-center justify-center shrink-0 relative overflow-hidden">
        <Link
          to={backTo}
          className="absolute top-4 left-4 inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors bg-card/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm z-10"
        >
          <ArrowLeft className="w-4 h-4" /> {t("back")}
        </Link>

        {hasImages ? (
          <div className="w-full h-full relative">
            <Carousel setApi={setCarouselApi} className="w-full h-full [&>div]:h-full">
              <CarouselContent className="h-full -ml-0 [&>div]:h-full">
                {images.map((src, i) => (
                  <CarouselItem key={i} className="pl-0 h-full">
                    <ImageWithFallback
                      src={src}
                      alt={`${plant.name[lang]} ${i + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openFullscreen(i)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation arrows */}
            {slideCount > 1 && (
              <>
                <button
                  onClick={() => carouselApi?.scrollPrev()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-card-foreground hover:bg-card transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => carouselApi?.scrollNext()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-card-foreground hover:bg-card transition-colors z-10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {slideCount > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {Array.from({ length: slideCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => carouselApi?.scrollTo(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentSlide
                        ? "bg-primary w-4"
                        : "bg-card/60 hover:bg-card/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <BlankImage className="w-1/2 h-1/2" />
        )}
      </div>

      {/* Right: Scrollable details */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-card-foreground mb-1">
              {plant.name[lang]}
            </h1>
            <span className={(categoryInfo[plant.category]?.color) ?? "badge-humid"}>
              {(categoryInfo[plant.category]?.emoji) ?? "🌱"} {lang === "th" ? (categoryInfo[plant.category]?.th ?? plant.category) : (categoryInfo[plant.category]?.en ?? plant.category)}
            </span>
            <TagBadges tags={plant.tags} className="mt-2" />
          </div>
          <ShareButton title={plant.name[lang]} />
        </div>
        <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
        {plant.description[lang]}
        </p>

        <h2 className="font-display font-bold text-lg text-card-foreground mb-3">
          🌱 {t("care.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {careItems.map(({ key, icon: Icon, value, level }) => (
            <div
              key={key}
              className="flex items-start gap-3 p-3 rounded-2xl bg-muted/50 border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-card-foreground mb-0.5">
                  {t(`care.${key}`)}
                </p>
                <p className="text-muted-foreground text-xs md:text-sm">{value[lang]}</p>
                {level !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    {key === "temp" ? (() => {
                      const temps = plant.care.temp[lang].match(/\d+/g)?.map(Number) ?? [];
                      const minT = temps[0] ?? 20;
                      const maxT = temps[1] ?? minT;
                      // Map temp to position: 10°C=5%, 40°C=95%
                      const toPos = (t: number) => Math.max(5, Math.min(95, ((t - 10) / 30) * 90 + 5));
                      const leftPos = toPos(minT);
                      const rightPos = toPos(maxT);
                      return (
                        <div className="flex-1 relative h-4 rounded-full" style={{ background: "linear-gradient(to right, hsl(200,70%,70%), hsl(170,60%,65%), hsl(140,55%,65%), hsl(80,60%,65%), hsl(50,70%,60%), hsl(35,75%,58%), hsl(15,70%,55%), hsl(0,65%,55%))" }}>
                          {/* Tick marks */}
                          <div className="absolute inset-0 flex items-center justify-between px-[3%]">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div key={i} className="w-px h-2 bg-card/30 rounded-full" />
                            ))}
                          </div>
                          {/* Min marker */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-border shadow-lg flex items-center justify-center transition-all duration-700 ease-out"
                            style={{ left: `${leftPos}%` }}
                          >
                            <span className="text-[8px] font-bold text-card-foreground">{minT}°</span>
                          </div>
                          {/* Max marker */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-border shadow-lg flex items-center justify-center transition-all duration-700 ease-out"
                            style={{ left: `${rightPos}%` }}
                          >
                            <span className="text-[8px] font-bold text-card-foreground">{maxT}°</span>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="flex-1 h-4 rounded-full bg-card overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${getLevelColor(key, level)}`}
                          style={{ width: `${level}%` }}
                        />
                      </div>
                    )}
                    {key !== "temp" && (
                      <span className="text-[10px] font-semibold text-muted-foreground w-8 text-right">{level}%</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {plant.varieties && plant.varieties.length > 0 && (
          <VarietySection varieties={plant.varieties} plantName={plant.name[lang]} parentLevels={plant.levels} />
        )}

        {relatedSupplies.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display font-bold text-lg text-card-foreground mb-3">
              {lang === "th" ? "สินค้าที่เกี่ยวข้อง" : "Related products"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedSupplies.map((s) => {
                const thumb = supplyImages[s.id]?.[0] ?? null;
                const sale = saleInfo(s.price, s.compareAtPrice);
                return (
                  <Link
                    key={s.id}
                    to={`/categories/${s.id}`}
                    state={{ from: location.pathname }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <ImageWithFallback
                      src={thumb}
                      alt={s.name[lang]}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-card-foreground truncate">
                        {s.name[lang]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ฿{s.price.toLocaleString()}
                        {sale.onSale && (
                          <>
                            {" "}
                            <span className="line-through">฿{s.compareAtPrice!.toLocaleString()}</span>
                            {" "}
                            <span className="text-destructive font-semibold">-{sale.percentOff}%</span>
                          </>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen lightbox */}
      {fullscreen && hasImages && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center" onClick={closeFullscreen}>
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setFullscreenIndex((prev) => (prev - 1 + images.length) % images.length); }}
                className="absolute left-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setFullscreenIndex((prev) => (prev + 1) % images.length); }}
                className="absolute right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <ImageWithFallback
            src={images[fullscreenIndex]}
            alt={`${plant.name[lang]} ${fullscreenIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFullscreenIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === fullscreenIndex ? "bg-primary w-5" : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantDetailPage;
