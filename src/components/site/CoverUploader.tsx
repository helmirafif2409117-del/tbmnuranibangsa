import { useEffect, useRef, useState } from "react";
import { RotateCw, RotateCcw, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CoverUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value);
  const [rotation, setRotation] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setPreview(value), [value]);

  const onPick = (f: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error("Maks 5MB");
    setOriginalFile(f);
    setRotation(0);
    setPreview(URL.createObjectURL(f));
  };

  const rotate = (delta: number) => setRotation((r) => (r + delta + 360) % 360);

  const applyAndUpload = async () => {
    if (!originalFile) {
      toast.message("Pilih gambar dulu");
      return;
    }
    setBusy(true);
    try {
      const blob = await rotateImage(originalFile, rotation);
      const path = `${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage
        .from("book-covers")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("book-covers").getPublicUrl(path);
      onChange(data.publicUrl);
      setOriginalFile(null);
      setRotation(0);
      setPreview(data.publicUrl);
      toast.success("Cover diunggah");
    } catch (e: any) {
      toast.error(e.message ?? "Gagal upload");
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setOriginalFile(null);
    setRotation(0);
    setPreview(null);
    onChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Cover Buku
      </label>

      <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-start">
        <div className="relative aspect-[3/4] w-40 rounded-2xl bg-muted border-2 border-dashed border-border overflow-hidden grid place-items-center">
          {preview ? (
            <img
              src={preview}
              alt="Cover"
              className="w-full h-full object-cover transition-transform"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          ) : (
            <div className="text-xs text-muted-foreground text-center px-2">
              Belum ada cover
            </div>
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-card border-2 border-input px-3 py-2 text-xs font-bold hover:border-primary"
            >
              <Upload className="h-3.5 w-3.5" /> Pilih Gambar
            </button>
            {originalFile && (
              <>
                <button
                  type="button"
                  onClick={() => rotate(-90)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-card border-2 border-input px-3 py-2 text-xs font-bold hover:border-primary"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> -90°
                </button>
                <button
                  type="button"
                  onClick={() => rotate(90)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-card border-2 border-input px-3 py-2 text-xs font-bold hover:border-primary"
                >
                  <RotateCw className="h-3.5 w-3.5" /> +90°
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={applyAndUpload}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-xs font-bold disabled:opacity-60"
                >
                  {busy ? "Mengunggah…" : "Simpan Cover"}
                </button>
              </>
            )}
            {preview && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 rounded-xl text-destructive px-3 py-2 text-xs font-bold hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" /> Hapus
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            JPG/PNG, maks 5MB. Putar lalu klik <b>Simpan Cover</b>.
          </p>
        </div>
      </div>
    </div>
  );
}

async function rotateImage(file: File, deg: number): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = URL.createObjectURL(file);
  });
  const swap = deg % 180 !== 0;
  const w = swap ? img.height : img.width;
  const h = swap ? img.width : img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(w / 2, h / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), "image/jpeg", 0.9),
  );
}
