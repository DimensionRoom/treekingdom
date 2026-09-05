
-- has_role must be callable for RLS policies to evaluate it
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- Storage policies: anyone can read images; only admins can write
CREATE POLICY "plant-images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images');

CREATE POLICY "plant-images admin write"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'plant-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "plant-images admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'plant-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "plant-images admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'plant-images' AND public.has_role(auth.uid(), 'admin'));
