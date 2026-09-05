import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuckyDomain } from "@/data/supplies";
import { useSupplies } from "@/hooks/useCloudData";
import SupplyCard from "@/components/SupplyCard";
import { Sparkles, Home, Heart, Cake, Store, GraduationCap, HeartPulse, PartyPopper, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

type Occasion = {
  key: string;
  th: string;
  en: string;
  descTh: string;
  descEn: string;
  icon: typeof Home;
  domains: LuckyDomain[];
};

const OCCASIONS: Occasion[] = [
  {
    key: "housewarming",
    th: "ขึ้นบ้านใหม่",
    en: "Housewarming",
    descTh: "ต้นไม้เสริมพลังบ้าน ปกป้องและนำโชคเข้าสู่ครอบครัว",
    descEn: "Plants that protect the home and bring good fortune to the family",
    icon: Home,
    domains: ["protection", "wealth"],
  },
  {
    key: "wedding",
    th: "แต่งงาน",
    en: "Wedding",
    descTh: "ไม้มงคลสื่อความรัก ความผูกพัน และชีวิตคู่ที่ราบรื่น",
    descEn: "Lucky plants symbolizing love, bond, and a smooth married life",
    icon: Heart,
    domains: ["love"],
  },
  {
    key: "birthday",
    th: "วันเกิด",
    en: "Birthday",
    descTh: "ของขวัญต้นไม้เสริมสุขภาพและอายุยืนยาว",
    descEn: "Plant gifts that boost health and longevity",
    icon: Cake,
    domains: ["health", "love"],
  },
  {
    key: "newbusiness",
    th: "เปิดร้าน / ธุรกิจใหม่",
    en: "New Business",
    descTh: "ต้นไม้เรียกทรัพย์ เรียกลูกค้า เสริมความเจริญรุ่งเรือง",
    descEn: "Plants that attract wealth, customers, and prosperity",
    icon: Store,
    domains: ["wealth", "career"],
  },
  {
    key: "graduation",
    th: "รับปริญญา",
    en: "Graduation",
    descTh: "ต้นไม้เสริมสติปัญญา ความก้าวหน้า และเส้นทางอาชีพ",
    descEn: "Plants for wisdom, progress, and a bright career path",
    icon: GraduationCap,
    domains: ["study", "career"],
  },
  {
    key: "getwell",
    th: "เยี่ยมไข้",
    en: "Get Well Soon",
    descTh: "ต้นไม้เสริมพลังกาย-ใจ ฟื้นฟูสุขภาพ",
    descEn: "Plants that strengthen body and mind for recovery",
    icon: HeartPulse,
    domains: ["health"],
  },
  {
    key: "newyear",
    th: "ปีใหม่ / ตรุษจีน",
    en: "New Year / Chinese NY",
    descTh: "ต้นไม้รับปีใหม่ เสริมโชคลาภและสิริมงคลตลอดปี",
    descEn: "Plants to welcome the new year with luck and prosperity",
    icon: PartyPopper,
    domains: ["wealth", "career"],
  },
  {
    key: "gift",
    th: "ของขวัญทั่วไป",
    en: "General Gift",
    descTh: "ต้นไม้มงคลส่งมอบความปรารถนาดีในทุกโอกาส",
    descEn: "Lucky plants to share good wishes for any occasion",
    icon: Gift,
    domains: ["love", "health", "protection"],
  },
];

const LuckyOccasions = () => {
  const { lang } = useLanguage();
  const [active, setActive] = useState<string>(OCCASIONS[0].key);
  const { data } = useSupplies();
  const supplies = data?.supplies ?? [];

  const occasion = OCCASIONS.find((o) => o.key === active)!;
  const list = supplies.filter(
    (s) =>
      s.isLucky &&
      s.lucky &&
      s.lucky.luckyFor.some((d) => occasion.domains.includes(d)),
  );

  return (
    <div className="space-y-5">
      {/* Occasion picker */}
      <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max pb-1">
          {OCCASIONS.map((o) => {
            const Icon = o.icon;
            const isActive = active === o.key;
            return (
              <button
                key={o.key}
                onClick={() => setActive(o.key)}
                className={cn(
                  "px-3.5 py-2 rounded-full text-sm font-medium border-2 whitespace-nowrap transition-colors inline-flex items-center gap-1.5",
                  isActive
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-card text-foreground border-border hover:border-accent/50",
                )}
              >
                <Icon className="w-4 h-4" />
                {lang === "th" ? o.th : o.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Occasion header */}
      <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-4 md:p-5 flex items-start gap-3">
        <div className="shrink-0 w-11 h-11 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center">
          <occasion.icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg md:text-xl text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" />
            {lang === "th" ? occasion.th : occasion.en}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lang === "th" ? occasion.descTh : occasion.descEn}
          </p>
        </div>
      </div>

      {/* Plants grid */}
      {list.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-5xl mb-4">✦</p>
          <p>{lang === "th" ? "ยังไม่มีไม้มงคลในโอกาสนี้" : "No lucky plants for this occasion yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {list.map((s) => (
            <div key={s.id} className="relative">
              <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/95 text-accent-foreground text-[11px] font-semibold shadow-sm">
                <Sparkles className="w-3 h-3" />
                {lang === "th" ? "มงคล" : "Lucky"}
              </span>
              <SupplyCard supply={s} showDescription={false} showMeta={false} />
              {s.lucky && (
                <p className="mt-2 text-xs text-muted-foreground italic px-1">
                  ✦ {s.lucky.meaning[lang]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LuckyOccasions;
