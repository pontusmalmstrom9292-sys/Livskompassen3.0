import { getFirestore } from 'firebase-admin/firestore';
// Obs: Detta skript är avsett att köras i en säker Node.js miljö (Backend / Cloud Run Job)
// med Firebase Admin SDK, därav används firebase-admin och inte webb-klienten.

export async function deleteOldInteractions(db: FirebaseFirestore.Firestore, retentionDays: number = 30) {
  const retentionDate = new Date();
  retentionDate.setDate(retentionDate.getDate() - retentionDays);

  console.log(`[GDPR] Startar radering av Minne-händelser äldre än: ${retentionDate.toISOString()}`);

  const kampsparRef = db.collection('kampspar_logs');
  
  // Fråga efter dokument som är äldre än retentionDate
  const snapshot = await kampsparRef.where('timestamp', '<', retentionDate).get();

  if (snapshot.empty) {
    console.log('[GDPR] Inga händelser att radera.');
    return;
  }

  // Använd batching för prestanda (max 500 operationer per batch)
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
    // Notera: I en fullskalig RAG-applikation måste vi även anropa Vertex AI Vector Search 
    // här för att radera den associerade inbäddningsvektorn via doc.data().embeddingVectorId
  });

  await batch.commit();
  console.log(`[GDPR] Raderade ${snapshot.size} dokument framgångsrikt.`);
}
