import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export type ExecutiveSettingsRow = {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
};

export type ExecutiveSettingsGroup = {
  id: string;
  title: string;
  rows: ExecutiveSettingsRow[];
};

type Props = {
  groups: ExecutiveSettingsGroup[];
  className?: string;
};

/** Grouped settings rows — executive skin, token-driven. */
export function ExecutiveSettingsList({ groups, className }: Props) {
  return (
    <div className={clsx('executive-settings space-y-4', className)}>
      {groups.map((group) => (
        <section key={group.id} className="executive-settings__group calm-card-midnight p-1">
          <p className="executive-settings__group-title px-4 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            {group.title}
          </p>
          <ul className="executive-settings__list">
            {group.rows.map((row) => {
              const Icon = row.icon;
              const inner = (
                <>
                  {Icon ? (
                    <span className="executive-settings__icon" aria-hidden>
                      <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    </span>
                  ) : null}
                  <span className="flex-1 text-sm text-text">{row.label}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-text-dim" strokeWidth={1.5} />
                </>
              );
              return (
                <li key={row.id}>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="executive-settings__row flex min-h-[44px] items-center gap-3 px-4 py-3"
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="executive-settings__row flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left"
                      onClick={row.onClick}
                    >
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
