import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Calendar, Compass, Settings, Sparkles, Users } from 'lucide-react';
import { ValvArchIcon } from '../ui/ValvArchIcon';
import { LivskompassMark } from '../ui/LivskompassMark';
import { LivskompassBrandLockup } from '../ui/LivskompassBrandLockup';
import { ChromeV5Icon, type ChromeV5Category } from '../ui/chromeIcons';
import {
  getAppIconVariant,
  getChromeIconStyle,
  getHeroVisualVariant,
  setAppIconVariant,
  setChromeIconStyle,
  setHeroVisualVariant,
  type AppIconVariant,
  type ChromeIconStyle,
  type HeroVisualVariant,
} from '../theme/chromeIconPrefs';
import { applyTheme } from '../theme/applyTheme';
import { useTheme } from '../theme';
import { THEME_LAB_DRAFTS, THEME_LAB_DRAFT_IDS } from '../theme/themeLabVariants';
import { THEME_PACK_DESIGN } from '../theme/themePackDesign';
import { THEME_PACK_MOCKUP } from '../theme/themePackMockup';
import { DEFAULT_THEME_ID, THEME_BY_ID, THEME_REGISTRY } from '../theme/themeRegistry';
import { K_PACK_THEME_IDS, THEME_PACK_K } from '../theme/themePackK';
import { THEME_PACK_REDESIGN_A } from '../theme/themePackRedesignA';
import { THEME_PACK_OBSIDIAN_DEPTH } from '../theme/themePackObsidianDepth';
import { J_PACK_THEME_IDS } from '../theme/themeRegistry';
import type { ThemePack } from '../theme/types';

const MOCKUP_LINKS = [
  { label: 'I-stone expanded', href: '/design/themes/I-architect-vault/00-smart-widget-expanded.png' },
  { label: 'Sidomeny kanon', href: '/docs/design/references/MENU-DRAWER-KANON.png' },
  { label: 'Scenic bakgrund', href: '/design/home-hero-scenic.png' },
] as const;

function PreviewStrip({ pack }: { pack: ThemePack }) {
  const style = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(pack.cssVars).map(([k, v]) => [k, v]),
      ) as CSSProperties,
    [pack],
  );

  return (
    <div className="theme-lab-strip" style={style}>
      <div className="theme-lab-strip__dock">
        <span className="theme-lab-strip__dock-side">
          <Users className="h-3 w-3" strokeWidth={1.5} />
        </span>
        <span className="theme-lab-strip__dock-center">
          <LivskompassMark className="h-4 w-4" />
        </span>
        <span className="theme-lab-strip__dock-side">
          <ValvArchIcon className="h-3 w-3" />
        </span>
      </div>
      <div className="theme-lab-strip__row">
        <span className="theme-lab-strip__row-icon">
          <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
        <span className="theme-lab-strip__row-label">Hem Kompass</span>
      </div>
      <div className="theme-lab-strip__compass" aria-hidden>
        <span className="theme-lab-strip__compass-ring" />
        <LivskompassMark className="theme-lab-strip__compass-mark" />
      </div>
      {pack.background === 'texture-stone' ? (
        <div className="theme-lab-strip__scenic" aria-hidden />
      ) : null}
      <p className="theme-lab-strip__tokens text-[9px] text-text-dim">
        accent {pack.cssVars['--accent']} · glass {pack.cssVars['--glass']}
      </p>
    </div>
  );
}

const PROD_STONE = THEME_BY_ID[DEFAULT_THEME_ID];

function DraftTokenChips({ pack }: { pack: ThemePack }) {
  const keys = ['--accent', '--accent-glow', '--glass', '--border-strong'] as const;
  return (
    <ul className="mt-2 flex flex-wrap gap-1">
      {keys.map((key) => {
        const value = pack.cssVars[key];
        const prod = PROD_STONE.cssVars[key];
        const changed = value !== prod;
        return (
          <li
            key={key}
            className={`rounded px-1.5 py-0.5 text-[9px] ${
              changed
                ? 'border border-warning/40 bg-warning/10 text-warning'
                : 'border border-border/60 text-text-dim'
            }`}
            title={changed ? `prod: ${prod}` : 'oförändrad mot I-stone'}
          >
            {key.replace('--', '')}: {value}
          </li>
        );
      })}
    </ul>
  );
}

export function ThemeLabPage() {
  const { themeId, setTheme, setAutoMode } = useTheme();
  const [previewId, setPreviewId] = useState('I-stone');
  const previewPack =
    THEME_REGISTRY.find((t) => t.id === previewId) ??
    THEME_LAB_DRAFTS.find((t) => t.id === previewId) ??
    THEME_REGISTRY[0];

  const applyPreview = (id: string) => {
    setPreviewId(id);
    applyTheme(id);
  };

  return (
    <div className="module-list theme-lab-page">
      <header className="glass-card p-4">
        <h1 className="font-display text-xl font-light text-accent">Theme Lab</h1>
        <p className="mt-2 text-sm text-text-muted">
          <strong className="text-accent">Designpaket (5):</strong> header, dock, kort, meny och bakgrund
          byts samtidigt — välj D1–D5.
        </p>
        <p className="mt-1 text-xs text-text-dim">
          Jämför utkast, ikoner och detaljer. Prod-tema ändras först när du godkänner i{' '}
          <code className="text-accent">docs/design/theme-lab/VARIANTS.md</code>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/dev/themes" className="btn-pill--ghost">
            Enkel skin-väljare
          </Link>
          <Link to="/dev/obsidian-depth" className="btn-pill--accent text-xs">
            Obsidian Depth mockup
          </Link>
          <Link to="/dev/obsidian-forge" className="btn-pill--accent text-xs">
            Obsidian Forge (utvärdering)
          </Link>
          <Link to="/" className="btn-pill--ghost">
            Testa på Hem
          </Link>
          <button
            type="button"
            className="btn-pill--ghost"
            onClick={() => setAutoMode(false)}
          >
            Manuellt tema
          </button>
        </div>
      </header>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">Mockups</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-sm">
          {MOCKUP_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                {label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <ThemeLabPackSection
        title="Obsidian Depth — låst 3D (2026-06-14)"
        packs={THEME_PACK_OBSIDIAN_DEPTH}
        previewId={previewId}
        themeId={themeId}
        onPreview={applyPreview}
        onApply={(id) => {
          setTheme(id);
          setAutoMode(false);
          setPreviewId(id);
        }}
        extraLink={{
          label: 'Interaktiv mockup ↗',
          href: '/dev/obsidian-depth',
        }}
      />

      <ThemeLabPackSection
        title="Redesign (2026) — Style A Nordic Precision"
        packs={THEME_PACK_REDESIGN_A}
        previewId={previewId}
        themeId={themeId}
        onPreview={applyPreview}
        onApply={(id) => {
          setTheme(id);
          setAutoMode(false);
          setPreviewId(id);
        }}
        draft
        extraLink={{
          label: 'Mockups gallery ↗',
          href: '/docs/design/redesign-proposals/gallery/style-a/screens.html',
        }}
      />

      <ThemeLabPackSection
        title="Designpaket — 5 helapp (D1–D5)"
        packs={THEME_PACK_DESIGN}
        previewId={previewId}
        themeId={themeId}
        onPreview={applyPreview}
        onApply={(id) => {
          setTheme(id);
          setAutoMode(false);
          setPreviewId(id);
        }}
      />

      <ThemeLabPackSection
        title="Mockup tokens — 4 (äldre)"
        packs={THEME_PACK_MOCKUP}
        previewId={previewId}
        themeId={themeId}
        onPreview={applyPreview}
        onApply={(id) => {
          setTheme(id);
          setAutoMode(false);
          setPreviewId(id);
        }}
      />

      <ThemeLabPackSection
        title="Theme Pack K — nya (2026-05-28)"
        packs={THEME_PACK_K}
        previewId={previewId}
        themeId={themeId}
        onPreview={applyPreview}
        onApply={(id) => {
          setTheme(id);
          setPreviewId(id);
        }}
        draft
      />

      <ThemeLabPackSection
        title="Theme Pack J — hub auto"
        hubAuto
        packs={THEME_REGISTRY.filter((p) =>
          (J_PACK_THEME_IDS as readonly string[]).includes(p.id),
        )}
        previewId={previewId}
        themeId={themeId}
        onPreview={applyPreview}
        onApply={(id) => {
          setAutoMode(true);
          setPreviewId(id);
          applyTheme(id);
        }}
      />

      <ThemeLabPackSection
        title="Pack I / G (bas)"
        packs={THEME_REGISTRY.filter(
          (p) =>
            !(J_PACK_THEME_IDS as readonly string[]).includes(p.id) &&
            !(K_PACK_THEME_IDS as readonly string[]).includes(p.id),
        )}
        previewId={previewId}
        themeId={themeId}
        onPreview={applyPreview}
        onApply={(id) => {
          setTheme(id);
          setPreviewId(id);
        }}
      />

      <section className="glass-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-text-dim">
              Utkast I-stone ({THEME_LAB_DRAFT_IDS.length})
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              <code>themeLabVariants.ts</code> — gula chips = skillnad mot prod
            </p>
          </div>
          <button
            type="button"
            className="btn-pill--ghost text-xs"
            onClick={() => applyPreview(DEFAULT_THEME_ID)}
          >
            Jämför med prod
          </button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {THEME_LAB_DRAFTS.map((pack) => (
            <ThemeLabCard
              key={pack.id}
              pack={pack}
              draft
              active={previewId === pack.id}
              applied={themeId === pack.id}
              onPreview={() => applyPreview(pack.id)}
              onApply={() => {
                setTheme(pack.id);
                setPreviewId(pack.id);
              }}
              extra={<DraftTokenChips pack={pack} />}
            />
          ))}
        </div>
      </section>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">
          Live preview — {previewPack.label}
        </h2>
        <div className="mt-3">
          <PreviewStrip pack={previewPack} />
        </div>
      </section>

      <IconLabSection />

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">Ikoner (meny — Lucide ref)</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {[
            { label: 'Hem Kompass', Icon: Compass },
            { label: 'Familjen', Icon: Users },
            { label: 'Trygg hamn', Icon: Anchor },
            { label: 'Valv', Icon: ValvArchIcon },
            { label: 'Planering', Icon: Calendar },
            { label: 'MåBra', Icon: Sparkles },
            { label: 'Inställningar', Icon: Settings },
          ].map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-3 text-text-muted">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-accent">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </span>
              {label}
              <span className="text-xs text-text-dim">→ drawerNav.ts</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-text-dim">
          Fyll i beslut: docs/design/theme-lab/ICON-DECISIONS.md
        </p>
      </section>
    </div>
  );
}

const HUB_CATS: ChromeV5Category[] = [
  'familjen',
  'hamn',
  'hamnBiff',
  'valv',
  'dagbok',
  'planering',
  'mabra',
  'kompis',
  'projekt',
  'arbetsliv',
  'rutiner',
  'ekonomi',
  'utveckling',
  'kunskap',
];

function IconLabSection() {
  const [chromeStyle, setChromeStyleState] = useState<ChromeIconStyle>(getChromeIconStyle);
  const [appIcon, setAppIconState] = useState<AppIconVariant>(getAppIconVariant);
  const [heroVisual, setHeroVisualState] = useState<HeroVisualVariant>(getHeroVisualVariant);

  return (
    <section className="glass-card p-4">
      <h2 className="text-xs uppercase tracking-widest text-text-dim">Guldlogga &amp; ikoner v5</h2>
      <div className="mt-3 flex flex-wrap items-end gap-4">
        <LivskompassBrandLockup />
        <LivskompassMark className="h-12 w-12" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-text-muted">
          Hub-stil (G1–G5)
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
            value={chromeStyle}
            onChange={(e) => {
              const v = e.target.value as ChromeIconStyle;
              setChromeIconStyle(v);
              setChromeStyleState(v);
            }}
          >
            {(['g1', 'g2', 'g3', 'g4', 'g5'] as const).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-text-muted">
          Telefonikon
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
            value={appIcon}
            onChange={(e) => {
              const v = e.target.value as AppIconVariant;
              setAppIconVariant(v);
              setAppIconState(v);
            }}
          >
            <option value="p6">P6 guld stack</option>
            <option value="p7-alpha">P7 vault transparent</option>
            <option value="p8-alpha">P8 orbit transparent</option>
          </select>
        </label>
        <label className="text-xs text-text-muted">
          Hero-bakgrund
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
            value={heroVisual}
            onChange={(e) => {
              const v = e.target.value as HeroVisualVariant;
              setHeroVisualVariant(v);
              setHeroVisualState(v);
            }}
          >
            <option value="classic">Klassisk</option>
            <option value="orbit-h1-full">H1 full</option>
            <option value="orbit-h1-alpha">H1 alpha</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {HUB_CATS.map((cat) => (
          <span key={cat} className="flex flex-col items-center gap-1 rounded-lg border border-border/60 p-2">
            <ChromeV5Icon category={cat} style={chromeStyle} className="h-8 w-8" />
            <span className="text-[9px] text-text-dim">{cat}</span>
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          ['P6', '/docs/design/themes/phone-icon-variants/P6-gold-emboss-1024.png'],
          ['P7α', '/docs/design/themes/phone-icon-variants/P7-vault-sacred-alpha-1024.png'],
          ['P8α', '/docs/design/themes/phone-icon-variants/P8-orbit-hub-alpha-1024.png'],
        ].map(([label, src]) => (
          <img key={label} src={src} alt={label} className="h-16 w-16 rounded-2xl object-cover" />
        ))}
      </div>
    </section>
  );
}

function ThemeLabPackSection({
  title,
  packs,
  previewId,
  themeId,
  onPreview,
  onApply,
  draft,
  hubAuto,
  extraLink,
}: {
  title: string;
  packs: ThemePack[];
  previewId: string;
  themeId: string;
  onPreview: (id: string) => void;
  onApply: (id: string) => void;
  draft?: boolean;
  /** J-pack: apply enables auto per hub (not global manual override). */
  hubAuto?: boolean;
  extraLink?: { label: string; href: string };
}) {
  return (
    <section className="glass-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">{title}</h2>
        {extraLink ? (
          <a
            href={extraLink.href}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent hover:underline"
          >
            {extraLink.label}
          </a>
        ) : null}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {packs.map((pack) => (
          <ThemeLabCard
            key={pack.id}
            pack={pack}
            draft={draft}
            active={previewId === pack.id}
            applied={themeId === pack.id}
            onPreview={() => onPreview(pack.id)}
            onApply={() => onApply(pack.id)}
            applyLabel={hubAuto ? 'Aktivera hub-auto' : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function ThemeLabCard({
  pack,
  active,
  applied,
  draft,
  onPreview,
  onApply,
  applyLabel,
  extra,
}: {
  pack: ThemePack;
  active: boolean;
  applied: boolean;
  draft?: boolean;
  onPreview: () => void;
  onApply: () => void;
  applyLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <article
      className={`overflow-hidden rounded-xl border p-0 ${
        active ? 'border-accent ring-1 ring-accent' : 'border-[var(--border)]'
      }`}
    >
      {pack.preview ? (
        <img src={pack.preview} alt="" className="h-24 w-full object-cover object-top" />
      ) : null}
      <div className="p-3">
        {draft ? (
          <span className="text-[9px] uppercase tracking-widest text-warning">utkast</span>
        ) : null}
        <h3 className="font-display text-base text-accent">{pack.label}</h3>
        <p className="mt-1 text-xs text-text-muted">{pack.description}</p>
        {extra}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-pill--ghost text-xs" onClick={onPreview}>
            Förhandsgranska
          </button>
          <button type="button" className="btn-pill--accent text-xs" onClick={onApply}>
            {applied
              ? 'Aktiv i appen'
              : applyLabel ?? 'Använd i appen'}
          </button>
        </div>
      </div>
    </article>
  );
}
