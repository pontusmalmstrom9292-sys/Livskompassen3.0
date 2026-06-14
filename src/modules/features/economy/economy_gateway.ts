import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/modules/core/firebase/firestore';
import { assertOfflineWriteAllowed } from '@/modules/core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '@/modules/core/types/firestore';
import type {
  EconomyLedgerEntry,
  EconomyLedgerRow,
  BudgetSavings,
  BudgetSavingsRow,
  BudgetEnvelope,
  BudgetEnvelopeRow,
  EconomyImpulseItem,
  EconomyImpulseRow,
} from '@/modules/core/types/firestore';

/**
 * Forbidden keys for WORM collections to ensure append-only behavior.
 */
const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'] as const;

function assertWormPayload(data: Record<string, unknown>, context: string): void {
  for (const key of WORM_FORBIDDEN_KEYS) {
    if (key in data) {
      throw new Error(`WORM violation (${context}): field "${key}" is not allowed on create.`);
    }
  }
}

/**
 * EconomyGateway
 *
 * This module acts as the secure structural container for advanced economic logic.
 * It enforces the `isEconomyAdvancedUnlocked` state check before executing any read/write
 * operations on economy-specific collections.
 *
 * The gateway follows strict WORM (Write Once Read Many) principles for append-only logs
 * like `economy_ledger`, while allowing controlled mutable operations on budgets and bills.
 */
export class EconomyGateway {
  private userId: string;
  private isEconomyAdvancedUnlocked: boolean;

  /**
   * Instantiates the gateway.
   * @param userId The authenticated user's ID.
   * @param isEconomyAdvancedUnlocked The state flag denoting if advanced economy is unlocked.
   */
  constructor(userId: string, isEconomyAdvancedUnlocked: boolean) {
    this.userId = userId;
    this.isEconomyAdvancedUnlocked = isEconomyAdvancedUnlocked;
  }

  /**
   * Internal guard to prevent unauthorized execution.
   */
  private assertAccess(): void {
    if (!this.isEconomyAdvancedUnlocked) {
      throw new Error('Access denied: Advanced Economy module is locked or not available.');
    }
  }

  private withUserId(data: Record<string, unknown>) {
    return {
      ...data,
      userId: this.userId,
      ownerId: this.userId,
      createdAt: serverTimestamp(),
    };
  }

  // ---------------------------------------------------------------------------
  // 1. ECONOMY LEDGER (WORM Principle - Append Only)
  // ---------------------------------------------------------------------------

  /**
   * Records a new entry in the economy ledger following WORM rules.
   */
  async appendLedgerEntry(
    entry: Omit<EconomyLedgerEntry, 'userId' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    this.assertAccess();
    assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_ledger);

    const payload = { ...entry } as Record<string, unknown>;
    assertWormPayload(payload, FIRESTORE_COLLECTIONS.economy_ledger);

    const ref = collection(db, FIRESTORE_COLLECTIONS.economy_ledger);
    const docRef = await addDoc(ref, this.withUserId(payload));
    return docRef.id;
  }

  /**
   * Retrieves recent ledger entries.
   */
  async getLedgerEntries(maxResults = 50): Promise<EconomyLedgerRow[]> {
    this.assertAccess();
    const ref = collection(db, FIRESTORE_COLLECTIONS.economy_ledger);
    const q = query(
      ref,
      where('ownerId', '==', this.userId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
      } as EconomyLedgerRow;
    });
  }

  // ---------------------------------------------------------------------------
  // 2. BUDGET ENVELOPES (Mutable)
  // ---------------------------------------------------------------------------

  async createBudgetEnvelope(
    envelope: Omit<BudgetEnvelope, 'userId' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    this.assertAccess();
    assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.budgets);

    const payload = { ...envelope };
    const ref = collection(db, FIRESTORE_COLLECTIONS.budgets);
    const docRef = await addDoc(ref, this.withUserId(payload));
    return docRef.id;
  }

  async updateBudgetEnvelopeSpent(envelopeId: string, additionalSpentSek: number): Promise<void> {
    this.assertAccess();
    assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.budgets);

    const ref = doc(db, FIRESTORE_COLLECTIONS.budgets, envelopeId);
    const snap = await getDoc(ref);
    if (!snap.exists() || snap.data().ownerId !== this.userId) {
      throw new Error('Budget envelope not found or access denied.');
    }

    const currentSpent = snap.data().spentSek ?? 0;
    await updateDoc(ref, {
      spentSek: currentSpent + additionalSpentSek,
      updatedAt: serverTimestamp(),
    });
  }

  async getBudgetEnvelopes(): Promise<BudgetEnvelopeRow[]> {
    this.assertAccess();
    const ref = collection(db, FIRESTORE_COLLECTIONS.budgets);
    const q = query(ref, where('ownerId', '==', this.userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BudgetEnvelopeRow));
  }

  // ---------------------------------------------------------------------------
  // 3. BUDGET SAVINGS / MÅLSPARANDE (Mutable)
  // ---------------------------------------------------------------------------

  async createSavingsGoal(
    goal: Omit<BudgetSavings, 'userId' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    this.assertAccess();
    assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.budget_savings);

    const payload = { ...goal };
    const ref = collection(db, FIRESTORE_COLLECTIONS.budget_savings);
    const docRef = await addDoc(ref, this.withUserId(payload));
    return docRef.id;
  }

  async getSavingsGoals(): Promise<BudgetSavingsRow[]> {
    this.assertAccess();
    const ref = collection(db, FIRESTORE_COLLECTIONS.budget_savings);
    const q = query(ref, where('ownerId', '==', this.userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BudgetSavingsRow));
  }

  // ---------------------------------------------------------------------------
  // 4. ECONOMY IMPULSE QUEUE (Queue Logic)
  // ---------------------------------------------------------------------------

  async addToImpulseQueue(
    item: Omit<EconomyImpulseItem, 'userId' | 'ownerId' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<string> {
    this.assertAccess();
    assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_impulse_queue);

    const payload = { ...item, status: 'parked' };
    const ref = collection(db, FIRESTORE_COLLECTIONS.economy_impulse_queue);
    const docRef = await addDoc(ref, this.withUserId(payload));
    return docRef.id;
  }

  async getImpulseQueue(): Promise<EconomyImpulseRow[]> {
    this.assertAccess();
    const ref = collection(db, FIRESTORE_COLLECTIONS.economy_impulse_queue);
    const q = query(
      ref,
      where('ownerId', '==', this.userId),
      where('status', '==', 'parked')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EconomyImpulseRow));
  }

  async resolveEconomyImpulse(impulseId: string, status: 'bought' | 'skipped'): Promise<void> {
    this.assertAccess();
    assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_impulse_queue);
    
    const ref = doc(db, FIRESTORE_COLLECTIONS.economy_impulse_queue, impulseId);
    const snap = await getDoc(ref);
    if (!snap.exists() || snap.data().ownerId !== this.userId) {
      throw new Error('Impulse not found or access denied.');
    }
    
    await updateDoc(ref, { status, updatedAt: serverTimestamp() });
  }

  async deleteEconomyImpulse(impulseId: string): Promise<void> {
    this.assertAccess();
    assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_impulse_queue);
    
    const ref = doc(db, FIRESTORE_COLLECTIONS.economy_impulse_queue, impulseId);
    const snap = await getDoc(ref);
    if (!snap.exists() || snap.data().ownerId !== this.userId) {
      throw new Error('Impulse not found or access denied.');
    }
    
    await deleteDoc(ref);
  }
}
