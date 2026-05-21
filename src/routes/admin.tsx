import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/site/Section";
import { CoverUploader } from "@/components/site/CoverUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, BookOpen, Pencil, LogOut, Lock, X, Download, Upload } from "lucide-react";
import { parseCsv, rowsToBooks, toCsv, toMarcCsv, downloadCsv } from "@/lib/book-csv";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — TBM Nurani Bangsa" },
      { name: "description", content: "Kelola koleksi buku TBM Nurani Bangsa." },
    ],
  }),
  component: AdminPage,
});

const AUTH_KEY = "tbm-admin-auth";

type Book = {
  id: string;
  title: string;
  creator: string | null;
  contributor: string | null;
  subject: string[] | null;
  publisher: string | null;
  series: string | null;
  language: string | null;
  type: string | null;
  identifier: string | null;
  description: string | null;
  coverage: string | null;
  marc_record: string | null;
  cover_url: string | null;
};

const empty = {
  title: "",
  creator: "",
  contributor: "",
  subject: "",
  publisher: "",
  series: "",
  language: "ind",
  type: "Text",
  identifier: "",
  description: "",
  coverage: "",
  marc_record: "",
  cover_url: null as string | null,
};

function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
    }
  }, []);

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === "admin" && p === "admin123") {
      sessionStorage.setItem(AUTH_KEY, "1");
      toast.success("Selamat datang, Admin!");
      onSuccess();
    } else {
      toast.error("Username atau password salah");
    }
  };

  return (
    <Section eyebrow="Area Terbatas" title="Login Admin 🔐" subtitle="Masuk untuk mengelola koleksi buku.">
      <form onSubmit={submit} className="max-w-sm rounded-3xl bg-card border border-border/60 p-7 shadow-soft space-y-4">
        <div className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground mx-auto">
          <Lock className="h-6 w-6" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</label>
          <input
            value={u}
            onChange={(e) => setU(e.target.value)}
            className="mt-1.5 w-full rounded-xl border-2 border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
          <input
            type="password"
            value={p}
            onChange={(e) => setP(e.target.value)}
            className="mt-1.5 w-full rounded-xl border-2 border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:translate-y-[-2px] transition-transform"
        >
          Masuk
        </button>
      </form>
    </Section>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [editor, setEditor] = useState<{ open: boolean; data: typeof empty; id: string | null }>({
    open: false,
    data: empty,
    id: null,
  });
  const [saving, setSaving] = useState(false);

  const load = () =>
    supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setBooks((data as Book[]) ?? []));

  useEffect(() => { load(); }, []);

  const openNew = () => setEditor({ open: true, data: empty, id: null });
  const openEdit = (b: Book) =>
    setEditor({
      open: true,
      id: b.id,
      data: {
        title: b.title,
        creator: b.creator ?? "",
        contributor: b.contributor ?? "",
        subject: (b.subject ?? []).join("; "),
        publisher: b.publisher ?? "",
        series: b.series ?? "",
        language: b.language ?? "ind",
        type: b.type ?? "Text",
        identifier: b.identifier ?? "",
        description: b.description ?? "",
        coverage: b.coverage ?? "",
        marc_record: b.marc_record ?? "",
        cover_url: b.cover_url,
      },
    });

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditor((s) => ({ ...s, data: { ...s.data, [k]: e.target.value } }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor.data.title.trim()) return toast.error("Judul wajib diisi");
    setSaving(true);
    const f = editor.data;
    const payload = {
      title: f.title,
      creator: f.creator || null,
      contributor: f.contributor || null,
      subject: f.subject.split(";").map((s) => s.trim()).filter(Boolean),
      publisher: f.publisher || null,
      series: f.series || null,
      language: f.language || null,
      type: f.type || null,
      identifier: f.identifier || null,
      description: f.description || null,
      coverage: f.coverage || null,
      marc_record: f.marc_record || null,
      cover_url: f.cover_url,
    };
    const res = editor.id
      ? await supabase.from("books").update(payload).eq("id", editor.id)
      : await supabase.from("books").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editor.id ? "Buku diperbarui" : "Buku ditambahkan");
    setEditor({ open: false, data: empty, id: null });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus buku ini?")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Dihapus");
    load();
  };

  return (
    <Section
      eyebrow="Dashboard Admin"
      title="Kelola Koleksi Buku 📚"
      subtitle="Tambah, ubah, dan hapus buku sesuai standar Dublin Core / MARC 21."
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-soft hover:translate-y-[-2px] transition-transform"
        >
          <Plus className="h-4 w-4" /> Tambah Buku
        </button>
        <ImportExport books={books} reload={load} />
        <Link to="/koleksi" className="text-sm font-semibold text-primary hover:underline">
          Lihat halaman publik →
        </Link>
        <button
          onClick={onLogout}
          className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {books.map((b) => (
          <div key={b.id} className="group rounded-3xl bg-card border border-border/60 overflow-hidden shadow-soft flex flex-col">
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              {b.cover_url ? (
                <img src={b.cover_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full grid place-items-center text-primary/40">
                  <BookOpen className="h-16 w-16" />
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-display font-bold leading-tight line-clamp-2">{b.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{b.creator ?? "—"}</p>
              <div className="mt-auto pt-3 flex gap-2">
                <button
                  onClick={() => openEdit(b)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 text-primary px-3 py-2 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => remove(b.id)}
                  className="inline-flex items-center justify-center rounded-xl bg-destructive/10 text-destructive px-3 py-2 text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  aria-label="Hapus"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editor.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 backdrop-blur-sm p-4 animate-[fade-in-up_0.2s_ease-out]">
          <form
            onSubmit={save}
            className="bg-card rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-7 shadow-soft border border-border space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display text-2xl font-bold">{editor.id ? "Edit Buku" : "Buku Baru"}</h3>
              <button
                type="button"
                onClick={() => setEditor({ open: false, data: empty, id: null })}
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CoverUploader
              value={editor.data.cover_url}
              onChange={(url) => setEditor((s) => ({ ...s, data: { ...s.data, cover_url: url } }))}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title (245)" required value={editor.data.title} onChange={set("title")} />
              <Field label="Creator (100)" value={editor.data.creator} onChange={set("creator")} placeholder="Penulis (usia)" />
              <Field label="Contributor (700)" value={editor.data.contributor} onChange={set("contributor")} />
              <Field label="Publisher (260)" value={editor.data.publisher} onChange={set("publisher")} />
              <Field label="Series (490/830)" value={editor.data.series} onChange={set("series")} />
              <Field label="Identifier / Call No." value={editor.data.identifier} onChange={set("identifier")} placeholder="899.2213 ABC" />
              <Field label="Language" value={editor.data.language} onChange={set("language")} placeholder="ind" />
              <Field label="Type" value={editor.data.type} onChange={set("type")} placeholder="Text" />
              <Field label="Coverage" value={editor.data.coverage} onChange={set("coverage")} />
              <Field label="Subject (pisah ;)" value={editor.data.subject} onChange={set("subject")} placeholder="Fiksi Anak; Misteri" />
            </div>

            <Area label="Description" value={editor.data.description} onChange={set("description")} />
            <Area label="MARC 21 Record (raw)" value={editor.data.marc_record} onChange={set("marc_record")} rows={6} mono />

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditor({ open: false, data: empty, id: null })}
                className="rounded-full px-5 py-2.5 text-sm font-bold hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:translate-y-[-2px] transition-transform disabled:opacity-60"
              >
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Section>
  );
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        {...p}
        className="mt-1.5 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function Area({
  label, mono, rows = 3, ...p
}: { label: string; mono?: boolean } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <textarea
        {...p}
        rows={rows}
        className={`mt-1.5 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary ${mono ? "font-mono text-xs" : ""}`}
      />
    </div>
  );
}

function ImportExport({ books, reload }: { books: Book[]; reload: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const mapBooks = () => books.map((b) => ({
    title: b.title,
    creator: b.creator, contributor: b.contributor,
    subject: b.subject ?? [], publisher: b.publisher, series: b.series,
    language: b.language, type: b.type, identifier: b.identifier,
    description: b.description, coverage: b.coverage,
    marc_record: b.marc_record, cover_url: b.cover_url,
  }));

  const onExportDC = () => {
    downloadCsv(`koleksi-dublincore-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(mapBooks()));
    toast.success(`${books.length} buku diekspor (Dublin Core)`);
  };

  const onExportMarc = () => {
    downloadCsv(`koleksi-marc21-${new Date().toISOString().slice(0, 10)}.csv`, toMarcCsv(mapBooks()));
    toast.success(`${books.length} buku diekspor (MARC 21)`);
  };


  const onImport = async (f: File | null) => {
    if (!f) return;
    setBusy(true);
    try {
      const text = await f.text();
      const rows = parseCsv(text);
      const { books: parsed, format } = rowsToBooks(rows);
      if (parsed.length === 0) {
        toast.error("Tidak ada baris valid (kolom 'title' wajib ada)");
        return;
      }
      const label = format === "marc" ? "MARC 21" : format === "dublin-core" ? "Dublin Core" : "Generik";
      const ok = confirm(`Terdeteksi format: ${label}\nAkan menambahkan ${parsed.length} buku. Lanjutkan?`);
      if (!ok) return;
      const { error } = await supabase.from("books").insert(parsed);
      if (error) throw error;
      toast.success(`${parsed.length} buku (${label}) berhasil diimpor`);
      reload();
    } catch (e: any) {
      toast.error(e.message ?? "Gagal mengimpor CSV");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => onImport(e.target.files?.[0] ?? null)}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-input px-4 py-2 text-xs font-bold hover:border-primary disabled:opacity-60"
        title="Auto-detect MARC 21 atau Dublin Core"
      >
        <Upload className="h-4 w-4" /> {busy ? "Mengimpor…" : "Import CSV"}
      </button>
      <button
        onClick={onExport}
        className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-input px-4 py-2 text-xs font-bold hover:border-primary"
      >
        <Download className="h-4 w-4" /> Export CSV
      </button>
    </>
  );
}
