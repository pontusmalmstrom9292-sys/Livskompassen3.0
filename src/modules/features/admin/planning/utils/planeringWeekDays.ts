const WEEKDAY_LABELS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'] as const;

export type PlaneringWeekDay = {
  label: string;
  iso: string;
  isToday: boolean;
};

/** Lokal YYYY-MM-DD — undviker CET-midnatt via toISOString(). */
function localYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Mån–sön för aktuell vecka (lokal tid). */
export function getPlaneringWeekDays(reference = new Date()): PlaneringWeekDay[] {
  const todayIso = localYmd(reference);
  const day = reference.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(reference);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(reference.getDate() + mondayOffset);

  return WEEKDAY_LABELS.map((label, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    const iso = localYmd(d);
    return { label, iso, isToday: iso === todayIso };
  });
}
