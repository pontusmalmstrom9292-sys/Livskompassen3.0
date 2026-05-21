/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#020617',
        surface: {
          DEFAULT: '#0f172a',
          2: '#1e293b',
          3: '#334155',
        },
        text: {
          DEFAULT: '#F1F5F9',
          muted: '#94A3B8',
          dim: '#64748B',
        },
        accent: {
          DEFAULT: '#FDE68A',
          light: '#FEF3C7',
          secondary: '#818CF8',
          ai: '#6366F1',
        },
        success: '#2DD4BF',
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.10)',
        },
        warning: '#A16207',
        danger: '#DC2626',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'accent-glow': '0 0 24px rgba(253, 230, 138, 0.15)',
        'accent-glow-lg': '0 0 48px rgba(253, 230, 138, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
