import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { useMabraStore } from '../store/mabraStore';
import { saveMabraSession } from '@/core/firebase/firestore';

import { ValuesCompass } from '../components/ValuesCompass';
import { AkutLanding } from '../components/AkutLanding';
import { DurationPicker } from '../components/DurationPicker';
import { MabraComplete } from '../components/MabraComplete';
import { pickDailyReflectionCard } from '../lib/pickDagligMix';
import { VALUES_COMPASS_COPY, BREATHING_ADDON_COPY } from '../constants';
import type { MabraHubCategory } from '../mabraHubRegistry';

export const ValuesView = memo(function ValuesView() {
  const user = useStore((s) => s.user);
  const userId = user?.uid;
  const navigate = useNavigate();

  const { setValuesSavedHint, setHubOpenCategory, setHubFocusToken } = useMabraStore(
    useShallow((state) => ({
      setValuesSavedHint: state.setValuesSavedHint,
      setHubOpenCategory: state.setHubOpenCategory,
      setHubFocusToken: state.setHubFocusToken,
    }))
  );

  if (!userId) {
    return <p className="py-4 text-center text-sm text-text-muted">Logga in för att spara värderingar.</p>;
  }

  return (
    <BentoCard title={VALUES_COMPASS_COPY.title} icon={<Sparkles className="h-4 w-4" />}>
      <ValuesCompass
        userId={userId}
        onDone={() => {
          setValuesSavedHint(true);
          setHubOpenCategory('identitet');
          setHubFocusToken((n) => n + 1);
          navigate('/mabra');
        }}
        onExit={() => navigate('/mabra')}
      />
    </BentoCard>
  );
});

export const AkutView = memo(function AkutView() {
  const navigate = useNavigate();
  const { hub, setHubOpenCategory, setHubFocusToken } = useMabraStore(
    useShallow((state) => ({
      hub: state.hub,
      setHubOpenCategory: state.setHubOpenCategory,
      setHubFocusToken: state.setHubFocusToken,
    }))
  );

  const returnToHub = useCallback((category: MabraHubCategory) => {
    setHubOpenCategory(category);
    setHubFocusToken((n) => n + 1);
    navigate('/mabra');
  }, [navigate, setHubOpenCategory, setHubFocusToken]);

  if (hub !== 'panic_rsd') {
    return <p className="p-4 text-center">Endast för panik/RSD-hubben.</p>;
  }

  return (
    <AkutLanding
      onContinue={() => navigate('/mabra/tid')}
      onExit={() => returnToHub('akut')}
    />
  );
});

export const DurationView = memo(function DurationView() {
  const navigate = useNavigate();
  const { hub, durationMinutes, setDurationMinutes } = useMabraStore(
    useShallow((state) => ({
      hub: state.hub,
      durationMinutes: state.durationMinutes,
      setDurationMinutes: state.setDurationMinutes,
    }))
  );

  if (hub !== 'panic_rsd') return null;

  return (
    <DurationPicker
      hub={hub}
      value={durationMinutes}
      onChange={setDurationMinutes}
      onStart={() => navigate('/mabra/ovning/breathing')}
      onBack={() => navigate('/mabra/akut')}
    />
  );
});

export const AddonView = memo(function AddonView() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const userId = user?.uid;

  const { hub, setAddonBreathing, setCompletedExerciseType, setSaveError } = useMabraStore(
    useShallow((state) => ({
      hub: state.hub,
      setAddonBreathing: state.setAddonBreathing,
      setCompletedExerciseType: state.setCompletedExerciseType,
      setSaveError: state.setSaveError,
    }))
  );

  const finishReframingSession = useCallback(async () => {
    // Förenklad sessionstid (ca 60s för reframing) i addon view om vi inte har en exakt klocka
    const elapsedSeconds = 60;
    setCompletedExerciseType('reframing');
    setAddonBreathing(false);
    
    if (userId) {
      setSaveError(null);
      try {
        await saveMabraSession(userId, {
          exerciseType: 'reframing',
          durationSeconds: elapsedSeconds,
          hubSymptom: hub ?? undefined,
        });
      } catch {
        setSaveError('Kunde inte spara sessionen — övningen är klar ändå.');
      }
    }
    navigate('/mabra/klart');
  }, [userId, hub, setCompletedExerciseType, setAddonBreathing, setSaveError, navigate]);

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-full max-w-sm rounded-xl border border-border-strong bg-surface/40 px-5 py-6 text-center">
        <p className="text-base text-accent">{BREATHING_ADDON_COPY.prompt}</p>
        <p className="mt-2 text-sm text-text-muted">{BREATHING_ADDON_COPY.detail}</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            setAddonBreathing(true);
            navigate('/mabra/ovning/breathing');
          }}
          className="btn-pill--secondary"
        >
          {BREATHING_ADDON_COPY.startLabel}
        </button>
        <button type="button" onClick={() => void finishReframingSession()} className="btn-pill--ghost text-sm">
          {BREATHING_ADDON_COPY.skipLabel}
        </button>
      </div>
    </div>
  );
});

export const CompleteView = memo(function CompleteView() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const userId = user?.uid;

  const { hub, completedExerciseType, saveError, setHubOpenCategory, setHubFocusToken } = useMabraStore(
    useShallow((state) => ({
      hub: state.hub,
      completedExerciseType: state.completedExerciseType,
      saveError: state.saveError,
      setHubOpenCategory: state.setHubOpenCategory,
      setHubFocusToken: state.setHubFocusToken,
    }))
  );

  const openDailyReflectionCard = useCallback(() => {
    if (!userId) return;
    const { card } = pickDailyReflectionCard({ uid: userId });
    setHubOpenCategory('lekar');
    navigate(`/mabra/verktyg/reflection_deck?initialBankId=${card.bankId}`);
  }, [userId, navigate, setHubOpenCategory]);

  const returnToHub = useCallback((category: MabraHubCategory) => {
    setHubOpenCategory(category);
    setHubFocusToken((n) => n + 1);
    navigate('/mabra');
  }, [navigate, setHubOpenCategory, setHubFocusToken]);

  return (
    <BentoCard title="Klart" icon={<Sparkles className="h-4 w-4" />}>
      <MabraComplete
        hub={hub}
        exerciseType={completedExerciseType}
        onOpenReflectionCard={openDailyReflectionCard}
        onDone={() => {
          const cat: MabraHubCategory =
            hub === 'find_self' || hub === 'panic_rsd'
              ? 'akut'
              : hub === 'self_critical'
                ? 'tankar'
                : 'akut';
          returnToHub(cat);
        }}
      />
      {saveError && <p className="mt-2 text-sm text-text-dim">{saveError}</p>}
    </BentoCard>
  );
});
