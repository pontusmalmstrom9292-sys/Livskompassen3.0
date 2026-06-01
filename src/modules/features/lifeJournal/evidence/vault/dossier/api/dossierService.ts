import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import type { GenerateDossierInput, GenerateDossierResult } from '../types';

const generateDossierCallable = httpsCallable<GenerateDossierInput, GenerateDossierResult>(
  functions,
  'generateDossier',
);

export async function generateDossier(
  input: GenerateDossierInput,
): Promise<GenerateDossierResult> {
  try {
    const result = await generateDossierCallable(input);
    return result.data;
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/not-found' || fnError.code === 'functions/unimplemented') {
      throw new Error(
        'Backend generateDossier är inte deployad än. Wizard och urval är klara — nästa steg är Cloud Function + dossier_snapshots.',
      );
    }
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för att generera dossier.');
    }
    throw new Error(fnError.message || 'Kunde inte generera dossier.');
  }
}
