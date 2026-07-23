/**
 * Studio live AI mode + safe demo overrides (local cache only).
 */

import { useEffect, useState, type CSSProperties } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetGlass } from '../components/WidgetGlass';
import { removeCached, setCached, subscribeWidgetCache } from '../core/WidgetCache';
import { WidgetPalette, WidgetTouch } from '../core/WidgetTheme';
import {
  readCompanionAiSignals,
  STUDIO_SIGNAL_OVERRIDE_KEY,
} from '../smart/readCompanionSignals';
import { resolveWidgetAi, type AiMode, type WidgetAiSignals } from '../smart/widgetAiContext';

const MODE_COPY: Record<AiMode, { title: string; hint: string }> = {
  normal: {
    title: 'Normalt',
    hint: 'Tid och dina val styr ytan.',
  },
  harbor: {
    title: 'Hamn',
    hint: 'Hög belastning — Trygg Hamn först.',
  },
  single_task: {
    title: 'Ett steg',
    hint: 'Många öppna uppgifter — en i taget.',
  },
  family: {
    title: 'Barnvecka',
    hint: 'Närvaro före prestation.',
  },
  anchor_only: {
    title: 'Ankare',
    hint: 'Låg energi — ett mikrosteg räcker.',
  },
};

async function setDemoOverride(partial: Partial<WidgetAiSignals> | null): Promise<void> {
  if (!partial) {
    await removeCached(STUDIO_SIGNAL_OVERRIDE_KEY);
    return;
  }
  await setCached(STUDIO_SIGNAL_OVERRIDE_KEY, { ...partial, at: Date.now() });
}

const labelStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.68rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: WidgetPalette.premiumGoldDim,
};

/**
 * Shows current Companion surface mode and demo triggers for Studio.
 */
export function WidgetStudioModePanel({ smartAiEnabled }: { smartAiEnabled: boolean }) {
  const [, setTick] = useState(0);

  useEffect(() => subscribeWidgetCache(() => setTick((n) => n + 1)), []);

  const signals = readCompanionAiSignals();
  const ai = resolveWidgetAi(signals);
  const copy = MODE_COPY[ai.mode];

  if (!smartAiEnabled) {
    return (
      <WidgetGlass style={{ padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <p style={labelStyle}>Aktivt läge</p>
        <p style={{ margin: '0.35rem 0 0', color: WidgetPalette.mutedText, fontSize: '0.9rem' }}>
          Lugnt AI-stöd är av — ytan följer tid och dina På-widgets.
        </p>
      </WidgetGlass>
    );
  }

  return (
    <WidgetGlass style={{ padding: '0.85rem 1rem', marginBottom: '1rem' }}>
      <p style={labelStyle}>Aktivt läge</p>
      <p
        style={{
          margin: '0.35rem 0 0.15rem',
          color: WidgetPalette.premiumGoldLight,
          fontSize: '1.05rem',
          fontWeight: 600,
        }}
      >
        {copy.title}
      </p>
      <p style={{ margin: 0, color: WidgetPalette.mutedText, fontSize: '0.88rem', lineHeight: 1.4 }}>
        {ai.message || copy.hint}
      </p>
      <p
        style={{
          margin: '0.55rem 0 0.35rem',
          color: WidgetPalette.mutedText,
          fontSize: '0.78rem',
        }}
      >
        Energi {signals.energy} · Stress {signals.stress} · Uppgifter {signals.openTaskCount}
        {signals.isBarnvecka ? ' · Barnvecka' : ''}
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          marginTop: '0.55rem',
        }}
      >
        <WidgetButton
          variant="quiet"
          size="min"
          style={{ minHeight: Math.max(44, Math.round(WidgetTouch.minDp * 0.72)) }}
          aria-label="Demo: låg energi — visa ankare-läge"
          onClick={() =>
            void setDemoOverride({ energy: 25, stress: 40, sleep: 35, openTaskCount: 1 })
          }
        >
          Demo: låg energi
        </WidgetButton>
        <WidgetButton
          variant="quiet"
          size="min"
          style={{ minHeight: Math.max(44, Math.round(WidgetTouch.minDp * 0.72)) }}
          aria-label="Demo: hög stress — visa Hamn-läge"
          onClick={() =>
            void setDemoOverride({ energy: 50, stress: 78, sleep: 60, openTaskCount: 2 })
          }
        >
          Demo: stress
        </WidgetButton>
        <WidgetButton
          variant="quiet"
          size="min"
          style={{ minHeight: Math.max(44, Math.round(WidgetTouch.minDp * 0.72)) }}
          aria-label="Demo: många uppgifter — ett steg i taget"
          onClick={() =>
            void setDemoOverride({
              energy: 55,
              stress: 40,
              sleep: 60,
              openTaskCount: 8,
            })
          }
        >
          Demo: många uppgifter
        </WidgetButton>
        <WidgetButton
          variant="quiet"
          size="min"
          style={{ minHeight: Math.max(44, Math.round(WidgetTouch.minDp * 0.72)) }}
          aria-label="Demo: barnvecka — familjeläge"
          onClick={() =>
            void setDemoOverride({
              energy: 55,
              stress: 35,
              sleep: 65,
              openTaskCount: 2,
              isBarnvecka: true,
            })
          }
        >
          Demo: barnvecka
        </WidgetButton>
        <WidgetButton
          variant="ghost"
          size="min"
          style={{ minHeight: Math.max(44, Math.round(WidgetTouch.minDp * 0.72)) }}
          aria-label="Rensa demo-läge och återgå till riktiga signaler"
          onClick={() => void setDemoOverride(null)}
        >
          Rensa demo
        </WidgetButton>
      </div>
    </WidgetGlass>
  );
}
