import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildTechniquesByLogId,
  fetchPatternScanMetadata,
  type PatternScanMetadataRow,
} from '../api/patternScanMetadataApi';
import { TACTIC_LIBRARY_VERSION } from '@/shared/patterns/tacticPatternLibrary';

export function usePatternScanMetadata(userId: string | undefined) {
  const [rows, setRows] = useState<PatternScanMetadataRow[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!userId) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      setRows(await fetchPatternScanMetadata(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const techniquesByLogId = useMemo(() => buildTechniquesByLogId(rows), [rows]);

  const libraryVersion =
    rows.find((r) => r.libraryVersion)?.libraryVersion ?? TACTIC_LIBRARY_VERSION;

  return { rows, techniquesByLogId, libraryVersion, loading, reload };
}
