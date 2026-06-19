import type { ReactNode } from 'react';
import { Filter, X } from 'lucide-react';
import { clsx } from 'clsx';

export type BrusfiltretSupermoduleTab = 'klistra_in' | 'svar' | 'jade' | 'spara';

const TAB_LABELS: Record<BrusfiltretSupermoduleTab, string> = {
  klistra_in: 'Klistra in',
  svar: 'Svar',
  jade: 'JADE',
  spara: 'Spara',
};

type Props = {
  activeTab: BrusfiltretSupermoduleTab;
  onTabChange: (tab: BrusfiltretSupermoduleTab) => void;
  onClose?: () => void;
  footer?: ReactNode;
  children: ReactNode;
};

/** Variant B — indigo supermodul-skals med flikrad (Theme Lab + framtida prod). */
export function BrusfiltretSupermoduleShell({
  activeTab,
  onTabChange,
  onClose,
  footer,
  children,
}: Props) {
  return (
    <article className="bf-supermodule glow-bottom-blue calm-card">
      <header className="bf-supermodule__header">
        <div className="bf-supermodule__title-row">
          <Filter className="h-4 w-4 text-accent" aria-hidden />
          <h2 className="bf-supermodule__title">Brusfiltret</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            className="bf-supermodule__close"
            aria-label="Stäng"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </header>

      <div className="bf-supermodule__tabs" role="tablist" aria-label="Brusfiltret lägen">
        {(Object.keys(TAB_LABELS) as BrusfiltretSupermoduleTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={clsx(
              'bf-supermodule__tab',
              activeTab === tab && 'bf-supermodule__tab--active',
            )}
            onClick={() => onTabChange(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="bf-supermodule__body" role="tabpanel">
        {children}
      </div>

      {footer ? <div className="bf-supermodule__footer">{footer}</div> : null}
    </article>
  );
}
