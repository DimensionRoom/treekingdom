-- ============================================================
-- Show / hide plants, varieties and products on the public site
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- One flag per row. Default true, so every existing row stays visible and
-- nothing about the site changes until an admin switches something off.
--
-- This is a display toggle, not access control: hidden rows are still
-- readable through the API (the public read policies are unchanged). The
-- site filters them out of every listing, detail page and the sitemap.
-- Leaving RLS alone is deliberate — if a policy hid every plant from anon,
-- the site's "empty table" fallback would kick in and show the old bundled
-- catalog instead of nothing.
--
-- Safe to run more than once.
-- ============================================================

alter table public.plants          add column if not exists is_published boolean not null default true;
alter table public.plant_varieties add column if not exists is_published boolean not null default true;
alter table public.supplies        add column if not exists is_published boolean not null default true;

comment on column public.plants.is_published is
  'false hides the plant from the public site (listings, detail page, sitemap). Admin still sees it.';
comment on column public.plant_varieties.is_published is
  'false hides the variety from its plant page, rankings and search. Admin still sees it.';
comment on column public.supplies.is_published is
  'false hides the product from the public site (listings, detail page, sitemap). Admin still sees it.';

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect every row visible straight after running this.
select 'plants' as t, count(*) filter (where is_published) as visible, count(*) as total from public.plants
union all select 'plant_varieties', count(*) filter (where is_published), count(*) from public.plant_varieties
union all select 'supplies',        count(*) filter (where is_published), count(*) from public.supplies;
