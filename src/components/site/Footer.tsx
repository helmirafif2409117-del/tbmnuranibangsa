import { Link } from "@tanstack/react-router";
import { BookOpen, Instagram, Facebook, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/60">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-10 w-10 rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-display font-bold text-lg">
              TBM <span className="text-gradient-warm">Nurani Bangsa</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            Taman Baca Masyarakat untuk menumbuhkan minat baca anak-anak dan
            membangun generasi yang cerdas, kreatif, dan berkarakter.
          </p>
          <p className="mt-4 text-sm flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            Jl. Hamid Rusdi No.91, Bunulrejo, Kec. Blimbing, Kota Malang, Jawa Timur
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-3">Jelajahi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/tentang" className="hover:text-primary">Tentang Kami</Link></li>
            <li><Link to="/program" className="hover:text-primary">Program</Link></li>
            <li><Link to="/galeri" className="hover:text-primary">Galeri</Link></li>
            <li><Link to="/kontak" className="hover:text-primary">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Terhubung</h4>
          <div className="flex gap-2">
            <a href="#" aria-label="Instagram" className="grid place-items-center h-10 w-10 rounded-xl bg-accent/60 hover:bg-accent transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="grid place-items-center h-10 w-10 rounded-xl bg-accent/60 hover:bg-accent transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="mailto:halo@tbmnuranibangsa.id" aria-label="Email" className="grid place-items-center h-10 w-10 rounded-xl bg-accent/60 hover:bg-accent transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TBM Nurani Bangsa. Dibuat dengan ❤️ untuk anak-anak Malang.
      </div>
    </footer>
  );
}
