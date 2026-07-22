import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  focusPoints,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      className="mb-6 rounded-2xl border border-border/40 bg-surface/40 p-6 shadow-xl backdrop-blur-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-wide text-text">
          {dateStr}
          {isToday && (
            <span className="ml-3 rounded-full bg-success/10 px-2 py-1 text-sm font-normal text-success">
              Idag
            </span>
          )}
        </h3>
      </div>

      {isToday && focusPoints && focusPoints.some((p) => p.trim() !== '') && (
        <div className="mb-6 rounded-xl border border-border/30 bg-surface-3/40 p-4">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Dagens Fokus
          </h4>
          <ul className="space-y-2">
            {focusPoints.map((point, idx) => {
              if (!point.trim()) return null;
              return (
                <li key={idx} className="flex items-start">
                  <div className="mr-3 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success" aria-hidden />
                  <span className="text-sm leading-relaxed text-text-muted">{point}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Insikter & Händelser
        </h4>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-xl border border-border/30 bg-surface-3/30 p-4 transition-colors hover:bg-surface-3/50"
              >
                {insight.category && (
                  <div className="mb-1 text-xs font-medium text-accent">{insight.category}</div>
                )}
                <p className="text-sm leading-relaxed text-text-muted">
                  {insight.text || insight.content || 'Ingen text angiven'}
                </p>
                {insight.createdAt && (
                  <div className="mt-2 text-xs text-text-muted">
                    {insight.createdAt.toDate().toLocaleTimeString('sv-SE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-text-muted">Inga insikter loggade denna dag.</p>
        )}
      </div>
    </motion.div>
  );
};
