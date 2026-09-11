import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { ARCHETYPES } from "@/lib/personality";
import { saleInfo } from "@/lib/price";


function NumberInput({
  value,
  onChange,
  min,
  className,
}: {
  value: number | null | undefined;
  onChange: (n: number) => void;
  min?: number;
  className?: string;
}) {
  const [text, setText] = useState(value === null || value === undefined ? "" : String(value));

  useEffect(() => {
    const current = text === "" ? null : Number(text);
    const next = value === null || value === undefined ? null : Number(value);
    if (current !== next) setText(next === null ? "" : String(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="number"
      min={min}
      className={className}
      value={text}
      onChange={(e) => {
        const t = e.target.value;
        setText(t);
        if (t === "" || t === "-") {
          onChange(min ?? 0);
          return;
        }
        let n = Number(t);
        if (Number.isNaN(n)) return;
        if (min !== undefined) n = Math.max(min, n);
        onChange(n);
      }}
      onBlur={() => {
        if (text === "" || text === "-") setText(String(min ?? 0));
      }}
    />
  );
}

type Entity = "plants" | "supplies" | "categories" | "plant_varieties" | "personality_examples" | "tags";

interface Option { value: string; label: string }
interface Props {
  entity: Entity;
  record: any | null;
  onSubmit: (r: any) => Promise<void> | void;
  onCancel: () => void;
  categoryOptions?: Option[];
  supplyCategoryOptions?: Option[];
  plantIdOptions?: Option[];
  varietyOptions?: (Option & { plantId: string })[];
  tagOptions?: (Option & { color: string; emoji: string | null })[];
}

const defaults: Record<Entity, any> = {
  plants: {
    id: "",
    category: "foliage",
    emoji: "🌱",
    name: { th: "", en: "" },
    description: { th: "", en: "" },
    care: {
      light: { th: "", en: "" },
      water: { th: "", en: "" },
      humidity: { th: "", en: "" },
      temp: { th: "", en: "" },
      soil: { th: "", en: "" },
      tips: { th: "", en: "" },
    },
    levels: { light: 50, water: 50, humidity: 50, temp: 50 },
    images: [],
    tags: [],
    sort_order: 0,
  },
  supplies: {
    id: "",
    category: "plants",
    emoji: "🌳",
    name: { th: "", en: "" },
    description: { th: "", en: "" },
    price: 0,
    compare_at_price: null,
    stock: 0,
    is_lucky: false,
    lucky: null,
    plant_id: null,
    variety_id: null,
    images: [],
    tags: [],
    sort_order: 0,
  },
  categories: {
    key: "",
    emoji: "🌱",
    color: "badge-humid",
    name: { th: "", en: "" },
    sort_order: 0,
  },
  personality_examples: {
    id: "",
    archetype: "chill",
    emoji: "🪴",
    title: { th: "", en: "" },
    description: { th: "", en: "" },
    tips: { th: "", en: "" },
    plant_id: null,
    images: [],
    sort_order: 0,
  },
  tags: {
    key: "",
    emoji: "✨",
    color: "badge-new",
    name: { th: "", en: "" },
    sort_order: 0,
  },
  plant_varieties: {
    id: "",
    plant_id: "",
    emoji: "🌱",
    name: { th: "", en: "" },
    description: { th: "", en: "" },
    features: { th: "", en: "" },
    bloom_season: null,
    size: null,
    care_tip: null,
    origin: null,
    origin_url: null,
    forms: [],
    image: null,
    images: [],
    tags: [],
    sort_order: 0,
  },
};

// ---- tiny field primitives ------------------------------------------------
const fieldCls =
  "w-full h-10 px-3 rounded-lg bg-background border-2 border-border focus:outline-none focus:border-primary/50 text-sm";
const areaCls =
  "w-full px-3 py-2 rounded-lg bg-background border-2 border-border focus:outline-none focus:border-primary/50 text-sm";
/**
 * Key of the row in the `tags` table that unlocks the old-price field.
 * Renaming that key in the admin silently hides the field — accepted tradeoff
 * for not needing a second "is on sale" flag alongside the tag.
 */
const SALE_TAG_KEY = "sale";

/** Every badge class that actually exists in index.css. Admins pick from these. */
const BADGE_COLORS: Option[] = [
  { value: "badge-new", label: "New — เขียวเข้ม" },
  { value: "badge-sale", label: "Sale — แดง" },
  { value: "badge-hot", label: "Hot — ส้ม" },
  { value: "badge-rare", label: "Rare — ม่วง" },
  { value: "badge-water", label: "Water — ฟ้า" },
  { value: "badge-humid", label: "Humid — มิ้นต์" },
  { value: "badge-flower", label: "Flower — ชมพู" },
  { value: "badge-cactus", label: "Cactus — เหลือง" },
];

const lblCls = "text-xs font-semibold text-muted-foreground";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <div className={lblCls}>{label}</div>
    {children}
  </div>
);

const SelectOrCustom = ({
  value,
  onChange,
  options,
  allowCustom = true,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allowCustom?: boolean;
  disabled?: boolean;
}) => {
  const known = options.some((o) => o.value === value);
  const [custom, setCustom] = useState(!known && !!value);
  return (
    <div className="space-y-1">
      <select
        disabled={disabled}
        className={fieldCls}
        value={custom ? "__custom__" : value}
        onChange={(e) => {
          if (e.target.value === "__custom__") { setCustom(true); onChange(""); }
          else { setCustom(false); onChange(e.target.value); }
        }}
      >
        <option value="">— select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
        {allowCustom && <option value="__custom__">+ custom…</option>}
      </select>
      {custom && (
        <input
          autoFocus
          className={fieldCls}
          placeholder="custom value"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

/** Toggle-chips picker for a text[] column. Values are keys, not labels. */
const TagPicker = ({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: (Option & { color: string; emoji: string | null })[];
}) => {
  const selected = value ?? [];
  const toggle = (key: string) =>
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);

  return (
    <Field label="Tags">
      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          ยังไม่มีแท็ก — สร้างก่อนที่แท็บ 🔖 แท็ก
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {options.map((o) => {
            const on = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => toggle(o.value)}
                aria-pressed={on}
                className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-colors ${
                  on ? `${o.color} border-transparent` : "bg-card border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {o.emoji && <span className="mr-1">{o.emoji}</span>}
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </Field>
  );
};

const BilingualText = ({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: { th?: string; en?: string } | null | undefined;
  onChange: (v: { th: string; en: string }) => void;
  textarea?: boolean;
}) => {
  const v = value ?? { th: "", en: "" };
  const Comp: any = textarea ? "textarea" : "input";
  return (
    <Field label={label}>
      <div className="grid grid-cols-2 gap-2">
        <Comp
          rows={textarea ? 3 : undefined}
          className={textarea ? areaCls : fieldCls}
          placeholder="ไทย"
          value={v.th ?? ""}
          onChange={(e: any) => onChange({ th: e.target.value, en: v.en ?? "" })}
        />
        <Comp
          rows={textarea ? 3 : undefined}
          className={textarea ? areaCls : fieldCls}
          placeholder="English"
          value={v.en ?? ""}
          onChange={(e: any) => onChange({ th: v.th ?? "", en: e.target.value })}
        />
      </div>
    </Field>
  );
};

const Slider = ({
  label,
  value,
  onChange,
}: { label: string; value: number; onChange: (n: number) => void }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className={lblCls}>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-primary"
    />
  </div>
);

// ---- Variants editor (supplies) ------------------------------------------
type VariantDraft = {
  id: string;
  name: { th: string; en: string };
  description: { th: string; en: string };
  price: number;
  stock: number;
  image: string | null;
  sort_order: number;
};

const makeVariantId = () =>
  `var-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const VariantsEditor = ({
  value,
  onChange,
  folder,
}: {
  value: any[];
  onChange: (v: VariantDraft[]) => void;
  folder: string;
}) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const normalized: VariantDraft[] = value.map((v: any) => ({
    id: v.id ?? makeVariantId(),
    name: v.name ?? { th: "", en: "" },
    description: v.description ?? { th: "", en: "" },
    price: Number(v.price ?? 0),
    stock: Number(v.stock ?? 0),
    image: v.image ?? null,
    sort_order: Number(v.sort_order ?? 0),
  }));

  const update = (idx: number, patch: Partial<VariantDraft>) => {
    const next = normalized.map((v, i) => (i === idx ? { ...v, ...patch } : v));
    onChange(next);
  };
  const remove = (idx: number) => onChange(normalized.filter((_, i) => i !== idx));
  const add = () => {
    const id = makeVariantId();
    onChange([
      ...normalized,
      {
        id,
        name: { th: "", en: "" },
        description: { th: "", en: "" },
        price: 0,
        stock: 0,
        image: null,
        sort_order: normalized.length,
      },
    ]);
    setOpen((o) => ({ ...o, [id]: true }));
  };

  return (
    <div className="space-y-2 border-2 border-dashed border-border rounded-2xl p-3">
      <div className="flex items-center justify-between">
        <div className={lblCls}>ตัวเลือกย่อย (Variants) · {normalized.length}</div>
        <button
          type="button"
          onClick={add}
          className="text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> เพิ่ม
        </button>
      </div>

      {normalized.map((v, idx) => {
        const isOpen = open[v.id] ?? false;
        return (
          <div key={v.id} className="rounded-xl border-2 border-border bg-background">
            <div className="flex items-center gap-2 p-2">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [v.id]: !isOpen }))}
                className="p-1 rounded hover:bg-muted"
              >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0 text-sm">
                <span className="font-semibold">{v.name.th || v.name.en || "(ยังไม่ตั้งชื่อ)"}</span>
                <span className="text-xs text-muted-foreground ml-2">฿{v.price} · stock {v.stock}</span>
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {isOpen && (
              <div className="p-3 pt-0 space-y-3">
                <BilingualText
                  label="Name"
                  value={v.name}
                  onChange={(n) => update(idx, { name: n })}
                />
                <BilingualText
                  label="Short description"
                  value={v.description}
                  onChange={(n) => update(idx, { description: n })}
                  textarea
                />
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Price (฿)">
                    <NumberInput
                      className={fieldCls}
                      value={v.price}
                      onChange={(n) => update(idx, { price: n })}
                    />
                  </Field>
                  <Field label="Stock">
                    <NumberInput
                      min={0}
                      className={fieldCls}
                      value={v.stock}
                      onChange={(n) => update(idx, { stock: n })}
                    />
                  </Field>
                  <Field label="Sort">
                    <NumberInput
                      className={fieldCls}
                      value={v.sort_order}
                      onChange={(n) => update(idx, { sort_order: n })}
                    />
                  </Field>
                </div>
                <ImageUploader
                  label="Image"
                  value={v.image ? [v.image] : []}
                  onChange={(arr) => update(idx, { image: arr[0] ?? null })}
                  folder={folder}
                  multiple={false}
                />
              </div>
            )}
          </div>
        );
      })}

      {normalized.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-3">
          ยังไม่มีตัวเลือกย่อย — กด "เพิ่ม" เพื่อสร้าง
        </p>
      )}
    </div>
  );
};

// ---- Mutation-forms editor (plant_varieties, self-referencing) ----------
type FormDraft = {
  id: string;
  name: { th: string; en: string };
  description: { th: string; en: string };
  image: string | null;
};

const makeFormId = () =>
  `vf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/**
 * Edits a variety's mutation forms (cristata, variegated, …) inline, the same
 * way VariantsEditor edits supply variants. Each form is just a name, a short
 * description and an image; AdminPage.handleSave writes them back to
 * plant_varieties with parent_variety_id set.
 */
type FormRowIn = Partial<FormDraft> & { images?: string[] };

const FormsEditor = ({
  value,
  onChange,
  folder,
}: {
  value: FormRowIn[];
  onChange: (v: FormDraft[]) => void;
  folder: string;
}) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const normalized: FormDraft[] = value.map((v) => ({
    id: v.id ?? makeFormId(),
    name: v.name ?? { th: "", en: "" },
    description: v.description ?? { th: "", en: "" },
    image: v.image ?? (Array.isArray(v.images) ? v.images[0] ?? null : null),
  }));

  const update = (idx: number, patch: Partial<FormDraft>) =>
    onChange(normalized.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  const remove = (idx: number) => onChange(normalized.filter((_, i) => i !== idx));
  const add = () => {
    const id = makeFormId();
    onChange([...normalized, { id, name: { th: "", en: "" }, description: { th: "", en: "" }, image: null }]);
    setOpen((o) => ({ ...o, [id]: true }));
  };

  return (
    <div className="space-y-2 border-2 border-dashed border-border rounded-2xl p-3">
      <div className="flex items-center justify-between">
        <div className={lblCls}>ฟอร์มของสายพันธุ์ (Mutation forms) · {normalized.length}</div>
        <button
          type="button"
          onClick={add}
          className="text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> เพิ่ม
        </button>
      </div>

      {normalized.map((v, idx) => {
        const isOpen = open[v.id] ?? false;
        return (
          <div key={v.id} className="rounded-xl border-2 border-border bg-background">
            <div className="flex items-center gap-2 p-2">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [v.id]: !isOpen }))}
                className="p-1 rounded hover:bg-muted"
              >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0 text-sm font-semibold">
                {v.name.th || v.name.en || "(ยังไม่ตั้งชื่อ)"}
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {isOpen && (
              <div className="p-3 pt-0 space-y-3">
                <BilingualText label="Name" value={v.name} onChange={(n) => update(idx, { name: n })} />
                <BilingualText
                  label="Description"
                  value={v.description}
                  onChange={(n) => update(idx, { description: n })}
                  textarea
                />
                <ImageUploader
                  label="Image (optional)"
                  value={v.image ? [v.image] : []}
                  onChange={(arr) => update(idx, { image: arr[0] ?? null })}
                  folder={folder}
                  multiple={false}
                />
              </div>
            )}
          </div>
        );
      })}

      {normalized.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-3">
          ยังไม่มีฟอร์ม — กด "เพิ่ม" เพื่อสร้าง (เช่น คริสตาต้า, ด่าง, ไร้หนาม)
        </p>
      )}
    </div>
  );
};

// ---- main form ------------------------------------------------------------

const EntityForm = ({
  entity, record, onSubmit, onCancel,
  categoryOptions = [], supplyCategoryOptions = [], plantIdOptions = [], varietyOptions = [],
  tagOptions = [],
}: Props) => {
  const [data, setData] = useState<any>(record ?? defaults[entity]);
  const [busy, setBusy] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState("");

  useEffect(() => {
    const initial = record ?? defaults[entity];
    setData(initial);
    setJsonText(JSON.stringify(initial, null, 2));
  }, [record, entity]);

  const patch = (p: any) => {
    const next = { ...data, ...p };
    setData(next);
    setJsonText(JSON.stringify(next, null, 2));
  };
  const patchCare = (key: string, val: any) =>
    patch({ care: { ...(data.care ?? {}), [key]: val } });
  const patchLevels = (key: string, val: number) =>
    patch({ levels: { ...(data.levels ?? {}), [key]: val } });

  const folder = (() => {
    if (entity === "plants") return `plants/${data.id || "unsorted"}`;
    if (entity === "supplies") return `supplies/${data.id || "unsorted"}`;
    if (entity === "plant_varieties")
      return `plants/${data.plant_id || "unsorted"}/varieties`;
    if (entity === "personality_examples")
      return `personality/${data.archetype || "misc"}`;
    return "misc";
  })();

  const handleSubmit = async () => {
    setBusy(true);
    try {
      const final = showJson ? JSON.parse(jsonText) : data;
      await onSubmit(final);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">
          {record ? "Edit" : "Create"} · {entity}
        </div>
        <button
          type="button"
          onClick={() => setShowJson((s) => !s)}
          className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/70"
        >
          {showJson ? "Form view" : "JSON view"}
        </button>
      </div>

      {showJson ? (
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={20}
          className="w-full font-mono text-xs p-3 rounded-lg bg-muted border-2 border-border focus:outline-none focus:border-primary/40"
        />
      ) : (
        <div className="space-y-4">
          {/* ---- PLANTS ---- */}
          {entity === "plants" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="ID (slug)">
                  <input
                    className={fieldCls}
                    value={data.id ?? ""}
                    onChange={(e) => patch({ id: e.target.value })}
                    disabled={!!record}
                  />
                </Field>
                <Field label="Category">
                  <SelectOrCustom
                    value={data.category ?? ""}
                    onChange={(v) => patch({ category: v })}
                    options={categoryOptions}
                  />
                </Field>
                <Field label="Emoji">
                  <input
                    className={fieldCls}
                    value={data.emoji ?? ""}
                    onChange={(e) => patch({ emoji: e.target.value })}
                  />
                </Field>
              </div>
              <BilingualText
                label="Name"
                value={data.name}
                onChange={(v) => patch({ name: v })}
              />
              <BilingualText
                label="Description"
                value={data.description}
                onChange={(v) => patch({ description: v })}
                textarea
              />

              <ImageUploader
                label="Images"
                value={Array.isArray(data.images) ? data.images : []}
                onChange={(v) => patch({ images: v })}
                folder={folder}
                multiple
              />

              <div>
                <div className={`${lblCls} mb-2`}>Levels</div>
                <div className="grid grid-cols-2 gap-4">
                  {(["light", "water", "humidity", "temp"] as const).map((k) => (
                    <Slider
                      key={k}
                      label={k}
                      value={Number(data.levels?.[k] ?? 0)}
                      onChange={(n) => patchLevels(k, n)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className={`${lblCls} mb-2`}>Care guide</div>
                <div className="space-y-3">
                  {(["light", "water", "humidity", "temp", "soil", "tips"] as const).map((k) => (
                    <BilingualText
                      key={k}
                      label={k}
                      value={data.care?.[k]}
                      onChange={(v) => patchCare(k, v)}
                    />
                  ))}
                </div>
              </div>

              <TagPicker
                value={(data.tags ?? []) as string[]}
                onChange={(v) => patch({ tags: v })}
                options={tagOptions}
              />

              <Field label="Sort order">
                <NumberInput
                  className={fieldCls}
                  value={data.sort_order}
                  onChange={(n) => patch({ sort_order: n })}
                />
              </Field>
            </>
          )}

          {/* ---- SUPPLIES ---- */}
          {entity === "supplies" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="ID (slug)">
                  <input
                    className={fieldCls}
                    value={data.id ?? ""}
                    onChange={(e) => patch({ id: e.target.value })}
                    disabled={!!record}
                  />
                </Field>
                <Field label="Category">
                  <SelectOrCustom
                    value={data.category ?? ""}
                    onChange={(v) => patch({ category: v })}
                    options={supplyCategoryOptions}
                  />
                </Field>
                <Field label="Emoji">
                  <input
                    className={fieldCls}
                    value={data.emoji ?? ""}
                    onChange={(e) => patch({ emoji: e.target.value })}
                  />
                </Field>
              </div>
              <BilingualText
                label="Name"
                value={data.name}
                onChange={(v) => patch({ name: v })}
              />
              <BilingualText
                label="Description"
                value={data.description}
                onChange={(v) => patch({ description: v })}
                textarea
              />

              <ImageUploader
                label="Images"
                value={Array.isArray(data.images) ? data.images : []}
                onChange={(v) => patch({ images: v })}
                folder={folder}
                multiple
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Price (฿)">
                  <NumberInput
                    className={fieldCls}
                    value={data.price}
                    onChange={(n) => patch({ price: n })}
                  />
                </Field>
                <Field label="Stock">
                  <NumberInput
                    min={0}
                    className={fieldCls}
                    value={data.stock}
                    onChange={(n) => patch({ stock: n })}
                  />
                </Field>
                <Field label="Sort order">
                  <NumberInput
                    className={fieldCls}
                    value={data.sort_order}
                    onChange={(n) => patch({ sort_order: n })}
                  />
                </Field>
                <Field label="Lucky?">
                  <label className="flex items-center gap-2 h-10 px-3 rounded-lg bg-background border-2 border-border">
                    <input
                      type="checkbox"
                      checked={!!data.is_lucky}
                      onChange={(e) => patch({ is_lucky: e.target.checked })}
                    />
                    <span className="text-sm">✨ lucky item</span>
                  </label>
                </Field>
              </div>

              {((data.tags ?? []) as string[]).includes(SALE_TAG_KEY) && (
                <div className="rounded-lg border-2 border-destructive/25 bg-destructive/5 p-3 space-y-2">
                  <Field label="ราคาเก่า ก่อนลด (Old price)">
                    <NumberInput
                      min={0}
                      className={fieldCls}
                      value={data.compare_at_price ?? 0}
                      onChange={(n) => patch({ compare_at_price: n > 0 ? n : null })}
                    />
                  </Field>
                  {(() => {
                    const oldPrice = Number(data.compare_at_price ?? 0);
                    const newPrice = Number(data.price ?? 0);
                    if (!oldPrice) {
                      return (
                        <p className="text-xs text-muted-foreground">
                          ใส่ราคาเก่าเพื่อให้หน้าเว็บขึ้นราคาขีดฆ่า · เว้นว่างไว้ = ไม่แสดง
                        </p>
                      );
                    }
                    const { onSale, percentOff } = saleInfo(newPrice, oldPrice);
                    return onSale ? (
                      <p className="text-xs">
                        <span className="text-muted-foreground line-through">
                          ฿{oldPrice.toLocaleString()}
                        </span>{" "}
                        → <span className="font-semibold">฿{newPrice.toLocaleString()}</span>{" "}
                        <span className="badge-sale !px-2 !py-0.5 !text-[10px]">-{percentOff}%</span>
                      </p>
                    ) : (
                      <p className="text-xs text-destructive font-semibold">
                        ⚠️ ราคาเก่าต้องมากกว่าราคาปัจจุบัน (฿{newPrice.toLocaleString()}) —
                        ตอนนี้หน้าเว็บจะไม่แสดงราคาลด
                      </p>
                    );
                  })()}
                </div>
              )}

              {data.is_lucky && (
                <Field label="Lucky meta (JSON)">
                  <textarea
                    rows={4}
                    className={`${areaCls} font-mono text-xs`}
                    value={JSON.stringify(data.lucky ?? {}, null, 2)}
                    onChange={(e) => {
                      try {
                        patch({ lucky: JSON.parse(e.target.value || "null") });
                      } catch {
                        /* ignore until valid */
                      }
                    }}
                  />
                </Field>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="พรรณไม้ที่เกี่ยวข้อง (Linked plant)">
                  <SelectOrCustom
                    value={data.plant_id ?? ""}
                    onChange={(v) => patch({ plant_id: v || null, variety_id: null })}
                    options={plantIdOptions}
                    allowCustom={false}
                  />
                </Field>
                <Field label="สายพันธุ์ย่อย (Linked variety)">
                  <SelectOrCustom
                    value={data.variety_id ?? ""}
                    onChange={(v) => patch({ variety_id: v || null })}
                    options={varietyOptions.filter(
                      (o) => !data.plant_id || o.plantId === data.plant_id,
                    )}
                    allowCustom={false}
                  />
                  {!data.plant_id && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      เลือกพรรณไม้ก่อนเพื่อกรองสายพันธุ์ย่อย
                    </p>
                  )}
                </Field>
              </div>

              <TagPicker
                value={(data.tags ?? []) as string[]}
                onChange={(v) =>
                  // Dropping the sale tag also drops the old price, otherwise the
                  // field disappears from this form while the site keeps striking
                  // the price through with a value nobody can see or edit.
                  patch({
                    tags: v,
                    ...(v.includes(SALE_TAG_KEY) ? {} : { compare_at_price: null }),
                  })
                }
                options={tagOptions}
              />

              <VariantsEditor
                value={Array.isArray(data.variants) ? data.variants : []}
                onChange={(v) => patch({ variants: v })}
                folder={`supplies/${data.id || "unsorted"}/variants`}
              />
            </>
          )}


          {/* ---- CATEGORIES ---- */}
          {entity === "tags" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Key (slug)">
                  <input
                    className={fieldCls}
                    value={data.key ?? ""}
                    onChange={(e) => patch({ key: e.target.value })}
                    disabled={!!record}
                  />
                </Field>
                <Field label="Emoji">
                  <input
                    className={fieldCls}
                    value={data.emoji ?? ""}
                    onChange={(e) => patch({ emoji: e.target.value })}
                  />
                </Field>
                <Field label="Color">
                  <SelectOrCustom
                    value={data.color ?? "badge-new"}
                    onChange={(v) => patch({ color: v })}
                    options={BADGE_COLORS}
                    allowCustom={false}
                  />
                </Field>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Preview:</span>
                <span className={data.color || "badge-new"}>
                  {data.emoji && <span className="mr-1">{data.emoji}</span>}
                  {data.name?.th || data.key || "แท็ก"}
                </span>
              </div>
              <BilingualText
                label="Name"
                value={data.name}
                onChange={(v) => patch({ name: v })}
              />
              <Field label="Sort order">
                <NumberInput
                  className={fieldCls}
                  value={data.sort_order}
                  onChange={(n) => patch({ sort_order: n })}
                />
              </Field>
            </>
          )}

          {entity === "categories" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Key">
                  <input
                    className={fieldCls}
                    value={data.key ?? ""}
                    onChange={(e) => patch({ key: e.target.value })}
                    disabled={!!record}
                  />
                </Field>
                <Field label="Emoji">
                  <input
                    className={fieldCls}
                    value={data.emoji ?? ""}
                    onChange={(e) => patch({ emoji: e.target.value })}
                  />
                </Field>
                <Field label="Color token">
                  <input
                    className={fieldCls}
                    value={data.color ?? ""}
                    onChange={(e) => patch({ color: e.target.value })}
                  />
                </Field>
              </div>
              <BilingualText
                label="Name"
                value={data.name}
                onChange={(v) => patch({ name: v })}
              />
              <Field label="Sort order">
                <NumberInput
                  className={fieldCls}
                  value={data.sort_order}
                  onChange={(n) => patch({ sort_order: n })}
                />
              </Field>
            </>
          )}

          {/* ---- VARIETIES ---- */}
          {entity === "personality_examples" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="ID (slug)">
                  <input
                    className={fieldCls}
                    value={data.id ?? ""}
                    onChange={(e) => patch({ id: e.target.value })}
                    disabled={!!record}
                  />
                </Field>
                <Field label="Personality (archetype)">
                  <SelectOrCustom
                    value={data.archetype ?? ""}
                    onChange={(v) => patch({ archetype: v })}
                    options={ARCHETYPES.map((a) => ({
                      value: a.key,
                      label: `${a.emoji} ${a.th} / ${a.en}`,
                    }))}
                    allowCustom={false}
                  />
                </Field>
                <Field label="Emoji">
                  <input
                    className={fieldCls}
                    value={data.emoji ?? ""}
                    onChange={(e) => patch({ emoji: e.target.value })}
                  />
                </Field>
              </div>
              <BilingualText label="Title" value={data.title} onChange={(v) => patch({ title: v })} />
              <BilingualText
                label="Description"
                value={data.description}
                onChange={(v) => patch({ description: v })}
                textarea
              />
              <BilingualText
                label="Care tip"
                value={data.tips ?? { th: "", en: "" }}
                onChange={(v) => patch({ tips: v })}
                textarea
              />
              <Field label="Linked plant (optional)">
                <SelectOrCustom
                  value={data.plant_id ?? ""}
                  onChange={(v) => patch({ plant_id: v || null })}
                  options={[{ value: "", label: "— none —" }, ...plantIdOptions]}
                  allowCustom={false}
                />
              </Field>
              <ImageUploader
                label="Images"
                value={(data.images ?? []) as string[]}
                onChange={(v) => patch({ images: v })}
                folder={folder}
                multiple
              />
              <Field label="Sort order">
                <NumberInput
                  className={fieldCls}
                  value={data.sort_order}
                  onChange={(n) => patch({ sort_order: n })}
                />
              </Field>
            </>
          )}

          {entity === "plant_varieties" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="ID (slug)">
                  <input
                    className={fieldCls}
                    value={data.id ?? ""}
                    onChange={(e) => patch({ id: e.target.value })}
                    disabled={!!record}
                  />
                </Field>
                <Field label="Plant">
                  <SelectOrCustom
                    value={data.plant_id ?? ""}
                    onChange={(v) => patch({ plant_id: v })}
                    options={plantIdOptions}
                    allowCustom={false}
                  />
                </Field>
                <Field label="Emoji">
                  <input
                    className={fieldCls}
                    value={data.emoji ?? ""}
                    onChange={(e) => patch({ emoji: e.target.value })}
                  />
                </Field>
              </div>
              <BilingualText
                label="Name"
                value={data.name}
                onChange={(v) => patch({ name: v })}
              />
              <BilingualText
                label="Description"
                value={data.description}
                onChange={(v) => patch({ description: v })}
                textarea
              />
              <BilingualText
                label="Features"
                value={data.features}
                onChange={(v) => patch({ features: v })}
                textarea
              />
              <BilingualText
                label="Bloom season"
                value={data.bloom_season ?? { th: "", en: "" }}
                onChange={(v) => patch({ bloom_season: v })}
              />
              <BilingualText
                label="Size"
                value={data.size ?? { th: "", en: "" }}
                onChange={(v) => patch({ size: v })}
              />
              <BilingualText
                label="Variety-specific care tip"
                value={data.care_tip ?? { th: "", en: "" }}
                onChange={(v) => patch({ care_tip: v })}
                textarea
              />
              <BilingualText
                label="Origin"
                value={data.origin ?? { th: "", en: "" }}
                onChange={(v) => patch({ origin: v })}
              />
              <Field label="Origin link (optional — e.g. the nursery/shop's Facebook or LINE page)">
                <input
                  type="url"
                  className={fieldCls}
                  placeholder="https://facebook.com/..."
                  value={data.origin_url ?? ""}
                  onChange={(e) => patch({ origin_url: e.target.value || null })}
                />
              </Field>
              <ImageUploader
                label="Images"
                value={
                  (data.images && data.images.length
                    ? data.images
                    : data.image
                      ? [data.image]
                      : []) as string[]
                }
                onChange={(v) => patch({ images: v, image: v[0] ?? null })}
                folder={folder}
                multiple
              />
              <FormsEditor
                value={Array.isArray(data.forms) ? data.forms : []}
                onChange={(v) => patch({ forms: v })}
                folder={folder}
              />
              <TagPicker
                value={(data.tags ?? []) as string[]}
                onChange={(v) => patch({ tags: v })}
                options={tagOptions}
              />
              <Field label="Sort order">
                <NumberInput
                  className={fieldCls}
                  value={data.sort_order}
                  onChange={(n) => patch({ sort_order: n })}
                />
              </Field>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background pb-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full bg-muted text-foreground text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={busy}
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Save
        </button>
      </div>
    </div>
  );
};

export default EntityForm;
