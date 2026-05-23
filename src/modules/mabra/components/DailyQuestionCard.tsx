import { Brain, RefreshCw } from 'lucide-react';
import { useCallback, useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';
import {
  dailyQuestionIndex,
  MABRA_REFLECTION_QUESTIONS,
  pickAnotherQuestionIndex,
} from '../constants/reflectionQuestions';

export function DailyQuestionCard() {
  const poolSize = MABRA_REFLECTION_QUESTIONS.length;
  const [questionIndex, setQuestionIndex] = useState(() =>
    dailyQuestionIndex(new Date(), poolSize),
  );
  const [flipped, setFlipped] = useState(false);

  const question = useMemo(
    () => MABRA_REFLECTION_QUESTIONS[questionIndex],
    [questionIndex],
  );

  const handleRefresh = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setQuestionIndex((i) => pickAnotherQuestionIndex(i, poolSize));
      setFlipped(false);
    },
    [poolSize],
  );

  const handleFlip = () => {
    if (!flipped) setFlipped(true);
  };

  return (
    <section className="mabra-reflection-block" aria-labelledby="mabra-card-heading">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 id="mabra-card-heading" className="mabra-reflection-kicker mb-0">
          Dagens frågekort
        </h4>
        <button
          type="button"
          onClick={handleRefresh}
          className="mabra-card-refresh"
          aria-label="Ny fråga"
          title="Ny fråga"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <button
        type="button"
        onClick={handleFlip}
        className="mabra-flip-scene"
        aria-pressed={flipped}
        aria-label={flipped ? 'Fråga visas — tryck för att dölja' : 'Tryck för att vända kortet'}
      >
        <div className={flipped ? 'mabra-flip-inner mabra-flip-inner--flipped' : 'mabra-flip-inner'}>
          <div className="mabra-flip-face mabra-flip-face--back">
            <Brain className="h-10 w-10 text-accent/80" strokeWidth={1.25} aria-hidden />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Tryck för att vända
            </p>
          </div>
          <div className="mabra-flip-face mabra-flip-face--front">
            <p className="text-base leading-relaxed text-text">{question}</p>
          </div>
        </div>
      </button>
    </section>
  );
}
