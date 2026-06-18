import { PlaneringQuickListPanel } from '../../components/PlaneringQuickListPanel';
import { PlaneringNotePinPanel } from '../../components/PlaneringNotePinPanel';

export type PlaneringQuickListDelegateProps = {
  /** Default inkop — samma som ?tab=inkop */
  listId?: string;
  mode?: 'list' | 'note';
};

/**
 * Fas 9C — lista eller anteckning + fäst modul (localStorage).
 */
export function PlaneringQuickListDelegate({
  listId = 'inkop',
  mode = 'list',
}: PlaneringQuickListDelegateProps) {
  if (mode === 'note') {
    return (
      <div className="space-y-3">
        <header className="space-y-1">
          <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
            Anteckning att fästa
          </p>
        </header>
        <PlaneringNotePinPanel />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Inköpslista
        </p>
        <p className="text-xs text-text-dim">
          Lokal lista på enheten — sparas inte i molnet förrän du väljer &quot;Spara som projekt&quot;.
        </p>
      </header>

      <PlaneringQuickListPanel listId={listId} />
    </div>
  );
}
