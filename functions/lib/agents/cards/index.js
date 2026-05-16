"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableAgents = exports.GransArkitektenCard = exports.LivsArkivarienCard = void 0;
exports.LivsArkivarienCard = {
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
exports.GransArkitektenCard = {
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
exports.AvailableAgents = {
    [exports.LivsArkivarienCard.metadata.id]: exports.LivsArkivarienCard,
    [exports.GransArkitektenCard.metadata.id]: exports.GransArkitektenCard,
};
//# sourceMappingURL=index.js.map