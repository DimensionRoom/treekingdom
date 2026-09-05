export type PlantCategory =
  | "orchid"
  | "lotus"
  | "palm"
  | "fruit"
  | "vegetable"
  | "annual"
  | "pine"
  | "herb"
  | "grass"
  | "fern"
  | "cactus"
  | "groundcover"
  | "flower"
  | "tree"
  | "water"
  | "shrub"
  | "bulb"
  | "climber"
  | "foliage";

export interface PlantCare {
  light: { th: string; en: string };
  water: { th: string; en: string };
  humidity: { th: string; en: string };
  temp: { th: string; en: string };
  soil: { th: string; en: string };
  tips: { th: string; en: string };
}

export interface PlantLevels {
  light: number;
  water: number;
  humidity: number;
  temp: number;
}

export interface PlantVariety {
  id: string;
  name: { th: string; en: string };
  emoji: string;
  image?: string;
  images?: string[];
  description: { th: string; en: string };
  features: { th: string; en: string };
  bloomSeason?: { th: string; en: string };
  size?: { th: string; en: string };
  tags?: string[];
  /** A tip specific to this variety, distinct from the parent plant's care.* fields. */
  careTip?: { th: string; en: string } | null;
  origin?: { th: string; en: string } | null;
}

export interface Plant {
  id: string;
  name: { th: string; en: string };
  category: PlantCategory;
  description: { th: string; en: string };
  emoji: string;
  care: PlantCare;
  levels: PlantLevels;
  varieties?: PlantVariety[];
  /** Keys into the `tags` table; unknown keys are ignored when rendering. */
  tags?: string[];
}

export const allCategories: PlantCategory[] = [
  "orchid", "lotus", "palm", "fruit", "vegetable", "annual", "pine", "herb",
  "grass", "fern", "cactus", "groundcover", "flower", "tree", "water",
  "shrub", "bulb", "climber", "foliage",
];

export const categoryInfo: Record<PlantCategory, { emoji: string; color: string; th: string; en: string }> = {
  orchid:      { emoji: "🌺", color: "badge-flower",  th: "กล้วยไม้",           en: "Orchids" },
  lotus:       { emoji: "🪷", color: "badge-water",   th: "บัว",               en: "Lotus" },
  palm:        { emoji: "🌴", color: "badge-humid",   th: "ปาล์ม/ปรง",         en: "Palms" },
  fruit:       { emoji: "🍎", color: "badge-flower",  th: "ผลไม้",             en: "Fruit Trees" },
  vegetable:   { emoji: "🥬", color: "badge-humid",   th: "ผัก",               en: "Vegetables" },
  annual:      { emoji: "🌼", color: "badge-flower",  th: "พืชล้มลุก",          en: "Annuals" },
  pine:        { emoji: "🌲", color: "badge-humid",   th: "สน",               en: "Conifers" },
  herb:        { emoji: "🌿", color: "badge-humid",   th: "สมุนไพร",           en: "Herbs" },
  grass:       { emoji: "🌾", color: "badge-humid",   th: "หญ้า",             en: "Grasses" },
  fern:        { emoji: "☘️", color: "badge-humid",   th: "เฟิน",             en: "Ferns" },
  cactus:      { emoji: "🌵", color: "badge-cactus",  th: "แคคตัส/ไม้อวบน้ำ",   en: "Cactus & Succulents" },
  groundcover: { emoji: "🍀", color: "badge-humid",   th: "ไม้คลุมดิน",         en: "Ground Cover" },
  flower:      { emoji: "🌸", color: "badge-flower",  th: "ไม้ดอก",            en: "Flowering Plants" },
  tree:        { emoji: "🌳", color: "badge-humid",   th: "ไม้ต้น",            en: "Trees" },
  water:       { emoji: "💧", color: "badge-water",   th: "ไม้น้ำ",            en: "Aquatic Plants" },
  shrub:       { emoji: "🌲", color: "badge-humid",   th: "ไม้พุ่ม",            en: "Shrubs" },
  bulb:        { emoji: "🌷", color: "badge-flower",  th: "ไม้หัว",            en: "Bulbs" },
  climber:     { emoji: "🧗", color: "badge-humid",   th: "ไม้เลื้อย",          en: "Climbers" },
  foliage:     { emoji: "🍃", color: "badge-humid",   th: "ไม้ใบ",             en: "Foliage Plants" },
};

export const plants: Plant[] = [
  {
    id: "lotus",
    name: { th: "บัวหลวง", en: "Lotus" },
    category: "lotus",
    emoji: "🪷",
    description: {
      th: "บัวหลวงเป็นพืชน้ำที่มีดอกสวยงาม นิยมปลูกในบ่อหรือภาชนะน้ำ",
      en: "Lotus is a beautiful aquatic plant commonly grown in ponds or water containers.",
    },
    care: {
      light: { th: "แสงแดดเต็มที่ 6-8 ชม./วัน", en: "Full sun 6-8 hrs/day" },
      water: { th: "แช่น้ำตลอดเวลา ระดับน้ำ 15-30 ซม.", en: "Submerged at all times, water level 15-30cm" },
      humidity: { th: "สูง", en: "High" },
      temp: { th: "25-35°C", en: "25-35°C" },
      soil: { th: "ดินเหนียวผสมปุ๋ยคอก", en: "Clay mixed with manure" },
      tips: { th: "เปลี่ยนน้ำทุก 1-2 สัปดาห์ ตัดใบเหลืองออก", en: "Change water every 1-2 weeks, remove yellowed leaves" },
    },
    levels: { light: 90, water: 100, humidity: 85, temp: 83 },
  },
  {
    id: "water-lily",
    name: { th: "บัวสาย", en: "Water Lily" },
    category: "lotus",
    emoji: "🌸",
    description: {
      th: "บัวสายมีดอกลอยน้ำ สีสันสดใส เหมาะปลูกประดับบ่อน้ำ",
      en: "Water lilies float on water surface with vibrant colors, perfect for decorative ponds.",
    },
    care: {
      light: { th: "แสงแดดเต็มที่", en: "Full sun" },
      water: { th: "แช่น้ำลึก 30-60 ซม.", en: "Submerged 30-60cm deep" },
      humidity: { th: "สูง", en: "High" },
      temp: { th: "22-32°C", en: "22-32°C" },
      soil: { th: "ดินเหนียว", en: "Clay soil" },
      tips: { th: "ใส่ปุ๋ยเม็ดทุก 2 เดือน", en: "Fertilize with tablets every 2 months" },
    },
    levels: { light: 85, water: 100, humidity: 85, temp: 58 },
  },
  {
    id: "water-hyacinth",
    name: { th: "ผักตบชวา", en: "Water Hyacinth" },
    category: "water",
    emoji: "💜",
    description: {
      th: "ผักตบชวาเป็นพืชน้ำลอย มีดอกสีม่วงสวยงาม เติบโตเร็ว",
      en: "Water hyacinth is a floating plant with purple flowers, grows quickly.",
    },
    care: {
      light: { th: "แสงแดดจัด", en: "Full sun" },
      water: { th: "ลอยน้ำ", en: "Floating on water" },
      humidity: { th: "สูง", en: "High" },
      temp: { th: "20-30°C", en: "20-30°C" },
      soil: { th: "ไม่ต้องการดิน", en: "No soil needed" },
      tips: { th: "ควบคุมไม่ให้แพร่กระจายมากเกินไป", en: "Control spreading to prevent overgrowth" },
    },
    levels: { light: 90, water: 100, humidity: 90, temp: 42 },
  },
  {
    id: "monstera",
    name: { th: "มอนสเตอร่า", en: "Monstera" },
    category: "foliage",
    emoji: "🌿",
    description: {
      th: "มอนสเตอร่ามีใบใหญ่เป็นรูหรือหยัก เป็นไม้ประดับยอดนิยม",
      en: "Monstera has large fenestrated leaves, one of the most popular houseplants.",
    },
    care: {
      light: { th: "แสงรำไร ไม่โดนแดดจัด", en: "Indirect bright light" },
      water: { th: "รดน้ำเมื่อดินแห้ง สัปดาห์ละ 1-2 ครั้ง", en: "Water when soil is dry, 1-2 times/week" },
      humidity: { th: "60-80%", en: "60-80%" },
      temp: { th: "20-30°C", en: "20-30°C" },
      soil: { th: "ดินร่วนระบายน้ำดี", en: "Well-draining potting mix" },
      tips: { th: "เช็ดใบทุกสัปดาห์ ใช้เสาปีนเพื่อให้ใบใหญ่ขึ้น", en: "Wipe leaves weekly, use a moss pole for larger leaves" },
    },
    levels: { light: 50, water: 60, humidity: 70, temp: 42 },
  },
  {
    id: "pothos",
    name: { th: "พลูด่าง", en: "Pothos" },
    category: "climber",
    emoji: "🍃",
    description: {
      th: "พลูด่างเป็นไม้เลื้อยที่เลี้ยงง่าย ใบมีลายด่างสวยงาม",
      en: "Pothos is an easy-care trailing vine with beautiful variegated leaves.",
    },
    care: {
      light: { th: "แสงรำไรถึงร่มรำไร", en: "Low to bright indirect light" },
      water: { th: "รดน้ำเมื่อดินแห้ง", en: "Water when soil dries out" },
      humidity: { th: "40-60%", en: "40-60%" },
      temp: { th: "18-30°C", en: "18-30°C" },
      soil: { th: "ดินทั่วไป", en: "General potting soil" },
      tips: { th: "ตัดแต่งกิ่งเพื่อให้แตกพุ่ม", en: "Prune to encourage bushier growth" },
    },
    levels: { light: 40, water: 50, humidity: 50, temp: 33 },
  },
  {
    id: "fern",
    name: { th: "เฟิร์น", en: "Fern" },
    category: "fern",
    emoji: "🌱",
    description: {
      th: "เฟิร์นเป็นพืชที่ชอบความชื้นสูง ใบเรียวยาวเป็นพุ่มสวยงาม",
      en: "Ferns love high humidity with elegant arching fronds.",
    },
    care: {
      light: { th: "ร่มรำไร", en: "Indirect light, partial shade" },
      water: { th: "รดน้ำบ่อย รักษาความชื้นดิน", en: "Water frequently, keep soil moist" },
      humidity: { th: "70-90%", en: "70-90%" },
      temp: { th: "18-24°C", en: "18-24°C" },
      soil: { th: "ดินผสมพีทมอส", en: "Peat moss mix" },
      tips: { th: "ฉีดพ่นน้ำทุกวัน", en: "Mist daily for best results" },
    },
    levels: { light: 30, water: 75, humidity: 80, temp: 8 },
    varieties: [
      {
        id: "fern-boston",
        name: { th: "เฟิร์นบอสตัน", en: "Boston Fern" },
        emoji: "🌿",
        description: {
          th: "เฟิร์นบอสตันเป็นเฟิร์นยอดนิยมที่สุด ใบยาวห้อยลงสวยงาม นิยมปลูกในกระถางแขวน ช่วยฟอกอากาศได้ดี",
          en: "Boston fern is the most popular fern with elegant cascading fronds, perfect for hanging baskets and great at purifying air.",
        },
        features: {
          th: "ใบยาวห้อยลง ฟอกอากาศ ปลูกง่าย",
          en: "Cascading fronds, air purifying, easy to grow",
        },
        size: { th: "กว้าง 60-90 ซม.", en: "60-90 cm wide" },
      },
      {
        id: "fern-maidenhair",
        name: { th: "เฟิร์นก้านดำ", en: "Maidenhair Fern" },
        emoji: "🍀",
        description: {
          th: "เฟิร์นก้านดำมีใบเล็กบางรูปพัดบนก้านสีดำเงา ดูบอบบางแต่สวยงามมาก ต้องการความชื้นสูงและการดูแลใส่ใจ",
          en: "Maidenhair fern has delicate fan-shaped leaflets on glossy black stems, fragile but incredibly beautiful, needs high humidity and attentive care.",
        },
        features: {
          th: "ใบเล็กรูปพัด ก้านดำเงา ดูหรูหรา",
          en: "Fan-shaped leaflets, glossy black stems, elegant look",
        },
        size: { th: "สูง 30-50 ซม.", en: "30-50 cm tall" },
      },
      {
        id: "fern-staghorn",
        name: { th: "เฟิร์นเขากวาง", en: "Staghorn Fern" },
        emoji: "🦌",
        description: {
          th: "เฟิร์นเขากวางมีใบรูปร่างคล้ายเขากวาง เป็นพืชอิงอาศัยที่นิยมติดบนแผ่นไม้ มีเอกลักษณ์โดดเด่นไม่เหมือนเฟิร์นทั่วไป",
          en: "Staghorn fern has antler-shaped fronds, an epiphytic plant often mounted on wooden boards, uniquely distinctive among ferns.",
        },
        features: {
          th: "ใบรูปเขากวาง ติดแผ่นไม้ได้ พืชอิงอาศัย",
          en: "Antler-shaped fronds, wall-mountable, epiphytic",
        },
        size: { th: "กว้าง 40-90 ซม.", en: "40-90 cm wide" },
      },
      {
        id: "fern-birdsnest",
        name: { th: "เฟิร์นข้าหลวง", en: "Bird's Nest Fern" },
        emoji: "🪹",
        description: {
          th: "เฟิร์นข้าหลวงมีใบกว้างเป็นมันเรียงเป็นรูปดอกกุหลาบ ขอบใบเป็นคลื่น ทนทานและดูแลง่ายกว่าเฟิร์นชนิดอื่น",
          en: "Bird's nest fern has broad glossy fronds arranged in a rosette, with wavy edges, more hardy and easier to care for than other ferns.",
        },
        features: {
          th: "ใบกว้างเป็นมัน ขอบเป็นคลื่น ทนทาน",
          en: "Broad glossy fronds, wavy edges, hardy",
        },
        size: { th: "กว้าง 60-120 ซม.", en: "60-120 cm wide" },
      },
      {
        id: "fern-japanese",
        name: { th: "เฟิร์นญี่ปุ่น", en: "Japanese Painted Fern" },
        emoji: "💜",
        description: {
          th: "เฟิร์นญี่ปุ่นโดดเด่นด้วยใบสีเงินอมม่วง มีลวดลายเมทัลลิกสวยงาม เป็นเฟิร์นประดับที่มีสีสันมากที่สุดชนิดหนึ่ง",
          en: "Japanese painted fern stands out with silver-purple fronds and beautiful metallic patterns, one of the most colorful ornamental ferns.",
        },
        features: {
          th: "ใบสีเงินอมม่วง ลวดลายเมทัลลิก หายาก",
          en: "Silver-purple fronds, metallic patterns, rare",
        },
        size: { th: "สูง 30-45 ซม.", en: "30-45 cm tall" },
      },
      {
        id: "fern-rabbitsfoot",
        name: { th: "เฟิร์นตีนกระต่าย", en: "Rabbit's Foot Fern" },
        emoji: "🐰",
        description: {
          th: "เฟิร์นตีนกระต่ายมีรากเหง้าปุยนุ่มสีน้ำตาลคล้ายเท้ากระต่ายห้อยจากกระถาง ใบละเอียดสวยงาม เหมาะปลูกในกระถางแขวน",
          en: "Rabbit's foot fern has fuzzy brown rhizomes resembling rabbit's feet hanging over the pot, with fine-textured fronds, ideal for hanging baskets.",
        },
        features: {
          th: "รากเหง้าปุยนุ่ม ใบละเอียด เอกลักษณ์เฉพาะ",
          en: "Fuzzy rhizomes, fine-textured fronds, unique character",
        },
        size: { th: "กว้าง 40-60 ซม.", en: "40-60 cm wide" },
      },
    ],
  },
  {
    id: "rose",
    name: { th: "กุหลาบ", en: "Rose" },
    category: "flower",
    emoji: "🌹",
    description: {
      th: "กุหลาบเป็นราชินีแห่งดอกไม้ มีหลายสีและหลายพันธุ์",
      en: "Roses are the queen of flowers, available in many colors and varieties.",
    },
    care: {
      light: { th: "แสงแดดเต็มที่ 6 ชม.ขึ้นไป", en: "Full sun 6+ hours" },
      water: { th: "รดน้ำที่โคนต้น สัปดาห์ละ 2-3 ครั้ง", en: "Water at base 2-3 times/week" },
      humidity: { th: "ปานกลาง", en: "Moderate" },
      temp: { th: "15-28°C", en: "15-28°C" },
      soil: { th: "ดินร่วนผสมปุ๋ยหมัก", en: "Loamy soil with compost" },
      tips: { th: "ตัดแต่งกิ่งหลังดอกโรย ฉีดยากันแมลง", en: "Prune after blooming, apply insecticide" },
    },
    levels: { light: 80, water: 65, humidity: 50, temp: 13 },
  },
  {
    id: "orchid",
    name: { th: "กล้วยไม้", en: "Orchid" },
    category: "orchid",
    emoji: "🌺",
    description: {
      th: "กล้วยไม้เป็นดอกไม้สง่างาม มีหลากหลายสายพันธุ์",
      en: "Orchids are elegant flowers with thousands of species worldwide.",
    },
    care: {
      light: { th: "แสงรำไร", en: "Bright indirect light" },
      water: { th: "รดน้ำสัปดาห์ละ 1 ครั้ง แช่น้ำ 15 นาที", en: "Water weekly, soak for 15 min" },
      humidity: { th: "50-70%", en: "50-70%" },
      temp: { th: "18-28°C", en: "18-28°C" },
      soil: { th: "ถ่าน กาบมะพร้าว", en: "Charcoal, coconut husk" },
      tips: { th: "อย่าให้รากแช่น้ำนาน ใส่ปุ๋ยเจือจาง", en: "Don't let roots sit in water, use diluted fertilizer" },
    },
    levels: { light: 55, water: 40, humidity: 60, temp: 25 },
  },
  {
    id: "jasmine",
    name: { th: "มะลิ", en: "Jasmine" },
    category: "flower",
    emoji: "🤍",
    description: {
      th: "มะลิมีดอกสีขาวหอม นิยมปลูกในสวนและทำพวงมาลัย",
      en: "Jasmine has fragrant white flowers, popular for gardens and garlands.",
    },
    care: {
      light: { th: "แสงแดดจัด", en: "Full sun" },
      water: { th: "รดน้ำสม่ำเสมอ", en: "Water regularly" },
      humidity: { th: "ปานกลาง", en: "Moderate" },
      temp: { th: "20-32°C", en: "20-32°C" },
      soil: { th: "ดินร่วนระบายน้ำดี", en: "Well-draining loamy soil" },
      tips: { th: "ตัดแต่งหลังดอกบาน เพื่อให้ออกดอกซ้ำ", en: "Prune after blooming to encourage re-flowering" },
    },
    levels: { light: 85, water: 55, humidity: 50, temp: 50 },
    varieties: [
      {
        id: "jasmine-double",
        name: { th: "มะลิซ้อน", en: "Arabian Jasmine (Double)" },
        emoji: "🤍",
        description: {
          th: "มะลิซ้อนมีกลีบดอกซ้อนหลายชั้น กลิ่นหอมแรง นิยมใช้ทำพวงมาลัยและร้อยมาลัย เป็นมะลิที่ได้รับความนิยมมากที่สุดในไทย",
          en: "Double Arabian Jasmine has multi-layered petals with a strong fragrance. Most popular jasmine variety in Thailand, commonly used for garlands.",
        },
        features: { th: "กลีบดอกซ้อน 2-3 ชั้น กลิ่นหอมแรง ออกดอกตลอดปี", en: "2-3 layered petals, strong fragrance, blooms year-round" },
        bloomSeason: { th: "ตลอดปี (มากในฤดูร้อน)", en: "Year-round (peak in summer)" },
        size: { th: "สูง 1-2 เมตร", en: "Height 1-2 meters" },
      },
      {
        id: "jasmine-la",
        name: { th: "มะลิลา", en: "Jasmine La" },
        emoji: "⚪",
        description: {
          th: "มะลิลามีกลีบดอกชั้นเดียว ดอกเล็กกว่ามะลิซ้อน กลิ่นหอมอ่อน นิยมใช้ลอยน้ำบูชาพระ",
          en: "Jasmine La has single-layer petals, smaller flowers than double jasmine with a mild fragrance. Often floated in water for worship.",
        },
        features: { th: "กลีบเดี่ยว ดอกเล็ก กลิ่นอ่อนหวาน", en: "Single petals, small flowers, sweet mild fragrance" },
        bloomSeason: { th: "ตลอดปี", en: "Year-round" },
        size: { th: "สูง 0.5-1.5 เมตร", en: "Height 0.5-1.5 meters" },
      },
      {
        id: "jasmine-luang",
        name: { th: "มะลิหลวง", en: "Grand Jasmine" },
        emoji: "👑",
        description: {
          th: "มะลิหลวงมีดอกขนาดใหญ่กว่ามะลิทั่วไป กลีบหนา กลิ่นหอมจัด เป็นมะลิพันธุ์หายากและมีคุณค่า",
          en: "Grand Jasmine has larger flowers with thick petals and intense fragrance. A rare and valuable jasmine variety.",
        },
        features: { th: "ดอกใหญ่ กลีบหนา กลิ่นหอมจัด พันธุ์หายาก", en: "Large flowers, thick petals, intense fragrance, rare variety" },
        bloomSeason: { th: "ฤดูร้อน-ฤดูฝน", en: "Summer to rainy season" },
        size: { th: "สูง 1-3 เมตร", en: "Height 1-3 meters" },
      },
      {
        id: "jasmine-wan",
        name: { th: "มะลิวัลย์", en: "Star Jasmine" },
        emoji: "⭐",
        description: {
          th: "มะลิวัลย์เป็นไม้เลื้อย ดอกรูปดาว กลิ่นหอมอ่อน นิยมปลูกเลื้อยตามรั้วหรือซุ้ม",
          en: "Star Jasmine is a climbing vine with star-shaped flowers and mild fragrance, often grown on fences or arches.",
        },
        features: { th: "ไม้เลื้อย ดอกรูปดาว กลิ่นอ่อน", en: "Climbing vine, star-shaped flowers, mild fragrance" },
        bloomSeason: { th: "ฤดูร้อน", en: "Summer" },
        size: { th: "เลื้อยยาว 3-5 เมตร", en: "Climbs 3-5 meters" },
      },
      {
        id: "jasmine-puang",
        name: { th: "มะลิพวง", en: "Cluster Jasmine" },
        emoji: "💮",
        description: {
          th: "มะลิพวงออกดอกเป็นช่อพวง ดอกเล็กจำนวนมาก กลิ่นหอมหวาน เหมาะปลูกประดับสวน",
          en: "Cluster Jasmine blooms in clusters of many small flowers with sweet fragrance, great for garden decoration.",
        },
        features: { th: "ดอกเป็นช่อพวง จำนวนมาก กลิ่นหวาน", en: "Clustered blooms, many flowers, sweet fragrance" },
        bloomSeason: { th: "ฤดูร้อน-ฤดูฝน", en: "Summer to rainy season" },
        size: { th: "สูง 1-2 เมตร", en: "Height 1-2 meters" },
      },
      {
        id: "jasmine-chat",
        name: { th: "มะลิฉัตร", en: "Tiered Jasmine" },
        emoji: "🏯",
        description: {
          th: "มะลิฉัตรมีกลีบดอกซ้อนเป็นชั้นๆ คล้ายฉัตร สวยงามมาก นิยมปลูกเป็นไม้มงคล",
          en: "Tiered Jasmine has layered petals resembling a tiered umbrella, very ornamental and considered auspicious.",
        },
        features: { th: "กลีบซ้อนเป็นชั้น คล้ายฉัตร สวยงาม ไม้มงคล", en: "Tiered layered petals, ornamental, auspicious plant" },
        bloomSeason: { th: "ฤดูร้อน", en: "Summer" },
        size: { th: "สูง 0.5-1.5 เมตร", en: "Height 0.5-1.5 meters" },
      },
      {
        id: "jasmine-putchad",
        name: { th: "พุทธชาด", en: "Crape Jasmine" },
        emoji: "🌼",
        description: {
          th: "พุทธชาดมีดอกสีขาวกลีบหมุนเป็นกังหัน กลิ่นหอมเย็น นิยมปลูกประดับและใช้ในพิธีทางศาสนา",
          en: "Crape Jasmine has white pinwheel-shaped flowers with a cool fragrance, popular for decoration and religious ceremonies.",
        },
        features: { th: "กลีบหมุนเป็นกังหัน กลิ่นหอมเย็น ไม้มงคล", en: "Pinwheel petals, cool fragrance, sacred plant" },
        bloomSeason: { th: "ตลอดปี", en: "Year-round" },
        size: { th: "สูง 1-3 เมตร", en: "Height 1-3 meters" },
      },
    ],
  },
  {
    id: "echeveria",
    name: { th: "เอเชเวอเรีย", en: "Echeveria" },
    category: "cactus",
    emoji: "🪴",
    description: {
      th: "เอเชเวอเรียเป็นไม้อวบน้ำรูปกุหลาบ มีหลายสีสัน",
      en: "Echeveria is a rosette-shaped succulent with colorful varieties.",
    },
    care: {
      light: { th: "แสงแดดจัด 4-6 ชม.", en: "Bright sun 4-6 hours" },
      water: { th: "รดน้ำทุก 1-2 สัปดาห์ เมื่อดินแห้งสนิท", en: "Water every 1-2 weeks when soil is completely dry" },
      humidity: { th: "ต่ำ", en: "Low" },
      temp: { th: "15-30°C", en: "15-30°C" },
      soil: { th: "ดินผสมทรายหยาบ ระบายน้ำดี", en: "Sandy well-draining mix" },
      tips: { th: "อย่าให้น้ำขังที่ใบ ปลูกในกระถางมีรูระบาย", en: "Avoid water on leaves, use pots with drainage holes" },
    },
    levels: { light: 75, water: 25, humidity: 20, temp: 21 },
  },
  {
    id: "barrel-cactus",
    name: { th: "แคคตัสถังทอง", en: "Golden Barrel Cactus" },
    category: "cactus",
    emoji: "🌵",
    description: {
      th: "แคคตัสถังทองมีรูปทรงกลม สีเขียวทอง มีหนามสวยงาม",
      en: "Golden barrel cactus has a round shape with golden spines.",
    },
    care: {
      light: { th: "แสงแดดเต็มที่", en: "Full sun" },
      water: { th: "รดน้ำเดือนละ 1-2 ครั้ง", en: "Water 1-2 times/month" },
      humidity: { th: "ต่ำ", en: "Low" },
      temp: { th: "10-35°C", en: "10-35°C" },
      soil: { th: "ดินแคคตัสผสมทราย", en: "Cactus mix with sand" },
      tips: { th: "ระวังน้ำขัง อาจทำให้เน่าได้", en: "Avoid overwatering, can cause root rot" },
    },
    levels: { light: 95, water: 15, humidity: 15, temp: 21 },
  },
  {
    id: "aloe-vera",
    name: { th: "ว่านหางจระเข้", en: "Aloe Vera" },
    category: "cactus",
    emoji: "💚",
    description: {
      th: "ว่านหางจระเข้เป็นไม้อวบน้ำที่มีสรรพคุณทางยา",
      en: "Aloe vera is a medicinal succulent with many health benefits.",
    },
    care: {
      light: { th: "แสงแดดปานกลาง", en: "Moderate sunlight" },
      water: { th: "รดน้ำทุก 2-3 สัปดาห์", en: "Water every 2-3 weeks" },
      humidity: { th: "ต่ำ-ปานกลาง", en: "Low to moderate" },
      temp: { th: "15-35°C", en: "15-35°C" },
      soil: { th: "ดินทรายระบายน้ำดี", en: "Sandy well-draining soil" },
      tips: { th: "ตัดใบล่างไปใช้ได้ ขยายพันธุ์ด้วยหน่อ", en: "Cut lower leaves for use, propagate via offsets" },
    },
    levels: { light: 60, water: 20, humidity: 35, temp: 42 },
  },
];
