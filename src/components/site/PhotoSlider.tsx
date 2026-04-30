import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import k1 from "@/assets/kegiatan-1.jpg";
import k2 from "@/assets/kegiatan-2.jpg";
import k3 from "@/assets/kegiatan-3.jpg";

const slides = [
  { src: k1, title: "Kunjungan & Apresiasi", desc: "Momen kebersamaan bersama tamu dan pengelola TBM." },
  { src: k2, title: "Anak-anak Belajar Bersama", desc: "Suasana hangat saat kegiatan literasi sore hari." },
  { src: k3, title: "Membaca di Teras", desc: "Mengenal koleksi buku baru bersama relawan." },
];

export function PhotoSlider() {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  const go = (d: number) => setI((p) => (p + d + n) % n);

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 blob bg-accent/50 scale-105" aria-hidden />
      <div className="relative overflow-hidden rounded-[2rem] border-4 border-card shadow-soft aspect-[4/5] sm:aspect-[4/3] bg-muted">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: idx === i ? 1 : 0 }}
            aria-hidden={idx !== i}
          >
            <img
              src={s.src}
              alt={s.title}
              className="w-full h-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent text-primary-foreground">
              <h3 className="font-display text-lg sm:text-xl font-bold">{s.title}</h3>
              <p className="text-xs sm:text-sm opacity-90 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => go(-1)}
          aria-label="Sebelumnya"
          className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-card/85 hover:bg-card text-foreground shadow-soft transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Berikutnya"
          className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-card/85 hover:bg-card text-foreground shadow-soft transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute top-3 right-3 flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-accent" : "w-2 bg-card/70"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
