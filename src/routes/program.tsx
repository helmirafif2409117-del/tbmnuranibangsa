import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { BookOpen, Palette, Mic, Sparkles, Music, Leaf } from "lucide-react";
import storytelling from "@/assets/storytelling.jpg";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Program & Kegiatan — TBM Nurani Bangsa" },
      { name: "description", content: "Aktivitas literasi, mendongeng, mewarnai, dan kelas kreatif untuk anak-anak di TBM Nurani Bangsa, Malang." },
      { property: "og:title", content: "Program TBM Nurani Bangsa" },
      { property: "og:description", content: "Aktivitas seru untuk anak-anak setiap minggunya." },
    ],
  }),
  component: ProgramPage,
});

const programs = [
  { icon: BookOpen, title: "Baca Bersama", day: "Senin – Sabtu", time: "15.00 – 17.30", desc: "Akses bebas ke ribuan koleksi buku anak.", tone: "bg-primary/10 text-primary" },
  { icon: Mic, title: "Mendongeng Sore", day: "Sabtu", time: "16.00 – 17.00", desc: "Mendengarkan dongeng seru dari kakak relawan.", tone: "bg-secondary/15 text-secondary" },
  { icon: Palette, title: "Kelas Mewarnai", day: "Minggu", time: "09.00 – 11.00", desc: "Mewarnai dan menggambar bersama teman.", tone: "bg-accent/50 text-foreground" },
  { icon: Sparkles, title: "Kreasi Kerajinan", day: "Jumat", time: "15.30 – 17.00", desc: "Membuat prakarya dari bahan daur ulang.", tone: "bg-primary/10 text-primary" },
  { icon: Music, title: "Lagu & Gerak", day: "Rabu", time: "16.00 – 17.00", desc: "Bernyanyi dan menari sambil belajar.", tone: "bg-secondary/15 text-secondary" },
  { icon: Leaf, title: "Belajar Alam", day: "Bulanan", time: "Akhir pekan", desc: "Berkebun mini & belajar tentang lingkungan.", tone: "bg-accent/50 text-foreground" },
];

function ProgramPage() {
  return (
    <>
      <Section
        eyebrow="Program & Jadwal"
        title="Setiap hari, ada keseruan baru ✨"
        subtitle="Jadwal kegiatan rutin kami sepanjang minggu. Semua program gratis dan terbuka untuk anak-anak."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p, i) => (
            <article
              key={p.title}
              className="group rounded-3xl bg-card border border-border/60 p-6 hover:-translate-y-1 hover:shadow-soft transition-all"
              style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.07}s both` }}
            >
              <div className={`grid place-items-center h-14 w-14 rounded-2xl ${p.tone} group-hover:rotate-[-6deg] transition-transform`}>
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-muted">{p.day}</span>
                <span className="px-2.5 py-1 rounded-full bg-muted">{p.time}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative order-2 lg:order-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Acara Spesial
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              Festival Literasi <span className="text-gradient-warm">Anak Malang</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Setiap tahun kami mengadakan festival yang menggabungkan pameran
              karya anak, panggung dongeng, lomba menggambar, dan bazar buku
              murah. Acara terbuka untuk seluruh keluarga di Malang.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "12+", l: "Acara/Tahun" },
                { v: "300+", l: "Pengunjung" },
                { v: "100%", l: "Gratis" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-card border border-border/60 p-4 text-center">
                  <div className="font-display text-2xl font-bold text-primary">{s.v}</div>
                  <div className="text-xs text-muted-foreground font-semibold">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 -z-10 blob bg-secondary/30 scale-105" aria-hidden />
            <img
              src={storytelling}
              alt="Anak-anak mengikuti kelas mendongeng"
              width={1280}
              height={960}
              loading="lazy"
              className="rounded-[2rem] shadow-soft border-4 border-card"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
