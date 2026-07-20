import { useEffect } from 'react';
import { getLivskompassenNative } from '@/shared/utils/nativeSecureDownload';
import { NAV_TRUTH } from '../navigation/navTruth';

/**
 * GLOBAL SEARCH INDEXER - AppSearch.
 * Indexes the main modules of the app in the Android Global Search.
 * Allows users to find and launch app sections from the home screen search bar.
 */
export function useSearchIndexing() {
  useEffect(() => {
    const native = getLivskompassenNative();
    if (!native?.indexShortcut) return;

    // Index main level 1 modules from NAV_TRUTH
    const modulesToIndex = NAV_TRUTH.filter((e) => e.inDrawer && !e.parentId);

    modulesToIndex.forEach((m) => {
      // Small delay to prevent bridge congestion during startup
      setTimeout(() => {
        native.indexShortcut!(m.id, m.label, m.path);
      }, 500);
    });
  }, []);
}
