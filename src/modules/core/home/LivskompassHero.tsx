import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { LivskompassMark } from '../ui/LivskompassMark';
import { HERO_ORBIT_ICONS } from '../ui/HeroOrbitIcons';
import { getCompassThemeByTime } from '../../wellbeing/compasses/utils/compassTheme';

type OrbitSlot = {
  id: keyof typeof HERO_ORBIT_ICONS;
  label: string;
  shortLabel: string;
  blurb: string;
  to: string;
  position: 'north' | 'east' | 'south' | 'west';
};

const ORBIT_SLOTS: OrbitSlot[] = [
  {
    id: 'rutiner',
    label: 'Rutiner och kompasser',
    shortLabel: 'Rutiner',
    blurb: 'Morgon · dag · kväll',
    to: '/vardagen?tab=kompasser',
    position: 'north',
  },
  {
    id: 'ekonomi',
    label: 'Ekonomi',
    shortLabel: 'Ekonomi',
    blurb: 'Veckopeng · matlåda',
    to: '/vardagen?tab=ekonomi',
    position: 'east',
  },
  {
    id: 'mabra',
    label: 'Personlig utveckling',
    shortLabel: 'Utveckling',
    blurb: 'Övningar · MåBra',
    to: '/mabra',
    position: 'south',
  },
  {
    id: 'kunskap',
    label: 'Kunskap',
    shortLabel: 'Kunskap',
    blurb: 'Kunskapsbank · bakom Valv-PIN',
    to: '/dagbok?tab=bevis&vaultTab=kunskapsbank',
    position: 'west',
  },
];

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
            <div className="livskompass-hero__ring livskompass-hero__ring--inner" aria-hidden />
            <div className="livskompass-hero__grid" aria-hidden />
            <div className="livskompass-hero__ticks" aria-hidden />

            <div className="livskompass-hero__disk">
              {ORBIT_SLOTS.map(({ id, label, shortLabel, blurb, to, position }) => {
                const open = openOrbitId === id;
                const Icon = HERO_ORBIT_ICONS[id];
                return (
                  <div
                    key={id}
                    className={clsx(
                      'livskompass-hero__orbit-wrap',
                      `livskompass-hero__orbit-wrap--${position}`,
                      open && 'livskompass-hero__orbit-wrap--open',
                    )}
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
                      <Icon className="livskompass-hero__orbit-icon" />
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
      </div>
    </section>
  );
}
