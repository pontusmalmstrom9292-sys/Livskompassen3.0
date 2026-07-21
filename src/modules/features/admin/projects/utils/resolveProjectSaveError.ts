import { FirebaseError } from 'firebase/app';

/** Begripliga fel för projekt/create/upload — en källa för alla UI-ytor. */
export function resolveProjectSaveError(err: unknown, context?: 'project' | 'block' | 'upload'): string {
  if (err instanceof FirebaseError) {
    if (err.code === 'permission-denied') {
      if (context === 'upload') {
        return 'Uppladdning nekad. Logga in med Google via Konto (uppe till höger) och försök igen.';
      }
      return 'Behörighet saknas. Logga in med Google via Konto (uppe till höger) och försök igen.';
    }
    if (err.code === 'storage/unauthorized') {
      return 'Uppladdning nekad. Logga in igen och försök.';
    }
    if (err.code === 'unauthenticated') {
      return 'Du är utloggad. Logga in och försök igen.';
    }
    if (err.message && err.message.length < 220) {
      return err.message;
    }
  }

  const msg = err instanceof Error ? err.message : String(err ?? '');
  if (/insufficient permissions|permission-denied|tillstånd/i.test(msg)) {
    return 'Behörighet saknas. Logga in med Google via Konto (uppe till höger) och försök igen.';
  }
  if (/storage\/unauthorized/i.test(msg)) {
    return 'Uppladdning nekad. Logga in igen och försök.';
  }
  if (msg.includes('Logga in') || msg.includes('Inloggningen')) {
    return msg;
  }

  if (context === 'upload') return 'Kunde inte ladda upp filen. Försök igen.';
  if (context === 'block') return 'Kunde inte spara projektblock.';
  return 'Kunde inte skapa projekt.';
}
