import React, { useState, useEffect } from 'react';
import { useParalysisStore } from './store/paralysisStore';

export function ParalysisBreaker() {
  const { isZenModeActive, setZenMode, currentMicroTasks, breakDownTask, setMicroTasks } = useParalysisStore();
  const [taskInput, setTaskInput] = useState('');

  // Lyssna på global tangentbindning (t.ex. Escape för att stänga)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenModeActive) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenModeActive]);

  if (!isZenModeActive) return null;

  const handleClose = () => {
    setZenMode(false);
    setTaskInput('');
    setMicroTasks([]);
  };

  const handleBreakDown = () => {
    breakDownTask(taskInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[var(--color-nordic-dusk)]/95 backdrop-blur-xl transition-all duration-300">
      <div className="absolute top-6 right-6">
        <button 
          onClick={handleClose}
          className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Stäng Zen Mode"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">Paralysbrytaren</h2>
          <p className="text-xl text-white/70">Vad känns övermäktigt just nu?</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="T.ex. Ringa ett svårt samtal..."
            className="w-full px-6 py-4 text-xl bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleBreakDown()}
            autoFocus
          />
          <button
            onClick={handleBreakDown}
            disabled={!taskInput.trim()}
            className="w-full py-4 text-lg font-medium text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 rounded-2xl transition-colors"
          >
            Bryt upp den
          </button>
        </div>

        {currentMicroTasks.length > 0 && (
          <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-semibold text-white/90 mb-6">Mikrosteg:</h3>
            <ul className="space-y-4">
              {currentMicroTasks.map((task, index) => (
                <li 
                  key={index}
                  className="flex items-center p-4 bg-white/5 border border-white/10 rounded-xl text-white/90 text-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 text-sm font-medium">
                    {index + 1}
                  </div>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
