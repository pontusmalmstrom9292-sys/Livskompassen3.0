import { useCallback, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { LivskompassMark } from '../ui/LivskompassMark';
import { ChromeV5Icon } from '../ui/chromeIcons';
import { getHeroVisualVariant } from '../theme/chromeIconPrefs';
import { getCompassThemeByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTheme';
import {
  COMPASS_CARDINALS,
  HERO_ORBIT_SLOTS,
  orbitRadiusPercent,
} from './livskompassHeroConfig';
import { useKognitivSkoldVariant } from './useKognitivSkoldVariant';

type Props = {
  onCenterPress?: () => void;
  /** Kompakt avlång hub (standard). `compass` = full sköld med orbit. */
  variant?: 'compact' | 'compass';
  /** Ingen kapsel-ruta — orbit som tillägg i hemkompass-stacken. */
  embedded?: boolean;
};

export function LivskompassHero({ onCenterPress, variant = 'compact', embedded = false }: Props) {
  const navigate = useNavigate();
  const theme = getCompassThemeByTime();
  const { variantId, tokens } = useKognitivSkoldVariant();
  const [openOrbitId, setOpenOrbitId] = useState<string | null>(null);
  const heroVisual = getHeroVisualVariant();

  const skoldStyle = {
    '--k-shield-rim': tokens.rim,
    '--k-shield-gold': tokens.gold,
    '--k-shield-glow': tokens.glow,
    '--k-shield-fill': tokens.shield,
    '--k-panel-top': tokens.panelTop,
    '--k-panel-bottom': tokens.panelBottom,
  } as CSSProperties;

  const closeMenus = useCallback(() => setOpenOrbitId(null), []);

  const toggleOrbit = (id: string) => {
    setOpenOrbitId((prev) => (prev === id ? null : id));
  };

  const goOrbit = (to: string) => {
    navigate(to);
    closeMenus();
  };

  const heroVisualModifier =
    heroVisual === 'orbit-h1-alpha'
      ? 'livskompass-hero--h1-alpha'
      : heroVisual === 'orbit-h1-full'
        ? 'livskompass-hero--h1-full'
        : undefined;

  if (variant === 'compact') {
    const compactInner = (
      <button
        type="button"
        className="livskompass-hero__compact-bar"
        aria-label="Checka in — Kognitiv sköld"
        onClick={() => onCenterPress?.()}
      >
        <span className="livskompass-hero__compact-mark" aria-hidden>
          <LivskompassMark className="livskompass-hero__compact-mark-icon" />
        </span>
        <span className="livskompass-hero__compact-copy">
          <span className="livskompass-hero__compact-title">Kognitiv sköld</span>
          <span className="livskompass-hero__compact-lead">Check-in · dagens kompass</span>
        </span>
        <ChevronRight className="livskompass-hero__compact-chevron" strokeWidth={2} aria-hidden />
      </button>
    );

    return (
      <section
        className={clsx(
          'livskompass-hero livskompass-hero--compact',
          embedded && 'livskompass-hero--embedded',
          `livskompass-hero--${theme}`,
        )}
        data-k-skold={variantId}
        style={skoldStyle}
        aria-label={`Livskompassen — Kognitiv sköld (${tokens.title})`}
      >
        {embedded ? compactInner : <div className="livskompass-hero__panel">{compactInner}</div>}
      </section>
    );
  }

  const compassInner = (
    <>
      <p className="livskompass-hero__shield-label">Kognitiv sköld</p>

      <div
        className="livskompass-hero__stage"
        onClick={closeMenus}
        onKeyDown={(e) => e.key === 'Escape' && closeMenus()}
        role="presentation"
      >
        <div className="livskompass-hero__face">
          <div className="livskompass-hero__ring livskompass-hero__ring--outer" aria-hidden />
          <div className="livskompass-hero__ring livskompass-hero__ring--mid" aria-hidden />

          <div className="livskompass-hero__cardinals" aria-hidden>
            {COMPASS_CARDINALS.map(({ id, label, angle }) => (
              <span
                key={id}
                className="livskompass-hero__cardinal"
                style={
                  {
                    '--cardinal-angle': `${angle}deg`,
                  } as CSSProperties
                }
              >
                {label}
              </span>
            ))}
          </div>

          <div className="livskompass-hero__disk">
            <div className="livskompass-hero__disk-surface" aria-hidden />
            <div className="livskompass-hero__disk-rose" aria-hidden />
            <div className="livskompass-hero__disk-orbit-ring" aria-hidden />

            {HERO_ORBIT_SLOTS.map(({ id, icon, label, shortLabel, blurb, to, angle, ring }) => {
              const open = openOrbitId === id;
              const radius = orbitRadiusPercent(ring);
              return (
                <div
                  key={id}
                  className={clsx(
                    'livskompass-hero__orbit-wrap',
                    ring === 'intercardinal' && 'livskompass-hero__orbit-wrap--inter',
                    open && 'livskompass-hero__orbit-wrap--open',
                  )}
                  style={
                    {
                      '--orbit-angle': `${angle}deg`,
                      '--orbit-radius': `${radius}%`,
                    } as CSSProperties
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className={clsx(
                      'livskompass-hero__orbit-node',
                      open && 'livskompass-hero__orbit-node--open',
                    )}
                    aria-label={label}
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => toggleOrbit(id)}
                  >
                    <span className="livskompass-hero__orbit-node-ring" aria-hidden />
                    <ChromeV5Icon category={icon} className="livskompass-hero__orbit-icon" />
                  </button>

                  <div
                    className={clsx(
                      'livskompass-hero__orbit-menu',
                      open && 'livskompass-hero__orbit-menu--visible',
                    )}
                    role="menu"
                    hidden={!open}
                  >
                    <p className="livskompass-hero__orbit-menu-label">{shortLabel}</p>
                    <p className="livskompass-hero__orbit-menu-blurb">{blurb}</p>
                    <button
                      type="button"
                      className="livskompass-hero__orbit-menu-go"
                      role="menuitem"
                      onClick={() => goOrbit(to)}
                    >
                      Öppna
                      <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="livskompass-hero__center"
              aria-label="Checka in — dagens kompass"
              onClick={(e) => {
                e.stopPropagation();
                closeMenus();
                onCenterPress?.();
              }}
            >
              <span className="livskompass-hero__center-halo" aria-hidden />
              <span className="livskompass-hero__center-gem" aria-hidden />
              <LivskompassMark className="livskompass-hero__mark" />
            </button>
          </div>
        </div>

        <p className="livskompass-hero__hint">Tryck en symbol · mitten = check-in</p>
      </div>
    </>
  );

  return (
    <section
      className={clsx(
        'livskompass-hero livskompass-hero--v2',
        embedded && 'livskompass-hero--embedded',
        heroVisualModifier,
        `livskompass-hero--${theme}`,
      )}
      data-k-skold={variantId}
      style={skoldStyle}
      aria-label={`Livskompassen — Kognitiv sköld (${tokens.title})`}
    >
      {embedded ? (
        compassInner
      ) : (
        <div
          className={clsx('livskompass-hero__panel', heroVisualModifier)}
        >
          {compassInner}
        </div>
      )}
    </section>
  );
}
