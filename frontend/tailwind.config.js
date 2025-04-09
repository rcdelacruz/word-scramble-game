/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#4f46e5',
        'game-secondary': '#8b5cf6',
        'game-accent': '#06b6d4'
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite'
      }
    },
  },
  plugins: [],
}
