import { useState } from 'react';
import { Lock } from 'lucide-react';
import type { WidgetRecordingMetadata } from '../api/widgetVaultRecording';

type Props = {
  suggestedTitle: string;
  onLock: (metadata: WidgetRecordingMetadata) => void | Promise<void>;
  onSkip: () => void | Promise<void>;
  busy?: boolean;
};

export function WidgetRecordMetadataForm({
  suggestedTitle,
  onLock,
  onSkip,
  busy = false,
}: Props) {
  const [vem, setVem] = useState('');
  const [vad, setVad] = useState('');
  const [varfor, setVarfor] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const run = async (fn: () => void | Promise<void>) => {
    if (busy || submitting) return;
    setSubmitting(true);
    try {
      await fn();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="elongated-module elongated-module--gold space-y-3 p-4">
      <p className="text-sm text-text-muted">
        Ljudet är sparat lokalt. Fyll i kontext om du vill — sedan låses posten i Valvet med datumstämpel.
      </p>
      <p className="font-display text-sm text-accent">{suggestedTitle}</p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-widest text-text-dim">Vem (valfritt)</span>
        <input
          type="text"
          className="input-glass w-full text-sm"
          placeholder="t.ex. barn, ex, arbetsgivare"
          value={vem}
          onChange={(e) => setVem(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-widest text-text-dim">Vad</span>
        <input
          type="text"
          className="input-glass w-full text-sm"
          placeholder="kort fakta om händelsen"
          value={vad}
          onChange={(e) => setVad(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-widest text-text-dim">Varför (valfritt)</span>
        <textarea
          className="input-glass w-full text-sm"
          rows={2}
          placeholder="varför du loggar detta"
          value={varfor}
          onChange={(e) => setVarfor(e.target.value)}
        />
      </label>

      <button
        type="button"
        className="ds-btn ds-btn--accent flex w-full items-center justify-center gap-2"
        disabled={busy || submitting}
        onClick={() => void run(() => onLock({ vem, vad, varfor }))}
      >
        <Lock className="h-4 w-4" />
        {busy || submitting ? 'Låser…' : 'Lås i Valvet'}
      </button>

      <button
        type="button"
        className="ds-btn ds-btn--ghost w-full text-xs"
        disabled={busy || submitting}
        onClick={() => void run(onSkip)}
      >
        Hoppa över kontext — lås ändå
      </button>
    </div>
  );
}
