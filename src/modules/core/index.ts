export { MainLayout } from './layout/MainLayout';
export { FloatingDock } from './layout/FloatingDock';
export { SubSynapticBackground } from './layout/SubSynapticBackground';
export { BentoCard } from './ui/BentoCard';
export { useStore } from './store';
export type { AppState, UiState, SystemState, User } from './store';
export { app, functions } from './firebase/init';
export type { VaultLog, CheckIn, KnowledgeDoc, Routine } from './types/firestore';
export { FIRESTORE_COLLECTIONS } from './types/firestore';
