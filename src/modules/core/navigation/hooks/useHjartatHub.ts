import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getHubTabsFromNav } from '../hubTabs';
import { type HjartatTab, parseHjartatTab } from '../tabRegistry';
import type { VaultTab } from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';

export function useHjartatHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const tabs = useMemo(
    () => getHubTabsFromNav('dagbok').filter((t) => t.id !== 'bevis'),
    []
  );

  const tab: HjartatTab = useMemo(() => {
    const parsed = parseHjartatTab(tabParam);
    return parsed === 'bevis' ? 'reflektion' : parsed;
  }, [tabParam]);

  const setTab = useCallback(
    (next: HjartatTab) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === 'reflektion') params.delete('tab');
          else params.set('tab', next);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setVaultTab = useCallback((_: VaultTab) => {}, []);

  return { 
    tabs, 
    tab, 
    tabBarActive: tab, 
    vaultTab: 'logga' as VaultTab, 
    setTab, 
    setVaultTab 
  };
}
