// External Supabase project (user-owned).
// Keys are publishable/anon — safe to commit.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const EXTERNAL_SUPABASE_URL = "https://mcinlbefwyysuljrluln.supabase.co";
export const EXTERNAL_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_te0Gqsd8aIjIPrO2LrweCQ_Ga7x1FqW";

export const supabase = createClient<Database>(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "sb-external-auth",
    },
  },
);
