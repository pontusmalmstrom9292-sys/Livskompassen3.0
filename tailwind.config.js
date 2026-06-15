/** @type {import('tailwindcss').Config} */

/** CSS-variabel med Tailwind-opacity (/80, /30 …) via color-mix. */
function cssVar(name) {
  return ({ opacityValue }) =>
    opacityValue === undefined
      ? `var(${name})`
      : `color-mix(in srgb, var(${name}) calc(${opacityValue} * 100%), transparent)`;
}

export default {
  content: ['./index.html', './src/index.css', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['font-display-serif'],
  theme: {
    extend: {
      colors: {
        'obsidian-bg': '#020617',
        'obsidian-gold': '#FDE68A',
        'obsidian-indigo': '#818CF8',
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
          secondary: cssVar('--accent-secondary'), /* #6366f1 (Indigo) */
          ai: cssVar('--accent-ai'), /* #818cf8 (AI/Neon) */
        },
        success: cssVar('--success'), /* #10b981 */
        warning: cssVar('--warning'), /* #f59e0b */
        danger: cssVar('--danger'), /* #ef4444 */
        border: {
          DEFAULT: cssVar('--border'), /* rgba(212, 175, 55, 0.12) */
          strong: cssVar('--border-strong'), /* rgba(99, 102, 241, 0.22) */
          'glass-border': cssVar('--glass-border'),
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        'display-serif': ['Cinzel', 'Outfit', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hub-title': ['1.25rem', { lineHeight: '1.35', fontWeight: '300' }],
        eyebrow: ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.24em' }],
      },
      boxShadow: {
        'accent-glow': '0 0 16px var(--accent-glow)',
        'accent-glow-lg': '0 0 32px var(--accent-glow)',
        'indigo-glow': '0 0 20px rgba(99, 102, 241, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
