import { HomeAdaptiveCompass } from '@/core/home/HomeAdaptiveCompass';
import { useLifeHubPreset } from '@/core/lifeOs/useLifeHubPreset';

type DashboardPageProps = {
  embedded?: boolean;
  variant?: 'page' | 'hero' | 'hub' | 'module';
  forcedFlow?: 'morning' | 'day' | 'evening';
  onCheckInSaved?: () => void;
};

/**
 * Vardagen — Mina Kompasser. Delegates to HomeAdaptiveCompass (Obsidian Calm 2.0).
 * `forcedFlow` / `variant` / `embedded` kept for API compatibility; compass is time-adaptive.
 */
export function DashboardPage({ onCheckInSaved }: DashboardPageProps = {}) {
  const { preset, presetId } = useLifeHubPreset();
  return <HomeAdaptiveCompass onSaved={onCheckInSaved} preset={preset} presetId={presetId} />;
}
