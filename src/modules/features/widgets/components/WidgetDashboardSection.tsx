import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  glow?: 'gold' | 'blue';
  children: ReactNode;
  className?: string;
};

/** Konsekvent dashboard-sektion för Åtgärder-widget (Locked UX §13). */
export function WidgetDashboardSection({
  title,
  description,
  icon,
  glow = 'gold',
  children,
  className,
}: Props) {
  return (
    <section
      className={clsx('widget-dashboard-section', `widget-dashboard-section--${glow}`, className)}
      aria-label={title}
    >
      <header className="widget-dashboard-section__header">
        {icon ? <span className="widget-dashboard-section__icon">{icon}</span> : null}
        <div>
          <h2 className="widget-dashboard-section__title">{title}</h2>
          {description ? <p className="widget-dashboard-section__desc">{description}</p> : null}
        </div>
      </header>
      <div className="widget-dashboard-section__body">{children}</div>
    </section>
  );
}
