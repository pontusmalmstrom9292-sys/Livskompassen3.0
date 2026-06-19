/**
 * Cloud Functions entry — re-export only.
 * Implementation split under ./callables/ (maintainability, same deploy names).
 */
import './callables/shared';

export {
  generateEmbedding,
  knowledgeVaultQuery,
  childrenLogsQuery,
  getContextCacheStatus,
  ingestKampsparEntry,
  ingestKnowledgeDocument,
} from './callables/knowledge';

export {
  getInboxQueue,
  confirmInboxItem,
  dismissInboxItem,
  previewInboxClassification,
  submitInkastLite,
  reprocessVaultInboxQueue,
} from './callables/inbox';

export { recordDiscoveryMilestone } from './callables/evolutionLedger';

export { resolveDcapAlert } from './callables/dcapAlert';

export { scheduledBarnportenAgeEval } from './jobs/barnportenAgeEvalJob';

export {
  beginVaultWebAuthnChallengeCallable as beginVaultWebAuthnChallenge,
  beginVaultBiometricChallengeCallable as beginVaultBiometricChallenge,
  issueVaultSession,
  issueVaultSessionViaBiometric,
  getEntityProfileRegistry,
  addEntityProfile,
  valvChatQuery,
  generateDossier,
  rescanPatternMetadata,
  assistPatternMetadata,
  writePatternScanMetadataCallable,
} from './callables/valv';

export {
  analyzeMessage,
  invalidateSession,
  scheduledRetentionJob,
  notifyNewFile,
  weaveJournalEntry,
  approveWeaverMetadata,
  rejectWeaverMetadata,
  journalWovenToKampspar,
  getAgentRegistry,
  speglingsMirror,
  journalQuickMirror,
  mabraCoach,
  ingestWidgetRecording,
  breakDownResponse,
  crushTask,
  scheduledGeneratePayslip,
  createBarnportenPairing,
  claimBarnportenPairing,
  generatePayslip,
} from './callables/agents';

export {
  mabraEconomySync,
} from './economy/mabraEconomySync';

export { onVaultCreatePatternScan } from './triggers/patternScanOnVaultCreate';
export { onInkastEvidenceFinalized } from './triggers/inkastStorageOnFinalize';
export { onEvolutionHubWrite } from './triggers/onEvolutionHubWrite';
export { onAdaptationPrefsWrite } from './triggers/onAdaptationPrefsWrite';

export {
  calculateSmartAllocation,
} from './economy/calculateSmartAllocation';

export {
  analyzeProjectImage,
} from './callables/projectMedia';

export {
  generateCompassInsight,
} from './callables/compass';

export {
  chatWithKompis,
} from './callables/kompis';

export {
  generateWeeklySummary,
} from './callables/weeklySummary';

export {
  generateWeeklyInsights,
} from './callables/generateWeeklyInsights';

export {
  unlockVault,
} from './callables/unlockVault';

export {
  parseVoiceCommand,
} from './callables/voiceCommand';

export {
  processBrusfilter,
  processBrusfilter as previewInkastClean,
} from './callables/processBrusfilter';

export { biffRewriteDraft } from './callables/biffRewriteDraft';
export { generateKompassrad } from './callables/generateKompassrad';
export { journalSilentReflection } from './callables/journalSilentReflection';

export {
  getAdaptationProfile,
  recordAdaptationSignal,
} from './callables/adaptation';

export {
  getAdaptationSemanticProfile,
  rebuildAdaptationSemanticProfile,
} from './callables/adaptationSemantic';

export { recordPipelineRun } from './callables/pipelineStudio';
