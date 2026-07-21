/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import type { UserWidget } from '@/core/types/firestore';

/** Frozen MVP type whitelist — ny typ kräver contract + rules PMIR. */
export const WIDGET_MVP_TYPES = [
  'countdown',
  'checklist',
  'linked_savings',
  'quick_note',
] as const satisfies readonly UserWidget['type'][];

export type WidgetMvpType = (typeof WIDGET_MVP_TYPES)[number];

export function isWidgetMvpType(value: string): value is WidgetMvpType {
  return (WIDGET_MVP_TYPES as readonly string[]).includes(value);
}
