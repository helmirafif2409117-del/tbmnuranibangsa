import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { Target, Eye, Heart } from "lucide-react";
import library from "@/assets/library-corner.jpg";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — TBM Nurani Bangsa" },
      { name: "description", content: "Mengenal sejarah, visi, dan misi Taman Baca Masyarakat Nurani Bangsa di Bunulrejo, Malang." },
      { property: "og:title", content: "Tentang TBM Nurani Bangsa" },
      { property: "og:description", content: "Visi & misi TBM Nurani Bangsa untuk anak-anak Malang." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Section
        eyebrow="Tentang Kami"
        title="Rumah literasi untuk anak Bunulrejo"
        subtitle="TBM Nurani Bangsa lahir dari kepedulian warga akan pentingnya literasi sejak dini. Kami percaya buku adalah jendela dunia, dan setiap anak berhak membukanya."
      >
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3 space-y-5 text-base md:text-lg leading-relaxed text-foreground/90 animate-[fade-in-up_0.6s_ease-out_both]">
            <p>
              Berlokasi di <strong>Jl. Hamid Rusdi No.91, Bunulrejo, Kec. Blimbing,
              Kota Malang</strong>, TBM Nurani Bangsa menjadi ruang berkumpul yang
              hangat bagi anak-anak untuk membaca, bermain, dan belajar bersama.
            </p>
            <p>
              Didirikan oleh sekelompok warga dan relawan muda, kami membuka
              perpustakaan ini secara gratis bagi siapa saja. Setiap sore, anak-anak
              datang membaca cerita, mengikuti kelas mendongeng, mewarnai, dan
              berbagai kegiatan kreatif lain.
            </p>
            <p>
              Lebih dari sekadar tempat baca, kami ingin menjadi <em>second home</em>
              {" "}— tempat di mana anak merasa diterima, tumbuh percaya diri, dan
              menemukan mimpi-mimpi mereka melalui buku.
            </p>
          </div>
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-0 -z-10 blob bg-accent/60 scale-105" aria-hidden />
            <img
              src={library}
              alt="Sudut baca TBM Nurani Bangsa"
              width={1280}
              height={960}
              loading="lazy"
              className="rounded-[2rem] shadow-soft border-4 border-card"
            />
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Eye, title: "Visi", desc: "Menjadi pusat literasi anak yang menginspirasi dan menumbuhkan generasi cerdas, kreatif, serta berakhlak mulia.", color: "bg-primary text-primary-foreground" },
            { icon: Target, title: "Misi", desc: "Menyediakan akses bacaan berkualitas, mengadakan kegiatan literasi & seni, serta memberdayakan komunitas melalui kerelawanan.", color: "bg-secondary text-secondary-foreground" },
            { icon: Heart, title: "Nilai", desc: "Cinta, kreativitas, kebersamaan, dan keingintahuan menjadi fondasi setiap kegiatan yang kami selenggarakan.", color: "bg-accent text-accent-foreground" },
          ].map((c, i) => (
            <div
              key={c.title}
              className="rounded-3xl bg-card border border-border/60 p-7 hover:-translate-y-1 transition-transform shadow-soft"
              style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className={`grid place-items-center h-14 w-14 rounded-2xl ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-bold">{c.title}</h3>
              <p className="mt-3 text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Perjalanan" title="Tonggak penting kami">
        <ol className="relative border-l-2 border-dashed border-primary/40 ml-3 space-y-8">
          {[
            { y: "2019", t: "Awal Mula", d: "Beberapa rak buku di teras rumah warga menjadi cikal bakal taman baca." },
            { y: "2021", t: "Resmi Berdiri", d: "TBM Nurani Bangsa diresmikan dengan dukungan warga Bunulrejo." },
            { y: "2023", t: "Kelas Kreatif", d: "Membuka kelas mendongeng, mewarnai, dan kerajinan tangan." },
            { y: "2025", t: "Komunitas Tumbuh", d: "Lebih dari 150 anak aktif dan 20 relawan bergabung." },
          ].map((m, i) => (
            <li key={m.y} className="ml-6 animate-[fade-in-up_0.6s_ease-out_both]" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="absolute -left-3 grid place-items-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {i + 1}
              </span>
              <div className="text-sm font-bold text-primary">{m.y}</div>
              <h4 className="text-xl font-bold mt-1">{m.t}</h4>
              <p className="text-muted-foreground mt-1">{m.d}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
