import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  BookHeart,
  BookOpen,
  Clock,
  Columns3,
  FolderKanban,
  Inbox,
  LayoutGrid,
  PenLine,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
  Wallet,
} from 'lucide-react';
import type { HubContextIconId } from '../navigation/hubContextBar';
import type { HubContextSlot } from '../navigation/hubContextBar';

const BY_ICON: Record<HubContextIconId, LucideIcon> = {
  list: ShoppingCart,
  calendar: Columns3,
  clock: Clock,
  note: PenLine,
  record: PenLine,
  wallet: Wallet,
  mail: Inbox,
  folder: FolderKanban,
  focus: Target,
  plus: LayoutGrid,
  sprout: Sparkles,
  book: BookOpen,
  brain: Sparkles,
  anchor: Anchor,
  sparkles: Sparkles,
  users: Users,
  bookheart: BookHeart,
};

/** Tydligare per slot-id (planering m.m.). */
const BY_SLOT_ID: Partial<Record<string, LucideIcon>> = {
  inkop: ShoppingCart,
  handling: Columns3,
  fokus: Target,
  inkorg: Inbox,
  hub: LayoutGrid,
  projekt: FolderKanban,
  planering: LayoutGrid,
  stampla: Clock,
  tid: Clock,
  logg: BookOpen,
  reflektion: Sparkles,
  livslogg: BookHeart,
  tillsammans: Users,
  hamn: Anchor,
  mabra: Sparkles,
  dagbok: BookOpen,
  biff: Anchor,
};

export function getDockNavIcon(slot: Pick<HubContextSlot, 'id' | 'icon'>): LucideIcon {
  return BY_SLOT_ID[slot.id] ?? BY_ICON[slot.icon] ?? LayoutGrid;
}

export function getDockSideIcon(icon: HubContextIconId): LucideIcon {
  return BY_ICON[icon] ?? LayoutGrid;
}
