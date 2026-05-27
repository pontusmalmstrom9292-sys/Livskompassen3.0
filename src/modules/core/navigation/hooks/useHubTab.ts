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
};

/**
 * Synkar `?tab=` med drawer-underflikar för en hub (`navTruth` + statiska undantag).
 */
export function useHubTab(hubId: DrawerHubId, options?: UseHubTabOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabs = useMemo(() => getHubTabsFromNav(hubId), [hubId]);
  const computedDefault = getDefaultHubTab(hubId);
  const defaultTab = options?.defaultTab ?? computedDefault;

  const validIds = useMemo(() => new Set(tabs.map((t) => t.id)), [tabs]);

  const rawTab = searchParams.get('tab');
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
          if (next === defaultTab) nextParams.delete('tab');
          else nextParams.set('tab', next);
          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams, defaultTab],
  );

  useEffect(() => {
    if (!rawTab || legacyRedirect) return;
    if (!validIds.has(rawTab)) {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          nextParams.delete('tab');
          return nextParams;
        },
        { replace: true },
      );
    }
  }, [rawTab, validIds, legacyRedirect, setSearchParams]);

  return {
    tabs,
    rawTab,
    activeTab,
    defaultTab,
    setTab,
    legacyRedirect,
  };
}
