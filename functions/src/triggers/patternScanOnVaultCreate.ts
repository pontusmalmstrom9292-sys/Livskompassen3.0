import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { GCP_REGION } from '../config';
import { writePatternScanMetadata } from '../lib/patternScanMetadata';

/** Deterministisk REGEX-sidecar vid ny WORM-post (ej vävaren_metadata). */
export const onVaultCreatePatternScan = onDocumentCreated(
  {
    document: 'reality_vault/{docId}',
    region: GCP_REGION,
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    if (data.category === 'vävaren_metadata') return;

    const uid = String(data.ownerId ?? data.userId ?? '');
    if (!uid) return;

    const text = [
      data.truth,
      data.theirVersion,
      data.myReality,
      data.shieldWhat,
      data.shieldFeeling,
      data.shieldBoundary,
      ...(Array.isArray(data.bodySignals) ? data.bodySignals : []),
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await writePatternScanMetadata({
        userId: uid,
        sourceRef: snap.id,
        text,
        scanLayer: 'REGEX',
      });
    } catch (err) {
      console.error('[onVaultCreatePatternScan]', snap.id, err);
    }
  },
);
