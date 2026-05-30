import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hasVaultGate, clearVaultGate, clearVaultZone } from '../../auth/sessionService';
import { useStore } from '../../store';
import { getHubTabsFromNav } from '../hubTabs';
import {
  type HjartatTab,
  getVisibleHjartatTabIds,
  resolveHjartatTab,
} from '../tabRegistry';
import { parseVaultTab, type VaultTab } from '../../../evidence/vault/utils/vaultTabs';

export function useHjartatHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const vaultTabParam = searchParams.get('vaultTab');
  const tabParam = searchParams.get('tab');
  const vaultGateOpen = hasVaultGate();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);

  const visibleTabIds = useMemo(() => new Set(getVisibleHjartatTabIds()), []);

  const baseTabs = useMemo(
    () => getHubTabsFromNav('dagbok').filter((t) => visibleTabIds.has(t.id as HjartatTab)),
    [visibleTabIds],
  );

  const tab: HjartatTab = useMemo(() => {
    // PIN-upplåst Valv — håll bevis-fliken tills användaren stänger (G18 gate kan ha gått ut).
    if (isVaultUnlocked) return 'bevis';
    if (vaultTabParam || tabParam === 'bevis') {
      const resolved = resolveHjartatTab('bevis', vaultGateOpen || isVaultUnlocked);
      return resolved === 'bevis' ? 'bevis' : resolveHjartatTab(tabParam, vaultGateOpen);
    }
    return resolveHjartatTab(tabParam, vaultGateOpen);
  }, [vaultTabParam, tabParam, vaultGateOpen, isVaultUnlocked]);

  const tabs = useMemo(() => {
    if (tab !== 'bevis') return baseTabs;
    if (baseTabs.some((t) => t.id === 'bevis')) return baseTabs;
    return [...baseTabs, { id: 'bevis', label: 'Valv' }];
  }, [baseTabs, tab]);

  const vaultTab: VaultTab = parseVaultTab(vaultTabParam);

  const setTab = useCallback(
    (next: HjartatTab) => {
      if (tab === 'bevis' && next !== 'bevis') {
        setVaultUnlocked(false);
        clearVaultGate();
      }
      if (tab === 'reflektion' && next !== 'reflektion') {
        clearVaultZone('dagbok_forensic');
      }
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.delete('vaultTab');
          if (next === 'reflektion') params.delete('tab');
          else params.set('tab', next);
          return params;
        },
        { replace: true },
      );
    },
    [tab, setSearchParams, setVaultUnlocked],
  );

  const setVaultTab = useCallback(
    (next: VaultTab) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set('tab', 'bevis');
          params.set('vaultTab', next);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (tab === 'bevis' || isVaultUnlocked) return;
    if (tabParam !== 'bevis' && !vaultTabParam) return;
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete('tab');
        params.delete('vaultTab');
        params.delete('samlaView');
        return params;
      },
      { replace: true },
    );
  }, [tab, tabParam, vaultTabParam, isVaultUnlocked, setSearchParams]);

  useEffect(() => {
    if (tab === 'bevis') return;
    setVaultUnlocked(false);
    clearVaultGate();
    if (tab !== 'reflektion') {
      clearVaultZone('dagbok_forensic');
    }
  }, [tab, setVaultUnlocked]);

  const tabBarActive: HjartatTab = tab;

  return { tabs, tab, tabBarActive, vaultTab, setTab, setVaultTab };
}
