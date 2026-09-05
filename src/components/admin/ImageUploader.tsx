import { useRef, useState } from "react";
import { Loader2, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { uploadImage, deleteImage, getPublicUrl } from "@/lib/storage";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  folder: string;
  multiple?: boolean;
  label?: string;
}

const ImageUploader = ({ value, onChange, folder, multiple = true, label }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const f of Array.from(files)) {
        try {
          const path = await uploadImage(f, folder);
          uploaded.push(path);
        } catch (e: any) {
          toast.error(`${f.name}: ${e.message}`);
        }
      }
      if (uploaded.length > 0) {
        onChange(multiple ? [...value, ...uploaded] : [uploaded[0]]);
        toast.success(`Uploaded ${uploaded.length}`);
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (idx: number) => {
    const path = value[idx];
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    try { await deleteImage(path); } catch {}
  };

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-xs font-semibold text-muted-foreground">{label}</div>}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {value.map((path, idx) => (
          <div key={path + idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-border bg-muted group">
            <img src={getPublicUrl(path) ?? ""} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              {multiple && (
                <>
                  <button onClick={() => move(idx, -1)} className="p-1.5 rounded-full bg-white/90 text-foreground" type="button">
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button onClick={() => move(idx, 1)} className="p-1.5 rounded-full bg-white/90 text-foreground" type="button">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </>
              )}
              <button onClick={() => remove(idx)} className="p-1.5 rounded-full bg-destructive text-destructive-foreground" type="button">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 hover:bg-muted flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {busy ? "Uploading…" : "Add"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default ImageUploader;
