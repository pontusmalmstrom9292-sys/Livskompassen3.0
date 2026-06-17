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
} from './callables/inbox';

export {
  beginVaultWebAuthnChallengeCallable as beginVaultWebAuthnChallenge,
  issueVaultSession,
  issueVaultSessionViaBiometric,
  getEntityProfileRegistry,
  addEntityProfile,
  valvChatQuery,
  generateDossier,
  rescanPatternMetadata,
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
} from './callables/processBrusfilter';
