import { AgentCard } from '../types';

export const LivsArkivarienCard: AgentCard = {
  metadata: {
    id: 'agent_livs_arkivarien',
    name: 'Livs-Arkivarien',
    description: 'Hanterar historik, Kampspår och mönsterigenkänning.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'searchKampspar',
      description: 'Utför semantisk sökning (RAG) i användarens Kampspår.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          limit: { type: 'number' }
        },
        required: ['query']
      }
    }
  ],
  dataAccessPolicy: {
    canAccessPII: false, // PII maskeras innan det når RAG
    allowedCollections: ['kampspar', 'rutiner'],
  }
};

export const GransArkitektenCard: AgentCard = {
  metadata: {
    id: 'agent_grans_arkitekten',
    name: 'Gräns-Arkitekten',
    description: 'Specialiserad på BIFF-metoden, Grey Rock och kommunikationsskydd.',
    version: '1.0.0',
  },
  capabilities: [
    {
      name: 'analyzeCommunication',
      description: 'Analyserar input för manipulativa mönster (JADE, DARVO).',
      parameters: {
        type: 'object',
        properties: {
          textInput: { type: 'string' }
        },
        required: ['textInput']
      }
    },
    {
      name: 'generateGreyRockResponse',
      description: 'Genererar ett känslokallt, neutralt svar enligt BIFF-metoden.',
      parameters: {
        type: 'object',
        properties: {
          context: { type: 'string' }
        },
        required: ['context']
      }
    }
  ],
  dataAccessPolicy: {
    canAccessPII: false,
    allowedCollections: [], // Jobbar endast med given in-memory text
  }
};

// Registrera alla tillgängliga agenter
export const AvailableAgents: Record<string, AgentCard> = {
  [LivsArkivarienCard.metadata.id]: LivsArkivarienCard,
  [GransArkitektenCard.metadata.id]: GransArkitektenCard,
};
