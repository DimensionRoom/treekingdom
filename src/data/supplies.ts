export type SupplyCategory = "plants" | "fertilizer" | "pot" | "tools";

export type LuckyDomain = "wealth" | "love" | "health" | "career" | "study" | "protection";

export interface LuckyInfo {
  meaning: { th: string; en: string };
  luckyFor: LuckyDomain[];
  weekdays?: number[]; // 0=Sun ... 6=Sat
  zodiacs?: string[]; // western zodiac keys
  chineseZodiacs?: string[]; // 12 Chinese zodiac keys
}

export interface SupplyVariant {
  id: string;
  name: { th: string; en: string };
  description?: { th: string; en: string } | null;
  price: number;
  stock: number;
  image?: string | null;
  sortOrder?: number;
}

export interface Supply {
  id: string;
  name: { th: string; en: string };
  category: SupplyCategory;
  description: { th: string; en: string };
  price: number;
  stock: number;
  emoji: string;
  isLucky?: boolean;
  lucky?: LuckyInfo;
  plantId?: string | null;
  varietyId?: string | null;
  variants?: SupplyVariant[];
  /** Pre-discount price. Struck through only when it is above `price`. */
  compareAtPrice?: number | null;
  /** Keys into the `tags` table; unknown keys are ignored when rendering. */
  tags?: string[];
}


export const supplies: Supply[] = [
  {
    id: "organic-fertilizer",
    name: { th: "ปุ๋ยอินทรีย์", en: "Organic Fertilizer" },
    category: "fertilizer",
    emoji: "🌾",
    description: {
      th: "ปุ๋ยอินทรีย์จากธรรมชาติ 100% เหมาะสำหรับไม้ดอกและไม้ใบ บำรุงดินให้อุดมสมบูรณ์",
      en: "100% natural organic fertilizer, perfect for flowers and foliage plants. Enriches soil naturally.",
    },
    price: 159,
    stock: 45,
  },
  {
    id: "slow-release",
    name: { th: "ปุ๋ยละลายช้า", en: "Slow-Release Fertilizer" },
    category: "fertilizer",
    emoji: "💊",
    description: {
      th: "ปุ๋ยละลายช้าออกฤทธิ์นาน 3 เดือน ให้สารอาหารสม่ำเสมอ",
      en: "Slow-release fertilizer lasting 3 months, provides consistent nutrients.",
    },
    price: 249,
    stock: 30,
  },
  {
    id: "cactus-fertilizer",
    name: { th: "ปุ๋ยแคคตัส", en: "Cactus Fertilizer" },
    category: "fertilizer",
    emoji: "🧪",
    description: {
      th: "ปุ๋ยน้ำสูตรเฉพาะแคคตัสและไม้อวบน้ำ ไม่เผาราก",
      en: "Liquid fertilizer formulated for cactus and succulents, root-safe.",
    },
    price: 189,
    stock: 22,
  },
  {
    id: "ceramic-pot",
    name: { th: "กระถางเซรามิก", en: "Ceramic Pot" },
    category: "pot",
    emoji: "🏺",
    description: {
      th: "กระถางเซรามิกเคลือบเงา มีรูระบายน้ำ หลายสีให้เลือก ขนาด 6 นิ้ว",
      en: "Glazed ceramic pot with drainage holes, multiple colors, 6-inch size.",
    },
    price: 299,
    stock: 18,
  },
  {
    id: "terracotta-pot",
    name: { th: "กระถางดินเผา", en: "Terracotta Pot" },
    category: "pot",
    emoji: "🫙",
    description: {
      th: "กระถางดินเผาธรรมชาติ ระบายอากาศดี เหมาะสำหรับแคคตัสและไม้อวบน้ำ",
      en: "Natural terracotta pot with excellent air circulation, ideal for cacti and succulents.",
    },
    price: 129,
    stock: 55,
  },
  {
    id: "hanging-pot",
    name: { th: "กระถางแขวน", en: "Hanging Pot" },
    category: "pot",
    emoji: "🪴",
    description: {
      th: "กระถางแขวนพร้อมโซ่ เหมาะสำหรับไม้เลื้อยและเฟิร์น",
      en: "Hanging pot with chain, perfect for trailing plants and ferns.",
    },
    price: 199,
    stock: 12,
  },
  {
    id: "pruning-shears",
    name: { th: "กรรไกรตัดกิ่ง", en: "Pruning Shears" },
    category: "tools",
    emoji: "✂️",
    description: {
      th: "กรรไกรตัดกิ่งสแตนเลส คมกริบ ด้ามจับกันลื่น ทนทาน",
      en: "Stainless steel pruning shears, sharp and durable with non-slip grip.",
    },
    price: 350,
    stock: 25,
  },
  {
    id: "watering-can",
    name: { th: "บัวรดน้ำ", en: "Watering Can" },
    category: "tools",
    emoji: "🚿",
    description: {
      th: "บัวรดน้ำสแตนเลสขนาด 2 ลิตร ปากเรียวยาว สำหรับรดน้ำต้นไม้",
      en: "2-liter stainless steel watering can with long spout for precise watering.",
    },
    price: 450,
    stock: 15,
  },
  {
    id: "spray-bottle",
    name: { th: "กระบอกฉีดน้ำ", en: "Spray Bottle" },
    category: "tools",
    emoji: "💦",
    description: {
      th: "กระบอกฉีดน้ำ 500ml ปรับหัวฉีดได้ เหมาะสำหรับพ่นน้ำใบไม้",
      en: "500ml spray bottle with adjustable nozzle, perfect for misting leaves.",
    },
    price: 89,
    stock: 60,
  },
  {
    id: "soil-meter",
    name: { th: "เครื่องวัดความชื้นดิน", en: "Soil Moisture Meter" },
    category: "tools",
    emoji: "📏",
    description: {
      th: "เครื่องวัดความชื้นดิน 3-in-1 วัดค่า pH แสง และความชื้น ไม่ต้องใช้ถ่าน",
      en: "3-in-1 soil meter measures pH, light, and moisture. No batteries needed.",
    },
    price: 199,
    stock: 35,
  },
  {
    id: "monstera-plant",
    name: { th: "มอนสเตอร่า", en: "Monstera" },
    category: "plants",
    emoji: "🌿",
    description: {
      th: "มอนสเตอร่ามีใบใหญ่เป็นรูหรือหยัก เป็นไม้ประดับยอดนิยม เชื่อว่าช่วยดึงดูดเงินทองและความมั่งคั่ง",
      en: "Monstera has large fenestrated leaves, believed to attract wealth and abundance.",
    },
    price: 350,
    stock: 20,
    isLucky: true,
    lucky: {
      meaning: { th: "เสริมความมั่งคั่งและการเติบโต", en: "Boosts wealth and growth" },
      luckyFor: ["wealth", "career"],
      weekdays: [4], // Thursday
      zodiacs: ["taurus", "virgo", "capricorn"],
      chineseZodiacs: ["dragon", "snake", "horse"],
    },
  },
  {
    id: "rose-plant",
    name: { th: "กุหลาบ", en: "Rose" },
    category: "plants",
    emoji: "🌹",
    description: {
      th: "ราชินีแห่งดอกไม้ สื่อถึงความรักและความโรแมนติก เสริมเสน่ห์ผู้ปลูก",
      en: "Queen of flowers, symbol of love and romance, enhances the grower's charm.",
    },
    price: 199,
    stock: 35,
    isLucky: true,
    lucky: {
      meaning: { th: "เสริมความรักและเสน่ห์", en: "Enhances love and charm" },
      luckyFor: ["love"],
      weekdays: [5], // Friday
      zodiacs: ["libra", "taurus", "pisces"],
      chineseZodiacs: ["rabbit", "goat", "pig"],
    },
  },
  {
    id: "orchid-plant",
    name: { th: "กล้วยไม้", en: "Orchid" },
    category: "plants",
    emoji: "🌺",
    description: {
      th: "ดอกไม้สง่างาม สื่อถึงความสูงส่งและโชคดี เหมาะวางในห้องรับแขก",
      en: "Elegant flower symbolizing nobility and good fortune, ideal for living rooms.",
    },
    price: 289,
    stock: 15,
    isLucky: true,
    lucky: {
      meaning: { th: "เสริมเกียรติยศและความก้าวหน้า", en: "Brings honor and progress" },
      luckyFor: ["career", "study"],
      weekdays: [3], // Wednesday
      zodiacs: ["leo", "libra"],
      chineseZodiacs: ["tiger", "dragon"],
    },
  },
  {
    id: "cactus-plant",
    name: { th: "แคคตัสถังทอง", en: "Golden Barrel Cactus" },
    category: "plants",
    emoji: "🌵",
    description: {
      th: "แคคตัสถังทอง รูปทรงกลม สีเขียวทอง เชื่อว่าช่วยป้องกันสิ่งไม่ดีและคลื่นลบ",
      en: "Golden barrel cactus is believed to ward off negative energy.",
    },
    price: 159,
    stock: 40,
    isLucky: true,
    lucky: {
      meaning: { th: "ป้องกันพลังลบและคุ้มครอง", en: "Protection from negative energy" },
      luckyFor: ["protection"],
      weekdays: [2], // Tuesday
      zodiacs: ["aries", "scorpio", "capricorn"],
      chineseZodiacs: ["ox", "tiger"],
    },
  },
  {
    id: "fern-plant",
    name: { th: "เฟิร์น", en: "Fern" },
    category: "plants",
    emoji: "🌱",
    description: {
      th: "เฟิร์นชอบความชื้นสูง ใบเรียวยาวเป็นพุ่มสวยงาม ช่วยเสริมความสงบและสุขภาพ",
      en: "Ferns love high humidity, bringing calmness and health to the home.",
    },
    price: 129,
    stock: 28,
    isLucky: true,
    lucky: {
      meaning: { th: "เสริมสุขภาพและความสงบ", en: "Promotes health and calm" },
      luckyFor: ["health"],
      weekdays: [1], // Monday
      zodiacs: ["cancer", "pisces"],
      chineseZodiacs: ["rabbit", "goat"],
    },
  },
  {
    id: "money-tree",
    name: { th: "กวักมรกต", en: "Money Tree (ZZ Plant)" },
    category: "plants",
    emoji: "💚",
    description: {
      th: "กวักมรกตใบเขียวเป็นมัน เชื่อว่ากวักเงินกวักทองเข้าบ้าน เลี้ยงง่ายทนแล้ง",
      en: "Glossy green leaves believed to attract wealth into the home, easy to care for.",
    },
    price: 459,
    stock: 18,
    isLucky: true,
    lucky: {
      meaning: { th: "กวักโชคลาภและเงินทอง", en: "Attracts fortune and money" },
      luckyFor: ["wealth", "career"],
      weekdays: [4],
      zodiacs: ["taurus", "capricorn", "virgo"],
      chineseZodiacs: ["rat", "dragon", "monkey"],
    },
  },
  {
    id: "lucky-bamboo",
    name: { th: "ไผ่กวนอิม", en: "Lucky Bamboo" },
    category: "plants",
    emoji: "🎋",
    description: {
      th: "ไผ่กวนอิมตามความเชื่อจีน นำพาโชคลาภ ความสำเร็จ และอายุยืน",
      en: "In Chinese tradition, lucky bamboo brings fortune, success, and longevity.",
    },
    price: 199,
    stock: 50,
    isLucky: true,
    lucky: {
      meaning: { th: "นำพาโชคลาภและความสำเร็จ", en: "Brings luck and success" },
      luckyFor: ["wealth", "career", "study"],
      weekdays: [3, 4],
      zodiacs: ["gemini", "virgo", "aquarius"],
      chineseZodiacs: ["rat", "ox", "rabbit", "dragon"],
    },
  },
  {
    id: "snake-plant",
    name: { th: "ลิ้นมังกร", en: "Snake Plant" },
    category: "plants",
    emoji: "🪴",
    description: {
      th: "ลิ้นมังกรใบตั้งแหลม ฟอกอากาศได้ดี เชื่อว่าตัดสิ่งอัปมงคลและคุ้มครองบ้าน",
      en: "Upright pointed leaves purify air and are believed to cut bad luck.",
    },
    price: 329,
    stock: 22,
    isLucky: true,
    lucky: {
      meaning: { th: "ตัดสิ่งอัปมงคลและคุ้มครอง", en: "Cuts bad luck and protects" },
      luckyFor: ["protection", "health"],
      weekdays: [2, 6],
      zodiacs: ["aries", "scorpio"],
      chineseZodiacs: ["tiger", "dog"],
    },
  },
  {
    id: "jade-plant",
    name: { th: "เศรษฐีเรือนใน", en: "Jade Plant" },
    category: "plants",
    emoji: "🌳",
    description: {
      th: "เศรษฐีเรือนในใบอวบกลม คล้ายเหรียญหยก สัญลักษณ์ของความร่ำรวยและมิตรภาพ",
      en: "Plump jade-coin leaves symbolize wealth and friendship.",
    },
    price: 259,
    stock: 26,
    isLucky: true,
    lucky: {
      meaning: { th: "เสริมโชคลาภและความสัมพันธ์", en: "Boosts wealth and relationships" },
      luckyFor: ["wealth", "love"],
      weekdays: [4, 5],
      zodiacs: ["taurus", "virgo", "libra"],
      chineseZodiacs: ["pig", "rabbit", "goat"],
    },
  },
];

export const supplyCategoryInfo: Record<SupplyCategory, { emoji: string }> = {
  plants: { emoji: "🌳" },
  fertilizer: { emoji: "🌾" },
  pot: { emoji: "🏺" },
  tools: { emoji: "🔧" },
};

