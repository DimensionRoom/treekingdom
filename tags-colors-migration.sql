-- ============================================================
-- Free-form colors for tags (background + text)
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- tags.color originally held one of a fixed set of `badge-*` CSS classes
-- (see index.css) — admins could only pick from that palette. This adds two
-- nullable hex-color columns so a tag can instead carry its own exact
-- background/text color, chosen freely from a color picker in the admin.
--
-- Both columns are optional and additive:
--   - bg_color / text_color both set  -> the app renders that tag with an
--     inline style using these exact colors, ignoring `color`.
--   - either left null                -> falls back to the `color` class,
--     exactly like before this migration.
-- So every existing tag keeps rendering identically; nothing is backfilled.
--
-- Safe to run more than once.
-- ============================================================

alter table public.tags add column if not exists bg_color   text;
alter table public.tags add column if not exists text_color text;

comment on column public.tags.bg_color is
  'Optional hex background color (e.g. #22c55e). When set together with text_color, overrides the `color` preset class for this tag.';
comment on column public.tags.text_color is
  'Optional hex text color (e.g. #ffffff). When set together with bg_color, overrides the `color` preset class for this tag.';

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect every existing row to show null/null here (nothing migrated).
select key, color, bg_color, text_color from public.tags order by sort_order;
