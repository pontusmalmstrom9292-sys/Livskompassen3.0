import { calculateScoreFromDocs } from '../src/modules/core/evolution/capacity_engine.ts';

async function dryRun(uid) {
  console.log(`[DryRun] Beräknar capacity_score för UID: ${uid}...`);
  try {
    // Mock checkins from Firestore
    const mockCheckins = [
      { mood: 10, energy: 10 }, // Perfect score: 1.0
      { mood: 5, energy: 5 },   // Half score: 0.5
      { mood: 0, energy: 0 }    // Lowest score: 0.0
    ];
    
    // (1.0 + 0.5 + 0.0) / 3 = 0.5
    const score = calculateScoreFromDocs(mockCheckins);
    console.log(`[DryRun] Förväntat numeriskt värde (0.0-1.0): ${score}`);
  } catch (err) {
    console.error(`[DryRun] Error:`, err);
  }
}

dryRun('dummy-test-uid');
