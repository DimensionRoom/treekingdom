-- ============================================================
-- Let a variety branch into mutation forms (its "evolution").
-- e.g. Gymnocalycium "Iron Maiden" → cristata / variegated / spineless,
-- which the market treats as separate plants at separate prices.
--
-- Modelled as a self-reference rather than a new table so a form gets every
-- field a variety already has — images, description, features, tags, care tip,
-- origin (+ link) — and can be linked to a supply the same way.
--
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Safe to run more than once: every statement is idempotent and no data is
-- written, so existing rows stay top-level (parent_variety_id null).
-- ============================================================

alter table public.plant_varieties
  add column if not exists parent_variety_id text
  references public.plant_varieties(id) on delete set null;

comment on column public.plant_varieties.parent_variety_id is
  'The variety this one is a mutation form of. Null = a top-level variety, which is all the list view shows. ON DELETE SET NULL on purpose: removing a parent promotes its forms to top level rather than deleting them.';

-- Cheap guard against a row pointing at itself. Longer cycles are not
-- expressible as a check constraint — the tree renderer caps its own depth.
alter table public.plant_varieties
  drop constraint if exists plant_varieties_parent_not_self;
alter table public.plant_varieties
  add constraint plant_varieties_parent_not_self
  check (parent_variety_id is null or parent_variety_id <> id);

create index if not exists plant_varieties_parent_variety_id_idx
  on public.plant_varieties(parent_variety_id);

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect one row: the column exists.
select column_name, is_nullable
  from information_schema.columns
 where table_schema = 'public'
   and table_name = 'plant_varieties'
   and column_name = 'parent_variety_id';

-- Expect every existing row to be top-level (count = total varieties).
select count(*) filter (where parent_variety_id is null) as top_level,
       count(*)                                          as total
  from public.plant_varieties;
