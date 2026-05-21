import { BookOpen } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
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
  const {
    step,
    mood,
    text,
    saving,
    error,
    entries,
    setMood,
    setText,
    goToStep,
    handleSave,
    resetFlow,
  } = useJournalFlow({ userId: user?.uid });

  return (
    <div className="space-y-6">
      <BentoCard
        title={embedded ? 'Reflektion' : 'Dagbok'}
        icon={<BookOpen className="h-4 w-4" />}
      >
        <p className="mb-4 text-sm text-text-muted">
          Ett fält i taget — minimera sensorisk belastning.
        </p>

        <DagbokStepIndicator currentStep={step} />

        {step === 'mood' && (
          <MoodStep mood={mood} onMoodChange={setMood} onContinue={() => goToStep('text')} />
        )}

        {step === 'text' && (
          <ReflectionStep
            text={text}
            onTextChange={setText}
            onBack={() => goToStep('mood')}
            onContinue={() => goToStep('save')}
          />
        )}

        {step === 'save' && (
          <ConfirmStep
            mood={mood}
            text={text}
            saving={saving}
            onBack={() => goToStep('text')}
            onSave={handleSave}
          />
        )}

        {step === 'done' && (
          <SavedStep onNewEntry={resetFlow} journalContext={{ mood, text: text.trim() }} />
        )}

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </BentoCard>

      {step === 'mood' && <JournalArchive entries={entries} />}
    </div>
  );
}
