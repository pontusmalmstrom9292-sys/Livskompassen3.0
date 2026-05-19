import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/firebase/init';

const knowledgeVaultQueryCallable = httpsCallable(functions, 'knowledgeVaultQuery');

interface KnowledgeVaultResponse {
  response: string;
}

export const callKnowledgeVault = async (query: string): Promise<string> => {
  try {
    const result = await knowledgeVaultQueryCallable({ prompt: query });
    return (result.data as KnowledgeVaultResponse).response;
  } catch (error) {
    console.error('Fel vid anrop till knowledgeVaultQuery:', error);
    throw new Error('Kunde inte hamta svar fran Knowledge Vault. Forsok igen senare.');
  }
};
