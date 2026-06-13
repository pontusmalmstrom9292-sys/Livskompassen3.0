import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, X, Loader2, Check, Send } from 'lucide-react';
import { useQuickCaptureStore } from '../store/useQuickCaptureStore';
import { speechService } from '../services/speechService';
import { submitInkastLite } from '@/modules/inkast/api/inkastService';

export function QuickCaptureOverlay() {
  const { isOpen, isRecording, transcript, open, close, setRecording, setTranscript, appendTranscript, reset } = useQuickCaptureStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Handle Speech Recognition
  const handleToggleRecording = () => {
    if (isRecording) {
      speechService.stop();
      setRecording(false);
    } else {
      setRecording(true);
      setSubmitStatus('idle');
      speechService.start(
        (text, isFinal) => {
          if (isFinal) {
            appendTranscript(text);
          } else {
            // For a simpler UX we might just use final transcripts,
            // or overwrite the interim text. We'll append final text.
          }
        },
        (error) => {
          console.error('Speech error:', error);
          setRecording(false);
        },
        () => {
          setRecording(false);
        }
      );
    }
  };

  // Stop recording on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await submitInkastLite({ text: transcript });
      setSubmitStatus('success');
      setTimeout(() => {
        close();
        setSubmitStatus('idle');
      }, 1500);
    } catch (error) {
      console.error('Failed to submit Quick Capture:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={open}
            className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#12151f] text-[#d4af37] shadow-lg shadow-black/50 border border-[#d4af37]/30 hover:border-[#d4af37]/60 hover:bg-[#1a1f2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
            aria-label="Öppna Snabbinspelning"
          >
            <Mic className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1614]/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#12151f] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display-serif text-xl text-[#d4af37]">Voice-to-Vault</h2>
                <button
                  onClick={close}
                  className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                  aria-label="Stäng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Börja prata, eller skriv din anteckning här..."
                  className="h-32 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-white placeholder-white/30 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleToggleRecording}
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                    isRecording
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                      : 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37]/20'
                  }`}
                  aria-label={isRecording ? 'Stoppa inspelning' : 'Starta inspelning'}
                >
                  <Mic className={`h-7 w-7 ${isRecording ? 'animate-bounce' : ''}`} />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={reset}
                    className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Rensa
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!transcript.trim() || isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 font-medium text-[#12151f] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ebd074] transition-colors"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : submitStatus === 'success' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Skicka
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {submitStatus === 'error' && (
                <p className="mt-4 text-sm text-red-400 text-center">
                  Ett fel uppstod. Försök igen.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
