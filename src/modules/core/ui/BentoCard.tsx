import type { ReactNode } from 'react';

type BentoCardProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function BentoCard({ title, description, icon, children, className = '' }: BentoCardProps) {
  return (
    <section className={`rounded-2xl border border-[#FDE68A]/20 bg-white/5 p-5 ${className}`}>
      {(title || icon) && (
        <header className="mb-3 flex items-center gap-2">
          {icon ? <span className="text-[#FDE68A]">{icon}</span> : null}
          {title ? <h3 className="text-[#FDE68A] text-sm font-semibold">{title}</h3> : null}
        </header>
      )}
      {description ? (
        <p className="mb-3 text-[10px] uppercase tracking-widest text-white/40">{description}</p>
      ) : null}
      {children}
    </section>
  );
}
