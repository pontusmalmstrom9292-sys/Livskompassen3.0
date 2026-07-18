import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

export interface IngestKampsparInput {
  title: string;
  content: string;
  category?: string;
  entryType?: string;
  tags?: string[];
  source?: string;
  eventDate?: string;
}

export interface IngestKampsparResult {
  docId: string;
  embeddingDim: number | null;
  embedStatus?: string;
}

const ingestKampsparEntryCallable = httpsCallable(functions, 'ingestKampsparEntry');
const promoteKbDocCallable = httpsCallable(functions, 'promoteKbDocToKampspar');

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

/** HITL: en bekräftelse — kb_docs → kampspar livsminne. */
export async function promoteKbDocToKampspar(kbDocId: string): Promise<IngestKampsparResult & { toast?: string }> {
  try {
    const result = await promoteKbDocCallable({ kbDocId });
    return result.data as IngestKampsparResult & { toast?: string };
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för att spara i Minne.');
    }
    throw new Error(fnError.message || 'Kunde inte spara i Minne.');
  }
}
