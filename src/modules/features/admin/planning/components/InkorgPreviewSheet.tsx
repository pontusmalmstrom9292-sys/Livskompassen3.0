import { Link } from 'react-router-dom';
import { formatDisplayDate } from '@/shared/utils/dateHelpers';
import { Button, Sheet, SheetFooter } from '@/design-system';
import type { PasteClassification } from '../rules/pasteClassifier';
import './planering.css';

function formatPasteDueDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return formatDisplayDate(new Date(y, m - 1, d));
}

type Props = {
  open: boolean;
  classification: PasteClassification | null;
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const STATUS_LABELS = {
  todo: 'Att göra',
  waiting: 'Väntar',
  done: 'Klart',
} as const;

/** Notion/Trello-lik preview innan uppgift skapas. */
export function InkorgPreviewSheet({ open, classification, saving, onConfirm, onCancel }: Props) {
  if (!classification) return null;

  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title="Granska innan spar"
      description="Ett steg i taget — du bekräftar innan Handling uppdateras."
      placement="center"
    >
      {classification.routeToHamn && (
        <div className="planering-inkorg-preview-sheet__alert rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm text-text-muted">
          <p className="text-[10px] uppercase tracking-widest text-accent-secondary/80">Brusfilter</p>
          <p className="mt-1">
            {classification.matchedRuleLabel ?? 'Ex/konflikt'} — routing till Hamn, inte Handling.{' '}
            <Link to="/familjen?tab=hamn" className="text-accent underline">
              Öppna Trygg Hamn
            </Link>
          </p>
        </div>
      )}

      <dl className="planering-inkorg-preview-sheet__summary mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-text-dim">Titel</dt>
          <dd className="text-text">{classification.title}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-text-dim">Kolumn</dt>
          <dd className="text-accent">{STATUS_LABELS[classification.suggestedStatus]}</dd>
        </div>
        {classification.dueAt && (
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-text-dim">Datum</dt>
            <dd className="text-text-muted">{formatPasteDueDate(classification.dueAt)}</dd>
          </div>
        )}
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-text-dim">Routing</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={
                classification.routeToHamn
                  ? 'review-queue-status review-queue-status--review'
                  : 'review-queue-status review-queue-status--routed'
              }
            >
              → {classification.routeToHamn ? 'Hamn' : 'Handling'}
            </span>
            {classification.matchedRuleLabel ? (
              <span className="text-xs text-text-dim">{classification.matchedRuleLabel}</span>
            ) : null}
          </dd>
        </div>
      </dl>

      <SheetFooter className="flex-col sm:flex-row">
        <Button
          variant="accent"
          disabled={saving || classification.routeToHamn}
          onClick={onConfirm}
          className="flex-1"
        >
          {saving ? 'Sparar…' : 'Skapa uppgift'}
        </Button>
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Tillbaka
        </Button>
      </SheetFooter>
    </Sheet>
  );
}
