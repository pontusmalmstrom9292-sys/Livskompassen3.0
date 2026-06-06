import { randomBytes } from 'crypto';
import * as admin from 'firebase-admin';

const PAIRINGS = 'barnporten_pairings';
const DEVICES = 'barnporten_devices';
const PAIR_TTL_MS = 15 * 60 * 1000;
const CHILD_ALIASES = new Set(['Kasper', 'Arvid']);

function pairingToken(): string {
  return randomBytes(4).toString('hex');
}

function assertChildAlias(raw: unknown): string {
  const alias = typeof raw === 'string' ? raw.trim() : '';
  if (!CHILD_ALIASES.has(alias)) {
    throw new Error('Ogiltigt barn-alias. Välj Kasper eller Arvid.');
  }
  return alias;
}

function assertDeviceId(raw: unknown): string {
  const deviceId = typeof raw === 'string' ? raw.trim() : '';
  if (deviceId.length < 8 || deviceId.length > 128) {
    throw new Error('Ogiltigt enhets-id.');
  }
  return deviceId;
}

export type BarnportenPairingCreateResult = {
  token: string;
  childAlias: string;
  expiresAt: string;
  pairUrl: string;
};

export async function createBarnportenPairingForUser(
  uid: string,
  childAliasRaw: unknown,
  origin: string,
): Promise<BarnportenPairingCreateResult> {
  const childAlias = assertChildAlias(childAliasRaw);
  const db = admin.firestore();
  let token = pairingToken();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const ref = db.collection(PAIRINGS).doc(token);
    const existing = await ref.get();
    if (!existing.exists) {
      const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + PAIR_TTL_MS));
      await ref.set({
        ownerId: uid,
        userId: uid,
        childAlias,
        token,
        status: 'pending',
        expiresAt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      const base = origin.replace(/\/$/, '');
      return {
        token,
        childAlias,
        expiresAt: expiresAt.toDate().toISOString(),
        pairUrl: `${base}/barnporten?pair=${token}`,
      };
    }
    token = pairingToken();
  }
  throw new Error('Kunde inte skapa kopplingskod. Försök igen.');
}

export type BarnportenPairingClaimResult = {
  childAlias: string;
  deviceId: string;
  deviceDocId: string;
};

export async function claimBarnportenPairingForUser(
  uid: string,
  tokenRaw: unknown,
  deviceIdRaw: unknown,
  deviceLabelRaw?: unknown,
): Promise<BarnportenPairingClaimResult> {
  const token = typeof tokenRaw === 'string' ? tokenRaw.trim().toLowerCase() : '';
  if (!/^[a-f0-9]{8}$/.test(token)) {
    throw new Error('Ogiltig kopplingskod.');
  }
  const deviceId = assertDeviceId(deviceIdRaw);
  const deviceLabel =
    typeof deviceLabelRaw === 'string' && deviceLabelRaw.trim()
      ? deviceLabelRaw.trim().slice(0, 48)
      : 'Barnenhet';

  const db = admin.firestore();
  const pairingRef = db.collection(PAIRINGS).doc(token);

  return db.runTransaction(async (tx) => {
    const pairingSnap = await tx.get(pairingRef);
    if (!pairingSnap.exists) {
      throw new Error('Kopplingskoden hittades inte.');
    }
    const pairing = pairingSnap.data()!;
    if (pairing.ownerId !== uid) {
      throw new Error('Logga in med samma konto som skapade koden.');
    }
    if (pairing.status !== 'pending') {
      throw new Error('Koden är redan använd.');
    }
    const expiresAt = pairing.expiresAt as admin.firestore.Timestamp;
    if (expiresAt.toMillis() < Date.now()) {
      throw new Error('Koden har gått ut. Be pappa skapa en ny QR.');
    }

    const deviceDocId = `${uid}_${deviceId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
    const deviceRef = db.collection(DEVICES).doc(deviceDocId);
    const existingDevice = await tx.get(deviceRef);

    tx.update(pairingRef, {
      status: 'claimed',
      claimedDeviceId: deviceId,
      claimedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (!existingDevice.exists) {
      tx.set(deviceRef, {
        ownerId: uid,
        userId: uid,
        childAlias: String(pairing.childAlias),
        deviceId,
        deviceLabel,
        pairingToken: token,
        parentApprovedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      tx.update(deviceRef, {
        childAlias: String(pairing.childAlias),
        deviceLabel,
        pairingToken: token,
        parentApprovedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {
      childAlias: String(pairing.childAlias),
      deviceId,
      deviceDocId,
    };
  });
}
