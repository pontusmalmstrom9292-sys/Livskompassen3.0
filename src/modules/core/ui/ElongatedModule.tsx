import type { LucideIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export type ElongatedModuleTone = 'gold' | 'emerald' | 'indigo' | 'lavender';

const toneClass: Record<ElongatedModuleTone, string> = {
  gold: 'elongated-module--gold',
  emerald: 'elongated-module--emerald',
  indigo: 'elongated-module--indigo',
  lavender: 'elongated-module--lavender',
};

type Props = {
  title: string;
  lead: string;
  icon: LucideIcon;
  /** K1/K2/K3 tid-på-dag-ikon (PNG/SVG src). Ersätter Lucide-ikonen om angiven. */
  timeIconSrc?: string;
  tone?: ElongatedModuleTone;
  expanded?: boolean;
  recommended?: boolean;
  onToggle: () => void;
  children?: ReactNode;
  id?: string;
};

/** Avlång modulrad — Hem/Hamn/MåBra. Se docs/design/KOMPASS-MODUL-SPEC.md */
export function ElongatedModule({
  title,
  lead,
  icon: Icon,
  timeIconSrc,
  tone = 'gold',
  expanded = false,
  recommended = false,
  onToggle,
  children,
  id,
}: Props) {
  return (
    <section
      className={clsx('elongated-module', toneClass[tone], expanded && 'elongated-module--expanded')}
    >
      <button
        type="button"
        id={id}
        aria-expanded={expanded}
        onClick={onToggle}
        className="elongated-module__trigger"
      >
        <span className="elongated-module__icon" aria-hidden>
          {timeIconSrc ? (
            <img
              src={timeIconSrc}
              alt=""
              aria-hidden
              className="elongated-module__time-icon"
              width={20}
              height={20}
            />
          ) : (
            <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.65} />
          )}
        </span>
        <span className="elongated-module__text">
          <span className="elongated-module__title-row">
            <span className="elongated-module__title">{title}</span>
            {recommended && (
              <span
                className="elongated-module__badge"
                title="Passar tid på dygnet"
                aria-label="aktiv nu"
              >
                {/* ● — diskret guldprick per K1-K3-spec (2026-05-23) */}
                <span className="elongated-module__badge-dot" aria-hidden>●</span>
              </span>
            )}
          </span>
          <span className="elongated-module__lead">{lead}</span>
        </span>
        <ChevronDown
          className={clsx('elongated-module__chevron', expanded && 'elongated-module__chevron--open')}
          aria-hidden
        />
      </button>
      {expanded && children ? (
        <div className="elongated-module__body" role="region" aria-labelledby={id}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
