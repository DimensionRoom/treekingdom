import { Eye } from "lucide-react";

interface Props {
  views: number | undefined;
  className?: string;
}

/** 1234 -> "1.2k", 950 -> "950" — keeps a view badge from ever wrapping. */
const formatViews = (n: number): string => {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(n / 1000)}k`;
};

/**
 * Small "👁 1.2k" badge shared by plant cards, detail pages, and variety
 * cards. Renders nothing for 0/undefined — an item nobody has viewed yet
 * looks worse showing "0 views" than showing no badge at all.
 */
const ViewCount = ({ views, className = "" }: Props) => {
  if (!views) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-muted-foreground ${className}`}>
      <Eye className="w-3.5 h-3.5" />
      {formatViews(views)}
    </span>
  );
};

export default ViewCount;
