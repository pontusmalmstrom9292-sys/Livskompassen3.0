/**
 * Schema Registry — single source for Gemini responseSchema, FTD export, and validators.
 * Pipeline Studio: npm run pipeline:validate
 */

export {
  BRUSFILTER_RESPONSE_SCHEMA,
  validateBrusfilterResponse,
  type BrusfilterResponse,
  type BrusfilterRecommendedAction,
} from './brusfilter';

export {
  BIFF_REWRITE_RESPONSE_SCHEMA,
  validateBiffRewriteResponse,
  type BiffRewriteResponse,
  type BiffToneCheck,
} from './biffRewrite';

export {
  DOSSIER_FOREWORD_RESPONSE_SCHEMA,
  validateDossierForewordResponse,
  type DossierForewordResponse,
  type DossierTimelineRow,
} from './dossierForeword';

export {
  PATTERN_ASSIST_RESPONSE_SCHEMA,
  validatePatternAssistResponse,
  type PatternAssistResponse,
} from './patternAssist';

export {
  VALV_CHAT_READ_TOOLS,
  validateValvChatResponse,
  type ValvChatResponse,
  type ValvChatCitation,
} from './valvChat';

export {
  validateInkastClassifyResponse,
  type InkastClassifyResponse,
  type InboxRouting,
} from './inkastClassify';

/** P1 tool IDs registered in docs/pipeline-studio/tools/ */
export const P1_FLOW_TOOL_IDS = [
  'flow_brusfilter',
  'flow_biff_rewrite',
  'flow_dossier_foreword',
  'flow_pattern_assist',
  'flow_inkast_classify',
  'flow_valv_chat',
] as const;

export type P1FlowToolId = (typeof P1_FLOW_TOOL_IDS)[number];
