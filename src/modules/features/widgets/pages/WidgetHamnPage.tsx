import { Navigate } from 'react-router-dom';

/** WH4 — öppnar Hamn med BIFF (full modul). */
export function WidgetHamnPage() {
  return <Navigate to="/familjen?tab=hamn" replace />;
}
