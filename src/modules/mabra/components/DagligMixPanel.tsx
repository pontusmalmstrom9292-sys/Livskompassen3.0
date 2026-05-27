import { Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BentoCard } from '../../core/ui/BentoCard';
import { pickDagligMix } from '../lib/pickDagligMix';

type Props = {
  uid?: string;
  onComplete: (payload: {
    cardBankId: string;
    playBankId: string;
    dateKey: string;
    elapsedSeconds: number;
  }) => void;
};

type MixStep = 'card' | 'play' | 'done';

const COPY = {
  eyebrow: 'Daglig mix',
  lead: 'Ett reflektionskort och ett kort mikrospel — samma mix hela dagen, inga poäng.',
  cardHint: 'Inget fel svar. Ett ord räcker om du vill skriva.',
  playHint: 'Valfritt — hoppa över går bra.',
  next: 'Fortsätt till mikrospel',
  skipPlay: 'Hoppa över mikrospel',
  finish: 'Klart för idag',
  doneTitle: 'Bra jobbat',
  doneLead: 'Du kan komma tillbaka imorgon — ingen missad dag räknas.',
} as const;

export function DagligMixPanel({ uid, onComplete }: Props) {
  const mix = useMemo(() => pickDagligMix({ uid }), [uid]);
  const [step, setStep] = useState<MixStep>('card');
  const [note, setNote] = useState('');
  const startedAt = useMemo(() => Date.now(), []);

  const finish = () => {
    onComplete({
      cardBankId: mix.card.bankId,
      playBankId: mix.play.bankId,
      dateKey: mix.dateKey,
      elapsedSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
    });
    setStep('done');
  };

  return (
    <BentoCard title={COPY.eyebrow} icon={<Sparkles className="h-4 w-4" />}>
      <p className="mb-3 text-sm text-text-muted">{COPY.lead}</p>

      {step === 'card' && (
        <div className="space-y-3">
          <div className="home-module-panel__question-box">
            <p className="text-base text-accent">{mix.card.text_sv}</p>
            <p className="mt-2 text-xs text-text-dim">{COPY.cardHint}</p>
          </div>
          <label className="block text-xs text-text-muted">
            Valfri rad (sparas inte i molnet)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-border-strong bg-surface/40 px-3 py-2 text-sm text-text"
              placeholder="Ett ord räcker…"
            />
          </label>
          <button type="button" onClick={() => setStep('play')} className="btn-pill--secondary w-full">
            {COPY.next}
          </button>
        </div>
      )}

      {step === 'play' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border-strong bg-surface/40 px-4 py-3">
            <p className="text-sm font-medium text-accent">{mix.play.title_sv}</p>
            <p className="mt-2 text-sm text-text-muted">{mix.play.rule_sv}</p>
            <p className="mt-2 text-xs text-text-dim">{COPY.playHint}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={finish} className="btn-pill--secondary">
              {COPY.finish}
            </button>
            <button type="button" onClick={finish} className="btn-pill--ghost text-sm">
              {COPY.skipPlay}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="space-y-2 text-center">
          <p className="text-base text-success">{COPY.doneTitle}</p>
          <p className="text-sm text-text-muted">{COPY.doneLead}</p>
        </div>
      )}
    </BentoCard>
  );
}
