/**
 * Map Studio idle animation → CSS class (bible 5.1 / 6).
 * slow_rotate reserved for compass rose — cards only support breathe/static.
 */

export function studioIdleClass(animation?: string | null): string {
  if (animation === 'breathe') return 'cw-anim-breathe';
  return '';
}

export function widgetCardClass(
  animation?: string | null,
  ...extra: Array<string | false | null | undefined>
): string {
  return ['cw-anim-open', studioIdleClass(animation), ...extra].filter(Boolean).join(' ');
}
