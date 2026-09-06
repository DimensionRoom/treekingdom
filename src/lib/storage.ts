import { supabase } from "@/integrations/supabase-external/client";
import { STORAGE_BUCKET as BUCKET } from "@/integrations/supabase-external/config";

export const getPublicUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

const extOf = (name: string) => {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "bin";
};

const uuid = () =>
  (crypto as any).randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const MAX_DIM = 1600;
const QUALITY = 0.85;

// ย่อ/บีบอัดรูปฝั่ง client ก่อนอัปโหลด (คงคุณภาพให้มากที่สุด)
const compressImage = async (
  file: File,
): Promise<{ blob: Blob; ext: string; type: string }> => {
  const fallback = { blob: file, ext: extOf(file.name), type: file.type || "application/octet-stream" };
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return fallback;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY),
    );
    if (!blob) return fallback;
    // ถ้าบีบแล้วไม่เล็กลงและไม่ได้ย่อขนาด ให้ใช้ไฟล์เดิม
    if (blob.size >= file.size && scale === 1) return fallback;
    return { blob, ext: "webp", type: "image/webp" };
  } catch {
    return fallback;
  }
};

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  const { blob, ext, type } = await compressImage(file);
  const path = `${folder}/${uuid()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { upsert: false, contentType: type || undefined });
  if (error) throw new Error(error.message);
  return path;
};


export const deleteImage = async (path: string): Promise<void> => {
  if (!path || path.startsWith("http") || path.startsWith("/")) return;
  await supabase.storage.from(BUCKET).remove([path]);
};
