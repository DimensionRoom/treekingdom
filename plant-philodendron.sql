-- ============================================================
-- Add the plant Philodendron, and its variety 'Burle Marx' Variegata
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Researched and cross-checked. One point that trips up a lot of listings:
-- the plant sold as Philodendron 'Burle Marx' is a CULTIVAR with glossy,
-- elongated heart-shaped leaves. It is not the species Philodendron
-- burle-marxii, which has narrow lance-shaped leaves. The variety below is
-- the cultivar, and its description says so.
--
-- Deliberately left out rather than guessed: images (upload in the admin),
-- tags, bloom season (grown for its leaves), and the variety's origin.
--
-- Sources:
--   en.wikipedia.org/wiki/Philodendron
--   en.wikipedia.org/wiki/Philodendron_burle-marxii
--   plantcaretoday.com/burle-marx-philodendron.html
--
-- Safe to run more than once.
-- ============================================================

-- ---------- The plant ----------
insert into public.plants (id, category, emoji, name, description, care, levels, sort_order)
values (
  'philodendron',
  'foliage',
  '🌿',
  jsonb_build_object('th', 'ฟิโลเดนดรอน', 'en', 'Philodendron'),
  jsonb_build_object(
    'th', 'ฟิโลเดนดรอนเป็นสกุลไม้ใบในวงศ์บอน (Araceae) ปัจจุบันมีชนิดที่ได้รับการยอมรับราว 625 ชนิด พบในเขตร้อนของทวีปอเมริกาและหมู่เกาะเวสต์อินดีส ชื่อสกุลมาจากภาษากรีก philo แปลว่า "รัก" และ dendron แปลว่า "ต้นไม้" ตามนิสัยของหลายชนิดที่เลื้อยเกาะต้นไม้ใหญ่ด้วยรากอากาศ นิยมปลูกเป็นไม้ประดับในบ้านเพราะทนแสงน้อยได้ดีกว่าไม้ใบหลายชนิด แต่จะเติบโตสวยที่สุดเมื่อได้รับแสงสว่างมาก ทุกส่วนของต้นมีผลึกแคลเซียมออกซาเลต หากเคี้ยวหรือกลืนจะทำให้ปากและลำคอระคายเคืองและบวม จึงควรวางให้พ้นมือเด็กและสัตว์เลี้ยง',
    'en', 'Philodendron is a genus of foliage plants in the arum family (Araceae), with around 625 accepted species found across the tropical Americas and the West Indies. The name comes from the Greek philo, "love", and dendron, "tree", after the many species that climb trees by their aerial roots. It is a popular houseplant because it tolerates lower light than many foliage plants, though it grows best in bright light. Every part of the plant contains calcium oxalate crystals, which burn and swell the mouth and throat if chewed or swallowed, so keep it away from children and pets.'
  ),
  jsonb_build_object(
    'light',    jsonb_build_object('th', 'แสงสว่างมาก ไม่โดนแดดจัดตอนเที่ยง', 'en', 'Bright indirect light, no harsh midday sun'),
    'water',    jsonb_build_object('th', 'รดเมื่อดินแห้งลึกราว 5 ซม.', 'en', 'Water when the top 5 cm of soil is dry'),
    'soil',     jsonb_build_object('th', 'ดินโปร่ง อุดมอินทรียวัตถุ ระบายน้ำดี', 'en', 'Airy, rich, well-draining mix'),
    'humidity', jsonb_build_object('th', 'ปานกลางถึงสูง', 'en', 'Moderate to high'),
    'temp',     jsonb_build_object('th', '18-27°C', 'en', '18-27°C'),
    'tips',     jsonb_build_object(
                  'th', 'ให้ปุ๋ยสม่ำเสมอในช่วงที่ต้นกำลังเติบโต ชนิดที่เลื้อยควรมีหลักให้รากอากาศได้เกาะ',
                  'en', 'Feed regularly while it is actively growing, and give climbing kinds a pole for their aerial roots to grip.'
                )
  ),
  -- The detail page draws light/water/humidity as literal % bars; temp is
  -- plotted from the digits in care.temp and only needs this key to exist.
  jsonb_build_object('light', 60, 'water', 50, 'humidity', 65, 'temp', 42),
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
  'philodendron-burle-marx-variegata',
  'philodendron',
  '',
  jsonb_build_object('th', 'เบอร์เบิ้ลมาร์คด่าง', 'en', 'Philodendron ''Burle Marx'' Variegata'),
  jsonb_build_object(
    'th', 'ฟอร์มด่างของฟิโลเดนดรอนพันธุ์ปลูก ''Burle Marx'' ซึ่งตั้งชื่อเป็นเกียรติแก่ Roberto Burle Marx ภูมิสถาปนิกชาวบราซิลผู้ทำให้พืชเขตร้อนพื้นเมืองเป็นที่รู้จักในงานออกแบบสมัยใหม่ ใบเป็นรูปหัวใจยาวเรียว ผิวใบมันวาว มีลายด่างสีครีมถึงเขียวอ่อนแต้มเป็นปื้นหรือเป็นลายหินอ่อน ลายของแต่ละใบจึงไม่ซ้ำกัน ในธรรมชาติเป็นไม้กึ่งอิงอาศัยที่เลื้อยไปตามพื้นจนเจอที่ให้ไต่ แต่เมื่อปลูกในกระถางจะเป็นพุ่มกะทัดรัด ต้นนี้ต่างจาก Philodendron burle-marxii ซึ่งเป็นชนิดพันธุ์ตามธรรมชาติที่ใบแคบรูปใบหอก แม้ชื่อจะคล้ายกันก็ตาม',
    'en', 'The variegated form of the cultivar Philodendron ''Burle Marx'', named for Roberto Burle Marx, the Brazilian landscape architect who brought native tropical plants into modern design. Its leaves are elongated hearts with a glossy surface, splashed or marbled cream to pale green, so no two leaves carry the same pattern. In the wild it is a hemiepiphyte that trails along the ground until it finds something to climb; in a pot it grows as a compact bush. Despite the similar name, it is not Philodendron burle-marxii, a wild species with narrow lance-shaped leaves.'
  ),
  jsonb_build_object(
    'th', 'ใบรูปหัวใจยาวเรียว, ผิวใบมันวาว, ด่างครีมถึงเขียวอ่อน, ลายด่างไม่ซ้ำกันทุกใบ',
    'en', 'Elongated heart-shaped leaves, glossy surface, cream to pale green variegation, a different pattern on every leaf'
  ),
  jsonb_build_object('th', 'สูงราว 60 ซม. แผ่กว้าง 60-120 ซม.', 'en', 'About 60 cm tall, 60-120 cm across'),
  jsonb_build_object(
    'th', 'ควรให้แสงสว่างมากแต่เลี่ยงแดดจัดตอนเที่ยง เพราะใบจะไหม้ได้ ขยายพันธุ์ได้ด้วยการปักชำกิ่งหรือการตอนกิ่ง',
    'en', 'Give it plenty of bright light but keep it out of harsh midday sun, which scorches the leaves. Propagate from stem cuttings or by air layering.'
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
select p.id, p.category, p.name ->> 'th' as plant_th,
       v.id as variety_id, v.name ->> 'th' as variety_th, v.parent_variety_id
  from public.plants p
  left join public.plant_varieties v on v.plant_id = p.id
 where p.id = 'philodendron';
