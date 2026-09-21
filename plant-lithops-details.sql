-- ============================================================
-- Fill in the Lithops entry
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- The row existed but was a stub: description was literally just the plant's
-- own name, and every care field except temp was an empty string. Content
-- below is researched, cross-checked across sources, and written to match the
-- length and tone of the existing catalog entries (compare aloe-vera and
-- gymnocalycium-mihanovichii).
--
-- Images are deliberately untouched, as asked.
--
-- Sources:
--   savvygardening.com/lithops/
--   planetdesert.com/blogs/news/lithops-living-stone-plants-care-and-growers-guide
--   baanlaesuan.com/plants/perennial/136819.html  (Thai, for local naming + bloom months)
--   pantip.com/topic/43084422                     (Thai growers on rainy-season rot)
--
-- Safe to run more than once.
-- ============================================================

update public.plants set
  -- 🪨 over the category's default 🌵: "living stones" is the whole point of
  -- the plant, and it's what tells it apart in a grid of cacti.
  emoji = '🪨',

  description = jsonb_build_object(
    'th', 'ไลทอปหรือ "หินมีชีวิต" เป็นไม้อวบน้ำวงศ์ Aizoaceae จากพื้นที่แห้งแล้งของแอฟริกาใต้และนามิเบีย ทั้งต้นคือใบอวบหนาเพียงคู่เดียวที่โผล่พ้นดินราว 2-3 ซม. ลวดลายและสีกลมกลืนไปกับก้อนกรวดรอบตัวจนแทบแยกไม่ออก ออกดอกเดี่ยวคล้ายดอกเดซี่สีขาวหรือเหลืองแทรกขึ้นจากร่องกลางใบ และผลัดใบปีละครั้งโดยดูดน้ำจากใบคู่เก่าไปสร้างใบคู่ใหม่',
    'en', 'Lithops, or "living stones", are Aizoaceae succulents from the arid rocky country of South Africa and Namibia. The whole plant is a single pair of fat leaves sitting barely 2-3 cm above the soil, patterned and coloured to vanish among the pebbles around it. Daisy-like white or yellow flowers push up through the fissure between the leaves, and once a year a new leaf pair replaces the old one, drawing its water from the pair it consumes.'
  ),

  care = jsonb_build_object(
    'light',    jsonb_build_object('th', 'แดดจัด 5-6 ชม. แต่ต้องมีหลังคากันฝน', 'en', '5-6 hrs of strong sun, under cover from rain'),
    'water',    jsonb_build_object('th', 'ทุก 2-3 สัปดาห์เฉพาะช่วงเติบโต งดตอนลอกคราบ', 'en', 'Every 2-3 weeks while growing, none during the leaf change'),
    'soil',     jsonb_build_object('th', 'ดินแคคตัสผสมหินภูเขาไฟหรือทรายหยาบ ระบายน้ำเร็วมาก', 'en', 'Gritty cactus mix with pumice or coarse sand'),
    'humidity', jsonb_build_object('th', 'ต่ำ ต้องการลมโกรก', 'en', 'Low, with good airflow'),
    'temp',     jsonb_build_object('th', '10-28°C', 'en', '10-28°C'),
    -- The one fact that decides whether it lives: water during the leaf change
    -- rots both the old and the new pair at once.
    'tips',     jsonb_build_object(
                  'th', 'ห้ามรดน้ำตอนใบคู่ใหม่กำลังดันใบเก่าออก ต้องรอจนใบเก่าแห้งเป็นกระดาษก่อน และรดลงดินเท่านั้น อย่าให้โดนตัวใบ',
                  'en', 'Never water while the new leaf pair is pushing the old one apart — wait until the old leaves are papery dry. Water the soil only, never the bodies.'
                )
  ),

  -- These render literally: the detail page draws each as a "{n}%" bar. Light
  -- sat at 50%, half-shade, for a plant that stretches and loses its markings
  -- without hard sun. Water goes just under the gymnocalycium's 15%, since
  -- Lithops take none at all for months at a time.
  --
  -- levels.temp is deliberately left alone: the temperature row doesn't read
  -- it, it parses the digits out of care.temp ('10-28°C') and plots them on a
  -- gradient. The key only has to exist for the row to render.
  levels = levels || jsonb_build_object('light', 90, 'water', 8)

where id = 'lithops';

notify pgrst, 'reload schema';

-- ---------- Verify ----------
select emoji,
       description ->> 'th' as description_th,
       care -> 'water' ->> 'th' as water_th,
       care -> 'tips'  ->> 'th' as tips_th,
       levels
  from public.plants
 where id = 'lithops';


-- ============================================================
-- OPTIONAL — the "easy-care" tag
--
-- Lithops are the opposite of easy: they want no water for months at a time,
-- and the usual way to lose one is ordinary kindness. Leaving the tag on sets
-- a buyer up to kill it and blame themselves. Run this to drop just that tag
-- (the "bestseller" tag is left alone).
-- ============================================================

-- update public.plants
--    set tags = array_remove(tags, 'easy-care')
--  where id = 'lithops';
