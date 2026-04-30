import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/tentang", label: "Tentang" },
  { to: "/program", label: "Program" },
  { to: "/galeri", label: "Galeri" },
  { to: "/kontak", label: "Kontak" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="Logo TBM Nurani Bangsa"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full ring-2 ring-accent/40 shadow-soft group-hover:rotate-[-6deg] transition-transform"
          />
          <span className="font-display font-bold text-base sm:text-lg leading-tight">
            TBM <span className="text-gradient-warm">Nurani Bangsa</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="px-3 py-2 rounded-full text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-accent/40 transition-colors"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/kontak"
            className="ml-2 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:translate-y-[-2px] transition-transform"
          >
            Kunjungi Kami
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-xl hover:bg-accent/40"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-accent/40"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
