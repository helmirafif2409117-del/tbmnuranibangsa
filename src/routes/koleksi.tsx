import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookOpen, User, Tag, Library } from "lucide-react";

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
  const [active, setActive] = useState<Book | null>(null);

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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return books;
    return books.filter((b) =>
      [b.title, b.creator, b.publisher, b.series, b.identifier, ...(b.subject ?? [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [books, q]);

  return (
    <Section
      eyebrow="Katalog Pustaka"
      title="Koleksi Buku Kami 📚"
      subtitle="Telusuri ribuan judul cerita, ensiklopedia, dan karya penulis cilik. Cari berdasarkan judul, penulis, atau topik."
    >
      <div className="relative max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari judul, penulis, atau subjek…"
          className="w-full rounded-full border-2 border-input bg-card pl-14 pr-5 py-4 text-base font-medium shadow-soft focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Library className="h-4 w-4" />
        {loading ? "Memuat…" : `${filtered.length} dari ${books.length} koleksi`}
        <Link to="/admin" className="ml-auto text-primary font-semibold hover:underline">
          Admin →
        </Link>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setActive(b)}
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
          </button>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            Tidak ada buku yang cocok dengan pencarian "{q}".
          </div>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 backdrop-blur-sm p-4 animate-[fade-in-up_0.2s_ease-out]"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-card rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 shadow-soft border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">{active.title}</h3>
              <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <Meta icon={User} label="Creator" value={active.creator} />
              <Meta icon={User} label="Contributor" value={active.contributor} />
              <Meta icon={Tag} label="Subject" value={active.subject?.join("; ")} />
              <Meta label="Publisher" value={active.publisher} />
              <Meta label="Series" value={active.series} />
              <Meta label="Language" value={active.language} />
              <Meta label="Type" value={active.type} />
              <Meta label="Identifier" value={active.identifier} />
              <Meta label="Description" value={active.description} />
            </div>

            {active.marc_record && (
              <details className="mt-6">
                <summary className="text-sm font-bold cursor-pointer text-primary">MARC 21 Record</summary>
                <pre className="mt-3 p-4 bg-muted rounded-xl text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                  {active.marc_record}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}

function Meta({ icon: Icon, label, value }: { icon?: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
