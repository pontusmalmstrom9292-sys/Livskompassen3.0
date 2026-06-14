import { useState, useEffect } from 'react';
import { useParalysisStore } from './store/paralysisStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';

export function ParalysisBreaker() {
  const { isZenModeActive, isLoading, setZenMode, currentMicroTasks, breakDownTask, setMicroTasks } = useParalysisStore();
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

  const handleClose = () => {
    setZenMode(false);
    setTaskInput('');
    setMicroTasks([]);
  };

  const handleBreakDown = () => {
    breakDownTask(taskInput);
  };

  return (
    <AnimatePresence>
      {isZenModeActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[var(--color-nordic-dusk)]/95 backdrop-blur-xl"
        >
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

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
            className="w-full max-w-xl mx-auto space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white tracking-tight">{MICRO_STEP_PANEL_TITLE}</h2>
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
                disabled={isLoading}
              />
              <button
                onClick={handleBreakDown}
                disabled={!taskInput.trim() || isLoading}
                className="w-full py-4 text-lg font-medium text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Bryter ner...
                  </>
                ) : (
                  'Bryt upp den'
                )}
              </button>
            </div>

            <AnimatePresence>
              {currentMicroTasks.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-12 space-y-4"
                >
                  <h3 className="text-2xl font-semibold text-white/90 mb-6">Mikrosteg:</h3>
                  <ul className="space-y-4">
                    {currentMicroTasks.map((task, index) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        key={index}
                        className="flex items-center p-4 bg-white/5 border border-white/10 rounded-xl text-white/90 text-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 text-sm font-medium">
                          {index + 1}
                        </div>
                        {task}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
