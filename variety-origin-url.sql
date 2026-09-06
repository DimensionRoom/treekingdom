-- ============================================================
-- Optional link on the "origin" field of a variety — for pointing at the
-- nursery/shop's own social page (Facebook/IG/Line) rather than a bare
-- place name.
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Safe to run more than once: `add column if not exists` is idempotent and
-- this migration sets no data, so re-running touches nothing.
-- ============================================================

alter table public.plant_varieties add column if not exists origin_url text;

comment on column public.plant_varieties.origin_url is
  'Optional URL the origin text links to when tapped — typically the nursery/shop''s social page. Null renders origin as plain text.';

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect one row: the column should now exist.
select column_name
  from information_schema.columns
 where table_schema = 'public'
   and table_name = 'plant_varieties'
   and column_name = 'origin_url';
