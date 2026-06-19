import { HomeAdaptiveCompass } from '@/core/home/HomeAdaptiveCompass';
import { compassFlowToPhase } from '@/core/home/homeCompassPhase';
import { useLifeHubPreset } from '@/core/lifeOs/useLifeHubPreset';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';

type DashboardPageProps = {
  embedded?: boolean;
  variant?: 'page' | 'hero' | 'hub' | 'module';
  forcedFlow?: 'morning' | 'day' | 'evening';
  onCheckInSaved?: () => void;
};

/**
 * Vardagen — Mina Kompasser. Delegates to HomeAdaptiveCompass (Obsidian Calm 2.0).
 */
export function DashboardPage({
  variant = 'hub',
  forcedFlow,
  onCheckInSaved,
}: DashboardPageProps = {}) {
  const { preset, presetId } = useLifeHubPreset();
  const forcedPhase = forcedFlow ? compassFlowToPhase(forcedFlow) : null;
  const isModule = variant === 'module';

  return (
    <HubErrorBoundary title="Kompasser kunde inte laddas" glow="gold" logTag="DashboardPage">
    <div
      className={isModule ? 'home-adaptive-compass home-adaptive-compass--module' : 'home-adaptive-compass home-adaptive-compass--hub'}
    >
      {!isModule ? (
        <BentoCard
          bare
          glow="gold"
          className="home-adaptive-compass__hub-head mx-auto mb-3 max-w-2xl rounded-[14px] border-[2px] border-accent/20 px-4 py-4 text-center"
        >
          <p className="font-display-serif text-[10px] uppercase tracking-[0.26em] text-text-dim">Vardagen</p>
          <h2 className="font-display-serif text-sm uppercase tracking-[0.2em] text-accent">Mina kompasser</h2>
          <p className="mt-1 text-xs text-text-muted">Dygnsrytm — morgon, dag och kväll.</p>
        </BentoCard>
      ) : null}
      <HomeAdaptiveCompass
        onSaved={onCheckInSaved}
        preset={preset}
        presetId={presetId}
        forcedPhase={forcedPhase}
      />
    </div>
    </HubErrorBoundary>
  );
}
