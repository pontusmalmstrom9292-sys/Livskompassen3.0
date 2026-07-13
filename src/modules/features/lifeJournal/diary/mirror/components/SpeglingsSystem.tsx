import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Anchor, Lock } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { useStore } from '@/core/store';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';

import { hasVaultGate } from '@/core/auth/sessionService';
import { readJournalBridgeContext } from '@/core/types/journalBridge';
import {
  revokeMediaAttachments,
  type MediaAttachment,
} from '@/core/media/mediaAttachment';
import { VIVIR_STEPS } from '../constants/vivirSteps';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';
import { ActCalibrationView } from './ActCalibrationView';
import { VivirStepView } from './VivirStepView';
import { EvidenceCompareView } from './EvidenceCompareView';
import { SpeglarEvidencePanel, type SavedSpeglarEvidence } from './SpeglarEvidencePanel';
import { VivirQuickEntry } from './VivirQuickEntry';
import { SvartPaVittForm } from './SvartPaVittForm';
import {
  clearSpeglarSession,
  readSpeglarSession,
  writeSpeglarSession,
} from '../utils/speglarSessionStorage';

type ForensicPhase = 'vivir' | 'compare';

type SpeglingsSystemProps = {
  embedded?: boolean;
};

/** Publikt: ACT-kalibrering. Forensic: VIVIR, Svart på vitt, bevisjämförelse. B3 — primär: spegling. */
export function SpeglingsSystem({ embedded: _embedded = false }: SpeglingsSystemProps) {
  const location = useLocation();
  const { bridgeMood, bridgeText } = useMemo(() => {
    try {
      const ctx = readJournalBridgeContext(location.state);
      return { bridgeMood: ctx?.mood ?? '', bridgeText: ctx?.text ?? '' };
    } catch {
      return { bridgeMood: '', bridgeText: '' };
    }
  }, [location.state]);
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const [feeling, setFeeling] = useState(() => {
    const raw = readSpeglarSession()?.feeling;
    return typeof raw === 'string' ? raw : '';
  });
  const [journalMood, setJournalMood] = useState(() => {
    const raw = readSpeglarSession()?.journalMood;
    return typeof raw === 'string' ? raw : '';
  });
  const [showForensic, setShowForensic] = useState(() => readSpeglarSession()?.showForensic ?? false);

  useEffect(() => {
    writeSpeglarSession({ feeling, journalMood, showForensic });
  }, [feeling, journalMood, showForensic]);

  const handleClearSession = useCallback(() => {
    setFeeling('');
    setJournalMood('');
    setShowForensic(false);
    clearSpeglarSession();
  }, []);

  useEffect(() => {
    if (!bridgeText) return;
    const prefix = bridgeMood ? `Humör: ${bridgeMood}. ` : '';
    setFeeling(`${prefix}${bridgeText}`);
    setJournalMood(bridgeMood);
  }, [bridgeMood, bridgeText]);

  return (
    <div className="space-y-4">
      <BentoCard
        title="Speglar"
        icon={<Brain className="h-4 w-4" />}
        glow="gold"
        depth
        noHover
        className="hjartat-tab-panel"
      >
        <ActCalibrationView
          feeling={typeof feeling === 'string' ? feeling : ''}
          journalMood={typeof journalMood === 'string' ? journalMood : ''}
          onFeelingChange={setFeeling}
          onContinue={() => setShowForensic(true)}
        />

        <CalmCollapsible
          title="Tips & Zero Footprint"
          meta="Speglar"
          defaultOpen={false}
          glow="gold"
        >
          <div className="space-y-3">
            <div className="flex justify-end">
              <ModuleHelpFromRegistry moduleId="speglar" mode="dagbok" />
            </div>
            <p className="text-sm text-text-muted">
              Känslan först. Fakta sen. Sparas lokalt tills du trycker Rensa eller Rensa enheten i
              Inställningar.
            </p>
            {!showForensic && (
              <p className="text-xs text-text-dim">
                Skriv känsla → Spegla → «Fortsätt till VIVIR». Bevisjämförelse kräver upplåst Valv
                (Fyren 3 s).
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                className="min-h-[44px] rounded-lg px-3 text-xs text-text-dim underline-offset-2 hover:text-text-muted hover:underline"
                aria-label="Rensa speglar-session"
                onClick={handleClearSession}
              >
                Rensa speglar-session
              </button>
            </div>
          </div>
        </CalmCollapsible>
      </BentoCard>

      {showForensic && vaultSessionOpen && (
        <SpeglingsForensicPanel userId={user?.uid} initialFeeling={feeling} />
      )}

      {showForensic && !vaultSessionOpen && (
        <BentoCard
          title="Fördjupad spegling"
          icon={<Lock className="h-4 w-4" />}
          glow="blue"
          depth
          noHover
          className="hjartat-tab-panel"
        >
          <p className="text-sm text-text-dim">
            Öppna Valv via Fyren (håll Hjärtat 3 sek) — samma session i en timme, inget extra PIN.
          </p>
        </BentoCard>
      )}
    </div>
  );
}

type ForensicProps = {
  userId?: string;
  initialFeeling?: string;
};

export function SpeglingsForensicPanel({ userId, initialFeeling = '' }: ForensicProps) {
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const [phase, setPhase] = useState<ForensicPhase>('vivir');
  const [feeling, setFeeling] = useState(initialFeeling);
  const [vivirAnswers, setVivirAnswers] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [savedAttachmentIds, setSavedAttachmentIds] = useState<Set<string>>(() => new Set());
  const [sessionSavedEvidence, setSessionSavedEvidence] = useState<SavedSpeglarEvidence[]>([]);
  const attachmentsRef = useRef<MediaAttachment[]>([]);
  attachmentsRef.current = attachments;

  const addAttachment = useCallback((attachment: MediaAttachment) => {
    setAttachments((prev) => [...prev, attachment]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
    setSavedAttachmentIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleEvidenceSaved = useCallback((saved: SavedSpeglarEvidence) => {
    setSavedAttachmentIds((prev) => new Set(prev).add(saved.attachmentId));
    setSessionSavedEvidence((prev) => [...prev, saved]);
  }, []);

  const vivirSummary = VIVIR_STEPS.map(
    (s) => `${s.title}: ${vivirAnswers[s.key] ?? '—'}`
  ).join('\n');

  const vaultLocked = !isVaultUnlocked && !hasVaultGate();
  const [matches, setMatches] = useState<Array<{ log: any; score: number }>>([]);

  const resetSession = useCallback(() => {
    revokeMediaAttachments(attachmentsRef.current);
    setPhase('vivir');
    setFeeling(initialFeeling);
    setVivirAnswers({});
    setAttachments([]);
    setSavedAttachmentIds(new Set());
    setSessionSavedEvidence([]);
    setMatches([]);
  }, [initialFeeling]);

  useEffect(() => () => resetSession(), [resetSession]);

  useEffect(() => {
    if (phase !== 'compare' || !userId || vaultLocked) return;
    const searchText = `${feeling} ${Object.values(vivirAnswers).join(' ')}`;
    
    const callBackend = httpsCallable<
      { searchText: string },
      { matches: Array<{ log: any; score: number }> }
    >(functions, 'compareVaultEvidence');

    callBackend(withVaultSessionPayload({ searchText }))
      .then((res) => setMatches(res.data.matches || []))
      .catch((err) => {
        console.warn('Vector Search compare failed', err);
        setMatches([]);
      });
  }, [phase, userId, vaultLocked, feeling, vivirAnswers]);

  return (
  <BentoCard
    title="Forensisk spegling"
    icon={<Lock className="h-4 w-4" />}
    glow="blue"
    depth
    noHover
    bare
    className="hjartat-tab-panel space-y-4 !p-4 sm:!p-5"
  >
      {phase === 'vivir' && (
        <VivirStepView
          answers={vivirAnswers}
          onChange={setVivirAnswers}
          onComplete={() => setPhase('compare')}
        />
      )}

      {phase === 'compare' && (
        <EvidenceCompareView
          feeling={feeling}
          vivirSummary={vivirSummary}
          matches={matches}
          vaultLocked={vaultLocked}
          sessionAttachments={attachments}
          sessionSavedEvidence={sessionSavedEvidence}
        />
      )}

      <CalmCollapsible
        title="Snabbstart & Svart på vitt"
        meta="VIVIR"
        defaultOpen={false}
        glow="blue"
      >
        <div className="space-y-3">
          <div className="flex justify-end">
            <ModuleHelpFromRegistry moduleId="speglar" mode="forensic" />
          </div>
          <VivirQuickEntry onStart={() => setPhase('vivir')} />
          <SvartPaVittForm />
        </div>
      </CalmCollapsible>

      {phase === 'vivir' && (
        <CalmCollapsible title="Bifoga bevis" meta="Valv WORM" defaultOpen={false} glow="blue">
          <SpeglarEvidencePanel
            userId={userId}
            feeling={feeling}
            attachments={attachments}
            savedIds={savedAttachmentIds}
            onAdd={addAttachment}
            onRemove={removeAttachment}
            onSaved={handleEvidenceSaved}
          />
        </CalmCollapsible>
      )}

      {phase === 'compare' && (
        <CalmCollapsible title="Nästa steg" meta="Hamn · ny kalibrering" defaultOpen={false} glow="blue">
          <div className="space-y-3">
            <Link
              to="/familjen?tab=hamn"
              state={{ prefilledMessage: feeling }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent hover:text-accent-light"
            >
              <Anchor className="h-3 w-3" />
              Formulera BIFF-svar i Hamn
            </Link>
            <button
              type="button"
              onClick={resetSession}
              className="block text-xs uppercase tracking-widest text-text-dim hover:text-accent"
            >
              Ny kalibrering
            </button>
          </div>
        </CalmCollapsible>
      )}
  </BentoCard>
  );
}
