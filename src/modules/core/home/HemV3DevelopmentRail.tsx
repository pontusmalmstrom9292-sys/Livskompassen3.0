/**
 * @locked MOD-CORE-UTV — låst modul; unlock via docs/evaluations/*-unlock-MOD-CORE-UTV.md
 * Prod Hem-rail — re-export of DevelopmentBentoWidget.
 * Logic: DevelopmentBentoWidget + hemV3DevelopmentCards + homeCapacityGate.
 * Smoke anchors retained for design-modules wiring check.
 */
import {
  HEM_V3_DEVELOPMENT_CARDS,
  filterDevelopmentCardsForPreset,
} from './hemV3DevelopmentCards';
import { isLowHomeCapacity } from './homeCapacityGate';

export { DevelopmentBentoWidget as HemV3DevelopmentRail, DevelopmentBentoWidget } from './DevelopmentBentoWidget';

/** Referenced so smoke:design-modules can assert wiring symbols remain reachable. */
export const __hemV3RailSmokeAnchors = {
  HEM_V3_DEVELOPMENT_CARDS,
  filterDevelopmentCardsForPreset,
  isLowHomeCapacity,
} as const;
