/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { upsertRecoveryProfile } from '@/features/dailyLife/drogfrihet/api/recoveryProfileService';
import { RECOVERY_TWELVE_STEP_PROMPTS } from '@/features/dailyLife/drogfrihet/content/recoveryTwelveStepCatalog';
import { Button, TextArea } from '@/design-system';

const DRAFT_PREFIX = 'livskompassen_recovery_step_draft_';

function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type Props = {
  userId: string | undefined;
};

/** Kat 8 — 12-steg WORM-journal (ett steg expanded, explicit save). */
export function RecoveryTwelveStepJournal({ userId }: Props) {
  const [expandedStep, setExpandedStep] = useState(1);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [savingStep, setSavingStep] = useState<number | null>(null);
  const [savedSteps, setSavedSteps] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loaded: Record<number, string> = {};
    for (const step of RECOVERY_TWELVE_STEP_PROMPTS) {
      const raw = sessionStorage.getItem(`${DRAFT_PREFIX}${step.stepNumber}`);
      if (raw) loaded[step.stepNumber] = raw;
    }
    setDrafts(loaded);
  }, []);

  const updateDraft = useCallback((stepNumber: number, value: string) => {
    const trimmed = value.slice(0, 5000);
    setDrafts((prev) => ({ ...prev, [stepNumber]: trimmed }));
    sessionStorage.setItem(`${DRAFT_PREFIX}${stepNumber}`, trimmed);
    setError(null);
  }, []);

  const handleSaveStep = async (stepNumber: number) => {
    if (!userId) return;
    const prompt = RECOVERY_TWELVE_STEP_PROMPTS.find((s) => s.stepNumber === stepNumber);
    const text = (drafts[stepNumber] ?? '').trim();
    if (!prompt || !text) {
      setError('Skriv minst en kort rad innan du sparar.');
      return;
    }

    setSavingStep(stepNumber);
    setError(null);
    try {
      const dayKey = localDateKey();
      await ensureVitHub(userId, 'recovery');
      await saveVitEntry(userId, {
        projectId: 'recovery',
        kind: 'card',
        bankId: prompt.bankId,
        content_class: 'REFLECTION',
        responseText: text,
        cardDateKey: dayKey,
        zone: 'recovery',
        inputMode: 'recovery_twelve_step',
      });
      await upsertRecoveryProfile(userId, {
        twelveStepProgress: { [String(stepNumber)]: dayKey },
      });
      sessionStorage.removeItem(`${DRAFT_PREFIX}${stepNumber}`);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[stepNumber];
        return next;
      });
      setSavedSteps((prev) => new Set(prev).add(stepNumber));
    } catch {
      setError('Kunde inte spara just nu.');
    } finally {
      setSavingStep(null);
    }
  };

  return (
    <section className="space-y-3" aria-label="12-steg journal">
      <p className="text-sm text-text-muted">
        Ett steg i taget. Sparat blir permanent — inget rätt eller fel svar.
      </p>
      {RECOVERY_TWELVE_STEP_PROMPTS.map((step) => {
        const isOpen = expandedStep === step.stepNumber;
        const isSaved = savedSteps.has(step.stepNumber);
        return (
          <div
            key={step.bankId}
            className="rounded-2xl border-[0.5px] border-border bg-surface-2/70 p-4"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setExpandedStep(step.stepNumber)}
            >
              <span>
                <span className="font-display-serif text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  Steg {step.stepNumber} · {step.title}
                </span>
                {!isOpen ? (
                  <span className="mt-1 block text-sm text-text-muted line-clamp-1">{step.prompt}</span>
                ) : null}
              </span>
              {isSaved ? (
                <span className="text-[10px] uppercase tracking-[0.14em] text-success">Sparat</span>
              ) : null}
            </button>
            {isOpen ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-accent">{step.prompt}</p>
                <TextArea
                  value={drafts[step.stepNumber] ?? ''}
                  onChange={(e) => updateDraft(step.stepNumber, e.target.value)}
                  rows={4}
                  maxLength={5000}
                  className="input-glass neu-inset w-full resize-none text-sm"
                  placeholder="Ditt svar…"
                />
                <div className="flex gap-2">
                  <Button type="button" disabled={!userId || savingStep === step.stepNumber} onClick={() => void handleSaveStep(step.stepNumber)} variant="secondary" className="--secondary inline-flex items-center gap-2 text-sm">
                    {savingStep === step.stepNumber ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : null}
                    Spara steg
                  </Button>
                  <Button type="button" variant="ghost" className="--ghost text-sm" onClick={() => setExpandedStep((s) => Math.min(12, s + 1)) }>
                    Nästa utan spar
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
      {error ? <p className="text-sm text-text-muted">{error}</p> : null}
      {!userId ? <p className="text-sm text-text-muted">Logga in för att spara steg.</p> : null}
    </section>
  );
}
