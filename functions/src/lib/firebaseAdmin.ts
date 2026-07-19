/**
 * firebase-admin v14+ modular bootstrap + namespaced compat.
 *
 * v14 removed `admin.firestore` / `admin.auth` / `admin.storage` from the
 * package root. Call sites keep the familiar `admin.firestore()` shape via
 * this facade so the migration stays build-safe.
 */
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import {
  getFirestore,
  FieldValue,
  Timestamp,
  AggregateField,
  type Firestore,
  type DocumentData,
} from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

export type { Firestore, DocumentData };

export function ensureAdminApp(): App {
  return getApps().length > 0 ? getApp() : initializeApp();
}

/** Side-effect init for callables/triggers that import this module. */
ensureAdminApp();

type FirestoreCallable = {
  (): Firestore;
  FieldValue: typeof FieldValue;
  Timestamp: typeof Timestamp;
  AggregateField: typeof AggregateField;
};

const firestoreFn = Object.assign(() => getFirestore(), {
  FieldValue,
  Timestamp,
  AggregateField,
}) as FirestoreCallable;

export const admin = {
  initializeApp: ensureAdminApp,
  firestore: firestoreFn,
  auth: () => getAuth(),
  storage: () => getStorage(),
};

/** Type namespace merge — keeps `admin.firestore.DocumentData` etc. working. */
export namespace admin {
  export namespace firestore {
    export type DocumentData = import('firebase-admin/firestore').DocumentData;
    export type Firestore = import('firebase-admin/firestore').Firestore;
    export type Timestamp = import('firebase-admin/firestore').Timestamp;
  }
}

export { FieldValue, Timestamp, AggregateField, getFirestore, getAuth, getStorage };
