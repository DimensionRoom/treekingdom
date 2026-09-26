-- ============================================================
-- Add the plant พรมญี่ปุ่น (Episcia), and its variety 'Pink Smoke'
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- "พรมญี่ปุ่น" is the name the Thai plant market uses. The genus is not
-- Japanese — it comes from the tropical Americas — and the description says
-- so rather than let the name imply an origin.
--
-- 'Pink Smoke' is a hybrid cultivar. Seller descriptions of its leaf colour
-- vary widely (some say mahogany); the wording below follows Logee's, a
-- specialist gesneriad grower. The Gesneriad Society's reference page lists
-- no hybridizer, year or parentage, so none are claimed here.
--
-- Deliberately left out rather than guessed: images, tags, origin, and an
-- upper temperature limit (no source gives one).
--
-- Sources:
--   en.wikipedia.org/wiki/Episcia
--   plants.ces.ncsu.edu/plants/episcia-cupreata   (NC State Extension)
--   logees.com/products/flame-violet-pink-smoke-2
--   gesneriads.info/genera/episcia-pink-smoke/
--
-- Safe to run more than once.
-- ============================================================

-- ---------- The plant ----------
insert into public.plants (id, category, emoji, name, description, care, levels, sort_order)
values (
  'episcia',
  'foliage',
  '🌿',
  jsonb_build_object('th', 'พรมญี่ปุ่น', 'en', 'Episcia (Flame Violet)'),
  jsonb_build_object(
    'th', 'พรมญี่ปุ่นเป็นชื่อที่ตลาดต้นไม้ไทยใช้เรียกพืชสกุลเอพิสเซีย (Episcia) ซึ่งอยู่ในวงศ์เดียวกับแอฟริกันไวโอเล็ต (Gesneriaceae) แม้ชื่อไทยจะมีคำว่าญี่ปุ่น แต่ถิ่นกำเนิดจริงอยู่ในเขตร้อนของอเมริกากลางและอเมริกาใต้ สกุลนี้มีทั้งหมด 10 ชนิด ชื่อสกุลมาจากภาษากรีกแปลว่า "ร่มเงา" ตามถิ่นที่อยู่ใต้ร่มไม้ในป่า นิยมปลูกเพื่อชมใบเป็นหลัก เพราะใบมักมีลวดลายหรือสีสันสวยงาม ดอกส่วนใหญ่เป็นสีแดง บางชนิดเป็นสีส้ม ชมพู ฟ้า หรือเหลือง ต้นแตกไหลออกรอบกอและมีต้นเล็กเกิดขึ้นตามไหล จึงแผ่คลุมผิวกระถางได้เร็ว',
    'en', 'Episcia, sold in Thailand as "phrom yi-pun" (literally "Japanese carpet"), is a genus in the African violet family (Gesneriaceae). Despite the Thai name it is not Japanese: its ten species come from the tropics of Central and South America. The name is Greek for "shaded", after the forest understorey it grows in. It is grown mainly for its leaves, which are often patterned or richly coloured, while the flowers are usually red and occasionally orange, pink, blue or yellow. It spreads by runners that set small plantlets along their length, so it quickly covers the surface of a pot.'
  ),
  jsonb_build_object(
    'light',    jsonb_build_object('th', 'แสงสว่างแบบรำไร ห้ามโดนแดดตรง', 'en', 'Bright indirect light, no direct sun'),
    'water',    jsonb_build_object('th', 'รักษาดินให้ชื้นแต่ไม่แฉะ', 'en', 'Keep the soil moist, never soggy'),
    'soil',     jsonb_build_object('th', 'ดินร่วนอุดมอินทรียวัตถุ ระบายน้ำดี', 'en', 'Well-draining, rich in organic matter'),
    'humidity', jsonb_build_object('th', 'สูง อากาศแห้งจะทำให้ขอบใบเป็นสีน้ำตาล', 'en', 'High; dry air browns the leaf edges'),
    -- Only a minimum is sourced. The temperature bar plots the digits it finds,
    -- so a single figure shows as one marker rather than a range.
    'temp',     jsonb_build_object('th', 'สูงกว่า 18°C', 'en', 'Above 18°C'),
    'tips',     jsonb_build_object(
                  'th', 'ไม่ทนหนาวและไม่ชอบน้ำมากเกินไป เพราะต้นจะเน่าและแห้งตาย ขยายพันธุ์ได้ด้วยการปักชำใบหรือกิ่ง หรือแยกต้นเล็กที่เกิดตามไหลไปปลูก',
                  'en', 'It dislikes cold and too much water, both of which cause rot and dieback. Propagate from leaf or stem cuttings, or by potting up the plantlets that form along its runners.'
                )
  ),
  jsonb_build_object('light', 45, 'water', 60, 'humidity', 80, 'temp', 42),
  0
)
on conflict (id) do update set
  category    = excluded.category,
  emoji       = excluded.emoji,
  name        = excluded.name,
  description = excluded.description,
  care        = excluded.care,
  levels      = excluded.levels;
  -- images, tags and is_published are left alone on re-run.

-- ---------- The variety ----------
insert into public.plant_varieties
  (id, plant_id, emoji, name, description, features, size, bloom_season, care_tip, images, sort_order)
values (
  'episcia-pink-smoke',
  'episcia',
  '',
  jsonb_build_object('th', 'พิงก์สโมก', 'en', 'Episcia ''Pink Smoke'''),
  jsonb_build_object(
    'th', 'พรมญี่ปุ่นพันธุ์ลูกผสมที่ใบนุ่มเหมือนกำมะหยี่ เนื้อใบเป็นสีเขียวหม่นอมเทาคล้ายสีควัน และขอบใบเป็นสีชมพูสด ดอกเป็นสีชมพูเข้มและออกได้เกือบตลอดปี ต้นแตกไหลจำนวนมาก และมีต้นเล็กเกิดขึ้นตามไหลเป็นระยะ ขนาดต้นเล็กกะทัดรัด เหมาะกับการปลูกในกระถางขนาดเล็กหรือในตู้ที่ควบคุมความชื้นได้',
    'en', 'A hybrid flame violet with velvety leaves in a smoky grey-green, edged in bright pink. The flowers are hot pink and come almost all year. It throws out plenty of runners, each setting small plantlets at intervals, and stays compact enough for a small pot or a terrarium where the humidity can be kept steady.'
  ),
  jsonb_build_object(
    'th', 'ใบนุ่มแบบกำมะหยี่, เนื้อใบเขียวหม่นอมเทา, ขอบใบสีชมพูสด, ดอกชมพูเข้ม',
    'en', 'Velvety leaves, smoky grey-green centre, bright pink edges, hot pink flowers'
  ),
  jsonb_build_object('th', 'สูงราว 13 ซม.', 'en', 'About 13 cm tall'),
  jsonb_build_object('th', 'เกือบตลอดปี', 'en', 'Almost year-round'),
  jsonb_build_object(
    'th', 'ไวต่ออากาศเย็นมาก ควรเลี่ยงห้องที่เปิดแอร์เย็นจัดหรือจุดที่ลมแอร์เป่าโดยตรง และอย่าให้โดนแดดตรงเพราะใบจะไหม้',
    'en', 'Very sensitive to cold, so keep it out of a heavily air-conditioned room or the direct draught of a unit, and out of direct sun, which scorches the leaves.'
  ),
  '{}'::text[],
  0
)
on conflict (id) do update set
  plant_id     = excluded.plant_id,
  name         = excluded.name,
  description  = excluded.description,
  features     = excluded.features,
  size         = excluded.size,
  bloom_season = excluded.bloom_season,
  care_tip     = excluded.care_tip;
  -- images, tags, origin and is_published are left alone on re-run.

notify pgrst, 'reload schema';

-- ---------- Verify ----------
select p.id, p.category, p.name ->> 'th' as plant_th,
       v.id as variety_id, v.name ->> 'th' as variety_th, v.parent_variety_id
  from public.plants p
  left join public.plant_varieties v on v.plant_id = p.id
 where p.id = 'episcia';
