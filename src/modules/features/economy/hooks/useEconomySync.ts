import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../../../core/types/firestore';
import type { UserEconomyStatus, MabraProgress } from '../../../core/types/firestore';
import type { EconomySyncState, EconomyAdvancedFeatureFlag, KapacitansNiva } from '../types';

export function useEconomySync(uid: string | undefined): EconomySyncState {
  const [economyAdvanced, setEconomyAdvanced] = useState<EconomyAdvancedFeatureFlag>(false);
  const [kapacitansNiva, setKapacitansNiva] = useState<KapacitansNiva>('Låg');

  useEffect(() => {
    if (!uid) return;

    // Subscribe to user_economy_status for the feature flag
    const economyRef = doc(db, FIRESTORE_COLLECTIONS.user_economy_status, uid);
    const unsubEconomy = onSnapshot(economyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserEconomyStatus;
        setEconomyAdvanced(data.economy_advanced);
      } else {
        setEconomyAdvanced(false);
      }
    });

    // Subscribe to mabra_progress to determine the Kapacitansnivå (trend)
    const mabraRef = doc(db, FIRESTORE_COLLECTIONS.mabra_progress, uid);
    const unsubMabra = onSnapshot(mabraRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as MabraProgress;
        const coreValuesCount = data.coreValues?.length || 0;
        
        if (coreValuesCount >= 5) {
          setKapacitansNiva('Hög');
        } else if (coreValuesCount >= 2) {
          setKapacitansNiva('Medel');
        } else {
          setKapacitansNiva('Låg');
        }
      } else {
        setKapacitansNiva('Låg');
      }
    });

    return () => {
      unsubEconomy();
      unsubMabra();
    };
  }, [uid]);

  const finalKapacitans = economyAdvanced && kapacitansNiva === 'Låg' ? 'Medel' : kapacitansNiva;

  return {
    economyAdvanced,
    kapacitansNiva: finalKapacitans,
  };
}
