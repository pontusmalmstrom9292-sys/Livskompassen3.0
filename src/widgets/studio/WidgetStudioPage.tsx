/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import '../companion-widgets.css';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetGlass } from '../components/WidgetGlass';
import { WidgetHeader } from '../components/WidgetHeader';
import { WidgetSyncStatusChip } from '../components/WidgetSyncStatusChip';
import { CORE_PACK_DEFINITIONS } from '../pack/registerCorePack';
import { applyWidgetTheme, WidgetPalette, WidgetTouch } from '../core/WidgetTheme';
import { maxShortcutsForSize } from './guidedCustomization';
import {
  getWidgetStudioState,
  hydrateWidgetStudio,
  patchWidgetStudioConfig,
  resetStudioToCalmDefaults,
  setStudioSmartFlags,
  subscribeWidgetStudio,
} from './widgetStudioStore';
import {
  getBarnveckaPref,
  setBarnveckaPref,
} from '../smart/readCompanionSignals';
import { WidgetStudioModePanel } from './WidgetStudioModePanel';
import { WidgetStudioPreview } from './WidgetStudioPreview';
import type {
  StudioAccent,
  StudioAnimation,
  StudioMaterial,
  StudioShortcutId,
  WidgetStudioConfig,
  WidgetStudioState,
} from './widgetStudioTypes';
import { STUDIO_MODULES } from './widgetStudioTypes';
import type { WidgetSize } from '../core/WidgetFramework';

const SIZES: WidgetSize[] = ['xs', 'small', 'medium', 'large'];
const MATERIALS: { id: StudioMaterial; label: string }[] = [
  { id: 'sapphire', label: 'Mörkt safirglas' },
  { id: 'matte_metal', label: 'Matt metall' },
];
const ACCENTS: { id: StudioAccent; label: string }[] = [
  { id: 'gold', label: 'Guld' },
  { id: 'ethereal', label: 'Eterisk blå' },
  { id: 'muted', label: 'Dämpad' },
];
const ANIMS: { id: StudioAnimation; label: string }[] = [
  { id: 'breathe', label: 'Andas' },
  { id: 'slow_rotate', label: 'Långsam rotation' },
  { id: 'static', label: 'Statisk' },
];
const SHORTCUTS: { id: StudioShortcutId; label: string }[] = [
  { id: 'text', label: 'Text' },
  { id: 'voice', label: 'Röst' },
  { id: 'photo', label: 'Foto' },
  { id: 'link', label: 'Länk' },
  { id: 'video', label: 'Video' },
];

function Chip({
  active,
  label,
  onClick,
  onDoubleClick,
  dimmed,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  onDoubleClick?: () => void;
  dimmed?: boolean;
}) {
  return (
    <button
      type="button"
      className={['cw-pill', 'cw-studio-chip', active && 'cw-pill--active', 'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'].filter(Boolean).join(' ')}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={onDoubleClick ? 'Dubbelklicka för På/Av' : undefined}
      style={{
        minHeight: Math.max(44, Math.round(WidgetTouch.minDp * 0.72)),
        opacity: dimmed ? 0.45 : 1,
      }}
    >
      {label}
    </button>
  );
}

function Editor({
  config,
  title,
  onChange,
}: {
  config: WidgetStudioConfig;
  title: string;
  onChange: (patch: Partial<WidgetStudioConfig>) => void;
}) {
  const maxBtn = maxShortcutsForSize(config.size);

  return (
    <WidgetCard size="medium" themed={false} style={{ gap: '0.85rem' }}>
      <WidgetHeader
        title={title}
        subtitle={config.enabled ? 'Aktiv på ytan' : 'Vilande'}
        trailing={
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: WidgetPalette.mutedText, fontSize: 12 }}>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
            />
            På
          </label>
        }
      />

      <p className="cw-eyebrow">Hem</p>
      <div className="cw-pill-row">
        <Chip
          active={config.homePin}
          label={config.homePin ? 'Fäst på Hem' : 'Fäst på Hem · av'}
          onClick={() => onChange({ homePin: !config.homePin })}
        />
      </div>

      <p className="cw-eyebrow">Storlek</p>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--cw-muted, #94a3b8)', lineHeight: 1.4 }}>
        XS–Large i appen. På hemskärmen kan du alltid dra ihop widgeten till 1 plats — utan att tappa funktion.
      </p>
      <div className="cw-pill-row">
        {SIZES.map((s) => (
          <Chip key={s} active={config.size === s} label={s.toUpperCase()} onClick={() => onChange({ size: s })} />
        ))}
      </div>

      <p className="cw-eyebrow">Modul</p>
      <div className="cw-pill-row">
        {STUDIO_MODULES.map((m) => (
          <Chip
            key={m.id}
            active={config.moduleKey === m.id}
            label={m.label}
            onClick={() => onChange({ moduleKey: m.id })}
          />
        ))}
      </div>

      <p className="cw-eyebrow">Material</p>
      <div className="cw-pill-row">
        {MATERIALS.map((m) => (
          <Chip
            key={m.id}
            active={config.material === m.id}
            label={m.label}
            onClick={() => onChange({ material: m.id })}
          />
        ))}
      </div>

      <p className="cw-eyebrow">Accent (låst palett)</p>
      <div className="cw-pill-row">
        {ACCENTS.map((a) => (
          <Chip
            key={a.id}
            active={config.accent === a.id}
            label={a.label}
            onClick={() => onChange({ accent: a.id })}
          />
        ))}
      </div>

      <p className="cw-eyebrow">Vilande rörelse</p>
      <div className="cw-pill-row">
        {ANIMS.map((a) => (
          <Chip
            key={a.id}
            active={config.animation === a.id}
            label={a.label}
            onClick={() => onChange({ animation: a.id })}
          />
        ))}
      </div>

      <p className="cw-eyebrow">Information</p>
      <div className="cw-pill-row">
        {(
          [
            ['showEnergy', 'Energi'],
            ['showStress', 'Stress'],
            ['showCapacity', 'Kapacitet'],
            ['showSleep', 'Sömn'],
          ] as const
        ).map(([key, label]) => (
          <Chip
            key={key}
            active={config.info[key]}
            label={label}
            onClick={() => onChange({ info: { ...config.info, [key]: !config.info[key] } })}
          />
        ))}
      </div>

      <p className="cw-eyebrow">
        Genvägar (max {maxBtn} för {config.size} · Kap 4)
      </p>
      <div className="cw-pill-row">
        {SHORTCUTS.map((s) => {
          const on = config.shortcuts.includes(s.id);
          const atCap = !on && config.shortcuts.length >= maxBtn;
          return (
            <Chip
              key={s.id}
              active={on}
              dimmed={atCap}
              label={s.label}
              onClick={() => {
                if (atCap) return;
                const next = on
                  ? config.shortcuts.filter((x) => x !== s.id)
                  : [...config.shortcuts, s.id].slice(0, maxBtn);
                onChange({ shortcuts: next });
              }}
            />
          );
        })}
      </div>
    </WidgetCard>
  );
}

const labelStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.68rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: WidgetPalette.premiumGoldDim,
};

/**
 * Widget Studio — Inställningar → Widget Studio → Mina Widgets (bible 5.1).
 */
export function WidgetStudioPage() {
  const [state, setState] = useState<WidgetStudioState>(() => getWidgetStudioState());
  const [selected, setSelected] = useState<string>('quick_capture');
  const [savedFlash, setSavedFlash] = useState(false);
  const [barnvecka, setBarnvecka] = useState(() => getBarnveckaPref());

  useEffect(() => {
    applyWidgetTheme(document.getElementById('cw-studio-root'));
    void hydrateWidgetStudio().then(setState);
    return subscribeWidgetStudio(setState);
  }, []);

  const selectedConfig = state.widgets[selected];
  const titles = useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of CORE_PACK_DEFINITIONS) map[d.id] = d.title;
    return map;
  }, []);
  const enabledCount = useMemo(
    () => CORE_PACK_DEFINITIONS.filter((d) => state.widgets[d.id]?.enabled !== false).length,
    [state.widgets],
  );
  const pinCount = useMemo(
    () => CORE_PACK_DEFINITIONS.filter((d) => state.widgets[d.id]?.homePin).length,
    [state.widgets],
  );

  return (
    <div
      id="cw-studio-root"
      style={{
        minHeight: '100dvh',
        padding: '1.1rem 1rem 3rem',
        background: `radial-gradient(ellipse at top, #0b1220 0%, ${WidgetPalette.obsidian} 60%)`,
        color: WidgetPalette.textPrimary,
      }}
    >
      <p style={{ margin: 0, fontSize: '0.75rem' }}>
        <Link to="/installningar" className="cw-chrome-link">
          Inställningar
        </Link>
        <span style={{ color: WidgetPalette.premiumGoldDim }}> · </span>
        <span style={{ color: WidgetPalette.premiumGold }}>Widget Studio</span>
        <span style={{ color: WidgetPalette.premiumGoldDim }}> · Mina Widgets</span>
      </p>
      <h1 style={{ margin: '0.45rem 0 0.25rem', fontSize: '1.4rem' }}>Widget Studio</h1>
      <p style={{ margin: '0 0 0.55rem', color: WidgetPalette.mutedText, fontSize: '0.9rem' }}>
        Frihet inom trygga ramar — omöjligt att göra fel. På Hem: Dölj/Visa Companion när du vill
        lugn. {savedFlash ? 'Sparat lokalt.' : ''}
      </p>
      <p style={{ margin: '0 0 1rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
        <Link to="/" className="cw-chrome-link cw-chrome-link--gold">
          Öppna Hem
        </Link>
        <button
          type="button"
          className="cw-chrome-btn min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={() => {
            try {
              localStorage.setItem('cw_home_rail_collapsed', '0');
            } catch {
              /* ignore */
            }
            setSavedFlash(true);
            window.setTimeout(() => setSavedFlash(false), 1200);
          }}
        >
          Visa Companion på Hem
        </button>
      </p>

      <WidgetGlass style={{ padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <p style={{ ...labelStyle, marginBottom: 0 }}>Smarta lager</p>
          <WidgetSyncStatusChip />
        </div>
        <label style={toggleStyle}>
          <input
            type="checkbox"
            checked={state.smartTimeEnabled}
            onChange={(e) => void setStudioSmartFlags({ smartTimeEnabled: e.target.checked })}
          />
          Tidsstyrd kontext (morgon → natt)
        </label>
        <label style={toggleStyle}>
          <input
            type="checkbox"
            checked={state.smartAiEnabled}
            onChange={(e) => void setStudioSmartFlags({ smartAiEnabled: e.target.checked })}
          />
          Lugnt AI-stöd (stress / energi / barnvecka)
        </label>
        <label style={toggleStyle}>
          <input
            type="checkbox"
            checked={barnvecka}
            onChange={(e) => {
              const on = e.target.checked;
              setBarnvecka(on);
              setBarnveckaPref(on);
              setSavedFlash(true);
              window.setTimeout(() => setSavedFlash(false), 1200);
            }}
          />
          Barnvecka just nu
        </label>
      </WidgetGlass>

      <WidgetStudioModePanel smartAiEnabled={state.smartAiEnabled} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <p style={{ ...labelStyle, marginBottom: 0 }}>Mina Widgets</p>
        <p style={{ margin: 0, color: WidgetPalette.mutedText, fontSize: '0.78rem' }}>
          {enabledCount} av {CORE_PACK_DEFINITIONS.length} på Hem · {pinCount}/2 fästa ·
          dubbelklicka = På/Av
        </p>
      </div>
      <div className="cw-pill-row" style={{ marginBottom: '1rem' }}>
        {CORE_PACK_DEFINITIONS.map((d) => {
          const on = state.widgets[d.id]?.enabled !== false;
          const pinned = state.widgets[d.id]?.homePin === true;
          const base = on ? d.title : `${d.title} · av`;
          return (
            <Chip
              key={d.id}
              active={selected === d.id}
              dimmed={!on}
              label={pinned ? `${base} · ✦` : base}
              onClick={() => setSelected(d.id)}
              onDoubleClick={() => {
                void patchWidgetStudioConfig(d.id, { enabled: !on }).then(() => {
                  setSelected(d.id);
                  setSavedFlash(true);
                  window.setTimeout(() => setSavedFlash(false), 1200);
                });
              }}
            />
          );
        })}
      </div>

      {selectedConfig ? (
        <Editor
          title={titles[selected] ?? selected}
          config={selectedConfig}
          onChange={(patch) => {
            void patchWidgetStudioConfig(selected, patch).then(() => {
              setSavedFlash(true);
              window.setTimeout(() => setSavedFlash(false), 1200);
            });
          }}
        />
      ) : null}

      <WidgetGlass style={{ padding: '0.85rem 1rem', marginTop: '1rem' }}>
        <WidgetStudioPreview widgetId={selected} />
      </WidgetGlass>

      <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <WidgetButton
          variant="quiet"
          size="min"
          onClick={() => {
            void resetStudioToCalmDefaults().then((next) => {
              setState(next);
              setSavedFlash(true);
              window.setTimeout(() => setSavedFlash(false), 1200);
            });
          }}
        >
          Lugna defaults
        </WidgetButton>
        <WidgetButton variant="ghost" size="premium" onClick={() => { window.location.href = '/dev/companion-widgets'; }}>
          Öppna labb
        </WidgetButton>
        <WidgetButton variant="gold" size="premium" fullWidth onClick={() => { window.location.href = '/installningar'; }}>
          Tillbaka
        </WidgetButton>
      </div>
      <p className="cw-signature">Designad för lugn, fokus och trygghet</p>
    </div>
  );
}

const toggleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minHeight: WidgetTouch.minDp,
  color: WidgetPalette.mutedText,
  fontSize: '0.9rem',
};
