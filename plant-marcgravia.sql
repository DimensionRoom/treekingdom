-- ============================================================
-- Add the plant Marcgravia, and its variety Marcgravia sintenisii
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Marcgravia is not in the database yet, so this adds the genus as a plant
-- and sintenisii as its first variety.
--
-- Species counts for the genus vary between sources (62 in one study, more
-- in others), so the description gives none. The only temperature guidance
-- found is "warm growing", with no figure; the detail page would draw a
-- figure-less temperature as a marker at 20°C, so levels leaves out 'temp'
-- and the bar is not drawn. care.temp still shows as text.
--
-- Deliberately left out rather than guessed: images, tags, origin, a size,
-- a bloom season and a temperature figure.
--
-- Sources:
--   en.wikipedia.org/wiki/Marcgravia
--   ipni.org/n/153031-2                                  (Urban 1886)
--   powo.science.kew.org  (Marcgravia sintenisii: native to Puerto Rico, liana)
--   en.wikipedia.org/wiki/List_of_endemic_flora_of_Puerto_Rico
--   glassboxtropicals.com/marcgravia-sintenisii/        (cultivation)
--
-- Safe to run more than once.
-- ============================================================

-- ---------- The plant ----------
insert into public.plants (id, category, emoji, name, description, care, levels, sort_order)
values (
  'marcgravia',
  'foliage',
  '🌿',
  jsonb_build_object('th', 'มาร์คกราเวีย', 'en', 'Marcgravia (Shingle Vine)'),
  jsonb_build_object(
    'th', 'มาร์คกราเวียเป็นสกุลไม้เลื้อยในวงศ์ Marcgraviaceae มีถิ่นกำเนิดตั้งแต่เม็กซิโกไปจนถึงเขตร้อนของอเมริกาใต้ รวมถึงหมู่เกาะแคริบเบียน ชื่อสกุลตั้งเป็นเกียรติแก่ Georg Markgraf นักธรรมชาติวิทยาชาวเยอรมัน กิ่งของพืชสกุลนี้มีสองแบบ กิ่งวัยอ่อนจะเลื้อยไต่ขึ้นไปตามลำต้นไม้ใหญ่ โดยใบแนบชิดกับเปลือกไม้ซ้อนกันเป็นเกล็ด ส่วนกิ่งที่โตเต็มวัยจะห้อยลงและไม่สร้างรากตามลำต้น ช่อดอกมีดอกสมบูรณ์เรียงเป็นวง พร้อมต่อมน้ำหวานที่เจริญมาจากใบประดับ และดอกได้รับการผสมเกสรโดยค้างคาว',
    'en', 'Marcgravia is a genus of climbing plants in the family Marcgraviaceae, native from Mexico to tropical South America and the Caribbean. It is named after the German naturalist Georg Markgraf. Its branches come in two forms: young branches creep or climb up tree trunks with their leaves pressed flat against the bark in overlapping rows, while mature branches hang down and grow no roots. The flower head holds a ring of fertile flowers along with nectaries formed from bracts, and the flowers are pollinated by bats.'
  ),
  jsonb_build_object(
    'light',    jsonb_build_object('th', 'แสงสว่างแบบรำไร', 'en', 'Bright indirect light'),
    'water',    jsonb_build_object('th', 'ให้วัสดุปลูกชื้นปานกลาง', 'en', 'Keep moderately moist'),
    'soil',     jsonb_build_object('th', 'ออกรากได้ดีในสแฟกนัมมอสชื้น', 'en', 'Roots well in moist sphagnum moss'),
    'humidity', jsonb_build_object('th', 'สูง', 'en', 'High'),
    'temp',     jsonb_build_object('th', 'ชอบอากาศอบอุ่น', 'en', 'Warm'),
    'tips',     jsonb_build_object(
                  'th', 'ให้มีพื้นผิวแนวตั้ง เช่น แผ่นไม้ก๊อกหรือผนังตู้ ให้กิ่งวัยอ่อนได้เลื้อยเกาะ และไม่ควรปล่อยให้น้ำขังค้างบนใบนาน ๆ',
                  'en', 'Give young growth a vertical surface to climb, such as cork bark or a terrarium wall, and don''t leave water sitting on the leaves for long.'
                )
  ),
  -- 'temp' left out on purpose: no temperature figure is sourced (see header).
  jsonb_build_object('light', 45, 'water', 55, 'humidity', 85),
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
  (id, plant_id, emoji, name, description, features, size, care_tip, images, sort_order)
values (
  'marcgravia-sintenisii',
  'marcgravia',
  '',
  jsonb_build_object('th', 'ซินเทนิซิไอ', 'en', 'Marcgravia sintenisii'),
  jsonb_build_object(
    'th', 'มาร์คกราเวียชนิดพันธุ์แท้ที่เป็นพืชเฉพาะถิ่นของเปอร์โตริโก และพบได้ในป่าดิบชื้นเอลยุงเก บรรยายโดย Ignatz Urban ในปี 1886 ชื่อชนิดตั้งเป็นเกียรติแก่ Paul Sintenis นักเก็บตัวอย่างพืชชาวเยอรมันที่สำรวจพรรณไม้ในเปอร์โตริโก ต้นวัยอ่อนเลื้อยแนบไปกับพื้นผิวที่เกาะ ใบเล็กกลมเรียงซ้อนกันเป็นเกล็ดดูคล้ายภาพโมเสก ยอดอ่อนแตกออกมาเป็นสีแดงสด แล้วเปลี่ยนสีอีกหลายครั้งก่อนจะกลายเป็นสีเขียวเข้มเมื่อใบแก่ ก่อนออกดอก ต้นจะแตกกิ่งข้างที่มีใบแบบต้นโตเต็มวัย ซึ่งหน้าตาต่างจากใบที่เห็นในตู้ปลูกโดยทั่วไป',
    'en', 'A true species endemic to Puerto Rico, found in El Yunque rainforest, and described by Ignatz Urban in 1886. It is named after Paul Sintenis, a German plant collector who worked in Puerto Rico. The young plant climbs flat against its support, with small rounded leaves overlapping in a neat mosaic. New growth emerges bright red and changes colour several times before settling to dark green. Before it flowers it sends out side branches with adult leaves, which look quite different from the foliage usually seen in a terrarium.'
  ),
  jsonb_build_object(
    'th', 'พืชเฉพาะถิ่นเปอร์โตริโก, ใบเล็กกลมเรียงซ้อนเป็นเกล็ด, ยอดอ่อนสีแดงสด, ใบแก่สีเขียวเข้ม',
    'en', 'Endemic to Puerto Rico, small round leaves in overlapping rows, bright red new growth, dark green mature leaves'
  ),
  null,
  jsonb_build_object(
    'th', 'ต้องการอากาศอบอุ่นและวัสดุปลูกที่ชื้นปานกลาง ไม่ชอบให้น้ำขังค้างบนใบนาน ๆ ขยายพันธุ์ได้ด้วยการปักชำยอดในสแฟกนัมมอสชื้น',
    'en', 'Wants warmth and a moderately moist mix, and dislikes water sitting on its leaves. Propagate from tip cuttings rooted in moist sphagnum moss.'
  ),
  '{}'::text[],
  0
)
on conflict (id) do update set
  plant_id    = excluded.plant_id,
  name        = excluded.name,
  description = excluded.description,
  features    = excluded.features,
  size        = excluded.size,
  care_tip    = excluded.care_tip;
  -- images, tags, origin and is_published are left alone on re-run.

notify pgrst, 'reload schema';

-- ---------- Verify ----------
select p.id, p.category, p.name ->> 'th' as plant_th, p.levels,
       v.id as variety_id, v.name ->> 'th' as variety_th, v.parent_variety_id
  from public.plants p
  left join public.plant_varieties v on v.plant_id = p.id
 where p.id = 'marcgravia';
