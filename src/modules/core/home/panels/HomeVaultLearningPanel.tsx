import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/design-system';
import { useStore } from '../../store';
import { getKampsparEntries } from '../../firebase/firestore';
import { callKnowledgeVault } from '@/features/lifeJournal/evidence/kompis/api/knowledgeVaultService';
import { ingestKampsparEntry } from '@/features/lifeJournal/evidence/kompis/api/kampsparService';
import {
  detectKnowledgeGap,
  extractQuestion,
  learningPrompt,
} from '../vaultLearningUtils';
import { RAGErrorBoundary } from '@/shared/ui/RAGErrorBoundary';

type Props = {
  mode: 'quiz' | 'gap';
  onSaved?: () => void;
};

export function HomeVaultLearningPanel({ mode, onSaved }: Props) {
  const user = useStore((s) => s.user);
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingQ, setLoadingQ] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestion = useCallback(async () => {
    if (!user) return;
    setLoadingQ(true);
    setError(null);
    setSaved(false);
    setAnswer('');

    try {
      if (mode === 'gap') {
        const entries = await getKampsparEntries(user.uid);
        const local = detectKnowledgeGap(entries);
        if (local) {
          setQuestion(local.question);
          setSubject(local.subject);
          setReason(local.reason);
          return;
        }
      }

      const result = await callKnowledgeVault(learningPrompt(mode));
      const q = extractQuestion(result.answer);
      setQuestion(q);
      setSubject(mode === 'gap' ? q.replace(/^Vem är\s/i, '').replace(/\?$/, '') : '');
      setReason(
        mode === 'gap'
          ? 'Valvet hittade ett gap i kunskapsbanken.'
          : 'Valvet vill lära sig mer om dig.',
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ett fel inträffade vid hämtning av fråga.';
      setError(message);
      if (mode === 'gap') {
        setQuestion('Vem är Elisabeth Franck?');
        setSubject('Elisabeth Franck');
        setReason('Exempel-lucka — fyll i relation så uppdateras Minne.');
      } else {
        setQuestion('Vad hjälper dig att landa efter en tung dag?');
        setSubject('');
        setReason('Standardfråga — valvet saknar svar här.');
      }
    } finally {
      setLoadingQ(false);
    }
  }, [mode, user]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const handleSave = async () => {
    if (!user || answer.trim().length < 2) return;
    setSaving(true);
    setError(null);
    try {
      const title =
        subject.trim().length > 0
          ? `Relation: ${subject.trim()}`
          : mode === 'quiz'
            ? `Profil: ${question.slice(0, 60)}`
            : `Lucka: ${question.slice(0, 60)}`;

      await ingestKampsparEntry({
        title,
        content: answer.trim(),
        category: subject ? 'relation' : 'profil',
        entryType: 'fakta',
        tags: [mode === 'gap' ? 'lucka' : 'quiz', 'profil', ...(subject ? [subject.toLowerCase()] : [])],
        source: mode === 'gap' ? 'vault_gap' : 'vault_quiz',
      });

      setSaved(true);
      onSaved?.();
    } catch {
      setError('Kunde inte uppdatera Kunskapsvalvet.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att spela med Kunskapsvalvet.</p>;
  }

  return (
    <RAGErrorBoundary fallbackTitle="Kunde inte hämta fråga från Kunskapsvalvet" glow="gold">
      <div className="home-module-panel">
        <div className="home-module-panel__question-box">
          <p className="text-[10px] uppercase tracking-widest text-text-muted">
            {mode === 'gap' ? 'Lucka i minnet' : 'Fråga från valvet'}
          </p>
          {loadingQ ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Hämtar fråga…
            </p>
          ) : (
            <p className="mt-2 font-display text-lg text-accent">{question}</p>
          )}
          {reason && !loadingQ && <p className="mt-2 text-xs text-text-muted">{reason}</p>}
        </div>

        {mode === 'gap' && subject && (
          <label className="mt-3 block text-xs text-text-muted">
            Person / begrepp
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-glass mt-1 w-full"
            />
          </label>
        )}

        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setSaved(false);
          }}
          rows={3}
          placeholder={
            mode === 'gap'
              ? 'T.ex. Min mamma och barnens farmor.'
              : 'Ditt svar — sparas i Minne med embedding.'
          }
          className="input-glass mt-3 w-full"
        />

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        {saved && (
          <p className="mt-2 flex items-center gap-2 text-sm text-success">
            <Check className="h-4 w-4" /> Minne uppdaterat — valvet lär sig.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="success"
            disabled={saving || answer.trim().length < 2}
            onClick={handleSave}
            className="inline-flex items-center gap-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Uppdatera valvet
          </Button>
          <Button
            variant="ghost"
            disabled={loadingQ}
            onClick={loadQuestion}
            className="inline-flex items-center gap-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <RefreshCw className="h-4 w-4" />
            Ny fråga
          </Button>
        </div>
      </div>
    </RAGErrorBoundary>
  );
}
