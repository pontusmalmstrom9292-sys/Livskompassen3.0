import { Link } from 'react-router-dom';
import { COMPLETE_COPY, HUB_COMPLETE_COPY, mabraDagbokBridgeUrl } from '../constants';
import type { MabraExerciseType, MabraSymptomHub } from '../types';
import { MabraCoachPanel } from './MabraCoachPanel';

type Props = {
  hub: MabraSymptomHub | null;
  exerciseType: MabraExerciseType;
  onDone: () => void;
};

export function MabraComplete({ hub, exerciseType, onDone }: Props) {
  const copy = hub ? HUB_COMPLETE_COPY[hub] : COMPLETE_COPY[exerciseType];
  const dagbokTo = hub ? mabraDagbokBridgeUrl(hub) : '/dagbok';

  return (
    <div className="space-y-4 text-center">
      <p className="text-lg text-success">{copy.title}</p>
      <p className="text-sm text-text-muted">{copy.subtitle}</p>
      {hub && <MabraCoachPanel hub={hub} exerciseType={exerciseType} />}
      <div className="flex flex-col gap-2 pt-2">
        <Link to={dagbokTo} className="btn-pill--ghost text-sm">
          {hub ? HUB_COMPLETE_COPY[hub].dagbokLabel : 'Spara insikt till Dagbok'}
        </Link>
        <Link to="/vardagen" className="btn-pill--ghost text-sm">
          Gå till kväll (Kompasser)
        </Link>
        <Link to="/vardagen?tab=dag" className="btn-pill--ghost text-sm">
          Fastnat? → Paralys (Kompasser)
        </Link>
        <button type="button" onClick={onDone} className="btn-pill--secondary mt-2">
          Klar
        </button>
      </div>
    </div>
  );
}
