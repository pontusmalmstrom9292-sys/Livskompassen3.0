import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckSquare, Coins, Sprout } from 'lucide-react';
import { clsx } from 'clsx';
import { LivskompassMark } from '../ui/LivskompassMark';
import { getCompassThemeByTime } from '../../kompasser/utils/compassTheme';

type OrbitIcon = {
  id: string;
  label: string;
  to: string;
  Icon: typeof CheckSquare;
  style: CSSProperties;
};

const ORBIT_ICONS: OrbitIcon[] = [
  {
    id: 'rutiner',
    label: 'Rutiner och kompasser',
    to: '/vardagen?tab=kompasser',
    Icon: CheckSquare,
    style: { top: '4%', left: '50%', transform: 'translate(-50%, 0)' },
  },
  {
    id: 'ekonomi',
    label: 'Ekonomi',
    to: '/ekonomi',
    Icon: Coins,
    style: { top: '50%', right: '2%', transform: 'translate(0, -50%)' },
  },
  {
    id: 'mabra',
    label: 'Personlig utveckling',
    to: '/mabra',
    Icon: Sprout,
    style: { bottom: '4%', left: '50%', transform: 'translate(-50%, 0)' },
  },
  {
    id: 'kunskap',
    label: 'Kunskap',
    to: '/kunskap',
    Icon: BookOpen,
    style: { top: '50%', left: '2%', transform: 'translate(0, -50%)' },
  },
];

type Props = {
  onCenterPress?: () => void;
};

export function LivskompassHero({ onCenterPress }: Props) {
  const navigate = useNavigate();
  const theme = getCompassThemeByTime();

  return (
    <section
      className={clsx('livskompass-hero', `livskompass-hero--${theme}`)}
      aria-label="Livskompassen"
    >
      <div className="livskompass-hero__stage">
        <div className="livskompass-hero__grid" aria-hidden />
        <div className="livskompass-hero__disk">
          {ORBIT_ICONS.map(({ id, label, to, Icon, style }) => (
            <button
              key={id}
              type="button"
              className="livskompass-hero__orbit-btn"
              style={style}
              aria-label={label}
              onClick={() => navigate(to)}
            >
              <Icon className="livskompass-hero__orbit-icon" strokeWidth={1.35} aria-hidden />
            </button>
          ))}

          <button
            type="button"
            className="livskompass-hero__center"
            aria-label="Checka in — dagens kompass"
            onClick={onCenterPress}
          >
            <LivskompassMark className="livskompass-hero__mark" />
          </button>
        </div>
      </div>

      <div className="livskompass-hero__pills" role="navigation" aria-label="Snabbnavigering">
        <button
          type="button"
          className="livskompass-hero__pill"
          onClick={() => navigate('/vardagen?tab=kompasser')}
        >
          rutiner
        </button>
        <button
          type="button"
          className="livskompass-hero__pill livskompass-hero__pill--icon"
          aria-label="Ekonomi"
          onClick={() => navigate('/ekonomi')}
        >
          <Coins className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          className="livskompass-hero__pill livskompass-hero__pill--wide"
          onClick={() => navigate('/mabra')}
        >
          personlig utveckling
        </button>
      </div>
    </section>
  );
}
