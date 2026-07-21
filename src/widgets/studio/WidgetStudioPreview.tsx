/**
 * Live preview of one Companion widget inside Widget Studio.
 */

import { useEffect, useRef, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { bootCompanionSurface } from '../core/bootCompanionSurface';
import { BeaconWidget } from '../pack/BeaconWidget';
import { ChildFocusWidget } from '../pack/ChildFocusWidget';
import { CompassWidget } from '../pack/CompassWidget';
import { DailyAnchorWidget } from '../pack/DailyAnchorWidget';
import { DailyTasksWidget } from '../pack/DailyTasksWidget';
import { InboxWidget } from '../pack/InboxWidget';
import { JournalWidget } from '../pack/JournalWidget';
import { QuickCaptureWidget } from '../pack/QuickCaptureWidget';
import { QuickNoteWidget } from '../pack/QuickNoteWidget';
import { SafeHarborWidget } from '../pack/SafeHarborWidget';
import { useStudioWidgetConfig } from './useStudioWidgetConfig';
import { patchWidgetStudioConfig } from './widgetStudioStore';

const PREVIEW_MAP = {
  quick_capture: QuickCaptureWidget,
  compass: CompassWidget,
  quick_note: QuickNoteWidget,
  inbox: InboxWidget,
  daily_anchor: DailyAnchorWidget,
  child_focus: ChildFocusWidget,
  beacon: BeaconWidget,
  daily_tasks: DailyTasksWidget,
  journal: JournalWidget,
  safe_harbor: SafeHarborWidget,
} as const;

const ROOT_ID = 'cw-studio-preview-root';

export function WidgetStudioPreview({ widgetId }: { widgetId: string }) {
  const booted = useRef(false);
  const Comp = PREVIEW_MAP[widgetId as keyof typeof PREVIEW_MAP];
  const cfg = useStudioWidgetConfig(widgetId);
  const on = cfg?.enabled !== false;
  const pinned = cfg?.homePin === true;
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootCompanionSurface(ROOT_ID);
  }, []);

  useEffect(() => {
    setPulse(false);
  }, [widgetId]);

  if (!Comp) {
    return (
      <div className="cw-empty" role="status">
        <p className="cw-empty__title">Förhandsvisning</p>
        <p className="cw-empty__message">Ingen förhandsvisning för denna widget.</p>
      </div>
    );
  }

  return (
    <div id={ROOT_ID} aria-label="Förhandsvisning" style={{ marginTop: '0.35rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          marginBottom: '0.55rem',
          flexWrap: 'wrap',
        }}
      >
        <p className="cw-eyebrow">Förhandsvisning · interaktiv</p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <WidgetButton
            variant={on ? 'gold' : 'ghost'}
            size="min"
            onClick={() => {
              void patchWidgetStudioConfig(widgetId, { enabled: !on });
            }}
          >
            {on ? 'På Hem' : 'Av'}
          </WidgetButton>
          <WidgetButton
            variant={pinned ? 'ethereal' : 'quiet'}
            size="min"
            onClick={() => {
              void patchWidgetStudioConfig(widgetId, { homePin: !pinned });
            }}
          >
            {pinned ? '✦ Fäst' : 'Fäst'}
          </WidgetButton>
          <WidgetButton
            variant={pulse ? 'ethereal' : 'quiet'}
            size="min"
            aria-pressed={pulse}
            onClick={() => setPulse((v) => !v)}
          >
            {pulse ? 'Pulse på' : 'Pulse'}
          </WidgetButton>
        </div>
      </div>
      <Comp pulseHint={pulse} />
    </div>
  );
}
