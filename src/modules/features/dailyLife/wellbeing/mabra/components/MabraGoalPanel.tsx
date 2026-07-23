import { useState } from 'react';
import { CheckCircle2, Loader2, Pencil, Sparkles, Target, X } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useFlashTimeout } from '@/core/hooks/useFlashTimeout';
import { useGoalDetection } from '../hooks/useGoalDetection';
import { usePrimaryGoal } from '../hooks/usePrimaryGoal';
import { fetchGoalAssistCoach } from '../api/mabraCoachService';
import { shouldRedirectMabraCoachToSpeglar } from '../lib/mabraCoachGuard';
import { getMabraRsdErrorCopy } from '../lib/mabraRsdErrorCopy';
import type { GoalCandidate } from '../lib/goalDetection';

const COPY = {
  eyebrow: 'Målsättning',
  lead: 'Ett mål i taget — du bekräftar innan något sparas.',
  empty: 'Inget återkommande fokus ännu. Fortsätt använda Morgonkompassen — mönster syns efter några dagar.',
  capacity1: 'Låg kapacitet — max ett mikromål föreslås.',
  simplify: 'Planeringen är tung — förenkla formuleringen.',
  micro: 'Föreslå ett mikrosteg, inte ett stort mål.',
  loading: 'Läser signaler…',
  error: 'Kunde inte läsa målsignaler just nu.',
  activeGoal: 'Ditt aktiva mål',
  pick: 'Välj',
  adjust: 'Justera formulering',
  confirm: 'Bekräfta som mitt mål',
  confirming: 'Sparar…',
  confirmed: 'Mål sparat — synkas med Morgonkompassen.',
  clear: 'Ta bort aktivt mål',
  cancel: 'Avbryt',
  customPlaceholder: 'Skriv ditt mål med egna ord…',
  assist: 'Få förslag',
  assisting: 'Hämtar förslag…',
  assistError: 'Kunde inte hämta förslag just nu.',
  assistRedirect: 'Det här hör hemma i Speglar — inte målsättning.',
} as const;

export function MabraGoalPanel() {
  const { result, loading, error, refresh: refreshDetection } = useGoalDetection();
  const {
    primaryGoal,
    loading: goalLoading,
    saving,
    error: goalError,
    confirmGoal,
    clearGoal,
    refresh: refreshPrimaryGoal,
  } = usePrimaryGoal();

  const [selected, setSelected] = useState<GoalCandidate | null>(null);
  const [draftText, setDraftText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);
  const [assistLoading, setAssistLoading] = useState(false);
  const [assistError, setAssistError] = useState<string | null>(null);
  const flash = useFlashTimeout();

  const candidates = result?.candidates ?? [];
  const isLoading = loading || goalLoading;
  const panelError = error ?? goalError;

  const beginSelection = (candidate: GoalCandidate) => {
    setSelected(candidate);
    setDraftText(candidate.text);
    setIsEditing(false);
    setSaveNotice(false);
  };

  const beginCustomEdit = () => {
    setSelected(null);
    setDraftText(primaryGoal?.text ?? '');
    setIsEditing(true);
    setSaveNotice(false);
  };

  const cancelDraft = () => {
    setSelected(null);
    setDraftText('');
    setIsEditing(false);
  };

  const handleAssist = async () => {
    const seed = draftText.trim();
    if (seed && shouldRedirectMabraCoachToSpeglar(seed)) {
      setAssistError(COPY.assistRedirect);
      return;
    }
    setAssistLoading(true);
    setAssistError(null);
    try {
      const result = await fetchGoalAssistCoach(seed || undefined);
      if (result.redirectToSpeglar) {
        setAssistError(COPY.assistRedirect);
        return;
      }
      setDraftText(result.coach);
      setIsEditing(true);
      setSelected(null);
    } catch {
      setAssistError(getMabraRsdErrorCopy());
    } finally {
      setAssistLoading(false);
    }
  };

  const handleConfirm = async () => {
    const text = draftText.trim();
    if (!text) return;

    try {
      const saved = await confirmGoal({
        text,
        focusKey: selected?.focusKey,
        capacityLevel: result?.capacityLevel,
        suggestMicroStep: selected?.suggestMicroStep ?? result?.suggestMicroStep,
      });

      if (saved == null) return;

      setSelected(null);
      setDraftText('');
      setIsEditing(false);
      setSaveNotice(true);
      refreshDetection();
      refreshPrimaryGoal();
      flash.schedule(() => setSaveNotice(false), 3000);
    } catch {
      /* error already set in usePrimaryGoal */
    }
  };

  const handleClear = async () => {
    await clearGoal();
    cancelDraft();
    setSaveNotice(false);
    refreshDetection();
  };

  if (isLoading) {
    return (
      <BentoCard glow="gold" className="flex min-h-[8rem] items-center justify-center gap-2 p-6">
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
        <span className="text-sm text-text-muted">{COPY.loading}</span>
      </BentoCard>
    );
  }

  if (panelError && !result && !primaryGoal) {
    return (
      <BentoCard glow="gold" className="p-5">
        <p className="text-sm text-text-muted">{getMabraRsdErrorCopy()}</p>
      </BentoCard>
    );
  }

  const showDraft = selected !== null || isEditing;

  return (
    <BentoCard glow="gold" className="space-y-4 p-5">
      <div className="flex items-start gap-3">
        <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div className="space-y-1">
          <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
            {COPY.eyebrow}
          </p>
          <p className="text-sm text-text-muted">{COPY.lead}</p>
        </div>
      </div>

      {primaryGoal && !showDraft && (
        <div className="rounded-xl border border-accent/30 bg-surface-3/40 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-text-muted">{COPY.activeGoal}</p>
          <p className="mt-1 text-base text-text">{primaryGoal.text}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="ghost"
              className="text-xs text-text-muted min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={beginCustomEdit}
              disabled={saving}
            >
              <Pencil className="mr-1 inline h-3.5 w-3.5" />
              {COPY.adjust}
            </Button>
            <Button
              variant="ghost"
              className="text-xs text-text-muted min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => void handleClear()}
              disabled={saving}
            >
              {COPY.clear}
            </Button>
          </div>
        </div>
      )}

      {saveNotice && (
        <p className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          {COPY.confirmed}
        </p>
      )}

      {panelError && (
        <p className="text-xs text-text-muted">{panelError}</p>
      )}

      {result?.capacityLevel === 1 && (
        <p className="mabra-insight-card gs-hub-card__well rounded-xl px-3 py-2 text-xs text-text-muted">
          {COPY.capacity1}
        </p>
      )}

      {(result?.suggestSimplify || result?.suggestMicroStep) && (
        <div className="space-y-1 text-xs text-text-muted">
          {result.suggestSimplify && <p>{COPY.simplify}</p>}
          {result.suggestMicroStep && <p>{COPY.micro}</p>}
        </div>
      )}

      {showDraft ? (
        <div className="space-y-3 rounded-xl border border-border/30 bg-surface-2/60 p-4">
          <label className="block text-xs uppercase tracking-wider text-text-muted">
            {COPY.adjust}
          </label>
          <input
            type="text"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder={COPY.customPlaceholder}
            className="w-full rounded-xl border border-border/40 bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
            autoFocus
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              className="text-sm min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => void handleConfirm()}
              disabled={saving || !draftText.trim()}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />
                  {COPY.confirming}
                </>
              ) : (
                COPY.confirm
              )}
            </Button>
            <Button
              variant="ghost"
              className="text-sm text-text-muted min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => void handleAssist()}
              disabled={saving || assistLoading}
            >
              {assistLoading ? (
                <>
                  <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />
                  {COPY.assisting}
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 inline h-4 w-4" />
                  {COPY.assist}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              className="text-sm text-text-muted min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={cancelDraft}
              disabled={saving}
            >
              <X className="mr-1 inline h-4 w-4" />
              {COPY.cancel}
            </Button>
          </div>
          {assistError && <p className="text-xs text-text-muted">{assistError}</p>}
        </div>
      ) : (
        <>
          {candidates.length === 0 ? (
            <div className="space-y-3">
              <p className="rounded-xl border border-border/30 bg-surface-2/50 px-4 py-3 text-sm text-text-muted">
                {COPY.empty}
              </p>
              <Button variant="ghost" className="text-sm text-text-muted min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={beginCustomEdit}>
                {COPY.adjust}
              </Button>
              <Button
                variant="ghost"
                className="text-sm text-text-muted min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                onClick={() => void handleAssist()}
                disabled={assistLoading}
              >
                {assistLoading ? COPY.assisting : COPY.assist}
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {candidates.map((candidate) => (
                <li
                  key={candidate.focusKey}
                  className="rounded-xl border border-border/30 bg-surface-2/60 px-4 py-3"
                >
                  <p className="text-base text-text">{candidate.text}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Upprepning {candidate.count}× · {candidate.firstSeen} → {candidate.lastSeen}
                    {' · '}
                    Tillförlitlighet {Math.round(candidate.confidence * 100)}%
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-3 text-xs min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    onClick={() => beginSelection(candidate)}
                    disabled={saving}
                  >
                    {COPY.pick}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </BentoCard>
  );
}
