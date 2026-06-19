import { getFirestore, FieldValue, type FieldValue as FieldValueType } from 'firebase-admin/firestore';

export type PipelineRunStatus = 'spawned' | 'PASS' | 'FAIL' | 'validated' | 'exported';

export interface PipelineRunRecord {
  userId: string;
  ownerId: string;
  toolId: string;
  status: PipelineRunStatus;
  schemaVersion: string;
  smokeTier?: number;
  commitSha?: string;
  errorCode?: string;
  createdAt: FieldValueType;
}

const COLLECTION = 'pipeline_runs';

/** Append-only metadata — no PII, no user content. */
export async function appendPipelineRun(
  uid: string,
  data: Omit<PipelineRunRecord, 'userId' | 'ownerId' | 'createdAt'>,
): Promise<string> {
  const db = getFirestore();
  const ref = db.collection(COLLECTION).doc();
  await ref.set({
    userId: uid,
    ownerId: uid,
    createdAt: FieldValue.serverTimestamp(),
    ...data,
  });
  return ref.id;
}
