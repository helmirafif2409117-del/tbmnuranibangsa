import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import hero from "@/assets/hero-reading.jpg";
import library from "@/assets/library-corner.jpg";
import storytelling from "@/assets/storytelling.jpg";

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "Galeri — TBM Nurani Bangsa" },
      { name: "description", content: "Momen-momen seru dan kebahagiaan anak-anak di TBM Nurani Bangsa, Malang." },
      { property: "og:title", content: "Galeri TBM Nurani Bangsa" },
      { property: "og:description", content: "Lihat keseruan anak-anak di TBM Nurani Bangsa." },
    ],
  }),
  component: GalleryPage,
});

const items = [
  { src: hero, alt: "Anak-anak membaca bersama", caption: "Membaca bersama di taman", tall: true },
  { src: library, alt: "Sudut baca yang nyaman", caption: "Sudut baca favorit", tall: false },
  { src: storytelling, alt: "Mendongeng sore", caption: "Mendongeng sore", tall: false },
  { src: library, alt: "Rak buku berwarna", caption: "Koleksi yang terus bertambah", tall: false },
  { src: storytelling, alt: "Aktivitas kreatif", caption: "Kelas kreatif", tall: true },
  { src: hero, alt: "Tawa anak-anak", caption: "Tawa yang menyatukan", tall: false },
];

function GalleryPage() {
  return (
    <Section
      eyebrow="Galeri"
      title="Senyum & semangat anak-anak kami"
      subtitle="Kumpulan momen yang membuat kami terus bersemangat menyalakan literasi setiap hari."
    >
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {items.map((it, i) => (
          <figure
            key={i}
            className="group break-inside-avoid relative overflow-hidden rounded-3xl border-4 border-card shadow-soft"
            style={{ animation: `pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s both` }}
          >
            <img
              src={it.src}
              alt={it.alt}
              loading="lazy"
              className={`w-full ${it.tall ? "aspect-[3/4]" : "aspect-[4/3]"} object-cover transition-transform duration-700 group-hover:scale-105`}
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/80 to-transparent text-primary-foreground text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
              {it.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
