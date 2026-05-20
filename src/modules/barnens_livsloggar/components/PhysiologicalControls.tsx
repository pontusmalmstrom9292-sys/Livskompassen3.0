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
      <p className="text-xs text-slate-400">
        {label}
        {invertHint && <span className="text-white/30 ml-1">({invertHint})</span>}
      </p>
      <div className="flex gap-1">
        {scales.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className={`flex-1 rounded-lg py-2 text-xs border ${
              value === s
                ? 'border-[#818CF8]/50 bg-[#818CF8]/15 text-[#818CF8]'
                : 'border-white/10 text-slate-500'
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
