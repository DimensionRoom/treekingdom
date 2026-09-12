-- ============================================================
-- Daily-fortune message pool
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- src/lib/fortune.ts computes every score locally and picks a message to go
-- with it. It used to pick from 9 hard-coded sentences, so regulars saw the
-- same line constantly. This table holds a growing pool instead, bucketed by
-- (birth weekday x tone) = 21 buckets, and the app rotates through each bucket
-- by day number so nothing repeats until a bucket cycles.
--
-- Filled from the admin panel: paste a JSON batch, press import. Importing is
-- additive — the unique constraint below silently drops anything already in
-- the pool, so re-importing an old batch is harmless.
--
-- Safe to run more than once.
-- ============================================================

create table if not exists public.fortune_messages (
  id bigserial primary key,
  weekday smallint not null check (weekday between 0 and 6),
  tone text not null check (tone in ('positive', 'neutral', 'careful')),
  message jsonb not null,
  -- Dedupes an import against what is already stored. Hashing the Thai text
  -- is enough: the two languages are written as a pair, never separately.
  msg_hash text generated always as (md5(message ->> 'th')) stored,
  created_at timestamptz not null default now(),
  unique (weekday, tone, msg_hash)
);

comment on table public.fortune_messages is
  'Message pool for the daily fortune, bucketed by (weekday, tone). The app rotates through a bucket by day number, so pool size = days before a repeat. Top it up from the admin panel; never replaced, only appended to.';

create index if not exists fortune_messages_bucket_idx
  on public.fortune_messages(weekday, tone);

grant select on public.fortune_messages to anon, authenticated;
grant insert, update, delete on public.fortune_messages to authenticated;
grant all on public.fortune_messages to service_role;

alter table public.fortune_messages enable row level security;

drop policy if exists "Fortune messages public read" on public.fortune_messages;
create policy "Fortune messages public read"
  on public.fortune_messages for select using (true);

drop policy if exists "Admins write fortune messages" on public.fortune_messages;
create policy "Admins write fortune messages"
  on public.fortune_messages for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect 21 rows once a batch is imported (7 weekdays x 3 tones), each with
-- its pool size — that count is how many days pass before that bucket repeats.
select weekday, tone, count(*) as pool_size
  from public.fortune_messages
 group by weekday, tone
 order by weekday, tone;
