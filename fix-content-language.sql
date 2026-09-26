-- ============================================================
-- Fix spelling, spacing and wording errors in site content
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Found in a language audit of every visible plant, variety and product.
-- Part 1 rewrites specific fields on specific rows; each is a whole-value
-- replacement taken from the text as it stood at the time of the audit, so
-- re-running it changes nothing further. Part 2 runs pattern fixes across
-- whole tables and is also safe to re-run.
--
-- Deliberately NOT touched:
--   * "พลู" in plants/pothos. That is พลูด่าง, the plant's correct Thai name;
--     only the three cactus rows below had "พลู" where the rib ("พู") was meant.
--   * The descriptions written in British English (Lithops, Episcia, Begonia,
--     Marcgravia); spelling style is a separate decision.
--   * Empty descriptions (JF46, JF13, ค็อกเทล, ...): there is nothing to fix,
--     only content still to write.
--
-- Safe to run more than once.
-- ============================================================

-- ============ Part 1: specific rows ============

-- Gymnocalycium mihanovichii is a species, not a genus, and a species
-- epithet is lower-case.
update public.plants set
  name = jsonb_set(name, '{en}', to_jsonb('Gymnocalycium mihanovichii'::text)),
  description = jsonb_build_object(
    'th', 'ยิมโนคาไลเซียม มิฮาโนวิชิอาย หรือ “ยิมโน” เป็นกระบองเพชรขนาดเล็กถึงกลางในสกุลยิมโนคาไลเซียมที่ได้รับความนิยมมาก โดยเฉพาะในกลุ่มนักสะสม เพราะมีทรงต้นสวย หนามหลากหลาย และมีสายพันธุ์ด่างและสีต่าง ๆ ให้เลือกมาก',
    'en', 'Gymnocalycium mihanovichii is a small to medium-sized cactus in the genus Gymnocalycium, and very popular with collectors for its attractive body shape, varied spines, colorful flowers and many variegated forms.'
  )
where id = 'gymnocalycium-mihanovichii';

-- สิรยากร I: missing spaces, a stray trailing space, broken English
-- punctuation, and "พลู" for "พู". The Thai says the ribs swirl, so the
-- English now says ribs too (it said areoles).
update public.plant_varieties set
  description = jsonb_build_object(
    'th', 'เป็นยิมโนเขียวเอกลักษณ์ลำดับที่ 1 ของ TreeKingdom Nursery อ่านชื่อตามเลขโรมันว่า “Sirayakon the one”',
    'en', 'TreeKingdom Nursery''s No. 1 signature green Gymno. The Roman numeral is read as “Sirayakon the one”.'
  ),
  features = jsonb_build_object(
    'th', 'ดอทเรียงชิดติดกันถี่ ดูสวยงาม ผิวสวย หนามเดี่ยวเป็นส่วนใหญ่ บางช่วงของการเติบโตอาจเห็นพูเวียนหมุนเป็นเกลียวเมื่อมองจากด้านบน',
    'en', 'The dots are closely arranged, creating a dense and attractive pattern. The skin is beautiful, with mostly single spines. During certain stages of growth, the ribs may appear to twist into a spiral when viewed from above.'
  )
where id = 'Sirayakon-01';

-- Moon Glaive: "เกรฟ" reads as "grave" (Glaive is เกลฟ), "สีนวลนวล" repeats a
-- word, "หล่อ" was "หน่อ" (offset, as the English says), "พลู" was "พู", and
-- the English description stopped mid-sentence.
update public.plant_varieties set
  name = jsonb_set(name, '{th}', to_jsonb('มูนเกลฟ'::text)),
  description = jsonb_build_object(
    'th', 'มูนเกลฟเป็นแคคตัสด่างเหลืองสีนวล',
    'en', 'Moon Glaive is a cactus with soft, creamy-yellow variegation.'
  ),
  features = jsonb_set(features, '{th}', to_jsonb('ด่างเหลืองนวลเข้าที่บั้งครบทุกพู และให้หน่อที่ด่างครบทุกพูได้ตั้งแต่แรก'::text))
where id = 'moon-glaive';

-- Iron Maiden: "ไอออน" means "ion"; "จุดนึง" is spoken form; "พลู" was "พู".
update public.plant_varieties set
  name = jsonb_set(name, '{th}', to_jsonb('ไอรอน เมเดน'::text)),
  features = jsonb_set(features, '{th}', to_jsonb('ยิมโนสีเขียวโทนอ่อน ๆ มีหนามเดี่ยว เมื่อเลี้ยงจนโตถึงจุดหนึ่งจะมีพูแทรกขึ้นมาจนครบทุกพู'::text))
where id = 'iron-maiden';

-- Green Day: the list of forms needed "ได้แก่" and a stray space removed.
update public.plant_varieties set
  features = jsonb_set(features, '{th}', to_jsonb('เป็นคริสไร้หนาม ให้หน่อที่เป็นคริสทุกหน่อ และยังมีอีกหลายฟอร์ม ได้แก่ หัวแฝด มอนโทรส และด่าง'::text))
where id = 'green-day';

-- Phalaenopsis: one run-on sentence split so it reads correctly.
update public.plant_varieties set
  description = jsonb_set(description, '{th}', to_jsonb('ฟาแลนนอปซิสได้ฉายาว่ากล้วยไม้ผีเสื้อกลางคืน เพราะดอกแบนกว้างคล้ายปีกผีเสื้อ ใบอวบหนา ไม่มีลำลูกกล้วย จึงสะสมน้ำไว้ในใบแทน ทนสภาพในบ้านและวางในห้องแอร์ได้ดีกว่ากล้วยไม้ชนิดอื่น ดอกหนึ่งช่อบานได้นานหลายเดือนโดยไม่ร่วง'::text))
where id = 'orchid-phalaenopsis';

-- Manila grass (Zoysia) and Malaysian grass (Axonopus) are different genera;
-- the English said "same genus". Both languages now compare them without
-- claiming kinship.
update public.plant_varieties set
  description = jsonb_build_object(
    'th', 'หญ้านวลน้อยมีใบละเอียดและนุ่มเนียนกว่าหญ้ามาเลเซีย ให้ผิวสนามสวยงามแบบพรมเรียบเสมอกัน นิยมปลูกในสวนที่เน้นความสวยงามมากกว่าพื้นที่ที่ใช้เดินเหยียบหนัก',
    'en', 'Manila grass has finer, softer blades than Malaysian carpet grass, giving an even, carpet-smooth lawn. It suits gardens where looks matter more than heavy foot traffic.'
  )
where id = 'manila-grass';

-- Ceramic pot: stray spaces in the Thai name, a clumsy English name, and a
-- Thai description that only repeated the name (now translated from the
-- existing English description).
update public.supplies set
  name = jsonb_build_object('th', 'กระถางเซรามิกบอนไซสไตล์ญี่ปุ่น', 'en', 'Japanese-Style Ceramic Bonsai Pot'),
  description = jsonb_set(description, '{th}', to_jsonb('กระถางเซรามิกมีรูระบายน้ำ มีให้เลือกหลายสี'::text))
where id = 'ceramic-pot';

-- ============ Part 2: table-wide passes ============

-- Thai standard spacing puts a space before ไม้ยมก: "เรื่อยๆ" -> "เรื่อย ๆ".
-- Run on the jsonb text so nested care fields are covered too; ๆ only ever
-- appears inside string values, never in JSON syntax.
update public.plants set
  name        = regexp_replace(name::text,        '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  description = regexp_replace(description::text, '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  care        = regexp_replace(care::text,        '(\S)ๆ', '\1 ๆ', 'g')::jsonb
where (name::text || description::text || care::text) ~ '\Sๆ';

update public.plant_varieties set
  name         = regexp_replace(name::text,         '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  description  = regexp_replace(description::text,  '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  features     = regexp_replace(features::text,     '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  size         = regexp_replace(size::text,         '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  bloom_season = regexp_replace(bloom_season::text, '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  care_tip     = regexp_replace(care_tip::text,     '(\S)ๆ', '\1 ๆ', 'g')::jsonb
where (name::text || description::text || features::text
       || coalesce(size::text, '') || coalesce(bloom_season::text, '')
       || coalesce(care_tip::text, '')) ~ '\Sๆ';

update public.supplies set
  name        = regexp_replace(name::text,        '(\S)ๆ', '\1 ๆ', 'g')::jsonb,
  description = regexp_replace(description::text, '(\S)ๆ', '\1 ๆ', 'g')::jsonb
where (name::text || description::text) ~ '\Sๆ';

-- "เฟิน" is the Royal Institute spelling, and the site's own fern category
-- already uses it; plant, variety and product text said "เฟิร์น". Delete this
-- block if you would rather keep "เฟิร์น".
update public.plants set
  name        = replace(name::text,        'เฟิร์น', 'เฟิน')::jsonb,
  description = replace(description::text, 'เฟิร์น', 'เฟิน')::jsonb,
  care        = replace(care::text,        'เฟิร์น', 'เฟิน')::jsonb
where (name::text || description::text || care::text) like '%เฟิร์น%';

update public.plant_varieties set
  name         = replace(name::text,         'เฟิร์น', 'เฟิน')::jsonb,
  description  = replace(description::text,  'เฟิร์น', 'เฟิน')::jsonb,
  features     = replace(features::text,     'เฟิร์น', 'เฟิน')::jsonb,
  size         = replace(size::text,         'เฟิร์น', 'เฟิน')::jsonb,
  bloom_season = replace(bloom_season::text, 'เฟิร์น', 'เฟิน')::jsonb,
  care_tip     = replace(care_tip::text,     'เฟิร์น', 'เฟิน')::jsonb
where (name::text || description::text || features::text
       || coalesce(size::text, '') || coalesce(bloom_season::text, '')
       || coalesce(care_tip::text, '')) like '%เฟิร์น%';

update public.supplies set
  name        = replace(name::text,        'เฟิร์น', 'เฟิน')::jsonb,
  description = replace(description::text, 'เฟิร์น', 'เฟิน')::jsonb
where (name::text || description::text) like '%เฟิร์น%';

notify pgrst, 'reload schema';

-- ---------- Verify: every count should be 0 ----------
select 'ๆ without a space before it' as issue, count(*) from (
  select id from public.plants where (name::text || description::text || care::text) ~ '\Sๆ'
  union all
  select id from public.plant_varieties where (name::text || description::text || features::text
    || coalesce(size::text, '') || coalesce(bloom_season::text, '') || coalesce(care_tip::text, '')) ~ '\Sๆ'
  union all
  select id from public.supplies where (name::text || description::text) ~ '\Sๆ'
) t
union all
select 'เฟิร์น still present', count(*) from (
  select id from public.plants where (name::text || description::text || care::text) like '%เฟิร์น%'
  union all
  select id from public.plant_varieties where (name::text || description::text || features::text
    || coalesce(care_tip::text, '')) like '%เฟิร์น%'
  union all
  select id from public.supplies where (name::text || description::text) like '%เฟิร์น%'
) t
union all
select 'cactus rows still saying พลู', count(*) from public.plant_varieties
 where id in ('Sirayakon-01', 'moon-glaive', 'iron-maiden') and features::text like '%พลู%';
