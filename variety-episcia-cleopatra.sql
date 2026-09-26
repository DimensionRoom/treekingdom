-- ============================================================
-- Add the variety: Episcia 'Cleopatra'
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Provenance comes from The Gesneriad Society's cultivar registry
-- (IR64057), cross-checked against Singapore NParks' Flora & Fauna Web:
-- a chimeric sport of Episcia cupreata 'Frosty', raised by E. Leo Easterbrook
-- of Ohio, introduced in 1963 and registered in 1964. The registry also
-- lists 'Pink Brocade' and "Cerri's Tricolor" as synonyms — the same plant
-- is often sold under those names.
--
-- Left out rather than guessed: images, tags, origin, and a bloom season
-- (neither source gives one).
--
-- Sources:
--   gesneriadsociety.org/registry/episcia-cleopatra/
--   nparks.gov.sg/florafaunaweb/flora/3/4/3464
--
-- Safe to run more than once.
-- ============================================================

insert into public.plant_varieties
  (id, plant_id, emoji, name, description, features, size, care_tip, images, sort_order)
values (
  'episcia-cleopatra',
  'episcia',
  '',
  jsonb_build_object('th', 'คลีโอพัตรา', 'en', 'Episcia ''Cleopatra'''),
  jsonb_build_object(
    'th', 'พรมญี่ปุ่นพันธุ์ที่เกิดจากการกลายพันธุ์แบบไคเมราของ Episcia cupreata ''Frosty'' คัดเลือกโดย E. Leo Easterbrook จากรัฐโอไฮโอ สหรัฐอเมริกา เปิดตัวสู่วงการไม้ประดับในปี 1963 และขึ้นทะเบียนพันธุ์ในปี 1964 ใบนุ่มแบบกำมะหยี่ มีสามสีในใบเดียว คือขอบใบสีชมพูอ่อน กลางใบสีเขียวอ่อนเป็นรูปคล้ายใบโอ๊ก และมีเส้นขอบสีขาวบาง ๆ คั่นระหว่างสองสี ดอกเป็นรูปแตร สีแดงสดถึงแดงอมส้ม ผิวดอกมีขน และแต่ละดอกบานอยู่ได้ 2-3 วัน ต้นนี้มีชื่อพ้องว่า ''Pink Brocade'' และ ''Cerri''s Tricolor'' จึงอาจพบวางขายภายใต้ชื่อเหล่านี้',
    'en', 'A chimeric sport of Episcia cupreata ''Frosty'', raised by E. Leo Easterbrook of Ohio, USA, introduced in 1963 and registered in 1964. Its velvety leaves carry three colours at once: pale pink margins around a pale green centre shaped like an oak leaf, with a thin white halo between the two. The flowers are trumpet-shaped, bright red to orange-red and furry, each lasting two to three days. It is also registered under the synonyms ''Pink Brocade'' and ''Cerri''s Tricolor'', and is often sold under those names.'
  ),
  jsonb_build_object(
    'th', 'ใบสามสี ชมพู เขียว และขาว, กลางใบเป็นรูปคล้ายใบโอ๊ก, ใบนุ่มแบบกำมะหยี่, ดอกรูปแตรสีแดงสด',
    'en', 'Three-colour leaves in pink, green and white, oak-leaf-shaped centre, velvety texture, bright red trumpet flowers'
  ),
  jsonb_build_object('th', 'สูงไม่เกินราว 15 ซม.', 'en', 'Up to about 15 cm tall'),
  -- NParks rates it slow-growing and high-maintenance: the part worth
  -- telling someone before they buy it.
  jsonb_build_object(
    'th', 'โตช้าและต้องการการดูแลใกล้ชิดกว่าพรมญี่ปุ่นทั่วไป ต้องการความชื้นในอากาศสูง ควรปลูกในวัสดุที่อุ้มความชื้นแต่ระบายน้ำดี เช่น พีทมอสผสมเพอร์ไลต์ และวางในที่แสงรำไร ขยายพันธุ์ได้ด้วยการแยกไหลหรือปักชำกิ่ง',
    'en', 'Slow-growing and fussier than most flame violets. It needs high humidity and a moist but free-draining mix, such as peat moss with perlite, in semi-shade. Propagate from its runners or from stem cuttings.'
  ),
  '{}'::text[],
  1
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
select id, sort_order, parent_variety_id, name ->> 'th' as name_th, size ->> 'th' as size_th
  from public.plant_varieties
 where plant_id = 'episcia'
 order by sort_order;
