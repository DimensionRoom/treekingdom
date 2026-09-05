ALTER TABLE public.supplies ADD COLUMN plant_id text REFERENCES public.plants(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS supplies_plant_id_idx ON public.supplies(plant_id);