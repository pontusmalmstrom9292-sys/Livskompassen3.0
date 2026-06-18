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
  ownerId?: string;
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
  /** Stable question key (e.g. `mabra_checkin`). Required on write; read rows normalize missing legacy values to `''`. */
  questionId: string;
  questionText?: string;
  optionSelected: string;
  taskText?: string;
  taskCompleted?: boolean;
  taskCategory?: string;
  taskNote?: string;
  energy?: number;
  mood?: number;
  createdAt: IsoDateTime;
}

/** Firestore check-in read row: persisted CheckIn fields plus document id. */
export type CheckInRow = CheckIn & { id: string };

export interface KnowledgeDoc {
  userId: string;
  folderId: string;
  title: string;
  content: string;
  source?: string;
  driveFileId?: string;
  mimeType?: string;
  category?: string | null;
  tags?: string[];
  inboxTags?: string[];
  inboxCategory?: string | null;
  embeddingDim?: number | null;
  createdAt: IsoDateTime;
}

export interface KbDocEntryRow extends KnowledgeDoc {
  id: string;
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

export type VitEntryKind = 'card' | 'memory' | 'chat_turn';

export type VitContentClass = 'REFLECTION' | 'PLAY';

/** Vit hub per användare — `vit_hub/{userId}`. Separat från WORM-bevis-valv. */
export interface VitHubDoc {
  userId: string;
  ownerId: string;
  activeProjectIds?: string[];
  updatedAt?: IsoDateTime;
}

/** Append-only Vit-zon entry — frågekort, minne eller chatt-turn. */
export interface VitEntry {
  userId: string;
  ownerId: string;
  projectId: string;
  kind: VitEntryKind;
  bankId: string;
  content_class: VitContentClass;
  responseText?: string;
  cardDateKey?: string;
  categoryId?: string;
  createdAt: IsoDateTime;
}

export interface VitEntryRow extends VitEntry {
  id: string;
}

export type EmotionalMemoryType = 'identity' | 'feeling' | 'reflection' | 'freeform';

/** Append-only känslominne — WORM `emotional_memory`. */
export interface EmotionalMemoryEntry {
  userId: string;
  ownerId: string;
  createdAt: IsoDateTime;
  memoryType: EmotionalMemoryType;
  content: string;
  intensity: number;
}

export interface EmotionalMemoryRow extends EmotionalMemoryEntry {
  id: string;
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

export type EconomyLedgerType = 'utgift' | 'inkomst';

export interface EconomyLedgerEntry {
  userId: string;
  ownerId: string;
  date: string;
  category: string;
  description: string;
  amountSek: number;
  type: EconomyLedgerType;
  createdAt: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface EconomyLedgerRow extends EconomyLedgerEntry {
  id: string;
}

export interface EconomyFixedBill {
  userId: string;
  ownerId: string;
  name: string;
  amountSek: number;
  createdAt: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface EconomyFixedBillRow extends EconomyFixedBill {
  id: string;
}

export interface BudgetSavings {
  userId: string;
  ownerId: string;
  title: string;
  targetSek: number;
  currentSek: number;
  /** Optional tag — e.g. family adventure fund */
  tag?: 'family' | 'general';
  createdAt: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface EconomyMealPrepItem {
  id: string;
  text: string;
  done: boolean;
}

export interface EconomyImpulseItem {
  userId: string;
  ownerId: string;
  label: string;
  parkedAt: IsoDateTime;
  remindAt: IsoDateTime;
  status: 'parked' | 'bought' | 'skipped';
  createdAt: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface EconomyImpulseRow extends EconomyImpulseItem {
  id: string;
}

/** Manual envelope budget per category (SPEC planned `budgets` collection). */
export interface BudgetEnvelope {
  userId: string;
  ownerId: string;
  title: string;
  allocatedSek: number;
  spentSek: number;
  createdAt: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface BudgetEnvelopeRow extends BudgetEnvelope {
  id: string;
}

export interface BudgetSavingsRow extends BudgetSavings {
  id: string;
}

export interface EconomyProfile {
  userId: string;
  ownerId: string;
  weeklyBudgetSek: number;
  mealBoxPresetSek: number;
  monthlySalarySek?: number;
  hourlyRateSek?: number;
  flexHoursTarget?: number;
  /** Standard rast (min) vid nya pass — default 30. */
  defaultBreakMinutes?: number;
  /** Neuro-Kost matprepp checklist */
  mealPrepItems?: EconomyMealPrepItem[];
  updatedAt?: IsoDateTime;
}

/** Stämpelklocka / frånvaropass — mutable (redigera/radera tillåtet). */
export interface TimeEntry {
  userId: string;
  ownerId: string;
  date: string;
  clockIn: string;
  clockOut?: string | null;
  category: string;
  breakMinutes: number;
  scopePercent: number;
  hoursWorked: number;
  isOpen: boolean;
  createdAt: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface TimeEntryRow extends TimeEntry {
  id: string;
}

export interface PayslipSnapshot {
  userId: string;
  ownerId: string;
  payslipId: string;
  periodFrom: string;
  periodTo: string;
  periodLabel: string;
  baseSalarySek: number;
  grossBeforeDeductionsSek: number;
  absenceDeductionSek: number;
  taxableGrossSek: number;
  taxSek: number;
  netSalarySek: number;
  expectedIncomeAdjustmentSek: number;
  hourlyRateSek: number;
  pbb2026Sek: number;
  karensDaysLast365: number;
  karensWaived: boolean;
  absenceLines: Array<{
    date: string;
    category: string;
    description: string;
    deductionSek: number;
    expectedIncomeSek: number;
  }>;
  taxTable: number;
  taxColumn: number;
  isLocked: boolean;
  status: string;
  createdAt: IsoDateTime;
}

export interface PayslipSnapshotRow extends PayslipSnapshot {
  id: string;
}

export interface UserWidget {
  userId: string;
  ownerId: string;
  type: 'countdown' | 'checklist' | 'linked_savings' | 'quick_note';
  title: string;
  pinnedToHome: boolean;
  order: number;
  config: {
    targetDate?: string;
    savingsGoalId?: string;
    checklistItems?: { id: string; text: string; done: boolean }[];
    noteText?: string;
  };
  createdAt: IsoDateTime;
}

export interface UserWidgetRow extends UserWidget {
  id: string;
}

export type EvolutionPillar = 'kognitiv' | 'emotionell' | 'vardag' | 'relationell' | 'valv' | 'system';
export type EvolutionMilestoneType = 'milestone_unlocked' | 'capacity_increased' | 'child_age_milestone' | 'pillar_rebalance';

export interface EvolutionLedgerEntry {
  userId: string;
  ownerId: string;
  createdAt: IsoDateTime;
  type: EvolutionMilestoneType;
  pillar: EvolutionPillar;
  levelBefore: number;
  levelAfter: number;
  rationale: string;
  metadata: Record<string, unknown>;
}

export interface EvolutionLedgerRow extends EvolutionLedgerEntry {
  id: string;
}

export interface ChildAgeState {
  ageYears: number;
  currentBracket: 'toddler_preschool' | 'early_school' | 'pre_teen' | 'teen';
  lastUpdated: IsoDateTime;
  barnportenLevel?: number;
  birthDate?: string;
}

export interface EvolutionPillarState {
  level: number;
  score: number;
}

export interface EvolutionHubDoc {
  userId: string;
  ownerId: string;
  updatedAt: IsoDateTime;
  /** Global barnporten-nivå (max bland barn). */
  barnportenLevel?: number;
  pillars: {
    kognitiv: EvolutionPillarState;
    emotionell: EvolutionPillarState;
    vardag: EvolutionPillarState;
    relationell: EvolutionPillarState;
    valv: EvolutionPillarState;
  };
  childrenAgeState: {
    kasper: ChildAgeState;
    arvid: ChildAgeState;
  };
  unlockedFeatureFlags: string[];
  unlockedPacks?: string[];
}

export interface Project {
  userId: string;
  ownerId: string;
  title: string;
  status: 'active' | 'paused' | 'archived';
  primaryBlockType?: 'list' | 'note' | 'image' | 'video' | 'task';
  createdAt: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface ProjectRow extends Project {
  id: string;
}

export const FIRESTORE_COLLECTIONS = {
  evolution_ledger: 'evolution_ledger',
  evolution_hub: 'evolution_hub',
  adaptation_prefs: 'adaptation_prefs',
  adaptation_ledger: 'adaptation_ledger',
  vault: 'vault',
  checkins: 'checkins',
  kb_docs: 'kb_docs',
  kampspar: 'kampspar',
  routines: 'routines',
  reality_vault: 'reality_vault',
  pattern_scan_metadata: 'pattern_scan_metadata',
  archival_analysis: 'archival_analysis',
  journal: 'journal',
  mabra_sessions: 'mabra_sessions',
  mabra_progress: 'mabra_progress',
  mabra_explore_queue: 'mabra_explore_queue',
  mabra_nutrition_log: 'mabra_nutrition_log',
  recovery_profile: 'recovery_profile',
  vit_hub: 'vit_hub',
  vit_entries: 'vit_entries',
  emotional_memory: 'emotional_memory',
  children_logs: 'children_logs',
  barnporten_pairings: 'barnporten_pairings',
  barnporten_devices: 'barnporten_devices',
  transactions: 'transactions',
  economy_profiles: 'economy_profiles',
  economy_ledger: 'economy_ledger',
  economy_fixed_bills: 'economy_fixed_bills',
  budget_savings: 'budget_savings',
  budgets: 'budgets',
  economy_impulse_queue: 'economy_impulse_queue',
  time_entries: 'time_entries',
  payslip_snapshots: 'payslip_snapshots',
  planning_tasks: 'planning_tasks',
  allocation_proposals: 'allocation_proposals',
  planning_email_rules: 'planning_email_rules',
  project_rules: 'project_rules',
  routine_templates: 'routine_templates',
  material_pack_overrides: 'material_pack_overrides',
  projects: 'projects',
  project_blocks: 'project_blocks',
  user_widgets: 'user_widgets',
  user_tags: 'user_tags',
  inbox_rules: 'inbox_rules',
  user_economy_status: 'user_economy_status',
  user_capability_state: 'user_capability_state',
  access_tokens_economy: 'access_tokens_economy',
} as const;

/** Användardefinierad tagg (Firestore `user_tags`). */
export type UserTag = {
  label: string;
  slug: string;
  description?: string;
};

export type UserTagRow = UserTag & { id: string };

export interface UserEconomyStatus {
  userId: string;
  ownerId: string;
  economy_advanced: boolean;
  lastUpdated: IsoDateTime;
}

export interface UserCapabilityState {
  userId: string;
  ownerId: string;
  capacityScore: number;
  economy_advanced: boolean;
  lastUpdated: IsoDateTime;
}

export interface AllocationProposal {
  userId: string;
  ownerId: string;
  amount: number;
  reasoning: string;
  createdAt: IsoDateTime;
  expiresAt: IsoDateTime;
}
