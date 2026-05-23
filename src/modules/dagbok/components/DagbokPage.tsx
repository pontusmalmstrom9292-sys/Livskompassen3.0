import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../core/store';
import {
  isMabraLowEnergyBridge,
  MABRA_BRIDGE_INTRO,
  parseMabraBridgeHub,
} from '../constants/mabraBridge';
import { useJournalFlow } from '../hooks/useJournalFlow';
import { ConfirmStep } from './ConfirmStep';
import { DagbokStepIndicator } from './DagbokStepIndicator';
import { DagbokTodayStrip } from './DagbokTodayStrip';
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
    quickText,
    setQuickText,
    handleQuickSave,
    quickSaved,
  } = useJournalFlow({
    userId: user?.uid,
    mabraHub,
    lowEnergyBridge,
  });

  if (embedded) {
    return (
      <div className="space-y-4 glass-card p-4">
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
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="dagbok-page space-y-4">
      {lowEnergyBridge && bridgeIntro && step !== 'done' && (
        <div className="rounded-xl border border-border-strong bg-surface/40 px-4 py-3 text-center">
          <p className="text-sm text-accent">{bridgeIntro.title}</p>
          <p className="mt-1 text-xs text-text-muted">{bridgeIntro.detail}</p>
        </div>
      )}

      {step !== 'done' && user && (
        <DagbokTodayStrip
          entries={entries}
          quickText={quickText}
          onQuickTextChange={setQuickText}
          onQuickSave={handleQuickSave}
          saving={saving}
        />
      )}

      {quickSaved && (
        <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          Snabb rad sparad.
        </p>
      )}

      <section className="dagbok-wizard glass-card p-4">
        <header className="dagbok-wizard__head">
          <h2 className="font-display text-sm font-semibold text-accent">Ny reflektion</h2>
          <p className="text-xs text-text-dim">Ett steg i taget — du kan alltid spara tidigt</p>
        </header>

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
      </section>

      <JournalArchive entries={entries} />
    </div>
  );
}
