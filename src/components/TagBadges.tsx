import { useLanguage } from "@/contexts/LanguageContext";
import { useTagMap } from "@/hooks/useCloudData";

interface Props {
  tags?: string[] | null;
  /** "inline" sits in the flow; "overlay" floats over a card image. */
  variant?: "inline" | "overlay";
  /** Cap how many render; the rest collapse into a "+N" chip. */
  max?: number;
  className?: string;
}

/**
 * Renders tag keys as badges. Keys are stored on rows as a plain text[] with no
 * foreign key, so anything the `tags` table cannot resolve is skipped rather
 * than rendered as a broken chip.
 */
const TagBadges = ({ tags, variant = "inline", max, className = "" }: Props) => {
  const { lang } = useLanguage();
  const tagMap = useTagMap();

  const resolved = (tags ?? []).map((k) => tagMap[k]).filter(Boolean);
  if (resolved.length === 0) return null;

  const shown = max ? resolved.slice(0, max) : resolved;
  const hidden = resolved.length - shown.length;

  const wrapper =
    variant === "overlay"
      ? `absolute top-2 left-2 z-20 flex flex-wrap gap-1 max-w-[calc(100%-1rem)] ${className}`
      : `flex flex-wrap gap-1.5 ${className}`;
  const size = variant === "overlay" ? "!px-2 !py-0.5 !text-[10px] shadow-sm" : "";

  return (
    <div className={wrapper}>
      {shown.map((t) => (
        <span key={t.key} className={`${t.color} ${size}`}>
          {t.emoji && <span className="mr-1">{t.emoji}</span>}
          {t.name[lang] || t.key}
        </span>
      ))}
      {hidden > 0 && <span className={`badge-humid ${size}`}>+{hidden}</span>}
    </div>
  );
};

export default TagBadges;
