import type { ReactNode } from 'react';

type Props = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
};

export function OdForgeSection({ title, icon, children }: Props) {
  return (
    <section className="od-forge__section">
      <header className="od-forge__section-head">
        <span className="od-forge__section-icon" aria-hidden>
          {icon}
        </span>
        <h3 className="od-forge__section-title">{title}</h3>
      </header>
      <div className="od-forge__section-body">{children}</div>
    </section>
  );
}
