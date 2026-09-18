import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Eye, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase-external/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlants, useViewCounts } from "@/hooks/useCloudData";

interface RankRow {
  type: "plant" | "variety";
  id: string;
  name: { th: string; en: string };
  sub?: string; // plant name, for a variety row
  views: number;
}

const RankTable = ({
  title,
  rows,
  lang,
  canReset,
  onReset,
  busyId,
}: {
  title: string;
  rows: RankRow[];
  lang: "th" | "en";
  canReset: boolean;
  onReset: (row: RankRow) => void;
  busyId: string | null;
}) => (
  <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
    <div className="px-4 py-3 border-b border-border font-semibold text-sm">
      {title} <span className="text-muted-foreground font-normal">({rows.length})</span>
    </div>
    {rows.length === 0 ? (
      <p className="p-4 text-sm text-muted-foreground">
        {lang === "th" ? "ยังไม่มีข้อมูล" : "No data yet"}
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="p-3 w-10 text-muted-foreground font-semibold">{i + 1}</td>
                <td className="p-3">
                  <div className="font-medium">{r.name[lang] || r.id}</div>
                  {r.sub && <div className="text-xs text-muted-foreground">{r.sub}</div>}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    {r.views.toLocaleString()}
                  </span>
                </td>
                <td className="p-3 w-10 text-right">
                  {/* Nothing to reset at 0 — the row doesn't even exist in the
                      table yet at that point. */}
                  {r.views > 0 && (
                    <button
                      onClick={() => onReset(r)}
                      disabled={!canReset || busyId === `${r.type}:${r.id}`}
                      title={lang === "th" ? "รีเซ็ตยอดนี้" : "Reset this count"}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-40"
                    >
                      {busyId === `${r.type}:${r.id}` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

/**
 * Standalone admin panel — not a CRUD entity — showing every plant and
 * top-level variety ranked by view count (see view-counts-external.sql),
 * with per-row and whole-table resets.
 *
 * A reset deletes the row rather than zeroing it: a missing row already reads
 * as 0 everywhere (useViewCounts returns a map, ViewCount hides on falsy), so
 * deleting keeps the table to only what has actually been viewed.
 */
const ViewRankPanel = () => {
  const { lang } = useLanguage();
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading: plantsLoading } = usePlants();
  const { data: viewCounts, isLoading: viewsLoading } = useViewCounts();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [resettingAll, setResettingAll] = useState(false);
  const isLoading = plantsLoading || viewsLoading;

  const plants = data?.plants ?? [];

  const plantRows: RankRow[] = plants
    .map((p) => ({
      type: "plant" as const,
      id: p.id,
      name: p.name,
      views: viewCounts?.[`plant:${p.id}`] ?? 0,
    }))
    .sort((a, b) => b.views - a.views || a.name.en.localeCompare(b.name.en));

  const varietyRows: RankRow[] = plants
    .flatMap((p) =>
      (p.varieties ?? [])
        .filter((v) => !v.parentId) // forms don't get their own page/view count
        .map((v) => ({
          type: "variety" as const,
          id: v.id,
          name: v.name,
          sub: p.name[lang],
          views: viewCounts?.[`variety:${v.id}`] ?? 0,
        })),
    )
    .sort((a, b) => b.views - a.views || a.name.en.localeCompare(b.name.en));

  const totalViews = Object.values(viewCounts ?? {}).reduce((sum, n) => sum + n, 0);

  const refresh = () => qc.invalidateQueries({ queryKey: ["view_counts"] });

  const resetOne = async (row: RankRow) => {
    const label = row.name[lang] || row.id;
    if (!confirm(lang === "th" ? `รีเซ็ตยอดวิวของ "${label}"?` : `Reset views for "${label}"?`)) return;
    setBusyId(`${row.type}:${row.id}`);
    const { error } = await (supabase as any)
      .from("view_counts")
      .delete()
      .eq("entity_type", row.type)
      .eq("entity_id", row.id);
    setBusyId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(lang === "th" ? "รีเซ็ตแล้ว" : "Reset");
    refresh();
  };

  const resetAll = async () => {
    if (
      !confirm(
        lang === "th"
          ? "รีเซ็ตยอดวิวทั้งหมดทุกพรรณไม้และสายพันธุ์? ย้อนกลับไม่ได้"
          : "Reset every view count for all plants and varieties? This cannot be undone.",
      )
    )
      return;
    setResettingAll(true);
    // No .delete() without a filter — PostgREST refuses an unfiltered delete,
    // and this also scopes it to exactly the two kinds this app counts.
    const { error } = await (supabase as any)
      .from("view_counts")
      .delete()
      .in("entity_type", ["plant", "variety"]);
    setResettingAll(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(lang === "th" ? "รีเซ็ตทั้งหมดแล้ว" : "All counts reset");
    refresh();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted-foreground max-w-lg">
          {lang === "th"
            ? "นับจากผู้เข้าชมจริง สูงสุด 1 ครั้ง/คน/วัน — ต้องรัน view-counts-external.sql ก่อนถึงจะมีข้อมูล"
            : "Counted from real visitors, capped at 1/person/day — run view-counts-external.sql first for any data to appear."}
        </p>
        <button
          onClick={resetAll}
          disabled={!isAdmin || totalViews === 0 || resettingAll}
          className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-destructive/30 text-destructive hover:bg-destructive/10 disabled:opacity-40 inline-flex items-center gap-1.5 shrink-0"
        >
          {resettingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          {lang === "th" ? "รีเซ็ตทั้งหมด" : "Reset all"}
        </button>
      </div>
      <RankTable
        title={lang === "th" ? "🌿 พรรณไม้" : "🌿 Plants"}
        rows={plantRows}
        lang={lang}
        canReset={isAdmin}
        onReset={resetOne}
        busyId={busyId}
      />
      <RankTable
        title={lang === "th" ? "🌱 สายพันธุ์ย่อย" : "🌱 Varieties"}
        rows={varietyRows}
        lang={lang}
        canReset={isAdmin}
        onReset={resetOne}
        busyId={busyId}
      />
    </div>
  );
};

export default ViewRankPanel;
