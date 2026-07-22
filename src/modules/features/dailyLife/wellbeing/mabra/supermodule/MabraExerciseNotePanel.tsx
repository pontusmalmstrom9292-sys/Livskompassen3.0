import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MabraProjectId } from '../constants/mabraProjects';
import { MabraExplicitSavePanel } from './MabraExplicitSavePanel';
import { composeExerciseNoteText, type MabraExplicitSaveSource } from './mabraExplicitSave';
import {
  clearPendingExerciseNote,
  readPendingExerciseNote,
} from './mabraExerciseNoteStorage';

type Props = {
  userId: string | undefined;
  vitProjectId: MabraProjectId;
  onSwitchToDagbokBridge?: () => void;
};

const COPY = {
  emptyTitle: 'Inget utkast i arbetsminnet',
  emptyDetail:
    'Fri text från övningar (t.ex. omformulering) sparas tillfälligt i sessionen. Gör en övning först, eller öppna det här läget direkt efter "Klart".',
  reframingLink: 'Gå till omformuleringsövning',
  previewLabel: 'Utkast från övning',
  cleared: 'Utkast rensat från sessionen.',
} as const;

/** Post-exercise HITL — läser session RAM, erbjuder explicit Vit/dagbok-spar (Fas 6C). */
export function MabraExerciseNotePanel({
  userId,
  vitProjectId,
  onSwitchToDagbokBridge,
}: Props) {
  const [note, setNote] = useState(() => readPendingExerciseNote());
  const [clearedHint, setClearedHint] = useState(false);

  const composedText = useMemo(() => (note ? composeExerciseNoteText(note) : ''), [note]);

  const saveSource = useMemo((): MabraExplicitSaveSource | null => {
    if (!note || !composedText) return null;
    return {
      bankId: note.exerciseType === 'reframing' ? 'C-kbt-03' : 'MB-REF-03',
      promptText: `Övning: ${note.exerciseType}`,
      responseText: composedText,
    };
  }, [note, composedText]);

  const handlePersisted = () => {
    clearPendingExerciseNote();
    setNote(null);
    setClearedHint(true);
  };

  if (!note || !composedText) {
    return (
      <div className="rounded-xl border border-border bg-surface/40 px-4 py-5 text-sm text-text-muted">
        <p className="font-medium text-text">{COPY.emptyTitle}</p>
        <p className="mt-2 text-xs text-text-muted">{COPY.emptyDetail}</p>
        <Link
          to="/mabra/ovning/reframing"
          className="mt-4 inline-block text-xs text-accent underline-offset-2 hover:underline"
        >
          {COPY.reframingLink}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wider text-text-muted">{COPY.previewLabel}</p>
      <pre className="max-h-48 overflow-y-auto rounded-xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-text-muted whitespace-pre-wrap">
        {composedText}
      </pre>

      <MabraExplicitSavePanel
        source={saveSource}
        userId={userId}
        vitProjectId={vitProjectId}
        hubSymptom={note.hubSymptom ?? null}
        onVitSaved={handlePersisted}
        onDagbokBridged={handlePersisted}
        onSwitchToDagbokBridge={onSwitchToDagbokBridge}
      />

      {clearedHint ? <p className="text-xs text-success">{COPY.cleared}</p> : null}
    </div>
  );
}
