import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 80px rgba(59,130,246,0.18)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(59,130,246,0.25), transparent 45%)'
      },
      colors: {
        surface: 'rgba(var(--surface-rgb) / <alpha-value>)',
        border: 'rgba(var(--border-rgb) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
