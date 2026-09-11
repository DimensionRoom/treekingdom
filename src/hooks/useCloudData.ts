import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase-external/client";
import type { Plant, PlantCategory, PlantVariety } from "@/data/plants";
import type { Supply } from "@/data/supplies";
import { plants as localPlants, categoryInfo as localCategoryInfo, allCategories } from "@/data/plants";
import { supplies as localSupplies } from "@/data/supplies";
import { STORAGE_BUCKET as BUCKET } from "@/integrations/supabase-external/config";

const publicUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

export const resolveStoragePath = (path: string) => publicUrl(path) ?? path;

// ---------- Categories ----------
export type CategoryRecord = {
  key: string;
  emoji: string;
  color: string;
  name: { th: string; en: string };
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryRecord[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      if (!data || data.length === 0) {
        // Fallback to local
        return allCategories.map((k) => ({
          key: k,
          emoji: localCategoryInfo[k].emoji,
          color: localCategoryInfo[k].color,
          name: { th: localCategoryInfo[k].th, en: localCategoryInfo[k].en },
        }));
      }
      return data.map((c: any) => ({
        key: c.key,
        emoji: c.emoji,
        color: c.color ?? "badge-humid",
        name: c.name as { th: string; en: string },
      }));
    },
  });
};

export const useCategoryInfo = () => {
  const { data } = useCategories();
  const map: Record<string, { emoji: string; color: string; th: string; en: string }> = {};
  (data ?? []).forEach((c) => {
    map[c.key] = { emoji: c.emoji, color: c.color, th: c.name.th, en: c.name.en };
  });
  // Always merge local defaults for unknown keys
  allCategories.forEach((k) => {
    if (!map[k]) map[k] = localCategoryInfo[k];
  });
  return map;
};

// ---------- Tags ----------
export type TagRecord = {
  key: string;
  emoji: string | null;
  color: string;
  name: { th: string; en: string };
};

export const useTags = () =>
  useQuery({
    queryKey: ["tags"],
    queryFn: async (): Promise<TagRecord[]> => {
      const { data, error } = await (supabase as any)
        .from("tags")
        .select("*")
        .order("sort_order")
        .order("key");
      // Table may not exist yet on the backend — fail soft, badges just don't render.
      if (error) return [];
      return (data ?? []).map((t: any) => ({
        key: t.key,
        emoji: t.emoji ?? null,
        color: t.color ?? "badge-humid",
        name: (t.name ?? { th: t.key, en: t.key }) as { th: string; en: string },
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

/** key -> tag, for resolving the string keys stored on rows. */
export const useTagMap = (): Record<string, TagRecord> => {
  const { data } = useTags();
  const map: Record<string, TagRecord> = {};
  (data ?? []).forEach((t) => { map[t.key] = t; });
  return map;
};

// ---------- Plants ----------
const rowToPlant = (r: any): Plant => ({
  id: r.id,
  name: r.name,
  category: r.category as PlantCategory,
  description: r.description,
  emoji: r.emoji,
  care: r.care,
  levels: r.levels,
  varieties: r.varieties ?? undefined,
  tags: (r.tags ?? []) as string[],
});

export const usePlants = () => {
  return useQuery({
    queryKey: ["plants"],
    queryFn: async (): Promise<{ plants: Plant[]; images: Record<string, string[]>; varieties: PlantVariety[] }> => {
      const [{ data: plantRows, error: e1 }, { data: varRows, error: e2 }] = await Promise.all([
        supabase.from("plants").select("*").order("sort_order").order("created_at"),
        supabase.from("plant_varieties").select("*").order("sort_order"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;

      if (!plantRows || plantRows.length === 0) {
        // local fallback
        const { plantImages } = await import("@/data/plantImages");
        return { plants: localPlants, images: plantImages, varieties: [] };
      }

      const varByPlant: Record<string, PlantVariety[]> = {};
      (varRows ?? []).forEach((v: any) => {
        const arr = (varByPlant[v.plant_id] ||= []);
        arr.push({
          id: v.id,
          name: v.name,
          emoji: v.emoji,
          description: v.description,
          features: v.features,
          bloomSeason: v.bloom_season ?? undefined,
          size: v.size ?? undefined,
          image: v.image ? resolveStoragePath(v.image) : (v.images?.[0] ? resolveStoragePath(v.images[0]) : undefined),
          images: ((v.images && v.images.length ? v.images : v.image ? [v.image] : []) as string[]).map((p) =>
            resolveStoragePath(p)
          ),
          tags: (v.tags ?? []) as string[],
          careTip: v.care_tip ?? null,
          origin: v.origin ?? null,
          originUrl: v.origin_url ?? null,
          parentId: v.parent_variety_id ?? null,
        });
      });

      const images: Record<string, string[]> = {};
      const plants = plantRows.map((r: any) => {
        const p = rowToPlant(r);
        if (varByPlant[p.id]) p.varieties = varByPlant[p.id];
        images[p.id] = (r.images ?? []).map((path: string) => resolveStoragePath(path));
        return p;
      });

      return { plants, images, varieties: [] };
    },
  });
};

// ---------- Supplies ----------
const rowToSupply = (r: any): Supply => ({
  id: r.id,
  name: r.name,
  category: r.category,
  description: r.description,
  price: Number(r.price),
  stock: r.stock,
  emoji: r.emoji,
  isLucky: r.is_lucky,
  lucky: r.lucky ?? undefined,
  plantId: r.plant_id ?? undefined,
  varietyId: r.variety_id ?? undefined,
  tags: (r.tags ?? []) as string[],
  compareAtPrice: r.compare_at_price != null ? Number(r.compare_at_price) : null,
});

export const useSupplies = () => {
  return useQuery({
    queryKey: ["supplies"],
    queryFn: async (): Promise<{ supplies: Supply[]; images: Record<string, string[]> }> => {
      const [{ data, error }, variantsRes] = await Promise.all([
        supabase
          .from("supplies")
          .select("*")
          .order("sort_order")
          .order("created_at"),
        (supabase as any)
          .from("supply_variants")
          .select("*")
          .order("sort_order"),
      ]);
      if (error) throw error;
      if (!data || data.length === 0) {
        const { supplyImages } = await import("@/data/supplyImages");
        return { supplies: localSupplies, images: supplyImages };
      }

      const varBySupply: Record<string, any[]> = {};
      if (!variantsRes?.error) {
        (variantsRes?.data ?? []).forEach((v: any) => {
          const arr = (varBySupply[v.supply_id] ||= []);
          arr.push({
            id: v.id,
            name: v.name,
            description: v.description ?? undefined,
            price: Number(v.price ?? 0),
            stock: Math.max(0, Number(v.stock ?? 0)),
            image: v.image ? resolveStoragePath(v.image) : undefined,
            sortOrder: v.sort_order ?? 0,
          });
        });
      }

      const images: Record<string, string[]> = {};
      const supplies = data.map((r: any) => {
        images[r.id] = (r.images ?? []).map((p: string) => resolveStoragePath(p));
        const s = rowToSupply(r);
        if (varBySupply[r.id]?.length) s.variants = varBySupply[r.id];
        return s;
      });
      return { supplies, images };
    },
  });
};

