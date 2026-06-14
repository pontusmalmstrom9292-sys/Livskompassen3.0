import * as admin from 'firebase-admin';
import {
  patternIdsHash,
  scanTextForTactics,
  TACTIC_LIBRARY_VERSION,
  uniqueKunskapFactIds,
  uniqueTechniques,
} from './tacticPatternLibrary';

export const PATTERN_SCAN_METADATA_COLLECTION = 'pattern_scan_metadata';

export type PatternScanLayer = 'REGEX' | 'DCAP';

export type PatternScanMetadataInput = {
  userId: string;
  sourceRef: string;
  text: string;
  scanLayer?: PatternScanLayer;
};

function vaultLogSearchableText(data: admin.firestore.DocumentData): string {
  const parts = [
    data.truth,
    data.theirVersion,
    data.myReality,
    data.shieldWhat,
    data.shieldFeeling,
    data.shieldBoundary,
    ...(Array.isArray(data.bodySignals) ? data.bodySignals : []),
  ];
  return parts.filter(Boolean).join('\n');
}

async function duplicateExists(
  sourceRef: string,
  libraryVersion: string,
  scanLayer: PatternScanLayer,
  patternHash: string,
): Promise<boolean> {
  const snap = await admin
    .firestore()
    .collection(PATTERN_SCAN_METADATA_COLLECTION)
    .where('sourceRef', '==', sourceRef)
    .where('libraryVersion', '==', libraryVersion)
    .where('scanLayer', '==', scanLayer)
    .where('patternIdsHash', '==', patternHash)
    .limit(1)
    .get();
  return !snap.empty;
}

/**
 * Append-only sidecar — muterar aldrig reality_vault beviskropp.
 */
export async function writePatternScanMetadata(
  input: PatternScanMetadataInput,
): Promise<string | null> {
  const { userId, sourceRef, text } = input;
  const scanLayer = input.scanLayer ?? 'REGEX';

  const vaultSnap = await admin.firestore().collection('reality_vault').doc(sourceRef).get();
  if (!vaultSnap.exists) {
    console.warn('[patternScan] sourceRef saknas:', sourceRef);
    return null;
  }
  const vaultData = vaultSnap.data()!;
  const ownerId = String(vaultData.ownerId ?? vaultData.userId ?? '');
  if (ownerId !== userId) {
    console.warn('[patternScan] owner mismatch:', sourceRef);
    return null;
  }
  if (vaultData.category === 'vävaren_metadata') {
    return null;
  }

  const scanText = text.trim() || vaultLogSearchableText(vaultData);
  const matches = scanTextForTactics(scanText);
  if (matches.length === 0) return null;

  const patternIds = matches.map((m) => m.patternId);
  const hash = patternIdsHash(patternIds);
  if (await duplicateExists(sourceRef, TACTIC_LIBRARY_VERSION, scanLayer, hash)) {
    return null;
  }

  const matchedSpans = matches.slice(0, 3).map((m) => ({
    patternId: m.patternId,
    excerpt: m.matchedText.slice(0, 120),
  }));

  const docRef = await admin.firestore().collection(PATTERN_SCAN_METADATA_COLLECTION).add({
    userId,
    ownerId: userId,
    sourceRef,
    techniques: uniqueTechniques(matches),
    patternIds,
    patternIdsHash: hash,
    kunskapFactIds: uniqueKunskapFactIds(matches),
    scanLayer,
    libraryVersion: TACTIC_LIBRARY_VERSION,
    matchedSpans,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

export async function rescanAllVaultPatternMetadata(uid: string): Promise<number> {
  const snap = await admin
    .firestore()
    .collection('reality_vault')
    .where('ownerId', '==', uid)
    .limit(500)
    .get();

  let written = 0;
  for (const doc of snap.docs) {
    if (doc.data().category === 'vävaren_metadata') continue;
    const id = await writePatternScanMetadata({
      userId: uid,
      sourceRef: doc.id,
      text: vaultLogSearchableText(doc.data()),
      scanLayer: 'REGEX',
    });
    if (id) written += 1;
  }
  return written;
}
