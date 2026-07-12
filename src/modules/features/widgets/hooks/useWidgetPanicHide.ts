import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/core/store';
import { WIDGET_SILO_STORAGE_KEY } from '../config/widgetSiloConfig';
import { WIDGET_RECORDING_ETHICS_STORAGE_KEY } from '../components/WidgetRecordingEthicsGate';

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
    sessionStorage.removeItem(WIDGET_RECORDING_ETHICS_STORAGE_KEY);
    localStorage.removeItem(WIDGET_RECORDING_ETHICS_STORAGE_KEY);
    navigate('/', { replace: true });
  }, [navigate, onBeforeHide]);
}
