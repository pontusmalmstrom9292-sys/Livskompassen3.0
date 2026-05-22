import { AgentCard } from '../types';

/** Runtime executor IDs — sub-agents with Cloud Function backing via KompisSupervisor */
export const EXECUTOR_AGENT_IDS = {
  livsArkivarien: 'agent_livs_arkivarien',
  gransArkitekten: 'agent_grans_arkitekten',
} as const;

export const LivsArkivarienCard: AgentCard = {
  metadata: {
    id: EXECUTOR_AGENT_IDS.livsArkivarien,
    name: 'Livs-Arkivarien',
    description: 'Mönster-Arkivarien: historik, Minne och semantisk RAG.',
    version: '1.1.0',
  },
  capabilities: [
    {
      name: 'searchKampspar',
      description: 'Semantisk sökning (RAG) i användarens Minne.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          limit: { type: 'number' },
        },
        required: ['query'],
      },
    },
  ],
  dataAccessPolicy: {
    canAccessPII: false,
    allowedCollections: ['kampspar', 'rutiner'],
  },
};

export const GransArkitektenCard: AgentCard = {
  metadata: {
    id: EXECUTOR_AGENT_IDS.gransArkitekten,
    name: 'Gräns-Arkitekten',
    description: 'BIFF-Skölden + Brusfiltret: Grey Rock, DCAP och kommunikationsskydd.',
    version: '1.1.0',
  },
  capabilities: [
    {
      name: 'analyzeCommunication',
      description: 'Analyserar input för manipulativa mönster (JADE, DARVO).',
      parameters: {
        type: 'object',
        properties: { textInput: { type: 'string' } },
        required: ['textInput'],
      },
    },
    {
      name: 'generateGreyRockResponse',
      description: 'Genererar neutralt BIFF/Grey Rock-svar.',
      parameters: {
        type: 'object',
        properties: { context: { type: 'string' } },
        required: ['context'],
      },
    },
  ],
  dataAccessPolicy: {
    canAccessPII: false,
    allowedCollections: [],
  },
};

/** Produktroller (AGENTS.md) — metadata för A2A-registret; routing via resolveExecutor */
export const SanningsAnalytikernCard: AgentCard = {
  metadata: {
    id: 'agent_sannings_analytikern',
    name: 'Sannings-Analytikern',
    description: 'Klinisk bevisanalys, VIVIR, strikt JSON — noll empati.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'analyzeEvidence',
      description: 'Korsför bevis mot VaultLog och EntityProfile.',
      parameters: {
        type: 'object',
        properties: { claim: { type: 'string' } },
        required: ['claim'],
      },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: ['vault', 'reality_vault'] },
};

export const BrusfiltretCard: AgentCard = {
  metadata: {
    id: 'agent_brusfiltret',
    name: 'Brusfiltret',
    description: 'Tvättar affektivt laddad input till rena fakta och tidslinje.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'extractFacts',
      description: 'Extraherar logistik (10%) från känslomässigt brus (90%).',
      parameters: {
        type: 'object',
        properties: { textInput: { type: 'string' } },
        required: ['textInput'],
      },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: [] },
};

export const BiffSkoldenCard: AgentCard = {
  metadata: {
    id: 'agent_biff_skolden',
    name: 'BIFF-Skölden',
    description: 'Brief, Informative, Friendly, Firm — Grey Rock-svar.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'generateGreyRockResponse',
      description: 'Omskriver affektivt svar till neutral kommunikation.',
      parameters: {
        type: 'object',
        properties: { draft: { type: 'string' } },
        required: ['draft'],
      },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: [] },
};

export const ParalysBrytarenCard: AgentCard = {
  metadata: {
    id: 'agent_paralys_brytaren',
    name: 'Paralys-Brytaren',
    description: 'Exakt ett mikrosteg vid exekutiv dysfunktion.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'nextMicroStep',
      description: 'Returnerar ett enda, fysiskt grundat mikrosteg.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: ['rutiner'] },
};

export const RsdKylarenCard: AgentCard = {
  metadata: {
    id: 'agent_rsd_kylaren',
    name: 'RSD-Kylaren',
    description: 'Rationaliserar RSD-triggers med evidensbaserade alternativ.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'reframeTrigger',
      description: 'Erbjuder rationellt alternativ till avvisningskänsla.',
      parameters: {
        type: 'object',
        properties: { trigger: { type: 'string' } },
        required: ['trigger'],
      },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: [] },
};

export const UppgiftsKrossarenCard: AgentCard = {
  metadata: {
    id: 'agent_uppgifts_krossaren',
    name: 'Uppgifts-Krossaren',
    description: 'Delar uppgifter i atomer (max 30 sekunder).',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'atomizeTask',
      description: 'Bryter ner uppgift till testbara delsteg.',
      parameters: {
        type: 'object',
        properties: { task: { type: 'string' } },
        required: ['task'],
      },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: ['rutiner'] },
};

export const SpeglingsCoachenCard: AgentCard = {
  metadata: {
    id: 'agent_speglings_coachen',
    name: 'Speglings-Coachen',
    description: 'ACT-validering utan fixande — max 2–4 meningar.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'mirrorFeeling',
      description: 'Speglar känsla utan att lösa problem.',
      parameters: {
        type: 'object',
        properties: { reflection: { type: 'string' } },
        required: ['reflection'],
      },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: [] },
};

export const MonsterArkivarienCard: AgentCard = {
  metadata: {
    id: 'agent_monster_arkivarien',
    name: 'Mönster-Arkivarien',
    description: 'Forensisk makroanalys över Minne och Drive-ingest.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'forensicPatternScan',
      description: 'Identifierar långsiktiga mönster i bevisarkiv.',
      parameters: {
        type: 'object',
        properties: { timeRange: { type: 'string' } },
        required: [],
      },
    },
  ],
  dataAccessPolicy: { canAccessPII: false, allowedCollections: ['kampspar'] },
};

/** Alla registrerade AgentCards (A2A-registret) */
export const AvailableAgents: Record<string, AgentCard> = {
  [LivsArkivarienCard.metadata.id]: LivsArkivarienCard,
  [GransArkitektenCard.metadata.id]: GransArkitektenCard,
  [SanningsAnalytikernCard.metadata.id]: SanningsAnalytikernCard,
  [BrusfiltretCard.metadata.id]: BrusfiltretCard,
  [BiffSkoldenCard.metadata.id]: BiffSkoldenCard,
  [ParalysBrytarenCard.metadata.id]: ParalysBrytarenCard,
  [RsdKylarenCard.metadata.id]: RsdKylarenCard,
  [UppgiftsKrossarenCard.metadata.id]: UppgiftsKrossarenCard,
  [SpeglingsCoachenCard.metadata.id]: SpeglingsCoachenCard,
  [MonsterArkivarienCard.metadata.id]: MonsterArkivarienCard,
};

/** Mappar produktroll → runtime-executor (deterministisk, ingen LLM-routing) */
export function resolveExecutorId(productAgentId: string): string {
  switch (productAgentId) {
    case BiffSkoldenCard.metadata.id:
    case BrusfiltretCard.metadata.id:
    case SanningsAnalytikernCard.metadata.id:
      return EXECUTOR_AGENT_IDS.gransArkitekten;
    case MonsterArkivarienCard.metadata.id:
      return EXECUTOR_AGENT_IDS.livsArkivarien;
    case ParalysBrytarenCard.metadata.id:
    case UppgiftsKrossarenCard.metadata.id:
    case RsdKylarenCard.metadata.id:
    case SpeglingsCoachenCard.metadata.id:
      return EXECUTOR_AGENT_IDS.livsArkivarien;
    default:
      return productAgentId;
  }
}

export type SupervisorRoute = {
  productAgentId: string;
  executorId: string;
  intent: string;
};

/** DCAP → deterministisk agent + intent (KompisSupervisor använder executorId) */
export function routeFromDcap(
  riskScore: number,
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT'
): SupervisorRoute {
  if (recommendedAction === 'ALERT' || riskScore >= 70) {
    return {
      productAgentId: BiffSkoldenCard.metadata.id,
      executorId: EXECUTOR_AGENT_IDS.gransArkitekten,
      intent: 'generateGreyRockResponse',
    };
  }
  if (recommendedAction === 'COACHING' || riskScore >= 30) {
    return {
      productAgentId: GransArkitektenCard.metadata.id,
      executorId: EXECUTOR_AGENT_IDS.gransArkitekten,
      intent: 'analyzeCommunication',
    };
  }
  return {
    productAgentId: LivsArkivarienCard.metadata.id,
    executorId: EXECUTOR_AGENT_IDS.livsArkivarien,
    intent: 'searchKampspar',
  };
}
