import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',
        foreground: '#F2EEE8',
        card: '#141414',
        secondary: '#202020',
        muted: '#A4A4A4',
        primary: '#FF6A00',
        'primary-hover': '#D95400',
        border: '#303030',
        destructive: '#FDA4AF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Bahnschrift', 'DIN Alternate', 'Arial Narrow', 'sans-serif'],
      },
      boxShadow: { industrial: '0 24px 90px rgb(0 0 0 / 0.4)' },
    },
  },
  plugins: [],
} satisfies Config;
