// Fetch helper for the external (user-owned) Supabase project.
// The URL and publishable/anon key are safe to embed — they're the same values
// shipped in src/integrations/supabase-external/client.ts and appear in the
// browser bundle. RLS on the target tables enforces access as `anon`.

const EXTERNAL_URL = "https://mcinlbefwyysuljrluln.supabase.co";
const EXTERNAL_KEY = "sb_publishable_te0Gqsd8aIjIPrO2LrweCQ_Ga7x1FqW";

export async function queryExternal(pathAndQuery: string): Promise<any> {
  const res = await fetch(`${EXTERNAL_URL}/rest/v1/${pathAndQuery}`, {
    headers: {
      apikey: EXTERNAL_KEY,
      Authorization: `Bearer ${EXTERNAL_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}
