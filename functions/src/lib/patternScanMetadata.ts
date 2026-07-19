import { admin } from './firebaseAdmin';
import {
  patternIdsHash,
  scanTextForTactics,
  TACTIC_LIBRARY_VERSION,
  uniqueKunskapFactIds,
  uniqueTechniques,
  type TacticMatch,
} from './tacticPatternLibrary';
import {
  dcapGatePatternAssist,
  suggestPatternIdsViaLlm,
  tacticMatchesFromLlmPatternIds,
} from './patternMetadataAssist';

export { TACTIC_LIBRARY_VERSION };
export const PATTERN_SCAN_METADATA_COLLECTION = 'pattern_scan_metadata';

export type PatternScanLayer = 'REGEX' | 'DCAP' | 'FLOW';

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

async function loadVaultScanContext(
  userId: string,
  sourceRef: string,
  _text: string,
): Promise<{ scanText: string } | null> {
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
  // MUST NOT lita på klient-supplied text — skanna alltid WORM-kroppen.
  const scanText = vaultLogSearchableText(vaultData);
  if (!scanText.trim()) return null;
  return { scanText };
}

async function existingPatternIdsForSource(sourceRef: string): Promise<Set<string>> {
  const snap = await admin
    .firestore()
    .collection(PATTERN_SCAN_METADATA_COLLECTION)
    .where('sourceRef', '==', sourceRef)
    .where('libraryVersion', '==', TACTIC_LIBRARY_VERSION)
    .limit(50)
    .get();

  const ids = new Set<string>();
  for (const doc of snap.docs) {
    const row = doc.data().patternIds;
    if (Array.isArray(row)) {
      for (const id of row) ids.add(String(id));
    }
  }
  return ids;
}

/**
 * Append-only sidecar — muterar aldrig reality_vault beviskropp.
 */
export async function writePatternScanMetadataFromMatches(
  input: PatternScanMetadataInput,
  matches: TacticMatch[],
): Promise<string | null> {
  if (matches.length === 0) return null;

  const { userId, sourceRef } = input;
  const scanLayer = input.scanLayer ?? 'REGEX';
  const ctx = await loadVaultScanContext(userId, sourceRef, input.text);
  if (!ctx) return null;

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

export async function writePatternScanMetadata(
  input: PatternScanMetadataInput,
): Promise<string | null> {
  const scanLayer = input.scanLayer ?? 'REGEX';
  const ctx = await loadVaultScanContext(input.userId, input.sourceRef, input.text);
  if (!ctx) return null;

  const matches = scanTextForTactics(ctx.scanText);
  return writePatternScanMetadataFromMatches({ ...input, scanLayer }, matches);
}

/** P3 Flow-assist — kompletterar REGEX; skriver endast nya patternIds i FLOW-lager. */
export async function assistFlowPatternMetadataForSource(
  userId: string,
  sourceRef: string,
  geminiApiKey?: string,
): Promise<string | null> {
  const ctx = await loadVaultScanContext(userId, sourceRef, '');
  if (!ctx) return null;

  const gate = dcapGatePatternAssist(ctx.scanText);
  if (!gate.allow) return null;

  const existing = await existingPatternIdsForSource(sourceRef);
  const suggested = await suggestPatternIdsViaLlm(ctx.scanText, geminiApiKey);
  const novelIds = suggested.filter((id) => !existing.has(id));
  if (novelIds.length === 0) return null;

  const matches = tacticMatchesFromLlmPatternIds(ctx.scanText, novelIds);
  return writePatternScanMetadataFromMatches(
    { userId, sourceRef, text: ctx.scanText, scanLayer: 'FLOW' },
    matches,
  );
}

export async function assistAllVaultFlowPatternMetadata(
  uid: string,
  geminiApiKey?: string,
  limit = 25,
): Promise<number> {
  const snap = await admin
    .firestore()
    .collection('reality_vault')
    .where('ownerId', '==', uid)
    .limit(limit)
    .get();

  let written = 0;
  for (const doc of snap.docs) {
    if (doc.data().category === 'vävaren_metadata') continue;
    const id = await assistFlowPatternMetadataForSource(uid, doc.id, geminiApiKey);
    if (id) written += 1;
  }
  return written;
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
