-- ============================================================
-- Orchid varieties: 6 genera researched online (see chat for sources),
-- covering Thailand's major export orchids (Dendrobium, Vanda), classic
-- florist/houseplant types (Cattleya, Phalaenopsis, Oncidium), and a native
-- Thai terrestrial genus (Paphiopedilum) -- deliberately mixing epiphytic
-- and terrestrial growth habits, the widest care spread of any variety set
-- added so far.
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Parent plant 'orchid' already exists — these rows only add
-- plant_varieties under it, no changes to the parent.
-- bloom_season is null for all 6: most of these bloom on a schedule driven
-- by the last dry/wet or rest/growth cycle rather than a fixed calendar
-- window, which the size/care_tip fields already capture; a blanket
-- bloom_season would be misleading rather than informative here.
--
-- sort_order uses a fresh, non-colliding block (400-405) following the
-- existing per-parent convention (fern 500-505, monstera 600-605,
-- rose 700-705, jasmine 800-806).
--
-- Safe to run more than once (`on conflict (id) do nothing`).
-- ============================================================

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'orchid-dendrobium',
  'orchid',
  '🌺',
  '{"th":"กล้วยไม้หวาย","en":"Dendrobium Orchid"}',
  '{"th":"กล้วยไม้หวายเป็นสกุลที่ปลูกเลี้ยงและส่งออกมากที่สุดของไทย เจริญเติบโตดีในสภาพอากาศบ้านเราโดยไม่ต้องปรับสภาพแวดล้อมพิเศษ ลำต้นข้อปล้องแตกช่อดอกสวยงาม ทนทานออกได้เกือบตลอดปีและมีสีสันหลากหลายที่สุด","en":"Dendrobium is Thailand''s most widely grown and exported orchid genus, thriving in the local climate without needing much special adjustment. Its jointed canes send up tall flower spikes from the nodes, and the sturdy blooms come in the widest range of colors of any orchid genus, flowering nearly year-round."}',
  '{"th":"ลำต้นข้อปล้องแตกช่อดอกสวย, ดูแลง่ายที่สุดในบรรดากล้วยไม้, ออกดอกเกือบตลอดปี, สีสันหลากหลายที่สุด","en":"Jointed canes with tall flower spikes, the easiest orchid genus to keep, blooms nearly year-round, the widest color range of any orchid"}',
  null,
  '{"th":"สูง 30-60 ซม.","en":"30-60 cm tall"}',
  '{"th":"รดน้ำเมื่อรากเปลี่ยนเป็นสีเขียวอมเทาแสดงว่าแห้งพอจะรดใหม่ ให้ปุ๋ยสูตรเสมอสัปดาห์ละครั้งช่วงแตกใบและเปลี่ยนเป็นสูตรเร่งดอกก่อนถึงฤดูออกดอก","en":"Water once the roots turn greyish-green, showing they''ve dried enough for the next round; feed weekly with a balanced fertilizer while leafing out, switching to a bloom-boosting formula before the flowering season"}',
  '{"th":"เอเชียตะวันออกเฉียงใต้ ออสเตรเลีย และหมู่เกาะแปซิฟิก","en":"Southeast Asia, Australia, and the Pacific Islands"}',
  '{}',
  '{bestseller,easy-care}',
  400
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'orchid-cattleya',
  'orchid',
  '🌸',
  '{"th":"กล้วยไม้แคทลียา","en":"Cattleya Orchid"}',
  '{"th":"แคทลียาได้ฉายาราชินีแห่งกล้วยไม้เพราะดอกขนาดใหญ่กลีบหนาสีสันสดใสและกลิ่นหอมแรงที่สุดในบรรดากล้วยไม้ทั่วไป ลำลูกกล้วยอวบเก็บน้ำและอาหารไว้ใช้ยามแล้ง ต้องพักตัวชัดเจนสลับกับช่วงเจริญเติบโตดอกจึงจะสวยสมบูรณ์","en":"Cattleya is nicknamed the queen of orchids for its large, thick-petaled, vividly colored flowers with the strongest fragrance of any common orchid. Its plump pseudobulbs store water and nutrients for dry spells, and it needs a clear rest period alternating with active growth for the blooms to reach full size and quality."}',
  '{"th":"ดอกใหญ่กลีบหนาสีสด, กลิ่นหอมแรงที่สุดในกล้วยไม้ทั่วไป, ลำลูกกล้วยเก็บน้ำ, ต้องพักตัวชัดเจนสลับเจริญเติบโต","en":"Large thick-petaled vividly colored blooms, the strongest fragrance among common orchids, water-storing pseudobulbs, needs a distinct rest-versus-growth cycle"}',
  null,
  '{"th":"สูง 30-50 ซม.","en":"30-50 cm tall"}',
  '{"th":"งดน้ำให้ลำลูกกล้วยเหี่ยวย่นเล็กน้อยช่วงพักตัวหลังใบโตเต็มที่ จะกระตุ้นให้ออกดอกดีกว่าการรดน้ำสม่ำเสมอตลอดปี","en":"Withhold water until the pseudobulbs shrivel slightly during the rest period after leaves mature — this triggers better blooming than watering evenly year-round"}',
  '{"th":"อเมริกากลางและอเมริกาใต้","en":"Central and South America"}',
  '{}',
  '{rare}',
  401
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'orchid-phalaenopsis',
  'orchid',
  '🦋',
  '{"th":"กล้วยไม้ฟาแลนนอปซิส","en":"Phalaenopsis (Moth Orchid)"}',
  '{"th":"ฟาแลนนอปซิสได้ฉายาว่ากล้วยไม้ผีเสื้อกลางคืนเพราะดอกแบนกว้างคล้ายปีกผีเสื้อ ใบอวบหนาไม่มีลำลูกกล้วยสะสมน้ำในใบแทน ทนสภาพในบ้านและวางในห้องแอร์ได้ดีกว่ากล้วยไม้ชนิดอื่น ดอกหนึ่งช่อบานได้ยาวนานหลายเดือนไม่ร่วง","en":"Phalaenopsis is called the moth orchid for its broad, flat flowers resembling moth wings. It has thick fleshy leaves rather than pseudobulbs, storing water there instead, and tolerates indoor and air-conditioned rooms better than most orchids — a single flower spike can stay in bloom for months without dropping."}',
  '{"th":"ดอกแบนกว้างคล้ายปีกผีเสื้อ, ใบอวบเก็บน้ำแทนลำลูกกล้วย, ทนอยู่ในห้องแอร์ได้ดี, ดอกบานทนหลายเดือน","en":"Broad flat flowers resembling moth wings, thick fleshy water-storing leaves instead of pseudobulbs, tolerates air-conditioned rooms well, a single bloom spike lasts months"}',
  null,
  '{"th":"สูง 30-50 ซม.","en":"30-50 cm tall"}',
  '{"th":"วางในที่แสงรำไรไม่โดนแดดจัดเด็ดขาดเพราะใบบางไหม้ง่าย ตัดก้านดอกเหนือข้อหลังดอกโรยเพื่อให้แตกช่อดอกใหม่จากข้อเดิมได้อีกรอบ","en":"Keep it in filtered light and never direct harsh sun — the leaves scorch easily. After blooms fade, cut the spike above a node to encourage a second flush from the same stem"}',
  '{"th":"เอเชียตะวันออกเฉียงใต้และฟิลิปปินส์","en":"Southeast Asia and the Philippines"}',
  '{}',
  '{bestseller,easy-care}',
  402
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'orchid-vanda',
  'orchid',
  '💜',
  '{"th":"กล้วยไม้แวนด้า","en":"Vanda Orchid"}',
  '{"th":"แวนด้าเป็นสัญลักษณ์กล้วยไม้ไทยที่ส่งออกไปทั่วโลก นิยมปลูกแขวนแบบรากลอยไม่ใช้เครื่องปลูกเลยเพื่อให้รากสัมผัสอากาศโดยตรง ต้องการแสงจัดและความชื้นสูงมากกว่ากล้วยไม้ทั่วไป ดอกออกเป็นช่อสีสันเข้มสดและมีขนาดใหญ่คงทน","en":"Vanda is an iconic Thai orchid exported worldwide, typically grown in a hanging basket with bare roots exposed directly to the air rather than potted in a growing medium. It needs brighter light and higher humidity than typical orchids, rewarding the effort with large, richly colored, long-lasting flower sprays."}',
  '{"th":"ปลูกแบบรากลอยไม่ใช้เครื่องปลูก, ต้องการแสงจัดและความชื้นสูงเป็นพิเศษ, ดอกช่อสีเข้มสดทนทาน, เป็นสัญลักษณ์กล้วยไม้ส่งออกไทย","en":"Grown bare-root with no potting medium, needs brighter light and higher humidity than typical orchids, richly colored long-lasting flower sprays, an iconic Thai export orchid"}',
  null,
  '{"th":"เลื้อยยาว 50-100 ซม.","en":"50-100 cm long"}',
  '{"th":"รดน้ำหรือพ่นละอองน้ำรากทุกวันเพราะรากลอยในอากาศแห้งเร็วมาก และแขวนในจุดที่ได้แดดรำไรครึ่งวันขึ้นไปเพื่อให้ออกดอกสม่ำเสมอ","en":"Water or mist the roots daily since bare roots exposed to open air dry out fast; hang it somewhere with at least half a day of bright filtered light for consistent blooming"}',
  '{"th":"เอเชียตะวันออกเฉียงใต้ รวมถึงไทย","en":"Southeast Asia, including Thailand"}',
  '{}',
  '{rare}',
  403
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'orchid-oncidium',
  'orchid',
  '💛',
  '{"th":"กล้วยไม้ออนซิเดียม","en":"Oncidium (Dancing Lady Orchid)"}',
  '{"th":"ออนซิเดียมได้ฉายาว่ากล้วยไม้สาวเต้นระบำเพราะดอกเล็กสีเหลืองลายน้ำตาลจำนวนมากไหวพลิ้วเป็นช่อยาวคล้ายกระโปรงนักเต้น ลำลูกกล้วยแบนรีเก็บน้ำ ต้องการอากาศถ่ายเทดีเป็นพิเศษเพราะรากไวต่อความอับชื้นมาก","en":"Oncidium is nicknamed the dancing lady orchid for its many small yellow-and-brown-spotted flowers swaying on a long spray like a dancer''s skirt. Its flattened oval pseudobulbs store water, and it needs especially good air circulation since its roots are more sensitive to stagnant humidity than other orchid types."}',
  '{"th":"ดอกเล็กสีเหลืองลายน้ำตาลเป็นช่อยาว, ลำลูกกล้วยแบนรีเก็บน้ำ, ต้องการอากาศถ่ายเทดีเป็นพิเศษ, รากไวต่อความอับชื้น","en":"Many small yellow-and-brown-spotted flowers on a long spray, flattened oval water-storing pseudobulbs, needs especially good air circulation, roots sensitive to stagnant humidity"}',
  null,
  '{"th":"สูง 30-45 ซม.","en":"30-45 cm tall"}',
  '{"th":"แขวนหรือวางในจุดที่มีลมพัดผ่านสม่ำเสมอ หลีกเลี่ยงมุมอับทึบเพราะรากเน่าง่ายกว่ากล้วยไม้สกุลอื่นมากถ้าอากาศไม่ถ่ายเท","en":"Hang or place it somewhere with steady airflow, avoiding stuffy corners — the roots rot far more easily than other orchid genera when air doesn''t circulate"}',
  '{"th":"อเมริกากลางและอเมริกาใต้","en":"Central and South America"}',
  '{}',
  '{}',
  404
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'orchid-paphiopedilum',
  'orchid',
  '👞',
  '{"th":"กล้วยไม้รองเท้านารี","en":"Paphiopedilum (Lady''s Slipper Orchid)"}',
  '{"th":"รองเท้านารีมีกลีบดอกล่างพองคล้ายรูปรองเท้าสตรีอันเป็นที่มาของชื่อ เป็นกล้วยไม้ดินไม่มีลำลูกกล้วยปลูกในวัสดุคล้ายดิน ไทยมีพันธุ์พื้นเมืองถึง 17 ชนิดแต่หลายชนิดเสี่ยงสูญพันธุ์และเป็นพืชอนุรักษ์","en":"Paphiopedilum has a swollen lower petal shaped like a woman''s slipper, which gives it its name. Unlike most orchids it''s terrestrial with no pseudobulbs, grown in a soil-like mix rather than typical orchid bark. Thailand has 17 native species, though many are endangered and legally protected."}',
  '{"th":"กลีบล่างพองรูปรองเท้าสตรี, เป็นกล้วยไม้ดินไม่มีลำลูกกล้วย, ปลูกในวัสดุคล้ายดิน, ไทยมีพันธุ์พื้นเมืองหลายชนิดที่เป็นพืชอนุรักษ์","en":"Slipper-shaped swollen lower petal, terrestrial with no pseudobulbs, grown in a soil-like mix, Thailand has several native species that are legally protected"}',
  null,
  '{"th":"สูง 25-35 ซม.","en":"25-35 cm tall"}',
  '{"th":"ให้ร่มเงามากกว่ากล้วยไม้อิงอาศัยทั่วไปเพราะเป็นกล้วยไม้ดินที่ขึ้นตามพื้นป่าธรรมชาติ และซื้อเฉพาะจากแหล่งเพาะเลี้ยงถูกกฎหมายเท่านั้นเพราะหลายสายพันธุ์เป็นพืชอนุรักษ์ห้ามเก็บจากป่า","en":"Give it more shade than typical epiphytic orchids, since it naturally grows on the forest floor; buy only from legally licensed nurseries, as many species are protected and collecting from the wild is prohibited"}',
  '{"th":"ไทยและเอเชียตะวันออกเฉียงใต้ (พบ 17 ชนิดในไทย)","en":"Thailand and Southeast Asia (17 species found in Thailand)"}',
  '{}',
  '{rare}',
  405
)
on conflict (id) do nothing;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect 6 rows, sort_order 400-405.
select id, name->>'th' as th, sort_order
  from public.plant_varieties
 where plant_id = 'orchid'
 order by sort_order;
