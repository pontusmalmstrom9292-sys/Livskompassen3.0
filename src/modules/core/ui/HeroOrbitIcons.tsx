type IconProps = { className?: string };

/** L1 — embossade guldikoner endast i hem-kompassen (HOME-HERO-KANON). */

export function HeroRutinerIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.6" />
      <path
        d="M11 16.5 L14.2 19.2 L21 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10 h12 M10 22 h8"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path d="M16 7 L16.8 13 L16 14.5 L15.2 13 Z" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
}

export function HeroEkonomiIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 6 v20" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.75" />
      <path
        d="M10 11 h12 M10 21 h12"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <ellipse cx="11" cy="13" rx="4" ry="2.2" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="21" cy="19" rx="4" ry="2.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="21" cy="13" r="2.2" fill="currentColor" fillOpacity="0.75" />
      <circle cx="11" cy="19" r="2.2" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
}

export function HeroUtvecklingIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 24 Q16 14 16 10 Q16 6 13 8 Q11 10 12 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M16 24 Q16 14 20 10 Q23 7 21 12 Q19 15 17 17"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path d="M16 24 L16 26" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="13" cy="9" rx="2.5" ry="1.4" fill="currentColor" fillOpacity="0.5" />
      <ellipse cx="21" cy="11" rx="2.2" ry="1.2" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
}

/** Kunskap — öppen bok med kompassros (samma språk som LivskompassMark). */
export function HeroKunskapIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M8 8 h7 v16 H8 Q6 24 6 16 Q6 8 8 8 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path
        d="M24 8 h-7 v16 h7 Q26 24 26 16 Q26 8 24 8 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M15.5 8 v16" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
      <circle cx="20.5" cy="16" r="5.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.5" />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="20.5"
          y1="11.8"
          x2="20.5"
          y2="12.8"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="0.5"
          transform={`rotate(${deg} 20.5 16)`}
        />
      ))}
      <path d="M20.5 12.8 L21.1 15.2 L20.5 16 L19.9 15.2 Z" fill="currentColor" fillOpacity="0.9" />
      <path d="M20.5 19.2 L19.9 17 L20.5 16 L21.1 17 Z" fill="currentColor" fillOpacity="0.28" />
      <path d="M15.8 16 L18.2 15.4 L20.5 16 L18.2 16.6 Z" fill="currentColor" fillOpacity="0.22" />
      <path d="M25.2 16 L22.8 16.6 L20.5 16 L22.8 15.4 Z" fill="currentColor" fillOpacity="0.22" />
      <circle cx="20.5" cy="16" r="0.9" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}

export const HERO_ORBIT_ICONS = {
  rutiner: HeroRutinerIcon,
  ekonomi: HeroEkonomiIcon,
  mabra: HeroUtvecklingIcon,
  kunskap: HeroKunskapIcon,
} as const;
