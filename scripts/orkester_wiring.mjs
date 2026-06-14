/**
 * orkester_wiring.mjs
 * Evaluates economy access using a 7-day capacity score based on MåBra checkins.
 * Uses Firebase Admin SDK to maintain WORM integrity.
 */
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  // In a real environment, this expects GOOGLE_APPLICATION_CREDENTIALS to be set,
  // or it runs inside a GCP environment where default credentials apply.
  admin.initializeApp({
    projectId: 'gen-lang-client-0481875058'
  });
}

const db = admin.firestore();

const THRESHOLD_STABLE = 0.7;

/**
 * calculateCapacityScore: Admin SDK equivalent of capacity_engine
 * Calculates a 7-day moving average capacity score based on MåBra checkins.
 * 
 * @param {string} uid The user ID
 * @returns {Promise<number>} Normalized value between 0 and 1
 */
async function calculateCapacityScore(uid) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const q = db.collection('checkins')
    .where('userId', '==', uid)
    .where('questionId', '==', 'mabra_checkin')
    .where('createdAt', '>=', sevenDaysAgo.toISOString());

  const snapshot = await q.get();

  if (snapshot.empty) {
    return 0;
  }

  let totalScore = 0;
  let count = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    let docScore = 0;
    let validFields = 0;

    if (typeof data.mood === 'number') {
      docScore += data.mood;
      validFields++;
    }
    if (typeof data.energy === 'number') {
      docScore += data.energy;
      validFields++;
    }

    if (validFields > 0) {
      const normalizedDocScore = (docScore / validFields) / 10;
      totalScore += normalizedDocScore;
      count++;
    }
  });

  return count > 0 ? totalScore / count : 0;
}

/**
 * Arbetsfunktion evaluate_economy_access
 * Körs regelbundet (t.ex. av en cron/autorun script).
 * 
 * @param {string} uid The user ID to evaluate
 */
export async function evaluate_economy_access(uid) {
  try {
    console.log(`[evaluate_economy_access] Starting evaluation for user ${uid}`);
    
    // Använd capacity_engine-logiken för att hämta det aktuella resultatet
    const score = await calculateCapacityScore(uid);
    console.log(`[evaluate_economy_access] Capacity score for ${uid}: ${score.toFixed(2)}`);

    const granted = score > THRESHOLD_STABLE;
    console.log(`[evaluate_economy_access] Score ${score.toFixed(2)} ${granted ? '>' : '<='} threshold ${THRESHOLD_STABLE}`);

    const didWrite = await writeAccessGrant(uid, granted);
    if (didWrite) {
      console.log(`[evaluate_economy_access] Access token updated for ${uid} (granted=${granted})`);
    }
  } catch (error) {
    console.error(`[evaluate_economy_access] Error for user ${uid}:`, error);
  }
}

/**
 * writeAccessGrant: Writes (or updates) the access_tokens_economy/{uid} document.
 * Only writes if the granted state differs from current Firestore state (minimizes writes).
 *
 * @param {string} uid The user ID
 * @param {boolean} granted Whether advanced economy access is granted
 * @returns {Promise<boolean>} True if a write occurred, false if skipped (no change)
 */
export async function writeAccessGrant(uid, granted) {
  const tokenRef = db.collection('access_tokens_economy').doc(uid);
  const snap = await tokenRef.get();

  if (snap.exists) {
    const current = snap.data();
    if (current.granted === granted) {
      console.log(`[writeAccessGrant] No change for ${uid} (granted=${granted}), skipping write.`);
      return false;
    }
  }

  await tokenRef.set({
    userId: uid,
    ownerId: uid,
    granted,
    reason: granted ? 'MåBra Capacity Score stable' : 'Capacity below threshold',
    scoreAtGrant: granted ? THRESHOLD_STABLE : 0,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    grantedAt: granted ? admin.firestore.FieldValue.serverTimestamp() : (snap.exists ? snap.data().grantedAt : null),
  });

  console.log(`[writeAccessGrant] Written granted=${granted} for ${uid}`);
  return true;
}

// Om scriptet körs direkt från CLI, t.ex. `node scripts/orkester_wiring.mjs <uid>`
if (process.argv[1].includes('orkester_wiring.mjs')) {
  const uid = process.argv[2];
  if (!uid) {
    console.error('Usage: node scripts/orkester_wiring.mjs <uid>');
    process.exit(1);
  }
  evaluate_economy_access(uid).then(() => process.exit(0));
}
