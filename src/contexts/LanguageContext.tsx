import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "th" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.home": { th: "หน้าหลัก", en: "Home" },
  "nav.plants": { th: "พรรณไม้", en: "Plants" },
  "nav.categories": { th: "สินค้า", en: "Products" },
  "nav.lucky": { th: "ไม้มงคล", en: "Lucky" },
  "nav.personality": { th: "ตามนิสัย", en: "Personality" },

  // Hero
  "hero.title": { th: "อาณาจักรแห่งต้นไม้", en: "The Tree Kingdom" },
  "hero.subtitle": { th: "ค้นพบพรรณไม้หลากหลายสายพันธุ์ พร้อมวิธีดูแลอย่างละเอียด", en: "Discover diverse plant species with detailed care guides" },
  "hero.cta": { th: "สำรวจพรรณไม้", en: "Explore Plants" },
  "hero.cta2": { th: "ดูอุปกรณ์", en: "View Supplies" },

  // Plant categories — now driven by categoryInfo in plants.ts

  // Supply categories
  "supply.fertilizer": { th: "ปุ๋ย", en: "Fertilizer" },
  "supply.pot": { th: "กระถาง", en: "Pots" },
  "supply.tools": { th: "เครื่องมือและอุปกรณ์", en: "Tools & Equipment" },
  "supply.plants": { th: "ต้นไม้", en: "Plants" },

  // General
  "search": { th: "ค้นหา...", en: "Search..." },
  "search.plants": { th: "ค้นหาพรรณไม้...", en: "Search plants..." },
  "all": { th: "ทั้งหมด", en: "All" },
  // "{n}" is replaced by the caller — t() itself does no interpolation.
  "filter.results": { th: "พบ {n} รายการ", en: "{n} results" },
  "filter.clear": { th: "ล้างตัวกรอง", en: "Clear filters" },
  "filter.noResults.clear": { th: "ล้างตัวกรองทั้งหมด", en: "Clear all filters" },
  "sort.label": { th: "เรียงโดย:", en: "Sort:" },
  "care.title": { th: "วิธีดูแล", en: "Care Guide" },
  "care.light": { th: "แสง", en: "Light" },
  "care.water": { th: "น้ำ", en: "Water" },
  "care.humidity": { th: "ความชื้น", en: "Humidity" },
  "care.temp": { th: "อุณหภูมิ", en: "Temperature" },
  "care.soil": { th: "ดิน", en: "Soil" },
  "care.tips": { th: "เคล็ดลับ", en: "Tips" },
  "price": { th: "ราคา", en: "Price" },
  "price.was": { th: "ราคาปกติ", en: "Was" },
  "price.off": { th: "ลด", en: "off" },
  "stock": { th: "คงเหลือ", en: "In Stock" },
  "items": { th: "ชิ้น", en: "pcs" },
  "back": { th: "กลับ", en: "Back" },
  "featured": { th: "พรรณไม้แนะนำ", en: "Featured Plants" },
  "featured.sub": { th: "ต้นไม้ยอดนิยมที่คัดสรรมาเพื่อคุณ", en: "Hand-picked favorites for you" },
  "categories.title": { th: "หมวดหมู่พรรณไม้", en: "Plant Categories" },
  "categories.sub": { th: "เลือกดูพรรณไม้ตามประเภทที่สนใจ", en: "Browse plants by category" },
  "supplies.title": { th: "สินค้าทั้งหมด", en: "All Products" },
  "supplies.sub": { th: "ต้นไม้และอุปกรณ์จัดสวนครบครัน", en: "Plants and gardening supplies all in one place" },
  "footer.desc": { th: "แหล่งรวมพรรณไม้และอุปกรณ์จัดสวนที่ดีที่สุด", en: "Your best source for plants and gardening supplies" },
  "footer.rights": { th: "สงวนลิขสิทธิ์", en: "All rights reserved" },
  "detail": { th: "รายละเอียด", en: "Details" },
  "varieties.title": { th: "สายพันธุ์ย่อย", en: "Varieties" },
  "varieties.features": { th: "ลักษณะเด่น", en: "Key Features" },
  "varieties.bloom": { th: "ฤดูออกดอก", en: "Bloom Season" },
  "varieties.size": { th: "ขนาด", en: "Size" },
  "varieties.close": { th: "ปิด", en: "Close" },
  "varieties.care": { th: "การดูแล", en: "Care" },
  "varieties.sameAsParent": { th: "เหมือนต้นแม่", en: "Same as parent" },
  "varieties.tip": { th: "เคล็ดลับเฉพาะสายพันธุ์", en: "Variety-Specific Tip" },
  "varieties.origin": { th: "ถิ่นกำเนิด", en: "Origin" },
  "description": { th: "รายละเอียด", en: "Description" },
  "baht": { th: "บาท", en: "THB" },

  // Personality module
  "personality.title": { th: "ปลูกต้นไม้ตามลักษณะนิสัย", en: "Plants for Your Personality" },
  "personality.subtitle": {
    th: "ตอบคำถามสั้นๆ หรือเลือกตัวกรอง เพื่อค้นหาพรรณไม้ที่เข้ากับไลฟ์สไตล์ของคุณ",
    en: "Answer a few questions or pick filters to find plants that match your lifestyle",
  },
  "personality.tab.quiz": { th: "แบบทดสอบ", en: "Quiz" },
  "personality.tab.filters": { th: "ตัวกรองด่วน", en: "Quick Filters" },
  "personality.quiz.intro": {
    th: "ตอบ 6 ข้อสั้นๆ เพื่อดูบุคลิกนักปลูกของคุณ",
    en: "Answer 6 quick questions to reveal your grower personality",
  },
  "personality.quiz.question": { th: "ข้อ", en: "Question" },
  "personality.quiz.back": { th: "ย้อนกลับ", en: "Back" },
  "personality.quiz.retake": { th: "ทำใหม่", en: "Retake" },
  "personality.quiz.resultLabel": { th: "บุคลิกนักปลูกของคุณคือ", en: "Your grower personality" },
  "personality.filters.intro": {
    th: "เลือกสิ่งที่ตรงกับคุณ ระบบจะแนะนำพรรณไม้ให้ทันที",
    en: "Pick what fits you — recommendations update instantly",
  },
  "personality.filters.clear": { th: "ล้างตัวกรอง", en: "Clear filters" },
  "personality.results.plants": { th: "พรรณไม้ที่เหมาะกับคุณ", en: "Plants that suit you" },
  "personality.results.supplies": { th: "สินค้าที่ซื้อได้เลย", en: "Ready to buy" },
  "personality.results.empty": { th: "ยังไม่พบพรรณไม้ที่เหมาะสม", en: "No matching plants yet" },
  "personality.examples.title": { th: "ตัวอย่างการปลูกจริง", en: "Real growing examples" },
  "personality.examples.subtitle": {
    th: "ไอเดียการจัดวางและดูแลต้นไม้ที่เข้ากับบุคลิกของคุณ",
    en: "Setup and care ideas that match your grower personality",
  },
  "personality.examples.viewPlant": { th: "ดูข้อมูลพรรณไม้", en: "View plant details" },
  "personality.results.match": { th: "ความเข้ากัน", en: "Match" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("th");

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
