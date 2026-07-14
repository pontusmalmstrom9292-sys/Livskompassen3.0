import { useCallback } from 'react';
import { useStore } from '@/core/store';
import { saveMabraSession } from '@/core/firebase/firestore';
import { GroundingExercise } from '../GroundingExercise';
import { MabraToolShell } from './MabraToolShell';
import { MB_PLAY_54321_BANK_ID } from '../../content/grounding54321Play';

type Props = {
  onBack: () => void;
};

/** Våg 28.1 — interaktiv 5-4-3-2-1 wizard med MB-PLAY-54321 bankId. */
export function MabraGrounding54321Wizard({ onBack }: Props) {
  const userId = useStore((s) => s.user?.uid);

  const handleComplete = useCallback(
    async (elapsedSeconds: number) => {
      if (userId) {
        try {
          await saveMabraSession(userId, {
            exerciseType: 'grounding',
            durationSeconds: elapsedSeconds,
            playBankId: MB_PLAY_54321_BANK_ID,
          });
        } catch {
          // Övningen är klar ändå — session-spar fel ska inte blockera.
        }
      }
      onBack();
    },
    [userId, onBack],
  );

  return (
    <MabraToolShell
      title="5-4-3-2-1"
      description="Jordningsövning · MB-PLAY-54321"
      onBack={onBack}
    >
      <GroundingExercise onComplete={handleComplete} onExit={onBack} />
    </MabraToolShell>
  );
}
