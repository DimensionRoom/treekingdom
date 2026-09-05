-- ============================================================
-- Personality Examples (external Supabase)
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
-- ============================================================

create table if not exists public.personality_examples (
  id text primary key,
  archetype text not null,
  emoji text not null default '🪴',
  title jsonb not null,
  description jsonb not null,
  tips jsonb,
  images text[] not null default '{}',
  plant_id text references public.plants(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.personality_examples to anon, authenticated;
grant insert, update, delete on public.personality_examples to authenticated;
grant all on public.personality_examples to service_role;

alter table public.personality_examples enable row level security;

drop policy if exists "Personality examples public read" on public.personality_examples;
create policy "Personality examples public read"
  on public.personality_examples for select using (true);

drop policy if exists "Admins write personality examples" on public.personality_examples;
create policy "Admins write personality examples"
  on public.personality_examples for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Ensure updated_at trigger function exists before attaching trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists personality_examples_touch on public.personality_examples;
create trigger personality_examples_touch
  before update on public.personality_examples
  for each row execute function public.touch_updated_at();

-- ---------- Sample rows (archetypes: chill, sun, nurturer, shade, collector) ----------
-- plant_id ผูกกับพรรณไม้ที่มีอยู่จริงอัตโนมัติ (เรียงตาม sort_order)
-- ถ้าตาราง plants มีน้อยกว่า 5 รายการ บางแถวจะเป็น null และไปผูกเองในหน้า /admin ได้
insert into public.personality_examples (id, archetype, emoji, title, description, tips, plant_id, sort_order)
values
  (
    'chill-shelf', 'chill', '😎',
    '{"th":"ชั้นไม้อวบน้ำริมหน้าต่าง","en":"Succulent shelf by the window"}',
    '{"th":"จัดไม้อวบน้ำและแคคตัสในกระถางเซรามิกบนชั้นไม้ ใกล้หน้าต่างที่มีแสงสว่าง ดูแลน้อยแต่สวยตลอดปี","en":"Succulents and cacti in ceramic pots on a wooden shelf near a bright window — low effort, always tidy."}',
    '{"th":"รดน้ำเมื่อดินแห้งสนิท ประมาณ 10–14 วันครั้ง ใช้ดินระบายน้ำดี","en":"Water only when the soil is bone dry (every 10–14 days) and use fast-draining mix."}',
    (select id from public.plants order by sort_order, id limit 1 offset 0), 0
  ),
  (
    'sun-balcony', 'sun', '🌞',
    '{"th":"ระเบียงไม้ดอกรับแดดเต็ม","en":"Full-sun flowering balcony"}',
    '{"th":"กระถางดินเผาไม้ดอกเรียงริมราวระเบียง รับแดดเช้าถึงบ่าย ให้สีสันสดใสทุกวัน","en":"Terracotta pots of flowering plants along the railing, soaking up morning-to-afternoon sun."}',
    '{"th":"รดน้ำเช้า–เย็นในหน้าร้อน และให้ปุ๋ยสูตรเร่งดอกทุก 2 สัปดาห์","en":"Water morning and evening in hot months and feed a bloom fertilizer every two weeks."}',
    (select id from public.plants order by sort_order, id limit 1 offset 1), 1
  ),
  (
    'nurturer-corner', 'nurturer', '💚',
    '{"th":"มุมเขตร้อนชื้นในบ้าน","en":"Humid tropical corner"}',
    '{"th":"เฟินและมอนสเตอร่าจัดรวมกันพร้อมเครื่องพ่นไอน้ำ เหมาะกับคนที่สนุกกับการดูแลทุกวัน","en":"Ferns and monstera grouped with a humidifier — perfect for daily-care lovers."}',
    '{"th":"รักษาความชื้น 60–70% เช็ดใบสัปดาห์ละครั้ง และหมุนกระถางให้โตสม่ำเสมอ","en":"Keep humidity at 60–70%, wipe leaves weekly, and rotate pots for even growth."}',
    (select id from public.plants order by sort_order, id limit 1 offset 2), 2
  ),
  (
    'shade-corner', 'shade', '🌙',
    '{"th":"มุมร่มแสงน้อยก็เขียวได้","en":"Green in a low-light corner"}',
    '{"th":"พลูด่างและลิ้นมังกรในกระถางพาสเทล วางในมุมที่แสงส่องไม่ถึงมาก ยังโตดี","en":"Pothos and snake plants in pastel pots thriving in a dim corner of the room."}',
    '{"th":"ลดการรดน้ำลงครึ่งหนึ่งเมื่อแสงน้อย และย้ายออกรับแสงรำไรเดือนละครั้ง","en":"Halve watering in low light and give them indirect light once a month."}',
    (select id from public.plants order by sort_order, id limit 1 offset 3), 3
  ),
  (
    'collector-wall', 'collector', '✨',
    '{"th":"ชั้นสะสมหลากสายพันธุ์","en":"Multi-species collector shelf"}',
    '{"th":"ชั้นวางหลายชั้นพร้อมป้ายชื่อพันธุ์ จัดกลุ่มตามความต้องการน้ำและแสงให้ดูแลง่าย","en":"Tiered shelves with name tags, grouped by water and light needs for easy care."}',
    '{"th":"จัดกลุ่มต้นที่ต้องการน้ำใกล้เคียงกันไว้ด้วยกัน และจดวันรดน้ำไว้ที่ป้าย","en":"Group plants with similar water needs together and note watering dates on the tags."}',
    (select id from public.plants order by sort_order, id limit 1 offset 4), 4
  )
on conflict (id) do nothing;

notify pgrst, 'reload schema';

-- ============================================================
-- Notes:
-- 1) ปรับ plant_id ให้ตรงกับ id จริงในตาราง plants ของคุณ (หรือลบออกให้เป็น null)
-- 2) รูปภาพ: อัปโหลดผ่านหน้า /admin (แท็บ ตัวอย่างการปลูก) แล้วแนบรูปได้เลย
--    ระบบจะบีบอัด/แปลงเป็น WebP และเก็บลง bucket ให้อัตโนมัติ
-- ============================================================
