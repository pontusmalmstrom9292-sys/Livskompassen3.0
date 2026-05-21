import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Anchor } from 'lucide-react';
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

type SpeglingsSystemProps = {
  embedded?: boolean;
};

export function SpeglingsSystem({ embedded = false }: SpeglingsSystemProps) {
  const location = useLocation();
  const { bridgeMood, bridgeText } = useMemo(() => {
    const ctx = readJournalBridgeContext(location.state);
    return { bridgeMood: ctx?.mood ?? '', bridgeText: ctx?.text ?? '' };
  }, [location.state]);
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const [phase, setPhase] = useState<Phase>(INITIAL_PHASE);
  const [feeling, setFeeling] = useState('');
  const [journalMood, setJournalMood] = useState('');
  const [vivirAnswers, setVivirAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!bridgeText) return;
    const prefix = bridgeMood ? `Humör: ${bridgeMood}. ` : '';
    setFeeling(`${prefix}${bridgeText}`);
    setJournalMood(bridgeMood);
  }, [bridgeMood, bridgeText]);

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
      <BentoCard title={embedded ? 'Speglar' : 'Speglings-Systemet'} icon={<Brain className="h-4 w-4" />}>
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
            <Link
              to="/hamn"
              state={{ prefilledMessage: feeling }}
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent hover:text-accent-light"
            >
              <Anchor className="h-3 w-3" />
              Formulera BIFF-svar i Hamn
            </Link>
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
