import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export type ExecutiveChecklistItem = {
  id: string;
  label: string;
  time?: string;
  done?: boolean;
};

type Props = {
  title?: string;
  items: ExecutiveChecklistItem[];
  onToggle?: (id: string) => void;
  onAdd?: () => void;
  className?: string;
};

/** Dagens steg checklist — mockup Hem card. */
export function ExecutiveChecklistCard({
  title = 'Dagens steg',
  items,
  onToggle,
  onAdd,
  className,
}: Props) {
  return (
    <section className={clsx('executive-checklist calm-card-midnight p-4', className)}>
      <p className="executive-checklist__title mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
        {title}
      </p>
      <ul className="executive-checklist__items space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="executive-checklist__row flex w-full min-h-[44px] items-center gap-3 text-left"
              onClick={() => onToggle?.(item.id)}
              disabled={!onToggle}
            >
              <span
                className={clsx(
                  'executive-checklist__check flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                  item.done
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-border/40 text-transparent',
                )}
                aria-hidden
              >
                {item.done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : null}
              </span>
              <span
                className={clsx(
                  'flex-1 text-sm',
                  item.done ? 'text-text-muted line-through' : 'text-text',
                )}
              >
                {item.label}
              </span>
              {item.time ? (
                <span className="text-[10px] tabular-nums text-text-dim">{item.time}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
      {onAdd ? (
        <button
          type="button"
          className="executive-checklist__add mt-3 w-full min-h-[44px] rounded-xl border border-dashed border-border/30 text-xs font-semibold uppercase tracking-wider text-accent"
          onClick={onAdd}
        >
          + Lägg till steg
        </button>
      ) : null}
    </section>
  );
}
