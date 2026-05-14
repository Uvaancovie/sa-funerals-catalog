/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        safs: {
          dark: '#0F2040',          /* Heritage Navy */
          gold: '#C5A059',          /* Brass / Gold */
          'gold-light': '#D4B06A',  /* Lighter brass for hover/accent */
          'gold-dark': '#A8873F',   /* Deeper brass for active states */
          light: '#F8F9FA'          /* Soft off-white backgrounds */
        }
      },
      fontFamily: {
        serif: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};
