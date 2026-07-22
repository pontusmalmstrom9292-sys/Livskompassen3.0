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

type SurfaceRenderOpts = {
  pulseHint: boolean;
  autostart: boolean;
  autoVoice: boolean;
  autoPhoto: boolean;
  /** Inbox: open text/link panel once. */
  autoText?: boolean;
  autoLink?: boolean;
  /** Journal: open write draft once. */
  autoWrite?: boolean;
};

type SurfaceMeta = {
  title: string;
  lead: string;
  rootId: string;
  dataWidget: string;
  /** CSS selector for soft focus after Android open */
  focusSelector: string;
  render: (opts: SurfaceRenderOpts) => ReactNode;
};

const SURFACE: Record<CompanionSurfaceId, SurfaceMeta> = {
  capture: {
    title: 'Hemlig inspelning',
    lead: 'Companion OS · röst till Valvet',
    rootId: 'cw-widget-capture-root',
    dataWidget: 'quick_capture',
    focusSelector: 'button[aria-label*="inspelning"]',
    render: ({ pulseHint, autostart }) => (
      <QuickCaptureWidget pulseHint={pulseHint} autostart={autostart} />
    ),
  },
  inbox: {
    title: 'Inkast',
    lead: 'Companion OS · ett tryck',
    rootId: 'cw-widget-inbox-root',
    dataWidget: 'inbox',
    focusSelector: '#cw-inbox-draft, button',
    render: ({ pulseHint, autoVoice, autoPhoto, autoText, autoLink }) => (
      <InboxWidget
        pulseHint={pulseHint}
        autoVoice={autoVoice}
        autoPhoto={autoPhoto}
        autoText={autoText}
        autoLink={autoLink}
      />
    ),
  },
  note: {
    title: 'Snabba anteckningar',
    lead: 'Companion OS · text, foto eller röst',
    rootId: 'cw-widget-note-root',
    dataWidget: 'quick_note',
    focusSelector: 'textarea',
    render: ({ pulseHint, autoVoice, autoPhoto }) => (
      <QuickNoteWidget pulseHint={pulseHint} autoVoice={autoVoice} autoPhoto={autoPhoto} />
    ),
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
    focusSelector: '.cw-mood, textarea[aria-label="Snabb dagboksrad"]',
    render: ({ pulseHint, autoWrite }) => (
      <JournalWidget pulseHint={pulseHint} autoWrite={autoWrite} />
    ),
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
  /** Soft pulse CTA when opened from Android chip. */
  pulseHint?: boolean;
  /** Capture: `?autostart=1` starts MediaRecorder (Fyren WH1 parity). */
  autostart?: boolean;
  /** Note/Inbox: `?voice=1` starts voice once. */
  autoVoice?: boolean;
  /** Note/Inbox: `?photo=1` opens camera once. */
  autoPhoto?: boolean;
  /** Inbox: `?text=1` opens text panel. */
  autoText?: boolean;
  /** Inbox: `?link=1` opens link panel. */
  autoLink?: boolean;
  /** Journal: `?write=1` opens draft. */
  autoWrite?: boolean;
};

export function WidgetCompanionSurfacePage({
  surface,
  softFocus = false,
  pulseHint = false,
  autostart = false,
  autoVoice = false,
  autoPhoto = false,
  autoText = false,
  autoLink = false,
  autoWrite = false,
}: Props) {
  const meta = SURFACE[surface];
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootCompanionSurface(meta.rootId);
  }, [meta.rootId]);

  useEffect(() => {
    /* Autostart owns the mic — skip soft-focus race. */
    if (!softFocus || autostart || autoVoice || autoPhoto || autoText || autoLink || autoWrite) return;
    return softFocusWidgetControl({
      rootSelector: `#${meta.rootId}`,
      focusSelector: `[data-widget="${meta.dataWidget}"] ${meta.focusSelector}`,
      attempts: 5,
      delayMs: 380,
    });
  }, [
    softFocus,
    autostart,
    autoVoice,
    autoPhoto,
    autoText,
    autoLink,
    autoWrite,
    meta.rootId,
    meta.dataWidget,
    meta.focusSelector,
  ]);

  return (
    <WidgetShell title={meta.title} lead={meta.lead} companion>
      <div id={meta.rootId} className="px-3 pb-8 pt-2">
        {meta.render({
          pulseHint,
          autostart,
          autoVoice,
          autoPhoto,
          autoText,
          autoLink,
          autoWrite,
        })}
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
    const autostart = params.get('autostart') === '1';
    const voice = params.get('voice') === '1';
    const photo = params.get('photo') === '1';
    const text = params.get('text') === '1';
    const link = params.get('link') === '1';
    const write = params.get('write') === '1';
    const softFocus =
      autostart ||
      params.get('focus') === '1' ||
      voice ||
      photo ||
      text ||
      link ||
      write;
    const pulseHint =
      softFocus &&
      !autostart &&
      !voice &&
      !photo &&
      !text &&
      !link &&
      !write &&
      PULSE_SURFACES.includes(surface);
    return (
      <WidgetCompanionSurfacePage
        surface={surface}
        softFocus={softFocus}
        pulseHint={pulseHint}
        autostart={surface === 'capture' ? autostart : false}
        autoVoice={
          surface === 'note' || surface === 'inbox' ? voice : false
        }
        autoPhoto={
          surface === 'note' || surface === 'inbox' ? photo : false
        }
        autoText={surface === 'inbox' ? text : false}
        autoLink={surface === 'inbox' ? link : false}
        autoWrite={surface === 'journal' ? write : false}
      />
    );
  };
}

/** Back-compat wrapper for /widget/companion-capture — `?autostart=1` starts recording. */
export function WidgetCompanionCapturePage() {
  const [params] = useSearchParams();
  const autostart = params.get('autostart') === '1';
  const softFocus = autostart || params.get('focus') === '1';
  return (
    <WidgetCompanionSurfacePage
      surface="capture"
      softFocus={softFocus}
      pulseHint={softFocus && !autostart}
      autostart={autostart}
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
