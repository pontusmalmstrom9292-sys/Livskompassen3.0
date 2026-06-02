import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';
import type { DrawerNavItem } from '../navigation/drawerNav';
import { getVisibleDrawerTruth, type NavDrawerSection } from '../navigation/navTruth';
import { hasVaultGate } from '../auth/sessionService';
import { useStore } from '../store';
import { LivskompassMark } from '../ui/LivskompassMark';
import { DrawerModeToggle } from './DrawerModeToggle';
import { DrawerHubAccordion, isDrawerItemActive } from './DrawerHubAccordion';
import { useWeaverPendingCount } from '@/features/lifeJournal/diary/diary/hooks/useWeaverPendingCount';
import { useDesignPack } from '../design/useDesignPack';
import { clsx } from 'clsx';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
};

const SWIPE_CLOSE_THRESHOLD_PX = 56;

function collectActiveAncestorIds(
  section: NavDrawerSection,
  pathname: string,
  search: string,
  hash: string,
  vaultSessionOpen: boolean,
): Set<string> {
  const expanded = new Set<string>();
  const visible = getVisibleDrawerTruth(section, vaultSessionOpen);
  for (const entry of visible) {
    if (!entry.parentId) continue;
    const item = {
      id: entry.id,
      label: entry.label,
      path: entry.path,
      section: entry.section,
      icon: () => null,
    } as DrawerNavItem;
    if (isDrawerItemActive(item, pathname, search, hash)) {
      expanded.add(entry.parentId);
    }
  }
  return expanded;
}

export function NavigationDrawer({ open, onClose, onOpenSettings }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const user = useStore((s) => s.user);
  const weaverPendingCount = useWeaverPendingCount(user?.uid);
  const { chrome: designChrome } = useDesignPack();
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const vaultOpen = vaultSessionOpen;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const pathname = location.pathname;
  const search = location.search;
  const hash = location.hash;

  const valvDrawerBadges = useMemo(() => {
    if (weaverPendingCount <= 0) return undefined;
    return {
      valv_grp_samla: weaverPendingCount,
      valv_arkiv: weaverPendingCount,
      valv_samla: weaverPendingCount,
    };
  }, [weaverPendingCount]);

  const activeAncestors = useMemo(
    () => ({
      vardag: collectActiveAncestorIds('vardag', pathname, search, hash, vaultSessionOpen),
      valv: collectActiveAncestorIds('valv', pathname, search, hash, vaultSessionOpen),
    }),
    [pathname, search, hash, vaultSessionOpen],
  );

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('nav-drawer-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('nav-drawer-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    onCloseRef.current();
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!open) return;
    const merged = new Set(activeAncestors.vardag);
    if (vaultOpen) {
      for (const id of activeAncestors.valv) merged.add(id);
    }
    setExpandedIds(merged);
  }, [open, pathname, activeAncestors, vaultOpen]);

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    const delta = clientX - touchStartX.current;
    if (delta < -SWIPE_CLOSE_THRESHOLD_PX) onClose();
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!open) return null;

  const go = (item: DrawerNavItem) => {
    if (item.id === 'installningar') {
      navigate({ pathname: '/installningar' });
      onClose();
      return;
    }

    const hashIndex = item.path.indexOf('#');
    const qIndex = item.path.indexOf('?');
    const pathEnd = [hashIndex, qIndex].filter((i) => i >= 0);
    const end = pathEnd.length ? Math.min(...pathEnd) : item.path.length;
    const path = item.path.slice(0, end);
    const itemHash = hashIndex >= 0 ? item.path.slice(hashIndex + 1) : '';
    const itemSearch =
      qIndex >= 0 ? `?${item.path.slice(qIndex + 1, hashIndex >= 0 ? hashIndex : undefined)}` : '';

    navigate({
      pathname: path || '/',
      search: itemSearch,
      hash: itemHash ? `#${itemHash}` : '',
    });
    onClose();
  };

  const handleBackToVardag = () => {
    navigate({ pathname: '/' });
    onClose();
  };

  return createPortal(
    <>
      <aside
        className={clsx(
          'nav-drawer',
          designChrome?.drawer === 'flat-gold' && 'nav-drawer--design-flat',
        )}
        role="dialog"
        aria-label={vaultOpen ? 'Huvudmeny och Valv' : 'Huvudmeny'}
        aria-modal="true"
        onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientX ?? 0)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="nav-drawer__scenic" aria-hidden />
        <div className="nav-drawer__header">
          <button
            type="button"
            className="nav-drawer__close"
            aria-label="Stäng"
            onClick={onClose}
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <div className="nav-drawer__brand">
            <LivskompassMark className="nav-drawer__mark" />
            <span className="nav-drawer__title">LIVSKOMPASSEN</span>
            <div className="nav-drawer__ornament" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <DrawerModeToggle showValvShell={vaultOpen} onBackToVardag={handleBackToVardag} />

        <nav className="nav-drawer__sections" aria-label="Moduler">
          <div className="nav-drawer__section">
            <p className="nav-drawer__section-title">Vardag</p>
            <DrawerHubAccordion
              section="vardag"
              vaultSessionOpen={vaultSessionOpen}
              pathname={pathname}
              search={search}
              hash={hash}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onGo={go}
            />
          </div>
          {vaultOpen ? (
            <div className="nav-drawer__section">
              <p className="nav-drawer__section-title">Valv</p>
              <DrawerHubAccordion
                section="valv"
                vaultSessionOpen={vaultSessionOpen}
                pathname={pathname}
                search={search}
                hash={hash}
                expandedIds={expandedIds}
                onToggleExpand={toggleExpand}
                onGo={go}
                badges={valvDrawerBadges}
              />
            </div>
          ) : null}
        </nav>

        <div className="nav-drawer__footer">
          <button
            type="button"
            className="nav-drawer__account-btn"
            onClick={() => {
              onOpenSettings?.();
              onClose();
            }}
          >
            <Lock className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Konto &amp; inloggning
          </button>
          <p className="nav-drawer__footer-hint text-xs text-text-dim px-2 pb-1">
            Inställningar i menyn = tema, preset och drogfrihet.
          </p>
        </div>
      </aside>
      <button
        type="button"
        className="nav-drawer__backdrop"
        aria-label="Stäng meny"
        onClick={onClose}
      />
    </>,
    document.body,
  );
}
