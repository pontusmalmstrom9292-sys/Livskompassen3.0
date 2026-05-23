/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a1614',
        surface: {
          DEFAULT: '#0f1a18',
          2: '#142220',
          3: '#1a2b28',
        },
        text: {
          DEFAULT: '#f5f0e8',
          muted: '#c4bdb4',
          dim: '#a8a29e',
        },
        accent: {
          DEFAULT: '#d4af37',
          light: '#e8d48a',
          secondary: '#f59e0b',
          ai: '#d4af37',
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
        'accent-glow': '0 0 24px rgba(212, 175, 55, 0.18)',
        'accent-glow-lg': '0 0 48px rgba(212, 175, 55, 0.18)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
