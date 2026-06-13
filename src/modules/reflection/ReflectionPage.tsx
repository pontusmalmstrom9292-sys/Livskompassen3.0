import React, { useEffect } from 'react';
import { ProtectedModule } from '../../components/layout/ProtectedModule';
import { TimelineView } from './components/TimelineView';
import { WeeklySummary } from './components/WeeklySummary';
import { useReflectionStore } from './store/reflectionStore';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useStore } from '../core/store';

const ReflectionPageContent: React.FC = () => {
  const user = useStore(state => state.user);
  const { fetchReflectionData } = useReflectionStore();

  useEffect(() => {
    if (user?.uid) {
      fetchReflectionData(user.uid);
    }
  }, [user?.uid, fetchReflectionData]);

  return (
    <div className="min-h-screen bg-[var(--color-nordic-dusk)] p-6 md:p-12 relative overflow-hidden">
      {/* Bakgrundseffekter */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[var(--color-obsidian-calm)] rounded-full mix-blend-overlay filter blur-[100px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[var(--color-obsidian-calm)] rounded-full mix-blend-overlay filter blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Reflektion & Dagbok
              </h1>
              <p className="text-white/60 mt-1">
                En longitudinell vy över dina dagliga insikter och fokus.
              </p>
            </div>
          </div>
        </motion.div>

        <WeeklySummary />

        <TimelineView />
      </div>
    </div>
  );
};

export default function ReflectionPage() {
  return (
    <ProtectedModule>
      <ReflectionPageContent />
    </ProtectedModule>
  );
}
