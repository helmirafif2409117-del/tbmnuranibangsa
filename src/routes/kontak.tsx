import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { Section } from "@/components/site/Section";
import { MapPin, Clock, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";

const LeafletMap = lazy(() =>
  import("@/components/site/LeafletMap").then((m) => ({ default: m.LeafletMap })),
);

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — TBM Nurani Bangsa" },
      { name: "description", content: "Hubungi TBM Nurani Bangsa di Jl. Hamid Rusdi No.91, Bunulrejo, Blimbing, Kota Malang." },
      { property: "og:title", content: "Kontak TBM Nurani Bangsa" },
      { property: "og:description", content: "Alamat, jam buka, dan kontak TBM Nurani Bangsa." },
    ],
  }),
  component: ContactPage,
});

const ADDRESS = "Jl. Hamid Rusdi No.91, Bunulrejo, Kec. Blimbing, Kota Malang, Jawa Timur";

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Terima kasih! Pesan Anda sudah kami terima.");
    }, 800);
  };

  return (
    <Section
      eyebrow="Hubungi Kami"
      title="Mampir, sapa, dan baca bersama 👋"
      subtitle="Pintu kami selalu terbuka. Datang langsung atau kirim pesan — kami senang mendengar dari Anda."
    >
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-5 animate-[fade-in-up_0.6s_ease-out_both]">
          {[
            { icon: MapPin, title: "Alamat", value: ADDRESS, color: "bg-primary/10 text-primary" },
            { icon: Clock, title: "Jam Buka", value: "Senin – Sabtu · 15.00 – 17.30", color: "bg-secondary/15 text-secondary" },
            { icon: Phone, title: "Telepon", value: "+62 812-3456-7890", color: "bg-accent/50 text-foreground" },
            { icon: Mail, title: "Email", value: "tbmnuranibangsa21@gmail.com", color: "bg-primary/10 text-primary" },
            { icon: Mail, title: "Instagram", value: "@tbmnuranibangsa", color: "bg-secondary/15 text-secondary" },
          ].map((c) => (
            <div key={c.title} className="flex items-start gap-4 rounded-2xl bg-card border border-border/60 p-5">
              <div className={`grid place-items-center h-12 w-12 rounded-xl shrink-0 ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.title}</div>
                <div className="font-semibold mt-1">{c.value}</div>
              </div>
            </div>
          ))}

          <div className="rounded-3xl overflow-hidden border-4 border-card shadow-soft h-80 bg-muted">
            <Suspense fallback={<div className="w-full h-full grid place-items-center text-sm text-muted-foreground">Memuat peta…</div>}>
              <LeafletMap />
            </Suspense>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl bg-card border border-border/60 p-7 shadow-soft animate-[fade-in-up_0.6s_ease-out_0.1s_both]"
        >
          <h3 className="text-2xl font-bold">Kirim pesan</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Punya pertanyaan, ingin jadi relawan, atau berdonasi buku?
          </p>

          <div className="mt-6 grid gap-4">
            <Field label="Nama" name="name" placeholder="Nama lengkap" required />
            <Field label="Email" type="email" name="email" placeholder="email@contoh.com" required />
            <Field label="Subjek" name="subject" placeholder="Topik singkat" />
            <div>
              <label className="text-sm font-semibold">Pesan</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tuliskan pesan Anda..."
                className="mt-1.5 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:translate-y-[-2px] transition-transform disabled:opacity-60"
            >
              {sending ? "Mengirim..." : (<>Kirim Pesan <Send className="h-4 w-4" /></>)}
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full rounded-full border-2 border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
