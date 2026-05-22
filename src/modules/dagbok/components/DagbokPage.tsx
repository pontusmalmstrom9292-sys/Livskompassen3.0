import { BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import {
  isMabraLowEnergyBridge,
  MABRA_BRIDGE_INTRO,
  parseMabraBridgeHub,
} from '../constants/mabraBridge';
import { useJournalFlow } from '../hooks/useJournalFlow';
import { ConfirmStep } from './ConfirmStep';
import { DagbokStepIndicator } from './DagbokStepIndicator';
import { JournalArchive } from './JournalArchive';
import { MoodStep } from './MoodStep';
import { ReflectionStep } from './ReflectionStep';
import { SavedStep } from './SavedStep';

type DagbokPageProps = {
  embedded?: boolean;
};

export function DagbokPage({ embedded = false }: DagbokPageProps) {
  const user = useStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const mabraHub = parseMabraBridgeHub(searchParams.get('hub'));
  const lowEnergyBridge = isMabraLowEnergyBridge(
    searchParams.get('from'),
    searchParams.get('energy'),
  );
  const bridgeIntro = mabraHub ? MABRA_BRIDGE_INTRO[mabraHub] : null;

  const {
    step,
    mood,
    text,
    saving,
    error,
    entries,
    weaveToKampspar,
    setWeaveToKampspar,
    setMood,
    setText,
    goToStep,
    handleSave,
    handleSaveMoodOnly,
    handleSaveWithoutText,
    resetFlow,
  } = useJournalFlow({
    userId: user?.uid,
    mabraHub,
    lowEnergyBridge,
  });

  return (
    <div className="space-y-6">
      <BentoCard
        title={embedded ? 'Reflektion' : 'Dagbok'}
        icon={<BookOpen className="h-4 w-4" />}
      >
        {lowEnergyBridge && bridgeIntro && step !== 'done' && (
          <div className="mb-4 rounded-xl border border-border-strong bg-surface/40 px-4 py-3 text-center">
            <p className="text-sm text-accent">{bridgeIntro.title}</p>
            <p className="mt-1 text-xs text-text-muted">{bridgeIntro.detail}</p>
          </div>
        )}

        <p className="mb-4 text-sm text-text-muted">
          Ett fält i taget — minimera sensorisk belastning.
        </p>

        <DagbokStepIndicator currentStep={step} />

        {step === 'mood' && (
          <MoodStep
            mood={mood}
            onMoodChange={setMood}
            onContinue={() => goToStep('text')}
            lowEnergyBridge={lowEnergyBridge}
            saving={saving}
            onSaveMoodOnly={handleSaveMoodOnly}
            showMoodOnlyButton
          />
        )}

        {step === 'text' && (
          <ReflectionStep
            text={text}
            mood={mood}
            onTextChange={setText}
            onBack={() => goToStep('mood')}
            onContinue={() => goToStep('save')}
            lowEnergyBridge={lowEnergyBridge}
            onSaveWithoutText={lowEnergyBridge ? handleSaveWithoutText : undefined}
            saving={saving}
          />
        )}

        {step === 'save' && (
          <ConfirmStep
            mood={mood}
            text={text}
            saving={saving}
            weaveToKampspar={weaveToKampspar}
            onWeaveToKampsparChange={setWeaveToKampspar}
            onBack={() => goToStep('text')}
            onSave={handleSave}
          />
        )}

        {step === 'done' && (
          <SavedStep onNewEntry={resetFlow} journalContext={{ mood, text: text.trim() }} />
        )}

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </BentoCard>

      {step === 'mood' && !lowEnergyBridge && <JournalArchive entries={entries} />}
    </div>
  );
}
