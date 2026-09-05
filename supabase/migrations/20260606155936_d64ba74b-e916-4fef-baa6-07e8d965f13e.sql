
-- ============ Roles & has_role ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by all" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ Domain tables (JSONB-heavy for bilingual fields) ============
CREATE TABLE public.categories (
  key TEXT PRIMARY KEY,
  emoji TEXT NOT NULL DEFAULT '🌿',
  color TEXT,
  name JSONB NOT NULL,                -- { th, en }
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins write categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.plants (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL REFERENCES public.categories(key) ON UPDATE CASCADE,
  emoji TEXT NOT NULL DEFAULT '🌱',
  name JSONB NOT NULL,                -- { th, en }
  description JSONB NOT NULL,         -- { th, en }
  care JSONB NOT NULL,                -- { light, water, humidity, temp, soil, tips } each { th, en }
  levels JSONB NOT NULL,              -- { light, water, humidity, temp }
  images TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.plants TO authenticated;
GRANT ALL ON public.plants TO service_role;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plants public read" ON public.plants FOR SELECT USING (true);
CREATE POLICY "Admins write plants" ON public.plants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.plant_varieties (
  id TEXT PRIMARY KEY,
  plant_id TEXT NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL DEFAULT '🌱',
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  features JSONB NOT NULL,
  bloom_season JSONB,
  size JSONB,
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plant_varieties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.plant_varieties TO authenticated;
GRANT ALL ON public.plant_varieties TO service_role;
ALTER TABLE public.plant_varieties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Varieties public read" ON public.plant_varieties FOR SELECT USING (true);
CREATE POLICY "Admins write varieties" ON public.plant_varieties FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.supplies (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,             -- plants/fertilizer/pot/tools
  emoji TEXT NOT NULL DEFAULT '🛍️',
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  is_lucky BOOLEAN NOT NULL DEFAULT false,
  lucky JSONB,                        -- { meaning:{th,en}, luckyFor:[], weekdays?, zodiacs?, chineseZodiacs? }
  images TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.supplies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.supplies TO authenticated;
GRANT ALL ON public.supplies TO service_role;
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Supplies public read" ON public.supplies FOR SELECT USING (true);
CREATE POLICY "Admins write supplies" ON public.supplies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER plants_touch BEFORE UPDATE ON public.plants
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER supplies_touch BEFORE UPDATE ON public.supplies
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
