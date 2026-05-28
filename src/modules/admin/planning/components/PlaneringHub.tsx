import { usePlaneringHubLayout } from '../usePlaneringHubLayout';
import { PlaneringHubBody } from './PlaneringHubBody';

/** Verktygsväljare — layout styrs av PlaneringHubLayoutPicker på sidan. */
export function PlaneringHub() {
  const { layout } = usePlaneringHubLayout();

  return (
    <div className="space-y-4">
      <p className="planering-hub__hint">
        Starta projekt högst upp. Öppna en kategori nedan — en i taget.
      </p>
      <PlaneringHubBody layout={layout} />
    </div>
  );
}
