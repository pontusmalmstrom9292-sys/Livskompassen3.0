const WEEKDAY_LABELS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'] as const;

export type PlaneringWeekDay = {
  label: string;
  iso: string;
  isToday: boolean;
};

/** Mån–sön för aktuell vecka (lokal tid). */
export function getPlaneringWeekDays(reference = new Date()): PlaneringWeekDay[] {
  const todayIso = reference.toISOString().slice(0, 10);
  const day = reference.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(reference);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(reference.getDate() + mondayOffset);

  return WEEKDAY_LABELS.map((label, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    const iso = d.toISOString().slice(0, 10);
    return { label, iso, isToday: iso === todayIso };
  });
}
