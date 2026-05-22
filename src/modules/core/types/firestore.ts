export type IsoDateTime = string;

export type ThreatLevel = 'none' | 'low' | 'medium' | 'high';

export interface RagAnchor {
  source: 'journal' | 'reality_vault';
  docId: string;
  excerpt?: string;
}

export interface WeaverTags {
  emotions: string[];
  actors: string[];
  threatLevel: ThreatLevel;
  threatScore?: number;
  ragAnchors: RagAnchor[];
  model: 'gemini-1.5-pro';
  journalEntryId: string;
}

export interface VaultLog {
  userId: string;
  category?: string;
  action: string;
  truth: string;
  /** WORM-länk till `children_logs/{id}` vid explicit bro från Barnen. */
  sourceRef?: string;
  childrenImpact?: string;
  evidenceUrl?: string;
  biffUsed?: boolean;
  isLocked?: boolean;
  entryType?: 'simple' | 'two_column' | 'three_shield' | 'body_signal';
  theirVersion?: string;
  myReality?: string;
  bodySignals?: string[];
  shieldWhat?: string;
  shieldFeeling?: string;
  shieldBoundary?: string;
  /** Sanningens Ankare — satt endast vid create (WORM). */
  pinned?: boolean;
  createdAt: IsoDateTime;
}

export interface CheckIn {
  userId: string;
  questionId: string;
  questionText?: string;
  optionSelected: string;
  taskText?: string;
  taskCompleted?: boolean;
  taskCategory?: string;
  taskNote?: string;
  createdAt: IsoDateTime;
}

export interface KnowledgeDoc {
  userId: string;
  folderId: string;
  title: string;
  content: string;
  source?: string;
  driveFileId?: string;
  mimeType?: string;
  embeddingDim?: number | null;
  createdAt: IsoDateTime;
}

export interface KampsparEntry {
  userId: string;
  title: string;
  content: string;
  category?: string | null;
  entryType?: string | null;
  tags?: string[];
  source?: string;
  eventDate?: string | null;
  embeddingDim?: number | null;
  createdAt: IsoDateTime;
}

export interface KampsparEntryRow extends KampsparEntry {
  id: string;
}

export interface Routine {
  userId: string;
  text: string;
  completed?: boolean;
  createdAt: IsoDateTime;
}

export interface MabraSession {
  userId: string;
  exerciseType: string;
  durationSeconds: number;
  hubSymptom?: string;
  createdAt: IsoDateTime;
}

export interface MabraProgress {
  userId: string;
  ownerId: string;
  coreValues: string[];
  updatedAt?: IsoDateTime;
}

export interface JournalEntry {
  id: string;
  mood: string;
  text: string;
  userId?: string;
  ownerId?: string;
  createdAt?: IsoDateTime;
}

export interface EconomyTransaction {
  userId: string;
  ownerId: string;
  label: string;
  amountSek: number;
  category: 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt';
  createdAt: IsoDateTime;
}

export interface EconomyProfile {
  userId: string;
  ownerId: string;
  weeklyBudgetSek: number;
  mealBoxPresetSek: number;
  updatedAt?: IsoDateTime;
}

/** F-05 — positiva minnesankare (ej WORM-bevis, ej RAG Kunskap). */
export interface MemoryAnchor {
  userId: string;
  ownerId: string;
  text: string;
  createdAt: IsoDateTime;
}

export const FIRESTORE_COLLECTIONS = {
  vault: 'vault',
  checkins: 'checkins',
  kb_docs: 'kb_docs',
  kampspar: 'kampspar',
  routines: 'routines',
  reality_vault: 'reality_vault',
  archival_analysis: 'archival_analysis',
  journal: 'journal',
  mabra_sessions: 'mabra_sessions',
  mabra_progress: 'mabra_progress',
  children_logs: 'children_logs',
  transactions: 'transactions',
  economy_profiles: 'economy_profiles',
  memory_anchors: 'memory_anchors',
} as const;
