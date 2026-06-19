/** Frontend mirror of functions/src/agents/types.ts — AgentCard from getAgentRegistry. */

export type AgentRegistryCapability = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type AgentRegistryCard = {
  metadata: {
    id: string;
    name: string;
    description: string;
    version: string;
  };
  capabilities: AgentRegistryCapability[];
  dataAccessPolicy: {
    canAccessPII: boolean;
    allowedCollections: string[];
  };
};

export type AgentRegistryResponse = {
  agents: AgentRegistryCard[];
};

export type ProductAgentUiMeta = {
  role: string;
  focus: string;
  zoneLabel?: string;
};
