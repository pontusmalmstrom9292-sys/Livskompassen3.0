import { Capacitor } from '@capacitor/core';

/** True in Capacitor Android/iOS shell — not in desktop/mobile browser. */
export function isCapacitorNative(): boolean {
  return Capacitor.isNativePlatform();
}

export function isCapacitorAndroid(): boolean {
  return Capacitor.getPlatform() === 'android';
}
