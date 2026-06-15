import { loadFirebaseAdmin } from './lib/firebaseAdmin.mjs';

const admin = loadFirebaseAdmin();

const db = admin.firestore();

const THRESHOLD_STABLE = 0.5;

async function runCapabilityGate() {
  console.log('[orkester_capability_gate] Starting capability evaluation...');
  try {
    const progressDocs = await db.collection('mabra_progress').get();
    
    for (const doc of progressDocs.docs) {
      const uid = doc.id;
      const data = doc.data();
      const coreValues = data.coreValues || [];
      const coreValuesCount = coreValues.length;
      
      let score = 0;
      if (coreValuesCount >= 5) {
        score = 1.0;
      } else if (coreValuesCount >= 2) {
        score = 0.5;
      } else if (coreValuesCount > 0) {
        score = 0.2;
      }
      
      console.log(`[orkester_capability_gate] UID: ${uid}, Core Values: ${coreValuesCount}, Score: ${score}`);
      
      const capabilityRef = db.collection('user_capability_state').doc(uid);
      const isAdvanced = score >= THRESHOLD_STABLE;
      
      await capabilityRef.set({
        userId: uid,
        ownerId: uid,
        capacityScore: score,
        economy_advanced: isAdvanced,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log(`[orkester_capability_gate] Updated user_capability_state for ${uid}: advanced=${isAdvanced}`);
    }
  } catch (error) {
    console.error('[orkester_capability_gate] Error during capability evaluation:', error);
    process.exit(1);
  }
  
  console.log('[orkester_capability_gate] Capability evaluation completed.');
}

if (process.argv[1].includes('orkester_capability_gate.mjs')) {
  runCapabilityGate().then(() => process.exit(0));
}
