-- ============================================================
-- TreeKingdom — schema migration for external Supabase project
-- Run this in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
-- ============================================================

-- ---------- Roles ----------
do $$ begin
  create type public.app_role as enum ('admin', 'moderator', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

drop policy if exists "Users view own roles" on public.user_roles;
create policy "Users view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- Profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

drop policy if exists "Profiles readable by all" on public.profiles;
create policy "Profiles readable by all" on public.profiles
  for select to authenticated using (true);
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- updated_at helper ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------- Categories ----------
create table if not exists public.categories (
  key text primary key,
  emoji text not null default '🌿',
  color text,
  name jsonb not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
drop policy if exists "Categories public read" on public.categories;
create policy "Categories public read" on public.categories for select using (true);
drop policy if exists "Admins write categories" on public.categories;
create policy "Admins write categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- Plants ----------
create table if not exists public.plants (
  id text primary key,
  category text not null,
  emoji text not null default '🌱',
  name jsonb not null,
  description jsonb not null,
  care jsonb not null,
  levels jsonb not null,
  images text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.plants to anon, authenticated;
grant insert, update, delete on public.plants to authenticated;
grant all on public.plants to service_role;
alter table public.plants enable row level security;
drop policy if exists "Plants public read" on public.plants;
create policy "Plants public read" on public.plants for select using (true);
drop policy if exists "Admins write plants" on public.plants;
create policy "Admins write plants" on public.plants for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
drop trigger if exists plants_touch_updated on public.plants;
create trigger plants_touch_updated before update on public.plants
  for each row execute function public.touch_updated_at();

-- ---------- Plant Varieties ----------
create table if not exists public.plant_varieties (
  id text primary key,
  plant_id text not null,
  emoji text not null default '🌱',
  name jsonb not null,
  description jsonb not null,
  features jsonb not null,
  bloom_season jsonb,
  size jsonb,
  image text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.plant_varieties to anon, authenticated;
grant insert, update, delete on public.plant_varieties to authenticated;
grant all on public.plant_varieties to service_role;
alter table public.plant_varieties enable row level security;
drop policy if exists "Varieties public read" on public.plant_varieties;
create policy "Varieties public read" on public.plant_varieties for select using (true);
drop policy if exists "Admins write varieties" on public.plant_varieties;
create policy "Admins write varieties" on public.plant_varieties for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- Supplies ----------
create table if not exists public.supplies (
  id text primary key,
  category text not null,
  emoji text not null default '🛍️',
  name jsonb not null,
  description jsonb not null,
  price numeric not null default 0,
  stock integer not null default 0,
  is_lucky boolean not null default false,
  lucky jsonb,
  images text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.supplies to anon, authenticated;
grant insert, update, delete on public.supplies to authenticated;
grant all on public.supplies to service_role;
alter table public.supplies enable row level security;
drop policy if exists "Supplies public read" on public.supplies;
create policy "Supplies public read" on public.supplies for select using (true);
drop policy if exists "Admins write supplies" on public.supplies;
create policy "Admins write supplies" on public.supplies for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
drop trigger if exists supplies_touch_updated on public.supplies;
create trigger supplies_touch_updated before update on public.supplies
  for each row execute function public.touch_updated_at();

-- ---------- Storage bucket: plant-images ----------
insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do update set public = true;

drop policy if exists "plant-images public read" on storage.objects;
create policy "plant-images public read" on storage.objects
  for select using (bucket_id = 'plant-images');

drop policy if exists "plant-images admin write" on storage.objects;
create policy "plant-images admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'plant-images' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'plant-images' and public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- After running this:
-- 1) Sign up in the app at /auth (this creates your auth.users row)
-- 2) Run:
--    INSERT INTO public.user_roles (user_id, role)
--    SELECT id, 'admin' FROM auth.users WHERE email = 'YOUR_EMAIL';
-- 3) Go to /admin and click "นำเข้าข้อมูล + รูปจาก Cloud เดิม"
-- ============================================================

-- ---------- Link a supply to a specific plant variety ----------
alter table public.supplies
  add column if not exists variety_id text references public.plant_varieties(id) on delete set null;
notify pgrst, 'reload schema';

-- ---------- Multi-image support for plant varieties ----------
alter table public.plant_varieties
  add column if not exists images text[] not null default '{}';
update public.plant_varieties
  set images = array[image]
  where (images is null or array_length(images,1) is null)
    and image is not null and image <> '';
notify pgrst, 'reload schema';
