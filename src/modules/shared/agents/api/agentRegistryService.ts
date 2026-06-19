import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import type { AgentRegistryResponse } from '../types/agentRegistry';

const getAgentRegistryCallable = httpsCallable<void, AgentRegistryResponse>(
  functions,
  'getAgentRegistry',
);

export async function fetchAgentRegistry(): Promise<AgentRegistryResponse> {
  try {
    const result = await getAgentRegistryCallable();
    return result.data;
  } catch (error) {
    console.error('Fel vid anrop till getAgentRegistry:', error);
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Logga in för att ladda agentregistret.');
    }
    if (fnError.code === 'functions/resource-exhausted') {
      throw new Error('För många försök — vänta en minut och försök igen.');
    }
    throw new Error(fnError.message || 'Kunde inte ladda agentregistret.');
  }
}
