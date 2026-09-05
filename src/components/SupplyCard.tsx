import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Supply } from "@/data/supplies";
import { useSupplies } from "@/hooks/useCloudData";
import TagBadges from "@/components/TagBadges";
import SalePrice from "@/components/SalePrice";

const SupplyCard = ({ supply, showDescription = true, showMeta = true }: { supply: Supply; showDescription?: boolean; showMeta?: boolean }) => {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const { data } = useSupplies();
  const images = (data?.images ?? {})[supply.id] ?? [];
  const hasImage = images.length > 0;

  return (
    <Link
      to={`/categories/${supply.id}`}
      state={{ from: location.pathname }}
      className="block bg-card rounded-2xl border-2 border-border card-hover overflow-hidden group"
    >
      <div className="h-32 sm:h-40 bg-muted/50 flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/20 z-10" />
        {hasImage ? (
          <img src={images[0]} alt={supply.name[lang]} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          supply.emoji
        )}
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
