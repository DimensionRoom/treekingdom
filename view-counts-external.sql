-- ============================================================
-- View counts for plants and varieties (ยอดเข้าชม + จัดอันดับ)
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Counting a view means an ANONYMOUS visitor has to write. Every table here
-- grants anon `select` only (RLS returns 42501 on writes), so the write goes
-- through one `security definer` function instead: anon may call bump_view()
-- and nothing else. That function can only ever add 1 to one existing id —
-- it cannot set a number, decrement, or touch any other table.
-- Same shape as detach_tag() in tags-external.sql, just granted to anon too.
--
-- Counts live in their own table rather than a column on plants /
-- plant_varieties on purpose: the admin form saves with upsert(whole row),
-- so a view_count column would be overwritten with whatever value the form
-- had loaded every time an admin pressed Save.
--
-- Safe to run more than once.
-- ============================================================

create table if not exists public.view_counts (
  entity_type text not null check (entity_type in ('plant','variety')),
  entity_id   text not null,
  views       bigint not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (entity_type, entity_id)
);

comment on table public.view_counts is
  'Page-view tallies for plants and varieties. Written only via bump_view(); read by anyone.';

-- Ranking reads "top N of one kind", so index the sort that actually runs.
create index if not exists view_counts_rank_idx
  on public.view_counts (entity_type, views desc);

grant select on public.view_counts to anon, authenticated;
-- Deliberately no insert/update for anon or authenticated: bump_view() is the
-- only write path, and it runs as the definer.
grant all on public.view_counts to service_role;

alter table public.view_counts enable row level security;

drop policy if exists "View counts public read" on public.view_counts;
create policy "View counts public read" on public.view_counts for select using (true);

-- Admins may reset/adjust a tally by hand if something gets skewed.
drop policy if exists "Admins write view counts" on public.view_counts;
create policy "Admins write view counts"
  on public.view_counts for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- The one write path ----------
-- Unknown ids are ignored rather than stored: entity_id points at two
-- different tables so a real foreign key isn't possible, and without this
-- check anyone could fill the table with millions of junk rows.
create or replace function public.bump_view(p_type text, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_type = 'plant' then
    if not exists (select 1 from public.plants where id = p_id) then return; end if;
  elsif p_type = 'variety' then
    if not exists (select 1 from public.plant_varieties where id = p_id) then return; end if;
  else
    return;
  end if;

  insert into public.view_counts (entity_type, entity_id, views)
  values (p_type, p_id, 1)
  on conflict (entity_type, entity_id)
  do update set views = view_counts.views + 1, updated_at = now();
end; $$;

revoke all on function public.bump_view(text, text) from public;
grant execute on function public.bump_view(text, text) to anon, authenticated;

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- 1. A real id tallies.
select public.bump_view('plant', (select id from public.plants order by sort_order limit 1));

-- 2. A junk id is ignored — this must NOT add a row.
select public.bump_view('plant', 'definitely-not-a-real-plant');
select public.bump_view('nonsense', 'whatever');

-- Expect exactly one row, views = 1, for the first plant.
select * from public.view_counts order by entity_type, views desc;

-- Undo the test tally above (leaves the table empty and ready for real traffic).
delete from public.view_counts;
