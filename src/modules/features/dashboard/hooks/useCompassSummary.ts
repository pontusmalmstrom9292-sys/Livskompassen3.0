import { useEffect, useState, useMemo } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';

export interface CompassSummary {
  journalCount: number;
  vaultCount: number;
  streak: number;
  latestInsight: string;
  dominantEmotion: string | null;
  recommendedPhase: 'morgon' | 'dag' | 'kvall' | null;
  loading: boolean;
}

export function useCompassSummary(): CompassSummary {
  const user = useStore((s) => s.user);
  
  const [data, setData] = useState<Omit<CompassSummary, 'loading'>>({
    journalCount: 0,
    vaultCount: 0,
    streak: 0,
    latestInsight: '',
    dominantEmotion: null,
    recommendedPhase: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchSummary = async () => {
      try {
        const generateCompassInsight = httpsCallable<void, Omit<CompassSummary, 'loading'>>(
          functions,
          'generateCompassInsight'
        );
        
        const result = await generateCompassInsight();
        
        if (!cancelled) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch compass insight:', error);
        if (!cancelled) {
          // Minimal fallback if function fails
          setData((prev) => ({
            ...prev,
            latestInsight: 'Kunde inte hämta insikter just nu. Fortsätt utforska.'
          }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return { ...data, loading };
}

