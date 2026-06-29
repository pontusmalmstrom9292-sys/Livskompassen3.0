import { useEffect, useState } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import { useStore } from '@/core/store';
import { MOOD_CATALOG } from '@/features/lifeJournal/diary/diary/constants/moods';
import { SavedStep } from '@/features/lifeJournal/diary/diary/components/SavedStep';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
import { useDiaryStore } from '@/features/lifeJournal/diary/diary/store/diaryStore';
import { DagbokBurnDelegate } from './DagbokBurnDelegate';
import {
  DAGBOK_TYST_BURN_LABEL,
  DAGBOK_TYST_DRAFT_BANNER,
  DAGBOK_TYST_LEAD,
  DAGBOK_TYST_MOOD_ONLY_LABEL,
  DAGBOK_TYST_SAVE_LABEL,
  DAGBOK_TYST_TRE_ORD_HINT,
} from '../dagbokTystCopy';
import '../dagbok-tyst-lage.css';

export type DagbokTystDelegateProps = {
  onSaved?: () => void;
  onSwitchToBurn?: () => void;
};

/**
 * Fas 23E — Dissociation / Tyst läge: en skärm, minsta val.
 * Humör + valfria tre ord → spara utan confirm/weave-UI. Bränn som ventil.
 */
export function DagbokTystDelegate({ onSaved, onSwitchToBurn }: DagbokTystDelegateProps) {
  const user = useStore((s) => s.user);
  const diaryDraft = useDiaryStore((s) => s.diaryDraft);
  const clearDiaryDraft = useDiaryStore((s) => s.clearDiaryDraft);

  const [localMood, setLocalMood] = useState('');
  const [treOrd, setTreOrd] = useState('');
  const [showBurn, setShowBurn] = useState(false);
  const [draftDismissed, setDraftDismissed] = useState(false);

  const {
    step,
    mood,
    text,
    saving,
    error,
    lastSavedEntryId,
    setMood,
    setText,
    handleTystSave,
    resetFlow,
  } = useJournalFlow({ userId: user?.uid });

  useEffect(() => {
    if (step === 'done') onSaved?.();
  }, [step, onSaved]);

  useEffect(() => {
    if (!draftDismissed && diaryDraft.trim() && !treOrd) {
      const words = diaryDraft.trim().split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
      setTreOrd(words);
    }
  }, [diaryDraft, draftDismissed, treOrd]);

  if (!user) {
    return (
      <p className="text-sm text-text-muted p-4 text-center">
        Logga in för att använda tyst läge.
      </p>
    );
  }

  if (showBurn) {
    return (
      <div className="dagbok-tyst-lage" data-write-target="none">
        <button
          type="button"
          className="mb-3 text-xs text-text-dim underline-offset-2 hover:underline"
          onClick={() => setShowBurn(false)}
        >
          ← Tillbaka till tyst läge
        </button>
        <DagbokBurnDelegate />
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="dagbok-tyst-lage" data-write-target="journal_worm">
        <SavedStep
          minimalDone
          onNewEntry={() => {
            resetFlow();
            setLocalMood('');
            setTreOrd('');
          }}
          journalContext={{ mood, text: text.trim() }}
          userId={user.uid}
          journalEntryId={lastSavedEntryId}
          showWeaverApproval={false}
        />
      </div>
    );
  }

  const activeMood = localMood || mood;

  const handleTreOrdChange = (value: string) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    setTreOrd(words.slice(0, 3).join(' '));
  };

  const handleSave = async () => {
    if (!activeMood) return;
    setMood(activeMood);
    setText(treOrd);
    await handleTystSave(activeMood, treOrd);
  };

  const handleMoodOnly = async () => {
    if (!activeMood) return;
    await handleTystSave(activeMood, '');
  };

  return (
    <div className="dagbok-tyst-lage" data-write-target="journal_worm" data-capacity="minimal">
      <p className="dagbok-tyst-lage__eyebrow">Tyst läge</p>
      <p className="dagbok-tyst-lage__lead">{DAGBOK_TYST_LEAD}</p>

      {!draftDismissed && diaryDraft.trim() ? (
        <div className="dagbok-tyst-lage__draft">
          <p>{DAGBOK_TYST_DRAFT_BANNER}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="ds-btn ds-btn--ghost text-xs"
              onClick={() => {
                const words = diaryDraft.trim().split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
                setTreOrd(words);
                setDraftDismissed(true);
              }}
            >
              Fortsätt utkast
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--ghost text-xs"
              onClick={() => {
                clearDiaryDraft();
                setDraftDismissed(true);
                setTreOrd('');
              }}
            >
              Rensa
            </button>
          </div>
        </div>
      ) : null}

      <div className="dagbok-tyst-lage__mood mt-4">
        <label className="text-xs text-text-dim" htmlFor="dagbok-tyst-mood">
          Hur känns det?
        </label>
        <select
          id="dagbok-tyst-mood"
          value={activeMood}
          onChange={(e) => setLocalMood(e.target.value)}
          aria-label="Välj känsla"
        >
          <option value="">Välj känsla…</option>
          {MOOD_CATALOG.map((m) => (
            <option key={m.id} value={m.label}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dagbok-tyst-lage__tre-ord">
        <p className="text-xs text-text-dim">{DAGBOK_TYST_TRE_ORD_HINT}</p>
        <input
          type="text"
          value={treOrd}
          onChange={(e) => handleTreOrdChange(e.target.value)}
          placeholder="t.ex. tom, trött, okej"
          maxLength={48}
          aria-label="Tre ord"
        />
        <p className="mt-1 text-[10px] text-text-dim">
          {treOrd.trim() ? treOrd.trim().split(/\s+/).filter(Boolean).length : 0}/3 ord
        </p>
      </div>

      <div className="dagbok-tyst-lage__actions">
        <button
          type="button"
          disabled={!activeMood || saving}
          onClick={() => void handleSave()}
          className="ds-btn ds-btn--accent w-full"
        >
          {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : DAGBOK_TYST_SAVE_LABEL}
        </button>
        <button
          type="button"
          disabled={!activeMood || saving}
          onClick={() => void handleMoodOnly()}
          className="ds-btn ds-btn--ghost w-full text-sm"
        >
          {DAGBOK_TYST_MOOD_ONLY_LABEL}
        </button>
        <button
          type="button"
          onClick={() => {
            if (onSwitchToBurn) {
              onSwitchToBurn();
              return;
            }
            setShowBurn(true);
          }}
          className="ds-btn ds-btn--ghost w-full flex items-center justify-center gap-2 text-sm text-text-muted"
        >
          <Flame className="h-4 w-4" aria-hidden />
          {DAGBOK_TYST_BURN_LABEL}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
