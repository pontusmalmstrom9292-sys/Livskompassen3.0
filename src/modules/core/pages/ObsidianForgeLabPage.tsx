import { useCallback, useState } from 'react';
import { ButtonLink } from '@/design-system';
import { Compass, LifeBuoy, Shield, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { DrawerL2Icon } from '../ui/drawerL2Icons/DrawerL2Icon';
import '@/styles/obsidian-forge-lab.css';
import {
  OdForgeBentoGrid,
  OdForgeDockChrome,
  OdForgeDrawerOverlay,
  OdForgeHeader,
  OdForgeKompassSuperHub,
  type OdForgeSuperMode,
  OdForgeQuickScroll,
  OdForgeSection,
  type OdForgeBentoItem,
  type OdForgeChip,
  type OdForgeDockItem,
} from '../ui/forge';

type BentoId = 'vardagen' | 'familjen' | 'hjartat' | 'handling';
type DockId = BentoId;
type ChipId = 'inkast' | 'planering' | 'projekt' | 'hamn';

const BENTO_ITEMS: OdForgeBentoItem[] = [
  { id: 'vardagen', label: 'Liv och göra', icon: <DrawerL2Icon hubId="vardagen" className="h-6 w-6" /> },
  { id: 'familjen', label: 'Familjen', icon: <DrawerL2Icon hubId="familjen" className="h-6 w-6" /> },
  { id: 'hjartat', label: 'Dagbok', icon: <DrawerL2Icon hubId="dagbok" className="h-6 w-6" /> },
  { id: 'handling', label: 'Handling', icon: <DrawerL2Icon hubId="planering" className="h-6 w-6" /> },
];

const CHIPS: OdForgeChip[] = [
  { id: 'inkast', label: 'Inkast' },
  { id: 'planering', label: 'Planering' },
  { id: 'projekt', label: 'Projekt' },
  { id: 'hamn', label: 'Trygg hamn' },
];

const DOCK_ITEMS: OdForgeDockItem[] = BENTO_ITEMS.map((item) => ({
  id: item.id,
  label: item.label.split(' ')[0] ?? item.label,
  icon: item.icon,
}));

const DRAWER_VARDAG = [
  { id: 'hem', label: 'Hem', icon: <DrawerL2Icon hubId="hem" className="h-4 w-4" /> },
  { id: 'vardagen', label: 'Liv och göra', icon: <DrawerL2Icon hubId="vardagen" className="h-4 w-4" /> },
  { id: 'familjen', label: 'Familjen', icon: <DrawerL2Icon hubId="familjen" className="h-4 w-4" /> },
  { id: 'hjartat', label: 'Hjärtat', icon: <DrawerL2Icon hubId="dagbok" className="h-4 w-4" /> },
  { id: 'sos', label: 'SOS-läge', icon: <LifeBuoy className="h-4 w-4" strokeWidth={1.5} /> },
  { id: 'konto', label: 'Konto', icon: <Shield className="h-4 w-4" strokeWidth={1.5} /> },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

function getTagline(): string {
  const h = new Date().getHours();
  if (h >= 17 || h < 5) return 'Kväll — landa mjukt. Inget måste vara klart.';
  if (h >= 12) return 'Ett mikrosteg i taget.';
  return 'Sätt ditt ankare för dagen.';
}

function getStepHint(bentoId: BentoId): string {
  if (bentoId === 'vardagen') return 'Dagens fokus: ett väntande steg i planering.';
  if (bentoId === 'familjen') return 'Barnfokus eller BIFF — välj när du är redo.';
  if (bentoId === 'hjartat') return 'Reflektion eller Speglar — utan prestation.';
  return 'Handling: P3 Kanban — todo, väntar, klart.';
}

export function ObsidianForgeLabPage() {
  const user = useStore((s) => s.user);
  const [activeBento, setActiveBento] = useState<BentoId>('vardagen');
  const [activeDock, setActiveDock] = useState<DockId>('vardagen');
  const [activeChip, setActiveChip] = useState<ChipId | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRow, setDrawerRow] = useState('hem');
  const [ctaPressed, setCtaPressed] = useState(false);
  const [superMode, setSuperMode] = useState<OdForgeSuperMode>('kompass');
  const [status, setStatus] = useState('Tryck på kort, chip, meny, widget eller dock.');

  const handleBento = useCallback((id: string) => {
    const zone = id as BentoId;
    setActiveBento(zone);
    setActiveDock(zone);
    setStatus(`Zon: ${BENTO_ITEMS.find((b) => b.id === zone)?.label ?? zone}`);
  }, []);

  const handleDock = useCallback((id: string) => {
    handleBento(id);
  }, [handleBento]);

  const handleChip = useCallback((id: string) => {
    setActiveChip(id as ChipId);
    setStatus(`Snabbval: ${CHIPS.find((c) => c.id === id)?.label ?? id}`);
  }, []);

  const handleCtaDown = useCallback(() => setCtaPressed(true), []);
  const handleCtaUp = useCallback(() => {
    setCtaPressed(false);
    setStatus('Fortsätt kompassen — mock CTA (ett steg i taget).');
  }, []);

  return (
    <div className="od-forge-lab">
      <header className="od-forge-lab__intro">
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent/80 font-display-serif">
          Utvärdering · 2026-06-14
        </p>
        <h1 className="od-forge-lab__title">Obsidian Forge</h1>
        <p className="od-forge-lab__hint">
          Syntes av fem referensmockups — grafit + guld, hero + bento + chrome. Ej prod-default.
          Godkänn i Theme Lab innan wire till{' '}
          <code className="text-accent">OD-obsidian-depth</code>.
        </p>
        <div className="od-forge-lab__links">
          <ButtonLink to="/dev/theme-lab" variant="ghost" size="sm" className="text-xs">
            Theme Lab
          </ButtonLink>
          <ButtonLink to="/dev/obsidian-depth" variant="ghost" size="sm" className="text-xs">
            Obsidian Depth (låst)
          </ButtonLink>
          <ButtonLink to="/" variant="ghost" size="sm" className="text-xs">
            Hem (prod)
          </ButtonLink>
        </div>
      </header>

      <div className="od-forge">
        <div className="od-forge__phone" role="presentation">
          <OdForgeDrawerOverlay
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sections={[
              {
                title: 'Vardag',
                icon: <Compass className="h-3 w-3" strokeWidth={1.5} />,
                rows: DRAWER_VARDAG,
              },
            ]}
            activeRowId={drawerRow}
            onRowSelect={setDrawerRow}
          />

          <div className="od-forge__scroll">
            <OdForgeHeader
              pageTitle="DEN TRYGGA HAMNEN"
              drawerOpen={drawerOpen}
              onMenuClick={() => setDrawerOpen((v) => !v)}
            />

            <OdForgeKompassSuperHub
              greeting={getGreeting()}
              name="Pontus"
              tagline={getTagline()}
              profileLabel="Förälder — trygg hamn"
              presenceDays={7}
              stepHint={getStepHint(activeBento)}
              ctaLabel="Fortsätt kompassen"
              ctaPressed={ctaPressed}
              userId={user?.uid}
              onCtaPointerDown={handleCtaDown}
              onCtaPointerUp={handleCtaUp}
              onModeChange={(mode) => {
                setSuperMode(mode);
                setStatus(`Kompassläge: ${mode}`);
              }}
              onWidgetSelect={(w) => setStatus(`Widget: ${w.label} → ${w.href}`)}
              onDiscoveryStatus={(msg) => setStatus(msg)}
            />

            <OdForgeBentoGrid items={BENTO_ITEMS} activeId={activeBento} onSelect={handleBento} />

            <OdForgeQuickScroll
              chips={CHIPS}
              activeId={activeChip}
              onSelect={handleChip}
            />

            <OdForgeSection
              title="Kompassråd"
              icon={<Sparkles className="h-3 w-3" strokeWidth={1.5} />}
            >
              <p className="od-forge__section-quote">Grey Rock före JADE.</p>
              <p className="od-forge__section-meta">
                Kväll — landa mjukt. Logistik svarar du på; känslomässiga beten ignoreras.
              </p>
              <div className="od-forge__section-tags">
                <span className="od-forge__section-tag">BIFF</span>
                <span className="od-forge__section-tag">Ingen JADE</span>
                <span className="od-forge__section-tag">Parallellt föräldraskap</span>
              </div>
            </OdForgeSection>

            <p className="od-forge__status" aria-live="polite">
              Läge: {superMode} · {status}
            </p>
          </div>

          <OdForgeDockChrome
            items={DOCK_ITEMS}
            activeId={activeDock}
            onSelect={handleDock}
            onFyrenClick={() => setStatus('Fyren — öppna snabbval eller håll 3s för Valv.')}
          />
        </div>
      </div>
    </div>
  );
}
