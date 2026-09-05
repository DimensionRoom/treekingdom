-- ============================================================
-- Sale pricing: old price ("ราคาปกติ") alongside the current price
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- `price` stays the amount a customer actually pays. `compare_at_price` is
-- only the struck-through reference price, so price sorting, the MCP tools
-- and the admin table all keep working untouched.
--
-- Safe to run more than once.
-- ============================================================

alter table public.supplies add column if not exists compare_at_price numeric;

comment on column public.supplies.compare_at_price is
  'Old/pre-discount price. NULL = not on sale. The UI only strikes it through when it is greater than price.';

-- Deliberately no CHECK (compare_at_price > price): raising `price` above an
-- old sale price would then make the row unsaveable and surface a raw Postgres
-- error in the admin. The form warns instead, and the UI ignores the value
-- unless it is genuinely higher than the current price.

notify pgrst, 'reload schema';

-- ---------- Verify ----------
select column_name, data_type, is_nullable
  from information_schema.columns
 where table_schema = 'public' and table_name = 'supplies' and column_name = 'compare_at_price';

select id, name->>'th' as th, price, compare_at_price, tags
  from public.supplies
 order by sort_order
 limit 20;
