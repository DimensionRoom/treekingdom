import { useParams, Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupplies, usePlants } from "@/hooks/useCloudData";
import { ArrowLeft, Package, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import SupplyVariantSection from "@/components/SupplyVariantSection";
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
import ImageLightbox from "@/components/ImageLightbox";
import SalePrice from "@/components/SalePrice";
import Seo from "@/components/Seo";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { saleInfo } from "@/lib/price";

const SupplyDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const backTo = (location.state as { from?: string } | null)?.from ?? "/categories";
  const { lang, t } = useLanguage();
  const { data } = useSupplies();
  const { data: plantsData } = usePlants();
  const supplies = data?.supplies ?? [];
  const supplyImages = data?.images ?? {};
  const supply = supplies.find((s) => s.id === id);
  const linkedPlant = supply?.plantId
    ? (plantsData?.plants ?? []).find((p) => p.id === supply.plantId)
    : null;
  const linkedVariety = supply?.varietyId
    ? (linkedPlant?.varieties ?? []).find((v) => v.id === supply.varietyId) ??
      (plantsData?.plants ?? [])
        .flatMap((p) => p.varieties ?? [])
        .find((v) => v.id === supply.varietyId) ??
      null
    : null;
  const linkedPlantImage = linkedVariety?.image
    ?? (linkedPlant ? (plantsData?.images?.[linkedPlant.id]?.[0] ?? null) : null);
  const ref = useRef<HTMLDivElement>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  const images = id ? supplyImages[id] ?? [] : [];
  const hasImages = images.length > 0;

  const openFullscreen = useCallback((index: number) => {
    setFullscreenIndex(index);
    setFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => setFullscreen(false), []);

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

  if (!supply) {
    return (
      <div className="section-padding text-center">
        <Seo title="Product Not Found | TreeKingdom" description="This product doesn't exist." noindex />
        <p className="text-5xl mb-4">📦</p>
        <p className="text-muted-foreground">{lang === "th" ? "ไม่พบสินค้า" : "Product not found"}</p>
        <Link to={backTo} className="text-primary mt-4 inline-block hover:underline">
          ← {t("back")}
        </Link>
      </div>
    );
  }

  const stockColor = supply.stock > 20 ? "text-primary" : supply.stock > 5 ? "text-accent" : "text-destructive";
  const pageUrl = absoluteUrl(`/categories/${supply.id}`);
  const { onSale } = saleInfo(supply.price, supply.compareAtPrice);
  // schema.org has no dedicated "compare at" field; priceType: ListPrice on a
  // nested priceSpecification is the accepted way to surface the old price.
  const listPriceSpec = onSale
    ? {
        "@type": "UnitPriceSpecification",
        price: supply.compareAtPrice,
        priceCurrency: "THB",
        priceType: "https://schema.org/ListPrice",
      }
    : undefined;

  return (
    <div className="fixed inset-0 top-16 z-20 flex flex-col md:flex-row bg-background" ref={ref}>
      <Seo
        title={lang === "th" ? `${supply.name.th} | TreeKingdom` : `${supply.name.en} | TreeKingdom`}
        description={supply.description[lang]}
        image={images[0]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: supply.name[lang],
            description: supply.description[lang],
            image: images[0] ? absoluteUrl(images[0]) : undefined,
            url: pageUrl,
            offers: {
              "@type": "Offer",
              url: pageUrl,
              priceCurrency: "THB",
              price: supply.price,
              availability:
                supply.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              ...(listPriceSpec ? { priceSpecification: listPriceSpec } : {}),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: lang === "th" ? "สินค้า" : "Products", item: absoluteUrl("/categories") },
              { "@type": "ListItem", position: 3, name: supply.name[lang], item: pageUrl },
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
                      alt={`${supply.name[lang]} ${i + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openFullscreen(i)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

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
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-card-foreground">
            {supply.name[lang]}
          </h1>
          <ShareButton title={supply.name[lang]} />
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="badge-category bg-primary/10 text-primary">
            {t(`supply.${supply.category}`)}
          </span>
          <TagBadges tags={supply.tags} />
        </div>

        <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
          {supply.description[lang]}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-colors flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("price")}</p>
              <SalePrice price={supply.price} compareAtPrice={supply.compareAtPrice} size="lg" />
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-colors flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("stock")}</p>
              <p className={`font-bold text-xl ${stockColor}`}>
                {supply.stock} <span className="text-sm font-normal text-muted-foreground">{t("items")}</span>
              </p>
            </div>
          </div>
        </div>

        {linkedPlant && (
          <Link
            to={`/plants/${linkedPlant.id}`}
            state={{ from: location.pathname, varietyId: linkedVariety?.id }}
            className="mt-6 flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <ImageWithFallback
              src={linkedPlantImage}
              alt={linkedPlant.name[lang]}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                {lang === "th" ? "ดูข้อมูลพรรณไม้" : "View plant encyclopedia"}
              </p>
              <p className="font-semibold text-sm text-card-foreground truncate">
                {linkedPlant.name[lang]}
              </p>
              {linkedVariety && (
                <p className="text-xs text-primary truncate">
                  {linkedVariety.emoji} {linkedVariety.name[lang]}
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Link>
        )}

        {supply.variants && supply.variants.length > 0 && (
          <SupplyVariantSection variants={supply.variants} supplyName={supply.name[lang]} />
        )}
      </div>


      {fullscreen && hasImages && (
        <ImageLightbox
          images={images}
          index={fullscreenIndex}
          onIndexChange={setFullscreenIndex}
          onClose={closeFullscreen}
          alt={supply.name[lang]}
        />
      )}
    </div>
  );
};

export default SupplyDetailPage;
