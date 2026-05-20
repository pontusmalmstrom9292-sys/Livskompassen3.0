import { useState } from 'react';
import { SYNAPSE_INDIGO, mirrorFeeling } from '../constants/vivirSteps';

interface Props {
  feeling: string;
  onFeelingChange: (v: string) => void;
  onContinue: () => void;
}

export function ActCalibrationView({ feeling, onFeelingChange, onContinue }: Props) {
  const [mirrored, setMirrored] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest" style={{ color: SYNAPSE_INDIGO }}>
        ACT — Validera, aldrig fixa
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3" style={{ borderColor: `${SYNAPSE_INDIGO}66` }}>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Känsla nu</p>
          <textarea
            value={feeling}
            onChange={(e) => {
              onFeelingChange(e.target.value);
              setMirrored(false);
            }}
            placeholder="Vad känner du just nu?"
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm resize-none focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setMirrored(true)}
            disabled={!feeling.trim()}
            className="mt-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50"
            style={{ borderColor: `${SYNAPSE_INDIGO}66`, color: SYNAPSE_INDIGO }}
          >
            Spegla
          </button>
        </div>

        <div className="rounded-xl border border-emerald-500/30 p-3">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Spegling</p>
          {mirrored ? (
            <p className="text-sm text-slate-200 leading-relaxed">{mirrorFeeling(feeling)}</p>
          ) : (
            <p className="text-sm text-slate-500 italic">Skriv och tryck Spegla.</p>
          )}
        </div>
      </div>

      {mirrored && (
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-widest text-slate-300"
        >
          Fortsätt till VIVIR
        </button>
      )}
    </div>
  );
}
