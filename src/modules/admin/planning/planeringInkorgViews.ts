export type PlaneringInkorgView = 'oversikt' | 'mejl' | 'kalender';

export const PLANERING_INKORG_VIEWS: {
  id: PlaneringInkorgView;
  label: string;
}[] = [
  { id: 'oversikt', label: 'Översikt' },
  { id: 'mejl', label: 'Mejl' },
  { id: 'kalender', label: 'Kalender' },
];

export function parsePlaneringInkorgView(raw: string | null): PlaneringInkorgView {
  if (raw === 'mejl' || raw === 'kalender' || raw === 'oversikt') return raw;
  return 'oversikt';
}

export function planeringInkorgHref(view: PlaneringInkorgView): string {
  const params = new URLSearchParams({ tab: 'inkorg', inbox: view });
  return `/planering?${params.toString()}`;
}
