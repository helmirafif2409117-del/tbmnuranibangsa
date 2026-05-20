import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookOpen, User, Tag, Library, X, Filter } from "lucide-react";

type FilterField = "all" | "title" | "creator" | "subject";

export const Route = createFileRoute("/koleksi")({
  head: () => ({
    meta: [
      { title: "Koleksi Buku — TBM Nurani Bangsa" },
      { name: "description", content: "Cari koleksi buku anak TBM Nurani Bangsa berdasarkan judul, penulis, atau subjek." },
      { property: "og:title", content: "Koleksi Buku TBM Nurani Bangsa" },
      { property: "og:description", content: "Pencarian katalog buku anak." },
    ],
  }),
  component: KoleksiPage,
});

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
  marc_record: string | null;
  cover_url: string | null;
};

function KoleksiPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [field, setField] = useState<FilterField>("all");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  

  useEffect(() => {
    supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBooks((data as Book[]) ?? []);
        setLoading(false);
      });
  }, []);

  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => (b.subject ?? []).forEach((s) => s && set.add(s)));
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return books.filter((b) => {
      if (subjectFilter && !(b.subject ?? []).includes(subjectFilter)) return false;
      if (!s) return true;
      const haystack: (string | null | undefined)[] =
        field === "title" ? [b.title]
        : field === "creator" ? [b.creator, b.contributor]
        : field === "subject" ? (b.subject ?? [])
        : [b.title, b.creator, b.contributor, b.publisher, b.series, b.identifier, b.description, ...(b.subject ?? [])];
      return haystack.filter(Boolean).some((v) => String(v).toLowerCase().includes(s));
    });
  }, [books, q, field, subjectFilter]);

  const fieldLabel: Record<FilterField, string> = {
    all: "Semua",
    title: "Judul",
    creator: "Penulis",
    subject: "Subjek",
  };

  return (
    <Section
      eyebrow="Katalog Pustaka"
      title="Koleksi Buku Kami 📚"
      subtitle="Telusuri ribuan judul cerita, ensiklopedia, dan karya penulis cilik. Cari berdasarkan judul, penulis, atau topik."
    >
      <div className="flex flex-col gap-3">
        <div className="relative max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Cari berdasarkan ${fieldLabel[field].toLowerCase()}…`}
            className="w-full rounded-full border-2 border-input bg-card pl-14 pr-12 py-4 text-base font-medium shadow-soft focus:outline-none focus:border-primary transition-colors"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Bersihkan"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Cari di
          </span>
          {(Object.keys(fieldLabel) as FilterField[]).map((f) => (
            <button
              key={f}
              onClick={() => setField(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                field === f
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {fieldLabel[f]}
            </button>
          ))}
        </div>

        {allSubjects.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Tag className="h-3.5 w-3.5" /> Topik
            </span>
            <button
              onClick={() => setSubjectFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                !subjectFilter
                  ? "bg-secondary text-secondary-foreground shadow-soft"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-secondary/40"
              }`}
            >
              Semua
            </button>
            {allSubjects.map((s) => (
              <button
                key={s}
                onClick={() => setSubjectFilter(subjectFilter === s ? null : s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  subjectFilter === s
                    ? "bg-secondary text-secondary-foreground shadow-soft"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-secondary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Library className="h-4 w-4" />
        {loading ? "Memuat…" : `${filtered.length} dari ${books.length} koleksi`}
        {(q || subjectFilter || field !== "all") && (
          <button
            onClick={() => { setQ(""); setSubjectFilter(null); setField("all"); }}
            className="ml-2 text-primary font-semibold hover:underline"
          >
            Reset filter
          </button>
        )}
        <Link to="/admin" className="ml-auto text-primary font-semibold hover:underline">
          Admin →
        </Link>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((b, i) => (
          <Link
            key={b.id}
            to="/koleksi/$bookId"
            params={{ bookId: b.id }}
            className="text-left group rounded-3xl bg-card border border-border/60 overflow-hidden hover:-translate-y-1 hover:shadow-soft transition-all flex flex-col"
            style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.04}s both` }}
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-accent/30 to-secondary/20 overflow-hidden">
              {b.cover_url ? (
                <img
                  src={b.cover_url}
                  alt={b.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-primary/40 group-hover:text-primary/60 transition-colors">
                  <BookOpen className="h-20 w-20" />
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-display text-lg font-bold leading-tight line-clamp-2">{b.title}</h3>
              {b.creator && (
                <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3 w-3" /> {b.creator}
                </p>
              )}
              {b.subject && b.subject.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {b.subject.slice(0, 2).map((s) => (
                    <span key={s} className="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {b.identifier && (
                <div className="mt-auto pt-3 text-[11px] font-mono text-muted-foreground">📕 {b.identifier}</div>
              )}
            </div>
          </Link>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            Tidak ada buku yang cocok dengan pencarian "{q}".
          </div>
        )}
      </div>

    </Section>
  );
}

