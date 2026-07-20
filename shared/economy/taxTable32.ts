/**
 * Skattetabell — bakåtkompatibel re-export från taxTableResolver.
 * getTaxAmount(gross, column) → tabell 32, år 2026 (embedded fixture).
 */
export type { TaxBracket } from './taxTableResolver';
export { getTaxAmount, getTaxBracketForGross, getTaxMetaFromPack } from './taxTableResolver';
