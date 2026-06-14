import { PlaneringQuickListPanel } from '../../components/PlaneringQuickListPanel';

export type PlaneringQuickListDelegateProps = {
  /** Default inkop — samma som ?tab=inkop */
  listId?: string;
};

/**
 * Fas 9C — tunt omslag runt PlaneringQuickListPanel (localStorage).
 */
export function PlaneringQuickListDelegate({ listId = 'inkop' }: PlaneringQuickListDelegateProps) {
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
