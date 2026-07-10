import { clsx } from 'clsx';

export type DockZoneIconId =
  | 'anteckning'
  | 'familj'
  | 'hjartat'
  | 'inkast'
  | 'resurser'
  | 'valv'
  | 'planering';

type Props = {
  id: DockZoneIconId;
  className?: string;
};

const GOLD = 'currentColor';

/** Egna guldikoner för executive-dock — ersätter Lucide enligt kanon 2026-06-28. */
export function DockZoneIcon({ id, className }: Props) {
  const base = clsx('exec-dock-bar__glyph exec-dock-bar__glyph--kanon', className);

  switch (id) {
    case 'anteckning':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 18.5 16.2 8.3l2.8 2.8L8.8 21.3H6v-2.8Z"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 7 17.3 9.8"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M5 19.5h14"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      );
    case 'familj':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="9" cy="8.5" r="2.6" stroke={GOLD} strokeWidth="1.5" />
          <circle cx="15.5" cy="8.5" r="2.6" stroke={GOLD} strokeWidth="1.5" />
          <path
            d="M4.5 18.5c.8-3 2.8-4.5 4.5-4.5s3.7 1.5 4.5 4.5M12 14c1.7 0 3.7 1.5 4.5 4.5"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'hjartat':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 19.5V9.5l7-5.5 7 5.5v10"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M9 19.5v-6h6v6" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M5 9.5h14" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case 'inkast':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 8.5h14l-2 9.5H7L5 8.5Z"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 8.5V6.5c0-1 .8-1.8 1.8-1.8h1.9c1 0 1.8.8 1.8 1.8v2"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M12 11.5v4" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 13.5h4" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'resurser':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="5" y="5" width="6.5" height="6.5" rx="1.2" stroke={GOLD} strokeWidth="1.5" />
          <rect x="12.5" y="5" width="6.5" height="6.5" rx="1.2" stroke={GOLD} strokeWidth="1.5" />
          <rect x="5" y="12.5" width="6.5" height="6.5" rx="1.2" stroke={GOLD} strokeWidth="1.5" />
          <rect x="12.5" y="12.5" width="6.5" height="6.5" rx="1.2" stroke={GOLD} strokeWidth="1.5" />
        </svg>
      );
    case 'valv':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="5.5" y="10" width="13" height="9.5" rx="1.5" stroke={GOLD} strokeWidth="1.5" />
          <path
            d="M8.5 10V8.2a3.5 3.5 0 0 1 7 0V10"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="14.8" r="1.3" fill={GOLD} />
        </svg>
      );
    case 'planering':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="5" y="6" width="14" height="13" rx="1.5" stroke={GOLD} strokeWidth="1.5" />
          <path d="M8 4.5v3M16 4.5v3" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5 10h14" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M9 13.5h2.2M9 16.5h6" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
