import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import type { LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import {
  getHomeSuperhubShortcutsForPreset,
  type HomeSuperhubShortcut,
} from './homeSuperhubRoutes';

type Props = {
  presetId: LifeHubPresetId;
};

function ShortcutCard({ item, onOpen }: { item: HomeSuperhubShortcut; onOpen: (to: string) => void }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen(item.to)}
      className={clsx(
        'home-superhub-shortcut calm-card glow-bottom-gold',
        'flex min-h-11 flex-col gap-2 rounded-2xl border border-border/30 bg-surface-2/70 p-3 text-left',
        'transition-colors hover:border-accent/40 hover:bg-surface-3/40',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50',
        'motion-reduce:transition-none',
      )}
    >
      <Icon className="h-4 w-4 text-accent/80" aria-hidden />
      <span className="font-display-serif text-[10px] uppercase tracking-[0.18em] text-text">
        {item.label}
      </span>
      <span className="text-[10px] leading-snug text-text-muted">{item.lead}</span>
    </button>
  );
}

/** Direktlänkar från Hem till Universal Input Hubs (Fas 12B). */
export function HomeSuperhubShortcuts({ presetId }: Props) {
  const navigate = useNavigate();
  const shortcuts = getHomeSuperhubShortcutsForPreset(presetId);

  if (shortcuts.length === 0) return null;

  return (
    <section className="home-superhub-shortcuts space-y-2" aria-label="Snabbinmatning">
      <p className="font-display-serif text-[10px] uppercase tracking-[0.2em] text-text-muted">
        Snabbinmatning
      </p>
      <div
        className={clsx(
          'grid gap-2',
          shortcuts.length === 1 ? 'grid-cols-1' : shortcuts.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
        )}
      >
        {shortcuts.map((item) => (
          <ShortcutCard key={item.id} item={item} onOpen={(to) => navigate(to)} />
        ))}
      </div>
    </section>
  );
}
