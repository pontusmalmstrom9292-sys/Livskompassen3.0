import { useState, useEffect, useCallback } from 'react';
import { OracleService } from '../services/OracleService';
import { RiskAnalysisService } from '../services/RiskAnalysisService';
import type { OracleMetricPoint } from '../services/RiskAnalysisService';

export function useOracleMetrics(ownerId: string | undefined) {
  const [dataPoints, setDataPoints] = useState<OracleMetricPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!ownerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const baseData = await OracleService.getHybridOracleData(ownerId);
      const metrics = await RiskAnalysisService.enrichOracleDataWithRisk(ownerId, baseData);
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
export type { OracleMetricPoint };
