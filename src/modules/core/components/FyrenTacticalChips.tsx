import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { FyrenShortcutNoteIcon } from '../ui/widget-icons';

const CHIPS = [
  {
    id: 'brusfiltret',
    label: 'Brusfiltret',
    short: 'BIFF',
    to: '/widget/hamn',
    icon: 'filter' as const,
    side: 'left' as const,
  },
  {
    id: 'voice-vault',
    label: 'Voice-to-Vault',
    short: 'Röst',
    to: '/widget/voice-vault',
    icon: 'note' as const,
    side: 'right' as const,
  },
] as const;

function TacticalChip({ chip }: { chip: (typeof CHIPS)[number] }) {
  return (
    <Link
      to={chip.to}
      className={`fyren-dock-wing fyren-dock-wing--${chip.side}`}
      aria-label={chip.label}
      title={chip.label}
    >
      {chip.icon === 'filter' ? (
        <Filter className="fyren-dock-wing__glyph" strokeWidth={1.85} aria-hidden />
      ) : (
        <FyrenShortcutNoteIcon className="fyren-dock-wing__glyph fyren-dock-wing__glyph--note" />
      )}
      <span className="fyren-dock-wing__label">{chip.short}</span>
    </Link>
  );
}

/** BIFF + Röst — vingar på sidorna av Fyren-handtaget (samma rad, alltid synliga). */
export function FyrenDockWingRow({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (location.pathname.startsWith('/widget')) return <>{children}</>;

  const left = CHIPS.find((c) => c.side === 'left');
  const right = CHIPS.find((c) => c.side === 'right');

  return (
    <div className="fyren-dock-wing-row" aria-label="Snabbverktyg">
      {left ? <TacticalChip chip={left} /> : null}
      {children}
      {right ? <TacticalChip chip={right} /> : null}
    </div>
  );
}
