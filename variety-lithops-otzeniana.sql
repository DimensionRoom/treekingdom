-- ============================================================
-- Add the variety: Lithops otzeniana
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Content researched and cross-checked, written to match the length and tone
-- of the existing varieties (compare fern-boston and iron-maiden): a full
-- paragraph in `description`, short comma-separated phrases in `features`.
--
-- No images: those have to be uploaded through the admin, which is also where
-- `origin` belongs once you know which nursery the stock came from.
--
-- Sources:
--   llifle.com/Encyclopedia/SUCCULENTS/Family/Aizoaceae/13266/Lithops_otzeniana
--   en.wikipedia.org/wiki/Lithops_otzeniana
--   worldofsucculents.com/lithops-otzeniana-living-stones/
--
-- Safe to run more than once.
-- ============================================================

insert into public.plant_varieties
  (id, plant_id, emoji, name, description, features, size, bloom_season, care_tip, tags, images, sort_order)
values (
  'lithops-otzeniana',
  'lithops',
  '',

  jsonb_build_object('th', 'ไลทอป ออทเซเนียนา', 'en', 'Lithops otzeniana'),

  jsonb_build_object(
    'th', 'ไลทอปสายพันธุ์ที่นักสะสมตามหา ถิ่นกำเนิดอยู่ในเขตนอร์เทิร์นเคป แอฟริกาใต้ พบในธรรมชาติเฉพาะพื้นที่เล็ก ๆ ทางเหนือของเมืองโลริสฟอนเทนบนพื้นหินไนส์และหินแกรนิตเท่านั้น จุดเด่นอยู่ที่หน้าใบสีเขียวมะกอกอมเทาซึ่งมีช่องใสขนาดใหญ่ ขอบหยักโค้งเป็นแฉกชัดเจนคล้ายรอยเท้าสัตว์ ต่างจากไลทอปทั่วไปที่ลายหน้าเป็นจุดหรือเส้นเล็ก ๆ โดยทั่วไปแตกกอ 2-5 หัว แต่ถ้าเลี้ยงดีอาจแตกได้ถึง 25 หัว',
    'en', 'A Lithops collectors go looking for. It grows wild in the Northern Cape of South Africa, in one small pocket of gneiss and granite country north of Loeriesfontein and nowhere else. Its face is olive-green to grey with unusually large translucent windows, rimmed by boldly scalloped lobes that read more like an animal''s paw print than the fine dots and lines most Lithops wear. It clusters into 2-5 heads, and up to 25 when it is happy.'
  ),

  jsonb_build_object(
    'th', 'ช่องใสขนาดใหญ่ขอบหยัก, สีเขียวมะกอกอมเทา, แตกกอ 2-5 หัว, ดอกเหลืองใจกลางขาว',
    'en', 'Large scalloped windows, olive-grey face, clusters of 2-5 heads, yellow white-throated flower'
  ),

  jsonb_build_object('th', 'สูง 2-3 ซม. หน้ากว้าง 1.5-3 ซม.', 'en', '2-3 cm tall, 1.5-3 cm across'),

  jsonb_build_object('th', 'ต้นฤดูใบไม้ร่วง ราว ก.ย.-พ.ย.', 'en', 'Early autumn'),

  -- LLIFLE calls the species outright tricky and "very particular about
  -- growing conditions" — worth saying plainly to someone about to buy one.
  jsonb_build_object(
    'th', 'เรื่องมากกว่าไลทอปสายพันธุ์อื่นพอสมควร อ่อนไหวเป็นพิเศษกับเครื่องปลูกที่อุ้มน้ำและการรดเกิน ควรใช้เครื่องปลูกโปร่งจัดออกไปทางหินล้วน และรดต่อเมื่อดินแห้งสนิทจริง ๆ',
    'en', 'Fussier than most Lithops, and especially unforgiving of a water-retentive mix. Keep it in a very open, mineral-heavy substrate and water only once it is bone dry.'
  ),

  -- Endemic to one small area and sought after by collectors, so the tag is
  -- the plant's own description rather than a sales angle. Drop it if the
  -- stock says otherwise.
  '{"rare"}'::text[],
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
  care_tip     = excluded.care_tip,
  tags         = excluded.tags;
  -- images and origin are deliberately not overwritten here, so re-running
  -- this can't wipe pictures or a nursery credit added later in the admin.

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect one row, parent_variety_id null (so it opens its own sheet and can
-- be deep-linked as /plants/lithops?variety=lithops-otzeniana).
select id, plant_id, parent_variety_id,
       name ->> 'th'     as name_th,
       features ->> 'th' as features_th,
       size ->> 'th'     as size_th,
       tags
  from public.plant_varieties
 where plant_id = 'lithops';
