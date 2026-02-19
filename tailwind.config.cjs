/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        safs: {
          dark: '#1a103c',
          gold: '#a89f6e',
          light: '#f8f9fa'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Lato', 'sans-serif']
      }
    }
  },
  plugins: []
};
