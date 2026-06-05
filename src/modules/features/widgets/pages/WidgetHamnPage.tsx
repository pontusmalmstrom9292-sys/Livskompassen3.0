import { Navigate, useLocation } from 'react-router-dom';

/** WH4 — öppnar Hamn med BIFF (full modul). */
export function WidgetHamnPage() {
  const location = useLocation();
  return (
    <Navigate
      to={{ pathname: '/familjen', search: '?tab=hamn' }}
      state={location.state}
      replace
    />
  );
}
