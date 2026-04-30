import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { PhotoSlider } from "@/components/site/PhotoSlider";
import { BookOpen, Sparkles, Heart, Users, ArrowRight, Star } from "lucide-react";
import mascot from "@/assets/book-mascot.png";
import library from "@/assets/library-corner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TBM Nurani Bangsa — Taman Baca Anak di Bunulrejo, Malang" },
      { name: "description", content: "Tempat seru anak-anak membaca, belajar, dan berkreasi di Bunulrejo, Blimbing, Kota Malang." },
      { property: "og:title", content: "TBM Nurani Bangsa" },
      { property: "og:description", content: "Taman Baca Masyarakat untuk anak-anak Malang." },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: BookOpen, title: "Ribuan Buku", desc: "Cerita anak, ensiklopedia, komik edukasi, dan banyak lagi.", color: "bg-primary/10 text-primary" },
  { icon: Sparkles, title: "Aktivitas Kreatif", desc: "Mendongeng, mewarnai, kerajinan tangan, dan kelas seru.", color: "bg-accent/40 text-foreground" },
  { icon: Heart, title: "Ramah Anak", desc: "Suasana hangat, aman, dan penuh kasih untuk tumbuh kembang.", color: "bg-secondary/15 text-secondary" },
  { icon: Users, title: "Komunitas Hangat", desc: "Relawan dan keluarga Bunulrejo yang saling mendukung.", color: "bg-primary/10 text-primary" },
];

const stats = [
  { v: "2.000+", l: "Koleksi Buku" },
  { v: "150+", l: "Anak Anggota" },
  { v: "20+", l: "Relawan" },
  { v: "5 thn", l: "Mengabdi" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 -right-24 h-80 w-80 rounded-full bg-accent/40 blob animate-[float_8s_ease-in-out_infinite]" aria-hidden />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-secondary/20 blob animate-[float_10s_ease-in-out_infinite]" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 pt-12 md:pt-20 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-[fade-in-up_0.7s_ease-out_both]">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Star className="h-3.5 w-3.5 fill-primary" /> Taman Baca Masyarakat
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Tempat <span className="text-gradient-warm">Bermain &amp; Membaca</span> Anak Malang
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              TBM Nurani Bangsa hadir di Bunulrejo, Blimbing — rumah kedua untuk
              anak-anak menumbuhkan rasa ingin tahu, imajinasi, dan cinta membaca.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/program"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:translate-y-[-2px] transition-transform"
              >
                Lihat Program <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tentang"
                className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/15 bg-card px-6 py-3 text-sm font-bold hover:border-primary hover:text-primary transition-colors"
              >
                Tentang Kami
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-4 gap-4 max-w-md">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary">{s.v}</div>
                  <div className="text-[11px] md:text-xs text-muted-foreground font-semibold">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-[pop-in_0.7s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <PhotoSlider />
            <img
              src={mascot}
              alt=""
              width={140}
              height={140}
              className="absolute -bottom-8 -left-6 w-24 md:w-32 animate-[wiggle_3s_ease-in-out_infinite] drop-shadow-xl pointer-events-none"
              aria-hidden
            />
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-border/60 bg-card/50 overflow-hidden">
          <div className="flex gap-12 py-4 animate-[marquee_28s_linear_infinite] whitespace-nowrap font-display text-2xl text-primary/70">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-12 items-center">
                <span>📚 Membaca itu Seru</span><span>✨</span>
                <span>🎨 Belajar &amp; Berkreasi</span><span>✨</span>
                <span>🌱 Tumbuh Bersama Buku</span><span>✨</span>
                <span>❤️ Untuk Anak-anak Malang</span><span>✨</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <Section
        eyebrow="Mengapa TBM Nurani Bangsa"
        title="Tempat yang dirancang untuk anak"
        subtitle="Kami percaya setiap anak berhak punya ruang aman untuk berimajinasi dan belajar dengan gembira."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-3xl bg-card border border-border/60 p-6 hover:-translate-y-1 hover:shadow-soft transition-all"
              style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.08}s both` }}
            >
              <div className={`grid place-items-center h-14 w-14 rounded-2xl ${f.color} group-hover:rotate-[-6deg] transition-transform`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SPLIT */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={library}
              alt="Sudut baca yang nyaman dengan rak buku warna-warni"
              width={1280}
              height={960}
              loading="lazy"
              className="rounded-[2rem] shadow-soft border-4 border-card"
            />
            <div className="absolute -top-6 -right-6 hidden md:block bg-card rounded-2xl shadow-soft p-4 border border-border/60">
              <div className="text-xs font-semibold text-muted-foreground">Buka Setiap Hari</div>
              <div className="font-display text-lg font-bold">15.00 — 17.30</div>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              Misi Kami
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              Menumbuhkan generasi <span className="text-gradient-warm">cinta membaca</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Berlokasi di Jl. Hamid Rusdi No.91, Bunulrejo, kami menyediakan
              ruang baca gratis, kegiatan literasi, dan kelas-kelas kreatif yang
              dipandu oleh relawan penuh semangat.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Akses ribuan buku gratis untuk semua anak",
                "Mendongeng setiap akhir pekan",
                "Kelas mewarnai, menggambar, dan kerajinan",
                "Lingkungan aman dan ramah bagi orang tua",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 grid place-items-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">✓</span>
                  <span className="text-sm md:text-base">{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/tentang"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground shadow-soft hover:translate-y-[-2px] transition-transform"
            >
              Cerita Lengkap Kami <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="!pt-0">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-terracotta to-sun p-10 md:p-16 text-primary-foreground">
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white/15 blob" aria-hidden />
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-white/10 blob" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Mari berkunjung &amp; bergabung bersama kami!
            </h2>
            <p className="mt-4 text-primary-foreground/90">
              Pintu kami selalu terbuka untuk anak-anak, orang tua, dan
              relawan. Datang, baca, dan berkreasi bersama.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/kontak" className="inline-flex items-center gap-2 rounded-full bg-card text-foreground px-6 py-3 text-sm font-bold shadow-soft hover:translate-y-[-2px] transition-transform">
                Hubungi Kami
              </Link>
              <Link to="/program" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold hover:bg-white/10 transition-colors">
                Lihat Jadwal
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
