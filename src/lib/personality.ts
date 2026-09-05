import type { Plant } from "@/data/plants";

export interface CareProfile {
  /** 0-100 target levels */
  light: number;
  water: number;
  humidity: number;
  /** 0-100 how much effort the user is willing to put in */
  effort: number;
  /** -1 = prefers simple foliage, 0 = no preference, 1 = loves flowers */
  bloom: number;
}

export const NEUTRAL_PROFILE: CareProfile = {
  light: 50,
  water: 50,
  humidity: 50,
  effort: 50,
  bloom: 0,
};

const FLOWER_CATEGORIES = ["flower", "orchid", "annual", "bulb", "lotus", "fruit"];
const FOLIAGE_CATEGORIES = ["foliage", "fern", "palm", "cactus", "groundcover", "grass", "pine"];

/** How demanding a plant is to keep alive (0-100) */
export const plantEffort = (p: Plant) => {
  const l = p.levels ?? { light: 50, water: 50, humidity: 50, temp: 50 };
  return Math.round(0.5 * (l.water ?? 50) + 0.35 * (l.humidity ?? 50) + 0.15 * (l.light ?? 50));
};

export interface ScoredPlant {
  plant: Plant;
  score: number;
}

export const scorePlants = (profile: CareProfile, plants: Plant[]): ScoredPlant[] => {
  return plants
    .map((plant) => {
      const l = plant.levels ?? { light: 50, water: 50, humidity: 50, temp: 50 };
      const diffs = [
        { d: Math.abs((l.light ?? 50) - profile.light), w: 1.2 },
        { d: Math.abs((l.water ?? 50) - profile.water), w: 1.4 },
        { d: Math.abs((l.humidity ?? 50) - profile.humidity), w: 0.9 },
        { d: Math.abs(plantEffort(plant) - profile.effort), w: 1.3 },
      ];
      const totalW = diffs.reduce((s, x) => s + x.w, 0);
      const avgDiff = diffs.reduce((s, x) => s + x.d * x.w, 0) / totalW;
      let score = 100 - avgDiff;

      if (profile.bloom !== 0) {
        const isFlower = FLOWER_CATEGORIES.includes(plant.category);
        const isFoliage = FOLIAGE_CATEGORIES.includes(plant.category);
        if (profile.bloom > 0) score += isFlower ? 12 * profile.bloom : isFoliage ? -8 * profile.bloom : 0;
        else score += isFoliage ? 12 * -profile.bloom : isFlower ? -8 * -profile.bloom : 0;
      }

      return { plant, score: Math.max(5, Math.min(99, Math.round(score))) };
    })
    .sort((a, b) => b.score - a.score);
};

/* ---------------- Quick filter chips ---------------- */

export interface Chip {
  key: string;
  group: string;
  th: string;
  en: string;
  emoji: string;
  patch: Partial<CareProfile>;
}

export const CHIP_GROUPS: { key: string; th: string; en: string }[] = [
  { key: "water", th: "การรดน้ำ", en: "Watering" },
  { key: "light", th: "แสงในบ้าน", en: "Light at home" },
  { key: "skill", th: "ประสบการณ์", en: "Experience" },
  { key: "style", th: "สไตล์ที่ชอบ", en: "Style" },
];

export const CHIPS: Chip[] = [
  { key: "forgetful", group: "water", emoji: "😴", th: "ขี้ลืมรดน้ำ", en: "I forget to water", patch: { water: 18, humidity: 30, effort: 20 } },
  { key: "weekly", group: "water", emoji: "🗓️", th: "รดน้ำอาทิตย์ละครั้ง", en: "Water weekly", patch: { water: 45, humidity: 50, effort: 45 } },
  { key: "daily", group: "water", emoji: "🚿", th: "ชอบดูแลทุกวัน", en: "Love daily care", patch: { water: 82, humidity: 75, effort: 80 } },

  { key: "dark", group: "light", emoji: "🌙", th: "ห้องค่อนข้างมืด", en: "Low light room", patch: { light: 20 } },
  { key: "indirect", group: "light", emoji: "🪟", th: "แสงรำไร", en: "Bright indirect", patch: { light: 55 } },
  { key: "sunny", group: "light", emoji: "☀️", th: "แดดจัด/ระเบียง", en: "Full sun balcony", patch: { light: 88 } },

  { key: "beginner", group: "skill", emoji: "🌱", th: "มือใหม่หัดปลูก", en: "Beginner", patch: { effort: 22 } },
  { key: "pro", group: "skill", emoji: "🧑‍🌾", th: "มือโปร ชอบท้าทาย", en: "Experienced", patch: { effort: 80 } },

  { key: "bloom", group: "style", emoji: "🌸", th: "ชอบไม้ออกดอก", en: "Love flowers", patch: { bloom: 1 } },
  { key: "green", group: "style", emoji: "🍃", th: "ชอบใบเขียวเรียบง่าย", en: "Simple greenery", patch: { bloom: -1 } },
];

export const profileFromChips = (keys: string[]): CareProfile => {
  const chosen = CHIPS.filter((c) => keys.includes(c.key));
  const acc: Record<string, number[]> = {};
  chosen.forEach((c) =>
    Object.entries(c.patch).forEach(([k, v]) => {
      (acc[k] ||= []).push(v as number);
    })
  );
  const avg = (k: keyof CareProfile) =>
    acc[k]?.length ? acc[k].reduce((a, b) => a + b, 0) / acc[k].length : NEUTRAL_PROFILE[k];
  return {
    light: avg("light"),
    water: avg("water"),
    humidity: avg("humidity"),
    effort: avg("effort"),
    bloom: avg("bloom"),
  };
};

/* ---------------- Quiz ---------------- */

export interface QuizOption {
  key: string;
  emoji: string;
  th: string;
  en: string;
  patch: Partial<CareProfile>;
}

export interface QuizQuestion {
  key: string;
  th: string;
  en: string;
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    key: "routine",
    th: "ชีวิตประจำวันของคุณเป็นแบบไหน?",
    en: "How does your daily life look?",
    options: [
      { key: "busy", emoji: "🏃", th: "ยุ่งมาก ออกนอกบ้านบ่อย", en: "Very busy, often away", patch: { water: 18, effort: 20, humidity: 30 } },
      { key: "balanced", emoji: "🍵", th: "ปกติ มีเวลาช่วงสุดสัปดาห์", en: "Normal, free on weekends", patch: { water: 50, effort: 48, humidity: 50 } },
      { key: "homebody", emoji: "🏡", th: "อยู่บ้านเป็นหลัก มีเวลาเยอะ", en: "Home a lot, plenty of time", patch: { water: 78, effort: 78, humidity: 72 } },
    ],
  },
  {
    key: "memory",
    th: "ถ้าต้องรดน้ำต้นไม้ คุณเป็นคนแบบไหน?",
    en: "When it comes to watering, you are...",
    options: [
      { key: "forget", emoji: "😅", th: "ลืมบ่อยมาก", en: "I forget a lot", patch: { water: 15, effort: 18 } },
      { key: "remind", emoji: "⏰", th: "ต้องมีคนเตือนบ้าง", en: "Need a reminder sometimes", patch: { water: 45, effort: 45 } },
      { key: "ritual", emoji: "💚", th: "เป็นกิจวัตรที่ชอบทำ", en: "It's a ritual I enjoy", patch: { water: 85, effort: 82 } },
    ],
  },
  {
    key: "space",
    th: "พื้นที่ปลูกของคุณได้แสงแค่ไหน?",
    en: "How much light does your space get?",
    options: [
      { key: "dark", emoji: "🌑", th: "มืด/ห้องในตัวอาคาร", en: "Dark indoor corner", patch: { light: 18 } },
      { key: "soft", emoji: "🪟", th: "แสงรำไรผ่านหน้าต่าง", en: "Soft light by a window", patch: { light: 55 } },
      { key: "sun", emoji: "🌞", th: "แดดเต็มๆ ระเบียง/สวน", en: "Full sun balcony or garden", patch: { light: 88 } },
    ],
  },
  {
    key: "vibe",
    th: "คุณอยากให้ต้นไม้ช่วยอะไรกับพื้นที่?",
    en: "What should the plant bring to your space?",
    options: [
      { key: "calm", emoji: "🍃", th: "ความสงบ เขียวสบายตา", en: "Calm, restful green", patch: { bloom: -1, humidity: 60 } },
      { key: "color", emoji: "🌸", th: "สีสัน ดอกสวยๆ", en: "Color and blooms", patch: { bloom: 1, light: 70 } },
      { key: "cool", emoji: "🌵", th: "ความเท่ ดูแลง่าย", en: "Cool and low-maintenance", patch: { bloom: -0.4, water: 22, effort: 25 } },
    ],
  },
  {
    key: "patience",
    th: "เวลาต้นไม้โตช้าหรือใบเหลือง คุณ...",
    en: "When a plant grows slowly or yellows, you...",
    options: [
      { key: "chill", emoji: "😌", th: "ปล่อยไปตามธรรมชาติ", en: "Let nature take its course", patch: { effort: 25, humidity: 40 } },
      { key: "learn", emoji: "🔍", th: "หาข้อมูลแล้วลองปรับ", en: "Research and adjust", patch: { effort: 60 } },
      { key: "fuss", emoji: "🧪", th: "จัดการทันที ใส่ปุ๋ยเปลี่ยนดิน", en: "Fix it right away", patch: { effort: 85, humidity: 70 } },
    ],
  },
  {
    key: "size",
    th: "อยากได้ต้นไม้แบบไหนมากกว่า?", 
    en: "Which kind of plant appeals more?",
    options: [
      { key: "tiny", emoji: "🪴", th: "ต้นเล็กๆ วางบนโต๊ะ", en: "Small desk plant", patch: { water: 35, effort: 35 } },
      { key: "statement", emoji: "🌿", th: "ต้นใหญ่ ใบเยอะ เป็นจุดเด่น", en: "Big leafy statement", patch: { humidity: 75, water: 65, effort: 65 } },
      { key: "collection", emoji: "✨", th: "สะสมหลายต้นหลายชนิด", en: "A collection of many", patch: { effort: 70, light: 65 } },
    ],
  },
];

export const profileFromAnswers = (answers: Record<string, string>): CareProfile => {
  const acc: Record<string, number[]> = {};
  QUIZ.forEach((q) => {
    const opt = q.options.find((o) => o.key === answers[q.key]);
    if (!opt) return;
    Object.entries(opt.patch).forEach(([k, v]) => {
      (acc[k] ||= []).push(v as number);
    });
  });
  const avg = (k: keyof CareProfile) =>
    acc[k]?.length ? acc[k].reduce((a, b) => a + b, 0) / acc[k].length : NEUTRAL_PROFILE[k];
  return {
    light: avg("light"),
    water: avg("water"),
    humidity: avg("humidity"),
    effort: avg("effort"),
    bloom: avg("bloom"),
  };
};

/* ---------------- Archetypes ---------------- */

export interface Archetype {
  key: string;
  emoji: string;
  th: string;
  en: string;
  descTh: string;
  descEn: string;
}

export const ARCHETYPES: Archetype[] = [
  {
    key: "chill",
    emoji: "😎",
    th: "สายชิลล์ ปล่อยเลี้ยง",
    en: "The Easygoing Grower",
    descTh: "คุณชอบต้นไม้ที่อึด ทนลืมรดน้ำ ดูแลน้อยแต่ยังสวย เหมาะกับไม้อวบน้ำและไม้ใบทนแล้ง",
    descEn: "You want tough plants that forgive missed waterings — succulents and hardy foliage are your match.",
  },
  {
    key: "sun",
    emoji: "🌞",
    th: "สายรักแสงแดด",
    en: "The Sun Lover",
    descTh: "พื้นที่ของคุณแดดดี เหมาะกับไม้ดอกและไม้กลางแจ้งที่ต้องการแสงเต็มที่",
    descEn: "Your space is bright — flowering and outdoor-loving plants will thrive with you.",
  },
  {
    key: "nurturer",
    emoji: "💚",
    th: "สายเอาใจใส่",
    en: "The Devoted Nurturer",
    descTh: "คุณสนุกกับการดูแลทุกวัน เหมาะกับไม้ที่ต้องการความชื้นสูงและการเอาใจใส่ เช่น เฟินและไม้ใบเขตร้อน",
    descEn: "You enjoy daily rituals — humidity-loving ferns and tropical foliage suit you best.",
  },
  {
    key: "shade",
    emoji: "🌙",
    th: "สายมุมร่ม",
    en: "The Shade Dweller",
    descTh: "บ้านคุณแสงน้อย แต่ยังมีไม้ใบสวยๆ ที่อยู่ได้สบายในร่ม",
    descEn: "Low light is no problem — plenty of beautiful foliage thrives in the shade.",
  },
  {
    key: "collector",
    emoji: "✨",
    th: "สายสะสมตัวจริง",
    en: "The Collector",
    descTh: "คุณชอบความหลากหลายและพร้อมเรียนรู้ เหมาะกับการสะสมหลายชนิดหลายสายพันธุ์",
    descEn: "You love variety and learning — building a diverse collection is your thing.",
  },
];

export const archetypeFor = (p: CareProfile): Archetype => {
  if (p.effort >= 70 && p.humidity >= 60) return ARCHETYPES[2];
  if (p.effort >= 65) return ARCHETYPES[4];
  if (p.light <= 35) return ARCHETYPES[3];
  if (p.light >= 70 && p.bloom > 0) return ARCHETYPES[1];
  if (p.effort <= 35 || p.water <= 35) return ARCHETYPES[0];
  return ARCHETYPES[1];
};
