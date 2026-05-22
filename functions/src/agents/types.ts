/**
 * A2A (Agent2Agent) Protocol Types
 * Definierar strukturer för hur agenter kommunicerar i Livskompassen.
 */

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
}

export interface AgentCapability {
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema för parametrar
}

export interface AgentCard {
  metadata: AgentMetadata;
  capabilities: AgentCapability[];
  // Policy för vilken data agenten tillåts se (Gatekeeper-principen)
  dataAccessPolicy: {
    canAccessPII: boolean;
    allowedCollections: string[];
  };
}

export interface A2AMessage {
  fromAgentId: string;
  toAgentId: string;
  timestamp: string;
  intent: string;
  payload: Record<string, any>; // Data som skickas mellan agenter
  contextId?: string; // T.ex. Firebase Request UID för spårbarhet
}

export interface AgentResponse {
  agentId: string;
  status: 'SUCCESS' | 'ERROR' | 'DELEGATED';
  data?: any;
  error?: string;
  delegatedTo?: string; // Om agenten skickat uppgiften vidare
}
