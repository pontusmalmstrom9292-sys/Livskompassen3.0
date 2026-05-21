import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { getVaultLogs } from '../../core/firebase/firestore';
import { hasVaultGate } from '../../core/auth/sessionService';
import { readJournalBridgeContext } from '../../core/types/journalBridge';
import { VIVIR_STEPS } from '../constants/vivirSteps';
import { matchVaultEvidence } from '../utils/matchVaultEvidence';
import { ActCalibrationView } from './ActCalibrationView';
import { VivirStepView } from './VivirStepView';
import { EvidenceCompareView } from './EvidenceCompareView';

type Phase = 'act' | 'vivir' | 'compare';

const INITIAL_PHASE: Phase = 'act';

export function SpeglingsSystem() {
  const location = useLocation();
  const journalBridge = readJournalBridgeContext(location.state);
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const [phase, setPhase] = useState<Phase>(INITIAL_PHASE);
  const [feeling, setFeeling] = useState('');
  const [journalMood, setJournalMood] = useState('');
  const [vivirAnswers, setVivirAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!journalBridge) return;
    const prefix = journalBridge.mood ? `Humör: ${journalBridge.mood}. ` : '';
    setFeeling(`${prefix}${journalBridge.text}`);
    setJournalMood(journalBridge.mood);
  }, [journalBridge]);

  useEffect(
    () => () => {
      setPhase(INITIAL_PHASE);
      setFeeling('');
      setJournalMood('');
      setVivirAnswers({});
    },
    [],
  );

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

  const resetSession = () => {
    setPhase(INITIAL_PHASE);
    setFeeling('');
    setJournalMood('');
    setVivirAnswers({});
  };

  return (
    <div className="space-y-6">
      <BentoCard title="Speglings-Systemet" icon={<Brain className="h-4 w-4" />}>
        <p className="mb-4 text-sm text-text-muted">
          Kognitiv sköld — separera känsla från fakta. Validera, aldrig fixa.
        </p>

        {phase === 'act' && (
          <ActCalibrationView
            feeling={feeling}
            journalMood={journalMood}
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
              onClick={resetSession}
              className="mt-4 text-xs uppercase tracking-widest text-text-dim hover:text-accent"
            >
              Ny kalibrering
            </button>
          </>
        )}
      </BentoCard>
    </div>
  );
}
