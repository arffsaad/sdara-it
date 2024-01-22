/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    fontFamily: {
      sans: ['"Rubik"', 'sans-serif']
    },
    extend: {
      transitionProperty: {
          'width': 'width'
      }
  },
  },
  plugins: [],
}