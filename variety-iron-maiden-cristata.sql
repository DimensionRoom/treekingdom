-- ============================================================
-- New variety form: "คริสตาต้า" (cristata / crested) of Iron Maiden
--   plant:  gymnocalycium-mihanovichii
--   parent: iron-maiden
--
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
-- Requires variety-evolution.sql to have run first (parent_variety_id column).
--
-- A mutation form only carries name + description + image — the same fields
-- the admin's inline "ฟอร์มของสายพันธุ์" editor round-trips. Nothing else is
-- set here, so re-saving the parent in the admin never silently drops data.
-- Everything worth saying about the crest is folded into `description`.
-- `features` is NOT NULL in the schema, so it is written empty on purpose.
--
-- Safe to run more than once: upsert on the primary key, same literal values.
-- Image is left empty — add it from the admin form once a photo exists.
-- ============================================================

insert into public.plant_varieties
  (id, plant_id, parent_variety_id, emoji, name, description, features, images, image, tags, sort_order)
values (
  'iron-maiden-cristata',
  'gymnocalycium-mihanovichii',
  'iron-maiden',
  '',
  '{"th":"ไอออน เมเดน คริสตาต้า","en":"Iron Maiden Cristata"}'::jsonb,
  '{"th":"ฟอร์มคริสตาต้าของไอออน เมเดน จุดเจริญที่ปกติเป็นจุดเดียวกลายพันธุ์ยืดออกเป็นแนวเส้น ต้นจึงไม่โตเป็นลูกกลม แต่บิดเป็นสันคลื่นซ้อนกันคล้ายพัดหรือปะการัง ผิวโทนเขียวอ่อนแบบไอออน เมเดน หนามสั้นเรียงตามสัน แต่ละต้นฟอร์มไม่ซ้ำกัน ยิ่งโตยิ่งม้วนเป็นก้อนแน่น กอโตเต็มที่ราว 8–15 ซม. ออกดอกได้ตลอดปี เป็นของสะสมที่หายากกว่าต้นฟอร์มปกติมาก\n\nการดูแล: ร่องระหว่างสันคลื่นกักน้ำและเศษผงได้ง่าย รดน้ำที่โคนดินอย่างเดียว อย่าให้น้ำค้างบนตัวต้น วางในที่ลมโกรกและแดดรำไรถึงแดดเช้า ถ้าเลี้ยงต้นเสียบยอดให้ระวังโคนต้นตอเน่าช่วงหน้าฝน","en":"The cristata (crested) form of Iron Maiden. Its normally single growing point mutates into a line, so instead of a round body the plant folds into stacked wavy ridges — fan- or coral-like, with the same pale green skin and short spines along each ridge. No two are alike; it tightens into a dense mound 8–15 cm across as it matures, can flower year-round, and is far scarcer than the normal form.\n\nCare: water traps in the folds of the crest, so water only at the soil and keep the body dry. Give it airflow and bright light to gentle morning sun. If it is grafted, watch the rootstock base for rot in the wet season."}'::jsonb,
  '{"th":"","en":""}'::jsonb,
  '{}'::text[],
  null,
  '{"rare"}'::text[],
  0
)
on conflict (id) do update set
  plant_id          = excluded.plant_id,
  parent_variety_id = excluded.parent_variety_id,
  emoji             = excluded.emoji,
  name              = excluded.name,
  description        = excluded.description,
  features          = excluded.features,
  tags              = excluded.tags,
  -- clear anything a fatter earlier version of this file may have written,
  -- so the row ends up shaped like a form no matter what ran before
  bloom_season = null,
  size         = null,
  care_tip     = null,
  origin       = null,
  origin_url   = null;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect one row, parent_variety_id = 'iron-maiden'.
select id, parent_variety_id, name->>'th' as name_th
  from public.plant_varieties
 where id = 'iron-maiden-cristata';
