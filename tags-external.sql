-- ============================================================
-- Product / plant tags ("ใหม่", "ลดราคา", …)
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Shape mirrors public.categories: a small lookup table of keys with
-- bilingual names, an emoji and a badge colour class. Rows carry the keys
-- in a text[] column, the same way images are stored.
--
-- Safe to run more than once.
-- ============================================================

create table if not exists public.tags (
  key text primary key,
  name jsonb not null,
  emoji text,
  color text not null default 'badge-humid',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.tags to anon, authenticated;
grant insert, update, delete on public.tags to authenticated;
grant all on public.tags to service_role;

alter table public.tags enable row level security;

drop policy if exists "Tags public read" on public.tags;
create policy "Tags public read" on public.tags for select using (true);

drop policy if exists "Admins write tags" on public.tags;
create policy "Admins write tags"
  on public.tags for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists tags_touch on public.tags;
create trigger tags_touch before update on public.tags
  for each row execute function public.touch_updated_at();

-- ---------- Tag columns on the three taggable tables ----------
-- Postgres cannot foreign-key a text[] to tags.key, so orphaned keys are
-- possible. Two mitigations: the admin strips the key from every row when a
-- tag is deleted (see the helper below), and the UI skips keys it cannot
-- resolve instead of rendering a broken badge.
alter table public.supplies        add column if not exists tags text[] not null default '{}';
alter table public.plants          add column if not exists tags text[] not null default '{}';
alter table public.plant_varieties add column if not exists tags text[] not null default '{}';

create index if not exists supplies_tags_idx        on public.supplies        using gin (tags);
create index if not exists plants_tags_idx          on public.plants          using gin (tags);
create index if not exists plant_varieties_tags_idx on public.plant_varieties using gin (tags);

-- ---------- Helper: detach a tag from every row before deleting it ----------
-- The admin UI calls this via rpc so removing a tag never leaves orphan keys.
create or replace function public.detach_tag(tag_key text)
returns void language sql security definer set search_path = public as $$
  update public.supplies        set tags = array_remove(tags, tag_key) where tags @> array[tag_key];
  update public.plants          set tags = array_remove(tags, tag_key) where tags @> array[tag_key];
  update public.plant_varieties set tags = array_remove(tags, tag_key) where tags @> array[tag_key];
$$;
revoke all on function public.detach_tag(text) from public, anon;
grant execute on function public.detach_tag(text) to authenticated;

-- ---------- Starter tags ----------
insert into public.tags (key, name, emoji, color, sort_order) values
  ('new',        '{"th":"ใหม่","en":"New"}',              '✨', 'badge-new',    0),
  ('sale',       '{"th":"ลดราคา","en":"Sale"}',           '🔥', 'badge-sale',   1),
  ('bestseller', '{"th":"ขายดี","en":"Bestseller"}',      '⭐', 'badge-hot',    2),
  ('rare',       '{"th":"หายาก","en":"Rare"}',            '💎', 'badge-rare',   3),
  ('easy-care',  '{"th":"เลี้ยงง่าย","en":"Easy care"}',  '🌱', 'badge-humid',  4),
  ('air-purify', '{"th":"ฟอกอากาศ","en":"Air purifying"}', '💨', 'badge-water',  5)
on conflict (key) do nothing;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
select key, name->>'th' as th, emoji, color, sort_order from public.tags order by sort_order;

select 'supplies' as t, count(*) filter (where cardinality(tags) > 0) as tagged, count(*) as total from public.supplies
union all select 'plants',          count(*) filter (where cardinality(tags) > 0), count(*) from public.plants
union all select 'plant_varieties', count(*) filter (where cardinality(tags) > 0), count(*) from public.plant_varieties;
