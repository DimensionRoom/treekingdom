import { Supply, LuckyDomain } from "@/data/supplies";

export const WEEKDAYS = [
  { key: 0, th: "อาทิตย์", en: "Sunday", color: "red" },
  { key: 1, th: "จันทร์", en: "Monday", color: "yellow" },
  { key: 2, th: "อังคาร", en: "Tuesday", color: "pink" },
  { key: 3, th: "พุธ", en: "Wednesday", color: "green" },
  { key: 4, th: "พฤหัสบดี", en: "Thursday", color: "orange" },
  { key: 5, th: "ศุกร์", en: "Friday", color: "blue" },
  { key: 6, th: "เสาร์", en: "Saturday", color: "purple" },
] as const;

export const ZODIACS = [
  { key: "aries", th: "ราศีเมษ", en: "Aries" },
  { key: "taurus", th: "ราศีพฤษภ", en: "Taurus" },
  { key: "gemini", th: "ราศีเมถุน", en: "Gemini" },
  { key: "cancer", th: "ราศีกรกฎ", en: "Cancer" },
  { key: "leo", th: "ราศีสิงห์", en: "Leo" },
  { key: "virgo", th: "ราศีกันย์", en: "Virgo" },
  { key: "libra", th: "ราศีตุล", en: "Libra" },
  { key: "scorpio", th: "ราศีพิจิก", en: "Scorpio" },
  { key: "sagittarius", th: "ราศีธนู", en: "Sagittarius" },
  { key: "capricorn", th: "ราศีมังกร", en: "Capricorn" },
  { key: "aquarius", th: "ราศีกุมภ์", en: "Aquarius" },
  { key: "pisces", th: "ราศีมีน", en: "Pisces" },
] as const;

export const CHINESE_ZODIACS = [
  { key: "rat", th: "ชวด", en: "Rat" },
  { key: "ox", th: "ฉลู", en: "Ox" },
  { key: "tiger", th: "ขาล", en: "Tiger" },
  { key: "rabbit", th: "เถาะ", en: "Rabbit" },
  { key: "dragon", th: "มะโรง", en: "Dragon" },
  { key: "snake", th: "มะเส็ง", en: "Snake" },
  { key: "horse", th: "มะเมีย", en: "Horse" },
  { key: "goat", th: "มะแม", en: "Goat" },
  { key: "monkey", th: "วอก", en: "Monkey" },
  { key: "rooster", th: "ระกา", en: "Rooster" },
  { key: "dog", th: "จอ", en: "Dog" },
  { key: "pig", th: "กุน", en: "Pig" },
] as const;

export const DOMAINS: { key: LuckyDomain; th: string; en: string; emoji: string }[] = [
  { key: "wealth", th: "โชคลาภ", en: "Wealth", emoji: "💰" },
  { key: "love", th: "ความรัก", en: "Love", emoji: "💖" },
  { key: "health", th: "สุขภาพ", en: "Health", emoji: "🌿" },
  { key: "career", th: "การงาน", en: "Career", emoji: "💼" },
  { key: "study", th: "การเรียน", en: "Study", emoji: "📚" },
  { key: "protection", th: "คุ้มครอง", en: "Protection", emoji: "🛡️" },
];

export interface FortuneProfile {
  birthDate: Date;
  weekday: number;
  zodiac: string;
  chineseZodiac: string;
}

export function getWeekday(date: Date): number {
  return date.getDay();
}

export function getZodiac(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const md = m * 100 + d;
  if (md >= 321 && md <= 419) return "aries";
  if (md >= 420 && md <= 520) return "taurus";
  if (md >= 521 && md <= 620) return "gemini";
  if (md >= 621 && md <= 722) return "cancer";
  if (md >= 723 && md <= 822) return "leo";
  if (md >= 823 && md <= 922) return "virgo";
  if (md >= 923 && md <= 1022) return "libra";
  if (md >= 1023 && md <= 1121) return "scorpio";
  if (md >= 1122 && md <= 1221) return "sagittarius";
  if (md >= 1222 || md <= 119) return "capricorn";
  if (md >= 120 && md <= 218) return "aquarius";
  return "pisces";
}

export function getChineseZodiac(year: number): string {
  // 2020 = rat (index 0)
  const idx = ((year - 2020) % 12 + 12) % 12;
  return CHINESE_ZODIACS[idx].key;
}

export function buildProfile(birthDate: Date): FortuneProfile {
  return {
    birthDate,
    weekday: getWeekday(birthDate),
    zodiac: getZodiac(birthDate),
    chineseZodiac: getChineseZodiac(birthDate.getFullYear()),
  };
}

// Deterministic hash → 0..1
function seedRand(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DailyFortune {
  date: string; // YYYY-MM-DD
  scores: Record<LuckyDomain, number>; // 0-100
  overall: number;
  luckyColor: { th: string; en: string; hsl: string };
  message: { th: string; en: string };
}

const COLOR_POOL = [
  { th: "เขียว", en: "Green", hsl: "150 50% 60%" },
  { th: "ทอง", en: "Gold", hsl: "42 78% 57%" },
  { th: "ชมพู", en: "Pink", hsl: "349 70% 70%" },
  { th: "ฟ้า", en: "Sky Blue", hsl: "200 70% 65%" },
  { th: "ขาว", en: "White", hsl: "0 0% 95%" },
  { th: "ม่วง", en: "Purple", hsl: "270 40% 65%" },
  { th: "ส้ม", en: "Orange", hsl: "27 86% 64%" },
];

const MSG_POSITIVE = {
  th: [
    "วันนี้พลังบวกกำลังโอบล้อมคุณ ลองเริ่มสิ่งใหม่ๆ ดู",
    "จังหวะดีมาเยือน อย่ารอช้าที่จะลงมือทำ",
    "ความตั้งใจของคุณจะเห็นผลในวันนี้",
  ],
  en: [
    "Positive energy surrounds you today — start something new.",
    "A great moment arrives — don't hesitate to act.",
    "Your effort will pay off today.",
  ],
};
const MSG_NEUTRAL = {
  th: [
    "วันธรรมดาที่เหมาะกับการพักผ่อนและจัดระเบียบ",
    "เรียนรู้และสะสมพลัง พรุ่งนี้จะดีขึ้น",
    "ใจเย็นๆ ทุกอย่างกำลังไปในทิศทางที่ดี",
  ],
  en: [
    "An ordinary day — perfect for rest and tidying up.",
    "Learn and recharge; tomorrow will be brighter.",
    "Stay calm — things are heading the right way.",
  ],
};
const MSG_CAREFUL = {
  th: [
    "ระวังการตัดสินใจเร่งรีบในวันนี้",
    "ลดการใช้จ่าย และฟังคนรอบข้างมากขึ้น",
    "พักผ่อนให้พอ ดูแลใจตัวเอง",
  ],
  en: [
    "Beware of rushed decisions today.",
    "Cut spending and listen to those around you.",
    "Rest well and take care of your heart.",
  ],
};

export type FortuneTone = "positive" | "neutral" | "careful";
/** weekday (0-6) -> tone -> messages. A bucket missing or empty falls back
 *  to the small hard-coded pool below, so an empty/unreachable DB never breaks
 *  the page — it just serves the old fixed set until the table is filled. */
export type FortuneMessagePool = Partial<
  Record<number, Partial<Record<FortuneTone, { th: string; en: string }[]>>>
>;

const FALLBACK_MESSAGES: Record<FortuneTone, { th: string; en: string }[]> = {
  positive: MSG_POSITIVE.th.map((th, i) => ({ th, en: MSG_POSITIVE.en[i] })),
  neutral: MSG_NEUTRAL.th.map((th, i) => ({ th, en: MSG_NEUTRAL.en[i] })),
  careful: MSG_CAREFUL.th.map((th, i) => ({ th, en: MSG_CAREFUL.en[i] })),
};

export function getDailyFortune(
  profile: FortuneProfile,
  date = new Date(),
  pool?: FortuneMessagePool,
): DailyFortune {
  const dateStr = date.toISOString().slice(0, 10);
  const seed = `${dateStr}|${profile.weekday}|${profile.zodiac}|${profile.chineseZodiac}`;
  const rand = seedRand(seed);
  const scores: Record<LuckyDomain, number> = {
    wealth: Math.round(40 + rand() * 60),
    love: Math.round(40 + rand() * 60),
    health: Math.round(40 + rand() * 60),
    career: Math.round(40 + rand() * 60),
    study: Math.round(40 + rand() * 60),
    protection: Math.round(40 + rand() * 60),
  };
  const overall = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / 6,
  );
  const color = COLOR_POOL[Math.floor(rand() * COLOR_POOL.length)];
  const tone: FortuneTone = overall >= 75 ? "positive" : overall >= 55 ? "neutral" : "careful";

  // Rotates through the bucket by day number instead of picking randomly —
  // random selection from even a few dozen entries collides within days
  // (birthday-paradox territory), so a regular visitor would still see
  // repeats constantly. Rotation guarantees no repeat until the whole
  // bucket has cycled. toneIndex/bucketOffset stagger the 21 buckets so
  // they don't all turn over on the same day.
  const toneIndex = tone === "positive" ? 0 : tone === "neutral" ? 1 : 2;
  const bucket = pool?.[profile.weekday]?.[tone];
  const messages = bucket && bucket.length > 0 ? bucket : FALLBACK_MESSAGES[tone];
  const dayNumber = Math.floor(date.getTime() / 86400000);
  const bucketOffset = profile.weekday * 3 + toneIndex;
  const message = messages[(dayNumber + bucketOffset) % messages.length];

  return {
    date: dateStr,
    scores,
    overall,
    luckyColor: color,
    message,
  };
}

export interface PlantMatch {
  supply: Supply;
  score: number;
}

export function matchPlants(
  supplies: Supply[],
  profile: FortuneProfile | null,
  domainFilter?: LuckyDomain,
  limit = 6,
): PlantMatch[] {
  const lucky = supplies.filter((s) => s.isLucky && s.lucky);
  const scored = lucky.map((s) => {
    let score = 1; // base
    const info = s.lucky!;
    if (domainFilter && info.luckyFor.includes(domainFilter)) score += 3;
    if (profile) {
      if (info.weekdays?.includes(profile.weekday)) score += 3;
      if (info.zodiacs?.includes(profile.zodiac)) score += 2;
      if (info.chineseZodiacs?.includes(profile.chineseZodiac)) score += 2;
    }
    return { supply: s, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
