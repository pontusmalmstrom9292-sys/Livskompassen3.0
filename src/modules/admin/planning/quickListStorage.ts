import type { QuickList, QuickListItem } from './types';

const STORAGE_KEY = 'livskompassen_quick_lists_v1';

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readAll(): Record<string, QuickList> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, QuickList>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, QuickList>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

const DEFAULT_INKOP: QuickList = {
  id: 'inkop',
  title: 'Inköpslista',
  items: [],
  updatedAt: new Date().toISOString(),
};

export function getQuickList(listId: string): QuickList {
  const all = readAll();
  return all[listId] ?? { ...DEFAULT_INKOP, id: listId };
}

export function saveQuickList(list: QuickList): void {
  const all = readAll();
  all[list.id] = { ...list, updatedAt: new Date().toISOString() };
  writeAll(all);
}

export function addQuickListItem(listId: string, text: string): QuickList {
  const list = getQuickList(listId);
  const next: QuickList = {
    ...list,
    items: [...list.items, { id: newId(), text: text.trim(), done: false }],
  };
  saveQuickList(next);
  return next;
}

export function toggleQuickListItem(listId: string, itemId: string): QuickList {
  const list = getQuickList(listId);
  const next: QuickList = {
    ...list,
    items: list.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)),
  };
  saveQuickList(next);
  return next;
}

export function removeQuickListItem(listId: string, itemId: string): QuickList {
  const list = getQuickList(listId);
  const next: QuickList = {
    ...list,
    items: list.items.filter((i) => i.id !== itemId),
  };
  saveQuickList(next);
  return next;
}

export function clearDoneQuickListItems(listId: string): QuickList {
  const list = getQuickList(listId);
  const next: QuickList = {
    ...list,
    items: list.items.filter((i) => !i.done),
  };
  saveQuickList(next);
  return next;
}

export function openItems(list: QuickList): QuickListItem[] {
  return list.items.filter((i) => !i.done);
}
