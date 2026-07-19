/**
 * Datakontrakt — content packs + egna kategorier (Utvecklingskort).
 * Packs = app-bundle KEEP. Custom = liten user-payload på evolution_hub.
 */

import type { MabraProjectId } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';

export type ContentPackTier = 'P0' | 'P1' | 'P2';
export type ContentPackStatus = 'available' | 'coming';

export type ContentPack = {
  id: string;
  version: number;
  title_sv: string;
  lead_sv: string;
  topicTags: string[];
  tier: ContentPackTier;
  status: ContentPackStatus;
  /** Aktiveras automatiskt utan Hämta-flöde. */
  defaultUnlocked?: boolean;
  bankIds: readonly string[];
  discoveryCategoryHints?: readonly string[];
};

export type CustomCategoryStep = {
  bankId: string;
  body_sv: string;
};

export type CustomCategory = {
  id: string;
  name_sv: string;
  description_sv?: string;
  createdAt: string;
  linkedPackId?: string;
  steps: CustomCategoryStep[];
};

export type DevMixCard = {
  slotKey: string;
  source: 'pack' | 'custom';
  categoryKey: string;
  packId?: string;
  bankId: string;
  title_sv?: string;
  body_sv: string;
  content_class: 'REFLECTION' | 'PLAY';
  projectId: MabraProjectId;
  exhausted?: boolean;
};

/** Soft limit — skyddar UI. */
export const MAX_CUSTOM_CATEGORIES = 8;

/** Progressive disclosure: synliga först, sedan Visa fler. */
export const DEV_MIX_VISIBLE_INITIAL = 6;
export const DEV_MIX_TARGET_DEFAULT = 14;
export const DEV_MIX_TARGET_LOW_CAPACITY = 4;
export const DEV_MIX_TARGET_MAX = 16;
