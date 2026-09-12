import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, CheckCircle2, UploadCloud, FileJson, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase-external/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { WEEKDAYS, type FortuneTone } from "@/lib/fortune";
import { buildFortunePrompt } from "@/lib/fortunePrompt";

const TONES: { key: FortuneTone; th: string; en: string }[] = [
  { key: "positive", th: "ดี", en: "Positive" },
  { key: "neutral", th: "กลาง", en: "Neutral" },
  { key: "careful", th: "ระวัง", en: "Careful" },
];

interface ImportRow {
  weekday: number;
  tone: FortuneTone;
  th: string;
  en: string;
}

type ExistingRow = { weekday: number; tone: FortuneTone; message: { th: string; en: string } };

/** Same dedup key the DB's `msg_hash = md5(message->>'th')` unique constraint
 *  uses — exact-text match within a bucket is equivalent for preview purposes. */
const bucketKey = (weekday: number, tone: string, th: string) => `${weekday}|${tone}|${th}`;

/**
 * Standalone admin panel — not a CRUD entity — for topping up the daily-
 * fortune message pool (see fortune-messages-external.sql). An admin pastes
 * a JSON batch, previews what's new vs. already in the pool, then imports.
 * Import is additive: the DB's unique constraint silently drops anything
 * already present, so re-pasting an old batch is harmless.
 */
const FortuneMessagesPanel = () => {
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const [jsonText, setJsonText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ImportRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ added: number; duplicate: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin", "fortune_messages"],
    queryFn: async (): Promise<ExistingRow[]> => {
      const { data, error } = await (supabase as any)
        .from("fortune_messages")
        .select("weekday,tone,message")
        .limit(2000);
      if (error) throw error;
      return (data ?? []) as ExistingRow[];
    },
  });

  const poolSize = (weekday: number, tone: FortuneTone) =>
    (existing ?? []).filter((r) => r.weekday === weekday && r.tone === tone).length;

  const existingKeys = new Set(
    (existing ?? []).map((r) => bucketKey(r.weekday, r.tone, r.message?.th ?? "")),
  );

  const copyPrompt = async () => {
    // Every distinct th already in the pool, live from the DB — not the
    // (weekday, tone) buckets, since the prompt just needs "don't repeat
    // this text," not which buckets it landed in.
    const uniqueMessages = Array.from(
      new Set((existing ?? []).map((r) => r.message?.th).filter((th): th is string => !!th)),
    ).sort();
    try {
      await navigator.clipboard.writeText(buildFortunePrompt(uniqueMessages));
      toast.success(
        lang === "th"
          ? `คัดลอกแล้ว (กันซ้ำ ${uniqueMessages.length} ข้อความ) — ไปวางในแชต AI ได้เลย`
          : `Copied (excluding ${uniqueMessages.length} existing messages) — paste into an AI chat`,
      );
    } catch {
      toast.error(lang === "th" ? "คัดลอกไม่สำเร็จ ลองอีกครั้ง" : "Copy failed — try again");
    }
  };

  const validateText = (text: string) => {
    setImportResult(null);
    try {
      const raw = JSON.parse(text);
      if (!Array.isArray(raw)) throw new Error(lang === "th" ? "ต้องเป็น array" : "Must be a JSON array");
      const rows: ImportRow[] = raw.flatMap((r, i) => {
        const isAll = r.weekday === "all";
        if (!isAll && (typeof r.weekday !== "number" || r.weekday < 0 || r.weekday > 6)) {
          throw new Error(`[${i}] weekday ต้องเป็นเลข 0-6 หรือ "all"`);
        }
        if (!["positive", "neutral", "careful"].includes(r.tone)) {
          throw new Error(`[${i}] tone ต้องเป็น positive/neutral/careful`);
        }
        if (!r.th?.trim() || !r.en?.trim()) {
          throw new Error(`[${i}] ต้องมีทั้ง th และ en`);
        }
        const row = { tone: r.tone, th: r.th.trim(), en: r.en.trim() };
        // "all" is a writing-time shorthand only — every bucket still gets
        // its own row (same dedup rules apply per weekday independently).
        return isAll
          ? [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, ...row }))
          : [{ weekday: r.weekday, ...row }];
      });
      setParsed(rows);
      setParseError(null);
    } catch (e) {
      setParsed(null);
      setParseError(e instanceof Error ? e.message : String(e));
    }
  };
  const validate = () => validateText(jsonText);

  /** Reads a dropped/picked .json file into the textarea and validates it
   *  right away — the file itself is unambiguous, unlike free-typed paste. */
  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setJsonText(text);
      setFileName(file.name);
      validateText(text);
    };
    reader.onerror = () => setParseError(lang === "th" ? "อ่านไฟล์ไม่สำเร็จ" : "Could not read the file");
    reader.readAsText(file);
  };

  const doImport = async () => {
    if (!parsed || parsed.length === 0) return;
    setImporting(true);
    try {
      const rows = parsed.map((r) => ({
        weekday: r.weekday,
        tone: r.tone,
        message: { th: r.th, en: r.en },
      }));
      const { data, error } = await (supabase as any)
        .from("fortune_messages")
        .upsert(rows, { onConflict: "weekday,tone,msg_hash", ignoreDuplicates: true })
        .select();
      if (error) throw error;
      const added = (data ?? []).length;
      setImportResult({ added, duplicate: rows.length - added });
      toast.success(lang === "th" ? `เพิ่มแล้ว ${added} ข้อความ` : `Added ${added} messages`);
      setJsonText("");
      setFileName(null);
      setParsed(null);
      qc.invalidateQueries({ queryKey: ["admin", "fortune_messages"] });
      qc.invalidateQueries({ queryKey: ["fortune_messages"] }); // the public-facing hook
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setImporting(false);
    }
  };

  // Preview: how many of the parsed rows are already in the pool (same
  // bucket + exact th text) vs. genuinely new.
  const previewDuplicates = parsed
    ? parsed.filter((r) => existingKeys.has(bucketKey(r.weekday, r.tone, r.th))).length
    : 0;

  return (
    <div className="space-y-4">
      <div className="bg-card border-2 border-border rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="font-display font-bold text-lg text-foreground">
            {lang === "th" ? "คลังข้อความดวงรายวัน" : "Daily fortune message pool"}
          </h2>
          <button
            type="button"
            onClick={copyPrompt}
            className="shrink-0 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-muted/70"
          >
            <Copy className="w-3.5 h-3.5" />
            {lang === "th" ? "คัดลอก Prompt เดือนถัดไป" : "Copy next month's prompt"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {lang === "th"
            ? "แยกคลังตามวันเกิด × โทน (21 คลัง) — แอปหมุนใช้ตามวันที่ ไม่ซ้ำจนกว่าจะครบรอบคลัง วางเพิ่มได้เรื่อย ๆ ของเดิมไม่หาย"
            : "Bucketed by birth weekday × tone (21 buckets) — the app rotates through a bucket by date, no repeat until it cycles. Paste more any time; nothing already imported is lost."}
        </p>

        {isLoading ? (
          <div className="py-6 text-center text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w.key} className="rounded-xl bg-muted/50 border border-border p-2">
                <p className="text-xs font-semibold text-foreground mb-1.5">{lang === "th" ? w.th : w.en}</p>
                <div className="space-y-1">
                  {TONES.map((t) => {
                    const n = poolSize(w.key, t.key);
                    return (
                      <div key={t.key} className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{lang === "th" ? t.th : t.en}</span>
                        <span
                          className={`tabular-nums font-semibold ${n === 0 ? "text-destructive" : n < 7 ? "text-accent" : "text-primary"}`}
                        >
                          {n}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-muted-foreground mt-2">
          {lang === "th"
            ? "ตัวเลข = จำนวนวันก่อนคลังนั้นเริ่มวนซ้ำ (สีแดง = ยังไม่มีเลย ใช้ค่า fallback ในตัวแอป)"
            : "Number = days before that bucket repeats (red = empty, falls back to the app's built-in set)"}
        </p>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl p-4">
        <label className="block text-sm font-semibold text-foreground mb-2">
          {lang === "th" ? "วาง JSON ข้อความใหม่" : "Paste new messages as JSON"}
        </label>
        <p className="text-[11px] text-muted-foreground mb-2 font-mono">
          {'[{ "weekday": 0, "tone": "positive", "th": "…", "en": "…" }, …]'}
        </p>
        <p className="text-[11px] text-muted-foreground mb-2">
          {lang === "th"
            ? 'weekday ใส่ "all" ได้ — ข้อความนั้นจะถูกเติมให้ครบทั้ง 7 วันอัตโนมัติ'
            : 'weekday can be "all" — that message is added to all 7 weekday buckets automatically'}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) loadFile(file);
            e.target.value = ""; // lets picking the same file again re-trigger onChange
          }}
        />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) loadFile(file);
          }}
          className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border p-3 mb-3"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <FileJson className="w-3.5 h-3.5" />
            {lang === "th" ? "เลือกไฟล์ .json" : "Choose .json file"}
          </button>
          <span className="text-xs text-muted-foreground">
            {fileName
              ? fileName
              : lang === "th"
                ? "หรือลากไฟล์มาวางตรงนี้ — เลือกไฟล์แล้วตรวจให้อัตโนมัติ"
                : "or drag a file here — validated automatically once loaded"}
          </span>
        </div>

        <textarea
          value={jsonText}
          onChange={(e) => { setJsonText(e.target.value); setFileName(null); setParsed(null); setParseError(null); }}
          rows={10}
          className="w-full px-3 py-2 rounded-lg bg-background border-2 border-border focus:outline-none focus:border-primary/50 text-xs font-mono"
          placeholder="[ … ]"
        />

        {parseError && (
          <p className="text-xs text-destructive mt-2">{parseError}</p>
        )}

        {parsed && (
          <div className="mt-3 rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>
              {lang === "th"
                ? `พร้อมนำเข้า ${parsed.length} ข้อความ — ใหม่จริง ${parsed.length - previewDuplicates} ข้อความ ซ้ำของเดิม ${previewDuplicates} ข้อความ (จะถูกข้ามอัตโนมัติ)`
                : `${parsed.length} messages ready — ${parsed.length - previewDuplicates} new, ${previewDuplicates} already in the pool (skipped automatically)`}
            </span>
          </div>
        )}

        {importResult && (
          <div className="mt-3 rounded-xl bg-accent/10 border border-accent/30 p-3 text-sm">
            {lang === "th"
              ? `นำเข้าเสร็จแล้ว: เพิ่มใหม่ ${importResult.added} ข้อความ, ข้ามซ้ำ ${importResult.duplicate} ข้อความ`
              : `Import done: added ${importResult.added}, skipped ${importResult.duplicate} duplicates`}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={validate}
            disabled={!jsonText.trim()}
            className="px-4 py-2 rounded-full bg-muted text-foreground text-sm font-semibold disabled:opacity-50"
          >
            {lang === "th" ? "ตรวจ" : "Validate"}
          </button>
          <button
            type="button"
            onClick={doImport}
            disabled={!parsed || parsed.length === 0 || importing}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
          >
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {lang === "th" ? "เพิ่มเข้าคลัง" : "Add to pool"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FortuneMessagesPanel;
