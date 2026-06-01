export type KompisState = 'idle' | 'active' | 'analyzing' | 'celebrating' | 'supporting';

/**
 * UI-only mock for Kompis dashboard — MUST NOT be sent to ingestKampsparEntry (G11).
 * WORM schema: KampsparEntry in src/modules/core/types/firestore.ts
 */
export interface KompisUiKampsparTrack {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'milestone' | 'routine';
  intensity: number;
  date: string;
  tags: string[];
}

/** @deprecated Use KompisUiKampsparTrack */
export type Kampspar = KompisUiKampsparTrack;

export interface SubSynapticData {
  stressLevel: number;
  focusScore: number;
  energyLevel: number;
  recentUiTracks: KompisUiKampsparTrack[];
  /** @deprecated Use recentUiTracks */
  recentKampspar: KompisUiKampsparTrack[];
}

export interface KompisContextType {
  state: KompisState;
  subSynapticData: SubSynapticData;
  biometricSignature: string;
  setState: (state: KompisState) => void;
  analyzeUiTrack: (track: KompisUiKampsparTrack) => void;
  /** @deprecated Use analyzeUiTrack */
  analyzeKampspar: (track: KompisUiKampsparTrack) => void;
}

export const initialSubSynapticData: SubSynapticData = {
  stressLevel: 30,
  focusScore: 75,
  energyLevel: 80,
  recentUiTracks: [],
  recentKampspar: [],
};
