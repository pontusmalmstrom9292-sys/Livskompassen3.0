This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: docs/design/references/MENU-DRAWER-KANON.md, docs/design/NAVIGATION-UX-DETALJER.md, docs/design/references/DOCK-KANON.md, src/modules/core/layout/**, src/modules/core/navigation/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
docs/
  design/
    references/
      DOCK-KANON.md
      MENU-DRAWER-KANON.md
    NAVIGATION-UX-DETALJER.md
src/
  modules/
    core/
      layout/
        AmbientBackground.tsx
        CompassHubOrb.tsx
        DockClassicTriad.tsx
        DockHubBand.tsx
        dockHubChrome.ts
        DockNavButton.tsx
        dockNavIcons.tsx
        DrawerHubAccordion.tsx
        DrawerModeToggle.tsx
        DrawerQuickActions.tsx
        FloatingDock.tsx
        headerPanelStyle.ts
        HubPageShell.tsx
        MainLayout.tsx
        moduleHubConfig.ts
        ModuleHubPanel.tsx
        NavigationDrawer.tsx
        SubSynapticBackground.tsx
        useHubModuleNav.ts
      navigation/
        hooks/
          useHjartatHub.ts
          useHubTab.ts
        appNavigation.ts
        drawerNav.ts
        headerPageLabel.ts
        hubContextBar.ts
        hubContextIcons.tsx
        hubTabs.tsx
        navFlags.ts
        navTruth.ts
        pageContextSummary.ts
        tabRegistry.ts
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="docs/design/references/DOCK-KANON.md">
# Botten-dock — KANON

**Beslut 2026-05-23:** Mittknappen visar **endast kompass** — ordet **「Hamn」** ska **inte** synas i UI.

---

## Tre zoner (klassisk dock i mockups)

| Position | Synligt | `aria-label` (skärmläsare) |
|----------|---------|------------------------------|
| Vänster | Ikon + **Familjen** | Familjen |
| **Mitten** | **Kompass-ikon endast** (guld ring) — **ingen synlig text** | **`Hem`** (aria-label) |
| Höger | Ikon + **Dagbok** | Dagbok (`/dagbok`) — **inte** Valv-etikett i dock |

**Route mitten:** `/` (hem) — inte `/hamn` i dock (Hamn-innehåll nås via menyn eller hem-kort).

**Snabbtryck mitten (ej hem):** kort sammanfattning av aktuell sida. **Håll 3s** på kompass → låst beviszon (`/dagbok?tab=bevis`) — utan synlig «Valv»-text i dock.

---

## CSS

```css
.dock-center__label { display: none; } /* Hamn-text bort */
.dock-center { min-width: 56px; }      /* kompensera utan text */
```

Satellit-orbit (nuvarande `CompassHubOrb`): centrum behåller `aria-label`; synlig etikett **Kompass** eller **ingen** — aldrig Hamn.

---

## Ingen båge under kompass

| Bort (2026-05-23) | Kvar |
|-------------------|------|
| Halvcirkel / upphöjd båge bakom mitt-knappen | Platt `dock-nav--hub` |
| Ellipse-glow `.dock-orbit-stage::before` | Rund kompass-platta (cirkel) |

Valv-ikon: **valvbåge** — se [`VALV-ICON-KANON.md`](./VALV-ICON-KANON.md). Mockup: [`dock-flat-valv-arch.png`](./dock-flat-valv-arch.png).

---

## Mockups

Eldre bilder kan visa 「Hamn」 under kompassen eller **sköld+bock** på Valv — **ignorera** vid implementation.
</file>

<file path="src/modules/core/layout/AmbientBackground.tsx">
import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';

/** Scenic I-stone bakgrund på alla huvudflikar (ej widget-routes). */
export function AmbientBackground() {
  const { pathname } = useLocation();
  const showScenic = !pathname.startsWith('/widget');

  return (
    <div
      className={clsx('ambient-bg', showScenic && 'ambient-bg--scenic')}
      aria-hidden
    >
      <div
        className="ambient-blob ambient-blob--gold"
        style={{ width: 420, height: 420, top: '-8%', left: '-10%' }}
      />
      <div
        className="ambient-blob ambient-blob--accent-secondary"
        style={{ width: 360, height: 360, bottom: '10%', right: '-5%' }}
      />
    </div>
  );
}
</file>

<file path="src/modules/core/layout/CompassHubOrb.tsx">
import { useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';
import { authenticateVaultGate } from '../auth/webauthn';
import { setVaultGate } from '../auth/sessionService';
import { useLongPress } from '../hooks/useLongPress';
import { FYREN_BEVIS_HINT } from '../navigation/appNavigation';
import { useStore } from '../store';
import { HUB_BOTTOM, HUB_CENTER, HUB_TOP, type HubModule } from './moduleHubConfig';
import { useHubModuleNav } from './useHubModuleNav';
import { LivskompassMark } from '../ui/LivskompassMark';

const SATELLITES: { module: HubModule; slot: 'tl' | 'tr' | 'bl' | 'br' }[] = [
  { module: HUB_TOP[0]!, slot: 'tl' },
  { module: HUB_TOP[1]!, slot: 'tr' },
  { module: HUB_BOTTOM[0]!, slot: 'bl' },
  { module: HUB_BOTTOM[1]!, slot: 'br' },
];

const toneClass: Record<HubModule['tone'], string> = {
  gold: 'dock-hub-sat--gold',
  indigo: 'dock-hub-sat--indigo',
  lavender: 'dock-hub-sat--lavender',
  emerald: 'dock-hub-sat--emerald',
};

function FyrenRing({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(194,65,12,0.15)" strokeWidth="1.25" />
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="none"
        stroke="#fde68a"
        strokeWidth="1.25"
        strokeDasharray={`${pct} ${100 - pct}`}
        pathLength={100}
        opacity={0.9}
      />
    </svg>
  );
}

function DockHubSatellite({
  module,
  slot,
}: {
  module: HubModule;
  slot: 'tl' | 'tr' | 'bl' | 'br';
}) {
  const { isActive, handlers, showFyren, progress } = useHubModuleNav(module);
  const Icon = module.icon;

  return (
    <button
      type="button"
      aria-label={module.label}
      title={module.desc}
      className={clsx(
        'dock-hub-sat',
        'dock-hub-sat--visible',
        `dock-hub-sat--${slot}`,
        toneClass[module.tone],
        (isActive || showFyren) && 'dock-hub-sat--active',
      )}
      {...handlers}
    >
      <span className="dock-hub-sat__glass">
        <span className="dock-hub-sat__halo" aria-hidden />
        {showFyren && <FyrenRing progress={progress} />}
        <Icon className="dock-hub-sat__icon" strokeWidth={1.65} />
      </span>
      <span className="dock-hub-sat__label">{module.label}</span>
    </button>
  );
}

export function CompassHubOrb() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const setSystemError = useStore((s) => s.setError);

  const onDagbok =
    location.pathname === HUB_CENTER.path ||
    location.pathname.startsWith(`${HUB_CENTER.path}/`);
  const { isActive: centerRouteActive, navigateToModule } = useHubModuleNav(HUB_CENTER);
  const isCenterActive = onDagbok || centerRouteActive;

  const centerPress = useLongPress({
    onLongPress: async () => {
      const ok = await authenticateVaultGate();
      if (!ok) {
        setSystemError(`Fyren avbruten. ${FYREN_BEVIS_HINT}`);
        return;
      }
      setVaultGate();
      navigateToModule(HUB_CENTER.search ?? '');
    },
    onClick: () => navigateToModule(),
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHandlers } = centerPress;
  const showFyren = isHolding || progress > 0;

  return (
    <div ref={wrapRef} className="dock-hub-fan dock-hub-fan--orbit" aria-label="Livsområden">
      <div className="dock-orbit-stage__ring" aria-hidden />
      <div className="dock-orbit-stage__spokes" aria-hidden>
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--tl" />
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--tr" />
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--bl" />
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--br" />
      </div>

      {SATELLITES.map(({ module, slot }) => (
        <DockHubSatellite key={module.path} module={module} slot={slot} />
      ))}

      <button
        type="button"
        aria-label={showFyren ? 'Hjärtat — håll för Fyren' : onDagbok ? 'Hjärtat' : 'Öppna dagbok'}
        className={clsx(
          'dock-compass-hub',
          isCenterActive && 'dock-compass-hub--active',
          onDagbok && 'dock-compass-hub--heart',
          showFyren && 'dock-compass-hub--fyren',
        )}
        {...centerHandlers}
      >
        <span className="dock-compass-hub__plate">
          {showFyren && <FyrenRing progress={progress} />}
          <LivskompassMark className="dock-compass-hub__mark" />
          {onDagbok && (
            <span className="dock-compass-hub__overlay">
              <BookOpen className="dock-compass-hub__icon" strokeWidth={1.65} />
            </span>
          )}
        </span>
        <span className="dock-compass-hub__label">{onDagbok ? 'Hjärtat' : 'Kompass'}</span>
      </button>
    </div>
  );
}
</file>

<file path="src/modules/core/layout/DockClassicTriad.tsx">
import { useState } from 'react';
import type { ReactNode } from 'react';
import { BookOpen, Users, X } from 'lucide-react';
import { clsx } from 'clsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { useLongPress } from '../hooks/useLongPress';
import { getPageContextSummary } from '../navigation/pageContextSummary';

function DockSideLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx('dock-classic__side', isActive && 'dock-classic__side--active')
      }
      aria-label={label}
    >
      <span className="dock-classic__side-icon" aria-hidden>
        {icon}
      </span>
      <span className="dock-classic__side-label">{label}</span>
    </NavLink>
  );
}

/** Kanon: Familjen · kompass (kontext vid tryck) · Dagbok — Valv endast 3s-håll på kompass. */
export function DockClassicTriad() {
  const location = useLocation();
  const navigate = useNavigate();
  const [contextOpen, setContextOpen] = useState(false);
  const summary = getPageContextSummary(location.pathname, location.search);
  const isHome = location.pathname === '/';

  const valvLongPress = useLongPress({
    onLongPress: () => {
      setContextOpen(false);
      navigate('/dagbok?tab=bevis');
    },
    onClick: () => {},
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = valvLongPress;

  const onCenterTap = () => {
    if (isHome) {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setContextOpen(true);
  };

  return (
    <div className="dock-classic">
      <DockSideLink
        to="/familjen"
        label="Familjen"
        icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
      />

      <button
        type="button"
        className={clsx(
          'dock-classic__center',
          isHome && location.pathname === '/' && 'dock-classic__center--active',
          isHolding && 'dock-classic__center--holding',
        )}
        aria-label={isHome ? 'Hem' : `Var du är: ${summary.title}`}
        aria-expanded={contextOpen}
        style={
          progress > 0
            ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as React.CSSProperties)
            : undefined
        }
        onClick={onCenterTap}
        {...centerHoldHandlers}
      >
        <span className="dock-classic__plate">
          <LivskompassMark className="dock-classic__mark" />
        </span>
      </button>

      <DockSideLink
        to="/dagbok"
        label="Dagbok"
        icon={<BookOpen className="h-4 w-4" strokeWidth={1.5} />}
      />

      {contextOpen ? (
        <div className="dock-classic__context" role="dialog" aria-label={summary.title}>
          <p className="dock-classic__context-title">{summary.title}</p>
          <p className="dock-classic__context-body">{summary.body}</p>
          <button
            type="button"
            className="dock-classic__context-close"
            aria-label="Stäng sammanfattning"
            onClick={() => setContextOpen(false)}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
</file>

<file path="src/modules/core/layout/FloatingDock.tsx">
import { CompassHubOrb } from './CompassHubOrb';
import { DockHubBand } from './DockHubBand';

/** Orbit-modulhub: sätt `VITE_DOCK_ORBIT=true` i .env */
const useOrbitDock = import.meta.env.VITE_DOCK_ORBIT === 'true';

export function FloatingDock() {
  return (
    <div className="dock-shell">
      <nav
        className="dock-nav dock-nav--hub"
        aria-label={useOrbitDock ? 'Modulhub' : 'Huvudnavigation'}
      >
        {useOrbitDock ? (
          <div className="dock-orbit-stage">
            <CompassHubOrb />
          </div>
        ) : (
          <DockHubBand />
        )}
      </nav>
    </div>
  );
}
</file>

<file path="src/modules/core/layout/HubPageShell.tsx">
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { hubHeaderClasses } from '../ui/typeScale';

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  headerAside?: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Shared hub layout — header, content, optional module footer above global dock. */
export function HubPageShell({
  eyebrow,
  title,
  lead,
  headerAside,
  footerSlot,
  className,
  children,
}: Props) {
  const h = hubHeaderClasses();

  return (
    <div className={clsx('hub-page-shell space-y-4', className)}>
      <header
        className={clsx(
          'hub-page-shell__header px-0.5',
          headerAside && 'flex items-start justify-between gap-2',
        )}
      >
        <div className="min-w-0">
          <p className={h.eyebrow}>{eyebrow}</p>
          <h1 className={h.title}>{title}</h1>
          {lead ? <p className={h.lead}>{lead}</p> : null}
        </div>
        {headerAside}
      </header>

      <div className="hub-page-shell__body space-y-4">{children}</div>

      {footerSlot ? (
        <footer className="hub-page-shell__footer border-t border-border pt-4">{footerSlot}</footer>
      ) : null}
    </div>
  );
}
</file>

<file path="src/modules/core/layout/moduleHubConfig.ts">
export type { HubModule } from '../navigation/appNavigation';
export {
  HUB_CENTER,
  HUB_SIDE_MODULES,
  HUB_TOP,
  HUB_BOTTOM,
} from '../navigation/appNavigation';
</file>

<file path="src/modules/core/layout/ModuleHubPanel.tsx">
import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';
import { setVaultGate } from '../auth/sessionService';
import { authenticateVaultGate } from '../auth/webauthn';
import { useStore } from '../store';
import { DESIGN } from '../ui/tokens';
import {
  HUB_BOTTOM,
  HUB_CENTER,
  HUB_TOP,
  type HubModule,
} from './moduleHubConfig';

const toneClass: Record<HubModule['tone'], string> = {
  gold: 'module-hub-tile--gold',
  indigo: 'module-hub-tile--indigo',
  lavender: 'module-hub-tile--lavender',
  emerald: 'module-hub-tile--emerald',
};

function FyrenProgressRing({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(194,65,12,0.12)" strokeWidth="1.5" />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke={DESIGN.accent}
        strokeWidth="1.5"
        strokeDasharray={`${pct} ${100 - pct}`}
        pathLength={100}
        opacity={0.85}
      />
    </svg>
  );
}

function HubTile({ module, size = 'side' }: { module: HubModule; size?: 'side' | 'center' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);
  const Icon = module.icon;

  const isActive =
    module.path === '/'
      ? location.pathname === '/'
      : location.pathname === module.path || location.pathname.startsWith(`${module.path}/`);

  const go = (search = '') => {
    navigate({ pathname: module.path, search });
    setModuleHubOpen(true);
  };

  const longPress = useLongPress({
    onLongPress: async () => {
      if (!module.longPress) return;
      const ok = await authenticateVaultGate();
      if (!ok) return;
      setVaultGate();
      go(module.search ?? '');
    },
    onClick: () => go(module.longPress ? '' : ''),
    delayMs: 3000,
  });

  const { progress, isHolding, ...longPressHandlers } = longPress;
  const handlers = module.longPress
    ? longPressHandlers
    : { onClick: () => go('') };

  const showFyren = module.longPress && (isHolding || progress > 0);

  return (
    <button
      type="button"
      aria-label={
        module.longPress
          ? `${module.label} — håll 3 sek för dold åtkomst till bevis`
          : module.label
      }
      className={clsx(
        'module-hub-tile',
        toneClass[module.tone],
        size === 'center' && 'module-hub-tile--center',
        (isActive || showFyren) && 'module-hub-tile--active',
      )}
      {...handlers}
    >
      <span className="module-hub-tile__icon">
        {showFyren && <FyrenProgressRing progress={progress} />}
        <Icon className="relative z-10 h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="module-hub-tile__label">{module.label}</span>
      {size === 'center' && (
        <span className="module-hub-tile__desc">{module.desc}</span>
      )}
    </button>
  );
}

export function ModuleHubPanel() {
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);

  return (
    <div className="module-hub-panel" role="dialog" aria-label="Modulväljare">
      <div className="module-hub-panel__grid">
        <div className="module-hub-panel__row">
          {HUB_TOP.map((mod) => (
            <HubTile key={mod.path} module={mod} />
          ))}
        </div>
        <HubTile module={HUB_CENTER} size="center" />
        <div className="module-hub-panel__row">
          {HUB_BOTTOM.map((mod) => (
            <HubTile key={mod.path} module={mod} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="module-hub-panel__close"
        onClick={() => setModuleHubOpen(false)}
      >
        Stäng
      </button>
    </div>
  );
}
</file>

<file path="src/modules/core/layout/SubSynapticBackground.tsx">
/** @deprecated Använd AmbientBackground — behålls för bakåtkompatibilitet. */
export { AmbientBackground as SubSynapticBackground } from './AmbientBackground';
</file>

<file path="src/modules/core/layout/useHubModuleNav.ts">
import { useNavigate, useLocation } from 'react-router-dom';
import { useLongPress } from '../hooks/useLongPress';
import { setVaultGate } from '../auth/sessionService';
import { authenticateVaultGate } from '../auth/webauthn';
import { useStore } from '../store';
import { FYREN_BEVIS_HINT } from '../navigation/appNavigation';
import type { HubModule } from './moduleHubConfig';

export function useHubModuleNav(module: HubModule) {
  const navigate = useNavigate();
  const location = useLocation();
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);
  const setSystemError = useStore((s) => s.setError);

  const isActive =
    module.path === '/'
      ? location.pathname === '/'
      : location.pathname === module.path || location.pathname.startsWith(`${module.path}/`);

  const navigateToModule = (search = '') => {
    navigate({ pathname: module.path, search });
  };

  const go = (search = '') => {
    navigateToModule(search);
    setModuleHubOpen(false);
  };

  const longPress = useLongPress({
    onLongPress: async () => {
      if (!module.longPress) return;
      const ok = await authenticateVaultGate();
      if (!ok) {
        setSystemError(`Fyren avbruten. ${FYREN_BEVIS_HINT}`);
        return;
      }
      setVaultGate();
      navigateToModule(module.search ?? '');
      setModuleHubOpen(false);
    },
    onClick: () => go(module.longPress ? '' : ''),
    delayMs: 3000,
  });

  const { progress, isHolding, ...longPressHandlers } = longPress;
  const handlers = module.longPress
    ? longPressHandlers
    : { onClick: () => go('') };

  const showFyren = module.longPress && (isHolding || progress > 0);

  return { isActive, handlers, showFyren, progress, go, navigateToModule };
}
</file>

<file path="src/modules/core/navigation/pageContextSummary.ts">
/** Kort sammanfattning vid snabbtryck på dock-kompass (ingen Valv-etikett). */
export type PageContextSummary = {
  title: string;
  body: string;
};

export function getPageContextSummary(pathname: string, search: string): PageContextSummary {
  const tab = new URLSearchParams(search.replace(/^\?/, '')).get('tab');

  if (pathname === '/') {
    return {
      title: 'Hem',
      body: 'Kompassros: rutiner, ekonomi, kunskap och utveckling. Mitten = check-in.',
    };
  }
  if (pathname.startsWith('/familjen')) {
    return {
      title: 'Familjen',
      body: 'Barnfokus, minnesankare och livsloggar — barnens silo.',
    };
  }
  if (pathname.startsWith('/hamn')) {
    return {
      title: 'Trygg hamn',
      body: 'BIFF och gränser. Fördjupad analys bakom PIN.',
    };
  }
  if (pathname.startsWith('/vardagen') || pathname.startsWith('/ekonomi') || pathname.startsWith('/kompasser')) {
    if (tab === 'ekonomi') {
      return {
        title: 'Vardagen · Ekonomi',
        body: 'Veckopeng, matlåda och transaktioner. Flikar: Kompasser · Ekonomi · Kunskap.',
      };
    }
    if (tab === 'kunskap') {
      return {
        title: 'Vardagen · Kunskap',
        body: 'Kunskapsvalv och RAG — egen silo, inga barnloggar.',
      };
    }
    return {
      title: 'Vardagen',
      body: 'Kompasser, ekonomi och kunskap i ett kluster. Välj flik uppe på sidan.',
    };
  }
  if (pathname.startsWith('/dagbok')) {
    if (tab === 'bevis') {
      return {
        title: 'Bevis & arkiv',
        body: 'Låsta poster och tidsstämplar. PIN vid känslig åtkomst.',
      };
    }
    return {
      title: 'Dagbok',
      body: 'Reflektion och spegling. Bevis-fliken kräver upplåsning.',
    };
  }
  if (pathname.startsWith('/planering')) {
    return { title: 'Planering', body: 'Kanban: att göra · väntar · klart.' };
  }
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) {
    return { title: 'Arbetsliv', body: 'Stämpla, tid och löneunderlag.' };
  }
  if (pathname.startsWith('/mabra')) {
    return { title: 'MåBra', body: 'Övningar och kort stöd — utvecklingszon Vit.' };
  }
  if (pathname.startsWith('/projekt')) {
    return { title: 'Projekt', body: 'Listor, anteckningar och egna planer.' };
  }
  if (pathname.startsWith('/widget')) {
    return { title: 'Snabbwidget', body: 'Anteckning eller diskret inspelning.' };
  }
  return {
    title: 'Livskompassen',
    body: 'Du är i appen. Öppna menyn för moduler eller använd kompassrosen på hem.',
  };
}
</file>

<file path="docs/design/NAVIGATION-UX-DETALJER.md">
# Navigation UX — detaljer (2026-05-28)

**SSOT:** [`navTruth.ts`](../../src/modules/core/navigation/navTruth.ts) · **Kanon drawer:** [`references/MENU-DRAWER-KANON.md`](./references/MENU-DRAWER-KANON.md) · **Chrome:** [`CHROME-POLICY.md`](./CHROME-POLICY.md)

## Lager (utan dubbel sanning)

| Lager | Fil | Ansvar |
|-------|-----|--------|
| 1 | `navTruth.ts` | Labels, paths, drawer-rader, Valv-grupper |
| 2 | `hubTabs.tsx` + `useHubTab` | Hub-underflikar (`?tab=`) |
| 3 | `tabRegistry.ts` | Hjärtat/Valv TabBar, `getMainVaultTabBarItems` |
| 4 | `appNavigation.ts` | Hem-kluster, Fyren-chips, legacy-redirects |
| 5 | `AppRoutes.tsx` | Topp-routes + bokmärkes-redirects |

## Lättnavigerbara menyer (implementerat)

- **En källa per hub:** Familjen, Vardagen, Hamn, Planering m.fl. läser flikar via `useHubTab` — inte parallella konstanter.
- **Accordion-drawer:** Hub-rad expanderar underflikar; aktiv rad = guld streck (MENU-DRAWER-KANON).
- **Valv-läge:** Separat drawer-träd efter PIN — ingen Valv-växlare i publikt läge.
- **Legacy-redirects:** `/kompasser`, `/valv`, `/kunskap`, `/ekonomi` → kanoniska paths (bokmärken trasiga inte).
- **Drogfrihet:** Flik `?tab=kunskap` behåller path men label **Stöd & resurser** (ej Valv Kunskap).

## Mac / Cursor

| Åtgärd | Kortkommando |
|--------|----------------|
| Öppna fil (t.ex. navTruth) | `Cmd + P` → `navTruth.ts` |
| Inline-agent (prompt) | `Cmd + I` |
| Agent-chatt | `Cmd + L` |

## Nästa UX-förbättringar (produkt, ej kod här)

- Hub-specifika `footerSlot` i `HubPageShell` för en primär handling per flik.
- `MaterialPackShortcuts` synlig endast när Life OS-preset har material för hubben.
- Valfri "Senast besökt"-rad i drawer (max 3, från `sessionStorage`, Zero Footprint-vänlig).
</file>

<file path="src/modules/core/layout/dockHubChrome.ts">
import type { LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import type { HubContextIconId } from '../navigation/hubContextBar';

export type DockSideLink = {
  to: string;
  label: string;
  icon: HubContextIconId;
};

export function getHubPresetShortLabel(presetId: LifeHubPresetId): string {
  switch (presetId) {
    case 'foralder_trygg':
      return 'Förälder';
    case 'rehab_lag':
      return 'Rehab';
    case 'vardag_arbete':
      return 'Vardag';
    case 'minimal':
      return 'Min';
    default:
      return 'Hub';
  }
}

function presetSides(presetId: LifeHubPresetId): { left: DockSideLink; right: DockSideLink } {
  switch (presetId) {
    case 'foralder_trygg':
      return {
        left: { to: '/familjen', label: 'Familjen', icon: 'users' },
        right: { to: '/hamn', label: 'Hamn', icon: 'anchor' },
      };
    case 'rehab_lag':
      return {
        left: { to: '/mabra', label: 'MåBra', icon: 'sparkles' },
        right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
      };
    case 'vardag_arbete':
      return {
        left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
        right: { to: '/arbetsliv?tab=stampla', label: 'Arbetsliv', icon: 'clock' },
      };
    case 'minimal':
      return {
        left: { to: '/', label: 'Hem', icon: 'sparkles' },
        right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
      };
    default:
      return {
        left: { to: '/familjen', label: 'Familjen', icon: 'users' },
        right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
      };
  }
}

/** Sidolänkar kring kompass — preset med enkla route-overrides. */
export function getDockSideLinks(
  presetId: LifeHubPresetId,
  pathname: string,
): { left: DockSideLink; right: DockSideLink } {
  if (pathname.startsWith('/planering') || pathname.startsWith('/projekt')) {
    return {
      left: { to: '/projekt', label: 'Projekt', icon: 'folder' },
      right: { to: '/familjen', label: 'Familjen', icon: 'users' },
    };
  }
  if (pathname.startsWith('/familjen')) {
    return {
      left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
      right: { to: '/dagbok', label: 'Dagbok', icon: 'book' },
    };
  }
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) {
    return {
      left: { to: '/planering?tab=handling', label: 'Planering', icon: 'calendar' },
      right: { to: '/projekt', label: 'Projekt', icon: 'folder' },
    };
  }
  return presetSides(presetId);
}
</file>

<file path="src/modules/core/layout/DrawerHubAccordion.tsx">
import { useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import {
  drawerHubHasChildren,
  getDrawerChildren,
  getDrawerRoots,
  type NavDrawerSection,
} from '../navigation/navTruth';
import { groupVardagDrawerRoots } from '../navigation/tabRegistry';
import { toDrawerNavItem, type DrawerNavItem, type DrawerNavIcon } from '../navigation/drawerNav';

export function isDrawerItemActive(
  item: DrawerNavItem,
  pathname: string,
  search: string,
  hash: string,
): boolean {
  const hashIndex = item.path.indexOf('#');
  const qIndex = item.path.indexOf('?');
  const cut = [hashIndex, qIndex].filter((i) => i >= 0);
  const end = cut.length ? Math.min(...cut) : item.path.length;
  const itemPath = item.path.slice(0, end > 0 ? end : item.path.length);
  const itemHash = hashIndex >= 0 ? item.path.slice(hashIndex + 1) : '';
  const itemQuery = qIndex >= 0 ? item.path.slice(qIndex + 1, hashIndex >= 0 ? hashIndex : undefined) : '';

  if (pathname !== itemPath) return false;

  if (itemHash) {
    return hash.replace(/^#/, '') === itemHash;
  }

  if (!itemQuery) {
    return pathname === itemPath && !search.replace(/^\?/, '') && !hash.replace(/^#/, '');
  }

  const current = new URLSearchParams(search.replace(/^\?/, ''));
  const expected = new URLSearchParams(itemQuery);
  for (const [key, value] of expected.entries()) {
    if (current.get(key) !== value) return false;
  }
  return true;
}

function NavRow({
  item,
  active,
  sub,
  group,
  expanded,
  hasChildren,
  onNavigate,
  onToggleExpand,
}: {
  item: DrawerNavItem;
  active: boolean;
  sub?: boolean;
  group?: boolean;
  expanded?: boolean;
  hasChildren?: boolean;
  onNavigate: () => void;
  onToggleExpand?: () => void;
}) {
  const Icon = item.icon as DrawerNavIcon;

  return (
    <div className={clsx('nav-drawer__row-wrap', sub && 'nav-drawer__row-wrap--sub')}>
      <button
        type="button"
        className={clsx(
          'nav-drawer__row',
          sub && 'nav-drawer__row--sub',
          group && 'nav-drawer__row--group',
          active && 'nav-drawer__row--active',
        )}
        onClick={onNavigate}
      >
        <span className="nav-drawer__row-icon" aria-hidden>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <span className="nav-drawer__row-label">{item.label}</span>
        {hasChildren ? (
          <span
            role="button"
            tabIndex={0}
            className="nav-drawer__row-expand"
            aria-expanded={expanded}
            aria-label={expanded ? 'Fäll ihop' : 'Visa underflikar'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand?.();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onToggleExpand?.();
              }
            }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            ) : (
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            )}
          </span>
        ) : (
          <ChevronRight className="nav-drawer__row-chevron" strokeWidth={1.5} aria-hidden />
        )}
      </button>
    </div>
  );
}

type Props = {
  section: NavDrawerSection;
  pathname: string;
  search: string;
  hash: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onGo: (item: DrawerNavItem) => void;
};

export function DrawerHubAccordion({
  section,
  pathname,
  search,
  hash,
  expandedIds,
  onToggleExpand,
  onGo,
}: Props) {
  const roots = useMemo(() => getDrawerRoots(section).map(toDrawerNavItem), [section]);

  const vardagGroups = useMemo(
    () => (section === 'vardag' ? groupVardagDrawerRoots(getDrawerRoots('vardag')) : []),
    [section],
  );

  const renderHub = (hub: DrawerNavItem) => {
    const children = getDrawerChildren(hub.id, section).map(toDrawerNavItem);
    const hasChildren = drawerHubHasChildren(hub.id, section);
    const expanded = expandedIds.has(hub.id);
    const hubActive =
      isDrawerItemActive(hub, pathname, search, hash) ||
      children.some((c) => isDrawerItemActive(c, pathname, search, hash));

    return (
      <div key={hub.id} className="nav-drawer__hub">
        <NavRow
          item={hub}
          active={hubActive && !hub.isGroupHeader}
          group={hub.isGroupHeader}
          expanded={expanded}
          hasChildren={hasChildren}
          onNavigate={() => {
            if (hub.isGroupHeader) {
              onToggleExpand(hub.id);
              return;
            }
            if (!hasChildren) {
              onGo(hub);
              return;
            }
            onGo(hub);
          }}
          onToggleExpand={() => onToggleExpand(hub.id)}
        />
        {hasChildren && expanded && (
          <div className="nav-drawer__hub-children">
            {hub.drawerHint ? (
              <p className="nav-drawer__hub-hint">{hub.drawerHint}</p>
            ) : null}
            {children.map((child) => (
              <NavRow
                key={child.id}
                item={child}
                sub
                active={isDrawerItemActive(child, pathname, search, hash)}
                onNavigate={() => onGo(child)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (section === 'valv') {
    return <div className="nav-drawer__list">{roots.map(renderHub)}</div>;
  }

  return (
    <div className="nav-drawer__list">
      {vardagGroups.map((group) => (
        <div key={group.category} className="nav-drawer__category">
          <p className="nav-drawer__category-title">{group.label}</p>
          {group.entries.map((entry) => renderHub(toDrawerNavItem(entry)))}
        </div>
      ))}
    </div>
  );
}
</file>

<file path="src/modules/core/layout/DrawerModeToggle.tsx">
type Props = {
  /** Endast när Valv är upplåst — en diskret väg tillbaka utan att exponera Valv i publikt läge. */
  showValvShell: boolean;
  onBackToVardag: () => void;
};

export function DrawerModeToggle({ showValvShell, onBackToVardag }: Props) {
  if (!showValvShell) return null;

  return (
    <div className="nav-drawer__mode" role="navigation" aria-label="Tillbaka från Valv">
      <button
        type="button"
        className="nav-drawer__mode-btn nav-drawer__mode-btn--active nav-drawer__mode-btn--solo"
        onClick={onBackToVardag}
      >
        Vardag
      </button>
    </div>
  );
}
</file>

<file path="src/modules/core/layout/DrawerQuickActions.tsx">
import { useNavigate } from 'react-router-dom';
import { HUB_MORE_ACTIONS } from '../navigation/hubContextBar';
import { renderHubContextIcon } from '../navigation/hubContextIcons';

type Props = {
  onNavigate?: () => void;
};

/** Snabbval (anteckning, inspelning, …) — endast i sidomenyn, inte dubbelrad ovanför dock. */
export function DrawerQuickActions({ onNavigate }: Props) {
  const navigate = useNavigate();

  return (
    <div className="nav-drawer__quick" aria-label="Snabbval">
      <p className="nav-drawer__quick-title">Snabbval</p>
      <div className="nav-drawer__quick-grid">
        {HUB_MORE_ACTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="nav-drawer__quick-btn"
            onClick={() => {
              navigate(item.to);
              onNavigate?.();
            }}
          >
            <span className="nav-drawer__quick-icon" aria-hidden>
              {renderHubContextIcon(item.icon, 'h-5 w-5')}
            </span>
            <span className="nav-drawer__quick-label">{item.label}</span>
          </button>
        ))}
      </div>
      <p className="nav-drawer__quick-hint">Håll kompassen i dock 3 s för Valv.</p>
    </div>
  );
}
</file>

<file path="src/modules/core/layout/headerPanelStyle.ts">
export const HEADER_PANEL_STYLES = ['ember', 'obsidian', 'aurora'] as const;

export type HeaderPanelStyle = (typeof HEADER_PANEL_STYLES)[number];

/** Samma panelstil som `AppHeaderBar` — dock följer header. */
export function resolveHeaderPanelStyle(): HeaderPanelStyle {
  const v = import.meta.env.VITE_HEADER_PANEL_STYLE;
  if (typeof v === 'string' && HEADER_PANEL_STYLES.includes(v as HeaderPanelStyle)) {
    return v as HeaderPanelStyle;
  }
  return 'ember';
}
</file>

<file path="src/modules/core/navigation/hooks/useHubTab.ts">
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
</file>

<file path="src/modules/core/navigation/navFlags.ts">
/** G18 — default: dold Bevis-flik (Fyren-only). Dev/smoke: `VITE_SHOW_BEVIS_TAB=true`. */
export const HIDE_BEVIS_TAB = import.meta.env.VITE_SHOW_BEVIS_TAB !== 'true';
</file>

<file path="src/modules/core/navigation/hooks/useHjartatHub.ts">
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
    if (tabParam !== 'bevis' || vaultTabParam) return;
    if (tab === 'bevis') return;
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete('tab');
        params.delete('vaultTab');
        return params;
      },
      { replace: true },
    );
  }, [tab, tabParam, vaultTabParam, setSearchParams]);

  useEffect(() => {
    if (tab !== 'bevis') {
      setVaultUnlocked(false);
      clearVaultGate();
    }
    if (tab !== 'reflektion') {
      clearVaultZone('dagbok_forensic');
    }
  }, [tab, setVaultUnlocked]);

  const tabBarActive: HjartatTab = tab;

  return { tabs, tab, tabBarActive, vaultTab, setTab, setVaultTab };
}
</file>

<file path="src/modules/core/navigation/appNavigation.ts">
/**
 * Ikonbeslut (2026-05-22, synkat med design-master):
 * - Hjärtat: BookOpen — yttre ska läsa "dagbok/reflektion", inte valv (plausible deniability).
 * - Familjen: Users — neutral loggning, skiljs från Hjärtat (Heart reserverad semantiskt för känsla).
 * - Vardagen: Compass på hem/kluster; Sprout i Modulhub-tile (vardagsrytm).
 * - Hamn: Anchor · Måbra: Sparkles · Bevis/valv: Shield (endast i chips/Fyren, ej egen dock-ikon).
 */
import type { LucideIcon } from 'lucide-react';
import { BookOpen, Anchor, Users, Sprout, Sparkles, Compass } from 'lucide-react';

export type ClusterTone = 'gold' | 'indigo' | 'lavender' | 'emerald';
export type HubPosition = 'center' | 'side';

export type { HjartatTab, VardagenTab } from './tabRegistry';
import type { HjartatTab, VardagenTab } from './tabRegistry';

export type ClusterChip = {
  label: string;
  tab?: string;
};

export type ClusterTabDef<T extends string = string> = {
  id: T;
  label: string;
  isDefault?: boolean;
};

export type LifeCluster = {
  id: string;
  path: string;
  label: string;
  hubLabel: string;
  desc: string;
  icon: LucideIcon;
  tone: ClusterTone;
  hubPosition: HubPosition;
  longPress?: boolean;
  fyrenSearch?: string;
  chips: ClusterChip[];
};

export { HIDE_BEVIS_TAB } from './navFlags';
import { HIDE_BEVIS_TAB } from './navFlags';

export const FYREN_BEVIS_HINT =
  'Öppna modulhubben (Kompass), tryck Hjärtat och håll 3 sekunder (Fyren), verifiera och ange PIN.';

export const DOSSIER_PATH = '/dossier';

export const HJARTAT_PATH = '/dagbok';
export const VARDAGEN_PATH = '/vardagen';

export const HJARTAT_TABS: ClusterTabDef<HjartatTab>[] = [
  { id: 'reflektion', label: 'Reflektion', isDefault: true },
  { id: 'bevis', label: 'Bevis' },
  { id: 'speglar', label: 'Speglar' },
];

export const VARDAGEN_TABS: ClusterTabDef<VardagenTab>[] = [
  { id: 'kompasser', label: 'Kompasser', isDefault: true },
  { id: 'ekonomi', label: 'Ekonomi' },
];

const HJARTAT_CLUSTER: LifeCluster = {
  id: 'hjartat',
  path: HJARTAT_PATH,
  label: 'Hjärtat',
  hubLabel: 'Hjärtat',
  desc: HIDE_BEVIS_TAB ? 'Reflektion och spegling.' : 'Sanning, reflektion och spegling.',
  icon: BookOpen,
  tone: 'gold',
  hubPosition: 'center',
  longPress: true,
  fyrenSearch: '?tab=bevis',
  chips: [
    { label: 'Dagbok', tab: 'reflektion' },
    { label: 'Verklighetsvalvet', tab: 'bevis' },
    { label: 'Speglar', tab: 'speglar' },
  ],
};

const HAMN_CLUSTER: LifeCluster = {
  id: 'hamn',
  path: '/hamn',
  label: 'Hamnen',
  hubLabel: 'Hamn',
  desc: 'Gränser och kommunikation mot ex.',
  icon: Anchor,
  tone: 'indigo',
  hubPosition: 'side',
  chips: [{ label: 'Safe Harbor · BIFF' }],
};

const FAMILIEN_CLUSTER: LifeCluster = {
  id: 'familjen',
  path: '/familjen',
  label: 'Familjen',
  hubLabel: 'Familjen',
  desc: 'Neutral loggning för Kasper och Arvid.',
  icon: Users,
  tone: 'lavender',
  hubPosition: 'side',
  chips: [
    { label: 'Livsloggar' },
    { label: 'Balansmätare' },
  ],
};

const VARDAGEN_CLUSTER: LifeCluster = {
  id: 'vardagen',
  path: VARDAGEN_PATH,
  label: 'Vardagen',
  hubLabel: 'Vardagen',
  desc: 'Daglig rytm och vardagsstress.',
  icon: Compass,
  tone: 'emerald',
  hubPosition: 'side',
  chips: [
    { label: 'Kompasser', tab: 'kompasser' },
    { label: 'Ekonomi', tab: 'ekonomi' },
  ],
};

const MABRA_CLUSTER: LifeCluster = {
  id: 'mabra',
  path: '/mabra',
  label: 'Måbra',
  hubLabel: 'Måbra',
  desc: 'KBT, självmedkänsla och små vanor.',
  icon: Sparkles,
  tone: 'lavender',
  hubPosition: 'side',
  chips: [{ label: 'Måbra-sidan' }],
};

/** All livsområden — single source för hem, hub och specs. */
export const LIFE_CLUSTERS: LifeCluster[] = [
  HJARTAT_CLUSTER,
  HAMN_CLUSTER,
  FAMILIEN_CLUSTER,
  VARDAGEN_CLUSTER,
  MABRA_CLUSTER,
];

export type HubModule = {
  path: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tone: ClusterTone;
  longPress?: boolean;
  search?: string;
};

function clusterToHubModule(c: LifeCluster): HubModule {
  const centerHubDesc = HIDE_BEVIS_TAB
    ? 'Dagbok och spegling'
    : 'Dagbok · bevis · spegling';
  return {
    path: c.path,
    label: c.hubLabel,
    desc: c.hubPosition === 'center' ? centerHubDesc : c.desc.split('.')[0] ?? c.desc,
    icon: c.hubPosition === 'center' ? c.icon : c.id === 'vardagen' ? Sprout : c.icon,
    tone: c.tone,
    longPress: c.longPress,
    search: c.fyrenSearch,
  };
}

export const HUB_CENTER: HubModule = clusterToHubModule(HJARTAT_CLUSTER);

export const HUB_SIDE_MODULES: HubModule[] = LIFE_CLUSTERS.filter((c) => c.hubPosition === 'side').map(
  clusterToHubModule,
);

export const HUB_TOP = HUB_SIDE_MODULES.slice(0, 2);
export const HUB_BOTTOM = HUB_SIDE_MODULES.slice(2, 4);

export type LegacyRedirect = {
  from: string;
  to: string;
  search?: string;
};

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  { from: '/kompasser', to: VARDAGEN_PATH },
  { from: '/ekonomi', to: VARDAGEN_PATH, search: '?tab=ekonomi' },
  { from: '/kunskap', to: '/dagbok', search: '?tab=bevis&vaultTab=kunskapsbank' },
  { from: '/valv', to: HJARTAT_PATH, search: '?tab=bevis' },
  { from: '/speglar', to: HJARTAT_PATH, search: '?tab=speglar' },
  { from: '/barnen', to: '/familjen' },
];

export {
  parseHjartatTab,
  resolveHjartatTab,
  parseVardagenTab,
  clusterTabSearch,
  hjartatTabHref,
  vardagenTabHref,
} from './tabRegistry';
import { hjartatTabHref, vardagenTabHref } from './tabRegistry';

export function getVisibleHjartatTabs(): ClusterTabDef<HjartatTab>[] {
  if (HIDE_BEVIS_TAB) return HJARTAT_TABS.filter((t) => t.id !== 'bevis');
  return HJARTAT_TABS;
}

export function bevisTabHref(): { pathname: string; search: string } {
  return hjartatTabHref('bevis');
}

export function speglarTabHref(): { pathname: string; search: string } {
  return hjartatTabHref('speglar');
}

export function dossierHref(params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return DOSSIER_PATH;
  const q = new URLSearchParams(params);
  return `${DOSSIER_PATH}?${q.toString()}`;
}

export function clusterChipHref(cluster: LifeCluster, chip: ClusterChip): {
  pathname: string;
  search: string;
} {
  const defaultTab = cluster.id === 'hjartat' ? 'reflektion' : cluster.id === 'vardagen' ? 'kompasser' : '';
  const tab = chip.tab ?? defaultTab;
  if (!tab) return { pathname: cluster.path, search: '' };
  if (cluster.path === HJARTAT_PATH) {
    return hjartatTabHref(tab as HjartatTab);
  }
  if (cluster.path === VARDAGEN_PATH) {
    return vardagenTabHref(tab as VardagenTab);
  }
  return { pathname: cluster.path, search: '' };
}

export function isClusterActive(pathname: string, clusterPath: string): boolean {
  if (clusterPath === '/') return pathname === '/';
  return pathname === clusterPath || pathname.startsWith(`${clusterPath}/`);
}

export function getHomeClusters(): LifeCluster[] {
  if (!HIDE_BEVIS_TAB) return LIFE_CLUSTERS;
  return LIFE_CLUSTERS.map((c) =>
    c.id === 'hjartat'
      ? { ...c, chips: c.chips.filter((chip) => chip.tab !== 'bevis') }
      : c,
  );
}

export function getClusterByPath(path: string): LifeCluster | undefined {
  return LIFE_CLUSTERS.find((c) => c.path === path);
}
</file>

<file path="src/modules/core/navigation/headerPageLabel.ts">
/** Underrad i header — var du är (inte hem). */
export function getHeaderPageLabel(pathname: string): string | null {
  if (pathname === '/') return 'Hem';
  if (pathname.startsWith('/kompis')) return 'Kompis';
  if (pathname.startsWith('/familjen')) return 'Familjen';
  if (pathname.startsWith('/hamn')) return 'Trygg hamn';
  if (pathname.startsWith('/dagbok') || pathname.startsWith('/valv')) return 'Valv';
  if (pathname.startsWith('/planering')) return 'Planering';
  if (pathname.startsWith('/projekt')) return 'Projekt';
  if (pathname.startsWith('/mabra')) return 'MåBra';
  if (pathname.startsWith('/drogfrihet')) return 'Drogfrihet';
  if (pathname.startsWith('/kunskap')) return 'Kunskap';
  if (pathname.startsWith('/vardagen')) return 'Vardagen';
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) return 'Arbetsliv';
  if (pathname.startsWith('/ekonomi')) return 'Ekonomi';
  if (pathname.startsWith('/installningar')) return 'Inställningar';
  return null;
}
</file>

<file path="src/modules/core/navigation/hubTabs.tsx">
import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  BookHeart,
  BookOpen,
  Brain,
  Compass,
  Heart,
  Sparkles,
  Sprout,
  Users,
  Wallet,
} from 'lucide-react';
import { getDrawerChildren, type NavTruthEntry } from './navTruth';
import type { TabBarItem } from '../ui/TabBar';

/** Hubs vars underflikar härleds från `navTruth` (Vardag-sektionen). */
export type DrawerHubId =
  | 'dagbok'
  | 'familjen'
  | 'hamn'
  | 'vardagen'
  | 'planering'
  | 'arbetsliv'
  | 'drogfrihet'
  | 'installningar';

/** Tab-id från nav-radens path (`?tab=`). */
export function tabIdFromNavPath(path: string): string | null {
  if (!path || path.includes('#')) return null;
  const q = path.indexOf('?');
  if (q < 0) return null;
  const sp = new URLSearchParams(path.slice(q + 1));
  return sp.get('tab');
}

const HUB_TAB_ICONS: Partial<Record<string, LucideIcon>> = {
  dagbok_reflektion: BookOpen,
  dagbok_speglar: Brain,
  dagbok_bevis: BookOpen,
  familjen_reflektion: Sparkles,
  familjen_livslogg: BookHeart,
  familjen_tillsammans: Users,
  familjen_barnporten: Heart,
  hamn_oversikt: Compass,
  hamn_biff: Anchor,
  hamn_speglar: Sparkles,
  hamn_barn: Heart,
  vardagen_kompasser: Sprout,
  vardagen_ekonomi: Wallet,
  planering_handling: BookOpen,
  planering_fokus: Sparkles,
  planering_inkorg: BookOpen,
  arbetsliv_stampla: BookOpen,
  arbetsliv_tid: BookOpen,
  arbetsliv_logg: BookOpen,
  drogfrihet_idag: Sparkles,
  drogfrihet_resurser: BookOpen,
  drogfrihet_reflektion: Heart,
  drogfrihet_kunskap: BookOpen,
  installningar_allmant: BookOpen,
  installningar_drogfrihet: Heart,
};

function entryToTabItem(entry: NavTruthEntry): TabBarItem<string> | null {
  const id = tabIdFromNavPath(entry.path);
  if (!id) return null;
  const Icon = HUB_TAB_ICONS[entry.id];
  return {
    id,
    label: entry.label,
    icon: Icon ? <Icon className="h-3 w-3" /> : undefined,
  };
}

export function getHubTabsFromNav(hubId: DrawerHubId): TabBarItem<string>[] {
  const rows = getDrawerChildren(hubId, 'vardag');
  const fromNav = rows
    .map(entryToTabItem)
    .filter((t): t is TabBarItem<string> => t !== null);
  return fromNav;
}

export function getDefaultHubTab(hubId: DrawerHubId): string {
  const tabs = getHubTabsFromNav(hubId);
  return tabs[0]?.id ?? '';
}
</file>

<file path="docs/design/references/MENU-DRAWER-KANON.md">
# Sidomeny (hamburger) — KANON

**Status:** **Låst** 2026-05-27 — Vardag (publikt) + Valv (endast efter PIN/gate) · accordion-hubbar.  
**Bild:** [`MENU-DRAWER-KANON.png`](./MENU-DRAWER-KANON.png) *(referens; UI kan sakna Valv-växlare i publikt läge)*

---

## Visuellt

| Element | Spec |
|---------|------|
| **Bakgrund** | Samma nordiska skymningsfoto som hem (blur + mörk overlay ~55%) |
| **Bredd** | ~68% skärm, glid in från vänster |
| **DOM** | `<aside class="nav-drawer">` före `.nav-drawer__backdrop` (drawer `z-[201]`, backdrop `z-[200]`) |
| **Header** | `LIVSKOMPASSEN` serif guld + dekoration (tre rutor) |
| **Stäng** | Guld `×` uppe vänster |
| **Lägesväxlare** | **Ingen** i publikt läge. I Valv: en diskret **Vardag**-knapp (tillbaka), **inte** synlig **Valv**-flik |
| **Snabbåtgärder** | **Ej** i drawer (`nav-drawer__quick-grid` borttagen). Snabbvägar via Fyren-widget / hubbar |
| **Rad** | Cirkel-ikon guld (48px hub / 36px sub) · etikett · chevron |
| **Aktiv rad** | **Guld** bakgrundsstreck (inte turkos/teal) |
| **Sektion** | Rubrik **Vardag** eller **Valv** efter aktivt läge |

---

## Läge Vardag (publikt — standard)

Visas när Valv **inte** är upplåst på en Valv-route.

| Hub | Underflikar |
|-----|-------------|
| Hem Kompass | Inkast (`/#inkast-lite`) |
| Dagbok | Reflektion · Speglar *(Bevis dold vid G18)* |
| Vardagen | Kompasser · Ekonomi |
| MåBra | — |
| Familjen | Reflektion · Livslogg · Tillsammans |
| Planering | Handling · Fokus · Inkorg |
| Arbetsliv | Stämpel · Tid & flex · Logg |
| Trygg hamn | Översikt · BIFF · Speglar · Barnfokus |
| Projekt | Nytt projekt |
| Drogfrihet | Idag · Stöd · Reflektion · Stöd & resurser |
| Inställningar | Allmänt · Drogfrihet |

**MUST NOT:** publik `/vardagen?tab=kunskap` — Kunskap endast via Valv `kunskapsbank`.  
**MUST NOT:** exponera Valv (växlare, Valv-flik, snabbchips) i publikt drawer-läge.

---

## Läge Valv (PIN i VaultPage)

Visas **endast** när `isVaultUnlocked` eller `hasVaultGate()` **och** route är Valv (`?tab=bevis`, `vaultTab=…`, eller `/dossier`).

Tre expanderbara grupper:

| Grupp | Rader |
|-------|--------|
| **Pansaret** | Arkiv · Triage · Mönster · Orkester · Dossier · full vy (`/dossier`) |
| **Kunskap** | Kunskapsbank |
| **Forensik** | Hamn · Analys · Speglar · Fördjupat · Dagbok · Arkiv · Familjen · Mönster · Arbetsliv · Frånvaro · Arbetsliv · Lön |

Alla Valv-rader (utom Dossier-export) → `/dagbok?tab=bevis&vaultTab=…`

**Tillbaka:** `DrawerModeToggle` med **Vardag** → `/dagbok?tab=reflektion` (stänger drawer).

---

## Beteende

| Gest | Resultat |
|------|----------|
| Öppna | Hamburgermeny i header (`AppHeaderBar`) |
| Publikt | Endast Vardag-index — ingen Valv-växlare |
| Valv upplåst + Valv-route | Valv-index + **Vardag**-tillbaka |
| Hub med barn | Ikon+etikett → hub-path; **chevron** fäller ut underflikar |
| Valv-grupp | Rad fäller ut (ingen path) |
| Stäng | `×`, swipe vänster, tap utanför, route change |
| Valv-rad | Navigera → PIN-gate → Valv-baksida |

Widget-routes `/widget/*` ingår **inte** i drawer (deep links / PWA).

---

## Implementation

| Komponent | Fil |
|-----------|-----|
| `NavigationDrawer` | `src/modules/core/layout/NavigationDrawer.tsx` (`isInValvDrawerContext`) |
| `DrawerModeToggle` | `src/modules/core/layout/DrawerModeToggle.tsx` (`showValvShell`) |
| `DrawerHubAccordion` | `src/modules/core/layout/DrawerHubAccordion.tsx` |
| Sanning | `src/modules/core/navigation/navTruth.ts` |
| Hub-flikar (synk med drawer) | `src/modules/core/navigation/hubTabs.tsx` · `hooks/useHubTab.ts` |
| Ikoner | `src/modules/core/navigation/drawerNav.ts` |

Kanon: [`COLOR-POLICY.md`](../COLOR-POLICY.md) — aktiv rad endast **guld** `#d4af37`.
</file>

<file path="src/modules/core/layout/NavigationDrawer.tsx">
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
import { DrawerQuickActions } from './DrawerQuickActions';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
};

const SWIPE_CLOSE_THRESHOLD_PX = 56;

function isInValvDrawerContext(pathname: string, search: string, vaultOpen: boolean): boolean {
  if (!vaultOpen) return false;
  if (search.includes('tab=bevis') || search.includes('vaultTab=')) return true;
  return pathname === '/dossier' || pathname.startsWith('/dossier/');
}

function collectActiveAncestorIds(
  section: NavDrawerSection,
  pathname: string,
  search: string,
  hash: string,
): Set<string> {
  const expanded = new Set<string>();
  const visible = getVisibleDrawerTruth(section);
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
  const vaultOpen = isVaultUnlocked || hasVaultGate();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const pathname = location.pathname;
  const search = location.search;
  const hash = location.hash;

  const inValvContext = useMemo(
    () => isInValvDrawerContext(pathname, search, vaultOpen),
    [pathname, search, vaultOpen],
  );
  const mode: NavDrawerSection = inValvContext ? 'valv' : 'vardag';

  const activeAncestors = useMemo(
    () => ({
      vardag: collectActiveAncestorIds('vardag', pathname, search, hash),
      valv: collectActiveAncestorIds('valv', pathname, search, hash),
    }),
    [pathname, search, hash],
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
    const sectionAncestors = inValvContext ? activeAncestors.valv : activeAncestors.vardag;
    setExpandedIds(new Set(sectionAncestors));
  }, [open, pathname, activeAncestors, inValvContext]);

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
    navigate({ pathname: '/dagbok', search: '?tab=reflektion' });
    onClose();
  };

  return createPortal(
    <>
      <aside
        className="nav-drawer"
        role="dialog"
        aria-label={inValvContext ? 'Valv-meny' : 'Huvudmeny'}
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

        <DrawerModeToggle showValvShell={inValvContext} onBackToVardag={handleBackToVardag} />

        <nav className="nav-drawer__sections" aria-label="Moduler">
          <div className="nav-drawer__section">
            <p className="nav-drawer__section-title">{mode === 'vardag' ? 'Vardag' : 'Valv'}</p>
            <DrawerHubAccordion
              section={mode}
              pathname={pathname}
              search={search}
              hash={hash}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onGo={go}
            />
          </div>
        </nav>

        <DrawerQuickActions onNavigate={onClose} />

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
</file>

<file path="src/modules/core/layout/dockNavIcons.tsx">
import type { ReactNode } from 'react';
import { ChromeV5Icon } from '../ui/chromeIcons/ChromeV5Icon';
import type { ChromeV5Category } from '../ui/chromeIcons/ChromeV5Icon';
import type { HubContextIconId } from '../navigation/hubContextBar';
import type { HubContextSlot } from '../navigation/hubContextBar';

export const DOCK_CHROME_ICON_CLASS = 'dock-nav-btn__chrome-v5';

function V5({ category }: { category: ChromeV5Category }) {
  return <ChromeV5Icon category={category} className={DOCK_CHROME_ICON_CLASS} />;
}

function PwaShortcutIcon({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className={DOCK_CHROME_ICON_CLASS}
    />
  );
}

function renderByIcon(icon: HubContextIconId): ReactNode {
  switch (icon) {
    case 'list':
    case 'calendar':
    case 'folder':
    case 'plus':
      return <V5 category="planering" />;
    case 'clock':
    case 'record':
      return <V5 category="arbetsliv" />;
    case 'note':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-anteckning.svg" />;
    case 'wallet':
      return <V5 category="ekonomi" />;
    case 'mail':
      return <V5 category="dagbok" />;
    case 'focus':
    case 'brain':
    case 'sprout':
      return <V5 category="utveckling" />;
    case 'book':
    case 'bookheart':
      return <V5 category="dagbok" />;
    case 'anchor':
      return <V5 category="hamn" />;
    case 'sparkles':
      return <V5 category="mabra" />;
    case 'users':
      return <V5 category="familjen" />;
    default:
      return <V5 category="planering" />;
  }
}

/** Premium v5-guldikoner för dock — samma familj som hero + drawer. */
export function renderDockNavIcon(slot: Pick<HubContextSlot, 'id' | 'icon'>): ReactNode {
  switch (slot.id) {
    case 'inkop':
      return <V5 category="ekonomi" />;
    case 'handling':
    case 'planering':
    case 'hub':
      return <V5 category="planering" />;
    case 'projekt':
      return <V5 category="projekt" />;
    case 'fokus':
      return <V5 category="utveckling" />;
    case 'stampla':
    case 'tid':
    case 'arbetsliv':
      return <V5 category="arbetsliv" />;
    case 'inkorg':
    case 'logg':
    case 'dagbok':
      return <V5 category="dagbok" />;
    case 'reflektion':
    case 'mabra':
      return <V5 category="mabra" />;
    case 'livslogg':
    case 'tillsammans':
    case 'familjen':
      return <V5 category="familjen" />;
    case 'hamn':
      return <V5 category="hamn" />;
    case 'biff':
      return <V5 category="hamnBiff" />;
    case 'kunskap':
      return <V5 category="kunskap" />;
    case 'note':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-anteckning.svg" />;
    default:
      return renderByIcon(slot.icon);
  }
}

export function renderDockSideIcon(icon: HubContextIconId): ReactNode {
  return renderByIcon(icon);
}
</file>

<file path="src/modules/core/navigation/drawerNav.ts">
/**
 * Sidomeny — kanon enligt docs/design/references/MENU-DRAWER-KANON.md
 * Labels/paths: navTruth.ts · Implementation: NavigationDrawer.tsx
 */
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Clock,
  Compass,
  FileText,
  FolderKanban,
  HeartHandshake,
  Inbox,
  ListTodo,
  Network,
  Plus,
  ScrollText,
  Search,
  Settings,
  Shield,
  Sparkles,
  Sprout,
  Target,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { createChromeV5Icon } from '../ui/chromeIcons';
import {
  DRAWER_NAV_TRUTH,
  getVisibleDrawerTruth,
  type NavDrawerSection,
  type NavTruthEntry,
} from './navTruth';

export type DrawerNavIcon = LucideIcon | ComponentType<{ className?: string }>;

export type DrawerNavItem = {
  id: string;
  label: string;
  path: string;
  section: NavDrawerSection;
  requiresVaultPin?: boolean;
  parentId?: string;
  isGroupHeader?: boolean;
  drawerHint?: string;
  icon: DrawerNavIcon;
};

const DRAWER_ICONS: Record<string, DrawerNavIcon> = {
  hem: Compass,
  hem_inkast: Zap,
  dagbok: createChromeV5Icon('dagbok'),
  dagbok_reflektion: BookOpen,
  dagbok_speglar: Sparkles,
  dagbok_bevis: createChromeV5Icon('valv'),
  familjen: createChromeV5Icon('familjen'),
  familjen_reflektion: Sparkles,
  familjen_livslogg: BookOpen,
  familjen_tillsammans: Users,
  hamn: createChromeV5Icon('hamn'),
  hamn_oversikt: Compass,
  hamn_biff: createChromeV5Icon('hamnBiff'),
  hamn_speglar: Sparkles,
  hamn_barn: Users,
  vardagen: Sprout,
  vardagen_kompasser: Compass,
  vardagen_ekonomi: Wallet,
  planering: createChromeV5Icon('planering'),
  planering_handling: ListTodo,
  planering_fokus: Target,
  planering_inkorg: Inbox,
  arbetsliv: Clock,
  arbetsliv_stampla: Clock,
  arbetsliv_tid: Clock,
  arbetsliv_logg: Clock,
  mabra: createChromeV5Icon('mabra'),
  drogfrihet: HeartHandshake,
  projekt: FolderKanban,
  projekt_ny: Plus,
  projekt_handling: ListTodo,
  installningar: Settings,
  valv_grp_samla: createChromeV5Icon('valv'),
  valv_grp_analysera: BarChart3,
  valv_grp_exportera: ScrollText,
  valv_grp_kunskap: BookOpen,
  valv_grp_forensik: Shield,
  valv_arkiv: FileText,
  valv_triage: Search,
  valv_monster: BarChart3,
  valv_orkester: Network,
  valv_dossier: ScrollText,
  valv_dossier_export: ScrollText,
  valv_kunskapsbank: BookOpen,
  valv_aktorskarta: Users,
  valv_hamn_analys: Shield,
  valv_speglar_fordjupat: Sparkles,
  valv_dagbok_arkiv: BookOpen,
  valv_familjen_monster: BarChart3,
  valv_arbetsliv_franvaro: Briefcase,
  valv_arbetsliv_lon: Wallet,
};

export function toDrawerNavItem(entry: NavTruthEntry): DrawerNavItem {
  return {
    id: entry.id,
    label: entry.label,
    path: entry.path,
    section: entry.section,
    requiresVaultPin: entry.requiresVaultPin,
    parentId: entry.parentId,
    isGroupHeader: entry.isGroupHeader,
    drawerHint: entry.drawerHint,
    icon: DRAWER_ICONS[entry.id] ?? Compass,
  };
}

function mapDrawerItems(entries: NavTruthEntry[]): DrawerNavItem[] {
  return entries.map(toDrawerNavItem);
}

/** Full drawer — Vardag + Valv. Ordning låst via navTruth. */
export const DRAWER_NAV_ITEMS: DrawerNavItem[] = mapDrawerItems(DRAWER_NAV_TRUTH);

export const DRAWER_VARDAG_ITEMS = mapDrawerItems(getVisibleDrawerTruth('vardag'));

export const DRAWER_VALV_ITEMS = mapDrawerItems(getVisibleDrawerTruth('valv'));

/** @deprecated Använd getDrawerRoots + getDrawerChildren */
export const DRAWER_NAV_ITEMS_LEGACY = DRAWER_NAV_ITEMS.filter((e) => !e.parentId);
</file>

<file path="src/modules/core/navigation/tabRegistry.ts">
/**
 * TabRegistry — livsområden, hub-flikar och Valv-flikar.
 * Synkad med `navTruth.ts` (paths) och `evidence/vault/utils/vaultTabs.ts`.
 */
import { createElement, type ReactNode } from 'react';
import {
  BarChart3,
  BookOpen,
  FileText,
  Network,
  ScrollText,
  Search,
  Users,
} from 'lucide-react';
import type { DrawerHubId } from './hubTabs';
import { tabIdFromNavPath } from './hubTabs';
import { getDrawerChildren, type NavTruthEntry } from './navTruth';
import type { TabBarItem } from '../ui/TabBar';
import {
  FORENSIC_VAULT_TAB_IDS,
  KUNSKAP_VAULT_TAB_IDS,
  MAIN_VAULT_TAB_IDS,
  ANALYSERA_VAULT_TAB_IDS,
  PANSARET_VAULT_TAB_IDS,
  SAMLA_VAULT_TAB_IDS,
  VALV_ZONE_IDS,
  forensicVaultTabLabel,
  type ForensicVaultTab,
  type KunskapVaultTab,
  type MainVaultTab,
  type AnalyseraVaultTab,
  type PansaretVaultTab,
  type SamlaVaultTab,
  type ValvZone,
} from '../../evidence/vault/utils/vaultTabs';

import { HIDE_BEVIS_TAB } from './navFlags';

export { HIDE_BEVIS_TAB } from './navFlags';

export type TabCategory =
  | 'dagbok_spegling'
  | 'vardag_aterhamtning'
  | 'familj'
  | 'verktyg'
  | 'trygghet'
  | 'kompass_system';

export const TAB_CATEGORY_ORDER: TabCategory[] = [
  'kompass_system',
  'dagbok_spegling',
  'vardag_aterhamtning',
  'familj',
  'verktyg',
  'trygghet',
];

export const TAB_CATEGORY_LABELS: Record<TabCategory, string> = {
  kompass_system: 'Kompass',
  dagbok_spegling: 'Dagbok & spegling',
  vardag_aterhamtning: 'Vardag & återhämtning',
  familj: 'Familjen',
  verktyg: 'Planering & arbete',
  trygghet: 'Trygghet & stöd',
};

export const HUB_TAB_CATEGORY: Record<string, TabCategory> = {
  hem: 'kompass_system',
  dagbok: 'dagbok_spegling',
  vardagen: 'vardag_aterhamtning',
  mabra: 'vardag_aterhamtning',
  familjen: 'familj',
  planering: 'verktyg',
  arbetsliv: 'verktyg',
  projekt: 'verktyg',
  hamn: 'trygghet',
  drogfrihet: 'trygghet',
  installningar: 'kompass_system',
};

export type HjartatTab = 'reflektion' | 'bevis' | 'speglar';
export type VardagenTab = 'kompasser' | 'ekonomi';

export type HubTabDef<T extends string = string> = {
  id: T;
  label: string;
  isDefault?: boolean;
};

export function getHubTabCategory(hubId: string): TabCategory | undefined {
  return HUB_TAB_CATEGORY[hubId];
}

export function groupVardagDrawerRoots(
  roots: NavTruthEntry[],
): { category: TabCategory; label: string; entries: NavTruthEntry[] }[] {
  const buckets = new Map<TabCategory, NavTruthEntry[]>();
  for (const root of roots) {
    const cat = getHubTabCategory(root.id) ?? 'verktyg';
    const list = buckets.get(cat) ?? [];
    list.push(root);
    buckets.set(cat, list);
  }
  return TAB_CATEGORY_ORDER.filter((c) => buckets.has(c)).map((category) => ({
    category,
    label: TAB_CATEGORY_LABELS[category],
    entries: buckets.get(category) ?? [],
  }));
}

export function hubTabDefsFromNav(hubId: DrawerHubId): HubTabDef[] {
  return getDrawerChildren(hubId, 'vardag')
    .map((entry) => {
      const id = tabIdFromNavPath(entry.path);
      if (!id) return null;
      return { id, label: entry.label };
    })
    .filter((t): t is HubTabDef => t !== null);
}

export function getVisibleHjartatTabIds(): HjartatTab[] {
  const ids = hubTabDefsFromNav('dagbok').map((t) => t.id as HjartatTab);
  if (HIDE_BEVIS_TAB) return ids.filter((id) => id !== 'bevis');
  return ids;
}

export function parseHjartatTab(raw: string | null): HjartatTab {
  if (raw === 'bevis' || raw === 'speglar') return raw;
  return 'reflektion';
}

export function resolveHjartatTab(raw: string | null, vaultGateOpen: boolean): HjartatTab {
  const parsed = parseHjartatTab(raw);
  if (vaultGateOpen && parsed === 'bevis') return 'bevis';
  if (parsed === 'bevis' && HIDE_BEVIS_TAB && !vaultGateOpen) return 'reflektion';
  return parsed;
}

export function parseVardagenTab(raw: string | null): VardagenTab {
  if (raw === 'ekonomi') return 'ekonomi';
  return 'kompasser';
}

const VAULT_MAIN_LABELS: Record<MainVaultTab, string> = {
  logga: 'Arkiv',
  sok: 'Triage',
  monster: 'Mönster',
  orkester: 'Orkester',
  dossier: 'Dossier',
  kunskapsbank: 'Kunskapsbank',
  aktorskarta: 'Aktörskarta',
};

const icon = (Icon: typeof FileText) => createElement(Icon, { className: 'h-3 w-3' });

const VAULT_MAIN_ICONS: Partial<Record<MainVaultTab, ReactNode>> = {
  logga: icon(FileText),
  sok: icon(Search),
  monster: icon(BarChart3),
  orkester: icon(Network),
  dossier: icon(ScrollText),
  kunskapsbank: icon(BookOpen),
  aktorskarta: icon(Users),
};

export function vaultMainTabLabel(id: MainVaultTab): string {
  return VAULT_MAIN_LABELS[id];
}

export function getMainVaultTabBarItems(): TabBarItem<MainVaultTab>[] {
  return MAIN_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

const VALV_ZONE_LABELS: Record<ValvZone, string> = {
  samla: 'Samla',
  analysera: 'Analysera',
  kunskap: 'Kunskap',
  exportera: 'Exportera',
  forensik: 'Forensik',
};

export function getVaultZoneTabBarItems(): TabBarItem<ValvZone>[] {
  return VALV_ZONE_IDS.map((id) => ({ id, label: VALV_ZONE_LABELS[id] }));
}

export function getSamlaVaultTabBarItems(): TabBarItem<SamlaVaultTab>[] {
  return SAMLA_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

export function getAnalyseraVaultTabBarItems(): TabBarItem<AnalyseraVaultTab>[] {
  return ANALYSERA_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

/** @deprecated Använd zon-specifika getters (samla / analysera / exportera). */
export function getPansaretVaultTabBarItems(): TabBarItem<PansaretVaultTab>[] {
  return PANSARET_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

export function getForensicVaultTabBarItems(): TabBarItem<ForensicVaultTab>[] {
  return FORENSIC_VAULT_TAB_IDS.map((id) => ({
    id,
    label: forensicVaultTabLabel(id),
  }));
}

export function getKunskapVaultTabBarItems(): TabBarItem<KunskapVaultTab>[] {
  return KUNSKAP_VAULT_TAB_IDS.map((id) => ({
    id,
    label: VAULT_MAIN_LABELS[id],
    icon: VAULT_MAIN_ICONS[id],
  }));
}

export function clusterTabSearch(tab: string, defaultTab: string): string {
  return tab === defaultTab ? '' : `?tab=${tab}`;
}

export function hjartatTabHref(tab: HjartatTab): { pathname: string; search: string } {
  return { pathname: '/dagbok', search: clusterTabSearch(tab, 'reflektion') };
}

export function vardagenTabHref(tab: VardagenTab): { pathname: string; search: string } {
  return { pathname: '/vardagen', search: clusterTabSearch(tab, 'kompasser') };
}
</file>

<file path="src/modules/core/navigation/hubContextIcons.tsx">
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Mail, Plus } from 'lucide-react';
import { ChromeV5Icon, type ChromeV5Category } from '../ui/chromeIcons';
import type { HubContextIconId } from './hubContextBar';

/** PWA shortcut-glyph (samma assets som `manifest.webmanifest` WH1–WH2). */
function PwaShortcutImg({ src, className }: { src: string; className: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className={clsx('shrink-0 object-contain', className)}
    />
  );
}

function ChromeGlyph({
  category,
  className,
}: {
  category: ChromeV5Category;
  className: string;
}) {
  return <ChromeV5Icon category={category} className={className} />;
}

export function renderHubContextIcon(id: HubContextIconId, className: string): ReactNode {
  const cls = className;
  const stroke = 1.65;
  switch (id) {
    case 'list':
      return <ChromeGlyph category="planering" className={cls} />;
    case 'calendar':
      return <ChromeGlyph category="planering" className={cls} />;
    case 'clock':
      return <ChromeGlyph category="arbetsliv" className={cls} />;
    case 'note':
      return <PwaShortcutImg src="/icons/shortcuts/wh-anteckning.svg" className={cls} />;
    case 'record':
      return <PwaShortcutImg src="/icons/shortcuts/wh-inspelning.svg" className={cls} />;
    case 'wallet':
      return <ChromeGlyph category="ekonomi" className={cls} />;
    case 'mail':
      return <Mail className={cls} strokeWidth={stroke} />;
    case 'folder':
      return <ChromeGlyph category="planering" className={cls} />;
    case 'focus':
      return <ChromeGlyph category="utveckling" className={cls} />;
    case 'plus':
      return <Plus className={cls} strokeWidth={stroke} />;
    case 'sprout':
      return <ChromeGlyph category="rutiner" className={cls} />;
    case 'book':
      return <ChromeGlyph category="dagbok" className={cls} />;
    case 'brain':
      return <ChromeGlyph category="utveckling" className={cls} />;
    case 'anchor':
      return <ChromeGlyph category="hamn" className={cls} />;
    case 'sparkles':
      return <ChromeGlyph category="mabra" className={cls} />;
    case 'users':
      return <ChromeGlyph category="familjen" className={cls} />;
    case 'bookheart':
      return <ChromeGlyph category="familjen" className={cls} />;
    default:
      return null;
  }
}
</file>

<file path="src/modules/core/navigation/hubContextBar.ts">
/**
 * Hub-kontextrad — 4 fasta platser per hub (ingen Hem/Kompass; dock + drawer).
 */
export type HubContextIconId =
  | 'list'
  | 'calendar'
  | 'clock'
  | 'note'
  | 'record'
  | 'wallet'
  | 'mail'
  | 'folder'
  | 'focus'
  | 'plus'
  | 'sprout'
  | 'book'
  | 'brain'
  | 'anchor'
  | 'sparkles'
  | 'users'
  | 'bookheart';

export type HubContextKey =
  | 'default'
  | 'planering'
  | 'familjen'
  | 'vardagen'
  | 'arbetsliv'
  | 'hamn'
  | 'dagbok'
  | 'mabra';

export type HubContextSlot = {
  id: string;
  label: string;
  to: string;
  icon: HubContextIconId;
  active?: boolean;
};

const DEFAULT_SLOTS: HubContextSlot[] = [
  { id: 'inkop', label: 'Inköp', to: '/planering?tab=inkop', icon: 'list' },
  { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla', icon: 'clock' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning', icon: 'note' },
  { id: 'snabbval', label: 'Snabbval', to: '/widget/snabbval', icon: 'sparkles' },
];

function tabParam(search: string): string | null {
  return new URLSearchParams(search.replace(/^\?/, '')).get('tab');
}

function planeringSlots(tab: string | null, onProjekt: boolean): HubContextSlot[] {
  const t =
    tab === 'fokus' || tab === 'inkorg' || tab === 'framsteg' || tab === 'regler' ? tab : 'handling';
  if (onProjekt) {
    return [
      { id: 'projekt', label: 'Projekt', to: '/projekt', icon: 'folder', active: true },
      { id: 'inkop', label: 'Inköp', to: '/planering?tab=inkop', icon: 'list' },
      { id: 'handling', label: 'Handling', to: '/planering?tab=handling', icon: 'calendar' },
      { id: 'hub', label: 'Verktyg', to: '/planering', icon: 'plus' },
    ];
  }
  if (tab === 'inkop') {
    return [
      { id: 'inkop', label: 'Inköp', to: '/planering?tab=inkop', icon: 'list', active: true },
      { id: 'handling', label: 'Handling', to: '/planering?tab=handling', icon: 'calendar' },
      { id: 'fokus', label: 'Fokus', to: '/planering?tab=fokus', icon: 'focus' },
      { id: 'hub', label: 'Verktyg', to: '/planering', icon: 'plus' },
    ];
  }
  if (!tab || tab === 'hub') {
    return [
      { id: 'handling', label: 'Handling', to: '/planering?tab=handling', icon: 'calendar' },
      { id: 'fokus', label: 'Fokus', to: '/planering?tab=fokus', icon: 'focus' },
      { id: 'inkorg', label: 'Inkorg', to: '/planering?tab=inkorg', icon: 'mail' },
      { id: 'regler', label: 'Regler', to: '/planering?tab=regler', icon: 'list' },
    ];
  }
  return [
    {
      id: 'handling',
      label: 'Handling',
      to: '/planering?tab=handling',
      icon: 'calendar',
      active: t === 'handling',
    },
    {
      id: 'fokus',
      label: 'Fokus',
      to: '/planering?tab=fokus',
      icon: 'focus',
      active: t === 'fokus',
    },
    {
      id: 'inkorg',
      label: 'Inkorg',
      to: '/planering?tab=inkorg',
      icon: 'mail',
      active: t === 'inkorg',
    },
    {
      id: 'regler',
      label: 'Regler',
      to: '/planering?tab=regler',
      icon: 'list',
      active: t === 'regler',
    },
  ];
}

function arbetslivSlots(tab: string | null): HubContextSlot[] {
  const t = tab === 'tid' || tab === 'logg' ? tab : 'stampla';
  return [
    {
      id: 'stampla',
      label: 'Stämpel',
      to: '/arbetsliv?tab=stampla',
      icon: 'clock',
      active: t === 'stampla',
    },
    {
      id: 'tid',
      label: 'Tid',
      to: '/arbetsliv?tab=tid',
      icon: 'calendar',
      active: t === 'tid',
    },
    {
      id: 'logg',
      label: 'Logg',
      to: '/arbetsliv?tab=logg',
      icon: 'book',
      active: t === 'logg',
    },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'folder' },
  ];
}

function familjenSlots(tab: string | null): HubContextSlot[] {
  const t =
    tab === 'livslogg' || tab === 'tillsammans' ? tab : 'reflektion';
  return [
    {
      id: 'reflektion',
      label: 'Reflektion',
      to: '/familjen?tab=reflektion',
      icon: 'sparkles',
      active: t === 'reflektion',
    },
    {
      id: 'livslogg',
      label: 'Livslogg',
      to: '/familjen?tab=livslogg',
      icon: 'bookheart',
      active: t === 'livslogg',
    },
    {
      id: 'tillsammans',
      label: 'Tillsammans',
      to: '/familjen?tab=tillsammans',
      icon: 'users',
      active: t === 'tillsammans',
    },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

function vardagenSlots(tab: string | null): HubContextSlot[] {
  const t = tab === 'ekonomi' ? 'ekonomi' : 'kompasser';
  return [
    {
      id: 'kompasser',
      label: 'Kompasser',
      to: '/vardagen?tab=kompasser',
      icon: 'sprout',
      active: t === 'kompasser',
    },
    {
      id: 'ekonomi',
      label: 'Ekonomi',
      to: '/vardagen?tab=ekonomi',
      icon: 'wallet',
      active: t === 'ekonomi',
    },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
    { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla', icon: 'clock' },
  ];
}

function hamnSlots(): HubContextSlot[] {
  return [
    { id: 'hamn', label: 'Hamn', to: '/hamn', icon: 'anchor', active: true },
    { id: 'biff', label: 'BIFF', to: '/hamn', icon: 'anchor' },
    { id: 'dagbok', label: 'Dagbok', to: '/dagbok', icon: 'book' },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

function dagbokSlots(tab: string | null): HubContextSlot[] {
  const t = tab === 'speglar' ? 'speglar' : 'reflektion';
  return [
    {
      id: 'reflektion',
      label: 'Reflektion',
      to: '/dagbok',
      icon: 'book',
      active: t === 'reflektion',
    },
    {
      id: 'speglar',
      label: 'Speglar',
      to: '/dagbok?tab=speglar',
      icon: 'brain',
      active: t === 'speglar',
    },
    { id: 'hamn', label: 'Hamn', to: '/hamn', icon: 'anchor' },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

function mabraSlots(): HubContextSlot[] {
  return [
    { id: 'mabra', label: 'MåBra', to: '/mabra', icon: 'sparkles', active: true },
    { id: 'dagbok', label: 'Dagbok', to: '/dagbok', icon: 'book' },
    { id: 'hamn', label: 'Hamn', to: '/hamn', icon: 'anchor' },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

export function resolveHubKey(pathname: string, search: string): HubContextKey {
  if (pathname.startsWith('/planering') || pathname.startsWith('/projekt')) {
    return 'planering';
  }
  if (pathname.startsWith('/familjen')) return 'familjen';
  if (
    pathname.startsWith('/vardagen') ||
    pathname.startsWith('/ekonomi') ||
    pathname.startsWith('/kompasser')
  ) {
    return 'vardagen';
  }
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) {
    return 'arbetsliv';
  }
  if (pathname.startsWith('/hamn')) return 'hamn';
  if (pathname.startsWith('/dagbok') || pathname.startsWith('/valv')) {
    const tab = tabParam(search);
    if (tab === 'bevis' || search.includes('vaultTab=')) return 'default';
    return 'dagbok';
  }
  if (pathname.startsWith('/mabra')) return 'mabra';
  return 'default';
}

/** Exakt fyra kontextknappar för aktuell hub. */
export function getHubContextSlots(pathname: string, search: string): HubContextSlot[] {
  const tab = tabParam(search);
  const key = resolveHubKey(pathname, search);

  switch (key) {
    case 'planering':
      return planeringSlots(tab, pathname.startsWith('/projekt'));
    case 'arbetsliv':
      return arbetslivSlots(tab);
    case 'familjen':
      return familjenSlots(tab);
    case 'vardagen':
      return vardagenSlots(tab);
    case 'hamn':
      return hamnSlots();
    case 'dagbok':
      return dagbokSlots(tab);
    case 'mabra':
      return mabraSlots();
    default:
      return DEFAULT_SLOTS.map((s) => ({ ...s }));
  }
}

export type HubMoreActionId =
  | 'inkop'
  | 'planering'
  | 'arbetsliv'
  | 'note'
  | 'snabbval'
  | 'record'
  | 'ekonomi';

/** Utökad panel «Mer» — utan Hem/Kompass. */
export const HUB_MORE_ACTIONS: {
  id: HubMoreActionId;
  label: string;
  to: string;
  icon: HubContextIconId;
}[] = [
  { id: 'inkop', label: 'Inköpslista', to: '/admin/projects/ny', icon: 'list' },
  { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla', icon: 'clock' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning', icon: 'note' },
  { id: 'snabbval', label: 'Snabbval', to: '/widget/snabbval', icon: 'sparkles' },
  { id: 'record', label: 'Tyst inspelning', to: '/widget/inspelning?autostart=1', icon: 'record' },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi', icon: 'wallet' },
];
</file>

<file path="src/modules/core/layout/DockNavButton.tsx">
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type Props = {
  label: string;
  icon: ReactNode;
  active?: boolean;
  variant?: 'slot' | 'side';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Dock-knapp — premium v4-chrome (hel ikon, ingen dubbel platta). */
export function DockNavButton({
  label,
  icon,
  active = false,
  variant = 'slot',
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'dock-nav-btn',
        variant === 'side' && 'dock-nav-btn--side',
        active && 'dock-nav-btn--active',
        className,
      )}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      <span
        className={clsx(
          'hub-chrome-tile hub-chrome-tile--dock dock-nav-btn__icon-shell',
          variant === 'side' && 'hub-chrome-tile--dock-side dock-nav-btn__icon-shell--side',
          active && 'hub-chrome-tile--active',
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className="dock-nav-btn__label">{label}</span>
    </button>
  );
}

type LinkFaceProps = {
  label: string;
  icon: ReactNode;
  active?: boolean;
  variant?: 'slot' | 'side';
};

/** Innehåll för NavLink (ingen knapp i knapp). */
export function DockNavLinkFace({ label, icon, active, variant = 'side' }: LinkFaceProps) {
  return (
    <>
      <span
        className={clsx(
          'hub-chrome-tile hub-chrome-tile--dock dock-nav-btn__icon-shell',
          variant === 'side' && 'hub-chrome-tile--dock-side dock-nav-btn__icon-shell--side',
          active && 'hub-chrome-tile--active',
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className={clsx('dock-nav-btn__label', active && 'dock-nav-btn__label--active')}>
        {label}
      </span>
    </>
  );
}
</file>

<file path="src/modules/core/layout/DockHubBand.tsx">
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { useLongPress } from '../hooks/useLongPress';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import { getHubContextSlots, type HubContextSlot } from '../navigation/hubContextBar';
import { renderDockNavIcon, renderDockSideIcon } from './dockNavIcons';
import { DockNavButton, DockNavLinkFace } from './DockNavButton';
import { getDockSideLinks } from './dockHubChrome';
import type { DockSideLink } from './dockHubChrome';
import { resolveHeaderPanelStyle } from './headerPanelStyle';

function DockSideNav({ link }: { link: DockSideLink }) {
  const icon = renderDockSideIcon(link.icon);
  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        clsx('dock-nav-btn', 'dock-nav-btn--side', isActive && 'dock-nav-btn--active')
      }
      aria-label={link.label}
    >
      {({ isActive }) => (
        <DockNavLinkFace label={link.label} icon={icon} active={isActive} variant="side" />
      )}
    </NavLink>
  );
}

function ContextSlotButton({
  slot,
  onGo,
}: {
  slot: HubContextSlot;
  onGo: (to: string) => void;
}) {
  const icon = renderDockNavIcon(slot);
  return (
    <DockNavButton
      label={slot.label}
      icon={icon}
      active={!!slot.active}
      variant="slot"
      onClick={() => onGo(slot.to)}
    />
  );
}

/** Dock-chrome: sidolänkar + kontext-slots kring kompass (DOCK-KANON: mitt = Hem). */
export function DockHubBand() {
  const location = useLocation();
  const navigate = useNavigate();
  const { presetId } = useLifeHubPreset();
  const isHome = location.pathname === '/';

  const hubSlots = useMemo(
    () => getHubContextSlots(location.pathname, location.search),
    [location.pathname, location.search],
  );
  const sides = useMemo(
    () => getDockSideLinks(presetId, location.pathname),
    [presetId, location.pathname],
  );
  const leftSlots = hubSlots.slice(0, 2);
  const rightSlots = hubSlots.slice(2, 4);
  const leftRail = [leftSlots[0] ?? null, leftSlots[1] ?? null] as const;
  const rightRail = [rightSlots[0] ?? null, rightSlots[1] ?? null] as const;

  const centerPress = useLongPress({
    onLongPress: () => navigate('/dagbok?tab=bevis'),
    onClick: () => {
      if (!isHome) navigate('/');
    },
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHoldHandlers } = centerPress;

  const goTo = (to: string) => {
    navigate(to);
  };

  const panelStyle = resolveHeaderPanelStyle();

  return (
    <div className="dock-hub-band" data-panel-style={panelStyle}>
      <div className="dock-hub-band__rail">
        <DockSideNav link={sides.left} />
        {leftRail.map((slot, index) =>
          slot ? (
            <ContextSlotButton key={slot.id} slot={slot} onGo={goTo} />
          ) : (
            <span key={`dock-pad-left-${index}`} className="dock-hub-band__pad" aria-hidden />
          ),
        )}

        <button
          type="button"
          className={clsx(
            'dock-hub-band__center',
            isHome && 'dock-hub-band__center--active',
            isHolding && 'dock-hub-band__center--holding',
          )}
          aria-label="Hem. Håll tre sekunder för Valv."
          style={
            progress > 0
              ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
              : undefined
          }
          {...centerHoldHandlers}
        >
          <span className="dock-hub-band__center-glow" aria-hidden />
          <span className="dock-hub-band__plate">
            <LivskompassMark className="dock-hub-band__mark" />
          </span>
        </button>

        {rightRail.map((slot, index) =>
          slot ? (
            <ContextSlotButton key={slot.id} slot={slot} onGo={goTo} />
          ) : (
            <span key={`dock-pad-right-${index}`} className="dock-hub-band__pad" aria-hidden />
          ),
        )}
        <DockSideNav link={sides.right} />
      </div>
    </div>
  );
}
</file>

<file path="src/modules/core/layout/MainLayout.tsx">
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { FloatingDock } from './FloatingDock';
import { FyrenWidgetBar } from '../components/FyrenWidgetBar';
import { FyrenSmartWidgetBar } from '../components/FyrenSmartWidgetBar';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../evidence/kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { FirestoreNetworkChip } from '../components/FirestoreNetworkChip';
import { useStore } from '../store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isScenicHome = location.pathname === '/';
  const user = useStore((s) => s.user);
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => {
    if (!user) setDrawerOpen(false);
  }, [user]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openAccount = useCallback(() => setAccountOpen(true), []);
  const openKompisHub = useCallback(() => {
    navigate('/kompis');
  }, [navigate]);

  return (
    <div className="app-shell relative min-h-screen text-text font-sans selection:bg-accent/30">
      <AmbientBackground />

      <header className="app-header">
        <div className="app-header__inner">
          <AppHeaderBar
            menuExpanded={drawerOpen}
            onMenuClick={() => setDrawerOpen(true)}
            actions={
              <>
                <AccountAuthMenu
                  open={accountOpen}
                  onOpenChange={setAccountOpen}
                  compactTrigger
                />
                <button
                  type="button"
                  onClick={openKompisHub}
                  className="header-chrome-btn header-chrome-btn--round shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Öppna Kompis — välj väg"
                  title="Kompis"
                >
                  <KompisAvatar
                    size="sm"
                    chromeEmbed
                    state={kompisAuraActive ? 'analyzing' : 'idle'}
                    className="kompis-avatar--header-chrome shrink-0"
                  />
                </button>
              </>
            }
          />
        </div>
      </header>

      <NavigationDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onOpenSettings={openAccount}
      />

      <FirestoreNetworkChip />

      <main
        className={clsx(
          'app-main relative z-10 mx-auto max-w-2xl px-4',
          isScenicHome ? 'pt-[4.65rem]' : 'pt-[5.75rem]',
        )}
      >
        {children}
      </main>

      <FyrenSmartWidgetBar />
      <FyrenWidgetBar />
      <FloatingDock />
    </div>
  );
}
</file>

<file path="src/modules/core/navigation/navTruth.ts">
/**
 * Single source for hub labels, paths, drawer sections, and chrome flags.
 * Drawer-ikoner: `drawerNav.ts` (v4 chrome `createChromeV4Icon` + Lucide där glyph saknas).
 */
import { HIDE_BEVIS_TAB } from './navFlags';
import {
  FORENSIC_VAULT_TAB_IDS,
  forensicVaultTabLabel,
  MAIN_VAULT_TAB_IDS,
} from '../../evidence/vault/utils/vaultTabs';

export type NavDrawerSection = 'vardag' | 'valv';

export type NavTruthEntry = {
  id: string;
  label: string;
  path: string;
  section: NavDrawerSection;
  inDrawer: boolean;
  requiresVaultPin?: boolean;
  /** Sub-rad under hub eller Valv-grupp */
  parentId?: string;
  /** Valv: expanderbar grupp utan egen navigation */
  isGroupHeader?: boolean;
  /** Kort hjälptext under grupp-rubrik i Valv-drawer */
  drawerHint?: string;
  /** Dölj i drawer när G18 döljer publik Bevis-flik */
  omitWhenHideBevis?: boolean;
  inDock?: boolean;
  fyrenHomeQuick?: boolean;
  /** Theme Pack J id when auto-module theme is on */
  themeId?: string;
};

/** Deep-link till Valv-baksida (PIN i VaultPage). */
export function vaultDrawerPath(vaultTab: string): string {
  return `/dagbok?tab=bevis&vaultTab=${vaultTab}`;
}

const VAULT_MAIN_LABELS: Record<(typeof MAIN_VAULT_TAB_IDS)[number], string> = {
  logga: 'Arkiv',
  sok: 'Triage',
  monster: 'Mönster',
  orkester: 'Orkester',
  dossier: 'Dossier',
  kunskapsbank: 'Kunskapsbank',
  aktorskarta: 'Aktörskarta',
};

function valvLeaf(
  id: string,
  vaultTab: string,
  parentId: string,
  label?: string,
): NavTruthEntry {
  return {
    id,
    label: label ?? VAULT_MAIN_LABELS[vaultTab as keyof typeof VAULT_MAIN_LABELS] ?? vaultTab,
    path: vaultDrawerPath(vaultTab),
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    parentId,
  };
}

export const NAV_TRUTH: NavTruthEntry[] = [
  // —— Vardag —— (hub-ordning: Dagbok → Vardagen → MåBra → Familjen → verktyg → Hamn → Projekt → Drogfrihet → Inställningar)
  { id: 'hem', label: 'Hem Kompass', path: '/', section: 'vardag', inDrawer: true, themeId: 'J-fyren-hem' },
  {
    id: 'hem_inkast',
    label: 'Inkast',
    path: '/#inkast-lite',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hem',
  },
  {
    id: 'dagbok',
    label: 'Dagbok',
    path: '/dagbok',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-valv-pansar',
  },
  {
    id: 'dagbok_reflektion',
    label: 'Reflektion',
    path: '/dagbok?tab=reflektion',
    section: 'vardag',
    inDrawer: true,
    parentId: 'dagbok',
  },
  {
    id: 'dagbok_speglar',
    label: 'Speglar',
    path: '/dagbok?tab=speglar',
    section: 'vardag',
    inDrawer: true,
    parentId: 'dagbok',
  },
  {
    id: 'dagbok_bevis',
    label: 'Bevis (Valv)',
    path: vaultDrawerPath('logga'),
    section: 'vardag',
    inDrawer: true,
    parentId: 'dagbok',
    requiresVaultPin: true,
    omitWhenHideBevis: true,
  },
  {
    id: 'vardagen',
    label: 'Vardagen',
    path: '/vardagen',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-vardagen-orbit',
  },
  {
    id: 'vardagen_kompasser',
    label: 'Kompasser',
    path: '/vardagen?tab=kompasser',
    section: 'vardag',
    inDrawer: true,
    parentId: 'vardagen',
  },
  {
    id: 'vardagen_ekonomi',
    label: 'Ekonomi',
    path: '/vardagen?tab=ekonomi',
    section: 'vardag',
    inDrawer: true,
    parentId: 'vardagen',
  },
  {
    id: 'mabra',
    label: 'MåBra',
    path: '/mabra',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-mabra-lavendel',
  },
  {
    id: 'familjen',
    label: 'Familjen',
    path: '/familjen',
    section: 'vardag',
    inDrawer: true,
    inDock: true,
    themeId: 'J-familjen-varm',
  },
  {
    id: 'familjen_reflektion',
    label: 'Reflektion',
    path: '/familjen?tab=reflektion',
    section: 'vardag',
    inDrawer: true,
    parentId: 'familjen',
  },
  {
    id: 'familjen_livslogg',
    label: 'Livslogg',
    path: '/familjen?tab=livslogg',
    section: 'vardag',
    inDrawer: true,
    parentId: 'familjen',
  },
  {
    id: 'familjen_tillsammans',
    label: 'Tillsammans',
    path: '/familjen?tab=tillsammans',
    section: 'vardag',
    inDrawer: true,
    parentId: 'familjen',
  },
  {
    id: 'familjen_barnporten',
    label: 'Barnporten',
    path: '/familjen?tab=barnporten',
    section: 'vardag',
    inDrawer: true,
    parentId: 'familjen',
  },
  {
    id: 'planering',
    label: 'Planering',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-planering-fyren',
  },
  {
    id: 'planering_handling',
    label: 'Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: true,
    parentId: 'planering',
  },
  {
    id: 'planering_fokus',
    label: 'Fokus',
    path: '/planering?tab=fokus',
    section: 'vardag',
    inDrawer: true,
    parentId: 'planering',
  },
  {
    id: 'planering_inkorg',
    label: 'Inkorg',
    path: '/planering?tab=inkorg',
    section: 'vardag',
    inDrawer: true,
    parentId: 'planering',
  },
  {
    id: 'arbetsliv',
    label: 'Arbetsliv',
    path: '/arbetsliv',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-vardagen-orbit',
  },
  {
    id: 'arbetsliv_stampla',
    label: 'Stämpel',
    path: '/arbetsliv?tab=stampla',
    section: 'vardag',
    inDrawer: true,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_tid',
    label: 'Tid & flex',
    path: '/arbetsliv?tab=tid',
    section: 'vardag',
    inDrawer: true,
    parentId: 'arbetsliv',
  },
  {
    id: 'arbetsliv_logg',
    label: 'Logg',
    path: '/arbetsliv?tab=logg',
    section: 'vardag',
    inDrawer: true,
    parentId: 'arbetsliv',
  },
  {
    id: 'hamn',
    label: 'Trygg hamn',
    path: '/hamn',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-hamn-greyrock',
  },
  {
    id: 'hamn_oversikt',
    label: 'Översikt',
    path: '/hamn?tab=oversikt',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'hamn_biff',
    label: 'BIFF',
    path: '/hamn?tab=biff',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'hamn_speglar',
    label: 'Speglar',
    path: '/hamn?tab=speglar',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'hamn_barn',
    label: 'Barnfokus',
    path: '/hamn?tab=barn',
    section: 'vardag',
    inDrawer: true,
    parentId: 'hamn',
  },
  {
    id: 'projekt',
    label: 'Projekt',
    path: '/projekt',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-planering-fyren',
  },
  {
    id: 'projekt_ny',
    label: 'Nytt projekt',
    path: '/admin/projects/ny',
    section: 'vardag',
    inDrawer: true,
    parentId: 'projekt',
  },
  {
    id: 'projekt_handling',
    label: 'Till Handling',
    path: '/planering?tab=handling',
    section: 'vardag',
    inDrawer: true,
    parentId: 'projekt',
  },
  {
    id: 'drogfrihet',
    label: 'Drogfrihet',
    path: '/drogfrihet',
    section: 'vardag',
    inDrawer: true,
    themeId: 'J-mabra-lavendel',
  },
  {
    id: 'drogfrihet_idag',
    label: 'Idag',
    path: '/drogfrihet?tab=idag',
    section: 'vardag',
    inDrawer: true,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_resurser',
    label: 'Stöd',
    path: '/drogfrihet?tab=resurser',
    section: 'vardag',
    inDrawer: true,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_reflektion',
    label: 'Reflektion',
    path: '/drogfrihet?tab=reflektion',
    section: 'vardag',
    inDrawer: true,
    parentId: 'drogfrihet',
  },
  {
    id: 'drogfrihet_kunskap',
    label: 'Stöd & resurser',
    path: '/drogfrihet?tab=kunskap',
    section: 'vardag',
    inDrawer: true,
    parentId: 'drogfrihet',
  },
  {
    id: 'installningar',
    label: 'Inställningar',
    path: '/installningar',
    section: 'vardag',
    inDrawer: true,
  },
  {
    id: 'installningar_allmant',
    label: 'Allmänt',
    path: '/installningar?tab=allmant',
    section: 'vardag',
    inDrawer: true,
    parentId: 'installningar',
  },
  {
    id: 'installningar_drogfrihet',
    label: 'Drogfrihet',
    path: '/installningar?tab=drogfrihet',
    section: 'vardag',
    inDrawer: true,
    parentId: 'installningar',
  },

  // —— Valv (PIN) — grupperade accordion ——
  {
    id: 'valv_grp_samla',
    label: 'Samla',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
    themeId: 'J-valv-pansar',
    drawerHint: 'Bevis, sms och triage — sparas i Valv.',
  },
  valvLeaf('valv_arkiv', 'logga', 'valv_grp_samla'),
  valvLeaf('valv_triage', 'sok', 'valv_grp_samla'),
  {
    id: 'valv_grp_analysera',
    label: 'Analysera',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: 'Mönster och Orkester — låst UX, ej borttag.',
  },
  valvLeaf('valv_monster', 'monster', 'valv_grp_analysera'),
  valvLeaf('valv_orkester', 'orkester', 'valv_grp_analysera'),
  {
    id: 'valv_grp_exportera',
    label: 'Exportera',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: 'Dossier — explicit export, ingen auto-delning.',
  },
  valvLeaf('valv_dossier', 'dossier', 'valv_grp_exportera'),
  {
    id: 'valv_dossier_export',
    label: 'Dossier · full vy',
    path: '/dossier',
    section: 'valv',
    inDrawer: true,
    requiresVaultPin: true,
    parentId: 'valv_grp_exportera',
  },
  {
    id: 'valv_grp_kunskap',
    label: 'Kunskapsbank',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: 'RAG-fakta och aktörskarta — PIN, ej publik /vardagen.',
  },
  valvLeaf('valv_kunskapsbank', 'kunskapsbank', 'valv_grp_kunskap', 'Chat & Tidshjul'),
  valvLeaf('valv_aktorskarta', 'aktorskarta', 'valv_grp_kunskap', 'Nyckelpersoner (G9)'),
  {
    id: 'valv_grp_forensik',
    label: 'Forensik',
    path: '',
    section: 'valv',
    inDrawer: true,
    isGroupHeader: true,
    requiresVaultPin: true,
    drawerHint: 'Djup analys och bevis. Grey Rock på /hamn utan PIN.',
  },
  ...FORENSIC_VAULT_TAB_IDS.map((tab) => ({
    id: `valv_${tab}`,
    label: forensicVaultTabLabel(tab),
    path: vaultDrawerPath(tab),
    section: 'valv' as const,
    inDrawer: true,
    requiresVaultPin: true,
    parentId: 'valv_grp_forensik',
  })),
];

export const DRAWER_NAV_TRUTH = NAV_TRUTH.filter((e) => e.inDrawer);

export function isDrawerEntryVisible(entry: NavTruthEntry): boolean {
  if (entry.omitWhenHideBevis && HIDE_BEVIS_TAB) return false;
  return true;
}

export function getVisibleDrawerTruth(section: NavDrawerSection): NavTruthEntry[] {
  return DRAWER_NAV_TRUTH.filter((e) => e.section === section && isDrawerEntryVisible(e));
}

export const DRAWER_VARDAG_ENTRIES = getVisibleDrawerTruth('vardag');

export const DRAWER_VALV_ENTRIES = getVisibleDrawerTruth('valv');

/** Hub-rader utan parentId (legacy drawerNav). */
export const DRAWER_HUB_TRUTH = DRAWER_NAV_TRUTH.filter((e) => !e.parentId && isDrawerEntryVisible(e));

export function getNavTruthById(id: string): NavTruthEntry | undefined {
  return NAV_TRUTH.find((e) => e.id === id);
}

export function getDrawerChildren(parentId: string, section: NavDrawerSection): NavTruthEntry[] {
  return getVisibleDrawerTruth(section).filter((e) => e.parentId === parentId);
}

/** Vardag: hubbar utan parent. Valv: grupp-rubriker. */
export function getDrawerRoots(section: NavDrawerSection): NavTruthEntry[] {
  const visible = getVisibleDrawerTruth(section);
  if (section === 'valv') return visible.filter((e) => e.isGroupHeader);
  return visible.filter((e) => !e.parentId);
}

export function drawerHubHasChildren(hubId: string, section: NavDrawerSection): boolean {
  return getDrawerChildren(hubId, section).length > 0;
}
</file>

</files>
