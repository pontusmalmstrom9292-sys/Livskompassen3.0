import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../core/firebase/init';
import type { ChildAlias } from '../constants';

export interface ChildrenLogCitation {
  docId: string;
  childAlias: string;
  date: string;
  excerpt: string;
}

export interface ChildrenLogsQueryResult {
  answer: string;
  citations: ChildrenLogCitation[];
  silo: 'barnen';
}

const childrenLogsQueryCallable = httpsCallable(functions, 'childrenLogsQuery');

export async function callChildrenLogsQuery(
  question: string,
  childAlias?: ChildAlias
): Promise<ChildrenLogsQueryResult> {
  try {
    const result = await childrenLogsQueryCallable({
      question,
      childAlias: childAlias ?? undefined,
    });
    return result.data as ChildrenLogsQueryResult;
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för Familjen-frågor.');
    }
    throw new Error(
      fnError.message || 'Kunde inte hämta svar från livsloggarna. Försök igen senare.'
    );
  }
}
