/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        safs: {
          dark: '#1a103c',
          gold: '#8a7a3b',
          'gold-light': '#c9b56b',
          'gold-dark': '#6f5a2a',
          light: '#f8f9fa'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};
