import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase-external/client";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LogOut, Pencil, Trash2, Plus, ShieldCheck, Search, X, ArrowRight } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import EntityForm from "@/components/admin/EntityForm";
import { deleteImage, getPublicUrl } from "@/lib/storage";
import { saleInfo } from "@/lib/price";
import Seo from "@/components/Seo";

type Entity = "plants" | "supplies" | "categories" | "plant_varieties" | "personality_examples" | "tags";

const ENTITY_META: Record<Entity, { emoji: string; th: string; en: string; emptyTh: string; emptyEn: string }> = {
  plants: { emoji: "🌿", th: "ต้นไม้", en: "Plants", emptyTh: "ยังไม่มีต้นไม้", emptyEn: "No plants yet" },
  plant_varieties: { emoji: "🌱", th: "สายพันธุ์", en: "Varieties", emptyTh: "ยังไม่มีสายพันธุ์", emptyEn: "No varieties yet" },
  supplies: { emoji: "🛒", th: "สินค้า", en: "Products", emptyTh: "ยังไม่มีสินค้า", emptyEn: "No products yet" },
  categories: { emoji: "🏷️", th: "หมวดหมู่", en: "Categories", emptyTh: "ยังไม่มีหมวดหมู่", emptyEn: "No categories yet" },
  personality_examples: { emoji: "✨", th: "บุคลิกภาพ", en: "Personality", emptyTh: "ยังไม่มีตัวอย่างบุคลิกภาพ", emptyEn: "No personality examples yet" },
  tags: { emoji: "🔖", th: "แท็ก", en: "Tags", emptyTh: "ยังไม่มีแท็ก", emptyEn: "No tags yet" },
};

// Tab order: plants and their varieties sit next to each other.
const ENTITIES: Entity[] = ["plants", "plant_varieties", "supplies", "categories", "tags", "personality_examples"];

const EMPTY: any[] = [];

/** Fields worth searching across every table. */
const searchable = (r: any): string[] =>
  [r.id, r.key, r.name?.th, r.name?.en, r.title?.th, r.title?.en, r.category, r.archetype, r.plant_id]
    .filter(Boolean)
    .map((v: unknown) => String(v).toLowerCase());

const rowMatches = (r: any, q: string) => searchable(r).some((v) => v.includes(q));

const AdminPage = () => {
  const { lang } = useLanguage();
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const tabParam = params.get("tab") as Entity | null;
  const tab: Entity = tabParam && ENTITIES.includes(tabParam) ? tabParam : "plants";
  const setTab = (t: Entity) =>
    setParams(
      (p) => {
        p.set("tab", t);
        return p;
      },
      { replace: true },
    );

  useEffect(() => {
    if (!loading && !user) navigate("/tk-portal-9x7", { replace: true });
  }, [loading, user, navigate]);

  // One load per table, shared by the grid, the counts, the cross-tab search
  // and the dropdowns inside EntityForm.
  const tableQueries = useQueries({
    queries: ENTITIES.map((e) => ({
      queryKey: ["admin", "table", e],
      queryFn: async () => {
        const { data, error } = await (supabase as any).from(e).select("*").order("sort_order").limit(500);
        if (error) throw error;
        return (data ?? []) as any[];
      },
      enabled: !!user,
    })),
  });

  const rowsOf = (e: Entity) => (tableQueries[ENTITIES.indexOf(e)].data ?? EMPTY) as any[];
  const plantRows = rowsOf("plants");
  const varietyRows = rowsOf("plant_varieties");
  const supplyRows = rowsOf("supplies");
  const categoryRows = rowsOf("categories");
  const rows = rowsOf(tab);
  const isLoading = tableQueries[ENTITIES.indexOf(tab)].isLoading;

  const categoryOptions = useMemo(
    () =>
      categoryRows.map((c: any) => ({
        value: c.key,
        label: `${c.emoji ?? ""} ${c.name?.th ?? c.key}${c.name?.en ? ` / ${c.name.en}` : ""}`.trim(),
      })),
    [categoryRows],
  );

  // Distinct categories already used in supplies (free-form set)
  const supplyCategoryOptions = useMemo(() => {
    const set = new Set<string>();
    supplyRows.forEach((r: any) => r.category && set.add(r.category));
    return Array.from(set).sort().map((v) => ({ value: v, label: v }));
  }, [supplyRows]);

  const plantIdOptions = useMemo(
    () =>
      plantRows.map((p: any) => ({
        value: p.id,
        label: `${p.emoji ?? ""} ${p.name?.th ?? p.id}`.trim(),
      })),
    [plantRows],
  );

  const varietyOptions = useMemo(
    () =>
      varietyRows.map((v: any) => ({
        value: v.id,
        plantId: v.plant_id,
        label: `${v.emoji ?? ""} ${v.name?.th ?? v.id}`.trim(),
      })),
    [varietyRows],
  );

  const tagRows = rowsOf("tags");
  const tagOptions = useMemo(
    () =>
      tagRows.map((tg: any) => ({
        value: tg.key,
        label: `${tg.emoji ?? ""} ${tg.name?.th ?? tg.key}${tg.name?.en ? ` / ${tg.name.en}` : ""}`.trim(),
        color: tg.color ?? "badge-humid",
        emoji: tg.emoji ?? null,
      })),
    [tagRows],
  );

  const q = search.trim().toLowerCase();
  const filtered = q ? rows.filter((r: any) => rowMatches(r, q)) : rows;
  // Same query run against the other tables, so nothing hides behind a tab.
  const otherHits = q
    ? ENTITIES.filter((e) => e !== tab)
        .map((e) => ({ entity: e, count: rowsOf(e).filter((r: any) => rowMatches(r, q)).length }))
        .filter((h) => h.count > 0)
    : [];
  const otherHitTotal = otherHits.reduce((n, h) => n + h.count, 0);

  const handleDelete = async (row: any) => {
    if (!confirm(lang === "th" ? "ลบรายการนี้?" : "Delete this item?")) return;
    const pkCol = tab === "categories" || tab === "tags" ? "key" : "id";
    const pk = row[pkCol];
    // best-effort cleanup of attached images
    const paths: string[] = [
      ...((row.images as string[]) ?? []),
      ...(row.image ? [row.image as string] : []),
    ];
    if (tab === "tags") {
      // text[] columns can't carry a real FK to tags.key — strip the key from
      // every supply/plant/variety first so deleting a tag never leaves an
      // orphaned key behind (see detach_tag() in tags-external.sql).
      const { error: detachErr } = await (supabase as any).rpc("detach_tag", { tag_key: pk });
      if (detachErr) {
        toast.error(detachErr.message);
        return;
      }
    }
    const { error } = await (supabase as any).from(tab).delete().eq(pkCol, pk);
    if (error) {
      toast.error(error.message);
      return;
    }
    await Promise.all(paths.map((p) => deleteImage(p).catch(() => {})));
    toast.success(lang === "th" ? "ลบแล้ว" : "Deleted");
    qc.invalidateQueries();
  };

  // Load variants for the supply being edited/created
  const editingSupplyId = tab === "supplies" ? (editing?.id ?? null) : null;
  const { data: editingVariants } = useQuery({
    queryKey: ["admin", "supply_variants", editingSupplyId],
    queryFn: async () => {
      if (!editingSupplyId) return [];
      const { data, error } = await (supabase as any)
        .from("supply_variants")
        .select("*")
        .eq("supply_id", editingSupplyId)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!editingSupplyId,
  });

  // Inject variants into record so EntityForm sees them
  const editingWithVariants =
    tab === "supplies" && editing
      ? { ...editing, variants: editingVariants ?? editing.variants ?? [] }
      : editing;

  const handleSave = async (record: any) => {
    // Extract variants for supplies (persisted in supply_variants table)
    let variantsToWrite: any[] | null = null;
    let recordToWrite = record;
    if (tab === "supplies") {
      const { variants, ...rest } = record;
      variantsToWrite = Array.isArray(variants) ? variants : [];
      recordToWrite = rest;
    }

    const { error } = await (supabase as any).from(tab).upsert(recordToWrite, {
      onConflict: tab === "categories" || tab === "tags" ? "key" : "id",
    });
    if (error) {
      toast.error(error.message);
      return;
    }

    if (variantsToWrite !== null && recordToWrite.id) {
      const supplyId = recordToWrite.id;
      const prevIds = new Set((editingVariants ?? []).map((v: any) => v.id));
      const nextIds = new Set(variantsToWrite.map((v: any) => v.id));
      const toDelete = [...prevIds].filter((id) => !nextIds.has(id));

      if (variantsToWrite.length > 0) {
        const rows = variantsToWrite.map((v: any, i: number) => ({
          id: v.id,
          supply_id: supplyId,
          name: v.name ?? { th: "", en: "" },
          description: v.description ?? { th: "", en: "" },
          price: Number(v.price ?? 0),
          stock: Number(v.stock ?? 0),
          image: v.image ?? null,
          sort_order: Number(v.sort_order ?? i),
        }));
        const { error: vErr } = await (supabase as any)
          .from("supply_variants")
          .upsert(rows, { onConflict: "id" });
        if (vErr) {
          toast.error(`Variants: ${vErr.message}`);
          return;
        }
      }
      if (toDelete.length > 0) {
        const { error: dErr } = await (supabase as any)
          .from("supply_variants")
          .delete()
          .in("id", toDelete);
        if (dErr) toast.error(`Delete variants: ${dErr.message}`);
      }
    }

    toast.success(lang === "th" ? "บันทึกแล้ว" : "Saved");
    setEditing(null);
    setCreating(false);
    qc.invalidateQueries();
  };

  const meta = ENTITY_META[tab];
  const label = (e: Entity) => (lang === "th" ? ENTITY_META[e].th : ENTITY_META[e].en);

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Seo title="Admin Panel | TreeKingdom" description="Internal admin panel." noindex />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
            {lang === "th" ? "แผงผู้ดูแล" : "Admin Panel"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {user.email}
            {isAdmin ? (
              <span className="ml-2 inline-flex items-center gap-1 text-accent">
                <ShieldCheck className="w-3 h-3" /> admin
              </span>
            ) : (
              <span className="ml-2 text-destructive">
                {lang === "th" ? "(ยังไม่มีสิทธิ์ admin)" : "(not admin)"}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="px-3 py-2 rounded-full bg-muted text-foreground text-sm font-semibold inline-flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {lang === "th" ? "ออกจากระบบ" : "Sign out"}
        </button>
      </div>

      {!isAdmin && (
        <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4 mb-4 text-sm">
          {lang === "th"
            ? "บัญชีนี้ยังไม่ได้รับสิทธิ์ admin กรุณาแจ้งทีมงานเพื่อตั้งค่าสิทธิ์ในตาราง user_roles"
            : "This account is not yet an admin. Ask the team to grant admin role in user_roles."}
          <div className="mt-2 text-xs text-muted-foreground">User ID: {user.id}</div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setSearch("")}
          placeholder={
            lang === "th"
              ? "ค้นหาทุกอย่าง — ต้นไม้ สายพันธุ์ สินค้า หมวดหมู่…"
              : "Search everything — plants, varieties, products, categories…"
          }
          className="w-full h-12 pl-12 pr-11 rounded-full bg-card border-2 border-border text-sm focus:outline-none focus:border-primary/40"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label={lang === "th" ? "ล้างคำค้นหา" : "Clear search"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {ENTITIES.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 whitespace-nowrap inline-flex items-center gap-1.5 ${
                active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
              }`}
            >
              <span>{ENTITY_META[t].emoji}</span>
              {label(t)}
              <span
                className={`text-xs tabular-nums px-1.5 rounded-full ${
                  active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                }`}
              >
                {rowsOf(t).length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setCreating(true)}
          disabled={!isAdmin}
          className="px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {lang === "th" ? `เพิ่ม${meta.th}` : `Add ${meta.en.toLowerCase()}`}
        </button>
        {q && (
          <span className="text-xs text-muted-foreground">
            {lang === "th"
              ? `แสดง ${filtered.length} จาก ${rows.length} รายการ`
              : `${filtered.length} of ${rows.length} shown`}
          </span>
        )}
      </div>

      {otherHitTotal > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-accent/10 border-2 border-accent/25 rounded-2xl px-3 py-2 mb-3 text-xs">
          <span className="text-muted-foreground">
            {lang === "th"
              ? `เจอในแท็บอื่นอีก ${otherHitTotal} รายการ`
              : `${otherHitTotal} more in other tabs`}
          </span>
          {otherHits.map((h) => (
            <button
              key={h.entity}
              onClick={() => setTab(h.entity)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card border-2 border-border font-medium hover:border-primary/40"
            >
              <span>{ENTITY_META[h.entity].emoji}</span>
              {label(h.entity)}
              <span className="text-muted-foreground tabular-nums">{h.count}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase">
                <tr>
                  <th className="text-left p-3 w-16">{lang === "th" ? "รูป" : "Image"}</th>
                  <th className="text-left p-3">{lang === "th" ? "รหัส" : "ID/Key"}</th>
                  <th className="text-left p-3">{lang === "th" ? "ชื่อ" : "Name"}</th>
                  <th className="text-left p-3">{lang === "th" ? "รายละเอียด" : "Meta"}</th>
                  <th className="text-right p-3">{lang === "th" ? "จัดการ" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => {
                  const thumb =
                    (Array.isArray(r.images) && r.images[0]) ||
                    r.image ||
                    null;
                  return (
                    <tr
                      key={r.id ?? r.key}
                      className="border-t border-border hover:bg-muted/30 cursor-pointer"
                      onClick={() => isAdmin && setEditing(r)}
                    >
                      <td className="p-2">
                        <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center text-xl">
                          {thumb ? (
                            <img src={getPublicUrl(thumb) ?? ""} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span>{r.emoji ?? "•"}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs">{r.id ?? r.key}</td>
                      <td className="p-3">
                        <div className="font-semibold">{r.name?.th ?? r.title?.th}</div>
                        <div className="text-xs text-muted-foreground">{r.name?.en ?? r.title?.en}</div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {tab === "plants" && <>cat: {r.category}</>}
                        {tab === "supplies" && (
                          <>
                            {r.category} · ฿{r.price} · stock {r.stock}
                            {r.is_lucky ? " · ✨" : ""}
                            {saleInfo(Number(r.price), r.compare_at_price != null ? Number(r.compare_at_price) : null).onSale && (
                              <span className="text-destructive font-semibold">
                                {" "}· ลด {saleInfo(Number(r.price), Number(r.compare_at_price)).percentOff}%
                              </span>
                            )}
                          </>
                        )}
                        {tab === "plant_varieties" && <>plant: {r.plant_id}</>}
                        {tab === "categories" && <>order: {r.sort_order}</>}
                        {tab === "personality_examples" && (
                          <>type: {r.archetype}{r.plant_id ? ` · plant: ${r.plant_id}` : ""}</>
                        )}
                        {tab === "tags" && (
                          <span className={r.color ?? "badge-humid"}>
                            {r.emoji ? `${r.emoji} ` : ""}{r.name?.th ?? r.key}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => setEditing(r)}
                            disabled={!isAdmin}
                            className="p-2 rounded-lg hover:bg-muted disabled:opacity-40"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            disabled={!isAdmin}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      {q
                        ? (lang === "th"
                            ? `ไม่พบ "${search.trim()}" ใน${meta.th}`
                            : `No ${meta.en.toLowerCase()} match "${search.trim()}"`)
                        : (lang === "th"
                            ? `${meta.emptyTh} — กด "เพิ่ม${meta.th}" เพื่อสร้างรายการแรก`
                            : `${meta.emptyEn} — click "Add ${meta.en.toLowerCase()}" to create the first one`)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog
        open={!!editing || creating}
        onOpenChange={(o) => {
          if (!o) { setEditing(null); setCreating(false); }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? (lang === "th" ? "แก้ไข" : "Edit") : (lang === "th" ? "เพิ่มใหม่" : "Create")}
              {" · "}
              {ENTITY_META[tab].emoji} {label(tab)}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            entity={tab}
            record={editingWithVariants}
            onSubmit={handleSave}
            onCancel={() => { setEditing(null); setCreating(false); }}
            categoryOptions={categoryOptions}
            supplyCategoryOptions={supplyCategoryOptions}
            plantIdOptions={plantIdOptions}
            varietyOptions={varietyOptions}
            tagOptions={tagOptions}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
