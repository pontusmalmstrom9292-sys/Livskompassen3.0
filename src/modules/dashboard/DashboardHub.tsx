import React, { useEffect } from 'react';
import { create } from 'zustand';
import { collection, query, where, getDocs, CollectionReference, DocumentData } from 'firebase/firestore';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { PageSkeleton } from '../../components/layout/PageSkeleton';
import { useStore } from '../core/store';
import { db } from '../core/firebase/firestore';

/**
 * Hjälpfunktion för att säkra alla Firestore-frågor med ownerId
 * Enligt säkerhetsfokuserad arkitektur
 */
function secureQuery(ref: CollectionReference<DocumentData, DocumentData>, ownerId: string) {
  return query(ref, where('ownerId', '==', ownerId));
}

interface DashboardData {
  id: string;
  [key: string]: any;
}

interface DashboardStore {
  data: DashboardData[];
  isLoading: boolean;
  error: string | null;
  fetchData: (ownerId: string) => Promise<void>;
}

/**
 * Zustand store för DashboardHub
 */
const useDashboardStore = create<DashboardStore>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  fetchData: async (ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ref = collection(db, 'user_insights');
      // Automatisk injicering av ownerId-filtret
      const q = secureQuery(ref, ownerId);
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DashboardData));
      set({ data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  }
}));

function DashboardHubContent() {
  const user = useStore(state => state.user);
  const { data, isLoading, error, fetchData } = useDashboardStore();

  useEffect(() => {
    if (user?.uid) {
      fetchData(user.uid);
    }
  }, [user?.uid, fetchData]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[80vh] p-8 text-red-500 bg-[var(--color-nordic-dusk)]">
        <h2>Ett fel uppstod:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full min-h-[80vh] p-4 sm:p-6 md:p-8 text-white transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-nordic-dusk)' }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Hub</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.length === 0 ? (
            <div className="col-span-full p-8 bg-white/5 rounded-2xl border border-white/10 shadow-md backdrop-blur-md text-center">
              <p className="text-lg opacity-80">Ingen data hittades för din profil.</p>
            </div>
          ) : (
            data.map(item => (
              <div 
                key={item.id} 
                className="p-6 bg-white/5 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <pre className="text-sm opacity-80 overflow-auto">{JSON.stringify(item, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * DashboardHub Modul
 * Omsluten av ProtectedModule för garanterad autentisering.
 */
export default function DashboardHub() {
  return (
    <ProtectedModule>
      <DashboardHubContent />
    </ProtectedModule>
  );
}
