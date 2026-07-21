/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { registerWidget, type WidgetDefinition } from '../core/WidgetFramework';

/** All 10 core pack definitions (WIDGET_BIBLE kap 4). */
export const CORE_PACK_DEFINITIONS: WidgetDefinition[] = [
  { id: 'quick_capture', title: 'Quick Capture', size: 'small', level: 1, moduleKey: 'inkast' },
  { id: 'compass', title: 'Kompassen', size: 'large', level: 3, moduleKey: 'kompass' },
  { id: 'quick_note', title: 'Snabbanteckning', size: 'small', level: 1, moduleKey: 'inkast' },
  { id: 'inbox', title: 'Inkast', size: 'small', level: 1, moduleKey: 'inkast' },
  { id: 'daily_anchor', title: 'Dagens Ankare', size: 'xs', level: 2, moduleKey: 'planering' },
  { id: 'child_focus', title: 'Barnfokus', size: 'medium', level: 1, moduleKey: 'barn' },
  { id: 'beacon', title: 'Fyren', size: 'medium', level: 3, moduleKey: 'fyren' },
  { id: 'daily_tasks', title: 'Dagens Uppgifter', size: 'small', level: 2, moduleKey: 'planering' },
  { id: 'journal', title: 'Dagbok', size: 'small', level: 1, moduleKey: 'dagbok' },
  { id: 'safe_harbor', title: 'Trygg Hamn', size: 'small', level: 3, moduleKey: 'hamn' },
];

export function registerCorePack(): void {
  for (const def of CORE_PACK_DEFINITIONS) {
    registerWidget(def);
  }
}

export { QuickCaptureWidget } from './QuickCaptureWidget';
export { CompassWidget } from './CompassWidget';
export { QuickNoteWidget } from './QuickNoteWidget';
export { InboxWidget } from './InboxWidget';
export { DailyAnchorWidget } from './DailyAnchorWidget';
export { ChildFocusWidget } from './ChildFocusWidget';
export { BeaconWidget } from './BeaconWidget';
export { DailyTasksWidget } from './DailyTasksWidget';
export { JournalWidget } from './JournalWidget';
export { SafeHarborWidget } from './SafeHarborWidget';
