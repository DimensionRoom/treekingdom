import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Supply } from "@/data/supplies";
import { useSupplies } from "@/hooks/useCloudData";
import TagBadges from "@/components/TagBadges";
import SalePrice from "@/components/SalePrice";
import ImageWithFallback from "@/components/ImageWithFallback";

interface SupplyCardProps {
  supply: Supply;
  showDescription?: boolean;
  showMeta?: boolean;
  /** "catalog" is the products-page card, sharing catalog.css with the plants grid. */
  variant?: "default" | "catalog";
}

const SupplyCard = ({ supply, showDescription = true, showMeta = true, variant = "default" }: SupplyCardProps) => {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const { data } = useSupplies();
  const images = (data?.images ?? {})[supply.id] ?? [];
  // Carries the query string too, so "back" returns to the filtered list
  // rather than the unfiltered one.
  const to = { pathname: `/categories/${supply.id}`, from: location.pathname + location.search };

  if (variant === "catalog") {
    return (
      <article className="catalog-card">
        <Link className="catalog-card-image-link" to={to.pathname} state={{ from: to.from }}>
          <ImageWithFallback src={images[0]} alt={supply.name[lang]} className="catalog-card-image" loading="lazy" />
        </Link>
        {/* Anchored to the card, which is the positioned ancestor — the image
            link isn't, and sale/new badges carry real weight on a shop page. */}
        <TagBadges tags={supply.tags} variant="overlay" max={2} />
        <div className="catalog-card-body">
          <Link to={to.pathname} state={{ from: to.from }}>
            <h3>{supply.name[lang]}</h3>
          </Link>
          <p>{supply.description[lang]}</p>
          <div className="catalog-card-meta">
            {/* Wrapped so it isn't a direct <span> child: catalog.css pills
                those, which would fight SalePrice's own pill styling and
                shrink the price to the stock badge's size. */}
            <div>
              <SalePrice price={supply.price} compareAtPrice={supply.compareAtPrice} />
            </div>
            <span>📦 {supply.stock} {t("items")}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Link
      to={`/categories/${supply.id}`}
      state={{ from: location.pathname }}
      className="block bg-card rounded-2xl border-2 border-border card-hover overflow-hidden group"
    >
      <div className="h-32 sm:h-40 bg-muted/50 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/20 z-10" />
        <ImageWithFallback
          src={images[0]}
          alt={supply.name[lang]}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <TagBadges tags={supply.tags} variant="overlay" max={2} />
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="font-display font-bold text-sm sm:text-lg text-card-foreground mb-1 line-clamp-1">
          {supply.name[lang]}
        </h3>
        {showDescription && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {supply.description[lang]}
          </p>
        )}
        {showMeta && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <SalePrice
              price={supply.price}
              compareAtPrice={supply.compareAtPrice}
              className="self-start"
            />
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full self-start">
              📦 {supply.stock} {t("items")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SupplyCard;
