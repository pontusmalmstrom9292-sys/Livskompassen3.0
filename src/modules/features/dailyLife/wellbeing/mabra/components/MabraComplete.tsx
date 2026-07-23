import { Link } from 'react-router-dom';
import { Button } from '@/design-system';
import {
  COMPLETE_COPY,
  COMPLETE_LANDING_STRIP,
  HUB_COMPLETE_COPY,
} from '../constants';
import { hasPendingExerciseNote } from '../supermodule/mabraExerciseNoteStorage';
import type { MabraExerciseType, MabraSymptomHub } from '../types';
import { MabraCoachPanel } from './MabraCoachPanel';

type Props = {
  hub: MabraSymptomHub | null;
  exerciseType: MabraExerciseType;
  onDone: () => void;
  onOpenReflectionCard: () => void;
};

export function MabraComplete({
  hub,
  exerciseType,
  onDone,
  onOpenReflectionCard,
}: Props) {
  const copy = hub ? HUB_COMPLETE_COPY[hub] : COMPLETE_COPY[exerciseType];
  const dagbokTo = '/mabra/input?inputMode=dagbok_bridge';
  const dagbokLabel = hub ? HUB_COMPLETE_COPY[hub].dagbokLabel : COMPLETE_LANDING_STRIP.dagbok;

  return (
    <div className="space-y-4 text-center">
      <p className="text-lg text-success">{copy.title}</p>
      <p className="text-sm text-text-muted">{copy.subtitle}</p>
      {hub && <MabraCoachPanel hub={hub} exerciseType={exerciseType} />}

      <div
        className="mabra-complete-strip"
        role="list"
        aria-label="Nästa steg"
      >
        <Link
          to={dagbokTo}
          className="mabra-complete-strip__chip min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          role="listitem"
        >
          {dagbokLabel}
        </Link>
        <button
          type="button"
          className="mabra-complete-strip__chip min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          role="listitem"
          onClick={onOpenReflectionCard}
        >
          {COMPLETE_LANDING_STRIP.reflection}
        </button>
        {hasPendingExerciseNote() ? (
          <Link
            to="/mabra/input?inputMode=exercise_note"
            className="mabra-complete-strip__chip min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            role="listitem"
          >
            Spara övningsutkast
          </Link>
        ) : null}
        <Link
          to="/vardagen"
          className="mabra-complete-strip__chip min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          role="listitem"
        >
          {COMPLETE_LANDING_STRIP.evening}
        </Link>
      </div>

      <Button variant="secondary" className="mt-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={onDone}>
        Klar
      </Button>
    </div>
  );
}
