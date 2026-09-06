// External Supabase project (user-owned).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_PUBLISHABLE_KEY } from "./config";

export { EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_PUBLISHABLE_KEY };

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
