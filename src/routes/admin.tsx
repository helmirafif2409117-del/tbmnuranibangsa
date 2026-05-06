import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — TBM Nurani Bangsa" },
      { name: "description", content: "Kelola koleksi buku TBM Nurani Bangsa." },
    ],
  }),
  component: AdminPage,
});

type Book = { id: string; title: string; creator: string | null; identifier: string | null };

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
};

function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () =>
    supabase
      .from("books")
      .select("id,title,creator,identifier")
      .order("created_at", { ascending: false })
      .then(({ data }) => setBooks((data as Book[]) ?? []));

  useEffect(() => {
    load();
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Judul wajib diisi");
    setSaving(true);
    const subjects = form.subject.split(";").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("books").insert({
      title: form.title,
      creator: form.creator || null,
      contributor: form.contributor || null,
      subject: subjects,
      publisher: form.publisher || null,
      series: form.series || null,
      language: form.language || null,
      type: form.type || null,
      identifier: form.identifier || null,
      description: form.description || null,
      coverage: form.coverage || null,
      marc_record: form.marc_record || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Buku ditambahkan!");
    setForm(empty);
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
      title="Kelola Koleksi Buku"
      subtitle="Tambahkan buku baru sesuai standar Dublin Core / MARC 21."
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={submit} className="rounded-3xl bg-card border border-border/60 p-7 shadow-soft space-y-4">
          <h3 className="font-display text-xl font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Buku Baru
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title (DC/245)" required value={form.title} onChange={set("title")} />
            <Field label="Creator (DC/100)" value={form.creator} onChange={set("creator")} placeholder="Penulis (usia)" />
            <Field label="Contributor (700)" value={form.contributor} onChange={set("contributor")} />
            <Field label="Publisher (DC/260)" value={form.publisher} onChange={set("publisher")} />
            <Field label="Series (490/830)" value={form.series} onChange={set("series")} />
            <Field label="Identifier / Call No." value={form.identifier} onChange={set("identifier")} placeholder="899.2213 ABC" />
            <Field label="Language" value={form.language} onChange={set("language")} placeholder="ind" />
            <Field label="Type" value={form.type} onChange={set("type")} placeholder="Text" />
            <Field label="Coverage" value={form.coverage} onChange={set("coverage")} />
            <Field label="Subject (pisahkan ;)" value={form.subject} onChange={set("subject")} placeholder="Fiksi Anak; Misteri" />
          </div>

          <Area label="Description" value={form.description} onChange={set("description")} />
          <Area label="MARC 21 Record (raw)" value={form.marc_record} onChange={set("marc_record")} rows={6} mono />

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:translate-y-[-2px] transition-transform disabled:opacity-60"
          >
            {saving ? "Menyimpan…" : "Simpan Buku"}
          </button>
        </form>

        <aside className="rounded-3xl bg-card border border-border/60 p-6 shadow-soft h-fit">
          <h4 className="font-display font-bold text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> {books.length} Buku
          </h4>
          <Link to="/koleksi" className="text-xs text-primary font-semibold hover:underline">Lihat halaman publik →</Link>
          <ul className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
            {books.map((b) => (
              <li key={b.id} className="flex items-start gap-2 p-3 rounded-xl bg-muted/40 group">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{b.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{b.creator ?? "—"}</div>
                </div>
                <button
                  onClick={() => remove(b.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 p-1.5 rounded-lg"
                  aria-label="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
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
