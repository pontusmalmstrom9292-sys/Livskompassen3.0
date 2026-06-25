import { clsx } from 'clsx';

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className }: Props) {
  return (
    <header className={clsx('design-freeport__premium-section', className)}>
      <h3 className="design-freeport__premium-section-title">{title}</h3>
      {subtitle ? (
        <p className="design-freeport__hint mt-1">{subtitle}</p>
      ) : null}
    </header>
  );
}
