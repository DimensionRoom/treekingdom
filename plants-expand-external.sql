-- ============================================================
-- Expand the plants catalog: 53 new plants across the 11 categories that
-- currently have zero plants (palm, fruit, vegetable, annual, pine, herb,
-- grass, groundcover, tree, shrub, bulb), plus 2 plant_varieties rows.
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Content is written fresh (not copied from any source) after researching
-- common Thai garden plants for each category; see the chat for source links.
-- `levels` (0-100 comparative light/water/humidity/temp scale) are editorial
-- judgment calls, not measured values — same caveat as the existing 12 plants.
--
-- bulb and grass end up with 4 plants each instead of 5: reviewing the full
-- set for genus-level overlaps found that ปทุมมา (Siam Tulip) is a cultivated
-- selection of กระเจียว (Curcuma), and หญ้านวลน้อย (Manila grass) is the same
-- Zoysia genus as หญ้ามาเลเซีย (Malaysian grass) -- both pairs are filed as one
-- parent plant + one plant_varieties row instead of two separate plants, the
-- same way this app already treats เฟิร์น/มะลิ as one parent with several
-- named varieties rather than several standalone plants.
--
-- Each plants block is a standalone `insert ... on conflict (id) do nothing`,
-- so you can delete or comment out any block you don't want before running
-- this, and the whole file is safe to run more than once. The two
-- plant_varieties inserts near the end must stay AFTER the plants inserts
-- (plant_id is a foreign key) -- don't reorder them ahead of their parents.
--
-- These rows ship with NO images (images stays '{}'). Upload photos later
-- through /admin -- until then their cards show only the emoji.
-- ============================================================

-- ---------- ปาล์ม/ปรง (palm) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'sago-palm',
  'palm',
  '🌴',
  '{"th":"ปรงญี่ปุ่น","en":"Sago Palm"}',
  '{"th":"ปรงญี่ปุ่นมีใบขนนกแข็งสีเขียวเข้มเป็นมันแผ่รอบลำต้นทรงกลม โตช้ามากปีละไม่กี่ใบ ทนแล้งจัดได้ดีเยี่ยม นิยมปลูกเป็นไม้ประธานหน้าบ้านหรือในกระถางเพราะทรงสวยคงตัวได้นาน","en":"Sago palm has stiff, glossy dark-green feathery fronds radiating from a rounded trunk. It grows extremely slowly and tolerates severe drought, making it a popular, long-lasting centerpiece by the entrance or in a pot."}',
  '{"light":{"th":"แดดจัดถึงแดดจ้าทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้อย ทนแล้งได้ดี รอดินแห้งสนิทก่อนรดรอบใหม่","en":"Water sparingly; very drought-tolerant — let soil dry out fully between waterings"},"humidity":{"th":"ไม่จำเป็นต้องมีความชื้นสูง","en":"Low humidity requirement"},"temp":{"th":"20-35°C","en":"20-35°C"},"soil":{"th":"ดินร่วนปนทราย ระบายน้ำดีมาก","en":"Sandy loam, very well-draining"},"tips":{"th":"ใส่ปุ๋ยคอกที่โคนต้นปีละ 2 ครั้งก็เพียงพอ อย่ารดน้ำถี่เพราะรากเน่าง่ายกว่าตายเพราะขาดน้ำ","en":"Feed with manure around the base twice a year — that''s enough; overwatering kills it faster than drought ever will"}}',
  '{"light":90,"water":20,"humidity":20,"temp":40}',
  '{}',
  '{}',
  12
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'yellow-palm',
  'palm',
  '🌴',
  '{"th":"หมากเหลือง","en":"Yellow Palm (Areca Palm)"}',
  '{"th":"หมากเหลืองแตกกอลำต้นเรียวสีเหลืองอมเขียวหลายต้นในกอเดียว ใบขนนกโค้งสวยให้ร่มเงาแบบโปร่งสบาย นิยมปลูกเป็นแนวรั้วธรรมชาติหรือไม้กระถางประดับมุมบ้านเพราะดูแลง่าย","en":"Areca palm forms a clump of slender yellow-green canes topped with graceful arching fronds. Popular as a natural privacy screen or a low-maintenance potted accent for a home corner."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร ยิ่งแดดจัดลำต้นยิ่งเป็นกอสวย","en":"Full sun to bright indirect — more sun makes tighter, prettier clumps"},"water":{"th":"รดน้ำสม่ำเสมอเมื่อหน้าดินแห้ง","en":"Water regularly once the topsoil dries"},"humidity":{"th":"ชอบความชื้นปานกลางถึงสูง","en":"Prefers moderate to high humidity"},"temp":{"th":"20-33°C","en":"20-33°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"เช็ดใบเป็นครั้งคราวกันฝุ่นเกาะ และแยกกอเมื่อแน่นเกินไปเพื่อให้ลำต้นไม่แย่งอาหารกัน","en":"Wipe the fronds occasionally to keep dust off, and divide the clump when it gets crowded so canes don''t compete for nutrients"}}',
  '{"light":65,"water":55,"humidity":55,"temp":30}',
  '{easy-care}',
  '{}',
  13
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'bamboo-palm',
  'palm',
  '🎋',
  '{"th":"ปาล์มไผ่","en":"Bamboo Palm"}',
  '{"th":"ปาล์มไผ่มีลำต้นเล็กเรียวคล้ายไม้ไผ่แตกกอเป็นพุ่มหนา ใบขนนกสีเขียวเข้ม ทนร่มได้ดีกว่าปาล์มชนิดอื่น จึงเป็นตัวเลือกยอดนิยมสำหรับปลูกในบ้านหรือมุมที่แสงน้อย","en":"Bamboo palm has slender canes resembling bamboo, clustering into a dense, dark-green feathery clump. It tolerates shade better than most palms, making it a favorite for indoor corners with low light."}',
  '{"light":{"th":"ร่มรำไรถึงแสงน้อย ไม่ควรโดนแดดจัดโดยตรง","en":"Bright indirect to low light — avoid direct harsh sun"},"water":{"th":"รดน้ำเมื่อหน้าดินแห้ง อย่าปล่อยแฉะ","en":"Water when the topsoil dries; don''t let it stay soggy"},"humidity":{"th":"ชอบความชื้นสูง","en":"Prefers high humidity"},"temp":{"th":"18-28°C","en":"18-28°C"},"soil":{"th":"ดินร่วนผสมอินทรียวัตถุ ระบายน้ำดี","en":"Loamy, organic-rich, well-draining soil"},"tips":{"th":"พ่นละอองน้ำใบเป็นประจำเพื่อเพิ่มความชื้นถ้าปลูกในห้องแอร์","en":"Mist the fronds regularly to boost humidity if kept in an air-conditioned room"}}',
  '{"light":30,"water":60,"humidity":65,"temp":25}',
  '{air-purify}',
  '{}',
  14
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'red-palm',
  'palm',
  '🌺',
  '{"th":"หมากแดง","en":"Red Sealing Wax Palm"}',
  '{"th":"หมากแดงโดดเด่นด้วยกาบใบสีแดงสดสว่างตัดกับใบเขียวเข้ม เป็นปาล์มที่สวยงามเฉพาะตัวที่สุดชนิดหนึ่ง ต้องการความชื้นสูงมากจึงมักปลูกริมน้ำหรือสวนเขตร้อนชื้น","en":"Red sealing wax palm stands out with a bright red crown shaft against dark green fronds — one of the most strikingly beautiful palms. It needs very high humidity, so it''s usually grown by water features or in humid tropical gardens."}',
  '{"light":{"th":"แดดรำไรถึงแดดจัด","en":"Bright indirect to full sun"},"water":{"th":"รดน้ำสม่ำเสมอ ห้ามขาดน้ำ","en":"Water consistently; never let it dry out"},"humidity":{"th":"ต้องการความชื้นสูงมาก","en":"Requires very high humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนชุ่มชื้น ระบายน้ำดีแต่ไม่แห้งเร็ว","en":"Moist, well-draining loam that doesn''t dry out fast"},"tips":{"th":"ปลูกใกล้แหล่งน้ำหรือพ่นละอองน้ำบ่อย ๆ กาบใบสีแดงจะสวยสดก็ต่อเมื่อความชื้นเพียงพอ","en":"Plant near water or mist frequently — the red crown shaft only stays vivid when humidity is sufficient"}}',
  '{"light":60,"water":70,"humidity":85,"temp":30}',
  '{rare}',
  '{}',
  15
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'bottle-palm',
  'palm',
  '🌴',
  '{"th":"ปาล์มขวด","en":"Bottle Palm"}',
  '{"th":"ปาล์มขวดมีลำต้นป่องกลางคล้ายรูปขวดเก็บน้ำไว้ใช้ยามแล้ง ทรงต้นแปลกตาโตช้าและเตี้ย เหมาะปลูกเป็นจุดเด่นในสวนขนาดเล็กหรือข้างทางเดินเพราะไม่กินพื้นที่มาก","en":"Bottle palm has a distinctive bulging, bottle-shaped trunk that stores water for dry spells. Slow-growing and compact, it makes a striking accent for a small garden or a walkway without taking up much space."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลาง ทนแล้งได้ดีเมื่อโตเต็มที่","en":"Water moderately; quite drought-tolerant once established"},"humidity":{"th":"ทนความชื้นต่ำได้ดี","en":"Tolerates low humidity well"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินร่วนปนทรายระบายน้ำเร็ว","en":"Fast-draining sandy loam"},"tips":{"th":"หลีกเลี่ยงดินแฉะเด็ดขาดเพราะลำต้นป่องเก็บน้ำอยู่แล้ว รากเน่าง่ายถ้าดินระบายน้ำไม่ดี","en":"Avoid soggy soil at all costs — the swollen trunk already stores water, and roots rot easily in poor drainage"}}',
  '{"light":90,"water":25,"humidity":25,"temp":35}',
  '{rare}',
  '{}',
  16
)
on conflict (id) do nothing;


-- ---------- ผลไม้ (fruit) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'lime',
  'fruit',
  '🍋',
  '{"th":"มะนาว","en":"Lime"}',
  '{"th":"มะนาวเป็นไม้ผลคู่ครัวไทยที่ขาดไม่ได้ ทรงพุ่มเตี้ยมีหนาม ให้ผลดกตลอดปีถ้าดูแลดี ปลูกในกระถางใหญ่หรือลงดินก็ได้ นิยมปลูกไว้ใช้เองเพราะประหยัดและได้ผลสดตลอด","en":"Lime is an essential Thai kitchen fruit tree — a low, thorny shrub that bears heavily year-round when well cared for. It grows fine in a large pot or in the ground, and is popular for home use since it saves money and gives fresh fruit constantly."}',
  '{"light":{"th":"แดดจัดอย่างน้อย 6 ชั่วโมงต่อวัน","en":"At least 6 hours of full sun daily"},"water":{"th":"รดน้ำสม่ำเสมอ อย่าให้ดินแห้งจัดตอนติดผล","en":"Water regularly; don''t let soil go bone-dry while fruiting"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-33°C","en":"20-33°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์ ระบายน้ำดี","en":"Fertile, well-draining loam"},"tips":{"th":"ใส่ปุ๋ยสูตรเสมอทุกเดือน ตัดแต่งกิ่งแห้งและกิ่งไขว้เป็นประจำเพื่อให้ทรงพุ่มโปร่งออกผลดี","en":"Feed monthly with a balanced fertilizer, and regularly prune dead or crossing branches to keep the canopy open for good fruiting"}}',
  '{"light":85,"water":55,"humidity":45,"temp":30}',
  '{}',
  '{}',
  17
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'papaya',
  'fruit',
  '🌱',
  '{"th":"มะละกอ","en":"Papaya"}',
  '{"th":"มะละกอโตเร็วเป็นไม้ผลที่ให้ผลผลิตไวที่สุดชนิดหนึ่ง ลำต้นตรงไม่แตกกิ่ง ใบเป็นแฉกใหญ่ที่ปลายยอด ปลูกง่ายในสวนหลังบ้านหรือกระถางใหญ่ ให้ผลได้ภายในปีเดียว","en":"Papaya is one of the fastest-fruiting trees you can grow — a single unbranched trunk topped with large lobed leaves. Easy to grow in a backyard or a big pot, it can bear fruit within a single year."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้ำสม่ำเสมอ ต้องการน้ำมากช่วงติดผล","en":"Water regularly; needs plenty of water while fruiting"},"humidity":{"th":"ปานกลางถึงสูง","en":"Moderate to high humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์ ระบายน้ำดีมาก ไม่ชอบน้ำขัง","en":"Fertile, very well-draining soil — hates waterlogging"},"tips":{"th":"ตากดินฆ่าเชื้อก่อนปลูกประมาณ 5 วัน และเว้นระยะปลูกให้โปร่งเพื่อลดโรครากเน่า","en":"Sun-dry the soil for about 5 days before planting to kill pathogens, and space plants well to reduce root-rot disease"}}',
  '{"light":90,"water":65,"humidity":55,"temp":32}',
  '{}',
  '{}',
  18
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'banana',
  'fruit',
  '🍌',
  '{"th":"กล้วยน้ำว้า","en":"Banana"}',
  '{"th":"กล้วยน้ำว้าเป็นไม้ผลคู่บ้านคนไทยมาแต่โบราณ ใบใหญ่ให้ร่มเงาดี ปลูกครั้งเดียวแตกหน่อได้เรื่อย ๆ ไม่ต้องปลูกซ้ำ ผลใช้ได้ทั้งกินสดและแปรรูปเป็นขนมหลายชนิด","en":"Banana has long been a staple Thai dooryard fruit tree — big broad leaves for shade, and once planted it keeps sending up new shoots without replanting. The fruit is eaten fresh or turned into countless Thai desserts."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"ต้องการน้ำมากสม่ำเสมอ","en":"Needs plenty of consistent water"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"20-35°C","en":"20-35°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์ เก็บความชื้นได้ดี","en":"Fertile loam that retains moisture well"},"tips":{"th":"ตัดใบแห้งออกเป็นประจำ และเลี้ยงหน่อไว้แค่ 2-3 หน่อต่อกอเพื่อให้ลำต้นแม่แข็งแรงออกเครือใหญ่","en":"Trim off dry leaves regularly, and keep only 2-3 suckers per clump so the parent stem stays strong enough for a big bunch"}}',
  '{"light":70,"water":75,"humidity":75,"temp":30}',
  '{}',
  '{}',
  19
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'guava',
  'fruit',
  '🍈',
  '{"th":"ฝรั่ง","en":"Guava"}',
  '{"th":"ฝรั่งเป็นไม้ผลที่ปลูกง่ายที่สุดชนิดหนึ่ง ทนแล้งทนโรคได้ดี ให้ผลตลอดปีเมื่อโตเต็มที่ ผลกรอบหวานอุดมวิตามินซีสูง นิยมปลูกในกระถางใหญ่หรือริมรั้วบ้าน","en":"Guava is among the easiest fruit trees to grow — drought- and disease-tolerant, fruiting year-round once mature. The crisp, sweet fruit is loaded with vitamin C, and it''s popular in a large pot or along a garden fence."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดสม่ำเสมอช่วงแรก โตแล้วทนแล้งได้ดี","en":"Water regularly while young; drought-tolerant once mature"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-33°C","en":"20-33°C"},"soil":{"th":"ดินร่วนปนทราย ระบายน้ำดี","en":"Sandy loam, well-draining"},"tips":{"th":"ห่อผลด้วยถุงตาข่ายกันแมลงวันทองช่วงผลยังอ่อน จะได้ผลสวยไม่มีหนอน","en":"Bag young fruit with a fine mesh to keep fruit flies out — this keeps the fruit clean and worm-free"}}',
  '{"light":85,"water":45,"humidity":45,"temp":30}',
  '{easy-care}',
  '{}',
  20
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'kaffir-lime',
  'fruit',
  '🍃',
  '{"th":"มะกรูด","en":"Kaffir Lime"}',
  '{"th":"มะกรูดมีใบหอมเป็นเอกลักษณ์เฉพาะตัวคอดเป็นสองตอน ผลผิวขรุขระให้น้ำมันหอมระเหย เป็นเครื่องปรุงสำคัญของอาหารไทยแทบทุกครัว ปลูกไว้ใช้ในบ้านได้ทั้งใบและผล","en":"Kaffir lime has a signature figure-eight-shaped fragrant leaf and a bumpy-skinned fruit rich in essential oils. It''s an essential seasoning in Thai cooking, and a home plant gives you both leaves and fruit whenever needed."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"รดปานกลาง ทนแล้งได้พอสมควร","en":"Water moderately; fairly drought-tolerant"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-33°C","en":"20-33°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"เด็ดใบใช้ได้เรื่อย ๆ โดยไม่ทำร้ายต้น เก็บใบแก่ก่อนจะหอมกว่าใบอ่อน","en":"Pick leaves as needed without harming the tree — mature leaves are more fragrant than young ones"}}',
  '{"light":80,"water":40,"humidity":40,"temp":30}',
  '{easy-care}',
  '{}',
  21
)
on conflict (id) do nothing;


-- ---------- ผัก (vegetable) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'water-spinach',
  'vegetable',
  '🥬',
  '{"th":"ผักบุ้ง","en":"Water Spinach"}',
  '{"th":"ผักบุ้งเป็นผักที่โตเร็วที่สุดชนิดหนึ่ง หว่านเมล็ดแล้วเก็บกินได้ในไม่ถึงเดือน ปลูกได้ทั้งในกระถางแบบบกและแบบลอยน้ำ เหมาะกับมือใหม่ที่อยากเห็นผลเร็ว","en":"Water spinach is one of the fastest-growing vegetables — sow seeds and harvest in under a month. It can be grown in a regular pot or floated in water, making it a great pick for beginners who want quick results."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"ต้องการน้ำมาก ดินหรือน้ำต้องชุ่มตลอด","en":"Needs plenty of water — soil or water must stay consistently moist"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์เก็บความชื้นดี หรือปลูกในน้ำได้เลย","en":"Fertile, moisture-retentive loam, or grow directly in water"},"tips":{"th":"เก็บยอดก่อนอายุ 25 วันจะได้ใบกรอบอร่อยที่สุด ตัดแล้วแตกยอดใหม่เก็บซ้ำได้เรื่อย ๆ","en":"Harvest before 25 days for the crispest, tastiest shoots — cutting encourages new shoots you can harvest again and again"}}',
  '{"light":75,"water":85,"humidity":70,"temp":30}',
  '{easy-care}',
  '{}',
  22
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'chinese-kale',
  'vegetable',
  '🥦',
  '{"th":"คะน้า","en":"Chinese Kale"}',
  '{"th":"คะน้าเป็นผักใบเขียวยอดนิยมที่ปลูกได้แม้พื้นที่จำกัด ให้ผลผลิตดีมีคุณค่าทางโภชนาการสูง ใช้เวลาปลูกประมาณ 40-50 วันก็เก็บเกี่ยวได้ เหมาะปลูกในกระถางหน้าบ้าน","en":"Chinese kale is a popular leafy green that thrives even in a small space, giving good yields with high nutritional value. It takes about 40-50 days to reach harvest and grows well in a front-yard pot."}',
  '{"light":{"th":"แดดจัดเต็มวัน","en":"Full sun all day"},"water":{"th":"รดน้ำสม่ำเสมอทุกวัน อย่าให้ดินแห้ง","en":"Water daily and consistently — don''t let the soil dry out"},"humidity":{"th":"ปานกลางถึงสูง","en":"Moderate to high humidity"},"temp":{"th":"20-30°C","en":"20-30°C"},"soil":{"th":"ดินร่วนมีธาตุอาหารเพียงพอ ระบายน้ำดี","en":"Nutrient-rich, well-draining loam"},"tips":{"th":"ใส่ปุ๋ยไนโตรเจนช่วยให้ใบเขียวเข้มและโตไว เก็บเกี่ยวตอนเช้าจะได้ผักกรอบสดที่สุด","en":"Nitrogen feeding keeps leaves dark green and speeds growth — harvest in the morning for the crispest greens"}}',
  '{"light":85,"water":60,"humidity":55,"temp":27}',
  '{}',
  '{}',
  23
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'chili',
  'vegetable',
  '🌶️',
  '{"th":"พริกขี้หนู","en":"Thai Chili"}',
  '{"th":"พริกขี้หนูเป็นเครื่องเทศประจำครัวไทยที่ให้ผลผลิตยาวนานเป็นปี ผลเล็กแต่เผ็ดจัดจ้าน ปลูกในกระถางแดดจัดที่ระเบียงหรือหน้าบ้านก็ให้ผลดกได้ทั้งปี","en":"Thai chili is a kitchen staple that keeps producing for a full year. The fruits are tiny but fiercely hot, and a sunny balcony or front-yard pot will keep it fruiting heavily year-round."}',
  '{"light":{"th":"แดดจัดอย่างน้อย 6 ชั่วโมง","en":"At least 6 hours of full sun"},"water":{"th":"รดปานกลาง อย่าให้ดินแฉะจะรากเน่า","en":"Water moderately — soggy soil causes root rot"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนระบายน้ำดีมาก","en":"Very well-draining loam"},"tips":{"th":"เด็ดยอดตอนต้นยังเล็กช่วยให้แตกกิ่งเยอะออกดอกมากขึ้น เก็บผลสุกบ่อย ๆ จะกระตุ้นให้ติดผลชุดใหม่ต่อเนื่อง","en":"Pinch the growing tip while young to encourage more branching and flowers; frequent harvesting of ripe pods triggers new fruit sets"}}',
  '{"light":85,"water":40,"humidity":45,"temp":30}',
  '{easy-care}',
  '{}',
  24
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'thai-eggplant',
  'vegetable',
  '🍆',
  '{"th":"มะเขือเปราะ","en":"Thai Eggplant"}',
  '{"th":"มะเขือเปราะให้ผลกรอบกลมสีเขียวลายขาว เป็นผักคู่ครัวที่ใช้จิ้มน้ำพริกหรือแกงได้หลากหลาย ปลูกในกระถางขนาดกลางแล้วเก็บผลได้ต่อเนื่องนานหลายเดือน","en":"Thai eggplant produces crisp, round, green-and-white striped fruit — a kitchen essential for dipping with chili paste or curries. Grown in a medium pot, it keeps yielding fruit for months on end."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้ำสม่ำเสมอ อย่าให้ดินแห้งจัด","en":"Water consistently — don''t let the soil dry out completely"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์ ระบายน้ำดี","en":"Fertile, well-draining loam"},"tips":{"th":"ใส่ปุ๋ยคอกรองก้นหลุมตั้งแต่แรกปลูก และเก็บผลอ่อนสม่ำเสมอเพื่อกระตุ้นการติดผลใหม่","en":"Mix manure into the planting hole from the start, and pick young fruit regularly to keep new ones coming"}}',
  '{"light":85,"water":55,"humidity":50,"temp":30}',
  '{}',
  '{}',
  25
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'green-onion',
  'vegetable',
  '🌿',
  '{"th":"ต้นหอม","en":"Green Onion (Scallion)"}',
  '{"th":"ต้นหอมปลูกง่ายแค่ปักโคนที่เหลือจากครัวลงดินหรือน้ำก็แตกยอดใหม่ได้ ใบเรียวยาวกลิ่นฉุนอ่อน ใช้โรยหน้าอาหารได้แทบทุกเมนู เหมาะปลูกในกระถางเล็กริมหน้าต่างครัว","en":"Green onion is almost effortless to grow — just stick a leftover kitchen root end into soil or water and it resprouts. Its slender, mildly pungent leaves garnish almost any dish, perfect for a small pot by the kitchen window."}',
  '{"light":{"th":"แดดรำไรถึงแดดจัด","en":"Bright indirect to full sun"},"water":{"th":"รดน้ำสม่ำเสมอให้ดินชื้นตลอด","en":"Water consistently to keep soil evenly moist"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"18-28°C","en":"18-28°C"},"soil":{"th":"ดินร่วนหรือปลูกในน้ำก็ได้","en":"Loamy soil or plain water both work"},"tips":{"th":"ตัดใช้เฉพาะส่วนใบเขียวแล้วเหลือโคนไว้ ต้นจะแตกยอดใหม่ให้เก็บได้เรื่อย ๆ ไม่ต้องปลูกซ้ำ","en":"Cut only the green leaves and leave the base — it keeps resprouting so you never have to replant"}}',
  '{"light":60,"water":65,"humidity":50,"temp":25}',
  '{easy-care}',
  '{}',
  26
)
on conflict (id) do nothing;


-- ---------- พืชล้มลุก (annual) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'marigold',
  'annual',
  '🌼',
  '{"th":"ดาวเรือง","en":"Marigold"}',
  '{"th":"ดาวเรืองเป็นไม้ดอกล้มลุกยอดนิยมสีเหลืองส้มสดใส ปลูกง่ายออกดอกไวภายใน 45-50 วัน กลิ่นฉุนช่วยไล่แมลงได้ในตัว เป็นดอกไม้มงคลที่คนไทยนิยมปลูกไหว้พระ","en":"Marigold is a beloved annual with vivid yellow-orange blooms, easy to grow and flowering within 45-50 days. Its pungent scent naturally repels insects, and it''s a auspicious flower Thais commonly grow for merit-making offerings."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้อย ๆ แต่บ่อย ชอบชื้นแต่ไม่ชอบแฉะ","en":"Water lightly but often — likes moisture, hates soggy soil"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-32°C","en":"20-32°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ใส่ปุ๋ยสูตรเสมอเมื่อมีใบจริง 2-3 คู่ เด็ดดอกโรยทิ้งสม่ำเสมอจะได้ดอกใหม่ต่อเนื่อง","en":"Feed with a balanced fertilizer once true leaves appear, and deadhead spent blooms regularly to keep new flowers coming"}}',
  '{"light":90,"water":45,"humidity":40,"temp":30}',
  '{easy-care}',
  '{}',
  27
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'zinnia',
  'annual',
  '🌸',
  '{"th":"บานชื่น","en":"Zinnia"}',
  '{"th":"บานชื่นออกดอกสีสันสดใสหลากสีในต้นเดียวกัน ทนแดดทนร้อนได้ดีเยี่ยม โตไวออกดอกตลอดฤดู เหมาะปลูกประดับแปลงหรือกระถางเพื่อเพิ่มสีสันให้สวนอย่างรวดเร็ว","en":"Zinnia bursts with vividly colored blooms in many shades and tolerates heat exceptionally well. Fast-growing and long-flowering through the season, it''s ideal for quickly adding color to a garden bed or pot."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลาง อย่ารดโดนใบเพราะเสี่ยงราแป้ง","en":"Water moderately; avoid wetting the leaves to prevent powdery mildew"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-32°C","en":"20-32°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"เด็ดยอดตอนต้นเล็กช่วยให้แตกกอพุ่มแน่นออกดอกดกขึ้น","en":"Pinch the growing tip while young to encourage a fuller, more floriferous bush"}}',
  '{"light":90,"water":40,"humidity":40,"temp":32}',
  '{easy-care}',
  '{}',
  28
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'cosmos',
  'annual',
  '🌸',
  '{"th":"ดาวกระจาย","en":"Cosmos"}',
  '{"th":"ดาวกระจายมีดอกบางเบาสีสันหวานพลิ้วตามลม ต้นสูงโปร่งใบเป็นฝอยละเอียด ปลูกง่ายจากเมล็ดโดยตรง ให้บรรยากาศทุ่งดอกไม้แบบธรรมชาติในสวนบ้าน แม้อายุค่อนข้างสั้น","en":"Cosmos has delicate, sweetly colored blooms that sway in the breeze atop tall, airy stems with fine ferny leaves. Easy to grow direct from seed, it gives a garden a natural wildflower-meadow feel, though its lifespan is fairly short."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลาง ทนแล้งได้ดีพอสมควร","en":"Water moderately; fairly drought-tolerant"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-32°C","en":"20-32°C"},"soil":{"th":"ดินร่วนธรรมดา ไม่ต้องอุดมสมบูรณ์มาก","en":"Ordinary loam — doesn''t need to be especially rich"},"tips":{"th":"ไม่ต้องใส่ปุ๋ยมากเพราะดินอุดมเกินจะทำให้ใบดกแต่ดอกน้อยลง ปักหลักพยุงต้นสูงกันลมโค่น","en":"Skip heavy feeding — overly rich soil produces more leaves and fewer flowers; stake tall stems to keep wind from toppling them"}}',
  '{"light":90,"water":35,"humidity":35,"temp":32}',
  '{}',
  '{}',
  29
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'petunia',
  'annual',
  '🌺',
  '{"th":"พิทูเนีย","en":"Petunia"}',
  '{"th":"พิทูเนียให้ดอกทรงแตรสีสันหลากหลายบานสะพรั่งเต็มกระถาง เหมาะปลูกแบบห้อยแขวนหรือใส่กระบะประดับระเบียง ดอกดกและออกต่อเนื่องถ้าตัดแต่งดูแลสม่ำเสมอ","en":"Petunia produces trumpet-shaped flowers in a rainbow of colors that spill and overflow a pot beautifully. It''s popular for hanging baskets or balcony planters, blooming heavily and continuously with regular care."}',
  '{"light":{"th":"แดดจัดครึ่งวันขึ้นไป","en":"At least half a day of full sun"},"water":{"th":"รดสม่ำเสมอ อย่าให้ดินแห้งจัดหรือแฉะเกินไป","en":"Water consistently — avoid letting soil go bone-dry or stay soggy"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"18-28°C","en":"18-28°C"},"soil":{"th":"ดินร่วนระบายน้ำดี อุดมอินทรียวัตถุ","en":"Well-draining, organic-rich loam"},"tips":{"th":"ตัดแต่งกิ่งยาวที่โทรมทิ้งเป็นระยะเพื่อกระตุ้นแตกกิ่งใหม่และดอกดกขึ้นอีกรอบ","en":"Periodically trim back leggy, tired stems to trigger fresh branching and another flush of blooms"}}',
  '{"light":75,"water":55,"humidity":45,"temp":26}',
  '{}',
  '{}',
  30
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'lantana',
  'annual',
  '🌼',
  '{"th":"ผกากรอง","en":"Lantana"}',
  '{"th":"ผกากรองออกดอกเป็นช่อกลมหลายสีในดอกเดียวกันคล้ายพวงมาลัยจิ๋ว ทนแดดทนแล้งสุดขีดแทบไม่ต้องดูแล ดึงดูดผีเสื้อได้ดี นิยมปลูกเป็นไม้ประดับริมทางหรือคลุมดิน","en":"Lantana blooms in round clusters that shift through multiple colors in a single flower head. Extremely heat- and drought-tolerant with almost no upkeep, it attracts butterflies and is popular along walkways or as a groundcover."}',
  '{"light":{"th":"แดดจัดทั้งวัน ยิ่งแดดจัดยิ่งออกดอกดก","en":"Full sun all day — more sun means more blooms"},"water":{"th":"รดน้อย ทนแล้งได้ดีมาก","en":"Water sparingly; extremely drought-tolerant"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินแทบทุกชนิด ขอแค่ระบายน้ำได้","en":"Almost any soil, as long as it drains"},"tips":{"th":"แทบไม่ต้องดูแลเลยหลังตั้งตัวได้ ตัดแต่งทรงพุ่มปีละครั้งสองครั้งก็พอ","en":"Needs almost no care once established — a light shaping prune once or twice a year is enough"}}',
  '{"light":95,"water":20,"humidity":25,"temp":40}',
  '{easy-care}',
  '{}',
  31
)
on conflict (id) do nothing;


-- ---------- สน (pine) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'norfolk-pine',
  'pine',
  '🌲',
  '{"th":"สนฉัตร","en":"Norfolk Island Pine"}',
  '{"th":"สนฉัตรมีกิ่งแตกเป็นชั้น ๆ รอบลำต้นคล้ายฉัตรซ้อนกันเป็นรูปกรวยสวยงามเป็นระเบียบ ใบเขียวอ่อนนุ่ม โตช้าและทรงต้นคงรูปได้ดี นิยมปลูกเป็นไม้ประธานหรือประดับในกระถาง","en":"Norfolk Island pine grows in neat tiered layers of branches around the trunk, forming an elegant conical, pagoda-like shape. With soft light-green foliage and slow, stable growth, it''s a favorite centerpiece tree or potted accent."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"รดปานกลาง รอดินแห้งหน้าดินก่อนรดใหม่","en":"Water moderately; let the topsoil dry before watering again"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"18-30°C","en":"18-30°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"หมุนกระถางเป็นระยะให้ได้แดดทั่วถึงเพื่อทรงต้นสมมาตรสวยงาม","en":"Rotate the pot periodically so all sides get even sun for a symmetrical shape"}}',
  '{"light":70,"water":45,"humidity":45,"temp":28}',
  '{}',
  '{}',
  32
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'juniper-pine',
  'pine',
  '🌲',
  '{"th":"สนแผง","en":"Juniper Pine"}',
  '{"th":"สนแผงเป็นไม้พุ่มถึงไม้ต้นขนาดเล็กเปลือกสีน้ำตาลอมแดง แตกกิ่งหนาแน่นเป็นแผงคล้ายสนเข็ม โตเร็วและปลูกง่าย นิยมตัดแต่งเป็นทรงพุ่มหรือบอนไซประดับสวน","en":"Juniper pine is a small shrub-to-tree with reddish-brown bark and densely packed, needle-like branchlets. Fast-growing and easy to keep, it''s popular for topiary shaping or as garden bonsai material."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"ต้องการน้ำมาก รดสม่ำเสมอ","en":"Needs plenty of water; keep it consistent"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-33°C","en":"20-33°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ตัดแต่งทรงพุ่มสม่ำเสมอเพราะโตเร็ว จะช่วยรักษาทรงและกระตุ้นให้กิ่งแน่นสวย","en":"Prune regularly since it grows fast — this keeps the shape and encourages a denser, tidier form"}}',
  '{"light":90,"water":60,"humidity":45,"temp":32}',
  '{}',
  '{}',
  33
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'casuarina',
  'pine',
  '🌲',
  '{"th":"สนประดิพัทธ์","en":"Casuarina (Ru Pradiphat)"}',
  '{"th":"สนประดิพัทธ์เป็นไม้ยืนต้นสูงใหญ่ทรงพุ่มโปร่งสวย ใบเรียวเล็กคล้ายเข็มสนห้อยลู่ลม ทนลมแรงและดินเค็มได้ดีเยี่ยม นิยมปลูกเป็นแนวกันลมหรือร่มเงาริมทางในพื้นที่โล่ง","en":"Casuarina is a tall, elegant tree with a light, airy canopy of fine, needle-like drooping foliage that sways in the wind. It withstands strong wind and salty soil exceptionally well, making it a favorite windbreak or roadside shade tree."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลางช่วงแรก โตแล้วทนแล้งได้ดี","en":"Water moderately while young; drought-tolerant once mature"},"humidity":{"th":"ต่ำถึงปานกลาง ทนลมทะเลได้ดี","en":"Low to moderate humidity; tolerates coastal wind well"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ปลูกได้ในดินแทบทุกชนิดแม้ดินเค็ม","en":"Grows in nearly any soil, even salty ground"},"tips":{"th":"เหมาะปลูกเป็นแนวยาวกันลมหรือกันเสียง เพราะทรงพุ่มโปร่งลมพัดผ่านได้ไม่โค่นง่าย","en":"Ideal as a long windbreak or sound barrier — its open canopy lets wind pass through so it rarely topples"}}',
  '{"light":90,"water":40,"humidity":30,"temp":40}',
  '{}',
  '{}',
  34
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'sea-pine',
  'pine',
  '🌲',
  '{"th":"สนทะเล","en":"Australian Pine (Sea Pine)"}',
  '{"th":"สนทะเลเป็นไม้ยืนต้นสูงชะลูดใบเข็มห้อยระย้าคล้ายกิ่งสนแท้แม้จะเป็นคนละวงศ์ ทนดินทรายและลมทะเลได้ดีเยี่ยม จึงพบมากตามชายหาดและถูกใช้เป็นแนวกันคลื่นลม","en":"Sea pine is a tall, slender tree with drooping needle-like branchlets that resemble true pines, though it belongs to a different family. It thrives in sandy soil and sea wind, which is why it''s common along beaches as a coastal windbreak."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลาง ทนแล้งได้ดีเมื่อโต","en":"Water moderately; drought-tolerant once mature"},"humidity":{"th":"ต่ำ ทนลมทะเลและไอเค็มได้ดี","en":"Low humidity; tolerates sea wind and salt spray well"},"temp":{"th":"24-36°C","en":"24-36°C"},"soil":{"th":"ดินทรายชายฝั่งระบายน้ำเร็ว","en":"Fast-draining coastal sandy soil"},"tips":{"th":"เหมาะปลูกในพื้นที่ริมทะเลหรือที่โล่งลมแรงเป็นพิเศษ ไม่เหมาะกับกระถางเพราะโตสูงเร็ว","en":"Best suited to coastal or very windy open ground — not ideal for pots since it grows tall quickly"}}',
  '{"light":95,"water":35,"humidity":25,"temp":42}',
  '{}',
  '{}',
  35
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'podocarpus',
  'pine',
  '🌲',
  '{"th":"สนใบพาย","en":"Podocarpus (Buddhist Pine)"}',
  '{"th":"สนใบพายมีใบแบนยาวรูปคล้ายใบพายสีเขียวเข้มเรียงถี่ตามกิ่ง ทรงพุ่มแน่นตัดแต่งง่าย โตช้าจึงคงรูปทรงได้นาน นิยมปลูกเป็นแนวรั้วหรือตัดแต่งเป็นบอนไซประดับ","en":"Podocarpus has flat, elongated, spade-shaped dark-green leaves densely arranged along its branches. Its dense canopy is easy to shape and grows slowly, holding its form for a long time — popular as a hedge or trimmed bonsai accent."}',
  '{"light":{"th":"แดดรำไรถึงแดดจัด","en":"Bright indirect to full sun"},"water":{"th":"รดปานกลางสม่ำเสมอ","en":"Water moderately and consistently"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"18-30°C","en":"18-30°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ตัดแต่งทรงได้ตลอดปีเพราะโตช้า เหมาะทำเป็นแนวรั้วเตี้ยหรือไม้ดัดประดับสวน","en":"Can be shaped year-round thanks to its slow growth — great for a low hedge or ornamental topiary"}}',
  '{"light":60,"water":45,"humidity":45,"temp":26}',
  '{}',
  '{}',
  36
)
on conflict (id) do nothing;


-- ---------- สมุนไพร (herb) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'holy-basil',
  'herb',
  '🌿',
  '{"th":"กะเพรา","en":"Holy Basil"}',
  '{"th":"กะเพราเป็นสมุนไพรครัวไทยที่ขาดไม่ได้ ใบมีกลิ่นฉุนเผ็ดร้อนเฉพาะตัว ใช้ผัดกะเพราเมนูขึ้นชื่อของไทย ปลูกง่ายโตไวในกระถางเล็กริมครัว เก็บใบใช้ได้ตลอดปี","en":"Holy basil is an indispensable Thai kitchen herb with a signature peppery, spicy aroma — the star of Thailand''s famous stir-fried holy basil dish. Easy and fast-growing in a small kitchen-side pot, its leaves are ready to pick year-round."}',
  '{"light":{"th":"แดดจัดอย่างน้อยครึ่งวัน","en":"At least half a day of full sun"},"water":{"th":"รดสม่ำเสมอ อย่าให้ดินแห้งจัด","en":"Water consistently — don''t let soil go bone-dry"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"เด็ดยอดเก็บใช้บ่อย ๆ ช่วยให้แตกกิ่งพุ่มเยอะขึ้น ห้ามปล่อยให้ออกดอกเพราะใบจะแข็งกระด้าง","en":"Frequent tip-picking encourages bushier growth — don''t let it flower, or the leaves turn tough"}}',
  '{"light":85,"water":55,"humidity":45,"temp":30}',
  '{easy-care}',
  '{}',
  37
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'thai-basil',
  'herb',
  '🌿',
  '{"th":"โหระพา","en":"Thai Basil"}',
  '{"th":"โหระพามีใบมันเงากลิ่นหอมหวานอ่อนกว่ากะเพรา ใช้แต่งกลิ่นแกงและผัดหลายเมนู ปลูกง่ายในกระถางระเบียงบ้าน ต้องการแดดพอสมควรถึงจะกลิ่นหอมเข้มข้น","en":"Thai basil has glossy leaves with a sweeter, milder aroma than holy basil, used to flavor curries and stir-fries. Easy to grow in a balcony pot, it needs a fair amount of sun to develop its full fragrance."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"รดสม่ำเสมอ ดินชื้นแต่ไม่แฉะ","en":"Water consistently; moist but not soggy soil"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-30°C","en":"20-30°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"เด็ดช่อดอกทิ้งทันทีที่เห็นเพื่อไม่ให้ใบแข็งและหยุดโต ตัดยอดเก็บใช้เป็นประจำ","en":"Pinch off flower buds the moment they appear so leaves stay tender and growth doesn''t stall — harvest tips regularly"}}',
  '{"light":75,"water":55,"humidity":45,"temp":27}',
  '{easy-care}',
  '{}',
  38
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'lemongrass',
  'herb',
  '🌾',
  '{"th":"ตะไคร้","en":"Lemongrass"}',
  '{"th":"ตะไคร้แตกกอใบยาวเรียวกลิ่นหอมสดชื่นเฉพาะตัว ใช้ปรุงต้มยำและอาหารไทยหลายเมนู ทนแล้งทนแดดจัดได้ดีเยี่ยม ปลูกครั้งเดียวแตกกอเก็บใช้ได้นานหลายปี","en":"Lemongrass grows in clumps of long, slender, refreshingly citrus-scented leaves used in tom yum and countless Thai dishes. It''s exceptionally drought- and heat-tolerant — plant once and the clump keeps giving for years."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลาง ทนแล้งได้ดีมาก","en":"Water moderately; very drought-tolerant"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินร่วนแทบทุกชนิด ระบายน้ำดี","en":"Almost any well-draining loam"},"tips":{"th":"แยกกอปลูกใหม่เมื่อกอแน่นเกินไปทุก 1-2 ปี จะได้ต้นแข็งแรงและเก็บเกี่ยวง่ายขึ้น","en":"Divide and replant the clump every 1-2 years once it gets crowded, for stronger growth and easier harvesting"}}',
  '{"light":90,"water":30,"humidity":30,"temp":40}',
  '{easy-care}',
  '{}',
  39
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'pandan',
  'herb',
  '🌿',
  '{"th":"ใบเตย","en":"Pandan"}',
  '{"th":"ใบเตยมีใบเรียวยาวสีเขียวเข้มกลิ่นหอมหวานเป็นเอกลักษณ์ ใช้แต่งกลิ่นและสีขนมไทยหลายชนิด ชอบที่ชื้นแฉะได้ดีกว่าพืชสมุนไพรทั่วไป ปลูกง่ายแตกกอเร็ว","en":"Pandan has long, slender, deep-green leaves with a distinctive sweet fragrance used to flavor and color countless Thai desserts. Unlike most herbs, it actually enjoys damp soil, and grows easily into a thick clump."}',
  '{"light":{"th":"แดดรำไรถึงแดดจัด","en":"Bright indirect to full sun"},"water":{"th":"ต้องการน้ำมาก ชอบดินชื้นแฉะ","en":"Needs plenty of water; enjoys consistently damp soil"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"22-33°C","en":"22-33°C"},"soil":{"th":"ดินร่วนเก็บความชื้นดี ปลูกริมบ่อน้ำได้","en":"Moisture-retentive loam; can be grown at a pond''s edge"},"tips":{"th":"ตัดใบแก่ข้างนอกออกเป็นระยะ ใบอ่อนตรงกลางจะยังคงหอมและใช้ได้ต่อเนื่อง","en":"Trim the outer, older leaves periodically — the tender inner leaves stay fragrant and usable"}}',
  '{"light":60,"water":80,"humidity":75,"temp":32}',
  '{easy-care}',
  '{}',
  40
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'mint',
  'herb',
  '🌱',
  '{"th":"สะระแหน่","en":"Mint"}',
  '{"th":"สะระแหน่มีใบกลิ่นหอมเย็นสดชื่นใช้แต่งจานลาบและยำหลายเมนู เลื้อยแผ่ปกคลุมดินได้เร็ว ชอบที่ชื้นและร่มรำไร ปลูกในกระถางแขวนหรือกระบะก็ได้ผลดี","en":"Mint has refreshingly cool-scented leaves used to garnish larb and various Thai salads. It spreads and creeps quickly, prefers moist, semi-shaded spots, and does well in a hanging pot or a planter box."}',
  '{"light":{"th":"แดดรำไร หลีกเลี่ยงแดดจัดจ้า","en":"Bright indirect light — avoid harsh direct sun"},"water":{"th":"ต้องการน้ำมาก ดินต้องชื้นตลอด","en":"Needs plenty of water; soil must stay consistently moist"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"18-28°C","en":"18-28°C"},"soil":{"th":"ดินร่วนเก็บความชื้นดี","en":"Moisture-retentive loam"},"tips":{"th":"ปลูกในกระถางแยกต่างหากเพราะรากเลื้อยแผ่รุกรานพืชข้างเคียงได้ง่าย ตัดยอดเก็บใช้บ่อย ๆ จะแตกกอแน่นขึ้น","en":"Grow it in its own pot since the spreading roots easily invade neighboring plants — frequent tip-harvesting makes it bushier"}}',
  '{"light":40,"water":75,"humidity":70,"temp":25}',
  '{easy-care}',
  '{}',
  41
)
on conflict (id) do nothing;


-- ---------- หญ้า (grass) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'malaysian-grass',
  'grass',
  '🌱',
  '{"th":"หญ้ามาเลเซีย","en":"Malaysian Carpet Grass"}',
  '{"th":"หญ้ามาเลเซียเป็นหญ้าปูสนามยอดนิยมที่สุดในไทย ใบหนาสีเขียวเข้มทนคนเดินเหยียบได้ดี ไม่ต้องตัดบ่อยเท่าหญ้าชนิดอื่น เหมาะปูสนามหญ้าทั่วไปหน้าบ้าน","en":"Malaysian carpet grass is Thailand''s most popular lawn turf — thick, deep-green blades that hold up well to foot traffic. It needs mowing less often than most turf types, making it ideal for a typical front-yard lawn."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้ำสม่ำเสมอ 2-3 ครั้งต่อสัปดาห์","en":"Water 2-3 times a week consistently"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ตัดหญ้าให้สั้นราว 1-2 นิ้วทุก 10-15 วัน ใส่ปุ๋ยไนโตรเจนช่วยให้สีเขียวเข้มสม่ำเสมอ","en":"Mow to about 1-2 inches every 10-15 days; nitrogen feeding keeps the color deep and even"}}',
  '{"light":90,"water":55,"humidity":45,"temp":35}',
  '{}',
  '{}',
  42
)
on conflict (id) do nothing;


insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'fountain-grass',
  'grass',
  '🌾',
  '{"th":"หญ้าลอยลม","en":"Fountain Grass"}',
  '{"th":"หญ้าลอยลมขึ้นเป็นกอพุ่มสูงมีช่อดอกฟูนุ่มคล้ายขนนกโบกไหวตามลม ให้ความรู้สึกธรรมชาติแบบทุ่งหญ้า ทนแล้งดีมาก นิยมปลูกประดับริมทางหรือแปลงสวน","en":"Fountain grass grows in tall clumps topped with soft, feathery plumes that sway gracefully in the breeze, giving a natural meadow feel. Very drought-tolerant, it''s popular along walkways or in garden borders."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้อย ทนแล้งได้ดีมาก","en":"Water sparingly; very drought-tolerant"},"humidity":{"th":"ต่ำ","en":"Low humidity"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินร่วนปนทรายระบายน้ำดี","en":"Sandy loam, well-draining"},"tips":{"th":"ตัดกอให้เตี้ยลงปีละครั้งช่วงต้นฤดูฝนเพื่อกระตุ้นให้แตกใบใหม่สวยงาม","en":"Cut the clump back once a year at the start of the rainy season to encourage fresh, attractive new growth"}}',
  '{"light":90,"water":25,"humidity":25,"temp":40}',
  '{}',
  '{}',
  44
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'mondo-grass',
  'grass',
  '🌱',
  '{"th":"หญ้าปักกิ่ง","en":"Mondo Grass"}',
  '{"th":"หญ้าปักกิ่งไม่ใช่หญ้าแท้แต่มีใบเรียวเขียวเข้มขึ้นเป็นกระจุกคล้ายหญ้า นิยมปลูกเป็นแนวขอบทางเดินหรือคลุมดินใต้ร่มไม้ใหญ่เพราะทนร่มได้ดีกว่าหญ้าปูสนามทั่วไป","en":"Mondo grass isn''t a true grass, but its slender, deep-green blades grow in tufts that look just like one. It''s popular for edging pathways or as groundcover under big trees, tolerating shade far better than typical lawn turf."}',
  '{"light":{"th":"ร่มรำไรถึงแดดรำไร ทนร่มได้ดี","en":"Partial to bright shade — tolerates low light well"},"water":{"th":"รดปานกลางสม่ำเสมอ","en":"Water moderately and consistently"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"18-30°C","en":"18-30°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"แทบไม่ต้องตัดแต่งเลย เหมาะปลูกเป็นขอบแปลงหรือคลุมดินในจุดที่หญ้าปูสนามทั่วไปขึ้นไม่ได้เพราะร่มเกินไป","en":"Needs almost no trimming — great as a bed border or groundcover in spots too shady for regular turf"}}',
  '{"light":30,"water":45,"humidity":45,"temp":26}',
  '{easy-care}',
  '{}',
  45
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'vetiver',
  'grass',
  '🌾',
  '{"th":"หญ้าแฝก","en":"Vetiver Grass"}',
  '{"th":"หญ้าแฝกมีระบบรากลึกหยั่งดินแน่นเป็นพิเศษ ปลูกเพื่อป้องกันดินพังทลายตามแนวลาดเนินหรือริมตลิ่งเป็นหลัก ไม่ใช่ไม้ประดับทั่วไปแต่มีประโยชน์ด้านอนุรักษ์ดินสูง","en":"Vetiver grass has an exceptionally deep, dense root system, grown primarily to prevent soil erosion on slopes and riverbanks. It isn''t a typical ornamental, but it''s highly valued for soil conservation."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้อยหลังตั้งตัว ทนแล้งได้ดีมาก","en":"Water little once established; very drought-tolerant"},"humidity":{"th":"ต่ำ","en":"Low humidity"},"temp":{"th":"20-38°C","en":"20-38°C"},"soil":{"th":"ปลูกได้แทบทุกสภาพดินแม้ดินเสื่อมโทรม","en":"Grows in almost any soil, even degraded ground"},"tips":{"th":"ปลูกเป็นแถวขวางแนวลาดชันเพื่อชะลอน้ำไหลบ่าและยึดหน้าดิน ตัดใบปีละ 1-2 ครั้งไม่ต้องดูแลมาก","en":"Plant in rows across a slope to slow runoff and hold the topsoil; trim once or twice a year and otherwise leave it alone"}}',
  '{"light":90,"water":20,"humidity":20,"temp":42}',
  '{}',
  '{}',
  46
)
on conflict (id) do nothing;


-- ---------- ไม้คลุมดิน (groundcover) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'wedelia',
  'groundcover',
  '🌼',
  '{"th":"เศรษฐีไหลทอง","en":"Wedelia (Creeping Daisy)"}',
  '{"th":"เศรษฐีไหลทองเลื้อยแผ่ปกคลุมดินได้เร็วมาก ออกดอกสีเหลืองเล็กตลอดปี ทนแดดทนแล้งดีเยี่ยม นิยมปลูกคลุมดินแทนหญ้าในพื้นที่ลาดเอียงหรือริมกำแพงกันดิน","en":"Wedelia spreads and creeps to cover ground very quickly, producing small yellow flowers year-round. Highly heat- and drought-tolerant, it''s popular as a lawn alternative on slopes or along retaining walls."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้อย ทนแล้งได้ดีมาก","en":"Water sparingly; very drought-tolerant"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินแทบทุกชนิด ขอแค่ระบายน้ำได้","en":"Almost any soil, as long as it drains"},"tips":{"th":"ตัดแต่งขอบเขตเป็นระยะเพราะเลื้อยแผ่เร็วมาก อาจรุกล้ำพื้นที่ปลูกอื่นถ้าไม่ควบคุม","en":"Trim the edges periodically since it spreads very fast and can invade neighboring beds if left unchecked"}}',
  '{"light":90,"water":25,"humidity":30,"temp":40}',
  '{easy-care}',
  '{}',
  47
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'dichondra',
  'groundcover',
  '🍀',
  '{"th":"ตีนตุ๊กแก","en":"Dichondra (Kidneyweed)"}',
  '{"th":"ตีนตุ๊กแกมีใบกลมเล็กคล้ายเหรียญเขียวเข้มเรียงชิดติดดิน แผ่ปกคลุมเป็นพรมเขียวเรียบเนียนสวยงาม นิยมปลูกแทนหญ้าในจุดที่ต้องการผิวคลุมดินละเอียดกว่า","en":"Dichondra has tiny, round, coin-like dark-green leaves that hug the ground closely, forming a smooth, carpet-like green mat. It''s popular as a fine-textured lawn alternative where a more delicate groundcover is wanted."}',
  '{"light":{"th":"แดดรำไรถึงแดดจัด","en":"Bright indirect to full sun"},"water":{"th":"รดสม่ำเสมอ อย่าให้ดินแห้งจัด","en":"Water consistently — don''t let soil go bone-dry"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"18-30°C","en":"18-30°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ตัดแต่งเป็นระยะให้ผิวเรียบเสมอกัน ทนคนเดินเหยียบเบา ๆ ได้แต่ไม่เหมาะกับพื้นที่ใช้งานหนัก","en":"Trim periodically to keep the surface even; it tolerates light foot traffic but not heavy use"}}',
  '{"light":65,"water":50,"humidity":50,"temp":28}',
  '{}',
  '{}',
  48
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'creeping-fig',
  'groundcover',
  '🍃',
  '{"th":"ไทรเกาหลี","en":"Creeping Fig"}',
  '{"th":"ไทรเกาหลีเป็นไม้เลื้อยใบเล็กเรียงถี่เกาะเกี่ยวพื้นผิวได้ทุกทิศทาง ปลูกคลุมดินหรือไต่กำแพงให้ดูเขียวครึ้มเป็นธรรมชาติ ทนร่มได้ดีกว่าไม้คลุมดินทั่วไป","en":"Creeping fig is a fine-leaved vine that clings tightly to any surface in any direction. Grown as groundcover or trained up a wall, it creates a lush, natural green look, and tolerates shade better than most groundcovers."}',
  '{"light":{"th":"ร่มรำไรถึงแดดรำไร","en":"Partial to bright indirect shade"},"water":{"th":"รดปานกลางสม่ำเสมอ","en":"Water moderately and consistently"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"20-30°C","en":"20-30°C"},"soil":{"th":"ดินร่วนเก็บความชื้นดี","en":"Moisture-retentive loam"},"tips":{"th":"ตัดแต่งควบคุมทิศทางการเลื้อยเป็นระยะ ไม่เช่นนั้นจะไต่ปกคลุมพื้นที่ที่ไม่ต้องการได้เร็วมาก","en":"Prune regularly to control its direction — otherwise it climbs and covers unwanted areas very quickly"}}',
  '{"light":35,"water":55,"humidity":65,"temp":26}',
  '{air-purify}',
  '{}',
  49
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'portulaca',
  'groundcover',
  '🌸',
  '{"th":"ผักเบี้ยหิน","en":"Portulaca (Moss Rose)"}',
  '{"th":"ผักเบี้ยหินมีใบอวบน้ำเล็กเรียวและดอกบานสีสดใสรับแสงแดดเต็มที่ ทนแล้งทนร้อนได้ยอดเยี่ยมเพราะเก็บน้ำในใบ นิยมปลูกคลุมดินแปลงกลางแจ้งที่แดดจัดจ้า","en":"Portulaca has tiny succulent leaves and vividly colored flowers that open fully in bright sun. It stores water in its leaves, giving it excellent heat and drought tolerance — perfect groundcover for a scorching, sun-baked bed."}',
  '{"light":{"th":"แดดจัดทั้งวัน ดอกจะหุบถ้าแดดไม่พอ","en":"Full sun all day — flowers close without enough sun"},"water":{"th":"รดน้อย ทนแล้งได้ดีมาก","en":"Water sparingly; very drought-tolerant"},"humidity":{"th":"ต่ำ","en":"Low humidity"},"temp":{"th":"24-38°C","en":"24-38°C"},"soil":{"th":"ดินร่วนปนทรายระบายน้ำเร็ว","en":"Fast-draining sandy loam"},"tips":{"th":"ห้ามรดน้ำมากเกินไปเพราะใบอวบน้ำอยู่แล้ว รากเน่าง่ายถ้าดินแฉะ ตัดกิ่งปักชำขยายพันธุ์ได้ง่าย","en":"Never overwater — the leaves already store water, and roots rot easily in wet soil; cuttings root easily for propagation"}}',
  '{"light":95,"water":15,"humidity":20,"temp":42}',
  '{}',
  '{}',
  50
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'torenia',
  'groundcover',
  '🌸',
  '{"th":"แววมยุรา","en":"Torenia (Wishbone Flower)"}',
  '{"th":"แววมยุรามีดอกทรงแตรสีม่วงน้ำเงินสดใสบานดกเป็นพุ่มเตี้ย ทนร่มรำไรได้ดีกว่าไม้ดอกทั่วไปจึงเหมาะปลูกในจุดที่แดดไม่แรงนัก ให้สีสันได้นานตลอดฤดู","en":"Torenia produces vividly purple-blue trumpet flowers in profusion on a low, bushy plant. It tolerates partial shade better than most flowering annuals, making it ideal for spots with gentler light, and blooms colorfully for a long season."}',
  '{"light":{"th":"ร่มรำไรถึงแดดรำไร หลีกเลี่ยงแดดจัดจ้า","en":"Partial to bright indirect shade — avoid harsh direct sun"},"water":{"th":"รดสม่ำเสมอ อย่าให้ดินแห้งจัด","en":"Water consistently — don''t let soil go bone-dry"},"humidity":{"th":"ปานกลางถึงสูง","en":"Moderate to high humidity"},"temp":{"th":"20-30°C","en":"20-30°C"},"soil":{"th":"ดินร่วนเก็บความชื้นดี อุดมอินทรียวัตถุ","en":"Moisture-retentive, organic-rich loam"},"tips":{"th":"เด็ดดอกโรยทิ้งช่วยกระตุ้นดอกใหม่ เหมาะปลูกคลุมดินใต้ร่มไม้ใหญ่ที่แดดร่มรำไร","en":"Deadheading spent blooms encourages new ones — great as groundcover under a large tree with dappled light"}}',
  '{"light":40,"water":60,"humidity":60,"temp":26}',
  '{}',
  '{}',
  51
)
on conflict (id) do nothing;


-- ---------- ไม้ต้น (tree) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'golden-shower',
  'tree',
  '🌳',
  '{"th":"ราชพฤกษ์","en":"Golden Shower Tree"}',
  '{"th":"ราชพฤกษ์เป็นต้นไม้ประจำชาติไทยออกดอกสีเหลืองทองห้อยเป็นพวงยาวสวยงามช่วงฤดูร้อน ทรงพุ่มโปร่งให้ร่มเงาดี ทนแล้งได้ดีเยี่ยม นิยมปลูกริมถนนและสถานที่ราชการ","en":"Golden shower is Thailand''s national tree, hanging with long, cascading clusters of golden-yellow flowers in summer. Its light canopy gives good shade, and it''s highly drought-tolerant — commonly planted along roads and government grounds."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลางช่วงแรก โตแล้วทนแล้งได้ดีมาก","en":"Water moderately while young; very drought-tolerant once mature"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-38°C","en":"22-38°C"},"soil":{"th":"ดินร่วนปนทรายระบายน้ำดี","en":"Sandy loam, well-draining"},"tips":{"th":"งดรดน้ำช่วงปลายฤดูหนาวจะกระตุ้นให้ออกดอกดกในฤดูร้อนถัดไป","en":"Withholding water toward the end of the cool season helps trigger a heavier bloom the following summer"}}',
  '{"light":95,"water":30,"humidity":30,"temp":42}',
  '{}',
  '{}',
  52
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'flame-tree',
  'tree',
  '🌳',
  '{"th":"หางนกยูงฝรั่ง","en":"Flame Tree (Royal Poinciana)"}',
  '{"th":"หางนกยูงฝรั่งมีทรงพุ่มกว้างแผ่ร่มเงาได้ไกล ออกดอกสีแดงส้มสดจัดเต็มต้นช่วงฤดูร้อนจนดูเหมือนต้นไฟ เป็นไม้ให้ร่มเงายอดนิยมตามถนนและสวนสาธารณะ","en":"Flame tree has a wide, spreading canopy that shades a large area, bursting into brilliant red-orange blooms across the whole tree in summer, looking almost aflame. It''s a favorite shade tree along streets and in public parks."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลาง ทนแล้งได้ดีเมื่อโต","en":"Water moderately; drought-tolerant once mature"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-38°C","en":"22-38°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ตัดแต่งกิ่งให้โปร่งช่วยลดความเสี่ยงกิ่งฉีกหักตอนลมแรงเพราะทรงพุ่มกว้างและเนื้อไม้ค่อนข้างเปราะ","en":"Thin the canopy regularly to reduce the risk of branch breakage in strong wind, since the wide crown and brittle wood are vulnerable"}}',
  '{"light":95,"water":40,"humidity":35,"temp":42}',
  '{}',
  '{}',
  53
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'champak',
  'tree',
  '🌳',
  '{"th":"จำปี","en":"Champak"}',
  '{"th":"จำปีมีดอกสีขาวนวลกลิ่นหอมแรงเป็นเอกลักษณ์ลอยไปไกล ทรงพุ่มสูงโปร่งใบเขียวเข้มเป็นมัน เป็นไม้หอมยืนต้นดั้งเดิมของไทยที่นิยมปลูกไว้ใกล้บ้านเพื่อรับกลิ่นหอม","en":"Champak has creamy white flowers with a strong, distinctive fragrance that carries far on the breeze. With a tall, airy canopy of glossy dark-green leaves, it''s a traditional Thai fragrant tree often planted near the home to enjoy the scent."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"รดสม่ำเสมอช่วงแรก โตแล้วทนแล้งได้พอสมควร","en":"Water consistently while young; fairly drought-tolerant once mature"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"22-33°C","en":"22-33°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์ ระบายน้ำดี","en":"Fertile, well-draining loam"},"tips":{"th":"ปลูกในจุดที่รับลมได้ดีเพื่อให้กลิ่นหอมกระจายทั่วบริเวณบ้าน ดอกร่วงง่ายควรเก็บกวาดใต้ต้นเป็นระยะ","en":"Plant somewhere with good airflow so the fragrance carries through the yard — flowers drop easily, so sweep beneath the tree periodically"}}',
  '{"light":75,"water":50,"humidity":50,"temp":30}',
  '{}',
  '{}',
  54
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'sarapee',
  'tree',
  '🌳',
  '{"th":"สารภี","en":"Sarapee (Mammea Siamensis)"}',
  '{"th":"สารภีเป็นไม้ยืนต้นดั้งเดิมของไทยทรงพุ่มทึบให้ร่มเงาดี ดอกสีขาวเล็กกลิ่นหอมเย็นบานตอนเช้าแล้วร่วงหล่นเป็นพรมใต้ต้น นิยมปลูกในวัดและบ้านเรือนแบบไทยโบราณ","en":"Sarapee is a traditional Thai tree with a dense, shade-giving canopy. Its small white flowers have a cool, sweet fragrance, opening in the morning and carpeting the ground beneath as they fall — commonly planted at temples and old Thai homes."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"รดปานกลางสม่ำเสมอ","en":"Water moderately and consistently"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"22-33°C","en":"22-33°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์ ระบายน้ำดี","en":"Fertile, well-draining loam"},"tips":{"th":"โตช้าในช่วงแรกแต่ทรงพุ่มจะสวยงามมั่นคงเมื่อโตเต็มที่ เหมาะปลูกเป็นไม้ร่มเงาระยะยาว","en":"Grows slowly at first, but develops a beautifully stable canopy at maturity — a good long-term shade tree"}}',
  '{"light":75,"water":45,"humidity":50,"temp":30}',
  '{rare}',
  '{}',
  55
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'pradu',
  'tree',
  '🌳',
  '{"th":"ประดู่","en":"Pradu (Burmese Rosewood)"}',
  '{"th":"ประดู่เป็นไม้ยืนต้นขนาดใหญ่เนื้อไม้แข็งแรงมีค่า ดอกสีเหลืองทองกลิ่นหอมบานพร้อมกันทั้งต้นช่วงสั้น ๆ แล้วร่วงเป็นพรมสวยงาม ทรงพุ่มกว้างให้ร่มเงาดีเยี่ยม","en":"Pradu is a large, valuable hardwood tree that bursts into golden-yellow, fragrant blooms all at once for a brief spell before carpeting the ground beneath in fallen petals. Its wide canopy provides excellent shade."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดปานกลาง ทนแล้งได้ดีเมื่อโตเต็มที่","en":"Water moderately; drought-tolerant once fully mature"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-38°C","en":"22-38°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"เป็นไม้โตช้าที่มีอายุยืนหลายสิบปี เหมาะปลูกไว้เป็นร่มเงาถาวรระยะยาวมากกว่าไม้ประดับระยะสั้น","en":"A slow-growing tree that lives for decades — better suited as a permanent long-term shade tree than a quick ornamental"}}',
  '{"light":90,"water":35,"humidity":35,"temp":40}',
  '{}',
  '{}',
  56
)
on conflict (id) do nothing;


-- ---------- ไม้พุ่ม (shrub) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'tecoma',
  'shrub',
  '🌼',
  '{"th":"ทองอุไร","en":"Yellow Bells (Tecoma)"}',
  '{"th":"ทองอุไรเป็นไม้พุ่มขนาดเล็กออกดอกสีเหลืองสดใสตลอดปีแทบไม่ขาดช่วง ทนแล้งทนแดดจัดได้ดีเยี่ยม ดูแลง่ายแทบไม่ต้องใส่ใจมาก นิยมปลูกเป็นแนวรั้วหรือประดับสวน","en":"Yellow bells is a small shrub that blooms with bright yellow flowers almost continuously year-round. Highly heat- and drought-tolerant, it''s low-maintenance and popular as a hedge or garden ornamental."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดน้อยหลังตั้งตัว ทนแล้งได้ดีมาก","en":"Water little once established; very drought-tolerant"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ตัดแต่งทรงพุ่มปีละ 2-3 ครั้งจะช่วยกระตุ้นให้แตกกิ่งใหม่และออกดอกดกขึ้น","en":"Pruning the shape 2-3 times a year encourages fresh branching and heavier blooming"}}',
  '{"light":90,"water":25,"humidity":30,"temp":40}',
  '{easy-care}',
  '{}',
  57
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'hibiscus',
  'shrub',
  '🌺',
  '{"th":"ชบา","en":"Hibiscus"}',
  '{"th":"ชบาเป็นไม้พุ่มดอกใหญ่สีสันสดใสหลากสีบานทีละดอกแต่ต่อเนื่องเกือบทั้งปี ทรงพุ่มปานกลางปลูกง่าย เป็นไม้ประดับคลาสสิกที่พบได้ทั่วไปตามบ้านเรือนไทย","en":"Hibiscus is a shrub with large, vividly colored blooms that open one at a time but keep coming nearly year-round. Medium-sized and easy to grow, it''s a classic ornamental found in Thai homes everywhere."}',
  '{"light":{"th":"แดดจัดทั้งวัน ดอกจะน้อยลงถ้าแดดไม่พอ","en":"Full sun all day — fewer blooms without enough sun"},"water":{"th":"รดสม่ำเสมอ อย่าให้ดินแห้งจัด","en":"Water consistently — don''t let soil go bone-dry"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-33°C","en":"20-33°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์ ระบายน้ำดี","en":"Fertile, well-draining loam"},"tips":{"th":"ใส่ปุ๋ยสูตรเร่งดอกทุกเดือน ตัดแต่งกิ่งหลังดอกโรยเพื่อกระตุ้นแตกยอดและดอกใหม่","en":"Feed with a bloom-boosting fertilizer monthly, and prune after flowering to trigger new shoots and blooms"}}',
  '{"light":85,"water":55,"humidity":50,"temp":30}',
  '{easy-care}',
  '{}',
  58
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'bougainvillea',
  'shrub',
  '🌸',
  '{"th":"เฟื่องฟ้า","en":"Bougainvillea"}',
  '{"th":"เฟื่องฟ้าเป็นไม้พุ่มกึ่งเลื้อยมีหนามออกดอกกระดาษสีสันจัดจ้านเป็นช่อพวงดกทั้งต้น ทนแดดทนแล้งได้ดีเยี่ยมและมีอายุยืนหลายสิบปี นิยมปลูกเป็นซุ้มหรือรั้วประดับ","en":"Bougainvillea is a thorny, semi-climbing shrub covered in vivid papery bracts blooming in dense clusters across the whole plant. Extremely heat- and drought-tolerant, it can live for decades and is popular trained onto an arch or fence."}',
  '{"light":{"th":"แดดจัดทั้งวัน จำเป็นมากเพื่อให้ออกดอก","en":"Full sun all day — essential for flowering"},"water":{"th":"รดน้อย ดอกจะดกกว่าถ้าปล่อยให้ดินแห้งบ้างระหว่างรด","en":"Water sparingly — letting soil dry somewhat between waterings actually boosts blooming"},"humidity":{"th":"ต่ำถึงปานกลาง","en":"Low to moderate humidity"},"temp":{"th":"22-35°C","en":"22-35°C"},"soil":{"th":"ดินร่วนปนทรายระบายน้ำดีมาก","en":"Very well-draining sandy loam"},"tips":{"th":"อย่าใส่ปุ๋ยไนโตรเจนมากเกินไปเพราะจะโตใบดกแต่ดอกน้อย ตัดแต่งกิ่งหลังดอกโรยกระตุ้นดอกชุดใหม่","en":"Don''t over-feed with nitrogen — it produces lush leaves but fewer flowers; prune after each bloom flush to trigger the next"}}',
  '{"light":95,"water":20,"humidity":30,"temp":40}',
  '{easy-care}',
  '{}',
  59
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'moke',
  'shrub',
  '🌿',
  '{"th":"โมก","en":"Wrightia (Water Jasmine)"}',
  '{"th":"โมกมีดอกสีขาวเล็กกลิ่นหอมอ่อนบานดกทั้งต้น ใบเขียวเข้มเป็นมันขนาดเล็ก ทรงพุ่มแน่นตัดแต่งง่าย เป็นไม้ยอดนิยมสำหรับทำไม้ดัดบอนไซหรือแนวรั้วประดับ","en":"Wrightia bears small, mildly fragrant white flowers in profusion across the whole plant, with small glossy dark-green leaves. Its dense, easily shaped form makes it a favorite for bonsai styling or as a trimmed hedge."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"รดปานกลางสม่ำเสมอ","en":"Water moderately and consistently"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"20-32°C","en":"20-32°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ตัดแต่งได้บ่อยเพราะแตกกิ่งใหม่ไว เหมาะทำไม้ดัดทรงสวยหรือแนวรั้วเตี้ยตัดแต่งง่าย","en":"Can be pruned often since it branches out quickly — great for ornamental shaping or an easy low hedge"}}',
  '{"light":75,"water":45,"humidity":45,"temp":28}',
  '{}',
  '{}',
  60
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'ixora',
  'shrub',
  '🌺',
  '{"th":"เข็ม","en":"Ixora (Jungle Geranium)"}',
  '{"th":"เข็มออกดอกเป็นช่อกลมแน่นสีแดงส้มหรือชมพูสดใสตลอดปี ใบเขียวเข้มเป็นมันหนา ทรงพุ่มเตี้ยแน่น เป็นไม้พุ่มยอดนิยมสำหรับปลูกเป็นแนวรั้วหรือแปลงประดับ","en":"Ixora blooms year-round with dense, round clusters of bright red-orange or pink flowers, paired with thick, glossy dark-green leaves. This low, dense shrub is a favorite for hedging or ornamental beds."}',
  '{"light":{"th":"แดดจัดทั้งวัน","en":"Full sun all day"},"water":{"th":"รดสม่ำเสมอ อย่าให้ดินแห้งจัด","en":"Water consistently — don''t let soil go bone-dry"},"humidity":{"th":"ปานกลาง","en":"Moderate humidity"},"temp":{"th":"22-33°C","en":"22-33°C"},"soil":{"th":"ดินร่วนเป็นกรดเล็กน้อย ระบายน้ำดี","en":"Slightly acidic, well-draining loam"},"tips":{"th":"ใส่ปุ๋ยสูตรเสมอเป็นประจำและตัดแต่งทรงพุ่มปีละ 2 ครั้งเพื่อให้ดอกดกสม่ำเสมอ","en":"Feed regularly with a balanced fertilizer and prune the shape twice a year for consistent, heavy blooming"}}',
  '{"light":85,"water":55,"humidity":50,"temp":30}',
  '{easy-care}',
  '{}',
  61
)
on conflict (id) do nothing;


-- ---------- ไม้หัว (bulb) ----------

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'torch-ginger',
  'bulb',
  '🌺',
  '{"th":"ดาหลา","en":"Torch Ginger"}',
  '{"th":"ดาหลามีลำต้นเทียมสูงใหญ่และดอกทรงกระบองสีแดงชมพูสะดุดตาโผล่จากดินโดยตรง กลีบดอกและหน่ออ่อนใช้เป็นผักจิ้มหรือเครื่องปรุงในอาหารใต้ ปลูกง่ายในที่ชื้น","en":"Torch ginger has tall pseudostems and a striking torch-shaped red-pink flower that emerges straight from the ground. Its petals and young shoots are used as a fresh vegetable or seasoning in southern Thai cuisine, and it''s easy to grow in moist ground."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"ต้องการน้ำมาก ดินต้องชื้นตลอด","en":"Needs plenty of water; soil must stay consistently moist"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนอุดมสมบูรณ์เก็บความชื้นดี","en":"Fertile, moisture-retentive loam"},"tips":{"th":"ขยายพันธุ์ด้วยการแยกเหง้าหรือหน่อ ตัดลำต้นที่ให้ดอกแล้วทิ้งเพื่อให้หน่อใหม่แข็งแรงขึ้น","en":"Propagate by dividing the rhizome or offshoots; cut back stems that have already flowered so new shoots grow stronger"}}',
  '{"light":65,"water":75,"humidity":75,"temp":30}',
  '{rare}',
  '{}',
  62
)
on conflict (id) do nothing;


insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'curcuma',
  'bulb',
  '🌸',
  '{"th":"กระเจียว","en":"Curcuma (Summer Tulip)"}',
  '{"th":"กระเจียวเป็นไม้หัวพื้นเมืองใกล้เคียงปทุมมา ดอกสีชมพูอ่อนหรือขาวบอบบางกว่า มักขึ้นเป็นทุ่งตามธรรมชาติในป่าโปร่งช่วงต้นฤดูฝน นิยมปลูกเป็นไม้ประดับแปลงเช่นกัน","en":"Curcuma is a native relative of Siam tulip, with more delicate pale-pink or white blooms. It naturally carpets open forest areas in the early rainy season, and is also popular as an ornamental bedding plant."}',
  '{"light":{"th":"แดดจัดถึงแดดรำไร","en":"Full sun to bright indirect"},"water":{"th":"ต้องการน้ำมากช่วงแตกใบดอก งดน้ำตอนพักตัว","en":"Needs plenty of water while actively growing; withhold water during dormancy"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนระบายน้ำดี","en":"Well-draining loam"},"tips":{"th":"ปล่อยให้พักตัวแห้งสนิทในฤดูแล้งตามธรรมชาติของมัน อย่ารดน้ำช่วงนี้เพราะหัวจะเน่า","en":"Let it go fully dormant and dry in the dry season as it naturally would — watering during this time rots the tuber"}}',
  '{"light":70,"water":65,"humidity":65,"temp":30}',
  '{rare}',
  '{}',
  64
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'globba',
  'bulb',
  '🌸',
  '{"th":"หงส์เหิน","en":"Globba (Dancing Girl Ginger)"}',
  '{"th":"หงส์เหินมีช่อดอกทรงแปลกคล้ายนกกำลังบินหรือหญิงร่ายรำ สีม่วงหรือเหลืองขึ้นอยู่กับสายพันธุ์ ต้นเล็กชอบร่มรำไรกว่าไม้หัวขิงชนิดอื่น เหมาะปลูกใต้ร่มไม้ใหญ่","en":"Globba has an unusually shaped flower spike resembling a flying bird or a dancing figure, in purple or yellow depending on the species. Smaller than most gingers and preferring more shade, it suits a spot beneath a large tree."}',
  '{"light":{"th":"ร่มรำไรถึงแดดรำไร","en":"Partial to bright indirect shade"},"water":{"th":"ต้องการน้ำมากช่วงแตกใบดอก งดน้ำตอนพักตัว","en":"Needs plenty of water while actively growing; withhold water during dormancy"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"20-30°C","en":"20-30°C"},"soil":{"th":"ดินร่วนอุดมอินทรียวัตถุเก็บความชื้นดี","en":"Organic-rich, moisture-retentive loam"},"tips":{"th":"ปลูกใต้ร่มไม้ใหญ่ที่แดดร่มรำไร หัวขนาดเล็กจึงควรระวังตอนขุดพรวนดินไม่ให้กระทบกระเทือน","en":"Plant beneath a large tree in dappled shade — the small tubers are delicate, so be careful when working the soil nearby"}}',
  '{"light":30,"water":70,"humidity":70,"temp":27}',
  '{rare}',
  '{}',
  65
)
on conflict (id) do nothing;

insert into public.plants (id, category, emoji, name, description, care, levels, tags, images, sort_order)
values (
  'caladium',
  'bulb',
  '🍃',
  '{"th":"บอนสี","en":"Caladium"}',
  '{"th":"บอนสีมีใบรูปหัวใจลายสีสันสดใสหลากแบบตามสายพันธุ์ ปลูกจากหัวใต้ดินแตกใบใหม่ทุกฤดูฝน เป็นไม้ประดับที่นิยมสะสมเพราะมีลวดลายให้เลือกหลากหลายนับร้อยสายพันธุ์","en":"Caladium has heart-shaped leaves splashed with vividly colorful patterns that vary by cultivar. Grown from an underground tuber that sprouts fresh leaves each rainy season, it''s a favorite collector''s plant with hundreds of patterns to choose from."}',
  '{"light":{"th":"ร่มรำไรถึงแดดรำไร หลีกเลี่ยงแดดจัดจ้า","en":"Partial to bright indirect shade — avoid harsh direct sun"},"water":{"th":"ต้องการน้ำมากช่วงแตกใบ งดน้ำตอนพักตัว","en":"Needs plenty of water while leafing out; withhold water during dormancy"},"humidity":{"th":"สูง","en":"High humidity"},"temp":{"th":"22-32°C","en":"22-32°C"},"soil":{"th":"ดินร่วนอุดมอินทรียวัตถุเก็บความชื้นดี","en":"Organic-rich, moisture-retentive loam"},"tips":{"th":"ขุดหัวเก็บในที่แห้งช่วงต้นพักตัวใบเหี่ยวแล้ว ปลูกใหม่ตอนต้นฤดูฝนใบจะสวยสดกว่าปีก่อน","en":"Dig up and store the tuber somewhere dry once the leaves die back for dormancy — replanted at the start of the rains, the new leaves come back even more vivid"}}',
  '{"light":35,"water":65,"humidity":70,"temp":28}',
  '{rare}',
  '{}',
  66
)
on conflict (id) do nothing;


-- ============================================================
-- plant_varieties: two entries reclassified from standalone plants into
-- varieties of a closer parent, after reviewing the whole set for genus-level
-- overlaps (see chat). Must run AFTER the plants inserts above, since
-- plant_id is a foreign key into plants.id.
--
-- sort_order follows the existing block-per-parent convention (fern uses
-- 500-505, jasmine 800-806, moon-glaive 0) -- these use fresh, non-colliding
-- blocks.
-- ============================================================

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'siam-tulip',
  'curcuma',
  '🌷',
  '{"th":"ปทุมมา","en":"Siam Tulip"}',
  '{"th":"ปทุมมาเป็นสายพันธุ์ปลูกเลี้ยงของกระเจียวที่คัดสีสันให้เข้มสดกว่าต้นป่า กลีบประดับสีม่วงชมพูซ้อนกันเป็นชั้นคล้ายดอกทิวลิป เป็นไม้หัวประดับกระถางและตัดดอกที่ได้รับความนิยมมากที่สุดในตระกูลนี้","en":"Siam tulip is a cultivated selection of curcuma bred for richer, more saturated color than the wild form. Its layered pink-purple bracts resemble a true tulip, and it''s the most popular potted and cut-flower variety in the genus."}',
  '{"th":"กลีบประดับม่วงชมพูซ้อนชั้น, สีสันเข้มสดกว่าพันธุ์ป่า, นิยมปลูกกระถางและตัดดอก","en":"Layered pink-purple bracts, richer color than the wild form, popular for pots and cut flowers"}',
  '{"th":"ฤดูฝน (พฤษภาคม-ตุลาคม)","en":"Rainy season (May-October)"}',
  '{"th":"สูง 30-50 ซม.","en":"30-50 cm tall"}',
  '{"th":"เลือกซื้อหัวพันธุ์จากแหล่งที่ระบุสีชัดเจน เพราะสีดอกแปรผันตามสายพันธุ์คัดมาก และต้นที่ขยายด้วยเมล็ดจะไม่ตรงสีแม่ต้นเสมอไป","en":"Buy tubers from a source with the color clearly labeled — bloom color varies a lot between cultivars, and seed-grown offspring don''t always match the parent"}',
  '{"th":"พันธุ์คัดปลูกเลี้ยงจากประเทศไทย","en":"A cultivated selection developed in Thailand"}',
  '{}',
  '{}',
  900
)
on conflict (id) do nothing;

insert into public.plant_varieties (id, plant_id, emoji, name, description, features, bloom_season, size, care_tip, origin, images, tags, sort_order)
values (
  'manila-grass',
  'malaysian-grass',
  '🌱',
  '{"th":"หญ้านวลน้อย","en":"Manila Grass"}',
  '{"th":"หญ้านวลน้อยเป็นหญ้าตระกูลเดียวกับหญ้ามาเลเซียแต่ใบละเอียดนุ่มเนียนกว่า ให้ผิวสนามสวยงามแบบพรมเรียบเสมอกัน นิยมปลูกในสวนที่เน้นความสวยงามทางสายตามากกว่าพื้นที่ใช้งานเดินเหยียบหนัก","en":"Manila grass is the same genus as Malaysian carpet grass but with finer, softer blades, giving an even, carpet-smooth lawn surface. It suits gardens prized for looks over heavy foot traffic."}',
  '{"th":"ใบละเอียดนุ่มกว่าหญ้ามาเลเซีย, ผิวสนามเรียบเนียนแบบพรม, เน้นความสวยงามมากกว่าพื้นที่ใช้งานหนัก","en":"Finer and softer than Malaysian grass, smooth carpet-like surface, favors looks over heavy use"}',
  null,
  '{"th":"ตัดแต่งสูง 1-2 นิ้ว","en":"Mown to 1-2 inches"}',
  '{"th":"ทนคนเดินเหยียบได้น้อยกว่าหญ้ามาเลเซีย จึงควรปลูกเฉพาะจุดที่เน้นความสวยงามและกันทางเดินสัญจรออกต่างหาก","en":"Tolerates less foot traffic than Malaysian grass, so reserve it for showcase areas and route walkways elsewhere"}',
  '{"th":"เอเชียตะวันออกเฉียงใต้","en":"Southeast Asia"}',
  '{}',
  '{}',
  1000
)
on conflict (id) do nothing;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect bulb=4, grass=4, and every other listed category=5 (53 new plants total).
select category, count(*) as new_plants
  from public.plants
 where category in ('palm','fruit','vegetable','annual','pine','herb','grass','groundcover','tree','shrub','bulb')
 group by category
 order by category;

-- Expect 65 total (12 original + 53 new).
select count(*) as total_plants from public.plants;

-- Expect exactly 1 row each: siam-tulip under curcuma, manila-grass under malaysian-grass.
select id, plant_id, sort_order
  from public.plant_varieties
 where id in ('siam-tulip', 'manila-grass')
 order by id;
