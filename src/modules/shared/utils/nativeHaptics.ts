import { useCallback } from 'react';
import type { LivskompassenNativeBridge } from './nativeSecureDownload';

/**
 * Android Capacitor bridge for tactile feedback.
 * Extends the existing bridge definition with haptic methods.
 */
export type LivskompassenHapticBridge = LivskompassenNativeBridge & {
  triggerHaptic?: (type: 'success' | 'error') => void;
  triggerNavigationHaptic?: () => void;
  triggerRecordingHaptic?: () => void;
  triggerPremiumNotification?: (title: string, message: string, type: string) => void;
};

/**
 * Hook for accessing native haptics with graceful web fallback.
 */
export function useNativeHaptics() {
  const native = (window as any).LivskompassenNative as LivskompassenHapticBridge | undefined;

  const success = useCallback(() => {
    if (native?.triggerHaptic) {
      native.triggerHaptic('success');
    } else if ('vibrate' in navigator) {
      navigator.vibrate([10, 30, 10]);
    }
  }, [native]);

  const error = useCallback(() => {
    if (native?.triggerHaptic) {
      native.triggerHaptic('error');
    } else if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }, [native]);

  const navigate = useCallback(() => {
    if (native?.triggerNavigationHaptic) {
      native.triggerNavigationHaptic();
    } else if ('vibrate' in navigator) {
      navigator.vibrate([5, 20, 5]);
    }
  }, [native]);

  return { success, error, navigate };
}
