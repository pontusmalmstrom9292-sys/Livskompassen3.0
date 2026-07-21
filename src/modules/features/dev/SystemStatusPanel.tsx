import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { useEconomyAccess } from '@/core/evolution/access_manager';
import { useCapacityScore } from '@/core/store/useCapacityGate';

const IS_DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV;

/**
 * Minimalist floating dev panel showing system status:
 * - Current capacity score (from evolution_hub)
 * - Economy access token state (from access_tokens_economy)
 * - Force-unlock button (dev only, writes directly — requires emulator or relaxed rules)
 */
export const SystemStatusPanel: React.FC = () => {
  const user = useStore((s) => s.user);
  const capacityScore = useCapacityScore();
  const { isEconomyAdvancedUnlocked, updatedAt, isLoading } = useEconomyAccess();
  const [toggling, setToggling] = useState(false);

  if (!IS_DEV_MODE || !user) return null;

  const handleForceToggle = async () => {
    if (!user?.uid) return;
    setToggling(true);
    try {
      const newGranted = !isEconomyAdvancedUnlocked;
      const tokenRef = doc(db, 'access_tokens_economy', user.uid);
      await setDoc(tokenRef, {
        userId: user.uid,
        ownerId: user.uid,
        granted: newGranted,
        reason: newGranted ? 'DEV: Forced unlock' : 'DEV: Forced lock',
        scoreAtGrant: capacityScore,
        updatedAt: serverTimestamp(),
        grantedAt: newGranted ? serverTimestamp() : null,
      });
      console.log(`[SystemStatusPanel] Force-toggled economy access → granted=${newGranted}`);
    } catch (err) {
      console.error('[SystemStatusPanel] Force toggle failed (rules block client writes in prod):', err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 p-3 rounded-xl bg-surface-2/80 border border-border/40 shadow-lg backdrop-blur-md text-xs text-text-muted w-56">
      <h4 className="text-accent font-display text-[10px] uppercase tracking-[0.15em] mb-2">
        System Status
      </h4>

      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between">
          <span>Capacity</span>
          <span className="text-text font-mono">{capacityScore.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Ekonomi Adv.</span>
          <span className={isEconomyAdvancedUnlocked ? 'text-success' : 'text-danger'}>
            {isLoading ? '...' : isEconomyAdvancedUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
        {updatedAt && (
          <div className="flex justify-between">
            <span>Senast</span>
            <span className="text-text-dim font-mono truncate ml-2">
              {new Date(updatedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleForceToggle}
        disabled={toggling || isLoading}
        className="min-h-11 w-full rounded-lg border border-accent/30 bg-accent/10 px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-accent-light transition-colors hover:border-accent/60 hover:bg-accent/25 disabled:opacity-40"
      >
        {toggling ? 'Skriver...' : isEconomyAdvancedUnlocked ? 'Tvingad låsning' : 'Tvingad upplåsning'}
      </button>
    </div>
  );
};
