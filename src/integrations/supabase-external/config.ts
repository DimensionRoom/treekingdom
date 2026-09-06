// Plain constants only — no client creation here. This makes the file safe to
// import from Node build scripts (e.g. scripts/seoPlugin.ts), which client.ts
// itself is not: it calls createClient() with `storage: localStorage` at
// module load time, and Node has no such global.
//
// Keys are publishable/anon — safe to commit.
export const EXTERNAL_SUPABASE_URL = "https://mcinlbefwyysuljrluln.supabase.co";
export const EXTERNAL_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_te0Gqsd8aIjIPrO2LrweCQ_Ga7x1FqW";
export const STORAGE_BUCKET = "plant-images";
