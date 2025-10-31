/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        'montserrat': ['"Montserrat"', 'sans-serif'],
        'roboto-mono': ['"Roboto Mono"', 'monospace'],
        'inter': ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'in': 'slide-in-from-bottom 0.3s ease-out',
      },
    },
  },
  plugins: [],
} 