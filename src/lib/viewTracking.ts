import { supabase } from "@/integrations/supabase-external/client";

const STORAGE_KEY = "tk-viewed-today";

type EntityType = "plant" | "variety";
/** "plant:monstera" -> the date (YYYY-MM-DD) it was last counted. */
type ViewedMap = Record<string, string>;

// The visitor's local calendar day. toISOString() would give the UTC day,
// which in Thailand (UTC+7) rolls over at 07:00 rather than midnight.
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const readMap = (): ViewedMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ViewedMap) : {};
  } catch {
    // Private-browsing mode, site data disabled, or corrupt JSON — treat as
    // "nothing counted yet" rather than letting the page crash.
    return {};
  }
};

/**
 * Records that `key` has now been counted, dropping entries from earlier days
 * so the map can't grow forever. Re-reads first: other bumps on the same page
 * (a plant and the variety sheet opened over it) resolve independently, and
 * this must not clobber one of them.
 */
const markCounted = (key: string, day: string) => {
  const next: ViewedMap = { [key]: day };
  for (const [k, v] of Object.entries(readMap())) {
    if (v === day) next[k] = v;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full/blocked — the view just won't be deduped next time, not
    // worth surfacing to the user.
  }
};

/**
 * Keys whose RPC is in flight right now. localStorage is only written once
 * the server confirms the count, so without this an immediate re-render (or
 * React's double-invoked effects in dev) could fire the same bump twice
 * before the first one resolves.
 */
const inFlight = new Set<string>();

/**
 * Counts one view for `type`/`id`, at most once per calendar day per browser.
 * Fire-and-forget: never throws, and does nothing until
 * view-counts-external.sql has been run.
 *
 * A failed call is deliberately NOT marked as counted — the day's slot is
 * only burned once the server has actually tallied it. Marking first would
 * mean a view attempted while offline, or before the SQL was run, locked
 * that id out for the rest of the day even after the problem was fixed.
 */
export const bumpView = (type: EntityType, id: string): void => {
  const key = `${type}:${id}`;
  const today = todayStr();
  if (inFlight.has(key)) return;
  if (readMap()[key] === today) return; // already counted today

  inFlight.add(key);
  void (supabase as any).rpc("bump_view", { p_type: type, p_id: id }).then(
    (res: { error?: unknown } | null) => {
      inFlight.delete(key);
      // supabase-js resolves with { error } instead of rejecting, so a missing
      // table/function lands here, not in the catch below.
      if (!res?.error) markCounted(key, today);
    },
    () => { inFlight.delete(key); }, // network failure — retry on the next visit
  );
};
