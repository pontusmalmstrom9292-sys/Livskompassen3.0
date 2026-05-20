import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { getVaultLogs } from '../../core/firebase/firestore';
import { hasVaultGate } from '../../core/auth/sessionService';
import { VIVIR_STEPS, SYNAPSE_INDIGO } from '../constants/vivirSteps';
import { matchVaultEvidence } from '../utils/matchVaultEvidence';
import { ActCalibrationView } from './ActCalibrationView';
import { VivirStepView } from './VivirStepView';
import { EvidenceCompareView } from './EvidenceCompareView';

type Phase = 'act' | 'vivir' | 'compare';

export function SpeglingsSystem() {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const [phase, setPhase] = useState<Phase>('act');
  const [feeling, setFeeling] = useState('');
  const [vivirAnswers, setVivirAnswers] = useState<Record<string, string>>({});

  const vivirSummary = VIVIR_STEPS.map(
    (s) => `${s.title}: ${vivirAnswers[s.key] ?? '—'}`
  ).join('\n');

  const vaultLocked = !isVaultUnlocked && !hasVaultGate();
  const [matches, setMatches] = useState<ReturnType<typeof matchVaultEvidence>>([]);

  useEffect(() => {
    if (phase !== 'compare' || !user || vaultLocked) return;
    getVaultLogs(user.uid)
      .then((logs) => {
        const searchText = `${feeling} ${Object.values(vivirAnswers).join(' ')}`;
        setMatches(matchVaultEvidence(searchText, logs));
      })
      .catch(() => setMatches([]));
  }, [phase, user, vaultLocked, feeling, vivirAnswers]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 p-1">
      <BentoCard title="Speglings-Systemet" icon={<Brain className="h-4 w-4" style={{ color: SYNAPSE_INDIGO }} />}>
        <p className="text-sm text-slate-300 mb-4">
          Kognitiv sköld — separera känsla från fakta. Validera, aldrig fixa.
        </p>

        {phase === 'act' && (
          <ActCalibrationView
            feeling={feeling}
            onFeelingChange={setFeeling}
            onContinue={() => setPhase('vivir')}
          />
        )}

        {phase === 'vivir' && (
          <VivirStepView
            answers={vivirAnswers}
            onChange={setVivirAnswers}
            onComplete={() => setPhase('compare')}
          />
        )}

        {phase === 'compare' && (
          <>
            <EvidenceCompareView
              feeling={feeling}
              vivirSummary={vivirSummary}
              matches={matches}
              vaultLocked={vaultLocked}
            />
            <button
              type="button"
              onClick={() => {
                setPhase('act');
                setFeeling('');
                setVivirAnswers({});
              }}
              className="mt-4 text-xs text-slate-500 uppercase tracking-widest"
            >
              Ny kalibrering
            </button>
          </>
        )}
      </BentoCard>
      </div>
    </div>
  );
}
