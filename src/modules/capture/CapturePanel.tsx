import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  formatInkastResultMessage,
  previewInboxClassification,
  submitInkastLite,
  tagsFromInkastClassification,
  VALV_SAMLA_GRANSKA_LINK,
} from '../inkast/api/inkastService';
import type { InboxClassification } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { InkastConfirmPanel } from '../inkast/components/InkastConfirmPanel';
import {
  manualChoiceToSubmitFields,
  routingToUiSilo,
  type InkastManualChoice,
  type InkastUiSilo,
} from '../inkast/constants/inkastSiloOptions';

type CapturePanelProps = {
  sourceModule?: string;
  compact?: boolean;
};

type Phase = 'compose' | 'analyzing' | 'confirm' | 'edit' | 'done';

export function CapturePanel({ sourceModule = 'hem_capture', compact = false }: CapturePanelProps) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('compose');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<InboxClassification | null>(null);
  const [manualSilo, setManualSilo] = useState<InkastUiSilo>('dagbok');
  const [manualTags, setManualTags] = useState<string[]>([]);
  const [manualComment, setManualComment] = useState('');
  const [manualChildAlias, setManualChildAlias] = useState('');

  const resetFlow = useCallback(() => {
    setPhase('compose');
    setPreview(null);
    setError(null);
    setMessage(null);
    setManualTags([]);
    setManualComment('');
    setManualChildAlias('');
  }, []);

  const handlePreview = useCallback(async () => {
    const trimmed = text.trim();
    if (trimmed.length < 12) {
      setError('Skriv minst några rader (minst 12 tecken).');
      return;
    }
    setPhase('analyzing');
    setError(null);
    setMessage(null);

    try {
      const classification = await previewInboxClassification({
        text: trimmed,
        fileName: 'capture.txt',
      });
      setPreview(classification);
      setManualSilo(routingToUiSilo(classification.routing));
      setManualTags(tagsFromInkastClassification(classification));
      setManualComment(classification.summary);
      setManualChildAlias(classification.childAlias ?? '');
      setPhase('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte analysera.');
      setPhase('compose');
    }
  }, [text]);

  const persistInkast = useCallback(
    async (manual?: InkastManualChoice) => {
      const trimmed = text.trim();
      if (trimmed.length < 12) {
        setError('Texten är för kort.');
        return;
      }
      setPhase('analyzing');
      setError(null);

      try {
        const batch = await submitInkastLite({
          text: trimmed,
          fileName: 'capture.txt',
          sourceModule,
          ...(manual ? manualChoiceToSubmitFields(manual) : {}),
        });
        setMessage(formatInkastResultMessage(batch));
        setText('');
        setPreview(null);
        setPhase('done');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kunde inte spara.');
        setPhase(manual ? 'edit' : 'confirm');
      }
    },
    [text, sourceModule],
  );

  const handleManualSave = useCallback(
    (choice: InkastManualChoice) => {
      void persistInkast(choice);
    },
    [persistInkast],
  );

  const previewLabel = text.trim().slice(0, 80) || 'Inkast';

  return (
    <BentoCard
      title={compact ? 'Skriv här' : 'Skriv — sorteras till rätt arkiv'}
      icon={<PenLine className="h-4 w-4" />}
    >
      <p className="mb-3 text-sm text-text-muted">
        Granska AI-förslag eller ändra silo manuellt innan det sparas.
      </p>

      {(phase === 'compose' || phase === 'done') && (
        <>
          <textarea
            className="input-glass min-h-[100px] w-full resize-y text-sm"
            placeholder="Observation, meddelande, minne…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={phase !== 'compose'}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn-pill--primary text-sm"
              disabled={text.trim().length < 12}
              onClick={() => void handlePreview()}
            >
              Förhandsgranska
            </button>
            {phase === 'done' && (
              <button type="button" className="btn-pill--ghost text-sm" onClick={resetFlow}>
                Nytt inkast
              </button>
            )}
          </div>
        </>
      )}

      {phase === 'analyzing' && (
        <p className="py-4 text-center text-sm text-accent">Sorterar…</p>
      )}

      {(phase === 'confirm' || phase === 'edit') && preview && (
        <InkastConfirmPanel
          mode={phase === 'edit' ? 'edit' : 'confirm'}
          classification={preview}
          previewLabel={previewLabel}
          busy={false}
          silo={manualSilo}
          tags={manualTags}
          comment={manualComment}
          childAlias={manualChildAlias}
          onConfirm={() => void persistInkast()}
          onStartEdit={() => setPhase('edit')}
          onAbort={resetFlow}
          onSiloChange={setManualSilo}
          onTagsChange={setManualTags}
          onCommentChange={setManualComment}
          onChildAliasChange={setManualChildAlias}
          onManualSave={handleManualSave}
          onCancelEdit={() => setPhase('confirm')}
          accentClass="text-accent"
          panelClass="bg-surface-3/50"
        />
      )}

      {message && (
        <p className="mt-3 text-sm text-emerald-300/90" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-rose-300/90" role="alert">
          {error}
        </p>
      )}
      {message?.includes('granskning') && (
        <Link
          to={VALV_SAMLA_GRANSKA_LINK}
          className="mt-2 inline-block text-xs text-gold underline-offset-2 hover:underline"
        >
          Öppna granskningskö i Arkiv
        </Link>
      )}
    </BentoCard>
  );
}
