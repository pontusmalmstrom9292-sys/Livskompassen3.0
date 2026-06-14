export type EconomyAdvancedFeatureFlag = boolean;

export type KapacitansNiva = 'Låg' | 'Medel' | 'Hög';

export interface EconomySyncState {
  economyAdvanced: EconomyAdvancedFeatureFlag;
  kapacitansNiva: KapacitansNiva;
  circuitBreakerActive: boolean;
}
