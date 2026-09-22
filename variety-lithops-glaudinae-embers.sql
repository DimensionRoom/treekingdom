-- ============================================================
-- Add the variety: Lithops glaudinae 'Embers'
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Full botanical name is Lithops bromfieldii var. glaudinae 'Embers' —
-- glaudinae is a variety of the species bromfieldii, 'Embers' a selection
-- within it. The short form is used for the display name, matching how
-- lithops-otzeniana is named, with the full name carried in the description.
--
-- No images: those have to be uploaded through the admin, which is also where
-- `origin` belongs once you know which nursery the stock came from.
--
-- Sources:
--   llifle.com/.../13239/Lithops_bromfieldii_var._glaudinae_C116_TL:_70_km_WNW_of_Griquatown,_South_Africa
--   llifle.com/.../14205/Lithops_bromfieldii_var._glaudinae_C393_70_km_NW_of_Griquatown,_South_Africa
--   cactuspro.com/conophytum-lithops/encyclopedie/lithops/bromfieldii/var.-glaudinae/-embers-/
--
-- Safe to run more than once.
-- ============================================================

insert into public.plant_varieties
  (id, plant_id, emoji, name, description, features, size, bloom_season, care_tip, tags, images, sort_order)
values (
  'lithops-glaudinae-embers',
  'lithops',
  '',

  jsonb_build_object(
    'th', 'ไลทอป กลาวดิเน่ ''เอมเบอร์ส''',
    'en', 'Lithops glaudinae ''Embers'''
  ),

  jsonb_build_object(
    'th', 'พันธุ์คัดสีของ Lithops bromfieldii var. glaudinae ซึ่งขึ้นตามซอกหินที่แดดจัดและแห้งแถบเมือง Griquatown เขตนอร์เทิร์นเคป แอฟริกาใต้ ต้นนี้มีรหัสถิ่น C393A และบางร้านขายในชื่อการค้าว่า "Rubroroseus" ตัว glaudinae เองมีเอกลักษณ์ที่หน้าใบเต็มไปด้วยจุดทึบเล็ก ๆ จำนวนมากที่มีประกายสะท้อนคล้ายโลหะ ทับบนลายเส้นสีแดงเลือดหม่น ส่วน ''Embers'' คือการคัดให้สีแดงนั้นเข้มจัดขึ้นจนหน้าใบออกโทนแดงทองแดงเหมือนถ่านไฟ อันเป็นที่มาของชื่อ',
    'en', 'A colour selection of Lithops bromfieldii var. glaudinae, which grows in sunny, dry rock crevices around Griquatown in South Africa''s Northern Cape. This clone carries the field number C393A and is also traded as "Rubroroseus". The variety itself is marked by dense dusky dots with a metallic sheen laid over dull blood-red lines; ''Embers'' is the selection that pushes that red to a saturated copper glow, which is where the name comes from.'
  ),

  jsonb_build_object(
    'th', 'หน้าใบโทนแดงทองแดง, จุดทึบประกายโลหะ, ลายเส้นแดงเข้ม, ดอกเหลือง',
    'en', 'Copper-red face, metallic dusky dots, deep red lines, yellow flower'
  ),

  jsonb_build_object('th', 'สูงราว 1.5 ซม. หน้ากว้าง 2-2.5 ซม.', 'en', 'About 1.5 cm tall, 2-2.5 cm across'),

  jsonb_build_object('th', 'ฤดูใบไม้ร่วง', 'en', 'Autumn'),

  -- The tip that actually matters for this one specifically: it was selected
  -- for colour, and colour is the first thing lost to weak light.
  jsonb_build_object(
    'th', 'ความเข้มของสีแดงขึ้นกับแสงโดยตรง แสงไม่พอเมื่อไหร่หน้าจะซีดลงและต้นยืดเสียทรง ควรให้แดดจัดแต่พรางบ้างช่วงแดดแรงที่สุด และห้ามย้ายจากที่ร่มออกไปกลางแดดทันที เพราะผิวจะไหม้',
    'en', 'How red it gets is a direct function of light: too little and the face fades while the body stretches out of shape. Give it strong sun with some shade at peak intensity, and never move it from shade into full sun in one step — it will scorch.'
  ),

  '{"rare"}'::text[],
  '{}'::text[],
  1
)
on conflict (id) do update set
  plant_id     = excluded.plant_id,
  name         = excluded.name,
  description  = excluded.description,
  features     = excluded.features,
  size         = excluded.size,
  bloom_season = excluded.bloom_season,
  care_tip     = excluded.care_tip,
  tags         = excluded.tags;
  -- images and origin are deliberately not overwritten here, so re-running
  -- this can't wipe pictures or a nursery credit added later in the admin.

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect two lithops varieties now, both with parent_variety_id null so each
-- opens its own sheet (/plants/lithops?variety=<id>).
select id, sort_order, parent_variety_id,
       name ->> 'th'     as name_th,
       features ->> 'th' as features_th,
       tags
  from public.plant_varieties
 where plant_id = 'lithops'
 order by sort_order;
