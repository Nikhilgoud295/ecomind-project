/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          50: '#f2fbf7',
          100: '#e1f6ed',
          500: '#10b981',
          700: '#047857',
          900: '#064e3b',
          950: '#022c22',
        },
        dark: {
          bg: '#0b1315',
          card: '#121e21',
          border: '#1e2e33',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-eco': '0 0 25px -5px rgba(34, 197, 94, 0.4)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
