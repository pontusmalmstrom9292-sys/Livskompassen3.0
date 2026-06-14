import { clsx } from 'clsx';
import { ChevronRight, Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { KompisMark } from '@/features/lifeJournal/evidence/kompis/components/KompisMark';

export type OdForgeDrawerRow = {
  id: string;
  label: string;
  icon: ReactNode;
};

export type OdForgeDockItem = {
  id: string;
  label: string;
  icon: ReactNode;
};

type HeaderProps = {
  pageTitle: string;
  drawerOpen: boolean;
  onMenuClick: () => void;
};

export function OdForgeHeader({ pageTitle, drawerOpen, onMenuClick }: HeaderProps) {
  return (
    <header className="od-forge__header" aria-label={pageTitle}>
      <button
        type="button"
        className="od-forge__header-btn"
        aria-label="Öppna meny"
        aria-expanded={drawerOpen}
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <div className="od-forge__header-center">
        <h1 className="od-forge__header-title">{pageTitle}</h1>
        <div className="od-forge__header-ornament" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>

      <button type="button" className="od-forge__header-btn" aria-label="Kompis och Valv">
        <span className="od-forge__kompis flex items-center justify-center">
          <KompisMark className="h-[1.35rem] w-[1.35rem]" />
        </span>
      </button>
    </header>
  );
}

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  sections: { title: string; icon: ReactNode; rows: OdForgeDrawerRow[] }[];
  activeRowId: string;
  onRowSelect: (id: string) => void;
};

export function OdForgeDrawerOverlay({
  open,
  onClose,
  sections,
  activeRowId,
  onRowSelect,
}: DrawerProps) {
  return (
    <div
      className={clsx('od-forge__drawer-preview', open && 'od-forge__drawer-preview--open')}
      aria-hidden={!open}
    >
      <button type="button" className="od-forge__drawer-backdrop" aria-label="Stäng meny" onClick={onClose} />
      <nav className="od-forge__drawer-panel" aria-label="Sidomeny">
        <div className="od-forge__drawer-brand">
          <p className="od-forge__drawer-brand-title">Livskompassen</p>
          <p className="od-forge__drawer-brand-sub">Vardag · Hem först</p>
        </div>
        {sections.map((section) => (
          <div key={section.title} className="od-forge__drawer-section">
            <p className="od-forge__drawer-section-title">
              <span className="od-forge__section-icon" aria-hidden>
                {section.icon}
              </span>
              {section.title}
            </p>
            {section.rows.map((row) => (
              <button
                key={row.id}
                type="button"
                className={clsx(
                  'od-forge__drawer-row',
                  activeRowId === row.id && 'od-forge__drawer-row--active',
                )}
                onClick={() => {
                  onRowSelect(row.id);
                  onClose();
                }}
              >
                <span className="od-forge__drawer-row-icon">{row.icon}</span>
                <span className="od-forge__drawer-row-label">{row.label}</span>
                <ChevronRight className="od-forge__drawer-row-chevron" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        ))}
        <p className="od-forge__drawer-foot">
          Valv (Mönster, Orkester, Arkiv) — Fyren 3s eller efter PIN.
        </p>
      </nav>
    </div>
  );
}

type DockProps = {
  items: OdForgeDockItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onFyrenClick: () => void;
};

export function OdForgeDockChrome({ items, activeId, onSelect, onFyrenClick }: DockProps) {
  return (
    <div className="od-forge__chrome-bottom">
      <button type="button" className="od-forge__fyren" onClick={onFyrenClick}>
        Fyren
        <svg viewBox="0 0 12 8" aria-hidden width={10} height={7}>
          <path
            d="M1.5 6.5 6 2.5l4.5 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <nav className="od-forge__dock" aria-label="Primär navigering">
        <div className="od-forge__dock-grid">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={clsx('od-forge__dock-btn', isActive && 'od-forge__dock-btn--active')}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect(item.id)}
              >
                <span className="od-forge__dock-plate">{item.icon}</span>
                <span className="od-forge__dock-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
