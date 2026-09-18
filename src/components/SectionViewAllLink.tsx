import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SectionViewAllLinkProps {
  to: string;
  className?: string;
}

/**
 * The "view all" link that closes every homepage section's heading row.
 * Each section used to write its own label ("ดูพรรณไม้ทั้งหมด", "ดูอันดับทั้งหมด",
 * "ดูวิธีดูแลแต่ละชนิด", "ดูหมวดหมู่ทั้งหมด"...) — different text meant a
 * different pill width per section, so the row read as inconsistent even
 * though the markup was already shared. Fixed text here means every
 * section's link is now identical by construction, not by convention.
 */
const SectionViewAllLink = ({ to, className = "home-outline" }: SectionViewAllLinkProps) => {
  const { lang } = useLanguage();
  return (
    <Link className={className} to={to}>
      {lang === "th" ? "ดูทั้งหมด" : "View all"}
      <ArrowRight size={15} />
    </Link>
  );
};

export default SectionViewAllLink;
