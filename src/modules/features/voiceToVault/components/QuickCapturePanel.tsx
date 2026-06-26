import { useEffect, useState } from 'react';
import { Mic, Loader2, Check, Send, Ear } from 'lucide-react';
import { useQuickCaptureStore } from '../store/useQuickCaptureStore';
import { speechService } from '../services/speechService';
import { parseVoiceCommand } from '../api/voiceCommandService';
import { fetchSpeglingsMirror } from '@/modules/features/lifeJournal/diary/mirror/api/speglingsCoachService';
import { MOOD_CATALOG } from '@/modules/features/lifeJournal/diary/diary/constants/moods';

type Props = {
  onDone?: () => void;
  compact?: boolean;
};

export function QuickCapturePanel({ onDone, compact = false }: Props) {
  const {
    isRecording,
    transcript,
    setRecording,
    setTranscript,
    appendTranscript,
    reset,
    close,
  } = useQuickCaptureStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [baraLyssna, setBaraLyssna] = useState(false);

  const handleToggleRecording = () => {
    if (isRecording) {
      speechService.stop();
      setRecording(false);
      return;
    }
    setRecording(true);
    setSubmitStatus('idle');
    setFeedbackMsg('');
    speechService.start(
      (text, isFinal) => {
        if (isFinal) appendTranscript(text);
      },
      (error) => {
        console.error('Speech error:', error);
        setRecording(false);
      },
      () => setRecording(false),
    );
  };

  useEffect(() => () => speechService.stop(), []);

  const handleSubmit = async () => {
    if (!transcript.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setFeedbackMsg('');
    try {
      if (baraLyssna) {
        const mirrorText = await fetchSpeglingsMirror(transcript);
        setSubmitStatus('success');
        setFeedbackMsg(mirrorText);
        // Ingen autostängning för Bara Lyssna
      } else {
        const result = await parseVoiceCommand(transcript);
        setSubmitStatus('success');
        setFeedbackMsg(result.message);
        window.setTimeout(() => {
          close();
          setSubmitStatus('idle');
          setFeedbackMsg('');
          reset();
          onDone?.();
        }, 2500);
      }
    } catch (error) {
      console.error('Failed to submit Quick Capture:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoodClick = (label: string) => {
    const current = transcript.trim();
    if (!current) {
      setTranscript(label);
    } else {
      setTranscript(current + ', ' + label.toLowerCase());
    }
  };

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <div className="space-y-3">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Börja prata, eller skriv din anteckning här..."
          className={`w-full resize-none rounded-xl border border-border bg-surface/40 p-4 text-text placeholder:text-text-dim focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 ${
            compact ? 'h-28 text-sm' : 'h-32'
          }`}
        />
        
        {/* Bara ord-inmatning */}
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1">
          {MOOD_CATALOG.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => handleMoodClick(mood.label)}
              className="shrink-0 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-accent/30 hover:bg-surface hover:text-text active:scale-95"
            >
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleToggleRecording}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all ${
            isRecording
              ? 'animate-pulse border border-accent/50 bg-accent/20 text-accent shadow-[0_0_15px_rgba(212,175,55,0.3)]'
              : 'border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
          }`}
          aria-label={isRecording ? 'Stoppa inspelning' : 'Starta inspelning'}
        >
          <Mic className={`h-6 w-6 ${isRecording ? 'animate-bounce' : ''}`} />
        </button>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm text-text-muted transition-colors hover:bg-surface/50 hover:text-text">
            <input
              type="checkbox"
              className="sr-only"
              checked={baraLyssna}
              onChange={(e) => setBaraLyssna(e.target.checked)}
            />
            <Ear className={`h-4 w-4 transition-colors ${baraLyssna ? 'text-accent' : ''}`} />
            <span className={`transition-colors ${baraLyssna ? 'text-accent font-medium' : ''}`}>
              Bara lyssna
            </span>
          </label>

          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
          >
            Rensa
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!transcript.trim() || isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-surface transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50"
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

      {submitStatus === 'error' ? (
        <p className="text-center text-sm text-red-400">Ett fel uppstod. Försök igen.</p>
      ) : null}
      {submitStatus === 'success' && feedbackMsg ? (
        <p className="text-center text-sm font-medium text-accent">{feedbackMsg}</p>
      ) : null}
    </div>
  );
}
