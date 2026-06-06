import { useEffect, useRef } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { CapturePanel } from './CapturePanel';
import { InkastDirectPanel } from './InkastDirectPanel';

export type CaptureSuperVariant =
  | 'hem-capture'
  | 'hem-inkast'
  | 'valv-compact'
  | 'planering'
  | 'kompass';

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
};

/**
 * Canonical router för G10 capture/inkast-ytor.
 * Fas 2: kompass-variant för HomeAdaptiveCompass.
 */
export function CaptureSuperModule({
  variant,
  onQueued,
  onPersistedBevis,
  compact = false,
  onSaved,
}: CaptureSuperModuleProps) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (variant !== 'hem-inkast') return;
    if (window.location.hash.replace(/^#/, '') !== 'inkast-lite') return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [variant]);

  if (variant === 'hem-capture' || variant === 'planering' || variant === 'kompass') {
    return (
      <CapturePanel
        sourceModule={SOURCE_MODULE[variant] ?? 'hem_capture'}
        compact={compact || variant === 'kompass'}
        onSaved={onSaved}
      />
    );
  }

  if (variant === 'valv-compact') {
    return (
      <InkastDirectPanel
        tone="valv"
        sourceModule={SOURCE_MODULE['valv-compact']}
        onQueued={onQueued}
        onPersistedBevis={onPersistedBevis}
        queueHintAsButton
      />
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
      <InkastDirectPanel tone="hem" />
    </section>
  );
}
