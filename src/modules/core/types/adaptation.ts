export type {
  AdaptationLedgerEntry,
  AdaptationLedgerSource,
  AdaptationLedgerType,
  AdaptationPrefsDoc,
  AdaptationSilo,
  CoachTone,
  UiDensity,
} from '../../../../shared/adaptation/adaptationTypes';

export {
  ADAPTATION_LAYER_FLAG,
  DEFAULT_ADAPTATION_PREFS,
} from '../../../../shared/adaptation/adaptationTypes';

export type { AdaptationSemanticProfileDoc } from '../../../../shared/adaptation/adaptationSemanticTypes';

export {
  ADAPTATION_SEMANTIC_FLAG,
  ADAPTATION_SEMANTIC_REBUILD_VERSION,
  buildSemanticProfileFromPrefs,
  extractTopRouteSignals,
} from '../../../../shared/adaptation/adaptationSemanticTypes';

export {
  adaptationLedgerDedupKey,
  collectLedgerEntriesFromPrefsDiff,
  prefsLedgerFingerprint,
} from '../../../../shared/adaptation/adaptationLedgerSync';
