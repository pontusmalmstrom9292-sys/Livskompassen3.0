/** K1–K3 — docs/design/references/KOMPASS-TRE-TIDPUNKTER.md */
export type CompassThemeId = 'kvall' | 'skymning' | 'soluppgang';

export function getCompassThemeByTime(date = new Date()): CompassThemeId {
  const h = date.getHours();
  if (h >= 17 && h < 21) return 'kvall';
  if (h >= 5 && h < 9) return 'soluppgang';
  return 'skymning';
}
