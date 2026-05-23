/**
 * Inferred from mock RealityVault — inkorg only (user paste 2026-05-23).
 * Runtime target: `reality_vault` + `VaultEntryForm` entryType `simple` | `two_column`.
 */

export type LogEntryType = 'standard' | 'contrast';

export interface LogEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  type: LogEntryType;
  theirVersion?: string;
  tags: string[];
}

/** Mock maps `standard` → `simple`, `contrast` → `two_column` in Verklighetsvalvet-SPEC */
