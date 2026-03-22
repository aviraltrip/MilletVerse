/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#2D6A4F',  // deep forest green
        secondary: '#40916C',  // medium green
        accent:    '#D4A017',  // warm ochre / turmeric
        earth:     '#8B5E3C',  // earthy brown
        cream:     '#FDF6EC',  // warm off-white background
        muted:     '#74C69D',  // soft mint
        danger:    '#E63946',  // GI danger zone red
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
