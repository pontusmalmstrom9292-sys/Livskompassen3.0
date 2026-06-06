import { HomeAdaptiveCompass } from '@/core/home/HomeAdaptiveCompass';
import { compassFlowToPhase } from '@/core/home/homeCompassPhase';
import { useLifeHubPreset } from '@/core/lifeOs/useLifeHubPreset';

type DashboardPageProps = {
  embedded?: boolean;
  variant?: 'page' | 'hero' | 'hub' | 'module';
  forcedFlow?: 'morning' | 'day' | 'evening';
  onCheckInSaved?: () => void;
};

/**
 * Vardagen — Mina Kompasser. Delegates to HomeAdaptiveCompass (Obsidian Calm 2.0).
 */
export function DashboardPage({ forcedFlow, onCheckInSaved }: DashboardPageProps = {}) {
  const { preset, presetId } = useLifeHubPreset();
  const forcedPhase = forcedFlow ? compassFlowToPhase(forcedFlow) : null;

  return (
    <div className="home-adaptive-compass home-adaptive-compass--hub">
      <header className="home-adaptive-compass__hub-head">
        <p className="font-display-serif text-[10px] uppercase tracking-[0.26em] text-text-dim">Vardagen</p>
        <h2 className="font-display-serif text-sm uppercase tracking-[0.2em] text-accent">Mina kompasser</h2>
        <p className="mt-1 text-xs text-text-muted">Dygnsrytm — morgon, dag och kväll.</p>
      </header>
      <HomeAdaptiveCompass
        onSaved={onCheckInSaved}
        preset={preset}
        presetId={presetId}
        forcedPhase={forcedPhase}
      />
    </div>
  );
}
