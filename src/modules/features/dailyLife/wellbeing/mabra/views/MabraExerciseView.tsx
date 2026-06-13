import { memo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/core/store';
import { useMabraStore } from '../store/mabraStore';
import { saveMabraSession } from '@/core/firebase/firestore';

import { BreathingExercise } from '../components/BreathingExercise';
import { GroundingExercise } from '../components/GroundingExercise';
import { ReframingExercise } from '../components/ReframingExercise';
import type { MabraExerciseType } from '../types';

export const MabraExerciseView = memo(function MabraExerciseView() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const userId = user?.uid;

  const {
    hub,
    durationMinutes,
    addonBreathing, setAddonBreathing,
    setCompletedExerciseType,
    setSaveError,
    setHubOpenCategory,
    setHubFocusToken
  } = useMabraStore(
    useShallow((state) => ({
      hub: state.hub,
      durationMinutes: state.durationMinutes,
      addonBreathing: state.addonBreathing,
      setAddonBreathing: state.setAddonBreathing,
      setCompletedExerciseType: state.setCompletedExerciseType,
      setSaveError: state.setSaveError,
      setHubOpenCategory: state.setHubOpenCategory,
      setHubFocusToken: state.setHubFocusToken
    }))
  );

  const returnToHub = useCallback((category?: 'akut' | 'tankar' | 'lekar' | 'projekt' | 'identitet') => {
    if (category) setHubOpenCategory(category);
    setHubFocusToken((n) => n + 1);
    navigate('/mabra');
  }, [navigate, setHubOpenCategory, setHubFocusToken]);

  const handleExerciseComplete = useCallback(
    async (exerciseType: MabraExerciseType, elapsedSeconds: number) => {
      setCompletedExerciseType(exerciseType);
      setAddonBreathing(false);
      
      if (!userId) {
        navigate('/mabra/klart');
        return;
      }
      
      setSaveError(null);
      try {
        await saveMabraSession(userId, {
          exerciseType,
          durationSeconds: elapsedSeconds,
          hubSymptom: hub ?? undefined,
        });
      } catch {
        setSaveError('Kunde inte spara sessionen — övningen är klar ändå.');
      }
      navigate('/mabra/klart');
    },
    [userId, hub, setCompletedExerciseType, setAddonBreathing, setSaveError, navigate]
  );

  const handleBreathingComplete = useCallback(
    (elapsedSeconds: number) => {
      if (addonBreathing) {
        setAddonBreathing(false);
        void handleExerciseComplete('breathing', elapsedSeconds);
        return;
      }
      void handleExerciseComplete('breathing', elapsedSeconds);
    },
    [addonBreathing, handleExerciseComplete, setAddonBreathing]
  );

  const handleGroundingComplete = useCallback(
    (elapsedSeconds: number) => {
      void handleExerciseComplete('grounding', elapsedSeconds);
    },
    [handleExerciseComplete]
  );

  const handleReframingComplete = useCallback(() => {
    navigate('/mabra/ovning/tillagg');
  }, [navigate]);

  if (exerciseId === 'breathing') {
    return (
      <BreathingExercise
        variant={addonBreathing || hub === 'self_critical' ? 'self_critical' : 'panic_rsd'}
        durationMinutes={addonBreathing ? 1 : durationMinutes}
        onComplete={handleBreathingComplete}
        onExit={() => returnToHub('akut')}
      />
    );
  }

  if (exerciseId === 'grounding') {
    return (
      <GroundingExercise
        onComplete={handleGroundingComplete}
        onExit={() => returnToHub('akut')}
      />
    );
  }

  if (exerciseId === 'reframing') {
    return (
      <ReframingExercise
        onComplete={handleReframingComplete}
        onExit={() => returnToHub('tankar')}
      />
    );
  }

  return <p className="text-center p-4">Okänd övning: {exerciseId}</p>;
});
