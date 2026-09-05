-- ============================================================
-- Remove the per-variety "care difficulty" field
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- The column was added by variety-detail-external.sql and populated for all
-- 14 varieties. It is being dropped on purpose — the values go with it and
-- cannot be recovered.
--
-- Safe to run more than once.
-- ============================================================

alter table public.plant_varieties drop column if exists difficulty;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect zero rows: the column should no longer exist.
select column_name
  from information_schema.columns
 where table_schema = 'public'
   and table_name = 'plant_varieties'
   and column_name = 'difficulty';

-- The other variety detail fields must be untouched — expect 14 rows,
-- every one still carrying its care tip and origin.
select id, plant_id, (care_tip is not null) as has_tip, (origin is not null) as has_origin
  from public.plant_varieties
 order by plant_id, sort_order;
