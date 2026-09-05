import { useLanguage } from "@/contexts/LanguageContext";
import { saleInfo } from "@/lib/price";

interface Props {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "lg";
  className?: string;
}

const SalePrice = ({ price, compareAtPrice, size = "sm", className = "" }: Props) => {
  const { t } = useLanguage();
  const { onSale, percentOff } = saleInfo(price, compareAtPrice);

  const priceCls =
    size === "lg"
      ? "font-bold text-xl text-card-foreground"
      : "font-bold text-primary text-lg bg-primary/10 px-3 py-1 rounded-full";

  if (!onSale) {
    return (
      <span className={`${priceCls} ${className}`}>
        ฿{price.toLocaleString()}
        {size === "lg" && (
          <span className="text-sm font-normal text-muted-foreground"> {t("baht")}</span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className={priceCls}>
        ฿{price.toLocaleString()}
        {size === "lg" && (
          <span className="text-sm font-normal text-muted-foreground"> {t("baht")}</span>
        )}
      </span>
      <span
        className={`text-muted-foreground line-through ${size === "lg" ? "text-base" : "text-xs"}`}
        title={t("price.was")}
      >
        ฿{compareAtPrice!.toLocaleString()}
      </span>
      <span className={`badge-sale ${size === "lg" ? "" : "!px-2 !py-0.5 !text-[10px]"}`}>
        -{percentOff}%
      </span>
    </span>
  );
};

export default SalePrice;
