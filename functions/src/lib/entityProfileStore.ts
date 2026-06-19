import * as admin from 'firebase-admin';
import {
  KEY_ENTITY_SEEDS,
  SYSTEM_SYNAPSE_SEEDS,
  type EntityProfileDoc,
  type EntityRole,
  type SystemSynapseDoc,
} from './entityProfileTypes';

const ENTITY_PROFILES = 'entity_profiles';
const SYSTEM_SYNAPSES = 'system_synapses';

export interface EntityProfileBundle {
  profiles: EntityProfileDoc[];
  synapses: SystemSynapseDoc[];
  contextBlock: string;
}

function docToEntityProfile(
  id: string,
  data: admin.firestore.DocumentData
): EntityProfileDoc {
  return {
    ownerId: String(data.ownerId ?? ''),
    userId: String(data.userId ?? ''),
    entityKey: String(data.entityKey ?? id),
    role: data.role as EntityProfileDoc['role'],
    displayName: String(data.displayName ?? ''),
    aliases: Array.isArray(data.aliases) ? data.aliases.map(String) : [],
    category: data.category ? String(data.category) : undefined,
    behavioralPatterns: Array.isArray(data.behavioralPatterns)
      ? data.behavioralPatterns.map(String)
      : [],
    groundingNotes: data.groundingNotes ? String(data.groundingNotes) : undefined,
    isKeyEntity: data.isKeyEntity === true,
    source: data.source === 'user' ? 'user' : 'seed',
    createdAt: data.createdAt,
  };
}

function docToSystemSynapse(id: string, data: admin.firestore.DocumentData): SystemSynapseDoc {
  return {
    ownerId: String(data.ownerId ?? ''),
    userId: String(data.userId ?? ''),
    title: String(data.title ?? ''),
    category: data.category as SystemSynapseDoc['category'],
    analysis: String(data.analysis ?? ''),
    groundingPoints: Array.isArray(data.groundingPoints)
      ? data.groundingPoints.map(String)
      : [],
    hallucinationRisk:
      data.hallucinationRisk === 'MEDIUM' || data.hallucinationRisk === 'HIGH'
        ? data.hallucinationRisk
        : 'LOW',
    relatedEntityKeys: Array.isArray(data.relatedEntityKeys)
      ? data.relatedEntityKeys.map(String)
      : undefined,
    source: data.source === 'agent' ? 'agent' : 'seed',
    createdAt: data.createdAt,
  };
}

export function buildEntityGroundingContextBlock(
  profiles: EntityProfileDoc[],
  synapses: SystemSynapseDoc[]
): string {
  if (profiles.length === 0 && synapses.length === 0) {
    return '(inga EntityProfile — använd endast given RAG-kontext)';
  }

  const profileLines = profiles.map(
    (p) =>
      `[${p.entityKey}] ${p.displayName} (${p.role}) alias=${p.aliases.join(', ')}` +
      (p.groundingNotes ? ` — ${p.groundingNotes}` : '')
  );

  const synapseLines = synapses.map(
    (s) => `[${s.category}] ${s.title}: ${s.analysis} | ankare: ${s.groundingPoints.join('; ')}`
  );

  return [
    'KEY_ENTITIES (metadata — hallucinera aldrig nya personer utanför listan):',
    ...profileLines,
    '',
    'SYSTEM_SYNAPSES (grounding — ej RAG-bevis):',
    ...synapseLines,
  ].join('\n');
}

async function hasEntityProfiles(uid: string): Promise<boolean> {
  const snap = await admin
    .firestore()
    .collection(ENTITY_PROFILES)
    .where('ownerId', '==', uid)
    .limit(1)
    .get();
  return !snap.empty;
}

/** Idempotent seed av KEY_ENTITIES + default SystemSynapses för användare. */
export async function ensureEntityProfilesSeeded(uid: string): Promise<{ seeded: boolean; profileCount: number }> {
  if (await hasEntityProfiles(uid)) {
    return { seeded: false, profileCount: KEY_ENTITY_SEEDS.length };
  }

  const db = admin.firestore();
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  for (const entry of KEY_ENTITY_SEEDS) {
    const ref = db.collection(ENTITY_PROFILES).doc();
    batch.set(ref, {
      ownerId: uid,
      userId: uid,
      entityKey: entry.entityKey,
      role: entry.role,
      displayName: entry.displayName,
      aliases: entry.aliases,
      category: entry.category ?? null,
      behavioralPatterns: entry.behavioralPatterns ?? [],
      groundingNotes: entry.groundingNotes ?? null,
      isKeyEntity: true,
      source: 'seed',
      createdAt: now,
    });
  }

  for (const entry of SYSTEM_SYNAPSE_SEEDS) {
    const ref = db.collection(SYSTEM_SYNAPSES).doc();
    batch.set(ref, {
      ownerId: uid,
      userId: uid,
      title: entry.title,
      category: entry.category,
      analysis: entry.analysis,
      groundingPoints: entry.groundingPoints,
      hallucinationRisk: entry.hallucinationRisk,
      relatedEntityKeys: entry.relatedEntityKeys ?? null,
      source: 'seed',
      createdAt: now,
    });
  }

  await batch.commit();
  console.log(
    `[EntityProfile] Seeded uid=${uid} profiles=${KEY_ENTITY_SEEDS.length} synapses=${SYSTEM_SYNAPSE_SEEDS.length}`
  );
  return { seeded: true, profileCount: KEY_ENTITY_SEEDS.length };
}

export async function loadEntityProfileBundle(uid: string): Promise<EntityProfileBundle> {
  await ensureEntityProfilesSeeded(uid);

  const db = admin.firestore();
  const [profileSnap, synapseSnap] = await Promise.all([
    db.collection(ENTITY_PROFILES).where('ownerId', '==', uid).get(),
    db.collection(SYSTEM_SYNAPSES).where('ownerId', '==', uid).get(),
  ]);

  const profiles = profileSnap.docs.map((d) => docToEntityProfile(d.id, d.data()));
  const synapses = synapseSnap.docs.map((d) => docToSystemSynapse(d.id, d.data()));

  return {
    profiles,
    synapses,
    contextBlock: buildEntityGroundingContextBlock(profiles, synapses),
  };
}

const BARNEN_ENTITY_ROLES: EntityRole[] = ['BARN', 'SKOLA'];
const BARNEN_SYNAPSE_CATEGORIES: SystemSynapseDoc['category'][] = ['INTEGRITY', 'GROWTH'];

/**
 * Barnen-silo grounding — BARN/SKOLA-profiler + neutrala synapser.
 * MUST NOT injicera MOTPART/Grey Rock-kontext i childrenLogsQuery.
 */
export async function loadBarnenEntityBundle(uid: string): Promise<EntityProfileBundle> {
  const full = await loadEntityProfileBundle(uid);

  const profiles = full.profiles.filter((p) => BARNEN_ENTITY_ROLES.includes(p.role));
  const barnKeys = new Set(profiles.map((p) => p.entityKey));

  const synapses = full.synapses.filter((s) => {
    if (BARNEN_SYNAPSE_CATEGORIES.includes(s.category)) return true;
    if (s.relatedEntityKeys?.some((key) => barnKeys.has(key))) return true;
    return false;
  });

  return {
    profiles,
    synapses,
    contextBlock: buildEntityGroundingContextBlock(profiles, synapses),
  };
}

const USER_ADDABLE_ROLES: EntityRole[] = ['MOTPART', 'BARN', 'NATVERK', 'MYNDIGHET', 'SKOLA'];

export interface AddEntityProfileInput {
  displayName: string;
  role: EntityRole;
  aliases?: string[];
  groundingNotes?: string;
}

export interface AddEntityProfileResult {
  entityKey: string;
  displayName: string;
  role: EntityRole;
  aliases: string[];
}

function slugifyEntityKey(displayName: string): string {
  return displayName
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
}

function normalizeAliases(raw: string[] | undefined, displayName: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 60) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(trimmed);
  };

  for (const alias of raw ?? []) push(alias);
  push(displayName);
  return out.slice(0, 20);
}

function validateAddEntityInput(input: AddEntityProfileInput): AddEntityProfileInput {
  const displayName = input.displayName.trim();
  if (displayName.length < 2 || displayName.length > 80) {
    throw new Error('Namn måste vara 2–80 tecken.');
  }
  if (!USER_ADDABLE_ROLES.includes(input.role)) {
    throw new Error('Ogiltig roll — välj Motpart, Barn, Nätverk, Myndighet eller Skola.');
  }
  const groundingNotes = input.groundingNotes?.trim();
  if (groundingNotes && groundingNotes.length > 500) {
    throw new Error('Anteckning får max vara 500 tecken.');
  }
  return {
    displayName,
    role: input.role,
    aliases: normalizeAliases(input.aliases, displayName),
    groundingNotes: groundingNotes || undefined,
  };
}

/** Append-only — användardefinierade personer (WORM via Admin SDK, klient skriver ej). */
export async function addUserEntityProfile(
  uid: string,
  rawInput: AddEntityProfileInput
): Promise<AddEntityProfileResult> {
  const input = validateAddEntityInput(rawInput);
  await ensureEntityProfilesSeeded(uid);

  const db = admin.firestore();
  const existingSnap = await db.collection(ENTITY_PROFILES).where('ownerId', '==', uid).get();
  const displayKey = input.displayName.toLowerCase();
  for (const doc of existingSnap.docs) {
    const name = String(doc.data().displayName ?? '').toLowerCase();
    if (name === displayKey) {
      throw new Error('Personen finns redan i aktörskartan.');
    }
  }

  const slug = slugifyEntityKey(input.displayName);
  if (!slug) {
    throw new Error('Namnet går inte att spara — prova bokstäver eller siffror.');
  }

  let entityKey = `user_${slug}`;
  let suffix = 2;
  const usedKeys = new Set(existingSnap.docs.map((d) => String(d.data().entityKey ?? '')));
  while (usedKeys.has(entityKey)) {
    entityKey = `user_${slug}_${suffix}`;
    suffix += 1;
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  await db.collection(ENTITY_PROFILES).add({
    ownerId: uid,
    userId: uid,
    entityKey,
    role: input.role,
    displayName: input.displayName,
    aliases: input.aliases ?? [],
    category: input.role,
    behavioralPatterns: [],
    groundingNotes: input.groundingNotes ?? null,
    isKeyEntity: false,
    source: 'user',
    createdAt: now,
  });

  console.log(`[EntityProfile] Added uid=${uid} entityKey=${entityKey} role=${input.role}`);
  return {
    entityKey,
    displayName: input.displayName,
    role: input.role,
    aliases: input.aliases ?? [],
  };
}

/** Match entity keys mentioned in text (deterministic, för weaver-taggar). */
export function resolveEntityKeysInText(
  text: string,
  profiles: EntityProfileDoc[]
): string[] {
  const lower = text.toLowerCase();
  const hits = new Set<string>();
  for (const p of profiles) {
    const names = [p.displayName, ...p.aliases, p.entityKey.replace(/_/g, ' ')].map((n) =>
      n.toLowerCase()
    );
    if (names.some((n) => n.length > 2 && lower.includes(n))) {
      hits.add(p.entityKey);
    }
  }
  return [...hits];
}
