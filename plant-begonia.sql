-- ============================================================
-- Add the plant บีโกเนีย (Begonia), and its variety 'White Ice'
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- 'White Ice' provenance comes from the American Begonia Society and the
-- Houston begonia society's horticultural type listing: a cane-like hybrid
-- raised by Charles McGough of Commerce, Texas, in 1998, from
-- 'Flamingo Queen' x 'Whiskey'. The listing gives no registration number,
-- so none is claimed.
--
-- Flower colour and height come from Steve's Leaves, a begonia specialist
-- nursery, as no society page gives them. The same nursery quotes a
-- 45-95°F range; the plant's temperature uses NC State Extension's more
-- cautious minimum (55°F / 13°C) instead.
--
-- Deliberately left out rather than guessed: images, tags, origin, and a
-- bloom season (no source gives one).
--
-- Sources:
--   en.wikipedia.org/wiki/Begonia
--   plants.ces.ncsu.edu/plants/begonia/          (NC State Extension)
--   begonias.org/cultivar-spotlight-white-ice/   (American Begonia Society)
--   begoniahouston.org/htype/htype_cane_mz.htm
--   stevesleaves.com/products/begonia-white-ice
--
-- Safe to run more than once.
-- ============================================================

-- ---------- The plant ----------
insert into public.plants (id, category, emoji, name, description, care, levels, sort_order)
values (
  'begonia',
  'foliage',
  '🌿',
  jsonb_build_object('th', 'บีโกเนีย', 'en', 'Begonia'),
  jsonb_build_object(
    'th', 'บีโกเนียเป็นสกุลพืชในวงศ์ Begoniaceae มีมากกว่า 2,000 ชนิด กระจายพันธุ์อยู่ในเขตร้อนและกึ่งเขตร้อนของแอฟริกา เอเชีย อเมริกากลาง และอเมริกาใต้ โดยถือว่าแอฟริกาเป็นศูนย์กลางถิ่นกำเนิด ชื่อสกุลตั้งโดย Charles Plumier นักพฤกษศาสตร์ชาวฝรั่งเศส เพื่อเป็นเกียรติแก่ Michel Bégon อดีตผู้ว่าการอาณานิคมแซ็ง-ดอแม็ง (ประเทศเฮติในปัจจุบัน) ส่วนใหญ่เป็นพืชที่เติบโตใต้ร่มไม้ในป่า จึงชอบแสงสว่างแบบรำไรมากกว่าแดดจัด นิยมปลูกทั้งเพื่อชมใบที่มีลวดลายและชมดอก ทุกส่วนของต้นมีสารที่ระคายเคือง โดยเฉพาะราก หากสุนัขหรือแมวกินเข้าไปอาจทำให้อาเจียนและน้ำลายไหล จึงควรวางให้พ้นสัตว์เลี้ยง',
    'en', 'Begonia is a genus in the family Begoniaceae, with more than 2,000 species spread across the tropics and subtropics of Africa, Asia, and Central and South America; Africa is considered its centre of origin. The French botanist Charles Plumier named it in honour of Michel Bégon, a former governor of the French colony of Saint-Domingue, now Haiti. Most species grow in the forest understorey, so they prefer bright shade to strong sun. Begonias are grown both for their patterned leaves and for their flowers. The whole plant is irritant, the roots most of all, and eating it can make dogs and cats vomit and salivate, so keep it away from pets.'
  ),
  jsonb_build_object(
    'light',    jsonb_build_object('th', 'แสงสว่างแบบรำไร เลี่ยงแดดจัด', 'en', 'Bright shade, no strong sun'),
    'water',    jsonb_build_object('th', 'ให้ดินชื้น ไม่แฉะ และไม่ปล่อยให้แห้งสนิท', 'en', 'Keep moist, never soggy or bone-dry'),
    'soil',     jsonb_build_object('th', 'ดินร่วนอุดมอินทรียวัตถุ ระบายน้ำดี pH 5.5-6.5', 'en', 'Rich, well-draining, pH 5.5-6.5'),
    'humidity', jsonb_build_object('th', 'ชอบอากาศชื้น', 'en', 'Prefers humid air'),
    -- Only a minimum is sourced, so the temperature bar shows one marker.
    'temp',     jsonb_build_object('th', 'ไม่ต่ำกว่า 13°C', 'en', 'Not below 13°C'),
    'tips',     jsonb_build_object(
                  'th', 'ระวังรดน้ำมากเกินไปเพราะรากจะเน่า และหมั่นตรวจหาเพลี้ยแป้ง แมลงหวี่ขาว และไรแดง ขยายพันธุ์ได้ด้วยการปักชำกิ่ง ปักชำใบ หรือแยกกอ',
                  'en', 'Overwatering rots the roots, and mealybugs, whiteflies and spider mites are worth watching for. Propagate from stem or leaf cuttings, or by division.'
                )
  ),
  jsonb_build_object('light', 45, 'water', 55, 'humidity', 65, 'temp', 42),
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
  'begonia-white-ice',
  'begonia',
  '',
  jsonb_build_object('th', 'ไวท์ไอซ์', 'en', 'Begonia ''White Ice'''),
  jsonb_build_object(
    'th', 'บีโกเนียลูกผสมกลุ่มต้นแบบลำอ้อย (cane-like) ผสมขึ้นในปี 1998 โดย Charles McGough จากเมืองคอมเมิร์ซ รัฐเท็กซัส สหรัฐอเมริกา จากคู่ผสม ''Flamingo Queen'' กับ ''Whiskey'' ซึ่งเป็นพ่อแม่ที่ต่างกันสุดขั้ว คือ ''Flamingo Queen'' ใบใหญ่ยาวปลายแหลมและมีจุดมาก ส่วน ''Whiskey'' ใบเล็ก ไม่มีจุด ต้นเตี้ยแน่นและโตไว สำหรับ ''White Ice'' ใบยาวเรียวสีเขียวเข้ม มีจุดสีขาวเงินกระจายเต็มใบคล้ายเกล็ดน้ำแข็ง และขอบใบก็มีจุดสีเงินแบบเดียวกัน ต้นแตกกิ่งเป็นพุ่มแน่น ดอกสีชมพูออกเป็นช่อห้อยขนาดกลาง',
    'en', 'A cane-like hybrid begonia raised in 1998 by Charles McGough of Commerce, Texas, from ''Flamingo Queen'' crossed with ''Whiskey''. The parents are opposites: ''Flamingo Queen'' has large, long, pointed leaves with plenty of spots, while ''Whiskey'' has small, unspotted leaves on a short, tight, very vigorous plant. The long, narrow, deep green leaves of ''White Ice'' are covered in silvery-white spots like drops of ice, with the same silver spots along the edges. It branches into a full, bushy plant and carries pink flowers in medium-sized hanging clusters.'
  ),
  jsonb_build_object(
    'th', 'ใบเขียวเข้มจุดขาวเงิน, ใบยาวเรียวปลายแหลม, แตกกิ่งเป็นพุ่มแน่น, ดอกชมพูเป็นช่อห้อย',
    'en', 'Deep green leaves with silvery-white spots, long pointed leaves, full branching habit, hanging clusters of pink flowers'
  ),
  jsonb_build_object('th', 'สูงราว 38-46 ซม.', 'en', 'About 38-46 cm (15-18 in) tall'),
  jsonb_build_object(
    'th', 'เป็นบีโกเนียต้นแบบลำอ้อยที่ปลูกง่าย ชอบที่ร่มถึงแดดรำไร ควรปล่อยให้ดินแห้งเล็กน้อยก่อนรดน้ำครั้งถัดไป',
    'en', 'An easy cane-like begonia. It likes shade to part sun; let the soil dry slightly between waterings.'
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
 where p.id = 'begonia';
