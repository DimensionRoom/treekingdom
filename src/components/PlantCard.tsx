import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plant, categoryInfo as fallbackInfo } from "@/data/plants";
import { useCategoryInfo, usePlants } from "@/hooks/useCloudData";
import TagBadges from "@/components/TagBadges";

interface PlantCardProps {
  plant: Plant;
}

const PlantCard = ({ plant }: PlantCardProps) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const catInfoMap = useCategoryInfo();
  const info = catInfoMap[plant.category] ?? (fallbackInfo as any)[plant.category] ?? { emoji: "🌱", color: "badge-humid", th: plant.category, en: plant.category };
  const catName = lang === "th" ? info.th : info.en;
  const { data: plantsData } = usePlants();
  const images = (plantsData?.images ?? {})[plant.id] ?? [];
  const hasImage = images.length > 0;

  return (
    <Link
      to={`/plants/${plant.id}`}
      state={{ from: location.pathname + location.search }}
      className="block bg-card rounded-2xl border-2 border-border card-hover overflow-hidden group"
    >
      <div className="h-36 sm:h-48 bg-muted/50 flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/20 z-10" />
        {hasImage ? (
          <img src={images[0]} alt={plant.name[lang]} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          plant.emoji
        )}
        <TagBadges tags={plant.tags} variant="overlay" max={2} />
      </div>
      <div className="p-3 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          <h3 className="font-display font-bold text-sm sm:text-lg text-card-foreground line-clamp-1">
            {plant.name[lang]}
          </h3>
          <span className="text-base sm:text-lg bg-muted w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0">
            {info.emoji}
          </span>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
          {plant.description[lang]}
        </p>
        <span className={`${info.color} text-xs font-semibold`}>
          {catName}
        </span>
      </div>
    </Link>
  );
};

export default PlantCard;
