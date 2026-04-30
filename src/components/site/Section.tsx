import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-16 md:py-24 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <div className="max-w-2xl mb-10 md:mb-14">
          {eyebrow && (
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
