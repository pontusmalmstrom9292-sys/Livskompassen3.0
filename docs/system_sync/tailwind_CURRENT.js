/** @type {import('tailwindcss').Config} */

/** CSS-variabel med Tailwind-opacity (/80, /30 …) via color-mix. */
function cssVar(name) {
  return ({ opacityValue }) =>
    opacityValue === undefined
      ? `var(${name})`
      : `color-mix(in srgb, var(${name}) calc(${opacityValue} * 100%), transparent)`;
}

/** Executive Midnight — emerald/indigo/purple → guld/skiffer (ingen neon). */
const executiveGoldScale = {
  300: cssVar('--accent-light'),
  400: cssVar('--accent'),
  500: cssVar('--accent'),
  600: cssVar('--accent-secondary'),
};

const executiveMutedScale = {
  300: cssVar('--text-muted'),
  400: cssVar('--text-muted'),
  500: cssVar('--text-dim'),
};

export default {
  content: ['./index.html', './src/index.css', './src/design-system/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['font-display-serif'],
  theme: {
    extend: {
      colors: {
        'obsidian-bg': '#020617',
        'obsidian-gold': '#FDE68A',
        'obsidian-indigo': '#c9a66b',
        bg: cssVar('--bg'),
        surface: {
          DEFAULT: cssVar('--surface'), /* #050b14 */
          primary: cssVar('--surface'), /* alias — bg-surface-primary */
          2: cssVar('--surface-2'), /* #09111e */
          3: cssVar('--surface-3'), /* #111b2d */
        },
        text: {
          DEFAULT: cssVar('--text'), /* #f8fafc */
          muted: cssVar('--text-muted'), /* #94a3b8 */
          dim: cssVar('--text-dim'), /* #64748b */
        },
        accent: {
          DEFAULT: cssVar('--accent'), /* #d4af37 (Guld) */
          light: cssVar('--accent-light'), /* #fde68a (Ljust guld) */
          secondary: cssVar('--accent-secondary'), /* Brons/guld */
          ai: cssVar('--accent-ai'), /* Guld — ej neon */
        },
        success: cssVar('--success'), /* Guld — ej grön neon */
        warning: cssVar('--warning'), /* #f59e0b */
        danger: cssVar('--danger'), /* #ef4444 */
        emerald: executiveMutedScale,
        indigo: executiveGoldScale,
        purple: executiveGoldScale,
        border: {
          DEFAULT: cssVar('--border'), /* rgba(212, 175, 55, 0.12) */
          strong: cssVar('--border-strong'), /* Guld alpha */
          'glass-border': cssVar('--glass-border'),
        },
      },
      fontFamily: {
        display: ['var(--ds-font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        'display-serif': ['var(--ds-font-chrome)', 'Cinzel', 'Outfit', 'serif'],
        sans: ['var(--ds-font-body)', 'Inter', 'sans-serif'],
        mono: ['var(--ds-font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'ds-sm': 'var(--ds-radius-sm)',
        'ds-md': 'var(--ds-radius-md)',
        'ds-lg': 'var(--ds-radius-lg)',
        'ds-xl': 'var(--ds-radius-xl)',
        'ds-2xl': 'var(--ds-radius-2xl)',
        'ds-card': 'var(--ds-radius-card)',
        'ds-dock': 'var(--ds-radius-dock)',
        'ds-pill': 'var(--ds-radius-pill)',
      },
      spacing: {
        'ds-touch': 'var(--ds-touch-target)',
        'ds-dock-clearance': 'var(--ds-space-dock-clearance)',
      },
      boxShadow: {
        'accent-glow': 'var(--ds-shadow-accent-glow)',
        'accent-glow-lg': 'var(--ds-shadow-accent-glow-lg)',
        'ds-sm': 'var(--ds-shadow-sm)',
        'ds-md': 'var(--ds-shadow-md)',
        'ds-lg': 'var(--ds-shadow-lg)',
        'ds-xl': 'var(--ds-shadow-xl)',
        'indigo-glow': '0 0 20px rgba(212, 175, 55, 0.12)',
      },
      transitionDuration: {
        'ds-fast': 'var(--ds-duration-fast)',
        'ds-normal': 'var(--ds-duration-normal)',
        'ds-morph': 'var(--ds-duration-morph)',
        'ds-slow': 'var(--ds-duration-slow)',
      },
      transitionTimingFunction: {
        'ds-premium': 'var(--ds-ease-premium)',
        'ds-enter': 'var(--ds-ease-enter)',
      },
      fontSize: {
        'hub-title': ['1.25rem', { lineHeight: '1.35', fontWeight: '300' }],
        eyebrow: ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.24em' }],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
