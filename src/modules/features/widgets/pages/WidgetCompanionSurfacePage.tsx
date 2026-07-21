/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md
 * Companion OS deep-link host — Android home chips → pack widgets. */
import { useEffect, useRef, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WidgetShell } from '../layout/WidgetShell';
import { bootCompanionSurface } from '@/widgets/core/bootCompanionSurface';
import { softFocusWidgetControl } from '@/widgets/core/softFocusWidgetControl';
import { QuickCaptureWidget } from '@/widgets/pack/QuickCaptureWidget';
import { InboxWidget } from '@/widgets/pack/InboxWidget';
import { QuickNoteWidget } from '@/widgets/pack/QuickNoteWidget';
import { SafeHarborWidget } from '@/widgets/pack/SafeHarborWidget';
import { CompassWidget } from '@/widgets/pack/CompassWidget';
import { ChildFocusWidget } from '@/widgets/pack/ChildFocusWidget';
import { BeaconWidget } from '@/widgets/pack/BeaconWidget';
import { JournalWidget } from '@/widgets/pack/JournalWidget';
import { DailyAnchorWidget } from '@/widgets/pack/DailyAnchorWidget';
import { CompanionDailyTasksHost } from '@/widgets/pack/CompanionDailyTasksHost';
import '@/widgets/companion-widgets.css';

export type CompanionSurfaceId =
  | 'capture'
  | 'inbox'
  | 'note'
  | 'harbor'
  | 'compass'
  | 'child'
  | 'beacon'
  | 'journal'
  | 'anchor'
  | 'tasks';

type SurfaceMeta = {
  title: string;
  lead: string;
  rootId: string;
  dataWidget: string;
  /** CSS selector for soft focus after Android open */
  focusSelector: string;
  render: (opts: { pulseHint: boolean }) => ReactNode;
};

const SURFACE: Record<CompanionSurfaceId, SurfaceMeta> = {
  capture: {
    title: 'Quick Capture',
    lead: 'Companion OS · röst till Valvet',
    rootId: 'cw-widget-capture-root',
    dataWidget: 'quick_capture',
    focusSelector: 'button[aria-label*="inspelning"]',
    render: ({ pulseHint }) => <QuickCaptureWidget pulseHint={pulseHint} />,
  },
  inbox: {
    title: 'Inkast',
    lead: 'Companion OS · ett tryck',
    rootId: 'cw-widget-inbox-root',
    dataWidget: 'inbox',
    focusSelector: '#cw-inbox-draft, button',
    render: ({ pulseHint }) => <InboxWidget pulseHint={pulseHint} />,
  },
  note: {
    title: 'Snabbanteckning',
    lead: 'Companion OS · text eller foto',
    rootId: 'cw-widget-note-root',
    dataWidget: 'quick_note',
    focusSelector: 'textarea',
    render: ({ pulseHint }) => <QuickNoteWidget pulseHint={pulseHint} />,
  },
  harbor: {
    title: 'Trygg Hamn',
    lead: 'Companion OS · lugn yta',
    rootId: 'cw-widget-harbor-root',
    dataWidget: 'safe_harbor',
    focusSelector: 'button[aria-label*="mening"]',
    render: ({ pulseHint }) => <SafeHarborWidget pulseHint={pulseHint} />,
  },
  compass: {
    title: 'Kompassen',
    lead: 'Companion OS · navet',
    rootId: 'cw-widget-compass-root',
    dataWidget: 'compass',
    focusSelector: '.cw-pill',
    render: ({ pulseHint }) => <CompassWidget pulseHint={pulseHint} />,
  },
  child: {
    title: 'Barnfokus',
    lead: 'Companion OS · dagens fråga',
    rootId: 'cw-widget-child-root',
    dataWidget: 'child_focus',
    focusSelector: 'textarea[aria-label="Svar"], button',
    render: ({ pulseHint }) => <ChildFocusWidget pulseHint={pulseHint} />,
  },
  beacon: {
    title: 'Fyren',
    lead: 'Companion OS · dagsform',
    rootId: 'cw-widget-beacon-root',
    dataWidget: 'beacon',
    focusSelector: 'button[aria-label*="Justera"]',
    render: ({ pulseHint }) => <BeaconWidget pulseHint={pulseHint} />,
  },
  journal: {
    title: 'Dagbok',
    lead: 'Companion OS · check-in',
    rootId: 'cw-widget-journal-root',
    dataWidget: 'journal',
    focusSelector: '.cw-mood',
    render: ({ pulseHint }) => <JournalWidget pulseHint={pulseHint} />,
  },
  anchor: {
    title: 'Dagens Ankare',
    lead: 'Companion OS · ett steg',
    rootId: 'cw-widget-anchor-root',
    dataWidget: 'daily_anchor',
    focusSelector: 'button',
    render: ({ pulseHint }) => <DailyAnchorWidget pulseHint={pulseHint} />,
  },
  tasks: {
    title: 'Dagens uppgifter',
    lead: 'Companion OS · nästa steg',
    rootId: 'cw-widget-tasks-root',
    dataWidget: 'daily_tasks',
    focusSelector: 'button[aria-label*="Markera klar"]',
    render: ({ pulseHint }) => (
      <CompanionDailyTasksHost maxVisible={3} pulseHint={pulseHint} />
    ),
  },
};

type Props = {
  surface: CompanionSurfaceId;
  /** Soft-focus primary control after mount. */
  softFocus?: boolean;
  /** Soft pulse CTA when opened from Android chip (capture/harbor/journal/anchor). */
  pulseHint?: boolean;
};

export function WidgetCompanionSurfacePage({
  surface,
  softFocus = false,
  pulseHint = false,
}: Props) {
  const meta = SURFACE[surface];
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootCompanionSurface(meta.rootId);
  }, [meta.rootId]);

  useEffect(() => {
    if (!softFocus) return;
    return softFocusWidgetControl({
      rootSelector: `#${meta.rootId}`,
      focusSelector: `[data-widget="${meta.dataWidget}"] ${meta.focusSelector}`,
      attempts: 5,
      delayMs: 380,
    });
  }, [softFocus, meta.rootId, meta.dataWidget, meta.focusSelector]);

  return (
    <WidgetShell title={meta.title} lead={meta.lead} companion>
      <div id={meta.rootId} className="px-3 pb-8 pt-2">
        {meta.render({ pulseHint })}
      </div>
    </WidgetShell>
  );
}

const PULSE_SURFACES: CompanionSurfaceId[] = [
  'capture',
  'inbox',
  'note',
  'harbor',
  'compass',
  'child',
  'beacon',
  'journal',
  'anchor',
  'tasks',
];

function surfacePage(surface: CompanionSurfaceId) {
  return function CompanionSurfaceRoute() {
    const [params] = useSearchParams();
    const softFocus =
      params.get('autostart') === '1' || params.get('focus') === '1';
    const pulseHint = softFocus && PULSE_SURFACES.includes(surface);
    return (
      <WidgetCompanionSurfacePage
        surface={surface}
        softFocus={softFocus}
        pulseHint={pulseHint}
      />
    );
  };
}

/** Back-compat wrapper for /widget/companion-capture */
export function WidgetCompanionCapturePage() {
  const [params] = useSearchParams();
  const softFocus =
    params.get('autostart') === '1' || params.get('focus') === '1';
  return (
    <WidgetCompanionSurfacePage
      surface="capture"
      softFocus={softFocus}
      pulseHint={softFocus}
    />
  );
}

export const WidgetCompanionInboxPage = surfacePage('inbox');
export const WidgetCompanionNotePage = surfacePage('note');
export const WidgetCompanionHarborPage = surfacePage('harbor');
export const WidgetCompanionCompassPage = surfacePage('compass');
export const WidgetCompanionChildPage = surfacePage('child');
export const WidgetCompanionBeaconPage = surfacePage('beacon');
export const WidgetCompanionJournalPage = surfacePage('journal');
export const WidgetCompanionAnchorPage = surfacePage('anchor');
export const WidgetCompanionTasksPage = surfacePage('tasks');
