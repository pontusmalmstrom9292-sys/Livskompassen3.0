import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MABRA_REFLECTION_CARDS } from '../../content/mabraReflectionCards';
import { DROGFRIHET_CARDS } from '@/features/dailyLife/drogfrihet/content/drogfrihetCatalog';
import { MabraToolShell } from './MabraToolShell';
import {
  readReflectionDeckAnswers,
  writeReflectionDeckAnswers,
} from '../../supermodule/reflectionDeckStorage';

const ALL_REFLECTION_CARDS = [...MABRA_REFLECTION_CARDS, ...DROGFRIHET_CARDS];

type Props = { onBack: () => void; initialBankId?: string };

function indexForBankId(bankId: string): number {
  const idx = ALL_REFLECTION_CARDS.findIndex((c) => c.bankId === bankId);
  return idx >= 0 ? idx : 0;
}

export function MabraReflectionDeckTool({ onBack, initialBankId }: Props) {
  const cards = useMemo(() => ALL_REFLECTION_CARDS, []);
  const [index, setIndex] = useState(() =>
    initialBankId ? indexForBankId(initialBankId) : 0,
  );
  const [answers, setAnswers] = useState<Record<string, string>>(readReflectionDeckAnswers);
  const card = cards[index];
  const total = cards.length;
  const bankId = card?.bankId ?? '';
  const answer = answers[bankId] ?? '';

  const setAnswer = useCallback(
    (text: string) => {
      if (!bankId) return;
      setAnswers((prev) => {
        const next = { ...prev, [bankId]: text };
        writeReflectionDeckAnswers(next);
        return next;
      });
    },
    [bankId],
  );

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <MabraToolShell
      title="Frågekort"
      description={`${index + 1} / ${total} — bläddra i din egen takt`}
      onBack={onBack}
    >
      <p className="rounded-xl border border-border-strong bg-surface/40 px-4 py-5 text-base leading-relaxed text-text">
        {card?.text_sv}
      </p>
      <p className="mt-2 text-center text-[10px] uppercase tracking-wider text-text-dim">
        {card?.lens}
      </p>

      <label className="mt-4 block text-xs text-text-muted">
        Ditt svar (valfritt)
        <span className="ml-1 text-text-dim">— inget fel svar, ett ord räcker</span>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          className="input-glass mt-2 w-full text-sm"
          placeholder="Skriv här om du vill…"
          aria-label="Ditt svar på frågekortet"
        />
      </label>
      {answer.trim() ? (
        <p className="mt-1 text-xs text-success">Sparat lokalt på den här enheten.</p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={prev} className="ds-btn ds-btn--ghost flex-1 text-sm">
          <ChevronLeft className="mr-1 inline h-4 w-4" />
          Förra
        </button>
        <button type="button" onClick={next} className="ds-btn ds-btn--secondary flex-1 text-sm">
          Nästa
          <ChevronRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    </MabraToolShell>
  );
}
