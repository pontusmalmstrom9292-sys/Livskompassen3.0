import { auth } from '@/core/firebase/init';

export type ProjectWriteAuth = {
  uid: string;
};

/**
 * Säkerställ att Firestore-skrivning sker med aktiv Firebase Auth-session.
 * Rules kräver userId == ownerId == request.auth.uid.
 */
export function assertProjectWriteAuth(expectedUserId?: string): ProjectWriteAuth {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Logga in för att spara projekt.');
  }
  if (expectedUserId && expectedUserId !== uid) {
    throw new Error('Inloggningen stämmer inte — logga ut och in igen.');
  }
  return { uid };
}
