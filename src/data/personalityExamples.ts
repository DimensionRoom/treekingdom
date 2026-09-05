import chill from "@/assets/personality/chill.jpg.asset.json";
import sun from "@/assets/personality/sun.jpg.asset.json";
import nurturer from "@/assets/personality/nurturer.jpg.asset.json";
import shade from "@/assets/personality/shade.jpg.asset.json";
import collector from "@/assets/personality/collector.jpg.asset.json";
import type { PersonalityExample } from "@/hooks/usePersonalityExamples";

/** Built-in showcase used until the admin adds rows in `personality_examples`. */
export const defaultPersonalityExamples: PersonalityExample[] = [
  {
    id: "chill-shelf",
    archetype: "chill",
    emoji: "😎",
    title: { th: "ชั้นไม้อวบน้ำริมหน้าต่าง", en: "Succulent shelf by the window" },
    description: {
      th: "จัดไม้อวบน้ำและแคคตัสในกระถางเซรามิกบนชั้นไม้ ใกล้หน้าต่างที่มีแสงสว่าง ดูแลน้อยแต่สวยตลอดปี",
      en: "Succulents and cacti in ceramic pots on a wooden shelf near a bright window — low effort, always tidy.",
    },
    tips: {
      th: "รดน้ำเมื่อดินแห้งสนิท ประมาณ 10–14 วันครั้ง ใช้ดินระบายน้ำดี",
      en: "Water only when the soil is bone dry (every 10–14 days) and use fast-draining mix.",
    },
    images: [chill.url],
    plantId: null,
    sortOrder: 0,
  },
  {
    id: "sun-balcony",
    archetype: "sun",
    emoji: "🌞",
    title: { th: "ระเบียงไม้ดอกรับแดดเต็ม", en: "Full-sun flowering balcony" },
    description: {
      th: "กระถางดินเผาไม้ดอกเรียงริมราวระเบียง รับแดดเช้าถึงบ่าย ให้สีสันสดใสทุกวัน",
      en: "Terracotta pots of flowering plants along the railing, soaking up morning-to-afternoon sun.",
    },
    tips: {
      th: "รดน้ำเช้า–เย็นในหน้าร้อน และให้ปุ๋ยสูตรเร่งดอกทุก 2 สัปดาห์",
      en: "Water morning and evening in hot months and feed a bloom fertilizer every two weeks.",
    },
    images: [sun.url],
    plantId: null,
    sortOrder: 0,
  },
  {
    id: "nurturer-corner",
    archetype: "nurturer",
    emoji: "💚",
    title: { th: "มุมเขตร้อนชื้นในบ้าน", en: "Humid tropical corner" },
    description: {
      th: "เฟินและมอนสเตอร่าจัดรวมกันพร้อมเครื่องพ่นไอน้ำ เหมาะกับคนที่สนุกกับการดูแลทุกวัน",
      en: "Ferns and monstera grouped with a humidifier — perfect for daily-care lovers.",
    },
    tips: {
      th: "รักษาความชื้น 60–70% เช็ดใบสัปดาห์ละครั้ง และหมุนกระถางให้โตสม่ำเสมอ",
      en: "Keep humidity at 60–70%, wipe leaves weekly, and rotate pots for even growth.",
    },
    images: [nurturer.url],
    plantId: null,
    sortOrder: 0,
  },
  {
    id: "shade-corner",
    archetype: "shade",
    emoji: "🌙",
    title: { th: "มุมร่มแสงน้อยก็เขียวได้", en: "Green in a low-light corner" },
    description: {
      th: "พลูด่างและลิ้นมังกรในกระถางพาสเทล วางในมุมที่แสงส่องไม่ถึงมาก ยังโตดี",
      en: "Pothos and snake plants in pastel pots thriving in a dim corner of the room.",
    },
    tips: {
      th: "ลดการรดน้ำลงครึ่งหนึ่งเมื่อแสงน้อย และย้ายออกรับแสงรำไรเดือนละครั้ง",
      en: "Halve watering in low light and give them indirect light once a month.",
    },
    images: [shade.url],
    plantId: null,
    sortOrder: 0,
  },
  {
    id: "collector-wall",
    archetype: "collector",
    emoji: "✨",
    title: { th: "ชั้นสะสมหลากสายพันธุ์", en: "Multi-species collector shelf" },
    description: {
      th: "ชั้นวางหลายชั้นพร้อมป้ายชื่อพันธุ์ จัดกลุ่มตามความต้องการน้ำและแสงให้ดูแลง่าย",
      en: "Tiered shelves with name tags, grouped by water and light needs for easy care.",
    },
    tips: {
      th: "จัดกลุ่มต้นที่ต้องการน้ำใกล้เคียงกันไว้ด้วยกัน และจดวันรดน้ำไว้ที่ป้าย",
      en: "Group plants with similar water needs together and note watering dates on the tags.",
    },
    images: [collector.url],
    plantId: null,
    sortOrder: 0,
  },
];
