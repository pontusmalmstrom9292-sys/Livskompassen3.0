import { usePlaneringHubLayout } from '../usePlaneringHubLayout';
import { PlaneringHubBody } from './PlaneringHubBody';

/** Verktygsväljare — layout styrs av PlaneringHubLayoutPicker på sidan. */
export function PlaneringHub() {
  const { layout } = usePlaneringHubLayout();

  return (
    <div className="space-y-4">
      <p className="planering-hub__hint">
        Tänk som en låda med verktyg — välj layout ovan som passar din energi idag.
      </p>
      <PlaneringHubBody layout={layout} />
    </div>
  );
}
