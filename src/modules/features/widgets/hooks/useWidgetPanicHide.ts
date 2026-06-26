import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/core/store';
import { WIDGET_SILO_STORAGE_KEY } from '../config/widgetSiloConfig';

/** PV1b — blur + neutral hem + lås Valv + rensa widget-state (Zero Footprint). */
export function useWidgetPanicHide(onBeforeHide?: () => void) {
  const navigate = useNavigate();

  return useCallback(() => {
    onBeforeHide?.();
    useStore.getState().setVaultUnlocked(false);
    useStore.getState().setActiveDrawer(null);
    sessionStorage.removeItem('livskompassen_recovery_sos_session');
    sessionStorage.removeItem('livskompassen_recovery_reality_draft');
  sessionStorage.removeItem(WIDGET_SILO_STORAGE_KEY);
  sessionStorage.removeItem('widget_recording_ethics_accepted');
  localStorage.removeItem('widget_recording_ethics_accepted');
  navigate('/', { replace: true });
  }, [navigate, onBeforeHide]);
}
