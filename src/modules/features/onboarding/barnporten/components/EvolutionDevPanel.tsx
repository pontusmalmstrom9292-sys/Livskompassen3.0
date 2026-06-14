import React from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';

export const EvolutionDevPanel: React.FC = () => {
  const user = useStore((state) => state.user);
  const { barnportenLevel, unlockedPacks } = useEvolutionStore();

  // Vi visar bara detta i utvecklingsläge
  if (!import.meta.env.DEV) return null;
  if (!user) return null;

  const triggerLevelUp = async (level: number, packs: string[]) => {
    try {
      // Vi simulerar att Orkestern (backend) har gjort en uppdatering
      const hubRef = doc(db, 'evolution_hub', user.uid);
      await setDoc(hubRef, {
        barnportenLevel: level,
        unlockedPacks: packs,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log(`🔥 Dev-Trigger: Upplåst Nivå ${level}`);
    } catch (error) {
      console.error("Misslyckades att fejka upplåsning:", error);
    }
  };

  const initChildren = async () => {
    try {
      const hubRef = doc(db, 'evolution_hub', user.uid);
      await setDoc(hubRef, {
        childrenAgeState: {
          kasper: { birthDate: "2018-08-19", currentBracket: "toddler_preschool", barnportenLevel: 1 },
          arvid: { birthDate: "2021-06-02", currentBracket: "toddler_preschool", barnportenLevel: 1 }
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`🔥 Dev-Trigger: Initierade Arvid & Kasper`);
    } catch (error) {
      console.error("Misslyckades att initiera barn:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg bg-obsidian-bg border border-accent/30 shadow-accent-glow backdrop-blur-md text-xs text-text-muted">
      <h3 className="text-accent-light font-display font-semibold mb-2 flex items-center gap-2">
        <span>⚙️ EVOLUTION ENGINE (DEV)</span>
      </h3>
      <div className="mb-2">
        <p>Nuvarande Nivå: <strong className="text-text">{barnportenLevel}</strong></p>
        <p>Packs: <strong className="text-text">{unlockedPacks.join(', ') || 'Inga'}</strong></p>
      </div>
      <div className="flex gap-2 flex-wrap max-w-xs">
        <button 
          onClick={() => triggerLevelUp(1, [])}
          className="px-3 py-1 bg-surface-2 hover:bg-surface-3 rounded border border-text-dim transition-colors"
        >
          Återställ (Nivå 1)
        </button>
        <button 
          onClick={() => triggerLevelUp(2, ['foralder_trygg'])}
          className="px-3 py-1 bg-accent/20 hover:bg-accent/40 text-accent-light rounded border border-accent/50 transition-colors"
        >
          Tvinga Nivå 2
        </button>
        <button 
          onClick={initChildren}
          className="px-3 py-1 bg-surface-2 hover:bg-surface-3 rounded border border-text-dim transition-colors mt-2 w-full"
        >
          Initiera Arvid & Kasper
        </button>
      </div>
    </div>
  );
};
