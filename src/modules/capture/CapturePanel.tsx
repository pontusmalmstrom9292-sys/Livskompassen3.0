import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { VALV_SAMLA_GRANSKA_LINK } from '../inkast/api/inkastService';
import { submitCaptureDraft } from './submitCaptureDraft';

type CapturePanelProps = {
  sourceModule?: string;
  compact?: boolean;
};

export function CapturePanel({ sourceModule = 'hem_capture', compact = false }: CapturePanelProps) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (trimmed.length < 3) {
      setError('Skriv minst några ord.');
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const { message: resultMessage } = await submitCaptureDraft({
        text: trimmed,
        fileName: 'capture.txt',
        sourceModule,
      });
      setMessage(resultMessage);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte sortera.');
    } finally {
      setBusy(false);
    }
  }, [text, sourceModule]);

  return (
    <BentoCard
      title={compact ? 'Skriv här' : 'Skriv — sorteras till rätt arkiv'}
      icon={<PenLine className="h-4 w-4" />}
    >
      <p className="mb-3 text-sm text-text-muted">
        Text sparas lokalt medan den sorteras. Bevis, barnlogg eller granskning — automatiskt.
      </p>
      <textarea
        className="input-glass min-h-[100px] w-full resize-y text-sm"
        placeholder="Observation, meddelande, minne…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={busy}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn-pill--primary text-sm"
          disabled={busy || text.trim().length < 3}
          onClick={() => void handleSubmit()}
        >
          {busy ? 'Sorterar…' : 'Sortera till arkiv'}
        </button>
      </div>
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
