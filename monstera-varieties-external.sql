-- ============================================================
-- Monstera varieties: 6 species/cultivars researched online (see chat for
-- sources), covering both true species (Adansonii, Obliqua, Peru) and the
-- named variegated cultivars Thai buyers specifically search for and pay a
-- premium for (Albo, Thai Constellation, Mint).
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Parent plant 'monstera' already exists (the plain green deliciosa form) —
-- these rows only add plant_varieties under it, no changes to the parent.
-- bloom_season is null for all 6: monstera is grown for foliage, and none of
-- these are typically discussed in terms of flowering, matching how the
-- existing fern varieties (which also don't flower) are modeled.
--
-- sort_order uses a fresh, non-colliding block (600-605) following the
-- existing per-parent convention (fern 500-505, jasmine 800-806).
--
-- Safe to run more than once (`on conflict (id) do nothing`).
-- ============================================================

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'monstera-albo',
  'monstera',
  '🤍',
  '{"th":"มอนสเตอร่า ด่างขาว","en":"Monstera Albo (Borsigiana Albo)"}',
  '{"th":"มอนสเตอร่าด่างขาวมีลายด่างสีขาวสลับเขียวไม่ซ้ำแบบในทุกใบ เกิดจากการกลายพันธุ์ตามธรรมชาติที่พบได้ยาก ส่วนขาวสังเคราะห์แสงไม่ได้จึงโตช้ากว่าปกติมาก ยิ่งด่างมากยิ่งราคาสูง เป็นไม้ใบที่นักสะสมต้องการที่สุด","en":"Monstera Albo has unique white-and-green variegation on every leaf, caused by a rare natural mutation. The white sections can''t photosynthesize, so it grows far slower than a plain green plant — the more variegated, the more prized and expensive it is among collectors."}',
  '{"th":"ลายด่างขาวไม่ซ้ำแบบทุกใบ, โตช้ากว่าต้นปกติมาก, มูลค่าสูงตามสัดส่วนความด่าง, ต้องการแสงมากกว่าต้นทั่วไป","en":"Unique white variegation on every leaf, grows much slower than plain green, value scales with variegation, needs more light than a plain plant"}',
  null,
  '{"th":"สูง 1-2 เมตร (ไต่หลัก)","en":"1-2 m tall (climbing on a pole)"}',
  '{"th":"ให้แสงจัดกว่ามอนสเตอร่าปกติเพราะส่วนขาวไม่สังเคราะห์แสง แต่ต้องเลี่ยงแดดจัดจ้าโดยตรงเพราะใบขาวไหม้แดดง่ายกว่าใบเขียวมาก อย่าตัดส่วนด่างทิ้งเพราะกิ่งใหม่จากจุดนั้นมักไม่ด่างซ้ำ","en":"Give it brighter light than a regular monstera since the white parts can''t photosynthesize, but avoid direct harsh sun — white tissue scorches far more easily than green. Don''t prune off variegated sections; new growth from that point often won''t stay variegated."}',
  '{"th":"พันธุ์กลายที่คัดจากมอนสเตอร่าดีลิซิโอซ่า/บอร์ซิเจียนา","en":"A variegated mutation selected from Monstera deliciosa/borsigiana"}',
  '{}',
  '{rare}',
  600
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'monstera-thai-constellation',
  'monstera',
  '✨',
  '{"th":"มอนสเตอร่า ไทยคอนสเตลเลชั่น","en":"Monstera Thai Constellation"}',
  '{"th":"ไทยคอนสเตลเลชั่นมีลายด่างครีมเหลืองกระจายเป็นจุดและปื้นทั่วใบคล้ายกลุ่มดาว เพาะเลี้ยงเนื้อเยื่อจนลายด่างคงที่ไม่กลับเป็นเขียว ปลูกง่ายและโตเร็วกว่าด่างขาวมาก เป็นตัวเลือกยอดนิยมของคนอยากได้ใบด่างที่ดูแลไม่ยาก","en":"Thai Constellation has cream-yellow speckles and patches scattered across the leaf like a starry sky. It''s tissue-cultured so the variegation stays stable and never reverts to solid green, making it far easier to grow and faster than Albo — a popular pick for anyone wanting variegation without the fuss."}',
  '{"th":"ลายด่างครีมเหลืองคงที่ไม่กลับเป็นเขียว, โตเร็วกว่าด่างขาว, ใบหนาทนทานกว่า, เพาะเลี้ยงเนื้อเยื่อจึงหาซื้อง่ายกว่า","en":"Stable cream-yellow variegation that won''t revert to green, faster growing than Albo, thicker and hardier leaves, tissue-cultured so easier to find"}',
  null,
  '{"th":"สูง 1-2 เมตร (ไต่หลัก)","en":"1-2 m tall (climbing on a pole)"}',
  '{"th":"ทนแดดและดูแลง่ายกว่าด่างขาวมาก เหมาะกับมือใหม่ที่อยากเริ่มเล่นมอนสเตอร่าด่าง ให้ปุ๋ยตามปกติได้โดยไม่ต้องกังวลว่าลายด่างจะหาย","en":"Far more forgiving and sun-tolerant than Albo, a good entry point for anyone new to variegated monstera. Feed normally without worrying the variegation will fade."}',
  '{"th":"พันธุ์เพาะเลี้ยงเนื้อเยื่อพัฒนาในประเทศไทย","en":"A tissue-cultured cultivar developed in Thailand"}',
  '{}',
  '{bestseller}',
  601
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'monstera-mint',
  'monstera',
  '🌱',
  '{"th":"มอนสเตอร่า ด่างมิ้นท์","en":"Monstera Mint (Aurea)"}',
  '{"th":"ด่างมิ้นท์มีสีเขียวมิ้นท์อ่อนหรือเหลืองทองแซมทั่วใบ ต่างจากด่างขาวที่เป็นปื้นขาวชัดเจน เป็นมอนสเตอร่าด่างที่หายากและราคาสูงที่สุดชนิดหนึ่งในตลาดไทย เพราะลายด่างไม่เสถียรและขยายพันธุ์ให้ได้ลายเดิมซ้ำยากมาก","en":"Mint variegation shows as pale minty-green or golden tones spread across the leaf, unlike Albo''s sharp white patches. It''s one of the rarest and priciest monstera types in the Thai market, since its variegation is unstable and very difficult to reproduce reliably through propagation."}',
  '{"th":"สีเขียวมิ้นท์หรือทองแซมทั่วใบ, หายากและราคาสูงมาก, ขยายพันธุ์ให้ได้ลายเดิมยาก, ต้นเล็กเติบโตช้า","en":"Minty-green or golden tones spread across the leaf, extremely rare and expensive, hard to propagate true to type, small and slow-growing"}',
  null,
  '{"th":"สูง 0.5-1.5 เมตร (ไต่หลัก)","en":"0.5-1.5 m tall (climbing on a pole)"}',
  '{"th":"ซื้อจากแหล่งที่เชื่อถือได้เท่านั้นเพราะมีการปลอมขายกันมาก และหลีกเลี่ยงการย้ายกระถางบ่อยเพราะต้นบอบบางกว่ามอนสเตอร่าด่างชนิดอื่น","en":"Buy only from a trusted source, since misrepresented plants are common — and avoid repotting too often, as it''s more delicate than other variegated monstera types."}',
  '{"th":"พันธุ์กลายหายากที่คัดจากมอนสเตอร่าดีลิซิโอซ่า","en":"A rare variegated mutation selected from Monstera deliciosa"}',
  '{}',
  '{rare}',
  602
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'monstera-adansonii',
  'monstera',
  '🍃',
  '{"th":"มอนสเตอร่า มินิ","en":"Monstera Adansonii"}',
  '{"th":"มอนสเตอร่ามินิมีใบเล็กบางกว่าดีลิซิโอซ่ามาก รูใบทะลุขนาดใหญ่เกือบครึ่งใบดูโปร่งสวยเป็นเอกลักษณ์ ทรงต้นเป็นไม้เลื้อยพุ่มเตี้ยเหมาะปลูกในกระถางแขวนหรือให้เลื้อยลงมาจากชั้นวาง โตเร็วและดูแลง่ายกว่ามอนสเตอร่าใบใหญ่","en":"Monstera adansonii has much smaller, thinner leaves than deliciosa, with large fenestrations covering nearly half the leaf for a distinctively airy look. Its low, trailing habit suits a hanging basket or a shelf where it can cascade down, and it grows faster and is easier to care for than the big-leaved types."}',
  '{"th":"ใบเล็กบางรูทะลุใหญ่, ทรงเลื้อยห้อยลงสวย, โตเร็วกว่าใบใหญ่, เหมาะกระถางแขวน","en":"Small thin leaves with large fenestrations, attractive trailing habit, faster growing than large-leaved types, great for hanging pots"}',
  null,
  '{"th":"เลื้อยยาว 1-2 เมตร","en":"Trails 1-2 m long"}',
  '{"th":"ปักชำกิ่งในน้ำง่ายมากถ้าอยากขยายพันธุ์ ตัดแต่งปลายเถาเป็นระยะช่วยให้แตกกิ่งใหม่พุ่มแน่นขึ้นแทนที่จะเลื้อยยาวเส้นเดียว","en":"Very easy to propagate from stem cuttings in water. Regularly trim the vine tips to encourage bushier new growth instead of one long single trail."}',
  '{"th":"อเมริกากลางและอเมริกาใต้","en":"Central and South America"}',
  '{}',
  '{easy-care}',
  603
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'monstera-obliqua',
  'monstera',
  '🕸️',
  '{"th":"มอนสเตอร่า ออบลีกัว","en":"Monstera Obliqua (Unicorn Plant)"}',
  '{"th":"ออบลีกัวมีใบบางเฉียบโปร่งแสงคล้ายลูกไม้ มีรูทะลุมากกว่าเนื้อใบจริง เป็นมอนสเตอร่าที่หายากที่สุด ได้ฉายาไม้ยูนิคอร์นเพราะแทบไม่มีใครหาต้นแท้เจอ ต้นในตลาดส่วนใหญ่มักเป็นอดันโซนีที่สับสนชื่อกัน ราคาต้นแท้จึงสูงมาก","en":"Obliqua has paper-thin, almost translucent, lace-like leaves with more hole than actual leaf tissue. It''s the rarest monstera species, nicknamed the \"unicorn plant\" because genuine specimens are nearly impossible to find — most plants sold under this name in the trade are actually misidentified adansonii, which keeps true obliqua prices extremely high."}',
  '{"th":"ใบบางเฉียบโปร่งแสงคล้ายลูกไม้, รูทะลุมากกว่าเนื้อใบ, หายากที่สุดในสกุลมอนสเตอร่า, มักถูกสับสนกับอดันโซนี","en":"Paper-thin, translucent lace-like leaves, more hole than leaf tissue, the rarest species in the genus, frequently misidentified as adansonii"}',
  null,
  '{"th":"เลื้อยยาว 0.5-1 เมตร (ต้นเล็กมาก)","en":"Trails 0.5-1 m (a very small plant)"}',
  '{"th":"ต้องการความชื้นสูงมากเป็นพิเศษ มักปลูกในตู้เลี้ยงพืชปิดหรือเทอเรียมเพื่อคุมความชื้น เพราะใบบางมากจะเหี่ยวกรอบทันทีถ้าอากาศแห้ง","en":"Needs exceptionally high humidity — usually grown in a closed terrarium or plant cabinet to control moisture, since the extremely thin leaves wilt and crisp almost instantly in dry air."}',
  '{"th":"อเมริกากลางและตอนเหนือของอเมริกาใต้","en":"Central America and northern South America"}',
  '{}',
  '{rare}',
  604
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'monstera-peru',
  'monstera',
  '🌿',
  '{"th":"มอนสเตอร่า เปรู","en":"Monstera Peru (Karstenianum)"}',
  '{"th":"มอนสเตอร่าเปรูมีใบหนาเป็นมันย่นเป็นลอนคล้ายผิวเปลือกหอย ไม่มีรูทะลุเหมือนมอนสเตอร่าชนิดอื่นเลย ใบหนาเก็บน้ำได้ดีจึงทนแล้งและดูแลง่ายกว่ามาก เป็นตัวเลือกที่เหมาะกับมือใหม่หรือคนไม่ค่อยมีเวลารดน้ำ","en":"Monstera Peru has thick, glossy, quilted leaves with a texture like seashell ridges, and unlike its cousins it never develops fenestrations. The thick leaves store water well, making it far more drought-tolerant and low-maintenance — a good pick for beginners or anyone who forgets to water."}',
  '{"th":"ใบหนามันย่นเป็นลอน, ไม่มีรูทะลุ, ทนแล้งดีกว่าชนิดอื่น, ดูแลง่ายเหมาะมือใหม่","en":"Thick, glossy, quilted texture, never develops fenestrations, more drought-tolerant than other types, easy care for beginners"}',
  null,
  '{"th":"เลื้อยยาว 1-2 เมตร","en":"Trails 1-2 m long"}',
  '{"th":"ปล่อยให้ดินแห้งสนิทก่อนรดน้ำรอบใหม่ได้สบายเพราะใบเก็บน้ำไว้แล้ว รดน้ำเกินความจำเป็นเสี่ยงรากเน่ามากกว่าขาดน้ำ","en":"Safe to let the soil dry out completely before watering again, since the leaves already store water — overwatering risks root rot far more than underwatering does."}',
  '{"th":"อเมริกาใต้ตอนเหนือ (เปรู เวเนซุเอลา)","en":"Northern South America (Peru, Venezuela)"}',
  '{}',
  '{easy-care}',
  605
)
on conflict (id) do nothing;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect 6 rows, sort_order 600-605.
select id, name->>'th' as th, sort_order
  from public.plant_varieties
 where plant_id = 'monstera'
 order by sort_order;
