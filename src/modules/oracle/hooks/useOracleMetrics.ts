import { useState, useEffect, useCallback } from 'react';
import { OracleService } from '../../../services/OracleService';
import { VaultService } from '../../../services/VaultService';
import { getAllTimeEntriesForEconomyReadOnly } from '../../core/firebase/arbetslivFirestore';
import type { OracleDataPoint } from '../OracleStore';

export interface OracleMetricPoint extends OracleDataPoint {
  totalHoursWorked: number;
  conflictCount: number;
  isHighRiskCorrelation: boolean;
}

export function useOracleMetrics(ownerId: string | undefined) {
  const [dataPoints, setDataPoints] = useState<OracleMetricPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!ownerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Fetch base Oracle Data
      const baseData = await OracleService.getHybridOracleData(ownerId);
      
      // 2. Fetch Time Entries
      const timeEntries = await getAllTimeEntriesForEconomyReadOnly(ownerId);
      
      // 3. Fetch Vault Data
      const vaultEntries = await VaultService.getVaultHistory(ownerId);
      
      // Define conflict keywords
      const conflictKeywords = ['konflikt', 'bråk', 'rsd', 'argument', 'tjafs'];
      
      // Map time entries by date
      const timeMap = new Map<string, number>();
      timeEntries.forEach(entry => {
        if (!entry.date) return;
        const current = timeMap.get(entry.date) || 0;
        timeMap.set(entry.date, current + (entry.hoursWorked || 0));
      });

      // Map vault entries (conflicts) by date
      const conflictMap = new Map<string, number>();
      vaultEntries.forEach(entry => {
        let dateObj = new Date();
        if (entry.createdAt && typeof entry.createdAt.toDate === 'function') {
          dateObj = entry.createdAt.toDate();
        } else if (entry.createdAt) {
          dateObj = new Date(entry.createdAt);
        } else if (entry.timestamp) { // for new WORM records
          dateObj = entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp);
        }
        
        const dateStr = dateObj.toISOString().split('T')[0];
        
        // Since we are not strictly typing vault entries, use JSON stringify to catch all text
        const contentStr = JSON.stringify(entry).toLowerCase();
        let isConflict = false;
        
        for (const kw of conflictKeywords) {
          if (contentStr.includes(kw)) {
            isConflict = true;
            break;
          }
        }
        
        if (isConflict) {
          const current = conflictMap.get(dateStr) || 0;
          conflictMap.set(dateStr, current + 1);
        }
      });
      
      // Merge
      const metrics: OracleMetricPoint[] = baseData.map(point => {
        const totalHoursWorked = Math.round((timeMap.get(point.isoDate) || 0) * 10) / 10;
        const conflictCount = conflictMap.get(point.isoDate) || 0;
        
        const isHighRiskCorrelation = point.stressLevel > 80 && (totalHoursWorked > 8 || conflictCount > 0);
        
        return {
          ...point,
          totalHoursWorked,
          conflictCount,
          isHighRiskCorrelation
        };
      });

      setDataPoints(metrics);
    } catch (err) {
      console.error('Error fetching oracle metrics:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { dataPoints, isLoading, error, refetch: fetchMetrics };
}
