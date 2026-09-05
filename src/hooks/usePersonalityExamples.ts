import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase-external/client";
import { resolveStoragePath } from "./useCloudData";

export interface PersonalityExample {
  id: string;
  archetype: string;
  emoji: string;
  title: { th: string; en: string };
  description: { th: string; en: string };
  tips: { th: string; en: string };
  images: string[];
  plantId: string | null;
  sortOrder: number;
}

const rowToExample = (r: any): PersonalityExample => ({
  id: r.id,
  archetype: r.archetype,
  emoji: r.emoji ?? "🪴",
  title: r.title ?? { th: "", en: "" },
  description: r.description ?? { th: "", en: "" },
  tips: r.tips ?? { th: "", en: "" },
  images: ((r.images ?? []) as string[]).map((p) => resolveStoragePath(p)),
  plantId: r.plant_id ?? null,
  sortOrder: r.sort_order ?? 0,
});

export const usePersonalityExamples = () =>
  useQuery({
    queryKey: ["personality_examples"],
    queryFn: async (): Promise<PersonalityExample[]> => {
      const { data, error } = await (supabase as any)
        .from("personality_examples")
        .select("*")
        // sort_order alone ties across archetypes; id keeps the order stable.
        .order("sort_order")
        .order("id");
      // Table may not exist yet on the backend — fail soft.
      if (error) return [];
      return (data ?? []).map(rowToExample);
    },
    staleTime: 5 * 60 * 1000,
  });
