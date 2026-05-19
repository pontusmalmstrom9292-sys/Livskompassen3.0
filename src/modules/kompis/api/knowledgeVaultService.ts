import { httpsCallable, type FunctionsError } from 'firebase/functions';
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
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för Kunskapsvalvet.');
    }
    throw new Error(
      fnError.message || 'Kunde inte hämta svar från Knowledge Vault. Försök igen senare.'
    );
  }
};
