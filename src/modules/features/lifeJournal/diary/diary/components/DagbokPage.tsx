import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ButtonLink } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmailAuthPanel } from '@/core/auth/EmailAuthPanel';
import { hasVaultGate } from '@/core/auth/sessionService';
import { useStore } from '@/core/store';
import {
  isMabraLowEnergyBridge,
  MABRA_BRIDGE_INTRO,
  parseMabraBridgeHub,
  type MabraBridgeHub,
} from '../constants/mabraBridge';
import { useJournalFlow } from '../hooks/useJournalFlow';
import { JOURNAL_CATEGORIES } from '../constants/journalCategories';
import { JOURNAL_STEPS } from '../constants/moods';
import type { DagbokMode } from '../types/journal';
import { ConfirmStep } from './ConfirmStep';
import { DagbokModeNav } from './DagbokModeNav';
import { DagbokRememberCard } from './DagbokRememberCard';
import { JournalArchiveReadonly } from './JournalArchiveReadonly';
import { JournalQuickMode } from './JournalQuickMode';
import { MoodStep } from './MoodStep';
import { ReflectionStep } from './ReflectionStep';
import { SavedStep } from './SavedStep';
import { DagbokWizardErrorBoundary } from './DagbokWizardErrorBoundary';

function parseInitialDagbokMode(
  searchParams: URLSearchParams,
  lowEnergyBridge: boolean,
): DagbokMode {
  if (lowEnergyBridge) return 'snabb';
  const raw = searchParams.get('mode');
  if (raw === 'snabb' || raw === 'reflektera' || raw === 'arkiv') return raw;
  return 'reflektera';
}

type DagbokPageProps = {
  embedded?: boolean;
  /** Overrides URL ?hub= when embedded in Mabra superhub (Fas 6D). */
  mabraBridgeHub?: MabraBridgeHub | null;
  /** Forces low-energy flow without URL ?from=mabra&energy=low */
  mabraLowEnergyBridge?: boolean;
};

export function DagbokPage({
  embedded = false,
  mabraBridgeHub: mabraBridgeHubProp,
  mabraLowEnergyBridge: mabraLowEnergyBridgeProp,
}: DagbokPageProps) {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const [searchParams] = useSearchParams();
  const mabraHub =
    mabraBridgeHubProp !== undefined
      ? mabraBridgeHubProp
      : parseMabraBridgeHub(searchParams.get('hub'));
  const lowEnergyBridge =
    mabraLowEnergyBridgeProp ??
    isMabraLowEnergyBridge(searchParams.get('from'), searchParams.get('energy'));
  const bridgeIntro = mabraHub ? MABRA_BRIDGE_INTRO[mabraHub] : null;

  const [mode, setMode] = useState<DagbokMode>(() =>
    parseInitialDagbokMode(searchParams, lowEnergyBridge),
  );

  const {
    step,
    mood,
    text,
    tags,
    category,
    pendingMemoryItems,
    memoryError,
    saving,
    error,
    entries,
    weaveToKampspar,
    quickJustSaved,
    quickMirror,
    quickMirrorLoading,
    lastSavedEntryId,
    setWeaveToKampspar,
    setCategory,
    setPendingMemoryItems,
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
    canAccessJournal,
  } = useJournalFlow({
    userId: user?.uid,
    mabraHub,
    lowEnergyBridge,
  });

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

  if (!canAccessJournal) {
    return (
      <div className="space-y-6">
        <EmailAuthPanel compact defaultMode="signin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BentoCard
        title={embedded ? 'Reflektion' : 'Dagbok'}
        icon={<BookOpen className="h-4 w-4" />}
        glow="gold"
        depth
        noHover
        className="hjartat-tab-panel"
      >
        {showBridgeBanner && (
          <div className="mb-4 rounded-xl border border-border-strong bg-surface/40 px-4 py-3 text-center">
            <p className="text-sm text-accent">{bridgeIntro.title}</p>
            <p className="mt-1 text-xs text-text-muted">{bridgeIntro.detail}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <DagbokModeNav mode={mode} onModeChange={setMode} />

          <div className="flex flex-wrap items-center gap-2">
            <DagbokRememberCard />
            <ButtonLink
              to="/hjartat?tab=speglar"
              variant="secondary"
              size="sm"
              className="shadow-sm transition-transform hover:scale-105"
              title="Låt AI validera och spegla dina senaste tankar"
            >
              🔮 Känslospegeln
            </ButtonLink>
          </div>
        </div>

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
                mirror={quickMirror}
                mirrorLoading={quickMirrorLoading}
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
            <DagbokWizardErrorBoundary
              onReset={() => {
                resetFlow();
                setMode('reflektera');
              }}
            >
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
                    memoryItems={pendingMemoryItems}
                    memoryError={memoryError}
                    onTextChange={setText}
                    onCategoryChange={setCategory}
                    onMemoryItemsChange={setPendingMemoryItems}
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
                    memorySummaries={pendingMemoryItems.map((i) => i.caption.trim() ? `${i.file.name} — ${i.caption.trim()}` : i.file.name)}
                    memoryError={memoryError}
                    categoryLabel={categoryLabel}
                    saving={saving}
                    weaveToKampspar={weaveToKampspar}
                    showWeaveOptIn={Boolean(user?.uid)}
                    onWeaveToKampsparChange={setWeaveToKampspar}
                    tags={tags}
                    onToggleTag={toggleTag}
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
                    userId={user?.uid}
                    journalEntryId={lastSavedEntryId}
                    showWeaverApproval={vaultSessionOpen}
                  />
                )}

                {error && <p className="mt-2 text-sm text-danger">{error}</p>}
              </div>
            </DagbokWizardErrorBoundary>
          </>
        )}

        {mode === 'arkiv' && (
          <>
            <JournalArchiveReadonly
              entries={entries}
              bare
              intro="Dina sparade tankar — läs bara, inget att ändra."
            />
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          </>
        )}
      </BentoCard>
    </div>
  );
}
