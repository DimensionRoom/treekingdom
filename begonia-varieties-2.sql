-- ============================================================
-- Add three more Begonia varieties: 'Autumn Ember', sp. Julau Type I and
-- sp. Julau Type II
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
-- Run after plant-begonia.sql and begonia-varieties.sql; these take
-- sort_order 11-13.
--
-- The two Julau begonias are not described species. They were collected
-- near Julau, Sarawak, and carry American Begonia Society "U" numbers for
-- unidentified species in cultivation. Most sources map Type II to U683
-- (formerly "sp. Julau narrow form") and Type I to U684, but at least one
-- seller labels them the other way round, so the descriptions say "most
-- sources" rather than stating it flatly. Sources also disagree on the
-- collection year, which is left out.
--
-- Sources:
--   Autumn Ember   logees.com/products/begonia-autumn-ember-ppaf (breeder)
--   Julau Type I   stevesleaves.com (Begonia U684)
--   Julau Type II  insearchofsmallthings.com/2020/05/15/begonia-sp-julau/ ;
--                  growtropicals.com/products/begonia-julau-type-2
--
-- Safe to run more than once.
-- ============================================================

insert into public.plant_varieties
  (id, plant_id, emoji, name, description, features, size, bloom_season, care_tip, images, sort_order)
values

-- 11. 'Autumn Ember' --------------------------------------------------------
(
  'begonia-autumn-ember',
  'begonia',
  '',
  jsonb_build_object('th', 'ออทัมน์เอ็มเบอร์', 'en', 'Begonia ''Autumn Ember'''),
  jsonb_build_object(
    'th', 'บีโกเนียลูกผสมกลุ่มเหง้าของเรือนเพาะชำ Logee''s ในสหรัฐอเมริกา ผสมจาก ''Marmaduke'' กับ ''Angel Glow'' แล้วคัดต้นที่ใบสีส้มสดที่สุดจากกลุ่มต้นกล้า และอยู่ระหว่างยื่นจดสิทธิบัตรพันธุ์พืช ใบอ่อนแตกออกมาเป็นสีส้มสดจัด และถ้าได้แสงเพียงพอ ใบจะคงสีส้มไว้ได้แม้ใบแก่แล้ว ทรงต้นกะทัดรัด และออกดอกสีชมพูอ่อนชูเหนือพุ่มใบในฤดูหนาว',
    'en', 'A rhizomatous hybrid from Logee''s, the American nursery, bred from ''Marmaduke'' x ''Angel Glow'' and picked from the seedlings for the brightest orange colour; a plant patent is pending. The young leaves open a vivid orange, and with enough light they keep that colour as they age. It stays compact and carries light pink flowers above the leaves in winter.'
  ),
  jsonb_build_object(
    'th', 'ใบอ่อนสีส้มสด, คงสีได้เมื่อได้แสงพอ, ทรงต้นกะทัดรัด, ดอกชมพูอ่อน',
    'en', 'Vivid orange young leaves, holds its colour in good light, compact habit, light pink flowers'
  ),
  jsonb_build_object('th', 'สูงราว 30-46 ซม. เมื่อปลูกในกระถาง', 'en', 'About 30-46 cm (12-18 in) tall in a pot'),
  jsonb_build_object('th', 'ฤดูหนาว', 'en', 'Winter'),
  jsonb_build_object(
    'th', 'ชอบแดดรำไร ปล่อยให้ดินแห้งก่อนรดน้ำครั้งถัดไป และไม่ควรให้อุณหภูมิต่ำกว่าราว 16°C เด็ดยอดบ้างจะช่วยให้ต้นแตกพุ่มแน่นขึ้น',
    'en', 'Give it part sun, let the soil dry out between waterings, and keep it above about 16°C (60°F). Pinch the tips for a fuller, bushier plant.'
  ),
  '{}'::text[],
  11
),

-- 12. sp. Julau Type I (U684) ----------------------------------------------
(
  'begonia-julau-type-1',
  'begonia',
  '',
  jsonb_build_object('th', 'จูเลา ไทป์ 1', 'en', 'Begonia sp. Julau Type I'),
  jsonb_build_object(
    'th', 'บีโกเนียจากบริเวณเมืองจูเลา รัฐซาราวัก เกาะบอร์เนียว ที่ยังไม่ได้รับการบรรยายเป็นชนิดพันธุ์อย่างเป็นทางการ จึงเรียกตามชื่อสถานที่ที่พบ แหล่งข้อมูลส่วนใหญ่ระบุว่าไทป์ 1 คือต้นที่ได้รหัส U684 จากสมาคมบีโกเนียอเมริกัน ซึ่งเป็นรหัสสำหรับบีโกเนียที่ยังไม่มีชื่อทางวิทยาศาสตร์ ใบปลายแหลม ใบอ่อนสีเข้มมีลายสีชมพูสด เมื่อใบแก่จะเปลี่ยนเป็นสีเขียวอ่อนลง และลายจะจางเป็นสีเงินจนหายไปในที่สุด',
    'en', 'An unnamed begonia from around the town of Julau in Sarawak, Borneo, not yet formally described, so it goes by the place it was found. Most sources give Type I as U684, a number from the American Begonia Society''s list of unidentified species in cultivation. The leaves are pointed. Young leaves are dark with vivid pink markings; as they mature they turn a lighter green, and the markings fade to silver and eventually disappear.'
  ),
  jsonb_build_object(
    'th', 'ใบปลายแหลม, ใบอ่อนสีเข้มลายชมพูสด, ลายจางลงเมื่อใบแก่, ยังไม่มีชื่อทางวิทยาศาสตร์',
    'en', 'Pointed leaves, dark young leaves with vivid pink markings, markings fade with age, not yet formally named'
  ),
  null,
  null,
  jsonb_build_object(
    'th', 'ต้องการความชื้นในอากาศสูง จึงเหมาะกับการปลูกในตู้หรือโรงเรือน',
    'en', 'Needs high humidity, so it does best in a terrarium or greenhouse.'
  ),
  '{}'::text[],
  12
),

-- 13. sp. Julau Type II (U683) ---------------------------------------------
(
  'begonia-julau-type-2',
  'begonia',
  '',
  jsonb_build_object('th', 'จูเลา ไทป์ 2', 'en', 'Begonia sp. Julau Type II'),
  jsonb_build_object(
    'th', 'บีโกเนียอีกต้นจากบริเวณเมืองจูเลา รัฐซาราวัก ที่ยังไม่ได้รับการบรรยายเป็นชนิดพันธุ์อย่างเป็นทางการ แหล่งข้อมูลส่วนใหญ่ระบุว่าไทป์ 2 คือต้นที่ได้รหัส U683 ซึ่งเดิมเรียกกันว่า sp. Julau ฟอร์มใบแคบ ใบเกือบดำ ปลายเรียวแหลม มีจุดสีชมพูกระจาย และลายสีชมพูระหว่างเส้นใบจะชัดขึ้นเมื่อต้นโต ใบใหญ่สุดยาวราว 5-6 ซม. ก้านใบอมแดง ลำต้นเรียวเล็ก เมื่อต้นสูงถึงระดับหนึ่งจึงมักล้มเพราะรับน้ำหนักยอดไม่ไหว',
    'en', 'Another unnamed begonia from around Julau in Sarawak, not yet formally described. Most sources give Type II as U683, formerly circulated as "sp. Julau narrow form". Its near-black leaves taper to a point and are scattered with pink spots, and the pink markings between the side veins grow bolder as the plant matures. The largest leaves reach about 5-6 cm, on red-flushed stalks. The stem is thin, so once the plant reaches a certain height it tends to flop under its own top weight.'
  ),
  jsonb_build_object(
    'th', 'ใบเกือบดำจุดชมพู, ใบเรียวแคบปลายแหลม, ก้านใบอมแดง, ยังไม่มีชื่อทางวิทยาศาสตร์',
    'en', 'Near-black leaves with pink spots, narrow pointed leaves, red-flushed stalks, not yet formally named'
  ),
  null,
  null,
  jsonb_build_object(
    'th', 'ให้แสงสว่างแบบรำไร เพราะแดดตรงจะทำให้ใบไหม้ รักษาดินให้ชื้นแต่ไม่แฉะ ต้องการความชื้นในอากาศ 70% ขึ้นไป และอุณหภูมิไม่ต่ำกว่า 15°C จึงเหมาะกับการปลูกในตู้ ลำต้นเรียวจึงอาจต้องมีหลักช่วยพยุงเมื่อต้นสูงขึ้น',
    'en', 'Give it bright indirect light, as direct sun scorches the leaves, and keep the mix lightly moist but never wet. It needs humidity of 70% or more and temperatures above 15°C, so a terrarium suits it. The thin stem may need a small stake as it gains height.'
  ),
  '{}'::text[],
  13
)

on conflict (id) do update set
  plant_id     = excluded.plant_id,
  name         = excluded.name,
  description  = excluded.description,
  features     = excluded.features,
  size         = excluded.size,
  bloom_season = excluded.bloom_season,
  care_tip     = excluded.care_tip,
  sort_order   = excluded.sort_order;
  -- images, tags, origin and is_published are left alone on re-run.

notify pgrst, 'reload schema';

-- ---------- Verify ----------
select id, sort_order, name ->> 'th' as name_th, name ->> 'en' as name_en
  from public.plant_varieties
 where plant_id = 'begonia'
 order by sort_order;
