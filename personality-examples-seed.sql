-- ============================================================
-- Personality Examples — seed to 3 per archetype (15 rows total)
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Prerequisite: personality-examples-external.sql has already been run
-- (it creates the table, grants, RLS policies and the updated_at trigger).
--
-- Safe to run more than once:
--   * inserts use `on conflict (id) do nothing` so hand-edited copy is never
--     overwritten
--   * repairs are guarded on the known-wrong value, so they become no-ops
--     once applied (or if an admin already fixed the row by hand)
-- ============================================================

-- ---------- Guard: archetype must match ARCHETYPES in src/lib/personality.ts ----------
-- Without this a typo'd key is accepted by the DB and the card silently never renders.
alter table public.personality_examples
  drop constraint if exists personality_examples_archetype_check;
alter table public.personality_examples
  add constraint personality_examples_archetype_check
  check (archetype in ('chill', 'sun', 'nurturer', 'shade', 'collector'));

-- ---------- 15 examples: 3 per archetype ----------
-- plant_id is written as a subselect, not a literal: a missing plant yields NULL
-- (row still inserts, just unlinked) instead of a 23503 FK error that would roll
-- back this whole script.
-- images stays empty on purpose — the app falls back to the linked plant's photos
-- at render time. Copying paths here would make deleting an example delete the
-- plant's image files from storage (see AdminPage handleDelete / ImageUploader).
-- sort_order is global 0..14 grouped by archetype: the app orders by sort_order
-- across the whole table, so per-archetype 0,1,2 would tie five ways.
insert into public.personality_examples (id, archetype, emoji, title, description, tips, images, plant_id, sort_order)
values
  -- ===== chill · สายชิลล์ ปล่อยเลี้ยง =====
  (
    'chill-shelf', 'chill', '😎',
    '{"th":"ชั้นไม้อวบน้ำริมหน้าต่าง","en":"Succulent shelf by the window"}',
    '{"th":"จัดไม้อวบน้ำและแคคตัสในกระถางเซรามิกบนชั้นไม้ ใกล้หน้าต่างที่มีแสงสว่าง ดูแลน้อยแต่สวยตลอดปี","en":"Succulents and cacti in ceramic pots on a wooden shelf near a bright window — low effort, always tidy."}',
    '{"th":"รดน้ำเมื่อดินแห้งสนิท ประมาณ 10–14 วันครั้ง ใช้ดินระบายน้ำดี","en":"Water only when the soil is bone dry (every 10–14 days) and use fast-draining mix."}',
    '{}', (select id from public.plants where id = 'echeveria'), 0
  ),
  (
    'chill-desk-cactus', 'chill', '🌵',
    '{"th":"โต๊ะทำงานแคคตัสกระถางจิ๋ว","en":"Mini cactus desk"}',
    '{"th":"ยิมโนคาไลเซียมสีสดในกระถางจิ๋วเรียงข้างจอคอมพิวเตอร์ รับแสงจากหน้าต่างข้าง ๆ ไม่ต้องดูแลอะไรเลยตลอดสัปดาห์งาน","en":"Bright gymnocalycium in tiny pots lined up beside the monitor, lit by a side window — they ask for nothing all work week."}',
    '{"th":"รดน้ำเดือนละ 2 ครั้งก็พอ และเทน้ำที่ค้างในจานรองทิ้งทุกครั้ง เพราะรากเน่าง่ายกว่าขาดน้ำมาก","en":"Water twice a month at most and always empty the saucer — these rot far more easily than they dry out."}',
    '{}', (select id from public.plants where id = 'gymnocalycium-mihanovichii'), 1
  ),
  (
    'chill-aloe-kitchen', 'chill', '💚',
    '{"th":"ว่านหางจระเข้ริมซิงก์ครัว","en":"Aloe by the kitchen sink"}',
    '{"th":"ว่านหางจระเข้กระถางเดียวตั้งริมหน้าต่างครัว ได้แสงเช้ากำลังดี ตัดใบใช้เจลทาแผลน้ำร้อนลวกจากการทำอาหารได้ทันที","en":"A single aloe on the kitchen windowsill catching morning light — snap off a leaf for kitchen burns."}',
    '{"th":"รดน้ำเมื่อดินแห้งสนิท ประมาณ 2 สัปดาห์ครั้ง และตัดใบนอกสุดก่อนเสมอ ต้นจะแตกใบใหม่จากกลางกอ","en":"Water every couple of weeks once the soil is fully dry, and always cut the outermost leaves first so the centre keeps producing."}',
    '{}', (select id from public.plants where id = 'aloe-vera'), 2
  ),

  -- ===== sun · สายรักแสงแดด =====
  (
    'sun-balcony', 'sun', '🌞',
    '{"th":"ระเบียงไม้ดอกรับแดดเต็ม","en":"Full-sun flowering balcony"}',
    '{"th":"กระถางดินเผาไม้ดอกเรียงริมราวระเบียง รับแดดเช้าถึงบ่าย ให้สีสันสดใสทุกวัน","en":"Terracotta pots of flowering plants along the railing, soaking up morning-to-afternoon sun."}',
    '{"th":"รดน้ำเช้า–เย็นในหน้าร้อน และให้ปุ๋ยสูตรเร่งดอกทุก 2 สัปดาห์","en":"Water morning and evening in hot months and feed a bloom fertilizer every two weeks."}',
    '{}', (select id from public.plants where id = 'rose'), 3
  ),
  (
    'sun-jasmine-fence', 'sun', '🤍',
    '{"th":"รั้วมะลิหอมหน้าบ้าน","en":"Fragrant jasmine fence"}',
    '{"th":"มะลิปลูกลงดินเลื้อยคลุมรั้วหน้าบ้าน รับแดดเต็มวัน ออกดอกขาวส่งกลิ่นหอมแรงที่สุดตอนหัวค่ำ","en":"Jasmine planted along the front fence in full sun, its white flowers strongest-scented at dusk."}',
    '{"th":"ตัดแต่งกิ่งทุกครั้งหลังดอกโรยเพื่อให้แตกยอดใหม่ และใส่ปุ๋ยคอกเดือนละครั้งช่วงหน้าฝน","en":"Prune right after each flush to force new shoots, and top-dress with manure monthly through the rainy season."}',
    '{}', (select id from public.plants where id = 'jasmine'), 4
  ),
  (
    'sun-lotus-bowl', 'sun', '🪷',
    '{"th":"อ่างบัวกลางลานแดด","en":"Lotus bowl in the open yard"}',
    '{"th":"อ่างดินเผาใบใหญ่ปลูกบัวหลวงกลางลานที่ได้แดดเต็มวัน ใส่ปลาหางนกยูงไม่กี่ตัวช่วยกินลูกน้ำ","en":"A wide earthen bowl of lotus in a full-sun yard, with a few guppies to keep mosquito larvae down."}',
    '{"th":"บัวต้องการแดดอย่างน้อยวันละ 6 ชั่วโมงจึงจะออกดอก เติมน้ำให้ท่วมเหง้าเสมอ และเปลี่ยนน้ำเมื่อเริ่มขุ่นเขียว","en":"Lotus needs at least six hours of direct sun to bloom — keep the rhizome submerged and change the water when it turns green."}',
    '{}', (select id from public.plants where id = 'lotus'), 5
  ),

  -- ===== nurturer · สายเอาใจใส่ =====
  (
    'nurturer-corner', 'nurturer', '💚',
    '{"th":"มุมเขตร้อนชื้นในบ้าน","en":"Humid tropical corner"}',
    '{"th":"เฟินและมอนสเตอร่าจัดรวมกันพร้อมเครื่องพ่นไอน้ำ เหมาะกับคนที่สนุกกับการดูแลทุกวัน","en":"Ferns and monstera grouped with a humidifier — perfect for daily-care lovers."}',
    '{"th":"รักษาความชื้น 60–70% เช็ดใบสัปดาห์ละครั้ง และหมุนกระถางให้โตสม่ำเสมอ","en":"Keep humidity at 60–70%, wipe leaves weekly, and rotate pots for even growth."}',
    '{}', (select id from public.plants where id = 'fern'), 6
  ),
  (
    'nurturer-orchid-bath', 'nurturer', '🌺',
    '{"th":"กล้วยไม้ในห้องน้ำมีแสงธรรมชาติ","en":"Orchids in a daylit bathroom"}',
    '{"th":"แขวนกล้วยไม้ไว้ใกล้หน้าต่างห้องน้ำ ไอน้ำจากการอาบน้ำทุกวันให้ความชื้นที่กล้วยไม้ชอบ โดยไม่ต้องซื้อเครื่องพ่นไอน้ำเลย","en":"Orchids hung by the bathroom window — daily shower steam gives them the humidity they crave, no humidifier needed."}',
    '{"th":"ปลูกในเครื่องปลูกโปร่งอย่างกาบมะพร้าวหรือเปลือกไม้ ห้ามใช้ดิน รดน้ำสัปดาห์ละ 1–2 ครั้งให้รากชุ่มแล้วปล่อยให้แห้งก่อนรอบถัดไป","en":"Pot in a loose medium like bark or coconut husk, never soil; soak the roots once or twice a week and let them dry between waterings."}',
    '{}', (select id from public.plants where id = 'orchid'), 7
  ),
  (
    'nurturer-water-bowl', 'nurturer', '💜',
    '{"th":"อ่างน้ำผักตบชวาหน้าระเบียง","en":"Water hyacinth bowl on the balcony"}',
    '{"th":"อ่างน้ำตื้นวางผักตบชวาลอยเต็มผิวน้ำ ออกดอกสีม่วงอ่อนเมื่อได้แดดพอ และช่วยกรองน้ำให้ใสขึ้นเอง","en":"A shallow bowl covered in floating water hyacinth — soft purple flowers when it gets enough sun, and it clears the water on its own."}',
    '{"th":"ผักตบชวาโตเร็วมาก ต้องช้อนออกทุก 2 สัปดาห์ไม่ให้แน่นเกินไป และห้ามปล่อยลงแหล่งน้ำธรรมชาติเด็ดขาด","en":"It multiplies fast — thin it out every two weeks, and never release it into natural waterways."}',
    '{}', (select id from public.plants where id = 'water-hyacinth'), 8
  ),

  -- ===== shade · สายมุมร่ม =====
  (
    'shade-corner', 'shade', '🌙',
    '{"th":"มุมร่มแสงน้อยก็เขียวได้","en":"Green in a low-light corner"}',
    '{"th":"พลูด่างและลิ้นมังกรในกระถางพาสเทล วางในมุมที่แสงส่องไม่ถึงมาก ยังโตดี","en":"Pothos and snake plants in pastel pots thriving in a dim corner of the room."}',
    '{"th":"ลดการรดน้ำลงครึ่งหนึ่งเมื่อแสงน้อย และย้ายออกรับแสงรำไรเดือนละครั้ง","en":"Halve watering in low light and give them indirect light once a month."}',
    '{}', (select id from public.plants where id = 'monstera'), 9
  ),
  (
    'shade-pothos-shelf', 'shade', '🍃',
    '{"th":"พลูด่างเลื้อยจากชั้นหนังสือ","en":"Pothos trailing off the bookshelf"}',
    '{"th":"พลูด่างกระถางแขวนบนชั้นหนังสือชั้นบนสุด ปล่อยเถาห้อยลงมาเป็นม่านใบ อยู่ได้ดีแม้ห้องนั้นแทบไม่มีแสงตรงเลย","en":"A pothos on the top shelf letting its vines curtain down — perfectly happy in a room that gets almost no direct light."}',
    '{"th":"ตัดยอดที่ยาวเกินไปปักชำในแก้วน้ำได้เลย รากจะออกใน 1–2 สัปดาห์ ถ้าใบเริ่มเขียวล้วนไม่มีลาย แปลว่าแสงน้อยเกินไป","en":"Snip overlong vines and root them in a glass of water within a week or two; if the variegation fades to plain green, it needs more light."}',
    '{}', (select id from public.plants where id = 'pothos'), 10
  ),
  (
    'shade-fern-bathroom', 'shade', '🌱',
    '{"th":"เฟิร์นในห้องน้ำแสงน้อย","en":"Fern in a dim bathroom"}',
    '{"th":"เฟิร์นกระถางเล็กวางบนชั้นในห้องน้ำที่มีแค่แสงจากช่องระบายอากาศ ความชื้นสูงตลอดเวลาทำให้ใบไม่กรอบ","en":"A small fern on a bathroom shelf lit only by a vent — the constant humidity keeps its fronds from crisping."}',
    '{"th":"อย่าปล่อยให้ดินแห้ง เฟิร์นทนแล้งไม่ได้เลย ถ้าปลายใบเริ่มไหม้แปลว่าอากาศแห้งเกินไป ให้พ่นละอองน้ำเพิ่ม","en":"Never let the soil dry out — ferns have no drought tolerance; browning tips mean the air is too dry, so mist more often."}',
    '{}', (select id from public.plants where id = 'fern'), 11
  ),

  -- ===== collector · สายสะสมตัวจริง =====
  (
    'collector-wall', 'collector', '✨',
    '{"th":"ชั้นสะสมหลากสายพันธุ์","en":"Multi-species collector shelf"}',
    '{"th":"ชั้นวางหลายชั้นพร้อมป้ายชื่อพันธุ์ จัดกลุ่มตามความต้องการน้ำและแสงให้ดูแลง่าย","en":"Tiered shelves with name tags, grouped by water and light needs for easy care."}',
    '{"th":"จัดกลุ่มต้นที่ต้องการน้ำใกล้เคียงกันไว้ด้วยกัน และจดวันรดน้ำไว้ที่ป้าย","en":"Group plants with similar water needs together and note watering dates on the tags."}',
    '{}', (select id from public.plants where id = 'pothos'), 12
  ),
  (
    'collector-orchid-rack', 'collector', '🌸',
    '{"th":"ชั้นกล้วยไม้หลายสี","en":"Multi-colour orchid rack"}',
    '{"th":"ราวแขวนกล้วยไม้ใต้ชายคาหลายสิบกระถาง คัดสีและช่วงออกดอกให้ต่างกัน เพื่อให้มีดอกหมุนเวียนตลอดทั้งปี","en":"Dozens of orchids hung under the eaves, chosen for staggered colours and bloom times so something is always flowering."}',
    '{"th":"ติดป้ายชื่อพันธุ์และวันที่ออกดอกไว้ทุกกระถาง จะรู้ทันทีว่าต้นไหนพักตัวผิดปกติ และเว้นระยะให้ลมผ่านเพื่อกันเชื้อรา","en":"Tag every pot with its cultivar and last bloom date so you can spot one that has stalled, and leave gaps for airflow to prevent rot."}',
    '{}', (select id from public.plants where id = 'orchid'), 13
  ),
  (
    'collector-cactus-tray', 'collector', '🌵',
    '{"th":"ถาดแคคตัสจิ๋วหลายทรง","en":"Tray of miniature cacti"}',
    '{"th":"ถาดสังกะสีใส่แคคตัสกระถาง 2 นิ้วหลายสิบทรง จัดเรียงตามขนาดและสี ยกทั้งถาดออกไปรับแดดได้ทีเดียว","en":"A zinc tray of two-inch cacti in every shape, arranged by size and colour and carried out to the sun as one unit."}',
    '{"th":"รดน้ำทีละต้นด้วยขวดปากแหลม อย่ารดทั้งถาดรวดเดียว เพราะแต่ละทรงต้องการน้ำไม่เท่ากัน และหมุนถาดสัปดาห์ละครั้งกันต้นเอียงเข้าหาแสง","en":"Water each pot individually with a narrow-spout bottle rather than soaking the tray — needs vary by species — and rotate it weekly so nothing leans toward the light."}',
    '{}', (select id from public.plants where id = 'gymnocalycium-mihanovichii'), 14
  )
on conflict (id) do nothing;

-- ---------- Repair: plant_id on the original 5 rows ----------
-- The first seed bound plants positionally (`order by sort_order limit 1 offset N`),
-- so three rows point at a plant that has nothing to do with the scene described.
-- Each update is guarded on the known-wrong value: already-correct rows and rows an
-- admin fixed by hand are left alone, and re-running this file changes nothing.
update public.personality_examples set plant_id = 'echeveria'
 where id = 'chill-shelf' and plant_id is not distinct from 'lotus';

update public.personality_examples set plant_id = 'rose'
 where id = 'sun-balcony' and plant_id is not distinct from 'water-lily';

update public.personality_examples set plant_id = 'fern'
 where id = 'nurturer-corner' and plant_id is not distinct from 'water-hyacinth';

-- ---------- Repair: regroup sort_order of the original 5 rows ----------
-- They were 0,1,2,3,4; the new layout needs them at the head of each archetype block.
update public.personality_examples set sort_order = 3
 where id = 'sun-balcony' and sort_order = 1;

update public.personality_examples set sort_order = 6
 where id = 'nurturer-corner' and sort_order = 2;

update public.personality_examples set sort_order = 9
 where id = 'shade-corner' and sort_order = 3;

update public.personality_examples set sort_order = 12
 where id = 'collector-wall' and sort_order = 4;

notify pgrst, 'reload schema';

-- ---------- Verify: expect 3 rows for each of the 5 archetypes ----------
select archetype, count(*) as examples
  from public.personality_examples
 group by archetype
 order by archetype;

-- Expect every row to be linked, and no plant that contradicts its scene.
select sort_order, id, archetype, plant_id
  from public.personality_examples
 order by sort_order, id;
