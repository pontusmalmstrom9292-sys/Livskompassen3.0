import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  initializeFirestore,
  limit,
  onSnapshot,
  orderBy,
  persistentLocalCache,
  persistentMultipleTabManager,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { app } from './init';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import type {
  CheckIn,
  KampsparEntryRow,
  KbDocEntryRow,
  MabraSession,
  UserWidget,
  UserWidgetRow,
  VaultLog,
  WeaverTags,
} from '../types/firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import {
  normalizeStringArray,
  normalizeVaultLogFields,
} from '@/features/lifeJournal/evidence/vault/utils/normalizeVaultLog';

/** IndexedDB persistence via Firebase v12 local cache (ersätter enableIndexedDbPersistence). */
function initFirestoreDb() {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (err) {
    /* HMR / redan initierad / multitab — återanvänd befintlig instans */
    if (import.meta.env.DEV) {
      console.debug('[firestore] persistence init skipped, using existing instance', err);
    }
    return getFirestore(app);
  }
}

export const db = initFirestoreDb();

type FirestorePayload = Record<string, unknown>;

const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'] as const;

/** WORM — append-only payloads must not carry mutation fields. */
function assertWormPayload(data: FirestorePayload, context: string): void {
  for (const key of WORM_FORBIDDEN_KEYS) {
    if (key in data) {
      throw new Error(`WORM violation (${context}): field "${key}" is not allowed on create.`);
    }
  }
}

function omitUndefinedFields(data: FirestorePayload): FirestorePayload {
  const out: FirestorePayload = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function withUserId(userId: string, data: FirestorePayload): FirestorePayload {
  return { ...data, userId, ownerId: userId, createdAt: serverTimestamp() };
}

/** List queries must constrain ownerId to satisfy Firestore rules (isOwner). */
function ownerScopedQuery(ref: ReturnType<typeof collection>, ownerId: string) {
  return query(ref, where('ownerId', '==', ownerId));
}

function normalizeCreatedAt(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function sortByCreatedAtDesc<T extends { createdAt?: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}

export async function saveCheckIn(userId: string, checkIn: Omit<CheckIn, 'userId' | 'createdAt'>) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.checkins);
  const ref = collection(db, FIRESTORE_COLLECTIONS.checkins);
  const docRef = await addDoc(ref, withUserId(userId, { ...checkIn }));
  return docRef.id;
}

export type CheckInRow = CheckIn & { id: string };

export async function getRecentCheckIns(userId: string, limit = 20): Promise<CheckInRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.checkins);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: String(data.userId ?? userId),
        questionId: data.questionId as string | undefined,
        questionText: data.questionText as string | undefined,
        optionSelected: data.optionSelected as string | undefined,
        taskCategory: data.taskCategory as string | undefined,
        taskNote: data.taskNote as string | undefined,
        taskText: data.taskText as string | undefined,
        taskCompleted: data.taskCompleted as boolean | undefined,
        createdAt: normalizeCreatedAt(data.createdAt),
      };
    })
  ).slice(0, limit);
}

export type JournalAttachmentWrite = {
  url: string;
  storagePath: string;
  name: string;
  mimeType: string;
  size: number;
};

export function createJournalEntryId(): string {
  return doc(collection(db, FIRESTORE_COLLECTIONS.journal)).id;
}

export async function saveJournalEntry(
  userId: string,
  entry: {
    mood: string;
    text: string;
    category?: string;
    tags?: string[];
    attachment?: JournalAttachmentWrite;
  },
  options?: { entryId?: string },
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.journal);
  const payload = omitUndefinedFields({
    mood: entry.mood,
    text: entry.text,
    category: entry.category,
    tags: entry.tags?.length ? entry.tags : undefined,
    attachment: entry.attachment,
  });

  if (options?.entryId) {
    await setDoc(
      doc(db, FIRESTORE_COLLECTIONS.journal, options.entryId),
      withUserId(userId, payload),
    );
    return options.entryId;
  }

  const refCol = collection(db, FIRESTORE_COLLECTIONS.journal);
  const docRef = await addDoc(refCol, withUserId(userId, payload));
  return docRef.id;
}

export async function saveVaultLog(
  userId: string,
  log: Omit<VaultLog, 'userId' | 'createdAt'>
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.reality_vault);
  const payload = omitUndefinedFields({ ...log, isLocked: true } as FirestorePayload);
  assertWormPayload(payload, 'reality_vault');
  const ref = collection(db, FIRESTORE_COLLECTIONS.reality_vault);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function saveChildrenLog(
  userId: string,
  log: {
    childAlias: string;
    observation: string;
    childrenImpact?: string;
    category?: string;
    action?: string;
    signals?: { somn: number; angest: number; aptit: number };
    authorRole?: 'child' | 'parent';
    channel?: 'barnporten' | 'familjen' | 'middag' | 'widget';
    visibility?: 'private_child' | 'parent' | 'vault_candidate';
    contentType?: 'text' | 'voice' | 'mood' | 'step';
    /** Barnen-PLAY-BANK (BP-PLAY-*) — metadata, ej Valv. */
    bankId?: string;
  }
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.children_logs);
  const action = log.action ?? 'livslogg';
  const payload: FirestorePayload = {
    childAlias: log.childAlias,
    action,
    category: log.category,
    childrenImpact: log.childrenImpact,
    authorRole: log.authorRole,
    channel: log.channel,
    visibility: log.visibility,
    contentType: log.contentType,
    bankId: log.bankId,
  };

  if (action === 'fysiologi') {
    payload.signals = log.signals;
    payload.observation = log.observation || undefined;
  } else {
    payload.observation = log.observation;
    payload.truth = log.observation;
  }

  assertWormPayload(payload, 'children_logs');
  const ref = collection(db, FIRESTORE_COLLECTIONS.children_logs);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function saveMabraSession(
  userId: string,
  session: {
    exerciseType: 'breathing' | 'grounding' | 'reframing' | 'daglig_mix';
    durationSeconds: number;
    hubSymptom?: string;
    cardBankId?: string;
    playBankId?: string;
    mixDateKey?: string;
  }
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.mabra_sessions);
  const ref = collection(db, FIRESTORE_COLLECTIONS.mabra_sessions);
  const payload: FirestorePayload = {
    exerciseType: session.exerciseType,
    durationSeconds: session.durationSeconds,
  };
  if (session.hubSymptom) {
    payload.hubSymptom = session.hubSymptom;
  }
  if (session.cardBankId) {
    payload.cardBankId = session.cardBankId;
  }
  if (session.playBankId) {
    payload.playBankId = session.playBankId;
  }
  if (session.mixDateKey) {
    payload.mixDateKey = session.mixDateKey;
  }
  assertWormPayload(payload, 'mabra_sessions');
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function listMabraSessionsRecent(
  userId: string,
  max = 30,
): Promise<Pick<MabraSession, 'hubSymptom' | 'exerciseType' | 'createdAt'>[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.mabra_sessions);
  const snap = await getDocs(query(ref, where('ownerId', '==', userId), limit(max)));
  const rows = snap.docs.map((d) => {
    const data = d.data();
    return {
      hubSymptom: typeof data.hubSymptom === 'string' ? data.hubSymptom : undefined,
      exerciseType: String(data.exerciseType ?? ''),
      createdAt:
        data.createdAt && typeof data.createdAt === 'object' && 'toDate' in data.createdAt
          ? (data.createdAt as { toDate: () => Date }).toDate().toISOString()
          : '',
    };
  });
  return rows
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, max);
}

export async function getMabraProgress(userId: string): Promise<{ coreValues: string[] } | null> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.mabra_progress, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  const coreValues = Array.isArray(data.coreValues)
    ? data.coreValues.filter((v): v is string => typeof v === 'string')
    : [];
  return { coreValues };
}

export async function saveMabraProgress(userId: string, coreValues: string[]) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.mabra_progress);
  const ref = doc(db, FIRESTORE_COLLECTIONS.mabra_progress, userId);
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      coreValues,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export const VAULT_LOGS_PAGE_SIZE = 50;

export type VaultLogsCursor = QueryDocumentSnapshot<DocumentData>;

export type VaultLogsPage = {
  logs: (VaultLog & { id: string })[];
  nextCursor: VaultLogsCursor | null;
  hasMore: boolean;
};

export type GetVaultLogsOptions = {
  limit?: number;
  cursor?: VaultLogsCursor;
};

function mapVaultLogDoc(d: QueryDocumentSnapshot<DocumentData>): VaultLog & { id: string } {
  const data = d.data();
  const { createdAt: _rawCreatedAt, weaverTags: _weaverTags, bodySignals: _bodySignals, ...rest } =
    data;
  return normalizeVaultLogFields({
    id: d.id,
    ...(rest as VaultLog),
    bodySignals: normalizeStringArray(_bodySignals),
    createdAt: normalizeCreatedAt(_rawCreatedAt),
    weaverTags: _weaverTags as WeaverTags | undefined,
  });
}

export async function getVaultLogs(
  userId: string,
  options?: GetVaultLogsOptions,
): Promise<VaultLogsPage> {
  const limitCount = options?.limit ?? VAULT_LOGS_PAGE_SIZE;
  const ref = collection(db, FIRESTORE_COLLECTIONS.reality_vault);
  const constraints = [
    where('ownerId', '==', userId),
    orderBy('createdAt', 'desc'),
    ...(options?.cursor ? [startAfter(options.cursor)] : []),
    limit(limitCount),
  ];
  const snap = await getDocs(query(ref, ...constraints));
  const logs = snap.docs.map(mapVaultLogDoc);
  const hasMore = snap.docs.length === limitCount;
  const nextCursor = hasMore ? (snap.docs[snap.docs.length - 1] ?? null) : null;
  return { logs, nextCursor, hasMore };
}

/** Dossier/Speglar — paginerar tills allt är hämtat. */
export async function getAllVaultLogs(userId: string): Promise<(VaultLog & { id: string })[]> {
  const rows: (VaultLog & { id: string })[] = [];
  let cursor: VaultLogsCursor | undefined;
  for (;;) {
    const page = await getVaultLogs(userId, cursor ? { cursor, limit: 100 } : { limit: 100 });
    rows.push(...page.logs);
    if (!page.hasMore || !page.nextCursor) break;
    cursor = page.nextCursor;
  }
  return rows;
}

export async function getChildrenLogs(userId: string) {
  const ref = collection(db, 'children_logs');
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs
      .filter((d) => d.data().visibility !== 'private_child')
      .map((d) => {
      const data = d.data();
      const observation =
        typeof data.observation === 'string'
          ? data.observation
          : data.observation == null
            ? undefined
            : String(data.observation);
      const truthRaw = data.truth;
      const truth =
        typeof truthRaw === 'string'
          ? truthRaw
          : truthRaw == null
            ? observation
            : String(truthRaw);
      return {
        id: d.id,
        ...data,
        observation,
        truth,
        createdAt: normalizeCreatedAt(data.createdAt),
      };
    }),
  );
}

function normalizeJournalAttachment(raw: unknown):
  | { url: string; storagePath: string; name: string; mimeType: string; size: number }
  | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const a = raw as Record<string, unknown>;
  const url = typeof a.url === 'string' ? a.url : '';
  const storagePath = typeof a.storagePath === 'string' ? a.storagePath : '';
  const name = typeof a.name === 'string' ? a.name : '';
  const mimeType = typeof a.mimeType === 'string' ? a.mimeType : '';
  const size = typeof a.size === 'number' ? a.size : Number(a.size) || 0;
  if (!url && !name) return undefined;
  return { url, storagePath, name, mimeType, size };
}

function normalizeJournalEntry(id: string, data: Record<string, unknown>) {
  return {
    id,
    mood: String(data.mood ?? ''),
    text: String(data.text ?? ''),
    userId: typeof data.userId === 'string' ? data.userId : undefined,
    ownerId: typeof data.ownerId === 'string' ? data.ownerId : undefined,
    createdAt: normalizeCreatedAt(data.createdAt),
    category: typeof data.category === 'string' ? data.category : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    attachment: normalizeJournalAttachment(data.attachment),
  };
}

export async function getJournalEntries(userId: string) {
  const ref = collection(db, 'journal');
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => normalizeJournalEntry(d.id, d.data() as Record<string, unknown>)),
  );
}

function mapKampsparDoc(
  d: { id: string; data: () => import('firebase/firestore').DocumentData },
  userId: string
): KampsparEntryRow {
  const data = d.data();
  return {
    id: d.id,
    userId: String(data.userId ?? userId),
    title: String(data.title ?? ''),
    content: String(data.content ?? ''),
    category: data.category ?? null,
    entryType: data.entryType ?? null,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    source: data.source ?? undefined,
    eventDate: data.eventDate ?? null,
    embeddingDim: data.embeddingDim ?? null,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

export async function getKampsparEntries(userId: string): Promise<KampsparEntryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.kampspar);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(snap.docs.map((d) => mapKampsparDoc(d, userId)));
}

/** G13 — live Tidshjulet: real-time kampspar listener (silo: kunskap only). */
export function subscribeKampsparEntries(
  userId: string,
  onData: (rows: KampsparEntryRow[]) => void,
  onError?: (err: Error) => void
): () => void {
  const ref = collection(db, FIRESTORE_COLLECTIONS.kampspar);
  return onSnapshot(
    ownerScopedQuery(ref, userId),
    (snap) => {
      const rows = sortByCreatedAtDesc(snap.docs.map((d) => mapKampsparDoc(d, userId)));
      onData(rows);
    },
    (err) => onError?.(err instanceof Error ? err : new Error(String(err)))
  );
}

function mapKbDocDoc(
  d: { id: string; data: () => import('firebase/firestore').DocumentData },
  userId: string,
): KbDocEntryRow {
  const data = d.data();
  return {
    id: d.id,
    userId: String(data.userId ?? userId),
    folderId: String(data.folderId ?? 'drive'),
    title: String(data.title ?? ''),
    content: String(data.content ?? ''),
    source: data.source ?? undefined,
    driveFileId: data.driveFileId ?? undefined,
    mimeType: data.mimeType ?? undefined,
    category: typeof data.category === 'string' ? data.category : null,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    inboxTags: Array.isArray(data.inboxTags) ? data.inboxTags.map(String) : undefined,
    inboxCategory: typeof data.inboxCategory === 'string' ? data.inboxCategory : null,
    embeddingDim: data.embeddingDim ?? null,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

export async function getKbDocsEntries(userId: string): Promise<KbDocEntryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.kb_docs);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(snap.docs.map((d) => mapKbDocDoc(d, userId)));
}

/** Live listener för kb_docs (Kunskap-silo). */
export function subscribeKbDocsEntries(
  userId: string,
  onData: (rows: KbDocEntryRow[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const ref = collection(db, FIRESTORE_COLLECTIONS.kb_docs);
  return onSnapshot(
    ownerScopedQuery(ref, userId),
    (snap) => {
      const rows = sortByCreatedAtDesc(snap.docs.map((d) => mapKbDocDoc(d, userId)));
      onData(rows);
    },
    (err) => onError?.(err instanceof Error ? err : new Error(String(err))),
  );
}

export async function saveEconomyTransaction(
  userId: string,
  tx: { label: string; amountSek: number; category: 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt' },
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.transactions);
  const payload: FirestorePayload = {
    label: tx.label,
    amountSek: tx.amountSek,
    category: tx.category,
  };
  assertWormPayload(payload, 'transactions');
  const ref = collection(db, FIRESTORE_COLLECTIONS.transactions);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function getEconomyTransactions(userId: string, limit = 30) {
  const ref = collection(db, FIRESTORE_COLLECTIONS.transactions);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        label: String(data.label ?? ''),
        amountSek: Number(data.amountSek ?? 0),
        category: String(data.category ?? 'ovrigt'),
        createdAt: normalizeCreatedAt(data.createdAt),
      };
    }),
  ).slice(0, limit);
}

export async function getEconomyProfile(userId: string) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    weeklyBudgetSek: Number(data.weeklyBudgetSek ?? 0),
    mealBoxPresetSek: Number(data.mealBoxPresetSek ?? 85),
  };
}

export async function setEconomyProfile(
  userId: string,
  profile: { weeklyBudgetSek: number; mealBoxPresetSek: number },
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_profiles);
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      weeklyBudgetSek: profile.weeklyBudgetSek,
      mealBoxPresetSek: profile.mealBoxPresetSek,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveUserWidget(
  userId: string,
  widget: Omit<UserWidget, 'userId' | 'ownerId' | 'createdAt'>
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.user_widgets);
  const ref = collection(db, FIRESTORE_COLLECTIONS.user_widgets);
  const docRef = await addDoc(
    ref,
    withUserId(userId, {
      type: widget.type,
      title: widget.title.slice(0, 100),
      pinnedToHome: widget.pinnedToHome,
      order: widget.order,
      config: widget.config,
    })
  );
  return docRef.id;
}

export async function updateUserWidgetConfig(
  _userId: string,
  widgetId: string,
  config: UserWidget['config']
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.user_widgets);
  const ref = doc(db, FIRESTORE_COLLECTIONS.user_widgets, widgetId);
  await updateDoc(ref, {
    config,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserWidget(userId: string, widgetId: string): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.user_widgets);
  const ref = doc(db, FIRESTORE_COLLECTIONS.user_widgets, widgetId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) {
    throw new Error('Modulen hittades inte eller tillhör inte ditt konto.');
  }
  await deleteDoc(ref);
}

export function subscribeUserWidgets(
  userId: string,
  onData: (widgets: UserWidgetRow[]) => void
): () => void {
  const ref = collection(db, FIRESTORE_COLLECTIONS.user_widgets);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: String(data.userId ?? userId),
          ownerId: String(data.ownerId ?? userId),
          type: data.type as UserWidget['type'],
          title: String(data.title ?? ''),
          pinnedToHome: Boolean(data.pinnedToHome),
          order: Number(data.order ?? 0),
          config: (data.config ?? {}) as UserWidget['config'],
          createdAt: normalizeCreatedAt(data.createdAt),
        } as UserWidgetRow;
      });
      onData(rows.sort((a, b) => a.order - b.order));
    },
    () => onData([])
  );
}
