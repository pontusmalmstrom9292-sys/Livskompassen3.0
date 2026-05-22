import * as crypto from 'crypto';
import { Timestamp, type DocumentData } from 'firebase-admin/firestore';

export type DossierCollection = 'reality_vault' | 'children_logs' | 'journal';

export interface CanonicalDossierEntry {
  collection: DossierCollection;
  docId: string;
  createdAt: string;
  payload: Record<string, string>;
}

const VAULT_KEYS = [
  'action',
  'category',
  'truth',
  'childrenImpact',
  'evidenceUrl',
  'theirVersion',
  'myReality',
  'entryType',
  'bodySignals',
  'shieldWhat',
  'shieldFeeling',
  'shieldBoundary',
  'biffUsed',
] as const;

const CHILDREN_KEYS = [
  'childAlias',
  'action',
  'category',
  'observation',
  'truth',
  'childrenImpact',
  'signals',
] as const;

const JOURNAL_KEYS = ['mood', 'text'] as const;

function normalizeTimestamp(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return '';
}

function pickStringFields(
  data: DocumentData,
  keys: readonly string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    if (!(key in data)) continue;
    const raw = data[key];
    if (raw == null) continue;
    if (typeof raw === 'object') {
      out[key] = JSON.stringify(raw);
    } else {
      out[key] = String(raw);
    }
  }
  return out;
}

function stableStringify(payload: Record<string, string>): string {
  const keys = Object.keys(payload).sort();
  return keys.map((k) => `${k}=${payload[k]}`).join('|');
}

export function toCanonicalEntry(
  collection: DossierCollection,
  docId: string,
  data: DocumentData,
): CanonicalDossierEntry {
  const createdAt = normalizeTimestamp(data.createdAt);
  let payload: Record<string, string>;
  if (collection === 'reality_vault') {
    payload = pickStringFields(data, VAULT_KEYS);
  } else if (collection === 'children_logs') {
    payload = pickStringFields(data, CHILDREN_KEYS);
  } else {
    payload = pickStringFields(data, JOURNAL_KEYS);
  }
  return { collection, docId, createdAt, payload };
}

export function buildCanonicalString(entries: CanonicalDossierEntry[]): string {
  const lines = entries
    .map((e) => {
      const body = stableStringify(e.payload);
      return `${e.collection}:${e.docId}:${e.createdAt}:${body}`;
    })
    .sort((a, b) => a.localeCompare(b));
  return lines.join('\n');
}

export function sha256Hex(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

export function computeDocumentHash(entries: CanonicalDossierEntry[]): string {
  return sha256Hex(buildCanonicalString(entries));
}
