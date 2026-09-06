-- ============================================================
-- Rose varieties: 6 types researched online (see chat for sources), mixing
-- a native Thai heritage rose, distinct growth habits (dwarf potted,
-- clustered, climbing, classic florist), and a named Thai cultivar --
-- the same mix-of-species-and-cultivars approach used for the monstera
-- varieties.
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Parent plant 'rose' already exists — these rows only add plant_varieties
-- under it, no changes to the parent.
-- bloom_season is null for all 6: unlike jasmine, none of these roses have
-- a distinct seasonal bloom window worth calling out -- most flower nearly
-- year-round in Thailand's climate, so a bloom_season field would just
-- repeat "ตลอดปี" six times without adding information.
--
-- sort_order uses a fresh, non-colliding block (700-705) following the
-- existing per-parent convention (fern 500-505, monstera 600-605,
-- jasmine 800-806).
--
-- Safe to run more than once (`on conflict (id) do nothing`).
-- ============================================================

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'rose-damask',
  'rose',
  '🌸',
  '{"th":"กุหลาบมอญ","en":"Damask Rose"}',
  '{"th":"กุหลาบมอญเป็นกุหลาบดั้งเดิมที่ปลูกในไทยมาช้านาน กลีบดอกไม่หนาซ้อนมากแต่ส่งกลิ่นหอมแรงเป็นเอกลักษณ์ที่สุดในบรรดากุหลาบทุกสายพันธุ์ นิยมใช้กลีบดอกทำน้ำกุหลาบและร้อยมาลัยไทยมากกว่าใช้เป็นไม้ตัดดอกทั่วไป","en":"Damask rose has been grown in Thailand for generations. Its petals aren''t densely layered, but the fragrance is the strongest and most distinctive of any rose type — its petals are prized for making rosewater and Thai floral garlands more than as a typical cut flower."}',
  '{"th":"กลิ่นหอมแรงที่สุดในตระกูลกุหลาบ, กลีบบางไม่ซ้อนมาก, ใช้ทำน้ำกุหลาบและมาลัย, เป็นไม้พุ่มดั้งเดิมของไทย","en":"The strongest fragrance of any rose type, petals not densely layered, used for rosewater and garlands, a traditional Thai shrub rose"}',
  null,
  '{"th":"สูง 1-2 เมตร","en":"1-2 m tall"}',
  '{"th":"ตัดแต่งกิ่งหลังดอกโรยทุกรอบเพื่อกระตุ้นแตกยอดใหม่ เก็บดอกตอนเช้าตรู่ก่อนแดดจัดจะได้กลิ่นหอมเข้มข้นที่สุดสำหรับนำไปสกัด","en":"Prune after each bloom flush to trigger new shoots; harvest flowers early in the morning before the sun gets strong for the most concentrated fragrance when extracting rosewater"}',
  '{"th":"เอเชียตะวันตกเฉียงใต้ ปลูกในไทยมาแต่โบราณ","en":"Southwest Asia, long cultivated in Thailand"}',
  '{}',
  '{rare}',
  700
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'rose-fairy',
  'rose',
  '🌷',
  '{"th":"กุหลาบหนู","en":"Fairy Rose (Miniature Rose)"}',
  '{"th":"กุหลาบหนูเป็นกุหลาบแคระทรงพุ่มเตี้ยสูงเพียง 20-30 เซนติเมตร ดอกเล็กจิ๋วแต่ออกดกเต็มต้นแทบตลอดปี ปลูกในกระถางเล็กวางโต๊ะหรือระเบียงได้สวยงาม เป็นกุหลาบกระถางที่นิยมที่สุดในไทยเพราะดูแลง่ายกว่ากุหลาบพุ่มใหญ่มาก","en":"Fairy rose is a dwarf shrub only 20-30 cm tall, with tiny blooms that cover the whole plant almost year-round. It fits beautifully in a small pot on a table or balcony, and is Thailand''s most popular potted rose since it''s far easier to keep than the large shrub types."}',
  '{"th":"ทรงพุ่มแคระสูงแค่ 20-30 ซม., ดอกจิ๋วออกดกตลอดปี, ปลูกกระถางเล็กได้สวย, ดูแลง่ายกว่ากุหลาบพุ่มใหญ่","en":"Dwarf shrub only 20-30 cm tall, tiny blooms covering the plant nearly year-round, fits a small pot beautifully, easier to keep than large shrub roses"}',
  null,
  '{"th":"สูง 20-30 ซม.","en":"20-30 cm tall"}',
  '{"th":"รดน้ำที่โคนต้นแทนการรดโดนใบเพื่อลดความเสี่ยงโรคใบจุด และหมุนกระถางเป็นระยะให้ได้แดดทั่วทั้งต้นเพราะทรงเตี้ยบังแดดกันเองง่าย","en":"Water at the base rather than over the leaves to reduce leaf-spot disease, and rotate the pot periodically since its low, dense form can easily shade parts of itself from the sun"}',
  '{"th":"พันธุ์คัดแคระจากกุหลาบพุ่มทั่วไป","en":"A dwarf cultivar bred down from standard shrub roses"}',
  '{}',
  '{bestseller}',
  701
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'rose-spray',
  'rose',
  '💐',
  '{"th":"สเปรย์โรส","en":"Spray Rose (Sweetheart Rose)"}',
  '{"th":"สเปรย์โรสออกดอกเป็นช่อพวงหลายดอกต่อก้านแทนที่จะเป็นดอกเดี่ยวแบบกุหลาบตัดดอกทั่วไป ดอกขนาดเล็กกะทัดรัดทนทานต่อโรคดีกว่าไฮบริดที เป็นที่นิยมมากในงานจัดช่อดอกไม้และพวงหรีดเพราะให้ปริมาณดอกต่อก้านสูง","en":"Spray rose blooms in clusters of several flowers per stem instead of one large bloom like standard cut roses. The compact flowers are more disease-resistant than hybrid tea types, and it''s a favorite for bouquets and wreaths since one stem yields many blooms."}',
  '{"th":"ดอกออกเป็นช่อหลายดอกต่อก้าน, ทนโรคดีกว่าไฮบริดที, นิยมใช้จัดช่อและพวงหรีด, ดอกเล็กกะทัดรัด","en":"Blooms in clusters of multiple flowers per stem, more disease-resistant than hybrid teas, popular for bouquets and wreaths, compact flower size"}',
  null,
  '{"th":"สูง 60-100 ซม.","en":"60-100 cm tall"}',
  '{"th":"ตัดก้านให้เหลือตาไว้ 3-5 ตาต่อกิ่งหลังดอกโรยเพื่อให้แตกช่อดอกใหม่ได้เร็วและสม่ำเสมอ","en":"After blooms fade, cut stems back to 3-5 buds per branch so new flower clusters form quickly and evenly"}',
  '{"th":"พันธุ์ผสมพัฒนาเพื่อการค้าไม้ตัดดอก","en":"A hybrid developed for the commercial cut-flower trade"}',
  '{}',
  '{easy-care}',
  702
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'rose-climbing',
  'rose',
  '🧗',
  '{"th":"กุหลาบเลื้อย","en":"Climbing Rose"}',
  '{"th":"กุหลาบเลื้อยมีลำต้นยาวอ่อนไม่ตั้งตรงเหมือนกุหลาบพุ่ม ต้องผูกยึดกับซุ้มรั้วหรือโครงเหล็กให้เลื้อยขึ้นไป ออกดอกได้ทั้งดอกเดี่ยวและเป็นช่อพวงแล้วแต่พันธุ์ นิยมปลูกทำซุ้มประตูหรือกำแพงดอกไม้ให้ร่มเงาและความสวยงาม","en":"Climbing rose has long, flexible canes rather than an upright shrub form, and needs tying to an arch, fence, or trellis to climb. Depending on the variety it blooms in single large flowers or clusters, and is popular for a flowering archway or wall for both shade and beauty."}',
  '{"th":"ลำต้นยาวอ่อนต้องผูกยึดโครงให้เลื้อย, ดอกเดี่ยวหรือช่อแล้วแต่พันธุ์, นิยมทำซุ้มประตูหรือกำแพงดอกไม้, ให้ร่มเงาสวยงาม","en":"Long flexible canes need tying to a support to climb, single or clustered blooms depending on cultivar, popular for flowering arches or walls, provides shade and beauty"}',
  null,
  '{"th":"เลื้อยยาว 2-5 เมตร","en":"Climbs 2-5 m"}',
  '{"th":"ผูกกิ่งให้แนบขนานกับโครงเลื้อยแทนการปล่อยตั้งตรง เพราะกิ่งที่โน้มขนานพื้นจะกระตุ้นให้แตกตาดอกมากกว่ากิ่งที่ชี้ขึ้นตรง ๆ","en":"Train canes to run horizontally along the support rather than straight up — horizontal canes trigger far more flower buds than upright ones"}',
  '{"th":"พันธุ์ผสมจากกุหลาบป่าเลื้อยหลายสายพันธุ์","en":"A hybrid bred from several climbing wild rose species"}',
  '{}',
  '{}',
  703
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'rose-hybrid-tea',
  'rose',
  '🌹',
  '{"th":"กุหลาบไฮบริดที","en":"Hybrid Tea Rose"}',
  '{"th":"กุหลาบไฮบริดทีเป็นกุหลาบตัดดอกคลาสสิกที่ออกดอกเดี่ยวขนาดใหญ่ปลายก้าน กลีบหนาซ้อนเป็นทรงสวยแบบที่เห็นในช่อดอกไม้ร้านขายดอกไม้ทั่วไป ทนทานต่อโรคและแมลงดีกว่ากุหลาบดั้งเดิมมาก เพราะผ่านการปรับปรุงพันธุ์มายาวนาน","en":"Hybrid tea is the classic cut-flower rose, bearing one large bloom per stem with thick, elegantly layered petals — the shape most people picture at a flower shop. It''s far more disease- and pest-resistant than older heirloom roses thanks to generations of breeding."}',
  '{"th":"ดอกเดี่ยวขนาดใหญ่ปลายก้าน, กลีบหนาซ้อนทรงสวยแบบร้านดอกไม้, ทนโรคดีกว่ากุหลาบดั้งเดิม, ก้านยาวเหมาะตัดดอก","en":"One large bloom per stem, thick elegantly layered florist-style petals, more disease-resistant than heirloom roses, long stems ideal for cutting"}',
  null,
  '{"th":"สูง 90-150 ซม.","en":"90-150 cm tall"}',
  '{"th":"ให้ปุ๋ยสูตรเสมอทุก 2-3 สัปดาห์ช่วงออกดอก และตัดดอกโดยเหลือใบไว้อย่างน้อย 2 กลุ่มบนกิ่งเพื่อให้ต้นสร้างอาหารสำหรับดอกชุดต่อไปได้","en":"Feed with a balanced fertilizer every 2-3 weeks during bloom season, and when cutting flowers leave at least two leaf sets on the stem so the plant can fuel the next flush"}',
  '{"th":"พันธุ์ผสมระหว่างกุหลาบชาและกุหลาบไฮบริดเพอร์เพทชวล","en":"A hybrid cross between tea roses and hybrid perpetual roses"}',
  '{}',
  '{easy-care}',
  704
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'rose-chulalongkorn',
  'rose',
  '💗',
  '{"th":"กุหลาบจุฬาลงกรณ์","en":"Chulalongkorn Rose"}',
  '{"th":"กุหลาบจุฬาลงกรณ์เป็นกุหลาบพันธุ์ไทยที่ได้รับการตั้งชื่ออันทรงเกียรติ ดอกสีชมพูเข้มสดออกเป็นดอกเดี่ยวชูช่อสวยงามและมีกลิ่นหอม ออกดอกได้เกือบตลอดปีแต่ต้านทานโรคน้อยกว่าพันธุ์ใหม่จึงต้องดูแลใกล้ชิดกว่า","en":"Chulalongkorn rose is a Thai-named cultivar bearing deep pink single blooms held on elegant, upright stems with a pleasant fragrance. This medium shrub flowers nearly year-round, though it''s less disease-resistant than newer cultivars and needs closer attention."}',
  '{"th":"ดอกสีชมพูเข้มสดชูช่อสวย, มีกลิ่นหอม, ออกดอกเกือบตลอดปี, ต้านทานโรคน้อยกว่าพันธุ์ใหม่","en":"Deep pink single blooms held elegantly upright, pleasantly fragrant, blooms nearly year-round, less disease-resistant than newer cultivars"}',
  null,
  '{"th":"สูง 1-1.5 เมตร","en":"1-1.5 m tall"}',
  '{"th":"ฉีดพ่นป้องกันเชื้อราและเพลี้ยเป็นประจำทุก 1-2 สัปดาห์เพราะต้านทานโรคต่ำกว่าพันธุ์ทั่วไป โดยเฉพาะช่วงฤดูฝนที่ความชื้นสูง","en":"Spray preventively for fungus and aphids every 1-2 weeks since it resists disease less than modern cultivars, especially through the humid rainy season"}',
  '{"th":"พันธุ์กุหลาบไทยตั้งชื่อเพื่อเป็นเกียรติแด่พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว","en":"A Thai cultivar named in honor of King Chulalongkorn (Rama V)"}',
  '{}',
  '{rare}',
  705
)
on conflict (id) do nothing;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect 6 rows, sort_order 700-705.
select id, name->>'th' as th, sort_order
  from public.plant_varieties
 where plant_id = 'rose'
 order by sort_order;
