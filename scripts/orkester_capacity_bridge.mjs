import { calculateCapacityScore } from '../src/modules/core/evolution/capacity_engine.ts';

async function dryRun(uid) {
  console.log(`[DryRun] Beräknar capacity_score för UID: ${uid}...`);
  try {
    const score = await calculateCapacityScore(uid);
    console.log(`[DryRun] Förväntat numeriskt värde (0.0-1.0): ${score}`);
  } catch (err) {
    console.error(`[DryRun] Error:`, err);
  }
}

dryRun('dummy-test-uid');
