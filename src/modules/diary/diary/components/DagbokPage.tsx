import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { useStore } from '../../../core/store';
import { hasVaultZone } from '../../../core/auth/sessionService';
import { VaultZoneGate } from '../../../core/security/VaultZoneGate';
import { useVaultZoneIdle } from '../../../core/security/useVaultZoneIdle';
import {
  isMabraLowEnergyBridge,
  MABRA_BRIDGE_INTRO,
  parseMabraBridgeHub,
} from '../constants/mabraBridge';
import { useJournalFlow } from '../hooks/useJournalFlow';
import { JOURNAL_CATEGORIES } from '../constants/journalCategories';
import { JOURNAL_STEPS } from '../constants/moods';
import type { DagbokMode } from '../types/journal';
import { ConfirmStep } from './ConfirmStep';
import { DagbokModeNav } from './DagbokModeNav';
import { DagbokRememberCard } from './DagbokRememberCard';
import { JournalArchive } from './JournalArchive';
import { JournalQuickMode } from './JournalQuickMode';
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

  const [mode, setMode] = useState<DagbokMode>(() => (lowEnergyBridge ? 'snabb' : 'reflektera'));

  const {
    step,
    mood,
    text,
    tags,
    category,
    pendingMemoryFile,
    memoryError,
    saving,
    error,
    entries,
    weaveToKampspar,
    quickJustSaved,
    setWeaveToKampspar,
    setCategory,
    setPendingMemoryFile,
    setMemoryError,
    lowEnergyBridge: flowLowEnergy,
    setMood,
    setText,
    toggleTag,
    goToStep,
    handleSave,
    handleSaveMoodOnly,
    handleSaveWithoutText,
    handleQuickSave,
    resetFlow,
    refreshEntries,
  } = useJournalFlow({
    userId: user?.uid,
    mabraHub,
    lowEnergyBridge,
  });

  const [forensicUnlocked, setForensicUnlocked] = useState(() =>
    hasVaultZone('dagbok_forensic'),
  );

  useVaultZoneIdle('dagbok_forensic', forensicUnlocked, () => setForensicUnlocked(false));

  useEffect(() => {
    if (mode === 'arkiv') {
      refreshEntries().catch(() => undefined);
    }
  }, [mode, refreshEntries]);

  const showBridgeBanner =
    lowEnergyBridge && bridgeIntro && mode !== 'arkiv' && (mode !== 'reflektera' || step !== 'done');

  const categoryLabel = category
    ? JOURNAL_CATEGORIES.find((c) => c.id === category)?.label
    : null;

  return (
    <div className="space-y-6">
      <BentoCard
        title={embedded ? 'Reflektion' : 'Dagbok'}
        icon={<BookOpen className="h-4 w-4" />}
      >
        {showBridgeBanner && (
          <div className="mb-4 rounded-xl border border-border-strong bg-surface/40 px-4 py-3 text-center">
            <p className="text-sm text-accent">{bridgeIntro.title}</p>
            <p className="mt-1 text-xs text-text-muted">{bridgeIntro.detail}</p>
          </div>
        )}

        <DagbokModeNav mode={mode} onModeChange={setMode} />

        <DagbokRememberCard />

        {mode === 'snabb' && (
          <>
            <p className="reflektion-intro mb-4 mt-4">
              En snabb check-in — humör, valfria taggar, spara direkt.
            </p>
            <div className="reflektion-wizard" aria-live="polite">
              <JournalQuickMode
                mood={mood}
                tags={tags}
                saving={saving}
                justSaved={quickJustSaved}
                onMoodChange={setMood}
                onToggleTag={toggleTag}
                onSave={handleQuickSave}
              />
              {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            </div>
          </>
        )}

        {mode === 'reflektera' && (
          <>
            <p className="reflektion-intro mb-4 mt-4">
              Ta det lugnt — ett litet steg i taget. Inget måste bli perfekt.
            </p>
            <div className="reflektion-wizard" aria-live="polite">
              <p className="sr-only">
                Steg {JOURNAL_STEPS.findIndex((s) => s.key === step) + 1} av {JOURNAL_STEPS.length}:{' '}
                {JOURNAL_STEPS.find((s) => s.key === step)?.label}
              </p>

              {step === 'mood' && (
                <MoodStep
                  mood={mood}
                  onMoodChange={setMood}
                  onContinue={() => goToStep('text')}
                  lowEnergyBridge={flowLowEnergy}
                  saving={saving}
                  onSaveMoodOnly={handleSaveMoodOnly}
                  showMoodOnlyButton
                />
              )}

              {step === 'text' && (
                <ReflectionStep
                  text={text}
                  mood={mood}
                  category={category}
                  memoryFile={pendingMemoryFile}
                  memoryError={memoryError}
                  onTextChange={setText}
                  onCategoryChange={setCategory}
                  onMemoryFileChange={setPendingMemoryFile}
                  onMemoryValidationError={setMemoryError}
                  onBack={() => goToStep('mood')}
                  onContinue={() => goToStep('save')}
                  lowEnergyBridge={flowLowEnergy}
                  onSaveWithoutText={flowLowEnergy ? handleSaveWithoutText : undefined}
                  saving={saving}
                />
              )}

              {step === 'save' && (
                <ConfirmStep
                  mood={mood}
                  text={text}
                  memoryFileName={pendingMemoryFile?.name}
                  categoryLabel={categoryLabel}
                  saving={saving}
                  weaveToKampspar={weaveToKampspar}
                  showWeaveOptIn={forensicUnlocked}
                  onWeaveToKampsparChange={setWeaveToKampspar}
                  onBack={() => goToStep('text')}
                  onSave={handleSave}
                />
              )}

              {step === 'done' && (
                <SavedStep
                  onNewEntry={() => {
                    resetFlow();
                    setMode('reflektera');
                  }}
                  journalContext={{ mood, text: text.trim() }}
                />
              )}

              {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            </div>
            {step !== 'done' && !forensicUnlocked && (
              <div className="mt-4">
                <VaultZoneGate
                  zone="dagbok_forensic"
                  clearOnUnmount={false}
                  title="Journalarkiv & vävare"
                  description="Vävning och Kampspár-opt-in. Samma PIN som Valv."
                  onUnlocked={() => setForensicUnlocked(true)}
                  onLock={() => setForensicUnlocked(false)}
                >
                  <p className="text-xs text-text-muted">
                    Vävning till Kampspár är tillgänglig vid spara.
                  </p>
                </VaultZoneGate>
              </div>
            )}
          </>
        )}

        {mode === 'arkiv' && (
          <div className="mt-4">
            <p className="reflektion-intro mb-4">
              Dina sparade tankar — läs bara, inget att ändra.
            </p>
            <JournalArchive entries={entries} bare />
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          </div>
        )}
      </BentoCard>
    </div>
  );
}
