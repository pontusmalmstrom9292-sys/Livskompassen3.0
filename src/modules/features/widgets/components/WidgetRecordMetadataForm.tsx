import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Input, TextArea } from '@/design-system';
import type { WidgetRecordingMetadata } from '../api/widgetVaultRecording';
import { WidgetButton } from './WidgetButton';

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
    <div className="elongated-module elongated-module--gold overflow-hidden space-y-3 p-4 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.7)]">
      <p className="text-sm text-text-muted">
        Ljudet är sparat lokalt. Fyll i kontext om du vill — sedan låses posten i Valvet med datumstämpel.
      </p>
      <p className="font-display text-sm text-accent">{suggestedTitle}</p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-widest text-text-muted">Vem (valfritt)</span>
        <Input
          type="text"
          className="input-glass w-full text-sm min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          placeholder="t.ex. barn, ex, arbetsgivare"
          value={vem}
          onChange={(e) => setVem(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-widest text-text-muted">Vad</span>
        <Input
          type="text"
          className="input-glass w-full text-sm min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          placeholder="kort fakta om händelsen"
          value={vad}
          onChange={(e) => setVad(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-widest text-text-muted">Varför (valfritt)</span>
        <TextArea
          className="input-glass neu-inset w-full resize-none text-sm min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          rows={2}
          placeholder="varför du loggar detta"
          value={varfor}
          onChange={(e) => setVarfor(e.target.value)}
        />
      </label>

      <WidgetButton
        type="button"
        variant="accent"
        fullWidth
        className="flex items-center justify-center gap-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        disabled={busy || submitting}
        onClick={() => void run(() => onLock({ vem, vad, varfor }))}
      >
        <Lock className="h-4 w-4" />
        {busy || submitting ? 'Låser…' : 'Lås i Valvet'}
      </WidgetButton>

      <WidgetButton
        type="button"
        variant="ghost"
        fullWidth
        className="text-xs min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        disabled={busy || submitting}
        onClick={() => void run(onSkip)}
      >
        Hoppa över kontext — lås ändå
      </WidgetButton>
    </div>
  );
}
