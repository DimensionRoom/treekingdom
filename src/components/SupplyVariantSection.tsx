import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SupplyVariant } from "@/data/supplies";
import { X, Tag, Package } from "lucide-react";
import ImageWithFallback, { BlankImage } from "@/components/ImageWithFallback";
import ImageLightbox from "@/components/ImageLightbox";

interface Props {
  variants: SupplyVariant[];
  supplyName: string;
}

const SupplyVariantSection = ({ variants, supplyName }: Props) => {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState<SupplyVariant | null>(null);
  const [zoomed, setZoomed] = useState(false);

  // A variant carries a single image, so the lightbox gets a one-item gallery
  // — it then renders without arrows or dots on its own.
  const zoomImages = selected?.image ? [selected.image] : [];

  useEffect(() => {
    setZoomed(false);
  }, [selected?.id]);

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
          {lang === "th" ? "ตัวเลือกย่อย" : "Options"} ({variants.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {variants.map((v) => {
            const inStock = v.stock > 0;
            const low = inStock && v.stock <= 5;
            const stockColor = !inStock
              ? "text-destructive"
              : low
                ? "text-accent"
                : "text-primary";
            const statusLabel = !inStock
              ? lang === "th" ? "หมด" : "Out"
              : low
                ? lang === "th" ? "เหลือน้อย" : "Low"
                : lang === "th" ? "พร้อมซื้อ" : "In stock";
            return (
              <button
                key={v.id}
                onClick={() => setSelected(v)}
                className={`flex items-center gap-2 p-2 rounded-2xl bg-muted/50 border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left group overflow-hidden ${!inStock ? "opacity-70" : ""}`}
              >
                <ImageWithFallback
                  src={v.image}
                  alt={v.name[lang]}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-card-foreground truncate group-hover:text-primary transition-colors">
                    {v.name[lang]}
                  </p>
                  <p className="text-xs text-primary font-bold">
                    ฿{v.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${inStock ? (low ? "bg-accent" : "bg-primary") : "bg-destructive"}`} />
                    <span className={`text-[10px] font-semibold ${stockColor} truncate`}>
                      {statusLabel} · {v.stock}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card w-full h-full md:h-auto md:w-auto md:max-w-lg md:rounded-2xl md:shadow-2xl md:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom md:fade-in md:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 md:h-60 shrink-0 bg-muted overflow-hidden">
              {selected.image ? (
                <ImageWithFallback
                  src={selected.image}
                  alt={selected.name[lang]}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setZoomed(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BlankImage className="w-1/2 h-1/2" />
                </div>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              <h3 className="font-display font-bold text-xl text-card-foreground mb-0.5">
                {selected.name[lang]}
              </h3>
              <p className="text-muted-foreground text-xs mb-3">
                {lang === "th" ? `ตัวเลือกของ${supplyName}` : `Option of ${supplyName}`}
              </p>

              {selected.description?.[lang] && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {selected.description[lang]}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("price")}</p>
                    <p className="font-bold text-sm text-card-foreground">฿{selected.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-xl border ${selected.stock > 0 ? "bg-muted/50 border-border" : "bg-destructive/5 border-destructive/30"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selected.stock > 0 ? "bg-primary/10" : "bg-destructive/10"}`}>
                    <Package className={`w-4 h-4 ${selected.stock > 0 ? "text-primary" : "text-destructive"}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {selected.stock > 0
                        ? (lang === "th" ? "พร้อมซื้อ" : "In stock")
                        : (lang === "th" ? "สินค้าหมด" : "Out of stock")}
                    </p>
                    <p className={`font-bold text-sm ${selected.stock > 0 ? (selected.stock <= 5 ? "text-accent" : "text-card-foreground") : "text-destructive"}`}>
                      {selected.stock} {t("items")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sibling of the sheet, not a child: at z-[70] it covers the sheet's
          backdrop, and its own click handling stays independent of it. */}
      {zoomed && selected && zoomImages.length > 0 && (
        <ImageLightbox
          images={zoomImages}
          index={0}
          onIndexChange={() => {}}
          onClose={() => setZoomed(false)}
          alt={selected.name[lang]}
        />
      )}
    </>
  );
};

export default SupplyVariantSection;
