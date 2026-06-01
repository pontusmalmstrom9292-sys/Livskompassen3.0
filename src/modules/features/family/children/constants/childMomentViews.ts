export const CHILD_MOMENT_VIEWS = ['stunder', 'om', 'favoriter'] as const;
export type ChildMomentViewId = (typeof CHILD_MOMENT_VIEWS)[number];

export const CHILD_MOMENT_TAB_LABELS: Record<ChildMomentViewId, string> = {
  stunder: 'Stunder',
  om: 'Om',
  favoriter: 'Favoriter',
};

export function isChildMomentViewId(value: string | null): value is ChildMomentViewId {
  return value !== null && (CHILD_MOMENT_VIEWS as readonly string[]).includes(value);
}
