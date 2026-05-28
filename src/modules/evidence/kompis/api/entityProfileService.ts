import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../../core/firebase/init';

export type EntityRole = 'MOTPART' | 'BARN' | 'ANVANDARE' | 'NATVERK' | 'MYNDIGHET' | 'SKOLA';

export interface EntityProfileSummary {
  entityKey: string;
  role: EntityRole;
  displayName: string;
  aliases: string[];
  category: string | null;
  isKeyEntity: boolean;
}

export interface SystemSynapseSummary {
  title: string;
  category: string;
  analysis: string;
  groundingPoints: string[];
  hallucinationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  relatedEntityKeys: string[];
}

export interface EntityProfileRegistryResult {
  profiles: EntityProfileSummary[];
  synapses: SystemSynapseSummary[];
}

const getEntityProfileRegistryCallable = httpsCallable(functions, 'getEntityProfileRegistry');

export async function fetchEntityProfileRegistry(): Promise<EntityProfileRegistryResult> {
  try {
    const result = await getEntityProfileRegistryCallable({});
    return result.data as EntityProfileRegistryResult;
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för aktörskartan.');
    }
    throw new Error(fnError.message || 'Kunde inte hämta aktörskartan.');
  }
}
