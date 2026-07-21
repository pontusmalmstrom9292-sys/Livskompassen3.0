import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { admin } from '../lib/firebaseAdmin';
import { GCP_REGION } from '../config';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';

const COL = 'drogfrihet_push';
const SAFE_BODIES = [
  'Ett ankare finns här.',
  'Du behöver inte agera på suget.',
  'Mikrosteg räcker idag.',
  'Öppna SOS om det känns tungt.',
  'En dag i taget — börja med nästa timme.',
] as const;

type Window = { startHour: number; endHour: number };

function clampHour(n: unknown, fallback: number): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(23, Math.floor(v)));
}

function inWindow(hour: number, start: number, end: number): boolean {
  if (start === end) return false;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

function stockholmHour(): number {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Stockholm',
    hour: 'numeric',
    hour12: false,
  });
  return Number(fmt.format(new Date()));
}

function pickBody(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return SAFE_BODIES[h % SAFE_BODIES.length]!;
}

function genBuddyCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

/** Sync FCM token + quiet/craving prefs (Admin-only collection — no client rules). */
export const syncDrogfrihetPushPrefs = onCall({ region: GCP_REGION, memory: '256MiB' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'syncDrogfrihetPushPrefs', 20);
  const data = (request.data ?? {}) as Record<string, unknown>;
  const fcmToken = typeof data.fcmToken === 'string' ? data.fcmToken.slice(0, 4096) : '';
  const optIn = Boolean(data.optIn);
  const quietStartHour = clampHour(data.quietStartHour, 22);
  const quietEndHour = clampHour(data.quietEndHour, 7);
  const cravingWindows: Window[] = Array.isArray(data.cravingWindows)
    ? data.cravingWindows.slice(0, 3).map((w) => {
        const row = (w ?? {}) as Record<string, unknown>;
        return { startHour: clampHour(row.startHour, 17), endHour: clampHour(row.endHour, 19) };
      })
    : [{ startHour: 17, endHour: 19 }];

  const ref = admin.firestore().collection(COL).doc(uid);
  const existing = await ref.get();
  let buddyCode = typeof existing.data()?.buddyCode === 'string' ? String(existing.data()!.buddyCode) : '';
  if (!buddyCode) buddyCode = genBuddyCode();

  await ref.set(
    {
      uid,
      fcmToken: fcmToken || FieldValue.delete(),
      optIn,
      quietStartHour,
      quietEndHour,
      cravingWindows,
      buddyCode,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { ok: true as const, buddyCode };
});

/** Self nudge via FCM — respects opt-in + quiet/craving + 1/day. */
export const sendDrogfrihetNudge = onCall({ region: GCP_REGION, memory: '256MiB' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'sendDrogfrihetNudge', 10);
  const snap = await admin.firestore().collection(COL).doc(uid).get();
  if (!snap.exists) throw new HttpsError('failed-precondition', 'Synka preferenser först.');
  const d = snap.data()!;
  if (!d.optIn) throw new HttpsError('failed-precondition', 'Opt-in krävs.');
  const token = typeof d.fcmToken === 'string' ? d.fcmToken : '';
  if (!token) throw new HttpsError('failed-precondition', 'Ingen FCM-token.');

  const hour = stockholmHour();
  if (inWindow(hour, Number(d.quietStartHour ?? 22), Number(d.quietEndHour ?? 7))) {
    return { ok: false as const, reason: 'quiet_hours' };
  }
  const windows: Window[] = Array.isArray(d.cravingWindows) ? d.cravingWindows : [];
  const inCrave = windows.some((w) => inWindow(hour, Number(w.startHour), Number(w.endHour)));
  if (!inCrave) return { ok: false as const, reason: 'outside_window' };

  const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Stockholm' }).format(new Date());
  if (d.lastNudgeDayKey === dayKey) return { ok: false as const, reason: 'already_today' };

  const body = pickBody(`${uid}:${dayKey}`);
  await admin.messaging().send({
    token,
    notification: { title: 'Livskompassen', body },
    data: { type: 'drogfrihet_nudge', path: '/widget/drogfrihet-akut' },
    android: {
      priority: 'high',
      notification: { channelId: 'drogfrihet_reminders' },
    },
  });

  await snap.ref.set({ lastNudgeDayKey: dayKey, lastNudgeAt: FieldValue.serverTimestamp() }, { merge: true });
  return { ok: true as const };
});

/** Link to buddy via their 6-char code (mutual, no Valv share). */
export const linkDrogfrihetBuddy = onCall({ region: GCP_REGION, memory: '256MiB' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'linkDrogfrihetBuddy', 10);
  const code = String((request.data as { code?: string })?.code ?? '')
    .trim()
    .toUpperCase()
    .slice(0, 8);
  if (code.length < 4) throw new HttpsError('invalid-argument', 'Ogiltig kod.');

  const db = admin.firestore();
  const q = await db.collection(COL).where('buddyCode', '==', code).limit(2).get();
  if (q.empty) throw new HttpsError('not-found', 'Koden hittades inte.');
  const buddyDoc = q.docs[0]!;
  const buddyUid = buddyDoc.id;
  if (buddyUid === uid) throw new HttpsError('invalid-argument', 'Det är din egen kod.');

  await db.collection(COL).doc(uid).set(
    { buddyUid, linkedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  await buddyDoc.ref.set(
    { buddyUid: uid, linkedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  return { ok: true as const, buddyUid };
});

/** Soft buddy ping — generic copy only, rate-limited. */
export const pingDrogfrihetBuddy = onCall({ region: GCP_REGION, memory: '256MiB' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'pingDrogfrihetBuddy', 6);
  const me = await admin.firestore().collection(COL).doc(uid).get();
  const buddyUid = typeof me.data()?.buddyUid === 'string' ? String(me.data()!.buddyUid) : '';
  if (!buddyUid) throw new HttpsError('failed-precondition', 'Ingen buddy länkad.');

  const buddy = await admin.firestore().collection(COL).doc(buddyUid).get();
  const token = typeof buddy.data()?.fcmToken === 'string' ? String(buddy.data()!.fcmToken) : '';
  if (!token) throw new HttpsError('failed-precondition', 'Buddy har ingen push-token.');

  const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Stockholm' }).format(new Date());
  if (me.data()?.lastBuddyPingDayKey === dayKey) {
    return { ok: false as const, reason: 'already_today' };
  }

  await admin.messaging().send({
    token,
    notification: {
      title: 'Livskompassen',
      body: 'En trygg person tänker på dig. Ankare finns.',
    },
    data: { type: 'drogfrihet_buddy_ping', path: '/widget/drogfrihet-akut' },
    android: {
      priority: 'high',
      notification: { channelId: 'drogfrihet_reminders' },
    },
  });

  await me.ref.set(
    { lastBuddyPingDayKey: dayKey, lastBuddyPingAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  return { ok: true as const };
});
