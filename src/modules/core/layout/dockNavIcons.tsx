import type { HubContextIconId } from '../navigation/hubContextBar';
import type { HubContextSlot } from '../navigation/hubContextBar';
import type { DockGlyphId } from './DockHubGlyphs';

const BY_ICON: Record<HubContextIconId, DockGlyphId> = {
  list: 'cart',
  calendar: 'calendar',
  clock: 'clock',
  note: 'pen',
  record: 'pen',
  wallet: 'wallet',
  mail: 'mail',
  folder: 'folder',
  focus: 'target',
  plus: 'grid',
  sprout: 'sparkles',
  book: 'book',
  brain: 'sparkles',
  anchor: 'anchor',
  sparkles: 'sparkles',
  users: 'users',
  bookheart: 'bookheart',
};

const BY_SLOT_ID: Partial<Record<string, DockGlyphId>> = {
  inkop: 'cart',
  handling: 'calendar',
  fokus: 'target',
  inkorg: 'mail',
  hub: 'grid',
  projekt: 'folder',
  planering: 'grid',
  stampla: 'clock',
  tid: 'clock',
  logg: 'book',
  reflektion: 'sparkles',
  livslogg: 'bookheart',
  tillsammans: 'users',
  hamn: 'anchor',
  mabra: 'sparkles',
  dagbok: 'book',
  biff: 'anchor',
};

export function getDockNavIcon(slot: Pick<HubContextSlot, 'id' | 'icon'>): DockGlyphId {
  return BY_SLOT_ID[slot.id] ?? BY_ICON[slot.icon] ?? 'grid';
}

export function getDockSideIcon(icon: HubContextIconId): DockGlyphId {
  return BY_ICON[icon] ?? 'grid';
}
