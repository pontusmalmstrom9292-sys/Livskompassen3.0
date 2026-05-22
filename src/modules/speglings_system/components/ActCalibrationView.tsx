import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { mirrorFeeling } from '../constants/vivirSteps';
import { fetchSpeglingsMirror } from '../api/speglingsCoachService';

interface Props {
  feeling: string;
  journalMood?: string;
  onFeelingChange: (v: string) => void;
  onContinue: () => void;
}

export function ActCalibrationView({ feeling, journalMood, onFeelingChange, onContinue }: Props) {
  const [mirrored, setMirrored] = useState(false);
  const [mirrorText, setMirrorText] = useState('');
  const [usedAi, setUsedAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mirrorError, setMirrorError] = useState<string | null>(null);

  const handleMirror = async () => {
    if (!feeling.trim()) return;
    setLoading(true);
    setMirrorError(null);
    setMirrored(false);

    try {
      const aiMirror = await fetchSpeglingsMirror(feeling.trim(), journalMood || undefined);
      setMirrorText(aiMirror);
      setUsedAi(true);
    } catch {
      setMirrorText(mirrorFeeling(feeling));
      setUsedAi(false);
      setMirrorError('AI otillgänglig — deterministisk spegling används.');
    } finally {
      setMirrored(true);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest text-accent">ACT — Validera, aldrig fixa</p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="glass-card p-3">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">Känsla nu</p>
          <textarea
            value={feeling}
            onChange={(e) => {
              onFeelingChange(e.target.value);
              setMirrored(false);
              setMirrorText('');
            }}
            placeholder="Vad känner du just nu?"
            rows={4}
            className="input-glass rounded-lg p-3"
          />
          <button
            type="button"
            onClick={handleMirror}
            disabled={!feeling.trim() || loading}
            className="btn-pill--secondary mt-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Spegla
          </button>
        </div>

        <div className={`glass-card p-3 ${usedAi ? 'glass-card--ai border-accent-ai/30' : 'border-accent/20'}`}>
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-dim">
            Spegling
            {usedAi && <span className="text-accent-ai">AI</span>}
          </p>
          {mirrored ? (
            <p className="text-sm leading-relaxed text-text-muted">{mirrorText}</p>
          ) : (
            <p className="text-sm italic text-text-dim">Skriv och tryck Spegla.</p>
          )}
        </div>
      </div>

      {mirrorError && <p className="text-xs text-text-dim">{mirrorError}</p>}

      {mirrored && (
        <button type="button" onClick={onContinue} className="btn-pill--secondary">
          Fortsätt till VIVIR
        </button>
      )}
    </div>
  );
}
