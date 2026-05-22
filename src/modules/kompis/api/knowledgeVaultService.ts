import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../core/firebase/init';

export interface KnowledgeVaultCitation {
  docId: string;
  collection: 'kampspar' | 'kb_docs';
  date: string;
  title: string;
  excerpt: string;
}

export interface KnowledgeVaultResult {
  answer: string;
  citations: KnowledgeVaultCitation[];
  moduleRoute?: {
    path: string;
    label: string;
    silo: 'barnen';
  };
}

const knowledgeVaultQueryCallable = httpsCallable(functions, 'knowledgeVaultQuery');

export const callKnowledgeVault = async (query: string): Promise<KnowledgeVaultResult> => {
  try {
    const result = await knowledgeVaultQueryCallable({ prompt: query });
    return result.data as KnowledgeVaultResult;
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
