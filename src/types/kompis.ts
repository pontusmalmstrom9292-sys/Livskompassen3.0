export type KompisState = 'idle' | 'active' | 'analyzing' | 'celebrating' | 'supporting';

export interface Kampspar {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'milestone' | 'routine';
  intensity: number; // 1-10
  date: string;
  tags: string[];
}

export interface SubSynapticData {
  stressLevel: number; // 1-100
  focusScore: number; // 1-100
  energyLevel: number; // 1-100
  recentKampspar: Kampspar[];
}

export interface KompisContextType {
  state: KompisState;
  subSynapticData: SubSynapticData;
  biometricSignature: string; // The unique data-fingerprint
  setState: (state: KompisState) => void;
  analyzeKampspar: (track: Kampspar) => void;
}

// Mocks for initial integration
export const initialSubSynapticData: SubSynapticData = {
  stressLevel: 30,
  focusScore: 75,
  energyLevel: 80,
  recentKampspar: []
};
