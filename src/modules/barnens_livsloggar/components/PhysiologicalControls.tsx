import { SIGNAL_LABELS } from '../constants';
import type { PhysiologicalSignals, SignalScale } from '../types';

interface Props {
  signals: PhysiologicalSignals;
  onChange: (signals: PhysiologicalSignals) => void;
}

const scales: SignalScale[] = [1, 2, 3, 4, 5];

function SignalRow({
  label,
  value,
  onSelect,
  invertHint,
}: {
  label: string;
  value: SignalScale;
  onSelect: (v: SignalScale) => void;
  invertHint?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-text-dim">
        {label}
        {invertHint && <span className="ml-1 text-text-dim/70">({invertHint})</span>}
      </p>
      <div className="flex gap-1">
        {scales.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className={`flex-1 rounded-lg border py-2 text-xs tabular-nums ${
              value === s ? 'chip--active' : 'chip--idle'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PhysiologicalControls({ signals, onChange }: Props) {
  return (
    <div className="space-y-4">
      <SignalRow
        label={SIGNAL_LABELS.somn}
        value={signals.somn}
        onSelect={(somn) => onChange({ ...signals, somn })}
        invertHint="1=dålig, 5=god"
      />
      <SignalRow
        label={SIGNAL_LABELS.angest}
        value={signals.angest}
        onSelect={(angest) => onChange({ ...signals, angest })}
        invertHint="1=låg, 5=hög"
      />
      <SignalRow
        label={SIGNAL_LABELS.aptit}
        value={signals.aptit}
        onSelect={(aptit) => onChange({ ...signals, aptit })}
        invertHint="1=dålig, 5=god"
      />
    </div>
  );
}
