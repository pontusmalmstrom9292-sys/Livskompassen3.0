/** @deprecated Använd planningModulePinStorage — behålls för migration. */
export type PlaneringHomePin = {
  listId: string;
  title: string;
};

export {
  getLegacyHomeListPin as getPlaneringHomePin,
} from './planningModulePinStorage';

export function setPlaneringHomePin(_pin: PlaneringHomePin): void {
  /* legacy no-op — använd PlaneringModulePinPanel */
}

export function clearPlaneringHomePin(): void {
  /* legacy no-op */
}
