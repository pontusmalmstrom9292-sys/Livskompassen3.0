import manifest from '../../../../docs/specs/modules/Kampspar-PROFIL-SEED.json';
import { ingestKampsparEntry } from './kampsparService';

export type ProfileSeedEntry = {
  title: string;
  content: string;
  category?: string;
  eventDate?: string | null;
  source?: string;
};

export type ProfileSeedImportProgress = {
  current: number;
  total: number;
  title: string;
};

export type ProfileSeedImportResult = {
  ok: number;
  skip: number;
  fail: number;
};

const ENTRIES = manifest.entries as ProfileSeedEntry[];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getProfileSeedEntryCount(): number {
  return ENTRIES.length;
}

export async function importProfileSeed(options?: {
  skipExisting?: boolean;
  existingTitles?: Set<string>;
  onProgress?: (progress: ProfileSeedImportProgress) => void;
}): Promise<ProfileSeedImportResult> {
  const result: ProfileSeedImportResult = { ok: 0, skip: 0, fail: 0 };
  const total = ENTRIES.length;

  for (let i = 0; i < ENTRIES.length; i++) {
    const entry = ENTRIES[i];
    options?.onProgress?.({ current: i + 1, total, title: entry.title });

    if (options?.skipExisting && options.existingTitles?.has(entry.title)) {
      result.skip++;
      continue;
    }

    try {
      await ingestKampsparEntry({
        title: entry.title,
        content: entry.content,
        category: entry.category || undefined,
        eventDate: entry.eventDate || undefined,
        source: entry.source || 'profile_seed',
      });
      result.ok++;
    } catch {
      result.fail++;
    }

    await sleep(400);
  }

  return result;
}
