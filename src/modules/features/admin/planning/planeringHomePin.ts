export type PlaneringHomePin = {
  listId: string;
  title: string;
};

const KEY = 'livskompassen_home_planering_pin';

export function getPlaneringHomePin(): PlaneringHomePin | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlaneringHomePin;
    if (!parsed?.listId || !parsed?.title) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setPlaneringHomePin(pin: PlaneringHomePin): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(pin));
  } catch {
    /* ignore */
  }
}

export function clearPlaneringHomePin(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
