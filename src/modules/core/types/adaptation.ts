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

export {
  adaptationLedgerDedupKey,
  collectLedgerEntriesFromPrefsDiff,
  prefsLedgerFingerprint,
} from '../../../../shared/adaptation/adaptationLedgerSync';
