import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { CapturePanel } from './CapturePanel';
import { HemCaptureModulValjare, type HemCaptureChoice } from './components/HemCaptureModulValjare';
import { hasSeenHemCaptureModulValjare } from './utils/hemCaptureModulValjareStorage';
import { useCaptureOfflineFlush } from './hooks/useCaptureOfflineFlush';
import { InkastDirectPanel } from './InkastDirectPanel';
import { ReviewQueuePipelinePanel } from './ReviewQueuePipelinePanel';

export type CaptureSuperVariant =
  | 'hem-capture'
  | 'hem-inkast'
  | 'valv-compact'
  | 'planering'
  | 'kompass'
  | 'mabra'
  | 'familjen'
  | 'ekonomi';

export type CaptureSuperModuleProps = {
  variant: CaptureSuperVariant;
  /** Valv: callback när post hamnar i granskningskö */
  onQueued?: () => void;
  /** Valv: callback när bevis persistats */
  onPersistedBevis?: (docId: string) => void;
  compact?: boolean;
  onSaved?: () => void;
};

const SOURCE_MODULE: Record<CaptureSuperVariant, string | undefined> = {
  'hem-capture': 'hem_capture',
  'hem-inkast': undefined,
  'valv-compact': 'valv_samla',
  planering: 'planering_inkorg',
  kompass: 'hem_smart_inkast',
  mabra: 'mabra_inkast',
  familjen: 'familjen',
  ekonomi: 'ekonomi_inkast',
};

const HEM_CAPTURE_HINTS: Record<Exclude<HemCaptureChoice, 'text'>, string> = {
  photo:
    'Fota kvitto via Fyren (kamera i appfältet) eller klistra OCR-text från bank nedan — granska innan spar.',
  widget:
    'Tryck mikrofonen i Fyren längst ner för tyst inspelning. Text hamnar här efter granskning.',
};

/**
 * Canonical router för G10 capture/inkast-ytor.
 * v2: hem-capture inkluderar ReviewQueuePipelinePanel (lokalt + molnet-summary).
 */
export function CaptureSuperModule({
  variant,
  onQueued,
  onPersistedBevis,
  compact = false,
  onSaved,
}: CaptureSuperModuleProps) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const userId = useStore((s) => s.user?.uid);
  const sectionRef = useRef<HTMLElement>(null);
  const [showCapturePicker, setShowCapturePicker] = useState(
    () => variant === 'hem-capture' && !hasSeenHemCaptureModulValjare(),
  );
  const [composeHint, setComposeHint] = useState<string | null>(null);
  const [focusOnCompose, setFocusOnCompose] = useState(false);
  const [queueRefresh, setQueueRefresh] = useState(0);

  const handleQueueFlushed = useCallback((count: number) => {
    if (count > 0) setQueueRefresh((k) => k + 1);
  }, []);

  useCaptureOfflineFlush(userId, { onFlushed: handleQueueFlushed });

  const handleCaptureSaved = () => {
    onSaved?.();
    setQueueRefresh((k) => k + 1);
  };

  useEffect(() => {
    if (variant !== 'hem-inkast') return;
    if (window.location.hash.replace(/^#/, '') !== 'inkast-lite') return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [variant]);

  const handleCaptureChoice = (choice: HemCaptureChoice) => {
    setShowCapturePicker(false);
    setComposeHint(choice === 'text' ? null : HEM_CAPTURE_HINTS[choice]);
    setFocusOnCompose(choice === 'text');
  };

  if (
    variant === 'hem-capture' ||
    variant === 'planering' ||
    variant === 'kompass' ||
    variant === 'mabra' ||
    variant === 'familjen' ||
    variant === 'ekonomi'
  ) {
    if (variant === 'hem-capture' && showCapturePicker) {
      return (
        <div className="calm-card glow-bottom-gold overflow-hidden rounded-2xl p-4 sm:p-5">
          <HemCaptureModulValjare
            onSelect={handleCaptureChoice}
            onSkip={() => setShowCapturePicker(false)}
          />
        </div>
      );
    }

    return (
      <>
        <div className="mb-2 flex items-center justify-end">
          <ModuleHelpFromRegistry moduleId="capture" mode={variant} />
        </div>
        {variant === 'hem-capture' && (
          <div className="mb-2 flex justify-end">
            <Button variant="ghost" size="sm" className="text-text-dim" onClick={() => setShowCapturePicker(true)}>
              Byt ingång
            </Button>
          </div>
        )}
        <CapturePanel
          sourceModule={SOURCE_MODULE[variant] ?? 'hem_capture'}
          allowFiles
          maxFiles={8}
          compact={
            compact ||
            variant === 'kompass' ||
            variant === 'mabra' ||
            variant === 'familjen' ||
            variant === 'ekonomi'
          }
          onSaved={handleCaptureSaved}
          composeHint={variant === 'hem-capture' ? composeHint : null}
          focusOnCompose={variant === 'hem-capture' && focusOnCompose}
        />
        {(variant === 'hem-capture' ||
          variant === 'kompass' ||
          variant === 'planering' ||
          variant === 'mabra' ||
          variant === 'familjen' ||
          variant === 'ekonomi') && (
          <ReviewQueuePipelinePanel
            mode="summary"
            refreshToken={queueRefresh}
            showWhenEmpty={variant === 'planering'}
            prioritizePlanering={variant === 'planering'}
          />
        )}
      </>
    );
  }

  if (variant === 'valv-compact') {
    return (
      <div className="space-y-2">
        <div className="flex justify-end">
          <ModuleHelpFromRegistry moduleId="capture" mode="valv-compact" />
        </div>
        <InkastDirectPanel
        tone="valv"
        sourceModule={SOURCE_MODULE['valv-compact']}
        onQueued={onQueued}
        onPersistedBevis={onPersistedBevis}
        queueHintAsButton
      />
      </div>
    );
  }

  // hem-inkast
  if (!isAuthenticated) {
    return (
      <section id="inkast-lite" ref={sectionRef} className="scroll-mt-28">
        <BentoCard title="Inkast" description="Kräver inloggning">
          <p className="text-sm text-text-muted">
            Logga in för att klistra in eller ladda upp till rätt arkiv.
          </p>
        </BentoCard>
      </section>
    );
  }

  return (
    <section id="inkast-lite" ref={sectionRef} className="scroll-mt-28">
      <div className="mb-2 flex justify-end">
        <ModuleHelpFromRegistry moduleId="capture" mode="hem-inkast" />
      </div>
      <InkastDirectPanel
        tone="hem"
        onQueued={onQueued}
        queueHintAsButton={Boolean(onQueued)}
      />
    </section>
  );
}
