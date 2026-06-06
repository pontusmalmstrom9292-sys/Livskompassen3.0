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
    <HomeAdaptiveCompass
      onSaved={onCheckInSaved}
      preset={preset}
      presetId={presetId}
      forcedPhase={forcedPhase}
    />
  );
}
