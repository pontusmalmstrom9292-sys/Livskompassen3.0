import { useCallback, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { LivskompassMark } from '../ui/LivskompassMark';
import { ChromeV4Icon } from '../ui/chromeIcons';
import { getCompassThemeByTime } from '../../wellbeing/compasses/utils/compassTheme';
import {
  COMPASS_CARDINALS,
  HERO_ORBIT_SLOTS,
  HERO_QUICK_PICKS,
  orbitRadiusPercent,
  type HeroQuickPick,
} from './livskompassHeroConfig';

type Props = {
  onCenterPress?: () => void;
};

export function LivskompassHero({ onCenterPress }: Props) {
  const navigate = useNavigate();
  const theme = getCompassThemeByTime();
  const [openOrbitId, setOpenOrbitId] = useState<string | null>(null);

  const closeMenus = useCallback(() => setOpenOrbitId(null), []);

  const toggleOrbit = (id: string) => {
    setOpenOrbitId((prev) => (prev === id ? null : id));
  };

  const goOrbit = (to: string) => {
    navigate(to);
    closeMenus();
  };

  const handleQuickPick = (pick: HeroQuickPick) => {
    closeMenus();
    if (pick.id === 'checkin') {
      onCenterPress?.();
      return;
    }
    navigate(pick.to);
  };

  return (
    <section
      className={clsx('livskompass-hero livskompass-hero--v2', `livskompass-hero--${theme}`)}
      aria-label="Livskompassen — Kognitiv sköld"
    >
      <div className="livskompass-hero__panel">
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
                      <span className="livskompass-hero__orbit-gem" aria-hidden />
                      <span className="livskompass-hero__orbit-node-ring" aria-hidden />
                      <ChromeV4Icon category={icon} className="livskompass-hero__orbit-icon" />
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
        </div>

        <p className="livskompass-hero__hint">Tryck en symbol · mitten = check-in</p>

        <div className="livskompass-hero__quick" role="group" aria-label="Snabbval">
          <p className="livskompass-hero__quick-label">Snabbval</p>
          <div className="livskompass-hero__quick-row">
            {HERO_QUICK_PICKS.map((pick) => (
              <button
                key={pick.id}
                type="button"
                className="livskompass-hero__quick-chip"
                onClick={() => handleQuickPick(pick)}
              >
                {pick.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
