/**
 * Silo Isolation Enforcer — Runtime Guard
 * Förhindrar att LLM-agenter blandar silos (Kunskap/Valv/Barnen)
 */

export enum Silo {
  KUNSKAP = 'kunskap',
  VALV = 'valv',
  BARNEN = 'barnen',
}

export interface SiloAccessLog {
  timestamp: number;
  silo: Silo;
  callable: string;
  collections: string[];
  success: boolean;
  error?: string;
}

const accessLogs: SiloAccessLog[] = [];

/**
 * Validera att callable endast accessar sin egen silo
 */
export function enforceSiloIsolation(
  callable: string,
  silo: Silo,
  allowedCollections: string[],
): (accessedCollections: string[]) => void {
  return (accessedCollections: string[]) => {
    const disallowedAccess = accessedCollections.filter(c => !allowedCollections.includes(c));
    
    const log: SiloAccessLog = {
      timestamp: Date.now(),
      silo,
      callable,
      collections: accessedCollections,
      success: disallowedAccess.length === 0,
      error: disallowedAccess.length > 0 ? `Cross-silo: ${disallowedAccess.join(', ')}` : undefined,
    };

    accessLogs.push(log);
    if (accessLogs.length > 10000) accessLogs.shift();

    if (!log.success) {
      console.error(`[SILO-BREACH] ${callable} tried to access ${disallowedAccess.join(', ')}`);
      throw new Error(`Silo violation: cannot access ${disallowedAccess.join(', ')}`);
    }
  };
}

export function getSiloAccessLogs(silo?: Silo): SiloAccessLog[] {
  if (!silo) return [...accessLogs];
  return accessLogs.filter(log => log.silo === silo);
}

export function clearSiloAccessLogs(): void {
  accessLogs.length = 0;
}
