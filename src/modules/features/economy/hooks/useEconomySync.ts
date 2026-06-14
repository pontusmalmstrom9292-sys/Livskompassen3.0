import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../../../core/types/firestore';
import type { UserEconomyStatus, MabraProgress, CheckIn } from '../../../core/types/firestore';
import type { EconomySyncState, EconomyAdvancedFeatureFlag, KapacitansNiva } from '../types';
import { SAFETY_THRESHOLD } from '../../../core/config/constants';

export function useEconomySync(uid: string | undefined): EconomySyncState {
  const [economyAdvanced, setEconomyAdvanced] = useState<EconomyAdvancedFeatureFlag>(false);
  const [kapacitansNiva, setKapacitansNiva] = useState<KapacitansNiva>('Låg');
  const [circuitBreakerActive, setCircuitBreakerActive] = useState<boolean>(false);

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

    // Subscribe to recent checkins for Circuit Breaker 48-hour trend
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const checkinsQuery = query(
      collection(db, FIRESTORE_COLLECTIONS.checkins),
      where('userId', '==', uid),
      where('questionId', '==', 'mabra_checkin'),
      where('createdAt', '>=', fortyEightHoursAgo.toISOString())
    );

    const unsubCheckins = onSnapshot(checkinsQuery, (snapshot) => {
      let totalScore = 0;
      let count = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as CheckIn;
        let docScore = 0;
        let validFields = 0;

        if (typeof data.mood === 'number') {
          docScore += data.mood;
          validFields++;
        }
        if (typeof data.energy === 'number') {
          docScore += data.energy;
          validFields++;
        }

        if (validFields > 0) {
          totalScore += docScore / validFields;
          count++;
        }
      });

      const averageScore = count > 0 ? totalScore / count : 0;
      
      if (count > 0 && averageScore < SAFETY_THRESHOLD) {
        setCircuitBreakerActive(true);
      } else {
        setCircuitBreakerActive(false);
      }
    });

    return () => {
      unsubEconomy();
      unsubMabra();
      unsubCheckins();
    };
  }, [uid]);

  const finalKapacitans = economyAdvanced && kapacitansNiva === 'Låg' ? 'Medel' : kapacitansNiva;

  return {
    // If circuit breaker is active, we force automated features to false in the UI
    economyAdvanced: circuitBreakerActive ? false : economyAdvanced,
    kapacitansNiva: finalKapacitans,
    circuitBreakerActive,
  };
}
