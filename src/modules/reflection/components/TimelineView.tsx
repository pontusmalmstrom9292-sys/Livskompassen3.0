import React, { useMemo } from 'react';
import { useReflectionStore } from '../store/reflectionStore';
import type { InsightData } from '../store/reflectionStore';
import { DailySummaryCard } from './DailySummaryCard';
import { Loader2, Calendar } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface GroupedData {
  [dateStr: string]: InsightData[];
}

export const TimelineView: React.FC = () => {
  const { insights, currentFocusPoints, isLoading, error } = useReflectionStore();

  const groupedInsights = useMemo(() => {
    const groups: GroupedData = {};
    
    insights.forEach(insight => {
      let dateStr = 'Okänt datum';
      if (insight.createdAt instanceof Timestamp) {
        dateStr = insight.createdAt.toDate().toLocaleDateString('sv-SE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(insight);
    });

    return groups;
  }, [insights]);

  const todayStr = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-accent" />
        <p className="tracking-widest uppercase text-xs">Laddar journal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200">
        <p>Ett fel uppstod vid laddning av reflektioner: {error}</p>
      </div>
    );
  }

  if (insights.length === 0 && currentFocusPoints.filter(Boolean).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-8 h-8 text-white/20" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Ingen historik än</h3>
        <p className="text-white/60 text-sm max-w-sm">
          Här kommer dina dagliga insikter och reflektioner att samlas över tid för att ge dig ett långsiktigt perspektiv.
        </p>
      </div>
    );
  }

  // Re-build a stable sorted array of groups
  const orderedDates: string[] = [];
  insights.forEach(insight => {
    if (insight.createdAt instanceof Timestamp) {
      const d = insight.createdAt.toDate().toLocaleDateString('sv-SE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!orderedDates.includes(d)) orderedDates.push(d);
    }
  });

  const displayGroups = { ...groupedInsights };

  // If today has focus points but no insights, we still want to show today's card
  if (currentFocusPoints.filter(Boolean).length > 0 && !orderedDates.includes(todayStr)) {
    orderedDates.unshift(todayStr); // Add today at the top
    displayGroups[todayStr] = [];
  }

  return (
    <div className="space-y-8 relative">
      {/* Tidslinje-streck i bakgrunden */}
      <div className="absolute left-8 top-8 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent z-0 hidden md:block" />

      {orderedDates.map((date) => (
        <div key={date} className="relative z-10">
          <DailySummaryCard
            dateStr={date}
            insights={displayGroups[date] || []}
            isToday={date === todayStr}
            focusPoints={date === todayStr ? currentFocusPoints : undefined}
          />
        </div>
      ))}
    </div>
  );
};
