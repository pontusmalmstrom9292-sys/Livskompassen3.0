import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DrawerHubId } from '../hubTabs';
import { getDefaultHubTab, getHubTabsFromNav } from '../hubTabs';

export type HubLegacyRedirectTarget = {
  pathname: string;
  search: string;
};

export type UseHubTabOptions = {
  /** När första fliken i nav inte ska vara standard (t.ex. Hamn → BIFF). */
  defaultTab?: string;
  legacyTabRedirects?: Record<string, HubLegacyRedirectTarget>;
  /**
   * Query-nyckel för denna hubs flikar (standard `tab`).
   * Använd t.ex. `workTab` när sidan ligger under `/liv?tab=arbetsliv` så parent-`tab` inte raderas.
   */
  paramKey?: string;
};

/**
 * Synkar `?tab=` (eller `paramKey`) med drawer-underflikar för en hub (`navTruth` + statiska undantag).
 */
export function useHubTab(hubId: DrawerHubId, options?: UseHubTabOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramKey = options?.paramKey ?? 'tab';
  const tabs = useMemo(() => getHubTabsFromNav(hubId), [hubId]);
  const computedDefault = getDefaultHubTab(hubId);
  const defaultTab = options?.defaultTab ?? computedDefault;

  const validIds = useMemo(() => new Set(tabs.map((t) => t.id)), [tabs]);

  const rawTab = searchParams.get(paramKey);
  const legacyRedirect = rawTab && options?.legacyTabRedirects?.[rawTab];

  const activeTab = useMemo(() => {
    if (legacyRedirect) return defaultTab;
    if (rawTab && validIds.has(rawTab)) return rawTab;
    return defaultTab;
  }, [rawTab, validIds, defaultTab, legacyRedirect]);

  const setTab = useCallback(
    (next: string) => {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          if (next === defaultTab) nextParams.delete(paramKey);
          else nextParams.set(paramKey, next);
          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams, defaultTab, paramKey],
  );

  useEffect(() => {
    if (!rawTab || legacyRedirect) return;
    if (!validIds.has(rawTab)) {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          nextParams.delete(paramKey);
          return nextParams;
        },
        { replace: true },
      );
    }
  }, [rawTab, validIds, legacyRedirect, setSearchParams, paramKey]);

  return {
    tabs,
    rawTab,
    activeTab,
    defaultTab,
    setTab,
    legacyRedirect,
  };
}
