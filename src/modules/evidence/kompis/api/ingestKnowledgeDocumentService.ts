import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../core/firebase/init';

export type IngestKnowledgeDocumentInput = {
  fileName: string;
  mimeType: string;
  base64: string;
  sourceLabel?: string;
  tags?: string[];
};

export type IngestKnowledgeDocumentResult = {
  docId: string;
  embeddingDim: number | null;
  fileName: string;
  mimeType: string;
  analyzed: boolean;
};

const ingestKnowledgeDocumentCallable = httpsCallable<
  IngestKnowledgeDocumentInput,
  IngestKnowledgeDocumentResult
>(functions, 'ingestKnowledgeDocument');

export async function ingestKnowledgeDocument(
  input: IngestKnowledgeDocumentInput,
): Promise<IngestKnowledgeDocumentResult> {
  try {
    const result = await ingestKnowledgeDocumentCallable(input);
    return result.data;
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för dokumentuppladdning.');
    }
    throw new Error(fnError.message || 'Kunde inte indexera dokumentet.');
  }
}

/** Läser fil till base64 (utan data:-prefix). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result;
      if (typeof raw !== 'string') {
        reject(new Error('Kunde inte läsa filen.'));
        return;
      }
      const base64 = raw.includes(',') ? raw.split(',')[1]! : raw;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Filläsning misslyckades.'));
    reader.readAsDataURL(file);
  });
}
