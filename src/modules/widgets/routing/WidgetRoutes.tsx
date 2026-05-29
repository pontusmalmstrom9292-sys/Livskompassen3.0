import { Routes, Route, Navigate } from 'react-router-dom';
import { WidgetRecordPage } from '../pages/WidgetRecordPage';
import { WidgetNotePage } from '../pages/WidgetNotePage';
import { WidgetCompassPage } from '../pages/WidgetCompassPage';
import { WidgetHamnPage } from '../pages/WidgetHamnPage';
import { WidgetFamiljenPage } from '../pages/WidgetFamiljenPage';
import { WidgetStampPage } from '../pages/WidgetStampPage';
import { WidgetBarnportenPage } from '../pages/WidgetBarnportenPage';

export function WidgetRoutes() {
  return (
    <Routes>
      <Route path="inspelning" element={<WidgetRecordPage />} />
      <Route path="anteckning" element={<WidgetNotePage />} />
      <Route path="kompass" element={<WidgetCompassPage />} />
      <Route path="hamn" element={<WidgetHamnPage />} />
      <Route path="familjen" element={<WidgetFamiljenPage />} />
      <Route path="stampla" element={<WidgetStampPage />} />
      <Route path="barnporten" element={<WidgetBarnportenPage />} />
      <Route path="*" element={<Navigate to="/widget/inspelning" replace />} />
    </Routes>
  );
}
