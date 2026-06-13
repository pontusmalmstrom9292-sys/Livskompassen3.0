import { memo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/core/store';
import { useMabraStore } from '../store/mabraStore';
import { saveMabraSession } from '@/core/firebase/firestore';

import { MabraFeelingCardsTool } from '../components/tools/MabraFeelingCardsTool';
import { MabraReflectionDeckTool } from '../components/tools/MabraReflectionDeckTool';
import { MabraSelfQuizTool } from '../components/tools/MabraSelfQuizTool';
import { MabraMicroPlayTool } from '../components/tools/MabraMicroPlayTool';
import { MabraToolShell } from '../components/tools/MabraToolShell';
import { KbtTransformatorPanel } from '../components/KbtTransformatorPanel';
import { DagligMixPanel } from '../components/DagligMixPanel';
import type { MabraHubCategory } from '../mabraHubRegistry';

export const MabraToolView = memo(function MabraToolView() {
  const { toolId } = useParams<{ toolId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const userId = user?.uid;

  const {
    setHubOpenCategory,
    setHubFocusToken,
    setSaveError
  } = useMabraStore(
    useShallow((state) => ({
      setHubOpenCategory: state.setHubOpenCategory,
      setHubFocusToken: state.setHubFocusToken,
      setSaveError: state.setSaveError
    }))
  );

  const returnToHub = useCallback((category?: MabraHubCategory) => {
    if (category) setHubOpenCategory(category);
    setHubFocusToken((n) => n + 1);
    navigate('/mabra');
  }, [navigate, setHubOpenCategory, setHubFocusToken]);

  const handleDagligMixComplete = useCallback(
    async (payload: {
      cardBankId: string;
      playBankId: string;
      dateKey: string;
      elapsedSeconds: number;
    }) => {
      if (!userId) return;
      setSaveError(null);
      try {
        await saveMabraSession(userId, {
          exerciseType: 'daglig_mix',
          durationSeconds: payload.elapsedSeconds,
          cardBankId: payload.cardBankId,
          playBankId: payload.playBankId,
          mixDateKey: payload.dateKey,
        });
      } catch {
        setSaveError('Kunde inte spara daglig mix — klart ändå lokalt.');
      }
    },
    [userId, setSaveError],
  );

  if (toolId === 'feeling_cards') {
    return <MabraFeelingCardsTool onBack={() => returnToHub('lekar')} />;
  }
  
  if (toolId === 'reflection_deck') {
    return (
      <MabraReflectionDeckTool
        initialBankId={searchParams.get('initialBankId') ?? undefined}
        onBack={() => returnToHub('lekar')}
      />
    );
  }

  if (toolId === 'self_quiz') {
    return <MabraSelfQuizTool onBack={() => returnToHub('lekar')} />;
  }

  if (toolId === 'micro_play') {
    const bankId = searchParams.get('playBankId');
    if (!bankId) return <p className="text-center p-4">Saknar playBankId</p>;
    return <MabraMicroPlayTool bankId={bankId} onBack={() => returnToHub('lekar')} />;
  }

  if (toolId === 'kbt') {
    return (
      <MabraToolShell
        title="Automatiska tankar"
        description="KBT-transformator"
        onBack={() => returnToHub('tankar')}
      >
        <KbtTransformatorPanel />
      </MabraToolShell>
    );
  }

  if (toolId === 'daglig_mix') {
    return (
      <MabraToolShell title="Dagens mix" onBack={() => returnToHub('lekar')}>
        <DagligMixPanel uid={userId} onComplete={(p) => void handleDagligMixComplete(p)} />
      </MabraToolShell>
    );
  }

  return <p className="text-center p-4">Okänt verktyg: {toolId}</p>;
});
