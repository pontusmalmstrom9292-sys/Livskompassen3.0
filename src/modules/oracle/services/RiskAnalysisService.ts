import { OracleService } from './OracleService';
import { VaultService, getVaultEntryDate } from '../../core/firebase/VaultService';
import { getAllTimeEntriesForEconomyReadOnly } from '../../core/firebase/arbetslivFirestore';
import type { OracleDataPoint } from '../OracleStore';

export interface OracleMetricPoint extends OracleDataPoint {
  totalHoursWorked: number;
  conflictCount: number;
  isHighRiskCorrelation: boolean;
}

export class RiskAnalysisService {
  private static CONFLICT_KEYWORDS = ['konflikt', 'bråk', 'rsd', 'argument', 'tjafs'];

  private static async getRiskDataMaps(ownerId: string) {
    const timeEntries = await getAllTimeEntriesForEconomyReadOnly(ownerId);
    const vaultEntries = await VaultService.getVaultHistory(ownerId);

    const timeMap = new Map<string, number>();
    timeEntries.forEach(entry => {
      if (!entry.date) return;
      const current = timeMap.get(entry.date) || 0;
      timeMap.set(entry.date, current + (entry.hoursWorked || 0));
    });

    const conflictMap = new Map<string, number>();
    vaultEntries.forEach(entry => {
      const dateStr = getVaultEntryDate(entry).toISOString().split('T')[0];
      const contentStr = JSON.stringify(entry).toLowerCase();
      let isConflict = false;
      
      for (const kw of this.CONFLICT_KEYWORDS) {
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

    return { timeMap, conflictMap };
  }

  static async enrichOracleDataWithRisk(ownerId: string, baseData: OracleDataPoint[]): Promise<OracleMetricPoint[]> {
    const { timeMap, conflictMap } = await this.getRiskDataMaps(ownerId);

    return baseData.map(point => {
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
  }

  static async getYesterdayRiskStatus(ownerId: string): Promise<boolean> {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayIso = yesterday.toISOString().split('T')[0];

      const baseData = await OracleService.getHybridOracleData(ownerId);
      const yesterdayPoint = baseData.find(p => p.isoDate === yesterdayIso);

      if (!yesterdayPoint) {
        return false;
      }

      // If base stress is not high, we can short-circuit
      if (yesterdayPoint.stressLevel <= 80) {
        return false;
      }

      const { timeMap, conflictMap } = await this.getRiskDataMaps(ownerId);
      const totalHoursWorked = Math.round((timeMap.get(yesterdayIso) || 0) * 10) / 10;
      const conflictCount = conflictMap.get(yesterdayIso) || 0;

      return (totalHoursWorked > 8 || conflictCount > 0);
    } catch (err) {
      console.error('Failed to get yesterday risk status', err);
      return false;
    }
  }
}
