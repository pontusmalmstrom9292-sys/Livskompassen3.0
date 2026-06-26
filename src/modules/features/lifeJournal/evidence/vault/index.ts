export { VaultPage, parseVaultTab, type VaultTab } from './components/VaultPage';
export { ValvSuperModule, type ValvSuperVariant } from './components/ValvSuperModule';
// ValvInputSuperModule is loaded lazily inside VaultPage (React.lazy). Re-exporting
// it statically here pulled it into the main vault chunk and defeated the code-split
// (Vite [INEFFECTIVE_DYNAMIC_IMPORT]); it is not consumed via this barrel.
export {
  buildValvSearchParams,
  canonicalValvRoute,
  parseValvInputMode,
  parseValvInputModeFromSearch,
  type ValvInputMode,
} from './supermodule/valvInputModes';
