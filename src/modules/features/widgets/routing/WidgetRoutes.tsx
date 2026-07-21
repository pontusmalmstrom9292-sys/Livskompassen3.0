import { Routes, Route, Navigate } from 'react-router-dom';
import { WidgetRecordPage } from '../pages/WidgetRecordPage';
import { WidgetNotePage } from '../pages/WidgetNotePage';
import { WidgetCompassPage } from '../pages/WidgetCompassPage';
import { WidgetHamnPage } from '../pages/WidgetHamnPage';
import { WidgetFamiljenPage } from '../pages/WidgetFamiljenPage';
import { WidgetStampPage } from '../pages/WidgetStampPage';
import { WidgetBarnportenPage } from '../pages/WidgetBarnportenPage';
import { WidgetSnabbvalPage } from '../pages/WidgetSnabbvalPage';
import { WidgetActionDashboardPage } from '../pages/WidgetActionDashboardPage';
import { WidgetVoiceVaultPage } from '../pages/WidgetVoiceVaultPage';
import { WidgetProjektPage } from '../pages/WidgetProjektPage';
import { WidgetModulerPage } from '../pages/WidgetModulerPage';
import { WidgetDrogfrihetAkutPage } from '../pages/WidgetDrogfrihetAkutPage';
import { WidgetCompanionCapturePage } from '../pages/WidgetCompanionCapturePage';
import {
  WidgetCompanionAnchorPage,
  WidgetCompanionBeaconPage,
  WidgetCompanionChildPage,
  WidgetCompanionCompassPage,
  WidgetCompanionHarborPage,
  WidgetCompanionInboxPage,
  WidgetCompanionJournalPage,
  WidgetCompanionNotePage,
  WidgetCompanionTasksPage,
} from '../pages/WidgetCompanionSurfacePage';
import { useWidgetRouteMode } from '../hooks/useWidgetRouteMode';

function WidgetRouteMode() {
  useWidgetRouteMode();
  return null;
}

export function WidgetRoutes() {
  return (
    <>
      <WidgetRouteMode />
      <Routes>
      <Route path="inspelning" element={<WidgetRecordPage />} />
      <Route path="anteckning" element={<WidgetNotePage />} />
      <Route path="kompass" element={<WidgetCompassPage />} />
      <Route path="hamn" element={<WidgetHamnPage />} />
      <Route path="familjen" element={<WidgetFamiljenPage />} />
      <Route path="stampla" element={<WidgetStampPage />} />
      <Route path="barnporten" element={<WidgetBarnportenPage />} />
      <Route path="snabbval" element={<WidgetSnabbvalPage />} />
      <Route path="voice-vault" element={<WidgetVoiceVaultPage />} />
      <Route path="projekt" element={<WidgetProjektPage />} />
      <Route path="aktioner" element={<WidgetActionDashboardPage />} />
      <Route path="moduler" element={<WidgetModulerPage />} />
      <Route path="drogfrihet-akut" element={<WidgetDrogfrihetAkutPage />} />
      <Route path="companion-capture" element={<WidgetCompanionCapturePage />} />
      <Route path="companion-inbox" element={<WidgetCompanionInboxPage />} />
      <Route path="companion-note" element={<WidgetCompanionNotePage />} />
      <Route path="companion-harbor" element={<WidgetCompanionHarborPage />} />
      <Route path="companion-compass" element={<WidgetCompanionCompassPage />} />
      <Route path="companion-child" element={<WidgetCompanionChildPage />} />
      <Route path="companion-beacon" element={<WidgetCompanionBeaconPage />} />
      <Route path="companion-journal" element={<WidgetCompanionJournalPage />} />
      <Route path="companion-anchor" element={<WidgetCompanionAnchorPage />} />
      <Route path="companion-tasks" element={<WidgetCompanionTasksPage />} />
      <Route path="*" element={<Navigate to="/widget/inspelning" replace />} />
    </Routes>
    </>
  );
}
