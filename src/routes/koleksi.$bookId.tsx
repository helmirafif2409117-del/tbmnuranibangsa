import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, User, Tag, Globe, FileText, Hash, Building2, Layers, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/koleksi/$bookId")({
  head: ({ params }) => ({
    meta: [
      { title: `Detail Buku — TBM Nurani Bangsa` },
      { name: "description", content: `Detail buku dengan metadata Dublin Core dan MARC 21.` },
      { property: "og:title", content: `Detail Buku — TBM Nurani Bangsa` },
    ],
  }),
  component: BookDetailPage,
  notFoundComponent: () => (
    <Section title="Buku tidak ditemukan">
      <Link to="/koleksi" className="text-primary font-semibold hover:underline">← Kembali ke Koleksi</Link>
    </Section>
  ),
  errorComponent: ({ error }) => (
    <Section title="Terjadi kesalahan">
      <p className="text-muted-foreground">{error.message}</p>
      <Link to="/koleksi" className="text-primary font-semibold hover:underline">← Kembali ke Koleksi</Link>
    </Section>
  ),
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
  coverage: string | null;
  marc_record: string | null;
  cover_url: string | null;
};

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [neighbors, setNeighbors] = useState<{ prev: string | null; next: string | null; index: number; total: number }>({ prev: null, next: null, index: 0, total: 0 });

  useEffect(() => {
    let active = true;
    Promise.all([
      supabase.from("books").select("*").eq("id", bookId).maybeSingle(),
      supabase.from("books").select("id").order("created_at", { ascending: false }),
    ]).then(([detail, list]) => {
      if (!active) return;
      if (!detail.data) setNotFound(true);
      else setBook(detail.data as Book);
      const ids = (list.data as { id: string }[] | null) ?? [];
      const i = ids.findIndex((x) => x.id === bookId);
      setNeighbors({
        prev: i > 0 ? ids[i - 1].id : null,
        next: i >= 0 && i < ids.length - 1 ? ids[i + 1].id : null,
        index: i,
        total: ids.length,
      });
      setLoading(false);
    });
    return () => { active = false; };
  }, [bookId]);

  if (loading) {
    return (
      <Section title="Memuat…">
        <div className="h-32" />
      </Section>
    );
  }

  if (notFound || !book) {
    return (
      <Section title="Buku tidak ditemukan 📚">
        <p className="text-muted-foreground mb-4">Buku yang kamu cari tidak ada di koleksi kami.</p>
        <Link to="/koleksi" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Koleksi
        </Link>
      </Section>
    );
  }

  return (
    <Section eyebrow="Detail Koleksi" title={book.title}>
      <Link to="/koleksi" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Koleksi
      </Link>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-accent/30 to-secondary/20 shadow-soft border border-border/60">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-primary/40">
                <BookOpen className="h-24 w-24" />
              </div>
            )}
          </div>
          {book.subject && book.subject.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {book.subject.map((s) => (
                <span key={s} className="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {book.description && (
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Deskripsi</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{book.description}</p>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl font-bold mb-3">Metadata Dublin Core</h2>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              <Row icon={User} label="Creator" value={book.creator} />
              <Row icon={User} label="Contributor" value={book.contributor} />
              <Row icon={Tag} label="Subject" value={book.subject?.join("; ")} />
              <Row icon={Building2} label="Publisher" value={book.publisher} />
              <Row icon={Layers} label="Series" value={book.series} />
              <Row icon={Globe} label="Language" value={book.language} />
              <Row icon={FileText} label="Type" value={book.type} />
              <Row icon={Hash} label="Identifier" value={book.identifier} mono />
              <Row icon={MapPin} label="Coverage" value={book.coverage} />
            </div>
          </div>

          {book.marc_record && (
            <div>
              <h2 className="font-display text-xl font-bold mb-3">MARC 21 Record</h2>
              <pre className="p-4 bg-muted rounded-2xl text-xs overflow-x-auto whitespace-pre-wrap font-mono border border-border">
                {book.marc_record}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Row({ icon: Icon, label, value, mono }: { icon: any; label: string; value?: string | null; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className={`font-medium text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
