import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import type { ChildAlias, LivsloggCategory } from '../constants';
import {
  FRAGEKORT_CHIPS,
  FRAGEKORT_CHIP_LABELS,
  type QuestionPoolEntry,
} from '../constants/livsloggQuestionPool';
import {
  formatQuestionLogObservation,
  pickRandomQuestion,
} from '../utils/livsloggQuestion';

type Props = {
  childAlias: ChildAlias;
  onSave: (data: {
    observation: string;
    category: string;
    childrenImpact?: string;
  }) => Promise<string>;
};

export function LivsloggQuestionCard({ childAlias, onSave }: Props) {
  const [chipCategory, setChipCategory] = useState<LivsloggCategory>('lek');
  const [question, setQuestion] = useState<QuestionPoolEntry>(() =>
    pickRandomQuestion('lek'),
  );
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const rotateQuestion = useCallback((category: LivsloggCategory) => {
    setQuestion(pickRandomQuestion(category));
    setSaved(false);
  }, []);

  useEffect(() => {
    rotateQuestion(chipCategory);
    setAnswer('');
  }, [childAlias, chipCategory, rotateQuestion]);

  const handleNewQuestion = () => {
    if (answer.trim() && !window.confirm('Du har osparad text. Byt fråga ändå?')) {
      return;
    }
    setAnswer('');
    rotateQuestion(chipCategory);
  };

  const handleSave = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      await onSave({
        observation: formatQuestionLogObservation(question, answer),
        category: chipCategory,
      });
      setAnswer('');
      setSaved(true);
      rotateQuestion(chipCategory);
    } finally {
      setLoading(false);
    }
  };

  const possessive = childAlias === 'Arvid' ? 'Arvids' : 'Kaspers';

  return (
    <section
      className="livslogg-question-card rounded-2xl border border-border-strong bg-surface/40 p-4"
      aria-label="Slumpad fråga till livslogg"
    >
      <p className="text-[10px] uppercase tracking-widest text-accent-secondary">
        Modul · Barnens livsloggar
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {FRAGEKORT_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setChipCategory(chip)}
            className={`rounded-full border px-3 py-1 text-xs ${
              chipCategory === chip ? 'chip--active' : 'chip--idle'
            }`}
          >
            {FRAGEKORT_CHIP_LABELS[chip]}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-widest text-text-dim">
        {question.label}
      </p>
      <p className="mt-1 font-display text-base italic text-text-muted">{question.text}</p>
      <textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setSaved(false);
        }}
        placeholder="Logga ett roligt svar eller en lek ni gjorde idag…"
        rows={3}
        className="input-glass mt-3 w-full rounded-xl px-3 py-2"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !answer.trim()}
          className="btn-pill--accent inline-flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Spara till {possessive} logg
        </button>
        <button
          type="button"
          onClick={handleNewQuestion}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-dim hover:text-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Ny fråga
        </button>
      </div>
      {saved && (
        <p className="mt-2 text-xs text-success">Sparat i livsloggen — kan inte redigeras.</p>
      )}
    </section>
  );
}
