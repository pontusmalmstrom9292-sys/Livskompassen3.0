/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import type { UserWidget, UserWidgetRow } from '@/core/types/firestore';
import { isWidgetMvpType } from '../config/widgetMvpTypes';
import { resolveWidgetStylePreset } from '../config/widgetStylePresets';

const HOME_SLOT = 'hem.brass.below-grid' as const;

/** Normaliserar defaults för UI/render — schemaVersion, status, pin-compat. */
export function normalizeUserWidget(
  raw: Partial<UserWidget> & { id?: string; type: UserWidget['type']; title: string },
): UserWidget | UserWidgetRow {
  const slotId = raw.slotId ?? null;
  const pinnedToHome = Boolean(raw.pinnedToHome || slotId);
  const type = isWidgetMvpType(raw.type) ? raw.type : 'quick_note';
  const schemaVersion = raw.schemaVersion === 2 ? 2 : 1;
  const status = raw.status === 'archived' ? 'archived' : 'active';
  const stylePreset = raw.stylePreset ?? null;
  const preset = resolveWidgetStylePreset(stylePreset);
  const config = { ...(raw.config ?? {}) };
  if (!config.shell) config.shell = preset.defaultShell;

  const titleRaw = typeof raw.title === 'string' ? raw.title.trim() : '';
  const orderRaw = Number(raw.order ?? 0);

  const base: UserWidget = {
    userId: raw.userId ?? '',
    ownerId: raw.ownerId ?? raw.userId ?? '',
    type,
    title: (titleRaw || 'Modul').slice(0, 100),
    pinnedToHome,
    order: Number.isFinite(orderRaw) ? orderRaw : 0,
    schemaVersion,
    stylePreset,
    slotId,
    status,
    config,
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt,
  };

  if (raw.id) return { ...base, id: raw.id };
  return base;
}

export function isPinnedToHomeSlot(widget: Pick<UserWidget, 'slotId' | 'pinnedToHome'>): boolean {
  return widget.slotId === HOME_SLOT || (Boolean(widget.pinnedToHome) && !widget.slotId);
}

export const USER_WIDGET_HOME_SLOT_ID = HOME_SLOT;
