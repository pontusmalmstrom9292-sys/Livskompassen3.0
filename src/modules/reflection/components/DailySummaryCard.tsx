import React from 'react';
import { motion } from 'framer-motion';
import type { InsightData } from '../store/reflectionStore';

interface DailySummaryCardProps {
  dateStr: string;
  insights: InsightData[];
  isToday: boolean;
  focusPoints?: string[];
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({ 
  dateStr, 
  insights, 
  isToday, 
  focusPoints 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface/40 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white tracking-wide">
          {dateStr}
          {isToday && <span className="ml-3 text-sm font-normal text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Idag</span>}
        </h3>
      </div>

      {isToday && focusPoints && focusPoints.some(p => p.trim() !== '') && (
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Dagens Fokus</h4>
          <ul className="space-y-2">
            {focusPoints.map((point, idx) => {
              if (!point.trim()) return null;
              return (
                <li key={idx} className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0" />
                  <span className="text-white/90 text-sm leading-relaxed">{point}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Insikter & Händelser</h4>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                {insight.category && (
                  <div className="text-xs font-medium text-accent mb-1">
                    {insight.category}
                  </div>
                )}
                <p className="text-white/80 text-sm leading-relaxed">
                  {insight.text || insight.content || 'Ingen text angiven'}
                </p>
                {insight.createdAt && (
                  <div className="mt-2 text-xs text-white/40">
                    {insight.createdAt.toDate().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm italic">Inga insikter loggade denna dag.</p>
        )}
      </div>
    </motion.div>
  );
};
