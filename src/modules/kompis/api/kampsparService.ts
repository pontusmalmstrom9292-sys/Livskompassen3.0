import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../core/firebase/init';

export interface IngestKampsparInput {
  title: string;
  content: string;
  category?: string;
  source?: string;
  eventDate?: string;
}

export interface IngestKampsparResult {
  docId: string;
  embeddingDim: number | null;
}

const ingestKampsparEntryCallable = httpsCallable(functions, 'ingestKampsparEntry');

export async function ingestKampsparEntry(input: IngestKampsparInput): Promise<IngestKampsparResult> {
  try {
    const result = await ingestKampsparEntryCallable(input);
    return result.data as IngestKampsparResult;
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för att spara i Minne.');
    }
    throw new Error(fnError.message || 'Kunde inte spara i Minne.');
  }
}
