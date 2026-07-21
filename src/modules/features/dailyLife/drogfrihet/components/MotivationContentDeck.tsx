/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { DF_QUOTE_BANK } from '../content/dfQuoteBank';
import { DF_QUESTION_BANK } from '../content/dfQuestionBank';

type Props = {
  dateKey: string;
};

function pickIndex(seed: string, len: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return len ? h % len : 0;
}

export function MotivationContentDeck({ dateKey }: Props) {
  const [qOffset, setQOffset] = useState(0);
  const quote = useMemo(() => {
    const i = pickIndex(`${dateKey}|quote`, DF_QUOTE_BANK.length);
    return DF_QUOTE_BANK[i]!;
  }, [dateKey]);
  const question = useMemo(() => {
    const i = pickIndex(`${dateKey}|q`, DF_QUESTION_BANK.length);
    return DF_QUESTION_BANK[(i + qOffset) % DF_QUESTION_BANK.length]!;
  }, [dateKey, qOffset]);

  return (
    <div className="space-y-3">
      <BentoCard title="Coping idag" icon={<Sparkles className="h-4 w-4" />} glow="green">
        <p className="text-base text-accent">{quote.text_sv}</p>
        <p className="mt-2 text-[10px] text-text-dim">{quote.id} · {quote.category}</p>
      </BentoCard>
      <BentoCard title="Reflektionsfråga" glow="green">
        <p className="text-sm text-text-muted">{question.text_sv}</p>
        <Button
          type="button"
          variant="ghost"
          className="mt-3 w-full min-h-[44px] text-sm"
          onClick={() => setQOffset((o) => o + 1)}
        >
          Nästa fråga
        </Button>
      </BentoCard>
    </div>
  );
}
