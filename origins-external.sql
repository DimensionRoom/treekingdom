-- ============================================================
-- Master data: Origin (แหล่งที่มา / ร้าน / สวน)
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- plant_varieties currently stores provenance denormalized in `origin`
-- (jsonb {th,en}) + `origin_url`. Looking at the live data, those two columns
-- hold two different kinds of thing:
--
--   1. Native-range prose  — "เอเชียตะวันออกเฉียงใต้", "พันธุ์กลายหายากที่คัด
--      จากมอนสเตอร่าดีลิซิโอซ่า" — ~24 distinct, mostly used once, never linked.
--   2. Real nurseries/shops — ซาฮาร่าแคคตัส, กระท่อมลุงจรณ์, Akin Cactus —
--      reused across varieties, and the only ones that carry a URL.
--
-- Only (2) is master data. This table holds those; varieties point at one via
-- `origin_id`, so fixing a shop's link once updates every variety using it.
-- Varieties that need (1) just keep typing into `origin`/`origin_url` as before
-- — `origin_id` stays null and nothing about them changes.
--
-- Safe to run more than once.
-- ============================================================

create table if not exists public.origins (
  key        text primary key,
  name       jsonb not null,               -- { th, en }
  link       text,                         -- the shop/nursery's own page
  -- Room to grow without a migration: put new attributes here, and promote any
  -- that earn it into real columns later.
  meta       jsonb not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.origins is
  'Reusable provenance records (nurseries, shops, collections) referenced by plant_varieties.origin_id. One-off native-range descriptions stay as free text on the variety itself.';
comment on column public.origins.meta is
  'Free-form extras so new fields need no migration; promote to a real column once a field is used enough to deserve one.';

grant select on public.origins to anon, authenticated;
grant insert, update, delete on public.origins to authenticated;
grant all on public.origins to service_role;

alter table public.origins enable row level security;

drop policy if exists "Origins public read" on public.origins;
create policy "Origins public read" on public.origins for select using (true);

drop policy if exists "Admins write origins" on public.origins;
create policy "Admins write origins"
  on public.origins for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists origins_touch on public.origins;
create trigger origins_touch before update on public.origins
  for each row execute function public.touch_updated_at();

-- ---------- Link from plant_varieties ----------
-- ON DELETE SET NULL on purpose: removing a shop must not break or delete a
-- variety — it just falls back to whatever free text the variety already has.
alter table public.plant_varieties add column if not exists origin_id text
  references public.origins(key) on delete set null;

create index if not exists plant_varieties_origin_id_idx
  on public.plant_varieties(origin_id);

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect the table to exist and every existing variety to still be on free text
-- (origin_id null) — nothing is migrated by the statements above.
select count(*) filter (where origin_id is null) as still_free_text,
       count(*)                                  as total
  from public.plant_varieties;


-- ============================================================
-- OPTIONAL — seed the three shops that already appear in the data, and point
-- the varieties that name them at the new records.
--
-- Everything below is safe to skip; the feature works without it. Matching is
-- on the exact Thai string already stored, so no other row is touched.
-- Re-runnable: upserts the same values and re-points the same rows.
-- ============================================================

insert into public.origins (key, name, link, sort_order) values
  ('sahara-cactus', '{"th":"ไทย, ซาฮาร่าแคคตัส","en":"Thailand, Sahara Cactus"}'::jsonb,
   'https://www.facebook.com/saharacactus', 0),
  ('uncle-chorn',   '{"th":"ไทย, กระท่อมลุงจรณ์","en":"Thailand, Uncle Chorn''s Cabin"}'::jsonb,
   'http://www.uncle-chorn.com', 0),
  ('akin-cactus',   '{"th":"ไทย, Akin Cactus","en":"Thailand, Akin Cactus Nursary"}'::jsonb,
   null, 0)
on conflict (key) do update set
  name = excluded.name,
  link = excluded.link;

update public.plant_varieties v
   set origin_id = o.key
  from public.origins o
 where v.origin_id is null
   and v.origin ->> 'th' = o.name ->> 'th';

-- Expect 4 rows: 2 × Sahara Cactus, 1 × Uncle Chorn, 1 × Akin Cactus.
select o.key, count(*) as varieties
  from public.plant_varieties v
  join public.origins o on o.key = v.origin_id
 group by o.key
 order by o.key;
