import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MABRA_REFLECTION_CARDS } from '../../content/mabraReflectionCards';
import { MabraToolShell } from './MabraToolShell';

const STORAGE_KEY = 'livskompassen_mabra_reflection_answers_v1';

function readStoredAnswers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredAnswers(answers: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* quota */
  }
}

type Props = { onBack: () => void; initialBankId?: string };

function indexForBankId(bankId: string): number {
  const idx = MABRA_REFLECTION_CARDS.findIndex((c) => c.bankId === bankId);
  return idx >= 0 ? idx : 0;
}

export function MabraReflectionDeckTool({ onBack, initialBankId }: Props) {
  const [index, setIndex] = useState(() =>
    initialBankId ? indexForBankId(initialBankId) : 0,
  );
  const [answers, setAnswers] = useState<Record<string, string>>(readStoredAnswers);
  const card = MABRA_REFLECTION_CARDS[index];
  const total = MABRA_REFLECTION_CARDS.length;
  const bankId = card?.bankId ?? '';
  const answer = answers[bankId] ?? '';

  const setAnswer = useCallback(
    (text: string) => {
      if (!bankId) return;
      setAnswers((prev) => {
        const next = { ...prev, [bankId]: text };
        writeStoredAnswers(next);
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
        <button type="button" onClick={prev} className="btn-pill--ghost flex-1 text-sm">
          <ChevronLeft className="mr-1 inline h-4 w-4" />
          Förra
        </button>
        <button type="button" onClick={next} className="btn-pill--secondary flex-1 text-sm">
          Nästa
          <ChevronRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    </MabraToolShell>
  );
}
